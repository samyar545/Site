const pool = require('../config/db');
const createSlug = require('../utils/slugify');

const getAllGenres = async (req, res) => {
  try {
    const [genres] = await pool.query('SELECT id, name, slug, description FROM genres ORDER BY name ASC');
    res.json({ genres });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
};

const createGenre = async (req, res) => {
  try {
    const { name, description } = req.body;
    if (!name) return res.status(400).json({ error: 'Name required' });
    const slug = createSlug(name);
    await pool.query('INSERT INTO genres (name, slug, description) VALUES (?, ?, ?)', [name, slug, description]);
    res.status(201).json({ message: 'Genre created' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
};

const updateGenre = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, description } = req.body;
    const fields = {};
    if (name) { fields.name = name; fields.slug = createSlug(name); }
    if (description !== undefined) fields.description = description;
    if (Object.keys(fields).length === 0) return res.status(400).json({ error: 'No fields to update' });
    const setClause = Object.keys(fields).map(k => `${k} = ?`).join(', ');
    await pool.query(`UPDATE genres SET ${setClause} WHERE id = ?`, [...Object.values(fields), id]);
    res.json({ message: 'Genre updated' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
};

const deleteGenre = async (req, res) => {
  try {
    const { id } = req.params;
    await pool.query('DELETE FROM genres WHERE id = ?', [id]);
    res.json({ message: 'Genre deleted' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
};

module.exports = { getAllGenres, createGenre, updateGenre, deleteGenre };
