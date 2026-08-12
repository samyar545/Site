const pool = require('../config/db');

const getPublicSettings = async (req, res) => {
  try {
    const [settings] = await pool.query('SELECT setting_key, setting_value FROM settings');
    const settingsObj = {};
    settings.forEach(s => { settingsObj[s.setting_key] = s.setting_value; });
    res.json({ settings: settingsObj });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
};

const updateSettings = async (req, res) => {
  try {
    const settings = req.body;
    for (const key of Object.keys(settings)) {
      await pool.query('INSERT INTO settings (setting_key, setting_value) VALUES (?, ?) ON DUPLICATE KEY UPDATE setting_value = ?', [key, settings[key], settings[key]]);
    }
    res.json({ message: 'Settings updated' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
};

module.exports = { getPublicSettings, updateSettings };
