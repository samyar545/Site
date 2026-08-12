const pool = require('../config/db');

const addToHistory = async (req, res) => {
  try {
    const { mangaId, chapterId } = req.body;
    if (!mangaId || !chapterId) return res.status(400).json({ error: 'Manga ID and Chapter ID required' });
    await pool.query(
      'INSERT INTO reading_history (user_id, manga_id, chapter_id) VALUES (?, ?, ?) ON DUPLICATE KEY UPDATE last_read_at = NOW()',
      [req.user.id, mangaId, chapterId]
    );
    res.status(201).json({ message: 'Added to reading history' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
};

const getHistory = async (req, res) => {
  try {
    const [history] = await pool.query(
      'SELECT m.id, m.title, m.persian_title, m.slug, m.cover_image, c.chapter_number, rh.last_read_at FROM reading_history rh JOIN manga m ON rh.manga_id = m.id JOIN chapters c ON rh.chapter_id = c.id WHERE rh.user_id = ? ORDER BY rh.last_read_at DESC LIMIT 50',
      [req.user.id]
    );
    res.json({ history });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
};

const clearHistory = async (req, res) => {
  try {
    await pool.query('DELETE FROM reading_history WHERE user_id = ?', [req.user.id]);
    res.json({ message: 'Reading history cleared' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
};

module.exports = { addToHistory, getHistory, clearHistory };
