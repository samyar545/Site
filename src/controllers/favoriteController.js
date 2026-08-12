const pool = require('../config/db');

const addFavorite = async (req, res) => {
  try {
    const { mangaId } = req.body;
    if (!mangaId) return res.status(400).json({ error: 'Manga ID required' });
    await pool.query(
      'INSERT INTO favorites (user_id, manga_id) VALUES (?, ?) ON DUPLICATE KEY UPDATE user_id = user_id',
      [req.user.id, mangaId]
    );
    res.status(201).json({ message: 'Added to favorites' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
};

const removeFavorite = async (req, res) => {
  try {
    const { mangaId } = req.params;
    await pool.query('DELETE FROM favorites WHERE user_id = ? AND manga_id = ?', [req.user.id, mangaId]);
    res.json({ message: 'Removed from favorites' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
};

const getFavorites = async (req, res) => {
  try {
    const [favorites] = await pool.query(
      'SELECT m.id, m.title, m.persian_title, m.slug, m.cover_image FROM favorites f JOIN manga m ON f.manga_id = m.id WHERE f.user_id = ? ORDER BY f.created_at DESC',
      [req.user.id]
    );
    res.json({ favorites });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
};

const isFavorite = async (req, res) => {
  try {
    const { mangaId } = req.params;
    const [rows] = await pool.query('SELECT id FROM favorites WHERE user_id = ? AND manga_id = ?', [req.user.id, mangaId]);
    res.json({ isFavorite: rows.length > 0 });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
};

module.exports = { addFavorite, removeFavorite, getFavorites, isFavorite };
