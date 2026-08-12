const pool = require('../config/db');
const createSlug = require('../utils/slugify');

const getAllManga = async (req, res) => {
  try {
    const { type, status, genre, page = 1, limit = 20, sort = 'latest' } = req.query;
    let query = 'SELECT m.* FROM manga m';
    const conditions = [];
    const params = [];
    if (type) { conditions.push('m.type = ?'); params.push(type); }
    if (status) { conditions.push('m.status = ?'); params.push(status); }
    if (genre) {
      query += ' JOIN manga_genres mg ON m.id = mg.manga_id JOIN genres g ON mg.genre_id = g.id';
      conditions.push('g.slug = ?');
      params.push(genre);
    }
    if (conditions.length > 0) query += ' WHERE ' + conditions.join(' AND ');
    if (sort === 'popular') query += ' ORDER BY m.views DESC';
    else if (sort === 'rating') query += ' ORDER BY m.rating DESC';
    else query += ' ORDER BY m.updated_at DESC';
    query += ' LIMIT ? OFFSET ?';
    params.push(parseInt(limit), (parseInt(page) - 1) * parseInt(limit));
    const [rows] = await pool.query(query, params);
    res.json({ manga: rows });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
};

const getMangaBySlug = async (req, res) => {
  try {
    const { slug } = req.params;
    const [rows] = await pool.query('SELECT * FROM manga WHERE slug = ?', [slug]);
    if (rows.length === 0) return res.status(404).json({ error: 'Manga not found' });
    const manga = rows[0];
    await pool.query('UPDATE manga SET views = views + 1 WHERE id = ?', [manga.id]);
    const [genres] = await pool.query(
      'SELECT g.id, g.name, g.slug FROM genres g JOIN manga_genres mg ON g.id = mg.genre_id WHERE mg.manga_id = ?',
      [manga.id]
    );
    const [chapters] = await pool.query(
      'SELECT id, chapter_number, title, release_date FROM chapters WHERE manga_id = ? AND is_published = TRUE ORDER BY chapter_number ASC',
      [manga.id]
    );
    res.json({ manga, genres, chapters });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
};

const createManga = async (req, res) => {
  try {
    const { title, alternative_title, persian_title, description, cover_image, banner_image, author, artist, status, type, release_year, tags, translation_status, genres } = req.body;
    if (!title) return res.status(400).json({ error: 'Title required' });
    const slug = createSlug(title) + '-' + Date.now().toString(36);
    const [result] = await pool.query(
      'INSERT INTO manga (title, alternative_title, persian_title, slug, description, cover_image, banner_image, author, artist, status, type, release_year, tags, translation_status) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
      [title, alternative_title, persian_title, slug, description, cover_image, banner_image, author, artist, status || 'ongoing', type || 'manga', release_year, tags, translation_status]
    );
    const mangaId = result.insertId;
    if (genres && Array.isArray(genres)) {
      for (const genreId of genres) {
        await pool.query('INSERT INTO manga_genres (manga_id, genre_id) VALUES (?, ?)', [mangaId, genreId]);
      }
    }
    res.status(201).json({ message: 'Manga created', slug });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
};

const updateManga = async (req, res) => {
  try {
    const { id } = req.params;
    const fields = req.body;
    if (fields.title) fields.slug = createSlug(fields.title) + '-' + Date.now().toString(36);
    const keys = Object.keys(fields).filter(k => k !== 'genres' && k !== 'id');
    if (keys.length > 0) {
      const setClause = keys.map(k => `${k} = ?`).join(', ');
      await pool.query(`UPDATE manga SET ${setClause} WHERE id = ?`, [...keys.map(k => fields[k]), id]);
    }
    if (fields.genres && Array.isArray(fields.genres)) {
      await pool.query('DELETE FROM manga_genres WHERE manga_id = ?', [id]);
      for (const genreId of fields.genres) {
        await pool.query('INSERT INTO manga_genres (manga_id, genre_id) VALUES (?, ?)', [id, genreId]);
      }
    }
    res.json({ message: 'Manga updated' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
};

const deleteManga = async (req, res) => {
  try {
    const { id } = req.params;
    await pool.query('DELETE FROM manga WHERE id = ?', [id]);
    res.json({ message: 'Manga deleted' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
};

module.exports = { getAllManga, getMangaBySlug, createManga, updateManga, deleteManga };
