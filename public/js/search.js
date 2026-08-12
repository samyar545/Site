async function search() {
  const query = document.getElementById('searchInput').value;
  if (!query) return;

  const result = await api.search(query);
  const results = document.getElementById('results');
  results.innerHTML = result.manga?.map(m => `
    <div class="manga-card" onclick="window.location.href='/manga.html?slug=${m.slug}'">
      <img src="${m.cover_image}" alt="${m.title}" />
      <h3>${m.title}</h3>
      <p>${m.persian_title}</p>
      <div class="rating">⭐ ${m.rating || 'N/A'}</div>
      <div class="views">👁️ ${m.views}</div>
    </div>
  `).join('') || '<p>نتیجه ای یافت نشد</p>';
}

const params = new URLSearchParams(window.location.search);
if (params.get('q')) {
  document.getElementById('searchInput').value = params.get('q');
  search();
}

document.getElementById('searchInput').addEventListener('input', (e) => {
  if (e.target.value.length > 2) {
    api.suggestions(e.target.value).then(r => {
      // Show suggestions dropdown
      console.log(r.suggestions);
    });
  }
});

setupAuthMenu();
