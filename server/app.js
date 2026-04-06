const express = require('express');
const path = require('path');

const app = express();

app.use(express.json());

// Simple scoring engine (reads data from data/scorecard.json if present)
function loadScore() {
  try {
    const data = require(path.join(__dirname, '..', 'data', 'scorecard.json'));
    return data;
  } catch (err) {
    // fallback minimal scores
    return {
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
}

app.get('/api/score', (req, res) => {
  res.json(loadScore());
});

// Serve client static files
app.use('/', express.static(path.join(__dirname, '..', 'client')));

module.exports = app;
