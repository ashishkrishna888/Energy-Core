// src/controllers/energyController.js
const EnergyLog = require('../models/EnergyLog');

const getHistory = async (req, res) => {
  try {
    const range = req.query.range === 'weekly' ? 'weekly' : 'daily';
    const userId = req.user._id;

    if (range === 'daily') {
      const now = new Date();
      const start = new Date();
      start.setDate(now.getDate() - 6); // last 7 days

      const results = await EnergyLog.aggregate([
        {
          $match: {
            userId,
            timestamp: { $gte: start, $lte: now }
          }
        },
        {
          $group: {
            _id: '$day',
            totalKwh: { $sum: '$energyKwh' }
          }
        },
        { $sort: { _id: 1 } }
      ]);

      const points = results.map((item) => ({
        label: item._id,
        totalKwh: Number(item.totalKwh.toFixed(2))
      }));

      return res.json({ range: 'daily', points });
    }

    // weekly
    const results = await EnergyLog.aggregate([
      {
        $match: {
          userId
        }
      },
      {
        $group: {
          _id: '$week',
          totalKwh: { $sum: '$energyKwh' }
        }
      },
      { $sort: { _id: 1 } }
    ]);

    const points = results
      .filter((r) => r._id)
      .map((item) => ({
        label: item._id,
        totalKwh: Number(item.totalKwh.toFixed(2))
      }));

    res.json({ range: 'weekly', points });
  } catch (error) {
    console.error('Energy history error:', error.message);
    res.status(500).json({ message: 'Error fetching energy history' });
  }
};

module.exports = { getHistory };
