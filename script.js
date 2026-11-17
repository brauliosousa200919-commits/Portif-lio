const topbar = document.querySelector('.topbar');
const menuButton = document.querySelector('.menu-button');
const navigation = document.querySelector('.main-navigation');
const navItems = document.querySelectorAll('.nav-item');
const sections = document.querySelectorAll('main section[id]');
const internalLinks = document.querySelectorAll('a[href^="#"]');
const revealItems = document.querySelectorAll('.reveal');
const contactForm = document.querySelector('#contact-form');
const formFeedback = document.querySelector('.form-feedback');
const currentYear = document.querySelector('#current-year');
const courseSlides = document.querySelectorAll('.course-gallery .course-image');
const nextCourseImage = document.querySelector('.course-gallery__next');
const heroVisual = document.querySelector('.hero__visual');
let activeCourseSlide = 0;

function updateCourseGallery() {
  courseSlides.forEach((slide, index) => {
    const isActive = index === activeCourseSlide;
    slide.classList.toggle('is-active', isActive);
    slide.setAttribute('aria-hidden', String(!isActive));
  });
}

if (nextCourseImage && courseSlides.length > 1) {
  nextCourseImage.addEventListener('click', () => {
    activeCourseSlide = (activeCourseSlide + 1) % courseSlides.length;
    updateCourseGallery();
  });
  updateCourseGallery();
}

const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');

if (heroVisual && !reducedMotion.matches) {
  heroVisual.addEventListener('pointermove', (event) => {
    if (event.pointerType === 'touch') return;

    const bounds = heroVisual.getBoundingClientRect();
    const x = (event.clientX - bounds.left) / bounds.width - 0.5;
    const y = (event.clientY - bounds.top) / bounds.height - 0.5;

    heroVisual.style.setProperty('--parallax-strong-x', `${(x * 12).toFixed(2)}px`);
    heroVisual.style.setProperty('--parallax-strong-y', `${(y * 12).toFixed(2)}px`);
    heroVisual.style.setProperty('--parallax-inner-x', `${(x * 7).toFixed(2)}px`);
    heroVisual.style.setProperty('--parallax-inner-y', `${(y * 7).toFixed(2)}px`);
    heroVisual.style.setProperty('--parallax-outer-x', `${(x * 4).toFixed(2)}px`);
    heroVisual.style.setProperty('--parallax-outer-y', `${(y * 4).toFixed(2)}px`);
  });

  heroVisual.addEventListener('pointerleave', () => {
    ['strong', 'inner', 'outer'].forEach((layer) => {
      heroVisual.style.setProperty(`--parallax-${layer}-x`, '0px');
      heroVisual.style.setProperty(`--parallax-${layer}-y`, '0px');
    });
  });
}

function updateScrollProgress() {
  const documentHeight = document.documentElement.scrollHeight - window.innerHeight;
  const progress = documentHeight > 0 ? window.scrollY / documentHeight : 0;
  topbar.style.setProperty('--scroll-progress', progress.toFixed(3));
}

function updateActiveNav() {
  const marker = window.scrollY + window.innerHeight * 0.35;
  let activeSection = sections[0];

  sections.forEach((section) => {
    if (section.offsetTop <= marker) activeSection = section;
  });

  navItems.forEach((item) => {
    item.classList.toggle('is-active', item.getAttribute('href') === `#${activeSection.id}`);
  });
}

function closeMenu() {
  navigation.classList.remove('is-open');
  menuButton.classList.remove('is-open');
  menuButton.setAttribute('aria-expanded', 'false');
  menuButton.setAttribute('aria-label', 'Abrir menu');
}

function scrollToTarget(target, behavior = 'smooth') {
  const headerOffset = topbar?.offsetHeight ?? 0;
  const targetTop = Math.max(0, target.getBoundingClientRect().top + window.scrollY - headerOffset - 12);

  window.scrollTo({ top: targetTop, behavior });
}

menuButton.addEventListener('click', () => {
  const isOpen = navigation.classList.toggle('is-open');
  menuButton.classList.toggle('is-open', isOpen);
  menuButton.setAttribute('aria-expanded', String(isOpen));
  menuButton.setAttribute('aria-label', isOpen ? 'Fechar menu' : 'Abrir menu');
});

function goToSection(event) {
  const targetId = event.currentTarget.getAttribute('href');
  const target = document.querySelector(targetId);

  if (!target) return;

  event.preventDefault();
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  scrollToTarget(target, prefersReducedMotion ? 'auto' : 'smooth');

  if (window.location.hash !== targetId) history.pushState(null, '', targetId);

  if (event.currentTarget.classList.contains('nav-item')) closeMenu();
}

internalLinks.forEach((link) => link.addEventListener('click', goToSection));

window.addEventListener('popstate', () => {
  const targetId = window.location.hash.slice(1);
  const target = targetId ? document.getElementById(targetId) : null;
  if (target) scrollToTarget(target, 'auto');
});

document.addEventListener('keydown', (event) => {
  if (event.key === 'Escape') closeMenu();
});

window.addEventListener('scroll', () => {
  topbar.classList.toggle('is-scrolled', window.scrollY > 30);
  updateScrollProgress();
  updateActiveNav();
}, { passive: true });

window.addEventListener('resize', updateActiveNav);
updateScrollProgress();
updateActiveNav();

const revealObserver = new IntersectionObserver(
  (entries, observer) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        observer.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.12 }
);

revealItems.forEach((item) => revealObserver.observe(item));

contactForm.addEventListener('submit', (event) => {
  event.preventDefault();
  const formData = new FormData(contactForm);
  const name = formData.get('name');
  const email = formData.get('email');
  const message = formData.get('message');
  const subject = encodeURIComponent(`Contato pelo portfólio — ${name}`);
  const body = encodeURIComponent(`Nome: ${name}\nE-mail: ${email}\n\nMensagem:\n${message}`);

  formFeedback.textContent = 'Abrindo seu aplicativo de e-mail...';
  window.location.href = `mailto:brauliodaniel200919@gmail.com?subject=${subject}&body=${body}`;
});

currentYear.textContent = new Date().getFullYear();
