import React, { useEffect, useState } from 'react';
import { 
  Play, Plus, Trash2, X, Clock, Eye, FlaskConical, Edit2, AlertTriangle, Loader2,
  AlertCircle, MessageSquare, MessageCircle, Mail, Key
} from 'lucide-react';
import { ConfirmModal } from './ConfirmModal';

interface TargetItem {
  url: string;
  loginUrl: string;
  username: string;
  password: string;
  showCustomLogin: boolean;
}

interface Recipient {
  id: string;
  name: string;
  channel: 'whatsapp' | 'whatsapp_group' | 'email' | 'telegram' | 'discord' | 'slack';
  value: string;
  status: string;
}

interface Report {
  id: string;
  name: string;
  description: string;
  status: 'active' | 'inactive';
  time: string;
  frequency: 'daily' | 'weekly' | 'monthly';
  channel: 'whatsapp' | 'email' | 'telegram';
  recipientIds: string[];
  timezone: string;
  retryCount: number;
  template: string;
  createdAt: string;
  daysOfWeek?: number[];
  lastExecutedAt?: string;
  nextExecutionAt?: string;
  isScreenshot?: boolean;
  loginUrl?: string;
  username?: string;
  password?: string;
  usernameSelector?: string;
  passwordSelector?: string;
  submitSelector?: string;
  targetUrls?: string[];
  screenshotTargets?: any[];
}

interface SchedulerProps {
  addToast: (message: string, type?: 'success' | 'error' | 'info' | 'warning') => void;
}

interface StepperStep {
  label: string;
  status: 'pending' | 'running' | 'success' | 'failed';
  desc: string;
}

