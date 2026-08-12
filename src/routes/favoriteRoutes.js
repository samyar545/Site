const express = require('express');
const router = express.Router();
const favoriteController = require('../controllers/favoriteController');
const { verifyToken } = require('../middleware/auth');

router.post('/', verifyToken, favoriteController.addFavorite);
router.delete('/:mangaId', verifyToken, favoriteController.removeFavorite);
router.get('/', verifyToken, favoriteController.getFavorites);
router.get('/:mangaId/check', verifyToken, favoriteController.isFavorite);

module.exports = router;
