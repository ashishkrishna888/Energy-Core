// src/seed/clearTodayEnergy.js
// Clear today's Energy logs only
const mongoose = require('mongoose');
require('dotenv').config();
const User = require('../models/User');
const EnergyLog = require('../models/EnergyLog');
const { getDayString } = require('../utils/dateUtils');
const connectDB = require('../config/db');

const clearTodayEnergy = async () => {
  try {
    await connectDB();

    const user = await User.findOne();
    if (!user) {
      console.log("No user found! Please register first.");
      process.exit(1);
    }

    // Get today's date string (YYYY-MM-DD)
    const today = getDayString(new Date());
    console.log(`🗑️  Clearing energy logs for today: ${today}`);

    // Clear energy logs for today only
    const result = await EnergyLog.deleteMany({ 
      userId: user._id,
      day: today 
    });

    console.log(`✅ Deleted ${result.deletedCount} energy log entries for today (${today})`);
    console.log(`✅ Today's energy chart data cleared for ${user.email}`);
    process.exit(0);
  } catch (error) {
    console.error("Clear today's energy failed:", error.message);
    process.exit(1);
  }
};

clearTodayEnergy();

