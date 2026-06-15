// ═══════════════════════════════════════════════════════════
//  Vediyukti — Frontend JavaScript
//  Handles: Contact Form → WhatsApp, Instagram Feed, Toast,
//           Scroll Reveal, Floating WhatsApp Button
// ═══════════════════════════════════════════════════════════

const WHATSAPP_NUMBER = '919839320691';

const API_BASE = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1'
  ? 'http://localhost:5000'
  : 'https://vediyukti-backend.onrender.com';

// ════════════════════════════════════════════════
//  TOAST NOTIFICATION
// ════════════════════════════════════════════════
function showToast(message, type = 'success') {
  const existing = document.getElementById('vd-toast');
  if (existing) existing.remove();

  const toast = document.createElement('div');
  toast.id = 'vd-toast';
  toast.innerHTML = `<span style="font-size:1.1rem">${type === 'success' ? '✅' : '❌'}</span><span>${message}</span>`;
  Object.assign(toast.style, {
    position: 'fixed', bottom: '2rem', right: '2rem', zIndex: '9999',
    display: 'flex', alignItems: 'center', gap: '0.6rem',
    padding: '1rem 1.5rem', borderRadius: '12px',
    background: type === 'success'
      ? 'linear-gradient(135deg,#4D2DB7,#9D44C0)'
      : 'linear-gradient(135deg,#c0392b,#e74c3c)',
    color: '#fff', fontFamily: "'Plus Jakarta Sans', sans-serif",
    fontWeight: '600', fontSize: '0.9rem',
    boxShadow: '0 8px 32px rgba(0,0,0,0.25)',
    transform: 'translateY(100px)',
    transition: 'transform 0.4s cubic-bezier(0.16,1,0.3,1)',
    maxWidth: '360px',
  });
  document.body.appendChild(toast);
  requestAnimationFrame(() => requestAnimationFrame(() => { toast.style.transform = 'translateY(0)'; }));
  setTimeout(() => {
    toast.style.transform = 'translateY(120px)';
    setTimeout(() => toast.remove(), 400);
  }, 4500);
}

// ════════════════════════════════════════════════
//  CONTACT FORM → WHATSAPP
// ════════════════════════════════════════════════
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

    const digits = phone.replace(/[\s\-\+\(\)]/g, '');
    if (!/^\d{7,15}$/.test(digits)) {
      showToast('Please enter a valid phone number.', 'error'); return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      showToast('Please enter a valid email address.', 'error'); return;
    }

    const text = [
      'Hello Vediyukti,',
      '',
      `Name: ${name}`,
      `Phone: ${phone}`,
      `Email: ${email}`,
      '',
      `Service: ${service}`,
      message ? `\nMessage:\n${message}` : '',
    ].join('\n');

    const url = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(text)}`;
    window.open(url, '_blank');

    ['name','phone','email','msg'].forEach(id => {
      const el = document.getElementById(id);
      if (el) el.value = '';
    });
    const sel = document.getElementById('service');
    if (sel) sel.value = '';
  });
}

// ════════════════════════════════════════════════
//  WHATSAPP FLOATING BUTTON
// ════════════════════════════════════════════════
function injectWhatsApp() {
  const MESSAGE = encodeURIComponent('Hi! I visited vediyukti.works and would like to know more 🙌');
  const btn     = document.createElement('a');
  btn.href      = `https://wa.me/${WHATSAPP_NUMBER}?text=${MESSAGE}`;
  btn.target    = '_blank'; btn.rel = 'noopener'; btn.title = 'Chat on WhatsApp';
  btn.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="#fff"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/><path d="M12 0C5.373 0 0 5.373 0 12c0 2.113.549 4.099 1.508 5.829L0 24l6.336-1.486A11.934 11.934 0 0012 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 21.818a9.818 9.818 0 01-5.006-1.37l-.36-.214-3.726.873.908-3.634-.234-.374A9.818 9.818 0 1112 21.818z"/></svg>`;
  Object.assign(btn.style, {
    position: 'fixed', bottom: '1.5rem', left: '1.5rem', zIndex: '9998',
    width: '3.5rem', height: '3.5rem', borderRadius: '50%',
    background: '#25D366', display: 'flex',
    alignItems: 'center', justifyContent: 'center',
    boxShadow: '0 4px 20px rgba(37,211,102,0.45)',
    transition: 'transform 0.2s, box-shadow 0.2s', cursor: 'pointer',
  });
  btn.addEventListener('mouseenter', () => { btn.style.transform='scale(1.12)'; btn.style.boxShadow='0 8px 30px rgba(37,211,102,0.6)'; });
  btn.addEventListener('mouseleave', () => { btn.style.transform='scale(1)'; btn.style.boxShadow='0 4px 20px rgba(37,211,102,0.45)'; });
  document.body.appendChild(btn);
}

// ════════════════════════════════════════════════
//  INSTAGRAM FEED
// ════════════════════════════════════════════════
async function loadInstagramFeed() {
  const container = document.getElementById('ig-feed-grid');
  if (!container) return;

  const isHomePage = !document.querySelector('.page-body');

  try {
    const res  = await fetch(`${API_BASE}/api/instagram/feed`);
    const data = await res.json();

    if (!data.success || !data.posts.length) {
      if (isHomePage) {
        container.innerHTML = '<p style="color:#6E6B8A;text-align:center;grid-column:1/-1;padding:2rem">Follow us <a href="https://www.instagram.com/vediyukti.works/" target="_blank" rel="noopener noreferrer" style="color:#9D44C0">@vediyukti.works</a> on Instagram!</p>';
      }
      return;
    }

    container.innerHTML = data.posts.slice(0, isHomePage ? 9 : 6).map(post => {
      const img     = post.media_type === 'VIDEO' ? (post.thumbnail_url || '') : post.media_url;
      const caption = (post.caption || '').slice(0, 80) + (post.caption?.length > 80 ? '…' : '');
      return `
        <a href="${post.permalink}" target="_blank" rel="noopener" class="ig-post">
          <img src="${img}" alt="${caption}" loading="lazy" />
          <div class="ig-overlay">
            ${post.media_type === 'VIDEO' ? '<span class="ig-type">▶</span>' : ''}
            ${post.media_type === 'CAROUSEL_ALBUM' ? '<span class="ig-type">⊞</span>' : ''}
          </div>
        </a>`;
    }).join('');
  } catch (err) {
    console.error('Instagram feed error:', err);
  }
}

// ════════════════════════════════════════════════
//  SCROLL REVEAL
// ════════════════════════════════════════════════
function initReveal() {
  const els = document.querySelectorAll('.reveal');
  if (!els.length) return;

  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('in');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });

  els.forEach(el => observer.observe(el));
}

// ════════════════════════════════════════════════
//  INIT
// ════════════════════════════════════════════════
document.addEventListener('DOMContentLoaded', () => {
  initContactForm();
  loadInstagramFeed();
  initReveal();
  injectWhatsApp();
});
