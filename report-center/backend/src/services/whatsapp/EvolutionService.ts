import { IMessageProvider, IMessageContent } from '../../interfaces/IMessageProvider';
import { ReportRepository } from '../../repositories/ReportRepository';
import { env } from '../../config/env';

export class EvolutionService implements IMessageProvider {
  public async sendMessage(recipient: string, content: IMessageContent): Promise<boolean> {
    // 1. Check simulated API status in Repository (stops flow if simulated offline)
    const status = ReportRepository.getStatus();
    if (status.evolutionApi !== 'connected') {
      throw new Error('Evolution API no responde (Fallo de conexión o API caída).');
    }

    // 2. Clean phone number: remove '+' and spaces
    const cleanNumber = recipient.replace(/\+/g, '').replace(/\s+/g, '');

    // 3. Make HTTP request to Evolution API
    try {
      const isMedia = !!content.imageBuffer;
      const endpoint = isMedia ? 'sendMedia' : 'sendText';
      const url = `${env.EVOLUTION_API_URL}/message/${endpoint}/dreamteam`;

      let body: any = {};
      if (isMedia && content.imageBuffer) {
        body = {
          number: cleanNumber,
          mediatype: 'image',
          media: content.imageBuffer.toString('base64'),
          fileName: content.fileName || 'report.png',
          caption: content.text || 'Reporte automático'
        };
      } else {
        body = {
          number: cleanNumber,
          textMessage: {
            text: content.text || 'Reporte automático'
          }
        };
      }

      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'apikey': env.EVOLUTION_API_KEY
        },
        body: JSON.stringify(body)
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`HTTP Error ${response.status}: ${errorText}`);
      }

      return true;
    } catch (error: any) {
      throw new Error(`Fallo al enviar mensaje por Evolution API: ${error.message}`);
    }
  }
}
