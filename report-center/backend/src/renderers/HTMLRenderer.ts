import { IRenderer } from '../interfaces/IRenderer';
import { themeConfig } from '../config/theme';
import { soloDia, soloHora } from '../services/reports/helpers';

export class HTMLRenderer implements IRenderer {
  private renderEstiloGestion(valor: string): string {
    if (!valor || valor === 'Sin seguimiento') {
      return `<span style="color: #d97706; background-color: #fef3c7; border: 1px solid #fde68a; padding: 2px 6px; border-radius: 4px; font-weight: 600; font-size: 11px; white-space: nowrap;">⚠️ Sin seguimiento</span>`;
    }
    const upper = valor.toUpperCase();
    if (upper.includes('CANCELADO') || upper.includes('BAJA') || upper.includes('RECHAZADO')) {
      return `<span style="color: #dc2626; background-color: #fee2e2; border: 1px solid #fecaca; padding: 2px 6px; border-radius: 4px; font-weight: 700; font-size: 11px; white-space: nowrap;">❌ ${valor}</span>`;
    }
    return `<span style="color: #16a34a; background-color: #dcfce7; border: 1px solid #bbf7d0; padding: 2px 6px; border-radius: 4px; font-weight: 700; font-size: 11px; white-space: nowrap;">✅ ${valor}</span>`;
  }

