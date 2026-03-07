const User = require('../models/User');
const jwt = require('jsonwebtoken');
const { generateToken, generateRefreshToken } = require('../utils/generateToken');

const registerUser = async (req, res, next) => {
  try {
    const { name, email, password } = req.body;

    // Check if user exists
    const userExists = await User.findOne({ email });

    if (userExists) {
      res.status(400);
      throw new Error('User already exists');
    }

    // Create user
    const user = await User.create({
      name,
      email,
      password,
    });

    if (user) {
      const accessToken = generateToken(user._id);
      const refreshToken = generateRefreshToken(user._id);

      // Set cookie for refresh token
      res.cookie('refreshToken', refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
      });

      res.status(201).json({
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        avatar: user.avatar,
        token: accessToken,
      });
    } else {
      res.status(400);
      throw new Error('Invalid user data');
    }
  } catch (error) {
    next(error);
  }
};

const loginUser = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    // Check for user email
    const user = await User.findOne({ email }).select('+password');

    if (user && (await user.comparePassword(password))) {
      const accessToken = generateToken(user._id);
      const refreshToken = generateRefreshToken(user._id);

      // Set cookie for refresh token
      res.cookie('refreshToken', refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
      });

      res.json({
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        avatar: user.avatar,
        token: accessToken,
      });
    } else {
      res.status(401);
      throw new Error('Invalid email or password');
    }
  } catch (error) {
    next(error);
  }
};

const logoutUser = async (req, res) => {
  res.cookie('refreshToken', '', {
    httpOnly: true,
    expires: new Date(0),
  });
  res.status(200).json({ message: 'Logged out successfully' });
};

// @desc    Refresh access token
// @route   POST /api/auth/refresh
// @access  Public
const refreshToken = async (req, res, next) => {
  try {
    const cookies = req.cookies;

    if (!cookies || !cookies.refreshToken) {
      res.status(401);
      throw new Error('No refresh token provided');
    }

    const refreshToken = cookies.refreshToken;

    // Verify refresh token
    jwt.verify(
      refreshToken,
      process.env.JWT_REFRESH_SECRET,
      async (err, decoded) => {
        if (err) {
          res.status(403);
          return next(new Error('Invalid or expired refresh token'));
        }

        const user = await User.findById(decoded.id);

        if (!user) {
          res.status(401);
          return next(new Error('User not found'));
        }

        const accessToken = generateToken(user._id);

        res.json({
          _id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
          avatar: user.avatar,
          token: accessToken,
        });
      }
    );
  } catch (error) {
    next(error);
  }
};

module.exports = {
  registerUser,
  loginUser,
  logoutUser,
  refreshToken,
};
