async function loadHome() {
  // Load announcements
  const announcements = await api.getAnnouncements();
  const announcementsSection = document.getElementById('announcementsSection');
  if (announcements.announcements?.length > 0) {
    announcementsSection.innerHTML = `<div class="announcements-banner">${announcements.announcements.map(a => a.message).join(' | ')}</div>`;
  }

  // Load manga
  const manga = await api.getMangaList();
  const mangaList = document.getElementById('mangaList');
  mangaList.innerHTML = manga.manga?.map(m => `
    <div class="manga-card" onclick="window.location.href='/manga.html?slug=${m.slug}'">
      <img src="${m.cover_image}" alt="${m.title}" />
      <h3>${m.title}</h3>
      <p>${m.persian_title}</p>
      <div class="rating">⭐ ${m.rating || 'N/A'}</div>
    </div>
  `).join('') || '<p>No manga found</p>';

  // Load footer settings
  const settings = await api.getSettings();
  document.getElementById('footerText').textContent = settings.settings?.site_footer || '© 2024 Melanga';

  // Setup auth menu
  setupAuthMenu();
}

function searchManga() {
  const query = document.getElementById('searchInput').value;
  if (query) window.location.href = `/search.html?q=${query}`;
}

function setupAuthMenu() {
  const authMenu = document.getElementById('authMenu');
  if (isLoggedIn()) {
    const user = getUser();
    authMenu.innerHTML = `
      <div class="auth-dropdown">
        <a href="/profile.html">${user?.username}</a>
        <div class="dropdown-menu">
          <a href="/notifications.html">اطلاعات</a>
          <a href="/favorites.html">علاقه مندی ها</a>
          <a href="/history.html">تاریخچه</a>
          <a href="#" onclick="logout()">خروج</a>
        </div>
      </div>
    `;
  } else {
    authMenu.innerHTML = `<a href="/login.html">وروود</a> | <a href="/register.html">ثبت نام</a>`;
  }
}

document.addEventListener('DOMContentLoaded', loadHome);
