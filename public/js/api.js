const API_URL = 'http://localhost:3000/api';

const api = {
  async request(method, endpoint, data = null) {
    const options = {
      method,
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      }
    };
    if (data) options.body = JSON.stringify(data);
    const response = await fetch(`${API_URL}${endpoint}`, options);
    return response.json();
  },

  // Auth
  register: (username, email, password) => api.request('POST', '/auth/register', { username, email, password }),
  login: (email, password) => api.request('POST', '/auth/login', { email, password }),
  getProfile: () => api.request('GET', '/auth/profile'),
  updateProfile: (data) => api.request('PUT', '/auth/profile', data),
  changePassword: (currentPassword, newPassword) => api.request('POST', '/auth/change-password', { currentPassword, newPassword }),

  // Manga
  getMangaList: (type, status, genre, page = 1) => api.request('GET', `/manga?type=${type || ''}&status=${status || ''}&genre=${genre || ''}&page=${page}`),
  getMangaBySlug: (slug) => api.request('GET', `/manga/${slug}`),
  createManga: (data) => api.request('POST', '/manga', data),
  updateManga: (id, data) => api.request('PUT', `/manga/${id}`, data),
  deleteManga: (id) => api.request('DELETE', `/manga/${id}`),

  // Chapters
  getChapters: (mangaId) => api.request('GET', `/chapters/manga/${mangaId}`),
  getChapter: (mangaSlug, chapterNum) => api.request('GET', `/chapters/${mangaSlug}/${chapterNum}`),
  createChapter: (data) => api.request('POST', '/chapters', data),
  updateChapter: (id, data) => api.request('PUT', `/chapters/${id}`, data),
  deleteChapter: (id) => api.request('DELETE', `/chapters/${id}`),
  uploadPages: (chapterId, files) => {
    const formData = new FormData();
    files.forEach(f => formData.append('pages', f));
    return fetch(`${API_URL}/chapters/${chapterId}/pages`, {
      method: 'POST',
      headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` },
      body: formData
    }).then(r => r.json());
  },

  // Genres
  getGenres: () => api.request('GET', '/genres'),
  createGenre: (data) => api.request('POST', '/genres', data),
  updateGenre: (id, data) => api.request('PUT', `/genres/${id}`, data),
  deleteGenre: (id) => api.request('DELETE', `/genres/${id}`),

  // News
  getNewsList: () => api.request('GET', '/news'),
  getNewsBySlug: (slug) => api.request('GET', `/news/${slug}`),
  createNews: (data) => api.request('POST', '/news', data),
  updateNews: (id, data) => api.request('PUT', `/news/${id}`, data),
  deleteNews: (id) => api.request('DELETE', `/news/${id}`),

  // Notifications
  getNotifications: () => api.request('GET', '/notifications'),
  markAsRead: (id) => api.request('PUT', `/notifications/${id}/read`),
  markAllAsRead: () => api.request('PUT', '/notifications/read-all'),
  deleteNotification: (id) => api.request('DELETE', `/notifications/${id}`),
  sendNotification: (data) => api.request('POST', '/notifications/send', data),

  // Search
  search: (q) => api.request('GET', `/search?q=${q}`),
  suggestions: (q) => api.request('GET', `/search/suggestions?q=${q}`),

  // Announcements
  getAnnouncements: () => api.request('GET', '/announcements'),
  createAnnouncement: (data) => api.request('POST', '/announcements', data),
  updateAnnouncement: (id, data) => api.request('PUT', `/announcements/${id}`, data),
  deleteAnnouncement: (id) => api.request('DELETE', `/announcements/${id}`),

  // Favorites
  addFavorite: (mangaId) => api.request('POST', '/favorites', { mangaId }),
  removeFavorite: (mangaId) => api.request('DELETE', `/favorites/${mangaId}`),
  getFavorites: () => api.request('GET', '/favorites'),
  isFavorite: (mangaId) => api.request('GET', `/favorites/${mangaId}/check`),

  // History
  addToHistory: (mangaId, chapterId) => api.request('POST', '/history', { mangaId, chapterId }),
  getHistory: () => api.request('GET', '/history'),
  clearHistory: () => api.request('DELETE', '/history'),

  // Settings
  getSettings: () => api.request('GET', '/settings'),
  updateSettings: (data) => api.request('PUT', '/settings', data),

  // Admin
  getStats: () => api.request('GET', '/admin/stats'),
  getUsers: () => api.request('GET', '/admin/users'),
  updateUserRole: (data) => api.request('PUT', '/admin/users/role', data),
  getLogs: () => api.request('GET', '/admin/logs'),
};

function logout() {
  localStorage.removeItem('token');
  localStorage.removeItem('user');
  window.location.href = '/';
}

function isLoggedIn() {
  return !!localStorage.getItem('token');
}

function getUser() {
  const user = localStorage.getItem('user');
  return user ? JSON.parse(user) : null;
}
