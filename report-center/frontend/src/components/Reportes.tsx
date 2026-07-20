import React, { useEffect, useState } from 'react';
import { FileSpreadsheet, Layers, Smartphone, AlertCircle } from 'lucide-react';

interface Report {
  id: string;
  name: string;
  description: string;
  status: 'active' | 'inactive';
  time: string;
  frequency: string;
  channel: string;
}

export const Reportes: React.FC = () => {
  const [reports, setReports] = useState<Report[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchReports = async () => {
    try {
      const res = await fetch('/api/reports');
      const data = await res.json();
      setReports(data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReports();
  }, []);

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold tracking-tight text-dark-text">Catálogo de Reportes</h2>
        <p className="text-sm text-dark-muted">Administra los módulos del ReportEngine y visualiza las estructuras de datos.</p>
      </div>

      {loading ? (
        <div className="flex items-center justify-center p-12">
          <div className="w-8 h-8 border-4 border-brand-red border-t-transparent rounded-full animate-spin"></div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {reports.map((report) => (
            <div 
              key={report.id} 
              className="bg-dark-card border border-dark-border rounded-xl p-6 flex flex-col justify-between hover:border-zinc-700 transition duration-300"
            >
              <div>
                {/* Header Icon & ID */}
                <div className="flex justify-between items-start mb-4">
                  <div className="p-2.5 bg-brand-red/10 border border-brand-red/20 text-brand-red rounded-lg">
                    <FileSpreadsheet className="w-5 h-5" />
                  </div>
                  <span className="text-[10px] font-bold text-dark-muted uppercase font-mono">
                    ID: {report.id}
                  </span>
                </div>

                {/* Info */}
                <h3 className="text-base font-bold text-dark-text tracking-tight">{report.name}</h3>
                <p className="text-xs text-dark-muted mt-2 leading-relaxed h-12 line-clamp-3">
                  {report.description || 'Sin descripción detallada.'}
                </p>

                {/* Structure / Tags */}
                <div className="mt-5 space-y-3 pt-4 border-t border-dark-border">
                  <div className="flex justify-between text-xs">
                    <span className="text-dark-muted flex items-center gap-1.5">
                      <Layers className="w-3.5 h-3.5" />
                      Origen Datos:
                    </span>
                    <span className="text-dark-text font-medium">CRM API v2</span>
                  </div>
                  <div className="flex justify-between text-xs">
                    <span className="text-dark-muted flex items-center gap-1.5">
                      <Smartphone className="w-3.5 h-3.5" />
                      Envío Móvil:
                    </span>
                    <span className="text-dark-text font-medium capitalize">{report.channel} (Evolution)</span>
                  </div>
                </div>
              </div>

              {/* Footer Button / Preview */}
              <div className="mt-6 pt-4 border-t border-dark-border flex gap-3">
                <div className={`text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded ${
                  report.status === 'active' ? 'bg-emerald-500/10 text-emerald-400' : 'bg-dark-border text-dark-muted'
                }`}>
                  {report.status === 'active' ? 'Activo' : 'Inactivo'}
                </div>
                <div className="text-[10px] bg-brand-red/10 text-brand-red px-2 py-0.5 rounded font-mono uppercase">
                  {report.frequency}
                </div>
              </div>
            </div>
          ))}

          {/* New Custom Report Template Card */}
          <div className="bg-dark-card/30 border border-dashed border-dark-border rounded-xl p-6 flex flex-col items-center justify-center text-center">
            <AlertCircle className="w-8 h-8 text-dark-muted mb-2" />
            <h3 className="text-sm font-semibold text-dark-text">Crear Reporte Personalizado</h3>
            <p className="text-xs text-dark-muted mt-1 max-w-[200px]">
              ¿Necesitas conectar una nueva consulta al CRM? Crea una nueva plantilla en el ReportEngine.
            </p>
            <button 
              disabled
              className="mt-4 px-3 py-1.5 bg-dark-border text-dark-muted rounded-lg text-xs font-semibold cursor-not-allowed"
            >
              Próximamente
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
