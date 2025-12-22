// src/server.js
const http = require('http');
const cron = require('node-cron');
const app = require('./app');
const connectDB = require('./config/db');
const Device = require('./models/Device');
require('dotenv').config();

const PORT = process.env.PORT || 5000;

// Midnight Reset Job: Turn off all devices at 00:00 every day
const scheduleMidnightReset = () => {
  cron.schedule('0 0 * * *', async () => {
    try {
      // Find all devices that are currently ON
      const result = await Device.updateMany(
        { isOn: true },
        {
          $set: {
            isOn: false,
            currentPowerKw: 0,
            status: 'OFF'
          }
        }
      );

      console.log(`🕛 Midnight Reset: Turned off ${result.modifiedCount} devices.`);
    } catch (error) {
      console.error('❌ Midnight Reset Error:', error.message);
    }
  });
};

const startServer = async () => {
  try {
    await connectDB();

    // Schedule the midnight reset job after DB connection is established
    scheduleMidnightReset();

    const server = http.createServer(app);
    server.listen(PORT, () => {
      console.log(`✅ Server running on http://localhost:${PORT}`);
      console.log(`⏰ Midnight reset job scheduled (runs at 00:00 daily)`);
    });
  } catch (error) {
    console.error('❌ Failed to start server:', error.message);
    process.exit(1);
  }
};

startServer();
