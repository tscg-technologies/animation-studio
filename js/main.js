/* ==========================================================================
   ANIMATION STUDIO — VANILLA JAVASCRIPT INTERACTIVITY
   Zero External Libraries | Clean, Modular & Accessible
   ========================================================================== */

(function () {
  'use strict';

  document.addEventListener('DOMContentLoaded', function () {
    initStickyHeader();
    initMobileNavigation();
    initScrollReveal();
    initBackToTop();
    initPortfolioFiltersAndModal();
    initFaqAccordion();
    initEnquiryFormValidation();
  });

  /* ------------------------------------------------------------------------
     1. Sticky Header Scroll State
     ------------------------------------------------------------------------ */
  function initStickyHeader() {
    var header = document.querySelector('.site-header');
    if (!header) return;

    function onScroll() {
      if (window.scrollY > 24) {
        header.classList.add('scrolled');
      } else {
        header.classList.remove('scrolled');
      }
    }

    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
  }

  /* ------------------------------------------------------------------------
     2. Mobile Hamburger Menu
     ------------------------------------------------------------------------ */
  function initMobileNavigation() {
    var toggleBtn = document.querySelector('.menu-toggle');
    var navMenu = document.querySelector('.nav-menu');
    if (!toggleBtn || !navMenu) return;

    toggleBtn.addEventListener('click', function () {
      var isOpen = navMenu.classList.toggle('open');
      toggleBtn.classList.toggle('open', isOpen);
      toggleBtn.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
    });

    // Close menu on link click
    var links = navMenu.querySelectorAll('.nav-link');
    links.forEach(function (link) {
      link.addEventListener('click', function () {
        navMenu.classList.remove('open');
        toggleBtn.classList.remove('open');
        toggleBtn.setAttribute('aria-expanded', 'false');
      });
    });

    // Close on Escape key
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && navMenu.classList.contains('open')) {
        navMenu.classList.remove('open');
        toggleBtn.classList.remove('open');
        toggleBtn.setAttribute('aria-expanded', 'false');
      }
    });
  }

  /* ------------------------------------------------------------------------
     3. Scroll Reveal Animations (IntersectionObserver)
     ------------------------------------------------------------------------ */
  function initScrollReveal() {
    var revealElements = document.querySelectorAll('.reveal');
    if (!revealElements.length) return;

    if ('IntersectionObserver' in window) {
      var observer = new IntersectionObserver(
        function (entries) {
          entries.forEach(function (entry) {
            if (entry.isIntersecting) {
              entry.target.classList.add('revealed');
              observer.unobserve(entry.target);
            }
          });
        },
        { threshold: 0.12, rootMargin: '0px 0px -30px 0px' }
      );

      revealElements.forEach(function (el) {
        observer.observe(el);
      });
    } else {
      revealElements.forEach(function (el) {
        el.classList.add('revealed');
      });
    }
  }

  /* ------------------------------------------------------------------------
     4. Back-to-Top Button
     ------------------------------------------------------------------------ */
  function initBackToTop() {
    var backToTopBtn = document.getElementById('backToTop');
    if (!backToTopBtn) return;

    window.addEventListener(
      'scroll',
      function () {
        if (window.scrollY > 400) {
          backToTopBtn.classList.add('visible');
        } else {
          backToTopBtn.classList.remove('visible');
        }
      },
      { passive: true }
    );

    backToTopBtn.addEventListener('click', function () {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  /* ------------------------------------------------------------------------
     5. Portfolio Category Filtering & Preview Modal
     ------------------------------------------------------------------------ */
  function initPortfolioFiltersAndModal() {
    var filterButtons = document.querySelectorAll('.filter-btn');
    var projectCards = Array.prototype.slice.call(document.querySelectorAll('.project-card'));
    var modalBackdrop = document.getElementById('projectModal');

    // Category Filtering
    if (filterButtons.length && projectCards.length) {
      filterButtons.forEach(function (btn) {
        btn.addEventListener('click', function () {
          var category = btn.getAttribute('data-filter');

          filterButtons.forEach(function (b) {
            b.classList.remove('active');
            b.setAttribute('aria-pressed', 'false');
          });
          btn.classList.add('active');
          btn.setAttribute('aria-pressed', 'true');

          projectCards.forEach(function (card) {
            var cardCat = card.getAttribute('data-category');
            if (category === 'all' || cardCat === category) {
              card.classList.remove('hidden');
            } else {
              card.classList.add('hidden');
            }
          });
        });
      });
    }

    // Modal Preview Logic
    if (!modalBackdrop || !projectCards.length) return;

    var modalTitle = document.getElementById('modalProjectTitle');
    var modalCategory = document.getElementById('modalProjectCategory');
    var modalAspect = document.getElementById('modalProjectAspect');
    var modalDesc = document.getElementById('modalProjectDesc');
    var modalFile = document.getElementById('modalProjectFilename');
    var modalStage = document.getElementById('modalStageContainer');
    var modalImg = document.getElementById('modalProjectImg');
    var simPlayToggle = document.getElementById('modalPlayToggle');
    var closeBtn = document.getElementById('modalCloseBtn');
    var prevBtn = document.getElementById('modalPrevBtn');
    var nextBtn = document.getElementById('modalNextBtn');

    var currentIndex = 0;

    function getVisibleCards() {
      return projectCards.filter(function (card) {
        return !card.classList.contains('hidden');
      });
    }

    function populateModal(card) {
      if (!card) return;
      var title = card.getAttribute('data-title') || 'Illustrative Animation Project';
      var category = card.getAttribute('data-category-label') || 'Animation Demo';
      var aspect = card.getAttribute('data-aspect') || '16:9';
      var desc = card.getAttribute('data-description') || '';
      var filename = card.getAttribute('data-filename') || 'portfolio-2d-animation.jpeg';

      if (modalTitle) modalTitle.textContent = title;
      if (modalCategory) modalCategory.textContent = category;
      if (modalAspect) modalAspect.textContent = 'Aspect Ratio: ' + aspect;
      if (modalDesc) modalDesc.textContent = desc;
      if (modalFile) modalFile.textContent = filename;
      if (modalImg) {
        modalImg.src = 'images/' + filename;
        modalImg.alt = title + ' preview artwork';
      }

      if (modalStage) {
        modalStage.classList.remove('modal-Stage-Paused');
      }
      if (simPlayToggle) {
        simPlayToggle.textContent = '❚❚';
        simPlayToggle.setAttribute('aria-label', 'Pause simulated animation preview');
      }
    }

    function openModalForCard(card) {
      var visible = getVisibleCards();
      currentIndex = visible.indexOf(card);
      if (currentIndex === -1) currentIndex = 0;

      populateModal(visible[currentIndex]);
      modalBackdrop.classList.add('active');
      modalBackdrop.setAttribute('aria-hidden', 'false');
      document.body.style.overflow = 'hidden';
      if (closeBtn) closeBtn.focus();
    }

    function closeModal() {
      modalBackdrop.classList.remove('active');
      modalBackdrop.setAttribute('aria-hidden', 'true');
      document.body.style.overflow = '';
    }

    function stepModal(direction) {
      var visible = getVisibleCards();
      if (!visible.length) return;
      currentIndex = (currentIndex + direction + visible.length) % visible.length;
      populateModal(visible[currentIndex]);
    }

    // Bind triggers inside project cards
    projectCards.forEach(function (card) {
      var triggers = card.querySelectorAll('.open-project-modal');
      triggers.forEach(function (trigger) {
        trigger.addEventListener('click', function (e) {
          e.preventDefault();
          openModalForCard(card);
        });
      });
    });

    if (closeBtn) {
      closeBtn.addEventListener('click', closeModal);
    }

    if (prevBtn) {
      prevBtn.addEventListener('click', function () {
        stepModal(-1);
      });
    }

    if (nextBtn) {
      nextBtn.addEventListener('click', function () {
        stepModal(1);
      });
    }

    if (simPlayToggle && modalStage) {
      simPlayToggle.addEventListener('click', function () {
        var paused = modalStage.classList.toggle('modal-Stage-Paused');
        simPlayToggle.textContent = paused ? '▶' : '❚❚';
      });
    }

    // Backdrop click to close
    modalBackdrop.addEventListener('click', function (e) {
      if (e.target === modalBackdrop) {
        closeModal();
      }
    });

    // Keyboard navigation (Escape, Left, Right)
    document.addEventListener('keydown', function (e) {
      if (!modalBackdrop.classList.contains('active')) return;
      if (e.key === 'Escape') {
        closeModal();
      } else if (e.key === 'ArrowLeft') {
        stepModal(-1);
      } else if (e.key === 'ArrowRight') {
        stepModal(1);
      }
    });
  }

  /* ------------------------------------------------------------------------
     6. FAQ Accordion
     ------------------------------------------------------------------------ */
  function initFaqAccordion() {
    var faqItems = document.querySelectorAll('.faq-item');
    if (!faqItems.length) return;

    faqItems.forEach(function (item) {
      var trigger = item.querySelector('.faq-trigger');
      var content = item.querySelector('.faq-content');
      if (!trigger || !content) return;

      trigger.addEventListener('click', function () {
        var isOpen = item.classList.contains('open');

        // Close all others
        faqItems.forEach(function (other) {
          other.classList.remove('open');
          var otherTrigger = other.querySelector('.faq-trigger');
          var otherContent = other.querySelector('.faq-content');
          if (otherTrigger) otherTrigger.setAttribute('aria-expanded', 'false');
          if (otherContent) otherContent.style.maxHeight = null;
        });

        if (!isOpen) {
          item.classList.add('open');
          trigger.setAttribute('aria-expanded', 'true');
          content.style.maxHeight = content.scrollHeight + 'px';
        }
      });
    });
  }

  /* ------------------------------------------------------------------------
     7. Project Enquiry Form Validation (Frontend Demo Only)
     ------------------------------------------------------------------------ */
  function initEnquiryFormValidation() {
    var form = document.getElementById('projectEnquiryForm');
    if (!form) return;

    var feedbackBox = document.getElementById('formDemoSuccess');

    function setFieldError(input, hasError, message) {
      var group = input.closest('.form-group');
      if (!group) return;
      var errorText = group.querySelector('.field-error');

      if (hasError) {
        group.classList.add('has-error');
        input.classList.add('invalid');
        if (errorText && message) errorText.textContent = message;
      } else {
        group.classList.remove('has-error');
        input.classList.remove('invalid');
      }
    }

    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var isValid = true;

      var fullName = form.querySelector('#fullName');
      var email = form.querySelector('#emailAddress');
      var phone = form.querySelector('#phoneNumber');
      var service = form.querySelector('#animationService');
      var format = form.querySelector('#videoFormat');
      var budget = form.querySelector('#approxBudget');
      var description = form.querySelector('#projectDescription');

      // Validate Full Name
      if (!fullName.value.trim() || fullName.value.trim().length < 2) {
        setFieldError(fullName, true, 'Please enter your full name.');
        isValid = false;
      } else {
        setFieldError(fullName, false);
      }

      // Validate Email
      var emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailPattern.test(email.value.trim())) {
        setFieldError(email, true, 'Please enter a valid email address.');
        isValid = false;
      } else {
        setFieldError(email, false);
      }

      // Validate Phone
      var phoneClean = phone.value.replace(/[\s\-()]/g, '');
      if (phoneClean.length < 7) {
        setFieldError(phone, true, 'Please enter a valid contact phone number.');
        isValid = false;
      } else {
        setFieldError(phone, false);
      }

      // Validate Service
      if (!service.value) {
        setFieldError(service, true, 'Please select an animation service.');
        isValid = false;
      } else {
        setFieldError(service, false);
      }

      // Validate Video Format
      if (!format.value) {
        setFieldError(format, true, 'Please choose a preferred video format.');
        isValid = false;
      } else {
        setFieldError(format, false);
      }

      // Validate Budget
      if (!budget.value) {
        setFieldError(budget, true, 'Please select an illustrative budget option.');
        isValid = false;
      } else {
        setFieldError(budget, false);
      }

      // Validate Description
      if (!description.value.trim() || description.value.trim().length < 15) {
        setFieldError(description, true, 'Please share a brief concept or project description (at least 15 characters).');
        isValid = false;
      } else {
        setFieldError(description, false);
      }

      if (isValid && feedbackBox) {
        feedbackBox.classList.add('visible');
        form.reset();
        feedbackBox.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
      }
    });

    // Clear error state on input
    var inputs = form.querySelectorAll('.form-control');
    inputs.forEach(function (input) {
      input.addEventListener('input', function () {
        setFieldError(input, false);
      });
      input.addEventListener('change', function () {
        setFieldError(input, false);
      });
    });
  }
})();
