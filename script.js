/* ===========================
   Autolavado Clean Car — script.js
   Funcionalidades: Nav sticky, hamburger, reveal on scroll,
   stats counter, galería lightbox, scroll spy, WhatsApp float
=========================== */

'use strict';

/* ─── 1. NAV: sticky + scroll spy + hamburger ─── */

const navbar = document.getElementById('navbar');
const hamburger = document.getElementById('hamburger');
const navLinks = document.getElementById('navLinks');

// Sticky: agrega clase cuando baja del hero
window.addEventListener('scroll', () => {
  navbar.classList.toggle('nav--scrolled', window.scrollY > 80);
}, { passive: true });

// Hamburger toggle
hamburger.addEventListener('click', () => {
  const open = hamburger.classList.toggle('nav__hamburger--open');
  navLinks.classList.toggle('nav__links--open', open);
  hamburger.setAttribute('aria-expanded', open);
  // Bloquea scroll del body cuando el menú está abierto en mobile
  document.body.style.overflow = open ? 'hidden' : '';
});

// Cierra menú al hacer clic en un link
navLinks.querySelectorAll('a').forEach(link => {
  link.addEventListener('click', () => {
    hamburger.classList.remove('nav__hamburger--open');
    navLinks.classList.remove('nav__links--open');
    hamburger.setAttribute('aria-expanded', false);
    document.body.style.overflow = '';
  });
});

// Scroll spy: resalta el link activo según sección visible
const sections = document.querySelectorAll('section[id], footer[id]');
const navAnchors = navLinks.querySelectorAll('a[href^="#"]');

const spyObserver = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      navAnchors.forEach(a => {
        a.classList.toggle('nav__link--active', a.getAttribute('href') === '#' + entry.target.id);
      });
    }
  });
}, { threshold: 0.35, rootMargin: '-70px 0px 0px 0px' });

sections.forEach(s => spyObserver.observe(s));


/* ─── 2. REVEAL ON SCROLL ─── */

const revealEls = document.querySelectorAll('.reveal');

const revealObserver = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('revealed');
      revealObserver.unobserve(entry.target); // solo una vez
    }
  });
}, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

revealEls.forEach(el => revealObserver.observe(el));


/* ─── 3. STATS COUNTER ANIMADO ─── */

const statNums = document.querySelectorAll('.stat-num[data-target]');

const easeOut = t => 1 - Math.pow(1 - t, 3);

function animateCounter(el) {
  const target = parseInt(el.dataset.target, 10);
  const duration = 1600;
  const start = performance.now();

  function tick(now) {
    const progress = Math.min((now - start) / duration, 1);
    el.textContent = Math.round(easeOut(progress) * target);
    if (progress < 1) requestAnimationFrame(tick);
    else el.textContent = target;
  }
  requestAnimationFrame(tick);
}

const counterObserver = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      animateCounter(entry.target);
      counterObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.5 });

statNums.forEach(el => counterObserver.observe(el));


/* ─── 4. GALERÍA LIGHTBOX ─── */

// Crea el lightbox en el DOM
const lightbox = document.createElement('div');
lightbox.className = 'lightbox';
lightbox.setAttribute('role', 'dialog');
lightbox.setAttribute('aria-modal', 'true');
lightbox.setAttribute('aria-label', 'Galería de trabajos');
lightbox.innerHTML = `
  <div class="lightbox__backdrop"></div>
  <button class="lightbox__close" aria-label="Cerrar">✕</button>
  <button class="lightbox__prev" aria-label="Anterior">‹</button>
  <div class="lightbox__stage">
    <img class="lightbox__img" src="" alt=""/>
    <p class="lightbox__caption"></p>
  </div>
  <button class="lightbox__next" aria-label="Siguiente">›</button>
`;
document.body.appendChild(lightbox);

const lbImg = lightbox.querySelector('.lightbox__img');
const lbCaption = lightbox.querySelector('.lightbox__caption');
const lbClose = lightbox.querySelector('.lightbox__close');
const lbPrev = lightbox.querySelector('.lightbox__prev');
const lbNext = lightbox.querySelector('.lightbox__next');
const lbBackdrop = lightbox.querySelector('.lightbox__backdrop');

const galItems = Array.from(document.querySelectorAll('.gal-item'));
let currentGalIndex = 0;

function openLightbox(index) {
  currentGalIndex = index;
  const item = galItems[index];
  const img = item.querySelector('img');
  const caption = item.querySelector('.gal-overlay span');

  // Si la imagen no cargó (placeholder), no abre
  if (!img || img.style.display === 'none') return;

  lbImg.src = img.src;
  lbImg.alt = img.alt;
  lbCaption.textContent = caption ? caption.textContent : '';

  lightbox.classList.add('lightbox--open');
  document.body.style.overflow = 'hidden';
  lbClose.focus();
}

