import fs from 'fs';
import path from 'path';
import { chromium } from 'playwright';

const url = process.env.PAGES_URL || 'https://cabelk.github.io/grant_v08/';
const out = process.env.OUT || 'lom/runtime/provenance/pages-axe-results.json';

async function run(){
  const browser = await chromium.launch({ args: ['--no-sandbox'] });
  const page = await browser.newPage();
  console.log('Navigating to', url);
  await page.goto(url, { waitUntil: 'networkidle' });

  // Use CDN axe build to avoid require() in ESM runner
  const axeCdn = 'https://cdnjs.cloudflare.com/ajax/libs/axe-core/4.7.2/axe.min.js';
  await page.addScriptTag({ url: axeCdn });

  const results = await page.evaluate(async () => {
    // eslint-disable-next-line no-undef
    return await axe.run(document);
  });

  await browser.close();

  const outDir = path.dirname(out);
  fs.mkdirSync(outDir, { recursive: true });
  fs.writeFileSync(out, JSON.stringify({ url, generated_at: new Date().toISOString(), results}, null, 2));
  console.log('Wrote results to', out);
}

run().catch(e=>{ console.error(e); process.exit(2)});
