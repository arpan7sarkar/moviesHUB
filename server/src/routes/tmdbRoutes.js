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
  getPersonDetails,
  getPersonCredits,
  getRecommendations,
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
router.get('/:mediaType/:id/recommendations', getRecommendations);

module.exports = router;
