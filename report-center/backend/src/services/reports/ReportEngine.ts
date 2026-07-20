import { Report } from '../../types/Report';
import { ReportRepository } from '../../repositories/ReportRepository';
import { CRMService } from '../crm/CRMService';
import { HTMLRenderer } from '../../renderers/HTMLRenderer';
import { EvolutionService } from '../whatsapp/EvolutionService';
import { IReportModule } from '../../interfaces/IReportModule';
import { PDTInstalarReport } from './PDTInstalarReport';
import { SeguimientoBOReport } from './SeguimientoBOReport';
import { InstaladasHoyReport } from './InstaladasHoyReport';
import { CanceladasHoyReport } from './CanceladasHoyReport';
import { ProcesoHoyReport } from './ProcesoHoyReport';
import { ImageRenderer } from '../../renderers/ImageRenderer';
import { env } from '../../config/env';

export class ReportEngine {
  private crmService: CRMService;
  private htmlRenderer: HTMLRenderer;
  private evolutionService: EvolutionService;
  
  // Registry of report modules
  private modules: Record<string, IReportModule> = {};

  constructor() {
    this.crmService = new CRMService();
    this.htmlRenderer = new HTMLRenderer();
    this.evolutionService = new EvolutionService();
    
    // Register current modules
    this.registerModule('1', new PDTInstalarReport());
    this.registerModule('2', new SeguimientoBOReport());
    this.registerModule('3', new InstaladasHoyReport());
    this.registerModule('4', new CanceladasHoyReport());
    this.registerModule('5', new ProcesoHoyReport());
  }

  public registerModule(reportId: string, module: IReportModule) {
    this.modules[reportId] = module;
  }

  /**
   * Generates just the HTML preview of a report.
   */
  public async generatePreview(reportId: string): Promise<string> {
    const report = ReportRepository.getReportById(reportId);
    if (!report) {
      throw new Error(`Reporte ID ${reportId} no encontrado.`);
    }
    const module = this.modules[report.id];
    if (!module) {
      throw new Error(`No hay un módulo de reporte registrado para el ID: ${report.id}`);
    }
    const reportData = await module.run(this.crmService);
    return this.htmlRenderer.render(reportData);
  }

