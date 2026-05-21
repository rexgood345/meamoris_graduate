/* ============================================
   GRADUATION GIFT WEBSITE - SCRIPT
   ============================================ */

// ---- DOM References ----
const introSection    = document.getElementById('intro');
const envelopeWrapper = document.getElementById('envelopeWrapper');
const envelopeFlap    = document.getElementById('envelopeFlap');
const mainContent     = document.getElementById('mainContent');
const bgMusic         = document.getElementById('bgMusic');
const musicBtn        = document.getElementById('musicBtn');
const starsContainer  = document.getElementById('stars');
const petalsContainer = document.getElementById('petals');
const letterPopup     = document.getElementById('letterPopup');
const letterBtn       = document.getElementById('letterBtn');

// ---- Generate Stars ----
function generateStars(count = 120) {
  for (let i = 0; i < count; i++) {
    const star = document.createElement('div');
    star.classList.add('star');
    const size = Math.random() * 2.5 + 0.5;
    star.style.cssText = `
      width: ${size}px;
      height: ${size}px;
      top: ${Math.random() * 100}%;
      left: ${Math.random() * 100}%;
      --dur: ${Math.random() * 3 + 2}s;
      --op: ${Math.random() * 0.6 + 0.2};
      animation-delay: ${Math.random() * 4}s;
    `;
    starsContainer.appendChild(star);
  }
}

// ---- Generate Petals ----
const petalEmojis = ['🌸', '✨', '🌟', '⭐', '💫', '🌺'];
function generatePetals(count = 8) {
  for (let i = 0; i < count; i++) {
    const petal = document.createElement('div');
    petal.classList.add('petal');
    petal.textContent = petalEmojis[Math.floor(Math.random() * petalEmojis.length)];
    petal.style.cssText = `
      left: ${Math.random() * 100}%;
      --dur: ${Math.random() * 6 + 5}s;
      --delay: ${Math.random() * 8}s;
      font-size: ${Math.random() * 0.8 + 0.8}rem;
    `;
    petalsContainer.appendChild(petal);
  }
}

// ---- Envelope Click Handler ----
function openEnvelope() {
  // 1. Open flap animation
  envelopeFlap.classList.add('open');
  envelopeWrapper.style.animation = 'none';

  // 2. Shake/sink envelope slightly
  envelopeWrapper.style.transition = 'transform 0.5s ease, opacity 0.5s ease';
  setTimeout(() => {
    envelopeWrapper.style.transform = 'scale(0.85) translateY(20px)';
    envelopeWrapper.style.opacity = '0';
  }, 500);

  // 3. Show letter popup
  setTimeout(() => {
    letterPopup.classList.add('show');
  }, 900);
}

envelopeWrapper.addEventListener('click', openEnvelope);

// ---- Letter Button → go to main content ----
letterBtn.addEventListener('click', () => {
  letterPopup.style.transition = 'opacity 0.4s ease';
  letterPopup.style.opacity = '0';

  setTimeout(() => {
    introSection.classList.add('fade-out');
    setTimeout(() => {
      introSection.style.display = 'none';
      mainContent.classList.remove('hidden');

      tryPlayMusic();
      musicBtn.classList.remove('hidden');
      initScrollReveal();
      generatePetals();
      initLightbox();
    }, 800);
  }, 400);
});

// ---- Music Controls ----
let musicPlaying = false;

function tryPlayMusic() {
  bgMusic.volume = 0.4;
  const playPromise = bgMusic.play();
  if (playPromise !== undefined) {
    playPromise.then(() => {
      musicPlaying = true;
      musicBtn.textContent = '🎵';
      musicBtn.classList.remove('muted');
    }).catch(() => {
      // Autoplay blocked — user can click button
      musicPlaying = false;
      musicBtn.textContent = '🔇';
      musicBtn.classList.add('muted');
    });
  }
}

musicBtn.addEventListener('click', () => {
  if (musicPlaying) {
    bgMusic.pause();
    musicPlaying = false;
    musicBtn.textContent = '🔇';
    musicBtn.classList.add('muted');
  } else {
    bgMusic.play();
    musicPlaying = true;
    musicBtn.textContent = '🎵';
    musicBtn.classList.remove('muted');
  }
});

