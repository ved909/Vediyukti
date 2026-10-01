/* Vediyukti — site scripts
   1. Contact form -> WhatsApp        4. Scroll effects (progress, hero, nav)
   2. WhatsApp button + toast         5. Word / block reveals
   3. Instagram strip (optional)      6. Background particle field        */

const WHATSAPP_NUMBER = '919839320691';

// The Express server that serves these pages also serves the API, so use the same origin.
// Only when previewing with VS Code Live Server (port 5500) point at the local backend.
const API_BASE = window.location.port === '5500' ? 'http://localhost:5000' : '';

const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

/* ── Toast ─────────────────────────────────────────────── */
function showToast(message, type) {
  document.getElementById('vd-toast')?.remove();
  const t = document.createElement('div');
  t.id = 'vd-toast';
  t.className = 'toast' + (type === 'error' ? ' error' : '');
  t.setAttribute('role', 'status');
  t.textContent = message;
  document.body.appendChild(t);
  requestAnimationFrame(() => requestAnimationFrame(() => t.classList.add('show')));
  setTimeout(() => {
    t.classList.remove('show');
    setTimeout(() => t.remove(), 600);
  }, 4500);
}

/* ── Contact form -> WhatsApp ──────────────────────────── */
function initContactForm() {
  const btn = document.getElementById('contact-submit-btn');
  if (!btn) return;

  btn.addEventListener('click', () => {
    const name    = document.getElementById('name')?.value.trim();
    const phone   = document.getElementById('phone')?.value.trim();
    const email   = document.getElementById('email')?.value.trim();
    const service = document.getElementById('service')?.value;
    const message = document.getElementById('msg')?.value.trim();

    if (!name || !phone || !email || !service) {
      showToast('Please fill all required fields.', 'error'); return;
    }
    const digits = phone.replace(/[\s\-+()]/g, '');
    if (!/^\d{7,15}$/.test(digits)) {
      showToast('Please enter a valid phone number.', 'error'); return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      showToast('Please enter a valid email address.', 'error'); return;
    }

    const text = [
      'Hello Vediyukti,', '',
      `Name: ${name}`, `Phone: ${phone}`, `Email: ${email}`, '',
      `Service: ${service}`,
      message ? `\nMessage:\n${message}` : '',
    ].join('\n');

    window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(text)}`, '_blank');

    ['name', 'phone', 'email', 'msg'].forEach(id => {
      const el = document.getElementById(id);
      if (el) el.value = '';
    });
    const sel = document.getElementById('service');
    if (sel) sel.value = '';
  });
}

/* ── Floating WhatsApp button ──────────────────────────── */
function injectWhatsApp() {
  const msg = encodeURIComponent('Hi! I visited vediyukti.works and would like to know more.');
  const a = document.createElement('a');
  a.className = 'wa';
  a.href = `https://wa.me/${WHATSAPP_NUMBER}?text=${msg}`;
  a.target = '_blank';
  a.rel = 'noopener';
  a.setAttribute('aria-label', 'Chat on WhatsApp');
  a.innerHTML = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/><path d="M12 0C5.373 0 0 5.373 0 12c0 2.113.549 4.099 1.508 5.829L0 24l6.336-1.486A11.934 11.934 0 0012 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 21.818a9.818 9.818 0 01-5.006-1.37l-.36-.214-3.726.873.908-3.634-.234-.374A9.818 9.818 0 1112 21.818z"/></svg>';
  document.body.appendChild(a);
}

/* ── Instagram strip: only shown when the feed works ───── */
function isValidHttpsUrl(str) {
  if (!str || typeof str !== 'string') return false;
  try { return new URL(str, window.location.origin).protocol === 'https:'; }
  catch { return false; }
}

async function loadInstagramFeed() {
  const container = document.getElementById('ig-feed-grid');
  if (!container) return;
  try {
    const res  = await fetch(`${API_BASE}/api/instagram/feed`);
    const data = await res.json();
    if (!data.success || !data.posts?.length) { container.remove(); return; }

    const frag = document.createDocumentFragment();
    for (const post of data.posts.slice(0, 6)) {
      const img = post.media_type === 'VIDEO' ? (post.thumbnail_url || '') : post.media_url;
      if (!isValidHttpsUrl(post.permalink) || !isValidHttpsUrl(img)) continue;
      const a = document.createElement('a');
      a.href = post.permalink; a.target = '_blank'; a.rel = 'noopener'; a.className = 'ig-post';
      const i = document.createElement('img');
      i.src = img; i.loading = 'lazy';
      i.alt = (post.caption || 'Instagram post').slice(0, 80);
      a.appendChild(i);
      frag.appendChild(a);
    }
    if (!frag.childNodes.length) { container.remove(); return; }
    container.textContent = '';
    container.appendChild(frag);
  } catch (err) {
    container.remove();
  }
}

/* ── Mobile menu ───────────────────────────────────────── */
function initMobileNav() {
  const btn  = document.querySelector('.menu-btn');
  const menu = document.querySelector('.mobile-menu');
  if (!btn || !menu) return;
  const set = open => {
    menu.classList.toggle('open', open);
    document.body.classList.toggle('menu-open', open);
    btn.setAttribute('aria-expanded', String(open));
    btn.textContent = open ? 'Close' : 'Menu';
  };
  btn.addEventListener('click', () => set(!menu.classList.contains('open')));
  menu.querySelectorAll('a').forEach(a => a.addEventListener('click', () => set(false)));
  window.addEventListener('keydown', e => { if (e.key === 'Escape') set(false); });
}

/* ── Word-by-word heading reveal ───────────────────────── */
function splitWords(el) {
  let i = 0;
  const walk = node => {
    [...node.childNodes].forEach(child => {
      if (child.nodeType === 3) {
        const frag = document.createDocumentFragment();
        child.textContent.split(/(\s+)/).forEach(part => {
          if (!part) return;
          if (/^\s+$/.test(part)) { frag.appendChild(document.createTextNode(' ')); return; }
          const w = document.createElement('span');
          w.className = 'w';
          w.setAttribute('aria-hidden', 'true');
          const inner = document.createElement('span');
          inner.style.setProperty('--i', i++);
          inner.textContent = part;
          w.appendChild(inner);
          frag.appendChild(w);
        });
        node.replaceChild(frag, child);
      } else if (child.nodeType === 1 && child.tagName !== 'BR') {
        walk(child);
      }
    });
  };
  el.setAttribute('aria-label', el.textContent.replace(/\s+/g, ' ').trim());
  walk(el);
}

function initReveal() {
  document.querySelectorAll('[data-split]').forEach(splitWords);
  const els = document.querySelectorAll('.rv, [data-split], .row');
  if (!els.length) return;

  if (reduceMotion || !('IntersectionObserver' in window)) {
    els.forEach(el => el.classList.add('in'));
    return;
  }
  const io = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -8% 0px' });
  els.forEach(el => io.observe(el));
}

/* ── Scroll effects: progress bar, hero drift, nav hide ── */
function initScroll() {
  const bar  = document.querySelector('.progress');
  const nav  = document.querySelector('.nav');
  const hero = document.querySelector('.hero-inner');
  let lastY = window.scrollY, ticking = false;

  const update = () => {
    ticking = false;
    const y   = window.scrollY;
    const max = document.documentElement.scrollHeight - window.innerHeight;
    if (bar) bar.style.transform = `scaleX(${max > 0 ? Math.min(y / max, 1) : 0})`;

    if (nav && !document.body.classList.contains('menu-open')) {
      if (y > lastY + 4 && y > 160) nav.classList.add('hide');
      else if (y < lastY - 4 || y < 80) nav.classList.remove('hide');
    }
    lastY = y;

    if (hero && !reduceMotion) {
      const p = Math.min(y / (window.innerHeight * 0.9), 1);
      hero.style.transform = `translate3d(0, ${(y * -0.12).toFixed(1)}px, 0)`;
      hero.style.opacity   = String((1 - p * 0.95).toFixed(3));
    }
  };
  window.addEventListener('scroll', () => {
    if (!ticking) { ticking = true; requestAnimationFrame(update); }
  }, { passive: true });
  update();
}

/* ── Background particle field ─────────────────────────── */
function initField() {
  const canvas = document.createElement('canvas');
  canvas.className = 'particles';
  canvas.setAttribute('aria-hidden', 'true');
  document.body.prepend(canvas);
  const ctx = canvas.getContext('2d');
  if (!ctx) return;

  // Soft glow sprite, drawn once
  const glow = document.createElement('canvas');
  glow.width = glow.height = 64;
  const g = glow.getContext('2d');
  const grad = g.createRadialGradient(32, 32, 0, 32, 32, 32);
  grad.addColorStop(0, 'rgba(255,244,220,.75)');
  grad.addColorStop(1, 'rgba(255,244,220,0)');
  g.fillStyle = grad; g.fillRect(0, 0, 64, 64);

  let w, h, dpr, parts = [], scrollCur = window.scrollY, scrollPrev = scrollCur;
  const mouse = { x: -999, y: -999, on: false };
  const dot   = { x: 0, y: 0 };
  let running = true, t0 = performance.now();

  const rand = (a, b) => a + Math.random() * (b - a);

  function resize() {
    dpr = Math.min(window.devicePixelRatio || 1, 2);
    w = window.innerWidth; h = window.innerHeight;
    canvas.width = w * dpr; canvas.height = h * dpr;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    const n = Math.round(Math.min(Math.max((w * h) / 9500, 60), 170));
    parts = Array.from({ length: n }, () => {
      const z = rand(0.15, 1);
      return {
        x: rand(0, w), y: rand(0, h), z,
        r: 0.5 + z * 1.4,
        vx: rand(-0.06, 0.06), vy: rand(-0.05, 0.05),
        big: Math.random() < 0.07,
        ph: rand(0, Math.PI * 2),
      };
    });
    dot.x = w * 0.72; dot.y = h * 0.62;
    if (reduceMotion) draw(0);
  }

  function draw(time) {
    ctx.clearRect(0, 0, w, h);
    const vel = scrollCur - scrollPrev;           // px moved since last frame
    const pad = 40;

    for (const p of parts) {
      p.x += p.vx; p.y += p.vy;
      // scroll parallax: nearer (bigger z) particles travel further
      const sy = p.y - scrollCur * p.z * 0.45;
      let y = ((sy % (h + pad * 2)) + (h + pad * 2)) % (h + pad * 2) - pad;
      let x = p.x + Math.sin(time * 0.0002 + p.ph) * 6 * p.z;
      x = ((x % (w + pad * 2)) + (w + pad * 2)) % (w + pad * 2) - pad;

      // gentle push away from the cursor
      if (mouse.on) {
        const dx = x - mouse.x, dy = y - mouse.y, d2 = dx * dx + dy * dy;
        if (d2 < 14000) {
          const f = (1 - d2 / 14000) * 14 * p.z;
          const d = Math.sqrt(d2) || 1;
          x += (dx / d) * f; y += (dy / d) * f;
        }
      }

      const a = 0.22 + p.z * 0.6;
      if (p.big) {
        const s = 34 + p.z * 26;
        ctx.globalAlpha = 0.55 * p.z + 0.15;
        ctx.drawImage(glow, x - s / 2, y - s / 2, s, s);
      }
      // slight streak when scrolling fast
      const streak = Math.min(Math.abs(vel) * p.z * 0.35, 14);
      ctx.globalAlpha = a;
      ctx.fillStyle = '#efe9da';
      if (streak > 1.2) ctx.fillRect(x - p.r / 2, y - p.r / 2, p.r, p.r + streak);
      else { ctx.beginPath(); ctx.arc(x, y, p.r, 0, 6.2832); ctx.fill(); }
    }

    // the one red dot: follows the cursor lazily, or drifts when idle
    const tx = mouse.on ? mouse.x : w * (0.5 + 0.28 * Math.sin(time * 0.00021));
    const ty = mouse.on ? mouse.y : h * (0.55 + 0.22 * Math.cos(time * 0.00017)) - scrollCur * 0.08 % h;
    dot.x += (tx - dot.x) * 0.035;
    dot.y += (ty - dot.y) * 0.035;
    ctx.globalAlpha = 0.28;
    ctx.fillStyle = '#e8364f';
    ctx.beginPath(); ctx.arc(dot.x, dot.y, 15, 0, 6.2832); ctx.fill();
    ctx.globalAlpha = 1;
    ctx.beginPath(); ctx.arc(dot.x, dot.y, 5, 0, 6.2832); ctx.fill();
    ctx.globalAlpha = 1;
  }

  function loop(now) {
    if (!running) return;
    scrollPrev = scrollCur;
    scrollCur += (window.scrollY - scrollCur) * 0.12;   // eased follow
    draw(now - t0);
    requestAnimationFrame(loop);
  }

  window.addEventListener('resize', resize);
  resize();
  if (reduceMotion) return;

  window.addEventListener('pointermove', e => { mouse.x = e.clientX; mouse.y = e.clientY; mouse.on = e.pointerType === 'mouse'; }, { passive: true });
  document.addEventListener('mouseleave', () => { mouse.on = false; });
  document.addEventListener('visibilitychange', () => {
    running = !document.hidden;
    if (running) requestAnimationFrame(loop);
  });
  requestAnimationFrame(loop);
}

/* ── Background music with on/off button ───────────────── */
function initMusic() {
  const SRC = 'assets/audio/ambient.mp3';
  const KEY = 'vd-music';
  const VOL = 0.3, FADE_MS = 900, XFADE = 3;      // volume, fade time, loop crossfade (s)

  const read  = () => { try { return JSON.parse(localStorage.getItem(KEY)) || {}; } catch { return {}; } };
  const write = o  => { try { localStorage.setItem(KEY, JSON.stringify(o)); } catch { /* private mode */ } };

  const btn = document.createElement('button');
  btn.type = 'button';
  btn.className = 'music';
  btn.setAttribute('aria-pressed', 'false');
  btn.innerHTML = '<span class="bars" aria-hidden="true"><i></i><i></i><i></i></span><span class="music-txt">Music off</span>';
  document.body.appendChild(btn);
  const txt = btn.querySelector('.music-txt');

  // Two players so the loop can crossfade instead of clicking at the seam
  const mk = () => { const a = new Audio(SRC); a.preload = 'auto'; a.volume = 0; return a; };
  let cur = mk(), next = null;
  let wantOn = false, fadeTimer = null, saved = read();

  const setUI = on => {
    btn.classList.toggle('on', on);
    btn.setAttribute('aria-pressed', String(on));
    btn.setAttribute('aria-label', on ? 'Turn background music off' : 'Turn background music on');
    txt.textContent = on ? 'Music on' : 'Music off';
  };
  setUI(false);

  function fade(a, to, ms, done) {
    const from = a.volume, t0 = performance.now();
    const step = now => {
      const k = Math.min((now - t0) / ms, 1);
      a.volume = Math.max(0, Math.min(1, from + (to - from) * k));
      if (k < 1) requestAnimationFrame(step); else if (done) done();
    };
    requestAnimationFrame(step);
  }

  function watchLoop() {
    clearInterval(fadeTimer);
    fadeTimer = setInterval(() => {
      if (!wantOn || !cur.duration || next) return;
      if (cur.duration - cur.currentTime <= XFADE) {
        const old = cur;
        next = mk();
        next.currentTime = 0;
        next.play().then(() => {
          fade(next, VOL, XFADE * 1000);
          fade(old, 0, XFADE * 1000, () => { old.pause(); });
          cur = next; next = null;
        }).catch(() => { next = null; });
      }
    }, 250);
  }

  async function turnOn() {
    wantOn = true;
    try {
      if (saved.t && cur.currentTime === 0 && saved.t < (cur.duration || 9999) - XFADE - 1) cur.currentTime = saved.t;
      await cur.play();
      fade(cur, VOL, FADE_MS);
      setUI(true);
      watchLoop();
      write({ on: true, t: cur.currentTime });
      return true;
    } catch (e) {            // browser blocked autoplay: wait for a tap
      wantOn = false;
      setUI(false);
      return false;
    }
  }

  function turnOff() {
    wantOn = false;
    clearInterval(fadeTimer);
    setUI(false);
    const a = cur;
    fade(a, 0, 500, () => a.pause());
    write({ on: false, t: a.currentTime });
  }

  btn.addEventListener('click', () => { wantOn ? turnOff() : turnOn(); });

  // Pause when the tab is hidden, resume when it comes back
  document.addEventListener('visibilitychange', () => {
    if (!wantOn) return;
    if (document.hidden) cur.pause(); else cur.play().catch(() => {});
  });

  // Remember position so music carries across pages
  window.addEventListener('pagehide', () => { if (wantOn) write({ on: true, t: cur.currentTime }); });

  // Visitor had music on in a previous page: try to continue; if the browser
  // blocks it, continue on their first tap/key press instead.
  if (saved.on) {
    turnOn().then(ok => {
      if (ok) return;
      const resume = e => {
        if (e.target.closest && e.target.closest('.music')) return;   // the button handles its own tap
        window.removeEventListener('pointerdown', resume);
        window.removeEventListener('keydown', resume);
        if (!wantOn && read().on) turnOn();
      };
      window.addEventListener('pointerdown', resume);
      window.addEventListener('keydown', resume);
    });
  }
}

/* ── Init ──────────────────────────────────────────────── */
document.addEventListener('DOMContentLoaded', () => {
  initField();
  initScroll();
  initReveal();
  initMobileNav();
  initContactForm();
  injectWhatsApp();
  initMusic();
  loadInstagramFeed();
});
