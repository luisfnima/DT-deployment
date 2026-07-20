'use client';

import React, { useState } from 'react';
import { 
  Plus, Edit2, Trash2, Save, X, Database, 
  Sparkles, Wifi, Smartphone, Tv, Check, RefreshCw,
  PhoneCall, Bot, Settings, Share2, SeparatorHorizontal,
  Shield, Info
} from 'lucide-react';
import { Plan, Addon } from '@/data/plans';
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
  const [showContraConnection, setShowContraConnection] = useState<boolean>(false);
  const [selectedOperator, setSelectedOperator] = useState<string>('yoigo');
  const [editingPlanId, setEditingPlanId] = useState<string | null>(null);
  const [newIpInput, setNewIpInput] = useState('');
  const [localIps, setLocalIps] = useState<string[]>(allowedIps || []);
  const [localEnabled, setLocalEnabled] = useState<boolean>(ipRestrictionEnabled || false);

  React.useEffect(() => {
    setLocalIps(allowedIps || []);
    setLocalEnabled(ipRestrictionEnabled || false);
  }, [allowedIps, ipRestrictionEnabled]);
  
  // Edit states for plans
  const [editPlanName, setEditPlanName] = useState('');
  const [editPlanPrice, setEditPlanPrice] = useState(0);
  const [editPlanCampaign, setEditPlanCampaign] = useState(false);
  const [editPlanCategory, setEditPlanCategory] = useState<Plan['category']>('fibra_movil');
  const [editPlanSegment, setEditPlanSegment] = useState('');
  
  // Create state for plans
  const [newPlanName, setNewPlanName] = useState('');
  const [newPlanPrice, setNewPlanPrice] = useState(0);
  const [newPlanCampaign, setNewPlanCampaign] = useState(false);
  const [newPlanCategory, setNewPlanCategory] = useState<Plan['category']>('fibra_movil');
  const [newPlanSegment, setNewPlanSegment] = useState('');
  const [showAddForm, setShowAddForm] = useState(false);

  const operatorsList = [
    { id: 'yoigo', label: 'Yoigo' },
    { id: 'orange', label: 'Orange' },
    { id: 'vodafone', label: 'Vodafone' },
    { id: 'lowi', label: 'Lowi' },
    { id: 'win', label: 'WIN' }
  ];

  const handleEditPlan = (plan: Plan) => {
    setEditingPlanId(plan.id);
    setEditPlanName(plan.name);
    setEditPlanPrice(plan.price);
    setEditPlanCampaign(!!plan.isNewCampaign);
    setEditPlanCategory(plan.category || 'fibra_movil');
    setEditPlanSegment(plan.segment || '');
  };

  const handleSavePlan = (planId: string) => {
    const updated = plans.map(p => {
      if (p.id === planId) {
        return {
          ...p,
          name: editPlanName,
          price: editPlanPrice,
          isNewCampaign: editPlanCampaign,
          category: editPlanCategory,
          segment: editPlanSegment || undefined
        };
      }
      return p;
    });
    setPlans(updated);
    localStorage.setItem('custom_plans', JSON.stringify(updated));
    setEditingPlanId(null);
  };

  const handleDeletePlan = (planId: string) => {
    if (confirm('¿Estás seguro de que deseas eliminar esta tarifa?')) {
      const updated = plans.filter(p => p.id !== planId);
      setPlans(updated);
      localStorage.setItem('custom_plans', JSON.stringify(updated));
    }
  };

  const handleAddPlan = () => {
    if (!newPlanName || newPlanPrice <= 0) {
      alert('Ingresa un nombre y precio válidos.');
      return;
    }
    const newId = `${selectedOperator}-${Date.now()}`;
    const newPlan: Plan = {
      id: newId,
      name: newPlanName,
      price: newPlanPrice,
      operatorId: selectedOperator,
      isNewCampaign: newPlanCampaign,
      category: newPlanCategory,
      segment: newPlanSegment || undefined,
      speed: '1Gb',
      mobile: 'Ilimitada 5G',
      isPromo: false,
      priceKind: 'final',
      features: ['Velocidad de alta velocidad', 'Líneas móviles 5G', 'Instalación gratuita']
    };
    const updated = [...plans, newPlan];
    setPlans(updated);
    localStorage.setItem('custom_plans', JSON.stringify(updated));
    
    // Reset Form
    setNewPlanName('');
    setNewPlanPrice(0);
    setNewPlanCampaign(false);
    setNewPlanSegment('');
    setShowAddForm(false);
  };

  return (
    <div className="flex flex-col gap-6 w-full">
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
          Tarifas
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

      {/* Renderizado de Pestañas Activas */}
      {activeAdminTab === 'tarifas' && (
        <div className="flex flex-col gap-6 w-full animate-in fade-in duration-200">
          {/* Header Panel */}
          <div className="flex justify-between items-center">
            <div>
              <h3 className="text-lg font-black text-slate-900 dark:text-slate-100 tracking-tight flex items-center gap-2">
                <Database className="h-5 w-5" style={{ color: operatorColor }} />
                Administrador de Tarifas
              </h3>
              <p className="text-[10px] text-slate-450 dark:text-slate-500">
                Modifica y sincroniza planes de operadores en caliente.
              </p>
            </div>
            
            <button
              onClick={() => setShowAddForm(!showAddForm)}
              className="bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-black uppercase px-4 py-2.5 rounded-xl transition-all shadow-md shadow-indigo-500/10 flex items-center gap-1.5 cursor-pointer"
            >
              <Plus className="h-4 w-4" />
              Añadir Nueva Tarifa
            </button>
          </div>

          {/* Selector de Operador */}
          <div className="flex gap-2 p-1.5 bg-slate-150/40 dark:bg-slate-900/60 rounded-2xl border border-slate-200/50 dark:border-slate-800">
            {operatorsList.map(op => (
              <button
                key={op.id}
                onClick={() => setSelectedOperator(op.id)}
                className={`flex-1 py-2 text-xs font-black rounded-xl transition-all ${
                  selectedOperator === op.id
                    ? 'bg-white dark:bg-[#111827] text-slate-900 dark:text-slate-100 shadow-sm border border-slate-200/50 dark:border-slate-800'
                    : 'text-slate-500 hover:text-slate-900 dark:hover:text-slate-350'
                }`}
              >
                {op.label}
              </button>
            ))}
          </div>

          {/* Formulario de Añadir Tarifa */}
          {showAddForm && (
            <div className="bg-slate-50 dark:bg-slate-900/40 border border-indigo-500/30 p-5 rounded-2xl flex flex-col gap-4 animate-in fade-in slide-in-from-top-3 duration-250">
              <h4 className="text-xs font-black text-slate-800 dark:text-slate-200 flex items-center gap-1 uppercase tracking-wider">
                ✨ Crear Tarifa para {selectedOperator.toUpperCase()}
              </h4>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <div>
                  <label className="text-[9px] font-extrabold text-slate-400 block mb-1 uppercase">Nombre del Plan</label>
                  <input 
                    type="text" 
                    value={newPlanName}
                    onChange={(e) => setNewPlanName(e.target.value)}
                    placeholder="Ej: Fibra 1Gb + 2 ilimitadas"
                    className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl px-3 py-2 text-xs font-bold focus:outline-none"
                  />
                </div>
                
                <div>
                  <label className="text-[9px] font-extrabold text-slate-400 block mb-1 uppercase">Precio Mensual (€)</label>
                  <input 
                    type="number" 
                    value={newPlanPrice || ''}
                    onChange={(e) => setNewPlanPrice(Number(e.target.value))}
                    placeholder="Ej: 39"
                    className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl px-3 py-2 text-xs font-bold focus:outline-none"
                  />
                </div>

                <div>
                  <label className="text-[9px] font-extrabold text-slate-400 block mb-1 uppercase">Segmento / Filtro</label>
                  <input 
                    type="text" 
                    value={newPlanSegment}
                    onChange={(e) => setNewPlanSegment(e.target.value)}
                    placeholder="Ej: Solo Portabilidad"
                    className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl px-3 py-2 text-xs font-bold focus:outline-none"
                  />
                </div>

                <div className="flex items-center gap-2 mt-4 select-none">
                  <input 
                    type="checkbox" 
                    id="newPlanCampaign"
                    checked={newPlanCampaign}
                    onChange={(e) => setNewPlanCampaign(e.target.checked)}
                    className="rounded border-slate-300 text-indigo-600 focus:ring-indigo-500 h-4 w-4"
                  />
                  <label htmlFor="newPlanCampaign" className="text-xs font-bold text-slate-700 dark:text-slate-350 cursor-pointer">
                    ¿Campaña Nueva (Sticker)?
                  </label>
                </div>
              </div>

              <div className="flex gap-2 justify-end">
                <button
                  onClick={() => setShowAddForm(false)}
                  className="bg-slate-200 dark:bg-slate-800 hover:bg-slate-300 dark:hover:bg-slate-700 text-slate-750 dark:text-slate-200 text-xs font-black uppercase px-4 py-2 rounded-xl cursor-pointer"
                >
                  Cancelar
                </button>
                <button
                  onClick={handleAddPlan}
                  className="bg-indigo-600 hover:bg-indigo-750 text-white text-xs font-black uppercase px-4 py-2 rounded-xl cursor-pointer"
                >
                  Guardar Tarifa
                </button>
              </div>
            </div>
          )}

          {/* Lista de Tarifas */}
          <div className="bg-white dark:bg-[#111827] border border-slate-200/80 dark:border-slate-800 rounded-3xl overflow-hidden shadow-sm">
            <div className="p-4 border-b border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/10">
              <span className="text-[10px] font-black text-slate-400 uppercase tracking-wider">Tarifas Registradas ({selectedOperator.toUpperCase()})</span>
            </div>

            <div className="divide-y divide-slate-100 dark:divide-slate-850">
              {plans.filter(p => p.operatorId === selectedOperator).map(plan => {
                const isEditing = editingPlanId === plan.id;
                
                return (
                  <div key={plan.id} className="p-4 flex flex-col md:flex-row md:items-center justify-between gap-4">
                    {isEditing ? (
                      <div className="flex-1 grid grid-cols-1 md:grid-cols-4 gap-3">
                        <div>
                          <label className="text-[8px] font-extrabold text-slate-450 block uppercase">Nombre del Plan</label>
                          <input 
                            type="text" 
                            value={editPlanName} 
                            onChange={(e) => setEditPlanName(e.target.value)}
                            className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg px-2.5 py-1.5 text-xs font-bold"
                          />
                        </div>
                        <div>
                          <label className="text-[8px] font-extrabold text-slate-450 block uppercase">Precio Mensual (€)</label>
                          <input 
                            type="number" 
                            value={editPlanPrice} 
                            onChange={(e) => setEditPlanPrice(Number(e.target.value))}
                            className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg px-2.5 py-1.5 text-xs font-bold"
                          />
                        </div>
                        <div>
                          <label className="text-[8px] font-extrabold text-slate-450 block uppercase">Segmento</label>
                          <input 
                            type="text" 
                            value={editPlanSegment} 
                            onChange={(e) => setEditPlanSegment(e.target.value)}
                            className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg px-2.5 py-1.5 text-xs font-bold"
                          />
                        </div>
                        <div className="flex items-center gap-2 mt-4 select-none">
                          <input 
                            type="checkbox" 
                            id={`editPlanCampaign-${plan.id}`}
                            checked={editPlanCampaign}
                            onChange={(e) => setEditPlanCampaign(e.target.checked)}
                            className="rounded border-slate-300 text-indigo-600 focus:ring-indigo-500 h-4 w-4"
                          />
                          <label htmlFor={`editPlanCampaign-${plan.id}`} className="text-xs font-bold text-slate-700 dark:text-slate-350 cursor-pointer">
                            ¿Campaña Nueva?
                          </label>
                        </div>
                      </div>
                    ) : (
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-black text-slate-900 dark:text-slate-100">{plan.name}</span>
                          {plan.isNewCampaign && (
                            <span className="text-[8px] bg-yellow-400 text-slate-900 font-black px-2 py-0.5 rounded-full uppercase">Nueva Campaña</span>
                          )}
                        </div>
                        <div className="flex flex-wrap items-center gap-x-4 gap-y-1 mt-1 text-[10px] text-slate-450">
                          <span>Precio: <strong className="text-slate-700 dark:text-slate-350 font-bold">{plan.price} €/mes</strong></span>
                          {plan.segment && <span>Filtro: <strong className="text-slate-750 font-bold">{plan.segment}</strong></span>}
                          <span>ID: <code className="bg-slate-100 dark:bg-slate-900 px-1 py-0.5 rounded font-mono text-[9px]">{plan.id}</code></span>
                        </div>
                      </div>
                    )}

                    <div className="flex gap-2 shrink-0 justify-end">
                      {isEditing ? (
                        <>
                          <button
                            onClick={() => setEditingPlanId(null)}
                            className="p-2 border border-slate-200 dark:border-slate-800 text-slate-500 hover:text-slate-700 rounded-xl cursor-pointer"
                            title="Cancelar"
                          >
                            <X className="h-4 w-4" />
                          </button>
                          <button
                            onClick={() => handleSavePlan(plan.id)}
                            className="p-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl cursor-pointer"
                            title="Guardar"
                          >
                            <Save className="h-4 w-4" />
                          </button>
                        </>
                      ) : (
                        <>
                          <button
                            onClick={() => handleEditPlan(plan)}
                            className="p-2 border border-slate-200 dark:border-slate-800 text-slate-500 hover:text-indigo-600 dark:hover:text-indigo-400 rounded-xl cursor-pointer transition-all"
                            title="Editar"
                          >
                            <Edit2 className="h-4 w-4" />
                          </button>
                          <button
                            onClick={() => handleDeletePlan(plan.id)}
                            className="p-2 border border-slate-200 dark:border-slate-800 text-slate-500 hover:text-red-600 rounded-xl cursor-pointer transition-all"
                            title="Eliminar"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {activeAdminTab === 'permiso' && (
        <div className="animate-in fade-in duration-200">
          <PermisoPanel darkMode={darkMode} operatorColor={operatorColor} />
        </div>
      )}

      {activeAdminTab === 'whatsapp-propuestas' && (
        <div className="animate-in fade-in duration-200 col-span-12 max-w-2xl mx-auto bg-white dark:bg-[#111827] p-8 rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-md flex flex-col gap-6 w-full mt-2">
          <div>
            <h3 className="text-xl font-black text-slate-900 dark:text-slate-100 tracking-tight flex items-center gap-2">
              <Share2 className="h-5 w-5 text-indigo-600" />
              Conexión de WhatsApp Propuestas (QR Directo)
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              Escanea el código QR para conectar el canal oficial de envío de propuestas. Las cotizaciones se enviarán automáticamente a través de este número.
            </p>
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
                  <p className="text-[11px] text-slate-400 dark:text-slate-500 mt-2 font-medium">La sesión está activa en tu Evolution API local. Listo para enviar cotizaciones.</p>
                </div>
                <div className="flex flex-wrap gap-3 mt-2">
                  <button 
                    onClick={handleDisconnectWSP}
                    className="text-xs font-bold px-4 py-2 border border-red-200 dark:border-red-900 hover:border-red-300 dark:hover:bg-red-950/20 hover:bg-red-50 text-red-650 rounded-xl cursor-pointer"
                  >
                    Desconectar Sesión
                  </button>
                  <button 
                    onClick={handleResetWSP}
                    className="text-xs font-bold px-4 py-2 border border-amber-300 dark:border-amber-800 hover:border-amber-400 dark:hover:bg-amber-950/20 hover:bg-amber-50 text-amber-650 dark:text-amber-400 rounded-xl cursor-pointer flex items-center gap-1.5"
                    title="Fuerza un reinicio y recreación de la instancia en Render si se encuentra colgada"
                  >
                    <RefreshCw className="h-3.5 w-3.5" /> Restablecer Conexión
                  </button>
                </div>
              </div>
            )}

            {wspConnectionState === 'connecting' && !qrCodeBase64 && (
              <div className="flex flex-col items-center gap-2 py-4">
                <span className="animate-spin h-8 w-8 border-4 border-indigo-600 border-t-transparent rounded-full" />
                <span className="text-xs font-bold text-slate-500 dark:text-slate-400">Iniciando instancia y pidiendo código QR...</span>
              </div>
            )}

            {wspConnectionState === 'close' && !qrCodeBase64 && (
              <div className="flex flex-col items-center gap-3 py-4">
                <div className="h-14 w-14 rounded-full bg-slate-200 dark:bg-slate-800 flex items-center justify-center text-slate-500 text-2xl font-bold">
                  !
                </div>
                <div>
                  <span className="text-xs bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-850 px-3 py-1 rounded-full font-black text-slate-500 dark:text-slate-450 uppercase tracking-wider">
                    WhatsApp Desconectado
                  </span>
                  <p className="text-[11px] text-slate-400 dark:text-slate-500 mt-2 font-medium">No hay ninguna sesión de WhatsApp activa en el servidor local.</p>
                </div>
                <div className="flex flex-wrap gap-3 mt-2">
                  <button 
                    onClick={handleConnectWSP}
                    className="bg-[#FE0002] hover:bg-[#D10002] text-white text-xs font-bold px-6 py-2.5 rounded-xl uppercase tracking-wider transition-all cursor-pointer flex items-center gap-1.5 shadow-sm"
                  >
                    Conectar WhatsApp / Mostrar QR
                  </button>
                  <button 
                    onClick={handleResetWSP}
                    className="text-xs font-bold px-4 py-2.5 border border-amber-300 dark:border-amber-800 hover:border-amber-400 dark:hover:bg-amber-950/20 hover:bg-amber-50/50 text-amber-650 dark:text-amber-400 rounded-xl cursor-pointer flex items-center gap-1.5"
                    title="Limpia la sesión corrupta de Baileys y vuelve a crear la instancia en Render"
                  >
                    <RefreshCw className="h-3.5 w-3.5" /> Restablecer Instancia
                  </button>
                </div>
              </div>
            )}

            {qrCodeBase64 && (
              <div className="flex flex-col items-center gap-4 py-2 w-full">
                <span className="text-xs bg-amber-100 dark:bg-amber-950/20 border border-amber-250/20 px-3 py-1 rounded-full font-black text-amber-700 dark:text-amber-400 uppercase tracking-wider animate-pulse">
                  Escanea el Código QR
                </span>
                <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-md">
                  <img 
                    src={qrCodeBase64} 
                    alt="Código QR de WhatsApp" 
                    className="h-64 w-64 object-contain"
                  />
                </div>
                <p className="text-[10px] text-slate-450 max-w-sm leading-relaxed font-semibold">
                  Abre WhatsApp en tu teléfono, ve a Dispositivos Vinculados, selecciona Vincular un dispositivo y apunta la cámara a la pantalla.
                </p>
                <button 
                  onClick={() => { setQrCodeBase64(''); setWspConnectionState('close'); }}
                  className="text-xs font-bold text-slate-450 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl px-4 py-2 cursor-pointer"
                >
                  Cancelar
                </button>
              </div>
            )}
          </div>

          <div className="border-t border-slate-100 dark:border-slate-850 my-2" />

          <h4 className="text-xs font-black text-slate-900 dark:text-slate-100 flex items-center gap-1.5 uppercase tracking-wider">
            👤 CONFIGURACIÓN PREMEDITADA DEL ASESOR
          </h4>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div>
              <label className="text-[10px] font-extrabold text-slate-400 dark:text-slate-500 block mb-1.5 uppercase tracking-wider">Nombre del Asesor</label>
              <input 
                type="text" 
                value={advisorName} 
                onChange={(e) => setAdvisorName(e.target.value)} 
                placeholder="Ej: Carlos Mendoza"
                className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-2.5 text-xs text-slate-850 dark:text-slate-200 font-bold focus:outline-none"
              />
            </div>
            <div>
              <label className="text-[10px] font-extrabold text-slate-400 dark:text-slate-500 block mb-1.5 uppercase tracking-wider">Cargo / Rol Comercial</label>
              <input 
                type="text" 
                value={advisorRole} 
                onChange={(e) => setAdvisorRole(e.target.value)} 
                placeholder="Ej: Supervisor de Ventas"
                className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-2.5 text-xs text-slate-850 dark:text-slate-200 font-bold focus:outline-none"
              />
            </div>
          </div>

          <div className="flex justify-end gap-3 mt-4 pt-4 border-t border-slate-100 dark:border-slate-850">
            <button 
              onClick={() => {
                saveAdvisorInfo(advisorName, advisorRole);
                alert('¡Configuración guardada correctamente!');
                setActiveTab('cotizador');
              }}
              className="bg-indigo-600 hover:bg-indigo-750 text-white px-6 py-2.5 rounded-xl font-bold text-xs uppercase tracking-wider transition-all cursor-pointer"
            >
              Guardar y Volver
            </button>
          </div>
        </div>
      )}

      {activeAdminTab === 'embudo' && (
        <div className="animate-in fade-in duration-200 flex flex-col gap-6">
          {/* Botón Acordeón Desplegable para Conexión de WhatsApp */}
          <div className="max-w-2xl mx-auto w-full">
            <button
              onClick={() => setShowContraConnection(!showContraConnection)}
              className="w-full flex items-center justify-between px-6 py-4 bg-slate-50 dark:bg-slate-900 hover:bg-slate-100 dark:hover:bg-slate-850 border border-slate-250/60 dark:border-slate-800 rounded-2xl text-xs font-bold text-slate-700 dark:text-slate-300 transition-all cursor-pointer shadow-sm"
            >
              <div className="flex items-center gap-2">
                <Share2 className="h-4 w-4 text-indigo-650 animate-pulse" />
                <span>🔌 CONFIGURAR CONEXIÓN DE WHATSAPP CONTRAOFERTAS (QR)</span>
              </div>
              <span className="text-[10px] bg-slate-200 dark:bg-slate-800 text-slate-500 px-3 py-1 rounded-full uppercase tracking-wider font-extrabold">
                {showContraConnection ? 'Ocultar QR' : 'Mostrar Panel QR'}
              </span>
            </button>
            
            {showContraConnection && (
              <div className="animate-in slide-in-from-top-4 fade-in duration-250 mt-4 bg-white dark:bg-[#111827] p-8 rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-md flex flex-col gap-6 w-full">
                <div>
                  <h3 className="text-xl font-black text-slate-900 dark:text-slate-100 tracking-tight flex items-center gap-2">
                    <Share2 className="h-5 w-5 text-indigo-600" />
                    Conexión de WhatsApp Contraofertas (Instancia: contraofertas-dreamteam)
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                    Escanea el código QR para conectar el canal oficial de envío de contraofertas del bot de WhatsApp.
                  </p>
                </div>

                <div className="border border-slate-150 dark:border-slate-850 rounded-2xl p-6 bg-slate-50 dark:bg-slate-900/50 flex flex-col items-center justify-center text-center gap-4">
                  {wspConnectionStateContra === 'loading' && (
                    <div className="flex flex-col items-center gap-2 py-4">
                      <span className="animate-spin h-8 w-8 border-4 border-indigo-600 border-t-transparent rounded-full" />
                      <span className="text-xs font-bold text-slate-500 dark:text-slate-400">Verificando conexión...</span>
                    </div>
                  )}

                  {wspConnectionStateContra === 'open' && (
                    <div className="flex flex-col items-center gap-3 py-2">
                      <div className="h-14 w-14 rounded-full bg-emerald-100 dark:bg-emerald-950/30 flex items-center justify-center text-emerald-600 dark:text-emerald-400 text-2xl font-bold">
                        ✓
                      </div>
                      <div>
                        <span className="text-xs bg-emerald-100 dark:bg-emerald-950/20 border border-emerald-250/20 px-3 py-1 rounded-full font-black text-emerald-700 dark:text-emerald-400 uppercase tracking-wider">
                          WhatsApp Conectado
                        </span>
                        <p className="text-[11px] text-slate-400 dark:text-slate-500 mt-2 font-medium">La sesión está activa en la Evolution API. Listo para enviar contraofertas.</p>
                      </div>
                      <div className="flex flex-wrap gap-3 mt-2">
                        <button 
                          onClick={handleDisconnectWSPContra}
                          className="text-xs font-bold px-4 py-2 border border-red-200 dark:border-red-900 hover:border-red-300 dark:hover:bg-red-950/20 hover:bg-red-50 text-red-650 rounded-xl cursor-pointer"
                        >
                          Desconectar Sesión
                        </button>
                        <button 
                          onClick={handleResetWSPContra}
                          className="text-xs font-bold px-4 py-2 border border-amber-300 dark:border-amber-800 hover:border-amber-400 dark:hover:bg-amber-950/20 hover:bg-amber-50 text-amber-650 dark:text-amber-400 rounded-xl cursor-pointer flex items-center gap-1.5"
                          title="Fuerza un reinicio y recreación de la instancia en Render si se encuentra colgada"
                        >
                          <RefreshCw className="h-3.5 w-3.5" /> Restablecer Conexión
                        </button>
                      </div>
                    </div>
                  )}

                  {wspConnectionStateContra === 'connecting' && !qrCodeBase64Contra && (
                    <div className="flex flex-col items-center gap-2 py-4">
                      <span className="animate-spin h-8 w-8 border-4 border-indigo-600 border-t-transparent rounded-full" />
                      <span className="text-xs font-bold text-slate-500 dark:text-slate-400">Iniciando instancia y pidiendo código QR...</span>
                    </div>
                  )}

                  {wspConnectionStateContra === 'close' && !qrCodeBase64Contra && (
                    <div className="flex flex-col items-center gap-3 py-4">
                      <div className="h-14 w-14 rounded-full bg-slate-200 dark:bg-slate-800 flex items-center justify-center text-slate-500 text-2xl font-bold">
                        !
                      </div>
                      <div>
                        <span className="text-xs bg-slate-100 dark:bg-slate-850 px-3 py-1 rounded-full font-black text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                          Desconectado
                        </span>
                        <p className="text-[11px] text-slate-400 dark:text-slate-500 mt-2 font-medium">No hay ninguna sesión activa para contraofertas. Solicita un nuevo código QR para conectar.</p>
                      </div>
                      <button 
                        onClick={handleConnectWSPContra}
                        className="text-xs font-black uppercase px-5 py-2.5 bg-indigo-600 hover:bg-indigo-750 text-white rounded-xl shadow-md shadow-indigo-650/15 cursor-pointer mt-2"
                      >
                        Generar Código QR
                      </button>
                    </div>
                  )}

                  {qrCodeBase64Contra && wspConnectionStateContra !== 'open' && (
                    <div className="flex flex-col items-center gap-3 py-2">
                      <div className="bg-white p-4 rounded-3xl border-4 border-indigo-600/30 shadow-inner">
                        <img 
                          src={qrCodeBase64Contra} 
                          alt="WhatsApp QR Code" 
                          className="w-64 h-64"
                          style={{ imageRendering: 'pixelated' }}
                        />
                      </div>
                      <div>
                        <span className="text-xs bg-indigo-100 dark:bg-indigo-950/20 border border-indigo-250/20 px-3 py-1 rounded-full font-black text-indigo-700 dark:text-indigo-400 uppercase tracking-wider animate-pulse">
                          Esperando Escaneo QR
                        </span>
                        <p className="text-[11px] text-slate-400 dark:text-slate-500 mt-2 font-medium">Abre WhatsApp en tu teléfono, ve a Dispositivos Vinculados y escanea el código.</p>
                      </div>
                      <div className="flex gap-3 mt-2">
                        <button 
                          onClick={handleConnectWSPContra}
                          className="text-xs font-bold px-4 py-2 border border-slate-200 dark:border-slate-850 hover:bg-slate-50 dark:hover:bg-slate-900 rounded-xl cursor-pointer flex items-center gap-1.5"
                        >
                          <RefreshCw className="h-3.5 w-3.5" /> Recargar QR
                        </button>
                        <button 
                          onClick={handleDisconnectWSPContra}
                          className="text-xs font-bold px-4 py-2 border border-red-200 dark:border-red-900 hover:bg-red-50 dark:hover:bg-red-950/20 rounded-xl cursor-pointer"
                        >
                          Cancelar
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>

          <EmbudoPanel darkMode={darkMode} operatorColor={operatorColor} />
        </div>
      )}

      {activeAdminTab === 'seguridad-ip' && (
        <div className="animate-in fade-in duration-200 flex flex-col gap-6 w-full max-w-3xl">
          <div className="flex justify-between items-center">
            <div>
              <h3 className="text-lg font-black text-slate-900 dark:text-slate-100 tracking-tight flex items-center gap-2">
                <Shield className="h-5 w-5 text-amber-500" />
                Seguridad & Control de IP Pública
              </h3>
              <p className="text-[10px] text-slate-450 dark:text-slate-500">
                Restringe el acceso al cotizador únicamente desde las direcciones IP autorizadas de la oficina.
              </p>
            </div>
          </div>

          <div className="bg-white dark:bg-slate-900 border border-slate-150 dark:border-slate-805 p-6 rounded-2xl flex flex-col gap-5 shadow-sm">
            {/* Switch Habilitar/Deshabilitar */}
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-850 pb-4">
              <div className="flex flex-col gap-0.5">
                <span className="text-xs font-black text-slate-800 dark:text-slate-200 uppercase tracking-wide">
                  Estado de Restricción
                </span>
                <span className="text-[10px] text-slate-450 dark:text-slate-500 font-semibold">
                  {localEnabled 
                    ? "✓ Restricción activa: Solo las IPs listadas abajo pueden abrir el cotizador." 
                    : "✗ Restricción inactiva: El cotizador está abierto de forma pública."}
                </span>
              </div>

              <label className="relative inline-flex items-center cursor-pointer">
                <input 
                  type="checkbox" 
                  checked={localEnabled}
                  onChange={(e) => setLocalEnabled(e.target.checked)}
                  className="sr-only peer"
                />
                <div className="w-9 h-5 bg-slate-200 peer-focus:outline-none rounded-full peer dark:bg-slate-800 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all dark:border-slate-600 peer-checked:bg-amber-500"></div>
              </label>
            </div>

            {/* Agregar Nueva IP */}
            <div className="flex flex-col gap-2">
              <label className="text-[9px] font-extrabold text-slate-450 dark:text-slate-500 block uppercase tracking-wider">
                Registrar Nueva IP Pública de la Oficina:
              </label>
              <div className="flex gap-2">
                <input 
                  type="text"
                  value={newIpInput}
                  onChange={(e) => setNewIpInput(e.target.value)}
                  placeholder="Ej: 190.235.45.12"
                  className="flex-1 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-2.5 text-xs text-slate-800 dark:text-slate-200 font-bold focus:outline-none font-mono"
                />
                <button
                  onClick={() => {
                    const cleaned = newIpInput.trim();
                    const ipRegex = /^(?:[0-9]{1,3}\.){3}[0-9]{1,3}$/;
                    if (!ipRegex.test(cleaned)) {
                      alert('Por favor ingresa una dirección IPv4 válida.');
                      return;
                    }
                    if (localIps.includes(cleaned)) {
                      alert('Esta dirección IP ya está registrada.');
                      return;
                    }
                    setLocalIps([...localIps, cleaned]);
                    setNewIpInput('');
                  }}
                  className="bg-indigo-600 hover:bg-indigo-750 text-white text-xs font-black uppercase px-5 py-2.5 rounded-xl cursor-pointer shadow-sm transition-all"
                >
                  Agregar IP
                </button>
              </div>
              <p className="text-[9px] text-slate-400 font-medium flex items-center gap-1 mt-1">
                <Info className="h-3.5 w-3.5 text-slate-400" />
                Puedes buscar tu IP pública actual escribiendo "mi ip" en Google.
              </p>
            </div>

            {/* Listado de IPs registradas */}
            <div className="flex flex-col gap-2 border-t border-slate-100 dark:border-slate-850 pt-4">
              <label className="text-[9px] font-extrabold text-slate-450 dark:text-slate-500 block uppercase tracking-wider">
                IPs Autorizadas ({localIps.length}):
              </label>

              {localIps.length === 0 ? (
                <div className="text-center py-4 border border-dashed border-slate-200 dark:border-slate-800 rounded-xl text-[10px] text-slate-400 font-bold">
                  No hay ninguna dirección IP autorizada. Registra la IP de tu oficina.
                </div>
              ) : (
                <div className="flex flex-col gap-1.5 max-h-48 overflow-y-auto">
                  {localIps.map(ip => (
                    <div 
                      key={ip}
                      className="flex justify-between items-center bg-slate-50 dark:bg-slate-950 border border-slate-100 dark:border-slate-850 px-3.5 py-2 rounded-xl"
                    >
                      <span className="text-xs font-black text-slate-800 dark:text-slate-200 font-mono">
                        {ip}
                      </span>
                      <button
                        onClick={() => {
                          if (confirm(`¿Deseas eliminar la IP ${ip} de la lista de autorizadas?`)) {
                            setLocalIps(localIps.filter(item => item !== ip));
                          }
                        }}
                        className="text-red-500 hover:text-red-700 p-1 cursor-pointer transition-all"
                        title="Eliminar IP"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Guardar cambios */}
            <div className="flex justify-end gap-3 border-t border-slate-100 dark:border-slate-850 pt-4 mt-2">
              <button
                onClick={async () => {
                  if (localEnabled && localIps.length === 0) {
                    alert('Atención: No puedes activar la restricción sin registrar al menos una IP, de lo contrario se bloqueará todo el cotizador.');
                    return;
                  }
                  if (handleSaveSecurityConfig) {
                    await handleSaveSecurityConfig(localEnabled, localIps);
                  }
                  alert('¡Configuración de seguridad guardada y sincronizada correctamente!');
                  setActiveTab('cotizador');
                }}
                className="bg-indigo-650 hover:bg-indigo-750 text-white px-6 py-2.5 rounded-xl font-bold text-xs uppercase tracking-wider transition-all cursor-pointer shadow-md flex items-center gap-1.5"
              >
                <Save className="h-4 w-4" /> Guardar Configuración de Seguridad
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
