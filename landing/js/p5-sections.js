/**
 * p5-sections.js — DreamTeam Persona 5
 * ----------------------------------------------------------------
 *  1. HERO estilo P5: marco polaroid rojo inclinado con sombra dura,
 *     etiqueta "// TALENTO REAL", badge "TAKE YOUR HEART", estrellas,
 *     kicker con línea roja, H1 Anton gigante, stats Anton rojas.
 *  2. Sección final "¿Buscas crecer de verdad?" — split foto duotono
 *     + copy P5 (reemplaza el CTA original manteniendo el ancla #unete).
 *  3. Animaciones de entrada al hacer scroll (IntersectionObserver)
 *     para todas las secciones de la página.
 *
 *  Compatible con hero-slideshow.js (las fotos rotan dentro del marco).
 */
(function () {
  'use strict';

  var RED   = '#e60013';
  var PAPER = '#f3efe6';

  /* ═══════════════════════════════════════════════════════════════
     CSS GLOBAL DEL MÓDULO
  ═══════════════════════════════════════════════════════════════ */
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

    /* zona de la foto del hero agrandada 45% (misma posición: el
       scale no altera el layout, solo el tamaño visual) */
    .p5-photo-zone { transform: scale(1.45); transform-origin: center center; }
    @media (max-width: 1280px) { .p5-photo-zone { transform: scale(1.28); } }
    @media (max-width: 1080px) { .p5-photo-zone { transform: scale(1.12); } }

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
    /* destellos P5 (sparkle de 4 puntas) con parpadeo animado */
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

    /* ────────── ESTRELLAS ACOMPAÑANTES (siguen el scroll) ────────── */
    .p5-companion {
      position: fixed; z-index: 640; pointer-events: none;
      will-change: transform;
    }
    .p5-companion .shape {
      display: block; width: 100%; height: 100%;
      background: ${RED};
      clip-path: polygon(50% 0,61% 35%,98% 35%,68% 57%,79% 91%,50% 70%,21% 91%,32% 57%,2% 35%,39% 35%);
      animation: p5CompSpin 16s linear infinite;
      filter: drop-shadow(3px 3px 0 rgba(0,0,0,.5));
    }
    #p5-comp-2 .shape {
      clip-path: polygon(50% 0, 62% 38%, 100% 50%, 62% 62%, 50% 100%, 38% 62%, 0 50%, 38% 38%);
      animation-duration: 9s; animation-direction: reverse;
    }
    @keyframes p5CompSpin { to { transform: rotate(360deg); } }
    #p5-comp-1 { width: 44px; height: 44px; top: 22vh; left: 3vw;  opacity: .48; }
    #p5-comp-2 { width: 26px; height: 26px; top: 64vh; right: 3.5vw; opacity: .38; }
    @media (max-width: 768px) {
      #p5-comp-1 { width: 30px; height: 30px; opacity: .3; }
      #p5-comp-2 { display: none; }
    }

    /* ────────── REVEAL ON SCROLL (con rebote) ──────────
       cubic-bezier(.34,1.7,.5,1) = overshoot: el elemento pasa un
       poco de largo y rebota a su lugar, estilo menú de Persona 5 */
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

    /* ────────── SECCIÓN ÚNETE (P5) ────────── */
    #unete { background: #0a0a0a; position: relative; overflow: hidden; }
    #unete .up5-grid { display: grid; grid-template-columns: 1fr 1fr; min-height: 560px; }
    #unete .up5-photo { position: relative; overflow: hidden; }
    #unete .up5-photo img {
      position: absolute; inset: 0; width: 100%; height: 100%;
      object-fit: cover; display: block;
      filter: grayscale(1) contrast(1.25) brightness(.85);
    }
    #unete .up5-photo::after {
      content: ''; position: absolute; inset: 0;
      background: linear-gradient(120deg, rgba(230,0,19,.55), rgba(10,10,10,.2) 60%);
      mix-blend-mode: multiply;
    }
    #unete .up5-half {
      position: absolute; inset: 0; z-index: 2; pointer-events: none;
      background-image: radial-gradient(circle, rgba(255,255,255,.9) 1px, transparent 1.5px);
      background-size: 8px 8px; opacity: .14;
    }
    #unete .up5-clip {
      position: absolute; inset: 0; z-index: 3; pointer-events: none;
      background: #0a0a0a;
      clip-path: polygon(78% 0, 100% 0, 100% 100%, 92% 100%);
    }
    #unete .up5-copy {
      padding: 90px 64px; position: relative;
      display: flex; flex-direction: column; justify-content: center;
      align-items: flex-start;
    }
    #unete .up5-copy .p5-star-deco { width: 56px; height: 56px; top: 44px; right: 52px; background: ${RED}; opacity: .9; }
    #unete .up5-eyebrow {
      display: block; width: 100%;
      background: ${RED}; color: #fff;
      font-family: 'Oswald', sans-serif; font-weight: 700; font-size: 13px;
      letter-spacing: 4px; text-transform: uppercase;
      padding: 9px 16px 9px 14px;
      transform: skewX(-8deg);
      box-shadow: 5px 5px 0 #000;
      margin-bottom: 30px;
    }
    #unete .up5-eyebrow > span { display: inline-flex; align-items: center; gap: 10px; transform: skewX(8deg); }
    #unete .up5-eyebrow .tri { width: 0; height: 0; border-left: 8px solid #fff; border-top: 5px solid transparent; border-bottom: 5px solid transparent; display: inline-block; }
    #unete h2.up5-title {
      font-family: 'Anton','Impact',sans-serif; font-weight: 400;
      text-transform: uppercase;
      font-size: clamp(42px, 5.2vw, 78px); line-height: .9;
      color: #fff; margin: 0 0 8px;
    }
    #unete h2.up5-title .red { color: ${RED}; font-style: italic; }
    #unete .up5-copy p {
      font-family: 'Barlow Semi Condensed','DM Sans',sans-serif;
      font-size: 19px; font-weight: 500; color: #c9c3b5;
      max-width: 46ch; margin: 16px 0 30px; line-height: 1.55;
    }
    #unete .up5-perks { display: flex; flex-wrap: wrap; gap: 12px; margin-bottom: 38px; }
    #unete .up5-perk {
      font-family: 'Oswald', sans-serif; font-weight: 600;
      text-transform: uppercase; letter-spacing: 1px; font-size: 13px;
      color: #fff; border: 2px solid #3a3a3a; padding: 9px 15px;
      transform: skewX(-8deg); transition: border-color .2s;
    }
    #unete .up5-perk:hover { border-color: ${RED}; }
    #unete .up5-perk > span { display: inline-block; transform: skewX(8deg); }
    #unete .up5-perk i { color: ${RED}; font-style: normal; margin-right: 7px; }
    #unete .up5-btn {
      display: inline-block; text-decoration: none;
      background: ${RED}; color: #fff;
      font-family: 'Oswald', sans-serif; font-weight: 700; font-size: 17px;
      letter-spacing: 2px; text-transform: uppercase;
      padding: 18px 38px;
      transform: skewX(-10deg);
      box-shadow: 6px 6px 0 #000;
      transition: transform .12s, box-shadow .12s;
    }
    #unete .up5-btn:hover {
      transform: skewX(-10deg) translate(-2px,-2px);
      box-shadow: 9px 9px 0 #000;
    }
    #unete .up5-btn > span { display: inline-block; transform: skewX(10deg); }

    @media (max-width: 900px) {
      #unete .up5-grid { grid-template-columns: 1fr; }
      #unete .up5-photo { min-height: 340px; position: relative; }
      #unete .up5-photo img { position: absolute; }
      #unete .up5-clip { clip-path: polygon(0 82%, 100% 96%, 100% 100%, 0 100%); }
      #unete .up5-copy { padding: 56px 24px 70px; }
      #unete .up5-copy .p5-star-deco { top: 24px; right: 22px; width: 40px; height: 40px; }
    }
  `;

  function injectCSS() {
    if (document.getElementById('p5-sections-style')) return;
    var s = document.createElement('style');
    s.id = 'p5-sections-style';
    s.textContent = CSS;
    document.head.appendChild(s);
  }

  /* ═══════════════════════════════════════════════════════════════
     1. HERO — marco polaroid + decoraciones + stats
  ═══════════════════════════════════════════════════════════════ */
  function styleHero() {
    var sec = document.querySelector('section#inicio');
    if (!sec) return false;

    /* encontrar la foto principal (no avatares) */
    var mainImg = null;
    var imgs = sec.querySelectorAll('img');
    for (var i = 0; i < imgs.length; i++) {
      var alt = (imgs[i].getAttribute('alt') || '').toLowerCase();
      if (alt === 'avatar') continue;
      var r = imgs[i].getBoundingClientRect();
      if (r.width > 150 && r.height > 150) { mainImg = imgs[i]; break; }
    }
    if (!mainImg) return false;

    var mainCard  = mainImg.parentElement;          // tarjeta con rotate(-4deg)
    var container = mainCard.parentElement;         // contenedor flex 400×500
    if (container.dataset.p5hero === '1') return true;
    container.dataset.p5hero = '1';

    /* marco P5 + zona agrandada 45% */
    mainCard.classList.add('p5-frame');
    container.classList.add('p5-photo-zone');

    /* ocultar las "hojas" rojas apiladas detrás (diseño anterior) */
    Array.prototype.forEach.call(container.children, function (ch) {
      if (ch === mainCard) return;
      var st = ch.getAttribute('style') || '';
      if (st.indexOf('position: absolute') >= 0 && st.indexOf('border-radius') >= 0) {
        ch.classList.add('p5-hero-hidden');
      }
    });

    /* halftone rojo sobre la foto */
    var dots = document.createElement('div');
    dots.className = 'p5-frame-dots';
    mainCard.appendChild(dots);

    /* decoraciones alrededor del marco */
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

    /* estrellas detrás del marco, etiquetas por encima */
    container.insertBefore(s1, mainCard);
    container.insertBefore(s2, mainCard);
    container.appendChild(tag);
    container.appendChild(badge);

    /* stats "10+ / 24/7 / ∞" → Anton rojo */
    var nodes = sec.querySelectorAll('div, span');
    Array.prototype.forEach.call(nodes, function (el) {
      if (el.childElementCount > 1) return;
      var txt = (el.textContent || '').trim();
      if (!txt || txt.length > 6) return;
      if (!/[0-9∞]/.test(txt)) return;
      var fs = parseFloat(getComputedStyle(el).fontSize);
      if (fs >= 26 && fs <= 64) {
        el.classList.add('p5-hstat');
        /* la etiqueta pequeña que acompaña al número */
        var sib = el.nextElementSibling;
        if (sib && (sib.textContent || '').trim().length > 4) {
          sib.classList.add('p5-hstat-label');
        }
      }
    });

    return true;
  }

  /* ═══════════════════════════════════════════════════════════════
     2. SECCIÓN ÚNETE — split foto duotono + copy P5
  ═══════════════════════════════════════════════════════════════ */
  function buildUnete() {
    return true; // Disabled duplicate P5 layout replacement to allow React CV Form to display
  }

  /* ═══════════════════════════════════════════════════════════════
     3. REVEAL ON SCROLL
  ═══════════════════════════════════════════════════════════════ */
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

  /* Selectores de elementos que se animan al entrar en pantalla */
  var RV_SELECTORS = [
    /* Nosotros: tarjetas bento + encabezado */
    'section#sobre-nosotros [style*="grid-column"]',
    /* Cómo trabajamos: pasos */
    '[style*="grid-template-columns: repeat(4, 1fr)"] > div',
    /* Actividades */
    '#actividades .act-eyebrow',
    '#actividades .act-main-title',
    '#actividades .act-subtitle',
    '#actividades .act-filters',
    '#actividades .p5-card',
    /* Footer: columnas */
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

        /* si ya está visible en pantalla, no ocultarlo (evita parpadeo) */
        var r = el.getBoundingClientRect();
        var inView = r.top < window.innerHeight * 0.9 && r.bottom > 0;

        if (!inView) {
          el.classList.add('p5-rv');
          el.style.transitionDelay = ((i % 6) * 0.08) + 's';
          obs.observe(el);
        }
      });
    });

    /* elementos .p5-rv añadidos por buildUnete */
    var manual = document.querySelectorAll('.p5-rv:not([data-p5rv]), .p5-rv-l:not([data-p5rv]), .p5-rv-r:not([data-p5rv])');
    Array.prototype.forEach.call(manual, function (el) {
      el.dataset.p5rv = '1';
      obs.observe(el);
    });
  }

  /* ═══════════════════════════════════════════════════════════════
     4. ESTRELLAS ACOMPAÑANTES
  ═══════════════════════════════════════════════════════════════ */
  function initCompanions() {
    if (document.getElementById('p5-comp-1')) return;
    try {
      if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    } catch (e) {}

    function makeStar(id) {
      var el = document.createElement('div');
      el.className = 'p5-companion';
      el.id = id;
      var shape = document.createElement('span');
      shape.className = 'shape';
      el.appendChild(shape);
      document.body.appendChild(el);
      return el;
    }
    var c1 = makeStar('p5-comp-1');
    var c2 = makeStar('p5-comp-2');

    var cur = 0;   // scroll suavizado

    function loop() {
      var target = window.scrollY || document.documentElement.scrollTop || 0;
      cur += (target - cur) * 0.06;

      var x1 = Math.sin(cur * 0.0016) * 22;
      var y1 = Math.sin(cur * 0.0024) * 30 + (target - cur) * 0.18;
      var x2 = Math.sin(cur * 0.0012 + 2.1) * 26;
      var y2 = Math.cos(cur * 0.0019) * 38 + (target - cur) * 0.26;
      var rot = (cur * 0.04) % 360;

      c1.style.transform = 'translate(' + x1.toFixed(1) + 'px,' + y1.toFixed(1) + 'px) rotate(' + rot.toFixed(1) + 'deg)';
      c2.style.transform = 'translate(' + x2.toFixed(1) + 'px,' + y2.toFixed(1) + 'px) rotate(' + (-rot * 0.7).toFixed(1) + 'deg)';

      requestAnimationFrame(loop);
    }
    requestAnimationFrame(loop);
  }

  var attempts = 0;

  function tick() {
    var heroOk  = styleHero();
    var uneteOk = buildUnete();
    scanReveals();
    if ((!heroOk || !uneteOk || attempts < 6) && attempts < 24) {
      attempts++;
      setTimeout(tick, 500);
    }
  }

  function init() {
    injectCSS();
    initCompanions();
    setTimeout(tick, 250);
  }

  if (document.readyState !== 'loading') {
    init();
  } else {
    document.addEventListener('DOMContentLoaded', init);
  }
})();
