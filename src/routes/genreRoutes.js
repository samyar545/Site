const express = require('express');
const router = express.Router();
const genreController = require('../controllers/genreController');
const { verifyToken, requireRole } = require('../middleware/auth');

router.get('/', genreController.getAllGenres);
router.post('/', verifyToken, requireRole('owner', 'admin'), genreController.createGenre);
router.put('/:id', verifyToken, requireRole('owner', 'admin'), genreController.updateGenre);
router.delete('/:id', verifyToken, requireRole('owner', 'admin'), genreController.deleteGenre);

module.exports = router;
