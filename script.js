/* ================================================
   AFM-CODING PORTFOLIO — script.js v5.0
   Clean • Mobile-First • No Dead Code
   ================================================ */
'use strict';

document.addEventListener('DOMContentLoaded', () => {

  /* --------------------------------------------------
     1. PRELOADER
  -------------------------------------------------- */
  const preloader     = document.getElementById('preloader');
  const preloaderFill = document.getElementById('preloaderFill');
  const preloaderPct  = document.getElementById('preloaderPct');
  let pct = 0;

  const pctInterval = setInterval(() => {
    pct += Math.random() * 25 + 10;
    if (pct > 90) pct = 90;
    if (preloaderFill) preloaderFill.style.width = pct + '%';
    if (preloaderPct)  preloaderPct.textContent   = Math.floor(pct) + '%';
  }, 60);

  const hidePreloader = () => {
    clearInterval(pctInterval);
    if (preloaderFill) preloaderFill.style.width = '100%';
    if (preloaderPct)  preloaderPct.textContent   = '100%';
    setTimeout(() => {
      preloader?.classList.add('done');
      initAOS();
      animateSkillBars('frontend');
    }, 250);
  };

  window.addEventListener('load', hidePreloader);
  setTimeout(hidePreloader, 1500); // max wait


  /* --------------------------------------------------
     2. CUSTOM CURSOR (desktop only)
  -------------------------------------------------- */
  if (window.matchMedia('(hover: hover) and (min-width: 769px)').matches) {
    const cursorDot  = document.getElementById('cursorDot');
    const cursorRing = document.getElementById('cursorRing');
    let mouseX = 0, mouseY = 0, ringX = 0, ringY = 0;

    document.addEventListener('mousemove', (e) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
      if (cursorDot) cursorDot.style.transform = `translate(calc(${mouseX}px - 50%), calc(${mouseY}px - 50%))`;
    });

    const animateCursor = () => {
      ringX += (mouseX - ringX) * 0.15;
      ringY += (mouseY - ringY) * 0.15;
      if (cursorRing) cursorRing.style.transform = `translate(calc(${ringX}px - 50%), calc(${ringY}px - 50%))`;
      requestAnimationFrame(animateCursor);
    };
    animateCursor();

    document.querySelectorAll('a, button, .proj-card, .project-featured').forEach(el => {
      el.addEventListener('mouseenter', () => cursorRing?.classList.add('hover'));
      el.addEventListener('mouseleave', () => cursorRing?.classList.remove('hover'));
    });
  }


  /* --------------------------------------------------
     3. THEME TOGGLE
  -------------------------------------------------- */
  const themeToggle = document.getElementById('themeToggle');
  const themeIcon   = document.getElementById('themeIcon');
  applyTheme(localStorage.getItem('afm-theme') || 'dark');

  themeToggle?.addEventListener('click', () => {
    const cur = document.documentElement.getAttribute('data-theme') || 'light';
    applyTheme(cur === 'light' ? 'dark' : 'light');
  });

  function applyTheme(theme) {
    document.documentElement.setAttribute('data-theme', theme);
    document.body.setAttribute('data-theme', theme);
    localStorage.setItem('afm-theme', theme);
    if (themeIcon) themeIcon.className = theme === 'light' ? 'fas fa-sun' : 'fas fa-moon';
  }


  /* --------------------------------------------------
     4. MOBILE MENU
  -------------------------------------------------- */
  const hamburger     = document.getElementById('hamburger');
  const mobileMenu    = document.getElementById('mobileMenu');
  const mobHasDropdown = document.querySelector('.mob-has-dropdown');
  const mobProjectsBtn = document.getElementById('mobProjects');

  const closeMobileMenu = () => {
    hamburger?.classList.remove('open');
    mobileMenu?.classList.remove('open');
    document.body.classList.remove('menu-open');
  };

  hamburger?.addEventListener('click', () => {
    hamburger.classList.toggle('open');
    mobileMenu?.classList.toggle('open');
    document.body.classList.toggle('menu-open', mobileMenu?.classList.contains('open'));
  });

  // Projects sub-dropdown toggle
  mobProjectsBtn?.addEventListener('click', (e) => {
    e.preventDefault();
    mobHasDropdown?.classList.toggle('open');
  });

  // Close menu when any link is clicked
  document.querySelectorAll('.mob-link:not(#mobProjects), .mob-sublink, .mob-cv').forEach(link => {
    link.addEventListener('click', closeMobileMenu);
  });

  // Close on outside click
  document.addEventListener('click', (e) => {
    if (mobileMenu?.classList.contains('open') &&
        !mobileMenu.contains(e.target) &&
        !hamburger.contains(e.target)) {
      closeMobileMenu();
    }
  });


  /* --------------------------------------------------
     5. NAVBAR SCROLL + ACTIVE LINK TRACKING
  -------------------------------------------------- */
  const mainNav     = document.getElementById('mainNav');
  const navLinkEls  = document.querySelectorAll('.nav-link, .mob-link, .mob-sublink');
  const sections    = document.querySelectorAll('section[id]');

  window.addEventListener('scroll', () => {
    mainNav?.classList.toggle('scrolled', window.scrollY > 40);

    let current = '';
    sections.forEach(sec => {
      if (window.scrollY >= sec.offsetTop - 120) current = sec.getAttribute('id');
    });

    navLinkEls.forEach(link => {
      link.classList.toggle('active', link.getAttribute('href') === `#${current}`);
    });
  }, { passive: true });


  /* --------------------------------------------------
     6. AOS — SCROLL ANIMATIONS (Intersection Observer)
  -------------------------------------------------- */
  function initAOS() {
    const isMobile = window.innerWidth <= 768;

    // On mobile, project cards are always visible — no animation needed
    if (isMobile) {
      document.querySelectorAll('.projects-grid [data-aos], .project-featured[data-aos]').forEach(el => {
        el.classList.add('aos-animate');
      });
    }

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const delay = parseInt(entry.target.dataset.aosDelay || 0);
          setTimeout(() => entry.target.classList.add('aos-animate'), delay);
          observer.unobserve(entry.target);
        }
      });
    }, {
      threshold: 0.05,   // trigger earlier — just 5% in view
      rootMargin: '0px 0px -40px 0px'
    });

    document.querySelectorAll('[data-aos]').forEach(el => observer.observe(el));
  }


  /* --------------------------------------------------
     7. SKILLS TABS + BAR ANIMATION
  -------------------------------------------------- */
  document.querySelectorAll('.stab').forEach(tab => {
    tab.addEventListener('click', () => {
      const target = tab.dataset.tab;

      document.querySelectorAll('.stab').forEach(t => t.classList.remove('active'));
      document.querySelectorAll('.skill-panel').forEach(p => p.classList.remove('active'));

      tab.classList.add('active');
      const panel = document.getElementById(`panel-${target}`);
      if (panel) {
        panel.classList.add('active');
        animateSkillBars(target);
      }
    });
  });

  function animateSkillBars(tabName) {
    const panel = document.getElementById(`panel-${tabName}`);
    if (!panel) return;
    panel.querySelectorAll('.sfill').forEach(bar => {
      bar.style.width = '0%';
      const target = bar.style.getPropertyValue('--w') || '85%';
      setTimeout(() => { bar.style.width = target; }, 60);
    });
  }


  /* --------------------------------------------------
     8. CONTACT FORM (Web3Forms)
  -------------------------------------------------- */
  const contactForm = document.getElementById('contactForm');
  const formSubmit  = document.getElementById('formSubmit');
  const submitTxt   = document.getElementById('submitTxt');
  const submitIcon  = document.getElementById('submitIcon');

  contactForm?.addEventListener('submit', async (e) => {
    e.preventDefault();
    if (formSubmit) formSubmit.disabled = true;
    if (submitTxt)  submitTxt.textContent = 'Sending...';
    if (submitIcon) submitIcon.className  = 'fas fa-spinner fa-spin';

    try {
      const data = new FormData(contactForm);
      const nameVal    = data.get('name') || '';
      const subjectVal = data.get('msg_subject') || '';
      data.set('subject', `New Message from ${nameVal} - ${subjectVal}`);

      const res  = await fetch('https://api.web3forms.com/submit', { method: 'POST', body: data });
      const json = await res.json();

      if (res.ok && json.success) {
        showToast('Message sent! I will reply soon.', 'success');
        contactForm.reset();
      } else {
        showToast(json.message || 'Something went wrong. Please try again.', 'error');
      }
    } catch {
      showToast('Network error. Please check your connection.', 'error');
    } finally {
      if (formSubmit) formSubmit.disabled = false;
      if (submitTxt)  submitTxt.textContent = 'Send Message';
      if (submitIcon) submitIcon.className  = 'fas fa-paper-plane';
    }
  });


  /* --------------------------------------------------
     9. TOAST NOTIFICATIONS
  -------------------------------------------------- */
  function showToast(message, type = 'success') {
    const container = document.getElementById('toastContainer');
    if (!container) return;

    const icon  = type === 'success' ? 'fa-check-circle' : 'fa-exclamation-circle';
    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    toast.innerHTML = `<i class="fas ${icon}"></i><span>${message}</span>`;
    container.appendChild(toast);

    requestAnimationFrame(() => requestAnimationFrame(() => toast.classList.add('show')));

    setTimeout(() => {
      toast.classList.remove('show');
      setTimeout(() => toast.remove(), 400);
    }, 4000);
  }


  /* --------------------------------------------------
     10. SMOOTH SCROLL
  -------------------------------------------------- */
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', (e) => {
      const targetId = anchor.getAttribute('href');
      if (targetId && targetId !== '#') {
        const target = document.querySelector(targetId);
        if (target) {
          e.preventDefault();
          target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      }
    });
  });

});
