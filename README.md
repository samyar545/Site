# Melanga - Manga & Manhwa Platform

مانگا و مانهوا فارسی

## Overview

Melanga is a comprehensive web platform for reading and sharing Manga and Manhwa content in Persian. Built with Node.js, Express, and MySQL, it provides a complete user experience with features like reading history, favorites, notifications, and admin panel.

## Features

- **Manga/Manhwa Management**: Full CRUD operations for manga titles
- **Chapter Management**: Upload and organize chapters with page images
- **User System**: Registration, authentication, and profiles
- **Reading History**: Track reading progress automatically
- **Favorites**: Bookmark favorite manga
- **Search**: Powerful search with suggestions
- **Announcements**: Site-wide announcements with scheduling
- **News System**: Post and manage news articles
- **Notifications**: User notifications system
- **Admin Panel**: Comprehensive admin dashboard
- **Responsive Design**: Mobile-friendly interface

## Tech Stack

**Backend:**
- Node.js
- Express.js
- MySQL/MariaDB
- JWT Authentication
- Multer (File uploads)

**Frontend:**
- HTML5
- CSS3
- Vanilla JavaScript
- Responsive Grid Layout

## Installation

1. Clone the repository
```bash
git clone https://github.com/samyar545/Site.git
cd Site
```

2. Install dependencies
```bash
npm install
```

3. Create `.env` file
```env
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=
DB_NAME=melanga_db
JWT_SECRET=your-secret-key
PORT=3000
```

4. Setup database
Run the SQL schema from `database/schema.sql`

5. Start the server
```bash
npm start
```

For development with auto-reload:
```bash
npm run dev
```

## Project Structure

```
.
├── public/                 # Frontend files
│   ├── index.html
│   ├── css/               # Stylesheets
│   ├── js/                # JavaScript files
│   └── uploads/           # User uploads
├── src/
│   ├── controllers/       # Business logic
│   ├── routes/            # API routes
│   ├── middleware/        # Custom middleware
│   ├── utils/             # Utility functions
│   ├── config/            # Configuration
│   └── server.js          # Main server file
├── database/              # SQL schemas
├── package.json
└── .env                   # Environment variables
```

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/profile` - Get user profile
- `PUT /api/auth/profile` - Update profile
- `POST /api/auth/change-password` - Change password

### Manga
- `GET /api/manga` - List all manga
- `GET /api/manga/:slug` - Get manga details
- `POST /api/manga` - Create manga (admin)
- `PUT /api/manga/:id` - Update manga (admin)
- `DELETE /api/manga/:id` - Delete manga (admin)

### Chapters
- `GET /api/chapters/manga/:mangaId` - Get chapters
- `GET /api/chapters/:mangaSlug/:chapter` - Get chapter
- `POST /api/chapters` - Create chapter (editor)
- `POST /api/chapters/:chapterId/pages` - Upload pages

### User Features
- `POST /api/favorites` - Add to favorites
- `DELETE /api/favorites/:mangaId` - Remove favorite
- `GET /api/favorites` - Get favorites
- `POST /api/history` - Add to history
- `GET /api/history` - Get reading history
- `DELETE /api/history` - Clear history

### Admin
- `GET /api/admin/stats` - Dashboard stats
- `GET /api/admin/users` - List users
- `PUT /api/admin/users/role` - Update user role
- `GET /api/admin/logs` - Admin logs

## Database Schema

Key tables:
- `users` - User accounts
- `manga` - Manga/Manhwa titles
- `chapters` - Chapter data
- `pages` - Chapter pages
- `favorites` - User favorites
- `reading_history` - Reading progress
- `notifications` - User notifications
- `news` - News articles
- `announcements` - Site announcements
- `genres` - Manga genres
- `admin_logs` - Admin activity logs

## Future Enhancements

- [ ] Comment system
- [ ] Rating/Review system
- [ ] Social features (follow, messaging)
- [ ] Advanced search filters
- [ ] Download functionality
- [ ] Mobile app
- [ ] CDN integration
- [ ] WebSocket real-time notifications

## License

MIT License - See LICENSE file for details

## Author

samyar545

## Support

For issues and feature requests, please use the GitHub issue tracker.
