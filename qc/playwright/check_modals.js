const { chromium } = require('playwright');
const path = require('path');
const fs = require('fs');

(async () => {
    console.log("Launching Playwright to verify Modals and Dropdowns using data-testid...");
    const browser = await chromium.launch({ headless: true });
    const page = await browser.newPage();
    
    // Set a consistent viewport
    await page.setViewportSize({ width: 1280, height: 720 });
    
    const screenshotDir = path.join(__dirname, 'screenshots');
    if (!fs.existsSync(screenshotDir)) fs.mkdirSync(screenshotDir);

    const baseUrl = 'http://192.168.0.14:3000';
    
    //---------------------------------------------------------
    // 1. Check Tasks Page Modal
    //---------------------------------------------------------
    console.log(`Navigating to ${baseUrl}/tasks`);
    await page.goto(`${baseUrl}/tasks`);
    await page.waitForTimeout(500);
    
    // Open Create Task Modal
    const createTaskBtn = page.getByRole('button', { name: /create task/i }).first();
    if (await createTaskBtn.isVisible()) {
        await createTaskBtn.click();
        await page.waitForTimeout(500); // wait for modal animation
        
        await page.screenshot({ path: path.join(screenshotDir, '01_task_modal_opened.png') });
        console.log("Saved 01_task_modal_opened.png");

        // Click Project Select trigger
        const projectSelect = page.getByTestId('task-project-select-trigger');
        if (await projectSelect.isVisible()) {
            await projectSelect.click();
            await page.waitForTimeout(500); // wait for dropdown portal animation
            
            // Verify dropdown list rendered in portal
            const dropdownList = page.getByTestId('task-project-select-dropdown');
            if (await dropdownList.isVisible()) {
                await page.screenshot({ path: path.join(screenshotDir, '02_task_modal_dropdown_portal_opened.png') });
                console.log("Saved 02_task_modal_dropdown_portal_opened.png");
            } else {
                console.log("Project dropdown portal NOT visible!");
            }
        }
        
        await page.keyboard.press('Escape');
    }

    //---------------------------------------------------------
    // 2. Check Projects Page Modal
    //---------------------------------------------------------
    console.log(`Navigating to ${baseUrl}/projects`);
    await page.goto(`${baseUrl}/projects`);
    await page.waitForTimeout(500);
    
    const addProjectBtn = page.getByTestId('btn-open-create-project-modal');
    if (await addProjectBtn.isVisible()) {
        await addProjectBtn.click();
        await page.waitForTimeout(500);
        
        await page.screenshot({ path: path.join(screenshotDir, '03_project_modal_opened.png') });
        console.log("Saved 03_project_modal_opened.png");
        
        // Open Status Select
        const statusSelect = page.getByTestId('project-status-select-trigger');
        if (await statusSelect.isVisible()) {
            await statusSelect.click();
            await page.waitForTimeout(500);
            
            if (await page.getByTestId('project-status-select-dropdown').isVisible()) {
                await page.screenshot({ path: path.join(screenshotDir, '04_project_modal_dropdown_portal_opened.png') });
                console.log("Saved 04_project_modal_dropdown_portal_opened.png");
            }
            await page.keyboard.press('Escape');
        }
    }

    //---------------------------------------------------------
    // 3. Check Team Page Modal
    //---------------------------------------------------------
    console.log(`Navigating to ${baseUrl}/team`);
    await page.goto(`${baseUrl}/team`);
    await page.waitForTimeout(500);
    
    const addUserBtn = page.getByTestId('btn-open-create-user-modal');
    if (await addUserBtn.isVisible()) {
        await addUserBtn.click();
        await page.waitForTimeout(500);
        
        await page.screenshot({ path: path.join(screenshotDir, '05_team_modal_opened.png') });
        console.log("Saved 05_team_modal_opened.png");
        
        // Open Role Select
        const roleSelect = page.getByTestId('user-role-select-trigger');
        if (await roleSelect.isVisible()) {
            await roleSelect.click();
            await page.waitForTimeout(500);
            
            if (await page.getByTestId('user-role-select-dropdown').isVisible()) {
                await page.screenshot({ path: path.join(screenshotDir, '06_team_modal_dropdown_portal_opened.png') });
                console.log("Saved 06_team_modal_dropdown_portal_opened.png");
            }
        }
    }

    await browser.close();
    console.log("Verification checks complete using data-testid locators. See screenshots folder.");
})();
