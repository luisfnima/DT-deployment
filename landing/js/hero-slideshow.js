/**
 * hero-slideshow.js — DreamTeam
 * ----------------------------------------------------------------
 * Slideshow con fundido (crossfade) para la foto principal de la
 * portada. Lee la lista desde window.HERO_SLIDES (js/hero-config.js).
 *
 * Sincroniza el cambio de foto con la animación de resorte/pop
 * de la burbuja y notita doodle.
 */
(function () {
  'use strict';

  var cfg  = window.HERO_SLIDES || {};
  var list = Array.isArray(cfg.images) ? cfg.images.filter(Boolean) : [];
  if (list.length === 0) return;                 

  var HOLD = Math.max(2, Number(cfg.duration) || 8) * 1000;   
  var FADE = Math.max(0.3, Number(cfg.transition) || 1.4);    

  // ── TESTIMONIOS Y NOTAS ENRIQUECIDAS CON ANIMACIÓN EN RESORTE ──
  var DOODLE_DATA = [
    {
      bubble: "¡Estudio y trabajo en DreamTeam con horarios flexibles!",
      notes: ["Pagos puntuales", "Buen ambiente", "Grandes beneficios", "Crecimiento profesional"]
    },
    {
      bubble: "¡Terminé mi carrera mientras trabajaba aquí!",
      notes: ["Capacitación constante", "Línea de carrera", "Comisiones sin techo", "Excelente clima laboral"]
    },
    {
      bubble: "¡Un gran lugar para trabajar y desarrollarte!",
      notes: ["Pagos puntuales", "Soporte 24/7", "Incentivos semanales", "Ambiente 100% motivador"]
    },
    {
      bubble: "¡Orgullosos de ser parte del equipo DreamTeam!",
      notes: ["Flexibilidad universitaria", "Premios y bonos", "Innovación continua", "Respeto y comunidad"]
    }
  ];

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

  function updateDoodles(idx) {
    var data = DOODLE_DATA[idx % DOODLE_DATA.length];
    var bubbleTextEl = document.getElementById('hero-bubble-text');
    var noteListEl = document.getElementById('hero-note-list');
    var bubbleEl = document.getElementById('hero-doodle-bubble');
    var noteEl = document.getElementById('hero-doodle-note');

    // ANIMACIÓN EN RESORTE (Spring / Bounce overshoot cubic-bezier)
    if (bubbleEl) {
      bubbleEl.style.opacity = '0';
      bubbleEl.style.transform = 'translateY(25px) scale(0.7) rotate(-12deg)';
    }
    if (noteEl) {
      noteEl.style.opacity = '0';
      noteEl.style.transform = 'translateY(-25px) scale(0.7) rotate(12deg)';
    }

    setTimeout(function () {
      if (bubbleTextEl) bubbleTextEl.textContent = data.bubble;
      if (noteListEl) {
        noteListEl.innerHTML = data.notes.map(function (item) {
          return '<li>' + item + '</li>';
        }).join('');
      }

      if (bubbleEl) {
        bubbleEl.style.opacity = '1';
        bubbleEl.style.transform = 'translateY(0) scale(1) rotate(-6deg)';
      }
      if (noteEl) {
        noteEl.style.opacity = '1';
        noteEl.style.transform = 'translateY(0) scale(1) rotate(5deg)';
      }
    }, 350);
  }

  function init() {
    var base = findHeroImg();
    if (!base) {
      if (tries++ < 50) setTimeout(init, 300);   
      return;
    }

    list.forEach(function (src) { var i = new Image(); i.src = resolveSrc(src); });

    base.style.opacity = '0';

    var parent = base.parentElement;
    var radius = getComputedStyle(base).borderRadius;
    if (getComputedStyle(parent).position === 'static') {
      parent.style.position = 'relative';
    }
    parent.style.overflow = 'hidden';

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

    var idx = 0;
    layerA.src = resolveSrc(list[0]);
    layerA.style.zIndex = '2';
    layerB.style.zIndex = '1';
    void layerA.offsetWidth;
    layerA.style.opacity = '1';

    updateDoodles(0);

    if (list.length < 2) return;                 

    var visible = layerA, standby = layerB;

    setInterval(function () {
      idx = (idx + 1) % list.length;
      standby.src = resolveSrc(list[idx]);
      standby.style.zIndex = '3';
      visible.style.zIndex = '2';
      void standby.offsetWidth;
      standby.style.opacity = '1';               

      updateDoodles(idx);

      var old = visible;
      setTimeout(function () { old.style.opacity = '0'; }, FADE * 1000 + 60);

      var tmp = visible; visible = standby; standby = tmp;
    }, HOLD);
  }

  if (document.readyState !== 'loading') {
    setTimeout(init, 400);
  } else {
    document.addEventListener('DOMContentLoaded', function () { setTimeout(init, 400); });
  }
})();
