const tmdbFetch = require('../utils/tmdbFetch');

// @desc    Get trending movies/tv shows
// @route   GET /api/tmdb/trending/:mediaType/:timeWindow
const getTrending = async (req, res, next) => {
  try {
    const { mediaType, timeWindow } = req.params;
    const { page } = req.query;
    const { data } = await tmdbFetch.get(`/trending/${mediaType}/${timeWindow}`, {
      params: { page },
    });
    res.json(data);
  } catch (error) {
    next(error);
  }
};

// @desc    Multi-search (movies, tv, people)
// @route   GET /api/tmdb/search/multi
const searchMulti = async (req, res, next) => {
  try {
    const { query, page } = req.query;
    if (!query) {
      res.status(400);
      throw new Error('Search query is required');
    }
    const { data } = await tmdbFetch.get('/search/multi', {
      params: { query, page },
    });
    res.json(data);
  } catch (error) {
    next(error);
  }
};

// @desc    Get movie details
// @route   GET /api/tmdb/movie/:id
const getMovieDetails = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { data } = await tmdbFetch.get(`/movie/${id}`);
    res.json(data);
  } catch (error) {
    next(error);
  }
};

// @desc    Get tv show details
// @route   GET /api/tmdb/tv/:id
const getTvDetails = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { data } = await tmdbFetch.get(`/tv/${id}`);
    res.json(data);
  } catch (error) {
    next(error);
  }
};

// @desc    Get videos for movie or tv
// @route   GET /api/tmdb/:mediaType/:id/videos
const getVideos = async (req, res, next) => {
  try {
    const { mediaType, id } = req.params;
    const { data } = await tmdbFetch.get(`/${mediaType}/${id}/videos`);
    res.json(data);
  } catch (error) {
    next(error);
  }
};

// @desc    Get tv season details
// @route   GET /api/tmdb/tv/:id/season/:seasonNum
const getTvSeasonDetails = async (req, res, next) => {
  try {
    const { id, seasonNum } = req.params;
    const { data } = await tmdbFetch.get(`/tv/${id}/season/${seasonNum}`);
    res.json(data);
  } catch (error) {
    next(error);
  }
};

// @desc    Discover movies/tv shows (supports all TMDB discover params)
// @route   GET /api/tmdb/discover/:mediaType
const discover = async (req, res, next) => {
  try {
    const { mediaType } = req.params;
    const { data } = await tmdbFetch.get(`/discover/${mediaType}`, {
      params: req.query,
    });
    res.json(data);
  } catch (error) {
    next(error);
  }
};

// @desc    Get list (popular, top_rated, now_playing, etc.)
// @route   GET /api/tmdb/:mediaType/:listType
const getList = async (req, res, next) => {
  try {
    const { mediaType, listType } = req.params;
    const { data } = await tmdbFetch.get(`/${mediaType}/${listType}`, {
      params: req.query,
    });
    res.json(data);
  } catch (error) {
    next(error);
  }
};

// @desc    Get credits (cast & crew) for movie or TV
// @route   GET /api/tmdb/:mediaType/:id/credits
const getCredits = async (req, res, next) => {
  try {
    const { mediaType, id } = req.params;
    const { data } = await tmdbFetch.get(`/${mediaType}/${id}/credits`);
    res.json(data);
  } catch (error) {
    next(error);
  }
};

// @desc    Get person details
// @route   GET /api/tmdb/person/:id
const getPersonDetails = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { data } = await tmdbFetch.get(`/person/${id}`, {
      params: { append_to_response: 'external_ids,combined_credits' }
    });
    res.json(data);
  } catch (error) {
    next(error);
  }
};

// @desc    Get person combined credits (movies & tv)
// @route   GET /api/tmdb/person/:id/combined_credits
const getPersonCredits = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { data } = await tmdbFetch.get(`/person/${id}/combined_credits`);
    res.json(data);
  } catch (error) {
    next(error);
  }
};
// @desc    Get content recommendations
// @route   GET /api/tmdb/:mediaType/:id/recommendations
const getRecommendations = async (req, res, next) => {
  try {
    const { mediaType, id } = req.params;
    const { page } = req.query;
    const { data } = await tmdbFetch.get(`/${mediaType}/${id}/recommendations`, {
      params: { page },
    });
    res.json(data);
  } catch (error) {
    next(error);
  }
};

// @desc    Get similar movies/tv shows
// @route   GET /api/tmdb/:mediaType/:id/similar
const getSimilar = async (req, res, next) => {
  try {
    const { mediaType, id } = req.params;
    const { page } = req.query;
    const { data } = await tmdbFetch.get(`/${mediaType}/${id}/similar`, {
      params: { page },
    });
    res.json(data);
  } catch (error) {
    next(error);
  }
};

module.exports = {
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
};
