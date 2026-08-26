'use client';

import React, { useState, useMemo, useEffect, useRef, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { 
  PLANS, ADDONS, OPERATORS, Plan, Addon, Operator, 
  getSalesArgument, SalesArgument 
} from '@/data/plans';
import { 
  Tv, Film, Wifi, Shield, DollarSign, 
  Check, Info, MessageSquare, Download, Sparkles, Moon, Sun, 
  Copy, RefreshCw, Send, Image as ImageIcon, Flame, PhoneCall,
  ChevronDown, ChevronUp, ChevronRight, Layers, FileText, CheckCircle2,
  Tag, Smartphone, ArrowRight, Share2, Globe, ShieldAlert, Award, Star, Bot, Lock, LogOut, CheckCircle, ShieldCheck
} from 'lucide-react';
import AdminConfigPanel from '@/components/AdminConfigPanel';

// Icon Map para renderizado dinámico de Addons
const ICON_MAP: Record<string, React.ElementType> = {
  Smartphone,
  Tv,
  Film,
  Wifi,
  Wrench: Wifi,
  Sparkles,
  Tablet: Smartphone,
  ShieldCheck: Shield
};

function TarifarioSmartContent() {
  const searchParams = useSearchParams();
  const [activeTab, setActiveTab] = useState<string>('vodafone');
  const [selectedPlanId, setSelectedPlanId] = useState<string>('');
  const [selectedAddonIds, setSelectedAddonIds] = useState<string[]>([]);
  const [darkMode, setDarkMode] = useState<boolean>(true);
  const [copied, setCopied] = useState<boolean>(false);
  const [copiedImage, setCopiedImage] = useState<boolean>(false);
  const [copiedPDF, setCopiedPDF] = useState<boolean>(false);
  const [isGeneratingPDF, setIsGeneratingPDF] = useState<boolean>(false);
  
  // Custom Dynamic State for Plans and Addons (Editable by Admin)
  const [plans, setPlans] = useState<Plan[]>(PLANS);
  const [addons, setAddons] = useState<Addon[]>(ADDONS);

  // Estados de Filtros Dinámicos
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedSpeed, setSelectedSpeed] = useState<string>('all');
  const [selectedLines, setSelectedLines] = useState<string>('all');
  const [searchFilter, setSearchFilter] = useState<string>('');

  // Tax and Currency Selector for Multi-Country / Multi-Tax Support
  const [taxMode, setTaxMode] = useState<'iva' | 'igic' | 'sin_iva'>('iva');

  // Customer & Advisor Info for Personalized Quotes
  const [customerName, setCustomerName] = useState<string>('');
  const [customerPhone, setCustomerPhone] = useState<string>('');
  const [advisorName, setAdvisorName] = useState<string>('');
  const [advisorRole, setAdvisorRole] = useState<string>('');

  // Evolution API Configuration State (WhatsApp Proposals)
  const [evolutionUrl, setEvolutionUrl] = useState<string>('https://evolution-api-smart.onrender.com');
  const [evolutionApiKey, setEvolutionApiKey] = useState<string>('B6D711FCDE4D4FD5936544120E713976');
  const [evolutionInstance, setEvolutionInstance] = useState<string>('tarifario_proposals');
  const [wspConnectionState, setWspConnectionState] = useState<'open' | 'close' | 'connecting' | 'loading'>('close');
  const [qrCodeBase64, setQrCodeBase64] = useState<string>('');
  const [isSendingWsp, setIsSendingWsp] = useState<boolean>(false);

  // Evolution API Contraofertas State
  const [wspConnectionStateContra, setWspConnectionStateContra] = useState<'open' | 'close' | 'connecting' | 'loading'>('close');
  const [qrCodeBase64Contra, setQrCodeBase64Contra] = useState<string>('');

  // Canvas Ref para generación de imagen / PDF
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Cargar persistencia de tarifas customizadas al inicio
  useEffect(() => {
    try {
      const savedPlans = localStorage.getItem('smart_custom_plans') || localStorage.getItem('custom_plans');
      if (savedPlans) {
        const parsed = JSON.parse(savedPlans);
        if (Array.isArray(parsed) && parsed.length > 0) {
          setPlans(parsed);
        }
      }
      const savedAddons = localStorage.getItem('smart_custom_addons') || localStorage.getItem('custom_addons');
      if (savedAddons) {
        const parsedAdd = JSON.parse(savedAddons);
        if (Array.isArray(parsedAdd) && parsedAdd.length > 0) {
          setAddons(parsedAdd);
        }
      }
      const savedAdvisor = localStorage.getItem('smart_advisor_info');
      if (savedAdvisor) {
        const adv = JSON.parse(savedAdvisor);
        setAdvisorName(adv.name || '');
        setAdvisorRole(adv.role || '');
      }
    } catch (e) {
      console.error('Error loading persisted data:', e);
    }
  }, []);

  // Guardar asesor
  const saveAdvisorInfo = (name: string, role: string) => {
    setAdvisorName(name);
    setAdvisorRole(role);
    localStorage.setItem('smart_advisor_info', JSON.stringify({ name, role }));
  };

  // Helper para determinar la etiqueta de IVA según operador y plan
  const getTaxLabel = (opId: string, plan?: Plan): string => {
    if (opId === 'win') {
      return '(IGV Inc.)';
    }
    if (opId === 'orange') {
      if (taxMode === 'sin_iva') return '(Sin IVA)';
      if (taxMode === 'igic') return '(IGIC Inc. 7%)';
      return '(IVA Inc. 21%)';
    }
    const isEmpresa = plan && (plan.category === 'fibra_movil_empresa' || plan.tags?.includes('Empresa') || plan.tags?.includes('TV Bares') || plan.id.includes('mi-negocio') || plan.id.includes('tv-bares'));
    if (isEmpresa) {
      return '(Sin IVA)';
    }
    return '(IVA Incluido)';
  };

  // Helper para limpiar el nombre del plan para la propuesta al cliente
  const getClientFacingPlanName = (rawName: string): string => {
    return rawName
      .replace(/^Oferta Flash \d+P:\s*/i, '')
      .replace(/^Oferta Flash ESPECIAL \d+\s*OTTs:\s*/i, '')
      .replace(/^Digital Pro Total\s*-\s*/i, '')
      .replace(/^Digital Pro\s*-\s*/i, '')
      .replace(/^Mi Negocio Pro\s*(\(\d+\s*Líneas?\))?\s*-\s*/i, '')
      .replace(/^Segunda Residencia:\s*/i, '')
      .replace(/^Especial Digi:\s*/i, '')
      .replace(/^N Extra \d+\s*-\s*/i, '')
      .trim();
  };

  // Operador seleccionado actual
  const currentOperator = useMemo(() => {
    return OPERATORS.find(op => op.id === activeTab) || OPERATORS[0];
  }, [activeTab]);

  // Lista de planes filtrados para el operador actual
  const operatorPlans = useMemo(() => {
    let list = plans.filter(p => p.operatorId === activeTab);
    
    // Filtro por categoría / clasificación
    if (selectedCategory !== 'all') {
      if (selectedCategory === 'bares') {
        list = list.filter(p => p.tags?.includes('TV Bares') || p.tags?.includes('HORECA') || p.id.includes('tv-bares'));
      } else if (selectedCategory === 'empresa') {
        list = list.filter(p => p.category === 'fibra_movil_empresa' || p.tags?.includes('Empresa') || p.id.includes('mi-negocio'));
      } else if (selectedCategory === 'flash') {
        list = list.filter(p => p.category === 'flash_agosto' || p.tags?.includes('Oferta Flash'));
      } else if (selectedCategory === 'segunda_residencia') {
        list = list.filter(p => p.category === 'segunda_residencia' || p.tags?.includes('Segunda Residencia'));
      } else if (selectedCategory === 'solo_movil') {
        list = list.filter(p => p.category === 'solo_movil');
      } else if (selectedCategory === 'solo_fibra') {
        list = list.filter(p => p.category === 'solo_fibra');
      } else if (selectedCategory === 'residencial') {
        list = list.filter(p => p.category !== 'fibra_movil_empresa' && !p.tags?.includes('TV Bares') && p.category !== 'segunda_residencia');
      }
    } else {
      // Por defecto en "Todos", excluir bares para que solo se vean en su pestaña específica
      list = list.filter(p => !p.tags?.includes('TV Bares') && !p.tags?.includes('HORECA') && !p.id.includes('tv-bares'));
    }

    // Filtro por velocidad de fibra
    if (selectedSpeed !== 'all') {
      if (selectedSpeed === '600') list = list.filter(p => p.speed.includes('600') || p.fiber === '600Mb');
      else if (selectedSpeed === '1gb') list = list.filter(p => p.speed.includes('1 Gb') || p.speed.includes('1000') || p.fiber === '1Gb');
    }

    // Filtro por texto de búsqueda
    if (searchFilter.trim()) {
      const q = searchFilter.toLowerCase();
      list = list.filter(p => 
        p.name.toLowerCase().includes(q) || 
        p.speed.toLowerCase().includes(q) || 
        p.mobile.toLowerCase().includes(q) || 
        p.tags?.some(t => t.toLowerCase().includes(q))
      );
    }

    return list;
  }, [plans, activeTab, selectedCategory, selectedSpeed, searchFilter]);

  // Addons para el operador actual
  const operatorAddons = useMemo(() => {
    return addons.filter(a => !a.operatorId || a.operatorId === activeTab);
  }, [addons, activeTab]);

  // Plan actualmente seleccionado
  const selectedPlan = useMemo(() => {
    return plans.find(p => p.id === selectedPlanId) || operatorPlans[0] || plans[0];
  }, [plans, selectedPlanId, operatorPlans]);

  // Actualizar plan seleccionado al cambiar de operador si no pertenece
  useEffect(() => {
    if (operatorPlans.length > 0) {
      if (!operatorPlans.some(p => p.id === selectedPlanId)) {
        setSelectedPlanId(operatorPlans[0].id);
      }
    }
  }, [activeTab, operatorPlans, selectedPlanId]);

  // Addons seleccionados actualmente
  const activeSelectedAddons = useMemo(() => {
    return addons.filter(a => selectedAddonIds.includes(a.id));
  }, [addons, selectedAddonIds]);

  // Cálculo de Precio Total Mensual
  const totalPrice = useMemo(() => {
    if (!selectedPlan) return 0;
    const basePlanPrice = selectedPlan.price;
    const addonsTotal = activeSelectedAddons
      .filter(a => !a.isOneTime)
      .reduce((sum, a) => sum + a.price, 0);
    
    const sum = basePlanPrice + addonsTotal;
    
    // Ajuste de impuestos para Orange si aplica
    if (activeTab === 'orange') {
      if (taxMode === 'iva') return Number((sum * 1.21).toFixed(2));
      if (taxMode === 'igic') return Number((sum * 1.07).toFixed(2));
    }
    return Number(sum.toFixed(2));
  }, [selectedPlan, activeSelectedAddons, activeTab, taxMode]);

  // Cálculo de Cuota Normal / Posterior a la Promoción
  const totalRegularPrice = useMemo(() => {
    if (!selectedPlan) return 0;
    const regularBase = selectedPlan.priceAfterPromo || selectedPlan.price;
    const addonsTotal = activeSelectedAddons
      .filter(a => !a.isOneTime)
      .reduce((sum, a) => sum + (a.regularPrice || a.price), 0);
    
    const sum = regularBase + addonsTotal;
    if (activeTab === 'orange') {
      if (taxMode === 'iva') return Number((sum * 1.21).toFixed(2));
      if (taxMode === 'igic') return Number((sum * 1.07).toFixed(2));
    }
    return Number(sum.toFixed(2));
  }, [selectedPlan, activeSelectedAddons, activeTab, taxMode]);

  // Argumentos de Venta Dinámicos
  const salesArgument: SalesArgument = useMemo(() => {
    return getSalesArgument(activeTab, totalPrice, selectedAddonIds.length);
  }, [activeTab, totalPrice, selectedAddonIds.length]);

  // Toggle de selección de addon
  const toggleAddon = (addonId: string) => {
    setSelectedAddonIds(prev => 
      prev.includes(addonId) 
        ? prev.filter(id => id !== addonId)
        : [...prev, addonId]
    );
  };

  // Copiar propuesta formateada para WhatsApp
  const handleCopyWhatsApp = () => {
    if (!selectedPlan) return;
    
    const currency = activeTab === 'win' ? 'S/' : '€';
    const taxLabel = getTaxLabel(activeTab, selectedPlan);
    const cleanPlanName = getClientFacingPlanName(selectedPlan.name);

    let text = `🌟 *PROPUESTA EXCLUSIVA DE TELECOMUNICACIONES* 🌟\n\n`;
    if (customerName.trim()) {
      text += `Estimado/a *${customerName.trim()}*,\n`;
      text += `Le comparto el desglose detallado de la solución personalizada que hemos preparado para usted con *${currentOperator.name}*:\n\n`;
    } else {
      text += `Le comparto el desglose detallado de su propuesta de telecomunicaciones con *${currentOperator.name}*:\n\n`;
    }

    text += `📦 *Plan Principal:* ${cleanPlanName}\n`;
    text += `⚡ *Velocidad Fibra:* ${selectedPlan.speed}\n`;
    if (selectedPlan.mobile) text += `📱 *Línea Móvil:* ${selectedPlan.mobile}\n`;
    if (selectedPlan.tv) text += `📺 *Televisión / OTT:* ${selectedPlan.tv}\n`;

    if (activeSelectedAddons.length > 0) {
      text += `\n➕ *Servicios y Módulos Adicionales:*\n`;
      activeSelectedAddons.forEach(a => {
        text += ` • ${a.name}: ${a.price.toFixed(2)} ${currency}/mes\n`;
      });
    }

    text += `\n💰 *CUOTA MENSUAL TOTAL: ${totalPrice.toFixed(2)} ${currency}/mes ${taxLabel}*\n`;

    if (selectedPlan.isPromo && selectedPlan.priceAfterPromo) {
      text += `📌 *Condición Comercial:* Tarifa promocional los primeros ${selectedPlan.promoMonths || 3} meses. Cuota posterior regular: ${totalRegularPrice.toFixed(2)} ${currency}/mes ${taxLabel}.\n`;
    }

    text += `\n🎁 *Ventajas Incluidas:*\n`;
    selectedPlan.features.forEach(f => {
      text += ` ✔️ ${f}\n`;
    });

    if (advisorName.trim()) {
      text += `\n👨‍💼 *Asesor Especializado:* ${advisorName.trim()}${advisorRole.trim() ? ` (${advisorRole.trim()})` : ''}\n`;
    }

    text += `\n¿Desea que procedamos con la activación de esta tarifa para asegurar esta condición comercial? Quedo a su completa disposición.`;

    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 3000);
  };

  // Evolution API - Conectar WhatsApp y obtener QR
  const handleConnectWSP = async () => {
    try {
      setWspConnectionState('loading');
      const res = await fetch(`${evolutionUrl}/instance/connect/${evolutionInstance}`, {
        headers: { 'apikey': evolutionApiKey }
      });
      const data = await res.json();
      if (data.base64) {
        setQrCodeBase64(data.base64);
        setWspConnectionState('close');
      } else if (data.instance?.state === 'open' || data.state === 'open') {
        setWspConnectionState('open');
        setQrCodeBase64('');
      }
    } catch (e) {
      console.error('Error connecting WhatsApp:', e);
      setWspConnectionState('close');
    }
  };

  // Evolution API - Desconectar WhatsApp
  const handleDisconnectWSP = async () => {
    try {
      await fetch(`${evolutionUrl}/instance/logout/${evolutionInstance}`, {
        method: 'DELETE',
        headers: { 'apikey': evolutionApiKey }
      });
      setWspConnectionState('close');
      setQrCodeBase64('');
    } catch (e) {
      console.error('Error disconnecting WhatsApp:', e);
    }
  };

  // Evolution API - Resetear sesión
  const handleResetWSP = async () => {
    await handleDisconnectWSP();
    await handleConnectWSP();
  };

  return (
    <div className={`min-h-screen ${darkMode ? 'bg-[#0a0f1d] text-slate-100' : 'bg-slate-50 text-slate-900'} transition-colors duration-200`}>
      {/* Barra de Navegación Superior */}
      <header className="sticky top-0 z-40 backdrop-blur-xl bg-slate-900/80 border-b border-slate-800/80 px-4 lg:px-8 py-3.5 flex items-center justify-between shadow-lg">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-2xl bg-gradient-to-tr from-indigo-600 via-indigo-500 to-purple-500 flex items-center justify-center shadow-lg shadow-indigo-500/20">
            <Sparkles className="h-5 w-5 text-white" />
          </div>
          <div>
            <h1 className="text-base font-black tracking-tight text-white flex items-center gap-2">
              TARIFARIO SMART TELCO
              <span className="text-[10px] bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 px-2 py-0.5 rounded-full font-bold uppercase tracking-wider">
                V2.6 AGY
              </span>
            </h1>
            <p className="text-[11px] text-slate-400 font-medium">Cotizador de Telecomunicaciones Multicompañía con IA</p>
          </div>
        </div>

        <div className="flex items-center gap-2.5">
          {/* Selector de Régimen Fiscal si es Orange */}
          {activeTab === 'orange' && (
            <div className="flex items-center bg-slate-800/90 border border-slate-700 rounded-xl p-0.5 text-xs">
              <button 
                onClick={() => setTaxMode('iva')}
                className={`px-2.5 py-1 rounded-lg font-bold transition-all ${taxMode === 'iva' ? 'bg-orange-500 text-white shadow-sm' : 'text-slate-400 hover:text-white'}`}
              >
                IVA 21%
              </button>
              <button 
                onClick={() => setTaxMode('igic')}
                className={`px-2.5 py-1 rounded-lg font-bold transition-all ${taxMode === 'igic' ? 'bg-orange-500 text-white shadow-sm' : 'text-slate-400 hover:text-white'}`}
              >
                IGIC 7%
              </button>
              <button 
                onClick={() => setTaxMode('sin_iva')}
                className={`px-2.5 py-1 rounded-lg font-bold transition-all ${taxMode === 'sin_iva' ? 'bg-orange-500 text-white shadow-sm' : 'text-slate-400 hover:text-white'}`}
              >
                Sin IVA
              </button>
            </div>
          )}

          {/* Toggle de Modo Oscuro */}
          <button
            onClick={() => setDarkMode(!darkMode)}
            className="p-2 rounded-xl bg-slate-800/90 border border-slate-700 text-slate-300 hover:text-white transition-all cursor-pointer"
            title="Alternar tema"
          >
            {darkMode ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
          </button>
        </div>
      </header>

      {/* Selector de Pestañas Principales (Operadores & Panel Admin) */}
      <div className="max-w-7xl mx-auto px-4 lg:px-8 pt-6 pb-2">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-800/80 pb-4">
          <div className="flex flex-wrap gap-2">
            {OPERATORS.map(op => {
              const isActive = activeTab === op.id;
              return (
                <button
                  key={op.id}
                  onClick={() => {
                    setActiveTab(op.id);
                    setSelectedCategory('all');
                    setSelectedSpeed('all');
                  }}
                  className={`px-5 py-2.5 rounded-2xl text-xs font-black uppercase tracking-wider transition-all duration-200 flex items-center gap-2 cursor-pointer ${
                    isActive 
                      ? `${op.colorTheme.primary} text-white shadow-lg shadow-indigo-500/20 scale-[1.02]`
                      : 'bg-slate-900/60 hover:bg-slate-850 text-slate-400 hover:text-slate-200 border border-slate-800'
                  }`}
                >
                  <Globe className="h-3.5 w-3.5" />
                  {op.name}
                </button>
              );
            })}
          </div>

          <button
            onClick={() => setActiveTab('admin')}
            className={`px-5 py-2.5 rounded-2xl text-xs font-black uppercase tracking-wider transition-all duration-200 flex items-center gap-2 cursor-pointer ${
              activeTab === 'admin'
                ? 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-lg shadow-purple-500/20 scale-[1.02]'
                : 'bg-slate-900/60 hover:bg-slate-850 text-purple-400 hover:text-purple-300 border border-purple-900/40'
            }`}
          >
            <Lock className="h-3.5 w-3.5" />
            Acceso Admin
          </button>
        </div>
      </div>

      {/* Contenedor Principal de la App */}
      <main className="max-w-7xl mx-auto px-4 lg:px-8 py-6">
        {activeTab === 'admin' ? (
          <AdminConfigPanel
            darkMode={darkMode}
            operatorColor={currentOperator.colorTheme.primary}
            plans={plans}
            setPlans={setPlans}
            addons={addons}
            setAddons={setAddons}
            evolutionUrl={evolutionUrl}
            setEvolutionUrl={setEvolutionUrl}
            evolutionApiKey={evolutionApiKey}
            setEvolutionApiKey={setEvolutionApiKey}
            evolutionInstance={evolutionInstance}
            setEvolutionInstance={setEvolutionInstance}
            wspConnectionState={wspConnectionState}
            setWspConnectionState={setWspConnectionState}
            qrCodeBase64={qrCodeBase64}
            setQrCodeBase64={setQrCodeBase64}
            handleConnectWSP={handleConnectWSP}
            handleDisconnectWSP={handleDisconnectWSP}
            handleResetWSP={handleResetWSP}
            wspConnectionStateContra={wspConnectionStateContra}
            qrCodeBase64Contra={qrCodeBase64Contra}
            advisorName={advisorName}
            advisorRole={advisorRole}
            saveAdvisorInfo={saveAdvisorInfo}
            setAdvisorName={setAdvisorName}
            setAdvisorRole={setAdvisorRole}
            setActiveTab={setActiveTab}
          />
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* Columna Izquierda: Catálogo y Filtros */}
            <div className="lg:col-span-7 flex flex-col gap-6">
              {/* Barra de Filtros y Segmentación */}
              <div className="bg-slate-900/60 border border-slate-800/80 rounded-3xl p-4 flex flex-col gap-3 shadow-sm">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <span className="text-[11px] font-black text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                    <Layers className="h-3.5 w-3.5 text-indigo-400" />
                    Segmento & Categoría
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    <button
                      onClick={() => setSelectedCategory('all')}
                      className={`px-3 py-1.5 rounded-xl text-[11px] font-black uppercase transition-all cursor-pointer ${
                        selectedCategory === 'all' ? 'bg-indigo-600 text-white shadow-sm' : 'bg-slate-800/80 text-slate-400 hover:text-slate-200'
                      }`}
                    >
                      Todos
                    </button>
                    <button
                      onClick={() => setSelectedCategory('residencial')}
                      className={`px-3 py-1.5 rounded-xl text-[11px] font-black uppercase transition-all cursor-pointer ${
                        selectedCategory === 'residencial' ? 'bg-emerald-600 text-white shadow-sm' : 'bg-slate-800/80 text-slate-400 hover:text-slate-200'
                      }`}
                    >
                      🏠 Residencial
                    </button>
                    {activeTab === 'vodafone' && (
                      <button
                        onClick={() => setSelectedCategory('flash')}
                        className={`px-3 py-1.5 rounded-xl text-[11px] font-black uppercase transition-all cursor-pointer ${
                          selectedCategory === 'flash' ? 'bg-red-600 text-white shadow-sm' : 'bg-slate-800/80 text-slate-400 hover:text-slate-200'
                        }`}
                      >
                        🔥 Ofertas Flash
                      </button>
                    )}
                    <button
                      onClick={() => setSelectedCategory('empresa')}
                      className={`px-3 py-1.5 rounded-xl text-[11px] font-black uppercase transition-all cursor-pointer ${
                        selectedCategory === 'empresa' ? 'bg-blue-600 text-white shadow-sm' : 'bg-slate-800/80 text-slate-400 hover:text-slate-200'
                      }`}
                    >
                      🏢 Empresa / Pro
                    </button>
                    {activeTab === 'vodafone' && (
                      <button
                        onClick={() => setSelectedCategory('bares')}
                        className={`px-3 py-1.5 rounded-xl text-[11px] font-black uppercase transition-all cursor-pointer ${
                          selectedCategory === 'bares' ? 'bg-amber-600 text-white shadow-sm' : 'bg-slate-800/80 text-slate-400 hover:text-slate-200'
                        }`}
                      >
                        🍻 Bares (HORECA)
                      </button>
                    )}
                    {activeTab === 'vodafone' && (
                      <button
                        onClick={() => setSelectedCategory('segunda_residencia')}
                        className={`px-3 py-1.5 rounded-xl text-[11px] font-black uppercase transition-all cursor-pointer ${
                          selectedCategory === 'segunda_residencia' ? 'bg-purple-600 text-white shadow-sm' : 'bg-slate-800/80 text-slate-400 hover:text-slate-200'
                        }`}
                      >
                        🏖️ 2ª Residencia
                      </button>
                    )}
                  </div>
                </div>

                {/* Filtro secundario: Velocidad de Fibra */}
                <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-slate-800/60">
                  <span className="text-[11px] font-bold text-slate-400">Velocidad de Fibra:</span>
                  <div className="flex gap-2">
                    <button
                      onClick={() => setSelectedSpeed('all')}
                      className={`px-2.5 py-1 rounded-lg text-[10.5px] font-bold transition-all ${
                        selectedSpeed === 'all' ? 'bg-slate-700 text-white' : 'text-slate-400 hover:text-slate-200'
                      }`}
                    >
                      Cualquiera
                    </button>
                    <button
                      onClick={() => setSelectedSpeed('600')}
                      className={`px-2.5 py-1 rounded-lg text-[10.5px] font-bold transition-all ${
                        selectedSpeed === '600' ? 'bg-slate-700 text-white' : 'text-slate-400 hover:text-slate-200'
                      }`}
                    >
                      Fibra 600Mb
                    </button>
                    <button
                      onClick={() => setSelectedSpeed('1gb')}
                      className={`px-2.5 py-1 rounded-lg text-[10.5px] font-bold transition-all ${
                        selectedSpeed === '1gb' ? 'bg-slate-700 text-white' : 'text-slate-400 hover:text-slate-200'
                      }`}
                    >
                      Fibra 1 Gbps
                    </button>
                  </div>
                </div>
              </div>

              {/* Grid de Planes Disponibles */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {operatorPlans.map(plan => {
                  const isSelected = selectedPlanId === plan.id;
                  const isCompany = plan.category === 'fibra_movil_empresa' || plan.tags?.includes('Empresa') || plan.tags?.includes('TV Bares') || plan.id.includes('mi-negocio') || plan.id.includes('tv-bares');
                  const isSecond = plan.category === 'segunda_residencia' || plan.tags?.includes('Segunda Residencia');
                  const isSoloM = plan.category === 'solo_movil';
                  const currency = activeTab === 'win' ? 'S/' : '€';

                  return (
                    <div
                      key={plan.id}
                      onClick={() => setSelectedPlanId(plan.id)}
                      className={`p-5 rounded-3xl border-2 transition-all duration-200 cursor-pointer relative flex flex-col justify-between ${
                        isSelected
                          ? `bg-slate-900 border-indigo-500 shadow-xl shadow-indigo-500/10 scale-[1.01]`
                          : `bg-slate-900/40 border-slate-800/80 hover:border-slate-700 hover:bg-slate-900/80`
                      }`}
                    >
                      <div>
                        {/* Header Tarjeta: Badges de Clasificación */}
                        <div className="flex flex-wrap items-center gap-1.5 mb-2.5">
                          {isCompany && <span className="text-[8px] bg-blue-600 text-white font-black px-2 py-0.5 rounded-md uppercase">EMPRESA / PRO</span>}
                          {isSecond && <span className="text-[8px] bg-indigo-600 text-white font-black px-2 py-0.5 rounded-md uppercase">2ª RESIDENCIA</span>}
                          {isSoloM && <span className="text-[8px] bg-amber-600 text-white font-black px-2 py-0.5 rounded-md uppercase">SOLO MÓVIL</span>}
                          {!isCompany && !isSecond && !isSoloM && <span className="text-[8px] bg-emerald-600 text-white font-black px-2 py-0.5 rounded-md uppercase">RESIDENCIAL</span>}

                          {plan.isNewCampaign && (
                            <span className="text-[8px] bg-amber-400 text-slate-900 font-black px-2 py-0.5 rounded-md uppercase flex items-center gap-1">
                              🏷️ Nueva Tarifa
                            </span>
                          )}

                          {plan.isPromo && (
                            <span className="text-[8px] bg-red-600 text-white font-black px-2 py-0.5 rounded-md uppercase">
                              Promo {plan.promoMonths || 3}M
                            </span>
                          )}
                        </div>

                        <h3 className="text-sm font-black text-white leading-snug mb-1">
                          {plan.name}
                        </h3>

                        <div className="flex items-baseline gap-1.5 my-2">
                          <span className="text-2xl font-black text-white">
                            {plan.price} {currency}
                          </span>
                          <span className="text-xs text-slate-400 font-bold">
                            /mes {getTaxLabel(activeTab, plan)}
                          </span>
                        </div>

                        {plan.isPromo && plan.priceAfterPromo && (
                          <p className="text-[11px] text-slate-400 font-medium mb-3">
                            Luego de promo: <strong className="text-slate-300 font-bold">{plan.priceAfterPromo} {currency}/mes</strong>
                          </p>
                        )}

                        {/* Puntos destacados del plan */}
                        <div className="space-y-1 mt-3 pt-3 border-t border-slate-800/80 text-xs text-slate-300">
                          <div className="flex items-center gap-2">
                            <Wifi className="h-3.5 w-3.5 text-indigo-400 shrink-0" />
                            <span className="font-semibold">{plan.speed}</span>
                          </div>
                          {plan.mobile && (
                            <div className="flex items-center gap-2">
                              <Smartphone className="h-3.5 w-3.5 text-emerald-400 shrink-0" />
                              <span className="font-semibold">{plan.mobile}</span>
                            </div>
                          )}
                          {plan.tv && (
                            <div className="flex items-center gap-2">
                              <Tv className="h-3.5 w-3.5 text-purple-400 shrink-0" />
                              <span className="font-semibold">{plan.tv}</span>
                            </div>
                          )}
                        </div>
                      </div>

                      <div className="mt-4 pt-3 flex justify-between items-center border-t border-slate-800/40">
                        <span className="text-[10px] text-slate-500 font-bold">
                          {isSelected ? '✓ Seleccionado' : 'Click para seleccionar'}
                        </span>
                        <div className={`h-6 w-6 rounded-full flex items-center justify-center ${isSelected ? 'bg-indigo-600 text-white' : 'bg-slate-800 text-slate-500'}`}>
                          <Check className="h-3.5 w-3.5 stroke-[3px]" />
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Módulos y Servicios Adicionales */}
              <div className="bg-slate-900/60 border border-slate-800/80 rounded-3xl p-6 shadow-sm">
                <h3 className="text-sm font-black text-white uppercase tracking-wider mb-4 flex items-center gap-2">
                  <Sparkles className="h-4 w-4 text-indigo-400" />
                  Módulos y Adicionales Disponibles ({operatorAddons.length})
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {operatorAddons.map(addon => {
                    const isChecked = selectedAddonIds.includes(addon.id);
                    const IconComp = ICON_MAP[addon.iconName] || Sparkles;
                    const currency = activeTab === 'win' ? 'S/' : '€';

                    return (
                      <div
                        key={addon.id}
                        onClick={() => toggleAddon(addon.id)}
                        className={`p-3.5 rounded-2xl border transition-all cursor-pointer flex items-center justify-between gap-3 ${
                          isChecked
                            ? 'bg-indigo-950/30 border-indigo-500/80 text-white'
                            : 'bg-slate-900/40 border-slate-800/80 hover:border-slate-700 text-slate-300'
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <div className={`h-8 w-8 rounded-xl flex items-center justify-center shrink-0 ${isChecked ? 'bg-indigo-600 text-white' : 'bg-slate-800 text-slate-400'}`}>
                            <IconComp className="h-4 w-4" />
                          </div>
                          <div>
                            <span className="text-xs font-black block">{addon.name}</span>
                            <span className="text-[10px] text-slate-400 font-medium leading-tight block line-clamp-1">
                              {addon.description}
                            </span>
                          </div>
                        </div>

                        <div className="text-right shrink-0">
                          <span className="text-xs font-black text-indigo-400 block">
                            +{addon.price.toFixed(2)} {currency}
                          </span>
                          <span className="text-[9px] text-slate-500">/mes</span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Columna Derecha: Propuesta Dinámica, Argumentario y Envíos */}
            <div className="lg:col-span-5 flex flex-col gap-6 sticky top-20">
              {/* Tarjeta Resumen de la Propuesta */}
              <div className="bg-slate-900 border-2 border-indigo-500/60 rounded-3xl p-6 shadow-2xl relative overflow-hidden">
                <div className="absolute top-0 right-0 h-32 w-32 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />

                <div className="flex justify-between items-start mb-4">
                  <div>
                    <span className="text-[10px] bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 px-2.5 py-1 rounded-full font-black uppercase tracking-wider">
                      PROPUESTA COMERCIAL
                    </span>
                    <h2 className="text-xl font-black text-white mt-2">
                      {selectedPlan?.name}
                    </h2>
                  </div>

                  <div className="text-right">
                    <span className="text-3xl font-black text-white">
                      {totalPrice.toFixed(2)} {activeTab === 'win' ? 'S/' : '€'}
                    </span>
                    <span className="text-xs text-slate-400 font-bold block">
                      /mes {getTaxLabel(activeTab, selectedPlan)}
                    </span>
                  </div>
                </div>

                {/* Campos de Personalización para Cliente y Asesor */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 my-4 p-4 bg-slate-950/60 rounded-2xl border border-slate-800">
                  <div>
                    <label className="text-[9px] font-black text-slate-400 uppercase block mb-1">Nombre del Cliente</label>
                    <input 
                      type="text" 
                      value={customerName}
                      onChange={(e) => setCustomerName(e.target.value)}
                      placeholder="Ej: Juan Pérez"
                      className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-1.5 text-xs text-white outline-none focus:border-indigo-500"
                    />
                  </div>
                  <div>
                    <label className="text-[9px] font-black text-slate-400 uppercase block mb-1">Teléfono WhatsApp</label>
                    <input 
                      type="text" 
                      value={customerPhone}
                      onChange={(e) => setCustomerPhone(e.target.value)}
                      placeholder="Ej: 34600000000"
                      className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-1.5 text-xs text-white outline-none focus:border-indigo-500"
                    />
                  </div>
                </div>

                {/* Desglose de Servicios */}
                <div className="space-y-2 text-xs text-slate-300 my-4 border-y border-slate-800 py-3">
                  <div className="flex justify-between">
                    <span className="text-slate-400">Fibra Óptica:</span>
                    <span className="font-bold text-white">{selectedPlan?.speed}</span>
                  </div>
                  {selectedPlan?.mobile && (
                    <div className="flex justify-between">
                      <span className="text-slate-400">Móvil Principal:</span>
                      <span className="font-bold text-white">{selectedPlan?.mobile}</span>
                    </div>
                  )}
                  {selectedPlan?.tv && (
                    <div className="flex justify-between">
                      <span className="text-slate-400">Televisión:</span>
                      <span className="font-bold text-white">{selectedPlan?.tv}</span>
                    </div>
                  )}
                  {activeSelectedAddons.map(a => (
                    <div key={a.id} className="flex justify-between text-indigo-300">
                      <span>+ {a.name}:</span>
                      <span className="font-bold">{a.price.toFixed(2)} {activeTab === 'win' ? 'S/' : '€'}/mes</span>
                    </div>
                  ))}
                </div>

                {/* Botones de Acción: Copiar y Enviar */}
                <div className="flex flex-col gap-2.5 mt-4">
                  <button
                    onClick={handleCopyWhatsApp}
                    className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-black uppercase text-xs py-3 rounded-2xl transition-all shadow-lg shadow-emerald-600/20 flex items-center justify-center gap-2 cursor-pointer"
                  >
                    {copied ? <Check className="h-4 w-4 stroke-[3px]" /> : <Copy className="h-4 w-4" />}
                    {copied ? '¡Texto Copiado para WhatsApp!' : 'Copiar Propuesta para WhatsApp'}
                  </button>
                </div>
              </div>

              {/* Argumentario de Ventas y Rebatimiento de Objeciones */}
              <div className="bg-slate-900/60 border border-slate-800/80 rounded-3xl p-6 shadow-sm space-y-4">
                <div className="flex items-center gap-2 border-b border-slate-800 pb-3">
                  <Bot className="h-5 w-5 text-indigo-400" />
                  <h3 className="text-xs font-black text-white uppercase tracking-wider">
                    Argumentario de Cierre & Rebatimientos
                  </h3>
                </div>

                <div>
                  <span className="text-[10px] font-bold text-indigo-400 uppercase block mb-1">Frase Gancho para el Asesor:</span>
                  <p className="text-xs text-slate-300 bg-slate-950/40 p-3 rounded-2xl border border-slate-800/80 italic">
                    {salesArgument.fraseCliente}
                  </p>
                </div>

                <div className="space-y-2">
                  <span className="text-[10px] font-bold text-slate-400 uppercase block">Rebatimiento de Objeciones Frecuentes:</span>
                  {salesArgument.rebuttalOptions.map((reb, idx) => (
                    <div key={idx} className="bg-slate-950/60 p-3 rounded-2xl border border-slate-800 text-xs">
                      <span className="font-bold text-red-400 block mb-1">Objeción: "{reb.objection}"</span>
                      <p className="text-slate-300">{reb.counter}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

export default function TarifarioSmartPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-[#0a0f1d] flex items-center justify-center text-white font-bold text-sm">
        Cargando Tarifario Smart Telco...
      </div>
    }>
      <TarifarioSmartContent />
    </Suspense>
  );
}
