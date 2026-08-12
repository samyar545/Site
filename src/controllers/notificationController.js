const pool = require('../config/db');

const getMyNotifications = async (req, res) => {
  try {
    const [notifications] = await pool.query(
      'SELECT id, title, message, is_read, created_at FROM notifications WHERE user_id = ? ORDER BY created_at DESC LIMIT 50',
      [req.user.id]
    );
    const unreadCount = notifications.filter(n => !n.is_read).length;
    res.json({ notifications, unreadCount });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
};

const markAsRead = async (req, res) => {
  try {
    const { id } = req.params;
    await pool.query('UPDATE notifications SET is_read = TRUE WHERE id = ? AND user_id = ?', [id, req.user.id]);
    res.json({ message: 'Marked as read' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
};

const markAllAsRead = async (req, res) => {
  try {
    await pool.query('UPDATE notifications SET is_read = TRUE WHERE user_id = ?', [req.user.id]);
    res.json({ message: 'All notifications marked as read' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
};

const deleteNotification = async (req, res) => {
  try {
    const { id } = req.params;
    await pool.query('DELETE FROM notifications WHERE id = ? AND user_id = ?', [id, req.user.id]);
    res.json({ message: 'Notification deleted' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
};

const sendNotification = async (req, res) => {
  try {
    const { title, message, userIds } = req.body;
    if (!title || !message) return res.status(400).json({ error: 'Title and message required' });
    if (userIds && Array.isArray(userIds)) {
      for (const userId of userIds) {
        await pool.query('INSERT INTO notifications (user_id, title, message) VALUES (?, ?, ?)', [userId, title, message]);
      }
    } else {
      const [users] = await pool.query('SELECT id FROM users');
      for (const user of users) {
        await pool.query('INSERT INTO notifications (user_id, title, message) VALUES (?, ?, ?)', [user.id, title, message]);
      }
    }
    res.status(201).json({ message: 'Notifications sent' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
};

module.exports = { getMyNotifications, markAsRead, markAllAsRead, deleteNotification, sendNotification };
