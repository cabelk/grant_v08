import fs from 'fs';
import { chromium } from 'playwright';

const url = process.env.PAGES_URL || 'https://cabelk.github.io/grant_v08/';
const out = process.env.OUT || 'lom/runtime/provenance/pages-axe-results.json';

async function run(){
  const browser = await chromium.launch({ args: ['--no-sandbox'] });
  const page = await browser.newPage();
  console.log('Navigating to', url);
  await page.goto(url, { waitUntil: 'networkidle' });
  // inject axe
  const axePath = require.resolve('axe-core/axe.min.js');
  await page.addScriptTag({ path: axePath });
  const results = await page.evaluate(async () => {
    return await axe.run(document);
  });
  await browser.close();
  fs.mkdirSync(require('path').dirname(out), { recursive: true });
  fs.writeFileSync(out, JSON.stringify({ url, generated_at: new Date().toISOString(), results}, null, 2));
  console.log('Wrote results to', out);
}

run().catch(e=>{ console.error(e); process.exit(2)});
