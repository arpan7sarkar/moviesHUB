const Favorite = require('../models/Favorite');
const Watchlist = require('../models/Watchlist');
const History = require('../models/History');

// @desc    Get favorites
// @route   GET /api/favorites
const getFavorites = async (req, res, next) => {
  try {
    const favorites = await Favorite.find({ user: req.user._id }).sort('-createdAt');
    res.json(favorites);
  } catch (error) {
    next(error);
  }
};

// @desc    Add to favorites
// @route   POST /api/favorites
const addToFavorites = async (req, res, next) => {
  try {
    const favorite = await Favorite.create({
      ...req.body,
      user: req.user._id,
    });
    res.status(201).json(favorite);
  } catch (error) {
    if (error.code === 11000) {
      res.status(400);
      return next(new Error('Already in favorites'));
    }
    next(error);
  }
};

// @desc    Remove from favorites
// @route   DELETE /api/favorites/:tmdbId
const removeFromFavorites = async (req, res, next) => {
  try {
    await Favorite.findOneAndDelete({
      user: req.user._id,
      tmdbId: req.params.tmdbId,
    });
    res.json({ message: 'Removed from favorites' });
  } catch (error) {
    next(error);
  }
};

// @desc    Get watchlist
// @route   GET /api/watchlist
const getWatchlist = async (req, res, next) => {
  try {
    const watchlist = await Watchlist.find({ user: req.user._id }).sort('-createdAt');
    res.json(watchlist);
  } catch (error) {
    next(error);
  }
};

// @desc    Add to watchlist
// @route   POST /api/watchlist
const addToWatchlist = async (req, res, next) => {
  try {
    const watchlist = await Watchlist.create({
      ...req.body,
      user: req.user._id,
    });
    res.status(201).json(watchlist);
  } catch (error) {
    if (error.code === 11000) {
      res.status(400);
      return next(new Error('Already in watchlist'));
    }
    next(error);
  }
};

// @desc    Remove from watchlist
// @route   DELETE /api/watchlist/:tmdbId
const removeFromWatchlist = async (req, res, next) => {
  try {
    await Watchlist.findOneAndDelete({
      user: req.user._id,
      tmdbId: req.params.tmdbId,
    });
    res.json({ message: 'Removed from watchlist' });
  } catch (error) {
    next(error);
  }
};

// @desc    Get history
// @route   GET /api/history
const getHistory = async (req, res, next) => {
  try {
    const history = await History.find({ user: req.user._id }).sort('-watchedAt');
    res.json(history);
  } catch (error) {
    next(error);
  }
};

// @desc    Add to history
// @route   POST /api/history
const addToHistory = async (req, res, next) => {
  try {
    // If already in history recently, update timestamp instead of creating new
    const existing = await History.findOne({
      user: req.user._id,
      tmdbId: req.body.tmdbId,
    });

    if (existing) {
      existing.watchedAt = Date.now();
      await existing.save();
      res.json(existing);
    } else {
      const history = await History.create({
        ...req.body,
        user: req.user._id,
      });
      res.status(201).json(history);
    }
  } catch (error) {
    next(error);
  }
};

// @desc    Clear all history
// @route   DELETE /api/history
const clearHistory = async (req, res, next) => {
  try {
    await History.deleteMany({ user: req.user._id });
    res.json({ message: 'History cleared' });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getFavorites,
  addToFavorites,
  removeFromFavorites,
  getWatchlist,
  addToWatchlist,
  removeFromWatchlist,
  getHistory,
  addToHistory,
  clearHistory,
};
