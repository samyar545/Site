async function loadNewsDetail() {
  const params = new URLSearchParams(window.location.search);
  const slug = params.get('slug');
  if (!slug) return;

  const result = await api.getNewsBySlug(slug);
  const news = result.news;

  const newsDetail = document.getElementById('newsDetail');
  newsDetail.innerHTML = `
    <h1>${news.title}</h1>
    ${news.thumbnail ? `<img src="${news.thumbnail}" alt="${news.title}" class="news-image" />` : ''}
    <p class="meta">نویسنده: ${news.author} | تاریخ: ${new Date(news.published_at).toLocaleDateString('fa-IR')}</p>
    <div class="content">${news.content}</div>
  `;

  setupAuthMenu();
}

document.addEventListener('DOMContentLoaded', loadNewsDetail);
