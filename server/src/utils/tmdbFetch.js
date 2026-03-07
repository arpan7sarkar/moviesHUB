const axios = require('axios');

const tmdbFetch = axios.create({
  baseURL: 'https://api.themoviedb.org/3',
  headers: {
    accept: 'application/json',
    Authorization: `Bearer ${process.env.TMDB_API_KEY}`,
  },
});

module.exports = tmdbFetch;
