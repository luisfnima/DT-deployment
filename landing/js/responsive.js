/**
 * responsive.js — DreamTeam Landing
 *
 * Adds full mobile responsiveness to the React landing page (which uses
 * only inline styles — no CSS classes). Strategy:
 *
 *   1. Inject a <style> tag with @media queries using !important to override
 *      React's inline styles (CSS !important always beats inline styles).
 *
 *   2. Build a hamburger button + slide-down drawer entirely outside React's
 *      DOM so React re-renders never destroy them.
 *
 * Breakpoints:
 *   ≤ 768 px → Mobile   (hamburger, single column, hero text only)
 *   ≤ 480 px → XS mobile (tighter spacing, smaller fonts)
 */
(function () {
  'use strict';

  /* ═══════════════════════════════════════════════════════════════════════════
     1. RESPONSIVE CSS
  ═══════════════════════════════════════════════════════════════════════════ */
  var CSS = [

    /* ── HAMBURGER + DRAWER (hidden on desktop) ────────────────────────── */
    '#dt-ham-btn {',
    '  display: none;',
    '}',
    '#dt-mobile-drawer {',
    '  display: none;',
    '}',

    '@media (max-width: 1024px) {',

    /* Prevent horizontal overflow on mobile */
    '  html, body {',
    '    max-width: 100vw !important;',
    '    overflow-x: hidden !important;',
    '  }',
    '  nav {',
    '    max-width: 100vw !important;',
    '    box-sizing: border-box !important;',
    '  }',
    '  nav > div {',
    '    max-width: 100% !important;',
    '    padding-left: 12px !important;',
    '    padding-right: 12px !important;',
    '    box-sizing: border-box !important;',
    '  }',
    /* Logo: slightly smaller */
    '  nav img { height: 32px !important; }',
    /* Hide the nav pill (links) */
    '  [data-comment-anchor="296348093c-div-73-7"] { display: none !important; }',
    /* Hide navbar theme icon on mobile (it is in the drawer) */
    '  nav > div > div:last-child > div:first-child { display: none !important; }',
    /* Show Colaboradores button before the hamburger button */
    '  nav > div > div:last-child {',
    '    display: flex !important;',
    '    align-items: center !important;',
    '    margin-right: 48px !important;',
    '  }',
    '  #colaboradores-btn {',
    '    padding: 6px 13px !important;',
    '    font-size: 11px !important;',
    '    letter-spacing: 0.5px !important;',
    '  }',

    /* ─── HAMBURGER BUTTON (visible on mobile) ──────────────────────────── */
    '  #dt-ham-btn {',
    '    display: flex !important;',
    '    position: fixed;',
    '    top: 11px; right: 12px;',
    '    z-index: 10002;',
    '    width: 36px; height: 36px;',
    '    align-items: center; justify-content: center;',
    '    background: rgba(255,255,255,0.92);',
    '    border: 1px solid rgba(0,0,0,0.1);',
    '    border-radius: 50%;',
    '    cursor: pointer;',
    '    box-shadow: 0 2px 10px rgba(0,0,0,0.1);',
    '    -webkit-backdrop-filter: blur(12px);',
    '    backdrop-filter: blur(12px);',
    '    transition: background 0.2s, color 0.2s, transform 0.2s;',
    '    color: #1a1a1a;',
    '    outline: none;',
    '    padding: 0;',
    '  }',
    '  #dt-ham-btn.open {',
    '    background: #1a1a1a !important;',
    '    color: white;',
    '  }',

    /* ─── MOBILE DRAWER ──────────────────────────────────────────────────── */
    '  #dt-mobile-drawer {',
    '    display: block !important;',
    '    position: fixed;',
    '    top: 0; left: 0; right: 0;',
    '    background: rgba(245,244,241,0.97);',
    '    -webkit-backdrop-filter: blur(20px);',
    '    backdrop-filter: blur(20px);',
    '    z-index: 10001;',
    '    padding: 76px 24px 32px;',
    '    border-bottom: 1px solid rgba(0,0,0,0.08);',
    '    transform: translateY(-110%);',
    '    transition: transform 0.4s cubic-bezier(0.34,1.56,0.64,1);',
    '    box-shadow: 0 8px 40px rgba(0,0,0,0.12);',
    '  }',
    '  #dt-mobile-drawer.dt-open { transform: translateY(0) !important; }',
    '  #dt-mobile-drawer a {',
    '    display: block;',
    '    padding: 16px 0;',
    '    font-family: "Oswald", "Sora", sans-serif !important;',
    '    font-size: 20px !important; font-weight: 700 !important;',
    '    color: #ffffff !important;',
    '    text-transform: uppercase !important;',
    '    letter-spacing: 1.5px !important;',
    '    text-decoration: none;',
    '    border-bottom: 1px solid rgba(255,255,255,0.12) !important;',
    '    opacity: 1 !important;',
    '    transition: color 0.2s, padding-left 0.2s;',
    '  }',
    '  #dt-mobile-drawer a:hover { color: #FE0002 !important; padding-left: 8px; }',
    '  #dt-mobile-drawer a.dt-drawer-cta {',
    '    display: inline-flex !important;',
    '    margin-top: 20px;',
    '    background: #FE0002;',
    '    color: white !important;',
    '    border-radius: 100px;',
    '    padding: 13px 28px !important;',
    '    font-size: 15px !important;',
    '    font-weight: 600 !important;',
    '    text-align: center;',
    '    border-bottom: none !important;',
    '    box-shadow: 0 6px 20px rgba(254,0,2,0.35);',
    '  }',
    '  #dt-mobile-drawer a.dt-drawer-cta:hover {',
    '    color: white !important;',
    '    padding-left: 28px !important;',
    '  }',

    /* ─── HERO ───────────────────────────────────────────────────────────── */
    /* Stack the flex row into a column */
    '  section#inicio { min-height: unset !important; }',
    '  section#inicio > div {',
    '    flex-direction: column !important;',
    '    padding: 90px 20px 48px !important;',
    '    gap: 28px !important;',
    '    align-items: flex-start !important;',
    '  }',
    /* Left copy: remove top padding (hero outer already adds it) */
    '  section#inicio > div > div:nth-child(3) { padding-top: 0 !important; }',
    /* Headline */
    '  section#inicio h1 {',
    '    font-size: clamp(34px, 9vw, 52px) !important;',
    '    letter-spacing: -1px !important;',
    '    margin-bottom: 16px !important;',
    '    line-height: 1.06 !important;',
    '  }',
    /* Hide the rotating arrow button inside H1 on tiny screens */
    '  @media (max-width: 380px) {',
    '    section#inicio h1 span span { display: none !important; }',
    '  }',
    /* Subtitle */
    '  section#inicio p {',
    '    font-size: 15px !important;',
    '    max-width: 100% !important;',
    '    margin-bottom: 24px !important;',
    '  }',
    /* Avatar circles: stay but slightly smaller */
    '  section#inicio img[alt="avatar"] {',
    '    width: 42px !important; height: 42px !important;',
    '    margin-left: -14px !important;',
    '  }',
    '  section#inicio img[alt="avatar"]:first-child { margin-left: 0 !important; }',
    /* CTA buttons: wrap nicely */
    '  section#inicio .fade-up-5 { flex-wrap: wrap !important; gap: 10px !important; }',
    /* Keep Hero image container visible & center it below text on mobile */
    '  section#inicio > div > div:nth-child(4) {',
    '    display: flex !important;',
    '    width: 100% !important;',
    '    max-width: 100% !important;',
    '    height: auto !important;',
    '    padding-top: 10px !important;',
    '    justify-content: center !important;',
    '    align-items: center !important;',
    '    align-self: center !important;',
    '    overflow: hidden !important;',
    '  }',
    '  .hero-image-wrapper, .p5-photo-zone {',
    '    max-width: 100% !important;',
    '    box-sizing: border-box !important;',
    '  }',
    '  #p5-slash-1, #p5-slash-2 {',
    '    display: none !important;',
    '  }',
    '  .p5-notepad {',
    '    right: -10px !important;',
    '    max-width: 160px !important;',
    '  }',

    /* ─── NOSOTROS BENTO GRID ────────────────────────────────────────────── */
    /* Change the 12-column CSS grid to a single column flex */
    '  section#sobre-nosotros [style*="grid-template-columns"] {',
    '    display: flex !important;',
    '    flex-direction: column !important;',
    '    gap: 12px !important;',
    '  }',
    /* Each bento card: full width, reduced padding & border-radius */
    '  section#sobre-nosotros [style*="grid-column"] {',
    '    border-radius: 20px !important;',
    '    min-height: unset !important;',
    '    padding: 32px 28px !important;',
    '  }',
    /* Stats row inside cards: allow wrapping */
    '  section#sobre-nosotros [style*="justify-content: space-between"] {',
    '    flex-wrap: wrap !important;',
    '    gap: 16px !important;',
    '  }',

    /* ─── CÓMO TRABAJAMOS (process steps) ───────────────────────────────── */
    /* Stack 4-column steps grid into single column */
    '  [style*="grid-template-columns: repeat(4, 1fr)"] {',
    '    grid-template-columns: 1fr !important;',
    '  }',
    /* Reduce step card padding */
    '  [style*="grid-template-columns: repeat(4, 1fr)"] > div {',
    '    padding: 32px 28px 28px !important;',
    '  }',
    /* Process header row: wrap title + description vertically */
    '  [id="como-trabajamos"] [style*="justify-content: space-between"] {',
    '    flex-direction: column !important;',
    '    align-items: flex-start !important;',
    '    gap: 16px !important;',
    '    margin-bottom: 40px !important;',
    '  }',
    '  [id="como-trabajamos"] p { max-width: 100% !important; }',

    /* ─── BRANDS CAROUSEL ────────────────────────────────────────────────── */
    /* Reduce brand tile size */
    '  [style*="width: 300px"][style*="height: 300px"] {',
    '    width: 160px !important;',
    '    height: 160px !important;',
    '    padding: 0 20px !important;',
    '  }',
    '  [style*="width: 300px"][style*="height: 300px"] img {',
    '    height: 56px !important;',
    '  }',

    /* ─── FOOTER ─────────────────────────────────────────────────────────── */
    /* Main 3-column grid → single column */
    '  footer [style*="grid-template-columns: 1.4fr"] {',
    '    grid-template-columns: 1fr !important;',
    '    gap: 36px !important;',
    '    margin-bottom: 40px !important;',
    '  }',
    /* Bottom bar: stack links + copyright vertically */
    '  footer [style*="justify-content: space-between"] {',
    '    flex-direction: column !important;',
    '    align-items: flex-start !important;',
    '    gap: 16px !important;',
    '  }',
    /* Footer nav links: wrap */
    '  footer [style*="justify-content: space-between"] > div {',
    '    flex-wrap: wrap !important;',
    '    gap: 12px !important;',
    '  }',
    /* Footer logo */
    '  footer img { height: 40px !important; }',

    /* ─── TICKER ─────────────────────────────────────────────────────────── */
    /* Reduce rotation on mobile */
    '  [data-anim="ticker"] { transform: rotate(-1.5deg) scaleX(1.02) !important; }',

    /* ─── ACTIVITIES SECTION ─────────────────────────────────────────────── */
    /* activities.js has its own responsive CSS, these just guard the wrapper */
    '  #actividades { overflow-x: hidden !important; }',

    '}', /* end @media 768px */

    /* ═══════ XS: extra small phones (≤ 480px) ═══════════════════════════ */
    '@media (max-width: 480px) {',
    '  section#inicio h1 {',
    '    font-size: clamp(30px, 10vw, 42px) !important;',
    '    letter-spacing: -0.5px !important;',
    '  }',
    '  section#inicio > div {',
    '    padding-left: 16px !important;',
    '    padding-right: 16px !important;',
    '  }',
    '  section#sobre-nosotros [style*="grid-column"] {',
    '    padding: 28px 22px !important;',
    '  }',
    '  section#sobre-nosotros h2 {',
    '    font-size: clamp(24px, 7vw, 36px) !important;',
    '  }',
    '  [style*="grid-template-columns: repeat(4, 1fr)"] > div {',
    '    padding: 28px 22px 24px !important;',
    '  }',
    '}',

  ].join('\n');

  /* ═══════════════════════════════════════════════════════════════════════════
     2. HAMBURGER MENU
  ═══════════════════════════════════════════════════════════════════════════ */
  var ICON_OPEN = '<svg width="20" height="20" viewBox="0 0 20 20" fill="none"><path d="M3 6h14M3 10h14M3 14h14" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>';
  var ICON_CLOSE = '<svg width="20" height="20" viewBox="0 0 20 20" fill="none"><path d="M5 5l10 10M15 5L5 15" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>';

  var NAV_LINKS = [
    { label: 'Inicio',          href: '#inicio' },
    { label: 'Sobre Nosotros',  href: '#sobre-nosotros' },
    { label: 'Proceso',         href: '#como-trabajamos' },
    { label: 'Actividades',     href: '#actividades' },
    { label: 'Únete al Equipo', href: '#unete' },
    { label: 'Colaboradores 🔒', href: '#colaboradores', isColab: true },
  ];

  function buildHamburger() {
    if (document.getElementById('dt-ham-btn')) return;

    /* ── Button ── */
    var btn = document.createElement('button');
    btn.id = 'dt-ham-btn';
    btn.setAttribute('aria-label', 'Abrir menú');
    btn.innerHTML = ICON_OPEN;

    /* ── Drawer ── */
    var drawer = document.createElement('nav');
    drawer.id = 'dt-mobile-drawer';
    drawer.setAttribute('aria-hidden', 'true');

    NAV_LINKS.forEach(function (l) {
      var a = document.createElement('a');
      a.href = l.href;
      a.textContent = l.label;
      if (l.isColab) {
        a.id = 'dt-drawer-colab-btn';
        a.style.cssText = 'color: #fe0002 !important; font-weight: 800 !important; letter-spacing: 2px !important;';
      }
      a.addEventListener('click', function (e) {
        closeDrawer();
        if (l.isColab) {
          e.preventDefault();
          var colabBtn = document.getElementById('colaboradores-btn');
          if (colabBtn) {
            colabBtn.click();
          } else {
            window.location.href = 'colaboradores.html';
          }
        }
      });
      drawer.appendChild(a);
    });

    /* Contenedor de acciones (Tema + Colaboradores) */
    var actionsRow = document.createElement('div');
    actionsRow.style.cssText = 'display: flex; align-items: center; justify-content: space-between; gap: 12px; margin-top: 24px; padding-top: 16px; border-top: 1px solid rgba(255,255,255,0.1);';

    /* Botón cambiar tema */
    var themeBtn = document.createElement('button');
    themeBtn.id = 'dt-mobile-theme-btn';
    themeBtn.style.cssText = 'background: rgba(255,255,255,0.1); border: 1px solid rgba(255,255,255,0.2); color: #fff; padding: 10px 16px; font-family: "Oswald", sans-serif; font-size: 14px; text-transform: uppercase; letter-spacing: 1px; cursor: pointer; display: flex; align-items: center; gap: 8px; transform: skewX(-8deg); box-shadow: 3px 3px 0 #000;';
    
    function updateThemeBtnText() {
      var isDark = document.documentElement.getAttribute('data-theme') === 'dark';
      themeBtn.innerHTML = isDark ? '<span>☀️ Modo Claro</span>' : '<span>🌙 Modo Oscuro</span>';
    }
    updateThemeBtnText();

    themeBtn.addEventListener('click', function () {
      var current = document.documentElement.getAttribute('data-theme') || 'dark';
      var next = current === 'dark' ? 'light' : 'dark';
      document.documentElement.setAttribute('data-theme', next);
      localStorage.setItem('theme', next);
      updateThemeBtnText();
    });

    /* CTA "Únete" */
    var cta = document.createElement('a');
    cta.href = 'https://forms.gle/9AWQbTY2SBmc3Yg77';
    cta.target = '_blank';
    cta.rel = 'noopener';
    cta.textContent = 'Únete al Equipo →';
    cta.className = 'dt-drawer-cta';
    cta.addEventListener('click', closeDrawer);

    actionsRow.appendChild(themeBtn);
    actionsRow.appendChild(cta);
    drawer.appendChild(actionsRow);

    /* ── State ── */
    var isOpen = false;

    function openDrawer() {
      isOpen = true;
      btn.classList.add('open');
      btn.innerHTML = ICON_CLOSE;
      btn.setAttribute('aria-label', 'Cerrar menú');
      drawer.classList.add('dt-open');
      drawer.setAttribute('aria-hidden', 'false');
      document.body.style.overflow = 'hidden'; /* prevent scroll while menu open */
    }

    function closeDrawer() {
      isOpen = false;
      btn.classList.remove('open');
      btn.innerHTML = ICON_OPEN;
      btn.setAttribute('aria-label', 'Abrir menú');
      drawer.classList.remove('dt-open');
      drawer.setAttribute('aria-hidden', 'true');
      document.body.style.overflow = '';
    }

    btn.addEventListener('click', function (e) {
      e.stopPropagation();
      isOpen ? closeDrawer() : openDrawer();
    });

    /* Close when clicking outside */
    document.addEventListener('click', function (e) {
      if (isOpen && !drawer.contains(e.target) && e.target !== btn) {
        closeDrawer();
      }
    });

    /* Close on Escape key */
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && isOpen) closeDrawer();
    });

    document.body.appendChild(btn);
    document.body.appendChild(drawer);
  }

  /* ═══════════════════════════════════════════════════════════════════════════
     3. CSS INJECTION
  ═══════════════════════════════════════════════════════════════════════════ */
  function injectCSS() {
    if (document.getElementById('dt-responsive')) return;
    var s = document.createElement('style');
    s.id = 'dt-responsive';
    s.textContent = CSS;
    document.head.appendChild(s);
  }

  /* ═══════════════════════════════════════════════════════════════════════════
     4. INIT — run after React has fully mounted
  ═══════════════════════════════════════════════════════════════════════════ */
  function init() {
    injectCSS();
    buildHamburger();
  }

  if (document.readyState !== 'loading') {
    setTimeout(init, 80);
  } else {
    document.addEventListener('DOMContentLoaded', function () { setTimeout(init, 80); });
  }

})();


