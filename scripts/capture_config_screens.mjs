import { chromium } from 'playwright';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const IMAGES_DIR = path.join(__dirname, '..', '..', 'docs', 'images');

async function captureConfigScreens() {
  console.log('Starting Config capture script...');
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({ viewport: { width: 1440, height: 900 } });
  const page = await context.newPage();

  try {
    console.log('Navigating to Settings page...');
    await page.goto('http://192.168.0.14:3001/settings', { waitUntil: 'networkidle' });
    await page.waitForTimeout(1000); // Allow hydration/animation
    
    // 1. Stakeholders Tab
    console.log('Capturing Stakeholders Catalog...');
    await page.screenshot({ path: path.join(IMAGES_DIR, '07_system_config_stakeholders.png'), fullPage: true });

    // 2. Roles Tab
    console.log('Clicking Roles tab...');
    await page.getByRole('button', { name: /Stakeholder Roles/i }).click();
    await page.waitForTimeout(500);
    await page.screenshot({ path: path.join(IMAGES_DIR, '07_2_system_config_roles.png'), fullPage: true });

    // 3. Task Statuses Tab
    console.log('Clicking Task Statuses tab...');
    await page.getByRole('button', { name: /Task Statuses/i }).click();
    await page.waitForTimeout(500);
    await page.screenshot({ path: path.join(IMAGES_DIR, '07_3_system_config_task_statuses.png'), fullPage: true });

    // 4. Task Priorities Tab
    console.log('Clicking Task Priorities tab...');
    await page.getByRole('button', { name: /Task Priorities/i }).click();
    await page.waitForTimeout(500);
    await page.screenshot({ path: path.join(IMAGES_DIR, '07_4_system_config_task_priorities.png'), fullPage: true });

    console.log('All Config screenshots captured successfully!');
  } catch (error) {
    console.error('Error during capture:', error);
  } finally {
    await browser.close();
  }
}

captureConfigScreens();
