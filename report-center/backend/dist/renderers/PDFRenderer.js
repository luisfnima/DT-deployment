"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PDFRenderer = void 0;
class PDFRenderer {
    render(data) {
        // For now we simulate PDF file binary generation or storage path.
        return `[Mock PDF Buffer for: ${data.reportName}]`;
    }
}
exports.PDFRenderer = PDFRenderer;
