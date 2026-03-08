const express = require('express');
const router = express.Router();
const {
  getTrending,
  searchMulti,
  getMovieDetails,
  getTvDetails,
  getVideos,
  getTvSeasonDetails,
  discover,
  getList,
  getCredits,
  getPersonDetails,
  getPersonCredits,
  getRecommendations,
  getSimilar,
} = require('../controllers/tmdbController');

router.get('/trending/:mediaType/:timeWindow', getTrending);
router.get('/search/multi', searchMulti);
router.get('/movie/:id', getMovieDetails);
router.get('/tv/:id', getTvDetails);
router.get('/:mediaType/:id/videos', getVideos);
router.get('/tv/:id/season/:seasonNum', getTvSeasonDetails);
router.get('/discover/:mediaType', discover);
router.get('/person/:id', getPersonDetails);
router.get('/person/:id/combined_credits', getPersonCredits);
router.get('/:mediaType/:id/credits', getCredits);
router.get('/:mediaType/:id/recommendations', getRecommendations);
router.get('/:mediaType/:id/similar', getSimilar);

// Generic list route — MUST be last to avoid shadowing specific routes
router.get('/:mediaType/:listType', getList);

module.exports = router;
