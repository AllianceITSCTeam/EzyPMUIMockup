import { chromium } from "playwright";
import path from "path";

const BASE_URL = "http://192.168.0.14:3001";
const OUTPUT_DIR = path.join(process.cwd(), "..", "docs", "images", "screenshots");

async function capture() {
  console.log("[Playwright] Launching browser for recapture...");
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({
    viewport: { width: 1440, height: 900 },
    deviceScaleFactor: 2,
  });
  
  // Clear persistent state just in case
  const page = await context.newPage();
  
  console.log("Navigating to Projects List...");
  await page.goto(`${BASE_URL}/projects`, { waitUntil: "networkidle" });
  
  // Click on the first project to ensure we hit a valid ID
  // Wait for the grid to render
  await page.waitForTimeout(1000);
  
  console.log("Clicking the first project card...");
  // Use a generic selector for the project card list link
  await page.locator('a[href^="/projects/"]').first().click();
  
  await page.waitForTimeout(1500); // let animations finish & tab render
  
  const filePath = path.join(OUTPUT_DIR, "04_project_detail.png");
  await page.screenshot({ path: filePath, fullPage: true });
  
  // ALSO capture Stakeholders Tab specifically so they can see our new work
  await page.getByText("Stakeholders", { exact: true }).first().click();
  await page.waitForTimeout(800);
  await page.screenshot({ path: path.join(OUTPUT_DIR, "04_2_project_stakeholders.png"), fullPage: true });

  console.log("Captured 04_project_detail.png and 04_2_project_stakeholders.png");
  await browser.close();
}

capture().catch(e => {
  console.error(e);
  process.exit(1);
});
