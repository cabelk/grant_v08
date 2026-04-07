const express = require('express');
const path = require('path');

const app = express();

app.use(express.json());

// Simple scoring engine (reads data from data/scorecard.json if present)
function loadScore() {
  let base = null;
  try {
    base = require(path.join(__dirname, '..', 'data', 'scorecard.json'));
  } catch (err) {
    base = {
      appScore: 78,
      lomScore: 85,
      details: [
        { id: 'a11y', score: 14, max: 20, evidence: 'https://example.com/evidence/a11y' },
        { id: 'tests', score: 30, max: 40, evidence: 'https://example.com/evidence/tests' },
        { id: 'security', score: 34, max: 40, evidence: 'https://example.com/evidence/security' }
      ],
      generated_at: new Date().toISOString()
    };
  }

  // Try to attach CI run evidence if available in local lom provenance
  try {
    const provDir = path.join(__dirname, '..', '..', 'lom', 'runtime', 'provenance');
    const fs = require('fs');
    if (fs.existsSync(provDir)) {
      const files = fs.readdirSync(provDir);
      const runFile = files.find(f => f.startsWith('grant_v08-run-') || f.includes('grant_v08-run-'));
      if (runFile) {
        const runJson = JSON.parse(fs.readFileSync(path.join(provDir, runFile), 'utf8'));
        const runUrl = runJson.html_url || (runJson.url ? runJson.url.replace('api.github.com/repos', 'github.com').replace('/actions/runs/', '/actions/runs/') : null);
        // append CI detail
        base.details.push({ id: 'ci', score: runJson.conclusion === 'success' ? 10 : 4, max: 10, evidence: runUrl || 'https://github.com/cabelk/grant_v08/actions' });
      }
    }
  } catch (e) {
    // ignore provenance read errors
  }

  // Merge any CI-generated scorecard.json from provenance (take precedence)
  try {
    const fs = require('fs');
    const provRoot = path.join(__dirname, '..', '..', 'lom', 'runtime', 'provenance');
    if (fs.existsSync(provRoot)) {
      const walk = fs.readdirSync(provRoot, { withFileTypes: true });
      // look for any scorecard.json files in extracted artifact dirs
      const candidates = [];
      walk.forEach(d => {
        if (d.isDirectory()) {
          const candidate = path.join(provRoot, d.name, 'scorecard.json');
          if (fs.existsSync(candidate)) candidates.push(candidate);
        }
      });
      // also check common extracted folder name
      const fallback = path.join(provRoot, 'ci-scan-results-24032656517-auth', 'scorecard.json');
      if (fs.existsSync(fallback)) candidates.push(fallback);

      if (candidates.length > 0) {
        // pick the most recent candidate by mtime
        candidates.sort((a, b) => fs.statSync(b).mtimeMs - fs.statSync(a).mtimeMs);
        const scav = JSON.parse(fs.readFileSync(candidates[0], 'utf8'));
        // override top-level scores and merge details by id
        if (typeof scav.appScore === 'number') base.appScore = scav.appScore;
        if (typeof scav.lomScore === 'number') base.lomScore = scav.lomScore;
        base.generated_at = scav.generated_at || base.generated_at;
        if (Array.isArray(scav.details)) {
          const byId = new Map(base.details.map(d => [d.id, d]));
          scav.details.forEach(sd => byId.set(sd.id, sd));
          base.details = Array.from(byId.values());
        }
        if (scav.ci) base.ci = scav.ci;
      }
    }
  } catch (e) {
    // ignore
  }

  // normalize generated_at
  base.generated_at = new Date().toISOString();
  return base;
}

app.get('/api/score', (req, res) => {
  res.json(loadScore());
});

// Serve client static files
app.use('/', express.static(path.join(__dirname, '..', 'client')));

module.exports = app;
