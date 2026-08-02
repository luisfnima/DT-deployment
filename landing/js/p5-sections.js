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
    }
    /* etiqueta "// TALENTO REAL" */
    .p5-tag-tr {
      position: absolute; top: -16px; right: -12px; z-index: 6;
      background: ${RED}; color: #fff;
      font-family: 'Oswald', sans-serif; font-size: 13px; font-weight: 700;
      letter-spacing: 2px; text-transform: uppercase;
      padding: 6px 14px; transform: rotate(3.5deg);
      box-shadow: 4px 4px 0 #000;
      pointer-events: none;
    }
    /* badge "TAKE YOUR HEART" */
    .p5-badge-tyh {
      position: absolute; bottom: 12px; left: -2px; z-index: 6;
      background: #000; color: #fff;
      font-family: 'Anton','Impact',sans-serif; font-size: 19px;
      text-transform: uppercase; line-height: .95;
      padding: 14px 18px;
      transform: rotate(-5deg) skewX(-6deg);
      box-shadow: 6px 6px 0 ${RED};
      pointer-events: none;
    }
    .p5-badge-tyh i { color: ${RED}; font-style: normal; }
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
      padding: 6px 16px; margin-bottom: 20px;
      transform: rotate(-2deg); box-shadow: 4px 4px 0 #000;
      width: fit-content;
    }
    #unete h2 {
      font-family: 'Anton','Impact',sans-serif !important;
      font-size: clamp(48px, 5.8vw, 84px) !important;
      line-height: .9 !important; letter-spacing: 1px !important;
      text-transform: uppercase !important; color: #fff !important;
      margin-bottom: 24px !important;
    }
    #unete h2 span { color: ${RED} !important; }
    #unete p.up5-lead {
      color: #d8d2c4 !important; font-size: 17px !important;
      line-height: 1.6 !important; max-width: 480px !important;
      margin-bottom: 36px !important;
    }
    #unete .up5-bullets {
      display: flex; flex-direction: column; gap: 14px; margin-bottom: 44px;
    }
    #unete .up5-bullet {
      display: flex; align-items: center; gap: 14px;
      color: ${PAPER}; font-family: 'Oswald', sans-serif;
      font-size: 15px; letter-spacing: 1.5px; text-transform: uppercase;
    }
    #unete .up5-bullet i {
      width: 22px; height: 22px; background: ${RED}; color: #fff;
      display: inline-flex; align-items: center; justify-content: center;
      font-style: normal; font-weight: 900; font-size: 12px;
      box-shadow: 2px 2px 0 #000; flex-shrink: 0;
    }
    #unete a.up5-btn {
      display: inline-flex; align-items: center; gap: 14px;
      background: ${RED}; color: #fff;
      font-family: 'Anton','Impact',sans-serif; font-size: 22px;
      letter-spacing: 2px; text-transform: uppercase;
      padding: 18px 42px; border: 3px solid #000;
      box-shadow: 6px 6px 0 ${PAPER};
      text-decoration: none;
      transition: transform .18s ease, box-shadow .18s ease, background .18s ease;
    }
    #unete a.up5-btn:hover {
      transform: translate(-3px, -3px);
      box-shadow: 10px 10px 0 ${PAPER};
      background: #ff1a2d;
    }

    @media (max-width: 900px) {
      #unete .up5-grid { grid-template-columns: 1fr; }
      #unete .up5-photo { height: 320px; }
      #unete .up5-copy { padding: 48px 28px; }
    }

    /* ────────── CARDS SOBRE NOSOTROS & PROCESO & ACTIVIDADES ────────── */
    #sobre-nosotros [style*="gridColumn"],
    #como-trabajamos [style*="gridTemplateColumns"] > div,
    #actividades .p5-card {
      border-radius: 0 !important;
      border: 3px solid #000000 !important;
      box-shadow: 6px 6px 0 #000000 !important;
      transition: transform .22s ease, box-shadow .22s ease !important;
    }
    #sobre-nosotros [style*="gridColumn"]:hover,
    #como-trabajamos [style*="gridTemplateColumns"] > div:hover,
    #actividades .p5-card:hover {
      transform: translate(-3px, -3px) !important;
      box-shadow: 10px 10px 0 ${RED} !important;
    }

    /* ────────── BOTONES CON HOVER ROJO ────────── */
    #colaboradores-btn,
    a[href*="forms.gle"] {
      border-radius: 0 !important;
      border: 2.5px solid #000 !important;
      box-shadow: 4px 4px 0 #000 !important;
      text-transform: uppercase !important;
      letter-spacing: 1px !important;
      font-family: 'Oswald', sans-serif !important;
      font-weight: 700 !important;
      transition: transform .18s ease, box-shadow .18s ease, background .18s ease !important;
    }
    #colaboradores-btn:hover,
    a[href*="forms.gle"]:hover {
      transform: translate(-2px, -2px) !important;
      box-shadow: 7px 7px 0 #000 !important;
      background: ${RED} !important;
    }
  `;

  function injectCSS() {
    if (document.getElementById('p5-sections-style')) return;
    var st = document.createElement('style');
    st.id = 'p5-sections-style';
    st.textContent = CSS;
    document.head.appendChild(st);
  }

  /* ═══════════════════════════════════════════════════════════════
     1. HERO P5 (ESTRUCTURA + ESTILOS)
  ═══════════════════════════════════════════════════════════════ */
  function applyHeroP5() {
    var heroSec = document.querySelector('section#inicio');
    if (!heroSec) return;

    // Buscar tarjeta principal (la foto)
    var photoWrap = heroSec.querySelector('div[style*="rotate(-4deg)"]');
    if (!photoWrap) {
      // Fallback: buscar div contenedor que tenga la img heroPhoto
      var img = heroSec.querySelector('img[alt="Agente de contact center"]');
      if (img && img.parentNode) photoWrap = img.parentNode;
    }

    if (photoWrap && !photoWrap.classList.contains('p5-frame')) {
      photoWrap.classList.add('p5-frame');

      var parent = photoWrap.parentNode;
      if (parent && getComputedStyle(parent).position === 'static') {
        parent.style.position = 'relative';
      }

      // Etiqueta // TALENTO REAL
      if (parent && !parent.querySelector('.p5-tag-tr')) {
        var tag = document.createElement('div');
        tag.className = 'p5-tag-tr';
        tag.innerHTML = '// TALENTO REAL';
        parent.appendChild(tag);
      }

      // Badge TAKE YOUR HEART
      if (parent && !parent.querySelector('.p5-badge-tyh')) {
        var badge = document.createElement('div');
        badge.className = 'p5-badge-tyh';
        badge.innerHTML = 'TAKE <i>♥</i> YOUR HEART';
        parent.appendChild(badge);
      }

      // Estrellas rojas/blancas decorativas
      if (parent && !parent.querySelector('.p5-star-s1')) {
        var s1 = document.createElement('div');
        s1.className = 'p5-star-deco p5-star-s1';
        parent.appendChild(s1);
      }
      if (parent && !parent.querySelector('.p5-star-s2')) {
        var s2 = document.createElement('div');
        s2.className = 'p5-star-deco p5-star-s2';
        parent.appendChild(s2);
      }
    }

    // Adaptar Stats a fuente Anton P5
    var statNumbers = heroSec.querySelectorAll('div[style*="fontFamily: \'Sora\'"], div[style*="font-family: Sora"]');
    statNumbers.forEach(function (el) {
      if (/^\d+\+?$/.test(el.textContent.trim())) {
        el.classList.add('p5-hstat');
        if (el.nextElementSibling) {
          el.nextElementSibling.classList.add('p5-hstat-label');
        }
      }
    });
  }

  /* ═══════════════════════════════════════════════════════════════
     2. REEMPLAZO DE LA SECCIÓN CTA (#unete) A P5
  ═══════════════════════════════════════════════════════════════ */
  function applyCtaP5() {
    var originalCta = document.querySelector('section#unete');
    if (!originalCta) return;

    // Si ya fue reemplazada, no hacer nada
    if (originalCta.querySelector('.up5-grid')) return;

    var bgImg = (window.__resources && window.__resources.ctaBg)
      || "https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=1200&q=80&fit=crop";

    var newContent = document.createElement('div');
    newContent.className = 'up5-grid';
    newContent.innerHTML = `
      <div class="up5-photo">
        <img src="${bgImg}" alt="Equipo DreamTeam P5">
        <div class="up5-half"></div>
        <div class="up5-clip"></div>
      </div>
      <div class="up5-copy">
        <div class="p5-star-deco"></div>
        <span class="up5-eyebrow">// Únete a DreamTeam</span>
        <h2>¿BUSCAS CRECER <span>DE VERDAD?</span></h2>
        <p class="up5-lead">
          No buscamos empleados convencionales. Incorporamos talento con hambre de superación, pasión por las ventas y visión de futuro.
        </p>
        <div class="up5-bullets">
          <div class="up5-bullet"><i>✓</i> Comisiones sin techo + bonificaciones diarias</div>
          <div class="up5-bullet"><i>✓</i> Capacitación continua en neuroventas y persuasión</div>
          <div class="up5-bullet"><i>✓</i> Línea de carrera real en una compañía en constante expansión</div>
          <div class="up5-bullet"><i>✓</i> Cultura de alto rendimiento y reconocimiento constante</div>
        </div>
        <a href="https://forms.gle/9AWQbTY2SBmc3Yg77" target="_blank" rel="noopener" class="up5-btn">
          POSTULAR AHORA ➔
        </a>
      </div>
    `;

    // Limpiar contenido previo del section y reemplazar por la versión P5 limpia
    originalCta.innerHTML = '';
    originalCta.appendChild(newContent);
  }

  /* ═══════════════════════════════════════════════════════════════
     3. ANIMACIONES DE ENTRADA AL HACER SCROLL (INTERSECTION OBSERVER)
  ═══════════════════════════════════════════════════════════════ */
  function initScrollReveals() {
    // 1. Nos aseguremos de que las cards de Sobre Nosotros tengan p5-rv
    var sobreCards = document.querySelectorAll('#sobre-nosotros [style*="gridColumn"]');
    sobreCards.forEach(function (c, i) {
      if (!c.classList.contains('p5-rv')) {
        c.classList.add(i % 2 === 0 ? 'p5-rv-l' : 'p5-rv-r');
      }
    });

    // 2. Cards de Proceso
    var procCards = document.querySelectorAll('#como-trabajamos [style*="gridTemplateColumns"] > div');
    procCards.forEach(function (c, i) {
      if (!c.classList.contains('p5-rv')) {
        c.classList.add('p5-rv');
        c.style.transitionDelay = (i * 0.12) + 's';
      }
    });

    // 3. Cards de Actividades
    var actCards = document.querySelectorAll('#actividades .p5-card');
    actCards.forEach(function (c, i) {
      if (!c.classList.contains('p5-rv')) {
        c.classList.add('p5-rv');
        c.style.transitionDelay = (i * 0.1) + 's';
      }
    });

    // 4. Elementos del Hero (animación de entrada al cargar)
    var heroSec = document.querySelector('section#inicio');
    if (heroSec) {
      var heroEls = heroSec.querySelectorAll('h1, .fade-up-1, .fade-up-3, .fade-up-4, .fade-up-5, .p5-frame');
      heroEls.forEach(function (el, i) {
        if (!el.classList.contains('p5-rv')) {
          el.classList.add('p5-rv');
          el.style.transitionDelay = (i * 0.08) + 's';
        }
      });
    }

    // Configurar IntersectionObserver para activar la clase .p5-in
    var allReveals = document.querySelectorAll('.p5-rv, .p5-rv-l, .p5-rv-r');
    if ('IntersectionObserver' in window) {
      var obs = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add('p5-in');
            obs.unobserve(entry.target);
          }
        });
      }, { threshold: 0.15 });

      allReveals.forEach(function (el) {
        obs.observe(el);
      });
    } else {
      // Fallback para navegadores antiguos sin IntersectionObserver
      allReveals.forEach(function (el) {
        el.classList.add('p5-in');
      });
    }
  }

  /* ═══════════════════════════════════════════════════════════════
     4. ESTRELLAS ACOMPAÑANTES DE SCROLL (PARALLAX FLUIDO)
  ═══════════════════════════════════════════════════════════════ */
  function initCompanions() {
    if (document.getElementById('p5-comp-1')) return;

    var c1 = document.createElement('div');
    c1.id = 'p5-comp-1';
    c1.className = 'p5-companion';
    c1.innerHTML = '<span class="shape"></span>';
    document.body.appendChild(c1);

    var c2 = document.createElement('div');
    c2.id = 'p5-comp-2';
    c2.className = 'p5-companion';
    c2.innerHTML = '<span class="shape"></span>';
    document.body.appendChild(c2);

    window.addEventListener('scroll', function () {
      var sc = window.scrollY || document.documentElement.scrollTop;
      c1.style.transform = 'translateY(' + (sc * 0.06) + 'px)';
      c2.style.transform = 'translateY(' + (-sc * 0.04) + 'px)';
    }, { passive: true });
  }

  /* ═══════════════════════════════════════════════════════════════
     INICIALIZACIÓN CONTINUA (Reacción al renderizado React)
  ═══════════════════════════════════════════════════════════════ */
  function boot() {
    injectCSS();
    applyHeroP5();
    applyCtaP5();
    initScrollReveals();
    initCompanions();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', boot);
  } else {
    boot();
  }

  // Polling breve por si React reinicia el DOM de #root
  var count = 0;
  var timer = setInterval(function () {
    boot();
    count++;
    if (count > 25) clearInterval(timer);
  }, 400);

})();
