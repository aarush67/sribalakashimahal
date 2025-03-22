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

// Lightbox Functionality
const galleryItems = document.querySelectorAll('.gallery-item img');
const lightbox = document.createElement('div');
lightbox.className = 'lightbox';
document.body.appendChild(lightbox);

galleryItems.forEach(img => {
  img.addEventListener('click', () => {
    const fullImg = document.createElement('img');
    fullImg.src = img.src;
    fullImg.className = 'lightbox-img';
    while (lightbox.firstChild) {
      lightbox.removeChild(lightbox.firstChild);
    }
    lightbox.appendChild(fullImg);
    lightbox.style.display = 'flex';
  });
});

lightbox.addEventListener('click', () => {
  lightbox.style.display = 'none';
});
