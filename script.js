// ===== TYPING ANIMATION =====
const phrases = ["Web Developer", "UI/UX Designer", "System Analyst", "IT Auditor", "Software Tester"];
let phraseIndex = 0, charIndex = 0, isDeleting = false;
const typedElement = document.getElementById('typed');

function typeAnimation() {
  const currentPhrase = phrases[phraseIndex];
  
  if (!isDeleting) {
    typedElement.textContent = currentPhrase.slice(0, ++charIndex);
    if (charIndex === currentPhrase.length) {
      isDeleting = true;
      setTimeout(typeAnimation, 1800);
      return;
    }
  } else {
    typedElement.textContent = currentPhrase.slice(0, --charIndex);
    if (charIndex === 0) {
      isDeleting = false;
      phraseIndex = (phraseIndex + 1) % phrases.length;
    }
  }
  setTimeout(typeAnimation, isDeleting ? 60 : 100);
}
typeAnimation();

// ===== PARTICLES ANIMATION =====
const particleContainer = document.getElementById('particles');
for (let i = 0; i < 25; i++) {
  const particle = document.createElement('div');
  particle.className = 'particle';
  const randomDuration = 6 + Math.random() * 8;
  const randomDelay = Math.random() * 4;
  const randomDy = -20 - Math.random() * 40;
  const randomDx = -20 + Math.random() * 40;
  
  particle.style.cssText = `
    left: ${Math.random() * 100}%;
    top: ${Math.random() * 100}%;
    --dur: ${randomDuration}s;
    --delay: ${randomDelay}s;
    --dy: ${randomDy}px;
    --dx: ${randomDx}px;
  `;
  particleContainer.appendChild(particle);
}

// ===== SCROLL REVEAL ANIMATION =====
const observerOptions = { threshold: 0.1 };
const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
    }
  });
}, observerOptions);

document.querySelectorAll('.reveal').forEach(element => observer.observe(element));

// ===== SKILL BARS ANIMATION =====
const skillObserverOptions = { threshold: 0.3 };
const skillObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const skillFills = entry.target.querySelectorAll('.skill-fill');
      skillFills.forEach(bar => bar.classList.add('animated'));
    }
  });
}, skillObserverOptions);

document.querySelectorAll('.skill-card').forEach(card => skillObserver.observe(card));

// ===== MOBILE MENU TOGGLE =====
let menuOpen = false;

function toggleMenu() {
  const navLinks = document.querySelector('.nav-links');
  const hamburger = document.querySelector('.hamburger');
  
  menuOpen = !menuOpen;
  
  if (menuOpen) {
    navLinks.classList.add('active');
    hamburger.classList.add('active');
  } else {
    navLinks.classList.remove('active');
    hamburger.classList.remove('active');
  }
}

// Close menu when a link is clicked
document.querySelectorAll('.nav-links a').forEach(link => {
  link.addEventListener('click', () => {
    menuOpen = false;
    document.querySelector('.nav-links').classList.remove('active');
    document.querySelector('.hamburger').classList.remove('active');
  });
});

// ===== SMOOTH SCROLL =====
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    const href = this.getAttribute('href');
    if (href === '#' || href === '#!') return;
    
    e.preventDefault();
    const target = document.querySelector(href);
    if (target) {
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  });
});

// ===== NAVBAR SCROLL EFFECT =====
const navbar = document.getElementById('navbar');
window.addEventListener('scroll', () => {
  if (window.scrollY > 50) {
    navbar.style.background = 'rgba(2, 8, 23, 0.95)';
    navbar.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.2)';
  } else {
    navbar.style.background = 'rgba(2, 8, 23, 0.8)';
    navbar.style.boxShadow = 'none';
  }
});

// ===== FORM SUBMISSION =====
const contactForm = document.querySelector('.contact-form-wrap');
if (contactForm) {
  const submitBtn = contactForm.querySelector('.btn-primary');
  
  submitBtn.addEventListener('click', function(e) {
    const nameInput = contactForm.querySelector('input[type="text"]');
    const emailInput = contactForm.querySelector('input[type="email"]');
    const messageInput = contactForm.querySelector('textarea');
    
    if (nameInput.value && emailInput.value && messageInput.value) {
      // Form validation passed
      nameInput.value = '';
      emailInput.value = '';
      contactForm.querySelector('input[type="text"]:nth-of-type(2)').value = '';
      messageInput.value = '';
    }
  });
}

