import { IReportModule } from '../../interfaces/IReportModule';
import { CRMService } from '../crm/CRMService';
import { agruparPor } from './helpers';

export class PDTInstalarReport implements IReportModule {
  public async run(crmService: CRMService): Promise<any> {
    // 1. Fetch raw data from CRM API (which now does real HTTPS query)
    const rawSales = await crmService.fetchData('PDT Instalar');

    // 2. Get today's date in 'yyyy-MM-dd' format in America/Lima timezone
    const formatter = new Intl.DateTimeFormat('en-US', {
      timeZone: 'America/Lima',
      year: 'numeric',
      month: '2-digit',
      day: '2-digit'
    });
    const parts = formatter.formatToParts(new Date());
    const year = parts.find(p => p.type === 'year')?.value;
    const month = parts.find(p => p.type === 'month')?.value;
    const day = parts.find(p => p.type === 'day')?.value;
    const hoy = `${year}-${month}-${day}`;

    // 3. Apply exact Apps Script filters
    const filtered = rawSales.filter((v: any) => {
      // Rule 1: status equals 'PDT DE INSTALAR' (case insensitive)
      if ((v.status || '').toUpperCase() !== 'PDT DE INSTALAR') return false;
      
      // Rule 2: if has install date, it must be >= today
      if (!v.cabecera_f_instalacion) return true;
      return v.cabecera_f_instalacion.substring(0, 10) >= hoy;
    });

    // 4. Sort by install date
    const sorted = filtered.sort((a: any, b: any) => {
      const fa = a.cabecera_f_instalacion ? new Date(a.cabecera_f_instalacion).getTime() : 0;
      const fb = b.cabecera_f_instalacion ? new Date(b.cabecera_f_instalacion).getTime() : 0;
      return fa - fb;
    });

    // 5. Group by supervisor using helper
    const porSupervisor = agruparPor(sorted, (v: any) => v.supervisor || 'Sin supervisor');

    // 6. Calculate metrics
    const totalRegistros = sorted.length;
    const totalSupervisores = Object.keys(porSupervisor).length;

    // 7. Format clean structure for Renderer
    return {
      reportName: 'PDT de Instalar',
      subTitle: 'Telefonía Izaguirre',
      timestamp: new Date().toISOString(),
      isGrouped: true,
      metrics: {
        'Total Pendientes': totalRegistros,
        'Supervisores Activos': totalSupervisores
      },
      porSupervisor
    };
  }
}
