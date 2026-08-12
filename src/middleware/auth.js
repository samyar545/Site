const jwt = require('jsonwebtoken');
const pool = require('../config/db');

const verifyToken = async (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Authentication required' });
  }
  const token = authHeader.split(' ')[1];
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const [rows] = await pool.query('SELECT id, username, email, role_id FROM users WHERE id = ?', [decoded.id]);
    if (rows.length === 0) return res.status(401).json({ error: 'User not found' });
    req.user = rows[0];
    next();
  } catch (error) {
    return res.status(401).json({ error: 'Invalid token' });
  }
};

const requireRole = (...roles) => {
  return async (req, res, next) => {
    if (!req.user) return res.status(401).json({ error: 'Authentication required' });
    const [roleRows] = await pool.query('SELECT name FROM roles WHERE id = ?', [req.user.role_id]);
    if (roleRows.length === 0) return res.status(403).json({ error: 'Role not found' });
    const userRole = roleRows[0].name;
    if (roles.includes(userRole)) {
      next();
    } else {
      return res.status(403).json({ error: 'Insufficient permissions' });
    }
  };
};

module.exports = { verifyToken, requireRole };
