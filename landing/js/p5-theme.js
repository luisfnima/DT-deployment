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
    section#inicio {
      background: var(--p5-ink) !important;
      position: relative !important;
    }
    section#inicio::before {
      content: '';
      position: absolute;
      inset: 0;
      background-image: url('images/ctaBg.jpg');
      background-size: cover;
      background-position: center;
      opacity: 0.12;
      filter: grayscale(0.6) contrast(1.1);
      pointer-events: none;
      z-index: 0;
    }
    section#inicio > div {
      position: relative;
      z-index: 2;
    }
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
    [id="como-trabajamos"] div[style*="fontFamily: 'Sora'"] {
      color: var(--p5-paper) !important;
    }

    /* ────────── RESPONSIVE P5 OVERRIDES ────────── */
    @media (max-width: 768px) {
      section#inicio h1 {
        font-size: clamp(38px, 9vw, 56px) !important;
      }
    }
  `;

  function injectCSS() {
    if (document.getElementById('p5-theme-style')) return;
    var s = document.createElement('style');
    s.id = 'p5-theme-style';
    s.textContent = CSS;
    document.head.appendChild(s);
  }

  function init() {
    injectFonts();
    injectCSS();
  }

  if (document.readyState !== 'loading') {
    init();
  } else {
    document.addEventListener('DOMContentLoaded', init);
  }
})();
