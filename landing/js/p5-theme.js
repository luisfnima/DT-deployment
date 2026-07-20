/**
 * p5-theme.js — DreamTeam Persona 5 Visual Theme
 *
 * Transforma la landing en la estética de Persona 5:
 *   · Fondo oscuro + texto crema
 *   · Fuentes Anton (títulos) + Oswald (etiquetas/nav)
 *   · Elementos sesgados (skew), barras slash rojas, textura grain
 *   · Botones con sombra dura (hard box-shadow)
 *   · Etiquetas tipo "eyebrow" rojas y sesgadas
 *   · Superposición de grano y textura halftone
 *
 * Inyectado por bundler.js tras el render del template.
 */
(function () {
  'use strict';

  /* ═══════════════════════════════════════════════════════════════════════
     COLORES PERSONA 5
  ═══════════════════════════════════════════════════════════════════════ */
  var P5 = {
    red:      '#e60013',
    redDeep:  '#a3000d',
    ink:      '#0a0a0a',
    ink2:     '#141414',
    ink3:     '#1e1e1e',
    paper:    '#f3efe6',
    paper2:   '#e7e1d2',
    white:    '#ffffff',
  };

  /* ═══════════════════════════════════════════════════════════════════════
     1. GOOGLE FONTS (Anton + Oswald)
  ═══════════════════════════════════════════════════════════════════════ */
  function injectFonts() {
    if (document.getElementById('p5-fonts')) return;
    var link = document.createElement('link');
    link.id   = 'p5-fonts';
    link.rel  = 'stylesheet';
    link.href = 'https://fonts.googleapis.com/css2?family=Anton&family=Oswald:wght@400;500;600;700&display=swap';
    document.head.appendChild(link);
  }

  /* ═══════════════════════════════════════════════════════════════════════
     2. CSS PRINCIPAL
  ═══════════════════════════════════════════════════════════════════════ */
  var CSS = `
    /* ── Variables globales P5 ───────────────────────────────────────── */
    :root {
      --p5-red:   #e60013;
    }
    [data-theme="light"] {
      --p5-ink:   #F9FAFB;
      --p5-ink2:  #FFFFFF;
      --p5-paper: #111827;
      --p5-text-muted: #4B5563;
      --p5-text-muted-more: #6B7280;
      --p5-brand-brightness: 0.25;
    }
    [data-theme="dark"] {
      --p5-ink:   #0a0a0a;
      --p5-ink2:  #141414;
      --p5-paper: #f3efe6;
      --p5-text-muted: rgba(243,239,230,0.65);
      --p5-text-muted-more: rgba(243,239,230,0.5);
      --p5-brand-brightness: 1;
    }
    ::selection { background: var(--p5-red); color: #fff; }

    /* ── Fondo global oscuro ────────────────────────────────────────── */
    html, body { background: var(--p5-ink) !important; }
    #root > div { background: var(--p5-ink) !important; }

    /* ── Secciones principales → fondo oscuro ─────────────────────── */
    section#inicio           { background: var(--p5-ink) !important; }
    section#sobre-nosotros   { background: var(--p5-ink2) !important; }
    section#sobre-nosotros > div { background: transparent !important; }
    #como-trabajamos > section { background: #0f0f0f !important; }

    /* BrandsCarousel → fondo oscuro */
    div[style*="background: white"],
    div[style*="background: rgb(255, 255, 255)"],
    div[style*="background:white"] {
      background: var(--p5-ink2) !important;
      border-color: rgba(255,255,255,0.08) !important;
    }

    /* ── Texto global → crema ─────────────────────────────────────── */
    h1, h2, h3, h4, h5, h6 { color: var(--p5-paper) !important; }
    p  { color: var(--p5-text-muted) !important; }
    small, span[style*="opacity: 0.5"],
    span[style*="opacity: 0.4"],
    div[style*="opacity: 0.5"],
    div[style*="opacity: 0.4"]  { color: var(--p5-text-muted-more) !important; }

    /* ── Fuentes P5 ──────────────────────────────────────────────────
       Anton → H1 hero (impacto visual máximo)
       Oswald → etiquetas, nav, botones, contadores              */
    section#inicio h1 {
      font-family: 'Anton', 'Impact', sans-serif !important;
      font-weight: 400 !important;
      font-style: italic !important;
      letter-spacing: 1px !important;
      line-height: 0.92 !important;
      color: var(--p5-paper) !important;
    }
    section#inicio h1 span[style*="color: rgb(254"] {
      color: var(--p5-red) !important;
      font-style: normal !important;
    }

    /* ── NAV ─────────────────────────────────────────────────────────
       Header oscuro con línea roja inferior al hacer scroll        */
    nav {
      background: var(--bg-navbar) !important;
      border-bottom: 2px solid transparent !important;
      transition: border-color 0.3s !important;
    }
    nav[style*="border-bottom: 1px solid"] {
      border-bottom: 2px solid var(--p5-red) !important;
    }
    /* Logo en nav: Marco sesgado blanco (contraste sobre fondo oscuro) */
    nav img {
      background: #ffffff !important;
      padding: 4px 7px !important;
      transform: skewX(-8deg) !important;
      box-shadow: 3px 3px 0 #000 !important;
    }
    /* Pill → invisible; sólo links visibles */
    [data-comment-anchor="296348093c-div-73-7"] {
      background: transparent !important;
      border: none !important;
      box-shadow: none !important;
      backdrop-filter: none !important;
      gap: 0 !important;
    }
    [data-comment-anchor="296348093c-div-73-7"] a {
      font-family: 'Oswald', sans-serif !important;
      font-weight: 600 !important;
      text-transform: uppercase !important;
      letter-spacing: 1px !important;
      font-size: 14px !important;
      color: var(--p5-paper) !important;
      opacity: 0.75 !important;
      position: relative !important;
    }
    [data-comment-anchor="296348093c-div-73-7"] a::after {
      content: '' !important;
      position: absolute !important;
      left: 14px !important; right: 14px !important; bottom: 2px !important;
      height: 3px !important;
      background: var(--p5-red) !important;
      transform: scaleX(0) !important;
      transform-origin: left !important;
      transition: transform 0.18s !important;
    }
    [data-comment-anchor="296348093c-div-73-7"] a:hover::after {
      transform: scaleX(1) !important;
    }
    [data-comment-anchor="296348093c-div-73-7"] a:hover {
      background: transparent !important;
      opacity: 1 !important;
    }
    /* Botón CTA nav → skewed P5 */
    nav > div > div:last-child button {
      background: var(--p5-red) !important;
      border-radius: 0 !important;
      transform: skewX(-10deg) !important;
      box-shadow: 5px 5px 0 #000 !important;
      font-family: 'Oswald', sans-serif !important;
      font-weight: 700 !important;
      text-transform: uppercase !important;
      letter-spacing: 1.5px !important;
      transition: transform 0.12s, box-shadow 0.12s !important;
    }
    nav > div > div:last-child button:hover {
      transform: skewX(-10deg) translate(-2px,-2px) !important;
      box-shadow: 8px 8px 0 #000 !important;
    }
    nav > div > div:last-child button > * {
      transform: skewX(10deg) !important;
      display: inline-block !important;
    }
    nav > div > div:last-child a {
      color: rgba(243,239,230,0.55) !important;
    }

    /* ── HAMBURGER (responsive.js) → P5 style ──────────────────────── */
    #dt-ham-btn {
      background: var(--p5-red) !important;
      border: none !important;
      border-radius: 0 !important;
      transform: skewX(-8deg) !important;
      box-shadow: 3px 3px 0 #000 !important;
      color: #fff !important;
    }
    #dt-ham-btn.open { background: #000 !important; }
    #dt-mobile-drawer {
      background: rgba(10,10,10,0.97) !important;
      border-bottom: 3px solid var(--p5-red) !important;
    }
    #dt-mobile-drawer a { color: var(--p5-paper) !important; }
    #dt-mobile-drawer a.dt-drawer-cta {
      background: var(--p5-red) !important;
      border-radius: 0 !important;
      transform: skewX(-8deg) !important;
      box-shadow: 4px 4px 0 #000 !important;
    }

    /* ── HERO ────────────────────────────────────────────────────────── */
    /* Subtitle */
    section#inicio p { color: var(--p5-text-muted) !important; }
    /* Badge "Líderes en Televentas" */
    section#inicio .fade-up-1 > span { color: var(--p5-red) !important; }
    section#inicio .fade-up-1 {
      background: rgba(230,0,19,0.12) !important;
      border-color: rgba(230,0,19,0.35) !important;
    }
    /* Botón CTA primario → P5 skewed */
    section#inicio a[style*="background: rgb(254"] {
      background: var(--p5-red) !important;
      border-radius: 0 !important;
      transform: skewX(-10deg) !important;
      box-shadow: 6px 6px 0 #000 !important;
      font-family: 'Oswald', sans-serif !important;
      font-weight: 700 !important;
      text-transform: uppercase !important;
      letter-spacing: 1.5px !important;
      transition: transform 0.12s, box-shadow 0.12s !important;
      padding: 14px 28px !important;
    }
    section#inicio a[style*="background: rgb(254"]:hover {
      transform: skewX(-10deg) translate(-2px,-2px) !important;
      box-shadow: 9px 9px 0 #000 !important;
    }
    /* Botón WhatsApp (ghost) → P5 ghost */
    section#inicio a[style*="background: transparent"] {
      border: 2px solid rgba(243,239,230,0.3) !important;
      border-radius: 0 !important;
      transform: skewX(-10deg) !important;
      color: var(--p5-paper) !important;
      font-family: 'Oswald', sans-serif !important;
      font-weight: 700 !important;
      text-transform: uppercase !important;
      letter-spacing: 1.5px !important;
      transition: transform 0.12s, border-color 0.2s !important;
    }
    section#inicio a[style*="background: transparent"]:hover {
      border-color: var(--p5-red) !important;
      color: var(--p5-red) !important;
      transform: skewX(-10deg) translate(-2px,-2px) !important;
    }
    /* Contador Profesionales */
    section#inicio div[style*="fontFamily: 'Sora'"] {
      font-family: 'Anton', sans-serif !important;
      color: var(--p5-paper) !important;
      font-style: italic !important;
    }

    /* ── NOSOTROS (Bento) ─────────────────────────────────────────── */
    /* Tarjeta oscura (secondary) */
    section#sobre-nosotros [style*="background: rgb(76"] {
      background: var(--p5-ink2) !important;
      border: 1px solid rgba(230,0,19,0.2) !important;
    }
    section#sobre-nosotros [style*="background: rgb(76"] h2 {
      font-family: 'Anton', sans-serif !important;
      font-style: italic !important;
      color: var(--p5-paper) !important;
    }
    /* Tarjeta blanca */
    section#sobre-nosotros [style*="background: white"],
    section#sobre-nosotros [style*="background: rgb(255"] {
      background: var(--p5-ink2) !important;
      border: 1px solid var(--border-color) !important;
    }
    /* Keep white text in red (primary) cards */
    section#sobre-nosotros [style*="gridColumn: '8 / 11'"] p,
    section#sobre-nosotros [style*="grid-column: 8 / 11"] p,
    section#sobre-nosotros [style*="grid-column:8/11"] p,
    section#sobre-nosotros [style*="background: rgb(254"] p,
    section#sobre-nosotros [style*="background: #FE0002"] p,
    section#sobre-nosotros [style*="background: rgb(230"] p,
    section#sobre-nosotros [style*="background: #e60013"] p,
    section#sobre-nosotros [style*="background: var(--p5-red)"] p {
      color: #ffffff !important;
    }

    /* Números grandes en bento */
    section#sobre-nosotros [style*="fontFamily: 'Sora'"] {
      font-family: 'Anton', sans-serif !important;
      font-style: italic !important;
      color: var(--p5-paper) !important;
    }
    /* Etiqueta "Sobre Nosotros" → eyebrow P5 */
    section#sobre-nosotros > div > div:first-child > span:last-child {
      color: var(--p5-text-muted-more) !important;
    }

    /* ── CÓMO TRABAJAMOS ──────────────────────────────────────────── */
    /* Step title color in ComoTrabajamos grid */
    #como-trabajamos [style*="font-size: 22"] {
      color: var(--p5-paper) !important;
    }
    #como-trabajamos section { background: var(--p5-ink) !important; }
    #como-trabajamos h2 { font-family: 'Anton', sans-serif !important; font-style: italic !important; }
    #como-trabajamos [style*="background: rgba(255,255,255,0.04)"],
    #como-trabajamos [style*="background: rgba(255,255,255,0.07)"] {
      border: 1px solid rgba(230,0,19,0.15) !important;
    }
    [data-theme="light"] #como-trabajamos [style*="background: rgba(255,255,255,0.04)"],
    [data-theme="light"] #como-trabajamos [style*="background: rgba(255,255,255,0.07)"] {
      background: rgba(0,0,0,0.04) !important;
    }
    #como-trabajamos [style*="fontFamily: 'Sora'"] {
      font-family: 'Anton', sans-serif !important;
      font-style: italic !important;
      color: var(--p5-red) !important;
    }
    #como-trabajamos h3 { color: var(--p5-paper) !important; }

    /* ── BRANDS CAROUSEL ──────────────────────────────────────────── */
    /* El wrapper ya es blanco → override hecho arriba (background: white) */
    /* Texto de la sección → crema */
    div p[style*="textAlign: 'center'"] { color: var(--p5-text-muted-more) !important; }

    /* ── TICKER ───────────────────────────────────────────────────── */
    /* Ya es oscuro (secondary) — solo ajustar el color de texto */

    /* ── FOOTER ───────────────────────────────────────────────────── */
    footer { border-top: 3px solid var(--p5-red) !important; }
    footer h5 {
      font-family: 'Oswald', sans-serif !important;
      text-transform: uppercase !important;
      letter-spacing: 2px !important;
      color: var(--p5-paper) !important;
    }
    footer a { color: rgba(243,239,230,0.55) !important; transition: color 0.2s !important; }
    footer a:hover { color: var(--p5-red) !important; }
    footer p, footer small { color: var(--p5-text-muted-more) !important; }

    /* ── ACTIVITIES SECTION ────────────────────────────────────────
       activities.js ya trae su propio diseño P5 nativo — sin overrides */

    /* ── BADGES / EYEBROWS (etiquetas P5 con rojo sesgado) ─────────── */
    /* Contador animado de la sección "pros" */
    div[ref] { font-family: 'Anton', sans-serif !important; }

    /* ── GRAIN OVERLAY (textura de ruido cinematográfico) ─────────── */
    #p5-grain {
      position: fixed; inset: 0;
      pointer-events: none;
      z-index: 99998;
      opacity: 0.045;
      mix-blend-mode: overlay;
      background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E");
      background-size: 256px 256px;
    }

    /* ── SLASH BARS decorativas del hero ──────────────────────────── */
    #p5-slash-1, #p5-slash-2 {
      position: absolute;
      background: var(--p5-red);
      transform: skewY(-8deg);
      pointer-events: none;
      z-index: 0;
      opacity: 0.08;
    }
    #p5-slash-1 {
      top: -60px; left: -80px;
      width: 400px; height: 600px;
    }
    #p5-slash-2 {
      bottom: -40px; right: -60px;
      width: 300px; height: 400px;
      transform: skewY(10deg);
      opacity: 0.05;
    }

    /* ── HALFTONE DOT OVERLAY en secciones oscuras ─────────────────── */
    #p5-halftone {
      position: absolute; inset: 0;
      pointer-events: none;
      background-image: radial-gradient(circle, rgba(243,239,230,0.9) 1px, transparent 1.5px);
      background-size: 8px 8px;
      opacity: 0.05;
      z-index: 0;
    }

    /* ── BOTONES GLOBALES → P5 style ──────────────────────────────── */
    /* Cualquier botón con background primario (red) */
    [style*="background: rgb(254, 0, 2)"],
    [style*="background: #FE0002"],
    [style*="background: rgb(254,0,2)"] {
      background: var(--p5-red) !important;
      border-radius: 0 !important;
      box-shadow: 5px 5px 0 #000 !important;
    }

    /* ── ANIMACIONES ENTRADA ──────────────────────────────────────── */
    .fade-up { opacity: 1 !important; transform: none !important; }

    /* ── SCROLLBAR P5 ─────────────────────────────────────────────── */
    ::-webkit-scrollbar { width: 6px; }
    ::-webkit-scrollbar-track { background: var(--p5-ink); }
    ::-webkit-scrollbar-thumb { background: var(--p5-red); }
    ::-webkit-scrollbar-thumb:hover { background: var(--p5-red); opacity: 0.8; }

    /* Ensure all text inside Unete section stays white due to dark background image */
    #unete h2,
    #unete h3,
    #unete p,
    #unete span,
    #unete label,
    #unete .up5-eyebrow,
    #unete .up5-eyebrow span {
      color: #ffffff !important;
    }
    
  `;

  /* ═══════════════════════════════════════════════════════════════════════
     3. ELEMENTOS DOM DECORATIVOS
  ═══════════════════════════════════════════════════════════════════════ */
  function buildDecorativeDOM() {
    /* ── Grain overlay ── */
    if (!document.getElementById('p5-grain')) {
      var grain = document.createElement('div');
      grain.id = 'p5-grain';
      document.body.appendChild(grain);
    }

    /* ── Slash bars en el hero ── */
    var heroSection = document.querySelector('section#inicio');
    if (heroSection && heroSection.style.position !== 'relative') {
      heroSection.style.position = 'relative';
    }
    if (heroSection && !document.getElementById('p5-slash-1')) {
      var s1 = document.createElement('div'); s1.id = 'p5-slash-1';
      var s2 = document.createElement('div'); s2.id = 'p5-slash-2';
      heroSection.insertBefore(s1, heroSection.firstChild);
      heroSection.insertBefore(s2, heroSection.firstChild);
    }

    /* ── Halftone en sección Nosotros ── */
    var nosotros = document.querySelector('section#sobre-nosotros');
    if (nosotros && !nosotros.querySelector('#p5-halftone')) {
      var ht = document.createElement('div'); ht.id = 'p5-halftone';
      nosotros.insertBefore(ht, nosotros.firstChild);
    }

    /* ── Línea roja en el ticker (ya es dark, añadir acento) ── */
    var ticker = document.querySelector('[data-anim="ticker"]');
    if (ticker) {
      ticker.style.boxShadow = '0 0 0 2px ' + P5.red + ', 0 8px 32px rgba(0,0,0,0.4)';
    }

    /* ── Transformar etiquetas de sección → eyebrow P5 ── */
    applyEyebrowStyle();
  }

  /* ── Convertir etiquetas de sección al estilo eyebrow de P5 ─── */
  function applyEyebrowStyle() {
    var eyebrowTexts = ['Sobre Nosotros', 'Proceso', 'Nuestro Equipo', 'Actividades'];
    var spans = document.querySelectorAll('span');
    spans.forEach(function(span) {
      var txt = span.textContent.trim();
      if (!eyebrowTexts.some(function(t) { return txt.indexOf(t) >= 0; })) return;
      var computedStyle = window.getComputedStyle(span);
      if (computedStyle.letterSpacing && parseFloat(computedStyle.letterSpacing) > 2) {
        // Looks like a label — style it as P5 eyebrow
        Object.assign(span.style, {
          fontFamily: "'Oswald', sans-serif",
          fontWeight: '700',
          textTransform: 'uppercase',
          letterSpacing: '4px',
          fontSize: '13px',
          color: '#fff',
          background: P5.red,
          padding: '6px 14px 6px 12px',
          transform: 'skewX(-10deg)',
          boxShadow: '4px 4px 0 #000',
          display: 'inline-block',
        });
        // Reset parent dot decoration
        var parent = span.parentElement;
        if (parent) {
          var dot = parent.querySelector('div[style*="width: 8px"]');
          if (dot) dot.style.display = 'none';
        }
      }
    });
  }

  /* ═══════════════════════════════════════════════════════════════════════
     4. CSS INJECTION
  ═══════════════════════════════════════════════════════════════════════ */
  function injectCSS() {


    if (document.getElementById('p5-theme-style')) return;
    var s = document.createElement('style');
    s.id = 'p5-theme-style';
    s.textContent = CSS;
    document.head.appendChild(s);
  }

  /* ═══════════════════════════════════════════════════════════════════════
     5. INIT
  ═══════════════════════════════════════════════════════════════════════ */
  function init() {
    injectFonts();
    injectCSS();
    /* Esperar un tick para que React haya terminado el render */
    setTimeout(buildDecorativeDOM, 120);
    /* Segunda pasada para elementos que tardan más (lazy) */
    setTimeout(buildDecorativeDOM, 800);
  }

  if (document.readyState !== 'loading') {
    setTimeout(init, 60);
  } else {
    document.addEventListener('DOMContentLoaded', function () { setTimeout(init, 60); });
  }

})();
