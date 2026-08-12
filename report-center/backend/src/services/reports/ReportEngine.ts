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
import { VentasMesBOReport } from './VentasMesBOReport';
import { ScreenshotReport } from './ScreenshotReport';
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
    this.registerModule('6', new VentasMesBOReport());
    this.registerModule('7', new ScreenshotReport());
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

    if (report.isScreenshot || report.template === 'screenshot') {
      ReportRepository.addLog('Scheduler', `📸 Generando vista previa de capturas para "${report.name}"...`, 'info', report.id);
      let buffers: Buffer[] = [];
      try {
        buffers = await this.takeScreenshots(report);
      } catch (err: any) {
        console.error('Error taking screenshots for preview:', err);
      }

      const targets = (report.screenshotTargets && report.screenshotTargets.length > 0)
        ? report.screenshotTargets
        : (report.targetUrls || []).map(url => ({
            url,
            loginUrl: report.loginUrl,
            username: report.username,
            password: report.password
          }));

      if (buffers.length === 0) {
        const targetsListHtml = targets.map((t, idx) => `
          <div style="background: rgba(255,255,255,0.03); border: 1px solid rgba(255,255,255,0.1); padding: 14px 18px; border-radius: 12px; margin-bottom: 12px;">
            <div style="font-weight: bold; color: #ff3b30; font-size: 13px;">📸 Captura #${idx + 1}: ${t.url}</div>
            ${t.loginUrl ? `<div style="font-size: 11px; color: #aaa; margin-top: 4px;">🔑 Autenticación en vivo: ${t.username || 'N/A'} @ ${t.loginUrl}</div>` : '<div style="font-size: 11px; color: #666; margin-top: 4px;">🔓 Navegación Directa (Sin Login)</div>'}
          </div>
        `).join('');

        return `
          <div style="padding: 24px; font-family: system-ui, -apple-system, sans-serif; background: #0f1117; color: #f8fafc; border-radius: 12px;">
            <h2 style="margin-top:0; margin-bottom: 8px; color: #38bdf8;">📷 ${report.name}</h2>
            <p style="color: #94a3b8; font-size: 13px; margin-bottom: 20px;">${report.description || 'Reporte de captura automatizada en vivo mediante CRM y Playwright.'}</p>
            <div style="font-weight: 600; font-size: 13px; margin-bottom: 12px; color: #cbd5e1;">URLs y Servidores Configurados (${targets.length}):</div>
            ${targetsListHtml}
            <div style="margin-top: 20px; font-size: 11px; color: #64748b; border-top: 1px solid #1e293b; padding-top: 12px; text-align: center;">
              ⚡ Nota: En el servidor Render en la nube, las capturas PNG completas se generan al ejecutarse la tarea programada y se despachan directamente por WhatsApp.
            </div>
          </div>
        `;
      }
      
      let html = `<div style="padding: 20px; font-family: sans-serif; background: #0f172a; color: #f8fafc; border-radius: 8px;">`;
      html += `<h2 style="margin-top:0; margin-bottom: 20px; border-bottom: 1px solid #334155; padding-bottom: 10px; color: #38bdf8;">Vista Previa de Capturas Web (${buffers.length})</h2>`;
      buffers.forEach((buf, idx) => {
        const base64 = buf.toString('base64');
        const url = report.targetUrls?.[idx] || 'URL no especificada';
        html += `<div style="margin-bottom: 30px;">`;
        html += `<div style="font-weight: 600; color: #38bdf8; margin-bottom: 8px;">Captura ${idx + 1} - Link: <a href="${url}" target="_blank" style="color: #60a5fa;">${url}</a></div>`;
        html += `<img src="data:image/png;base64,${base64}" style="width: 100%; border: 2px solid #334155; border-radius: 6px; box-shadow: 0 10px 15px -3px rgb(0 0 0 / 0.5);" />`;
        html += `</div>`;
      });
      html += `</div>`;
      return html;
    }

    const module = this.modules[report.id];
    if (!module) {
      const targets = (report.screenshotTargets && report.screenshotTargets.length > 0)
        ? report.screenshotTargets
        : (report.targetUrls || []).map(url => ({
            url,
            loginUrl: report.loginUrl,
            username: report.username,
            password: report.password
          }));

      const targetsListHtml = targets.map((t: any, idx: number) => `
        <div style="background: rgba(255,255,255,0.03); border: 1px solid rgba(255,255,255,0.1); padding: 14px 18px; border-radius: 12px; margin-bottom: 12px;">
          <div style="font-weight: bold; color: #ff3b30; font-size: 13px;">📸 Captura #${idx + 1}: ${t.url}</div>
          ${t.loginUrl ? `<div style="font-size: 11px; color: #aaa; margin-top: 4px;">🔑 Autenticación en vivo: ${t.username || 'N/A'} @ ${t.loginUrl}</div>` : '<div style="font-size: 11px; color: #666; margin-top: 4px;">🔓 Navegación Directa (Sin Login)</div>'}
        </div>
      `).join('');

      return `
        <div style="padding: 24px; font-family: system-ui, -apple-system, sans-serif; background: #0f1117; color: #f8fafc; border-radius: 12px;">
          <h2 style="margin-top:0; margin-bottom: 8px; color: #38bdf8;">📷 ${report.name}</h2>
          <p style="color: #94a3b8; font-size: 13px; margin-bottom: 20px;">${report.description || 'Reporte automatizado en vivo mediante CRM y Playwright.'}</p>
          <div style="font-weight: 600; font-size: 13px; margin-bottom: 12px; color: #cbd5e1;">URLs y Servidores Configurados (${targets.length}):</div>
          ${targetsListHtml.length > 0 ? targetsListHtml : '<div style="color: #64748b; font-size: 12px;">Sin URLs configuradas aún.</div>'}
          <div style="margin-top: 20px; font-size: 11px; color: #64748b; border-top: 1px solid #1e293b; padding-top: 12px; text-align: center;">
            ⚡ Nota: En el servidor Render en la nube, las capturas PNG completas se generan al ejecutarse la tarea programada y se despachan directamente por WhatsApp.
          </div>
        </div>
      `;
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
      let content = '';
      let imageBuffer: Buffer | undefined;
      let excelBuffer: Buffer | undefined;
      let screenshotBuffers: Buffer[] = [];
      let reportData: any = {};

      if (report.isScreenshot || report.template === 'screenshot') {
        ReportRepository.addLog('Scheduler', `${tagLabel} 📸 Tomando capturas de pantalla de las URLs configuradas con Playwright...`, 'info', report.id);
        screenshotBuffers = await this.takeScreenshots(report);
        if (screenshotBuffers.length === 0) {
          throw new Error('No se pudo capturar ninguna de las pantallas especificadas.');
        }
        content = `Reporte de capturas web "${report.name}" generado con éxito (${screenshotBuffers.length} imágenes).`;
      } else {
        // 1. Get module
        const module = this.modules[report.id];
        if (!module) {
          throw new Error(`No hay un módulo de reporte registrado para el ID: ${report.id} ("${report.name}")`);
        }

        // 2. Fetch and process CRM data
        ReportRepository.addLog('CRM', `${tagLabel} 🟡 Consultando y procesando datos en módulo "${report.name}"...`, 'info', report.id);
        reportData = await module.run(this.crmService);

        // 3. Render HTML
        ReportRepository.addLog('Renderer', `${tagLabel} 🔵 Generando reporte en formato HTML...`, 'info', report.id);
        content = this.htmlRenderer.render(reportData);
        
        // 4. Render to Attachment (Excel for report 6, PNG image for others)
        if (report.id === '6') {
        ReportRepository.addLog('Renderer', `${tagLabel} 📊 Generando archivo Excel (.xlsx) con exceljs...`, 'info', report.id);
        const ExcelJS = require('exceljs');
        const workbook = new ExcelJS.Workbook();
        const worksheet = workbook.addWorksheet('Ventas del Mes');
        
        // Setup gridlines
        worksheet.views = [{ showGridLines: true }];

        const primaryColor = 'FFB71C1C'; // Dark red matching DreamTeam corporate style

        // Header Title Block
        worksheet.mergeCells('A1:L1');
        const titleRow = worksheet.getRow(1);
        titleRow.height = 35;
        const titleCell = worksheet.getCell('A1');
        titleCell.value = 'Reporte Mensual de Ventas - Seguimiento BO';
        titleCell.font = { name: 'Arial', size: 16, bold: true, color: { argb: 'FFFFFFFF' } };
        titleCell.fill = {
          type: 'pattern',
          pattern: 'solid',
          fgColor: { argb: primaryColor }
        };
        titleCell.alignment = { vertical: 'middle', horizontal: 'center' };

        // Subtitle Block
        worksheet.mergeCells('A2:L2');
        const subtitleRow = worksheet.getRow(2);
        subtitleRow.height = 20;
        const subtitleCell = worksheet.getCell('A2');
        subtitleCell.value = `Telefonía Izaguirre | Generado el: ${new Date().toLocaleDateString('es-PE')} ${new Date().toLocaleTimeString('es-PE', { hour: '2-digit', minute: '2-digit' })}`;
        subtitleCell.font = { name: 'Arial', size: 10, italic: true, color: { argb: 'FFFFFFFF' } };
        subtitleCell.fill = {
          type: 'pattern',
          pattern: 'solid',
          fgColor: { argb: 'FF8E1C1C' }
        };
        subtitleCell.alignment = { vertical: 'middle', horizontal: 'center' };

        // Empty Row spacer
        worksheet.addRow([]);

        // Table Headers
        const headers = [
          'Gestion Contra', 'Gestion Fide', 'Asesor', 'Supervisor', 'Cliente', 'DNI/RUC', 
          'Estado Venta', 'Contraoferta Estado', 'BO Contraoferta', 
          'Fidelización Estado', 'BO Fidelización', 'Fecha Venta'
        ];
        
        worksheet.addRow(headers);
        const headerRow = worksheet.getRow(4);
        headerRow.height = 24;
        
        for (let i = 1; i <= 12; i++) {
          const cell = headerRow.getCell(i);
          cell.font = { name: 'Arial', size: 10, bold: true, color: { argb: 'FFFFFFFF' } };
          cell.fill = {
            type: 'pattern',
            pattern: 'solid',
            fgColor: { argb: 'FF27272A' } // Dark gray header row
          };
          cell.alignment = { vertical: 'middle', horizontal: 'center' };
          cell.border = {
            top: { style: 'thin', color: { argb: 'FFD4D4D8' } },
            bottom: { style: 'medium', color: { argb: 'FF000000' } },
            left: { style: 'thin', color: { argb: 'FFD4D4D8' } },
            right: { style: 'thin', color: { argb: 'FFD4D4D8' } }
          };
        }

        // Add Data Rows
        let rowIdx = 5;
        const supervisors = Object.keys(reportData.porSupervisor);
        supervisors.forEach(supName => {
          const supGroup = reportData.porSupervisor[supName];
          supGroup.registros.forEach((v: any) => {
            const rowValues = [
              v.fecha_contra || 'PTE',
              v.fecha_fide || 'PTE',
              v.agent || '-',
              v.supervisor || '-',
              v.cliente_nombre_del_cliente || '-',
              v.cliente_nro_de_documento || '-',
              v.status || '-',
              v.contraoferta_estado || 'Sin seguimiento',
              v.contraoferta_bo || '-',
              v.fidelizacion_estado || 'Sin seguimiento',
              v.fidelizacion_bo || '-',
              v.sale_date ? v.sale_date.substring(0, 10) : '-'
            ];
            
            const newRow = worksheet.addRow(rowValues);
            newRow.height = 20;

            const rowBg = rowIdx % 2 === 1 ? 'FFF9FAFB' : 'FFFFFFFF';
            
            for (let i = 1; i <= 12; i++) {
              const cell = newRow.getCell(i);
              cell.font = { name: 'Arial', size: 9 };
              cell.fill = {
                type: 'pattern',
                pattern: 'solid',
                fgColor: { argb: rowBg }
              };
              cell.border = {
                top: { style: 'thin', color: { argb: 'FFE4E4E7' } },
                bottom: { style: 'thin', color: { argb: 'FFE4E4E7' } },
                left: { style: 'thin', color: { argb: 'FFE4E4E7' } },
                right: { style: 'thin', color: { argb: 'FFE4E4E7' } }
              };

              if (i === 1 || i === 2 || i === 6 || i === 12) {
                cell.alignment = { vertical: 'middle', horizontal: 'center' };
              } else {
                cell.alignment = { vertical: 'middle', horizontal: 'left' };
              }

              // Format today's management date/time or PTE
              if (i === 1 || i === 2) {
                const val = String(cell.value);
                if (val === 'PTE') {
                  cell.font = { name: 'Arial', size: 9, italic: true, color: { argb: 'FF71717A' } };
                } else {
                  cell.font = { name: 'Arial', size: 9, bold: true, color: { argb: 'FF16A34A' } }; // Bold green for today's calls!
                }
              }

              // Stylize states (Green for OK, Amber for Pendiente, Muted Gray for Sin seguimiento)
              if (i === 8) {
                if (v.contraoferta_estado?.includes('OK')) {
                  cell.font = { name: 'Arial', size: 9, bold: true, color: { argb: 'FF16A34A' } };
                } else if (v.contraoferta_estado?.toUpperCase().includes('PENDIENTE')) {
                  cell.font = { name: 'Arial', size: 9, bold: true, color: { argb: 'FFD97706' } };
                } else if (!v.contraoferta_estado || v.contraoferta_estado === 'Sin seguimiento') {
                  cell.font = { name: 'Arial', size: 9, italic: true, color: { argb: 'FF71717A' } };
                }
              }
              
              if (i === 10) {
                if (v.fidelizacion_estado?.includes('OK')) {
                  cell.font = { name: 'Arial', size: 9, bold: true, color: { argb: 'FF16A34A' } };
                } else if (v.fidelizacion_estado?.toUpperCase().includes('PENDIENTE')) {
                  cell.font = { name: 'Arial', size: 9, bold: true, color: { argb: 'FFD97706' } };
                } else if (!v.fidelizacion_estado || v.fidelizacion_estado === 'Sin seguimiento') {
                  cell.font = { name: 'Arial', size: 9, italic: true, color: { argb: 'FF71717A' } };
                }
              }

              if (i === 7) {
                cell.font = { name: 'Arial', size: 9, bold: true };
              }
            }

            rowIdx++;
          });
        });

        // Autofit widths
        worksheet.columns.forEach((column: any) => {
          let maxLen = 0;
          column.eachCell({ includeEmpty: false }, (cell: any) => {
            if (cell.address === 'A1' || cell.address === 'A2') return;
            const valStr = cell.value ? String(cell.value) : '';
            if (valStr.length > maxLen) maxLen = valStr.length;
          });
          column.width = Math.max(maxLen + 3, 12);
        });

        excelBuffer = await workbook.xlsx.writeBuffer() as Buffer;
      } else {
        ReportRepository.addLog('Renderer', `${tagLabel} 📸 Convirtiendo HTML a imagen PNG usando Playwright...`, 'info', report.id);
        const imageRenderer = new ImageRenderer();
        imageBuffer = await imageRenderer.renderHtmlToPng(content);
      }
    }

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
            if (report.isScreenshot && screenshotBuffers.length > 0) {
              for (let idx = 0; idx < screenshotBuffers.length; idx++) {
                const targetUrl = report.targetUrls?.[idx] || '';
                let domain = 'Página Web';
                try {
                  if (targetUrl) domain = new URL(targetUrl).hostname;
                } catch(e) {}

                const captionText = `📸 *${report.name}* (Captura ${idx + 1} de ${screenshotBuffers.length}) ${isTest ? '(Prueba)' : ''}\n🌐 Link: ${targetUrl || domain}\n📅 Fecha: ${new Date().toLocaleDateString('es-PE')}\n📱 DreamTeam Report Center.`;
                await this.evolutionService.sendMessage(recipient.value, {
                  text: captionText,
                  imageBuffer: screenshotBuffers[idx],
                  fileName: `${report.name.replace(/\s+/g, '_')}_${idx + 1}.png`
                });
              }
            } else {
              const captionText = `📊 *${report.name}* ${isTest ? '(Prueba)' : ''}\n📅 Fecha: ${new Date().toLocaleDateString('es-PE')}\n📱 Enviado desde DreamTeam Report Center.`;
              await this.evolutionService.sendMessage(recipient.value, {
                text: captionText,
                html: content,
                imageBuffer,
                excelBuffer,
                fileName: `${report.name.replace(/\s+/g, '_')}.${excelBuffer ? 'xlsx' : 'png'}`
              });
            }

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
      if (report.isScreenshot) {
        recordsCount = screenshotBuffers.length;
      } else if (reportData.isGrouped && reportData.porSupervisor) {
        recordsCount = (Object.values(reportData.porSupervisor) as any[]).reduce((acc: number, vs: any) => acc + (vs?.length || 0), 0);
      } else if (reportData.isSeguimientoBO && reportData.porSupervisor) {
        recordsCount = (Object.values(reportData.porSupervisor) as any[]).reduce((acc: number, val: any) => acc + (val?.totalVentas || 0), 0);
      } else if (reportData.rows) {
        recordsCount = reportData.rows.length;
      }

      // Report sizes
      const attachmentSize = excelBuffer ? excelBuffer.length : (imageBuffer ? imageBuffer.length : screenshotBuffers.reduce((a, b) => a + b.length, 0));
      const reportSizeKb = Math.round((Buffer.byteLength(content, 'utf8') + attachmentSize) / 1024);

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

  /**
   * Automates login and captures screenshots of configured target URLs using Playwright.
   */
  private async performLogin(page: any, loginUrl: string, username?: string, password?: string, uSel?: string, pSel?: string, sSel?: string, reportId?: string) {
    if (!loginUrl || loginUrl.trim() === '') return;
    ReportRepository.addLog('Scheduler', `🔑 Navegando a página de login: ${loginUrl}`, 'info', reportId);
    await page.goto(loginUrl, { waitUntil: 'domcontentloaded' }).catch(() => {});

    if (username && password) {
      const userSel = uSel && uSel.trim() ? uSel : 'input[type="email"], input[type="text"]';
      const passSel = pSel && pSel.trim() ? pSel : 'input[type="password"]';
      const submitSel = sSel && sSel.trim() ? sSel : 'button[type="submit"]';

      try {
        const userLoc = page.locator(userSel).first();
        const passLoc = page.locator(passSel).first();

        await userLoc.focus().catch(() => {});
        await userLoc.pressSequentially(username, { delay: 20 });

        await passLoc.focus().catch(() => {});
        await passLoc.pressSequentially(password, { delay: 20 });

        await page.click(submitSel);
        await page.waitForURL((u: any) => !u.href.includes('/login'), { timeout: 10000 }).catch(() => {});
        await page.waitForTimeout(3000);
      } catch (loginErr: any) {
        ReportRepository.addLog('Scheduler', `⚠️ Advertencia durante el login: ${loginErr.message}`, 'warning', reportId);
      }
    }
  }

  /**
   * Automates login and captures screenshots of configured target URLs using Playwright.
   */
  private async takeScreenshots(report: Report): Promise<Buffer[]> {
    const { chromium } = require('playwright');
    let browser: any = null;
    try {
      browser = await chromium.launch({
        headless: true,
        args: ['--no-sandbox', '--disable-setuid-sandbox']
      });

      const context = await browser.newContext({
        viewport: { width: 1280, height: 800 }
      });
      context.setDefaultTimeout(15000);

      const buffers: Buffer[] = [];

      // If screenshotTargets (Option B) is populated
      if (report.screenshotTargets && report.screenshotTargets.length > 0) {
        const validTargets = report.screenshotTargets.filter(t => t && t.url && t.url.trim().length > 0);

        for (let i = 0; i < validTargets.length; i++) {
          const target = validTargets[i];
          const url = target.url.trim();
          ReportRepository.addLog('Scheduler', `📸 Procesando captura ${i + 1}/${validTargets.length}: ${url}`, 'info', report.id);
          
          const page = await context.newPage();
          try {
            // Target-specific login OR shared report login
            const targetLoginUrl = target.loginUrl && target.loginUrl.trim() !== '' ? target.loginUrl : report.loginUrl;
            const targetUser = target.username && target.username.trim() !== '' ? target.username : report.username;
            const targetPass = target.password && target.password.trim() !== '' ? target.password : report.password;

            if (targetLoginUrl) {
              await this.performLogin(page, targetLoginUrl, targetUser, targetPass, target.usernameSelector || report.usernameSelector, target.passwordSelector || report.passwordSelector, target.submitSelector || report.submitSelector, report.id);
            }

            const currentUrl = page.url();
            const cleanTarget = url.replace(/\/$/, '');
            const cleanCurrent = currentUrl.replace(/\/$/, '');
            if (cleanCurrent !== cleanTarget && !cleanCurrent.endsWith(cleanTarget)) {
              await page.goto(url, { waitUntil: 'networkidle', timeout: 20000 }).catch(async () => {
                await page.goto(url, { waitUntil: 'domcontentloaded' });
              });
            }
            await page.waitForTimeout(3000);
            const buf = await page.screenshot({ fullPage: true });
            buffers.push(buf);
          } catch (capErr: any) {
            ReportRepository.addLog('Scheduler', `❌ Fallo al capturar la URL "${url}": ${capErr.message}`, 'error', report.id);
          } finally {
            await page.close().catch(() => {});
          }
        }
        return buffers;
      }

      // Legacy / Default single-login flow (targetUrls)
      const page = await context.newPage();
      if (report.loginUrl && report.loginUrl.trim() !== '') {
        await this.performLogin(page, report.loginUrl, report.username, report.password, report.usernameSelector, report.passwordSelector, report.submitSelector, report.id);
      }

      const urls = report.targetUrls || [];
      const cleanUrls = urls.filter(u => u && u.trim().length > 0).slice(0, 6);

      for (let i = 0; i < cleanUrls.length; i++) {
        const url = cleanUrls[i].trim();
        ReportRepository.addLog('Scheduler', `📸 Tomando captura ${i + 1}/${cleanUrls.length}: ${url}`, 'info', report.id);
        try {
          const currentUrl = page.url();
          const cleanTarget = url.replace(/\/$/, '');
          const cleanCurrent = currentUrl.replace(/\/$/, '');
          if (cleanCurrent !== cleanTarget && !cleanCurrent.endsWith(cleanTarget)) {
            await page.goto(url, { waitUntil: 'networkidle', timeout: 20000 }).catch(async () => {
              await page.goto(url, { waitUntil: 'domcontentloaded' });
            });
          }
          await page.waitForTimeout(3000);
          const buf = await page.screenshot({ fullPage: true });
          buffers.push(buf);
        } catch (capErr: any) {
          ReportRepository.addLog('Scheduler', `❌ Fallo al capturar la URL "${url}": ${capErr.message}`, 'error', report.id);
        }
      }

      return buffers;
    } catch (err: any) {
      ReportRepository.addLog('Scheduler', `❌ Error general en Playwright para capturas: ${err.message}`, 'error', report.id);
      return [];
    } finally {
      if (browser) {
        await browser.close().catch(() => {});
      }
    }
  }
}
