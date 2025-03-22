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
  slides.style.transform = `translateX(${-currentIndex * (100 / slideElements.length)}%)`;
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

// Chatbot Logic (Untouched as Requested)
const chatbotToggle = document.querySelector('.chatbot-toggle');
const chatbotWindow = document.querySelector('.chatbot-window');
const chatbotClose = document.querySelector('.chatbot-close');
const chatbotMessages = document.getElementById('chatbot-messages');
const chatbotInput = document.getElementById('chatbot-input');
const chatbotSend = document.getElementById('chatbot-send');

// Update Send button HTML to include spinner
chatbotSend.innerHTML = '<span>Send</span><span class="spinner"></span>';

// Toggle chat window
chatbotToggle.addEventListener('click', () => {
  chatbotWindow.style.display = chatbotWindow.style.display === 'none' ? 'flex' : 'none';
});

chatbotClose.addEventListener('click', () => {
  chatbotWindow.style.display = 'none';
});

// Add message to chat
function addMessage(message, sender) {
  const messageDiv = document.createElement('div');
  messageDiv.classList.add('chatbot-message', sender);
  messageDiv.textContent = message;
  chatbotMessages.appendChild(messageDiv);
  chatbotMessages.scrollTop = chatbotMessages.scrollHeight;
}

// Fetch response from backend
async function getBotResponse(userMessage) {
  try {
    const response = await fetch('/api/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message: userMessage })
    });

    const data = await response.json();
    if (response.ok && data.reply) {
      return data.reply;
    }
    console.error('Backend error:', data.error || 'Unknown error');
    return `Sorry, I couldn’t process that. Error: ${data.error || 'Unknown error'}. Please try again.`;
  } catch (error) {
    console.error('Fetch error:', error.message);
    return `Oops! Something went wrong: ${error.message}. Please try again.`;
  }
}

// Handle sending messages with spinner
chatbotSend.addEventListener('click', async () => {
  const userMessage = chatbotInput.value.trim();
  if (!userMessage) return;

  // Show spinner, disable button
  chatbotSend.classList.add('loading');
  chatbotSend.disabled = true;

  addMessage(userMessage, 'user');
  chatbotInput.value = '';

  const botResponse = await getBotResponse(userMessage);
  addMessage(botResponse, 'bot');

  // Hide spinner, re-enable button
  chatbotSend.classList.remove('loading');
  chatbotSend.disabled = false;
});

// Allow sending with Enter key
chatbotInput.addEventListener('keypress', (e) => {
  if (e.key === 'Enter') chatbotSend.click();
});

// Initial greeting
addMessage('Hello! I’m here to help with your queries about Sri Balakashi Mahal. What would you like to know?', 'bot');
