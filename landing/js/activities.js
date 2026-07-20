/**
 * DreamTeam — Sección "Nuestras Actividades" — Estilo PERSONA 5
 * ----------------------------------------------------------------
 * • Lee las actividades desde window.ACTIVITIES_CONFIG (js/activities-config.js)
 * • Grid tipo revista: 1 tarjeta destacada grande (2×2) + tarjetas normales
 * • Badges de categoría rojos sesgados + bandera de fecha estilo marcador
 * • Autor con chip de iniciales + contador de likes
 * • Filtros por categoría con botones paralelogramo P5
 * • Modal de detalle al hacer click en una tarjeta
 * • Se inyecta justo antes de la sección #como-trabajamos
 */
(function () {
  'use strict';

  // ── Iconos SVG (estilo Lucide outline) ───────────────────────────
  const SVG = {
    deportivas:  '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6"/><path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18"/><path d="M4 22h16"/><path d="M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20.24 7 22"/><path d="M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20.24 17 22"/><path d="M18 2H6v7a6 6 0 0 0 12 0V2Z"/></svg>',
    entrevistas: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3Z"/><path d="M19 10v2a7 7 0 0 1-14 0v-2"/><line x1="12" y1="19" x2="12" y2="22"/></svg>',
    cumpleanos:  '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><path d="M20 21v-8a2 2 0 0 0-2-2H6a2 2 0 0 0-2 2v8"/><path d="M4 16s.5-1 2-1 2.5 2 4 2 2.5-2 4-2 2.5 2 4 2 2-1 2-1"/><line x1="2" y1="21" x2="22" y2="21"/><line x1="7" y1="8" x2="7" y2="10"/><line x1="12" y1="8" x2="12" y2="10"/><line x1="17" y1="8" x2="17" y2="10"/></svg>',
    festividades:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><path d="m12 3-1.9 5.8a2 2 0 0 1-1.3 1.3L3 12l5.8 1.9a2 2 0 0 1 1.3 1.3L12 21l1.9-5.8a2 2 0 0 1 1.3-1.3L21 12l-5.8-1.9a2 2 0 0 1-1.3-1.3z"/></svg>',
    dinamicas:   '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><path d="M13 2 3 14h9l-1 8 10-12h-9l1-8z"/></svg>',
    logros:      '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="6"/><circle cx="12" cy="12" r="2"/></svg>',
    pausas:      '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><path d="M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.48 19.2 2.96c1.4 9.3-3.6 15.04-8.2 17.04Z"/><path d="M2 21c0-3 1.85-5.36 5.08-6"/></svg>',
    all:         '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/></svg>',
    calendar:    '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>',
    pin:         '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>',
    heart:       '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>',
    close:       '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>',
    image:       '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/></svg>',
  };

  const CATS = [
    { id: 'all',          label: 'Todas'          },
    { id: 'deportivas',   label: 'Deportivas'     },
    { id: 'entrevistas',  label: 'Entrevistas'    },
    { id: 'cumpleanos',   label: 'Cumpleaños'     },
    { id: 'festividades', label: 'Festividades'   },
    { id: 'dinamicas',    label: 'Dinámicas'      },
    { id: 'logros',       label: 'Logros'         },
    { id: 'pausas',       label: 'Pausas Activas' },
  ];

  let acts = [], filtered = [], currentCat = 'all';

  // ── Fuentes P5 (Anton + Oswald — por si p5-theme aún no cargó) ──
  function ensureFonts() {
    if (document.getElementById('p5-fonts') || document.querySelector('link[data-act-fonts]')) return;
    const link = document.createElement('link');
    link.rel  = 'stylesheet';
    link.href = 'https://fonts.googleapis.com/css2?family=Anton&family=Oswald:wght@400;500;600;700&family=Barlow+Semi+Condensed:wght@400;500;600&display=swap';
    link.setAttribute('data-act-fonts', '1');
    document.head.appendChild(link);
  }

  // ── Formato fecha ──────────────────────────────────────────────
  function fmtDate(d) {
    if (!d) return null;
    const dt = new Date(d + 'T12:00:00');
    const months = ['ENE','FEB','MAR','ABR','MAY','JUN','JUL','AGO','SEP','OCT','NOV','DIC'];
    return { day: String(dt.getDate()).padStart(2,'0'), month: months[dt.getMonth()], year: dt.getFullYear() };
  }
  function fmtDateShort(d) {
    const f = fmtDate(d);
    return f ? `${f.day} ${f.month} ${f.year}` : '–';
  }
  function catLabel(id) {
    const c = CATS.find(x => x.id === id);
    return c ? c.label : id;
  }
  function escapeHtml(s) {
    if (s == null) return '';
    return String(s).replace(/[&<>"']/g, ch => (
      { '&':'&amp;', '<':'&lt;', '>':'&gt;', '"':'&quot;', "'":'&#39;' }[ch]
    ));
  }
  // Iniciales del autor: 'Andrea Lozano' → 'AL'
  function getInitials(name) {
    if (!name) return '';
    return name.trim().split(/\s+/).slice(0, 2).map(w => w[0]).join('').toUpperCase();
  }

  // ── Resolver ruta de imagen ────────────────────────────────────
  function resolveImg(image) {
    if (!image) return '';
    if (image.indexOf('/') >= 0 || image.indexOf(':') >= 0) return image;
    return 'images/activities/' + image;
  }

  // ── Build HTML sección ─────────────────────────────────────────
  function buildSection() {
    const sec = document.createElement('section');
    sec.id = 'actividades';
    sec.style.cssText = 'width:100%;background:#0d0d0d;padding:0 0 90px;overflow:hidden;position:relative;';
    sec.innerHTML = `
      <style>
        #actividades *{box-sizing:border-box}
        #actividades .act-inner{max-width:1280px;margin:0 auto;padding:0 clamp(20px,4vw,80px);position:relative;z-index:2}

        /* ═══ BANDA ROJA DIAGONAL SUPERIOR ═══ */
        #actividades .act-slash-band{position:relative;height:150px;margin-bottom:10px;overflow:hidden}
        #actividades .act-slash-band .sb-red{position:absolute;left:-5%;right:-5%;top:34px;height:52px;background:#e60013;transform:rotate(-2.5deg);box-shadow:0 6px 0 #000}
        #actividades .act-slash-band .sb-black{position:absolute;left:-5%;right:-5%;top:96px;height:34px;background:#000;transform:rotate(-2.5deg)}

        /* ═══ EYEBROW "VIDA DREAMTEAM" ═══ */
        #actividades .act-eyebrow{display:inline-flex;align-items:center;gap:8px;background:#e60013;color:#fff;
          font-family:'Oswald',sans-serif;font-weight:700;font-size:12px;letter-spacing:4px;text-transform:uppercase;
          padding:7px 18px 7px 14px;transform:skewX(-12deg);box-shadow:4px 4px 0 #000;margin-bottom:22px}
        #actividades .act-eyebrow>span{transform:skewX(12deg);display:inline-flex;align-items:center;gap:8px}
        #actividades .act-eyebrow .tri{width:0;height:0;border-left:7px solid #fff;border-top:5px solid transparent;border-bottom:5px solid transparent;display:inline-block}

        /* ═══ TÍTULO PRINCIPAL — ANTON ═══ */
        #actividades .act-top{display:flex;align-items:flex-end;justify-content:space-between;flex-wrap:wrap;gap:24px;margin-bottom:30px}
        #actividades .act-main-title{
          font-family:'Anton','Impact',sans-serif !important;
          font-weight:400 !important;
          font-size:clamp(44px,7.5vw,88px);
          line-height:.92;letter-spacing:1px;text-transform:uppercase;
          color:#f3efe6;margin:0}
        #actividades .act-main-title em{color:#e60013;font-style:italic;padding-right:8px}
        #actividades .act-subtitle{font-family:'Barlow Semi Condensed','DM Sans',sans-serif;font-size:15px;color:rgba(243,239,230,.6);line-height:1.55;max-width:340px;margin:0 0 8px}

        /* ═══ FILTROS — botones paralelogramo P5 ═══ */
        #actividades .act-filters{display:flex;flex-wrap:wrap;gap:10px;align-items:center;margin-bottom:38px}
        #actividades .act-filter-btn{
          font-family:'Oswald',sans-serif !important;font-weight:600;font-size:12px;letter-spacing:1.5px;text-transform:uppercase;
          border:1px solid rgba(243,239,230,.28);border-radius:0 !important;background:transparent;color:rgba(243,239,230,.75);
          padding:8px 18px;cursor:pointer;transform:skewX(-12deg);
          display:inline-flex;align-items:center;transition:all .15s}
        #actividades .act-filter-btn>span{transform:skewX(12deg);display:inline-flex;align-items:center;gap:7px}
        #actividades .act-filter-btn svg{width:13px;height:13px;flex-shrink:0}
        #actividades .act-filter-btn:hover{border-color:#e60013;color:#fff}
        #actividades .act-filter-btn.active{background:#e60013 !important;border-color:#e60013 !important;color:#fff;box-shadow:4px 4px 0 #000}

        /* ═══ GRID REVISTA ═══
           3 columnas · filas de 215px
           tarjeta normal    = 1 col × 2 filas  (retrato)
           tarjeta destacada = 2 col × 4 filas  (grande)         */
        #actividades .act-grid{display:grid;grid-template-columns:repeat(3,1fr);grid-auto-rows:215px;gap:18px;grid-auto-flow:dense}
        #actividades .p5-card{grid-row:span 2;position:relative;overflow:hidden;cursor:pointer;background:#1a1a1a;
          border:2px solid rgba(243,239,230,.14);
          animation:p5CardIn .55s cubic-bezier(.2,.9,.3,1) both}
        #actividades .p5-card-featured{grid-column:span 2;grid-row:span 4}
        @keyframes p5CardIn{from{opacity:0;transform:translateY(26px) skewX(-2deg)}to{opacity:1;transform:none}}
        #actividades .p5-card:hover{border-color:#e60013}

        /* imagen — B/N sutil que se colorea al pasar el mouse */
        #actividades .p5-card-imgwrap{position:absolute;inset:0;background:#161616;overflow:hidden}
        #actividades .p5-card-imgwrap img{position:absolute;inset:0;width:100%;height:100%;object-fit:cover;display:block;
          filter:grayscale(55%) contrast(1.08);transform:scale(1.001);
          transition:filter .45s ease,transform .45s ease}
        #actividades .p5-card:hover .p5-card-imgwrap img{filter:grayscale(0%) contrast(1.02);transform:scale(1.05)}
        #actividades .img-placeholder{position:absolute;inset:0;display:flex;align-items:center;justify-content:center;color:rgba(255,255,255,.14)}
        #actividades .img-placeholder svg{width:56px;height:56px}

        /* sombra inferior para legibilidad */
        #actividades .p5-card-shade{position:absolute;inset:0;background:linear-gradient(to top,rgba(0,0,0,.92) 0%,rgba(0,0,0,.35) 42%,rgba(0,0,0,.06) 68%,transparent 100%);pointer-events:none}

        /* badge categoría — paralelogramo rojo esquina sup-izq */
        #actividades .p5-card-cat{position:absolute;top:14px;left:-6px;z-index:3;
          background:#e60013;color:#fff;font-family:'Oswald',sans-serif;font-weight:700;font-size:11px;
          letter-spacing:2px;text-transform:uppercase;padding:6px 16px 6px 20px;
          transform:skewX(-14deg);box-shadow:3px 3px 0 #000;display:inline-flex;align-items:center}
        #actividades .p5-card-cat>span{transform:skewX(14deg);display:inline-flex;align-items:center;gap:6px}
        #actividades .p5-card-cat svg{width:12px;height:12px}

        /* bandera de fecha — marcador colgante esquina sup-der */
        #actividades .p5-card-flag{position:absolute;top:0;right:16px;z-index:3;background:#f3efe6;color:#111;
          padding:10px 10px 14px;text-align:center;min-width:46px;border-top:5px solid #e60013;
          clip-path:polygon(0 0,100% 0,100% 100%,50% 86%,0 100%);
          box-shadow:3px 3px 0 rgba(0,0,0,.6)}
        #actividades .p5-card-flag .d{display:block;font-family:'Anton',sans-serif;font-size:20px;line-height:1;color:#0a0a0a}
        #actividades .p5-card-flag .m{display:block;font-family:'Oswald',sans-serif;font-weight:700;font-size:9px;letter-spacing:2px;margin-top:2px;color:#555}

        /* badge DESTACADO */
        #actividades .p5-card-star{position:absolute;top:14px;right:78px;z-index:3;background:#000;color:#e60013;
          font-family:'Oswald',sans-serif;font-weight:700;font-size:10px;letter-spacing:3px;text-transform:uppercase;
          padding:5px 12px;transform:skewX(-14deg)}
        #actividades .p5-card-star>span{transform:skewX(14deg);display:inline-block}

        /* cuerpo inferior */
        #actividades .p5-card-body{position:absolute;left:0;right:0;bottom:0;z-index:2;padding:18px 18px 14px}
        #actividades .p5-card-featured .p5-card-body{padding:26px 26px 20px}
        #actividades .p5-card-title{font-family:'Oswald',sans-serif !important;font-weight:700;font-size:16px;
          line-height:1.18;letter-spacing:.5px;text-transform:uppercase;color:#fff !important;margin:0 0 8px;
          display:-webkit-box;-webkit-line-clamp:3;-webkit-box-orient:vertical;overflow:hidden}
        #actividades .p5-card-featured .p5-card-title{font-size:clamp(22px,2.6vw,30px);-webkit-line-clamp:2}
        #actividades .p5-card-desc{font-family:'Barlow Semi Condensed','DM Sans',sans-serif;font-size:14px;
          color:rgba(255,255,255,.75) !important;line-height:1.5;margin:0 0 12px;
          display:-webkit-box;-webkit-line-clamp:2;-webkit-box-orient:vertical;overflow:hidden}

        /* fila autor + likes */
        #actividades .p5-card-meta{display:flex;align-items:center;justify-content:space-between;gap:10px;
          border-top:1px solid rgba(255,255,255,.16);padding-top:10px}
        #actividades .p5-card-author{display:inline-flex;align-items:center;gap:8px;
          font-family:'Oswald',sans-serif;font-weight:600;font-size:10.5px;letter-spacing:1.5px;text-transform:uppercase;color:rgba(255,255,255,.8)}
        #actividades .p5-card-author .ini{width:22px;height:22px;border-radius:50%;background:#e60013;color:#fff;
          display:inline-flex;align-items:center;justify-content:center;font-size:9px;font-weight:700;letter-spacing:0;flex-shrink:0;
          border:1.5px solid rgba(0,0,0,.55)}
        #actividades .act-empty{grid-column:1/-1;text-align:center;padding:70px 20px;color:rgba(243,239,230,.4);
          font-family:'Oswald',sans-serif;font-size:14px;letter-spacing:2px;text-transform:uppercase}

        /* ═══ RESPONSIVE ═══ */
        @media(max-width:1000px){
          #actividades .act-grid{grid-template-columns:repeat(2,1fr);grid-auto-rows:200px}
          #actividades .p5-card-featured{grid-column:span 2;grid-row:span 3}
        }
        @media(max-width:640px){
          #actividades .act-grid{grid-template-columns:1fr;grid-auto-rows:190px}
          #actividades .p5-card,#actividades .p5-card-featured{grid-column:span 1;grid-row:span 2}
          #actividades .act-slash-band{height:110px}
          #actividades .act-slash-band .sb-red{top:22px;height:38px}
          #actividades .act-slash-band .sb-black{top:68px;height:24px}
          #actividades .act-subtitle{max-width:100%}
        }

        /* ═══ MODAL DETALLE P5 ═══ */
        #act-detail-modal .adm-box{background:#141414;border:2px solid #e60013;border-radius:0;
          width:100%;max-width:880px;max-height:88vh;display:flex;overflow:hidden;position:relative;
          box-shadow:10px 10px 0 #000}
        @media(max-width:760px){
          #act-detail-modal .adm-box{flex-direction:column;overflow-y:auto}
          #act-detail-modal #adm-gallery{min-height:260px !important}
          #act-detail-modal #adm-info{width:100% !important}
        }
      </style>

      <div class="act-slash-band">
        <div class="sb-red"></div>
        <div class="sb-black"></div>
      </div>

      <div class="act-inner">
        <div class="act-eyebrow"><span><span class="tri"></span>Vida DreamTeam</span></div>

        <div class="act-top">
          <h2 class="act-main-title">Nuestras <em>Actividades</em></h2>
          <p class="act-subtitle">Torneos, entrevistas, cumpleaños y festividades. Así vive y late el equipo fuera del headset.</p>
        </div>

        <div class="act-filters" id="act-filters"></div>
        <div class="act-grid" id="act-grid"></div>
      </div>
    `;
    return sec;
  }

  // ── Render filtros ─────────────────────────────────────────────
  function renderFilters() {
    const el = document.getElementById('act-filters');
    if (!el) return;
    el.innerHTML = CATS.map(c => {
      const count = c.id === 'all' ? acts.length : acts.filter(a => a.category === c.id).length;
      if (c.id !== 'all' && count === 0) return '';
      const icon = SVG[c.id] || '';
      return `<button class="act-filter-btn ${currentCat === c.id ? 'active' : ''}"
        onclick="window.__actFilter('${c.id}')"><span>${icon}${c.label}</span></button>`;
    }).join('');
  }

  // ── Render grid ────────────────────────────────────────────────
  function renderGrid() {
    const grid = document.getElementById('act-grid');
    if (!grid) return;

    if (!filtered.length) {
      grid.innerHTML = '<div class="act-empty">No hay actividades en esta categoría</div>';
      return;
    }

    // La destacada (featured) va primero para ocupar la esquina sup-izq
    const sorted = [...filtered].sort((a, b) => (b.featured === true) - (a.featured === true));

    grid.innerHTML = sorted.map((a, i) => cardHTML(a, i)).join('');
  }

  // ── Card HTML ──────────────────────────────────────────────────
  function cardHTML(a, index) {
    const df       = fmtDate(a.date);
    const catIcon  = SVG[a.category] || '';
    const src      = resolveImg(a.image);
    const initials = getInitials(a.author);
    const isFeat   = a.featured === true;

    return `
      <article class="p5-card ${isFeat ? 'p5-card-featured' : ''}"
               style="animation-delay:${Math.min(index * 0.07, 0.6)}s"
               onclick="window.__actOpenDetail('${a.id}')">
        <div class="p5-card-imgwrap">
          <div class="img-placeholder">${SVG.image}</div>
          ${src ? `<img src="${src}" alt="${escapeHtml(a.title)}" loading="lazy" onerror="this.remove()">` : ''}
        </div>
        <div class="p5-card-shade"></div>

        <div class="p5-card-cat"><span>${catIcon} ${catLabel(a.category)}</span></div>
        ${isFeat ? '<div class="p5-card-star"><span>★ Destacado</span></div>' : ''}
        ${df ? `<div class="p5-card-flag"><span class="d">${df.day}</span><span class="m">${df.month}</span></div>` : ''}

        <div class="p5-card-body">
          <h3 class="p5-card-title">${escapeHtml(a.title)}</h3>
          ${isFeat && a.description ? `<p class="p5-card-desc">${escapeHtml(a.description)}</p>` : ''}
          <div class="p5-card-meta">
            ${a.author
              ? `<span class="p5-card-author"><span class="ini">${initials}</span>${escapeHtml(a.author)}</span>`
              : `<span class="p5-card-author"><span class="ini">DT</span>DreamTeam</span>`}
          </div>
        </div>
      </article>`;
  }

  // ── Modal detalle ──────────────────────────────────────────────
  function buildDetailModal() {
    if (document.getElementById('act-detail-modal')) return;
    const m = document.createElement('div');
    m.id = 'act-detail-modal';
    m.style.cssText = 'position:fixed;inset:0;background:rgba(5,5,5,.9);backdrop-filter:blur(6px);z-index:9000;display:flex;align-items:center;justify-content:center;opacity:0;pointer-events:none;transition:opacity .25s ease;padding:20px';
    m.innerHTML = `
      <div class="adm-box">
        <button onclick="window.__actCloseDetail()" aria-label="Cerrar" style="position:absolute;top:0;right:0;background:#e60013;border:none;width:38px;height:38px;color:#fff;cursor:pointer;display:flex;align-items:center;justify-content:center;z-index:10">
          <span style="width:16px;height:16px;display:block">${SVG.close}</span>
        </button>
        <div id="adm-gallery" style="flex:1;background:#0a0a0a;position:relative;min-height:400px"></div>
        <div id="adm-info" style="width:330px;flex-shrink:0;padding:30px 28px;overflow-y:auto;display:flex;flex-direction:column;gap:14px;color:#f3efe6"></div>
      </div>`;
    document.body.appendChild(m);
    m.addEventListener('click', (e) => { if (e.target === m) window.__actCloseDetail(); });
  }

  function openDetail(id) {
    const a = acts.find(x => x.id === id);
    if (!a) return;
    buildDetailModal();
    const m       = document.getElementById('act-detail-modal');
    const gallery = document.getElementById('adm-gallery');
    const info    = document.getElementById('adm-info');
    const catIcon = SVG[a.category] || '';

    const detailSrc = resolveImg(a.image);
    /* La imagen se muestra SIEMPRE completa (object-fit: contain).
       Detrás, la misma foto ampliada y difuminada rellena el espacio
       sobrante para que cualquier formato (horizontal, vertical,
       cuadrado) se vea bien sin recortes. */
    gallery.innerHTML = `
      <div style="position:absolute;inset:0;display:flex;align-items:center;justify-content:center;color:#2a2a2a"><span style="width:64px;height:64px;display:inline-block">${SVG.image}</span></div>
      ${detailSrc ? `
        <img src="${detailSrc}" alt="" aria-hidden="true" style="position:absolute;inset:0;width:100%;height:100%;object-fit:cover;filter:blur(22px) saturate(.75) brightness(.4);transform:scale(1.15)" onerror="this.remove()">
        <img src="${detailSrc}" alt="${escapeHtml(a.title)}" style="position:absolute;inset:0;width:100%;height:100%;object-fit:contain;z-index:2" onerror="this.remove()">` : ''}`;

    info.innerHTML = `
      <span style="background:#e60013;color:#fff;padding:6px 14px;font-family:'Oswald',sans-serif;font-weight:700;font-size:11px;letter-spacing:2px;text-transform:uppercase;display:inline-flex;align-items:center;gap:7px;align-self:flex-start;transform:skewX(-12deg);box-shadow:3px 3px 0 #000">
        <span style="transform:skewX(12deg);display:inline-flex;align-items:center;gap:7px"><span style="width:12px;height:12px;display:inline-flex">${catIcon}</span> ${catLabel(a.category)}</span>
      </span>
      <div style="font-size:24px;font-weight:700;text-transform:uppercase;line-height:1.15;font-family:'Oswald',sans-serif;color:#f3efe6">${escapeHtml(a.title)}</div>
      <div style="display:flex;gap:14px;font-size:12px;color:rgba(243,239,230,.5);flex-wrap:wrap;font-family:'Oswald',sans-serif;letter-spacing:1px">
        <span style="display:inline-flex;align-items:center;gap:6px"><span style="width:13px;height:13px;display:inline-flex">${SVG.calendar}</span> ${fmtDateShort(a.date)}</span>
        ${a.location ? `<span style="display:inline-flex;align-items:center;gap:6px"><span style="width:13px;height:13px;display:inline-flex">${SVG.pin}</span> ${escapeHtml(a.location)}</span>` : ''}
      </div>
      ${a.description ? `<div style="font-size:14px;line-height:1.7;color:rgba(243,239,230,.7);font-family:'Barlow Semi Condensed','DM Sans',sans-serif">${escapeHtml(a.description)}</div>` : ''}
      <div style="display:flex;align-items:center;border-top:1px solid rgba(255,255,255,.12);padding-top:14px;margin-top:auto">
        <span style="display:inline-flex;align-items:center;gap:9px;font-family:'Oswald',sans-serif;font-weight:600;font-size:11px;letter-spacing:1.5px;text-transform:uppercase;color:rgba(243,239,230,.8)">
          <span style="width:26px;height:26px;border-radius:50%;background:#e60013;color:#fff;display:inline-flex;align-items:center;justify-content:center;font-size:10px;font-weight:700">${getInitials(a.author) || 'DT'}</span>
          ${escapeHtml(a.author || 'DreamTeam')}
        </span>
      </div>
    `;

    m.style.opacity = '1';
    m.style.pointerEvents = 'all';
  }

  // ── Exponer en window ──────────────────────────────────────────
  window.__actFilter = (cat) => {
    currentCat = cat;
    filtered = cat === 'all' ? [...acts] : acts.filter(a => a.category === cat);
    renderFilters();
    renderGrid();
  };
  window.__actOpenDetail  = (id) => openDetail(id);
  window.__actCloseDetail = () => {
    const m = document.getElementById('act-detail-modal');
    if (m) { m.style.opacity = '0'; m.style.pointerEvents = 'none'; }
  };

  document.addEventListener('keydown', e => {
    if (e.key === 'Escape') window.__actCloseDetail();
  });

  // ── Inyección ──────────────────────────────────────────────────
  function inject() {
    const target = document.getElementById('como-trabajamos');
    if (!target) { setTimeout(inject, 300); return; }
    if (document.getElementById('actividades')) return;
    ensureFonts();
    const sec = buildSection();
    target.parentNode.insertBefore(sec, target);
  }

  // ── Cargar datos desde activities-config.js ────────────────────
  function init() {
    acts = Array.isArray(window.ACTIVITIES_CONFIG) ? window.ACTIVITIES_CONFIG.slice() : [];
    acts.sort((a, b) => (b.date || '').localeCompare(a.date || ''));
    filtered = [...acts];
    inject();
    const waitForSection = setInterval(() => {
      if (document.getElementById('act-filters')) {
        clearInterval(waitForSection);
        renderFilters();
        renderGrid();
      }
    }, 100);
  }

  if (document.readyState === 'complete') {
    setTimeout(init, 800);
  } else {
    window.addEventListener('load', () => setTimeout(init, 800));
  }
})();
