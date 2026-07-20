import { IRenderer } from '../interfaces/IRenderer';

export class PDFRenderer implements IRenderer {
  public render(data: any): string {
    // For now we simulate PDF file binary generation or storage path.
    return `[Mock PDF Buffer for: ${data.reportName}]`;
  }
}
