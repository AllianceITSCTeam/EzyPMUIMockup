const { chromium } = require('playwright');
const path = require('path');
const fs = require('fs');

(async () => {
    console.log("Launching Playwright to verify Gantt Chart layout...");
    const browser = await chromium.launch({ headless: false }); // Set to false để xem
    const page = await browser.newPage();
    
    // Set viewport
    await page.setViewportSize({ width: 1920, height: 1080 });
    
    const screenshotDir = path.join(__dirname, 'screenshots');
    if (!fs.existsSync(screenshotDir)) fs.mkdirSync(screenshotDir);

    const baseUrl = 'http://192.168.0.5:3000';
    
    try {
        // Navigate to Project Detail - Gantt tab
        console.log(`\nNavigating to ${baseUrl}/projects/p8`);
        await page.goto(`${baseUrl}/projects/p8`);
        await page.waitForTimeout(2000); // Wait for page load
        
        // Take full page screenshot
        await page.screenshot({ path: path.join(screenshotDir, 'gantt_full.png'), fullPage: true });
        console.log("✓ Saved gantt_full.png");

        // Check if Gantt tab is active (click on Gantt/Tasks tab selector if needed)
        const ganttButton = page.getByRole('button').filter({ hasText: /gantt/i }).first();
        if (await ganttButton.isVisible()) {
            console.log("✓ Gantt tab button found");
            await ganttButton.click();
            await page.waitForTimeout(1000);
            await page.screenshot({ path: path.join(screenshotDir, 'gantt_tab_active.png'), fullPage: true });
            console.log("✓ Saved gantt_tab_active.png");
        }

        // Check left sidebar width and alignment
        const taskTable = page.locator('.w-\\[480px\\]').first();
        if (await taskTable.isVisible()) {
            const box = await taskTable.boundingBox();
            console.log(`\n✓ Left sidebar dimensions: ${box.width}x${box.height} at (${box.x}, ${box.y})`);
            
            // Check header columns
            const headers = await page.locator('.w-\\[480px\\] .uppercase').first().getByText(/task name|status|start|end|edit/i).all();
            console.log(`✓ Found ${headers.length} header columns in left sidebar`);
        }

        // Check Edit button alignment (should be w-[40px])
        const editButtons = page.locator('button[title="Edit Task"]');
        const editButtonCount = await editButtons.count();
        if (editButtonCount > 0) {
            console.log(`✓ Found ${editButtonCount} Edit buttons`);
            const firstButton = editButtons.first();
            if (await firstButton.isVisible()) {
                const box = await firstButton.boundingBox();
                console.log(`✓ First Edit button at (${box.x}, ${box.y}), size: ${box.width}x${box.height}`);
            }
        }

        // Check right timeline
        const timeline = page.locator('.flex-1.overflow-auto.relative').last();
        if (await timeline.isVisible()) {
            const box = await timeline.boundingBox();
            console.log(`\n✓ Timeline area dimensions: ${box.width}x${box.height} at (${box.x}, ${box.y})`);
        }

        // Check for any hidden/overflow issues
        const ganttContainer = page.locator('.flex.flex-1.overflow-auto.relative').first();
        if (await ganttContainer.isVisible()) {
            const styles = await ganttContainer.evaluate(el => window.getComputedStyle(el));
            const overflow = styles.overflow || styles.overflowX;
            console.log(`✓ Gantt container overflow setting: ${overflow}`);
        }

        // Zoom to specific area: Edit column vs Timeline
        await page.screenshot({ 
            path: path.join(screenshotDir, 'gantt_edit_column_zoom.png'),
            clip: { x: 400, y: 60, width: 150, height: 250 }
        });
        console.log("✓ Saved gantt_edit_column_zoom.png (Edit column area)");

        console.log("\n✅ All checks completed! Screenshots saved to:", screenshotDir);
        
    } catch (error) {
        console.error("❌ Error:", error.message);
    } finally {
        await browser.close();
    }
})();
