const pool = require('../config/db');

const getActiveAnnouncements = async (req, res) => {
  try {
    const [announcements] = await pool.query(
      'SELECT id, message, start_date, end_date FROM announcements WHERE is_active = TRUE AND (start_date IS NULL OR start_date <= NOW()) AND (end_date IS NULL OR end_date >= NOW()) ORDER BY created_at DESC'
    );
    res.json({ announcements });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
};

const createAnnouncement = async (req, res) => {
  try {
    const { message, start_date, end_date } = req.body;
    if (!message) return res.status(400).json({ error: 'Message required' });
    await pool.query('INSERT INTO announcements (message, start_date, end_date) VALUES (?, ?, ?)', [message, start_date, end_date]);
    res.status(201).json({ message: 'Announcement created' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
};

const updateAnnouncement = async (req, res) => {
  try {
    const { id } = req.params;
    const { message, is_active, start_date, end_date } = req.body;
    const fields = {};
    if (message) fields.message = message;
    if (is_active !== undefined) fields.is_active = is_active;
    if (start_date) fields.start_date = start_date;
    if (end_date) fields.end_date = end_date;
    if (Object.keys(fields).length === 0) return res.status(400).json({ error: 'No fields to update' });
    const setClause = Object.keys(fields).map(k => `${k} = ?`).join(', ');
    await pool.query(`UPDATE announcements SET ${setClause} WHERE id = ?`, [...Object.values(fields), id]);
    res.json({ message: 'Announcement updated' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
};

const deleteAnnouncement = async (req, res) => {
  try {
    const { id } = req.params;
    await pool.query('DELETE FROM announcements WHERE id = ?', [id]);
    res.json({ message: 'Announcement deleted' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
};

module.exports = { getActiveAnnouncements, createAnnouncement, updateAnnouncement, deleteAnnouncement };
