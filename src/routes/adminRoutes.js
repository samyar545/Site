const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');
const { verifyToken, requireRole } = require('../middleware/auth');

router.get('/stats', verifyToken, requireRole('owner', 'admin'), adminController.getStats);
router.get('/users', verifyToken, requireRole('owner', 'admin'), adminController.getUsers);
router.put('/users/role', verifyToken, requireRole('owner'), adminController.updateUserRole);
router.get('/logs', verifyToken, requireRole('owner', 'admin'), adminController.getLogs);

module.exports = router;
