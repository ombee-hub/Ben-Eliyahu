// ===== Loading Screen =====
// Hide once the DOM is ready instead of waiting for every image/resource —
// window.load can take seconds on slow connections and blocks the whole page.
var loader = document.getElementById('loader');
if (loader) {
  var hideLoader = function() {
    setTimeout(function() {
      loader.classList.add('hidden');
    }, 300);
  };
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', hideLoader);
  } else {
    hideLoader();
  }
}

// ===== Hero Carousel =====
(function() {
  var carousel = document.getElementById('heroCarousel');
  if (!carousel) return;
  var slides = carousel.querySelectorAll('.hero-slide');
  if (slides.length === 0) return;

  var dotsContainer = document.getElementById('carouselDots');
  var prevBtn = document.getElementById('carouselPrev');
  var nextBtn = document.getElementById('carouselNext');
  var current = 0;
  var autoTimer = null;
  var AUTO_INTERVAL = 6000;

  if (slides.length > 1) {
    carousel.classList.add('multi');
  }

  if (dotsContainer) {
    for (var i = 0; i < slides.length; i++) {
      var dot = document.createElement('button');
      dot.className = 'carousel-dot' + (i === 0 ? ' active' : '');
      dot.setAttribute('aria-label', 'שקופית ' + (i + 1));
      dot.setAttribute('data-index', i);
      dot.addEventListener('click', function(e) {
        goTo(parseInt(e.currentTarget.getAttribute('data-index')));
      });
      dotsContainer.appendChild(dot);
    }
  }

  function goTo(index) {
    if (index < 0) index = slides.length - 1;
    if (index >= slides.length) index = 0;
    slides[current].classList.remove('active');
    slides[index].classList.add('active');
    if (dotsContainer) {
      var dots = dotsContainer.querySelectorAll('.carousel-dot');
      dots[current] && dots[current].classList.remove('active');
      dots[index] && dots[index].classList.add('active');
    }
    current = index;
    restartAuto();
  }

  function next() { goTo(current + 1); }
  function prev() { goTo(current - 1); }

  function startAuto() {
    if (slides.length <= 1) return;
    autoTimer = setInterval(next, AUTO_INTERVAL);
  }
  function stopAuto() {
    if (autoTimer) { clearInterval(autoTimer); autoTimer = null; }
  }
  function restartAuto() {
    stopAuto();
    startAuto();
  }

  if (prevBtn) prevBtn.addEventListener('click', prev);
  if (nextBtn) nextBtn.addEventListener('click', next);

  carousel.addEventListener('mouseenter', stopAuto);
  carousel.addEventListener('mouseleave', startAuto);

  startAuto();
})();

// ===== Navbar scroll effect =====
var navbar = document.getElementById('navbar');
var heroEl = document.querySelector('.hero');

function updateNavbar() {
  if (!navbar) return;
  if (!heroEl) {
    navbar.classList.remove('on-hero-top');
    navbar.classList.add('scrolled');
    return;
  }
  var heroBottom = heroEl.getBoundingClientRect().bottom;
  if (heroBottom < 100) {
    navbar.classList.remove('on-hero-top');
    navbar.classList.add('scrolled');
  } else {
    navbar.classList.add('on-hero-top');
    navbar.classList.remove('scrolled');
  }
}

window.addEventListener('scroll', updateNavbar, { passive: true });
updateNavbar();

// ===== Active nav link =====
(function() {
  var path = window.location.pathname.split('/').pop() || 'index.html';
  var map = {
    'index.html': '',
    'story.html': 'story',
    'timeline.html': 'timeline',
    'peace.html': 'peace',
    'documents.html': 'documents',
    'testimonials.html': 'testimonials',
    'press.html': 'press',
    'quotes.html': 'quotes',
    'works.html': 'works',
    'videos.html': 'videos',
    'gallery.html': 'gallery',
    'contact.html': 'contact'
  };
  var id = map[path];
  if (id) {
    var n = document.getElementById('nav-' + id);
    if (n) {
      n.classList.add('active');
      n.setAttribute('aria-current', 'page');
    }
  }
})();

