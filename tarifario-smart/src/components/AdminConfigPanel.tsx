'use client';

import React, { useState, useRef } from 'react';
import { 
  Plus, Edit2, Trash2, Save, X, Database, 
  Sparkles, Wifi, Smartphone, Tv, Check, RefreshCw,
  PhoneCall, Bot, Settings, Share2, SeparatorHorizontal,
  Shield, Info, Download, Upload, RotateCcw, Tag, DollarSign,
  Layers, AlertCircle, FileJson
} from 'lucide-react';
import { Plan, Addon, PLANS, ADDONS } from '@/data/plans';
import PermisoPanel from './PermisoPanel';
import EmbudoPanel from './EmbudoPanel';

interface AdminConfigPanelProps {
  darkMode: boolean;
  operatorColor: string;
  plans: Plan[];
  setPlans: (plans: Plan[]) => void;
  addons: Addon[];
  setAddons: (addons: Addon[]) => void;
  
  // WhatsApp Proposals Props
  evolutionUrl: string;
  setEvolutionUrl: (url: string) => void;
  evolutionApiKey: string;
  setEvolutionApiKey: (key: string) => void;
  evolutionInstance: string;
  setEvolutionInstance: (inst: string) => void;
  wspConnectionState: 'open' | 'close' | 'connecting' | 'loading';
  setWspConnectionState: React.Dispatch<React.SetStateAction<'open' | 'close' | 'connecting' | 'loading'>>;
  qrCodeBase64: string;
  setQrCodeBase64: (code: string) => void;
  handleConnectWSP: () => Promise<void>;
  handleDisconnectWSP: () => Promise<void>;
  handleResetWSP?: () => Promise<void>;
  
  // WhatsApp Contraofertas Props
  wspConnectionStateContra?: 'open' | 'close' | 'connecting' | 'loading';
  qrCodeBase64Contra?: string;
  handleConnectWSPContra?: () => Promise<void>;
  handleDisconnectWSPContra?: () => Promise<void>;
  handleResetWSPContra?: () => Promise<void>;
  
  advisorName: string;
  advisorRole: string;
  saveAdvisorInfo: (name: string, role: string) => void;
  setAdvisorName: (name: string) => void;
  setAdvisorRole: (role: string) => void;
  setActiveTab: (tab: string) => void;
  ipRestrictionEnabled?: boolean;
  allowedIps?: string[];
  handleSaveSecurityConfig?: (enabled: boolean, ips: string[]) => Promise<void>;
}

