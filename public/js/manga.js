async function loadMangaDetail() {
  const params = new URLSearchParams(window.location.search);
  const slug = params.get('slug');
  if (!slug) return;

  const result = await api.getMangaBySlug(slug);
  const manga = result.manga;
  const genres = result.genres || [];
  const chapters = result.chapters || [];

  const mangaDetail = document.getElementById('mangaDetail');
  mangaDetail.innerHTML = `
    <div class="manga-header">
      <img src="${manga.cover_image}" alt="${manga.title}" class="cover" />
      <div class="info">
        <h1>${manga.title}</h1>
        <p class="subtitle">${manga.persian_title}</p>
        <div class="details">
          <p><strong>نویسنده:</strong> ${manga.author}</p>
          <p><strong>هنرمند:</strong> ${manga.artist}</p>
          <p><strong>نوع:</strong> ${manga.type}</p>
          <p><strong>وضعیت:</strong> ${manga.status}</p>
          <p><strong>سال انتشار:</strong> ${manga.release_year}</p>
        </div>
        <p class="description">${manga.description}</p>
        <div class="genres">${genres.map(g => `<span class="badge">${g.name}</span>`).join('')}</div>
        <div class="actions">
          <button onclick="addToFavorites(${manga.id})">❤️ علاقه مندی</button>
        </div>
      </div>
    </div>
  `;

  const chaptersList = document.getElementById('chaptersList');
  chaptersList.innerHTML = chapters.map(c => `
    <div class="chapter-item">
      <a href="/reader.html?manga=${slug}&chapter=${c.chapter_number}">
        فصل ${c.chapter_number}: ${c.title}
      </a>
      <span class="date">${new Date(c.release_date).toLocaleDateString('fa-IR')}</span>
    </div>
  `).join('');

  setupAuthMenu();
}

async function addToFavorites(mangaId) {
  if (!isLoggedIn()) return alert('لطفا وارد شوید');
  await api.addFavorite(mangaId);
  alert('به علاقه مندی ها افزوده شد');
}

document.addEventListener('DOMContentLoaded', loadMangaDetail);