// ---- Scroll Reveal ----
function initScrollReveal() {
  // Add reveal class to elements
  const revealTargets = [
    '.section-header',
    '.message-text',
    '.message-photo',
  ];

  revealTargets.forEach(selector => {
    document.querySelectorAll(selector).forEach(el => {
      el.classList.add('reveal');
    });
  });

  // Observe all reveal elements
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry, i) => {
      if (entry.isIntersecting) {
        // Stagger delay for grid items
        const delay = entry.target.dataset.delay || 0;
        setTimeout(() => {
          entry.target.classList.add('visible');
        }, delay);
        observer.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.15,
    rootMargin: '0px 0px -50px 0px'
  });

  // Observe polaroids with stagger
  document.querySelectorAll('.polaroid').forEach((el, i) => {
    el.dataset.delay = i * 120;
    observer.observe(el);
  });

  // Observe video cards with stagger
  document.querySelectorAll('.video-card').forEach((el, i) => {
    el.dataset.delay = i * 150;
    observer.observe(el);
  });

  // Observe reveal elements
  document.querySelectorAll('.reveal').forEach(el => {
    observer.observe(el);
  });
}

// ---- Video placeholder logic ----
// Show placeholder if video source is missing/empty
function checkVideos() {
  document.querySelectorAll('.video-wrap video').forEach(video => {
    const source = video.querySelector('source');
    const placeholder = video.nextElementSibling;
    if (!source || !source.src || source.getAttribute('src') === '') {
      if (placeholder) placeholder.style.display = 'flex';
    } else {
      video.addEventListener('error', () => {
        if (placeholder) placeholder.style.display = 'flex';
      });
      video.addEventListener('loadeddata', () => {
        if (placeholder) placeholder.style.display = 'none';
      });
    }
  });
}

/* ============================================
   INTRO SPARKLE / KELAP-KELIP
   ============================================ */
function initIntroSparkle() {
  const canvas = document.getElementById('introSparkleCanvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');

  let W, H, particles, animId;

  function resize() {
    W = canvas.width  = window.innerWidth;
    H = canvas.height = window.innerHeight;
  }

  function mkParticle() {
    const gold = Math.random() > 0.5;
    return {
      x     : Math.random() * W,
      y     : Math.random() * H,
      r     : Math.random() * 2.2 + 0.4,
      phase : Math.random() * Math.PI * 2,
      speed : Math.random() * 1.2 + 0.4,
      gold  : gold,
      drift : (Math.random() - 0.5) * 0.06,
      // cross/star shape for some
      isStar: Math.random() > 0.55,
    };
  }

  function init() {
    resize();
    particles = [];
    const count = Math.floor((W * H) / 3500);
    for (let i = 0; i < count; i++) particles.push(mkParticle());
  }

  function drawCross(x, y, r, alpha, gold) {
    ctx.save();
    ctx.translate(x, y);
    const color = gold
      ? `rgba(240,208,128,${alpha})`
      : `rgba(255,255,255,${alpha})`;
    ctx.strokeStyle = color;
    ctx.lineWidth   = r * 0.7;
    ctx.shadowColor = gold ? 'rgba(201,168,76,0.9)' : 'rgba(255,255,255,0.8)';
    ctx.shadowBlur  = r * 5;
    ctx.beginPath();
    ctx.moveTo(0, -r * 2.5); ctx.lineTo(0, r * 2.5);
    ctx.moveTo(-r * 2.5, 0); ctx.lineTo(r * 2.5, 0);
    ctx.stroke();
    // diagonal faint
    ctx.globalAlpha = alpha * 0.35;
    ctx.beginPath();
    ctx.moveTo(-r * 1.5, -r * 1.5); ctx.lineTo(r * 1.5, r * 1.5);
    ctx.moveTo(r * 1.5, -r * 1.5);  ctx.lineTo(-r * 1.5, r * 1.5);
    ctx.stroke();
    ctx.restore();
  }

  function drawDot(x, y, r, alpha, gold) {
    ctx.beginPath();
    ctx.arc(x, y, r, 0, Math.PI * 2);
    ctx.fillStyle = gold
      ? `rgba(240,208,128,${alpha})`
      : `rgba(255,255,255,${alpha})`;
    ctx.shadowColor = gold ? 'rgba(201,168,76,0.8)' : 'rgba(255,255,255,0.7)';
    ctx.shadowBlur  = r > 1.5 ? r * 4 : 0;
    ctx.fill();
    ctx.shadowBlur = 0;
  }

  function draw(ts) {
    const t = ts * 0.001;
    ctx.clearRect(0, 0, W, H);

    particles.forEach(p => {
      const alpha = (Math.sin(t * p.speed + p.phase) + 1) / 2;
      p.x += p.drift;
      if (p.x < -5) p.x = W + 5;
      if (p.x > W + 5) p.x = -5;

      if (p.isStar) {
        drawCross(p.x, p.y, p.r, alpha * 0.9, p.gold);
      } else {
        drawDot(p.x, p.y, p.r, alpha * 0.85, p.gold);
      }
    });

    animId = requestAnimationFrame(draw);
  }

  // Stop when intro fades out
  const introEl = document.getElementById('intro');
  const stopObserver = new MutationObserver(() => {
    if (introEl.classList.contains('fade-out')) {
      cancelAnimationFrame(animId);
      stopObserver.disconnect();
    }
  });
  stopObserver.observe(introEl, { attributes: true, attributeFilter: ['class'] });

  init();
  requestAnimationFrame(draw);
  window.addEventListener('resize', init);
}

