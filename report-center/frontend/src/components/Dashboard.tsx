import React, { useEffect, useState } from 'react';
import { 
  Zap, CheckCircle2, ShieldAlert, Clock, TrendingUp, Loader2, RefreshCw
} from 'lucide-react';

interface SystemStatus {
  scheduler: 'running' | 'stopped';
  evolutionApi: 'connected' | 'disconnected';
  crmApi: 'connected' | 'disconnected';
  averageExecutionTimeMs: number;
  sentToday: number;
  failedToday: number;
  lastSendSuccessAt?: string;
  lastSendErrorAt?: string;
  lastSendErrorMsg?: string;
}

interface Log {
  id: string;
  timestamp: string;
  level: 'info' | 'warning' | 'error' | 'success';
  source: 'Scheduler' | 'CRM' | 'Renderer' | 'Sender' | 'System';
  message: string;
  reportId?: string;
}

interface ChartData {
  name: string;
  value: number;
}

interface DashboardData {
  status: SystemStatus;
  reportsCount: number;
  activeReportsCount: number;
  recipientsCount: number;
  activeRecipientsCount: number;
  charts: {
    byDay: ChartData[];
    byChannel: ChartData[];
    successCount: number;
    failedCount: number;
  };
}

interface DashboardProps {
  addToast: (message: string, type?: 'success' | 'error' | 'info' | 'warning') => void;
}

