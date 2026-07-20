// DreamTeam Colaboradores Inline Dropdown Login Script (Body-Appended version to avoid React detachment)
(function() {
  var activeDropdown = null;

  function navigateToColaboradores() {
    document.body.style.transition = 'opacity 0.4s ease, transform 0.4s ease';
    document.body.style.opacity = '0';
    document.body.style.transform = 'translateY(-16px)';
    setTimeout(function() {
      window.location.href = 'colaboradores.html';
    }, 400);
  }

  function injectDropdown(btnEl) {
    try {
      if (document.getElementById('dt-login-dropdown')) return;

      var rect = btnEl.getBoundingClientRect();
      var dropdownWidth = 320;
      var topPos = rect.bottom + 14 + window.scrollY;
      var leftPos = rect.right - dropdownWidth + window.scrollX;

      // Create the dropdown card container
      var dropdown = document.createElement('div');
      dropdown.id = 'dt-login-dropdown';
      dropdown.style.cssText = "display: flex; flex-direction: column; position: absolute; top: " + topPos + "px; left: " + leftPos + "px; width: " + dropdownWidth + "px; background: #000000; border: 1px solid rgba(255, 255, 255, 0.15); border-radius: 16px; padding: 24px; box-shadow: 0 20px 50px rgba(0, 0, 0, 0.85); z-index: 9999999; font-family: 'Outfit', sans-serif; animation: dropdownSlideIn 0.25s cubic-bezier(0.16, 1, 0.3, 1); box-sizing: border-box; color: #ffffff;";
      
      var markup = '' +
        '<!-- Triangular Arrow -->' +
        '<div style="position: absolute; top: -7px; right: 35px; width: 12px; height: 12px; background: #000000; border-top: 1px solid rgba(255, 255, 255, 0.15); border-left: 1px solid rgba(255, 255, 255, 0.15); transform: rotate(45deg); z-index: 1;"></div>' +
        
        '<div style="text-align: center; margin-bottom: 18px; position: relative; z-index: 2;">' +
          '<h3 style="font-size: 16px; font-weight: 700; color: #ffffff; letter-spacing: -0.3px;">Acceso Asesores</h3>' +
          '<p style="font-size: 11px; color: #94a3b8; margin-top: 2px;">Ingresa tus credenciales comerciales</p>' +
        '</div>' +
        
        '<div id="dt-dropdown-error" style="display: none; background: rgba(239, 68, 68, 0.12); border: 1px solid rgba(239, 68, 68, 0.25); color: #f87171; padding: 8px 10px; border-radius: 6px; font-size: 11px; font-weight: 600; margin-bottom: 14px; text-align: center; position: relative; z-index: 2;">Credenciales incorrectas.</div>' +
        
        '<form id="dt-dropdown-form" style="display: flex; flex-direction: column; gap: 12px; width: 100%; box-sizing: border-box; position: relative; z-index: 2;">' +
          '<div style="display: flex; flex-direction: column; gap: 4px;">' +
            '<label style="font-size: 9px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.5px; color: #94a3b8; text-align: left;">Usuario</label>' +
            '<input type="text" id="dt-dropdown-user" placeholder="ej. asesor" required style="width: 100%; background: #111111; border: 1px solid rgba(255,255,255,0.15); border-radius: 8px; padding: 9px 12px; font-size: 13px; color: #ffffff; outline: none; transition: border-color 0.2s; box-sizing: border-box;">' +
          '</div>' +
          
          '<div style="display: flex; flex-direction: column; gap: 4px;">' +
            '<label style="font-size: 9px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.5px; color: #94a3b8; text-align: left;">Contraseña</label>' +
            '<input type="password" id="dt-dropdown-pass" placeholder="••••••••" required style="width: 100%; background: #111111; border: 1px solid rgba(255,255,255,0.15); border-radius: 8px; padding: 9px 12px; font-size: 13px; color: #ffffff; outline: none; transition: border-color 0.2s; box-sizing: border-box;">' +
          '</div>' +
          
          '<div style="display: flex; justify-content: space-between; align-items: center; font-size: 11px; margin-top: 2px; box-sizing: border-box;">' +
            '<label style="display: flex; align-items: center; gap: 4px; color: #94a3b8; cursor: pointer; user-select: none;">' +
              '<input type="checkbox" style="accent-color: #cc181e; cursor: pointer;"> Recordar' +
            '</label>' +
            '<a href="#" id="dt-dropdown-forgot" style="color: #cc181e; text-decoration: none; font-weight: 600;">¿Olvidó clave?</a>' +
          '</div>' +
          
          '<button type="submit" style="width: 100%; background: #cc181e; color: white; border: none; border-radius: 8px; padding: 10px; font-size: 13px; font-weight: 700; cursor: pointer; transition: all 0.2s; margin-top: 4px; box-sizing: border-box;">Ingresar</button>' +
        '</form>' +
        
        '<style>' +
          '@keyframes dropdownSlideIn {' +
            'from { opacity: 0; transform: translateY(-12px) scale(0.95); }' +
            'to { opacity: 1; transform: translateY(0) scale(1); }' +
          '}' +
        '</style>';

      dropdown.innerHTML = markup;
      document.body.appendChild(dropdown);
      activeDropdown = dropdown;

      // Event Listeners inside dropdown
      var form = document.getElementById('dt-dropdown-form');
      var errorBox = document.getElementById('dt-dropdown-error');
      var userInput = document.getElementById('dt-dropdown-user');
      var passInput = document.getElementById('dt-dropdown-pass');
      var forgotLink = document.getElementById('dt-dropdown-forgot');

      forgotLink.addEventListener('click', function(e) {
        e.preventDefault();
        alert('Por favor contacta con soporte para recuperar tus accesos.');
      });

      form.addEventListener('submit', function(e) {
        e.preventDefault();
        var userKey = userInput.value.trim().toLowerCase();
        if (userKey.indexOf('@') >= 0) {
          userKey = userKey.split('@')[0];
        }
        var passVal = passInput.value;

        var CREDENTIALS = {
          admin: { pass: "DT2026ADMIN", role: "admin", name: "Administrador" },
          asesor: { pass: "dreamteam2026", role: "asesor", name: "Asesor Comercial" }
        };

        if (CREDENTIALS[userKey] && CREDENTIALS[userKey].pass === passVal) {
          var user = CREDENTIALS[userKey];
          sessionStorage.setItem('dt_user', userKey);
          sessionStorage.setItem('dt_role', user.role);
          sessionStorage.setItem('dt_name', user.name);
          
          errorBox.style.display = 'none';
          navigateToColaboradores();
        } else {
          errorBox.style.display = 'block';
          passInput.value = '';
        }
      });

      // Recalculate position on window resize or scroll to stay attached
      var handleResize = function() {
        if (!activeDropdown) return;
        var r = btnEl.getBoundingClientRect();
        activeDropdown.style.top = (r.bottom + 14 + window.scrollY) + 'px';
        activeDropdown.style.left = (r.right - dropdownWidth + window.scrollX) + 'px';
      };
      window.addEventListener('resize', handleResize);
      window.addEventListener('scroll', handleResize);

    } catch (err) {
      console.error("Error in injectDropdown:", err);
    }
  }

  function closeDropdown() {
    if (activeDropdown) {
      if (activeDropdown.parentNode) {
        activeDropdown.parentNode.removeChild(activeDropdown);
      }
      activeDropdown = null;
    }
  }


  // Intercept click on document in capture phase
  document.addEventListener('click', function(e) {
    try {
      var el = e.target;
      var insideDropdown = false;
      var clickedButton = false;
      var targetButtonEl = null;

      // Traversal to identify context
      var temp = el;
      while (temp && temp !== document && temp !== document.body) {
        if (temp.id === 'dt-login-dropdown') {
          insideDropdown = true;
        }
        if (temp.tagName === 'A' || temp.tagName === 'BUTTON') {
          var text = (temp.textContent || '').toLowerCase();
          var id = temp.id || '';
          var href = (temp.getAttribute && typeof temp.getAttribute === 'function' ? temp.getAttribute('href') : '') || '';

          if (
            text.indexOf('colaboradores') >= 0 || 
            text.indexOf('intranet') >= 0 ||
            id === 'intranet-btn' || 
            id === 'colaboradores-btn' ||
            href.indexOf('#colaboradores') >= 0 ||
            href.indexOf('colaboradores.html') >= 0
          ) {
            clickedButton = true;
            targetButtonEl = temp;
            break; // Only break if we successfully matched a trigger button
          }
        }
        temp = temp.parentNode;
      }

      console.log("[DEBUG] click event:", el.tagName, "id:", el.id, "insideDropdown:", insideDropdown, "clickedButton:", clickedButton);


      if (clickedButton) {
        e.preventDefault();
        e.stopPropagation();

        var savedRole = sessionStorage.getItem('dt_role');
        if (savedRole) {
          navigateToColaboradores();
          return false;
        }

        if (activeDropdown) {
          closeDropdown();
        } else if (targetButtonEl) {
          injectDropdown(targetButtonEl);
        }
        return false;
      }

      // Close dropdown if clicked outside of it
      if (!insideDropdown && activeDropdown) {
        closeDropdown();
      }
    } catch (err) {
      console.error("Error in dropdown click handler:", err);
    }
  }, true);

  window.__modal_script_loaded = true;
})();