// ---- Init ----
generateStars();
checkVideos();

// Keyboard support for envelope
document.addEventListener('keydown', (e) => {
  if ((e.key === 'Enter' || e.key === ' ') && !mainContent.classList.contains('hidden') === false) {
    openEnvelope();
  }
});

/* ============================================
   LIGHTBOX
   ============================================ */
const lightbox       = document.getElementById('lightbox');
const lightboxOverlay= document.getElementById('lightboxOverlay');
const lightboxClose  = document.getElementById('lightboxClose');
const lightboxImg    = document.getElementById('lightboxImg');
const lightboxCaption= document.getElementById('lightboxCaption');
const lightboxCounter= document.getElementById('lightboxCounter');
const lightboxLoader = document.getElementById('lightboxLoader');
const lightboxPrev   = document.getElementById('lightboxPrev');
const lightboxNext   = document.getElementById('lightboxNext');

let allPolaroids = [];   // semua data foto
let currentIndex = 0;

// Kumpulkan semua polaroid setelah main content muncul
function initLightbox() {
  // Ambil semua polaroid yang punya gambar
  const cards = document.querySelectorAll('.polaroid');
  allPolaroids = [];

  cards.forEach((card, i) => {
    const img     = card.querySelector('.polaroid-img-wrap img');
    const caption = card.querySelector('.polaroid-caption');

    // Simpan data
    allPolaroids.push({
      src    : img ? img.src : '',
      alt    : img ? img.alt : `Foto ${i + 1}`,
      caption: caption ? caption.textContent : '',
    });

    // Klik handler
    card.addEventListener('click', () => {
      openLightbox(i);
    });
  });
}

function openLightbox(index) {
  currentIndex = index;
  lightbox.classList.add('active');
  document.body.style.overflow = 'hidden';
  loadImage(index, null);
}

function closeLightbox() {
  lightbox.classList.remove('active');
  document.body.style.overflow = '';
  lightboxImg.src = '';
}

