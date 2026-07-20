import React, { useState, useEffect } from 'react';
import { 
  Settings, Save, Key, Globe, MessageSquare, QrCode as QrIcon, CheckCircle2, RefreshCw, 
  ShieldAlert, Power, Loader2
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

interface ConfiguracionProps {
  addToast: (message: string, type?: 'success' | 'error' | 'info' | 'warning') => void;
}

export const Configuracion: React.FC<ConfiguracionProps> = ({ addToast }) => {
  const [evolutionUrl, setEvolutionUrl] = useState('https://evolution-api-smart.onrender.com');
  const [evolutionKey, setEvolutionKey] = useState('NEXO_SECRET_KEY_2026');
  const [crmUrl, setCrmUrl] = useState('https://api.crm.dreamteam.com');
  const [crmKey, setCrmKey] = useState('crm_secret_key');

  const [saving, setSaving] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);

  // QR connection states
  const [qrCode, setQrCode] = useState<string | null>(null);
  const [connectionState, setConnectionState] = useState<string>('connecting');
  const [status, setStatus] = useState<SystemStatus | null>(null);

  const fetchStatusAndQr = async () => {
    try {
      // Fetch system status
      const statusRes = await fetch('/api/status');
      if (statusRes.ok) {
        const data = await statusRes.json();
        setStatus(data.status);
      }

      // Fetch WhatsApp QR
      const res = await fetch('/api/status/whatsapp/qr');
      if (res.ok) {
        const data = await res.json();
        setQrCode(data.qr);
        setConnectionState(data.state);
      }
    } catch (err) {
      console.error('Error fetching WhatsApp status:', err);
    }
  };

  useEffect(() => {
    fetchStatusAndQr();
    const interval = setInterval(fetchStatusAndQr, 5000);
    return () => clearInterval(interval);
  }, []);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setTimeout(() => {
      setSaving(false);
      addToast('Configuración de APIs guardada con éxito.', 'success');
    }, 800);
  };

  const handleReconnect = async () => {
    setActionLoading(true);
    addToast('Verificando y reconectando la sesión...', 'info');
    try {
      const res = await fetch('/api/status/whatsapp/reconnect', { method: 'POST' });
      const data = await res.json();
      if (res.ok && data.success) {
        setConnectionState(data.state);
        addToast(
          data.state === 'connected' 
            ? 'Conexión activa y lista para usar.' 
            : 'Sesión esperando escaneo del código QR.', 
          data.state === 'connected' ? 'success' : 'info'
        );
        fetchStatusAndQr();
      } else {
        addToast(data.error || 'No se pudo reconectar.', 'error');
      }
    } catch (e) {
      addToast('Error al reconectar.', 'error');
    } finally {
      setActionLoading(false);
    }
  };

  const handleResetQR = async () => {
    if (!window.confirm('¿Estás seguro de que deseas forzar un nuevo código QR? Esto cerrará la sesión actual de WhatsApp en tu teléfono y generará un QR limpio.')) return;
    setActionLoading(true);
    addToast('Restableciendo instancia y solicitando nuevo código QR...', 'warning');
    try {
      const res = await fetch('/api/status/whatsapp/reset', { method: 'POST' });
      if (res.ok) {
        addToast('Sesión de WhatsApp restablecida. Generando nuevo código QR...', 'success');
        setQrCode(null);
        setConnectionState('connecting');
        fetchStatusAndQr();
      } else {
        const data = await res.json();
        addToast(data.error || 'No se pudo restablecer la sesión.', 'error');
      }
    } catch (e) {
      addToast('Error al restablecer código QR.', 'error');
    } finally {
      setActionLoading(false);
    }
  };

  return (
    <div className="space-y-8 max-w-7xl mx-auto animate-fadeIn">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold tracking-tight text-dark-text">Configuración</h2>
        <p className="text-sm text-dark-muted">Administra las credenciales de conexión con Evolution API y el CRM corporativo.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <form onSubmit={handleSave} className="lg:col-span-2 space-y-6">
          {/* Evolution API Card */}
          <div className="bg-dark-card border border-dark-border rounded-xl p-6 space-y-6">
            <div className="flex items-center gap-3 border-b border-dark-border pb-4">
              <div className="p-2 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 rounded-lg">
                <MessageSquare className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-bold text-dark-text">Evolution API (WhatsApp)</h3>
                <p className="text-xs text-dark-muted">Credenciales de conexión para el envío de notificaciones y reportes.</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div className="space-y-2">
                <label className="text-xs font-semibold text-dark-muted uppercase tracking-wider flex items-center gap-1">
                  <Globe className="w-3.5 h-3.5" /> URL del Host
                </label>
                <input 
                  type="text" 
                  value={evolutionUrl}
                  onChange={e => setEvolutionUrl(e.target.value)}
                  className="w-full bg-dark-bg border border-dark-border rounded-lg px-4 py-2 text-sm text-dark-text focus:outline-none focus:border-brand-red transition"
                />
              </div>

              <div className="space-y-2">
                <label className="text-xs font-semibold text-dark-muted uppercase tracking-wider flex items-center gap-1">
                  <Key className="w-3.5 h-3.5" /> API Token / Key
                </label>
                <input 
                  type="password" 
                  value={evolutionKey}
                  onChange={e => setEvolutionKey(e.target.value)}
                  className="w-full bg-dark-bg border border-dark-border rounded-lg px-4 py-2 text-sm text-dark-text focus:outline-none focus:border-brand-red transition"
                />
              </div>
            </div>
          </div>

          {/* CRM API Card */}
          <div className="bg-dark-card border border-dark-border rounded-xl p-6 space-y-6">
            <div className="flex items-center gap-3 border-b border-dark-border pb-4">
              <div className="p-2 bg-brand-red/10 border border-brand-red/20 text-brand-red rounded-lg">
                <Settings className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-bold text-dark-text">CRM API</h3>
                <p className="text-xs text-dark-muted">Configuración de autenticación para consultar datos diarios de leads y ventas.</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div className="space-y-2">
                <label className="text-xs font-semibold text-dark-muted uppercase tracking-wider flex items-center gap-1">
                  <Globe className="w-3.5 h-3.5" /> URL del API CRM
                </label>
                <input 
                  type="text" 
                  value={crmUrl}
                  onChange={e => setCrmUrl(e.target.value)}
                  className="w-full bg-dark-bg border border-dark-border rounded-lg px-4 py-2 text-sm text-dark-text focus:outline-none focus:border-brand-red transition"
                />
              </div>

              <div className="space-y-2">
                <label className="text-xs font-semibold text-dark-muted uppercase tracking-wider flex items-center gap-1">
                  <Key className="w-3.5 h-3.5" /> CRM API Key
                </label>
                <input 
                  type="password" 
                  value={crmKey}
                  onChange={e => setCrmKey(e.target.value)}
                  className="w-full bg-dark-bg border border-dark-border rounded-lg px-4 py-2 text-sm text-dark-text focus:outline-none focus:border-brand-red transition"
                />
              </div>
            </div>
          </div>

          {/* Save Button */}
          <div className="flex justify-end">
            <button
              type="submit"
              disabled={saving}
              className="flex items-center gap-2 px-5 py-2.5 bg-brand-red hover:bg-brand-red-hover text-white rounded-lg text-sm font-semibold transition shadow-md shadow-brand-red/10 disabled:opacity-50"
            >
              <Save className="w-4 h-4" />
              {saving ? 'Guardando...' : 'Guardar Cambios'}
            </button>
          </div>
        </form>

        {/* WhatsApp Real-Time Connection QR Card */}
        <div className="bg-dark-card border border-dark-border rounded-xl p-6 space-y-6 flex flex-col justify-between">
          <div className="space-y-4">
            <div className="flex items-center justify-between border-b border-dark-border pb-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 rounded-lg">
                  <QrIcon className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-dark-text">Canal WhatsApp</h3>
                  <p className="text-xs text-dark-muted">Administración de la instancia local.</p>
                </div>
              </div>
              
              <div className={`h-2.5 w-2.5 rounded-full ${
                connectionState === 'connected' ? 'bg-emerald-500 animate-pulse' : 'bg-amber-500 animate-pulse'
              }`} />
            </div>

            {/* Connection Status Section */}
            {connectionState === 'connected' ? (
              <div className="flex flex-col items-center justify-center p-6 bg-emerald-500/5 border border-emerald-500/20 rounded-xl space-y-3 text-center my-6">
                <CheckCircle2 className="w-12 h-12 text-emerald-400 animate-pulse" />
                <h4 className="text-sm font-bold text-dark-text">Conexión Activa</h4>
                <p className="text-[11px] text-dark-muted max-w-xs leading-relaxed">
                  Tu número de WhatsApp se encuentra conectado con éxito. Los reportes del Scheduler y pruebas llegarán directo a los destinatarios.
                </p>
              </div>
            ) : qrCode ? (
              <div className="flex flex-col items-center justify-center space-y-4 my-4">
                <div className="bg-white p-4 rounded-xl border-2 border-dark-border shadow-md">
                  <img src={qrCode} alt="WhatsApp QR Code" className="w-64 h-64" style={{ imageRendering: 'pixelated' }} />
                </div>
                <p className="text-center text-xs text-dark-muted px-2">
                  Abre WhatsApp en tu teléfono, ve a **Dispositivos Vinculados** y escanea este código.
                </p>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center p-8 border border-dashed border-dark-border rounded-xl space-y-3 my-6 text-center">
                <RefreshCw className="w-8 h-8 text-dark-muted animate-spin" />
                <h4 className="text-xs font-semibold text-dark-muted">Cargando estado del puente...</h4>
                <p className="text-[11px] text-dark-muted/65">
                  Esperando comunicación con {evolutionUrl.includes('render.com') ? 'Render (Nube)' : new URL(evolutionUrl).host} en Evolution API.
                </p>
              </div>
            )}

            {/* Real-time stats */}
            {status && (
              <div className="bg-dark-bg/60 border border-dark-border p-3.5 rounded-lg space-y-2 text-xs">
                <div className="flex justify-between items-center text-dark-muted border-b border-dark-border/40 pb-1.5">
                  <span>Mensajes hoy (Éxito):</span>
                  <span className="font-semibold text-emerald-400 font-mono">{status.sentToday}</span>
                </div>
                <div className="flex justify-between items-center text-dark-muted border-b border-dark-border/40 pb-1.5">
                  <span>Mensajes hoy (Errores):</span>
                  <span className="font-semibold text-brand-red font-mono">{status.failedToday}</span>
                </div>
                <div className="flex justify-between items-center text-dark-muted border-b border-dark-border/40 pb-1.5">
                  <span>Último envío con éxito:</span>
                  <span className="font-semibold text-dark-text font-mono">
                    {status.lastSendSuccessAt 
                      ? new Date(status.lastSendSuccessAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) 
                      : 'Ninguno'
                    }
                  </span>
                </div>
                
                {status.lastSendErrorAt && (
                  <div className="pt-1.5 text-brand-red text-[11px] leading-tight">
                    <span className="font-bold flex items-center gap-1">
                      <ShieldAlert className="w-3.5 h-3.5" />
                      Fallo de envío ({new Date(status.lastSendErrorAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}):
                    </span>
                    <p className="italic mt-0.5 truncate max-w-[240px]" title={status.lastSendErrorMsg}>
                      {status.lastSendErrorMsg || 'Error desconocido.'}
                    </p>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Action buttons */}
          <div className="space-y-2 border-t border-dark-border pt-4">
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={handleReconnect}
                disabled={actionLoading}
                className="flex items-center justify-center gap-1.5 py-2 bg-zinc-800 hover:bg-zinc-700 text-dark-text rounded-lg text-xs font-semibold border border-dark-border transition disabled:opacity-50"
              >
                {actionLoading ? <Loader2 className="w-3 h-3 animate-spin" /> : <RefreshCw className="w-3.5 h-3.5" />}
                Verificar Conexión
              </button>

              <button
                type="button"
                onClick={handleResetQR}
                disabled={actionLoading}
                className="flex items-center justify-center gap-1.5 py-2 bg-brand-red/10 border border-brand-red/20 hover:bg-brand-red hover:text-white text-brand-red rounded-lg text-xs font-semibold transition disabled:opacity-50"
              >
                {actionLoading ? <Loader2 className="w-3 h-3 animate-spin" /> : <Power className="w-3.5 h-3.5" />}
                Nuevo QR / Reset
              </button>
            </div>
            
            <div className="text-center text-[10px] text-dark-muted/80 uppercase tracking-wider font-bold pt-1.5">
              Instancia activa: <span className="text-indigo-400 font-mono">dreamteam</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