// ===== CERTIFICATE CARDS INTERACTION =====
document.querySelectorAll('.cert-card').forEach(card => {
  card.addEventListener('mouseenter', function() {
    this.style.transform = 'translateY(-4px) scale(1.02)';
  });
  
  card.addEventListener('mouseleave', function() {
    this.style.transform = 'translateY(0) scale(1)';
  });
});

// ===== PROJECT CARDS INTERACTION =====
document.querySelectorAll('.project-card').forEach(card => {
  card.addEventListener('mouseenter', function() {
    const thumbnail = this.querySelector('.project-thumb');
    if (thumbnail) {
      thumbnail.style.transform = 'scale(1.05)';
    }
  });
  
  card.addEventListener('mouseleave', function() {
    const thumbnail = this.querySelector('.project-thumb');
    if (thumbnail) {
      thumbnail.style.transform = 'scale(1)';
    }
  });
});

// ===== TAGS INTERACTION =====
document.querySelectorAll('.tag').forEach(tag => {
  tag.addEventListener('click', function(e) {
    e.preventDefault();
    this.style.transform = 'scale(0.95)';
    setTimeout(() => {
      this.style.transform = 'scale(1)';
    }, 150);
  });
});

// ===== AVATAR CLICK ANIMATION TOGGLE =====
const heroImg = document.querySelector('.hero-img');
const heroImgRing = document.querySelector('.hero-img-ring');
const heroImgGlow = document.querySelector('.hero-img-glow');
const heroImgWrap = document.querySelector('.hero-img-wrap');

if (heroImg) {
  heroImg.addEventListener('click', function(e) {
    e.stopPropagation();
    heroImg.classList.toggle('no-animation');
    heroImgRing.classList.toggle('no-animation');
    if (heroImgGlow) heroImgGlow.style.animation = heroImg.classList.contains('no-animation') ? 'none' : 'pulse-glow 4s ease-in-out infinite';
    if (heroImgWrap) heroImgWrap.style.pointerEvents = 'auto';
  });
}

// ===== STATS COUNTER =====
const animateCounter = (element, target, duration = 2000) => {
  let current = 0;
  const increment = target / (duration / 16);
  
  const counter = setInterval(() => {
    current += increment;
    if (current >= target) {
      element.textContent = target + '+';
      clearInterval(counter);
    } else {
      element.textContent = Math.floor(current) + '+';
    }
  }, 16);
};

// Observe stats for animation
const statsObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting && !entry.target.dataset.animated) {
      entry.target.dataset.animated = true;
      const statNum = entry.target.querySelector('.stat-num');
      if (statNum) {
        const number = parseInt(statNum.textContent);
        animateCounter(statNum, number);
      }
    }
  });
}, { threshold: 0.5 });

document.querySelectorAll('.stat').forEach(stat => statsObserver.observe(stat));

// ===== ACTIVE LINK HIGHLIGHTING =====
window.addEventListener('scroll', () => {
  let current = '';
  const sections = document.querySelectorAll('section');
  
  sections.forEach(section => {
    const sectionTop = section.offsetTop;
    const sectionHeight = section.clientHeight;
    
    if (scrollY >= sectionTop - 200) {
      current = section.getAttribute('id');
    }
  });
  
  document.querySelectorAll('.nav-links a').forEach(link => {
    link.classList.remove('active');
    if (link.getAttribute('href').includes(current)) {
      link.classList.add('active');
      link.style.color = 'var(--accent)';
    } else {
      link.style.color = 'var(--muted)';
    }
  });
});

// ===== PRELOAD ANIMATIONS =====
document.addEventListener('DOMContentLoaded', () => {
  // Add loading class
  document.body.classList.add('loaded');
  
  // Animate hero on load
  const heroContent = document.querySelector('.hero-content');
  if (heroContent) {
    heroContent.style.animation = 'slideUp .8s ease-out';
  }
});

// ===== KEYBOARD SHORTCUTS =====
document.addEventListener('keydown', (e) => {
  // Alt + H: Go to Hero
  if (e.altKey && e.key === 'h') {
    document.getElementById('hero').scrollIntoView({ behavior: 'smooth' });
  }
  // Alt + C: Go to Contact
  if (e.altKey && e.key === 'c') {
    document.getElementById('contact').scrollIntoView({ behavior: 'smooth' });
  }
});

// ===== THEME TOGGLE (Optional) =====
const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
if (prefersDark) {
  document.documentElement.style.colorScheme = 'dark';
}
