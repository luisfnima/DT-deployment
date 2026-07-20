/**
 * Bundler loader: desempaqueta assets base64 del manifest embebido en el HTML,
 * inyecta la animación de intro y renderiza la app en el documento.
 *
 * Requiere que animation.js y brands-config.js estén cargados antes.
 *   - window.getAnimationHTML  → animación de cortinas GSAP
 *   - window.BRANDS_CONFIG     → array de marcas del carrusel (editable)
 */

// ── Error handler global ──────────────────────────────────────────────────────
// Se registra ANTES del DOMContentLoaded para capturar errores en cualquier
// fase (incluso después de replaceWith, donde loading es un nodo desconectado).
(function () {
  function showBundlerError(msg) {
    try {
      var div = document.getElementById('__bundler_err_overlay');
      if (!div) {
        div = document.createElement('div');
        div.id = '__bundler_err_overlay';
        div.style.cssText = [
          'position:fixed', 'top:0', 'left:0', 'right:0', 'z-index:9999999',
          'background:#dc2626', 'color:#fff', 'padding:14px 20px',
          'font:13px/1.6 monospace', 'white-space:pre-wrap', 'word-break:break-all',
          'max-height:60vh', 'overflow:auto', 'box-shadow:0 4px 24px rgba(0,0,0,.4)'
        ].join(';');
        var body = document.body || document.documentElement;
        body.insertBefore(div, body.firstChild);
      }
      div.textContent += '⚠  ' + msg + '\n\n';
    } catch (e) { /* imposible mostrar */ }
  }
  window.__showBundlerError = showBundlerError;

  window.onerror = function (msg, src, line, col, err) {
    showBundlerError(msg + (src ? '\n  at ' + src + ':' + line : ''));
    return false;
  };
  window.addEventListener('unhandledrejection', function (e) {
    var reason = e.reason ? (e.reason.message || String(e.reason)) : '(rechazo sin motivo)';
    showBundlerError('Promesa rechazada: ' + reason);
  });

  // React 18 no lanza errores de componente al window, los envía a console.error.
  // Interceptamos console.error para capturar crashes de React visualmente.
  var _origConsoleError = console.error;
  var _reactErrorShown  = false;
  console.error = function () {
    _origConsoleError.apply(console, arguments);
    if (_reactErrorShown) return;
    var msg = Array.from(arguments).map(function(a) {
      return typeof a === 'string' ? a : (a && a.message ? a.message : String(a));
    }).join(' ');
    // Solo mostrar si parece un error crítico de React o JS
    if (
      msg.indexOf('Error') !== -1 ||
      msg.indexOf('error') !== -1 ||
      msg.indexOf('Warning: Each') !== -1
    ) {
      _reactErrorShown = true;
      showBundlerError('Error de React/JS:\n' + msg.slice(0, 500));
      // Resetear después de 3s para permitir nuevos errores distintos
      setTimeout(function() { _reactErrorShown = false; }, 3000);
    }
  };
})();