export default function AdminConfigPanel({ 
  darkMode, 
  operatorColor, 
  plans, 
  setPlans,
  addons,
  setAddons,
  
  evolutionUrl,
  setEvolutionUrl,
  evolutionApiKey,
  setEvolutionApiKey,
  evolutionInstance,
  setEvolutionInstance,
  wspConnectionState,
  setWspConnectionState,
  qrCodeBase64,
  setQrCodeBase64,
  handleConnectWSP,
  handleDisconnectWSP,
  handleResetWSP,
  
  wspConnectionStateContra,
  qrCodeBase64Contra,
  handleConnectWSPContra,
  handleDisconnectWSPContra,
  handleResetWSPContra,

  advisorName,
  advisorRole,
  saveAdvisorInfo,
  setAdvisorName,
  setAdvisorRole,
  setActiveTab,
  ipRestrictionEnabled,
  allowedIps,
  handleSaveSecurityConfig
}: AdminConfigPanelProps) {
  const [activeAdminTab, setActiveAdminTab] = useState<'tarifas' | 'permiso' | 'embudo' | 'whatsapp-propuestas' | 'seguridad-ip'>('tarifas');
  const [selectedOperator, setSelectedOperator] = useState<string>('vodafone');
  const [editingPlanId, setEditingPlanId] = useState<string | null>(null);
  const [notification, setNotification] = useState<{ msg: string; type: 'success' | 'error' | 'info' } | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Helper para notificaciones flotantes
  const showToast = (msg: string, type: 'success' | 'error' | 'info' = 'success') => {
    setNotification({ msg, type });
    setTimeout(() => setNotification(null), 3500);
  };

  // Form State para Edición / Creación Completa de Plan
  const [planForm, setPlanForm] = useState<{
    id: string;
    name: string;
    price: number;
    priceAfterPromo: number;
    isPromo: boolean;
    promoMonths: number;
    promoLabel: string;
    isNewCampaign: boolean;
    category: Plan['category'];
    segment: string;
    speed: string;
    mobile: string;
    tv: string;
    tags: string;
    features: string;
    notes: string;
  }>({
    id: '',
    name: '',
    price: 0,
    priceAfterPromo: 0,
    isPromo: false,
    promoMonths: 3,
    promoLabel: '',
    isNewCampaign: false,
    category: 'fibra_movil',
    segment: '',
    speed: '600Mb',
    mobile: '1 línea 50GB',
    tv: '',
    tags: '',
    features: '',
    notes: ''
  });

  const [showAddForm, setShowAddForm] = useState(false);

  const operatorsList = [
    { id: 'vodafone', label: 'Vodafone' },
    { id: 'yoigo', label: 'Yoigo' },
    { id: 'orange', label: 'Orange' },
    { id: 'lowi', label: 'Lowi' },
    { id: 'win', label: 'WIN (Perú)' }
  ];

  const categoryOptions: { id: Plan['category']; label: string }[] = [
    { id: 'fibra_movil', label: '🏠 Residencial (Fibra + Móvil)' },
    { id: 'fibra_movil_empresa', label: '🏢 Empresa / Autónomos / Bares HORECA' },
    { id: 'flash_agosto', label: '🔥 Oferta Flash Agosto' },
    { id: 'segunda_residencia', label: '🏖️ Segunda Residencia / Internet Portátil' },
    { id: 'solo_movil', label: '📱 Solo Móvil' },
    { id: 'solo_fibra', label: '🌐 Solo Fibra' },
    { id: 'fibra_tv', label: '📺 Fibra + Televisión' },
    { id: 'fibra_movil_streaming', label: '🎬 Packs Streaming (Netflix/Max/Disney)' }
  ];

  // Iniciar edición de un plan existente
  const handleStartEdit = (plan: Plan) => {
    setEditingPlanId(plan.id);
    setPlanForm({
      id: plan.id,
      name: plan.name,
      price: plan.price,
      priceAfterPromo: plan.priceAfterPromo || plan.price,
      isPromo: !!plan.isPromo,
      promoMonths: plan.promoMonths || 3,
      promoLabel: plan.promoLabel || '',
      isNewCampaign: !!plan.isNewCampaign,
      category: plan.category || 'fibra_movil',
      segment: plan.segment || '',
      speed: plan.speed || '600Mb',
      mobile: plan.mobile || '',
      tv: plan.tv || '',
      tags: plan.tags ? plan.tags.join(', ') : '',
      features: plan.features ? plan.features.join('\n') : '',
      notes: plan.notes ? plan.notes.join('\n') : ''
    });
  };

  // Guardar edición de un plan
  const handleSaveEdit = (planId: string) => {
    const updated = plans.map(p => {
      if (p.id === planId) {
        return {
          ...p,
          name: planForm.name.trim(),
          price: Number(planForm.price) || 0,
          priceAfterPromo: Number(planForm.priceAfterPromo) || Number(planForm.price) || 0,
          isPromo: planForm.isPromo,
          promoMonths: planForm.isPromo ? Number(planForm.promoMonths) || 3 : undefined,
          promoLabel: planForm.isPromo ? (planForm.promoLabel || `Promo ${planForm.promoMonths || 3} meses`) : undefined,
          isNewCampaign: planForm.isNewCampaign,
          category: planForm.category,
          segment: planForm.segment.trim() || undefined,
          speed: planForm.speed.trim(),
          mobile: planForm.mobile.trim(),
          tv: planForm.tv.trim() || undefined,
          tags: planForm.tags.split(',').map(t => t.trim()).filter(Boolean),
          features: planForm.features.split('\n').map(f => f.trim()).filter(Boolean),
          notes: planForm.notes.split('\n').map(n => n.trim()).filter(Boolean)
        };
      }
      return p;
    });

    setPlans(updated);
    localStorage.setItem('smart_custom_plans', JSON.stringify(updated));
    localStorage.setItem('custom_plans', JSON.stringify(updated));
    setEditingPlanId(null);
    showToast('¡Tarifa actualizada y guardada con éxito!');
  };

  // Eliminar un plan
  const handleDeletePlan = (planId: string) => {
    if (confirm('¿Estás seguro de que deseas eliminar permanentemente esta tarifa?')) {
      const updated = plans.filter(p => p.id !== planId);
      setPlans(updated);
      localStorage.setItem('smart_custom_plans', JSON.stringify(updated));
      localStorage.setItem('custom_plans', JSON.stringify(updated));
      showToast('Tarifa eliminada del catálogo.', 'info');
    }
  };

  // Crear un nuevo plan
  const handleCreatePlan = () => {
    if (!planForm.name.trim() || Number(planForm.price) <= 0) {
      alert('Por favor ingresa un nombre válido y un precio mayor a 0.');
      return;
    }

    const newId = `${selectedOperator}-custom-${Date.now()}`;
    const newPlan: Plan = {
      id: newId,
      operatorId: selectedOperator,
      name: planForm.name.trim(),
      price: Number(planForm.price) || 0,
      priceAfterPromo: Number(planForm.priceAfterPromo) || Number(planForm.price) || 0,
      isPromo: planForm.isPromo,
      promoMonths: planForm.isPromo ? Number(planForm.promoMonths) || 3 : undefined,
      promoLabel: planForm.isPromo ? (planForm.promoLabel || `Promo ${planForm.promoMonths || 3} meses`) : undefined,
      isNewCampaign: planForm.isNewCampaign,
      category: planForm.category,
      segment: planForm.segment.trim() || undefined,
      speed: planForm.speed.trim() || '600Mb',
      mobile: planForm.mobile.trim() || 'Líneas móviles 5G',
      tv: planForm.tv.trim() || undefined,
      priceKind: planForm.isPromo ? 'promo_then_regular' : 'final',
      tags: planForm.tags ? planForm.tags.split(',').map(t => t.trim()).filter(Boolean) : [selectedOperator.toUpperCase()],
      features: planForm.features ? planForm.features.split('\n').map(f => f.trim()).filter(Boolean) : ['Fibra óptica simétrica', 'Llamadas ilimitadas'],
      notes: planForm.notes ? planForm.notes.split('\n').map(n => n.trim()).filter(Boolean) : []
    };

    const updated = [newPlan, ...plans];
    setPlans(updated);
    localStorage.setItem('smart_custom_plans', JSON.stringify(updated));
    localStorage.setItem('custom_plans', JSON.stringify(updated));
    
    // Reset Form
    setShowAddForm(false);
    showToast('¡Nueva tarifa añadida y guardada exitosamente!');
  };

  // Exportar Catálogo Completo en JSON
  const handleExportJSON = () => {
    const data = {
      version: '2026_vodafone_agosto_v2',
      exportDate: new Date().toISOString(),
      plans: plans,
      addons: addons
    };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `tarifario_smart_backup_${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
    showToast('¡Copia de seguridad JSON descargada!');
  };

  // Importar Catálogo Completo desde JSON
  const handleImportJSON = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const json = JSON.parse(event.target?.result as string);
        if (json.plans && Array.isArray(json.plans)) {
          setPlans(json.plans);
          localStorage.setItem('smart_custom_plans', JSON.stringify(json.plans));
          localStorage.setItem('custom_plans', JSON.stringify(json.plans));
        }
        if (json.addons && Array.isArray(json.addons)) {
          setAddons(json.addons);
          localStorage.setItem('smart_custom_addons', JSON.stringify(json.addons));
          localStorage.setItem('custom_addons', JSON.stringify(json.addons));
        }
        showToast('¡Catálogo importado y guardado correctamente!');
      } catch (err) {
        alert('Error al leer el archivo JSON. Verifica que sea un archivo de backup válido.');
      }
    };
    reader.readAsText(file);
  };

  // Restablecer catálogo oficial de fábrica
  const handleResetToFactory = () => {
    if (confirm('¿Estás seguro de restablecer todas las tarifas al catálogo oficial de fábrica? Se perderán las modificaciones no respaldadas.')) {
      localStorage.removeItem('smart_custom_plans');
      localStorage.removeItem('custom_plans');
      localStorage.removeItem('smart_custom_addons');
      localStorage.removeItem('custom_addons');
      setPlans(PLANS);
      setAddons(ADDONS);
      showToast('Catálogo restablecido al oficial de fábrica.', 'info');
    }
  };

  return (
    <div className="flex flex-col gap-6 w-full">
      {/* Toast Notification */}
      {notification && (
        <div className={`fixed top-5 right-5 z-50 px-4 py-3 rounded-2xl shadow-xl border flex items-center gap-2 animate-in fade-in slide-in-from-top-4 duration-300 ${
          notification.type === 'success' 
            ? 'bg-emerald-600 text-white border-emerald-500' 
            : (notification.type === 'error' ? 'bg-red-600 text-white border-red-500' : 'bg-slate-900 text-white border-slate-700')
        }`}>
          <Check className="h-4 w-4 stroke-[3px]" />
          <span className="text-xs font-black">{notification.msg}</span>
        </div>
      )}

      {/* Sub-Navegación de Administrador */}
      <div className="flex gap-3 border-b border-slate-200 dark:border-slate-800 pb-2 overflow-x-auto">
        <button
          onClick={() => setActiveAdminTab('tarifas')}
          className={`px-4 py-2 text-xs font-black uppercase tracking-wider flex items-center gap-1.5 border-b-2 transition-all cursor-pointer whitespace-nowrap ${
            activeAdminTab === 'tarifas'
              ? 'border-indigo-600 text-indigo-600'
              : 'border-transparent text-slate-450 hover:text-slate-700'
          }`}
        >
          <Database className="h-4 w-4" />
          Tarifas & Catálogo
        </button>

        <button
          onClick={() => setActiveAdminTab('permiso')}
          className={`px-4 py-2 text-xs font-black uppercase tracking-wider flex items-center gap-1.5 border-b-2 transition-all cursor-pointer whitespace-nowrap ${
            activeAdminTab === 'permiso'
              ? 'border-indigo-600 text-indigo-600'
              : 'border-transparent text-slate-450 hover:text-slate-700'
          }`}
        >
          <PhoneCall className="h-4 w-4" />
          Configuración Permiso
        </button>

        <button
          onClick={() => setActiveAdminTab('whatsapp-propuestas')}
          className={`px-4 py-2 text-xs font-black uppercase tracking-wider flex items-center gap-1.5 border-b-2 transition-all cursor-pointer whitespace-nowrap ${
            activeAdminTab === 'whatsapp-propuestas'
              ? 'border-indigo-600 text-indigo-600'
              : 'border-transparent text-slate-450 hover:text-slate-700'
          }`}
        >
          <Share2 className="h-4 w-4" />
          Whatsapp Propuestas
        </button>

        <button
          onClick={() => setActiveAdminTab('embudo')}
          className={`px-4 py-2 text-xs font-black uppercase tracking-wider flex items-center gap-1.5 border-b-2 transition-all cursor-pointer whitespace-nowrap ${
            activeAdminTab === 'embudo'
              ? 'border-indigo-600 text-indigo-600'
              : 'border-transparent text-slate-450 hover:text-slate-700'
          }`}
        >
          <Bot className="h-4 w-4" />
          Whatsapp Contra-ofertas
        </button>

        <button
          onClick={() => setActiveAdminTab('seguridad-ip')}
          className={`px-4 py-2 text-xs font-black uppercase tracking-wider flex items-center gap-1.5 border-b-2 transition-all cursor-pointer whitespace-nowrap ${
            activeAdminTab === 'seguridad-ip'
              ? 'border-indigo-600 text-indigo-600'
              : 'border-transparent text-slate-450 hover:text-slate-700'
          }`}
        >
          <Shield className="h-4 w-4" />
          Seguridad IP
        </button>
      </div>

      {/* Pestaña: Administrador de Tarifas */}
      {activeAdminTab === 'tarifas' && (
        <div className="flex flex-col gap-6 w-full animate-in fade-in duration-200">
          {/* Header Panel con Acciones de Backup / Restauración */}
          <div className="flex flex-wrap justify-between items-center gap-4 bg-white dark:bg-[#111827] p-5 rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-sm">
            <div>
              <h3 className="text-lg font-black text-slate-900 dark:text-slate-100 tracking-tight flex items-center gap-2">
                <Database className="h-5 w-5 text-indigo-600" />
                Gestión Integral de Tarifas
              </h3>
              <p className="text-[11px] text-slate-400 dark:text-slate-500 mt-0.5">
                Edita precios, promociones, categorías (Residencial / Empresa / Bares) y stickers sin necesidad de tocar código.
              </p>
            </div>
            
            <div className="flex flex-wrap items-center gap-2">
              <button
                onClick={() => {
                  setShowAddForm(true);
                  setEditingPlanId(null);
                  setPlanForm({
                    id: '',
                    name: '',
                    price: 0,
                    priceAfterPromo: 0,
                    isPromo: false,
                    promoMonths: 3,
                    promoLabel: '',
                    isNewCampaign: false,
                    category: 'fibra_movil',
                    segment: '',
                    speed: '600Mb',
                    mobile: '1 línea 50GB',
                    tv: '',
                    tags: '',
                    features: '',
                    notes: ''
                  });
                }}
                className="bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-black uppercase px-4 py-2.5 rounded-xl transition-all shadow-md shadow-indigo-500/10 flex items-center gap-1.5 cursor-pointer"
              >
                <Plus className="h-4 w-4" />
                Añadir Nueva Tarifa
              </button>

              <button
                onClick={handleExportJSON}
                className="bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-700 dark:text-slate-300 text-xs font-bold px-3 py-2.5 rounded-xl transition-all flex items-center gap-1.5 cursor-pointer"
                title="Descargar copia de seguridad en JSON"
              >
                <Download className="h-3.5 w-3.5" />
                Exportar JSON
              </button>

              <label className="bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-700 dark:text-slate-300 text-xs font-bold px-3 py-2.5 rounded-xl transition-all flex items-center gap-1.5 cursor-pointer">
                <Upload className="h-3.5 w-3.5" />
                Importar JSON
                <input 
                  type="file" 
                  ref={fileInputRef} 
                  accept=".json" 
                  onChange={handleImportJSON} 
                  className="hidden" 
                />
              </label>

              <button
                onClick={handleResetToFactory}
                className="border border-red-200 dark:border-red-900/50 hover:bg-red-50 dark:hover:bg-red-950/20 text-red-600 text-xs font-bold px-3 py-2.5 rounded-xl transition-all flex items-center gap-1.5 cursor-pointer"
                title="Restablecer tarifas oficiales originales"
              >
                <RotateCcw className="h-3.5 w-3.5" />
                Restablecer
              </button>
            </div>
          </div>

          {/* Selector de Operador */}
          <div className="flex gap-2 p-1.5 bg-slate-150/40 dark:bg-slate-900/60 rounded-2xl border border-slate-200/50 dark:border-slate-800 overflow-x-auto">
            {operatorsList.map(op => (
              <button
                key={op.id}
                onClick={() => {
                  setSelectedOperator(op.id);
                  setEditingPlanId(null);
                  setShowAddForm(false);
                }}
                className={`flex-1 py-2 px-3 text-xs font-black rounded-xl transition-all cursor-pointer whitespace-nowrap ${
                  selectedOperator === op.id
                    ? 'bg-white dark:bg-[#111827] text-slate-900 dark:text-slate-100 shadow-sm border border-slate-200/50 dark:border-slate-800'
                    : 'text-slate-500 hover:text-slate-900 dark:hover:text-slate-350'
                }`}
              >
                {op.label}
              </button>
            ))}
          </div>

          {/* Formulario Completo de Crear / Editar Tarifa */}
          {(showAddForm || editingPlanId) && (
            <div className="bg-slate-50 dark:bg-slate-900/60 border-2 border-indigo-500/40 p-6 rounded-3xl flex flex-col gap-5 shadow-lg animate-in fade-in slide-in-from-top-3 duration-250">
              <div className="flex justify-between items-center border-b border-slate-200 dark:border-slate-800 pb-3">
                <h4 className="text-sm font-black text-slate-900 dark:text-slate-100 flex items-center gap-2 uppercase tracking-wider">
                  <Sparkles className="h-4 w-4 text-indigo-600" />
                  {editingPlanId ? `Editar Tarifa: ${planForm.name}` : `Crear Nueva Tarifa para ${selectedOperator.toUpperCase()}`}
                </h4>
                <button 
                  onClick={() => { setEditingPlanId(null); setShowAddForm(false); }}
                  className="p-1.5 rounded-full hover:bg-slate-200 dark:hover:bg-slate-800 text-slate-400 hover:text-slate-700 cursor-pointer"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>

              {/* Fila 1: Nombre, Categoría, Precio, Precio Regular */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="lg:col-span-2">
                  <label className="text-[10px] font-black text-slate-500 block mb-1 uppercase">
                    Nombre Comercial de la Tarifa *
                  </label>
                  <input 
                    type="text" 
                    value={planForm.name}
                    onChange={(e) => setPlanForm({ ...planForm, name: e.target.value })}
                    placeholder="Ej: Fibra 600Mb + 2 Ilimitadas + TV"
                    className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl px-3.5 py-2.5 text-xs font-bold focus:ring-2 focus:ring-indigo-500 outline-none"
                  />
                </div>

                <div>
                  <label className="text-[10px] font-black text-slate-500 block mb-1 uppercase">
                    Clasificación / Categoría *
                  </label>
                  <select
                    value={planForm.category}
                    onChange={(e) => setPlanForm({ ...planForm, category: e.target.value as Plan['category'] })}
                    className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl px-3 py-2.5 text-xs font-bold focus:ring-2 focus:ring-indigo-500 outline-none"
                  >
                    {categoryOptions.map(cat => (
                      <option key={cat.id} value={cat.id}>{cat.label}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="text-[10px] font-black text-slate-500 block mb-1 uppercase">
                    Precio Mensual Actual ({selectedOperator === 'win' ? 'S/' : '€'}) *
                  </label>
                  <input 
                    type="number" 
                    step="0.01"
                    value={planForm.price || ''}
                    onChange={(e) => setPlanForm({ ...planForm, price: Number(e.target.value) })}
                    placeholder="Ej: 49.00"
                    className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl px-3.5 py-2.5 text-xs font-black text-indigo-600 focus:ring-2 focus:ring-indigo-500 outline-none"
                  />
                </div>
              </div>

              {/* Fila 2: Fibra, Móvil, TV, Segmento/Filtro */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <div>
                  <label className="text-[10px] font-black text-slate-500 block mb-1 uppercase">
                    Velocidad de Fibra
                  </label>
                  <input 
                    type="text" 
                    value={planForm.speed}
                    onChange={(e) => setPlanForm({ ...planForm, speed: e.target.value })}
                    placeholder="Ej: 600Mb, 1Gb, Sin fibra"
                    className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl px-3 py-2 text-xs font-bold outline-none"
                  />
                </div>

                <div>
                  <label className="text-[10px] font-black text-slate-500 block mb-1 uppercase">
                    Líneas / Datos Móviles
                  </label>
                  <input 
                    type="text" 
                    value={planForm.mobile}
                    onChange={(e) => setPlanForm({ ...planForm, mobile: e.target.value })}
                    placeholder="Ej: 2x Ilimitadas 160GB 5G"
                    className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl px-3 py-2 text-xs font-bold outline-none"
                  />
                </div>

                <div>
                  <label className="text-[10px] font-black text-slate-500 block mb-1 uppercase">
                    Televisión / Streaming
                  </label>
                  <input 
                    type="text" 
                    value={planForm.tv}
                    onChange={(e) => setPlanForm({ ...planForm, tv: e.target.value })}
                    placeholder="Ej: Vodafone TV + Prime / Sin TV"
                    className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl px-3 py-2 text-xs font-bold outline-none"
                  />
                </div>

                <div>
                  <label className="text-[10px] font-black text-slate-500 block mb-1 uppercase">
                    Filtro / Segmento Específico
                  </label>
                  <input 
                    type="text" 
                    value={planForm.segment}
                    onChange={(e) => setPlanForm({ ...planForm, segment: e.target.value })}
                    placeholder="Ej: Portabilidad Digi / Con equipo"
                    className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl px-3 py-2 text-xs font-bold outline-none"
                  />
                </div>
              </div>

              {/* Fila 3: Ajustes de Promoción y Stickers */}
              <div className="p-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl grid grid-cols-1 md:grid-cols-4 gap-4 items-center">
                <div className="flex items-center gap-2 select-none">
                  <input 
                    type="checkbox" 
                    id="isPromoCheck"
                    checked={planForm.isPromo}
                    onChange={(e) => setPlanForm({ ...planForm, isPromo: e.target.checked })}
                    className="rounded border-slate-300 text-indigo-600 focus:ring-indigo-500 h-4 w-4 cursor-pointer"
                  />
                  <label htmlFor="isPromoCheck" className="text-xs font-black text-slate-700 dark:text-slate-300 cursor-pointer">
                    ¿Tiene Precio Promocional?
                  </label>
                </div>

                {planForm.isPromo && (
                  <>
                    <div>
                      <label className="text-[9px] font-bold text-slate-400 block mb-0.5 uppercase">Meses de Promo</label>
                      <input 
                        type="number" 
                        value={planForm.promoMonths}
                        onChange={(e) => setPlanForm({ ...planForm, promoMonths: Number(e.target.value) })}
                        placeholder="Ej: 3, 6 o 12"
                        className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg px-2.5 py-1 text-xs font-bold"
                      />
                    </div>

                    <div>
                      <label className="text-[9px] font-bold text-slate-400 block mb-0.5 uppercase">Precio Luego de Promo</label>
                      <input 
                        type="number" 
                        step="0.01"
                        value={planForm.priceAfterPromo || ''}
                        onChange={(e) => setPlanForm({ ...planForm, priceAfterPromo: Number(e.target.value) })}
                        placeholder="Ej: 73.00"
                        className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg px-2.5 py-1 text-xs font-bold"
                      />
                    </div>
                  </>
                )}

                <div className="flex items-center gap-2 select-none md:col-start-4">
                  <input 
                    type="checkbox" 
                    id="isNewCampaignCheck"
                    checked={planForm.isNewCampaign}
                    onChange={(e) => setPlanForm({ ...planForm, isNewCampaign: e.target.checked })}
                    className="rounded border-slate-300 text-indigo-600 focus:ring-indigo-500 h-4 w-4 cursor-pointer"
                  />
                  <label htmlFor="isNewCampaignCheck" className="text-xs font-black text-amber-600 dark:text-amber-400 cursor-pointer flex items-center gap-1">
                    🏷️ Sticker "Nueva Tarifa"
                  </label>
                </div>
              </div>

              {/* Fila 4: Características y Etiquetas */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-[10px] font-black text-slate-500 block mb-1 uppercase">
                    Puntos Clave / Características (1 por línea)
                  </label>
                  <textarea 
                    rows={2}
                    value={planForm.features}
                    onChange={(e) => setPlanForm({ ...planForm, features: e.target.value })}
                    placeholder="Fibra 600Mbps Simétrica&#10;2 líneas móviles 160GB 5G&#10;Roaming incluido"
                    className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-2.5 text-xs font-medium outline-none resize-none"
                  />
                </div>

                <div>
                  <label className="text-[10px] font-black text-slate-500 block mb-1 uppercase">
                    Etiquetas de Filtro (Separadas por comas)
                  </label>
                  <textarea 
                    rows={2}
                    value={planForm.tags}
                    onChange={(e) => setPlanForm({ ...planForm, tags: e.target.value })}
                    placeholder="Oferta Flash, Fibra 600, 2 líneas, Prime"
                    className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-2.5 text-xs font-medium outline-none resize-none"
                  />
                </div>
              </div>

              {/* Botones de Acción Formulario */}
              <div className="flex justify-end gap-3 pt-2 border-t border-slate-200 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => { setEditingPlanId(null); setShowAddForm(false); }}
                  className="px-5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 text-xs font-bold text-slate-600 dark:text-slate-300 hover:bg-slate-100 cursor-pointer"
                >
                  Cancelar
                </button>
                <button
                  type="button"
                  onClick={editingPlanId ? () => handleSaveEdit(editingPlanId) : handleCreatePlan}
                  className="px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-black uppercase tracking-wider flex items-center gap-2 cursor-pointer shadow-md"
                >
                  <Save className="h-4 w-4" />
                  {editingPlanId ? 'Actualizar Tarifa' : 'Guardar y Publicar'}
                </button>
              </div>
            </div>
          )}

          {/* Lista de Tarifas Filtradas por Operador */}
          <div className="bg-white dark:bg-[#111827] border border-slate-200/80 dark:border-slate-800 rounded-3xl overflow-hidden shadow-sm">
            <div className="p-4 border-b border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/10 flex justify-between items-center">
              <span className="text-[11px] font-black text-slate-500 uppercase tracking-wider">
                Catálogo Activo de {selectedOperator.toUpperCase()} ({plans.filter(p => p.operatorId === selectedOperator).length} tarifas)
              </span>
              <span className="text-[10px] text-slate-400 font-bold">
                💾 Todo se guarda automáticamente en memoria local
              </span>
            </div>

            <div className="divide-y divide-slate-100 dark:divide-slate-850">
              {plans.filter(p => p.operatorId === selectedOperator).map(plan => {
                const isCompany = plan.category === 'fibra_movil_empresa' || plan.tags?.includes('Empresa') || plan.tags?.includes('TV Bares') || plan.id.includes('mi-negocio') || plan.id.includes('tv-bares');
                const isSecond = plan.category === 'segunda_residencia' || plan.tags?.includes('Segunda Residencia');
                const isSoloM = plan.category === 'solo_movil';

                return (
                  <div key={plan.id} className="p-4 flex flex-col md:flex-row md:items-center justify-between gap-4 hover:bg-slate-50/50 dark:hover:bg-slate-900/30 transition-colors">
                    <div className="flex-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="text-sm font-black text-slate-900 dark:text-slate-100">{plan.name}</span>
                        
                        {/* Badges de Estado */}
                        {isCompany && <span className="text-[8px] bg-blue-600 text-white font-black px-2 py-0.5 rounded-md">EMPRESA / PRO</span>}
                        {isSecond && <span className="text-[8px] bg-indigo-600 text-white font-black px-2 py-0.5 rounded-md">2ª RESIDENCIA</span>}
                        {isSoloM && <span className="text-[8px] bg-amber-600 text-white font-black px-2 py-0.5 rounded-md">SOLO MÓVIL</span>}
                        {!isCompany && !isSecond && !isSoloM && <span className="text-[8px] bg-emerald-600 text-white font-black px-2 py-0.5 rounded-md">RESIDENCIAL</span>}
                        
                        {plan.isNewCampaign && (
                          <span className="text-[8px] bg-amber-400 text-slate-900 font-black px-2 py-0.5 rounded-md uppercase">
                            🏷️ Nueva Tarifa
                          </span>
                        )}

                        {plan.isPromo && (
                          <span className="text-[8px] bg-red-600 text-white font-black px-2 py-0.5 rounded-md uppercase">
                            Promo {plan.promoMonths || 3}M
                          </span>
                        )}
                      </div>

                      <div className="flex flex-wrap items-center gap-x-4 gap-y-1 mt-1 text-[11px] text-slate-500">
                        <span>Precio: <strong className="text-slate-900 dark:text-slate-100 font-black">{plan.price} {selectedOperator === 'win' ? 'S/' : '€'}/mes</strong></span>
                        {plan.isPromo && plan.priceAfterPromo && (
                          <span>Luego: <strong className="text-slate-700 dark:text-slate-300 font-bold">{plan.priceAfterPromo} {selectedOperator === 'win' ? 'S/' : '€'}</strong></span>
                        )}
                        <span>Fibra: <strong>{plan.speed}</strong></span>
                        <span>Móvil: <strong>{plan.mobile}</strong></span>
                        {plan.tv && <span>TV: <strong>{plan.tv}</strong></span>}
                      </div>

                      {plan.tags && plan.tags.length > 0 && (
                        <div className="flex flex-wrap gap-1 mt-1.5">
                          {plan.tags.map((t, idx) => (
                            <span key={idx} className="text-[8.5px] bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 px-1.5 py-0.2 rounded font-medium">
                              #{t}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      <button
                        onClick={() => handleStartEdit(plan)}
                        className="px-3 py-1.5 border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-300 hover:text-indigo-600 hover:border-indigo-300 rounded-xl text-xs font-bold flex items-center gap-1 cursor-pointer transition-all"
                      >
                        <Edit2 className="h-3.5 w-3.5" />
                        Editar
                      </button>
                      <button
                        onClick={() => handleDeletePlan(plan.id)}
                        className="p-2 border border-slate-200 dark:border-slate-800 text-slate-400 hover:text-red-600 hover:border-red-300 rounded-xl cursor-pointer transition-all"
                        title="Eliminar"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* Pestañas restantes: Permiso, WhatsApp, Embudo, Seguridad */}
      {activeAdminTab === 'permiso' && (
        <div className="flex flex-col gap-6 w-full animate-in fade-in duration-200">
          <PermisoPanel darkMode={darkMode} operatorColor={operatorColor} />
        </div>
      )}

      {activeAdminTab === 'whatsapp-propuestas' && (
        <div className="flex flex-col gap-6 w-full animate-in fade-in duration-200">
          <div className="flex justify-between items-center">
            <div>
              <h3 className="text-lg font-black text-slate-900 dark:text-slate-100 tracking-tight flex items-center gap-2">
                <Share2 className="h-5 w-5 text-indigo-600" />
                Conexión WhatsApp Propuestas
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                Escanea el código QR para conectar el canal oficial de envío de propuestas.
              </p>
            </div>
          </div>

          <div className="border border-slate-150 dark:border-slate-850 rounded-2xl p-6 bg-slate-50 dark:bg-slate-900/50 flex flex-col items-center justify-center text-center gap-4">
            {wspConnectionState === 'loading' && (
              <div className="flex flex-col items-center gap-2 py-4">
                <span className="animate-spin h-8 w-8 border-4 border-indigo-600 border-t-transparent rounded-full" />
                <span className="text-xs font-bold text-slate-500 dark:text-slate-400">Verificando conexión...</span>
              </div>
            )}

            {wspConnectionState === 'open' && (
              <div className="flex flex-col items-center gap-3 py-2">
                <div className="h-14 w-14 rounded-full bg-emerald-100 dark:bg-emerald-950/30 flex items-center justify-center text-emerald-600 dark:text-emerald-400 text-2xl font-bold">
                  ✓
                </div>
                <div>
                  <span className="text-xs bg-emerald-100 dark:bg-emerald-950/20 border border-emerald-250/20 px-3 py-1 rounded-full font-black text-emerald-700 dark:text-emerald-400 uppercase tracking-wider">
                    WhatsApp Conectado
                  </span>
                  <p className="text-[11px] text-slate-400 dark:text-slate-500 mt-2 font-medium">La sesión está activa. Listo para enviar cotizaciones directas.</p>
                </div>
                <div className="flex flex-wrap gap-3 mt-2">
                  <button 
                    onClick={handleDisconnectWSP}
                    className="text-xs font-bold px-4 py-2 border border-red-200 dark:border-red-900 hover:bg-red-50 text-red-650 rounded-xl cursor-pointer"
                  >
                    Desconectar Sesión
                  </button>
                  <button 
                    onClick={handleResetWSP}
                    className="text-xs font-bold px-4 py-2 border border-amber-300 dark:border-amber-800 hover:bg-amber-50 text-amber-650 rounded-xl cursor-pointer flex items-center gap-1.5"
                  >
                    <RefreshCw className="h-3.5 w-3.5" /> Restablecer Conexión
                  </button>
                </div>
              </div>
            )}

            {wspConnectionState === 'close' && !qrCodeBase64 && (
              <div className="flex flex-col items-center gap-3 py-4">
                <div className="h-14 w-14 rounded-full bg-slate-200 dark:bg-slate-800 flex items-center justify-center text-slate-500 text-2xl font-bold">
                  !
                </div>
                <div>
                  <span className="text-xs bg-slate-100 dark:bg-slate-900 border border-slate-200 px-3 py-1 rounded-full font-black text-slate-500 uppercase tracking-wider">
                    WhatsApp Desconectado
                  </span>
                  <p className="text-[11px] text-slate-400 mt-2 font-medium">No hay ninguna sesión de WhatsApp activa.</p>
                </div>
                <button 
                  onClick={handleConnectWSP}
                  className="bg-[#FE0002] hover:bg-[#D10002] text-white text-xs font-bold px-6 py-2.5 rounded-xl uppercase tracking-wider transition-all cursor-pointer shadow-sm"
                >
                  Conectar WhatsApp / Mostrar QR
                </button>
              </div>
            )}

            {qrCodeBase64 && (
              <div className="flex flex-col items-center gap-4 py-2 w-full">
                <span className="text-xs bg-amber-100 border border-amber-200 px-3 py-1 rounded-full font-black text-amber-700 uppercase tracking-wider animate-pulse">
                  Escanea el Código QR
                </span>
                <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-md">
                  <img 
                    src={qrCodeBase64} 
                    alt="Código QR de WhatsApp" 
                    className="h-64 w-64 object-contain"
                  />
                </div>
                <button 
                  onClick={() => { setQrCodeBase64(''); setWspConnectionState('close'); }}
                  className="text-xs font-bold text-slate-450 hover:bg-slate-100 rounded-xl px-4 py-2 cursor-pointer"
                >
                  Cancelar
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {activeAdminTab === 'embudo' && (
        <div className="flex flex-col gap-6 w-full animate-in fade-in duration-200">
          <EmbudoPanel darkMode={darkMode} operatorColor={operatorColor} />
        </div>
      )}

      {activeAdminTab === 'seguridad-ip' && (
        <div className="flex flex-col gap-6 w-full animate-in fade-in duration-200">
          <div className="bg-white dark:bg-[#111827] border border-slate-200/80 dark:border-slate-800 rounded-3xl p-6 shadow-sm">
            <h3 className="text-lg font-black text-slate-900 dark:text-slate-100 tracking-tight flex items-center gap-2">
              <Shield className="h-5 w-5 text-indigo-600" />
              Restricción de Acceso por IP
            </h3>
            <p className="text-xs text-slate-500 mt-1">
              Configura qué direcciones IP tienen permitido el acceso al panel tarifario.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
