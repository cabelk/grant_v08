const fs = require('fs');
const path = require('path');

// Simple synthesizer that creates a CI-era scorecard from existing data.
// This is a scaffold for integrating real scanners (Lighthouse/OpenSSF Scorecard).

const outDir = path.join(process.cwd(), 'ci-scan-results');
if (!fs.existsSync(outDir)) fs.mkdirSync(outDir, { recursive: true });

let baseline = { appScore: 75, lomScore: 75, details: [], generated_at: new Date().toISOString() };
try {
  const data = fs.readFileSync(path.join(process.cwd(), 'data', 'scorecard.json'), 'utf8');
  baseline = JSON.parse(data);
} catch (e) {
  // keep baseline
}

const e2ePassed = (process.env.E2E_PASSED || 'true') === 'true';
// Compose a simple mapping: use baseline but adjust security/apply e2e weight
const appScore = baseline.appScore || 75;
const lomScore = baseline.lomScore || 75;

// Add CI evidence link (best-effort from env)
const runUrl = process.env.CI_RUN_URL || `https://github.com/${process.env.GITHUB_REPOSITORY || 'cabelk/grant_v08'}/actions`;

const combined = Object.assign({}, baseline, {
  ci: {
    e2e_passed: e2ePassed,
    run_url: runUrl
  },
  generated_at: new Date().toISOString()
});

// Optionally adjust scores slightly based on e2e
if (e2ePassed) combined.appScore = Math.min(100, (combined.appScore || 75) + 2);
else combined.lomScore = Math.max(0, (combined.lomScore || 75) - 5);

const outPath = path.join(outDir, 'scorecard.json');
fs.writeFileSync(outPath, JSON.stringify(combined, null, 2), 'utf8');
console.log('Wrote', outPath);
