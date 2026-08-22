document.getElementById('year').textContent = new Date().getFullYear();

/* ---------- Boot loading screen ---------- */
(function boot(){
  const screen = document.getElementById('bootScreen');
  const line = document.getElementById('bootLine');
  const words = ['LOADING', 'INIT MODULES', 'READY'];
  let i = 0;

  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    screen.style.display = 'none';
    return;
  }

  const tick = setInterval(() => {
    i++;
    if (i < words.length) {
      line.textContent = words[i];
    } else {
      clearInterval(tick);
      screen.classList.add('boot-done');
      setTimeout(() => screen.remove(), 700);
    }
  }, 420);
})();

/* ---------- Live clock (Kathmandu time, UTC+5:45) ---------- */
(function liveClock(){
  const el = document.getElementById('liveClock');
  if (!el) return;
  function update(){
    const now = new Date();
    const utc = now.getTime() + (now.getTimezoneOffset() * 60000);
    const ktm = new Date(utc + (5.75 * 3600000));
    const hh = String(ktm.getHours()).padStart(2,'0');
    const mm = String(ktm.getMinutes()).padStart(2,'0');
    const ss = String(ktm.getSeconds()).padStart(2,'0');
    el.textContent = `· 27.7172° N ${hh}:${mm}:${ss}`;
  }
  update();
  setInterval(update, 1000);
})();

/* ---------- Scroll reveal ---------- */
(function scrollReveal(){
  const items = document.querySelectorAll('[data-reveal]');
  if (!('IntersectionObserver' in window) || items.length === 0) return;
  const io = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('revealed');
        io.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12 });
  items.forEach(item => io.observe(item));
})();

/* ---------- Animated stat counters ---------- */
(function countUp(){
  const nums = document.querySelectorAll('[data-count]');
  const textNums = document.querySelectorAll('[data-count-text]');
  if (nums.length === 0 && textNums.length === 0) return;

  function animateNum(el){
    const target = parseInt(el.getAttribute('data-count'), 10);
    let cur = 0;
    const step = Math.max(1, Math.ceil(target / 20));
    const t = setInterval(() => {
      cur += step;
      if (cur >= target) { cur = target; clearInterval(t); }
      el.textContent = cur;
    }, 45);
  }
  function animateText(el){
    el.textContent = el.getAttribute('data-count-text');
  }

  if (!('IntersectionObserver' in window)) {
    nums.forEach(animateNum);
    textNums.forEach(animateText);
    return;
  }
  const io = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const el = entry.target;
        if (el.hasAttribute('data-count')) animateNum(el);
        else animateText(el);
        io.unobserve(el);
      }
    });
  }, { threshold: 0.4 });
  nums.forEach(el => io.observe(el));
  textNums.forEach(el => io.observe(el));
})();

/* ---------- Custom cursor dot (desktop only) ---------- */
(function customCursor(){
  if (window.matchMedia('(pointer: coarse)').matches) return;
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  const dot = document.createElement('div');
  dot.className = 'cursor-dot';
  document.body.appendChild(dot);

  let x = 0, y = 0, dx = 0, dy = 0;
  window.addEventListener('mousemove', (e) => { x = e.clientX; y = e.clientY; });

  function raf(){
    dx += (x - dx) * 0.2;
    dy += (y - dy) * 0.2;
    dot.style.transform = `translate(${dx}px, ${dy}px)`;
    requestAnimationFrame(raf);
  }
  raf();

  document.querySelectorAll('a, button').forEach(el => {
    el.addEventListener('mouseenter', () => dot.classList.add('cursor-hover'));
    el.addEventListener('mouseleave', () => dot.classList.remove('cursor-hover'));
  });
})();
