const mongoose = require('mongoose');

const favoriteSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'User',
    },
    tmdbId: {
      type: Number,
      required: true,
    },
    title: {
      type: String,
      required: true,
    },
    posterPath: {
      type: String,
    },
    mediaType: {
      type: String,
      required: true,
      enum: ['movie', 'tv'],
    },
    releaseDate: {
      type: String,
    },
    voteAverage: {
      type: Number,
    },
  },
  {
    timestamps: true,
  }
);

// Prevent duplicate favorites for the same user and media
favoriteSchema.index({ user: 1, tmdbId: 1 }, { unique: true });

module.exports = mongoose.model('Favorite', favoriteSchema);
