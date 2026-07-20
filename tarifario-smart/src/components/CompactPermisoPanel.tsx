'use client';

import React, { useState, useEffect } from 'react';
import { PhoneCall, Play, VolumeX } from 'lucide-react';

interface CompactPermisoPanelProps {
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

export default function CompactPermisoPanel({ darkMode, operatorColor }: CompactPermisoPanelProps) {
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

  const [selectedCompany, setSelectedCompany] = useState("VODAFONE");
  const [selectedTemplateName, setSelectedTemplateName] = useState("Plantilla Estándar");
  const [voiceName, setVoiceName] = useState("Álvaro · España (M)");
  const [volMic, setVolMic] = useState(2.0);
  const [volAnn, setVolAnn] = useState(1.0);
  const [volMonitor, setVolMonitor] = useState(0.9);
  const [isPlaying, setIsPlaying] = useState(false);

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

  // Fetch config from Python server on mount and poll periodically
  useEffect(() => {
    let active = true;
    const fetchConfig = async (isInitial = false) => {
      try {
        const res = await fetch('http://localhost:5005/api/config');
        if (res.ok && active) {
          const data = await res.json();
          if (data.companies && data.companies.length > 0) {
            setCompanies(data.companies);
            if (isInitial) setSelectedCompany(data.companies[0].name);
          }
          if (data.message_templates && data.message_templates.length > 0) {
            setTemplates(data.message_templates);
            if (isInitial) {
              const activeTmpl = data.active_template_name || data.message_templates[0].name;
              setSelectedTemplateName(activeTmpl);
            }
          } else if (data.message_template) {
            const defaultTmpl = { name: "Plantilla Estándar", text: data.message_template };
            setTemplates([defaultTmpl]);
            if (isInitial) setSelectedTemplateName("Plantilla Estándar");
          }
          if (isInitial) {
            if (data.voice) setVoiceName(data.voice);
            if (data.vol_mic !== undefined) setVolMic(data.vol_mic);
            if (data.vol_ann !== undefined) setVolAnn(data.vol_ann);
            if (data.vol_monitor !== undefined) setVolMonitor(data.vol_monitor);
          }
        }
      } catch (err) {
        console.log("Could not load dynamic config from server:", err);
      }
    };
    fetchConfig(true);
    const interval = setInterval(() => {
      fetchConfig(false);
    }, 6000);
    return () => {
      active = false;
      clearInterval(interval);
    };
  }, []);

  const handleTemplateChange = async (tmplName: string) => {
    setSelectedTemplateName(tmplName);
    try {
      const activeText = templates.find(t => t.name === tmplName)?.text || "";
      await fetch('http://localhost:5005/api/config', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          active_template_name: tmplName,
          message_template: activeText
        })
      });
    } catch (e) {}
  };

  const handleVoiceChange = async (voice: string) => {
    setVoiceName(voice);
    try {
      await fetch('http://localhost:5005/api/config', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ voice })
      });
    } catch (e) {}
  };

  const handlePlayConsent = async () => {
    setIsPlaying(true);
    try {
      const targetCompany = companies.find(c => c.name === selectedCompany);
      const activeTemplate = templates.find(t => t.name === selectedTemplateName) || templates[0];
      const finalMsg = activeTemplate.text.replace(/{marca}/g, selectedCompany);

      await fetch('http://localhost:5005/api/play', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          cache_key: targetCompany?.cache_key || '',
          marca: selectedCompany,
          texto: finalMsg,
          voice: voiceName,
          vol_mic: volMic,
          vol_ann: volAnn,
          vol_monitor: volMonitor
        })
      });
    } catch (err) {
      console.log("Error playing locally:", err);
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
    <div className="flex flex-col gap-4 w-full max-w-md mx-auto bg-white dark:bg-[#111827] rounded-3xl border border-slate-200/80 dark:border-slate-800 p-5 shadow-sm">
      {/* Header compact */}
      <div className="flex justify-between items-center border-b border-slate-100 dark:border-slate-800 pb-2">
        <h3 className="text-sm font-black text-slate-900 dark:text-slate-100 tracking-tight flex items-center gap-1.5">
          <PhoneCall className="h-4 w-4" style={{ color: operatorColor }} />
          AVISO LEGAL (MODO ASESOR)
        </h3>
        <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" title="Servidor local conectado"></span>
      </div>

      {/* Selectors */}
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="text-[8px] font-extrabold text-slate-400 block mb-1 uppercase">Marca / Operador:</label>
          <select
            value={selectedCompany}
            onChange={(e) => setSelectedCompany(e.target.value)}
            className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-850 rounded-xl px-2.5 py-1.5 text-xs font-bold focus:outline-none"
          >
            {companies.map(c => (
              <option key={c.name} value={c.name}>{c.name}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="text-[8px] font-extrabold text-slate-400 block mb-1 uppercase">Locutor de Voz:</label>
          <select
            value={voiceName}
            onChange={(e) => handleVoiceChange(e.target.value)}
            className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-850 rounded-xl px-2.5 py-1.5 text-xs font-bold focus:outline-none"
          >
            {voicesList.map(v => (
              <option key={v} value={v}>{v}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Template selector */}
      <div>
        <label className="text-[8px] font-extrabold text-slate-400 block mb-1 uppercase">Plantilla de Mensaje:</label>
        <select
          value={selectedTemplateName}
          onChange={(e) => handleTemplateChange(e.target.value)}
          className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-850 rounded-xl px-2.5 py-1.5 text-xs font-bold focus:outline-none"
        >
          {templates.map(t => (
            <option key={t.name} value={t.name}>{t.name}</option>
          ))}
        </select>
      </div>

      {/* Rápido volumen */}
      <div className="grid grid-cols-3 gap-2.5 bg-slate-50/50 dark:bg-slate-900/10 p-3 rounded-xl border border-slate-150 dark:border-slate-850">
        <div className="flex flex-col gap-1">
          <span className="text-[8px] text-slate-450 font-bold uppercase">🎤 Vol Mic ({volMic.toFixed(1)})</span>
          <input 
            type="range" min="0.5" max="3.0" step="0.1" value={volMic} 
            onChange={(e) => setVolMic(parseFloat(e.target.value))}
            className="w-full h-1 bg-slate-200 dark:bg-slate-800 rounded-lg appearance-none cursor-pointer accent-indigo-600"
          />
        </div>
        <div className="flex flex-col gap-1">
          <span className="text-[8px] text-slate-450 font-bold uppercase">🔊 Vol Voz ({volAnn.toFixed(1)})</span>
          <input 
            type="range" min="0.5" max="2.0" step="0.1" value={volAnn} 
            onChange={(e) => setVolAnn(parseFloat(e.target.value))}
            className="w-full h-1 bg-slate-200 dark:bg-slate-800 rounded-lg appearance-none cursor-pointer accent-indigo-600"
          />
        </div>
        <div className="flex flex-col gap-1">
          <span className="text-[8px] text-slate-450 font-bold uppercase">🎧 Monit. ({volMonitor.toFixed(1)})</span>
          <input 
            type="range" min="0.0" max="1.5" step="0.1" value={volMonitor} 
            onChange={(e) => setVolMonitor(parseFloat(e.target.value))}
            className="w-full h-1 bg-slate-200 dark:bg-slate-800 rounded-lg appearance-none cursor-pointer accent-indigo-600"
          />
        </div>
      </div>

      {/* Buttons */}
      <div className="flex gap-2">
        <button
          onClick={handlePlayConsent}
          disabled={isPlaying}
          className="flex-1 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white text-xs font-black uppercase py-3 rounded-xl transition-all shadow-md shadow-emerald-500/10 flex items-center justify-center gap-1 cursor-pointer disabled:opacity-50"
        >
          <Play className="h-3.5 w-3.5 fill-white" />
          {isPlaying ? 'Reproduciendo...' : '▶ REPRODUCIR'}
        </button>

        <button
          onClick={handleStop}
          className="bg-red-600 hover:bg-red-750 text-white text-xs font-black uppercase px-4 py-3 rounded-xl transition-all flex items-center justify-center gap-1 cursor-pointer"
        >
          <VolumeX className="h-3.5 w-3.5" />
          ⏹ Detener
        </button>
      </div>
    </div>
  );
}
