import React, { useEffect, useState } from 'react';
import { Terminal, Filter } from 'lucide-react';

interface Log {
  id: string;
  timestamp: string;
  level: 'info' | 'warning' | 'error' | 'success';
  source: 'Scheduler' | 'CRM' | 'Renderer' | 'Sender' | 'System';
  message: string;
}

type LogFilter = 'all' | 'error' | 'warning' | 'info' | 'success';

export const Logs: React.FC = () => {
  const [logs, setLogs] = useState<Log[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState<LogFilter>('all');

  const fetchLogs = async () => {
    try {
      const res = await fetch('/api/status/logs');
      const data = await res.json();
      setLogs(data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLogs();
    const interval = setInterval(fetchLogs, 4000);
    return () => clearInterval(interval);
  }, []);

  const filteredLogs = logs.filter(log => {
    if (activeFilter === 'all') return true;
    return log.level === activeFilter;
  });

  const getLevelStyle = (level: string) => {
    switch (level) {
      case 'error':
        return 'text-brand-red font-semibold bg-brand-red/10 border-brand-red/20';
      case 'warning':
        return 'text-amber-500 font-semibold bg-amber-500/10 border-amber-500/20';
      case 'success':
        return 'text-emerald-400 font-semibold bg-emerald-500/10 border-emerald-500/20';
      case 'info':
      default:
        return 'text-sky-400 bg-sky-500/10 border-sky-500/20';
    }
  };

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-dark-text">Registro de Logs</h2>
          <p className="text-sm text-dark-muted">Consola del sistema para depuración y monitoreo de procesos internos.</p>
        </div>
        <button
          onClick={fetchLogs}
          className="px-3.5 py-1.5 bg-dark-card border border-dark-border text-xs text-dark-text rounded-lg font-semibold hover:bg-zinc-800 transition"
        >
          Refrescar logs
        </button>
      </div>

      {/* Filter Pills */}
      <div className="flex flex-wrap gap-2 items-center bg-dark-card/50 border border-dark-border p-2 rounded-xl">
        <span className="text-xs text-dark-muted flex items-center gap-1.5 px-3">
          <Filter className="w-3.5 h-3.5" />
          Filtros:
        </span>
        
        {(['all', 'error', 'warning', 'info', 'success'] as LogFilter[]).map((filter) => (
          <button
            key={filter}
            onClick={() => setActiveFilter(filter)}
            className={`px-3 py-1 rounded-lg text-xs font-semibold uppercase tracking-wider transition ${
              activeFilter === filter
                ? 'bg-brand-red text-white shadow-sm'
                : 'text-dark-muted hover:text-dark-text hover:bg-zinc-800'
            }`}
          >
            {filter === 'all' ? 'Todo' : filter === 'error' ? 'Errores' : filter === 'warning' ? 'Advertencias' : filter === 'info' ? 'Información' : 'Exitosos'}
          </button>
        ))}
      </div>

      {/* Terminal View */}
      <div className="bg-dark-card border border-dark-border rounded-xl shadow-2xl overflow-hidden flex flex-col h-[550px]">
        {/* Terminal Header */}
        <div className="bg-[#121214] border-b border-dark-border px-5 py-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Terminal className="w-4 h-4 text-dark-muted" />
            <span className="font-mono text-xs text-dark-muted">dreamteam-reportengine.log</span>
          </div>
          <div className="flex gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-brand-red opacity-60"></span>
            <span className="w-2.5 h-2.5 rounded-full bg-amber-500 opacity-60"></span>
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 opacity-60"></span>
          </div>
        </div>

        {/* Terminal logs list */}
        <div className="flex-1 overflow-y-auto p-5 font-mono text-xs bg-[#0b0b0c] space-y-3.5 scrollbar-thin">
          {loading ? (
            <div className="flex items-center justify-center h-full">
              <div className="w-8 h-8 border-4 border-brand-red border-t-transparent rounded-full animate-spin"></div>
            </div>
          ) : filteredLogs.length === 0 ? (
            <div className="text-dark-muted/40 italic text-center pt-24">
              [No se encontraron logs con el filtro seleccionado]
            </div>
          ) : (
            filteredLogs.map((log) => (
              <div key={log.id} className="flex items-start gap-4 border-b border-zinc-900/30 pb-2 hover:bg-zinc-900/10 transition">
                <span className="text-dark-muted/50 select-none">
                  [{new Date(log.timestamp).toLocaleString([], { timeStyle: 'medium', dateStyle: 'short' })}]
                </span>
                
                <span className={`px-2 py-0.5 rounded text-[10px] uppercase font-bold tracking-wider border ${getLevelStyle(log.level)}`}>
                  {log.level}
                </span>

                <span className="text-dark-text font-bold text-[11px] uppercase tracking-wider min-w-[70px]">
                  {log.source}:
                </span>

                <span className="text-zinc-300 leading-relaxed break-all">
                  {log.message}
                </span>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};
