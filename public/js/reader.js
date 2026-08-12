const params = new URLSearchParams(window.location.search);
const mangaSlug = params.get('manga');
const chapterNum = params.get('chapter');
let currentPages = [];
let prevChapter = null;
let nextChapter = null;

async function loadChapter() {
  if (!mangaSlug || !chapterNum) return;

  const result = await api.getChapter(mangaSlug, chapterNum);
  const chapter = result.chapter;
  const pages = result.pages || [];
  const manga = result.manga;
  prevChapter = result.prev;
  nextChapter = result.next;

  document.getElementById('mangaTitle').textContent = manga.title;
  document.getElementById('chapterInfo').textContent = `فصل ${chapter.chapter_number}: ${chapter.title}`;

  const pagesContainer = document.getElementById('pagesContainer');
  pagesContainer.innerHTML = pages.map(p => `<img src="${p.image_url}" alt="صفحه ${p.page_number}" class="page-img" />`).join('');

  // Store in history
  if (isLoggedIn()) {
    await api.addToHistory(manga.id, chapter.id);
  }

  // Update navigation buttons
  document.getElementById('prevBtn').disabled = !prevChapter;
  document.getElementById('nextBtn').disabled = !nextChapter;
  document.getElementById('prevBtn2').disabled = !prevChapter;
  document.getElementById('nextBtn2').disabled = !nextChapter;
}

function prevChapter() {
  if (prevChapter) {
    window.location.href = `/reader.html?manga=${mangaSlug}&chapter=${prevChapter.chapter_number}`;
  }
}

function nextChapter() {
  if (nextChapter) {
    window.location.href = `/reader.html?manga=${mangaSlug}&chapter=${nextChapter.chapter_number}`;
  }
}

function selectChapter() {
  const selected = document.getElementById('chapterSelect').value;
  if (selected) {
    window.location.href = `/reader.html?manga=${mangaSlug}&chapter=${selected}`;
  }
}

function goHome() {
  window.location.href = '/';
}

document.addEventListener('DOMContentLoaded', loadChapter);
