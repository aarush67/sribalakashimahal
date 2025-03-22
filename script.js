// Slider
const slides = document.querySelector('.slides');
const slideElements = document.querySelectorAll('.slide');
const prev = document.querySelector('.prev');
const next = document.querySelector('.next');
let currentIndex = 0;
let autoSlideInterval;

function showSlide(index) {
  if (index >= slideElements.length) currentIndex = 0;
  if (index < 0) currentIndex = slideElements.length - 1;
  slides.style.transform = `translateX(${-currentIndex * 20}%)`;
}

function startAutoSlide() {
  autoSlideInterval = setInterval(() => {
    currentIndex++;
    showSlide(currentIndex);
  }, 5000);
}

function stopAutoSlide() {
  clearInterval(autoSlideInterval);
}

prev.addEventListener('click', () => {
  stopAutoSlide();
  currentIndex--;
  showSlide(currentIndex);
  startAutoSlide();
});

next.addEventListener('click', () => {
  stopAutoSlide();
  currentIndex++;
  showSlide(currentIndex);
  startAutoSlide();
});

// Touch Support
let touchStartX = 0;
let touchEndX = 0;

slides.addEventListener('touchstart', (e) => {
  touchStartX = e.touches[0].clientX;
  stopAutoSlide();
});

slides.addEventListener('touchend', (e) => {
  touchEndX = e.changedTouches[0].clientX;
  if (touchStartX - touchEndX > 50) {
    currentIndex++;
    showSlide(currentIndex);
  } else if (touchEndX - touchStartX > 50) {
    currentIndex--;
    showSlide(currentIndex);
  }
  startAutoSlide();
});

// Start auto-slide
startAutoSlide();

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
checkScroll(); // Initial check

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

// Form Submission with Web3Forms
document.getElementById('enquiry-form').addEventListener('submit', async function(e) {
  e.preventDefault();
  const form = e.target;
  const formData = new FormData(form);
  const messageDiv = document.getElementById('form-message');

  try {
    const response = await fetch('https://api.web3forms.com/submit', {
      method: 'POST',
      body: formData
    });

    const result = await response.json();
    if (result.success) {
      messageDiv.textContent = 'Thank you! Your enquiry has been sent!';
      messageDiv.style.color = '#d4a373';
      form.reset();
      setTimeout(() => messageDiv.textContent = '', 3000);
    } else {
      messageDiv.textContent = 'Oops! Something went wrong.';
      messageDiv.style.color = '#c68e5a';
    }
  } catch (error) {
    messageDiv.textContent = 'Oops! Something went wrong.';
    messageDiv.style.color = '#c68e5a';
  }
});
