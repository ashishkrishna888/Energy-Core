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
    type: {
      type: String,
      enum: ['energy', 'water'],
      default: 'energy'
    },
    consumption: {
      type: Number,
      default: 0.5 // kW for energy, L/min for water
    },
    isOn: {
      type: Boolean,
      default: false
    },
    isEco: {
      type: Boolean,
      default: false
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
    // Legacy fields for backward compatibility (computed on save)
    status: {
      type: String,
      enum: ['ON', 'OFF'],
      default: 'OFF'
    },
    currentPowerKw: {
      type: Number,
      default: 0
    },
    ecoMode: {
      type: Boolean,
      default: false
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

// Pre-save middleware to sync legacy fields with new fields
deviceSchema.pre('save', function(next) {
  // Sync status with isOn
  this.status = this.isOn ? 'ON' : 'OFF';
  
  // Sync ecoMode with isEco
  this.ecoMode = this.isEco;
  
  // Calculate currentPowerKw based on isOn and isEco
  if (this.isOn) {
    this.currentPowerKw = this.isEco ? this.consumption * 0.8 : this.consumption;
  } else {
    this.currentPowerKw = 0;
  }
  
  next();
});

module.exports = mongoose.model('Device', deviceSchema);