export const Dashboard: React.FC<DashboardProps> = ({ addToast }) => {
  const [data, setData] = useState<DashboardData | null>(null);
  const [logs, setLogs] = useState<Log[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchDashboardData = async () => {
    try {
      const statusRes = await fetch('/api/status');
      if (statusRes.ok) {
        const dashboardData = await statusRes.json();
        setData(dashboardData);
      }

      const logsRes = await fetch('/api/status/logs');
      if (logsRes.ok) {
        const logsData = await logsRes.json();
        setLogs(logsData);
      }
    } catch (error) {
      console.error('Error fetching dashboard status:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
    const interval = setInterval(fetchDashboardData, 3000); // refresh every 3s
    return () => clearInterval(interval);
  }, []);

  const toggleScheduler = async () => {
    try {
      const res = await fetch('/api/status/scheduler/toggle', { method: 'POST' });
      const toggleData = await res.json();
      if (data) {
        setData({
          ...data,
          status: { ...data.status, scheduler: toggleData.status.scheduler }
        });
      }
      addToast(
        toggleData.status.scheduler === 'running' 
          ? 'Scheduler iniciado correctamente.' 
          : 'Scheduler detenido.',
        toggleData.status.scheduler === 'running' ? 'success' : 'warning'
      );
      fetchDashboardData();
    } catch (e) {
      addToast('Error al alternar estado del Scheduler', 'error');
    }
  };

  const toggleApi = async (target: 'crm' | 'evolution') => {
    try {
      const res = await fetch('/api/status/api/toggle', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ target })
      });
      const toggleData = await res.json();
      if (data) {
        setData({
          ...data,
          status: toggleData.status
        });
      }
      
      const apiName = target === 'crm' ? 'CRM' : 'Evolution';
      const isConnected = target === 'crm' 
        ? toggleData.status.crmApi === 'connected' 
        : toggleData.status.evolutionApi === 'connected';
      
      addToast(
        `Estado de ${apiName} cambiado a: ${isConnected ? 'Conectado' : 'Desconectado'}`,
        isConnected ? 'success' : 'warning'
      );
      
      fetchDashboardData();
    } catch (e) {
      addToast('Error al cambiar el estado del API', 'error');
    }
  };

  if (loading && !data) {
    return (
      <div className="flex items-center justify-center h-[70vh]">
        <Loader2 className="w-8 h-8 text-brand-red animate-spin" />
      </div>
    );
  }

  const status = data?.status;
  const executedToday = (status?.sentToday || 0) + (status?.failedToday || 0);

  // Parse GitHub-Actions style flowchart step from logs
  const getWorkflowSteps = () => {
    const defaultSteps = [
      { id: 'start', label: 'Scheduler Iniciado', status: 'pending', description: 'Gatillo automático o manual detectado' },
      { id: 'crm', label: 'Consultando CRM', status: 'pending', description: 'Extrayendo leads y estados de venta' },
      { id: 'html', label: 'Generando HTML', status: 'pending', description: 'Procesando tablas y formateando layout' },
      { id: 'render', label: 'Renderizando Imagen', status: 'pending', description: 'Conversión a PNG vía Playwright' },
      { id: 'send', label: 'Enviando por WhatsApp', status: 'pending', description: 'Despacho multicanal por Evolution API' },
      { id: 'done', label: 'Finalizado', status: 'pending', description: 'Historial registrado y métricas guardadas' }
    ];

    if (logs.length === 0) return defaultSteps;

    // Find the logs of the most recent report execution
    const recentReportLog = logs.find(l => l.reportId);
    if (!recentReportLog) return defaultSteps;
    
    const activeReportId = recentReportLog.reportId;
    const allReportLogs = logs.filter(l => l.reportId === activeReportId);
    const startIdx = allReportLogs.findIndex(l => l.message.toLowerCase().includes('iniciando ejecución'));
    
    const reportLogs = startIdx !== -1
      ? allReportLogs.slice(0, startIdx + 1).reverse()
      : allReportLogs.reverse();

    let currentStepIndex = -1;
    let hasFailed = false;
    let failMessage = '';

    reportLogs.forEach(log => {
      const msg = log.message.toLowerCase();
      if (msg.includes('iniciando ejecución')) {
        currentStepIndex = 0;
      } else if (msg.includes('consultando y procesando')) {
        currentStepIndex = 1;
      } else if (msg.includes('generando reporte en formato html')) {
        currentStepIndex = 2;
      } else if (msg.includes('convirtiendo html a imagen')) {
        currentStepIndex = 3;
      } else if (msg.includes('despachando a') || msg.includes('enviando imagen')) {
        currentStepIndex = 4;
      } else if (msg.includes('finalizado') || msg.includes('enviado con éxito')) {
        currentStepIndex = 5;
      }

      if (log.level === 'error' || msg.includes('error') || msg.includes('❌') || msg.includes('fallo')) {
        hasFailed = true;
        failMessage = log.message;
      }
    });

    return defaultSteps.map((step, idx) => {
      let stepStatus = 'pending';
      let desc = step.description;

      if (idx < currentStepIndex) {
        stepStatus = 'success';
      } else if (idx === currentStepIndex) {
        if (hasFailed) {
          stepStatus = 'failed';
          desc = failMessage;
        } else {
          stepStatus = currentStepIndex === 5 ? 'success' : 'running';
        }
      } else if (hasFailed && idx > currentStepIndex) {
        stepStatus = 'cancelled';
      }

      return {
        ...step,
        status: stepStatus,
        description: desc
      };
    });
  };

  const workflowSteps = getWorkflowSteps();

  // SVG Area sparkline calculations for "Reportes por día"
  const points = data?.charts?.byDay || [];
  const maxVal = Math.max(...points.map(p => p.value), 4);
  const chartHeight = 100;
  const chartWidth = 500;
  
  const svgPath = points.map((p, i) => {
    const x = (i / (points.length - 1)) * chartWidth;
    const y = chartHeight - (p.value / maxVal) * (chartHeight - 15);
    return `${i === 0 ? 'M' : 'L'} ${x} ${y}`;
  }).join(' ');

  const svgArea = points.length > 0 ? `${svgPath} L ${chartWidth} ${chartHeight} L 0 ${chartHeight} Z` : '';

  // Channel distribution ratios
  const channels = data?.charts?.byChannel || [];
  const totalChannels = channels.reduce((acc, c) => acc + c.value, 0) || 1;

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      {/* Premium Header */}
      <div className="flex justify-between items-center border-b border-dark-border/40 pb-5">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-dark-text">Panel General</h2>
          <p className="text-sm text-dark-muted">Métricas de rendimiento en tiempo real y flujo de distribución.</p>
        </div>
        <div className="flex items-center gap-3 bg-zinc-900 border border-dark-border px-3.5 py-1.5 rounded-full shadow-inner">
          <span className="text-[10px] text-dark-muted uppercase font-bold tracking-wider">
            Scheduler Status
          </span>
          <button 
            onClick={toggleScheduler}
            className="flex items-center gap-1.5"
          >
            <span className={`h-2.5 w-2.5 rounded-full ${status?.scheduler === 'running' ? 'bg-emerald-500 animate-pulse' : 'bg-brand-red'}`}></span>
            <span className="text-xs font-semibold text-dark-text uppercase">
              {status?.scheduler === 'running' ? 'Corriendo' : 'Detenido'}
            </span>
          </button>
        </div>
      </div>

      {/* Sleek KPI Cards Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-5">
        <div className="bg-dark-card border border-dark-border/60 rounded-xl p-5 hover:border-zinc-700/60 transition duration-200">
          <div className="text-xs font-bold text-dark-muted uppercase tracking-wider">Ejecutados Hoy</div>
          <div className="mt-2.5 flex items-baseline justify-between">
            <span className="text-3xl font-extrabold text-dark-text tracking-tight font-mono">{executedToday}</span>
            <span className="text-[10px] text-zinc-500 font-semibold font-mono">Últimas 24h</span>
          </div>
        </div>

        <div className="bg-dark-card border border-dark-border/60 rounded-xl p-5 hover:border-zinc-700/60 transition duration-200">
          <div className="text-xs font-bold text-dark-muted uppercase tracking-wider">Enviados (Éxito)</div>
          <div className="mt-2.5 flex items-baseline justify-between">
            <span className="text-3xl font-extrabold text-emerald-400 tracking-tight font-mono">{status?.sentToday || 0}</span>
            <span className="text-[10px] text-emerald-500 bg-emerald-500/5 px-2 py-0.5 rounded-full border border-emerald-500/10 font-bold">
              {executedToday > 0 ? Math.round(((status?.sentToday || 0) / executedToday) * 100) : 100}%
            </span>
          </div>
        </div>

        <div className="bg-dark-card border border-dark-border/60 rounded-xl p-5 hover:border-zinc-700/60 transition duration-200">
          <div className="text-xs font-bold text-dark-muted uppercase tracking-wider">Fallidos / Errores</div>
          <div className="mt-2.5 flex items-baseline justify-between">
            <span className="text-3xl font-extrabold text-brand-red tracking-tight font-mono">{status?.failedToday || 0}</span>
            {status?.failedToday && status.failedToday > 0 ? (
              <span className="text-[10px] text-brand-red bg-brand-red/5 px-2 py-0.5 rounded-full border border-brand-red/10 font-bold">
                ¡Revisar!
              </span>
            ) : (
              <span className="text-[10px] text-zinc-500 font-semibold font-mono">Limpio</span>
            )}
          </div>
        </div>

        <div className="bg-dark-card border border-dark-border/60 rounded-xl p-5 hover:border-zinc-700/60 transition duration-200">
          <div className="text-xs font-bold text-dark-muted uppercase tracking-wider">Latencia Promedio</div>
          <div className="mt-2.5 flex items-baseline justify-between">
            <span className="text-3xl font-extrabold text-dark-text tracking-tight font-mono">
              {status?.averageExecutionTimeMs ? `${(status.averageExecutionTimeMs / 1000).toFixed(2)}s` : '0.00s'}
            </span>
            <span className="text-[10px] text-zinc-500 font-semibold font-mono">Playwright</span>
          </div>
        </div>

        <div className="bg-dark-card border border-dark-border/60 rounded-xl p-5 hover:border-zinc-700/60 transition duration-200 sm:col-span-2 lg:col-span-1">
          <div className="text-xs font-bold text-dark-muted uppercase tracking-wider">Destinatarios Activos</div>
          <div className="mt-2.5 flex items-baseline justify-between">
            <span className="text-3xl font-extrabold text-indigo-400 tracking-tight font-mono">{data?.activeRecipientsCount || 0}</span>
            <span className="text-[10px] text-zinc-500 font-semibold">Total: {data?.recipientsCount || 0}</span>
          </div>
        </div>
      </div>

      {/* Main Flow and Executive Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Workflow Timeline (GitHub Actions Flow) */}
        <div className="bg-dark-card border border-dark-border rounded-xl p-6 lg:col-span-2 space-y-6 flex flex-col justify-between">
          <div>
            <div className="flex justify-between items-center mb-6">
              <div>
                <h3 className="text-sm font-bold uppercase tracking-wider text-dark-muted">Flujo de Ejecución en Tiempo Real</h3>
                <p className="text-[11px] text-dark-muted mt-0.5">Monitoreo paso a paso del último reporte gatillado.</p>
              </div>
              <span className="text-[10px] text-emerald-400 bg-emerald-500/5 border border-emerald-500/10 px-2 py-0.5 rounded font-mono flex items-center gap-1">
                <Clock className="w-3 h-3" />
                Live Tracker
              </span>
            </div>

            <div className="relative border-l border-zinc-800 pl-8 space-y-7 ml-4 py-2">
              {workflowSteps.map((step) => {
                let dotStyle = 'bg-zinc-900 border-zinc-800 text-zinc-600';
                let labelStyle = 'text-zinc-500';
                let Icon = Clock;

                if (step.status === 'success') {
                  dotStyle = 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400';
                  labelStyle = 'text-dark-text font-semibold';
                  Icon = CheckCircle2;
                } else if (step.status === 'running') {
                  dotStyle = 'bg-indigo-500/10 border-indigo-500/30 text-indigo-400 animate-pulse';
                  labelStyle = 'text-indigo-400 font-bold';
                  Icon = RefreshCw;
                } else if (step.status === 'failed') {
                  dotStyle = 'bg-brand-red/10 border-brand-red/30 text-brand-red animate-bounce';
                  labelStyle = 'text-brand-red font-bold';
                  Icon = ShieldAlert;
                }

                return (
                  <div key={step.id} className="relative group transition-all duration-300">
                    {/* Node Circle */}
                    <div className={`absolute -left-[45px] top-0.5 w-8 h-8 rounded-full border flex items-center justify-center text-xs transition duration-200 ${dotStyle}`}>
                      <Icon className={`w-4 h-4 ${step.status === 'running' ? 'animate-spin' : ''}`} />
                    </div>
                    <div>
                      <div className={`text-sm ${labelStyle}`}>{step.label}</div>
                      <p className="text-xs text-dark-muted mt-0.5 leading-relaxed group-hover:text-dark-muted/80 transition">
                        {step.description}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="border-t border-dark-border/40 pt-4 text-xs text-dark-muted flex justify-between items-center bg-dark-bg/20 px-3 py-2 rounded-lg">
            <span>Siguiente chequeo programado:</span>
            <span className="font-mono text-dark-text font-bold">Cada 1 min</span>
          </div>
        </div>

        {/* Right Executive Real Charts Widget */}
        <div className="space-y-6">
          {/* Chart 1: SVG sparkline "Reportes enviados por día" */}
          <div className="bg-dark-card border border-dark-border rounded-xl p-5 space-y-4">
            <div className="flex justify-between items-center">
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-dark-muted">Reportes por Día</h4>
                <p className="text-[10px] text-dark-muted mt-0.5">Historial acumulado de los últimos 7 días.</p>
              </div>
              <TrendingUp className="w-4 h-4 text-emerald-400" />
            </div>

            {points.length === 0 ? (
              <div className="h-28 flex items-center justify-center text-xs text-dark-muted italic">
                Sin datos suficientes en el historial
              </div>
            ) : (
              <div className="space-y-3">
                <div className="relative h-28 bg-dark-bg/40 border border-dark-border/30 rounded-lg overflow-hidden p-1">
                  <svg viewBox={`0 0 ${chartWidth} ${chartHeight}`} className="w-full h-full overflow-visible">
                    {/* Fill Area */}
                    <path d={svgArea} fill="rgba(239, 68, 68, 0.05)" />
                    {/* Outline Path */}
                    <path d={svgPath} fill="none" stroke="rgba(239, 68, 68, 0.7)" strokeWidth="3" strokeLinecap="round" />
                    {/* Dots on points */}
                    {points.map((p, i) => {
                      const x = (i / (points.length - 1)) * chartWidth;
                      const y = chartHeight - (p.value / maxVal) * (chartHeight - 15);
                      return (
                        <circle 
                          key={i} 
                          cx={x} 
                          cy={y} 
                          r="5" 
                          fill="#18181b" 
                          stroke="rgba(239, 68, 68, 0.9)" 
                          strokeWidth="2" 
                        />
                      );
                    })}
                  </svg>
                </div>
                {/* X Axis Labels */}
                <div className="flex justify-between text-[9px] text-zinc-500 font-mono px-1">
                  {points.map((p, i) => (
                    <span key={i}>{p.name}</span>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Chart 2: Channel distribution progress bars */}
          <div className="bg-dark-card border border-dark-border rounded-xl p-5 space-y-4">
            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-dark-muted">Distribución de Canales</h4>
              <p className="text-[10px] text-dark-muted mt-0.5">Canales configurados en destinatarios activos.</p>
            </div>

            <div className="space-y-3">
              {channels.map((chan) => {
                const percentage = Math.round((chan.value / totalChannels) * 100);
                const labelMap: Record<string, string> = {
                  whatsapp: '📱 WhatsApp Directo',
                  whatsapp_group: '👥 Grupo de WhatsApp',
                  email: '📧 Email'
                };
                return (
                  <div key={chan.name} className="space-y-1">
                    <div className="flex justify-between text-xs text-dark-text">
                      <span className="font-medium">{labelMap[chan.name] || chan.name}</span>
                      <span className="font-mono text-dark-muted">{chan.value} ({percentage}%)</span>
                    </div>
                    <div className="w-full bg-zinc-800 h-2 rounded-full overflow-hidden">
                      <div 
                        className={`h-full rounded-full transition-all duration-500 ${
                          chan.name === 'whatsapp' ? 'bg-emerald-500' : chan.name === 'whatsapp_group' ? 'bg-indigo-500' : 'bg-sky-500'
                        }`} 
                        style={{ width: `${percentage}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* API Fail simulator card */}
          <div className="bg-dark-card border border-dark-border rounded-xl p-5 space-y-4">
            <div className="flex items-center gap-2">
              <Zap className="w-4.5 h-4.5 text-brand-red animate-pulse" />
              <h4 className="text-xs font-bold uppercase tracking-wider text-dark-muted">Simulador de Caídas</h4>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <button 
                onClick={() => toggleApi('crm')}
                className={`py-2 px-3 border rounded-lg text-xs font-semibold transition ${
                  status?.crmApi === 'connected' 
                    ? 'border-dark-border hover:bg-zinc-800 text-dark-text' 
                    : 'bg-brand-red border-brand-red text-white hover:bg-brand-red-hover'
                }`}
              >
                {status?.crmApi === 'connected' ? 'Simular Caída CRM' : 'Reconectar CRM'}
              </button>
              <button 
                onClick={() => toggleApi('evolution')}
                className={`py-2 px-3 border rounded-lg text-xs font-semibold transition ${
                  status?.evolutionApi === 'connected' 
                    ? 'border-dark-border hover:bg-zinc-800 text-dark-text' 
                    : 'bg-brand-red border-brand-red text-white hover:bg-brand-red-hover'
                }`}
              >
                {status?.evolutionApi === 'connected' ? 'Simular Caída Evo' : 'Reconectar Evo'}
              </button>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};