// ===== Mobile menu =====
(function() {
  var overlay = document.createElement('div');
  overlay.className = 'mobile-menu-overlay';
  overlay.id = 'mobileMenuOverlay';
  if (document.body) {
    document.body.appendChild(overlay);
  } else {
    document.addEventListener('DOMContentLoaded', function() { document.body.appendChild(overlay); });
  }
  overlay.addEventListener('click', function() {
    if (typeof toggleMobile === 'function') toggleMobile();
  });
})();

function toggleMobile() {
  var h = document.getElementById('hamburger');
  var m = document.getElementById('mobileMenu');
  var o = document.getElementById('mobileMenuOverlay');
  if (h) h.classList.toggle('open');
  if (m) m.classList.toggle('open');
  var isOpen = m && m.classList.contains('open');
  if (h) h.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
  if (o) o.classList.toggle('open', isOpen);
  document.body.style.overflow = isOpen ? 'hidden' : '';
}

// Close mobile menu on ESC
document.addEventListener('keydown', function(e) {
  if (e.key === 'Escape') {
    var m = document.getElementById('mobileMenu');
    if (m && m.classList.contains('open')) toggleMobile();
  }
});

// Close the mobile menu automatically when the viewport switches to the
// desktop layout (nav-links replace the hamburger above 1024px)
(function() {
  if (!window.matchMedia) return;
  var desktopMq = window.matchMedia('(min-width: 1025px)');
  function closeOnDesktop(e) {
    if (!e.matches) return;
    var m = document.getElementById('mobileMenu');
    if (m && m.classList.contains('open')) toggleMobile();
  }
  if (desktopMq.addEventListener) desktopMq.addEventListener('change', closeOnDesktop);
  else if (desktopMq.addListener) desktopMq.addListener(closeOnDesktop);
})();

// ===== Scroll animations =====
function observeReveals() {
  var reveals = document.querySelectorAll('.reveal:not(.visible)');
  if (!reveals.length) return;
  var obs = new IntersectionObserver(function(entries) {
    entries.forEach(function(e) {
      if (e.isIntersecting) { e.target.classList.add('visible'); obs.unobserve(e.target); }
    });
  }, { threshold: 0.08, rootMargin: '0px 0px -20px 0px' });
  reveals.forEach(function(el) { obs.observe(el); });
}

// ===== Init =====
document.addEventListener('DOMContentLoaded', observeReveals);

// ===== Copyright year =====
document.addEventListener('DOMContentLoaded', function() {
  var el = document.querySelector('.credit-rights');
  if (el) el.innerHTML = el.innerHTML.replace(/–\d{4}/, '–' + new Date().getFullYear());
});