function loadImage(index, direction) {
  const data = allPolaroids[index];
  if (!data) return;

  // Show loader
  lightboxLoader.classList.add('show');
  lightboxImg.classList.add('loading');
  lightboxImg.removeAttribute('class');
  lightboxImg.classList.add('loading');

  // Update caption & counter
  lightboxCaption.textContent = data.caption;
  lightboxCounter.textContent = `${index + 1} / ${allPolaroids.length}`;

  // Load image
  const tempImg = new Image();
  tempImg.onload = () => {
    lightboxLoader.classList.remove('show');
    lightboxImg.src = data.src;
    lightboxImg.alt = data.alt;
    lightboxImg.classList.remove('loading');

    if (direction === 'next') {
      lightboxImg.classList.add('slide-right');
    } else if (direction === 'prev') {
      lightboxImg.classList.add('slide-left');
    }

    // Remove animation class after it plays
    lightboxImg.addEventListener('animationend', () => {
      lightboxImg.classList.remove('slide-right', 'slide-left');
    }, { once: true });
  };

  tempImg.onerror = () => {
    lightboxLoader.classList.remove('show');
    lightboxImg.src = '';
    lightboxImg.classList.remove('loading');
    lightboxCaption.textContent = data.caption + ' (foto tidak ditemukan)';
  };

  tempImg.src = data.src;
}

function showPrev() {
  currentIndex = (currentIndex - 1 + allPolaroids.length) % allPolaroids.length;
  loadImage(currentIndex, 'prev');
}

function showNext() {
  currentIndex = (currentIndex + 1) % allPolaroids.length;
  loadImage(currentIndex, 'next');
}

// Event listeners
lightboxClose.addEventListener('click', closeLightbox);
lightboxOverlay.addEventListener('click', closeLightbox);
lightboxPrev.addEventListener('click', showPrev);
lightboxNext.addEventListener('click', showNext);

// Keyboard navigation
document.addEventListener('keydown', (e) => {
  if (!lightbox.classList.contains('active')) return;
  if (e.key === 'Escape')      closeLightbox();
  if (e.key === 'ArrowRight')  showNext();
  if (e.key === 'ArrowLeft')   showPrev();
});

// Swipe support (touch)
let touchStartX = 0;
lightbox.addEventListener('touchstart', (e) => {
  touchStartX = e.changedTouches[0].clientX;
}, { passive: true });

lightbox.addEventListener('touchend', (e) => {
  const diff = touchStartX - e.changedTouches[0].clientX;
  if (Math.abs(diff) > 50) {
    diff > 0 ? showNext() : showPrev();
  }
}, { passive: true });

// Init lightbox after envelope is opened (called inside openEnvelope above)


/* ============================================
   SPARKLE / KELAP-KELIP CANVAS
   ============================================ */
function initSparkle(canvasId) {
  const canvas = document.getElementById(canvasId);
  if (!canvas) return;

  const ctx = canvas.getContext('2d');
  let particles = [];
  let animId;

  function resize() {
    const section = canvas.closest('.photo-section');
    canvas.width  = section.offsetWidth;
    canvas.height = section.offsetHeight;
  }

  function createParticle() {
    return {
      x    : Math.random() * canvas.width,
      y    : Math.random() * canvas.height,
      r    : Math.random() * 2.5 + 0.5,       // radius
      alpha: Math.random(),
      speed: Math.random() * 0.015 + 0.005,   // twinkle speed
      phase: Math.random() * Math.PI * 2,      // offset phase
      gold : Math.random() > 0.6,              // gold or white
    };
  }

  function init() {
    resize();
    particles = [];
    const count = Math.floor((canvas.width * canvas.height) / 6000);
    for (let i = 0; i < count; i++) particles.push(createParticle());
  }

  function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    const now = performance.now() * 0.001;

    particles.forEach(p => {
      const alpha = (Math.sin(now * p.speed * 60 + p.phase) + 1) / 2;
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);

      if (p.gold) {
        ctx.fillStyle = `rgba(201, 168, 76, ${alpha * 0.85})`;
      } else {
        ctx.fillStyle = `rgba(255, 255, 240, ${alpha * 0.7})`;
      }

      // Glow effect for bigger particles
      if (p.r > 1.8) {
        ctx.shadowBlur  = 6;
        ctx.shadowColor = p.gold ? 'rgba(201,168,76,0.6)' : 'rgba(255,255,255,0.5)';
      } else {
        ctx.shadowBlur = 0;
      }

      ctx.fill();
    });

    animId = requestAnimationFrame(draw);
  }

  // Start when section is visible
  const observer = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        init();
        draw();
      } else {
        cancelAnimationFrame(animId);
      }
    });
  }, { threshold: 0.1 });

  observer.observe(canvas.closest('.photo-section'));
  window.addEventListener('resize', () => { resize(); particles = []; init(); });
}

