import { CRMService } from '../services/crm/CRMService';

export interface IReportModule {
  run(crmService: CRMService): Promise<any>;
}
