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
    .p5-hero-section {
      min-height: 100vh;
      background-image: linear-gradient(rgba(10, 10, 10, 0.78), rgba(10, 10, 10, 0.88)), url('images/hero_office_bg.jpg') !important;
      background-size: cover !important;
      background-position: center center !important;
      background-repeat: no-repeat !important;
    }
    @media (max-width: 900px) { .p5-hero-section { min-height: auto !important; } }

    /* Zona de la foto del hero alineada a escala fluida */
    .p5-photo-zone { transform: scale(1.15); transform-origin: center center; }
    @media (max-width: 1280px) { .p5-photo-zone { transform: scale(1.05); } }
    @media (max-width: 1080px) { .p5-photo-zone { transform: scale(1.0); } }
    @media (max-width: 900px)  { .p5-photo-zone { transform: scale(0.98); } }

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
    /* burbuja cómic ovalada (izquierda) elástica auto-ajustable con flechita */
    .p5-speech-bubble {
      position: absolute !important;
      bottom: 90px !important; left: -140px !important; z-index: 99 !important;
      min-width: 190px !important; max-width: 250px !important; width: max-content !important;
      background: #ffffff !important; color: #000000 !important;
      border: 4px solid #000000 !important; border-radius: 50% / 45% !important;
      padding: 22px 28px !important; box-shadow: 6px 6px 0 #000000 !important;
      transform: rotate(-4deg) !important; text-align: center !important;
      pointer-events: none !important; overflow: visible !important;
      transition: opacity 0.4s ease, transform 0.4s ease !important;
    }
    .p5-bubble-arrow {
      right: -36px !important;
      bottom: 12px !important;
      top: auto !important;
      transform: none !important;
    }

    /* notepad pergamino largo (derecha) */
    .p5-notepad {
      position: absolute !important;
      top: 80px !important; right: -120px !important; z-index: 99 !important;
      width: 190px !important; background: #ffffff !important; color: #000000 !important;
      border: 3.5px solid #000000 !important; border-radius: 3px !important;
      padding: 14px 16px !important; box-shadow: 6px 6px 0 #000000 !important;
      transform: rotate(4deg) !important; pointer-events: none !important;
      transition: opacity 0.4s ease, transform 0.4s ease !important;
    }

    /* Reglas responsive para maquetación del Hero en móviles */
    @media (max-width: 1080px) {\n      .p5-speech-bubble { left: -40px !important; bottom: 30px !important; transform: rotate(-4deg) scale(0.85) !important; }\n      .p5-notepad { right: -30px !important; top: 110px !important; transform: rotate(4deg) scale(0.85) !important; }\n    }\n    @media (max-width: 900px) {\n      .hero-image-wrapper {\n        padding-top: 0 !important;\n        margin-top: -120px !important;\n      }\n      section#inicio {\n        min-height: auto !important;\n        padding-top: 0 !important;\n        padding-bottom: 20px !important;\n      }\n      section#inicio > div {\n        flex-direction: column !important;\n        align-items: center !important;\n        padding: 10px 14px 20px 14px !important;\n        gap: 12px !important;\n      }\n      section#inicio div[style*=\"flex: 1 1 650px\"] {\n        max-width: 100% !important;\n        padding-top: 0 !important;\n        margin-bottom: 0 !important;\n      }\n      section#inicio h1, section#inicio p {\n        margin-bottom: 8px !important;\n      }\n    }\n    @media (max-width: 768px) {\n      .p5-photo-zone {\n        width: 100% !important;\n        max-width: 310px !important;\n        margin: 0 auto 0 45px !important;\n        transform: scale(0.88) !important;\n        transform-origin: center top !important;\n      }\n      .p5-frame {\n        margin: 0 auto !important;\n      }\n      .p5-tag2 {\n        right: -8px !important; left: auto !important;\n        top: -16px !important; font-size: 14px !important;\n        padding: 9px 16px !important; z-index: 140 !important;\n        box-shadow: 4px 4px 0 #000 !important;\n        background: #f3efe6 !important; color: #000 !important;\n      }\n      .p5-notepad {\n        right: -145px !important; top: 75px !important;\n        background: #ffffff !important; opacity: 1 !important;\n        transform: rotate(4deg) scale(0.82) !important;\n        z-index: 130 !important; transform-origin: right top !important;\n        box-shadow: 5px 5px 0 #000000 !important;\n      }\n      .p5-speech-bubble {\n        left: -35px !important; bottom: -32px !important;\n        background: #ffffff !important; opacity: 1 !important;\n        transform: rotate(-3deg) scale(0.80) !important; z-index: 135 !important;\n        box-shadow: 5px 5px 0 #000000 !important;\n      }\n      .p5-bubble-arrow {\n        top: -28px !important; bottom: auto !important;\n        right: 28px !important; left: auto !important;\n        transform: rotate(-90deg) scaleY(-1) !important;\n      }\n    }\n    @media (max-width: 480px) {\n      .p5-photo-zone {\n        max-width: 290px !important;\n        margin: 0 auto -10px 40px !important;\n        transform: scale(0.84) !important;\n      }\n      .p5-tag2 {\n        right: -6px !important; left: auto !important;\n        top: -14px !important; font-size: 13.5px !important;\n        padding: 8px 14px !important; z-index: 140 !important;\n      }\n      .p5-notepad {\n        right: -135px !important; top: 80px !important;\n        background: #ffffff !important; opacity: 1 !important;\n        transform: rotate(4deg) scale(0.78) !important; z-index: 130 !important;\n      }\n      .p5-speech-bubble {\n        left: -30px !important; bottom: -35px !important;\n        background: #ffffff !important; opacity: 1 !important;\n        transform: rotate(-3deg) scale(0.76) !important; z-index: 135 !important;\n      }\n    }\n    .p5-badge-tyh {\n      position: absolute; bottom: 12px; left: -2px; z-index: 6;\n      background: #000; color: #fff;\n      font-family: 'Anton','Impact',sans-serif; font-size: 19px;\n      text-transform: uppercase; line-height: .95;\n      padding: 14px 18px;\n      transform: rotate(-5deg) skewX(-6deg);\n      box-shadow: 6px 6px 0 ${RED};\n      pointer-events: none;\n    }\n    @media (max-width: 768px) {\n      .p5-badge-tyh {\n        bottom: -22px !important;\n        left: -12px !important;\n        transform: rotate(-5deg) scale(0.72) !important;\n        z-index: 5 !important;\n      }\n    }\n    .p5-badge-tyh i { color: ${RED}; font-style: normal; }\n    /* destellos P5 (sparkle de 4 puntas) con parpadeo animado */\n    .p5-star-deco {\n      position: absolute; z-index: 1; pointer-events: none;\n      clip-path: polygon(50% 0, 62% 38%, 100% 50%, 62% 62%, 50% 100%, 38% 62%, 0 50%, 38% 38%);\n      animation: p5Twinkle 3.2s ease-in-out infinite;\n    }\n    @keyframes p5Twinkle {\n      0%, 100% { transform: scale(1) rotate(0deg); }\n      50%      { transform: scale(1.3) rotate(22deg); }\n    }\n    .p5-star-s1 { width: 62px; height: 62px; top: 60px; left: -8px; background: ${RED}; }\n    .p5-star-s2 { width: 30px; height: 30px; bottom: 96px; right: 2px; background: ${PAPER}; opacity: .9;\n      animation-delay: 1.4s; animation-duration: 4.2s; }\n\n    /* ────────── ESTRELLAS ACOMPAÑANTES (siguen el scroll) ────────── */\n    .p5-companion {\n      position: fixed; z-index: 640; pointer-events: none;\n      will-change: transform;\n    }\n    .p5-companion .shape {\n      display: block; width: 100%; height: 100%;\n      background: ${RED};\n      clip-path: polygon(50% 0,61% 35%,98% 35%,68% 57%,79% 91%,50% 70%,21% 91%,32% 57%,2% 35%,39% 35%);\n      animation: p5CompSpin 16s linear infinite;\n      filter: drop-shadow(3px 3px 0 rgba(0,0,0,.5));\n    }\n    #p5-comp-2 .shape {\n      clip-path: polygon(50% 0, 62% 38%, 100% 50%, 62% 62%, 50% 100%, 38% 62%, 0 50%, 38% 38%);\n      animation-duration: 9s; animation-direction: reverse;\n    }\n    @keyframes p5CompSpin { to { transform: rotate(360deg); } }\n    #p5-comp-1 { width: 44px; height: 44px; top: 22vh; left: 3vw;  opacity: .48; }\n    #p5-comp-2 { width: 26px; height: 26px; top: 64vh; right: 3.5vw; opacity: .38; }\n    @media (max-width: 768px) {\n      #p5-comp-1 { width: 30px; height: 30px; opacity: .3; }\n      #p5-comp-2 { display: none; }\n    }\n\n    /* ────────── REVEAL ON SCROLL (con rebote) ──────────\n       cubic-bezier(.34,1.7,.5,1) = overshoot: el elemento pasa un\n       poco de largo y rebota a su lugar, estilo menú de Persona 5 */\n    .p5-rv {\n      opacity: 0 !important;\n      transform: translateY(52px) scale(.88) skewX(-3deg) !important;\n      animation: none !important;\n      transition: opacity .5s cubic-bezier(.2,.8,.3,1), transform .8s cubic-bezier(.34,1.7,.5,1) !important;\n    }\n    .p5-rv-l {\n      opacity: 0 !important;\n      transform: translateX(-90px) scale(.94) skewX(-5deg) !important;\n      animation: none !important;\n      transition: opacity .5s cubic-bezier(.2,.8,.3,1), transform .85s cubic-bezier(.34,1.65,.5,1) !important;\n    }\n    .p5-rv-r {\n      opacity: 0 !important;\n      transform: translateX(90px) scale(.94) skewX(5deg) !important;\n      animation: none !important;\n      transition: opacity .5s cubic-bezier(.2,.8,.3,1), transform .85s cubic-bezier(.34,1.65,.5,1) !important;\n    }\n    .p5-in {\n      opacity: 1 !important;\n      transform: none !important;\n    }\n\n    /* ────────── SECCIÓN ÚNETE (P5) ────────── */\n    #unete { background: #0a0a0a; position: relative; overflow: hidden; }\n    #unete .up5-grid { display: grid; grid-template-columns: 1fr 1fr; min-height: 560px; }\n    #unete .up5-photo { position: relative; overflow: hidden; }\n    #unete .up5-photo img {\n      position: absolute; inset: 0; width: 100%; height: 100%;\n      object-fit: cover; display: block;\n      filter: grayscale(1) contrast(1.25) brightness(.85);\n    }\n    #unete .up5-photo::after {\n      content: ''; position: absolute; inset: 0;\n      background: linear-gradient(120deg, rgba(230,0,19,.55), rgba(10,10,10,.2) 60%);\n      mix-blend-mode: multiply;\n    }\n    #unete .up5-half {\n      position: absolute; inset: 0; z-index: 2; pointer-events: none;\n      background-image: radial-gradient(circle, rgba(255,255,255,.9) 1px, transparent 1.5px);\n      background-size: 8px 8px; opacity: .14;\n    }\n    #unete .up5-clip {\n      position: absolute; inset: 0; z-index: 3; pointer-events: none;\n      background: #0a0a0a;\n      clip-path: polygon(78% 0, 100% 0, 100% 100%, 92% 100%);\n    }\n    #unete .up5-copy {\n      padding: 90px 64px; position: relative;\n      display: flex; flex-direction: column; justify-content: center;\n      align-items: flex-start;\n    }\n    #unete .up5-copy .p5-star-deco { width: 56px; height: 56px; top: 44px; right: 52px; background: ${RED}; opacity: .9; }\n    #unete .up5-eyebrow {\n      display: block; width: 100%;\n      background: ${RED}; color: #fff;\n      font-family: 'Oswald', sans-serif; font-weight: 700; font-size: 13px;\n      letter-spacing: 4px; text-transform: uppercase;\n      padding: 9px 16px 9px 14px;\n      transform: skewX(-8deg);\n      box-shadow: 5px 5px 0 #000;\n      margin-bottom: 30px;\n    }\n    #unete .up5-eyebrow > span { display: inline-flex; align-items: center; gap: 10px; transform: skewX(8deg); }\n    #unete .up5-eyebrow .tri { width: 0; height: 0; border-left: 8px solid #fff; border-top: 5px solid transparent; border-bottom: 5px solid transparent; display: inline-block; }\n    #unete h2.up5-title {\n      font-family: 'Anton','Impact',sans-serif; font-weight: 400;\n      text-transform: uppercase;\n      font-size: clamp(42px, 5.2vw, 78px); line-height: .9;\n      color: #fff; margin: 0 0 8px;\n    }\n    #unete h2.up5-title .red { color: ${RED}; font-style: italic; }\n    #unete .up5-copy p {\n      font-family: 'Barlow Semi Condensed','DM Sans',sans-serif;\n      font-size: 19px; font-weight: 500; color: #c9c3b5;\n      max-width: 46ch; margin: 16px 0 30px; line-height: 1.55;\n    }\n    #unete .up5-perks { display: flex; flex-wrap: wrap; gap: 12px; margin-bottom: 38px; }\n    #unete .up5-perk {\n      font-family: 'Oswald', sans-serif; font-weight: 600;\n      text-transform: uppercase; letter-spacing: 1px; font-size: 13px;\n      color: #fff; border: 2px solid #3a3a3a; padding: 9px 15px;\n      transform: skewX(-8deg); transition: border-color .2s;\n    }\n    #unete .up5-perk:hover { border-color: ${RED}; }\n    #unete .up5-perk > span { display: inline-block; transform: skewX(8deg); }\n    #unete .up5-perk i { color: ${RED}; font-style: normal; margin-right: 7px; }\n    #unete .up5-btn {\n      display: inline-block; text-decoration: none;\n      background: ${RED}; color: #fff;\n      font-family: 'Oswald', sans-serif; font-weight: 700; font-size: 17px;\n      letter-spacing: 2px; text-transform: uppercase;\n      padding: 18px 38px;\n      transform: skewX(-10deg);\n      box-shadow: 6px 6px 0 #000;\n      transition: transform .12s, box-shadow .12s;\n    }\n    #unete .up5-btn:hover {\n      transform: skewX(-10deg) translate(-2px,-2px);\n      box-shadow: 9px 9px 0 #000;\n    }\n    #unete .up5-btn > span { display: inline-block; transform: skewX(10deg); }\n\n    @media (max-width: 900px) {\n      #unete .up5-grid { grid-template-columns: 1fr; }\n      #unete .up5-photo { min-height: 340px; position: relative; }\n      #unete .up5-photo img { position: absolute; }\n      #unete .up5-clip { clip-path: polygon(0 82%, 100% 96%, 100% 100%, 0 100%); }\n      #unete .up5-copy { padding: 56px 24px 70px; }\n      #unete .up5-copy .p5-star-deco { top: 24px; right: 22px; width: 40px; height: 40px; }\n    }\n  `;\n\n  function injectCSS() {\n    if (document.getElementById('p5-sections-style')) return;\n    var s = document.createElement('style');\n    s.id = 'p5-sections-style';\n    s.textContent = CSS;\n    document.head.appendChild(s);\n  }\n\n  /* ═══════════════════════════════════════════════════════════════\n     1. HERO — marco polaroid + decoraciones + stats\n  ═══════════════════════════════════════════════════════════════ */\n  function styleHero() {\n    var sec = document.querySelector('section#inicio');\n    if (!sec) return false;\n\n    /* encontrar la foto principal (no avatares) */\n    var mainImg = null;\n    var imgs = sec.querySelectorAll('img');\n    for (var i = 0; i < imgs.length; i++) {\n      var alt = (imgs[i].getAttribute('alt') || '').toLowerCase();\n      if (alt === 'avatar') continue;\n      var r = imgs[i].getBoundingClientRect();\n      if (r.width > 150 && r.height > 150) { mainImg = imgs[i]; break; }\n    }\n    if (!mainImg) return false;\n\n    var mainCard  = mainImg.parentElement;          // tarjeta con rotate(-4deg)\n    var container = mainCard.parentElement;         // contenedor flex 400×500\n    if (container.dataset.p5hero === '1') return true;\n    container.dataset.p5hero = '1';\n\n    /* marco P5 + zona agrandada 45% */\n    mainCard.classList.add('p5-frame');\n    container.classList.add('p5-photo-zone');\n\n    /* ocultar las \"hojas\" rojas apiladas detrás (diseño anterior) */\n    Array.prototype.forEach.call(container.children, function (ch) {\n      if (ch === mainCard || ch.classList.contains('p5-speech-bubble') || ch.classList.contains('p5-notepad')) return;\n      var st = ch.getAttribute('style') || '';\n      if (st.indexOf('position: absolute') >= 0 && st.indexOf('border-radius') >= 0) {\n        ch.classList.add('p5-hero-hidden');\n      }\n    });\n\n    /* halftone rojo sobre la foto */\n    var dots = document.createElement('div');\n    dots.className = 'p5-frame-dots';\n    mainCard.appendChild(dots);\n\n    /* decoraciones alrededor del marco */\n    var tag = document.createElement('div');\n    tag.className = 'p5-tag2';\n    tag.textContent = '// Talento Real';\n\n    var badge = document.createElement('div');\n    badge.className = 'p5-badge-tyh';\n    badge.innerHTML = 'TAKE<br>YOUR <i>HEART</i>';\n\n    var s1 = document.createElement('div');\n    s1.className = 'p5-star-deco p5-star-s1';\n    var s2 = document.createElement('div');\n    s2.className = 'p5-star-deco p5-star-s2';\n\n    /* estrellas detrás del marco, etiquetas por encima */\n    container.insertBefore(s1, mainCard);\n    container.insertBefore(s2, mainCard);\n    container.appendChild(tag);\n    container.appendChild(badge);\n\n    /* stats \"10+ / 24/7 / ∞\" → Anton rojo */\n    var nodes = sec.querySelectorAll('div, span');\n    Array.prototype.forEach.call(nodes, function (el) {\n      if (el.childElementCount > 1) return;\n      var txt = (el.textContent || '').trim();\n      if (!txt || txt.length > 6) return;\n      if (!/[0-9∞]/.test(txt)) return;\n      var fs = parseFloat(getComputedStyle(el).fontSize);\n      if (fs >= 26 && fs <= 64) {\n        el.classList.add('p5-hstat');\n        /* la etiqueta pequeña que acompaña al número */\n        var sib = el.nextElementSibling;\n        if (sib && (sib.textContent || '').trim().length > 4) {\n          sib.classList.add('p5-hstat-label');\n        }\n      }\n    });\n\n    return true;\n  }\n\n  /* ═══════════════════════════════════════════════════════════════\n     2. SECCIÓN ÚNETE — split foto duotono + copy P5\n  ═══════════════════════════════════════════════════════════════ */\n  function buildUnete() {\n    return true; // Disabled duplicate P5 layout replacement to allow React CV Form to display\n    var old = document.getElementById('unete');\n    if (!old || old.dataset.p5built === '1') return !!document.querySelector('#unete .up5-grid');\n    if (old.querySelector('.up5-grid')) return true;\n\n    /* recuperar la imagen de fondo del CTA original */\n    var oldImg = old.querySelector('img');\n    var photoSrc = oldImg ? oldImg.src :\n      'https://images.unsplash.com/photo-1521737711867-e3b97375f902?w=1600&q=80&fit=crop&crop=center';\n\n    /* ocultar el original y ceder el ancla #unete a la nueva sección */\n    old.dataset.p5built = '1';\n    old.id = 'unete-legacy';\n    old.style.display = 'none';\n\n    var sec = document.createElement('section');\n    sec.id = 'unete';\n    sec.innerHTML = `\n      <div class=\"up5-grid\">\n        <div class=\"up5-photo p5-rv-l\">\n          <img src=\"${photoSrc}\" alt=\"Equipo DreamTeam trabajando\">\n          <div class=\"up5-half\"></div>\n          <div class=\"up5-clip\"></div>\n        </div>\n        <div class=\"up5-copy\">\n          <div class=\"p5-star-deco\"></div>\n          <div class=\"up5-eyebrow p5-rv\"><span><span class=\"tri\"></span>Únete al Equipo</span></div>\n          <h2 class=\"up5-title p5-rv\">¿Buscas crecer <span class=\"red\">de verdad?</span></h2>\n          <p class=\"p5-rv\">En DreamTeam no fichamos empleados: incorporamos talento que quiere marcar la diferencia. Si tienes hambre de crecer, este es tu sitio.</p>\n          <div class=\"up5-perks p5-rv\">\n            <div class=\"up5-perk\"><span><i>↑</i>Crecimiento profesional</span></div>\n            <div class=\"up5-perk\"><span><i>◈</i>Equipo diverso</span></div>\n            <div class=\"up5-perk\"><span><i>✦</i>Beneficios competitivos</span></div>\n          </div>\n          <a class=\"up5-btn p5-rv\" href=\"https://forms.gle/9AWQbTY2SBmc3Yg77\" target=\"_blank\" rel=\"noopener\"><span>Quiero unirme →</span></a>\n        </div>\n      </div>`;\n\n    old.parentNode.insertBefore(sec, old);\n\n    /* stagger para los elementos del copy */\n    var rvs = sec.querySelectorAll('.p5-rv');\n    Array.prototype.forEach.call(rvs, function (el, i) {\n      el.style.transitionDelay = (i * 0.1) + 's';\n    });\n\n    return true;\n  }\n\n  /* ═══════════════════════════════════════════════════════════════\n     3. REVEAL ON SCROLL\n  ═══════════════════════════════════════════════════════════════ */\n  var observer = null;\n\n  function getObserver() {\n    if (observer) return observer;\n    observer = new IntersectionObserver(function (entries) {\n      entries.forEach(function (en) {\n        if (en.isIntersecting) {\n          en.target.classList.add('p5-in');\n          observer.unobserve(en.target);\n        }\n      });\n    }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });\n    return observer;\n  }\n\n  /* Selectores de elementos que se animan al entrar en pantalla */\n  var RV_SELECTORS = [\n    /* Nosotros: tarjetas bento + encabezado */\n    'section#sobre-nosotros [style*=\"grid-column\"]',\n    /* Cómo trabajamos: pasos */\n    '[style*=\"grid-template-columns: repeat(4, 1fr)\"] > div',\n    /* Actividades */\n    '#actividades .act-eyebrow',\n    '#actividades .act-main-title',\n    '#actividades .act-subtitle',\n    '#actividades .act-filters',\n    '#actividades .p5-card',\n    /* Footer: columnas */\n    'footer [style*=\"grid-template-columns\"] > div',\n  ];\n\n  function scanReveals() {\n    if (typeof IntersectionObserver === 'undefined') return;\n    var obs = getObserver();\n\n    RV_SELECTORS.forEach(function (sel) {\n      var els;\n      try { els = document.querySelectorAll(sel); } catch (e) { return; }\n      Array.prototype.forEach.call(els, function (el, i) {\n        if (el.dataset.p5rv === '1') return;\n        el.dataset.p5rv = '1';\n\n        /* si ya está visible en pantalla, no ocultarlo (evita parpadeo) */\n        var r = el.getBoundingClientRect();\n        var inView = r.top < window.innerHeight * 0.9 && r.bottom > 0;\n\n        if (!inView) {\n          el.classList.add('p5-rv');\n          el.style.transitionDelay = ((i % 6) * 0.08) + 's';\n          obs.observe(el);\n        }\n      });\n    });\n\n    /* elementos .p5-rv añadidos por buildUnete */\n    var manual = document.querySelectorAll('.p5-rv:not([data-p5rv]), .p5-rv-l:not([data-p5rv]), .p5-rv-r:not([data-p5rv])');\n    Array.prototype.forEach.call(manual, function (el) {\n      el.dataset.p5rv = '1';\n      obs.observe(el);\n    });\n  }\n\n  /* ═══════════════════════════════════════════════════════════════\n     4. ESTRELLAS ACOMPAÑANTES\n     Dos estrellas P5 fijas en pantalla que giran lentamente y\n     \"acompañan\" el scroll: se mueven con un retardo elástico\n     (lerp) y derivan en trayectorias suaves según cuánto bajas.\n  ═══════════════════════════════════════════════════════════════ */\n  function initCompanions() {\n    if (document.getElementById('p5-comp-1')) return;\n    try {\n      if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;\n    } catch (e) {}\n\n    function makeStar(id) {\n      var el = document.createElement('div');\n      el.className = 'p5-companion';\n      el.id = id;\n      var shape = document.createElement('span');\n      shape.className = 'shape';\n      el.appendChild(shape);\n      document.body.appendChild(el);\n      return el;\n    }\n    var c1 = makeStar('p5-comp-1');\n    var c2 = makeStar('p5-comp-2');\n\n    var cur = 0;   // scroll suavizado (persigue al scroll real con retardo)\n\n    function loop() {\n      var target = window.scrollY || document.documentElement.scrollTop || 0;\n      cur += (target - cur) * 0.06;          // lerp → efecto de arrastre elástico\n\n      /* trayectorias onduladas dependientes del scroll suavizado */\n      var x1 = Math.sin(cur * 0.0016) * 22;\n      var y1 = Math.sin(cur * 0.0024) * 30 + (target - cur) * 0.18;\n      var x2 = Math.sin(cur * 0.0012 + 2.1) * 26;\n      var y2 = Math.cos(cur * 0.0019) * 38 + (target - cur) * 0.26;\n      var rot = (cur * 0.04) % 360;\n\n      c1.style.transform = 'translate(' + x1.toFixed(1) + 'px,' + y1.toFixed(1) + 'px) rotate(' + rot.toFixed(1) + 'deg)';\n      c2.style.transform = 'translate(' + x2.toFixed(1) + 'px,' + y2.toFixed(1) + 'px) rotate(' + (-rot * 0.7).toFixed(1) + 'deg)';\n\n      requestAnimationFrame(loop);\n    }\n    requestAnimationFrame(loop);\n  }\n\n  /* ═══════════════════════════════════════════════════════════════\n     INIT — con reintentos para el contenido que React/otros scripts\n     renderizan tarde (hero, actividades)\n  ═══════════════════════════════════════════════════════════════ */\n  var attempts = 0;\n\n  function tick() {\n    var heroOk  = styleHero();\n    var uneteOk = buildUnete();\n    scanReveals();\n    /* re-escanear hasta que todo exista (máx ~12 s) */\n    if ((!heroOk || !uneteOk || attempts < 6) && attempts < 24) {\n      attempts++;\n      setTimeout(tick, 500);\n    }\n  }\n\n  function init() {\n    injectCSS();\n    initCompanions();\n    setTimeout(tick, 250);\n  }\n\n  if (document.readyState !== 'loading') {\n    init();\n  } else {\n    document.addEventListener('DOMContentLoaded', init);\n  }\n})();