(function () {
  var reduceMotion = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---------- nav scroll-spy ---------- */
  (function () {
    var links = Array.prototype.slice.call(document.querySelectorAll('.nav-links a[data-nav]'));
    if (!links.length) return;
    var entries = links
      .map(function (a) { return { a: a, el: document.querySelector(a.getAttribute('href')) }; })
      .filter(function (e) { return e.el; });
    if (!entries.length) return;

    var current = null;
    function setActive(a) {
      if (a === current) return;
      current = a;
      links.forEach(function (l) {
        if (l === a) l.setAttribute('aria-current', 'page');
        else l.removeAttribute('aria-current');
      });
    }
    var ACTIVATION_LINE = 96;
    function update() {
      var best = null, bestTop = -Infinity;
      entries.forEach(function (e) {
        var top = e.el.getBoundingClientRect().top;
        if (top <= ACTIVATION_LINE && top > bestTop) { bestTop = top; best = e.a; }
      });
      setActive(best || entries[0].a);
    }
    var ticking = false;
    function onScroll() {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(function () { update(); ticking = false; });
    }
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    update();
  })();

  /* ---------- count-up ----------
     The HTML already contains the real, final value (e.g. "92%") as static
     content, so a user with JS disabled or blocked, or without
     IntersectionObserver support, sees the correct number with no animation.
     Only once we've confirmed we're actually going to animate do we blank
     the element to "0" and count up from there. */
  (function () {
    var els = document.querySelectorAll('.count-up');
    if (!els.length) return;
    if (reduceMotion) return; // leave the static value alone, no motion
    if (!('IntersectionObserver' in window)) return; // leave the static value alone

    function animate(el) {
      var target = parseInt(el.getAttribute('data-target'), 10);
      if (isNaN(target)) return; // no usable target: leave the static value alone
      var suffix = el.getAttribute('data-suffix') || '';
      el.textContent = '0' + suffix; // committed to animating now, safe to blank
      var start = performance.now();
      var duration = 900;
      function frame(now) {
        var p = Math.min(1, (now - start) / duration);
        var eased = 1 - Math.pow(1 - p, 3);
        el.textContent = Math.round(eased * target) + suffix;
        if (p < 1) requestAnimationFrame(frame);
      }
      requestAnimationFrame(frame);
    }

    var obs = new IntersectionObserver(function (entries, o) {
      entries.forEach(function (e) {
        if (e.isIntersecting) { animate(e.target); o.unobserve(e.target); }
      });
    }, { threshold: 0.6 });
    els.forEach(function (el) { obs.observe(el); });
  })();

  /* ---------- case diagrams ----------
     Each .diagram-panel starts with every [data-anim]/[data-loop] element
     paused via CSS. When the panel scrolls into view we flip them to
     running and count up any [data-count] values. Reduced motion, or no
     IntersectionObserver, just shows the finished state immediately. */
  (function () {
    var panels = document.querySelectorAll('.diagram-panel');
    if (!panels.length) return;

    function countUp(el) {
      if (el.dataset.done) return;
      el.dataset.done = '1';
      var to = Math.abs(parseFloat(el.getAttribute('data-to')) || 0);
      var pre = el.getAttribute('data-prefix') || '';
      var suf = el.getAttribute('data-suffix') || '';
      if (reduceMotion) { el.textContent = pre + to + suf; return; }
      var duration = 1100;
      var start = performance.now();
      function tick(now) {
        var p = Math.min(1, (now - start) / duration);
        var eased = 1 - Math.pow(1 - p, 3);
        el.textContent = pre + Math.round(to * eased) + suf;
        if (p < 1) requestAnimationFrame(tick);
      }
      el.textContent = pre + '0' + suf;
      requestAnimationFrame(tick);
    }

    function play(root) {
      root.querySelectorAll('[data-anim], [data-loop]').forEach(function (el) {
        el.style.animationPlayState = 'running';
      });
      root.querySelectorAll('[data-count]').forEach(countUp);
    }

    if (reduceMotion || !('IntersectionObserver' in window)) {
      panels.forEach(play);
      return;
    }

    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (!e.isIntersecting) return;
        play(e.target);
        io.unobserve(e.target);
      });
    }, { threshold: 0.15 });
    panels.forEach(function (p) { io.observe(p); });
  })();

  /* ---------- command palette ---------- */
  (function () {
    var trigger = document.getElementById('cmdk-trigger');
    var backdrop = document.getElementById('cmdk-backdrop');
    var input = document.getElementById('cmdk-input');
    var list = document.getElementById('cmdk-list');
    if (!trigger || !backdrop || !input || !list) return;
    var items = Array.prototype.slice.call(list.querySelectorAll('li'));
    var lastFocused = null;

    function open() {
      lastFocused = document.activeElement;
      backdrop.hidden = false;
      input.value = '';
      filter('');
      input.focus();
    }
    function close() {
      backdrop.hidden = true;
      if (lastFocused && lastFocused.focus) lastFocused.focus();
    }
    function visibleItems() {
      return items.filter(function (li) { return !li.hidden; });
    }
    function select(li) {
      items.forEach(function (i) { i.removeAttribute('aria-selected'); });
      if (li) li.setAttribute('aria-selected', 'true');
    }
    function filter(q) {
      q = q.toLowerCase();
      items.forEach(function (li) {
        var match = li.textContent.toLowerCase().indexOf(q) !== -1;
        li.hidden = !match;
      });
      var vis = visibleItems();
      select(vis[0] || null);
    }
    function activate(li) {
      if (!li) return;
      var btn = li.querySelector('button');
      var href = btn.getAttribute('data-href');
      close();
      if (btn.getAttribute('data-external')) {
        window.open(href, '_blank', 'noopener');
      } else {
        var target = document.querySelector(href);
        if (target) target.scrollIntoView({ behavior: reduceMotion ? 'auto' : 'smooth' });
      }
    }

    trigger.addEventListener('click', open);
    backdrop.addEventListener('click', function (e) { if (e.target === backdrop) close(); });
    list.addEventListener('click', function (e) {
      var li = e.target.closest('li');
      if (li) activate(li);
    });
    input.addEventListener('input', function () { filter(input.value); });
    input.addEventListener('keydown', function (e) {
      var vis = visibleItems();
      var idx = vis.findIndex(function (li) { return li.getAttribute('aria-selected') === 'true'; });
      if (e.key === 'ArrowDown') {
        e.preventDefault();
        select(vis[Math.min(vis.length - 1, idx + 1)]);
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        select(vis[Math.max(0, idx - 1)]);
      } else if (e.key === 'Enter') {
        e.preventDefault();
        activate(vis[Math.max(0, idx)]);
      } else if (e.key === 'Escape') {
        close();
      }
    });
    document.addEventListener('keydown', function (e) {
      var isK = e.key === 'k' || e.key === 'K';
      if ((e.metaKey || e.ctrlKey) && isK) {
        e.preventDefault();
        if (backdrop.hidden) open(); else close();
      } else if (e.key === 'Escape' && !backdrop.hidden) {
        close();
      }
    });
  })();
})();
