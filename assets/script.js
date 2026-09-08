document.getElementById('year').textContent = new Date().getFullYear();

var toggle = document.getElementById('nav-toggle');
var header = document.getElementById('site-header');
if (toggle) {
  toggle.addEventListener('click', function () {
    header.classList.toggle('open');
  });
  document.querySelectorAll('.nav-links a').forEach(function (a) {
    a.addEventListener('click', function () { header.classList.remove('open'); });
  });
}

var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

/* stagger index for grouped reveal items */
['.service-grid', '.work-list', '.stat-list'].forEach(function (sel) {
  var group = document.querySelector(sel);
  if (!group) return;
  Array.prototype.forEach.call(group.children, function (child, i) {
    child.style.setProperty('--i', i);
  });
});

/* scroll reveal */
if (!reduceMotion && 'IntersectionObserver' in window) {
  var io = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        entry.target.classList.add('in');
        io.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15 });

  document.querySelectorAll('.reveal').forEach(function (el) { io.observe(el); });
} else {
  document.querySelectorAll('.reveal').forEach(function (el) { el.classList.add('in'); });
}

/* count-up stats */
var counters = document.querySelectorAll('[data-count]');
if (counters.length) {
  var animateCount = function (el) {
    var target = parseFloat(el.getAttribute('data-count'));
    var decimals = parseInt(el.getAttribute('data-decimals') || '0', 10);
    var suffix = el.getAttribute('data-suffix') || '';
    if (reduceMotion) {
      el.textContent = target.toFixed(decimals) + suffix;
      return;
    }
    var duration = 1400;
    var start = null;
    var easeOutExpo = function (t) { return t === 1 ? 1 : 1 - Math.pow(2, -10 * t); };
    var step = function (ts) {
      if (start === null) start = ts;
      var progress = Math.min((ts - start) / duration, 1);
      var eased = easeOutExpo(progress);
      el.textContent = (target * eased).toFixed(decimals) + suffix;
      if (progress < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  };

  if ('IntersectionObserver' in window) {
    var countIo = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          animateCount(entry.target);
          countIo.unobserve(entry.target);
        }
      });
    }, { threshold: 0.4 });
    counters.forEach(function (el) { countIo.observe(el); });
  } else {
    counters.forEach(animateCount);
  }
}

/* scroll progress bar */
var progressBar = document.getElementById('scroll-progress');
if (progressBar) {
  var updateProgress = function () {
    var scrollTop = window.scrollY;
    var docHeight = document.documentElement.scrollHeight - window.innerHeight;
    var pct = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
    progressBar.style.width = pct + '%';
  };
  window.addEventListener('scroll', updateProgress, { passive: true });
  updateProgress();
}

/* hero mark parallax */
var heroMark = document.getElementById('hero-mark');
if (heroMark && !reduceMotion) {
  var ticking = false;
  var updateParallax = function () {
    var y = window.scrollY;
    heroMark.style.transform = 'translateY(calc(-50% + ' + (y * 0.18) + 'px))';
    ticking = false;
  };
  window.addEventListener('scroll', function () {
    if (!ticking) {
      requestAnimationFrame(updateParallax);
      ticking = true;
    }
  }, { passive: true });
}

/* service card spotlight + tilt */
if (!reduceMotion) {
  document.querySelectorAll('.service-card').forEach(function (card) {
    card.addEventListener('mousemove', function (e) {
      var rect = card.getBoundingClientRect();
      var x = e.clientX - rect.left;
      var y = e.clientY - rect.top;
      card.style.setProperty('--mx', (x / rect.width) * 100 + '%');
      card.style.setProperty('--my', (y / rect.height) * 100 + '%');

      var cx = x / rect.width - 0.5;
      var cy = y / rect.height - 0.5;
      var rotateY = cx * 8;
      var rotateX = cy * -8;
      card.style.transform = 'perspective(1200px) rotateX(' + rotateX + 'deg) rotateY(' + rotateY + 'deg) translateY(-3px)';
    });
    card.addEventListener('mouseleave', function () {
      card.style.transform = '';
    });
  });
}

/* magnetic buttons */
if (!reduceMotion) {
  document.querySelectorAll('.btn-magnetic').forEach(function (btn) {
    btn.addEventListener('mousemove', function (e) {
      var rect = btn.getBoundingClientRect();
      var x = e.clientX - rect.left - rect.width / 2;
      var y = e.clientY - rect.top - rect.height / 2;
      btn.style.transform = 'translate(' + (x * 0.25) + 'px, ' + (y * 0.35 - 2) + 'px)';
    });
    btn.addEventListener('mouseleave', function () {
      btn.style.transform = '';
    });
  });
}
