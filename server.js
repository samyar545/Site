require('dotenv').config();
const express = require('express');
const path = require('path');
const rateLimit = require('express-rate-limit');
const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
app.use(express.static(path.join(__dirname, 'public')));
app.use('/uploads', express.static(path.join(__dirname, 'public/uploads')));
app.use('/admin', express.static(path.join(__dirname, 'admin')));

// Rate limiting
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: 'Too many requests from this IP, please try again later.'
});
app.use('/api/', apiLimiter);

// Import routes
const authRoutes = require('./src/routes/authRoutes');
const mangaRoutes = require('./src/routes/mangaRoutes');
const chapterRoutes = require('./src/routes/chapterRoutes');
const genreRoutes = require('./src/routes/genreRoutes');
const newsRoutes = require('./src/routes/newsRoutes');
const notificationRoutes = require('./src/routes/notificationRoutes');
const settingsRoutes = require('./src/routes/settingsRoutes');
const adminRoutes = require('./src/routes/adminRoutes');
const searchRoutes = require('./src/routes/searchRoutes');
const uploadRoutes = require('./src/routes/uploadRoutes');
const announcementRoutes = require('./src/routes/announcementRoutes');
const favoriteRoutes = require('./src/routes/favoriteRoutes');
const historyRoutes = require('./src/routes/historyRoutes');

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/manga', mangaRoutes);
app.use('/api/chapters', chapterRoutes);
app.use('/api/genres', genreRoutes);
app.use('/api/news', newsRoutes);
app.use('/api/notifications', notificationRoutes);
app.use('/api/settings', settingsRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/search', searchRoutes);
app.use('/api/upload', uploadRoutes);
app.use('/api/announcements', announcementRoutes);
app.use('/api/favorites', favoriteRoutes);
app.use('/api/history', historyRoutes);

// Serve frontend pages for dynamic routes
app.get('/manga/:slug', (req, res) => {
  res.sendFile(path.join(__dirname, 'public/manga.html'));
});

app.get('/read/:mangaSlug/:chapter', (req, res) => {
  res.sendFile(path.join(__dirname, 'public/reader.html'));
});

app.get('/news/:slug', (req, res) => {
  res.sendFile(path.join(__dirname, 'public/news-detail.html'));
});

app.get('/search', (req, res) => {
  res.sendFile(path.join(__dirname, 'public/search.html'));
});

app.get('/admin', (req, res) => {
  res.sendFile(path.join(__dirname, 'admin/index.html'));
});

app.get('/admin/*', (req, res) => {
  res.sendFile(path.join(__dirname, 'admin/index.html'));
});

// Error handling
app.use((req, res) => {
  res.status(404).json({ error: 'Not Found' });
});

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Internal Server Error' });
});

app.listen(PORT, () => {
  console.log(`Melanga server running on port ${PORT}`);
});
