const express = require('express');
const path = require('path');
const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

// Simple API: returns mock app + LOM scores and evidence links
app.get('/api/score', (req, res) => {
  res.json({
    appScore: 78,
    lomScore: 85,
    details: [
      { id: 'a11y', score: 14, max: 20, evidence: 'https://example.com/evidence/a11y' },
      { id: 'tests', score: 30, max: 40, evidence: 'https://example.com/evidence/tests' },
      { id: 'security', score: 34, max: 40, evidence: 'https://example.com/evidence/security' }
    ],
    generated_at: new Date().toISOString()
  });
});

// Serve client
app.use('/', express.static(path.join(__dirname, '..', 'client')));

app.listen(PORT, () => {
  console.log(`grant_v08 server listening on http://localhost:${PORT}`);
});
