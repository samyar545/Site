const express = require('express');
const router = express.Router();
const announcementController = require('../controllers/announcementController');
const { verifyToken, requireRole } = require('../middleware/auth');

router.get('/', announcementController.getActiveAnnouncements);
router.post('/', verifyToken, requireRole('owner', 'admin'), announcementController.createAnnouncement);
router.put('/:id', verifyToken, requireRole('owner', 'admin'), announcementController.updateAnnouncement);
router.delete('/:id', verifyToken, requireRole('owner', 'admin'), announcementController.deleteAnnouncement);

module.exports = router;
