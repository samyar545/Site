const pool = require('../config/db');
const createSlug = require('../utils/slugify');

const getAllNews = async (req, res) => {
  try {
    const [news] = await pool.query('SELECT id, title, slug, thumbnail, author, published_at FROM news WHERE is_published = TRUE ORDER BY published_at DESC');
    res.json({ news });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
};

const getNewsBySlug = async (req, res) => {
  try {
    const { slug } = req.params;
    const [rows] = await pool.query('SELECT * FROM news WHERE slug = ? AND is_published = TRUE', [slug]);
    if (rows.length === 0) return res.status(404).json({ error: 'News not found' });
    res.json({ news: rows[0] });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
};

const createNews = async (req, res) => {
  try {
    const { title, thumbnail, content, author, is_published, published_at } = req.body;
    if (!title || !content) return res.status(400).json({ error: 'Title and content required' });
    const slug = createSlug(title) + '-' + Date.now().toString(36);
    const publishedAt = published_at || new Date();
    await pool.query(
      'INSERT INTO news (title, slug, thumbnail, content, author, is_published, published_at) VALUES (?, ?, ?, ?, ?, ?, ?)',
      [title, slug, thumbnail, content, author || 'Melanga', is_published || false, publishedAt]
    );
    res.status(201).json({ message: 'News created', slug });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
};

const updateNews = async (req, res) => {
  try {
    const { id } = req.params;
    const fields = req.body;
    if (fields.title) fields.slug = createSlug(fields.title) + '-' + Date.now().toString(36);
    const keys = Object.keys(fields);
    if (keys.length === 0) return res.status(400).json({ error: 'No fields to update' });
    const setClause = keys.map(k => `${k} = ?`).join(', ');
    await pool.query(`UPDATE news SET ${setClause} WHERE id = ?`, [...keys.map(k => fields[k]), id]);
    res.json({ message: 'News updated' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
};

const deleteNews = async (req, res) => {
  try {
    const { id } = req.params;
    await pool.query('DELETE FROM news WHERE id = ?', [id]);
    res.json({ message: 'News deleted' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
};

module.exports = { getAllNews, getNewsBySlug, createNews, updateNews, deleteNews };
