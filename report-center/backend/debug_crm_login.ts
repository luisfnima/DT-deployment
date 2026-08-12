import { chromium } from 'playwright';
import * as fs from 'fs';
import * as path from 'path';

async function debugLogin() {
  console.log('🔍 Diagnosticando login en http://31.97.165.147/login...');
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({ viewport: { width: 1280, height: 800 } });
  const page = await context.newPage();

  const outputDir = 'C:/Users/KND/.gemini/antigravity/brain/a277d813-2f25-4702-85ab-21b75512ce20';

  try {
    await page.goto('http://31.97.165.147/login', { waitUntil: 'networkidle' });
    console.log('Página cargada. URL actual:', page.url());

    // Take screenshot of initial login page
    await page.screenshot({ path: path.join(outputDir, 'debug_1_initial.png'), fullPage: true });

    // Inspect inputs on page
    const inputs = await page.$$eval('input', els => els.map(e => ({ type: e.type, name: e.name, id: e.id, placeholder: e.placeholder })));
    console.log('Inputs encontrados:', JSON.stringify(inputs));

    const buttons = await page.$$eval('button', els => els.map(e => ({ text: e.innerText, type: e.type, id: e.id, class: e.className })));
    console.log('Botones encontrados:', JSON.stringify(buttons));

    // Fill credentials
    const userSel = 'input[type="text"], input[type="email"], input[name="username"], input[name="email"], input[name="user"]';
    const passSel = 'input[type="password"]';
    
    await page.fill(userSel, 'utest@dreamteam.pe');
    await page.fill(passSel, 'pollipavo');
    console.log('Campos llenados. Tomando captura con datos...');
    await page.screenshot({ path: path.join(outputDir, 'debug_2_filled.png'), fullPage: true });

    // Click submit
    const submitSel = 'button[type="submit"], input[type="submit"], button';
    console.log('Haciendo clic en botón de login...');
    await Promise.all([
      page.waitForNavigation({ waitUntil: 'networkidle', timeout: 10000 }).catch(e => console.log('Timeout navegación:', e.message)),
      page.click(submitSel)
    ]);

    await page.waitForTimeout(3000);
    console.log('URL posterior al clic:', page.url());

    // Take post click screenshot
    await page.screenshot({ path: path.join(outputDir, 'debug_3_post_click.png'), fullPage: true });

    // Get any visible error text on page
    const bodyText = await page.innerText('body');
    console.log('Texto visible en body (primeros 500 caracteres):', bodyText.substring(0, 500));

  } catch (err: any) {
    console.error('Error en diagnóstico:', err.message);
  } finally {
    await browser.close();
  }
}

debugLogin();
