let posts = [];
let activeTag = 'All';

(async () => {
  const list = document.getElementById('postList');
  try {
    const res = await fetch('posts/posts.json', { cache: 'no-store' });
    posts = (await res.json()).filter(p => p.draft !== true);
    setupTags();
    render();
  } catch (err) {
    list.innerHTML = '<div class="loading-card">Could not load posts.json. Run <code>npm run build:posts</code>.</div>';
  }
})();

document.getElementById('searchInput')?.addEventListener('input', render);

function setupTags() {
  const tags = ['All', ...new Set(posts.flatMap(p => p.tags || []))];
  const filter = document.getElementById('tagFilter');
  filter.innerHTML = tags.map(tag => `<button class="filter-btn ${tag === 'All' ? 'active' : ''}" data-tag="${escapeAttr(tag)}">${escapeHtml(tag)}</button>`).join('');
  filter.addEventListener('click', (e) => {
    const btn = e.target.closest('[data-tag]');
    if (!btn) return;
    activeTag = btn.dataset.tag;
    filter.querySelectorAll('.filter-btn').forEach(b => b.classList.toggle('active', b === btn));
    render();
  });
}

function render() {
  const query = (document.getElementById('searchInput')?.value || '').trim().toLowerCase();
  const filtered = posts.filter(post => {
    const matchesTag = activeTag === 'All' || (post.tags || []).includes(activeTag);
    const haystack = `${post.title} ${post.description || ''} ${(post.tags || []).join(' ')}`.toLowerCase();
    return matchesTag && (!query || haystack.includes(query));
  });

  const list = document.getElementById('postList');
  if (!filtered.length) {
    list.innerHTML = '<div class="loading-card">No posts match your search.</div>';
    return;
  }
  list.innerHTML = filtered.map(post => `
    <a class="post-row" href="post.html?slug=${encodeURIComponent(post.slug)}">
      <div class="meta">${formatDate(post.date)}<br>${post.readingTime || ''}</div>
      <div>
        <h2>${escapeHtml(post.title)}</h2>
        <p>${escapeHtml(post.description || '')}</p>
      </div>
      <div class="arrow">↗</div>
    </a>`).join('');
}

function formatDate(value) {
  if (!value) return 'Undated';
  const d = new Date(value + 'T00:00:00');
  return d.toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' });
}
function escapeHtml(str='') {
  return str.replace(/[&<>'"]/g, ch => ({'&':'&amp;','<':'&lt;','>':'&gt;',"'":'&#39;','"':'&quot;'}[ch]));
}
function escapeAttr(str='') { return escapeHtml(str); }
