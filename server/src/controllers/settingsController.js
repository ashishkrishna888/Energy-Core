// src/controllers/settingsController.js
const Settings = require('../models/Settings');

const getSettings = async (req, res) => {
  try {
    let settings = await Settings.findOne({ userId: req.user._id });

    // If no settings exist, create default settings
    if (!settings) {
      settings = await Settings.create({
        userId: req.user._id,
        energyLimit: 15,
        waterLimit: 100
      });
    }

    res.json({
      energyLimit: settings.energyLimit,
      waterLimit: settings.waterLimit
    });
  } catch (error) {
    console.error('Get settings error:', error.message);
    res.status(500).json({ message: 'Error fetching settings' });
  }
};

const updateSettings = async (req, res) => {
  try {
    const { energyLimit, waterLimit } = req.body;

    // Validate limits
    if (energyLimit !== undefined && (energyLimit < 5 || energyLimit > 50)) {
      return res.status(400).json({ message: 'Energy limit must be between 5 and 50 kWh' });
    }

    if (waterLimit !== undefined && (waterLimit < 50 || waterLimit > 200)) {
      return res.status(400).json({ message: 'Water limit must be between 50 and 200 L' });
    }

    // Find or create settings
    let settings = await Settings.findOne({ userId: req.user._id });

    if (!settings) {
      settings = await Settings.create({
        userId: req.user._id,
        energyLimit: energyLimit || 15,
        waterLimit: waterLimit || 100
      });
    } else {
      // Update only provided fields
      if (energyLimit !== undefined) {
        settings.energyLimit = energyLimit;
      }
      if (waterLimit !== undefined) {
        settings.waterLimit = waterLimit;
      }
      await settings.save();
    }

    res.json({
      energyLimit: settings.energyLimit,
      waterLimit: settings.waterLimit
    });
  } catch (error) {
    console.error('Update settings error:', error.message);
    res.status(500).json({ message: 'Error updating settings' });
  }
};

module.exports = {
  getSettings,
  updateSettings
};

