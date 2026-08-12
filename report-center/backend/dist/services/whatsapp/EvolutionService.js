"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EvolutionService = void 0;
const ReportRepository_1 = require("../../repositories/ReportRepository");
const env_1 = require("../../config/env");
class EvolutionService {
    async sendMessage(recipient, content) {
        // 1. Check simulated API status in Repository (stops flow if simulated offline)
        const status = ReportRepository_1.ReportRepository.getStatus();
        if (status.evolutionApi !== 'connected') {
            throw new Error('Evolution API no responde (Fallo de conexión o API caída).');
        }
        // 2. Clean phone number: remove '+' and spaces
        const cleanNumber = recipient.replace(/\+/g, '').replace(/\s+/g, '');
        // 3. Make HTTP request to Evolution API
        try {
            const isMedia = !!content.imageBuffer || !!content.excelBuffer;
            const endpoint = isMedia ? 'sendMedia' : 'sendText';
            const url = `${env_1.env.EVOLUTION_API_URL}/message/${endpoint}/dreamteam`;
            let body = {};
            if (isMedia) {
                if (content.excelBuffer) {
                    body = {
                        number: cleanNumber,
                        mediatype: 'document',
                        media: content.excelBuffer.toString('base64'),
                        fileName: content.fileName || 'report.xlsx',
                        caption: content.text || 'Reporte automático'
                    };
                }
                else if (content.imageBuffer) {
                    body = {
                        number: cleanNumber,
                        mediatype: 'image',
                        media: content.imageBuffer.toString('base64'),
                        fileName: content.fileName || 'report.png',
                        caption: content.text || 'Reporte automático'
                    };
                }
            }
            else {
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
                    'apikey': env_1.env.EVOLUTION_API_KEY
                },
                body: JSON.stringify(body)
            });
            if (!response.ok) {
                const errorText = await response.text();
                throw new Error(`HTTP Error ${response.status}: ${errorText}`);
            }
            return true;
        }
        catch (error) {
            throw new Error(`Fallo al enviar mensaje por Evolution API: ${error.message}`);
        }
    }
}
exports.EvolutionService = EvolutionService;
