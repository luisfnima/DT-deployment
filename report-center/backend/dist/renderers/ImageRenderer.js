"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ImageRenderer = void 0;
const playwright_1 = require("playwright");
class ImageRenderer {
    /**
     * Renders the HTML report template into a high-quality PNG image buffer using Playwright.
     */
    async renderHtmlToPng(htmlContent) {
        const browser = await playwright_1.chromium.launch({
            headless: true,
            args: ['--no-sandbox', '--disable-setuid-sandbox']
        });
        try {
            const page = await browser.newPage();
            // Load Google Fonts (Inter) in the page if needed, but since it's already set in font-family, 
            // Playwright will render standard system sans-serif fallbacks or web fonts.
            await page.setContent(htmlContent, { waitUntil: 'domcontentloaded' });
            // Wait for any animations/images to load
            await page.waitForTimeout(500);
            // Set viewport width. Using 950px ensures no horizontal scrolling on tables.
            await page.setViewportSize({ width: 950, height: 900 });
            // Locate the first div which represents the report wrapper card
            const wrapperLocator = page.locator('div').first();
            // Take a high-quality screenshot of the container card only
            const buffer = await wrapperLocator.screenshot({
                type: 'png',
                omitBackground: true
            });
            return buffer;
        }
        finally {
            await browser.close();
        }
    }
}
exports.ImageRenderer = ImageRenderer;
