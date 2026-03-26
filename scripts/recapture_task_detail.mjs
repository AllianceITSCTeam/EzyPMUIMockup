import { chromium } from "playwright";
import fs from "fs/promises";
import path from "path";

const BASE_URL = "http://192.168.0.14:3001";
const OUTPUT_DIR = path.join(process.cwd(), "..", "docs", "images", "screenshots");

async function capture() {
  await fs.mkdir(OUTPUT_DIR, { recursive: true });
  console.log("[Playwright] Launching browser...");
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({
    viewport: { width: 1440, height: 900 },
    deviceScaleFactor: 2, 
  });
  const page = await context.newPage();

  try {
    console.log(`[Capture] Navigating to /tasks/t1...`);
    await page.goto(`${BASE_URL}/tasks/t1`, { waitUntil: "networkidle" });
    
    // Quick delay explicitly for animations/charts to settle
    await page.waitForTimeout(1000);
    
    // Optional: Ensure the "Create Subtask" modal is closed, just to take a clean screenshot of the view.
    // It should be closed by default.

    const filePath = path.join(OUTPUT_DIR, "06_task_detail.png");
    await page.screenshot({ path: filePath, fullPage: true });
    console.log(`[Capture] Saved screenshot to 06_task_detail.png`);

  } catch (error) {
    console.error("[Error] Playwright capture failed:", error);
  } finally {
    await browser.close();
  }
}

capture();
