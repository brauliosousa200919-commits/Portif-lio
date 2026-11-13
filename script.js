const topbar = document.querySelector('.topbar');
const menuButton = document.querySelector('.menu-button');
const navigation = document.querySelector('.main-navigation');
const pageViewport = document.querySelector('main');
const navItems = document.querySelectorAll('.nav-item');
const sections = document.querySelectorAll('main section[id]');
const internalLinks = document.querySelectorAll('a[href^="#"]');
const revealItems = document.querySelectorAll('.reveal');
const contactForm = document.querySelector('#contact-form');
const formFeedback = document.querySelector('.form-feedback');
const currentYear = document.querySelector('#current-year');

function closeMenu() {
  navigation.classList.remove('is-open');
  menuButton.classList.remove('is-open');
  menuButton.setAttribute('aria-expanded', 'false');
  menuButton.setAttribute('aria-label', 'Abrir menu');
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
  pageViewport.scrollTo({
    left: target.offsetLeft,
    behavior: prefersReducedMotion ? 'auto' : 'smooth',
  });

  if (event.currentTarget.classList.contains('nav-item')) closeMenu();
}

internalLinks.forEach((link) => link.addEventListener('click', goToSection));

document.addEventListener('keydown', (event) => {
  if (event.key === 'Escape') closeMenu();
});

window.addEventListener('scroll', () => {
  topbar.classList.toggle('is-scrolled', window.scrollY > 30);
}, { passive: true });

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

const activeSectionObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      navItems.forEach((item) => {
        item.classList.toggle('is-active', item.getAttribute('href') === `#${entry.target.id}`);
      });
    });
  },
  { root: pageViewport, threshold: 0.55 }
);

sections.forEach((section) => activeSectionObserver.observe(section));

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
