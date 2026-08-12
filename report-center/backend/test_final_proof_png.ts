import { ReportEngine } from './src/services/reports/ReportEngine';
import * as fs from 'fs';
import * as path from 'path';

async function testFinalProof() {
  console.log('🤖 Probando el motor oficial con escritura secuencial de React...');
  const engine = new ReportEngine();

  const report = require('./data/reports/7.json');
  const buffers = await (engine as any).takeScreenshots(report);
  const outputDir = 'C:/Users/KND/.gemini/antigravity/brain/a277d813-2f25-4702-85ab-21b75512ce20';

  if (buffers.length > 0) {
    const pngPath = path.join(outputDir, 'report_center_final_authenticated_proof.png');
    fs.writeFileSync(pngPath, buffers[0]);
    console.log(`📸 IMAGEN FINAL DEL PANEL CRM GUARDADA: ${pngPath} (${buffers[0].length} bytes)`);
  } else {
    console.error('❌ No se generaron búferes.');
  }
}

testFinalProof().catch(console.error);
