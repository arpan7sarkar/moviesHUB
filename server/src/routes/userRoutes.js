const express = require('express');
const router = express.Router();
const {
  getFavorites,
  addToFavorites,
  removeFromFavorites,
  getWatchlist,
  addToWatchlist,
  removeFromWatchlist,
  getHistory,
  addToHistory,
  clearHistory,
} = require('../controllers/userController');
const { protect } = require('../middleware/authMiddleware');

// Favorites
router.route('/favorites').get(protect, getFavorites).post(protect, addToFavorites);
router.delete('/favorites/:tmdbId', protect, removeFromFavorites);

// Watchlist
router.route('/watchlist').get(protect, getWatchlist).post(protect, addToWatchlist);
router.delete('/watchlist/:tmdbId', protect, removeFromWatchlist);

// History
router.route('/history').get(protect, getHistory).post(protect, addToHistory).delete(protect, clearHistory);

module.exports = router;
