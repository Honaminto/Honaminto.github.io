// ── ATHLETICS LIGHTBOX ──────────────────────────────────────────
(function () {
  const overlay   = document.getElementById('lightbox');
  const lbImg     = document.getElementById('lb-img');
  const lbCounter = document.getElementById('lb-counter');
  const lbThumbs  = document.getElementById('lb-thumbs');
  const lbLabel   = document.getElementById('lb-sport-label');
  const btnClose  = document.getElementById('lb-close');
  const btnPrev   = document.getElementById('lb-prev');
  const btnNext   = document.getElementById('lb-next');

  const LABELS = { wushu: 'Wushu', sanda: 'Sanda · MMA', ballroom: 'Ballroom' };

  let images = [];
  let current = 0;

  // ── Open gallery
  document.querySelectorAll('.gallery-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const sport = btn.dataset.sport;
      const imgs  = (GALLERIES[sport] || []);

      if (imgs.length === 0) {
        showEmpty(sport); return;
      }
      openGallery(sport, imgs);
    });
  });

  function openGallery(sport, imgs) {
    images  = imgs;
    current = 0;
    lbLabel.textContent = LABELS[sport] || sport;

    // Build thumbnails
    lbThumbs.innerHTML = '';
    imgs.forEach((src, i) => {
      const thumb = document.createElement('button');
      thumb.className = 'lb-thumb';
      thumb.innerHTML = `<img src="${src}" alt="Photo ${i+1}" loading="lazy"/>`;
      thumb.addEventListener('click', () => goTo(i));
      lbThumbs.appendChild(thumb);
    });

    goTo(0);
    overlay.classList.add('lb-open');
    document.body.style.overflow = 'hidden';
  }

  function showEmpty(sport) {
    images  = [];
    current = 0;
    lbLabel.textContent = LABELS[sport] || sport;
    lbThumbs.innerHTML  = '<p class="lb-empty">Photos coming soon.</p>';
    lbImg.src = '';
    lbCounter.textContent = '';
    overlay.classList.add('lb-open');
    document.body.style.overflow = 'hidden';
  }

  function goTo(index) {
    current = Math.max(0, Math.min(index, images.length - 1));
    lbImg.classList.add('lb-loading');
    const newImg = new Image();
    newImg.onload = () => {
      lbImg.src = images[current];
      lbImg.classList.remove('lb-loading');
    };
    newImg.onerror = () => { lbImg.src = ''; lbImg.classList.remove('lb-loading'); };
    newImg.src = images[current];
    lbCounter.textContent = `${current + 1} / ${images.length}`;
    // Active thumb
    document.querySelectorAll('.lb-thumb').forEach((t, i) => {
      t.classList.toggle('lb-thumb--active', i === current);
    });
  }

  function close() {
    overlay.classList.remove('lb-open');
    document.body.style.overflow = '';
  }

  btnClose.addEventListener('click', close);
  btnPrev.addEventListener('click',  () => goTo(current - 1));
  btnNext.addEventListener('click',  () => goTo(current + 1));

  // Click backdrop to close
  overlay.addEventListener('click', e => { if (e.target === overlay) close(); });

  // Keyboard
  document.addEventListener('keydown', e => {
    if (!overlay.classList.contains('lb-open')) return;
    if (e.key === 'Escape')      close();
    if (e.key === 'ArrowLeft')   goTo(current - 1);
    if (e.key === 'ArrowRight')  goTo(current + 1);
  });

  // Touch swipe
  let touchX = null;
  overlay.addEventListener('touchstart', e => { touchX = e.touches[0].clientX; }, { passive: true });
  overlay.addEventListener('touchend',   e => {
    if (touchX === null) return;
    const diff = touchX - e.changedTouches[0].clientX;
    if (Math.abs(diff) > 50) goTo(diff > 0 ? current + 1 : current - 1);
    touchX = null;
  }, { passive: true });
})();
