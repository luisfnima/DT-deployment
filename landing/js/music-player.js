/**
 * music-player.js — DreamTeam
 * ----------------------------------------------------------------
 * Reproductor de música de fondo con botón flotante estilo Persona 5.
 *
 *   · Lee la canción desde window.MUSIC_CONFIG (js/music-config.js)
 *   · Botón fijo abajo-izquierda, siempre visible al hacer scroll
 *   · Click → enciende / apaga la música
 *   · Mientras suena: emanan notas musicales (♪ ♫ ♬) del botón
 *   · Los navegadores bloquean el autoplay con sonido, así que si
 *     autoplay=true la música arranca con la primera interacción
 *     del visitante (click / tap / tecla) en cualquier parte.
 *   · Recuerda la elección del visitante durante la sesión
 *     (si la apagó, no vuelve a sonar al navegar/recargar).
 */
(function () {
  'use strict';

  var cfg = window.MUSIC_CONFIG || {};
  if (!cfg.file) return;                       // sin canción configurada → nada que hacer

  var STORE_KEY = 'dt_music_state';            // 'on' | 'off'
  var NOTES     = ['♪', '♫', '♬', '♩'];

  var audio = null;
  var playing = false;
  var noteTimer = null;
  var pendingInteraction = false;

  /* ═══════════════════════════════════════════════════════════════
     AUDIO
  ═══════════════════════════════════════════════════════════════ */
  function buildAudio() {
    audio = new Audio(cfg.file);
    audio.loop    = cfg.loop !== false;
    audio.preload = 'auto';
    var vol = typeof cfg.volume === 'number' ? cfg.volume : 0.35;
    audio.volume  = Math.min(1, Math.max(0, vol));
    audio.addEventListener('ended', function () {
      if (!audio.loop) setPlaying(false);
    });
  }

  /* ═══════════════════════════════════════════════════════════════
     ESTILOS + BOTÓN
  ═══════════════════════════════════════════════════════════════ */
  var CSS = [
    '#dt-music-btn{',
    '  position:fixed;left:22px;bottom:22px;z-index:99990;',
    '  width:56px;height:56px;border-radius:50%;',
    '  background:#e60013;border:2px solid #000;',
    '  box-shadow:4px 4px 0 #000;cursor:pointer;',
    '  display:flex;align-items:center;justify-content:center;',
    '  color:#fff;padding:0;outline:none;',
    '  transition:transform .15s,box-shadow .15s,background .25s;',
    '}',
    '#dt-music-btn:hover{transform:translate(-2px,-2px);box-shadow:6px 6px 0 #000}',
    '#dt-music-btn:active{transform:translate(1px,1px);box-shadow:2px 2px 0 #000}',
    '#dt-music-btn svg{width:24px;height:24px;pointer-events:none}',

    /* icono que "baila" mientras suena */
    '#dt-music-btn.playing svg{animation:dtMusicBop 1s ease-in-out infinite}',
    '@keyframes dtMusicBop{',
    '  0%,100%{transform:rotate(-8deg) scale(1)}',
    '  50%{transform:rotate(8deg) scale(1.14)}',
    '}',

    /* estado apagado: gris con barra roja diagonal */
    '#dt-music-btn.off{background:#1c1c1c;color:rgba(255,255,255,.45)}',
    '#dt-music-btn.off::after{',
    '  content:"";position:absolute;width:62%;height:3px;',
    '  background:#e60013;transform:rotate(-45deg);border-radius:2px;',
    '  box-shadow:0 0 0 1.5px rgba(0,0,0,.5);pointer-events:none;',
    '}',

    /* contenedor de notas que flotan */
    '#dt-music-notes{',
    '  position:fixed;left:14px;bottom:78px;width:72px;height:180px;',
    '  pointer-events:none;z-index:99989;overflow:visible;',
    '}',
    '.dt-note{',
    '  position:absolute;bottom:0;left:50%;',
    '  font-size:var(--sz,18px);color:#e60013;',
    '  text-shadow:1.5px 1.5px 0 #000;font-weight:700;',
    '  animation:dtNoteFloat var(--dur,1.9s) ease-out forwards;',
    '  will-change:transform,opacity;',
    '}',
    '@keyframes dtNoteFloat{',
    '  0%{transform:translate(-50%,0) rotate(0deg) scale(.6);opacity:0}',
    '  12%{opacity:1}',
    '  100%{transform:translate(calc(-50% + var(--dx,0px)),-160px) rotate(var(--rot,20deg)) scale(1.1);opacity:0}',
    '}',

    /* móvil: no tapar contenido, un poco más pequeño */
    '@media(max-width:768px){',
    '  #dt-music-btn{width:48px;height:48px;left:16px;bottom:16px}',
    '  #dt-music-btn svg{width:20px;height:20px}',
    '  #dt-music-notes{left:10px;bottom:66px}',
    '}',
  ].join('\n');

  var ICON_NOTE =
    '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">' +
    '<path d="M9 18V5l12-2v13"/><circle cx="6" cy="18" r="3"/><circle cx="18" cy="16" r="3"/></svg>';

  var btn, notesWrap;

  function buildUI() {
    if (document.getElementById('dt-music-btn')) return;

    var style = document.createElement('style');
    style.id = 'dt-music-style';
    style.textContent = CSS;
    document.head.appendChild(style);

    notesWrap = document.createElement('div');
    notesWrap.id = 'dt-music-notes';

    btn = document.createElement('button');
    btn.id = 'dt-music-btn';
    btn.className = 'off';
    btn.type = 'button';
    btn.title = cfg.title || 'Música de fondo';
    btn.setAttribute('aria-label', 'Encender música de fondo');
    btn.innerHTML = ICON_NOTE;
    btn.addEventListener('click', function (e) {
      e.stopPropagation();
      toggle();
    });

    document.body.appendChild(notesWrap);
    document.body.appendChild(btn);
  }

  /* ═══════════════════════════════════════════════════════════════
     NOTAS MUSICALES FLOTANTES
  ═══════════════════════════════════════════════════════════════ */
  function spawnNote() {
    if (!notesWrap) return;
    var n = document.createElement('span');
    n.className = 'dt-note';
    n.textContent = NOTES[Math.floor(Math.random() * NOTES.length)];
    n.style.setProperty('--dx',  (Math.random() * 56 - 28).toFixed(0) + 'px');
    n.style.setProperty('--rot', (Math.random() * 50 - 25).toFixed(0) + 'deg');
    n.style.setProperty('--sz',  (15 + Math.random() * 9).toFixed(0) + 'px');
    n.style.setProperty('--dur', (1.6 + Math.random() * 0.8).toFixed(2) + 's');
    notesWrap.appendChild(n);
    n.addEventListener('animationend', function () { n.remove(); });
    /* red de seguridad por si animationend no dispara */
    setTimeout(function () { if (n.parentNode) n.remove(); }, 3000);
  }

  function startNotes() {
    if (noteTimer) return;
    spawnNote();
    noteTimer = setInterval(spawnNote, 620);
  }
  function stopNotes() {
    if (noteTimer) { clearInterval(noteTimer); noteTimer = null; }
  }

  /* ═══════════════════════════════════════════════════════════════
     PLAY / PAUSE
  ═══════════════════════════════════════════════════════════════ */
  function setPlaying(state) {
    playing = state;
    if (!btn) return;
    if (playing) {
      btn.classList.add('playing');
      btn.classList.remove('off');
      btn.setAttribute('aria-label', 'Apagar música de fondo');
      startNotes();
    } else {
      btn.classList.remove('playing');
      btn.classList.add('off');
      btn.setAttribute('aria-label', 'Encender música de fondo');
      stopNotes();
    }
  }

  function play() {
    if (!audio) buildAudio();
    var p = audio.play();
    if (p && typeof p.then === 'function') {
      p.then(function () {
        setPlaying(true);
        saveState('on');
      }).catch(function () {
        /* autoplay bloqueado por el navegador → esperar 1ª interacción */
        waitForInteraction();
      });
    } else {
      setPlaying(true);
      saveState('on');
    }
  }

  function pause() {
    if (audio) audio.pause();
    setPlaying(false);
    saveState('off');
  }

  function toggle() {
    pendingInteraction = false;      // el click al botón cuenta como decisión explícita
    if (playing) pause(); else play();
  }

  function saveState(v) {
    try { sessionStorage.setItem(STORE_KEY, v); } catch (e) {}
  }
  function savedState() {
    try { return sessionStorage.getItem(STORE_KEY); } catch (e) { return null; }
  }

  /* ── Autoplay bloqueado: arrancar con la primera interacción ──
     Los navegadores exigen un gesto del usuario para permitir audio.
     Escuchamos TODO tipo de gesto (click, tap, tecla, scroll, mover
     el mouse) para arrancar la música lo antes posible.            */
  function waitForInteraction() {
    if (pendingInteraction) return;
    pendingInteraction = true;
    var events = ['pointerdown', 'pointermove', 'keydown', 'touchstart', 'click', 'wheel', 'scroll'];
    function onFirst() {
      if (!pendingInteraction) return;
      pendingInteraction = false;
      events.forEach(function (ev) { document.removeEventListener(ev, onFirst, true); });
      /* si mientras tanto el visitante la apagó con el botón, respetar */
      if (savedState() === 'off') return;
      play();
    }
    events.forEach(function (ev) {
      document.addEventListener(ev, onFirst, true);
    });
  }

  /* ═══════════════════════════════════════════════════════════════
     INIT
  ═══════════════════════════════════════════════════════════════ */
  function init() {
    buildUI();
    buildAudio();

    var saved = savedState();
    if (saved === 'off') return;                       // el visitante la apagó antes
    if (cfg.autoplay !== false || saved === 'on') {
      play();                                          // intento inmediato al abrir

      /* Reintentos: algunos navegadores permiten el audio tras unos
         instantes (Media Engagement) o al volver a la pestaña */
      var retries = 0;
      var retryTimer = setInterval(function () {
        if (playing || savedState() === 'off' || ++retries > 5) {
          clearInterval(retryTimer);
          return;
        }
        if (audio && audio.paused) {
          audio.play().then(function () {
            setPlaying(true);
            saveState('on');
          }).catch(function () { /* seguirá bloqueado hasta un gesto */ });
        }
      }, 800);

      document.addEventListener('visibilitychange', function () {
        if (!document.hidden && !playing && savedState() !== 'off' && audio && audio.paused) {
          audio.play().then(function () { setPlaying(true); saveState('on'); }).catch(function () {});
        }
      });
    }
  }

  /* Arrancar lo antes posible (el script se inyecta al final del body) */
  if (document.readyState !== 'loading') {
    init();
  } else {
    document.addEventListener('DOMContentLoaded', init);
  }

})();
