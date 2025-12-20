// src/controllers/deviceController.js
const Device = require('../models/Device');
const EnergyLog = require('../models/EnergyLog');
const WaterLog = require('../models/WaterLog');
const { getDayString, getWeekString } = require('../utils/dateUtils');

// Helper: simulate power usage based on category
const getSimulatedPowerKw = (category) => {
  switch (category) {
    case 'HVAC':
      return Number((1.5 + Math.random() * 2.5).toFixed(2)); // 1.5 - 4.0
    case 'LIGHTING':
      return Number((0.05 + Math.random() * 0.25).toFixed(2)); // 0.05 - 0.30
    case 'WATER_HEATER':
      return Number((2 + Math.random() * 3).toFixed(2)); // 2 - 5
    default:
      return Number((0.1 + Math.random()).toFixed(2)); // 0.1 - 1.1
  }
};

const getDevices = async (req, res) => {
  try {
    const devices = await Device.find({ userId: req.user._id }).sort({ createdAt: 1 });
    res.json(devices);
  } catch (error) {
    console.error('Get devices error:', error.message);
    res.status(500).json({ message: 'Error fetching devices' });
  }
};

const getDeviceById = async (req, res) => {
  try {
    const device = await Device.findOne({ _id: req.params.id, userId: req.user._id });
    if (!device) {
      return res.status(404).json({ message: 'Device not found' });
    }
    res.json(device);
  } catch (error) {
    console.error('Get device error:', error.message);
    res.status(500).json({ message: 'Error fetching device' });
  }
};

const createDevice = async (req, res) => {
  try {
    const { name, type, consumption, category, location } = req.body;
    if (!name) {
      return res.status(400).json({ message: 'Device name is required' });
    }

    // Set defaults based on type
    const deviceType = type || 'energy';
    const defaultConsumption = consumption || (deviceType === 'water' ? 8.5 : 0.5);
    const defaultCategory = category || 'OTHER';

    const device = await Device.create({
      userId: req.user._id,
      name,
      type: deviceType,
      consumption: defaultConsumption,
      category: defaultCategory,
      location: location || 'Unknown',
      isOn: false,
      isEco: false,
      status: 'OFF',
      currentPowerKw: 0
    });

    res.status(201).json(device);
  } catch (error) {
    console.error('Create device error:', error.message);
    res.status(500).json({ message: 'Error creating device' });
  }
};

const deleteDevice = async (req, res) => {
  try {
    const device = await Device.findOne({ _id: req.params.id, userId: req.user._id });
    if (!device) {
      return res.status(404).json({ message: 'Device not found' });
    }

    await Device.deleteOne({ _id: req.params.id, userId: req.user._id });
    res.json({ message: 'Device deleted successfully' });
  } catch (error) {
    console.error('Delete device error:', error.message);
    res.status(500).json({ message: 'Error deleting device' });
  }
};

