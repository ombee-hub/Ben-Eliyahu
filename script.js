// ===== Loading Screen =====
var loader = document.getElementById('loader');
if (loader) {
  window.addEventListener('load', function() {
    setTimeout(function() {
      loader.classList.add('hidden');
    }, 1200);
  });
}

// ===== Stars (disabled) =====

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

// ===== Animated Counters =====
var countersAnimated = false;
function animateCounters() {
  if (countersAnimated) return;
  countersAnimated = true;
  document.querySelectorAll('.stat-num[data-target]').forEach(function(el) {
    var target = parseInt(el.getAttribute('data-target'));
    var duration = 1500;
    var startTime = null;
    function step(ts) {
      if (!startTime) startTime = ts;
      var p = Math.min((ts - startTime) / duration, 1);
      var eased = 1 - Math.pow(1 - p, 3);
      el.textContent = Math.floor(eased * target);
      if (p < 1) {
        requestAnimationFrame(step);
      } else {
        el.textContent = target === 1 ? '1' : target + '+';
      }
    }
    requestAnimationFrame(step);
  });
}

var sb = document.querySelector('.stats-bar');
if (sb) {
  var sObs = new IntersectionObserver(function(e) {
    if (e[0].isIntersecting) { animateCounters(); sObs.disconnect(); }
  }, { threshold: 0.5 });
  sObs.observe(sb);
}

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