// Init sparkle after main content is shown
// Hook into the letterBtn click
const _origLetterBtn = document.getElementById('letterBtn');
if (_origLetterBtn) {
  _origLetterBtn.addEventListener('click', () => {
    setTimeout(() => initSparkle('sparkleCanvas1'), 1200);
  });
}

/* ============================================
   GLOBAL AESTHETIC SPARKLE BACKGROUND
   ============================================ */
(function() {
  const canvas = document.getElementById('globalSparkle');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');

  let W, H, particles, shootingStars, nebulas;

  // ---- Resize ----
  function resize() {
    W = canvas.width  = window.innerWidth;
    H = canvas.height = window.innerHeight;
  }

  // ---- Particle types ----
  function mkStar() {
    return {
      type  : 'star',
      x     : Math.random() * W,
      y     : Math.random() * H,
      r     : Math.random() * 1.8 + 0.3,
      phase : Math.random() * Math.PI * 2,
      speed : Math.random() * 0.8 + 0.3,
      gold  : Math.random() > 0.65,
      drift : (Math.random() - 0.5) * 0.08,
    };
  }

  function mkGlitter() {
    return {
      type  : 'glitter',
      x     : Math.random() * W,
      y     : Math.random() * H,
      size  : Math.random() * 3 + 1,
      phase : Math.random() * Math.PI * 2,
      speed : Math.random() * 1.2 + 0.5,
      angle : Math.random() * Math.PI * 2,
      rotSpd: (Math.random() - 0.5) * 0.04,
    };
  }

  function mkShootingStar() {
    const fromLeft = Math.random() > 0.5;
    return {
      x    : fromLeft ? -20 : W + 20,
      y    : Math.random() * H * 0.6,
      vx   : fromLeft ? Math.random() * 6 + 4 : -(Math.random() * 6 + 4),
      vy   : Math.random() * 2 + 1,
      len  : Math.random() * 120 + 60,
      alpha: 1,
      life : 0,
      maxLife: Math.random() * 60 + 40,
    };
  }

  function mkNebula() {
    return {
      x    : Math.random() * W,
      y    : Math.random() * H,
      r    : Math.random() * 180 + 80,
      hue  : Math.random() > 0.5 ? 30 : 260, // gold or purple
      alpha: Math.random() * 0.04 + 0.01,
      phase: Math.random() * Math.PI * 2,
      speed: Math.random() * 0.003 + 0.001,
    };
  }

  // ---- Init ----
  function init() {
    resize();
    const starCount    = Math.floor(W * H / 5000);
    const glitterCount = Math.floor(W * H / 18000);

    particles     = [];
    shootingStars = [];
    nebulas       = [];

    for (let i = 0; i < starCount;    i++) particles.push(mkStar());
    for (let i = 0; i < glitterCount; i++) particles.push(mkGlitter());
    for (let i = 0; i < 5;            i++) nebulas.push(mkNebula());
  }

  // ---- Draw helpers ----
  function drawStar4(ctx, x, y, r, alpha, gold) {
    ctx.save();
    ctx.translate(x, y);
    const color = gold
      ? `rgba(201,168,76,${alpha})`
      : `rgba(255,255,245,${alpha})`;
    ctx.fillStyle   = color;
    ctx.shadowColor = gold ? 'rgba(201,168,76,0.8)' : 'rgba(200,200,255,0.6)';
    ctx.shadowBlur  = r > 1.2 ? r * 5 : 0;

    // 4-point star shape for bigger ones
    if (r > 1.3) {
      ctx.beginPath();
      for (let i = 0; i < 4; i++) {
        const a = (i / 4) * Math.PI * 2 - Math.PI / 4;
        const b = a + Math.PI / 4;
        ctx.lineTo(Math.cos(a) * r * 2.2, Math.sin(a) * r * 2.2);
        ctx.lineTo(Math.cos(b) * r * 0.5, Math.sin(b) * r * 0.5);
      }
      ctx.closePath();
      ctx.fill();
    } else {
      ctx.beginPath();
      ctx.arc(0, 0, r, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.restore();
  }

  function drawGlitter(ctx, p, t) {
    ctx.save();
    ctx.translate(p.x, p.y);
    ctx.rotate(p.angle + t * p.rotSpd * 60);
    const alpha = (Math.sin(t * p.speed + p.phase) + 1) / 2 * 0.7;
    ctx.strokeStyle = `rgba(201,168,76,${alpha})`;
    ctx.lineWidth   = 0.8;
    ctx.shadowColor = 'rgba(201,168,76,0.5)';
    ctx.shadowBlur  = 4;
    // Diamond cross
    const s = p.size;
    ctx.beginPath();
    ctx.moveTo(0, -s * 2); ctx.lineTo(0, s * 2);
    ctx.moveTo(-s * 2, 0); ctx.lineTo(s * 2, 0);
    ctx.stroke();
    // Diagonal
    ctx.globalAlpha = alpha * 0.4;
    ctx.beginPath();
    ctx.moveTo(-s, -s); ctx.lineTo(s, s);
    ctx.moveTo(s, -s);  ctx.lineTo(-s, s);
    ctx.stroke();
    ctx.restore();
  }

  // ---- Main draw loop ----
  let lastShoot = 0;
  function draw(ts) {
    const t = ts * 0.001;
    ctx.clearRect(0, 0, W, H);

    // 1. Nebula glow blobs
    nebulas.forEach(n => {
      const a = n.alpha * (0.7 + 0.3 * Math.sin(t * n.speed * 10 + n.phase));
      const grad = ctx.createRadialGradient(n.x, n.y, 0, n.x, n.y, n.r);
      grad.addColorStop(0, `hsla(${n.hue},60%,50%,${a})`);
      grad.addColorStop(1, 'transparent');
      ctx.fillStyle = grad;
      ctx.beginPath();
      ctx.arc(n.x, n.y, n.r, 0, Math.PI * 2);
      ctx.fill();
    });

    // 2. Stars & glitters
    particles.forEach(p => {
      if (p.type === 'star') {
        const alpha = (Math.sin(t * p.speed + p.phase) + 1) / 2;
        p.x += p.drift;
        if (p.x < -5) p.x = W + 5;
        if (p.x > W + 5) p.x = -5;
        drawStar4(ctx, p.x, p.y, p.r, alpha * 0.85, p.gold);
      } else {
        drawGlitter(ctx, p, t);
      }
    });

    // 3. Shooting stars
    if (t - lastShoot > (Math.random() * 4 + 3)) {
      shootingStars.push(mkShootingStar());
      lastShoot = t;
    }

    shootingStars = shootingStars.filter(s => s.life < s.maxLife);
    shootingStars.forEach(s => {
      s.life++;
      s.x += s.vx;
      s.y += s.vy;
      const progress = s.life / s.maxLife;
      const alpha    = progress < 0.3
        ? progress / 0.3
        : 1 - (progress - 0.3) / 0.7;

      const grad = ctx.createLinearGradient(
        s.x, s.y,
        s.x - s.vx * (s.len / Math.abs(s.vx)),
        s.y - s.vy * (s.len / Math.abs(s.vx))
      );
      grad.addColorStop(0, `rgba(255,255,220,${alpha * 0.9})`);
      grad.addColorStop(0.3, `rgba(201,168,76,${alpha * 0.5})`);
      grad.addColorStop(1, 'transparent');

      ctx.beginPath();
      ctx.moveTo(s.x, s.y);
      ctx.lineTo(
        s.x - s.vx * (s.len / Math.abs(s.vx)),
        s.y - s.vy * (s.len / Math.abs(s.vx))
      );
      ctx.strokeStyle = grad;
      ctx.lineWidth   = 1.5;
      ctx.shadowColor = 'rgba(255,255,200,0.8)';
      ctx.shadowBlur  = 6;
      ctx.stroke();
      ctx.shadowBlur  = 0;
    });

    requestAnimationFrame(draw);
  }

  init();
  requestAnimationFrame(draw);
  window.addEventListener('resize', init);
})();

/* ============================================
   SECTION 2 FLOATING PARTICLES
   ============================================ */
function initSec2Particles() {
  const container = document.getElementById('sec2Particles');
  if (!container) return;

  const colors = [
    'rgba(201,168,76,VAR)',   // gold
    'rgba(255,255,220,VAR)',  // warm white
    'rgba(180,120,200,VAR)',  // soft purple
    'rgba(255,200,180,VAR)',  // rose
  ];

  for (let i = 0; i < 28; i++) {
    const el    = document.createElement('div');
    el.classList.add('sec2-p');
    const size  = Math.random() * 4 + 1.5;
    const op    = (Math.random() * 0.35 + 0.1).toFixed(2);
    const color = colors[Math.floor(Math.random() * colors.length)]
                    .replace('VAR', op);
    el.style.cssText = `
      left: ${Math.random() * 100}%;
      top:  ${Math.random() * 100}%;
      width:  ${size}px;
      height: ${size}px;
      background: ${color};
      box-shadow: 0 0 ${size * 3}px ${color};
      --dur:   ${(Math.random() * 3 + 2).toFixed(1)}s;
      --delay: ${(Math.random() * 4).toFixed(1)}s;
      --op:    ${op};
    `;
    container.appendChild(el);
  }
}

// Call after content shown
document.addEventListener('DOMContentLoaded', () => {
  // Try immediately (if already visible) or after letter button
  const btn = document.getElementById('letterBtn');
  if (btn) {
    btn.addEventListener('click', () => {
      setTimeout(initSec2Particles, 1200);
      setTimeout(() => {
        initTopSparkle('msgSparkleCanvas');
        initTopSparkle('vidSparkleCanvas');
      }, 1200);
    });
  }
});

/* ============================================
   WORD-BY-WORD REVEAL ANIMATION (closing section)
   ============================================ */
function initWordReveal() {
  const targets = [
    { id: 'closingName',   delay: 0,    interval: 150 },
    { id: 'closingThanks', delay: 800,  interval: 160 },
    { id: 'closingText',   delay: 3200, interval: 170 },
  ];

  targets.forEach(({ id, delay: baseDelay, interval }) => {
    const el = document.getElementById(id);
    if (!el) return;

    // Kumpulkan semua teks (termasuk dalam <strong>)
    // Ganti innerHTML jadi per-kata span, pertahankan <strong>
    function wrapWords(node) {
      if (node.nodeType === Node.TEXT_NODE) {
        const words = node.textContent.split(/(\s+)/);
        const frag  = document.createDocumentFragment();
        words.forEach(part => {
          if (/^\s+$/.test(part)) {
            frag.appendChild(document.createTextNode(part));
          } else if (part) {
            const span = document.createElement('span');
            span.className = 'word';
            span.textContent = part;
            frag.appendChild(span);
          }
        });
        node.parentNode.replaceChild(frag, node);
      } else if (node.nodeType === Node.ELEMENT_NODE) {
        Array.from(node.childNodes).forEach(wrapWords);
      }
    }

    wrapWords(el);

    // Observe kapan elemen masuk viewport
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        observer.unobserve(el);

        const spans = el.querySelectorAll('.word');
        spans.forEach((span, i) => {
          setTimeout(() => {
            span.classList.add('show');
          }, baseDelay + i * interval);
        });
      });
    }, { threshold: 0.2 });

    observer.observe(el);
  });
}

