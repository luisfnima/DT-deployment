import { IReportModule } from '../../interfaces/IReportModule';
import { CRMService } from '../crm/CRMService';
import { agruparPor } from './helpers';

export class InstaladasHoyReport implements IReportModule {
  public async run(crmService: CRMService): Promise<any> {
    const rawSales = await crmService.fetchData('Instaladas Hoy');

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

    const filtered = rawSales.filter((v: any) => {
      if ((v.status || '').toUpperCase() !== 'INSTALADO') return false;
      const fUpdate = v.updated_at ? v.updated_at.substring(0, 10) : '';
      const fSale = v.sale_date ? v.sale_date.substring(0, 10) : '';
      return fUpdate === hoy || fSale === hoy;
    });

    const sorted = filtered.sort((a: any, b: any) => {
      const da = a.updated_at || a.sale_date || '';
      const db = b.updated_at || b.sale_date || '';
      return new Date(da).getTime() - new Date(db).getTime();
    });

    const porSupervisor = agruparPor(sorted, (v: any) => v.supervisor || 'Sin supervisor');

    return {
      reportName: 'Instaladas Hoy',
      subTitle: 'Telefonía Izaguirre',
      timestamp: new Date().toISOString(),
      isGrouped: true,
      metrics: {
        'Total Instaladas': sorted.length,
        'Supervisores': Object.keys(porSupervisor).length
      },
      porSupervisor
    };
  }
}
