const pool = require('../config/db');

const search = async (req, res) => {
  try {
    const { q } = req.query;
    if (!q) return res.status(400).json({ error: 'Query required' });
    const [manga] = await pool.query(
      'SELECT id, title, alternative_title, persian_title, slug, cover_image, rating, views FROM manga WHERE title LIKE ? OR alternative_title LIKE ? OR persian_title LIKE ? OR tags LIKE ? LIMIT 20',
      [`%${q}%`, `%${q}%`, `%${q}%`, `%${q}%`]
    );
    res.json({ manga });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
};

const suggestions = async (req, res) => {
  try {
    const { q } = req.query;
    if (!q) return res.json({ suggestions: [] });
    const [titles] = await pool.query('SELECT title FROM manga WHERE title LIKE ? LIMIT 10', [`%${q}%`]);
    res.json({ suggestions: titles.map(t => t.title) });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
};

module.exports = { search, suggestions };
