// src/routes/settingsRoutes.js
const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/authMiddleware');
const { getSettings, updateSettings } = require('../controllers/settingsController');

router.use(authMiddleware);

router.get('/', getSettings);
router.patch('/', updateSettings);

module.exports = router;





