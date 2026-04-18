// ===== Loading Screen =====
var loader = document.getElementById('loader');
if (loader) {
  window.addEventListener('load', function() {
    setTimeout(function() {
      loader.classList.add('hidden');
    }, 1200);
  });
}

// ===== Stars =====
(function() {
  var c = document.getElementById('heroStars');
  if (!c) return;
  for (var i = 0; i < 50; i++) {
    var s = document.createElement('div');
    s.className = 'star';
    s.style.left = Math.random() * 100 + '%';
    s.style.top = Math.random() * 80 + '%';
    s.style.setProperty('--dur', (2 + Math.random() * 4) + 's');
    s.style.setProperty('--delay', (Math.random() * 5) + 's');
    s.style.setProperty('--brightness', (0.4 + Math.random() * 0.6).toString());
    var size = (1 + Math.random() * 2) + 'px';
    s.style.width = size;
    s.style.height = size;
    c.appendChild(s);
  }
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
function toggleMobile() {
  var h = document.getElementById('hamburger');
  var m = document.getElementById('mobileMenu');
  h.classList.toggle('open');
  m.classList.toggle('open');
  document.body.style.overflow = m.classList.contains('open') ? 'hidden' : '';
}

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
