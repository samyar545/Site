const express = require('express');
const router = express.Router();
const historyController = require('../controllers/historyController');
const { verifyToken } = require('../middleware/auth');

router.post('/', verifyToken, historyController.addToHistory);
router.get('/', verifyToken, historyController.getHistory);
router.delete('/', verifyToken, historyController.clearHistory);

module.exports = router;
