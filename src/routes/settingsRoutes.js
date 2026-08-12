const express = require('express');
const router = express.Router();
const settingsController = require('../controllers/settingsController');
const { verifyToken, requireRole } = require('../middleware/auth');

router.get('/', settingsController.getPublicSettings);
router.put('/', verifyToken, requireRole('owner'), settingsController.updateSettings);

module.exports = router;
