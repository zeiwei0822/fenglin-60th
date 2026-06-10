// 風嶺百貌・六十週年紀念 — 主要互動腳本
// ── Preloader ──
window.addEventListener('load', () => {
  const bar = document.getElementById('preBar');
  if (bar) bar.style.width = '100%';
  setTimeout(() => {
    const pl = document.getElementById('preloader');
    if (pl) pl.classList.add('hide');
    document.body.classList.add('loaded');
    startTypewriter();
  }, 1800);
});

// ── Typewriter ──
function startTypewriter() {
  const text = '風　嶺　百　貌';
  const el = document.getElementById('typeTarget');
  const cur = document.getElementById('typeCursor');
  if (!el) return;
  let i = 0;
  const iv = setInterval(() => {
    el.textContent += text[i++];
    if (i >= text.length) {
      clearInterval(iv);
      setTimeout(() => { if(cur) cur.style.display = 'none'; }, 1500);
    }
  }, 160);
}

// ── Scroll Progress + Back to Top ──
window.addEventListener('scroll', () => {
  const scrolled = window.scrollY;
  const total = document.documentElement.scrollHeight - window.innerHeight;
  const pb = document.getElementById('progress-bar');
  if (pb) pb.style.width = (scrolled / total * 100) + '%';
  const bt = document.getElementById('back-top');
  if (bt) bt.classList.toggle('show', scrolled > 400);
  const mt = document.querySelector('.hero-mountain');
  if (mt) mt.style.transform = `translateY(${scrolled * 0.25}px)`;
  const tlEl = document.querySelector('#tab-history .timeline');
  if (tlEl) {
    const tr = tlEl.getBoundingClientRect();
    if (tr.height > 0) {
      const passed = Math.min(Math.max(window.innerHeight * 0.72 - tr.top, 0), tr.height);
      tlEl.style.setProperty('--tl-progress', (passed / tr.height * 100) + '%');
    }
  }
});

