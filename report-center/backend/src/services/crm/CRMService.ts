import { ICRMProvider } from '../../interfaces/ICRMProvider';
import { ReportRepository } from '../../repositories/ReportRepository';

export class CRMService implements ICRMProvider {
  public async fetchData(reportName: string): Promise<any> {
    // Check simulated API status
    const status = ReportRepository.getStatus();
    if (status.crmApi !== 'connected') {
      throw new Error('No se pudo establecer conexión con el CRM (API Caída).');
    }

    const crmReportNames = ['PDT Instalar', 'Seguimiento BO', 'Instaladas Hoy', 'Canceladas Hoy', 'Proceso Hoy'];
    if (crmReportNames.includes(reportName)) {
      try {
        const url = 'http://31.97.165.147/api/export/sales?company_id=1&campaign_id=4&limit=5000';
        const response = await fetch(url, {
          method: 'GET',
          headers: {
            'x-api-key': '8b4e1a3c26a98e4bc2fb88aebdd3109e5ad24b8ae3b3d0710f4663e07f1c6ba4',
            'Accept': 'application/json'
          }
        });
        
        if (!response.ok) {
          throw new Error(`HTTP Error ${response.status}: ${response.statusText}`);
        }
        
        const json: any = await response.json();
        return json.data || [];
      } catch (error: any) {
        throw new Error(`Fallo al consultar CRM API: ${error.message}`);
      }
    }

    // Simulate API delay for mock fallback
    await new Promise(resolve => setTimeout(resolve, 500));

    // Fallback data for other mock reports
    return {
      reportName,
      timestamp: new Date().toISOString(),
      metrics: {
        'Registros': '24',
        'Estado': 'Simulado'
      },
      rows: [
        { Canal: 'WhatsApp', Estado: 'Activo' },
        { Canal: 'Email', Estado: 'Desactivado' }
      ]
    };
  }
}
