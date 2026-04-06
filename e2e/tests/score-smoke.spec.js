const { test, expect } = require('@playwright/test');
const fs = require('fs');
const path = require('path');

test.describe('Scorecard smoke and a11y', () => {
  test('loads app and exposes scorecard', async ({ page }) => {
    await page.goto('http://localhost:3000');
    await expect(page).toHaveTitle(/Grant/);

    // open scorecard if there's a toggle
    const toggle = await page.$('#score-toggle');
    if (toggle) await toggle.click();

    const score = await page.$('#score-summary');
    expect(score).not.toBeNull();
  });

  test('basic accessibility check with axe-core', async ({ page }) => {
    await page.goto('http://localhost:3000');
    // inject axe
    const axeSource = fs.readFileSync(require.resolve('axe-core/axe.min.js'), 'utf8');
    await page.addScriptTag({ content: axeSource });
    const results = await page.evaluate(async () => {
      return await window.axe.run();
    });
    // write results for artifact
    const outDir = path.join(process.cwd(), 'playwright-report');
    if (!fs.existsSync(outDir)) fs.mkdirSync(outDir, { recursive: true });
    fs.writeFileSync(path.join(outDir, 'axe-results.json'), JSON.stringify(results, null, 2));
    // assert no critical violations
    const critical = results.violations.filter(v => v.impact === 'critical');
    expect(critical.length).toBe(0);
  });
});