const toggleDevice = async (req, res) => {
  try {
    const device = await Device.findOne({ _id: req.params.id, userId: req.user._id });
    if (!device) {
      return res.status(404).json({ message: 'Device not found' });
    }

    // Toggle isOn
    device.isOn = !device.isOn;
    device.lastToggledAt = new Date();
    device.lastUpdatedAt = new Date();

    // Update legacy status field for backward compatibility
    device.status = device.isOn ? 'ON' : 'OFF';

    await device.save();

    // Log usage if device is turned ON
    if (device.isOn) {
      const now = new Date();
      
      if (device.type === 'energy') {
        // Log energy usage
        const powerKw = device.currentPowerKw; // Uses calculated power from pre-save middleware

        await EnergyLog.create({
          userId: req.user._id,
          deviceId: device._id,
          timestamp: now,
          powerKw: powerKw,
          energyKwh: powerKw,
          day: getDayString(now),
          week: getWeekString(now)
        });
      } else if (device.type === 'water') {
        // Log water usage
        const flowRateLpm = device.consumption || 8.5; // Liters per minute
        const totalLiters = flowRateLpm; // For simplicity, log 1 minute of usage

        await WaterLog.create({
          userId: req.user._id,
          deviceId: device._id,
          timestamp: now,
          flowRateLpm: flowRateLpm,
          totalLiters: totalLiters,
          day: getDayString(now),
          week: getWeekString(now)
        });
      }
    }

    res.json(device);
  } catch (error) {
    console.error('Toggle device error:', error.message);
    console.error('Full error stack:', error.stack);
    console.error('Error details:', {
      deviceId: req.params.id,
      userId: req.user?._id,
      errorName: error.name,
      errorMessage: error.message
    });
    res.status(500).json({ 
      message: 'Error toggling device',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

const toggleEco = async (req, res) => {
  try {
    const device = await Device.findOne({ _id: req.params.id, userId: req.user._id });
    if (!device) {
      return res.status(404).json({ message: 'Device not found' });
    }

    // Toggle isEco
    device.isEco = !device.isEco;
    device.lastUpdatedAt = new Date();

    // Update legacy ecoMode field for backward compatibility
    device.ecoMode = device.isEco;

    await device.save();

    res.json(device);
  } catch (error) {
    console.error('Toggle eco mode error:', error.message);
    res.status(500).json({ message: 'Error toggling eco mode' });
  }
};

const seedDevices = async (req, res) => {
  try {
    const userId = req.user._id;
    
    // Check if user already has devices
    const existingDevices = await Device.find({ userId });
    if (existingDevices.length > 0) {
      return res.json({ 
        message: 'Devices already exist', 
        count: existingDevices.length,
        devices: existingDevices 
      });
    }

    // Create 5 default devices
    const defaultDevices = [
      {
        userId,
        name: 'Living Room AC',
        type: 'energy',
        consumption: 2.5,
        isOn: false,
        isEco: false,
        category: 'HVAC',
        location: 'Living Room'
      },
      {
        userId,
        name: 'Kitchen Lights',
        type: 'energy',
        consumption: 0.3,
        isOn: true,
        isEco: false,
        category: 'LIGHTING',
        location: 'Kitchen'
      },
      {
        userId,
        name: 'Water Heater',
        type: 'energy',
        consumption: 3.0,
        isOn: false,
        isEco: false,
        category: 'WATER_HEATER',
        location: 'Basement'
      },
      {
        userId,
        name: 'Garden Sprinkler',
        type: 'water',
        consumption: 8.5, // L/min
        isOn: false,
        isEco: false,
        category: 'OTHER',
        location: 'Garden'
      },
      {
        userId,
        name: 'Bedroom Fan',
        type: 'energy',
        consumption: 0.1,
        isOn: true,
        isEco: true,
        category: 'HVAC',
        location: 'Bedroom'
      }
    ];

    const createdDevices = await Device.insertMany(defaultDevices);

    res.status(201).json({ 
      message: 'Devices seeded successfully', 
      count: createdDevices.length,
      devices: createdDevices 
    });
  } catch (error) {
    console.error('Seed devices error:', error.message);
    res.status(500).json({ message: 'Error seeding devices' });
  }
};

const getWaterHistory = async (req, res) => {
  try {
    const range = req.query.range === 'weekly' ? 'weekly' : 'daily';
    const userId = req.user._id;

    if (range === 'daily') {
      const now = new Date();
      const start = new Date();
      start.setDate(now.getDate() - 6); // last 7 days

      const results = await WaterLog.aggregate([
        {
          $match: {
            userId,
            timestamp: { $gte: start, $lte: now }
          }
        },
        {
          $group: {
            _id: '$day',
            totalLiters: { $sum: '$totalLiters' }
          }
        },
        { $sort: { _id: 1 } }
      ]);

      const points = results.map((item) => ({
        label: item._id,
        totalLiters: Number(item.totalLiters.toFixed(2))
      }));

      return res.json({ range: 'daily', points });
    }

    // weekly
    const results = await WaterLog.aggregate([
      {
        $match: {
          userId
        }
      },
      {
        $group: {
          _id: '$week',
          totalLiters: { $sum: '$totalLiters' }
        }
      },
      { $sort: { _id: 1 } }
    ]);

    const points = results
      .filter((r) => r._id)
      .map((item) => ({
        label: item._id,
        totalLiters: Number(item.totalLiters.toFixed(2))
      }));

    res.json({ range: 'weekly', points });
  } catch (error) {
    console.error('Water history error:', error.message);
    res.status(500).json({ message: 'Error fetching water history' });
  }
};

module.exports = {
  getDevices,
  getDeviceById,
  createDevice,
  deleteDevice,
  toggleDevice,
  toggleEco,
  seedDevices,
  getWaterHistory
};
