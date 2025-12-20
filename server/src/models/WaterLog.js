// src/models/WaterLog.js
const mongoose = require('mongoose');

const waterLogSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    deviceId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Device',
      required: true
    },
    timestamp: {
      type: Date,
      default: Date.now
    },
    flowRateLpm: {
      type: Number, // Liters per minute
      required: true
    },
    totalLiters: {
      type: Number,
      default: 0
    },
    day: {
      type: String, // "YYYY-MM-DD"
      required: true
    },
    week: {
      type: String // "YYYY-Wxx"
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model('WaterLog', waterLogSchema);






