(function() {
    // Avoid double injection
    if (window.__DreamTeamPermissionWidgetLoaded) return;
    window.__DreamTeamPermissionWidgetLoaded = true;

    // 1. Inject Styles
    const styles = `
        #dt-widget-container {
            position: fixed;
            bottom: 24px;
            right: 24px;
            z-index: 999999;
            font-family: 'Outfit', -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
            color: #f3efe6;
        }
        #dt-widget-trigger {
            width: 56px;
            height: 56px;
            border-radius: 50%;
            background: #e60013;
            box-shadow: 0 8px 24px rgba(230, 0, 19, 0.4);
            border: none;
            cursor: pointer;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 24px;
            transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        }
        #dt-widget-trigger:hover {
            transform: scale(1.1) rotate(10deg);
            box-shadow: 0 12px 32px rgba(230, 0, 19, 0.6);
            background: #ff1a2e;
        }
        #dt-widget-trigger:active {
            transform: scale(0.95);
        }
        #dt-widget-panel {
            position: absolute;
            bottom: 72px;
            right: 0;
            width: 320px;
            background: rgba(15, 15, 15, 0.95);
            backdrop-filter: blur(16px);
            -webkit-backdrop-filter: blur(16px);
            border: 1px solid rgba(230, 0, 19, 0.2);
            border-radius: 16px;
            box-shadow: 0 16px 48px rgba(0,0,0,0.6);
            padding: 20px;
            display: none;
            opacity: 0;
            transform: translateY(10px);
            transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        }
        #dt-widget-panel.open {
            display: block;
            opacity: 1;
            transform: translateY(0);
        }
        .dt-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 16px;
            border-bottom: 1px solid rgba(255,255,255,0.08);
            padding-bottom: 10px;
        }
        .dt-title {
            font-size: 14px;
            font-weight: 700;
            text-transform: uppercase;
            letter-spacing: 0.5px;
            color: #f3efe6;
            display: flex;
            align-items: center;
            gap: 6px;
        }
        .dt-logo-dot {
            width: 6px;
            height: 6px;
            background: #e60013;
            border-radius: 50%;
            box-shadow: 0 0 6px #e60013;
        }
        .dt-close {
            background: transparent;
            border: none;
            color: #8e8a80;
            font-size: 16px;
            cursor: pointer;
            transition: color 0.2s;
        }
        .dt-close:hover {
            color: #f3efe6;
        }
        .dt-form-group {
            margin-bottom: 12px;
        }
        .dt-label {
            display: block;
            font-size: 10px;
            text-transform: uppercase;
            font-weight: 700;
            color: #8e8a80;
            margin-bottom: 4px;
            letter-spacing: 0.5px;
        }
        .dt-input, .dt-select {
            width: 100%;
            background: rgba(0,0,0,0.5);
            border: 1px solid rgba(230, 0, 19, 0.15);
            border-radius: 8px;
            padding: 8px 10px;
            font-size: 12px;
            color: #f3efe6;
            outline: none;
            transition: all 0.3s;
        }
        .dt-input:focus, .dt-select:focus {
            border-color: #e60013;
            box-shadow: 0 0 8px rgba(230,0,19,0.2);
            background: #000;
        }
        .dt-row {
            display: flex;
            gap: 8px;
            margin-bottom: 12px;
        }
        .dt-col {
            flex: 1;
        }
        .dt-slider-container {
            margin-bottom: 10px;
        }
        .dt-slider-header {
            display: flex;
            justify-content: space-between;
            font-size: 9px;
            color: #8e8a80;
            margin-bottom: 3px;
            font-weight: 700;
            text-transform: uppercase;
        }
        .dt-slider {
            width: 100%;
            height: 3px;
            background: #2a2a2a;
            outline: none;
            border-radius: 2px;
            -webkit-appearance: none;
            accent-color: #e60013;
        }
        .dt-btn-group {
            display: flex;
            gap: 8px;
            margin-top: 14px;
        }
        .dt-btn {
            flex: 1;
            border: none;
            border-radius: 8px;
            padding: 10px;
            font-size: 11px;
            font-weight: 700;
            cursor: pointer;
            text-transform: uppercase;
            transition: all 0.2s;
        }
        .dt-btn-play {
            background: #e60013;
            color: white;
            box-shadow: 0 4px 12px rgba(230,0,19,0.15);
        }
        .dt-btn-play:hover {
            background: #ff1a2e;
            transform: translateY(-1px);
        }
        .dt-btn-stop {
            background: rgba(255,255,255,0.08);
            border: 1px solid rgba(255,255,255,0.1);
            color: #f3efe6;
        }
        .dt-btn-stop:hover {
            background: rgba(255,255,255,0.15);
        }
    `;

    const styleEl = document.createElement('style');
    styleEl.innerHTML = styles;
    document.head.appendChild(styleEl);

    // 2. Create Markup
    const container = document.createElement('div');
    container.id = 'dt-widget-container';
    container.innerHTML = `
        <button id="dt-widget-trigger" title="Permiso de Llamada">📞</button>
        <div id="dt-widget-panel">
            <div class="dt-header">
                <div class="dt-title">
                    <div class="dt-logo-dot"></div>
                    Permiso de Llamada
                </div>
                <button class="dt-close" id="dt-widget-close">×</button>
            </div>
            
            <div class="dt-form-group">
                <label class="dt-label">Compañía / Marca</label>
                <select class="dt-select" id="dt-widget-company">
                    <option value="yoigo" selected>Yoigo</option>
                    <option value="digi">Digi</option>
                    <option value="pepephone">Pepephone</option>
                    <option value="masmovil">MásMóvil</option>
                    <option value="vodafone">Vodafone</option>
                    <option value="populoos">Populoos</option>
                </select>
            </div>

            <div class="dt-row">
                <div class="dt-col">
                    <label class="dt-label">Música de Fondo</label>
                    <select class="dt-select" id="dt-widget-style">
                        <option value="0">Corporate Lounge</option>
                        <option value="1">Rhodes Jazz</option>
                        <option value="2">Ambient Chillout</option>
                        <option value="3">Electro House</option>
                        <option value="4">Acoustic Melody</option>
                        <option value="5">Space Future</option>
                    </select>
                </div>
                <div class="dt-col">
                    <label class="dt-label">Velocidad Voz</label>
                    <select class="dt-select" id="dt-widget-rate">
                        <option value="+0%">Normal (+0%)</option>
                        <option value="+15%" selected>Predeterminado (+15%)</option>
                        <option value="+30%">Rápido (+30%)</option>
                        <option value="+45%">Muy Rápido (+45%)</option>
                    </select>
                </div>
            </div>

            <div class="dt-form-group">
                <label class="dt-label">Nombre del Cliente</label>
                <input type="text" class="dt-input" id="dt-widget-client" placeholder="ej. Juan Pérez" value="Cliente">
            </div>

            <div class="dt-slider-container">
                <div class="dt-slider-header">
                    <span>Volumen Locución</span>
                    <span id="dt-val-loc">1.0x</span>
                </div>
                <input type="range" class="dt-slider" id="dt-slider-loc" min="0.0" max="1.5" step="0.1" value="1.0">
            </div>

            <div class="dt-slider-container">
                <div class="dt-slider-header">
                    <span>Volumen Música</span>
                    <span id="dt-val-bg">0.12x</span>
                </div>
                <input type="range" class="dt-slider" id="dt-slider-bg" min="0.0" max="0.5" step="0.02" value="0.12">
            </div>

            <div class="dt-btn-group">
                <button class="dt-btn dt-btn-stop" id="dt-btn-stop">Detener</button>
                <button class="dt-btn dt-btn-play" id="dt-btn-play">Reproducir</button>
            </div>
        </div>
    `;
    document.body.appendChild(container);

    // 3. Elements and Listeners
    const trigger = document.getElementById('dt-widget-trigger');
    const panel = document.getElementById('dt-widget-panel');
    const closeBtn = document.getElementById('dt-widget-close');
    
    const companySel = document.getElementById('dt-widget-company');
    const styleSel = document.getElementById('dt-widget-style');
    const rateSel = document.getElementById('dt-widget-rate');
    const clientInput = document.getElementById('dt-widget-client');
    
    const sliderLoc = document.getElementById('dt-slider-loc');
    const valLoc = document.getElementById('dt-val-loc');
    const sliderBg = document.getElementById('dt-slider-bg');
    const valBg = document.getElementById('dt-val-bg');
    
    const playBtn = document.getElementById('dt-btn-play');
    const stopBtn = document.getElementById('dt-btn-stop');

    // Toggle panel
    trigger.addEventListener('click', () => {
        panel.classList.toggle('open');
    });

    closeBtn.addEventListener('click', () => {
        panel.classList.remove('open');
    });

    // Slider display updates and on-the-fly volume changes
    const updateVolumesOnServer = () => {
        const vol_ann = parseFloat(sliderLoc.value);
        const vol_bg = parseFloat(sliderBg.value);
        fetch('http://localhost:5005/api/config', {
            method: 'POST',
            mode: 'cors',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ vol_ann, vol_bg })
        }).catch(err => console.warn('Failed to sync volumes with background server:', err));
    };

    sliderLoc.addEventListener('input', (e) => {
        valLoc.textContent = `${parseFloat(e.target.value).toFixed(1)}x`;
        updateVolumesOnServer();
    });

    sliderBg.addEventListener('input', (e) => {
        valBg.textContent = `${parseFloat(e.target.value).toFixed(2)}x`;
        updateVolumesOnServer();
    });

    // Play action trigger
    playBtn.addEventListener('click', () => {
        playBtn.textContent = 'Procesando...';
        playBtn.disabled = true;

        const payload = {
            company: companySel.value,
            bg_music_style: parseInt(styleSel.value),
            voice_rate: rateSel.value,
            client_name: clientInput.value || 'Cliente'
        };

        fetch('http://localhost:5005/api/play', {
            method: 'POST',
            mode: 'cors',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        })
        .then(() => {
            playBtn.textContent = 'Reproducir';
            playBtn.disabled = false;
        })
        .catch(err => {
            console.error('Play API Error:', err);
            playBtn.textContent = 'Error';
            setTimeout(() => {
                playBtn.textContent = 'Reproducir';
                playBtn.disabled = false;
            }, 2000);
        });
    });

    // Stop action trigger
    stopBtn.addEventListener('click', () => {
        fetch('http://localhost:5005/api/stop', {
            method: 'POST',
            mode: 'cors'
        }).catch(err => console.error('Stop API Error:', err));
    });
})();
