/* ============================================================
   HALDI & MEHENDI INVITATION — script.js
   ============================================================
   HOW TO CUSTOMIZE:
   Edit the CONFIG object below — that's all you need to touch.
   ============================================================ */

/* ============================================================
   SPLASH SCREEN
   ============================================================ */
(function initSplash() {
  const splash = document.getElementById('splash-screen');
  const logoBtn = document.getElementById('splash-logo-btn');
  const petalsEl = document.getElementById('splash-petals');
  const particlesEl = document.getElementById('splash-particles');

  if (!splash || !logoBtn) return;

  /* --- Spawn floating marigold/haldi petals --- */
  const petalEmojis = ['🌼', '🌸', '🌺', '💛', '🌻', '✿', '❀'];
  for (let i = 0; i < 22; i++) {
    const p = document.createElement('span');
    p.className = 'splash-petal';
    p.textContent = petalEmojis[Math.floor(Math.random() * petalEmojis.length)];
    p.style.left = Math.random() * 100 + 'vw';
    p.style.fontSize = (12 + Math.random() * 14) + 'px';
    const dur = 7 + Math.random() * 9;
    p.style.animationDuration = dur + 's';
    p.style.animationDelay = -(Math.random() * dur) + 's';
    petalsEl.appendChild(p);
  }

  /* --- Spawn turmeric gold shimmer particles --- */
  for (let i = 0; i < 14; i++) {
    const pt = document.createElement('div');
    pt.className = 'splash-particle';
    const size = 4 + Math.random() * 10;
    pt.style.width = size + 'px';
    pt.style.height = size + 'px';
    pt.style.left = (5 + Math.random() * 90) + '%';
    pt.style.top = (5 + Math.random() * 90) + '%';
    const dur = 3 + Math.random() * 4;
    pt.style.animationDuration = dur + 's';
    pt.style.animationDelay = -(Math.random() * dur) + 's';
    particlesEl.appendChild(pt);
  }

  /* --- Logo click → elegant crossfade transition → reveal site --- */
  logoBtn.addEventListener('click', function (e) {
    e.preventDefault();
    e.stopPropagation();

    window.scrollTo(0, 0);

    document.body.classList.remove('splash-active');

    Array.from(document.body.children).forEach(function (child) {
      if (child !== splash) {
        child.style.visibility = '';
        child.style.pointerEvents = '';
      }
    });

    const heroContent = document.querySelector('.hero-content');
    if (heroContent) {
      heroContent.style.animation = 'none';
      void heroContent.offsetWidth;
      heroContent.style.animation = 'heroFadeIn 1.8s cubic-bezier(0.4, 0, 0.2, 1) forwards';
      heroContent.style.animationDelay = '0.3s';
      heroContent.style.opacity = '0';
    }

    splash.classList.add('exiting');

    setTimeout(function () {
      splash.classList.add('gone');
      splash.remove();
    }, 1200);
  });
})();

/* ============================================================
   CONFIGURATION — EDIT THIS SECTION TO CUSTOMISE
   ============================================================ */
const CONFIG = {

  /* ----------------------------------------------------------
     👰🤵  COUPLE
  ---------------------------------------------------------- */
  bride: "Sandipa Pant",
  groom: "Himal Adhikari",
  quote: '"Like turmeric brings colour and warmth, may our love always be vibrant and bright."',

  /* ----------------------------------------------------------
     📅  DATE & TIME
     Date format: "YYYY-MM-DD"
     Time format: "HH:MM"  (24-hour)
  ---------------------------------------------------------- */
  date: "2025-08-15",   // Haldi & Mehendi date

  /* ----------------------------------------------------------
     🌿  HALDI & MEHENDI CEREMONY
  ---------------------------------------------------------- */
  haldiTime: "10:00",
  haldiVenue: "Pant Family Residence",
  haldiAddress: "Kathmandu, Nepal",

  /* ----------------------------------------------------------
     🖼️  PHOTOS
  ---------------------------------------------------------- */
  heroPhoto: "haldi_hero.png",
  couplePhoto: "couple.png",

  /* ----------------------------------------------------------
     🖼️  GALLERY
     Add photos as objects: { src: "filename.jpg", caption: "caption" }
  ---------------------------------------------------------- */
  gallery: [
    // { src: "gallery/photo1.jpg", caption: "Pre-haldi glow" },
    // { src: "gallery/photo2.jpg", caption: "Mehndi night"   },
  ],

};

