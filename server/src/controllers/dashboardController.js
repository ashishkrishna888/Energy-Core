// src/controllers/dashboardController.js
const Device = require('../models/Device');

const getDashboardSummary = async (req, res) => {
  try {
    const devices = await Device.find({ userId: req.user._id });

    let totalCurrentKw = 0;
    let devicesOn = 0;
    let devicesOff = 0;
    const byCategory = {};

    devices.forEach((device) => {
      const { category, status, currentPowerKw } = device;

      if (status === 'ON') {
        devicesOn += 1;
        totalCurrentKw += currentPowerKw;
      } else {
        devicesOff += 1;
      }

      if (!byCategory[category]) {
        byCategory[category] = { count: 0, currentKw: 0 };
      }

      byCategory[category].count += 1;
      if (status === 'ON') {
        byCategory[category].currentKw += currentPowerKw;
      }
    });

    totalCurrentKw = Number(totalCurrentKw.toFixed(2));

    res.json({
      totalCurrentKw,
      deviceCount: devices.length,
      devicesOn,
      devicesOff,
      byCategory
    });
  } catch (error) {
    console.error('Dashboard summary error:', error.message);
    res.status(500).json({ message: 'Error fetching summary' });
  }
};

module.exports = { getDashboardSummary };
