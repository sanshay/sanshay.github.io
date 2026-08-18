(async () => {
  const target = document.getElementById('latestPosts');
  try {
    const res = await fetch('posts/posts.json', { cache: 'no-store' });
    const posts = (await res.json()).filter(p => p.draft !== true);
    const postCount = document.getElementById('postCount');
    if (postCount) postCount.textContent = posts.length;

    if (target) {
      const latest = posts.slice(0, 3);
      target.innerHTML = latest.map(post => `
        <a class="post-card" href="post.html?slug=${encodeURIComponent(post.slug)}">
          <div class="meta">${formatDate(post.date)} · ${post.readingTime || '3 min read'}</div>
          <h3>${escapeHtml(post.title)}</h3>
          <p>${escapeHtml(post.description || '')}</p>
          <div class="tags">${(post.tags || []).slice(0,3).map(t => `<span class="tag">${escapeHtml(t)}</span>`).join('')}</div>
        </a>`).join('') || '<div class="loading-card">No posts yet.</div>';
    }
  } catch (err) {
    if (target) target.innerHTML = '<div class="loading-card">Could not load posts.</div>';
  }
})();

(async () => {
  const repoCount = document.getElementById('repoCount');
  if (!repoCount) return;
  try {
    const res = await fetch('https://api.github.com/users/sanshay', { headers: { Accept: 'application/vnd.github+json' } });
    if (!res.ok) return;
    const profile = await res.json();
    if (Number.isFinite(profile.public_repos)) repoCount.textContent = profile.public_repos;
  } catch (_) {}
})();

function formatDate(value) {
  if (!value) return 'Undated';
  const d = new Date(value + 'T00:00:00');
  return d.toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' });
}
function escapeHtml(str='') {
  return str.replace(/[&<>'"]/g, ch => ({'&':'&amp;','<':'&lt;','>':'&gt;',"'":'&#39;','"':'&quot;'}[ch]));
}
