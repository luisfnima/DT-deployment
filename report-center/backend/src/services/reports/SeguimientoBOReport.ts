import { IReportModule } from '../../interfaces/IReportModule';
import { CRMService } from '../crm/CRMService';
import { agruparPor } from './helpers';

export class SeguimientoBOReport implements IReportModule {
  public async run(crmService: CRMService): Promise<any> {
    // 1. Fetch raw data from CRM API (which queries the live CRM)
    const rawSales = await crmService.fetchData('Seguimiento BO');

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

    // 3. Filter sales of the day (sale_date starts with hoy)
    const ventasDia = rawSales.filter((s: any) => s.sale_date && s.sale_date.substring(0, 10) === hoy);

    if (ventasDia.length === 0) {
      throw new Error(`Sin ventas hoy (${hoy}) para reporte BO.`);
    }

    // 4. Group by supervisor using helper
    const porSupervisorRaw = agruparPor(ventasDia, (v: any) => v.supervisor || 'Sin supervisor');

    // 5. Calculate global metrics
    let contraOK = 0;
    let contraPendiente = 0;
    let contraSinSeguimiento = 0;

    let fideOK = 0;
    let fidePendiente = 0;
    let fideSinSeguimiento = 0;

    const clasificarEstado = (val: string): 'OK' | 'pendiente' | 'sin_seguimiento' => {
      if (!val || val === 'Sin seguimiento') return 'sin_seguimiento';
      const upper = val.toUpperCase();
      if (upper.includes('PENDIENTE')) return 'pendiente';
      return 'OK';
    };

    ventasDia.forEach((v: any) => {
      // Contraoferta classification
      const cCat = clasificarEstado(v.contraoferta_estado);
      if (cCat === 'OK') contraOK++;
      else if (cCat === 'pendiente') contraPendiente++;
      else contraSinSeguimiento++;

      // Fidelizacion classification
      const fCat = clasificarEstado(v.fidelizacion_estado);
      if (fCat === 'OK') fideOK++;
      else if (fCat === 'pendiente') fidePendiente++;
      else fideSinSeguimiento++;
    });

    // 6. Map grouped data with specific metrics per supervisor
    const porSupervisor: Record<string, any> = {};
    Object.entries(porSupervisorRaw).forEach(([supervisor, vs]: [string, any]) => {
      const totContra = vs.filter((v: any) => v.contraoferta_estado !== 'Sin seguimiento').length;
      const totFide = vs.filter((v: any) => v.fidelizacion_estado !== 'Sin seguimiento').length;

      porSupervisor[supervisor] = {
        totalVentas: vs.length,
        totContra,
        totFide,
        registros: vs
      };
    });

    return {
      reportName: 'Seguimiento BO',
      subTitle: 'Telefonía Izaguirre',
      timestamp: new Date().toISOString(),
      isSeguimientoBO: true,
      metrics: {
        'Ventas del Día': ventasDia.length,
        'Contraofertas OK': contraOK,
        'Contraofertas Pend.': contraPendiente,
        'Contraofertas Sin Seg.': contraSinSeguimiento,
        'Fidelizaciones OK': fideOK,
        'Fidelizaciones Pend.': fidePendiente,
        'Fidelizaciones Sin Seg.': fideSinSeguimiento
      },
      porSupervisor
    };
  }
}