// ── Particles ──
(function() {
  const canvas = document.getElementById('particles');
  if (!canvas) return;
  if (window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  const ctx = canvas.getContext('2d');
  let W, H, pts = [];
  function resize() { W = canvas.width = canvas.offsetWidth; H = canvas.height = canvas.offsetHeight; }
  function init() {
    pts = [];
    for (let i = 0; i < 55; i++) {
      pts.push({ x: Math.random()*W, y: Math.random()*H, r: Math.random()*1.5+0.4,
        vx: (Math.random()-0.5)*0.18, vy: (Math.random()-0.5)*0.18, o: Math.random()*0.5+0.1 });
    }
  }
  function draw() {
    ctx.clearRect(0, 0, W, H);
    pts.forEach(p => {
      p.x += p.vx; p.y += p.vy;
      if (p.x < 0) p.x = W; if (p.x > W) p.x = 0;
      if (p.y < 0) p.y = H; if (p.y > H) p.y = 0;
      ctx.beginPath(); ctx.arc(p.x, p.y, p.r, 0, Math.PI*2);
      ctx.fillStyle = `rgba(212,168,67,${p.o})`; ctx.fill();
    });
    requestAnimationFrame(draw);
  }
  window.addEventListener('resize', () => { resize(); init(); });
  resize(); init(); draw();
})();

// ── Tabs ──
function switchTab(name, btn) {
  document.querySelectorAll('.tab-panel').forEach(p => p.classList.remove('active'));
  document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
  document.getElementById('tab-' + name).classList.add('active');
  btn.classList.add('active');
  moveTabIndicator(btn);
  setTimeout(() => {
    document.querySelectorAll('#tab-' + name + ' .timeline-item, #tab-' + name + ' .fade-in')
      .forEach(el => el.classList.add('visible'));
    if (name === 'map') {
      const mimg = document.querySelector('#mapContainer img');
      if (mimg && !mimg.getAttribute('src') && mimg.dataset.src) mimg.src = mimg.dataset.src;
      if (window.mapReset) window.mapReset();
    }
    if (name === 'history') window.dispatchEvent(new Event('scroll'));
    if (name === 'blessing') window.dispatchEvent(new Event('blessingTabShown'));
  }, 50);
}
function moveTabIndicator(btn) {
  const ind = document.getElementById('tabIndicator');
  if (!ind || !btn || !btn.classList.contains('tab-btn')) return;
  ind.style.width = btn.offsetWidth + 'px';
  ind.style.transform = 'translateX(' + btn.offsetLeft + 'px)';
}
window.addEventListener('load', () => setTimeout(() => moveTabIndicator(document.querySelector('.tab-btn.active')), 120));
window.addEventListener('resize', () => moveTabIndicator(document.querySelector('.tab-btn.active')));
if (document.fonts && document.fonts.ready) document.fonts.ready.then(() => moveTabIndicator(document.querySelector('.tab-btn.active')));

// ── Carousel with auto-play ──
let cur = 0;
let autoTimer, progressTimer, progressVal = 0;
const INTERVAL = 5000;
function moveSlide(d) { cur = (cur + d + 3) % 3; resetAuto(); updateCarousel(); }
function goSlide(n) { cur = n; resetAuto(); updateCarousel(); }
function updateCarousel() {
  const t = document.getElementById('carouselTrack');
  if (t) t.style.transform = `translateX(-${cur * 100}%)`;
  document.querySelectorAll('.dot').forEach((d, i) => d.classList.toggle('active', i === cur));
}
function resetAuto() {
  clearInterval(autoTimer); clearInterval(progressTimer);
  progressVal = 0;
  const fill = document.getElementById('carouselFill');
  if (fill) fill.style.width = '0%';
  startAuto();
}
function startAuto() {
  progressTimer = setInterval(() => {
    progressVal += 100 / (INTERVAL / 100);
    const fill = document.getElementById('carouselFill');
    if (fill) fill.style.width = Math.min(progressVal, 100) + '%';
  }, 100);
  autoTimer = setInterval(() => {
    cur = (cur + 1) % 3;
    updateCarousel();
    progressVal = 0;
  }, INTERVAL);
}
if (document.getElementById('carouselTrack')) startAuto();

// ── Counter animation ──
function animateCounter(el) {
  const target = parseInt(el.dataset.target);
  const dur = 1400;
  const t0 = performance.now();
  function tick(t) {
    const p = Math.min((t - t0) / dur, 1);
    const eased = 1 - Math.pow(1 - p, 3);
    el.textContent = Math.round(target * eased);
    if (p < 1) requestAnimationFrame(tick);
  }
  requestAnimationFrame(tick);
}
const counterObs = new IntersectionObserver(entries => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      e.target.classList.add('visible');
      const num = e.target.querySelector('.stat-num');
      if (num && !num.dataset.counted) { num.dataset.counted = '1'; animateCounter(num); }
    }
  });
}, { threshold: 0.3 });
document.querySelectorAll('.stat-item').forEach(el => counterObs.observe(el));

// ── IntersectionObserver general ──
const obs = new IntersectionObserver(entries => {
  entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('visible'); });
}, { threshold: 0.15 });
document.querySelectorAll('.timeline-item, .fade-in').forEach(el => obs.observe(el));
setTimeout(() => {
  document.querySelectorAll('#tab-history .timeline-item').forEach(el => el.classList.add('visible'));
}, 2200);

// ── Map hotspot → Lightbox ──
['click','touchend'].forEach(evtType => {
  document.addEventListener(evtType, function(e) {
    const hs = e.target.closest('.hs');
    if (hs) {
      e.stopPropagation();
      e.preventDefault();
      openLightbox(hs.dataset.name, hs.dataset.desc, hs.dataset.img || null, hs.dataset.gallery || null);
    }
  }, { passive: false });
});