  public render(data: any): string {
    const { reportName, subTitle, timestamp, metrics, isGrouped, porSupervisor, isSeguimientoBO, rows } = data;
    
    const formattedDate = new Date(timestamp).toLocaleString('es-PE', {
      timeZone: 'America/Lima',
      dateStyle: 'medium',
      timeStyle: 'short'
    });

    let html = `
      <div style="font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 900px; margin: 0 auto; padding: 24px; background-color: #ffffff; border: 1px solid #e4e4e7; border-radius: 16px; color: #18181b; box-shadow: 0 4px 6px -1px rgba(0,0,0,0.05);">
        
        <!-- Header Banner -->
        <div style="background: linear-gradient(135deg, ${themeConfig.colors.primary} 0%, #b71c1c 100%); padding: 24px; border-radius: 12px; margin-bottom: 24px; color: #ffffff;">
          <div style="display: flex; justify-content: space-between; align-items: center;">
            <div>
              <h2 style="margin: 0; font-size: 22px; font-weight: 800; tracking-tight: -0.025em;">DreamTeam Report Center</h2>
              <p style="margin: 4px 0 0 0; font-size: 13px; opacity: 0.9; font-weight: 500;">${reportName} ${subTitle ? `· ${subTitle}` : ''}</p>
            </div>
            <div style="text-align: right;">
              <span style="font-size: 11px; font-weight: 600; text-transform: uppercase; background-color: rgba(255,255,255,0.2); padding: 4px 8px; border-radius: 4px; letter-spacing: 0.05em;">
                LIVE REPORT
              </span>
              <p style="margin: 6px 0 0 0; font-size: 11px; opacity: 0.85;">${formattedDate}</p>
            </div>
          </div>
        </div>
    `;

    if (isSeguimientoBO && metrics) {
      // 3-Row Grid for Seguimiento BO KPIs
      html += `
        <!-- Metrics Dashboard -->
        <div style="margin-bottom: 28px; border: 1px solid #e4e4e7; border-radius: 12px; overflow: hidden; font-size: 12px;">
          <div style="background-color: #fafafa; border-bottom: 1px solid #e4e4e7; padding: 14px 20px; display: flex; align-items: center; justify-content: space-between;">
            <span style="font-weight: 800; font-size: 14px; color: #09090b;">📊 CUADRO RESUMEN BO</span>
            <span style="background-color: #f4f4f5; border: 1px solid #e4e4e7; color: #27272a; font-weight: 700; font-size: 13px; padding: 4px 10px; border-radius: 6px;">
              Ventas Totales: ${metrics['Ventas del Día']}
            </span>
          </div>
          <div style="display: flex; background-color: #ffffff;">
            <!-- Column 1: Contraofertas -->
            <div style="flex: 1; padding: 16px; border-right: 1px solid #e4e4e7;">
              <div style="font-weight: 800; text-transform: uppercase; letter-spacing: 0.05em; color: #b62525; font-size: 11px; margin-bottom: 10px;">
                🔄 Ratios Contraofertas
              </div>
              <div style="display: flex; gap: 8px;">
                <div style="flex: 1; background-color: #f0fdf4; border: 1px solid #bbf7d0; padding: 8px; border-radius: 8px; text-align: center;">
                  <div style="color: #16a34a; font-size: 16px; font-weight: 800;">${metrics['Contraofertas OK']}</div>
                  <div style="color: #15803d; font-size: 10px; font-weight: 600;">GESTIONADO OK</div>
                </div>
                <div style="flex: 1; background-color: #fef3c7; border: 1px solid #fde68a; padding: 8px; border-radius: 8px; text-align: center;">
                  <div style="color: #d97706; font-size: 16px; font-weight: 800;">${metrics['Contraofertas Pend.']}</div>
                  <div style="color: #b45309; font-size: 10px; font-weight: 600;">PENDIENTES</div>
                </div>
                <div style="flex: 1; background-color: #fafafa; border: 1px solid #e4e4e7; padding: 8px; border-radius: 8px; text-align: center;">
                  <div style="color: #71717a; font-size: 16px; font-weight: 800;">${metrics['Contraofertas Sin Seg.']}</div>
                  <div style="color: #52525b; font-size: 10px; font-weight: 600;">SIN SEGUIM.</div>
                </div>
              </div>
            </div>
            
            <!-- Column 2: Fidelizaciones -->
            <div style="flex: 1; padding: 16px;">
              <div style="font-weight: 800; text-transform: uppercase; letter-spacing: 0.05em; color: #b62525; font-size: 11px; margin-bottom: 10px;">
                🛡️ Ratios Fidelizaciones
              </div>
              <div style="display: flex; gap: 8px;">
                <div style="flex: 1; background-color: #f0fdf4; border: 1px solid #bbf7d0; padding: 8px; border-radius: 8px; text-align: center;">
                  <div style="color: #16a34a; font-size: 16px; font-weight: 800;">${metrics['Fidelizaciones OK']}</div>
                  <div style="color: #15803d; font-size: 10px; font-weight: 600;">GESTIONADO OK</div>
                </div>
                <div style="flex: 1; background-color: #fef3c7; border: 1px solid #fde68a; padding: 8px; border-radius: 8px; text-align: center;">
                  <div style="color: #d97706; font-size: 16px; font-weight: 800;">${metrics['Fidelizaciones Pend.']}</div>
                  <div style="color: #b45309; font-size: 10px; font-weight: 600;">PENDIENTES</div>
                </div>
                <div style="flex: 1; background-color: #fafafa; border: 1px solid #e4e4e7; padding: 8px; border-radius: 8px; text-align: center;">
                  <div style="color: #71717a; font-size: 16px; font-weight: 800;">${metrics['Fidelizaciones Sin Seg.']}</div>
                  <div style="color: #52525b; font-size: 10px; font-weight: 600;">SIN SEGUIM.</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      `;
    } else if (metrics) {
      // Metrics Row standard
      html += `
        <div style="display: flex; gap: 16px; margin-bottom: 28px;">
      `;
      for (const [key, val] of Object.entries(metrics)) {
        html += `
          <div style="flex: 1; background-color: #fafafa; padding: 16px; border-radius: 10px; border: 1px solid #f4f4f5; text-align: left;">
            <div style="color: #71717a; font-size: 11px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.05em;">${key}</div>
            <div style="color: #09090b; font-size: 24px; font-weight: 800; margin-top: 6px;">${val}</div>
          </div>
        `;
      }
      html += `</div>`;
    }

    // Render Grouped Supervisor Tables
    if (isSeguimientoBO && porSupervisor) {
      Object.entries(porSupervisor).forEach(([supervisor, data]: [string, any]) => {
        html += `
          <div style="margin-bottom: 30px; border: 1px solid #e4e4e7; border-radius: 10px; overflow: hidden;">
            <!-- Supervisor Badge Header -->
            <div style="background-color: #f4f4f5; border-bottom: 1px solid #e4e4e7; padding: 12px 16px; display: flex; justify-content: space-between; align-items: center;">
              <span style="font-weight: 700; font-size: 13px; color: #18181b;">👤 ${supervisor} — ${data.totalVentas} ventas</span>
              <span style="background-color: #f4f4f5; border: 1px solid #d4d4d8; color: #52525b; font-size: 11px; font-weight: 700; padding: 4px 10px; border-radius: 6px;">
                Contraoferta: ${data.totContra}/${data.totalVentas} · Fidelización: ${data.totFide}/${data.totalVentas}
              </span>
            </div>
            
            <!-- Table Scroll Wrapper -->
            <div style="overflow-x: auto; -webkit-overflow-scrolling: touch; width: 100%;">
              <table style="width: 100%; min-width: 850px; border-collapse: collapse; text-align: left; font-size: 11px;">
                <thead>
                  <tr style="background-color: #27272a; color: #ffffff;">
                    <th style="padding: 10px 12px; font-weight: 600; text-transform: uppercase; font-size: 10px; letter-spacing: 0.05em; width: 8%;">Hora</th>
                    <th style="padding: 10px 12px; font-weight: 600; text-transform: uppercase; font-size: 10px; letter-spacing: 0.05em; width: 12%;">Asesor</th>
                    <th style="padding: 10px 12px; font-weight: 600; text-transform: uppercase; font-size: 10px; letter-spacing: 0.05em; width: 18%;">Cliente</th>
                    <th style="padding: 10px 12px; font-weight: 600; text-transform: uppercase; font-size: 10px; letter-spacing: 0.05em; width: 10%;">DNI/RUC</th>
                    <th style="padding: 10px 12px; font-weight: 600; text-transform: uppercase; font-size: 10px; letter-spacing: 0.05em; width: 10%;">Estado</th>
                    <th style="padding: 10px 12px; font-weight: 600; text-transform: uppercase; font-size: 10px; letter-spacing: 0.05em; width: 14%;">Contraoferta</th>
                    <th style="padding: 10px 12px; font-weight: 600; text-transform: uppercase; font-size: 10px; letter-spacing: 0.05em; width: 10%;">BO Contra</th>
                    <th style="padding: 10px 12px; font-weight: 600; text-transform: uppercase; font-size: 10px; letter-spacing: 0.05em; width: 14%;">Fidelización</th>
                    <th style="padding: 10px 12px; font-weight: 600; text-transform: uppercase; font-size: 10px; letter-spacing: 0.05em; width: 10%;">BO Fidel</th>
                  </tr>
                </thead>
                <tbody style="color: #27272a;">
          `;
  
          data.registros.forEach((v: any, index: number) => {
            const rowBg = index % 2 === 1 ? '#fafafa' : '#ffffff';
            html += `
              <tr style="background-color: ${rowBg}; border-bottom: 1px solid #f4f4f5;">
                <td style="padding: 10px 12px; font-family: monospace; font-weight: 600;">${v.sale_date ? soloHora(v.sale_date) : '-'}</td>
                <td style="padding: 10px 12px; font-weight: 600; color: #09090b;">${v.agent || '-'}</td>
                <td style="padding: 10px 12px; max-width: 140px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;">${v.cliente_nombre_del_cliente || '-'}</td>
                <td style="padding: 10px 12px; font-family: monospace;">${v.cliente_nro_de_documento || '-'}</td>
                <td style="padding: 10px 12px;">
                  <span style="background-color: #f4f4f5; color: #3f3f46; border: 1px solid #e4e4e7; padding: 2px 6px; border-radius: 4px; font-weight: 600; font-size: 10px;">
                    ${v.status || '-'}
                  </span>
                </td>
                <td style="padding: 10px 12px;">${this.renderEstiloGestion(v.contraoferta_estado)}</td>
                <td style="padding: 10px 12px; color: #52525b;">${v.contraoferta_bo || '-'}</td>
                <td style="padding: 10px 12px;">${this.renderEstiloGestion(v.fidelizacion_estado)}</td>
                <td style="padding: 10px 12px; color: #52525b;">${v.fidelizacion_bo || '-'}</td>
              </tr>
            `;
          });
  
          html += `
                </tbody>
              </table>
            </div>
          </div>
        `;
      });
    } else if (isGrouped && porSupervisor) {
      Object.entries(porSupervisor).forEach(([supervisor, vs]: [string, any]) => {
        html += `
          <div style="margin-bottom: 30px; border: 1px solid #e4e4e7; border-radius: 10px; overflow: hidden;">
            <!-- Supervisor Badge Header -->
            <div style="background-color: #f4f4f5; border-bottom: 1px solid #e4e4e7; padding: 12px 16px; display: flex; justify-content: space-between; align-items: center;">
              <span style="font-weight: 700; font-size: 13px; color: #18181b;">👤 ${supervisor}</span>
              <span style="background-color: ${themeConfig.colors.primary}; color: #ffffff; font-size: 11px; font-weight: 700; padding: 2px 8px; border-radius: 9999px;">
                ${vs.length} ${vs.length === 1 ? 'registro' : 'registros'}
              </span>
            </div>
            
            <!-- Table -->
            <table style="width: 100%; border-collapse: collapse; text-align: left; font-size: 12px;">
              <thead>
                <tr style="background-color: #27272a; color: #ffffff;">
                  <th style="padding: 10px 14px; font-weight: 600; text-transform: uppercase; font-size: 10px; letter-spacing: 0.05em;">Cliente</th>
                  <th style="padding: 10px 14px; font-weight: 600; text-transform: uppercase; font-size: 10px; letter-spacing: 0.05em;">DNI/RUC</th>
                  <th style="padding: 10px 14px; font-weight: 600; text-transform: uppercase; font-size: 10px; letter-spacing: 0.05em;">Provincia</th>
                  <th style="padding: 10px 14px; font-weight: 600; text-transform: uppercase; font-size: 10px; letter-spacing: 0.05em;">Compañía</th>
                  <th style="padding: 10px 14px; font-weight: 600; text-transform: uppercase; font-size: 10px; letter-spacing: 0.05em;">Instalación</th>
                  <th style="padding: 10px 14px; font-weight: 600; text-transform: uppercase; font-size: 10px; letter-spacing: 0.05em;">Asesor</th>
                </tr>
              </thead>
              <tbody style="color: #27272a;">
        `;

        vs.forEach((v: any, index: number) => {
          const rowBg = index % 2 === 1 ? '#fafafa' : '#ffffff';
          html += `
            <tr style="background-color: ${rowBg}; border-bottom: 1px solid #f4f4f5;">
              <td style="padding: 10px 14px; font-weight: 600; color: #09090b;">${v.cliente_nombre_del_cliente || '-'}</td>
              <td style="padding: 10px 14px; font-family: monospace; color: #4b5563;">${v.cliente_nro_de_documento || '-'}</td>
              <td style="padding: 10px 14px;">${v.cliente_provincia || '-'}</td>
              <td style="padding: 10px 14px;">
                <span style="background-color: #eff6ff; color: #1e40af; border: 1px solid #dbeafe; padding: 2px 6px; border-radius: 4px; font-weight: 600; font-size: 11px;">
                  ${v.producto_compania || '-'}
                </span>
              </td>
              <td style="padding: 10px 14px; font-weight: 600; color: #b62525;">${v.cabecera_f_instalacion ? soloDia(v.cabecera_f_instalacion) : '-'}</td>
              <td style="padding: 10px 14px; color: #52525b;">${v.agent || '-'}</td>
            </tr>
          `;
        });

        html += `
              </tbody>
            </table>
          </div>
        `;
      });
    } else if (rows && rows.length > 0) {
      // Standard table fallback for ungrouped reports
      html += `
        <table style="width: 100%; border-collapse: collapse; text-align: left; font-size: 12px; border: 1px solid #e4e4e7; border-radius: 10px; overflow: hidden;">
          <thead>
            <tr style="background-color: #27272a; color: #ffffff;">
      `;
      
      const headers = Object.keys(rows[0]);
      headers.forEach(header => {
        html += `<th style="padding: 10px 14px; font-weight: 600; text-transform: uppercase; font-size: 10px; letter-spacing: 0.05em;">${header}</th>`;
      });
      
      html += `
            </tr>
          </thead>
          <tbody>
      `;

      rows.forEach((row: any, idx: number) => {
        const rowBg = idx % 2 === 1 ? '#fafafa' : '#ffffff';
        html += `<tr style="background-color: ${rowBg}; border-bottom: 1px solid #f4f4f5;">`;
        headers.forEach(header => {
          html += `<td style="padding: 10px 14px; color: #27272a;">${row[header]}</td>`;
        });
        html += `</tr>`;
      });

      html += `
          </tbody>
        </table>
      `;
    } else {
      html += `
        <div style="text-align: center; padding: 40px; color: #71717a; border: 1px dashed #e4e4e7; border-radius: 10px; font-size: 13px;">
          No hay registros disponibles para este reporte en el período seleccionado.
        </div>
      `;
    }

    html += `
        <div style="margin-top: 36px; text-align: center; font-size: 11px; color: #a1a1aa; border-top: 1px solid #f4f4f5; padding-top: 20px; font-weight: 500;">
          Generado automáticamente por DreamTeam Report Center.
        </div>
      </div>
    `;

    return html;
  }
}