  /**
   * Executes the report and sends it to all configured recipients.
   */
  public async executeReport(
    reportId: string, 
    executionType: 'automatic' | 'manual' | 'test' = 'automatic'
  ): Promise<boolean> {
    const report = ReportRepository.getReportById(reportId);
    if (!report) {
      ReportRepository.addLog('System', `Reporte ID ${reportId} no encontrado.`, 'error');
      return false;
    }

    const startTime = Date.now();
    const isTest = executionType === 'test';
    const tagLabel = isTest ? '[PRUEBA]' : '';
    ReportRepository.addLog('Scheduler', `${tagLabel} 🟢 Iniciando ejecución de reporte: "${report.name}" (${executionType})`, 'info', report.id);

    try {
      // 1. Get module
      const module = this.modules[report.id];
      if (!module) {
        throw new Error(`No hay un módulo de reporte registrado para el ID: ${report.id} ("${report.name}")`);
      }

      // 2. Fetch and process CRM data
      ReportRepository.addLog('CRM', `${tagLabel} 🟡 Consultando y procesando datos en módulo "${report.name}"...`, 'info', report.id);
      const reportData = await module.run(this.crmService);

      // 3. Render HTML
      ReportRepository.addLog('Renderer', `${tagLabel} 🔵 Generando reporte en formato HTML...`, 'info', report.id);
      const content = this.htmlRenderer.render(reportData);
      
      // 4. Render to Image PNG via Playwright
      ReportRepository.addLog('Renderer', `${tagLabel} 📸 Convirtiendo HTML a imagen PNG usando Playwright...`, 'info', report.id);
      const imageRenderer = new ImageRenderer();
      const imageBuffer = await imageRenderer.renderHtmlToPng(content);

      // 5. Get recipients associated to this report
      const allRecipients = ReportRepository.getRecipients();
      const reportRecipients = allRecipients
        .filter(rec => report.recipientIds.includes(rec.id) && rec.status === 'active')
        .sort((a, b) => a.priority - b.priority); // Sort by priority (1 is highest)

      if (reportRecipients.length === 0) {
        throw new Error(`El reporte "${report.name}" no tiene destinatarios activos asociados.`);
      }

      // 6. Send to each active recipient
      let sendCount = 0;
      let recipientListString = '';

      for (const recipient of reportRecipients) {
        // Horary window checks (skip for tests or manual clicks)
        if (executionType === 'automatic' && recipient.allowedWindow) {
          const now = new Date();
          const hourStr = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;
          const { start, end } = recipient.allowedWindow;
          if (hourStr < start || hourStr > end) {
            ReportRepository.addLog('Sender', `⚠️ Envío omitido para "${recipient.name}": Hora actual (${hourStr}) fuera del rango permitido (${start} - ${end})`, 'warning', report.id);
            continue;
          }
        }

        ReportRepository.addLog('Sender', `${tagLabel} 🟣 Despachando a "${recipient.name}" via ${recipient.channel.toUpperCase()} (${recipient.value})...`, 'info', report.id);
        
        try {
          if (recipient.channel === 'whatsapp' || recipient.channel === 'whatsapp_group') {
            const captionText = `📊 *${report.name}* ${isTest ? '(Prueba)' : ''}\n📅 Fecha: ${new Date().toLocaleDateString('es-PE')}\n📱 Enviado desde DreamTeam Report Center.`;
            await this.evolutionService.sendMessage(recipient.value, {
              text: captionText,
              html: content,
              imageBuffer,
              fileName: `${report.name.replace(/\s+/g, '_')}.png`
            });

            // Update lastDeliveryAt timestamp on recipient
            ReportRepository.updateRecipient(recipient.id, { lastDeliveryAt: new Date().toISOString() });
            sendCount++;
            recipientListString += `${recipient.name} (${recipient.value}), `;
          } else {
            ReportRepository.addLog('Sender', `⚠️ Canal "${recipient.channel}" preparado pero no implementado en este MVP.`, 'info', report.id);
          }
        } catch (sendErr: any) {
          ReportRepository.addLog('Sender', `❌ Fallo al enviar a "${recipient.name}": ${sendErr.message}`, 'error', report.id);
        }
      }

      if (sendCount === 0) {
        throw new Error('No se pudo enviar el reporte a ningún destinatario debido a errores de envío o ventanas horarias.');
      }

      // Clean list string
      recipientListString = recipientListString.replace(/, $/, '');

      // 7. Complete
      const durationMs = Date.now() - startTime;
      ReportRepository.addLog('Scheduler', `✅ Finalizado: Reporte "${report.name}" enviado con éxito a ${sendCount} destinatarios en ${durationMs}ms.`, 'success', report.id);

      // Record counts
      let recordsCount = 0;
      if (reportData.isGrouped && reportData.porSupervisor) {
        recordsCount = Object.values(reportData.porSupervisor).reduce((acc: number, vs: any) => acc + vs.length, 0);
      } else if (reportData.isSeguimientoBO && reportData.porSupervisor) {
        recordsCount = Object.values(reportData.porSupervisor).reduce((acc: number, val: any) => acc + val.totalVentas, 0);
      } else if (reportData.rows) {
        recordsCount = reportData.rows.length;
      }

      // Report sizes
      const reportSizeKb = Math.round((Buffer.byteLength(content, 'utf8') + imageBuffer.length) / 1024);

      // Save history record
      ReportRepository.addHistoryRecord({
        reportId: report.id,
        reportName: report.name,
        status: 'success',
        durationMs,
        channel: `WhatsApp (Evolution API)`,
        recipient: recipientListString,
        recordsCount,
        reportSizeKb,
        executionType
      }, content);

      // Update lastExecutedAt
      if (!isTest) {
        ReportRepository.updateReport(report.id, {
          lastExecutedAt: new Date().toISOString()
        });
      }

      return true;
    } catch (error: any) {
      const durationMs = Date.now() - startTime;
      const errorMsg = error.message || 'Error desconocido';
      ReportRepository.addLog('System', `❌ Error ejecutando reporte "${report.name}": ${errorMsg}`, 'error', report.id);
      
      ReportRepository.addHistoryRecord({
        reportId: report.id,
        reportName: report.name,
        status: 'failed',
        durationMs,
        errorMessage: errorMsg,
        channel: 'WhatsApp (Evolution API)',
        recipient: 'Ninguno',
        recordsCount: 0,
        reportSizeKb: 0,
        executionType
      });

      // Track last error inside config
      const status = ReportRepository.getStatus();
      ReportRepository.updateStatus({
        ...status,
        failedToday: status.failedToday + 1,
        lastSendErrorAt: new Date().toISOString(),
        lastSendErrorMsg: errorMsg
      });

      return false;
    }
  }
}
