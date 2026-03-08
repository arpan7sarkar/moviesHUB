const User = require('../models/User');
const Movie = require('../models/Movie');
const Favorite = require('../models/Favorite');
const Watchlist = require('../models/Watchlist');
const History = require('../models/History');

// @desc    Get admin dashboard stats
// @route   GET /api/admin/stats
// @access  Private/Admin
const getStats = async (req, res) => {
  try {
    const [totalUsers, totalFavorites, totalWatchlist, totalHistory, recentUsers] =
      await Promise.all([
        User.countDocuments(),
        Favorite.countDocuments(),
        Watchlist.countDocuments(),
        History.countDocuments(),
        User.find()
          .sort({ createdAt: -1 })
          .limit(8)
          .select('name email role avatar createdAt'),
      ]);

    const recentFavorites = await Favorite.find()
      .sort({ createdAt: -1 })
      .limit(8)
      .populate('user', 'name avatar');

    res.json({
      stats: {
        totalUsers,
        totalFavorites,
        totalWatchlist,
        totalHistory,
      },
      recentUsers,
      recentFavorites,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get all users (paginated)
// @route   GET /api/admin/users
// @access  Private/Admin
const getUsers = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = 20;
    const skip = (page - 1) * limit;
    const search = req.query.search || '';

    const query = search
      ? {
          $or: [
            { name: { $regex: search, $options: 'i' } },
            { email: { $regex: search, $options: 'i' } },
          ],
        }
      : {};

    const [users, total] = await Promise.all([
      User.find(query).sort({ createdAt: -1 }).skip(skip).limit(limit).select('-password'),
      User.countDocuments(query),
    ]);

    res.json({
      users,
      page,
      totalPages: Math.ceil(total / limit),
      total,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Ban/Unban a user
// @route   PUT /api/admin/users/:id/ban
// @access  Private/Admin
const banUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    if (user.role === 'admin') {
      return res.status(400).json({ message: 'Cannot ban an admin' });
    }

    // Toggle banned status
    user.banned = !user.banned;
    await user.save();

    res.json({ message: `User ${user.banned ? 'banned' : 'unbanned'} successfully`, user });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Delete a user
// @route   DELETE /api/admin/users/:id
// @access  Private/Admin
const deleteUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    if (user.role === 'admin') {
      return res.status(400).json({ message: 'Cannot delete an admin' });
    }

    // Clean up user data
    await Promise.all([
      Favorite.deleteMany({ user: user._id }),
      Watchlist.deleteMany({ user: user._id }),
      History.deleteMany({ user: user._id }),
      User.findByIdAndDelete(user._id),
    ]);

    res.json({ message: 'User and associated data deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ═══════════════════════════════════════
// MOVIE MANAGEMENT
// ═══════════════════════════════════════

// @desc    Get all movies (paginated + search)
// @route   GET /api/admin/movies
// @access  Private/Admin
const getMovies = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = 20;
    const skip = (page - 1) * limit;
    const search = req.query.search || '';
    const category = req.query.category || '';

    const query = {};
    if (search) {
      query.title = { $regex: search, $options: 'i' };
    }
    if (category) {
      query.category = category;
    }

    const [movies, total] = await Promise.all([
      Movie.find(query)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .populate('addedBy', 'name'),
      Movie.countDocuments(query),
    ]);

    res.json({
      movies,
      page,
      totalPages: Math.ceil(total / limit),
      total,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Create a movie
// @route   POST /api/admin/movies
// @access  Private/Admin
const createMovie = async (req, res) => {
  try {
    const { tmdbId, title, posterPath, description, releaseDate, genres, category, trailerUrl, voteAverage } = req.body;

    const existingMovie = await Movie.findOne({ tmdbId });
    if (existingMovie) {
      return res.status(400).json({ message: 'A movie with this TMDB ID already exists' });
    }

    const movie = await Movie.create({
      tmdbId,
      title,
      posterPath,
      description,
      releaseDate,
      genres,
      category,
      trailerUrl,
      voteAverage,
      addedBy: req.user._id,
    });

    res.status(201).json(movie);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update a movie
// @route   PUT /api/admin/movies/:id
// @access  Private/Admin
const updateMovie = async (req, res) => {
  try {
    const movie = await Movie.findById(req.params.id);

    if (!movie) {
      return res.status(404).json({ message: 'Movie not found' });
    }

    const updatedMovie = await Movie.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    res.json(updatedMovie);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Delete a movie
// @route   DELETE /api/admin/movies/:id
// @access  Private/Admin
const deleteMovie = async (req, res) => {
  try {
    const movie = await Movie.findById(req.params.id);

    if (!movie) {
      return res.status(404).json({ message: 'Movie not found' });
    }

    await Movie.findByIdAndDelete(req.params.id);
    res.json({ message: 'Movie deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get a single movie by ID
// @route   GET /api/admin/movies/:id
// @access  Private/Admin
const getMovieById = async (req, res) => {
  try {
    const movie = await Movie.findById(req.params.id).populate('addedBy', 'name');

    if (!movie) {
      return res.status(404).json({ message: 'Movie not found' });
    }

    res.json(movie);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getStats,
  getUsers,
  banUser,
  deleteUser,
  getMovies,
  createMovie,
  updateMovie,
  deleteMovie,
  getMovieById,
};
