// src/seed/seedDevices.js
const mongoose = require('mongoose');
require('dotenv').config();
const User = require('../models/User');
const Device = require('../models/Device');

const connectDB = require('../config/db');

const devices = [
  { name: "Living Room AC",        type: "HVAC",         isOn: true,  currentPowerW: 1500 },
  { name: "Kitchen Lights",        type: "Lighting",     isOn: true,  currentPowerW: 80 },
  { name: "Bedroom Lights",        type: "Lighting",     isOn: false, currentPowerW: 0 },
  { name: "Electric Water Heater", type: "Water Heater", isOn: false, currentPowerW: 0 },
  { name: "Refrigerator",          type: "Appliance",    isOn: true,  currentPowerW: 150 },
];

const seedDevices = async () => {
  try {
    await connectDB();

    const user = await User.findOne(); // takes the first registered user
    if (!user) {
      console.log("No user found! Please register first.");
      process.exit(1);
    }

    // Clear old devices for this user
    await Device.deleteMany({ userId: user._id });

    // Add fresh devices
    const deviceDocs = devices.map(device => ({
      ...device,
      userId: user._id
    }));

    await Device.insertMany(deviceDocs);

    console.log(`5 devices successfully seeded for ${user.email}`);
    process.exit(0);
  } catch (error) {
    console.error("Seeding failed:", error.message);
    process.exit(1);
  }
};

seedDevices();