/* ============================================================
   ↓↓  DO NOT EDIT BELOW UNLESS YOU KNOW WHAT YOU'RE DOING  ↓↓
   ============================================================ */

let lightboxIndex = 0;

/* ---- Bootstrap ---- */
window.addEventListener('DOMContentLoaded', () => {
  renderAll();
  startCountdown();
  generatePetals();
  renderGallery();
  initKeyboardNav();
  initScrollAnimations();
});

/* ============================================================
   RENDER ALL SECTIONS
   ============================================================ */
function renderAll() {
  const bride = CONFIG.bride || "Bride";
  const groom = CONFIG.groom || "Groom";
  const brideName = bride.split(' ')[0];
  const groomName = groom.split(' ')[0];

  /* Page meta */
  document.getElementById('page-title').textContent =
    `${brideName} & ${groomName} – Haldi & Mehendi Invitation`;
  document.getElementById('page-meta-desc').setAttribute('content',
    `You are cordially invited to the Haldi & Mehendi ceremony of ${bride} & ${groom}.`);

  /* Hero */
  document.getElementById('hero-bride').textContent = brideName;
  document.getElementById('hero-groom').textContent = groomName;
  document.getElementById('hero-date-display').textContent = formatDateLong(CONFIG.date);
  document.getElementById('hero').style.backgroundImage = `url('${CONFIG.heroPhoto}')`;

  /* Couple section */
  document.getElementById('main-couple-photo').src = CONFIG.couplePhoto;
  document.getElementById('display-bride').textContent = bride;
  document.getElementById('display-groom').textContent = groom;
  document.getElementById('display-quote').textContent = CONFIG.quote;

  /* Haldi & Mehendi Event */
  const dateLong = formatDateLong(CONFIG.date);
  document.getElementById('display-haldi-venue').textContent = CONFIG.haldiVenue;
  document.getElementById('display-haldi-date').textContent = dateLong;
  document.getElementById('display-haldi-time').textContent = formatTime(CONFIG.haldiTime);
  document.getElementById('display-haldi-address').textContent = CONFIG.haldiAddress;
  document.getElementById('haldi-map-link').href =
    `https://maps.google.com/maps?q=${encodeURIComponent(CONFIG.haldiAddress)}`;

  /* Footer */
  document.getElementById('footer-bride').textContent = brideName;
  document.getElementById('footer-groom').textContent = groomName;
  document.getElementById('footer-date').textContent = formatDateLong(CONFIG.date);
}

/* ============================================================
   GALLERY
   ============================================================ */
function renderGallery() {
  const container = document.getElementById('gallery-display');
  container.innerHTML = '';

  if (!CONFIG.gallery || CONFIG.gallery.length === 0) return;

  CONFIG.gallery.forEach((item, idx) => {
    const el = document.createElement('div');
    el.className = 'gallery-item';
    el.innerHTML = `
      <img src="${item.src}" alt="${item.caption || ''}" loading="lazy" />
      <div class="gallery-item-overlay">
        <span class="zoom-icon">🔍</span>
      </div>`;
    el.addEventListener('click', () => openLightbox(idx));
    container.appendChild(el);
  });
}

/* ============================================================
   LIGHTBOX
   ============================================================ */
function openLightbox(idx) {
  if (!CONFIG.gallery || CONFIG.gallery.length === 0) return;
  lightboxIndex = idx;
  document.getElementById('lightbox-img').src = CONFIG.gallery[idx].src;
  document.getElementById('lightbox').classList.remove('hidden');
  document.body.style.overflow = 'hidden';
}

function closeLightbox() {
  document.getElementById('lightbox').classList.add('hidden');
  document.body.style.overflow = '';
}

function lightboxNav(dir, event) {
  event.stopPropagation();
  const total = CONFIG.gallery.length;
  lightboxIndex = (lightboxIndex + dir + total) % total;
  const img = document.getElementById('lightbox-img');
  img.style.opacity = '0';
  img.style.transform = 'scale(0.95)';
  setTimeout(() => {
    img.src = CONFIG.gallery[lightboxIndex].src;
    img.style.transition = 'opacity 0.3s ease, transform 0.3s ease';
    img.style.opacity = '1';
    img.style.transform = 'scale(1)';
  }, 150);
}

