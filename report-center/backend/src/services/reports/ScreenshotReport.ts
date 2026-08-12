import { IReportModule } from '../../interfaces/IReportModule';
import { CRMService } from '../crm/CRMService';

export class ScreenshotReport implements IReportModule {
  public async run(crmService: CRMService): Promise<any> {
    return {
      title: 'Reporte Captura CRM DreamTeam',
      date: new Date().toLocaleDateString('es-PE'),
      rows: []
    };
  }
}
