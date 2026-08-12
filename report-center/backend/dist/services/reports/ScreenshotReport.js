"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ScreenshotReport = void 0;
class ScreenshotReport {
    async run(crmService) {
        return {
            title: 'Reporte Captura CRM DreamTeam',
            date: new Date().toLocaleDateString('es-PE'),
            rows: []
        };
    }
}
exports.ScreenshotReport = ScreenshotReport;
