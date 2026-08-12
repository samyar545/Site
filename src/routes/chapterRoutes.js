const express = require('express');
const router = express.Router();
const chapterController = require('../controllers/chapterController');
const { verifyToken, requireRole } = require('../middleware/auth');
const upload = require('../middleware/upload');

router.get('/manga/:mangaId', chapterController.getChaptersByManga);
router.get('/:mangaSlug/:chapter', chapterController.getChapter);
router.post('/', verifyToken, requireRole('owner', 'admin', 'editor'), chapterController.createChapter);
router.put('/:id', verifyToken, requireRole('owner', 'admin', 'editor'), chapterController.updateChapter);
router.delete('/:id', verifyToken, requireRole('owner', 'admin'), chapterController.deleteChapter);
router.post('/:chapterId/pages', verifyToken, requireRole('owner', 'admin', 'editor'), upload.array('pages', 100), chapterController.uploadPages);

module.exports = router;
