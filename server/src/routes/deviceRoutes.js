// src/routes/deviceRoutes.js
const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/authMiddleware');
const {
  getDevices,
  getDeviceById,
  createDevice,
  toggleDevice
} = require('../controllers/deviceController');

router.use(authMiddleware);

router.get('/', getDevices);
router.get('/:id', getDeviceById);
router.post('/', createDevice);
router.post('/:id/toggle', toggleDevice);

module.exports = router;
