import { IReportModule } from '../../interfaces/IReportModule';
import { CRMService } from '../crm/CRMService';
import { agruparPor, soloDia } from './helpers';

export class VentasMesBOReport implements IReportModule {
  public async run(crmService: CRMService): Promise<any> {
    // 1. Fetch raw data from CRM API
    const rawSales = await crmService.fetchData('Seguimiento BO');

    // 2. Get current year, month, and today's date in America/Lima timezone
    const limaDateFormatter = new Intl.DateTimeFormat('en-US', {
      timeZone: 'America/Lima',
      year: 'numeric',
      month: '2-digit',
      day: '2-digit'
    });
    const todayParts = limaDateFormatter.formatToParts(new Date());
    const tYear = todayParts.find(p => p.type === 'year')?.value;
    const tMonth = todayParts.find(p => p.type === 'month')?.value;
    const tDay = todayParts.find(p => p.type === 'day')?.value;
    const todayLimaStr = `${tYear}-${tMonth}-${tDay}`; // e.g. "2026-07-17"
    const anioMes = `${tYear}-${tMonth}`; // e.g. "2026-07"

    // 3. Filter sales of the current month (sale_date starts with anioMes)
    const ventasMes = rawSales.filter((s: any) => s.sale_date && s.sale_date.substring(0, 7) === anioMes);

    if (ventasMes.length === 0) {
      throw new Error(`Sin ventas registradas en el mes actual (${anioMes}) para reporte BO.`);
    }

    // Helper to check if update happened on the same day as the sale in Lima timezone
    const checkIsSameLimaDay = (updatedAtStr: string, saleDateStr: string): { isSameDay: boolean, timeStr: string } => {
      if (!updatedAtStr || !saleDateStr) return { isSameDay: false, timeStr: '' };
      try {
        const d1 = new Date(updatedAtStr);
        const d2 = new Date(saleDateStr);
        
        const formatter = new Intl.DateTimeFormat('en-US', {
          timeZone: 'America/Lima',
          year: 'numeric',
          month: '2-digit',
          day: '2-digit'
        });
        
        const p1 = formatter.formatToParts(d1);
        const y1 = p1.find(p => p.type === 'year')?.value;
        const m1 = p1.find(p => p.type === 'month')?.value;
        const dd1 = p1.find(p => p.type === 'day')?.value;
        const limaDate1 = `${y1}-${m1}-${dd1}`;
        
        const p2 = formatter.formatToParts(d2);
        const y2 = p2.find(p => p.type === 'year')?.value;
        const m2 = p2.find(p => p.type === 'month')?.value;
        const dd2 = p2.find(p => p.type === 'day')?.value;
        const limaDate2 = `${y2}-${m2}-${dd2}`;
        
        const isSameDay = limaDate1 === limaDate2;
        
        const timeFormatter = new Intl.DateTimeFormat('en-US', {
          timeZone: 'America/Lima',
          hour: '2-digit',
          minute: '2-digit',
          hour12: false
        });
        const timeStr = timeFormatter.format(d1);
        
        return { isSameDay, timeStr };
      } catch (e) {
        return { isSameDay: false, timeStr: '' };
      }
    };

    // 4. Group by supervisor using helper
    const porSupervisorRaw = agruparPor(ventasMes, (v: any) => v.supervisor || 'Sin supervisor');

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
      if (upper.includes('OK') || upper.includes('RECUPERADO')) return 'OK';
      return 'pendiente';
    };

    ventasMes.forEach((v: any) => {
      // Calculate management dates for today
      const hasContra = v.contraoferta_estado && v.contraoferta_estado !== 'Sin seguimiento';
      const hasFide = v.fidelizacion_estado && v.fidelizacion_estado !== 'Sin seguimiento';
      
      const { isSameDay, timeStr } = checkIsSameLimaDay(v.updated_at, v.sale_date);
      
      if (isSameDay) {
        if (hasContra && hasFide) {
          // Both completed on the same day. updated_at is the last one (fidelización).
          v.fecha_contra = '✓'; // Completed earlier today
          v.fecha_fide = timeStr;
        } else if (hasContra) {
          v.fecha_contra = timeStr;
          v.fecha_fide = 'PTE';
          v.fidelizacion_estado = 'Sin seguimiento';
        } else if (hasFide) {
          v.fecha_contra = 'PTE';
          v.fecha_fide = timeStr;
          v.contraoferta_estado = 'Sin seguimiento';
        } else {
          v.fecha_contra = 'PTE';
          v.fecha_fide = 'PTE';
          v.contraoferta_estado = 'Sin seguimiento';
          v.fidelizacion_estado = 'Sin seguimiento';
        }
      } else {
        v.fecha_contra = 'PTE';
        v.fecha_fide = 'PTE';
        v.contraoferta_estado = 'Sin seguimiento';
        v.fidelizacion_estado = 'Sin seguimiento';
      }

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
      reportName: 'Ventas del Mes BO',
      subTitle: 'Telefonía Izaguirre',
      timestamp: new Date().toISOString(),
      isSeguimientoBO: true,
      isMonthlyReport: true,
      metrics: {
        'Ventas del Mes': ventasMes.length,
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
