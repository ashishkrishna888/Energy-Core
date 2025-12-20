// src/seed/clearHistory.js
// Clear all Energy and Water history logs
const mongoose = require('mongoose');
require('dotenv').config();
const User = require('../models/User');
const EnergyLog = require('../models/EnergyLog');
const WaterLog = require('../models/WaterLog');
const connectDB = require('../config/db');

const clearHistory = async () => {
  try {
    await connectDB();

    const user = await User.findOne();
    if (!user) {
      console.log("No user found! Please register first.");
      process.exit(1);
    }

    // Clear energy logs
    const energyDeleted = await EnergyLog.deleteMany({ userId: user._id });
    console.log(`✅ Deleted ${energyDeleted.deletedCount} energy log entries`);

    // Clear water logs
    const waterDeleted = await WaterLog.deleteMany({ userId: user._id });
    console.log(`✅ Deleted ${waterDeleted.deletedCount} water log entries`);

    console.log(`✅ History cleared for ${user.email}`);
    process.exit(0);
  } catch (error) {
    console.error("Clear history failed:", error.message);
    process.exit(1);
  }
};

clearHistory();



