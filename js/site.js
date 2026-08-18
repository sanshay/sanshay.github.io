(() => {
  const year = document.getElementById('year');
  if (year) year.textContent = new Date().getFullYear();

  const progress = document.getElementById('readingProgress');
  if (progress) {
    const updateProgress = () => {
      const max = document.documentElement.scrollHeight - window.innerHeight;
      const value = max > 0 ? Math.min(100, Math.max(0, (window.scrollY / max) * 100)) : 0;
      progress.style.width = `${value}%`;
    };
    updateProgress();
    addEventListener('scroll', updateProgress, { passive: true });
    addEventListener('resize', updateProgress);
  }
})();
