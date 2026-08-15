/**
 * hero-slideshow.js — DreamTeam
 * ----------------------------------------------------------------
 * Slideshow con fundido (crossfade) para la foto principal de la
 * portada. Lee la lista desde window.HERO_SLIDES (js/hero-config.js).
 *
 *   · Cada foto dura HERO_SLIDES.duration segundos (por defecto 8)
 *   · Fundido suave de HERO_SLIDES.transition segundos entre fotos
 *   · Bucle infinito en el orden de la lista
 *   · Si la lista está vacía no hace nada (queda la foto original)
 *
 * Funciona superponiendo dos capas <img> absolutas dentro del
 * contenedor de la foto original de React, sin tocar su DOM.
 */
(function () {
  'use strict';

  var cfg  = window.HERO_SLIDES || {};
  var list = Array.isArray(cfg.images) ? cfg.images.filter(Boolean) : [];
  if (list.length === 0) return;                 // sin fotos → no hacer nada

  var HOLD = Math.max(2, Number(cfg.duration) || 8) * 1000;   // ms por foto
  var FADE = Math.max(0.3, Number(cfg.transition) || 1.4);    // s de fundido

  /* Ocultar la foto ORIGINAL de React desde el primer instante para
     que nunca se vea antes de que carguen las fotos de los asesores.
     (solo se hace si hay fotos configuradas en la lista)            */
  (function hideOriginalASAP() {
    var s = document.createElement('style');
    s.id = 'p5-hero-hide-original';
    s.textContent = 'section#inicio img[alt="Agente de contact center"]{opacity:0 !important;}';
    (document.head || document.documentElement).appendChild(s);
  })();

  function resolveSrc(p) {
    if (p.indexOf('/') >= 0 || p.indexOf(':') >= 0) return p;
    return 'images/hero/' + p;
  }

  // ── Encontrar la foto grande del hero (no los avatares) ────────
  function findHeroImg() {
    var sec = document.querySelector('section#inicio');
    if (!sec) return null;
    var imgs = sec.querySelectorAll('img');
    for (var i = 0; i < imgs.length; i++) {
      var img = imgs[i];
      if ((img.getAttribute('alt') || '').toLowerCase() === 'avatar') continue;
      var r = img.getBoundingClientRect();
      if (r.width > 150 && r.height > 150) return img;
    }
    return null;
  }

  var tries = 0;

  var DOODLE_DATA = [
    { bubble: "¡Un gran lugar para trabajar!", notes: ["Buen ambiente", "Grandes beneficios", "Crecimiento profesional"] },
    { bubble: "¡Terminé mi carrera mientras trabajaba aquí!", notes: ["Horarios universitarios", "Capacitación constante", "Línea de carrera"] },
    { bubble: "¡Los mejores incentivos y comisiones sin techo!", notes: ["Pagos puntuales", "Soporte 24/7", "Comisiones sin tope"] },
    { bubble: "¡Orgulloso de ser parte del equipo DreamTeam!", notes: ["Excelente clima", "Premios y bonos", "Comunidad unida"] },
    { bubble: "¡Crecimiento real desde el primer mes!", notes: ["Acompañamiento constante", "Metas alcanzables", "Liderazgo positivo"] },
    { bubble: "¡Aquí el trabajo en equipo se vive a diario!", notes: ["Respeto e integración", "Formación continua", "Premios semanales"] },
    { bubble: "¡Logré ascender a supervisor en 6 meses!", notes: ["Línea de carrera rápida", "Capacitación en ventas", "Buen sueldo"] },
    { bubble: "¡Flexibilidad total con mis horarios de estudio!", notes: ["Turnos rotativos", "Ambiente universitario", "Facilidades de estudio"] },
    { bubble: "¡Comisiones altas y capacitación desde el día 1!", notes: ["Bonos por desempeño", "Entrenamiento pagado", "Gran equipo"] },
    { bubble: "¡Me encanta la cultura y la energía de este equipo!", notes: ["Cultura motivacional", "Eventos de integración", "Feedback constante"] },
    { bubble: "¡Puntualidad de pago y excelente ambiente laboral!", notes: ["Pagos exactos", "Reconocimiento constante", "Soporte de gestión"] },
    { bubble: "¡Un ambiente de trabajo súper dinámico y motivador!", notes: ["Desafíos diarios", "Compañerismo", "Recompensas por ventas"] },
    { bubble: "¡Gané mis primeros premios internacionales este año!", notes: ["Incentivos especiales", "Reconocimientos", "Crecimiento personal"] },
    { bubble: "¡Acompañamiento constante de los supervisores!", notes: ["Liderazgo cercano", "Coaching de ventas", "Confianza laboral"] },
    { bubble: "¡La mejor oportunidad para tu primer trabajo formal!", notes: ["Ingreso inmediato", "Planilla y beneficios", "Desarrollo de habilidades"] },
    { bubble: "¡Sentir que tu esfuerzo diario realmente se valora!", notes: ["Meritocracia real", "Ambiente positivo", "Bonos semanales"] },
    { bubble: "¡Orgullosa del equipo comercial que construimos juntos!", notes: ["Compañerismo puro", "Altos estándares", "Excelencia en ventas"] }
  ];

  function updateDoodles(idx) {
    var data = DOODLE_DATA[idx % DOODLE_DATA.length];
    var bubbles = document.querySelectorAll('.p5-speech-bubble');
    var notes = document.querySelectorAll('.p5-notepad');

    var arrowSVG = '<svg class="p5-bubble-arrow" width="50" height="35" viewBox="0 0 50 35" fill="none" style="position:absolute;right:-38px;bottom:12px;pointer-events:none;"><path d="M 5 5 Q 28 12 42 26" stroke="#ffffff" stroke-width="8" stroke-linecap="round" fill="none"/><path d="M 30 22 L 44 28 L 38 12" stroke="#ffffff" stroke-width="8" stroke-linecap="round" stroke-linejoin="round" fill="none"/><path d="M 5 5 Q 28 12 42 26" stroke="#000000" stroke-width="3.5" stroke-linecap="round" fill="none"/><path d="M 30 22 L 44 28 L 38 12" stroke="#000000" stroke-width="3.5" stroke-linecap="round" stroke-linejoin="round" fill="none"/></svg>';

    Array.prototype.forEach.call(bubbles, function (bubbleEl) {
      bubbleEl.style.opacity = '0';
      bubbleEl.style.transform = 'rotate(-4deg) scale(0.85)';
      setTimeout(function () {
        bubbleEl.innerHTML = arrowSVG + '<span style="font-family:\'Caveat\',\'Comic Sans MS\',cursive,sans-serif;font-size:18px;font-weight:700;font-style:italic;line-height:1.25;display:block;">' + data.bubble + '</span><div style="width:80%;height:3px;background:#e60013;margin:6px auto 0 auto;border-radius:2px;"></div>';
        bubbleEl.style.opacity = '1';
        bubbleEl.style.transform = 'rotate(-4deg) scale(1)';
      }, 250);
    });

    Array.prototype.forEach.call(notes, function (noteEl) {
      noteEl.style.opacity = '0';
      noteEl.style.transform = 'rotate(4deg) scale(0.85)';
      setTimeout(function () {
        var itemsHTML = data.notes.map(function (item, i) {
          var isLast = i === data.notes.length - 1;
          var styleStr = isLast ? 'display:flex;align-items:center;gap:6px;border-bottom:2.5px solid #e60013;padding-bottom:4px;' : 'display:flex;align-items:center;gap:6px;';
          return '<div class="p5-notepad-item" style="' + styleStr + '"><i style="color:#e60013;font-style:normal;font-weight:800;">✓</i> ' + item + '</div>';
        }).join('');
        noteEl.innerHTML = '<div style="font-family:\'Caveat\',\'Comic Sans MS\',cursive,sans-serif;font-size:16px;font-weight:700;font-style:italic;display:flex;flex-direction:column;gap:8px;">' + itemsHTML + '</div>';
        noteEl.style.opacity = '1';
        noteEl.style.transform = 'rotate(4deg) scale(1)';
      }, 250);
    });

    // Notificar a React el cambio de diapositiva
    window.dispatchEvent(new CustomEvent('hero-slide-change', { detail: { index: idx } }));
  }

  function init() {
    var base = findHeroImg();
    if (!base) {
      if (tries++ < 50) setTimeout(init, 300);   // esperar al render de React
      return;
    }

    // Precargar todas las fotos
    list.forEach(function (src) { var i = new Image(); i.src = resolveSrc(src); });

    // Red de seguridad: ocultar la foto original también por si el
    // selector CSS no la alcanzó (p. ej. si cambia el atributo alt)
    base.style.opacity = '0';

    var parent = base.parentElement;
    var radius = getComputedStyle(base).borderRadius;
    if (getComputedStyle(parent).position === 'static') {
      parent.style.position = 'relative';
    }
    parent.style.overflow = 'visible';

    // ── Dos capas superpuestas que alternan con fundido ──
    function makeLayer() {
      var el = document.createElement('img');
      el.alt = 'Asesor DreamTeam';
      el.style.cssText =
        'position:absolute;top:0;left:0;width:100%;height:100%;' +
        'object-fit:cover;object-position:center;display:block;' +
        'border-radius:' + radius + ';opacity:0;' +
        'transition:opacity ' + FADE + 's ease-in-out;pointer-events:none;';
      parent.appendChild(el);
      return el;
    }

    var layerA = makeLayer();
    var layerB = makeLayer();

    // Primera foto visible de inmediato
    var idx = 0;
    layerA.src = resolveSrc(list[0]);
    layerA.style.zIndex = '2';
    layerB.style.zIndex = '1';
    // forzar reflow para que la transición aplique
    void layerA.offsetWidth;
    layerA.style.opacity = '1';
    updateDoodles(0);

    if (list.length < 2) return;                 // una sola foto → sin rotación

    var visible = layerA, standby = layerB;

    function nextSlide() {
      idx = (idx + 1) % list.length;
      standby.src = resolveSrc(list[idx]);
      standby.style.zIndex = '3';
      visible.style.zIndex = '2';
      void standby.offsetWidth;
      standby.style.opacity = '1';               // entra la nueva por encima
      updateDoodles(idx);

      // cuando terminó el fundido, ocultar la vieja y rotar referencias
      var old = visible;
      setTimeout(function () { old.style.opacity = '0'; }, FADE * 1000 + 60);

      var tmp = visible; visible = standby; standby = tmp;
    }

    // Permitir clic interactivo sobre la foto
    parent.style.cursor = 'pointer';
    parent.addEventListener('click', nextSlide);

    setInterval(nextSlide, HOLD);
  }

  if (document.readyState !== 'loading') {
    setTimeout(init, 400);
  } else {
    document.addEventListener('DOMContentLoaded', function () { setTimeout(init, 400); });
  }
})();
