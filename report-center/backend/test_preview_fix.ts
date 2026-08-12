import { ReportEngine } from './src/services/reports/ReportEngine';
import * as fs from 'fs';
import * as path from 'path';

async function testFinalEngine() {
  console.log('🤖 Probando ReportEngine.generatePreview("7") con la lógica corregida sin re-navegación...');
  const engine = new ReportEngine();

  const html = await engine.generatePreview('7');
  const outputDir = 'C:/Users/KND/.gemini/antigravity/brain/a277d813-2f25-4702-85ab-21b75512ce20';
  
  fs.writeFileSync(path.join(outputDir, 'official_preview_fixed.html'), html);
  console.log(`✅ HTML generado con éxito (${html.length} bytes). Guardado en official_preview_fixed.html`);

  // Also test direct takeScreenshots
  const report = require('./data/reports/7.json');
  const buffers = await (engine as any).takeScreenshots(report);
  if (buffers.length > 0) {
    const pngPath = path.join(outputDir, 'report_center_final_authenticated_proof.png');
    fs.writeFileSync(pngPath, buffers[0]);
    console.log(`📸 IMAGEN FINAL AUTENTICADA GUARDADA: ${pngPath} (${buffers[0].length} bytes)`);
  }
}

testFinalEngine().catch(console.error);
