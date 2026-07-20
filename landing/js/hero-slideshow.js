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
    parent.style.overflow = 'hidden';

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

    if (list.length < 2) return;                 // una sola foto → sin rotación

    var visible = layerA, standby = layerB;

    setInterval(function () {
      idx = (idx + 1) % list.length;
      standby.src = resolveSrc(list[idx]);
      standby.style.zIndex = '3';
      visible.style.zIndex = '2';
      void standby.offsetWidth;
      standby.style.opacity = '1';               // entra la nueva por encima

      // cuando terminó el fundido, ocultar la vieja y rotar referencias
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
