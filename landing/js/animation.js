/**
 * Animación de intro estilo Persona 5.
 * - Solo se reproduce en la PRIMERA visita de cada sesión (sessionStorage).
 * - Logo desde images/dreamlogo.png (local).
 * - Pura CSS: sin GSAP ni dependencias externas.
 */
window.getAnimationHTML = function () {
  return `
    <style>
      /* ── Variables P5 ─────────────────────────────────── */
      :root {
        --p5-red:  #e60013;
        --p5-ink:  #0a0a0a;
        --p5-paper:#f3efe6;
      }

      /* ── Contenedor del intro ─────────────────────────── */
      #p5-intro {
        position: fixed; inset: 0;
        z-index: 999999;
        background: var(--p5-ink);
        display: flex; align-items: center; justify-content: center;
        overflow: hidden;
        pointer-events: auto;
      }
      #p5-intro.p5-gone {
        animation: p5IntroOut 0.6s cubic-bezier(.7,0,.3,1) forwards;
      }
      @keyframes p5IntroOut {
        to { transform: translateY(-100%); }
      }

      /* ── Panel rojo que barre la pantalla ─────────────── */
      #p5-intro .p5-panel {
        position: absolute; inset: 0;
        background: var(--p5-red);
        clip-path: polygon(0 0, 100% 0, 100% 0, 0 0);
        animation: p5PanWipe 1.9s cubic-bezier(.7,0,.3,1) forwards;
      }
      @keyframes p5PanWipe {
        0%   { clip-path: polygon(0 0, 100% 0, 100% 0,    0 0); }
        35%  { clip-path: polygon(0 0, 100% 0, 100% 100%, 0 100%); }
        70%  { clip-path: polygon(0 100%, 100% 100%, 100% 100%, 0 100%); }
        100% { clip-path: polygon(0 100%, 100% 100%, 100% 100%, 0 100%); }
      }

      /* ── Estrella Persona 5 (clip-path 9 puntas) ─────── */
      #p5-intro .p5-star {
        width: 220px; height: 220px;
        position: absolute;
        clip-path: polygon(50% 0%,61% 35%,98% 35%,68% 57%,79% 91%,50% 70%,21% 91%,32% 57%,2% 35%,39% 35%);
        background: #000;
        opacity: 0.85;
        animation: p5StarSpin 1.9s cubic-bezier(.5,0,.2,1) forwards;
      }
      @keyframes p5StarSpin {
        0%   { transform: scale(0) rotate(-120deg); opacity: 0; }
        30%  { transform: scale(1.15) rotate(0);    opacity: 1; }
        70%  { transform: scale(1)    rotate(0);    opacity: 1; }
        100% { transform: scale(6)    rotate(40deg); opacity: 0; }
      }

      /* ── Texto centrado ───────────────────────────────── */
      #p5-intro .p5-word {
        position: relative; z-index: 3;
        text-align: center;
        pointer-events: none;
      }
      #p5-intro .p5-t1 {
        font-family: 'Anton', 'Impact', sans-serif;
        text-transform: uppercase;
        color: #fff;
        font-size: clamp(56px, 13vw, 160px);
        line-height: 0.85;
        letter-spacing: 2px;
        opacity: 0;
        transform: translateX(-60px) skewX(-12deg);
        animation: p5WordIn .5s .35s cubic-bezier(.2,1,.3,1) forwards,
                   p5WordOut .4s 1.5s forwards;
      }
      #p5-intro .p5-t1 em {
        color: #000; font-style: italic;
      }
      #p5-intro .p5-t2 {
        font-family: 'Oswald', 'DM Sans', sans-serif;
        font-weight: 700;
        text-transform: uppercase;
        letter-spacing: 6px;
        color: #fff;
        font-size: clamp(11px, 1.8vw, 18px);
        margin-top: 14px;
        opacity: 0;
        transform: translateX(60px);
        animation: p5WordIn .5s .6s cubic-bezier(.2,1,.3,1) forwards,
                   p5WordOut .4s 1.5s forwards;
      }
      @keyframes p5WordIn  { to { opacity: 1; transform: none; } }
      @keyframes p5WordOut { to { opacity: 0; transform: translateY(-30px) skewX(-12deg); } }

      /* ── Logo (opcional, debajo del texto) ───────────── */
      #p5-intro .p5-logo {
        display: block;
        width: 80px; height: auto;
        margin: 0 auto 20px;
        filter: brightness(0) invert(1);
        opacity: 0;
        animation: p5WordIn .5s .2s cubic-bezier(.2,1,.3,1) forwards,
                   p5WordOut .4s 1.45s forwards;
      }

      /* ── Botón saltar ────────────────────────────────── */
      #p5-skip-btn {
        position: absolute; bottom: 26px; right: 30px; z-index: 5;
        background: none; border: none;
        color: rgba(255,255,255,0.6);
        font-family: 'Oswald', sans-serif;
        text-transform: uppercase; letter-spacing: 2px; font-size: 13px;
        cursor: pointer; transition: color 0.2s; padding: 4px 8px;
      }
      #p5-skip-btn:hover { color: var(--p5-red); }
    </style>

    <div id="p5-intro">
      <div class="p5-panel"></div>
      <div class="p5-star"></div>
      <div class="p5-word">
        <img class="p5-logo" src="images/dreamlogo.png" alt="DreamTeam">
        <div class="p5-t1">DREAM<em>TEAM</em></div>
        <div class="p5-t2">Take Your Heart &nbsp;·&nbsp; Televentas España</div>
      </div>
      <button id="p5-skip-btn">Saltar ✕</button>
    </div>

    <script>
      (function () {
        var DT_KEY = 'dt_intro_played';
        var intro   = document.getElementById('p5-intro');
        if (!intro) return;

        /* ── Animación de salida al pulsar "Intranet" ── */
        function attachExitAnim() {
          var els = document.querySelectorAll('a, button');
          var attached = false;
          els.forEach(function (el) {
            if (el.textContent.toLowerCase().indexOf('intranet') >= 0 || el.id === 'intranet-btn') {
              el.addEventListener('click', function (e) {
                e.preventDefault();
                document.body.style.transition = 'opacity 0.8s ease, transform 0.8s ease';
                document.body.style.opacity    = '0';
                document.body.style.transform  = 'scale(0.98)';
                setTimeout(function () {
                  window.location.href = 'colaboradores.html';
                }, 820);
              });
              attached = true;
            }
          });
          if (!attached) setTimeout(attachExitAnim, 500);
        }

        /* ── Si ya se reprodujo, omitir ── */
        try {
          if (sessionStorage.getItem(DT_KEY)) {
            intro.style.display = 'none';
            setTimeout(attachExitAnim, 200);
            return;
          }
        } catch (e) {}

        /* ── Función de cierre ── */
        function dismiss() {
          if (intro.classList.contains('p5-gone')) return;
          intro.classList.add('p5-gone');
          setTimeout(function () {
            intro.remove();
            try { sessionStorage.setItem(DT_KEY, '1'); } catch (e) {}
            attachExitAnim();
          }, 620);
        }

        /* ── Skip button ── */
        var skipBtn = document.getElementById('p5-skip-btn');
        if (skipBtn) skipBtn.onclick = dismiss;

        /* ── Auto-dismiss después de la animación ── */
        setTimeout(dismiss, 2100);

      })();
    </script>
  `;
};
