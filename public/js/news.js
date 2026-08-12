async function loadNews() {
  const result = await api.getNewsList();
  const newsList = document.getElementById('newsList');
  newsList.innerHTML = result.news?.map(n => `
    <article class="news-card" onclick="window.location.href='/news-detail.html?slug=${n.slug}'">
      ${n.thumbnail ? `<img src="${n.thumbnail}" alt="${n.title}" />` : ''}
      <h2>${n.title}</h2>
      <p class="author">نویسنده: ${n.author}</p>
      <p class="date">${new Date(n.published_at).toLocaleDateString('fa-IR')}</p>
    </article>
  `).join('') || '<p>بدون اخبار</p>';

  setupAuthMenu();
}

document.addEventListener('DOMContentLoaded', loadNews);
