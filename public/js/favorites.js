async function loadFavorites() {
  if (!isLoggedIn()) return window.location.href = '/login.html';

  const result = await api.getFavorites();
  const favoritesList = document.getElementById('favoritesList');
  favoritesList.innerHTML = result.favorites?.map(m => `
    <div class="manga-card" onclick="window.location.href='/manga.html?slug=${m.slug}'">
      <img src="${m.cover_image}" alt="${m.title}" />
      <h3>${m.title}</h3>
      <p>${m.persian_title}</p>
      <button onclick="event.stopPropagation(); removeFavorite(${m.id})" class="btn-remove">حذف</button>
    </div>
  `).join('') || '<p>علاقه مندی ای یافت نشد</p>';
}

async function removeFavorite(mangaId) {
  await api.removeFavorite(mangaId);
  loadFavorites();
}

document.addEventListener('DOMContentLoaded', loadFavorites);
