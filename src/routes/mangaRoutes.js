const express = require('express');
const router = express.Router();
const mangaController = require('../controllers/mangaController');
const { verifyToken, requireRole } = require('../middleware/auth');

router.get('/', mangaController.getAllManga);
router.get('/:slug', mangaController.getMangaBySlug);
router.post('/', verifyToken, requireRole('owner', 'admin', 'editor'), mangaController.createManga);
router.put('/:id', verifyToken, requireRole('owner', 'admin', 'editor'), mangaController.updateManga);
router.delete('/:id', verifyToken, requireRole('owner', 'admin'), mangaController.deleteManga);

module.exports = router;
