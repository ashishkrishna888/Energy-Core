// src/models/Settings.js
const mongoose = require('mongoose');

const settingsSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      unique: true
    },
    energyLimit: {
      type: Number,
      default: 15,
      min: 5,
      max: 50
    },
    waterLimit: {
      type: Number,
      default: 100,
      min: 50,
      max: 200
    }
  },
  { timestamps: true }
);

// Ensure one settings document per user
settingsSchema.index({ userId: 1 }, { unique: true });

module.exports = mongoose.model('Settings', settingsSchema);







