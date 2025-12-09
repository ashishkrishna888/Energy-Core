// src/routes/energyRoutes.js
const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/authMiddleware');
const { getHistory } = require('../controllers/energyController');

router.use(authMiddleware);

router.get('/history', getHistory);

module.exports = router;
