import { chromium } from "playwright";
import fs from "fs/promises";
import path from "path";

const BASE_URL = "http://192.168.0.14:3001";
const OUTPUT_DIR = path.join(process.cwd(), "..", "docs", "images", "screenshots");

async function capture() {
  console.log("[Playwright] Launching browser for Sub-screens...");
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({
    viewport: { width: 1440, height: 900 },
    deviceScaleFactor: 2,
  });
  const page = await context.newPage();

  const takeScreenshot = async (filename, locator = null) => {
    await page.waitForTimeout(800);
    const filePath = path.join(OUTPUT_DIR, filename);
    if (locator) {
      await locator.screenshot({ path: filePath });
    } else {
      await page.screenshot({ path: filePath, fullPage: true });
    }
    console.log(`[Capture] Saved ${filename}`);
  };

  const missed = [];

  // 1. Account Menu Dropdown
  try {
    await page.goto(`${BASE_URL}/`, { waitUntil: "networkidle" });
    await page.locator('header button').last().click({ timeout: 5000 });
    await takeScreenshot("01_2_account_menu.png");
  } catch (e) { console.error("Missed 01_2_account_menu:", e.message); missed.push("Account Menu"); }

  // 2. Create Project Modal
  try {
    await page.goto(`${BASE_URL}/projects`, { waitUntil: "networkidle" });
    await page.getByRole('button', { name: /New Project/i }).first().click({ timeout: 5000 });
    await takeScreenshot("03_2_create_project_modal.png");
  } catch (e) { console.error("Missed 03_2_create_project_modal:", e.message); missed.push("Create Project Modal"); }

  // 3. Add Resource Modal
  try {
    await page.goto(`${BASE_URL}/projects/p4`, { waitUntil: "networkidle" });
    await page.getByText("Resources", { exact: true }).first().click({ timeout: 5000 });
    await page.getByRole('button', { name: /Add Resource/i }).first().click({ timeout: 5000 });
    await takeScreenshot("03_5_add_resource_modal.png");
  } catch (e) { console.error("Missed 03_5_add_resource_modal:", e.message); missed.push("Add Resource Modal"); }

  // 3.5 Add Stakeholder Modal
  try {
    await page.goto(`${BASE_URL}/projects/p4`, { waitUntil: "networkidle" });
    await page.getByText("Stakeholders", { exact: true }).first().click({ timeout: 5000 });
    await page.getByRole('button', { name: /Add Stakeholder/i }).first().click({ timeout: 5000 });
    await takeScreenshot("03_6_add_stakeholder_modal.png");
    await page.keyboard.press('Escape');
  } catch (e) { console.error("Missed 03_6_add_stakeholder:", e.message); missed.push("Add Stakeholder Modal"); }

  // 4. Create Task Modal
  try {
    await page.goto(`${BASE_URL}/tasks`, { waitUntil: "networkidle" });
    await page.getByRole('button', { name: /New Task|Add Task/i }).first().click({ timeout: 5000 });
    await takeScreenshot("03_8_create_task_modal.png");
  } catch (e) { console.error("Missed 03_8_create_task_modal:", e.message); missed.push("Create Task Modal"); }

  // 5. Log Hours Modal
  try {
    await page.goto(`${BASE_URL}/tasks/t1`, { waitUntil: "networkidle" });
    await page.getByRole('button', { name: /Log Hours/i }).first().click({ timeout: 5000 });
    await takeScreenshot("03_10_log_hours_modal.png");
  } catch (e) { console.error("Missed 03_10_log_hours_modal:", e.message); missed.push("Log Hours Modal"); }

  // 6. Comments Section
  try {
    await page.goto(`${BASE_URL}/tasks/t1`, { waitUntil: "networkidle" });
    await page.keyboard.press('Escape'); // close Log Hours if open
    await page.waitForTimeout(300);
    // Let's just screenshot the whole task detail bottom part
    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
    await takeScreenshot("03_11_comments_section.png");
  } catch (e) { console.error("Missed 03_11_comments_section:", e.message); missed.push("Comments Section"); }

  // 7. Global Search Modal
  try {
    await page.goto(`${BASE_URL}/`, { waitUntil: "networkidle" });
    await page.locator('header input[placeholder="Search..."]').fill("Design");
    await takeScreenshot("01_1_global_search.png");
  } catch (e) { console.error("Missed 01_1_global_search:", e.message); missed.push("Global Search"); }

  console.log("\n[Playwright] Finished sub-screens. Missed:", missed.length === 0 ? "None!" : missed.join(", "));
  await browser.close();
}

capture();