function openLightbox(name, desc, imgSrc, galleryJson) {
  const lb      = document.getElementById('mapLightbox');
  const imgWrap = document.querySelector('.lightbox-img-wrap');
  const titleEl = document.getElementById('lightboxTitle');
  const descEl  = document.getElementById('lightboxDesc');
  if (!lb || !imgWrap) return;
  imgWrap.innerHTML = '';

  if (galleryJson) {
    let items, idx = 0;
    try { items = JSON.parse(galleryJson); } catch(e) { items = []; }
    if (!items.length) return;

    function updateMeta() {
      titleEl.textContent = items[idx].title || name;
      descEl.textContent  = items[idx].desc  || desc;
    }

    const wrap = document.createElement('div');
    wrap.style.cssText = 'position:relative;background:#1a140e;';

    const imgEl = document.createElement('img');
    imgEl.style.cssText = 'width:100%;height:auto;display:block;';
    wrap.appendChild(imgEl);

    // counter bar
    const counter = document.createElement('div');
    counter.style.cssText = 'text-align:center;padding:0.5rem;font-family:sans-serif;font-size:0.75rem;color:var(--ink-faint);letter-spacing:0.15em;background:var(--parchment);border-top:1px solid var(--border);';
    wrap.appendChild(counter);

    // prev / next
    ['prev','next'].forEach(dir => {
      const btn = document.createElement('button');
      btn.textContent = dir==='prev' ? '←' : '→';
      btn.style.cssText = 'position:absolute;top:45%;transform:translateY(-50%);' + (dir==='prev'?'left:0':'right:0') + ';width:36px;height:52px;background:rgba(26,20,14,0.55);border:none;color:rgba(255,255,255,0.85);font-size:1.1rem;cursor:pointer;z-index:5;transition:background 0.2s;';
      btn.onmouseenter = () => btn.style.background = 'rgba(184,145,42,0.75)';
      btn.onmouseleave = () => btn.style.background = 'rgba(26,20,14,0.55)';
      btn.onclick = () => { idx=(idx+(dir==='prev'?-1:1)+items.length)%items.length; update(); };
      wrap.appendChild(btn);
    });

    function update() {
      imgEl.classList.add('fade-switching');
      setTimeout(() => {
        imgEl.src = items[idx].src;
        imgEl.alt = items[idx].title || name;
        counter.textContent = (idx+1) + ' / ' + items.length;
        updateMeta();
        imgEl.classList.remove('fade-switching');
      }, 300);
    }
    window._lbStep = d => { idx = (idx + d + items.length) % items.length; update(); };
    update();
    imgWrap.appendChild(wrap);

  } else if (imgSrc) {
    window._lbStep = null;
    titleEl.textContent = name;
    descEl.textContent  = desc;
    const img = document.createElement('img');
    img.src = imgSrc; img.alt = name;
    img.style.cssText = 'width:100%;height:auto;display:block;';
    imgWrap.appendChild(img);

  } else {
    window._lbStep = null;
    titleEl.textContent = name;
    descEl.textContent  = desc;
    const ph = document.createElement('div');
    ph.style.cssText = 'width:100%;min-height:200px;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:1rem;background:#1a140e;';
    ph.innerHTML = '<div style="font-size:3rem;opacity:0.25;">📷</div><div style="font-family:sans-serif;font-size:0.85rem;color:rgba(250,247,242,0.3);">尚無照片，歡迎提供</div>';
    imgWrap.appendChild(ph);
  }
  lb.classList.add('show');
  document.body.style.overflow = 'hidden';
}

function closeLightbox(e) {
  if (e && e.target !== document.getElementById('mapLightbox') && !e.target.classList.contains('lightbox-close')) return;
  document.getElementById('mapLightbox').classList.remove('show');
  document.body.style.overflow = '';
}
document.addEventListener('keydown', e => {
  const lb = document.getElementById('mapLightbox');
  if (!lb || !lb.classList.contains('show')) return;
  if (e.key === 'Escape') {
    lb.classList.remove('show');
    document.body.style.overflow = '';
  } else if (e.key === 'ArrowLeft' && window._lbStep) {
    window._lbStep(-1);
  } else if (e.key === 'ArrowRight' && window._lbStep) {
    window._lbStep(1);
  }
});