function initKeyboardNav() {
  document.addEventListener('keydown', (e) => {
    const lb = document.getElementById('lightbox');
    if (!lb.classList.contains('hidden')) {
      if (e.key === 'Escape') closeLightbox();
      if (e.key === 'ArrowLeft') lightboxNav(-1, e);
      if (e.key === 'ArrowRight') lightboxNav(1, e);
    }
  });
}

/* ============================================================
   COUNTDOWN TIMER
   ============================================================ */
let countdownInterval;

function startCountdown() {
  clearInterval(countdownInterval);
  updateCountdown();
  countdownInterval = setInterval(updateCountdown, 1000);
}

function updateCountdown() {
  const [y, m, d] = CONFIG.date.split('-').map(Number);
  const [h, min] = CONFIG.haldiTime.split(':').map(Number);
  const eventDate = new Date(y, m - 1, d, h, min, 0);
  const diff = eventDate - new Date();

  const timerEl = document.getElementById('countdown-timer');
  const pastEl = document.getElementById('countdown-past-msg');

  if (diff <= 0) {
    timerEl.classList.add('hidden');
    pastEl.classList.remove('hidden');
    clearInterval(countdownInterval);
    return;
  }

  timerEl.classList.remove('hidden');
  pastEl.classList.add('hidden');

  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
  const seconds = Math.floor((diff % (1000 * 60)) / 1000);

  animateNumber('cd-days', String(days).padStart(2, '0'));
  animateNumber('cd-hours', String(hours).padStart(2, '0'));
  animateNumber('cd-minutes', String(minutes).padStart(2, '0'));
  animateNumber('cd-seconds', String(seconds).padStart(2, '0'));
}

function animateNumber(id, newVal) {
  const el = document.getElementById(id);
  if (!el || el.textContent === newVal) return;
  el.style.transform = 'scale(0.85)';
  setTimeout(() => {
    el.textContent = newVal;
    el.style.transform = 'scale(1)';
  }, 100);
}

/* ============================================================
   FALLING MARIGOLD PETALS (Hero)
   ============================================================ */
function generatePetals() {
  const container = document.getElementById('petal-container');
  if (!container) return;
  const petals = ['🌼', '🌸', '🌺', '🌻', '✿', '❀', '💛'];
  for (let i = 0; i < 20; i++) {
    const petal = document.createElement('div');
    petal.className = 'petal';
    petal.textContent = petals[Math.floor(Math.random() * petals.length)];
    petal.style.left = Math.random() * 100 + 'vw';
    petal.style.fontSize = (10 + Math.random() * 14) + 'px';
    petal.style.animationDuration = (8 + Math.random() * 10) + 's';
    petal.style.animationDelay = (Math.random() * 12) + 's';
    container.appendChild(petal);
  }
}

/* ============================================================
   SCROLL FADE-IN ANIMATIONS
   ============================================================ */
function initScrollAnimations() {
  const targets = document.querySelectorAll(
    '.event-card, .countdown-unit, .couple-photo-frame, .couple-info, .gallery-item, .ritual-card, .dresscode-card'
  );

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.style.opacity = '1';
        entry.target.style.transform = 'translateY(0)';
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1 });

  targets.forEach((el, i) => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(28px)';
    el.style.transition = `opacity 0.7s ease ${i * 0.07}s, transform 0.7s ease ${i * 0.07}s`;
    observer.observe(el);
  });
}

/* ============================================================
   DATE / TIME HELPERS
   ============================================================ */
function formatDateLong(dateStr) {
  if (!dateStr) return '';
  const [y, m, day] = dateStr.split('-').map(Number);
  if (!y || !m || !day) return dateStr;
  const date = new Date(y, m - 1, day);
  const months = ['January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'];
  const weekdays = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  return `${weekdays[date.getDay()]}, ${months[m - 1]} ${ordinal(day)}, ${y}`;
}

function formatTime(timeStr) {
  if (!timeStr) return '';
  const [h, m] = timeStr.split(':').map(Number);
  const period = h >= 12 ? 'PM' : 'AM';
  const hour = h % 12 || 12;
  return `${hour}:${String(m).padStart(2, '0')} ${period}`;
}

function ordinal(n) {
  const s = ['th', 'st', 'nd', 'rd'], v = n % 100;
  return n + (s[(v - 20) % 10] || s[v] || s[0]);
}
