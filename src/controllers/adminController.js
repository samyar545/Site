const pool = require('../config/db');
const bcrypt = require('bcryptjs');

const getStats = async (req, res) => {
  try {
    const [totalUsers] = await pool.query('SELECT COUNT(*) as count FROM users');
    const [totalManga] = await pool.query('SELECT COUNT(*) as count FROM manga');
    const [totalChapters] = await pool.query('SELECT COUNT(*) as count FROM chapters');
    const [totalViews] = await pool.query('SELECT SUM(views) as total FROM manga');
    const [totalNews] = await pool.query('SELECT COUNT(*) as count FROM news');
    const [recentUsers] = await pool.query('SELECT id, username, email, created_at FROM users ORDER BY created_at DESC LIMIT 5');
    const [recentChapters] = await pool.query('SELECT c.id, c.chapter_number, m.title as manga_title, c.release_date FROM chapters c JOIN manga m ON c.manga_id = m.id ORDER BY c.created_at DESC LIMIT 5');
    res.json({
      stats: {
        totalUsers: totalUsers[0].count,
        totalManga: totalManga[0].count,
        totalChapters: totalChapters[0].count,
        totalViews: totalViews[0].total || 0,
        totalNews: totalNews[0].count,
        recentUsers,
        recentChapters
      }
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
};

const getUsers = async (req, res) => {
  try {
    const [users] = await pool.query('SELECT u.id, u.username, u.email, u.role_id, r.name as role_name, u.created_at FROM users u JOIN roles r ON u.role_id = r.id ORDER BY u.created_at DESC');
    res.json({ users });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
};

const updateUserRole = async (req, res) => {
  try {
    const { userId, roleId } = req.body;
    await pool.query('UPDATE users SET role_id = ? WHERE id = ?', [roleId, userId]);
    res.json({ message: 'User role updated' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
};

const getLogs = async (req, res) => {
  try {
    const [logs] = await pool.query('SELECT l.*, u.username FROM admin_logs l LEFT JOIN users u ON l.admin_id = u.id ORDER BY l.created_at DESC LIMIT 100');
    res.json({ logs });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
};

const addLog = async (adminId, action, details) => {
  try {
    await pool.query('INSERT INTO admin_logs (admin_id, action, details) VALUES (?, ?, ?)', [adminId, action, details]);
  } catch (error) {
    console.error('Failed to add log', error);
  }
};

module.exports = { getStats, getUsers, updateUserRole, getLogs, addLog };
