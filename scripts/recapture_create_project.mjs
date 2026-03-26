import { chromium } from "playwright";
import path from "path";

const BASE_URL = "http://192.168.0.14:3001";
const OUTPUT_DIR = path.join(process.cwd(), "..", "docs", "images", "screenshots");

async function capture() {
  console.log("[Playwright] Launching browser for Create Project Modal...");
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({
    viewport: { width: 1440, height: 900 },
    deviceScaleFactor: 2,
  });
  
  const page = await context.newPage();
  
  try {
    console.log("Navigating to Projects...");
    await page.goto(`${BASE_URL}/projects`, { waitUntil: "networkidle" });
    await page.waitForTimeout(1000);
    
    // Check if the button is Add Project or New Project
    console.log("Clicking Create Project button...");
    const btn = page.getByRole('button', { name: /Create Project/i }).first();
    await btn.click();
    
    await page.waitForTimeout(1000); // let modal animate in
    
    const filePath = path.join(OUTPUT_DIR, "03_2_create_project_modal.png");
    await page.screenshot({ path: filePath, fullPage: true });

    console.log("Captured 03_2_create_project_modal.png");
  } catch (e) {
    console.error("Failed to capture:", e.message);
  } finally {
    await browser.close();
  }
}

capture();
