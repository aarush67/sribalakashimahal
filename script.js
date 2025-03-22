// Slider
const slides = document.querySelector('.slides');
const images = document.querySelectorAll('.slides img');
const prev = document.querySelector('.prev');
const next = document.querySelector('.next');
let currentIndex = 0;

// Touch Support
let touchStartX = 0;
let touchEndX = 0;

slides.addEventListener('touchstart', (e) => {
  touchStartX = e.touches[0].clientX;
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
});

function showSlide(index) {
  if (index >= images.length) currentIndex = 0;
  if (index < 0) currentIndex = images.length - 1;
  slides.style.transform = `translateX(${-currentIndex * 100}%)`;
}

prev.addEventListener('click', () => {
  currentIndex--;
  showSlide(currentIndex);
});

next.addEventListener('click', () => {
  currentIndex++;
  showSlide(currentIndex);
});

// Auto-slide every 5 seconds
setInterval(() => {
  currentIndex++;
  showSlide(currentIndex);
}, 5000);

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
      messageDiv.textContent = 'Thank you! Your submission has been received!';
      messageDiv.style.color = 'green';
      form.reset();
    } else {
      messageDiv.textContent = 'Oops! Something went wrong.';
      messageDiv.style.color = 'red';
    }
  } catch (error) {
    messageDiv.textContent = 'Oops! Something went wrong.';
    messageDiv.style.color = 'red';
  }
});
