import { chromium } from "playwright";
import fs from "fs/promises";
import path from "path";

const BASE_URL = "http://192.168.0.14:3000";
const OUTPUT_DIR = path.join(process.cwd(), "..", "docs", "images", "screenshots");

async function setup() {
  await fs.mkdir(OUTPUT_DIR, { recursive: true });
  console.log(`[Setup] Ensured output directory: ${OUTPUT_DIR}`);
}

async function capture() {
  await setup();
  console.log("[Playwright] Launching browser...");
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({
    viewport: { width: 1440, height: 900 },
    deviceScaleFactor: 2, // Retina resolution for crisp screenshots
  });
  const page = await context.newPage();

  const takeScreenshot = async (route, filename, fullPage = true, delay = 500) => {
    console.log(`[Capture] Navigating to ${route}...`);
    await page.goto(`${BASE_URL}${route}`, { waitUntil: "networkidle" });
    
    // Quick delay explicitly for animations/charts to settle
    await page.waitForTimeout(delay);
    
    const filePath = path.join(OUTPUT_DIR, filename);
    await page.screenshot({ path: filePath, fullPage });
    console.log(`[Capture] Saved screenshot to ${filename}`);
  };

  try {
    // 1. Dashboard
    await takeScreenshot("/", "02_dashboard.png");
    
    // 1.1 Header (We can crop the dashboard screenshot or locate the header)
    console.log(`[Capture] Capturing Header component separately...`);
    const headerElement = await page.locator("header").first();
    await headerElement.screenshot({ path: path.join(OUTPUT_DIR, "01_global_header.png") });
    console.log(`[Capture] Saved screenshot to 01_global_header.png`);

    // 2. Projects List
    await takeScreenshot("/projects", "03_projects_list.png");

    // 3. Project Detail
    await takeScreenshot("/projects/p1", "04_project_detail.png");

    // 4. Tasks List
    await takeScreenshot("/tasks", "05_task_list.png");

    // 5. Task Detail
    // Force a click to make sure any animations finish
    await takeScreenshot("/tasks/t1", "06_task_detail.png");

    // 6. Team List
    await takeScreenshot("/team", "07_team_list.png");

    // 7. Team Detail
    await takeScreenshot("/team/u1", "08_team_detail.png");

    // 8. Reports
    // Reports has charts that animate, give it 1500ms
    await takeScreenshot("/reports", "09_reports.png", true, 1500);

    // 9. Activities
    await takeScreenshot("/activities", "10_activities.png");

    console.log("[Playwright] Successfully captured all screenshots!");
  } catch (error) {
    console.error("[Error] Playwright capture failed:", error);
  } finally {
    await browser.close();
  }
}

capture();
