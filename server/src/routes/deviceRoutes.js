// src/routes/deviceRoutes.js
const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/authMiddleware');
const {
  getDevices,
  getDeviceById,
  createDevice,
  deleteDevice,
  toggleDevice,
  toggleEco,
  seedDevices,
  getWaterHistory
} = require('../controllers/deviceController');

router.use(authMiddleware);

router.get('/', getDevices);
router.get('/history/water', getWaterHistory); // Water history endpoint (must be before /:id)
router.get('/:id', getDeviceById);
router.post('/', createDevice);
router.delete('/:id', deleteDevice);
router.post('/seed', seedDevices); // Seed default devices
router.patch('/:id/toggle', toggleDevice);
router.patch('/:id/eco', toggleEco);

module.exports = router;
