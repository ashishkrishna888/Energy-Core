// src/models/Device.js
const mongoose = require('mongoose');

const deviceSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    name: {
      type: String,
      required: true,
      trim: true
    },
    category: {
      type: String,
      enum: ['HVAC', 'LIGHTING', 'WATER_HEATER', 'OTHER'],
      default: 'OTHER'
    },
    location: {
      type: String,
      default: 'Unknown'
    },
    status: {
      type: String,
      enum: ['ON', 'OFF'],
      default: 'OFF'
    },
    currentPowerKw: {
      type: Number,
      default: 0
    },
    lastToggledAt: {
      type: Date
    },
    lastUpdatedAt: {
      type: Date,
      default: Date.now
    },
    isSimulated: {
      type: Boolean,
      default: true
    },
    meta: {
      model: String,
      manufacturer: String
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model('Device', deviceSchema);
