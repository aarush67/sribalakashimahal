// Scroll Animations
const reveals = document.querySelectorAll('.reveal');

function checkScroll() {
  reveals.forEach(reveal => {
    const windowHeight = window.innerHeight;
    const elementTop = reveal.getBoundingClientRect().top;
    const revealPoint = 150;

    if (elementTop < windowHeight - revealPoint) {
      reveal.classList.add('active');
    }
  });
}

window.addEventListener('scroll', checkScroll);
checkScroll();

// Header Hide/Show on Scroll
let lastScroll = 0;
const header = document.querySelector('.header');

window.addEventListener('scroll', () => {
  const currentScroll = window.scrollY;
  if (currentScroll > lastScroll && currentScroll > 100) {
    header.classList.add('hidden');
  } else {
    header.classList.remove('hidden');
  }
  lastScroll = currentScroll;
});

// Mobile Navigation Toggle
const navToggle = document.querySelector('.nav-toggle');
const navMenu = document.querySelector('.nav ul');

navToggle.addEventListener('click', () => {
  const isExpanded = navToggle.getAttribute('aria-expanded') === 'true';
  navToggle.setAttribute('aria-expanded', !isExpanded);
  navMenu.classList.toggle('active');
});

// Lightbox Functionality
const galleryItems = document.querySelectorAll('.gallery-item img');
const lightbox = document.createElement('div');
lightbox.className = 'lightbox';
document.body.appendChild(lightbox);

let currentIndex = 0;
const images = Array.from(galleryItems).map(img => img.src);

function updateLightbox(index, direction = null) {
  currentIndex = (index + images.length) % images.length;
  const fullImg = document.createElement('img');
  fullImg.src = images[currentIndex];
  fullImg.className = 'lightbox-img';
  if (direction) {
    fullImg.classList.add(`slide-${direction}`);
  }

  const prevArrow = document.createElement('button');
  prevArrow.className = 'lightbox-prev';
  prevArrow.textContent = '❮';
  prevArrow.setAttribute('aria-label', 'Previous image');

  const nextArrow = document.createElement('button');
  nextArrow.className = 'lightbox-next';
  nextArrow.textContent = '❯';
  nextArrow.setAttribute('aria-label', 'Next image');

  const closeBtn = document.createElement('button');
  closeBtn.className = 'lightbox-close';
  closeBtn.textContent = '✖';
  closeBtn.setAttribute('aria-label', 'Close lightbox');

  while (lightbox.firstChild) {
    lightbox.removeChild(lightbox.firstChild);
  }
  lightbox.appendChild(fullImg);
  lightbox.appendChild(prevArrow);
  lightbox.appendChild(nextArrow);
  lightbox.appendChild(closeBtn);

  setTimeout(() => fullImg.classList.add('loaded'), 10);
}

galleryItems.forEach((img, index) => {
  img.addEventListener('click', () => {
    currentIndex = index;
    updateLightbox(currentIndex);
    lightbox.style.display = 'flex';
    document.body.style.overflow = 'hidden';
  });
});

lightbox.addEventListener('click', (e) => {
  if (e.target.classList.contains('lightbox-close') || e.target === lightbox) {
    lightbox.style.display = 'none';
    document.body.style.overflow = 'auto';
  } else if (e.target.classList.contains('lightbox-prev')) {
    updateLightbox(currentIndex - 1, 'left');
  } else if (e.target.classList.contains('lightbox-next')) {
    updateLightbox(currentIndex + 1, 'right');
  }
});

document.addEventListener('keydown', (e) => {
  if (lightbox.style.display === 'flex') {
    if (e.key === 'ArrowLeft') updateLightbox(currentIndex - 1, 'left');
    else if (e.key === 'ArrowRight') updateLightbox(currentIndex + 1, 'right');
    else if (e.key === 'Escape') {
      lightbox.style.display = 'none';
      document.body.style.overflow = 'auto';
    }
  }
});
