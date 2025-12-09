// src/models/EnergyLog.js
const mongoose = require('mongoose');

const energyLogSchema = new mongoose.Schema(
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
    powerKw: {
      type: Number,
      required: true
    },
    energyKwh: {
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

module.exports = mongoose.model('EnergyLog', energyLogSchema);
