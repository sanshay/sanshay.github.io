import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, '..');
const postsDir = path.join(root, 'posts');

const files = fs.readdirSync(postsDir)
  .filter(file => file.endsWith('.md'))
  .sort();

const posts = files.map(file => {
  const raw = fs.readFileSync(path.join(postsDir, file), 'utf8');
  const { data, body } = parseFrontMatter(raw);
  const slug = data.slug || file.replace(/\.md$/i, '');
  return {
    file,
    slug,
    title: data.title || slug,
    date: data.date || '',
    description: data.description || '',
    tags: parseArray(data.tags),
    draft: parseBool(data.draft),
    readingTime: `${Math.max(1, Math.ceil(wordCount(body) / 220))} min read`
  };
}).sort((a, b) => (b.date || '').localeCompare(a.date || ''));

fs.writeFileSync(path.join(postsDir, 'posts.json'), JSON.stringify(posts, null, 2) + '\n');
console.log(`Generated posts/posts.json with ${posts.length} post(s).`);

function parseFrontMatter(text) {
  if (!text.startsWith('---')) return { data: {}, body: text };
  const end = text.indexOf('\n---', 3);
  if (end === -1) return { data: {}, body: text };
  const block = text.slice(4, end).trim();
  const body = text.slice(end + 4).trim();
  const data = {};
  for (const line of block.split(/\r?\n/)) {
    if (!line.trim() || line.trim().startsWith('#')) continue;
    const idx = line.indexOf(':');
    if (idx === -1) continue;
    const key = line.slice(0, idx).trim();
    let value = line.slice(idx + 1).trim();
    value = value.replace(/^['"]|['"]$/g, '');
    data[key] = value;
  }
  return { data, body };
}

function parseArray(value) {
  if (!value) return [];
  const v = String(value).trim();
  if (v.startsWith('[') && v.endsWith(']')) {
    return v.slice(1, -1).split(',').map(s => s.trim().replace(/^['"]|['"]$/g, '')).filter(Boolean);
  }
  return v.split(',').map(s => s.trim()).filter(Boolean);
}
function parseBool(value) { return String(value).toLowerCase() === 'true'; }
function wordCount(body) { return (body.match(/\b[\w'-]+\b/g) || []).length; }
