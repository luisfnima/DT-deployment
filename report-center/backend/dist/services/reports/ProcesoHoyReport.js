"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProcesoHoyReport = void 0;
const helpers_1 = require("./helpers");
class ProcesoHoyReport {
    async run(crmService) {
        const rawSales = await crmService.fetchData('Proceso Hoy');
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
        const filtered = rawSales.filter((v) => {
            if ((v.status || '').toUpperCase() !== 'EN PROCESO')
                return false;
            const fSale = v.sale_date ? v.sale_date.substring(0, 10) : '';
            const fUpdate = v.updated_at ? v.updated_at.substring(0, 10) : '';
            return fSale === hoy || fUpdate === hoy;
        });
        const sorted = filtered.sort((a, b) => {
            const da = a.sale_date || a.updated_at || '';
            const db = b.sale_date || b.updated_at || '';
            return new Date(da).getTime() - new Date(db).getTime();
        });
        const porSupervisor = (0, helpers_1.agruparPor)(sorted, (v) => v.supervisor || 'Sin supervisor');
        return {
            reportName: 'Proceso Hoy',
            subTitle: 'Telefonía Izaguirre',
            timestamp: new Date().toISOString(),
            isGrouped: true,
            metrics: {
                'Total En Proceso': sorted.length,
                'Supervisores': Object.keys(porSupervisor).length
            },
            porSupervisor
        };
    }
}
exports.ProcesoHoyReport = ProcesoHoyReport;