// ── Bundler principal ─────────────────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', async function () {
  const loading = document.getElementById('__bundler_loading');
  const setStatus = (msg) => { if (loading) loading.textContent = msg; };

  try {
    const manifestEl    = document.querySelector('script[type="__bundler/manifest"]');
    const templateEl    = document.querySelector('script[type="__bundler/template"]');

    if (!manifestEl || !templateEl) {
      setStatus('Error: missing bundle data');
      return;
    }

    const manifest = JSON.parse(manifestEl.textContent);
    let   template = JSON.parse(templateEl.textContent);

    // --- Descomprimir y convertir assets a Blob URLs ---
    const uuids = Object.keys(manifest);
    setStatus('Unpacking ' + uuids.length + ' assets...');

    const blobUrls = {};
    await Promise.all(uuids.map(async (uuid) => {
      const entry = manifest[uuid];
      try {
        const binaryStr = atob(entry.data);
        const bytes = new Uint8Array(binaryStr.length);
        for (let i = 0; i < binaryStr.length; i++) bytes[i] = binaryStr.charCodeAt(i);

        let finalBytes = bytes;
        if (entry.compressed && typeof DecompressionStream !== 'undefined') {
          const ds     = new DecompressionStream('gzip');
          const writer = ds.writable.getWriter();
          const reader = ds.readable.getReader();
          writer.write(bytes);
          writer.close();

          const chunks = [];
          let totalLen = 0;
          while (true) {
            const { done, value } = await reader.read();
            if (done) break;
            chunks.push(value);
            totalLen += value.length;
          }
          finalBytes = new Uint8Array(totalLen);
          let offset = 0;
          for (const chunk of chunks) { finalBytes.set(chunk, offset); offset += chunk.length; }
        }

        blobUrls[uuid] = URL.createObjectURL(new Blob([finalBytes], { type: entry.mime }));
      } catch {
        blobUrls[uuid] = URL.createObjectURL(new Blob([], { type: entry.mime }));
      }
    }));

    // --- Mapear recursos externos ---
    const extResEl     = document.querySelector('script[type="__bundler/ext_resources"]');
    const extResources = extResEl ? JSON.parse(extResEl.textContent) : [];
    const resourceMap  = {};
    for (const entry of extResources) {
      if (blobUrls[entry.uuid]) resourceMap[entry.id] = blobUrls[entry.uuid];
    }

    // --- Reemplazar UUIDs en el template ---
    setStatus('Rendering...');
    for (const uuid of uuids) template = template.split(uuid).join(blobUrls[uuid]);
    template = template
      .replace(/\s+integrity="[^"]*"/gi, '')
      .replace(/\s+crossorigin="[^"]*"/gi, '');

    // --- Inyectar fotos del equipo desde team-config.js ---
    if (Array.isArray(window.TEAM_AVATARS) && window.TEAM_AVATARS.length > 0) {
      try {
        const marker = 'window.__resources ? [window.__resources.avatar1';
        const avatarStart = template.indexOf(marker);
        if (avatarStart >= 0) {
          const parenStart = template.lastIndexOf('(', avatarStart);
          if (parenStart >= 0) {
            let depth = 0, parenEnd = parenStart;
            for (let i = parenStart; i < template.length; i++) {
              if (template[i] === '(') depth++;
              if (template[i] === ')') { depth--; if (depth === 0) { parenEnd = i + 1; break; } }
            }
            if (parenEnd > parenStart) {
              const avatarList = window.TEAM_AVATARS.map(p => '"' + p + '"').join(', ');
              template = template.slice(0, parenStart) + '[' + avatarList + ']' + template.slice(parenEnd);
            }
          }
        }
      } catch (e) {
        console.warn('[bundler] TEAM_AVATARS injection skipped:', e.message);
      }
    }

    // --- Inyectar marcas del carrusel desde brands-config.js ---
    if (Array.isArray(window.BRANDS_CONFIG) && window.BRANDS_CONFIG.length > 0) {
      const brandsStart = template.indexOf('const brands = [');
      const brandsEnd   = template.indexOf('];', brandsStart) + 2;
      if (brandsStart >= 0 && brandsEnd > brandsStart) {
        const brandsLines = window.BRANDS_CONFIG
          .map(b => `  { name: '${b.name}', logo: '${b.logo}' }`)
          .join(',\n');
        const newBrandsArray = 'const brands = [\n' + brandsLines + '\n];';
        template = template.slice(0, brandsStart) + newBrandsArray + template.slice(brandsEnd);
      }
    }

    // --- Inyectar redes sociales desde social-config.js ---
    if (window.SOCIAL_CONFIG && typeof window.SOCIAL_CONFIG === 'object') {
      const sc = window.SOCIAL_CONFIG;
      // Construir la URL de WhatsApp a partir del número (o usar URL directa si incluye 'http')
      const waUrl = sc.whatsapp
        ? (sc.whatsapp.indexOf('http') === 0 ? sc.whatsapp : 'https://wa.me/' + sc.whatsapp)
        : '';
      const socialMap = {
        '__SOCIAL_WHATSAPP__':  waUrl,
        '__SOCIAL_TIKTOK__':    sc.tiktok    || '',
        '__SOCIAL_INSTAGRAM__': sc.instagram || '',
        '__SOCIAL_FACEBOOK__':  sc.facebook  || '',
      };
      for (const [token, url] of Object.entries(socialMap)) {
        if (url) template = template.split(token).join(url);
      }
    }

    // --- Inyectar scripts post-render en el template ---
    const p5Script    = '<script src="js/p5-theme.js"></'       + 'script>';
    const p5Sections  = '<script src="js/p5-sections.js"></'    + 'script>';
    const actScript   = '<script src="js/activities.js"></'     + 'script>';
    const respScript  = '<script src="js/responsive.js"></'     + 'script>';
    const heroCfg     = '<script src="js/hero-config.js"></'    + 'script>';
    const heroScript  = '<script src="js/hero-slideshow.js"></' + 'script>';
    const musicCfg    = '<script src="js/music-config.js"></'   + 'script>';
    const musicScript = '<script src="js/music-player.js"></'   + 'script>';
    // Orden: p5-theme (base) → p5-sections (hero/unete/scroll) → responsive → activities → hero → música
    template = template.replace('</body>',
      p5Script + p5Sections + respScript + actScript + heroCfg + heroScript + musicCfg + musicScript + '</body>');

    // --- Inyectar animación de intro ---
    if (typeof window.getAnimationHTML === 'function') {
      template = template + window.getAnimationHTML();
    }

    // --- Inyectar mapa de recursos en <head> ---
    const resourceScript =
      '<script>window.__resources = ' +
      JSON.stringify(resourceMap).split('</' + 'script>').join('<\\/' + 'script>') +
      ';</' + 'script>';

    const headOpen = template.match(/<head[^>]*>/i);
    if (headOpen) {
      const i = headOpen.index + headOpen[0].length;
      template = template.slice(0, i) + resourceScript + template.slice(i);
    }

    // --- Reemplazar documento con el template desempaquetado ---
    const doc = new DOMParser().parseFromString(template, 'text/html');
    document.documentElement.replaceWith(doc.documentElement);

    // Re-ejecutar scripts (DOMParser no los ejecuta automáticamente)
    const dead = Array.from(document.scripts);
    for (const old of dead) {
      const s = document.createElement('script');
      for (const a of old.attributes) s.setAttribute(a.name, a.value);
      s.textContent = old.textContent;

      if ((s.type === 'text/babel' || s.type === 'text/jsx') && s.src) {
        const r = await fetch(s.src);
        s.textContent = await r.text();
        s.removeAttribute('src');
      }

      const p = s.src ? new Promise((r) => { s.onload = s.onerror = r; }) : null;
      old.replaceWith(s);
      if (p) await p;
    }

    if (window.Babel && typeof window.Babel.transformScriptTags === 'function') {
      try {
        window.Babel.transformScriptTags();
      } catch (babelErr) {
        if (typeof window.__showBundlerError === 'function') {
          window.__showBundlerError('Error de compilación Babel:\n' + babelErr.message);
        }
      }
    }

  } catch (err) {
    setStatus('Error unpacking: ' + err.message);
    if (typeof window.__showBundlerError === 'function') {
      window.__showBundlerError('Error del bundler:\n' + err.message);
    }
  }
});