// ── Map Pan & Zoom ──
(function() {
  const viewport = document.getElementById('mapViewport');
  const container = document.getElementById('mapContainer');
  if (!viewport || !container) return;

  let scale = 1, minScale = 0.5, maxScale = 4;
  let tx = 0, ty = 0;
  let dragging = false, startX, startY, startTx, startTy;

  function clamp(val, min, max) { return Math.min(Math.max(val, min), max); }

  function constrainPan() {
    const vw = viewport.offsetWidth, vh = viewport.offsetHeight;
    const iw = container.offsetWidth * scale, ih = container.offsetHeight * scale;
    tx = clamp(tx, Math.min(0, vw - iw), Math.max(0, vw - iw));
    ty = clamp(ty, Math.min(0, vh - ih), Math.max(0, vh - ih));
    container.style.transform = `translate(${tx}px, ${ty}px) scale(${scale})`;
  }

  function initMap() {
    requestAnimationFrame(() => {
      const img = container.querySelector('img');
      if (!img) return;
      const doInit = () => {
        const vw = viewport.offsetWidth;
        if (!vw || !img.naturalWidth) { setTimeout(initMap, 50); return; }
        scale = Math.min(vw / img.naturalWidth, 1);
        tx = 0; ty = 0;
        constrainPan();
      };
      if (img.complete && img.naturalWidth) doInit();
      else img.addEventListener('load', doInit);
    });
  }
  const mapImg0 = container.querySelector('img');
  if (mapImg0 && mapImg0.getAttribute('src')) initMap();

  // Disable pan/zoom on mobile
  if (window.innerWidth <= 768) return;
  viewport.addEventListener('mousedown', e => {
    if (e.target.closest('.hs')) return;
    dragging = true;
    startX = e.clientX; startY = e.clientY;
    startTx = tx; startTy = ty;
    viewport.classList.add('grabbing');
    e.preventDefault();
  });
  window.addEventListener('mousemove', e => {
    if (!dragging) return;
    tx = startTx + (e.clientX - startX);
    ty = startTy + (e.clientY - startY);
    constrainPan();
  });
  window.addEventListener('mouseup', () => {
    dragging = false;
    viewport.classList.remove('grabbing');
  });

  let lastTouchX, lastTouchY, lastDist;
  viewport.addEventListener('touchstart', e => {
    if (e.touches.length === 1) {
      lastTouchX = e.touches[0].clientX;
      lastTouchY = e.touches[0].clientY;
    } else if (e.touches.length === 2) {
      lastDist = Math.hypot(e.touches[0].clientX - e.touches[1].clientX, e.touches[0].clientY - e.touches[1].clientY);
    }
    e.preventDefault();
  }, { passive: false });

  viewport.addEventListener('touchmove', e => {
    if (e.touches.length === 1) {
      tx += e.touches[0].clientX - lastTouchX;
      ty += e.touches[0].clientY - lastTouchY;
      lastTouchX = e.touches[0].clientX;
      lastTouchY = e.touches[0].clientY;
      constrainPan();
    } else if (e.touches.length === 2) {
      const dist = Math.hypot(e.touches[0].clientX - e.touches[1].clientX, e.touches[0].clientY - e.touches[1].clientY);
      scale = clamp(scale * (dist / lastDist), minScale, maxScale);
      lastDist = dist;
      constrainPan();
    }
    e.preventDefault();
  }, { passive: false });

  viewport.addEventListener('wheel', e => {
    e.preventDefault();
    const rect = viewport.getBoundingClientRect();
    const mx = e.clientX - rect.left, my = e.clientY - rect.top;
    const delta = e.deltaY < 0 ? 0.12 : -0.12;
    const newScale = clamp(scale + delta, minScale, maxScale);
    tx = mx - (mx - tx) * (newScale / scale);
    ty = my - (my - ty) * (newScale / scale);
    scale = newScale;
    constrainPan();
  }, { passive: false });

  window.mapZoom = function(d) {
    const cx = viewport.offsetWidth / 2, cy = viewport.offsetHeight / 2;
    const newScale = clamp(scale + d, minScale, maxScale);
    tx = cx - (cx - tx) * (newScale / scale);
    ty = cy - (cy - ty) * (newScale / scale);
    scale = newScale;
    constrainPan();
  };
  window.mapReset = function() { initMap(); };
})();

