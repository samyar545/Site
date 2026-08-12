const express = require('express');
const router = express.Router();
const newsController = require('../controllers/newsController');
const { verifyToken, requireRole } = require('../middleware/auth');

router.get('/', newsController.getAllNews);
router.get('/:slug', newsController.getNewsBySlug);
router.post('/', verifyToken, requireRole('owner', 'admin'), newsController.createNews);
router.put('/:id', verifyToken, requireRole('owner', 'admin'), newsController.updateNews);
router.delete('/:id', verifyToken, requireRole('owner', 'admin'), newsController.deleteNews);

module.exports = router;
