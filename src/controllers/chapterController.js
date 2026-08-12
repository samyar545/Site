const pool = require('../config/db');

const getChaptersByManga = async (req, res) => {
  try {
    const { mangaId } = req.params;
    const [chapters] = await pool.query(
      'SELECT id, chapter_number, title, release_date, is_published FROM chapters WHERE manga_id = ? ORDER BY chapter_number ASC',
      [mangaId]
    );
    res.json({ chapters });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
};

const getChapter = async (req, res) => {
  try {
    const { mangaSlug, chapter } = req.params;
    const [mangaRows] = await pool.query('SELECT id, title, slug FROM manga WHERE slug = ?', [mangaSlug]);
    if (mangaRows.length === 0) return res.status(404).json({ error: 'Manga not found' });
    const manga = mangaRows[0];
    const [chapterRows] = await pool.query(
      'SELECT id, chapter_number, title, release_date FROM chapters WHERE manga_id = ? AND chapter_number = ? AND is_published = TRUE',
      [manga.id, chapter]
    );
    if (chapterRows.length === 0) return res.status(404).json({ error: 'Chapter not found' });
    const chapterData = chapterRows[0];
    const [pages] = await pool.query(
      'SELECT page_number, image_url FROM chapter_pages WHERE chapter_id = ? ORDER BY page_number ASC',
      [chapterData.id]
    );
    const [prev] = await pool.query(
      'SELECT chapter_number, title FROM chapters WHERE manga_id = ? AND chapter_number < ? AND is_published = TRUE ORDER BY chapter_number DESC LIMIT 1',
      [manga.id, chapter]
    );
    const [next] = await pool.query(
      'SELECT chapter_number, title FROM chapters WHERE manga_id = ? AND chapter_number > ? AND is_published = TRUE ORDER BY chapter_number ASC LIMIT 1',
      [manga.id, chapter]
    );
    res.json({
      manga: { id: manga.id, title: manga.title, slug: manga.slug },
      chapter: chapterData,
      pages,
      prev: prev[0] || null,
      next: next[0] || null
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
};

const createChapter = async (req, res) => {
  try {
    const { mangaId, chapter_number, title, is_published } = req.body;
    if (!mangaId || !chapter_number) return res.status(400).json({ error: 'Manga ID and chapter number required' });
    const [result] = await pool.query(
      'INSERT INTO chapters (manga_id, chapter_number, title, is_published) VALUES (?, ?, ?, ?)',
      [mangaId, chapter_number, title, is_published || false]
    );
    res.status(201).json({ message: 'Chapter created', chapterId: result.insertId });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
};

const updateChapter = async (req, res) => {
  try {
    const { id } = req.params;
    const { chapter_number, title, is_published } = req.body;
    const fields = {};
    if (chapter_number) fields.chapter_number = chapter_number;
    if (title !== undefined) fields.title = title;
    if (is_published !== undefined) fields.is_published = is_published;
    if (Object.keys(fields).length === 0) return res.status(400).json({ error: 'No fields to update' });
    const setClause = Object.keys(fields).map(k => `${k} = ?`).join(', ');
    await pool.query(`UPDATE chapters SET ${setClause} WHERE id = ?`, [...Object.values(fields), id]);
    res.json({ message: 'Chapter updated' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
};

const deleteChapter = async (req, res) => {
  try {
    const { id } = req.params;
    await pool.query('DELETE FROM chapters WHERE id = ?', [id]);
    res.json({ message: 'Chapter deleted' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
};

const uploadPages = async (req, res) => {
  try {
    const { chapterId } = req.params;
    if (!req.files || req.files.length === 0) return res.status(400).json({ error: 'No files uploaded' });
    for (let i = 0; i < req.files.length; i++) {
      const file = req.files[i];
      await pool.query(
        'INSERT INTO chapter_pages (chapter_id, page_number, image_url) VALUES (?, ?, ?)',
        [chapterId, i + 1, `/uploads/${file.filename}`]
      );
    }
    res.status(201).json({ message: 'Pages uploaded', count: req.files.length });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
};

module.exports = { getChaptersByManga, getChapter, createChapter, updateChapter, deleteChapter, uploadPages };
