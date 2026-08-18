# Sanshay Katyal — Markdown Blog

A no-framework static blog designed for GitHub Pages.

## Add a new blog post

1. Create a new `.md` file inside `posts/`.
2. Add front matter at the top:

```md
---
title: "My post title"
date: "2026-08-18"
description: "A one-line summary shown on the blog page."
tags: ["Embedded", "IoT"]
draft: false
---

# My post title

Write the article here in Markdown.
```

3. Rebuild the blog manifest:

```bash
npm run build:posts
```

4. Commit and push the changes to GitHub.

## GitHub Pages

If this repository is your `sanshay.github.io` repository, push these files to the repository root. In GitHub:

- Settings → Pages
- Deploy from a branch
- Branch: `main`
- Folder: `/ (root)`

## How it works

GitHub Pages cannot automatically list files inside a folder. `scripts/generate-posts.mjs` scans every `.md` file in `posts/` and generates `posts/posts.json`. The website uses that JSON file to build the homepage and blog index, while `post.html` renders the Markdown dynamically.

Markdown rendering uses `marked` and is sanitized with `DOMPurify` before being inserted into the page.
