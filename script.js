// ============================================================
// SCROLL PROGRESS BAR
// ============================================================
const progressBar = document.getElementById('scroll-progress');

if (progressBar) {
  window.addEventListener('scroll', () => {
    const scrolled  = window.scrollY;
    const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
    progressBar.style.width = maxScroll > 0 ? `${(scrolled / maxScroll) * 100}%` : '0%';
  }, { passive: true });
}

// ============================================================
// SLIDER
// ============================================================
const slidesContainer = document.querySelector('.slides');
const slideElements   = document.querySelectorAll('.slide');
const prevBtn         = document.getElementById('prev-btn');
const nextBtn         = document.getElementById('next-btn');
const dots            = document.querySelectorAll('.slider-dot');
let currentIndex = 0;
let autoSlideInterval;

function showSlide(index) {
  if (index >= slideElements.length) currentIndex = 0;
  else if (index < 0) currentIndex = slideElements.length - 1;
  else currentIndex = index;

  slidesContainer.style.transform = `translateX(${-currentIndex * (100 / slideElements.length)}%)`;

  dots.forEach((dot, i) => {
    dot.classList.toggle('active', i === currentIndex);
    dot.setAttribute('aria-selected', i === currentIndex ? 'true' : 'false');
  });
}

function startAutoSlide() {
  autoSlideInterval = setInterval(() => showSlide(currentIndex + 1), 5000);
}

function stopAutoSlide() {
  clearInterval(autoSlideInterval);
}

prevBtn.addEventListener('click', () => {
  stopAutoSlide();
  showSlide(currentIndex - 1);
  startAutoSlide();
});

nextBtn.addEventListener('click', () => {
  stopAutoSlide();
  showSlide(currentIndex + 1);
  startAutoSlide();
});

dots.forEach((dot, index) => {
  dot.addEventListener('click', () => {
    stopAutoSlide();
    showSlide(index);
    startAutoSlide();
  });
});

// Touch support
let touchStartX = 0;

slidesContainer.addEventListener('touchstart', (e) => {
  touchStartX = e.touches[0].clientX;
  stopAutoSlide();
}, { passive: true });

slidesContainer.addEventListener('touchend', (e) => {
  const delta = touchStartX - e.changedTouches[0].clientX;
  if (delta > 50) showSlide(currentIndex + 1);
  else if (delta < -50) showSlide(currentIndex - 1);
  startAutoSlide();
}, { passive: true });

// Keyboard navigation when focused on slider
document.addEventListener('keydown', (e) => {
  if (e.target.closest('.slider')) {
    if (e.key === 'ArrowLeft')  { stopAutoSlide(); showSlide(currentIndex - 1); startAutoSlide(); }
    if (e.key === 'ArrowRight') { stopAutoSlide(); showSlide(currentIndex + 1); startAutoSlide(); }
  }
});

slideElements.forEach(slide => {
  const img = slide.querySelector('img');
  img.onerror = () => { img.alt = 'Sri Balakashi Mahal'; };
});

startAutoSlide();

// ============================================================
// COUNTER ANIMATION (easeOutExpo)
// ============================================================
function animateCounter(el, target, duration) {
  const suffix    = el.dataset.suffix || '';
  const startTime = performance.now();

  function tick(now) {
    const elapsed  = now - startTime;
    const progress = Math.min(elapsed / duration, 1);
    const eased    = progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress);
    const value    = Math.round(target * eased);
    el.textContent = value.toLocaleString() + suffix;
    if (progress < 1) requestAnimationFrame(tick);
  }

  requestAnimationFrame(tick);
}

// ============================================================
// INTERSECTION OBSERVER — reveal + counters + stagger grids
// ============================================================
const observerOptions = {
  threshold: 0.15,
  rootMargin: '0px 0px -60px 0px'
};

// Reveal sections
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('active');
      revealObserver.unobserve(entry.target);
    }
  });
}, observerOptions);

document.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));

// Stagger grid children
const staggerObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('revealed');
      staggerObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });

document.querySelectorAll('.stagger-grid').forEach(grid => staggerObserver.observe(grid));

// Counter animation — fires once when stats band enters view
const statNumbers = document.querySelectorAll('.stat-number[data-target]');

if (statNumbers.length) {
  const counterObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const el     = entry.target;
        const target = parseInt(el.dataset.target, 10);
        // Faster for small numbers (2, 1), slower for large ones
        const duration = target >= 100 ? 2200 : target >= 10 ? 1400 : 900;
        animateCounter(el, target, duration);
        counterObserver.unobserve(el);
      }
    });
  }, { threshold: 0.5 });

  statNumbers.forEach(el => counterObserver.observe(el));
}

