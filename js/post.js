(async () => {
  const article = document.getElementById('article');
  const slug = new URLSearchParams(location.search).get('slug');
  if (!slug) return showError('Post not found.');

  try {
    const manifestRes = await fetch('posts/posts.json', { cache: 'no-store' });
    const posts = await manifestRes.json();
    const post = posts.find(p => p.slug === slug && p.draft !== true);
    if (!post) return showError('Post not found.');

    const mdRes = await fetch(`posts/${encodeURIComponent(post.file)}`, { cache: 'no-store' });
    if (!mdRes.ok) return showError('Markdown file could not be loaded.');
    const raw = await mdRes.text();
    const body = stripLeadingTitle(stripFrontMatter(raw));
    const html = DOMPurify.sanitize(marked.parse(body));

    document.title = `${post.title} — Sanshay Katyal`;
    article.innerHTML = `
      <header class="article-header">
        <p class="eyebrow">${escapeHtml((post.tags || [])[0] || 'BLOG')}</p>
        <h1>${escapeHtml(post.title)}</h1>
        <p class="description">${escapeHtml(post.description || '')}</p>
        <div class="tags">${(post.tags || []).map(t => `<span class="tag">${escapeHtml(t)}</span>`).join('')}</div>
        <p class="meta">${formatDate(post.date)} · ${escapeHtml(post.readingTime || '')}</p>
      </header>
      <div class="article-content">${html}</div>`;
  } catch (err) {
    showError('Something went wrong while loading this post.');
  }

  function showError(message) {
    article.innerHTML = `<div class="loading-card">${escapeHtml(message)} <a href="blog.html">Back to blog →</a></div>`;
  }
})();

function stripFrontMatter(text) {
  if (!text.startsWith('---')) return text;
  const end = text.indexOf('\n---', 3);
  return end === -1 ? text : text.slice(end + 4).trimStart();
}
function stripLeadingTitle(text) {
  return text.replace(/^#\s+[^\n]+\n+/, '');
}
function formatDate(value) {
  if (!value) return 'Undated';
  const d = new Date(value + 'T00:00:00');
  return d.toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' });
}
function escapeHtml(str='') {
  return str.replace(/[&<>'"]/g, ch => ({'&':'&amp;','<':'&lt;','>':'&gt;',"'":'&#39;','"':'&quot;'}[ch]));
}