// Panggil setelah main content muncul
document.getElementById('letterBtn').addEventListener('click', () => {
  setTimeout(initWordReveal, 1200);
});
function initTopSparkle(canvasId) {
  const canvas = document.getElementById(canvasId);
  if (!canvas) return;
  const ctx = canvas.getContext('2d');

  let W, H, particles;

  function resize() {
    const section = canvas.closest('section');
    W = canvas.width  = section.offsetWidth;
    H = canvas.height = 120;
  }

  function mkParticle() {
    return {
      x    : Math.random() * W,
      y    : Math.random() * H,
      r    : Math.random() * 1.8 + 0.3,
      phase: Math.random() * Math.PI * 2,
      speed: Math.random() * 1.0 + 0.4,
      drift: (Math.random() - 0.5) * 0.05,
      // 40% cross shape, 60% dot
      isCross: Math.random() > 0.6,
    };
  }

  function init() {
    resize();
    particles = [];
    const count = Math.floor(W / 8);
    for (let i = 0; i < count; i++) particles.push(mkParticle());
  }

  function draw(ts) {
    const t = ts * 0.001;
    ctx.clearRect(0, 0, W, H);

    particles.forEach(p => {
      // alpha: 0 → 1 → 0 (twinkle)
      const raw   = (Math.sin(t * p.speed + p.phase) + 1) / 2;
      // fade out toward bottom of strip
      const yFade = 1 - (p.y / H) * 0.7;
      const alpha = raw * yFade * 0.9;

      p.x += p.drift;
      if (p.x < -5) p.x = W + 5;
      if (p.x > W + 5) p.x = -5;

      ctx.save();
      ctx.translate(p.x, p.y);

      if (p.isCross) {
        // ✦ cross / star shape
        ctx.strokeStyle = `rgba(255,255,255,${alpha})`;
        ctx.lineWidth   = p.r * 0.7;
        ctx.shadowColor = `rgba(255,255,255,${alpha * 0.8})`;
        ctx.shadowBlur  = p.r * 5;
        ctx.beginPath();
        ctx.moveTo(0, -p.r * 2.8); ctx.lineTo(0, p.r * 2.8);
        ctx.moveTo(-p.r * 2.8, 0); ctx.lineTo(p.r * 2.8, 0);
        ctx.stroke();
        // diagonal faint
        ctx.globalAlpha = alpha * 0.3;
        ctx.beginPath();
        ctx.moveTo(-p.r * 1.6, -p.r * 1.6); ctx.lineTo(p.r * 1.6, p.r * 1.6);
        ctx.moveTo(p.r * 1.6, -p.r * 1.6);  ctx.lineTo(-p.r * 1.6, p.r * 1.6);
        ctx.stroke();
      } else {
        // dot
        ctx.beginPath();
        ctx.arc(0, 0, p.r, 0, Math.PI * 2);
        ctx.fillStyle   = `rgba(255,255,255,${alpha})`;
        ctx.shadowColor = `rgba(255,255,255,${alpha * 0.7})`;
        ctx.shadowBlur  = p.r > 1.2 ? p.r * 4 : 0;
        ctx.fill();
      }

      ctx.restore();
    });

    requestAnimationFrame(draw);
  }

  // Use IntersectionObserver to only run when visible
  const observer = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        init();
        requestAnimationFrame(draw);
        observer.unobserve(canvas);
      }
    });
  }, { threshold: 0.05 });

  observer.observe(canvas);
  window.addEventListener('resize', init);
}

/* ============================================
   FRIENDSHIP LETTER POPUP
   ============================================ */
(function() {
  const btn     = document.getElementById('friendshipEnvBtn');
  const popup   = document.getElementById('friendshipPopup');
  const overlay = document.getElementById('friendshipPopupOverlay');
  const closeBtn= document.getElementById('friendshipPopupClose');

  if (!btn || !popup) return;

  function openPopup() {
    popup.classList.add('active');
    document.body.style.overflow = 'hidden';
  }

  function closePopup() {
    popup.classList.remove('active');
    document.body.style.overflow = '';
  }

  btn.addEventListener('click', openPopup);
  overlay.addEventListener('click', closePopup);
  closeBtn.addEventListener('click', closePopup);

  document.addEventListener('keydown', e => {
    if (e.key === 'Escape' && popup.classList.contains('active')) closePopup();
  });
})();
