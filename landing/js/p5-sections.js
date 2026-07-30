/**
 * p5-sections.js — DreamTeam Persona 5
 * ----------------------------------------------------------------
 *  1. HERO estilo P5: marco polaroid rojo inclinado con sombra dura,
 *     etiqueta "// TALENTO REAL", badge "TAKE YOUR HEART", estrellas,
 *     kicker con línea roja, H1 Anton gigante, stats Anton rojas.
 *  2. Fondo de oficina desaturado + ola roja con corona inferior.
 *  3. Animaciones de entrada al hacer scroll (IntersectionObserver).
 */
(function () {
  'use strict';

  var RED   = '#e60013';
  var PAPER = '#f3efe6';

  var CSS = `
    /* ────────── HERO: texto ────────── */
    section#inicio h1 {
      font-family: 'Anton','Impact',sans-serif !important;
      font-weight: 400 !important;
      font-style: normal !important;
      font-size: clamp(50px, 6.5vw, 104px) !important;
      line-height: 0.88 !important;
      letter-spacing: 1px !important;
      text-transform: uppercase !important;
      color: #ffffff !important;
    }
    /* Kicker "Líderes en Televentas" → línea roja + texto Oswald rojo */
    section#inicio .fade-up-1 {
      background: transparent !important;
      border: none !important;
      box-shadow: none !important;
      padding: 0 !important;
      backdrop-filter: none !important;
    }
    section#inicio .fade-up-1::before {
      content: '';
      display: inline-block;
      width: 44px; height: 3px;
      background: ${RED};
      margin-right: 12px;
      vertical-align: middle;
      flex-shrink: 0;
    }
    section#inicio .fade-up-1 > div { display: none !important; }
    section#inicio .fade-up-1,
    section#inicio .fade-up-1 span {
      color: ${RED} !important;
      font-family: 'Oswald', sans-serif !important;
      font-weight: 700 !important;
      letter-spacing: 3px !important;
      text-transform: uppercase !important;
      font-size: 15px !important;
    }
    /* Párrafo lead */
    section#inicio > div > div p {
      color: #cfc9ba !important;
      font-weight: 500 !important;
    }
    /* Avatares con aro rojo */
    section#inicio img[alt="avatar"] {
      border: 2.5px solid ${RED} !important;
      background: #111 !important;
    }

    /* stats Anton (aplicado por JS con .p5-hstat) */
    .p5-hstat {
      font-family: 'Anton','Impact',sans-serif !important;
      font-style: normal !important;
      color: ${RED} !important;
      letter-spacing: 1px !important;
    }
    .p5-hstat-label {
      font-family: 'Oswald', sans-serif !important;
      text-transform: uppercase !important;
      letter-spacing: 2px !important;
      color: #8f8a7e !important;
    }

    /* ────────── HERO: marco polaroid P5 ────────── */
    .p5-frame {
      border-radius: 0 !important;
      border: 12px solid ${RED} !important;
      background: ${RED} !important;
      box-shadow: 14px 14px 0 rgba(0,0,0,.6) !important;
      transform: rotate(2.5deg) !important;
    }
    .p5-frame:hover {
      transform: rotate(1deg) translateY(-4px) !important;
      box-shadow: 18px 18px 0 rgba(0,0,0,.6) !important;
    }
    .p5-frame img {
      filter: contrast(1.12) saturate(.85) !important;
      border-radius: 0 !important;
    }
    .p5-frame-dots {
      position: absolute; inset: 0; z-index: 5;
      pointer-events: none;
      background-image: radial-gradient(circle, ${RED} 1px, transparent 1.6px);
      background-size: 7px 7px;
      opacity: .22;
      mix-blend-mode: multiply;
    }
    .p5-hero-hidden { display: none !important; }

    .p5-photo-zone { transform: scale(1.35); transform-origin: center center; position: relative; }
    @media (max-width: 1280px) { .p5-photo-zone { transform: scale(1.2); } }
    @media (max-width: 1080px) { .p5-photo-zone { transform: scale(1.05); } }

    /* etiqueta "// TALENTO REAL" */
    .p5-tag2 {
      position: absolute; top: 20px; right: -4px; z-index: 6;
      background: ${PAPER}; color: #000;
      font-family: 'Oswald', sans-serif; font-weight: 700;
      text-transform: uppercase; letter-spacing: 1.5px; font-size: 13px;
      padding: 9px 14px; transform: rotate(6deg);
      box-shadow: 4px 4px 0 #000;
      pointer-events: none;
    }
    /* badge "TAKE YOUR HEART" */
    .p5-badge-tyh {
      position: absolute; bottom: 12px; left: -2px; z-index: 6;
      background: #000; color: #ffffff !important;
      font-family: 'Anton','Impact',sans-serif; font-size: 19px;
      text-transform: uppercase; line-height: .95;
      padding: 14px 18px;
      transform: rotate(-5deg) skewX(-6deg);
      box-shadow: 6px 6px 0 ${RED};
      pointer-events: none;
    }
    .p5-badge-tyh span, .p5-badge-tyh { color: #ffffff !important; }
    .p5-badge-tyh i { color: ${RED} !important; font-style: normal; }

    /* destellos P5 con parpadeo animado */
    .p5-star-deco {
      position: absolute; z-index: 1; pointer-events: none;
      clip-path: polygon(50% 0, 62% 38%, 100% 50%, 62% 62%, 50% 100%, 38% 62%, 0 50%, 38% 38%);
      animation: p5Twinkle 3.2s ease-in-out infinite;
    }
    @keyframes p5Twinkle {
      0%, 100% { transform: scale(1) rotate(0deg); }
      50%      { transform: scale(1.3) rotate(22deg); }
    }
    .p5-star-s1 { width: 62px; height: 62px; top: 60px; left: -8px; background: ${RED}; }
    .p5-star-s2 { width: 30px; height: 30px; bottom: 96px; right: 2px; background: ${PAPER}; opacity: .9;
      animation-delay: 1.4s; animation-duration: 4.2s; }

    /* ────────── REVEAL ON SCROLL (con rebote) ────────── */
    .p5-rv {
      opacity: 0 !important;
      transform: translateY(52px) scale(.88) skewX(-3deg) !important;
      animation: none !important;
      transition: opacity .5s cubic-bezier(.2,.8,.3,1), transform .8s cubic-bezier(.34,1.7,.5,1) !important;
    }
    .p5-rv-l {
      opacity: 0 !important;
      transform: translateX(-90px) scale(.94) skewX(-5deg) !important;
      animation: none !important;
      transition: opacity .5s cubic-bezier(.2,.8,.3,1), transform .85s cubic-bezier(.34,1.65,.5,1) !important;
    }
    .p5-rv-r {
      opacity: 0 !important;
      transform: translateX(90px) scale(.94) skewX(5deg) !important;
      animation: none !important;
      transition: opacity .5s cubic-bezier(.2,.8,.3,1), transform .85s cubic-bezier(.34,1.65,.5,1) !important;
    }
    .p5-in {
      opacity: 1 !important;
      transform: none !important;
    }
  `;

  function injectCSS() {
    if (document.getElementById('p5-sections-style')) return;
    var s = document.createElement('style');
    s.id = 'p5-sections-style';
    s.textContent = CSS;
    document.head.appendChild(s);
  }

  function injectOfficeBgAndWave() {
    var sec = document.querySelector('section#inicio');
    if (!sec) return;

    if (!sec.querySelector('.hero-office-bg')) {
      var bg = document.createElement('div');
      bg.className = 'hero-office-bg';
      sec.insertBefore(bg, sec.firstChild);
    }

    if (!sec.querySelector('.p5-red-wave-corner')) {
      var wave = document.createElement('div');
      wave.className = 'p5-red-wave-corner';
      wave.innerHTML = `
        <svg viewBox="0 0 350 200" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M0 200V80C60 140 160 210 350 160V200H0Z" fill="#FE0002"/>
          <g transform="translate(30, 140) scale(0.85)">
            <path d="M12 28L4 12L16 18L24 4L32 18L44 12L36 28H12Z" fill="white" stroke="white" stroke-width="2" stroke-linejoin="round"/>
            <circle cx="8" cy="10" r="2" fill="white"/>
            <circle cx="24" cy="3" r="2" fill="white"/>
            <circle cx="40" cy="10" r="2" fill="white"/>
          </g>
        </svg>
      `;
      sec.appendChild(wave);
    }
  }

  function styleHero() {
    var sec = document.querySelector('section#inicio');
    if (!sec) return false;

    injectOfficeBgAndWave();

    var mainImg = null;
    var imgs = sec.querySelectorAll('img');
    for (var i = 0; i < imgs.length; i++) {
      var alt = (imgs[i].getAttribute('alt') || '').toLowerCase();
      if (alt === 'avatar') continue;
      var r = imgs[i].getBoundingClientRect();
      if (r.width > 150 && r.height > 150) { mainImg = imgs[i]; break; }
    }
    if (!mainImg) return false;

    var mainCard  = mainImg.parentElement;          
    var container = mainCard.parentElement;         
    if (container.dataset.p5hero === '1') return true;
    container.dataset.p5hero = '1';

    mainCard.classList.add('p5-frame');
    container.classList.add('p5-photo-zone');

    Array.prototype.forEach.call(container.children, function (ch) {
      if (ch === mainCard) return;
      var st = ch.getAttribute('style') || '';
      if (st.indexOf('position: absolute') >= 0 && st.indexOf('border-radius') >= 0) {
        ch.classList.add('p5-hero-hidden');
      }
    });

    var dots = document.createElement('div');
    dots.className = 'p5-frame-dots';
    mainCard.appendChild(dots);

    var tag = document.createElement('div');
    tag.className = 'p5-tag2';
    tag.textContent = '// Talento Real';

    var badge = document.createElement('div');
    badge.className = 'p5-badge-tyh';
    badge.innerHTML = '<span style="color:#ffffff !important;">TAKE<br>YOUR</span> <i style="color:#e60013 !important;">HEART</i>';

    var s1 = document.createElement('div');
    s1.className = 'p5-star-deco p5-star-s1';
    var s2 = document.createElement('div');
    s2.className = 'p5-star-deco p5-star-s2';

    // ── AGREGAR LA BURBUJA DOODLE Y LA NOTITA DE BENEFICIOS ──
    var bubble = document.createElement('div');
    bubble.className = 'p5-doodle-bubble';
    bubble.id = 'hero-doodle-bubble';
    bubble.innerHTML = `
      <span class="bubble-text" id="hero-bubble-text">¡Un gran lugar para trabajar!</span>
      <svg class="arrow-doodle" viewBox="0 0 50 50" fill="none">
        <path d="M5 40C15 35 30 25 40 10M40 10H25M40 10V25" stroke="#111827" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/>
      </svg>
    `;

    var note = document.createElement('div');
    note.className = 'p5-doodle-note';
    note.id = 'hero-doodle-note';
    note.innerHTML = `
      <svg class="heart-icon" viewBox="0 0 24 24" fill="#FE0002" stroke="#111827" stroke-width="1.5">
        <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
      </svg>
      <ul id="hero-note-list">
        <li>Buen ambiente</li>
        <li>Grandes beneficios</li>
        <li>Crecimiento profesional</li>
      </ul>
    `;

    container.insertBefore(s1, mainCard);
    container.insertBefore(s2, mainCard);
    container.appendChild(tag);
    container.appendChild(badge);
    container.appendChild(bubble);
    container.appendChild(note);

    var nodes = sec.querySelectorAll('div, span');
    Array.prototype.forEach.call(nodes, function (el) {
      if (el.childElementCount > 1) return;
      var txt = (el.textContent || '').trim();
      if (!txt || txt.length > 6) return;
      if (!/[0-9∞]/.test(txt)) return;
      var fs = parseFloat(getComputedStyle(el).fontSize);
      if (fs >= 26 && fs <= 64) {
        el.classList.add('p5-hstat');
        var sib = el.nextElementSibling;
        if (sib && (sib.textContent || '').trim().length > 4) {
          sib.classList.add('p5-hstat-label');
        }
      }
    });

    return true;
  }

  var observer = null;

  function getObserver() {
    if (observer) return observer;
    observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting) {
          en.target.classList.add('p5-in');
          observer.unobserve(en.target);
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });
    return observer;
  }

  var RV_SELECTORS = [
    'section#sobre-nosotros [style*="grid-column"]',
    '[style*="grid-template-columns: repeat(4, 1fr)"] > div',
    '#actividades .act-eyebrow',
    '#actividades .act-main-title',
    '#actividades .act-subtitle',
    '#actividades .act-filters',
    '#actividades .p5-card',
    'footer [style*="grid-template-columns"] > div',
  ];

  function scanReveals() {
    if (typeof IntersectionObserver === 'undefined') return;
    var obs = getObserver();

    RV_SELECTORS.forEach(function (sel) {
      var els;
      try { els = document.querySelectorAll(sel); } catch (e) { return; }
      Array.prototype.forEach.call(els, function (el, i) {
        if (el.dataset.p5rv === '1') return;
        el.dataset.p5rv = '1';

        var r = el.getBoundingClientRect();
        var inView = r.top < window.innerHeight * 0.9 && r.bottom > 0;

        if (!inView) {
          el.classList.add('p5-rv');
          el.style.transitionDelay = ((i % 6) * 0.08) + 's';
          obs.observe(el);
        }
      });
    });
  }

  var attempts = 0;

  function tick() {
    var heroOk = styleHero();
    scanReveals();
    if (!heroOk && attempts < 24) {
      attempts++;
      setTimeout(tick, 500);
    }
  }

  function init() {
    injectCSS();
    setTimeout(tick, 250);
  }

  if (document.readyState !== 'loading') {
    init();
  } else {
    document.addEventListener('DOMContentLoaded', init);
  }
})();
