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

    /* zona de la foto del hero: escalado adaptativo fluido */
    .p5-photo-zone { transform: scale(1.45); transform-origin: center center; transition: transform .3s ease; }
    @media (max-width: 1280px) { .p5-photo-zone { transform: scale(1.25); } }
    @media (max-width: 1080px) { .p5-photo-zone { transform: scale(1.1); } }
    @media (max-width: 768px) {
      .p5-photo-zone {
        transform: scale(0.85);
        margin: 20px 0 30px 0;
      }
    }
    @media (max-width: 480px) {
      .p5-photo-zone {
        transform: scale(0.72);
        margin: 10px 0 20px 0;
      }
    }

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

    /* ────────── BURBUJA INTERACTIVA CAMBIANTE (SPEECH BUBBLE) ────────── */
    .p5-speech-bubble {
      position: absolute;
      bottom: 60px;
      left: -120px;
      z-index: 10;
      background: #ffffff;
      color: #0b0b0b;
      border: 3px solid #0b0b0b;
      border-radius: 50px;
      padding: 14px 22px;
      font-family: 'DM Sans', sans-serif;
      font-weight: 700;
      font-size: 14px;
      line-height: 1.35;
      text-align: center;
      max-width: 230px;
      box-shadow: 4px 4px 0 #000;
      transform: rotate(-4deg);
      pointer-events: none;
      transition: opacity 0.4s ease, transform 0.4s ease;
    }
    /* Flecha curvada hacia la foto */
    .p5-speech-bubble::after {
      content: '';
      position: absolute;
      right: -24px;
      top: 50%;
      transform: translateY(-50%);
      width: 24px;
      height: 24px;
      background-image: url("data:image/svg+xml,%3Csvg width='24' height='24' viewBox='0 0 24 24' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M2 12 Q 14 2, 22 12' stroke='%230b0b0b' stroke-width='3' fill='none' stroke-linecap='round'/%3E%3Cpath d='M16 8 L 22 12 L 18 18' stroke='%230b0b0b' stroke-width='3' fill='none' stroke-linecap='round' stroke-linejoin='round'/%3E%3C/svg%3E");
      background-size: contain;
      background-repeat: no-repeat;
    }

    /* ────────── NOTITA CHECKLIST CAMBIANTE ────────── */
    .p5-notepad {
      position: absolute;
      top: 40px;
      right: -135px;
      z-index: 10;
      background: #ffffff;
      color: #111827;
      border: 2px solid #0b0b0b;
      border-radius: 8px;
      padding: 16px 18px;
      font-family: 'DM Sans', sans-serif;
      font-size: 13px;
      line-height: 1.6;
      width: 170px;
      box-shadow: 5px 5px 0 rgba(0,0,0,0.8);
      transform: rotate(3deg);
      pointer-events: none;
      transition: opacity 0.4s ease, transform 0.4s ease;
    }
    .p5-notepad-item {
      display: flex;
      align-items: flex-start;
      gap: 6px;
      font-weight: 600;
      color: #111827;
      margin-bottom: 6px;
    }
    .p5-notepad-item i {
      color: ${RED};
      font-style: normal;
      font-weight: 800;
    }
    /* Flecha amarilla indicadora hacia la nota */
    .p5-notepad::before {
      content: '';
      position: absolute;
      top: -24px;
      left: -28px;
      width: 32px;
      height: 32px;
      background-image: url("data:image/svg+xml,%3Csvg width='32' height='32' viewBox='0 0 32 32' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M4 4 Q 18 8, 26 24' stroke='%23eab308' stroke-width='3.5' fill='none' stroke-linecap='round'/%3E%3Cpath d='M18 22 L 26 24 L 24 16' stroke='%23eab308' stroke-width='3.5' fill='none' stroke-linecap='round' stroke-linejoin='round'/%3E%3C/svg%3E");
      background-size: contain;
      background-repeat: no-repeat;
    }

    /* Responsive behavior for speech bubble and notepad */
    @media (max-width: 1200px) {
      .p5-speech-bubble { left: -60px; max-width: 180px; font-size: 12px; padding: 10px 16px; }
      .p5-notepad { right: -70px; width: 140px; font-size: 11px; padding: 12px; }
    }
    @media (max-width: 900px) {
      .p5-speech-bubble, .p5-notepad { display: none !important; }
    }

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
  function applyHeroP5() {
    var heroSec = document.querySelector('section#inicio');
    if (!heroSec) return;

    // Buscar tarjeta principal (la foto)
    var photoWrap = heroSec.querySelector('div[style*="rotate(-4deg)"]');
    if (!photoWrap) {
      var img = heroSec.querySelector('img[alt="Agente de contact center"]');
      if (img && img.parentNode) photoWrap = img.parentNode;
    }

    if (photoWrap && !photoWrap.classList.contains('p5-frame')) {
      photoWrap.classList.add('p5-frame');

      var parent = photoWrap.parentNode;
      if (parent) {
        parent.style.position = 'relative';

        // Etiqueta // TALENTO REAL
        if (!parent.querySelector('.p5-tag-tr')) {
          var tag = document.createElement('div');
          tag.className = 'p5-tag-tr';
          tag.innerHTML = '// TALENTO REAL';
          parent.appendChild(tag);
        }

        // Badge TAKE YOUR HEART
        if (!parent.querySelector('.p5-badge-tyh')) {
          var badge = document.createElement('div');
          badge.className = 'p5-badge-tyh';
          badge.innerHTML = 'TAKE <i>♥</i> YOUR HEART';
          parent.appendChild(badge);
        }

        // Estrellas decorativas
        if (!parent.querySelector('.p5-star-s1')) {
          var s1 = document.createElement('div');
          s1.className = 'p5-star-deco p5-star-s1';
          parent.appendChild(s1);
        }
        if (!parent.querySelector('.p5-star-s2')) {
          var s2 = document.createElement('div');
          s2.className = 'p5-star-deco p5-star-s2';
          parent.appendChild(s2);
        }

        // Burbuja interactiva cambiante (Speech bubble)
        if (!parent.querySelector('.p5-speech-bubble')) {
          var bubble = document.createElement('div');
          bubble.className = 'p5-speech-bubble';
          var quotes = [
            '¡Terminé mi carrera mientras trabajaba aquí!',
            '¡Los mejores incentivos y ambiente de trabajo!',
            '¡Crecí profesionalmente desde el primer mes!',
            '¡Comisiones sin techo y pagos siempre puntuales!'
          ];
          var qIdx = 0;
          bubble.textContent = quotes[0];
          parent.appendChild(bubble);

          setInterval(function() {
            qIdx = (qIdx + 1) % quotes.length;
            bubble.style.opacity = '0';
            bubble.style.transform = 'rotate(-4deg) translateY(6px)';
            setTimeout(function() {
              bubble.textContent = quotes[qIdx];
              bubble.style.opacity = '1';
              bubble.style.transform = 'rotate(-4deg) translateY(0)';
            }, 400);
          }, 4500);
        }

        // Notita checklist fija con flecha amarilla
        if (!parent.querySelector('.p5-notepad')) {
          var note = document.createElement('div');
          note.className = 'p5-notepad';
          note.innerHTML = `
            <div class="p5-notepad-item"><i>✓</i> Capacitaciones constantes</div>
            <div class="p5-notepad-item"><i>✓</i> Línea de carrera</div>
            <div class="p5-notepad-item"><i>✓</i> Comisiones sin techo</div>
            <div class="p5-notepad-item"><i>✓</i> Excelente clima laboral</div>
          `;
          parent.appendChild(note);
        }
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

    originalCta.innerHTML = '';
    originalCta.appendChild(newContent);
  }

  /* ═══════════════════════════════════════════════════════════════
     3. ANIMACIONES DE ENTRADA SCROLL
  ═══════════════════════════════════════════════════════════════ */
  function initScrollReveals() {
    var sobreCards = document.querySelectorAll('#sobre-nosotros [style*="gridColumn"]');
    sobreCards.forEach(function (c, i) {
      if (!c.classList.contains('p5-rv')) {
        c.classList.add(i % 2 === 0 ? 'p5-rv-l' : 'p5-rv-r');
      }
    });

    var procCards = document.querySelectorAll('#como-trabajamos [style*="gridTemplateColumns"] > div');
    procCards.forEach(function (c, i) {
      if (!c.classList.contains('p5-rv')) {
        c.classList.add('p5-rv');
        c.style.transitionDelay = (i * 0.12) + 's';
      }
    });

    var actCards = document.querySelectorAll('#actividades .p5-card');
    actCards.forEach(function (c, i) {
      if (!c.classList.contains('p5-rv')) {
        c.classList.add('p5-rv');
        c.style.transitionDelay = (i * 0.1) + 's';
      }
    });

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
      allReveals.forEach(function (el) {
        el.classList.add('p5-in');
      });
    }
  }

  /* ═══════════════════════════════════════════════════════════════
     4. ESTRELLAS ACOMPAÑANTES
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
     INICIALIZACIÓN CONTINUA
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

  var count = 0;
  var timer = setInterval(function () {
    boot();
    count++;
    if (count > 30) clearInterval(timer);
  }, 300);

})();