function closeLightbox() {
  lightbox.classList.remove('lightbox--open');
  document.body.style.overflow = '';
}

function showSlide(dir) {
  currentGalIndex = (currentGalIndex + dir + galItems.length) % galItems.length;
  openLightbox(currentGalIndex);
}

galItems.forEach((item, i) => {
  item.style.cursor = 'pointer';
  item.addEventListener('click', () => openLightbox(i));
});

lbClose.addEventListener('click', closeLightbox);
lbBackdrop.addEventListener('click', closeLightbox);
lbPrev.addEventListener('click', () => showSlide(-1));
lbNext.addEventListener('click', () => showSlide(1));

// Teclado
document.addEventListener('keydown', e => {
  if (!lightbox.classList.contains('lightbox--open')) return;
  if (e.key === 'Escape') closeLightbox();
  if (e.key === 'ArrowLeft') showSlide(-1);
  if (e.key === 'ArrowRight') showSlide(1);
});

// Touch swipe en el lightbox
let touchStartX = 0;
lightbox.addEventListener('touchstart', e => { touchStartX = e.changedTouches[0].clientX; }, { passive: true });
lightbox.addEventListener('touchend', e => {
  const dx = e.changedTouches[0].clientX - touchStartX;
  if (Math.abs(dx) > 50) showSlide(dx < 0 ? 1 : -1);
}, { passive: true });


/* ─── 5. BOTÓN FLOTANTE WHATSAPP ─── */

const waFloat = document.createElement('a');
waFloat.className = 'wa-float';
waFloat.href = 'https://wa.me/573132332285?text=Hola%20quiero%20solicitar%20un%20servicio%20de%20detailing';
waFloat.target = '_blank';
waFloat.rel = 'noopener';
waFloat.setAttribute('aria-label', 'Contactar por WhatsApp');
waFloat.innerHTML = `
  <svg width="28" height="28" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
  </svg>
  <span class="wa-float__label">Solicitar ahora</span>
`;
document.body.appendChild(waFloat);

// Oculta el float cuando el CTA band es visible (para no duplicar)
const ctaBand = document.querySelector('.cta-band');
if (ctaBand) {
  const floatObserver = new IntersectionObserver(entries => {
    waFloat.classList.toggle('wa-float--hidden', entries[0].isIntersecting);
  }, { threshold: 0.5 });
  floatObserver.observe(ctaBand);
}


/* ─── 6. SMOOTH SCROLL para anchors internos ─── */
// (html { scroll-behavior: smooth } ya está en CSS,
//  pero esto maneja el offset del nav fijo)

document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', e => {
    const target = document.querySelector(anchor.getAttribute('href'));
    if (!target) return;
    e.preventDefault();
    const navH = navbar.offsetHeight;
    const top = target.getBoundingClientRect().top + window.scrollY - navH - 12;
    window.scrollTo({ top, behavior: 'smooth' });
  });
});


/* ─── 7. INYECCIÓN DE ESTILOS JS (lightbox + wa-float + nav activo) ─── */
// Esto evita tocar el CSS si quieres mantenerlo separado

