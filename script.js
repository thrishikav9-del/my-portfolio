/**
 * VULLASA THRISHIKA — PORTFOLIO JAVASCRIPT
 * Pure Vanilla JavaScript (ES6+)
 * No external framework dependencies.
 */

document.addEventListener('DOMContentLoaded', () => {
  'use strict';

  // -------------------------------------------------------------------
  // 1. DOM ELEMENT REFERENCES
  // -------------------------------------------------------------------
  const header = document.getElementById('site-header');
  const navToggle = document.getElementById('nav-toggle');
  const navMenu = document.getElementById('nav-menu');
  const navOverlay = document.getElementById('nav-overlay');
  const navLinks = document.querySelectorAll('.nav-link');
  const backToTopBtn = document.getElementById('back-to-top');
  const currentYearSpan = document.getElementById('current-year');
  const modalTriggers = document.querySelectorAll('[data-modal], .modal-trigger-btn');
  const modalCloseBtns = document.querySelectorAll('[data-close-modal]');
  const modals = document.querySelectorAll('.modal');
  const toggleArchiveLink = document.getElementById('toggle-archive-link') || document.getElementById('toggle-archive-btn');
  const projectsArchive = document.getElementById('all-projects-archive');

  // -------------------------------------------------------------------
  // CUSTOM DOMAIN READINESS & SITE CONFIGURATION
  // -------------------------------------------------------------------
  // To configure a custom domain in the future, simply set customDomain below.
  window.SITE_CONFIG = {
    customDomain: null, // e.g. "https://vullasathrishika.com" when registered
    get siteUrl() {
      return this.customDomain || (window.location.origin !== 'null' ? window.location.origin : '');
    }
  };

  const canonicalTag = document.getElementById('canonical-url');
  const ogUrlTag = document.getElementById('og-url');
  if (window.SITE_CONFIG.siteUrl) {
    const fullPath = window.SITE_CONFIG.siteUrl + window.location.pathname;
    if (canonicalTag) canonicalTag.setAttribute('href', fullPath);
    if (ogUrlTag) ogUrlTag.setAttribute('content', fullPath);
  }

  // -------------------------------------------------------------------
  // 2. CURRENT YEAR UPDATE
  // -------------------------------------------------------------------
  if (currentYearSpan) {
    currentYearSpan.textContent = new Date().getFullYear();
  }

  // -------------------------------------------------------------------
  // 3. STICKY HEADER SCROLL EFFECT
  // -------------------------------------------------------------------
  const handleHeaderScroll = () => {
    if (window.scrollY > 30) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  };

  window.addEventListener('scroll', handleHeaderScroll, { passive: true });
  handleHeaderScroll();

  // -------------------------------------------------------------------
  // 4. MOBILE NAVIGATION DRAWER TOGGLE
  // -------------------------------------------------------------------
  const toggleMobileMenu = () => {
    const isOpen = navMenu.classList.contains('open');
    if (isOpen) {
      closeMobileMenu();
    } else {
      openMobileMenu();
    }
  };

  const openMobileMenu = () => {
    navMenu.classList.add('open');
    navToggle.classList.add('open');
    navOverlay.classList.add('active');
    navToggle.setAttribute('aria-expanded', 'true');
    document.body.style.overflow = 'hidden';
  };

  const closeMobileMenu = () => {
    navMenu.classList.remove('open');
    navToggle.classList.remove('open');
    navOverlay.classList.remove('active');
    navToggle.setAttribute('aria-expanded', 'false');
    document.body.style.overflow = '';
  };

  if (navToggle) {
    navToggle.addEventListener('click', toggleMobileMenu);
  }

  if (navOverlay) {
    navOverlay.addEventListener('click', closeMobileMenu);
  }

  navLinks.forEach(link => {
    link.addEventListener('click', () => {
      closeMobileMenu();
    });
  });

  // -------------------------------------------------------------------
  // 5. PROJECTS ARCHIVE EXPAND / COLLAPSE TOGGLE
  // -------------------------------------------------------------------
  const toggleArchive = (e) => {
    if (e && e.preventDefault) e.preventDefault();
    const btn = document.getElementById('toggle-archive-link') || document.getElementById('toggle-archive-btn') || toggleArchiveLink;
    const archive = document.getElementById('all-projects-archive') || projectsArchive;
    if (!btn || !archive) return;

    const isExpanded = archive.classList.contains('expanded');
    const linkLabel = btn.querySelector('.link-label');
    const linkArrow = btn.querySelector('.link-arrow');

    if (isExpanded) {
      archive.classList.remove('expanded');
      archive.classList.add('hidden-archive');
      btn.setAttribute('aria-expanded', 'false');
      if (linkLabel) linkLabel.textContent = 'Explore the project archive';
      if (linkArrow) linkArrow.innerHTML = '&rarr;';
    } else {
      archive.classList.remove('hidden-archive');
      archive.classList.add('expanded');
      btn.setAttribute('aria-expanded', 'true');
      if (linkLabel) linkLabel.textContent = 'Close project archive';
      if (linkArrow) linkArrow.innerHTML = '&uarr;';
      
      // Trigger reveal animations and ensure full visibility for archive project cards
      const archiveCards = archive.querySelectorAll('.project-card');
      archiveCards.forEach(card => {
        card.classList.add('active');
        if (!card.classList.contains('filter-hidden')) {
          card.style.opacity = '1';
          card.style.transform = 'translateY(0)';
        }
      });
    }
  };

  if (toggleArchiveLink) {
    toggleArchiveLink.addEventListener('click', toggleArchive);
  }

  // Global delegation fallback to guarantee click detection on nested spans or alternate IDs
  document.addEventListener('click', (e) => {
    const trigger = e.target.closest('#toggle-archive-link, #toggle-archive-btn, .archive-text-link');
    if (trigger && trigger !== toggleArchiveLink) {
      toggleArchive(e);
    }
  });

  // -------------------------------------------------------------------
  // 5b. ARCHIVE CATEGORY FILTERING
  // -------------------------------------------------------------------
  const filterButtons = document.querySelectorAll('.filter-btn');
  const archiveCards = document.querySelectorAll('.archive-projects-grid .project-card');

  if (filterButtons.length > 0 && archiveCards.length > 0) {
    filterButtons.forEach(btn => {
      btn.addEventListener('click', (e) => {
        if (e && e.preventDefault) e.preventDefault();
        const filter = btn.getAttribute('data-filter');

        // Update active class and aria-pressed state
        filterButtons.forEach(b => {
          b.classList.remove('active');
          b.setAttribute('aria-pressed', 'false');
        });
        btn.classList.add('active');
        btn.setAttribute('aria-pressed', 'true');

        // Filter cards in the archive grid
        archiveCards.forEach(card => {
          const cardCategories = (card.getAttribute('data-categories') || '').split(' ');
          if (filter === 'all' || cardCategories.includes(filter)) {
            card.classList.remove('filter-hidden');
            card.classList.add('active');
            card.style.display = '';
            card.style.opacity = '1';
            card.style.transform = 'translateY(0)';
          } else {
            card.classList.add('filter-hidden');
            card.style.display = 'none';
          }
        });
      });
    });
  }

  // -------------------------------------------------------------------
  // 5c. CERTIFICATIONS & COMPETITIONS EDITORIAL EXPAND / COLLAPSE
  // -------------------------------------------------------------------
  const toggleCertsBtn = document.getElementById('toggle-certs-btn');
  const extraCertsContainer = document.getElementById('extra-certs-container');

  if (toggleCertsBtn && extraCertsContainer) {
    toggleCertsBtn.addEventListener('click', () => {
      const isCurrentlyCollapsed = extraCertsContainer.classList.contains('is-collapsed');
      const label = toggleCertsBtn.querySelector('.toggle-btn-label');
      const arrow = toggleCertsBtn.querySelector('.toggle-btn-arrow');

      if (isCurrentlyCollapsed) {
        extraCertsContainer.classList.remove('is-collapsed');
        extraCertsContainer.setAttribute('aria-hidden', 'false');
        toggleCertsBtn.setAttribute('aria-expanded', 'true');
        if (label) label.textContent = 'Show fewer';
        if (arrow) arrow.innerHTML = '&uarr;';
      } else {
        extraCertsContainer.classList.add('is-collapsed');
        extraCertsContainer.setAttribute('aria-hidden', 'true');
        toggleCertsBtn.setAttribute('aria-expanded', 'false');
        if (label) label.textContent = 'View all certifications (4)';
        if (arrow) arrow.innerHTML = '&darr;';
      }
    });
  }

  const toggleCompetitionsBtn = document.getElementById('toggle-competitions-btn');
  const competitionsContainer = document.getElementById('competitions-container');

  if (toggleCompetitionsBtn && competitionsContainer) {
    toggleCompetitionsBtn.addEventListener('click', () => {
      const isCurrentlyCollapsed = competitionsContainer.classList.contains('is-collapsed');
      const label = toggleCompetitionsBtn.querySelector('.toggle-btn-label');
      const arrow = toggleCompetitionsBtn.querySelector('.toggle-btn-arrow');

      if (isCurrentlyCollapsed) {
        competitionsContainer.classList.remove('is-collapsed');
        competitionsContainer.setAttribute('aria-hidden', 'false');
        toggleCompetitionsBtn.setAttribute('aria-expanded', 'true');
        if (label) label.textContent = 'Show fewer';
        if (arrow) arrow.innerHTML = '&uarr;';
      } else {
        competitionsContainer.classList.add('is-collapsed');
        competitionsContainer.setAttribute('aria-hidden', 'true');
        toggleCompetitionsBtn.setAttribute('aria-expanded', 'false');
        if (label) label.textContent = 'View competitions (3)';
        if (arrow) arrow.innerHTML = '&darr;';
      }
    });
  }

  // -------------------------------------------------------------------
  // 6. ACTIVE NAVIGATION LINK HIGHLIGHTING ON SCROLL
  // -------------------------------------------------------------------
  const sections = document.querySelectorAll('section[id]');

  const highlightNavOnScroll = () => {
    const scrollPosition = window.scrollY + 120;

    sections.forEach(section => {
      const sectionTop = section.offsetTop;
      const sectionHeight = section.offsetHeight;
      const sectionId = section.getAttribute('id');

      if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
        navLinks.forEach(link => {
          link.classList.remove('active');
          if (link.getAttribute('href') === `#${sectionId}`) {
            link.classList.add('active');
          }
        });
      }
    });
  };

  window.addEventListener('scroll', highlightNavOnScroll, { passive: true });

  // -------------------------------------------------------------------
  // 7. SCROLL REVEAL ANIMATIONS (INTERSECTION OBSERVER)
  // -------------------------------------------------------------------
  const revealElements = document.querySelectorAll('.reveal');

  if ('IntersectionObserver' in window) {
    const revealObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('active');
          observer.unobserve(entry.target);
        }
      });
    }, {
      root: null,
      threshold: 0.1,
      rootMargin: '0px 0px -40px 0px'
    });

    revealElements.forEach(el => revealObserver.observe(el));
  } else {
    revealElements.forEach(el => el.classList.add('active'));
  }

  // -------------------------------------------------------------------
  // 8. BACK TO TOP BUTTON
  // -------------------------------------------------------------------
  const handleBackToTopVisibility = () => {
    if (window.scrollY > 400) {
      backToTopBtn.classList.add('visible');
    } else {
      backToTopBtn.classList.remove('visible');
    }
  };

  window.addEventListener('scroll', handleBackToTopVisibility, { passive: true });

  if (backToTopBtn) {
    backToTopBtn.addEventListener('click', () => {
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    });
  }

  // -------------------------------------------------------------------
  // 9. ACCESSIBLE MODALS FOR PROJECT DETAILS
  // -------------------------------------------------------------------
  const openModal = (targetModalId) => {
    const targetModal = document.getElementById(targetModalId);
    if (!targetModal) return;

    targetModal.classList.add('active');
    targetModal.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';

    const closeBtn = targetModal.querySelector('.modal-close-btn');
    if (closeBtn) closeBtn.focus();
  };

  const closeModal = (modalToClose) => {
    if (!modalToClose) return;

    modalToClose.classList.remove('active');
    modalToClose.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  };

  modalTriggers.forEach(trigger => {
    trigger.addEventListener('click', (e) => {
      e.preventDefault();
      const modalId = trigger.getAttribute('data-modal');
      if (modalId) {
        openModal(modalId);
      }
    });
  });

  modalCloseBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const parentModal = btn.closest('.modal');
      closeModal(parentModal);
    });
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      modals.forEach(modal => {
        if (modal.classList.contains('active')) {
          closeModal(modal);
        }
      });
    }
  });

  // -------------------------------------------------------------------
  // 10. SCROLL PROGRESS INDICATOR BAR
  // -------------------------------------------------------------------
  const scrollProgressBar = document.getElementById('scroll-progress');
  const updateScrollProgress = () => {
    if (!scrollProgressBar) return;
    const scrollTop = window.scrollY || document.documentElement.scrollTop;
    const scrollHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
    const progress = scrollHeight > 0 ? (scrollTop / scrollHeight) * 100 : 0;
    scrollProgressBar.style.width = `${Math.min(100, Math.max(0, progress))}%`;
  };

  window.addEventListener('scroll', updateScrollProgress, { passive: true });
  updateScrollProgress();

  // -------------------------------------------------------------------
  // 11. INLINE EMAIL COPY TO CLIPBOARD
  // -------------------------------------------------------------------
  const emailCopyBtn = document.getElementById('email-copy-btn');
  if (emailCopyBtn) {
    emailCopyBtn.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();
      const email = 'thrishikav9@gmail.com';

      const setCopiedState = () => {
        const icon = emailCopyBtn.querySelector('i');
        if (icon) icon.className = 'fa-solid fa-check';
        emailCopyBtn.setAttribute('data-tooltip', 'Copied!');
        emailCopyBtn.setAttribute('aria-label', 'Copied email to clipboard');
        emailCopyBtn.classList.add('copied');

        setTimeout(() => {
          if (icon) icon.className = 'fa-regular fa-copy';
          emailCopyBtn.setAttribute('data-tooltip', 'Copy email');
          emailCopyBtn.setAttribute('aria-label', 'Copy email address');
          emailCopyBtn.classList.remove('copied');
        }, 1800);
      };

      if (navigator.clipboard && window.isSecureContext) {
        navigator.clipboard.writeText(email).then(setCopiedState).catch(() => {
          fallbackCopyText(email, setCopiedState);
        });
      } else {
        fallbackCopyText(email, setCopiedState);
      }
    });
  }

  function fallbackCopyText(text, callback) {
    const textArea = document.createElement('textarea');
    textArea.value = text;
    textArea.style.position = 'fixed';
    textArea.style.left = '-9999px';
    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();
    try {
      document.execCommand('copy');
      if (callback) callback();
    } catch (err) {
      console.error('Fallback copy failed', err);
    }
    document.body.removeChild(textArea);
  }
});
