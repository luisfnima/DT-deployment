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
    /* Etiqueta // TALENTO REAL */
    .p5-tag-tr {
      position: absolute; top: -20px; left: -16px; z-index: 3;
      background: #000000; color: ${PAPER};
      font-family: 'Oswald', sans-serif; font-size: 13px; font-weight: 700;
      letter-spacing: 2.5px; text-transform: uppercase;
      padding: 6px 14px; transform: rotate(-4.5deg);
      box-shadow: 3px 3px 0 ${RED};
      pointer-events: none;
    }
    /* Badge TAKE YOUR HEART */
    .p5-badge-tyh {
      position: absolute; bottom: -20px; right: -14px; z-index: 3;
      background: ${PAPER}; color: #000000;
      font-family: 'Oswald', sans-serif; font-size: 13px; font-weight: 700;
      letter-spacing: 2px; text-transform: uppercase;
      padding: 7px 15px; transform: rotate(3.5deg);
      box-shadow: 4px 4px 0 #000;
      border: 2px solid #000;
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
      .p5-notepad { right: -60px; width: 140px; font-size: 11px; padding: 12px; }
    }
    @media (max-width: 992px) {
      .p5-speech-bubble { display: none !important; }
      .p5-notepad { display: none !important; }
    }

    /* ────────── OLA ROJA CON CORONA INFERIOR ────────── */
    .p5-bottom-wave-container {
      position: relative;
      width: 100%;
      background: #000000;
      margin-top: 0;
      padding-top: 60px;
      overflow: hidden;
    }
    .p5-wave-svg {
      display: block;
      width: 100%;
      height: auto;
      min-height: 120px;
      max-height: 220px;
    }
    .p5-crown-badge {
      position: absolute;
      top: 20px;
      left: 50%;
      transform: translateX(-50%);
      z-index: 5;
      background: ${RED};
      color: #ffffff;
      padding: 8px 18px;
      border-radius: 30px;
      font-family: 'Oswald', sans-serif;
      font-weight: 700;
      font-size: 14px;
      letter-spacing: 2px;
      text-transform: uppercase;
      box-shadow: 0 4px 15px rgba(230, 0, 19, 0.4);
      display: flex;
      align-items: center;
      gap: 8px;
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

    /* ────────── SECCIÓN FINAL CTA COMPLETA P5 ────────── */
    .p5-cta-wrap {
      display: grid !important;
      grid-template-columns: 1fr 1fr !important;
      gap: 0 !important;
      align-items: stretch !important;
      background: #0b0b0b !important;
      border-top: 4px solid ${RED} !important;
      border-bottom: 4px solid ${RED} !important;
    }
    @media (max-width: 900px) {
      .p5-cta-wrap { grid-template-columns: 1fr !important; }
    }

    .p5-cta-left {
      padding: clamp(48px, 6vw, 96px) clamp(28px, 4vw, 72px) !important;
      display: flex !important;
      flex-direction: column !important;
      justify-content: center !important;
      position: relative !important;
      z-index: 2 !important;
    }

    .p5-cta-title {
      font-family: 'Anton','Impact',sans-serif !important;
      font-size: clamp(44px, 5.2vw, 84px) !important;
      line-height: 0.9 !important;
      letter-spacing: 1px !important;
      text-transform: uppercase !important;
      color: #ffffff !important;
      margin-bottom: 24px !important;
    }
    .p5-cta-title span {
      color: ${RED} !important;
      display: block !important;
      background: #000 !important;
      padding: 0 10px !important;
      width: fit-content !important;
      margin-top: 6px !important;
      transform: rotate(-1.5deg) !important;
      box-shadow: 4px 4px 0 ${PAPER} !important;
    }

    .p5-cta-sub {
      color: #d1ccbe !important;
      font-size: 17px !important;
      line-height: 1.6 !important;
      max-width: 480px !important;
      margin-bottom: 36px !important;
    }

    .p5-cta-bullets {
      display: flex !important;
      flex-direction: column !important;
      gap: 14px !important;
      margin-bottom: 44px !important;
    }
    .p5-cta-bullet {
      display: flex !important;
      align-items: center !important;
      gap: 12px !important;
      color: ${PAPER} !important;
      font-family: 'Oswald', sans-serif !important;
      font-size: 15px !important;
      letter-spacing: 1px !important;
      text-transform: uppercase !important;
    }
    .p5-cta-bullet-icon {
      width: 22px; height: 22px;
      background: ${RED};
      color: #fff;
      display: flex; alignItems: center; justifyContent: center;
      font-weight: 900; font-size: 12px;
      box-shadow: 2px 2px 0 #000;
      flex-shrink: 0;
    }

    .p5-cta-btn {
      display: inline-flex !important;
      align-items: center !important;
      gap: 14px !important;
      background: ${RED} !important;
      color: #ffffff !important;
      font-family: 'Anton','Impact',sans-serif !important;
      font-size: 22px !important;
      letter-spacing: 2px !important;
      text-transform: uppercase !important;
      padding: 18px 42px !important;
      border: 3px solid #000 !important;
      box-shadow: 6px 6px 0 #fff !important;
      text-decoration: none !important;
      width: fit-content !important;
      transition: transform .2s ease, box-shadow .2s ease, background .2s ease !important;
    }
    .p5-cta-btn:hover {
      transform: translate(-3px, -3px) !important;
      box-shadow: 10px 10px 0 ${PAPER} !important;
      background: #ff1a2d !important;
    }

    .p5-cta-right {
      position: relative !important;
      min-height: 420px !important;
      overflow: hidden !important;
      border-left: 4px solid ${RED} !important;
      background: #000 !important;
    }
    @media (max-width: 900px) {
      .p5-cta-right { border-left: none !important; border-top: 4px solid ${RED} !important; min-height: 340px !important; }
    }
    .p5-cta-right img {
      width: 100% !important; height: 100% !important;
      object-fit: cover !object-position: center !important;
      filter: contrast(1.18) saturate(0.8) !important;
      opacity: 0.85 !important;
    }
    .p5-cta-right-overlay {
      position: absolute !important; inset: 0 !important;
      background: linear-gradient(135deg, rgba(230,0,19,0.35) 0%, rgba(0,0,0,0.75) 100%) !important;
      pointer-events: none !important;
    }

    /* ────────── ANIMACIÓN DE PARPADEO EN SCROLL ────────── */
    .p5-reveal {
      opacity: 0;
      transform: translateY(32px);
      transition: opacity 0.7s cubic-bezier(0.16, 1, 0.3, 1), transform 0.7s cubic-bezier(0.16, 1, 0.3, 1);
    }
    .p5-reveal.is-in {
      opacity: 1;
      transform: translateY(0);
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
     1. TRANSFORMACIÓN DEL HERO A P5
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

      // 1. Tag // TALENTO REAL
      if (parent && !parent.querySelector('.p5-tag-tr')) {
        var tag = document.createElement('div');
        tag.className = 'p5-tag-tr';
        tag.innerHTML = '// TALENTO REAL';
        parent.appendChild(tag);
      }

      // 2. Badge TAKE YOUR HEART
      if (parent && !parent.querySelector('.p5-badge-tyh')) {
        var badge = document.createElement('div');
        badge.className = 'p5-badge-tyh';
        badge.innerHTML = 'TAKE <i>♥</i> YOUR HEART';
        parent.appendChild(badge);
      }

      // 3. Estrellas rojas/blancas decorativas
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

      // 4. BURBUJA INTERACTIVA CAMBIANTE (SPEECH BUBBLE)
      if (parent && !parent.querySelector('.p5-speech-bubble')) {
        var bubble = document.createElement('div');
        bubble.className = 'p5-speech-bubble';
        bubble.id = 'p5-speech-bubble';
        bubble.textContent = '¡Un gran lugar para trabajar! ✨';
        parent.appendChild(bubble);

        // Rotación de frases en la burbuja
        var frases = [
          '¡Un gran lugar para trabajar! ✨',
          '¡Ambiente genial y metas reales! 🚀',
          '¡El mejor equipo de ventas! 🏆',
          '¡Comisiones sin techo! 💰',
          '¡Crecimiento profesional garantizado! ⭐'
        ];
        var fraseIdx = 0;
        setInterval(function() {
          fraseIdx = (fraseIdx + 1) % frases.length;
          bubble.style.opacity = '0';
          bubble.style.transform = 'rotate(-4deg) translateY(6px)';
          setTimeout(function() {
            bubble.textContent = frases[fraseIdx];
            bubble.style.opacity = '1';
            bubble.style.transform = 'rotate(-4deg) translateY(0)';
          }, 400);
        }, 4000);
      }

      // 5. NOTITA CHECKLIST CAMBIANTE
      if (parent && !parent.querySelector('.p5-notepad')) {
        var notepad = document.createElement('div');
        notepad.className = 'p5-notepad';
        notepad.id = 'p5-notepad';

        var noteLists = [
          [
            { text: 'Sueldo fijo garantizado', check: true },
            { text: 'Incentivos diarios', check: true },
            { text: 'Capacitación pagada', check: true }
          ],
          [
            { text: 'Línea de carrera real', check: true },
            { text: 'Excelente ambiente', check: true },
            { text: 'Horarios flexibles', check: true }
          ],
          [
            { text: 'Pagos puntuales', check: true },
            { text: 'Bonos de desempeño', check: true },
            { text: 'Modalidad híbrida', check: true }
          ]
        ];
        var noteIdx = 0;

        function renderNotepad(items) {
          notepad.innerHTML = items.map(function(it) {
            return '<div class="p5-notepad-item"><i>✓</i> ' + it.text + '</div>';
          }).join('');
        }

        renderNotepad(noteLists[0]);
        parent.appendChild(notepad);

        setInterval(function() {
          noteIdx = (noteIdx + 1) % noteLists.length;
          notepad.style.opacity = '0';
          notepad.style.transform = 'rotate(3deg) translateY(-6px)';
          setTimeout(function() {
            renderNotepad(noteLists[noteIdx]);
            notepad.style.opacity = '1';
            notepad.style.transform = 'rotate(3deg) translateY(0)';
          }, 400);
        }, 5000);
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

    // OLA ROJA CON CORONA INFERIOR AL FINAL DEL HERO
    if (!document.querySelector('.p5-bottom-wave-container')) {
      var waveContainer = document.createElement('div');
      waveContainer.className = 'p5-bottom-wave-container';
      waveContainer.innerHTML = `
        <div class="p5-crown-badge">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M2 4l3 12h14l3-12-6 7-4-5-4 5-6-7z"/></svg>
          EQUIPO DE ÉLITE
        </div>
        <svg class="p5-wave-svg" viewBox="0 0 1440 160" fill="none" preserveAspectRatio="none">
          <path d="M0 80 Q 360 160, 720 80 T 1440 80 L 1440 160 L 0 160 Z" fill="${RED}" opacity="0.85"/>
          <path d="M0 100 Q 360 40, 720 100 T 1440 100 L 1440 160 L 0 160 Z" fill="${RED}"/>
        </svg>
      `;
      heroSec.appendChild(waveContainer);
    }
  }

  /* ═══════════════════════════════════════════════════════════════
     2. REEMPLAZO DE LA SECCIÓN CTA (#unete) A P5
  ═══════════════════════════════════════════════════════════════ */
  function applyCtaP5() {
    var originalCta = document.querySelector('section#unete');
    if (!originalCta) return;

    // Si ya fue reemplazada, no hacer nada
    if (originalCta.querySelector('.p5-cta-wrap')) return;

    var bgImg = (window.__resources && window.__resources.ctaBg)
      || "https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=1200&q=80&fit=crop";

    var newContent = document.createElement('div');
    newContent.className = 'p5-cta-wrap';
    newContent.innerHTML = `
      <div class="p5-cta-left">
        <div style="font-family:'Oswald',sans-serif; font-size:14px; font-weight:700; color:${RED}; letter-spacing:3px; text-transform:uppercase; margin-bottom:12px;">
          // ÚNETE A DREAMTEAM
        </div>
        <h2 class="p5-cta-title">
          ¿BUSCAS CRECER <span>DE VERDAD?</span>
        </h2>
        <p class="p5-cta-sub">
          No buscamos empleados convencionales. Incorporamos talento con hambre de superación, pasión por las ventas y visión de futuro.
        </p>

        <div class="p5-cta-bullets">
          <div class="p5-cta-bullet">
            <span class="p5-cta-bullet-icon">✓</span>
            Comisiones sin techo + bonificaciones diarias
          </div>
          <div class="p5-cta-bullet">
            <span class="p5-cta-bullet-icon">✓</span>
            Capacitación continua en neuroventas y persuasión
          </div>
          <div class="p5-cta-bullet">
            <span class="p5-cta-bullet-icon">✓</span>
            Línea de carrera real en una compañía en constante expansión
          </div>
          <div class="p5-cta-bullet">
            <span class="p5-cta-bullet-icon">✓</span>
            Cultura de alto rendimiento y reconocimiento constante
          </div>
        </div>

        <a href="https://forms.gle/9AWQbTY2SBmc3Yg77" target="_blank" rel="noopener" class="p5-cta-btn">
          POSTULAR AHORA ➔
        </a>
      </div>

      <div class="p5-cta-right">
        <img src="${bgImg}" alt="Equipo DreamTeam P5">
        <div class="p5-cta-right-overlay"></div>
      </div>
    `;

    // Limpiar contenido previo del section y reemplazar por la versión P5 limpia
    originalCta.innerHTML = '';
    originalCta.appendChild(newContent);
  }

  /* ═══════════════════════════════════════════════════════════════
     3. ANIMACIONES DE ENTRADA AL HACER SCROLL
  ═══════════════════════════════════════════════════════════════ */
  function initScrollReveals() {
    var targets = document.querySelectorAll('#sobre-nosotros, #como-trabajamos, #actividades, #unete');
    targets.forEach(function (sec) {
      sec.classList.add('p5-reveal');
    });

    if ('IntersectionObserver' in window) {
      var obs = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-in');
            obs.unobserve(entry.target);
          }
        });
      }, { threshold: 0.12 });

      targets.forEach(function (t) { obs.observe(t); });
    } else {
      targets.forEach(function (t) { t.classList.add('is-in'); });
    }
  }

  /* ═══════════════════════════════════════════════════════════════
     INICIALIZACIÓN CONTINUA (Reacción al renderizado React)
  ═══════════════════════════════════════════════════════════════ */
  function boot() {
    injectCSS();
    applyHeroP5();
    applyCtaP5();
    initScrollReveals();
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
