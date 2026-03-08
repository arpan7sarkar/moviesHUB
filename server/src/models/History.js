const mongoose = require('mongoose');

const historySchema = new mongoose.Schema(
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
    watchedAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

// Note: We don't use unique index for history as a user can watch something multiple times, 
// though we usually just update the timestamp.

module.exports = mongoose.model('History', historySchema);