// ===== Gallery Lightbox (any .photog grid) =====
(function() {
  function initGrid(grid) {
    var items = Array.prototype.slice.call(grid.querySelectorAll('.phi'));
    if (!items.length) return;

    var current = 0;
    var overlay = document.createElement('div');
    overlay.className = 'lightbox';
    overlay.setAttribute('role', 'dialog');
    overlay.setAttribute('aria-modal', 'true');
    overlay.setAttribute('aria-label', 'תצוגת תמונה מוגדלת');
    overlay.innerHTML =
      '<button type="button" class="lb-close" aria-label="סגירה">&times;</button>' +
      '<button type="button" class="lb-prev" aria-label="התמונה הקודמת">&#10094;</button>' +
      '<button type="button" class="lb-next" aria-label="התמונה הבאה">&#10095;</button>' +
      '<figure class="lb-figure"><img class="lb-img" alt=""><figcaption class="lb-caption"></figcaption></figure>';
    document.body.appendChild(overlay);

    var lbImg = overlay.querySelector('.lb-img');
    var lbCaption = overlay.querySelector('.lb-caption');
    var lastFocused = null;

    function show(index) {
      if (index < 0) index = items.length - 1;
      if (index >= items.length) index = 0;
      current = index;
      var img = items[current].querySelector('.php img');
      var cap = items[current].querySelector('.phc');
      if (!img) return;
      lbImg.src = img.getAttribute('data-full') || img.src;
      lbImg.alt = img.alt || '';
      lbCaption.textContent = cap ? cap.textContent : '';
    }

    function open(index) {
      lastFocused = document.activeElement;
      show(index);
      overlay.classList.add('open');
      document.body.style.overflow = 'hidden';
      overlay.querySelector('.lb-close').focus();
    }

    function close() {
      overlay.classList.remove('open');
      document.body.style.overflow = '';
      if (lastFocused) lastFocused.focus();
    }

    overlay.querySelector('.lb-close').addEventListener('click', close);
    overlay.querySelector('.lb-prev').addEventListener('click', function() { show(current - 1); });
    overlay.querySelector('.lb-next').addEventListener('click', function() { show(current + 1); });
    overlay.addEventListener('click', function(e) {
      if (e.target === overlay) close();
    });

    document.addEventListener('keydown', function(e) {
      if (!overlay.classList.contains('open')) return;
      if (e.key === 'Escape') close();
      else if (e.key === 'ArrowRight') show(current - 1);
      else if (e.key === 'ArrowLeft') show(current + 1);
    });

    grid.addEventListener('click', function(e) {
      var item = e.target.closest ? e.target.closest('.phi') : null;
      if (item && item.querySelector('.php img')) open(items.indexOf(item));
    });
    grid.addEventListener('keydown', function(e) {
      if (e.key !== 'Enter' && e.key !== ' ') return;
      var item = e.target.closest ? e.target.closest('.phi') : null;
      if (item && item.querySelector('.php img')) {
        e.preventDefault();
        open(items.indexOf(item));
      }
    });
  }

  function init() {
    document.querySelectorAll('.photog').forEach(initGrid);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();

// ===== Cookie Notice (homepage only) =====
(function() {
  var page = window.location.pathname.split('/').pop();
  if (page && page !== 'index.html') return;

  var KEY = 'cookie-notice-v2';
  try { if (localStorage.getItem(KEY)) return; } catch (e) {}

  function build() {
    var banner = document.createElement('div');
    banner.className = 'cookie-banner';
    banner.setAttribute('role', 'region');
    banner.setAttribute('aria-label', 'הודעה על שימוש בעוגיות');
    banner.innerHTML =
      '<div class="cookie-row">' +
        '<svg class="cookie-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' +
          '<path d="M21 12a9 9 0 1 1-9.5-8.98 3.5 3.5 0 0 0 3.6 4.4 3.5 3.5 0 0 0 3.7 4.3c.73-.08 1.4-.36 1.95-.78.16.66.25 1.35.25 2.06z"/>' +
          '<circle cx="8.5" cy="9" r="0.9" fill="currentColor" stroke="none"/>' +
          '<circle cx="9.5" cy="14.5" r="0.9" fill="currentColor" stroke="none"/>' +
          '<circle cx="14" cy="16.5" r="0.9" fill="currentColor" stroke="none"/>' +
          '<circle cx="12.5" cy="11" r="0.7" fill="currentColor" stroke="none"/>' +
        '</svg>' +
        '<div class="cookie-text">אתר זה משתמש בעוגיות (Cookies) כדי לשפר את חוויית הגלישה שלך. לפרטים נוספים ניתן לעיין ב<a href="privacy.html">מדיניות הפרטיות</a>.</div>' +
      '</div>' +
      '<div class="cookie-actions">' +
        '<button type="button" class="cookie-accept">מאשר/ת</button>' +
        '<button type="button" class="cookie-decline">ביטול</button>' +
      '</div>';
    document.body.appendChild(banner);

    requestAnimationFrame(function() {
      requestAnimationFrame(function() { banner.classList.add('show'); });
    });

    function dismiss(value) {
      try { localStorage.setItem(KEY, value); } catch (e) {}
      banner.classList.remove('show');
      setTimeout(function() { banner.remove(); }, 500);
    }

    banner.querySelector('.cookie-accept').addEventListener('click', function() { dismiss('accepted'); });
    banner.querySelector('.cookie-decline').addEventListener('click', function() { dismiss('declined'); });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', build);
  } else {
    build();
  }
})();

