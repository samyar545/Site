const express = require('express');
const router = express.Router();
const notificationController = require('../controllers/notificationController');
const { verifyToken, requireRole } = require('../middleware/auth');

router.get('/', verifyToken, notificationController.getMyNotifications);
router.put('/:id/read', verifyToken, notificationController.markAsRead);
router.put('/read-all', verifyToken, notificationController.markAllAsRead);
router.delete('/:id', verifyToken, notificationController.deleteNotification);
router.post('/send', verifyToken, requireRole('owner', 'admin'), notificationController.sendNotification);

module.exports = router;