export const Scheduler: React.FC<SchedulerProps> = ({ addToast }) => {
  const [reports, setReports] = useState<Report[]>([]);
  const [recipients, setRecipients] = useState<Recipient[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Progress Stepper Modal State
  const [stepperReportName, setStepperReportName] = useState('');
  const [stepperSteps, setStepperSteps] = useState<StepperStep[] | null>(null);
  const [stepperError, setStepperError] = useState<string | null>(null);

  // Preview Modal State
  const [previewHtml, setPreviewHtml] = useState<string | null>(null);
  const [previewingName, setPreviewingName] = useState('');
  const [loadingPreview, setLoadingPreview] = useState(false);

  // Deletion Modal State
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [deleteTargetId, setDeleteTargetId] = useState<string | null>(null);
  const [deleteTargetName, setDeleteTargetName] = useState('');

  // Form State
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [time, setTime] = useState('08:00');
  const [frequency, setFrequency] = useState<'daily' | 'weekly' | 'monthly'>('daily');
  const [status, setStatus] = useState<'active' | 'inactive'>('active');
  const [selectedRecipients, setSelectedRecipients] = useState<string[]>([]);
  const [timezone, setTimezone] = useState('America/Lima');
  const [retryCount, setRetryCount] = useState<number>(3);
  const [template, setTemplate] = useState('default');
  const [daysOfWeek, setDaysOfWeek] = useState<number[]>([0, 1, 2, 3, 4, 5, 6]);

  // Screenshot Report Custom State
  const [isScreenshot, setIsScreenshot] = useState(false);
  const [loginUrl, setLoginUrl] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [usernameSelector, setUsernameSelector] = useState('');
  const [passwordSelector, setPasswordSelector] = useState('');
  const [submitSelector, setSubmitSelector] = useState('');
  const [targets, setTargets] = useState<TargetItem[]>([
    { url: '', loginUrl: '', username: '', password: '', showCustomLogin: false }
  ]);

  const formatDaysOfWeek = (days?: number[]) => {
    if (!days || days.length === 0 || days.length === 7) return 'Todos los días';
    const names = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'];
    if (days.length === 5 && !days.includes(0) && !days.includes(6)) return 'Lun a Vie';
    return days.map(d => names[d]).join(', ');
  };

  const fetchReports = async () => {
    try {
      const res = await fetch('/api/reports');
      const data = await res.json();
      setReports(data);
    } catch (e) {
      console.error(e);
      addToast('Error cargando reportes.', 'error');
    }
  };

  const fetchRecipients = async () => {
    try {
      const res = await fetch('/api/recipients');
      const data = await res.json();
      setRecipients(data.filter((r: any) => r.status === 'active'));
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    const init = async () => {
      setLoading(true);
      await Promise.all([fetchReports(), fetchRecipients()]);
      setLoading(false);
    };
    init();
  }, []);

  const handleToggleStatus = async (report: Report) => {
    const newStatus = report.status === 'active' ? 'inactive' : 'active';
    try {
      const res = await fetch(`/api/reports/${report.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus })
      });
      if (res.ok) {
        addToast(
          `Reporte "${report.name}" ${newStatus === 'active' ? 'activado' : 'desactivado'} con éxito.`,
          newStatus === 'active' ? 'success' : 'warning'
        );
        fetchReports();
      }
    } catch (e) {
      addToast('Error al cambiar estado.', 'error');
    }
  };

  const openAddForm = () => {
    setEditingId(null);
    setName('');
    setDescription('');
    setTime('08:00');
    setFrequency('daily');
    setStatus('active');
    setSelectedRecipients([]);
    setTimezone('America/Lima');
    setRetryCount(3);
    setTemplate('default');
    setDaysOfWeek([0, 1, 2, 3, 4, 5, 6]);
    setIsScreenshot(false);
    setLoginUrl('');
    setUsername('');
    setPassword('');
    setUsernameSelector('');
    setPasswordSelector('');
    setSubmitSelector('');
    setTargets([{ url: '', loginUrl: '', username: '', password: '', showCustomLogin: false }]);
    setShowForm(true);
  };

  const openEditForm = (report: Report) => {
    setEditingId(report.id);
    setName(report.name);
    setDescription(report.description);
    setTime(report.time);
    setFrequency(report.frequency);
    setStatus(report.status);
    setSelectedRecipients(report.recipientIds || []);
    setTimezone(report.timezone || 'America/Lima');
    setRetryCount(report.retryCount ?? 3);
    setTemplate(report.template || 'default');
    setDaysOfWeek(report.daysOfWeek || [0, 1, 2, 3, 4, 5, 6]);
    
    setIsScreenshot(!!report.isScreenshot);
    setLoginUrl(report.loginUrl || '');
    setUsername(report.username || '');
    setPassword(report.password || '');
    setUsernameSelector(report.usernameSelector || '');
    setPasswordSelector(report.passwordSelector || '');
    setSubmitSelector(report.submitSelector || '');

    if (report.screenshotTargets && report.screenshotTargets.length > 0) {
      setTargets(report.screenshotTargets.map((st: any) => ({
        url: st.url || '',
        loginUrl: st.loginUrl || '',
        username: st.username || '',
        password: st.password || '',
        showCustomLogin: !!(st.loginUrl || st.username)
      })));
    } else if (report.targetUrls && report.targetUrls.length > 0) {
      setTargets(report.targetUrls.map(u => ({ url: u, loginUrl: '', username: '', password: '', showCustomLogin: false })));
    } else {
      setTargets([{ url: '', loginUrl: '', username: '', password: '', showCustomLogin: false }]);
    }

    setShowForm(true);
  };

  const handleDeleteTrigger = (id: string, reportName: string) => {
    setDeleteTargetId(id);
    setDeleteTargetName(reportName);
    setIsConfirmOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!deleteTargetId) return;
    try {
      const res = await fetch(`/api/reports/${deleteTargetId}`, { method: 'DELETE' });
      if (res.ok) {
        addToast(`Reporte "${deleteTargetName}" eliminado correctamente.`, 'success');
        fetchReports();
      } else {
        addToast('No se pudo eliminar el reporte.', 'error');
      }
    } catch (e) {
      addToast('Error eliminando reporte.', 'error');
    } finally {
      setIsConfirmOpen(false);
      setDeleteTargetId(null);
      setDeleteTargetName('');
    }
  };

  const runExecutionWithProgress = async (id: string, name: string, endpoint: 'run' | 'run-test') => {
    setStepperReportName(name);
    setStepperError(null);
    
    const initialSteps: StepperStep[] = [
      { label: 'Iniciando Despachador', status: 'running', desc: 'Verificando cola y parámetros de distribución...' },
      { label: 'Consultando CRM Corporativo / Fuentes Web', status: 'pending', desc: 'Conectando con Neon DB y enlaces configurados...' },
      { label: 'Procesando Datos del Reporte', status: 'pending', desc: 'Cálculo de registros y supervisores asociados...' },
      { label: 'Generando Reporte HTML / Capturas', status: 'pending', desc: 'Maquetando layout corporativo o navegando con Playwright...' },
      { label: 'Renderizando Imagen / Captura de Pantalla', status: 'pending', desc: 'Generación de buffers PNG de salida...' },
      { label: 'Enviando por WhatsApp', status: 'pending', desc: 'Subida de buffer de imagen a Evolution API y despacho a destinatarios...' },
      { label: 'Ejecución Finalizada', status: 'pending', desc: 'Confirmación de entrega e historial registrado en data local.' }
    ];
    setStepperSteps(initialSteps);

    // Setup active stepper simulation in background
    let currentStep = 0;
    const progressTimer = setInterval(() => {
      setStepperSteps(prev => {
        if (!prev) return null;
        const next = [...prev];
        if (currentStep < 5) {
          next[currentStep].status = 'success';
          currentStep++;
          next[currentStep].status = 'running';
        }
        return next;
      });
    }, 2000);

    try {
      const res = await fetch(`/api/reports/${id}/${endpoint}`, { method: 'POST' });
      const data = await res.json();
      
      clearInterval(progressTimer);

      if (res.ok) {
        // Complete all steps immediately as success
        setStepperSteps(prev => {
          if (!prev) return null;
          return prev.map(s => ({ ...s, status: 'success' }));
        });
        addToast(data.message || 'Reporte despachado correctamente.', 'success');
        setTimeout(() => setStepperSteps(null), 1800);
      } else {
        // Mark active step as failed
        const errMsg = data.error || 'La ejecución del reporte falló.';
        setStepperSteps(prev => {
          if (!prev) return null;
          return prev.map((s, idx) => {
            if (idx === currentStep || s.status === 'running') {
              return { ...s, status: 'failed', desc: errMsg };
            }
            return s;
          });
        });
        setStepperError(errMsg);
        addToast(errMsg, 'error');
      }
      fetchReports();
    } catch (e: any) {
      clearInterval(progressTimer);
      setStepperSteps(prev => {
        if (!prev) return null;
        return prev.map(s => s.status === 'running' ? { ...s, status: 'failed', desc: 'Error de conexión de red.' } : s);
      });
      setStepperError('Error de red al conectar con el servidor.');
      addToast('Error de conexión al ejecutar reporte.', 'error');
    }
  };

  const handleRunNow = (id: string, name: string) => {
    runExecutionWithProgress(id, name, 'run');
  };

  const handleRunTest = (id: string, name: string) => {
    runExecutionWithProgress(id, name, 'run-test');
  };

  const handleShowPreview = async (id: string, name: string) => {
    setLoadingPreview(true);
    setPreviewingName(name);
    try {
      const res = await fetch(`/api/reports/${id}/preview`);
      const htmlText = await res.text();
      if (res.ok) {
        setPreviewHtml(htmlText);
      } else {
        addToast('No se pudo generar la vista previa.', 'error');
      }
    } catch (e) {
      addToast('Error de red al conectar al endpoint de vista previa.', 'error');
    } finally {
      setLoadingPreview(false);
    }
  };

  const handleRecipientToggle = (id: string) => {
    setSelectedRecipients(prev => 
      prev.includes(id) ? prev.filter(rid => rid !== id) : [...prev, id]
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    const formattedTargets = targets
      .filter(t => t.url && t.url.trim() !== '')
      .map(t => ({
        url: t.url.trim(),
        loginUrl: t.showCustomLogin ? t.loginUrl.trim() : '',
        username: t.showCustomLogin ? t.username.trim() : '',
        password: t.showCustomLogin ? t.password : ''
      }));

    const payload = {
      name,
      description,
      time,
      frequency,
      status,
      recipientIds: selectedRecipients,
      timezone,
      retryCount: Number(retryCount),
      template: isScreenshot ? 'screenshot' : template,
      channel: 'whatsapp',
      daysOfWeek,
      isScreenshot,
      loginUrl,
      username,
      password,
      usernameSelector,
      passwordSelector,
      submitSelector,
      targetUrls: formattedTargets.map(t => t.url),
      screenshotTargets: formattedTargets
    };

    try {
      const url = editingId ? `/api/reports/${editingId}` : '/api/reports';
      const method = editingId ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      if (res.ok) {
        addToast(
          editingId ? `Reporte "${name}" actualizado con éxito.` : `Reporte "${name}" programado con éxito.`, 
          'success'
        );
        setShowForm(false);
        fetchReports();
      } else {
        addToast('No se pudo guardar la programación del reporte.', 'error');
      }
    } catch (e) {
      addToast('Error de red al guardar reporte.', 'error');
    }
  };

  const getRecipientChannelIcon = (ch: Recipient['channel']) => {
    switch (ch) {
      case 'whatsapp':
        return <MessageSquare className="w-3.5 h-3.5 text-emerald-400" />;
      case 'whatsapp_group':
        return <MessageCircle className="w-3.5 h-3.5 text-indigo-400" />;
      case 'email':
        return <Mail className="w-3.5 h-3.5 text-sky-400" />;
      default:
        return <MessageSquare className="w-3.5 h-3.5 text-zinc-400" />;
    }
  };

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex justify-between items-center border-b border-dark-border/40 pb-5">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-dark-text">Scheduler de Distribución</h2>
          <p className="text-sm text-dark-muted">Programación horaria, canales de salida y asignación de destinatarios.</p>
        </div>
        <button
          onClick={showForm ? () => setShowForm(false) : openAddForm}
          className="flex items-center gap-2 px-4 py-2 bg-brand-red hover:bg-brand-red-hover text-white rounded-lg text-sm font-semibold transition shadow-md shadow-brand-red/10"
        >
          {showForm ? <X className="w-4.5 h-4.5" /> : <Plus className="w-4.5 h-4.5" />}
          {showForm ? 'Cancelar' : 'Programar Reporte'}
        </button>
      </div>

      {/* Add/Edit Form */}
      {showForm && (
        <div className="bg-dark-card border border-dark-border rounded-xl p-6 shadow-xl animate-fadeIn">
          <h3 className="text-base font-bold text-dark-text mb-6">
            {editingId ? 'Editar Programación de Reporte' : 'Nueva Programación de Reporte'}
          </h3>
          <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="space-y-2">
              <label className="text-xs font-bold text-dark-muted uppercase tracking-wider">Nombre del Reporte</label>
              <input 
                type="text" 
                value={name}
                onChange={e => setName(e.target.value)}
                placeholder="Ej. Reporte Diario de Ventas"
                required
                className="w-full bg-dark-bg border border-dark-border rounded-lg px-4 py-2 text-sm text-dark-text focus:outline-none focus:border-brand-red transition"
              />
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold text-dark-muted uppercase tracking-wider">Frecuencia</label>
              <select
                value={frequency}
                onChange={e => setFrequency(e.target.value as any)}
                className="w-full bg-dark-bg border border-dark-border rounded-lg px-4 py-2 text-sm text-dark-text focus:outline-none focus:border-brand-red transition"
              >
                <option value="daily">Diario</option>
                <option value="weekly">Semanal</option>
                <option value="monthly">Mensual</option>
              </select>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold text-dark-muted uppercase tracking-wider">Horas de Envío (Separadas por coma)</label>
              <input 
                type="text" 
                value={time}
                onChange={e => setTime(e.target.value)}
                placeholder="Ej. 08:00, 18:30"
                required
                className="w-full bg-dark-bg border border-dark-border rounded-lg px-4 py-2 text-sm text-dark-text focus:outline-none focus:border-brand-red transition"
              />
              <div className="flex gap-1.5 mt-1">
                <button 
                  type="button" 
                  onClick={() => setTime(t => t ? `${t.trim()}, 08:00` : '08:00')}
                  className="text-[9px] bg-zinc-800 border border-dark-border text-dark-muted px-2 py-0.5 rounded hover:text-dark-text hover:border-zinc-650 transition font-mono"
                >
                  ☀️ 08:00
                </button>
                <button 
                  type="button" 
                  onClick={() => setTime(t => t ? `${t.trim()}, 18:00` : '18:00')}
                  className="text-[9px] bg-zinc-800 border border-dark-border text-dark-muted px-2 py-0.5 rounded hover:text-dark-text hover:border-zinc-650 transition font-mono"
                >
                  🌇 18:00
                </button>
                <button 
                  type="button" 
                  onClick={() => setTime(t => t ? `${t.trim()}, 22:00` : '22:00')}
                  className="text-[9px] bg-zinc-800 border border-dark-border text-dark-muted px-2 py-0.5 rounded hover:text-dark-text hover:border-zinc-650 transition font-mono"
                >
                  🌙 22:00
                </button>
                <button 
                  type="button" 
                  onClick={() => setTime('')}
                  className="text-[9px] bg-brand-red/10 border border-brand-red/20 text-brand-red px-2 py-0.5 rounded hover:bg-brand-red/20 transition font-bold"
                >
                  Limpiar
                </button>
              </div>
            </div>

            {/* Variable Configurations */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-dark-muted uppercase tracking-wider">Timezone (Zona Horaria)</label>
              <input 
                type="text" 
                value={timezone}
                onChange={e => setTimezone(e.target.value)}
                required
                className="w-full bg-dark-bg border border-dark-border rounded-lg px-4 py-2 text-sm text-dark-text focus:outline-none focus:border-brand-red transition"
              />
            </div>

            <div className="space-y-2 md:col-span-1">
              <label className="text-xs font-bold text-dark-muted uppercase tracking-wider block mb-1">Días de Envío</label>
              <div className="flex gap-1">
                {[\n                  { l: 'D', v: 0 },
                  { l: 'L', v: 1 },
                  { l: 'M', v: 2 },
                  { l: 'M', v: 3 },
                  { l: 'J', v: 4 },
                  { l: 'V', v: 5 },
                  { l: 'S', v: 6 }
                ].map(day => {
                  const active = daysOfWeek.includes(day.v);
                  return (
                    <button
                      key={day.v}
                      type="button"
                      onClick={() => {
                        setDaysOfWeek(prev => 
                          prev.includes(day.v) ? prev.filter(v => v !== day.v) : [...prev, day.v]
                        );
                      }}
                      className={`w-7 h-7 rounded-lg text-xs font-bold transition flex items-center justify-center border ${
                        active 
                          ? 'bg-brand-red border-brand-red text-white' 
                          : 'bg-zinc-800 border-dark-border text-dark-muted hover:border-zinc-650'
                      }`}
                      title={['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'][day.v]}
                    >
                      {day.l}
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold text-dark-muted uppercase tracking-wider">Reintentos en Fallo</label>
              <input 
                type="number" 
                min="0"
                max="10"
                value={retryCount}
                onChange={e => setRetryCount(Number(e.target.value))}
                required
                className="w-full bg-dark-bg border border-dark-border rounded-lg px-4 py-2 text-sm text-dark-text focus:outline-none focus:border-brand-red transition"
              />
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold text-dark-muted uppercase tracking-wider">Plantilla / Template</label>
              <input 
                type="text" 
                value={template}
                onChange={e => setTemplate(e.target.value)}
                required
                disabled={isScreenshot}
                className="w-full bg-dark-bg border border-dark-border rounded-lg px-4 py-2 text-sm text-dark-text focus:outline-none focus:border-brand-red transition disabled:opacity-50"
              />
            </div>

            <div className="space-y-2 md:col-span-1">
              <label className="text-xs font-bold text-dark-muted uppercase tracking-wider">Estado</label>
              <div className="flex gap-4 items-center h-10">
                <label className="flex items-center gap-2 text-sm text-dark-text cursor-pointer">
                  <input 
                    type="radio" 
                    name="status" 
                    checked={status === 'active'}
                    onChange={() => setStatus('active')}
                    className="accent-brand-red"
                  />
                  <span>Activo</span>
                </label>
                <label className="flex items-center gap-2 text-sm text-dark-text cursor-pointer">
                  <input 
                    type="radio" 
                    name="status" 
                    checked={status === 'inactive'}
                    onChange={() => setStatus('inactive')}
                    className="accent-brand-red"
                  />
                  <span>Inactivo</span>
                </label>
              </div>
            </div>

            {/* SCREENSHOT REPORT TOGGLE */}
            <div className="space-y-2 md:col-span-3 bg-dark-bg/60 border border-dark-border/80 rounded-xl p-4">
              <label className="flex items-center gap-3 cursor-pointer">
                <input 
                  type="checkbox"
                  checked={isScreenshot}
                  onChange={e => {
                    setIsScreenshot(e.target.checked);
                    if (e.target.checked) setTemplate('screenshot');
                  }}
                  className="w-4 h-4 rounded border-dark-border bg-dark-bg text-brand-red focus:ring-0"
                />
                <div>
                  <span className="text-sm font-bold text-dark-text">📸 Reporte de Captura de Pantalla Web</span>
                  <p className="text-xs text-dark-muted">Navega a los sitios web configurados y toma capturas de pantalla de forma automática.</p>
                </div>
              </label>

              {isScreenshot && (
                <div className="mt-4 pt-4 border-t border-dark-border/60 space-y-4">
                  <div className="bg-brand-red/5 border border-brand-red/20 p-3 rounded-lg text-xs text-dark-muted">
                    <span className="font-bold text-brand-red block mb-1">ℹ️ Captura de Páginas Web</span>
                    Ingresa las URLs de los sitios que deseas capturar. Si alguna página requiere usuario y clave para ingresar, presiona el botón <span className="font-bold text-dark-text">"🔑 ¿Tiene login?"</span> en su casilla.
                  </div>

                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <label className="text-xs font-bold text-dark-muted uppercase tracking-wider block">
                        URLs de Destino para Capturar Pantalla ({targets.length}/6)
                      </label>
                      {targets.length < 6 && (
                        <button
                          type="button"
                          onClick={() => setTargets([...targets, { url: '', loginUrl: '', username: '', password: '', showCustomLogin: false }])}
                          className="flex items-center gap-1 text-xs text-brand-red hover:underline font-bold"
                        >
                          <Plus className="w-3.5 h-3.5" /> Agregar URL
                        </button>
                      )}
                    </div>

                    {targets.map((t, idx) => (
                      <div key={idx} className="bg-dark-bg/80 border border-dark-border rounded-xl p-3 space-y-3">
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-bold text-dark-muted w-14 shrink-0">Link {idx + 1}:</span>
                          <input 
                            type="url"
                            value={t.url}
                            onChange={e => {
                              const newTargets = [...targets];
                              newTargets[idx].url = e.target.value;
                              setTargets(newTargets);
                            }}
                            placeholder={`https://ejemplo.com/reporte-${idx + 1}`}
                            className="flex-1 bg-dark-card border border-dark-border rounded-lg px-3 py-1.5 text-xs text-dark-text focus:outline-none focus:border-brand-red"
                          />
                          <button
                            type="button"
                            onClick={() => {
                              const newTargets = [...targets];
                              newTargets[idx].showCustomLogin = !newTargets[idx].showCustomLogin;
                              setTargets(newTargets);
                            }}
                            className={`flex items-center gap-1 text-[11px] px-2.5 py-1.5 rounded-lg border font-medium transition ${
                              t.showCustomLogin 
                                ? 'bg-brand-red/10 border-brand-red/40 text-brand-red font-bold' 
                                : 'bg-dark-card border-dark-border text-dark-muted hover:text-dark-text'
                            }`}
                            title="Configurar usuario y contraseña para este link"
                          >
                            <Key className="w-3.5 h-3.5" />
                            <span>{t.showCustomLogin ? '🔑 Con login activo' : '🔑 ¿Tiene login?'}</span>
                          </button>

                          {targets.length > 1 && (
                            <button
                              type="button"
                              onClick={() => setTargets(targets.filter((_, i) => i !== idx))}
                              className="p-1.5 text-red-400 hover:text-red-300 hover:bg-red-500/10 rounded-lg transition"
                              title="Eliminar este link"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          )}
                        </div>

                        {t.showCustomLogin && (
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-2 pt-2 border-t border-dark-border/40 bg-dark-card/40 p-2.5 rounded-lg">
                            <div>
                              <label className="text-[10px] font-bold text-dark-muted uppercase">URL de Login</label>
                              <input 
                                type="url"
                                value={t.loginUrl}
                                onChange={e => {
                                  const newTargets = [...targets];
                                  newTargets[idx].loginUrl = e.target.value;
                                  setTargets(newTargets);
                                }}
                                placeholder="https://ejemplo.com/login"
                                className="w-full bg-dark-bg border border-dark-border rounded px-2.5 py-1 text-xs text-dark-text focus:outline-none focus:border-brand-red"
                              />
                            </div>
                            <div>
                              <label className="text-[10px] font-bold text-dark-muted uppercase">Usuario / Email</label>
                              <input 
                                type="text"
                                value={t.username}
                                onChange={e => {
                                  const newTargets = [...targets];
                                  newTargets[idx].username = e.target.value;
                                  setTargets(newTargets);
                                }}
                                placeholder="usuario@ejemplo.com"
                                className="w-full bg-dark-bg border border-dark-border rounded px-2.5 py-1 text-xs text-dark-text focus:outline-none focus:border-brand-red"
                              />
                            </div>
                            <div>
                              <label className="text-[10px] font-bold text-dark-muted uppercase">Contraseña</label>
                              <input 
                                type="password"
                                value={t.password}
                                onChange={e => {
                                  const newTargets = [...targets];
                                  newTargets[idx].password = e.target.value;
                                  setTargets(newTargets);
                                }}
                                placeholder="••••••••"
                                className="w-full bg-dark-bg border border-dark-border rounded px-2.5 py-1 text-xs text-dark-text focus:outline-none focus:border-brand-red"
                              />
                            </div>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Recipient Checklist */}
            <div className="space-y-2 md:col-span-2">
              <label className="text-xs font-bold text-dark-muted uppercase tracking-wider block mb-1">
                Destinatarios Asociados (Selecciona uno o más)
              </label>
              {recipients.length === 0 ? (
                <div className="text-xs text-amber-500 bg-amber-500/5 border border-amber-500/10 p-3 rounded-lg flex items-center gap-1">
                  <AlertTriangle className="w-4.5 h-4.5" />
                  No hay destinatarios activos creados. Ve a la pestaña "Destinatarios" para crear uno primero.
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-36 overflow-y-auto p-3 bg-dark-bg border border-dark-border rounded-lg">
                  {recipients.map((rec) => (
                    <label key={rec.id} className="flex items-center gap-2.5 text-xs text-dark-text cursor-pointer hover:bg-dark-card/50 p-1.5 rounded transition">
                      <input 
                        type="checkbox"
                        checked={selectedRecipients.includes(rec.id)}
                        onChange={() => handleRecipientToggle(rec.id)}
                        className="rounded border-dark-border bg-dark-bg text-brand-red focus:ring-0"
                      />
                      <div className="truncate flex items-center gap-1.5">
                        {getRecipientChannelIcon(rec.channel)}
                        <span className="font-bold">{rec.name}</span> <span className="text-dark-muted">({rec.value})</span>
                      </div>
                    </label>
                  ))}
                </div>
              )}
            </div>

            <div className="space-y-2 md:col-span-3">
              <label className="text-xs font-bold text-dark-muted uppercase tracking-wider">Descripción del Reporte</label>
              <textarea 
                value={description}
                onChange={e => setDescription(e.target.value)}
                placeholder="Breve descripción del objetivo del reporte y su periodicidad."
                rows={2}
                className="w-full bg-dark-bg border border-dark-border rounded-lg px-4 py-2 text-sm text-dark-text focus:outline-none focus:border-brand-red transition resize-none"
              />
            </div>

            <div className="md:col-span-3 flex justify-end gap-3 pt-3 border-t border-dark-border/40">
              <button 
                type="button"
                onClick={() => setShowForm(false)}
                className="px-4 py-2 border border-dark-border text-dark-text hover:bg-zinc-800 rounded-lg text-sm font-semibold transition"
              >
                Cancelar
              </button>
              <button 
                type="submit"
                className="px-5 py-2 bg-brand-red hover:bg-brand-red-hover text-white rounded-lg text-sm font-semibold transition"
              >
                {editingId ? 'Guardar Cambios' : 'Programar Reporte'}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Scheduler Table */}
      <div className="bg-dark-card border border-dark-border rounded-xl overflow-hidden shadow-lg">
        {loading ? (
          <div className="flex items-center justify-center p-12">
            <Loader2 className="w-8 h-8 text-brand-red animate-spin" />
          </div>
        ) : reports.length === 0 ? (
          <div className="p-12 text-center text-dark-muted">
            No hay reportes programados. Haz clic en "Programar Reporte" para crear uno.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full border-collapse text-left min-w-[900px]">
              <thead>
                <tr className="border-b border-dark-border bg-dark-card/50 text-[10px] uppercase tracking-wider text-dark-muted font-bold">
                  <th className="px-6 py-4">Reporte</th>
                  <th className="px-6 py-4">Frecuencia / Hora</th>
                  <th className="px-6 py-4">Zona Horaria / Reintentos</th>
                  <th className="px-6 py-4">Destinatarios</th>
                  <th className="px-6 py-4">Siguiente Envío</th>
                  <th className="px-6 py-4">Estado</th>
                  <th className="px-6 py-4 text-right">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-dark-border text-sm">
                {reports.map((report) => {
                  const countRecs = report.recipientIds ? report.recipientIds.length : 0;
                  return (
                    <tr key={report.id} className="hover:bg-dark-card/55 transition duration-150">
                      <td className="px-6 py-4">
                        <div className="font-semibold text-dark-text flex items-center gap-2">
                          {report.name}
                          {report.isScreenshot && (
                            <span className="bg-brand-red/10 border border-brand-red/20 text-brand-red text-[10px] px-1.5 py-0.5 rounded font-bold">
                              📸 Captura Web ({report.screenshotTargets?.length || report.targetUrls?.length || 1})
                            </span>
                          )}
                        </div>
                        <div className="text-xs text-dark-muted line-clamp-1 mt-0.5">{report.description || 'Sin descripción.'}</div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="font-medium text-dark-text capitalize">
                          {report.frequency === 'daily' ? 'Diario' : report.frequency === 'weekly' ? 'Semanal' : 'Mensual'}
                        </div>
                        <div className="text-xs text-dark-muted font-mono mt-0.5">{report.time}</div>
                        <div className="text-[10px] text-dark-muted mt-1 bg-zinc-900 border border-dark-border/40 px-1.5 py-0.5 rounded inline-block font-medium">
                          📅 {formatDaysOfWeek(report.daysOfWeek)}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-xs text-dark-text font-medium">{report.timezone || 'America/Lima'}</div>
                        <div className="text-xs text-dark-muted mt-0.5">Reintentos: {report.retryCount ?? 3} · Plantilla: {report.template || 'default'}</div>
                      </td>
                      <td className="px-6 py-4">
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
                          {countRecs} {countRecs === 1 ? 'Destinatario' : 'Destinatarios'}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-xs font-medium text-dark-muted">
                        {report.status === 'active' && report.nextExecutionAt ? (
                          <span className="flex items-center gap-1">
                            <Clock className="w-4 h-4 text-dark-muted" />
                            {new Date(report.nextExecutionAt).toLocaleString([], { dateStyle: 'short', timeStyle: 'short' })}
                          </span>
                        ) : (
                          <span className="text-dark-muted/50 italic">—</span>
                        )}
                      </td>
                      <td className="px-6 py-4">
                        <button
                          onClick={() => handleToggleStatus(report)}
                          className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold transition border ${
                            report.status === 'active'
                              ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20 hover:bg-emerald-500/20'
                              : 'bg-zinc-800 text-dark-muted border-dark-border hover:bg-zinc-700'
                          }`}
                        >
                          <span className={`h-1.5 w-1.5 rounded-full ${report.status === 'active' ? 'bg-emerald-500' : 'bg-zinc-500'}`}></span>
                          {report.status === 'active' ? 'Activo' : 'Inactivo'}
                        </button>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          {/* Live Preview Button */}
                          <button
                            onClick={() => handleShowPreview(report.id, report.name)}
                            disabled={loadingPreview}
                            className="p-2 border border-dark-border text-dark-muted hover:text-dark-text hover:border-zinc-700 rounded-lg transition"
                            title="Vista Previa"
                          >
                            <Eye className="w-4.5 h-4.5" />
                          </button>

                          {/* Test Send Button */}
                          <button
                            onClick={() => handleRunTest(report.id, report.name)}
                            className="p-2 border border-dark-border text-dark-muted hover:text-amber-400 hover:border-amber-500/30 rounded-lg transition"
                            title="Enviar Prueba"
                          >
                            <FlaskConical className="w-4.5 h-4.5" />
                          </button>

                          {/* Production Send Button */}
                          <button
                            onClick={() => handleRunNow(report.id, report.name)}
                            className="p-2 border border-dark-border text-dark-muted hover:text-emerald-400 hover:border-emerald-500/30 rounded-lg transition"
                            title="Ejecutar Producción"
                          >
                            <Play className="w-4.5 h-4.5 fill-current" />
                          </button>

                          {/* Edit Button */}
                          <button
                            onClick={() => openEditForm(report)}
                            className="p-2 border border-dark-border text-dark-muted hover:text-dark-text hover:border-zinc-700 rounded-lg transition"
                            title="Editar"
                          >
                            <Edit2 className="w-4.5 h-4.5" />
                          </button>

                          {/* Delete Button */}
                          <button
                            onClick={() => handleDeleteTrigger(report.id, report.name)}
                            className="p-2 border border-dark-border text-dark-muted hover:text-brand-red hover:border-brand-red/30 rounded-lg transition"
                            title="Eliminar"
                          >
                            <Trash2 className="w-4.5 h-4.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Manual Stepper / Progress Modal (Stripe Style Live Stepper) */}
      {stepperSteps && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-sm animate-fade-in p-4">
          <div className="bg-dark-card border border-dark-border w-full max-w-lg rounded-2xl shadow-2xl p-6 space-y-6">
            <div className="flex justify-between items-center border-b border-dark-border/40 pb-4">
              <div>
                <h3 className="text-base font-bold text-dark-text">Progreso de Envío en Vivo</h3>
                <p className="text-xs text-dark-muted mt-0.5">Ejecutando: {stepperReportName}</p>
              </div>
              {!stepperError && (
                <Loader2 className="w-5 h-5 text-brand-red animate-spin" />
              )}
            </div>

            {/* Stepper Body */}
            <div className="relative border-l border-zinc-800 pl-6 ml-3 space-y-5 py-1">
              {stepperSteps.map((step, idx) => {
                let bullet = 'bg-zinc-900 border-zinc-800 text-zinc-600';
                let labelStyle = 'text-zinc-500';
                
                if (step.status === 'success') {
                  bullet = 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400';
                  labelStyle = 'text-dark-text font-semibold';
                } else if (step.status === 'running') {
                  bullet = 'bg-indigo-500/10 border-indigo-500/30 text-indigo-400';
                  labelStyle = 'text-indigo-400 font-bold';
                } else if (step.status === 'failed') {
                  bullet = 'bg-brand-red/10 border-brand-red/30 text-brand-red';
                  labelStyle = 'text-brand-red font-bold';
                }

                return (
                  <div key={idx} className="relative">
                    {/* Node Dot */}
                    <div className={`absolute -left-[37px] top-0.5 w-6 h-6 rounded-full border flex items-center justify-center text-[10px] ${bullet}`}>
                      {step.status === 'success' ? '✓' : step.status === 'running' ? '●' : step.status === 'failed' ? '✗' : '○'}
                    </div>
                    <div>
                      <div className={`text-xs ${labelStyle}`}>{step.label}</div>
                      <p className="text-[11px] text-dark-muted mt-0.5 leading-relaxed">{step.desc}</p>
                    </div>
                  </div>
                );
              })}
            </div>

            {stepperError && (
              <div className="p-3.5 bg-brand-red/5 border border-brand-red/10 text-brand-red rounded-lg text-xs leading-relaxed flex gap-2">
                <AlertCircle className="w-5 h-5 shrink-0" />
                <div>
                  <span className="font-bold">Error en la ejecución:</span>
                  <p className="mt-0.5">{stepperError}</p>
                </div>
              </div>
            )}

            {/* Stepper Footer actions */}
            <div className="flex justify-end pt-3 border-t border-dark-border/40">
              <button
                onClick={() => setStepperSteps(null)}
                className="px-4 py-2 border border-dark-border text-dark-text hover:bg-zinc-800 rounded-lg text-xs font-semibold transition"
              >
                Cerrar Ventana
              </button>
            </div>
          </div>
        </div>
      )}

      {/* HTML Preview Modal */}
      {previewHtml && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-sm animate-fade-in p-4">
          <div className="bg-dark-card border border-dark-border w-full max-w-5xl h-[85vh] rounded-2xl shadow-2xl overflow-hidden flex flex-col">
            <div className="px-6 py-4 border-b border-dark-border flex justify-between items-center bg-dark-bg/30">
              <h3 className="text-base font-bold text-dark-text flex items-center gap-2">
                <Eye className="w-5 h-5 text-brand-red" />
                Vista Previa HTML: {previewingName}
              </h3>
              <button 
                onClick={() => setPreviewHtml(null)}
                className="p-1 text-dark-muted hover:text-dark-text hover:bg-zinc-850 rounded-lg transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            {/* Embedded Iframe */}
            <div className="flex-1 bg-zinc-950 p-2">
              <iframe 
                srcDoc={previewHtml}
                title="Report Preview HTML"
                className="w-full h-full border-0 rounded-lg bg-white"
                sandbox="allow-same-origin"
              />
            </div>

            <div className="px-6 py-3 border-t border-dark-border flex justify-end bg-dark-bg/30 text-xs text-dark-muted">
              <span>El diseño se renderizará automáticamente en una imagen PNG antes de despacharse a WhatsApp.</span>
            </div>
          </div>
        </div>
      )}

      {/* Loader for previews */}
      {loadingPreview && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-xs">
          <div className="bg-dark-card border border-dark-border px-6 py-4 rounded-xl shadow-xl flex items-center gap-3">
            <Loader2 className="w-5 h-5 text-brand-red animate-spin" />
            <span className="text-sm font-semibold text-dark-text">Generando vista previa...</span>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      <ConfirmModal
        isOpen={isConfirmOpen}
        title="¿Eliminar Reporte?"
        message={`¿Estás seguro de que deseas eliminar la programación de "${deleteTargetName}"? Esta acción no se puede deshacer.`}
        onConfirm={handleDeleteConfirm}
        onCancel={() => {
          setIsConfirmOpen(false);
          setDeleteTargetId(null);
          setDeleteTargetName('');
        }}
      />
    </div>
  );
};
