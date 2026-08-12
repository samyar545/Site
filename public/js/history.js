async function loadHistory() {
  if (!isLoggedIn()) return window.location.href = '/login.html';

  const result = await api.getHistory();
  const historyList = document.getElementById('historyList');
  historyList.innerHTML = result.history?.map(h => `
    <div class="history-item">
      <img src="${h.cover_image}" alt="${h.title}" class="thumbnail" />
      <div class="info">
        <h3>${h.title}</h3>
        <p>${h.persian_title}</p>
        <p>آخرین فصل: ${h.chapter_number}</p>
        <p class="date">آخرین خواندن: ${new Date(h.last_read_at).toLocaleDateString('fa-IR')}</p>
        <a href="/reader.html?manga=${h.slug}&chapter=${h.chapter_number}" class="btn-small">ادامه خواندن</a>
      </div>
    </div>
  `).join('') || '<p>تاریخچه خالی است</p>';
}

async function clearHistory() {
  if (confirm('آیا مطمئن هستید؟')) {
    await api.clearHistory();
    loadHistory();
  }
}

document.addEventListener('DOMContentLoaded', loadHistory);
