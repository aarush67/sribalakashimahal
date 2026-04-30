// SVG strings for lightbox controls (no emoji)
const SVG_PREV  = '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><polyline points="15 18 9 12 15 6"/></svg>';
const SVG_NEXT  = '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><polyline points="9 18 15 12 9 6"/></svg>';
const SVG_CLOSE = '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" aria-hidden="true"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>';

// ============================================================
// SCROLL REVEAL
// ============================================================
const reveals = document.querySelectorAll('.reveal');

function checkScroll() {
  const windowHeight = window.innerHeight;
  reveals.forEach(el => {
    if (el.getBoundingClientRect().top < windowHeight - 120) {
      el.classList.add('active');
    }
  });
}

window.addEventListener('scroll', checkScroll, { passive: true });
checkScroll();

// ============================================================
// HEADER HIDE / SHOW
// ============================================================
let lastScroll = 0;
const header = document.querySelector('.header');

window.addEventListener('scroll', () => {
  const currentScroll = window.scrollY;
  if (currentScroll > lastScroll && currentScroll > 120) {
    header.classList.add('hidden');
  } else {
    header.classList.remove('hidden');
  }
  lastScroll = currentScroll;
}, { passive: true });

// ============================================================
// MOBILE NAV
// ============================================================
const navToggle = document.querySelector('.nav-toggle');
const navMenu   = document.querySelector('.nav ul');

navToggle.addEventListener('click', () => {
  const expanded = navToggle.getAttribute('aria-expanded') === 'true';
  navToggle.setAttribute('aria-expanded', String(!expanded));
  navMenu.classList.toggle('active');
});

navMenu.querySelectorAll('a').forEach(link => {
  link.addEventListener('click', () => {
    navToggle.setAttribute('aria-expanded', 'false');
    navMenu.classList.remove('active');
  });
});

// ============================================================
// LIGHTBOX
// ============================================================
const galleryItems = document.querySelectorAll('.gallery-item img');
const lightbox     = document.createElement('div');
lightbox.className = 'lightbox';
lightbox.setAttribute('role', 'dialog');
lightbox.setAttribute('aria-modal', 'true');
lightbox.setAttribute('aria-label', 'Image viewer');
document.body.appendChild(lightbox);

let currentIndex = 0;
const images = Array.from(galleryItems).map(img => ({
  src: img.src,
  alt: img.alt
}));

function buildLightbox(index, direction) {
  currentIndex = ((index % images.length) + images.length) % images.length;

  lightbox.innerHTML = '';

  const fullImg = document.createElement('img');
  fullImg.src       = images[currentIndex].src;
  fullImg.alt       = images[currentIndex].alt;
  fullImg.className = 'lightbox-img';
  if (direction) fullImg.classList.add(`slide-${direction}`);

  const prevArrow = document.createElement('button');
  prevArrow.className = 'lightbox-prev';
  prevArrow.innerHTML = SVG_PREV;
  prevArrow.setAttribute('aria-label', 'Previous image');

  const nextArrow = document.createElement('button');
  nextArrow.className = 'lightbox-next';
  nextArrow.innerHTML = SVG_NEXT;
  nextArrow.setAttribute('aria-label', 'Next image');

  const closeBtn = document.createElement('button');
  closeBtn.className = 'lightbox-close';
  closeBtn.innerHTML = SVG_CLOSE;
  closeBtn.setAttribute('aria-label', 'Close image viewer');

  lightbox.appendChild(fullImg);
  lightbox.appendChild(prevArrow);
  lightbox.appendChild(nextArrow);
  lightbox.appendChild(closeBtn);

  setTimeout(() => fullImg.classList.add('loaded'), 10);
}

function openLightbox(index) {
  buildLightbox(index);
  lightbox.style.display = 'flex';
  document.body.style.overflow = 'hidden';
  lightbox.querySelector('.lightbox-close').focus();
}

function closeLightbox() {
  lightbox.style.display = 'none';
  document.body.style.overflow = '';
}

galleryItems.forEach((img, index) => {
  img.style.cursor = 'zoom-in';
  img.addEventListener('click', () => openLightbox(index));
  img.addEventListener('keypress', (e) => { if (e.key === 'Enter') openLightbox(index); });
  img.setAttribute('tabindex', '0');
  img.setAttribute('role', 'button');
  img.onerror = () => { img.alt = 'Sri Balakashi Mahal'; };
});

lightbox.addEventListener('click', (e) => {
  if (e.target === lightbox)                              closeLightbox();
  else if (e.target.closest('.lightbox-close'))          closeLightbox();
  else if (e.target.closest('.lightbox-prev'))           buildLightbox(currentIndex - 1, 'right');
  else if (e.target.closest('.lightbox-next'))           buildLightbox(currentIndex + 1, 'left');
});

document.addEventListener('keydown', (e) => {
  if (lightbox.style.display !== 'flex') return;
  if (e.key === 'Escape')      closeLightbox();
  if (e.key === 'ArrowLeft')   buildLightbox(currentIndex - 1, 'right');
  if (e.key === 'ArrowRight')  buildLightbox(currentIndex + 1, 'left');
});
