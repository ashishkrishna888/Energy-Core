// src/controllers/deviceController.js
const Device = require('../models/Device');
const EnergyLog = require('../models/EnergyLog');
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
    const { name, category, location } = req.body;
    if (!name) {
      return res.status(400).json({ message: 'Device name is required' });
    }

    const device = await Device.create({
      userId: req.user._id,
      name,
      category: category || 'OTHER',
      location: location || 'Unknown',
      status: 'OFF',
      currentPowerKw: 0
    });

    res.status(201).json(device);
  } catch (error) {
    console.error('Create device error:', error.message);
    res.status(500).json({ message: 'Error creating device' });
  }
};

const toggleDevice = async (req, res) => {
  try {
    const device = await Device.findOne({ _id: req.params.id, userId: req.user._id });
    if (!device) {
      return res.status(404).json({ message: 'Device not found' });
    }

    const newStatus = device.status === 'ON' ? 'OFF' : 'ON';
    let newPowerKw = 0;

    if (newStatus === 'ON') {
      newPowerKw = getSimulatedPowerKw(device.category);
    }

    device.status = newStatus;
    device.currentPowerKw = newPowerKw;
    device.lastToggledAt = new Date();
    device.lastUpdatedAt = new Date();

    await device.save();

    const now = new Date();

    await EnergyLog.create({
      userId: req.user._id,
      deviceId: device._id,
      timestamp: now,
      powerKw: newPowerKw,
      energyKwh: newPowerKw, // MVP simplification
      day: getDayString(now),
      week: getWeekString(now)
    });

    res.json(device);
  } catch (error) {
    console.error('Toggle device error:', error.message);
    res.status(500).json({ message: 'Error toggling device' });
  }
};

module.exports = {
  getDevices,
  getDeviceById,
  createDevice,
  toggleDevice
};
