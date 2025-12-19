// src/seed/seedHistory.js
// Generate 7 days of historical data for Energy and Water
const mongoose = require('mongoose');
require('dotenv').config();
const User = require('../models/User');
const Device = require('../models/Device');
const EnergyLog = require('../models/EnergyLog');
const WaterLog = require('../models/WaterLog');
const connectDB = require('../config/db');
const { getDayString, getWeekString } = require('../utils/dateUtils');

const seedHistory = async () => {
  try {
    await connectDB();

    const user = await User.findOne();
    if (!user) {
      console.log("No user found! Please register first.");
      process.exit(1);
    }

    const devices = await Device.find({ userId: user._id });
    if (devices.length === 0) {
      console.log("No devices found! Please seed devices first.");
      process.exit(1);
    }

    // Check if history already exists
    const existingEnergyLogs = await EnergyLog.countDocuments({ userId: user._id });
    const existingWaterLogs = await WaterLog.countDocuments({ userId: user._id });
    
    if (existingEnergyLogs > 0 || existingWaterLogs > 0) {
      console.log("History already exists. Skipping seeding.");
      return;
    }

    const energyDevices = devices.filter(d => d.type === 'energy');
    const waterDevices = devices.filter(d => d.type === 'water');

    // Generate 7 days of history
    const now = new Date();
    const historyLogs = [];

    for (let dayOffset = 6; dayOffset >= 0; dayOffset--) {
      const date = new Date(now);
      date.setDate(date.getDate() - dayOffset);
      date.setHours(Math.floor(Math.random() * 12) + 8, Math.floor(Math.random() * 60), 0, 0); // Random time between 8 AM - 8 PM

      const day = getDayString(date);
      const week = getWeekString(date);

      // Generate energy logs (simulate 3-5 device activations per day)
      const energyActivations = Math.floor(Math.random() * 3) + 3; // 3-5 activations
      for (let i = 0; i < energyActivations; i++) {
        const device = energyDevices[Math.floor(Math.random() * energyDevices.length)];
        if (device) {
          const powerKw = device.consumption || (0.5 + Math.random() * 2);
          const energyKwh = powerKw * (0.5 + Math.random() * 2); // 0.5-2.5 hours of usage

          historyLogs.push({
            userId: user._id,
            deviceId: device._id,
            timestamp: new Date(date.getTime() + i * 2 * 60 * 60 * 1000), // Spread across day
            powerKw: Number(powerKw.toFixed(2)),
            energyKwh: Number(energyKwh.toFixed(2)),
            day: day,
            week: week
          });
        }
      }

      // Generate water logs (simulate 2-4 activations per day)
      const waterActivations = Math.floor(Math.random() * 3) + 2; // 2-4 activations
      for (let i = 0; i < waterActivations; i++) {
        const device = waterDevices[Math.floor(Math.random() * waterDevices.length)];
        if (device) {
          const flowRateLpm = device.consumption || (5 + Math.random() * 10); // 5-15 L/min
          const totalLiters = flowRateLpm * (5 + Math.random() * 15); // 5-20 minutes of usage

          const logDate = new Date(date);
          logDate.setHours(10 + i * 3, Math.floor(Math.random() * 60), 0, 0); // Spread across day

          historyLogs.push({
            userId: user._id,
            deviceId: device._id,
            timestamp: logDate,
            flowRateLpm: Number(flowRateLpm.toFixed(2)),
            totalLiters: Number(totalLiters.toFixed(2)),
            day: day,
            week: week
          });
        }
      }
    }

    // Insert energy logs
    const energyLogs = historyLogs.filter(log => log.powerKw !== undefined);
    if (energyLogs.length > 0) {
      await EnergyLog.insertMany(energyLogs.map(({ powerKw, energyKwh, ...rest }) => ({
        ...rest,
        powerKw,
        energyKwh
      })));
      console.log(`✅ Seeded ${energyLogs.length} energy log entries`);
    }

    // Insert water logs
    const waterLogs = historyLogs.filter(log => log.flowRateLpm !== undefined);
    if (waterLogs.length > 0) {
      await WaterLog.insertMany(waterLogs.map(({ flowRateLpm, totalLiters, ...rest }) => ({
        ...rest,
        flowRateLpm,
        totalLiters
      })));
      console.log(`✅ Seeded ${waterLogs.length} water log entries`);
    }

    console.log(`✅ Successfully seeded 7 days of historical data for ${user.email}`);
    process.exit(0);
  } catch (error) {
    console.error("Seeding history failed:", error.message);
    process.exit(1);
  }
};

seedHistory();

