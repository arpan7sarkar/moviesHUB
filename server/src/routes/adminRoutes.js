const express = require('express');
const router = express.Router();

const { protect } = require('../middleware/authMiddleware');
const { admin } = require('../middleware/adminMiddleware');
const {
  getStats,
  getUsers,
  banUser,
  deleteUser,
  getMovies,
  createMovie,
  updateMovie,
  deleteMovie,
  getMovieById,
} = require('../controllers/adminController');

// All admin routes require authentication + admin role
router.use(protect);
router.use(admin);

// Dashboard stats
router.get('/stats', getStats);

// User management
router.get('/users', getUsers);
router.put('/users/:id/ban', banUser);
router.delete('/users/:id', deleteUser);

// Movie management
router.get('/movies', getMovies);
router.get('/movies/:id', getMovieById);
router.post('/movies', createMovie);
router.put('/movies/:id', updateMovie);
router.delete('/movies/:id', deleteMovie);

module.exports = router;
