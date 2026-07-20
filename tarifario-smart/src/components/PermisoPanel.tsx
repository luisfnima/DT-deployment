'use client';

import React, { useState, useEffect } from 'react';
import { 
  Volume2, Mic, PhoneCall, ShieldCheck, Play, 
  Settings, Sliders, Activity, Info, VolumeX, Plus, Trash2
} from 'lucide-react';

interface PermisoPanelProps {
  darkMode: boolean;
  operatorColor: string;
}

interface Company {
  name: string;
  cache_key: string;
}

interface MessageTemplate {
  name: string;
  text: string;
}

export default function PermisoPanel({ darkMode, operatorColor }: PermisoPanelProps) {
  // Config parameters mimicking config.json
  const [companies, setCompanies] = useState<Company[]>([
    { name: "VODAFONE", cache_key: "0c3998c7bc82" },
    { name: "YOIGO", cache_key: "e6abb63ed22b" }
  ]);

  const [templates, setTemplates] = useState<MessageTemplate[]>([
    {
      name: "Plantilla Estándar",
      text: "Está usted a punto de recibir una llamada del departamento legal de {marca}. Recuerde que esta llamada está siendo grabada por su seguridad."
    }
  ]);

  const musicStyles = [
    { value: 0, label: "Lounge Corporativo (Fmaj7 -> Am7)" },
    { value: 1, label: "Jazz Relajante (Cmaj7 -> G7)" },
    { value: 2, label: "Ambient Chillout (Am7 -> Cmaj7)" },
    { value: 3, label: "Electro Wave (Em -> D)" },
    { value: 4, label: "Clásico Acústico (C -> F)" },
    { value: 5, label: "Espacial Futurista (Asus2 -> Em)" }
  ];

  const rateOptions = [
    { value: "+0%", label: "Normal (+0%)" },
    { value: "+15%", label: "Predeterminado (+15%)" },
    { value: "+30%", label: "Rápido (+30%)" },
    { value: "+45%", label: "Muy Rápido (+45%)" }
  ];

  const voicesList = [
    "Elvira · España (F)",
    "Álvaro · España (M)",
    "Ximena · España (F)",
    "Andrew · Multilenguaje (M)",
    "Brian · Multilenguaje (M)",
    "Emma · Multilenguaje (F)",
    "Ava · Multilenguaje (F)",
    "Dalia · México (F)",
    "Jorge · México (M)"
  ];

  const [selectedCompany, setSelectedCompany] = useState("VODAFONE");
  const [voiceName, setVoiceName] = useState("Álvaro · España (M)");
  const [volMic, setVolMic] = useState(2.0);
  const [volAnn, setVolAnn] = useState(1.0);
  const [volMonitor, setVolMonitor] = useState(0.9);
  
  const [inputDeviceName, setInputDeviceName] = useState("Micrófono (Realtek(R) Audio)");
  const [outputDeviceName, setOutputDeviceName] = useState("CABLE Input (VB-Audio Virtual C");
  const [monitorDeviceName, setMonitorDeviceName] = useState("Altavoces (Realtek(R) Audio)");
  
  const [bgMusicStyle, setBgMusicStyle] = useState<number>(0);
  const [voiceRate, setVoiceRate] = useState<string>("+15%");
  const [isPlaying, setIsPlaying] = useState(false);
  const [activeTemplateName, setActiveTemplateName] = useState<string>("Plantilla Estándar");

  // New Brand input
  const [newBrandName, setNewBrandName] = useState("");
  
  // New Template inputs
  const [newTemplateName, setNewTemplateName] = useState("");
  const [newTemplateText, setNewTemplateText] = useState("");

  const [playbackLogs, setPlaybackLogs] = useState<Array<{ time: string; company: string; status: string }>>([]);

  // Fetch configs on mount
  useEffect(() => {
    const fetchConfig = async () => {
      try {
        const res = await fetch('http://localhost:5005/api/config');
        if (res.ok) {
          const data = await res.json();
          if (data.companies) setCompanies(data.companies);
          if (data.message_templates) setTemplates(data.message_templates);
          if (data.active_template_name) setActiveTemplateName(data.active_template_name);
          else if (data.message_template && data.message_templates) {
            const matchingTmpl = data.message_templates.find((t: any) => t.text === data.message_template);
            if (matchingTmpl) setActiveTemplateName(matchingTmpl.name);
          }
          if (data.voice) setVoiceName(data.voice);
          if (data.vol_mic !== undefined) setVolMic(data.vol_mic);
          if (data.vol_ann !== undefined) setVolAnn(data.vol_ann);
          if (data.vol_monitor !== undefined) setVolMonitor(data.vol_monitor);
          if (data.input_device_name) setInputDeviceName(data.input_device_name);
          if (data.output_device_name) setOutputDeviceName(data.output_device_name);
          if (data.monitor_device_name) setMonitorDeviceName(data.monitor_device_name);
          if (data.bg_music_style !== undefined) setBgMusicStyle(data.bg_music_style);
          if (data.voice_rate !== undefined) setVoiceRate(data.voice_rate);
        }
      } catch (err) {
        console.log("Could not load admin config:", err);
      }
    };
    fetchConfig();
  }, []);

  const updateVolume = async (type: string, val: number) => {
    try {
      await fetch('http://localhost:5005/api/config', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ [type]: val })
      });
    } catch (e) {}
  };

  const handleSaveConfig = async () => {
    try {
      const activeText = templates.find(t => t.name === activeTemplateName)?.text || templates[0]?.text || "";
      const res = await fetch('http://localhost:5005/api/config', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          companies,
          message_templates: templates,
          active_template_name: activeTemplateName,
          message_template: activeText, // Singularity key fallback
          voice: voiceName,
          vol_mic: volMic,
          vol_ann: volAnn,
          vol_monitor: volMonitor,
          input_device_name: inputDeviceName,
          output_device_name: outputDeviceName,
          monitor_device_name: monitorDeviceName,
          bg_music_style: bgMusicStyle,
          voice_rate: voiceRate
        })
      });
      if (res.ok) {
        alert("¡Configuración guardada y sincronizada correctamente!");
      } else {
        alert("Error al guardar en el servidor local.");
      }
    } catch (err) {
      alert("No se pudo conectar con el servidor local de audio.");
    }
  };

  const handleAddBrand = () => {
    const trimmed = newBrandName.trim().toUpperCase();
    if (!trimmed) return;
    if (companies.some(c => c.name === trimmed)) {
      alert("Esta empresa ya existe.");
      return;
    }
    const newBrand: Company = {
      name: trimmed,
      cache_key: Math.random().toString(36).substring(2, 14) // Random dummy key
    };
    setCompanies([...companies, newBrand]);
    setNewBrandName("");
  };

  const handleDeleteBrand = (name: string) => {
    setCompanies(companies.filter(c => c.name !== name));
  };

  const handleAddTemplate = () => {
    const tName = newTemplateName.trim();
    const tText = newTemplateText.trim();
    if (!tName || !tText) {
      alert("Ingresa un nombre y el texto de la plantilla.");
      return;
    }
    if (templates.some(t => t.name === tName)) {
      alert("Ya existe una plantilla con ese nombre.");
      return;
    }
    const newTmpl: MessageTemplate = { name: tName, text: tText };
    setTemplates([...templates, newTmpl]);
    setNewTemplateName("");
    setNewTemplateText("");
  };

  const handleDeleteTemplate = (name: string) => {
    setTemplates(templates.filter(t => t.name !== name));
  };

  const handlePlayConsent = async (customText?: string | React.MouseEvent<any>) => {
    setIsPlaying(true);
    try {
      const targetCompany = companies.find(c => c.name === selectedCompany);
      const textToUse = (typeof customText === 'string') 
        ? customText 
        : templates.find(t => t.name === activeTemplateName)?.text || templates[0]?.text || "";
      const finalMsg = textToUse.replace(/{marca}/g, selectedCompany);
      
      const res = await fetch('http://localhost:5005/api/play', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          cache_key: targetCompany?.cache_key || '',
          marca: selectedCompany,
          texto: finalMsg,
          voice: voiceName,
          vol_mic: volMic,
          vol_ann: volAnn,
          vol_monitor: volMonitor,
          bg_music_style: bgMusicStyle,
          voice_rate: voiceRate
        })
      });
      
      const now = new Date().toLocaleTimeString();
      if (res.ok) {
        setPlaybackLogs(prev => [
          { time: now, company: selectedCompany, status: 'Reproducido OK' },
          ...prev
        ]);
      }
    } catch (err) {
      console.log(err);
    } finally {
      setTimeout(() => setIsPlaying(false), 3000);
    }
  };

  const handleStop = async () => {
    try {
      await fetch('http://localhost:5005/api/stop', { method: 'POST' });
    } catch(e) {}
    setIsPlaying(false);
  };

  return (
    <div className="flex flex-col gap-6 w-full bg-white dark:bg-[#111827] rounded-3xl border border-slate-200/80 dark:border-slate-800 p-6 shadow-sm">
      {/* Header */}
      <div className="flex justify-between items-center border-b border-slate-100 dark:border-slate-800 pb-3">
        <div>
          <h3 className="text-lg font-black text-slate-900 dark:text-slate-100 tracking-tight flex items-center gap-1.5 animate-pulse">
            <Settings className="h-5 w-5" style={{ color: operatorColor }} />
            CONFIGURACIÓN AVANZADA DE PERMISO (ADMINISTRADOR)
          </h3>
          <p className="text-[10px] text-slate-450 dark:text-slate-500">Administra dispositivos, plantillas personalizadas, locutores y música.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left column: templates & companies */}
        <div className="lg:col-span-8 flex flex-col gap-6">
          
          {/* Companies / Brands list */}
          <div className="border border-slate-150 dark:border-slate-800 p-5 rounded-2xl flex flex-col gap-3">
            <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-wider flex justify-between items-center">
              <span>🏢 Empresas Autorizadas</span>
              <span className="text-[9px] text-slate-450 normal-case">Aparecerán en el widget del asesor</span>
            </h4>
            
            <div className="flex flex-wrap gap-2 py-2 max-h-32 overflow-y-auto border-y border-slate-100 dark:border-slate-850 my-1">
              {companies.map(c => (
                <div key={c.name} className="flex items-center gap-1.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 pl-3 pr-2 py-1 rounded-xl text-xs font-bold">
                  <span>{c.name}</span>
                  <button 
                    onClick={() => handleDeleteBrand(c.name)}
                    className="text-red-500 hover:text-red-700 cursor-pointer text-[10px] font-black"
                  >
                    ✕
                  </button>
                </div>
              ))}
            </div>

            <div className="flex gap-2">
              <input 
                type="text"
                placeholder="Nombre de nueva empresa (Ej: CLARO)"
                value={newBrandName}
                onChange={(e) => setNewBrandName(e.target.value)}
                className="flex-1 bg-slate-50 dark:bg-slate-900 border border-slate-250 dark:border-slate-800 rounded-xl px-3.5 py-2 text-xs font-bold focus:outline-none"
              />
              <button 
                onClick={handleAddBrand}
                className="bg-indigo-650 hover:bg-indigo-750 text-white text-xs font-black uppercase px-4 py-2 rounded-xl flex items-center gap-1 cursor-pointer"
              >
                <Plus className="h-4 w-4" /> Añadir
              </button>
            </div>
          </div>

          {/* Templates list */}
          <div className="border border-slate-150 dark:border-slate-800 p-5 rounded-2xl flex flex-col gap-3">
            <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-wider">
              📝 Plantillas de Avisos Legales
            </h4>
            
            <div className="space-y-2 max-h-52 overflow-y-auto border-y border-slate-100 dark:border-slate-850 py-2">
              {templates.map(t => (
                <div key={t.name} className={`flex justify-between items-start gap-4 p-3 border rounded-xl text-xs transition-all ${activeTemplateName === t.name ? 'bg-indigo-50/30 dark:bg-indigo-950/20 border-indigo-300/80 dark:border-indigo-800' : 'bg-slate-50 dark:bg-slate-900/50 border-slate-200/60 dark:border-slate-800'}`}>
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <span className="font-extrabold text-slate-900 dark:text-slate-100">{t.name}</span>
                      {activeTemplateName === t.name && (
                        <span className="text-[7.5px] bg-emerald-500 text-white font-black px-1.5 py-0.5 rounded border border-emerald-600/10">ACTIVA</span>
                      )}
                    </div>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">{t.text}</p>
                  </div>
                  <div className="flex items-center gap-2 self-center">
                    {activeTemplateName !== t.name ? (
                      <button
                        onClick={() => setActiveTemplateName(t.name)}
                        className="text-[9px] font-black uppercase text-indigo-650 hover:text-indigo-800 bg-indigo-50 dark:bg-slate-800 px-2 py-1 rounded-lg border border-indigo-200 dark:border-slate-700 cursor-pointer"
                        title="Establecer como plantilla de aviso activa"
                      >
                        Activar
                      </button>
                    ) : null}
                    <button
                      onClick={() => handlePlayConsent(t.text)}
                      className="text-emerald-500 hover:text-emerald-700 cursor-pointer p-1"
                      title="Probar/Escuchar locución de esta plantilla"
                    >
                      <Play className="h-4 w-4 fill-emerald-500" />
                    </button>
                    <button 
                      onClick={() => handleDeleteTemplate(t.name)}
                      className="text-red-500 hover:text-red-750 cursor-pointer p-1"
                      title="Eliminar plantilla"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>

            <div className="flex flex-col gap-3 pt-2 bg-slate-50/20 p-4 border border-slate-150 dark:border-slate-850 rounded-2xl">
              <span className="text-[9px] font-extrabold text-indigo-600 dark:text-indigo-400 uppercase tracking-wider block">Crear Nueva Plantilla</span>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <div className="md:col-span-1">
                  <label className="text-[9px] font-extrabold text-slate-400 block mb-1 uppercase">Nombre de la Plantilla:</label>
                  <input 
                    type="text"
                    placeholder="Ej: Simplificado"
                    value={newTemplateName}
                    onChange={(e) => setNewTemplateName(e.target.value)}
                    className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl px-3 py-2 text-xs font-bold focus:outline-none"
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="text-[9px] font-extrabold text-slate-400 block mb-1 uppercase">Texto del Aviso (Usa {"{marca}"} para el operador):</label>
                  <textarea 
                    rows={2}
                    placeholder="Usted está aceptando contratar con {marca}..."
                    value={newTemplateText}
                    onChange={(e) => setNewTemplateText(e.target.value)}
                    className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl px-3 py-1.5 text-xs font-bold focus:outline-none resize-none"
                  />
                </div>
              </div>
              
              <div className="flex justify-end">
                <button 
                  onClick={handleAddTemplate}
                  className="bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-black uppercase px-5 py-2.5 rounded-xl flex items-center gap-1 cursor-pointer"
                >
                  <Plus className="h-4 w-4" /> Guardar Nueva Plantilla
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Right column: Devices, volumes, background music, rate */}
        <div className="lg:col-span-4 flex flex-col gap-6">
          
          {/* Audio Config */}
          <div className="border border-slate-150 dark:border-slate-800 p-5 rounded-2xl flex flex-col gap-4">
            <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-wider">🛠️ Audio & Dispositivos</h4>
            
            <div className="flex flex-col gap-3">
              <div>
                <label className="text-[8px] font-extrabold text-slate-400 block uppercase">Dispositivo de Entrada:</label>
                <input 
                  type="text"
                  value={inputDeviceName}
                  onChange={(e) => setInputDeviceName(e.target.value)}
                  className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-850 rounded-lg px-2.5 py-1.5 text-[10px] font-bold"
                />
              </div>

              <div>
                <label className="text-[8px] font-extrabold text-slate-400 block uppercase">Salida (VB-Cable Input):</label>
                <input 
                  type="text"
                  value={outputDeviceName}
                  onChange={(e) => setOutputDeviceName(e.target.value)}
                  className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-850 rounded-lg px-2.5 py-1.5 text-[10px] font-bold"
                />
              </div>

              <div>
                <label className="text-[8px] font-extrabold text-slate-400 block uppercase">Monitor (Auriculares):</label>
                <input 
                  type="text"
                  value={monitorDeviceName}
                  onChange={(e) => setMonitorDeviceName(e.target.value)}
                  className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-850 rounded-lg px-2.5 py-1.5 text-[10px] font-bold"
                />
              </div>
            </div>
          </div>

          {/* Music and Speed Options */}
          <div className="border border-slate-150 dark:border-slate-800 p-5 rounded-2xl flex flex-col gap-4">
            <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-wider">🎵 Estilo & Locución</h4>
            
            <div className="flex flex-col gap-3">
              <div>
                <label className="text-[8px] font-extrabold text-slate-400 block mb-1 uppercase">Locutor de Voz Predeterminado:</label>
                <select
                  value={voiceName}
                  onChange={(e) => setVoiceName(e.target.value)}
                  className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-850 rounded-lg px-2.5 py-1.5 text-[10px] font-bold focus:outline-none"
                >
                  {voicesList.map(v => (
                    <option key={v} value={v}>{v}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-[8px] font-extrabold text-slate-400 block mb-1 uppercase">Música de fondo:</label>
                <select
                  value={bgMusicStyle}
                  onChange={(e) => setBgMusicStyle(Number(e.target.value))}
                  className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-850 rounded-lg px-2.5 py-1.5 text-[10px] font-bold focus:outline-none"
                >
                  {musicStyles.map(m => (
                    <option key={m.value} value={m.value}>{m.label}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-[8px] font-extrabold text-slate-400 block mb-1 uppercase">Velocidad del Habla (Edge TTS):</label>
                <select
                  value={voiceRate}
                  onChange={(e) => setVoiceRate(e.target.value)}
                  className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-850 rounded-lg px-2.5 py-1.5 text-[10px] font-bold focus:outline-none"
                >
                  {rateOptions.map(r => (
                    <option key={r.value} value={r.value}>{r.label}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Master Volumes */}
          <div className="border border-slate-150 dark:border-slate-800 p-5 rounded-2xl flex flex-col gap-4">
            <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-wider">🎚️ Volúmenes Predeterminados</h4>
            
            <div className="flex flex-col gap-3.5">
              <div className="flex flex-col gap-1">
                <div className="flex justify-between items-center text-[9px] font-bold text-slate-400">
                  <span>Volumen Mic</span>
                  <span>{volMic.toFixed(1)}x</span>
                </div>
                <input 
                  type="range" min="0.5" max="3.0" step="0.1" value={volMic} 
                  onChange={(e) => {
                    const val = parseFloat(e.target.value);
                    setVolMic(val);
                    updateVolume('vol_mic', val);
                  }}
                  className="w-full h-1 bg-slate-200 dark:bg-slate-800 rounded-lg appearance-none cursor-pointer accent-indigo-650"
                />
              </div>

              <div className="flex flex-col gap-1">
                <div className="flex justify-between items-center text-[9px] font-bold text-slate-400">
                  <span>Volumen Locución</span>
                  <span>{volAnn.toFixed(1)}x</span>
                </div>
                <input 
                  type="range" min="0.5" max="2.0" step="0.1" value={volAnn} 
                  onChange={(e) => {
                    const val = parseFloat(e.target.value);
                    setVolAnn(val);
                    updateVolume('vol_ann', val);
                  }}
                  className="w-full h-1 bg-slate-200 dark:bg-slate-800 rounded-lg appearance-none cursor-pointer accent-indigo-650"
                />
              </div>

              <div className="flex flex-col gap-1">
                <div className="flex justify-between items-center text-[9px] font-bold text-slate-400">
                  <span>Volumen Monitoreo</span>
                  <span>{volMonitor.toFixed(1)}x</span>
                </div>
                <input 
                  type="range" min="0.0" max="1.5" step="0.1" value={volMonitor} 
                  onChange={(e) => {
                    const val = parseFloat(e.target.value);
                    setVolMonitor(val);
                    updateVolume('vol_monitor', val);
                  }}
                  className="w-full h-1 bg-slate-200 dark:bg-slate-800 rounded-lg appearance-none cursor-pointer accent-indigo-650"
                />
              </div>
            </div>
          </div>

          {/* Action Trigger Buttons */}
          <div className="flex flex-col gap-2 mt-2">
            <button
              onClick={handleSaveConfig}
              className="bg-indigo-650 hover:bg-indigo-750 text-white text-xs font-black uppercase py-3.5 rounded-xl transition-all shadow-md flex items-center justify-center gap-1.5 cursor-pointer"
            >
              💾 Guardar Configuración General
            </button>
            
            <div className="flex flex-col gap-1.5 border border-slate-150 dark:border-slate-800 p-3.5 rounded-xl bg-slate-50/50 dark:bg-slate-900/50">
              <label className="text-[8px] font-extrabold text-slate-400 block uppercase">🏢 Empresa a Probar:</label>
              <select
                value={selectedCompany}
                onChange={(e) => setSelectedCompany(e.target.value)}
                className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-805 rounded-lg px-2.5 py-1.5 text-[10px] font-bold focus:outline-none"
              >
                {companies.map(c => (
                  <option key={c.name} value={c.name}>{c.name}</option>
                ))}
              </select>
            </div>

            <div className="flex gap-2">
              <button
                onClick={handlePlayConsent}
                disabled={isPlaying}
                className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-black py-2.5 rounded-lg flex items-center justify-center gap-1 cursor-pointer disabled:opacity-50"
              >
                <Play className="h-3.5 w-3.5 fill-white" /> Probar
              </button>
              <button
                onClick={handleStop}
                className="bg-red-600 hover:bg-red-700 text-white text-xs font-black py-2.5 rounded-lg flex items-center justify-center gap-1 cursor-pointer"
              >
                <VolumeX className="h-3.5 w-3.5" /> Stop
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