window.addEventListener('scroll', updateNavbar);
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
    'gallery.html': 'gallery',
    'contact.html': 'contact'
  };
  var id = map[path];
  if (id) {
    var n = document.getElementById('nav-' + id);
    if (n) n.classList.add('active');
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

// ===== Back to Top =====
window.addEventListener('scroll', function() {
  var btn = document.getElementById('backToTop');
  if (btn) btn.classList.toggle('show', window.scrollY > 400);
});

// ===== Init =====
document.addEventListener('DOMContentLoaded', observeReveals);

// ===== Accessibility Widget =====
(function() {
  var STORAGE_KEY = 'a11y-settings-v1';
  var html = document.documentElement;

  // Toggle options: { id, label, icon, type, class(es) }
  // type: 'toggle' or 'cycle' (cycle through values)
  var OPTIONS = [
    { id: 'highlight-links', label: 'הדגשת קישורים', type: 'toggle', cls: 'a11y-highlight-links',
      icon: '<svg viewBox="0 0 24 24"><path d="M10 13a5 5 0 007.54.54l3-3a5 5 0 00-7.07-7.07l-1.72 1.72M14 11a5 5 0 00-7.54-.54l-3 3a5 5 0 007.07 7.07l1.72-1.72"/></svg>' },
    { id: 'contrast', label: 'ניגודיות', type: 'cycle',
      values: ['', 'a11y-contrast-high', 'a11y-contrast-dark', 'a11y-invert'],
      icon: '<svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="9"/><path d="M12 3v18" fill="currentColor" stroke="none"/><path d="M12 3a9 9 0 010 18z" fill="currentColor" stroke="none"/></svg>' },
    { id: 'spacing', label: 'ריווח טקסט', type: 'toggle', cls: 'a11y-spacing',
      icon: '<svg viewBox="0 0 24 24"><path d="M4 8h16M4 12h10M4 16h16"/><path d="M2 6l2-2 2 2M2 18l2 2 2-2"/></svg>' },
    { id: 'big-text', label: 'טקסט גדול', type: 'toggle', cls: 'a11y-big-text',
      icon: '<svg viewBox="0 0 24 24"><text x="3" y="18" font-size="16" font-weight="700" fill="currentColor" stroke="none">T</text><text x="13" y="18" font-size="22" font-weight="700" fill="currentColor" stroke="none">T</text></svg>' },
    { id: 'hide-images', label: 'הסתרת תמונות', type: 'toggle', cls: 'a11y-hide-images',
      icon: '<svg viewBox="0 0 24 24"><rect x="3" y="5" width="18" height="14" rx="2"/><path d="M3 16l5-5 4 4M14 13l3-3 4 4M3 3l18 18" stroke-width="2"/></svg>' },
    { id: 'no-anim', label: 'ביטול הנפשות', type: 'toggle', cls: 'a11y-no-anim',
      icon: '<svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="3"/><path d="M4 12a8 8 0 018-8M20 12a8 8 0 01-8 8" stroke-dasharray="2 2"/><path d="M3 3l18 18" stroke-width="2"/></svg>' },
    { id: 'big-cursor', label: 'סמן גדול', type: 'toggle', cls: 'a11y-big-cursor',
      icon: '<svg viewBox="0 0 24 24"><path d="M6 3v16l4-4 3 7 3-1-3-7h6z"/></svg>' },
    { id: 'dyslexia', label: 'תמיכה בדיסלקציה', type: 'toggle', cls: 'a11y-dyslexia',
      icon: '<svg viewBox="0 0 24 24"><text x="3" y="17" font-size="14" font-weight="700" fill="currentColor" stroke="none" font-family="Georgia">Df</text></svg>' },
    { id: 'line-height', label: 'גובה שורה', type: 'toggle', cls: 'a11y-line-height',
      icon: '<svg viewBox="0 0 24 24"><path d="M3 4h14M3 12h14M3 20h14"/><path d="M21 4v16M19 6l2-2 2 2M19 18l2 2 2-2"/></svg>' },
    { id: 'readable-align', label: 'יישור טקסט', type: 'toggle', cls: 'a11y-readable-align',
      icon: '<svg viewBox="0 0 24 24"><path d="M3 5h18M3 10h14M3 15h18M3 20h10"/></svg>' },
    { id: 'saturation', label: 'רוויה', type: 'cycle',
      values: ['', 'a11y-saturation-low', 'a11y-saturation-none', 'a11y-saturation-high'],
      icon: '<svg viewBox="0 0 24 24"><path d="M12 3c-3 5-6 8-6 12a6 6 0 0012 0c0-4-3-7-6-12z"/></svg>' }
  ];

  // Load state
  var state = {};
  try {
    var raw = localStorage.getItem(STORAGE_KEY);
    if (raw) state = JSON.parse(raw);
  } catch(e) {}

  function save() {
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(state)); } catch(e) {}
  }

  function applyState() {
    OPTIONS.forEach(function(opt) {
      if (opt.type === 'toggle') {
        html.classList.toggle(opt.cls, !!state[opt.id]);
      } else if (opt.type === 'cycle') {
        opt.values.forEach(function(v) { if (v) html.classList.remove(v); });
        var idx = state[opt.id] || 0;
        var v = opt.values[idx];
        if (v) html.classList.add(v);
      }
    });
    // Update active states on buttons
    document.querySelectorAll('.a11y-btn[data-a11y]').forEach(function(btn) {
      var id = btn.getAttribute('data-a11y');
      var opt = OPTIONS.find(function(o) { return o.id === id; });
      if (!opt) return;
      if (opt.type === 'toggle') {
        btn.classList.toggle('active', !!state[id]);
      } else {
        btn.classList.toggle('active', (state[id] || 0) > 0);
      }
    });
  }

  function toggleOption(id) {
    var opt = OPTIONS.find(function(o) { return o.id === id; });
    if (!opt) return;
    if (opt.type === 'toggle') {
      state[id] = !state[id];
    } else {
      state[id] = ((state[id] || 0) + 1) % opt.values.length;
    }
    save();
    applyState();
  }

  function resetAll() {
    state = {};
    save();
    applyState();
  }

  // Build widget
  function build() {
    var fab = document.createElement('button');
    fab.className = 'a11y-fab';
    fab.setAttribute('aria-label', 'תפריט נגישות');
    fab.setAttribute('title', 'תפריט נגישות');
    fab.innerHTML = '<svg viewBox="0 0 24 24" fill="currentColor"><circle cx="12" cy="4" r="2"/><path d="M4 8h16v2l-6 1v4l2 6-2 1-2-6h-1l-2 6-2-1 2-6v-4l-6-1V8z"/></svg>';

    var overlay = document.createElement('div');
    overlay.className = 'a11y-overlay';

    var panel = document.createElement('aside');
    panel.className = 'a11y-panel';
    panel.setAttribute('role', 'dialog');
    panel.setAttribute('aria-label', 'הגדרות נגישות');

    var btnsHtml = OPTIONS.map(function(opt) {
      return '<button type="button" class="a11y-btn" data-a11y="' + opt.id + '">' +
        opt.icon + '<span>' + opt.label + '</span></button>';
    }).join('');

    panel.innerHTML =
      '<div class="a11y-header">' +
        '<h3>תפריט נגישות</h3>' +
        '<button type="button" class="a11y-close" aria-label="סגירה">&times;</button>' +
      '</div>' +
      '<div class="a11y-body">' +
        '<div class="a11y-grid">' + btnsHtml + '</div>' +
        '<button type="button" class="a11y-reset">&#x21bb; איפוס כל ההגדרות</button>' +
      '</div>' +
      '<div class="a11y-footer">' +
        '<a href="accessibility.html">הצהרת נגישות</a>' +
        '<span>&middot;</span>' +
        '<a href="privacy.html">מדיניות פרטיות</a>' +
      '</div>';

    document.body.appendChild(fab);
    document.body.appendChild(overlay);
    document.body.appendChild(panel);

    function open() {
      panel.classList.add('open');
      overlay.classList.add('open');
    }
    function close() {
      panel.classList.remove('open');
      overlay.classList.remove('open');
    }

    fab.addEventListener('click', function() {
      panel.classList.contains('open') ? close() : open();
    });
    panel.querySelector('.a11y-close').addEventListener('click', close);
    overlay.addEventListener('click', close);

    panel.querySelectorAll('.a11y-btn').forEach(function(btn) {
      btn.addEventListener('click', function() {
        toggleOption(btn.getAttribute('data-a11y'));
      });
    });

    panel.querySelector('.a11y-reset').addEventListener('click', resetAll);

    document.addEventListener('keydown', function(e) {
      if (e.key === 'Escape' && panel.classList.contains('open')) close();
    });

    applyState();
  }

  // Apply classes early to avoid flash
  applyState();

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', build);
  } else {
    build();
  }
})();
