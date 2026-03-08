const mongoose = require('mongoose');

const movieSchema = new mongoose.Schema(
  {
    tmdbId: {
      type: Number,
      required: [true, 'Please add a TMDB Movie ID'],
      unique: true,
    },
    title: {
      type: String,
      required: [true, 'Please add a title'],
    },
    posterPath: {
      type: String,
    },
    description: {
      type: String,
    },
    releaseDate: {
      type: String,
    },
    genres: [
      {
        type: String,
      },
    ],
    category: {
      type: String,
      enum: ['featured', 'trending', 'popular', 'top_rated', 'upcoming', 'general'],
      default: 'general',
    },
    trailerUrl: {
      type: String,
    },
    voteAverage: {
      type: Number,
    },
    addedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Movie', movieSchema);