// ── Guestbook ──
const GB_KEY = 'fenglin_guestbook';

function loadGuestbook() {
  const wall = document.getElementById('guestbookWall');
  if (!wall) return;
  let entries = [];
  try { entries = JSON.parse(localStorage.getItem(GB_KEY) || '[]'); } catch(e) {}
  wall.innerHTML = '';
  if (!entries.length) {
    wall.innerHTML = '<div class="gb-empty">還沒有留言，成為第一個留下祝福的人！</div>';
    return;
  }
  entries.slice().reverse().forEach(e => {
    const card = document.createElement('div');
    card.className = 'gb-card';
    card.innerHTML =
      '<div class="gb-card-quote">「</div>' +
      '<div class="gb-card-msg">' + escapeHtml(e.msg) + '</div>' +
      '<div class="gb-card-name">' + escapeHtml(e.name) + '</div>' +
      (e.role ? '<div class="gb-card-role">' + escapeHtml(e.role) + '</div>' : '') +
      '<div class="gb-card-time">' + e.time + '</div>';
    wall.appendChild(card);
  });
}

function submitGuestbook() {
  const name = document.getElementById('gbName').value.trim();
  const role = document.getElementById('gbRole').value.trim();
  const msg  = document.getElementById('gbMsg').value.trim();
  if (!name || !msg) {
    alert('請填寫名字和祝福內容！');
    return;
  }
  let entries = [];
  try { entries = JSON.parse(localStorage.getItem(GB_KEY) || '[]'); } catch(e) {}
  const now = new Date();
  entries.push({
    name, role, msg,
    time: now.getFullYear() + '.' + String(now.getMonth()+1).padStart(2,'0') + '.' + String(now.getDate()).padStart(2,'0')
  });
  localStorage.setItem(GB_KEY, JSON.stringify(entries));
  document.getElementById('gbName').value = '';
  document.getElementById('gbRole').value = '';
  document.getElementById('gbMsg').value = '';
  document.getElementById('gbCount').textContent = '0 / 120';
  loadGuestbook();
}

function escapeHtml(str) {
  return str.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
}

// textarea counter
const gbMsg = document.getElementById('gbMsg');
if (gbMsg) {
  gbMsg.addEventListener('input', () => {
    document.getElementById('gbCount').textContent = gbMsg.value.length + ' / 120';
  });
}

loadGuestbook();

// ── Top Nav scroll ──
window.addEventListener('scroll', () => {
  document.getElementById('topNav').classList.toggle('scrolled', window.scrollY > 80);
});

// ── 院歌播放器 ──
(function() {
  const btn = document.getElementById('anthem-btn');
  const audio = document.getElementById('anthemAudio');
  if (!btn || !audio) return;
  audio.volume = 0.75;
  audio.addEventListener('play', () => {
    btn.classList.add('playing');
    btn.setAttribute('aria-label', '暫停院歌');
  });
  audio.addEventListener('pause', () => {
    btn.classList.remove('playing');
    btn.setAttribute('aria-label', '播放院歌');
  });
  btn.addEventListener('click', () => {
    if (audio.paused) {
      audio.play().catch(() => { btn.classList.add('hidden'); });
    } else {
      audio.pause();
    }
  });
})();