const dynamicStyles = document.createElement('style');
dynamicStyles.textContent = `

/* — Nav scrolled — */
.nav--scrolled {
  background: rgba(10,10,10,0.97) !important;
  box-shadow: 0 2px 24px rgba(0,0,0,0.6);
  backdrop-filter: blur(12px);
}

/* — Nav link active — */
.nav__link--active {
  color: var(--red) !important;
}

/* — Hamburger open — */
.nav__hamburger--open span:nth-child(1) {
  transform: translateY(8px) rotate(45deg);
}
.nav__hamburger--open span:nth-child(2) {
  opacity: 0;
  transform: scaleX(0);
}
.nav__hamburger--open span:nth-child(3) {
  transform: translateY(-8px) rotate(-45deg);
}

/* — Nav links mobile open — */
@media (max-width: 768px) {
  .nav__links {
    position: fixed;
    inset: 0 0 0 30%;
    background: rgba(10,10,10,0.98);
    backdrop-filter: blur(16px);
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 2rem;
    transform: translateX(100%);
    transition: transform 0.35s cubic-bezier(0.16,1,0.3,1);
    display: flex !important;
    z-index: 9998;
  }
  .nav__links--open {
    transform: translateX(0);
  }
  .nav__links a {
    font-size: 1.4rem;
    font-family: var(--font-display);
    font-weight: 700;
    letter-spacing: 0.1em;
    text-transform: uppercase;
  }
}

/* — Reveal animation — */
.reveal {
  opacity: 0;
  transform: translateY(28px);
  transition: opacity 0.65s cubic-bezier(0.16,1,0.3,1),
              transform 0.65s cubic-bezier(0.16,1,0.3,1);
}
.revealed {
  opacity: 1;
  transform: translateY(0);
}

/* — Lightbox — */
.lightbox {
  position: fixed;
  inset: 0;
  z-index: 10000;
  display: flex;
  align-items: center;
  justify-content: center;
  visibility: hidden;
  opacity: 0;
  transition: opacity 0.3s ease, visibility 0.3s ease;
}
.lightbox--open {
  visibility: visible;
  opacity: 1;
}
.lightbox__backdrop {
  position: absolute;
  inset: 0;
  background: rgba(0,0,0,0.92);
  backdrop-filter: blur(6px);
}
.lightbox__stage {
  position: relative;
  z-index: 1;
  max-width: min(90vw, 960px);
  max-height: 90vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;
}
.lightbox__img {
  max-width: 100%;
  max-height: 80vh;
  object-fit: contain;
  border: 1px solid rgba(155,163,175,0.2);
  box-shadow: 0 0 60px rgba(0,0,0,0.8);
}
.lightbox__caption {
  font-family: var(--font-display);
  font-size: 1rem;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  color: var(--chrome-l);
}
.lightbox__close {
  position: absolute;
  top: 20px;
  right: 20px;
  z-index: 2;
  background: rgba(30,30,30,0.9);
  border: 1px solid var(--steel);
  color: var(--chrome-l);
  width: 44px;
  height: 44px;
  border-radius: 50%;
  font-size: 1.2rem;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: background 0.2s, color 0.2s;
}
.lightbox__close:hover { background: var(--red); color: #fff; border-color: var(--red); }
.lightbox__prev,
.lightbox__next {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  z-index: 2;
  background: rgba(30,30,30,0.85);
  border: 1px solid var(--steel);
  color: var(--chrome-l);
  width: 48px;
  height: 48px;
  border-radius: 50%;
  font-size: 1.8rem;
  line-height: 1;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: background 0.2s, color 0.2s, border-color 0.2s;
}
.lightbox__prev { left: 16px; }
.lightbox__next { right: 16px; }
.lightbox__prev:hover,
.lightbox__next:hover { background: var(--red); color: #fff; border-color: var(--red); }

@media (max-width: 600px) {
  .lightbox__prev { left: 4px; }
  .lightbox__next { right: 4px; }
}

/* — WhatsApp float — */
.wa-float {
  position: fixed;
  bottom: 28px;
  right: 24px;
  z-index: 9000;
  display: flex;
  align-items: center;
  gap: 10px;
  background: #25D366;
  color: #fff;
  padding: 13px 20px 13px 16px;
  border-radius: 50px;
  font-family: var(--font-display);
  font-weight: 700;
  font-size: 0.95rem;
  letter-spacing: 0.06em;
  text-transform: uppercase;
  box-shadow: 0 4px 24px rgba(37, 211, 102, 0.45);
  transition: transform 0.25s var(--ease),
              box-shadow 0.25s var(--ease),
              opacity 0.3s ease;
  text-decoration: none;
}
.wa-float:hover {
  transform: translateY(-3px) scale(1.03);
  box-shadow: 0 8px 32px rgba(37, 211, 102, 0.55);
}
.wa-float--hidden {
  opacity: 0;
  pointer-events: none;
  transform: translateY(12px);
}
@media (max-width: 480px) {
  .wa-float__label { display: none; }
  .wa-float { padding: 14px; border-radius: 50%; }
}

`;
document.head.appendChild(dynamicStyles);


/* ─── OPTIMIZACIÓN AVANZADA: Lazy Loading de rutas + Auto-play/pause ─── */
/* ─── OPTIMIZACIÓN AVANZADA: Lazy Loading Real + Control Estricto de Memoria ─── */
document.addEventListener('DOMContentLoaded', () => {
  const videos = document.querySelectorAll('.gal-item video');

  if (!videos.length) return;

  const observerOptions = {
    root: null,
    rootMargin: '150px', // Margen equilibrado para anticipar la carga sin saturar
    threshold: 0.25     // Se activa cuando el 15% del contenedor es visible
  };

  const videoObserver = new IntersectionObserver((entries) => {
    let toPlay = null;

    entries.forEach(entry => {
      const video = entry.target;

      if (entry.isIntersecting) {
        if (!video.src && video.dataset.src) {
          video.src = video.dataset.src;
        }
        toPlay = video; // solo guardamos cuál debe reproducirse
      } else {
        video.pause();
      }
    });

    if (toPlay) {
      videos.forEach(v => { if (v !== toPlay) v.pause(); });
      toPlay.play().catch(error => {
        if (error.name !== 'AbortError') {
          console.log("Autoplay controlado:", error.message);
        }
      });
    }
  }, observerOptions);
  videos.forEach(video => videoObserver.observe(video));
});