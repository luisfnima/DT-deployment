import React, { useEffect, useState } from 'react';
import { CheckCircle2, XCircle, MessageSquare, Eye, X } from 'lucide-react';

interface HistoryRecord {
  id: string;
  reportId: string;
  reportName: string;
  executedAt: string;
  status: 'success' | 'failed';
  durationMs: number;
  errorMessage?: string;
  channel: string;
  recipient: string;
  recordsCount?: number;
  reportSizeKb?: number;
  executionType: 'automatic' | 'manual' | 'test';
}

export const Historial: React.FC = () => {
  const [history, setHistory] = useState<HistoryRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedPreviewId, setSelectedPreviewId] = useState<string | null>(null);

  const fetchHistory = async () => {
    try {
      const res = await fetch('/api/status/history');
      const data = await res.json();
      setHistory(data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHistory();
  }, []);

  const getExecutionTypeBadge = (type: HistoryRecord['executionType']) => {
    const styles: Record<HistoryRecord['executionType'], string> = {
      automatic: 'bg-zinc-800 text-zinc-400 border border-zinc-700',
      manual: 'bg-sky-500/10 text-sky-400 border border-sky-500/20',
      test: 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
    };
    const labels: Record<HistoryRecord['executionType'], string> = {
      automatic: '🤖 Automático',
      manual: '👤 Manual',
      test: '🧪 Prueba'
    };
    return (
      <span className={`inline-flex items-center px-2 py-0.5 rounded text-[11px] font-semibold ${styles[type] || styles.automatic}`}>
        {labels[type] || type}
      </span>
    );
  };

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold tracking-tight text-dark-text">Historial de Ejecuciones</h2>
        <p className="text-sm text-dark-muted">Registro auditado de todos los envíos y ejecuciones de reportes.</p>
      </div>

      {/* History Table */}
      <div className="bg-dark-card border border-dark-border rounded-xl overflow-hidden shadow-lg">
        {loading ? (
          <div className="flex items-center justify-center p-12">
            <div className="w-8 h-8 border-4 border-brand-red border-t-transparent rounded-full animate-spin"></div>
          </div>
        ) : history.length === 0 ? (
          <div className="p-12 text-center text-dark-muted">
            No se han registrado ejecuciones de reportes aún.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full border-collapse text-left min-w-[900px]">
              <thead>
                <tr className="border-b border-dark-border bg-dark-card/50 text-[10px] uppercase tracking-wider text-dark-muted font-bold">
                  <th className="px-6 py-4">Reporte</th>
                  <th className="px-6 py-4">Fecha/Hora</th>
                  <th className="px-6 py-4">Tipo</th>
                  <th className="px-6 py-4">Estado</th>
                  <th className="px-6 py-4">Latencia</th>
                  <th className="px-6 py-4">Registros</th>
                  <th className="px-6 py-4">Tamaño</th>
                  <th className="px-6 py-4">Canal</th>
                  <th className="px-6 py-4">Destinatario</th>
                  <th className="px-6 py-4">Detalle / Error</th>
                  <th className="px-6 py-4 text-right">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-dark-border text-sm">
                {history.map((record) => (
                  <tr key={record.id} className="hover:bg-dark-card/55 transition duration-150">
                    <td className="px-6 py-4 font-semibold text-dark-text">
                      {record.reportName}
                    </td>
                    <td className="px-6 py-4 text-dark-muted text-xs">
                      {new Date(record.executedAt).toLocaleString([], { dateStyle: 'medium', timeStyle: 'short' })}
                    </td>
                    <td className="px-6 py-4">
                      {getExecutionTypeBadge(record.executionType)}
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold ${
                        record.status === 'success' 
                          ? 'bg-emerald-500/10 text-emerald-400' 
                          : 'bg-brand-red/10 text-brand-red'
                      }`}>
                        {record.status === 'success' ? (
                          <>
                            <CheckCircle2 className="w-3.5 h-3.5" />
                            Éxito
                          </>
                        ) : (
                          <>
                            <XCircle className="w-3.5 h-3.5" />
                            Fallo
                          </>
                        )}
                      </span>
                    </td>
                    <td className="px-6 py-4 font-mono text-xs text-dark-text">
                      {record.durationMs}ms
                    </td>
                    <td className="px-6 py-4 font-mono text-xs text-emerald-400 font-semibold">
                      {record.recordsCount !== undefined ? `${record.recordsCount} reg.` : '-'}
                    </td>
                    <td className="px-6 py-4 font-mono text-xs text-dark-muted">
                      {record.reportSizeKb !== undefined ? `${record.reportSizeKb} KB` : '-'}
                    </td>
                    <td className="px-6 py-4 text-xs font-medium text-dark-muted">
                      <span className="flex items-center gap-1 text-[11px] bg-dark-bg border border-dark-border px-2 py-0.5 rounded">
                        <MessageSquare className="w-3 h-3 text-dark-muted" />
                        {record.channel}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-xs text-dark-text">
                      {record.recipient}
                    </td>
                    <td className="px-6 py-4 text-xs text-dark-muted max-w-[200px] truncate">
                      {record.errorMessage || <span className="text-dark-muted/40 italic">Ninguno</span>}
                    </td>
                    <td className="px-6 py-4 text-right">
                      {record.status === 'success' && (
                        <button
                          onClick={() => setSelectedPreviewId(record.id)}
                          className="inline-flex items-center gap-1 px-3 py-1.5 bg-zinc-800 hover:bg-zinc-700 text-dark-text border border-dark-border rounded-lg text-xs font-semibold transition"
                        >
                          <Eye className="w-3.5 h-3.5 text-brand-red" />
                          Ver Reporte
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Visualizer Modal */}
      {selectedPreviewId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Backdrop */}
          <div 
            onClick={() => setSelectedPreviewId(null)}
            className="fixed inset-0 bg-black/70 backdrop-blur-sm"
          />
          
          {/* Content Box */}
          <div className="bg-dark-card border border-dark-border w-full max-w-4xl h-[85vh] rounded-xl flex flex-col overflow-hidden shadow-2xl relative z-10">
            {/* Header */}
            <div className="bg-[#121214] border-b border-dark-border px-6 py-4 flex items-center justify-between">
              <div>
                <h3 className="text-sm font-bold text-dark-text tracking-wide">
                  Vista Previa del Reporte Enviado
                </h3>
                <p className="text-[10px] text-dark-muted uppercase font-mono mt-0.5">
                  ID Ejecución: {selectedPreviewId}
                </p>
              </div>
              <button
                onClick={() => setSelectedPreviewId(null)}
                className="p-1 border border-dark-border hover:bg-zinc-800 rounded-lg text-dark-muted hover:text-dark-text transition"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            
            {/* IFrame Viewport */}
            <div className="flex-1 bg-zinc-100 p-4 overflow-hidden">
              <iframe 
                src={`/api/status/history/${selectedPreviewId}/preview`}
                className="w-full h-full border-0 rounded-lg bg-white shadow-inner"
                title="Preview"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
