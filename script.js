/* ================================================
   AFM-CODING PREMIUM PORTFOLIO — SCRIPT v3.0
   ================================================ */
'use strict';

document.addEventListener('DOMContentLoaded', () => {

  // ==========================================
  // 1. PRELOADER
  // ==========================================
  const preloader = document.getElementById('preloader');
  const preloaderFill = document.getElementById('preloaderFill');
  const preloaderPct = document.getElementById('preloaderPct');
  let pct = 0;

  const pctInterval = setInterval(() => {
    pct += Math.random() * 15;
    if (pct > 90) pct = 90;
    preloaderFill.style.width = pct + '%';
    preloaderPct.textContent = Math.floor(pct) + '%';
  }, 120);

  window.addEventListener('load', () => {
    clearInterval(pctInterval);
    preloaderFill.style.width = '100%';
    preloaderPct.textContent = '100%';
    setTimeout(() => {
      preloader.classList.add('done');
      initAOS();
      animateSkillBars('frontend');
    }, 600);
  });

  // Fallback
  setTimeout(() => {
    if (!preloader.classList.contains('done')) {
      clearInterval(pctInterval);
      preloaderFill.style.width = '100%';
      preloaderPct.textContent = '100%';
      preloader.classList.add('done');
      initAOS();
      animateSkillBars('frontend');
    }
  }, 3500);


  // ==========================================
  // 2. CUSTOM CURSOR
  // ==========================================
  const cursorDot = document.getElementById('cursorDot');
  const cursorRing = document.getElementById('cursorRing');
  let mouseX = 0, mouseY = 0;
  let ringX = 0, ringY = 0;

  if (window.matchMedia('(hover: hover)').matches) {
    document.addEventListener('mousemove', (e) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
      cursorDot.style.transform = `translate(calc(${mouseX}px - 50%), calc(${mouseY}px - 50%))`;
    });

    const animateCursor = () => {
      ringX += (mouseX - ringX) * 0.12;
      ringY += (mouseY - ringY) * 0.12;
      cursorRing.style.transform = `translate(calc(${ringX}px - 50%), calc(${ringY}px - 50%))`;
      requestAnimationFrame(animateCursor);
    };
    animateCursor();

    document.querySelectorAll('a, button, .proj-card, .project-featured, .ci-card').forEach(el => {
      el.addEventListener('mouseenter', () => cursorRing.classList.add('hover'));
      el.addEventListener('mouseleave', () => cursorRing.classList.remove('hover'));
    });
  }


  // ==========================================
  // 3. THEME TOGGLE
  // ==========================================
  const themeToggle = document.getElementById('themeToggle');
  const themeIcon = document.getElementById('themeIcon');
  const savedTheme = localStorage.getItem('afm-theme') || 'dark';
  applyTheme(savedTheme);

  themeToggle?.addEventListener('click', () => {
    const cur = document.body.getAttribute('data-theme');
    applyTheme(cur === 'dark' ? 'light' : 'dark');
  });

  function applyTheme(theme) {
    document.body.setAttribute('data-theme', theme);
    localStorage.setItem('afm-theme', theme);
    if (themeIcon) {
      themeIcon.className = theme === 'dark' ? 'fas fa-moon' : 'fas fa-sun';
    }
  }


  // ==========================================
  // 4. MOBILE MENU
  // ==========================================
  const hamburger = document.getElementById('hamburger');
  const mobileMenu = document.getElementById('mobileMenu');
  const mobLinks = document.querySelectorAll('.mob-link, .mob-cv');

  hamburger?.addEventListener('click', () => {
    hamburger.classList.toggle('open');
    mobileMenu.classList.toggle('open');
    document.body.style.overflow = mobileMenu.classList.contains('open') ? 'hidden' : '';
  });

  mobLinks.forEach(link => {
    link.addEventListener('click', () => {
      hamburger.classList.remove('open');
      mobileMenu.classList.remove('open');
      document.body.style.overflow = '';
    });
  });


  // ==========================================
  // 5. NAVBAR SCROLL + ACTIVE LINK
  // ==========================================
  const mainNav = document.getElementById('mainNav');
  const navLinkEls = document.querySelectorAll('.nav-link');
  const sections = document.querySelectorAll('section[id]');

  window.addEventListener('scroll', () => {
    // Scrolled class
    mainNav.classList.toggle('scrolled', window.scrollY > 50);

    // Active nav link
    let current = '';
    sections.forEach(sec => {
      const top = sec.offsetTop - 140;
      if (window.scrollY >= top) current = sec.getAttribute('id');
    });
    navLinkEls.forEach(link => {
      link.classList.toggle('active', link.getAttribute('href') === `#${current}`);
    });
  }, { passive: true });


  // ==========================================
  // 6. AOS — SIMPLE INTERSECTION OBSERVER
  // ==========================================
  function initAOS() {
    const aosEls = document.querySelectorAll('[data-aos]');
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const delay = entry.target.dataset.aosDelay || 0;
          setTimeout(() => entry.target.classList.add('aos-animate'), parseInt(delay));
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12 });

    aosEls.forEach(el => observer.observe(el));
  }


  // ==========================================
  // 7. ANIMATED COUNTERS
  // ==========================================
  const statNums = document.querySelectorAll('.astat-num');
  let countersRun = false;

  const counterObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting && !countersRun) {
        countersRun = true;
        statNums.forEach(el => {
          const target = parseInt(el.dataset.count);
          let count = 0;
          const step = Math.max(1, Math.floor(target / 40));
          const timer = setInterval(() => {
            count = Math.min(count + step, target);
            el.textContent = count;
            if (count >= target) clearInterval(timer);
          }, 40);
        });
      }
    });
  }, { threshold: 0.3 });

  const aboutStats = document.querySelector('.about-stats');
  if (aboutStats) counterObserver.observe(aboutStats);


  // ==========================================
  // 8. SKILLS TABS + PROGRESS BARS
  // ==========================================
  const stabs = document.querySelectorAll('.stab');
  const skillPanels = document.querySelectorAll('.skill-panel');

  stabs.forEach(tab => {
    tab.addEventListener('click', () => {
      const target = tab.dataset.tab;

      stabs.forEach(t => t.classList.remove('active'));
      skillPanels.forEach(p => p.classList.remove('active'));

      tab.classList.add('active');
      const panel = document.getElementById(`panel-${target}`);
      if (panel) {
        panel.classList.add('active');
        animateSkillBars(target);
      }
    });
  });

  // Observe skills section to trigger first animation
  const skillsWrap = document.querySelector('.skills-wrap');
  let skillsAnimated = false;
  const skillsObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting && !skillsAnimated) {
        skillsAnimated = true;
        animateSkillBars('frontend');
      }
    });
  }, { threshold: 0.2 });
  if (skillsWrap) skillsObserver.observe(skillsWrap);

  function animateSkillBars(tabName) {
    const panel = document.getElementById(`panel-${tabName}`);
    if (!panel) return;
    const bars = panel.querySelectorAll('.sfill');
    bars.forEach(bar => {
      bar.style.width = '0%';
      const target = getComputedStyle(bar).getPropertyValue('--w').trim();
      setTimeout(() => { bar.style.width = target; }, 80);
    });
  }


  // ==========================================
  // 9. CONTACT FORM
  // ==========================================
  const contactForm = document.getElementById('contactForm');
  const formSubmit = document.getElementById('formSubmit');
  const submitTxt = document.getElementById('submitTxt');
  const submitIcon = document.getElementById('submitIcon');

  contactForm?.addEventListener('submit', async (e) => {
    e.preventDefault();
    formSubmit.disabled = true;
    submitTxt.textContent = 'Sending...';
    submitIcon.className = 'fas fa-spinner fa-spin';

    try {
      const data = new FormData(contactForm);
      const res = await fetch('https://api.web3forms.com/submit', { method:'POST', body:data });
      const json = await res.json();

      if (res.ok && json.success) {
        showToast('Message sent successfully! I\'ll reply soon.', 'success');
        contactForm.reset();
      } else {
        showToast(json.message || 'Something went wrong. Please try again.', 'error');
      }
    } catch {
      showToast('Network error. Please check your connection.', 'error');
    } finally {
      formSubmit.disabled = false;
      submitTxt.textContent = 'Send Message';
      submitIcon.className = 'fas fa-paper-plane';
    }
  });


  // ==========================================
  // 10. TOAST NOTIFICATIONS
  // ==========================================
  function showToast(message, type = 'success') {
    const container = document.getElementById('toastContainer');
    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    toast.innerHTML = `
      <i class="fas ${type === 'success' ? 'fa-check-circle' : 'fa-exclamation-circle'}"></i>
      <span>${message}</span>
    `;
    container.appendChild(toast);
    requestAnimationFrame(() => {
      requestAnimationFrame(() => toast.classList.add('show'));
    });
    setTimeout(() => {
      toast.classList.remove('show');
      setTimeout(() => toast.remove(), 400);
    }, 4500);
  }


  // ==========================================
  // 11. SMOOTH SCROLL FOR ANCHOR LINKS
  // ==========================================
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', (e) => {
      const target = document.querySelector(anchor.getAttribute('href'));
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });


  // ==========================================
  // 12. FLOATING CARD PARALLAX ON MOUSE
  // ==========================================
  const heroSection = document.getElementById('home');
  const floatCards = document.querySelectorAll('.float-card');

  heroSection?.addEventListener('mousemove', (e) => {
    const rect = heroSection.getBoundingClientRect();
    const cx = rect.width / 2;
    const cy = rect.height / 2;
    const mx = (e.clientX - rect.left - cx) / cx;
    const my = (e.clientY - rect.top - cy) / cy;

    floatCards.forEach((card, i) => {
      const depth = (i % 3 + 1) * 4;
      const tx = mx * depth;
      const ty = my * depth;
      card.style.transform = `translate(${tx}px, ${ty}px)`;
    });
  });

  heroSection?.addEventListener('mouseleave', () => {
    floatCards.forEach(card => {
      card.style.transform = '';
    });
  });


  // ==========================================
  // 13. SCROLL HINT FADE
  // ==========================================
  const scrollHint = document.getElementById('scrollHint');
  window.addEventListener('scroll', () => {
    if (scrollHint) {
      scrollHint.style.opacity = window.scrollY > 100 ? '0' : '1';
    }
  }, { passive: true });


  // ==========================================
  // 14. PROJECT CARD TILT
  // ==========================================
  document.querySelectorAll('.proj-card, .project-featured').forEach(card => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width - 0.5;
      const y = (e.clientY - rect.top) / rect.height - 0.5;
      card.style.transform = `translateY(-8px) rotateY(${x * 6}deg) rotateX(${-y * 4}deg)`;
      card.style.perspective = '1000px';
    });
    card.addEventListener('mouseleave', () => {
      card.style.transform = '';
    });
  });

});