// ============================================================
// HEADER HIDE / SHOW ON SCROLL
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
// MOBILE STICKY CTA — appears after scrolling past hero
// ============================================================
const mobileCta  = document.getElementById('mobile-cta');
const heroSection = document.querySelector('.hero');

if (mobileCta && heroSection) {
  const ctaObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      mobileCta.classList.toggle('visible', !entry.isIntersecting);
    });
  }, { threshold: 0 });

  ctaObserver.observe(heroSection);
}

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
// SET MIN DATE ON DATE PICKER
// ============================================================
const eventDateInput = document.getElementById('event-date');
if (eventDateInput) {
  eventDateInput.setAttribute('min', new Date().toISOString().split('T')[0]);
}

// ============================================================
// ENQUIRY FORM
// ============================================================
const enquiryForm = document.getElementById('enquiry-form');
if (enquiryForm) {
  enquiryForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const form       = e.target;
    const formData   = new FormData(form);
    const messageDiv = document.getElementById('form-message');
    const mobileVal  = form.querySelector('#mobile').value;

    if (!/^[0-9]{10}$/.test(mobileVal)) {
      messageDiv.textContent = 'Please enter a valid 10-digit mobile number.';
      messageDiv.style.color = 'var(--primary)';
      return;
    }

    const submitBtn = form.querySelector('button[type="submit"]');
    submitBtn.textContent = 'Sending...';
    submitBtn.disabled = true;

    try {
      const response = await fetch('https://api.web3forms.com/submit', {
        method: 'POST',
        body: formData
      });
      const result = await response.json();

      if (result.success) {
        messageDiv.textContent = 'Thank you! Your enquiry has been received. We will be in touch shortly.';
        messageDiv.style.color = '#1a8a4a';
        form.reset();
        setTimeout(() => { messageDiv.textContent = ''; }, 6000);
      } else {
        messageDiv.textContent = 'Something went wrong. Please call us at +91 87548 60890.';
        messageDiv.style.color = 'var(--primary)';
      }
    } catch {
      messageDiv.textContent = 'Unable to send. Please call us at +91 87548 60890.';
      messageDiv.style.color = 'var(--primary)';
    } finally {
      submitBtn.textContent = 'Send Enquiry';
      submitBtn.disabled = false;
    }
  });
}

// ============================================================
// CHATBOT
// ============================================================
const chatbotToggle   = document.querySelector('.chatbot-toggle');
const chatbotWindow   = document.getElementById('chatbot-window');
const chatbotClose    = document.querySelector('.chatbot-close');
const chatbotMessages = document.getElementById('chatbot-messages');
const chatbotInputEl  = document.getElementById('chatbot-input-field');
const chatbotSend     = document.getElementById('chatbot-send');

chatbotToggle.addEventListener('click', () => {
  const expanded = chatbotToggle.getAttribute('aria-expanded') === 'true';
  chatbotToggle.setAttribute('aria-expanded', String(!expanded));
  chatbotWindow.style.display = expanded ? 'none' : 'flex';
  if (!expanded) chatbotInputEl.focus();
});

chatbotClose.addEventListener('click', () => {
  chatbotToggle.setAttribute('aria-expanded', 'false');
  chatbotWindow.style.display = 'none';
});

function addMessage(text, sender) {
  const div = document.createElement('div');
  div.className = `chatbot-message ${sender}`;
  div.textContent = text;
  chatbotMessages.appendChild(div);
  chatbotMessages.scrollTop = chatbotMessages.scrollHeight;
}

async function getBotResponse(msg) {
  try {
    const res  = await fetch('/api/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message: msg })
    });
    const data = await res.json();
    return res.ok && data.reply ? data.reply : 'Please call us at +91 87548 60890 for more information.';
  } catch {
    return 'Please call us at +91 87548 60890 or email contact@sribalakashi.com.';
  }
}

async function sendChat() {
  const text = chatbotInputEl.value.trim();
  if (!text) return;
  addMessage(text, 'user');
  chatbotInputEl.value = '';
  const reply = await getBotResponse(text);
  addMessage(reply, 'bot');
}

chatbotSend.addEventListener('click', sendChat);
chatbotInputEl.addEventListener('keypress', (e) => {
  if (e.key === 'Enter') sendChat();
});

addMessage('Hello! I am here to help with any questions about Sri Balakashi Mahal. What would you like to know?', 'bot');
