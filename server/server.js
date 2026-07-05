const express = require('express');
const fs = require('fs');
const path = require('path');
const cors = require('cors');

const app = express();
app.use(cors());

const RESULTS_DIR = path.join(__dirname, '..', 'data', 'jp_results_2026');

function loadAllResults() {
  const files = fs.readdirSync(RESULTS_DIR).filter(f => f.endsWith('.json'));
  const rows = [];
  for (const f of files) {
    try {
      const doc = JSON.parse(fs.readFileSync(path.join(RESULTS_DIR, f), 'utf8'));
      const arr = doc.individualResults || [];
      for (const r of arr) {
        const name = r.displayName || r.name;
        const t = r.bestFinishTime || r.time || r.finishTime;
        if (name && (t !== undefined && t !== null && t !== '')) {
          rows.push({
            name,
            time_s: Number(t),
            entrantId: r.entrantId,
            bibNumber: r.bibNumber || null,
            companyName: r.companyName || null,
            gender: r.gender,
            ageMin: r.ageMin,
            ageMax: r.ageMax
          });
        }
      }
    } catch (err) {
      console.warn('Skipping', f, err.message);
    }
  }
  return rows;
}

app.get('/api/results', (req, res) => {
  try {
    const rows = loadAllResults();
    res.json({ results: rows });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Serve static frontend: prefer built files in app/dist, otherwise serve app/
const distPath = path.join(__dirname, '..', 'app', 'dist');
if (fs.existsSync(distPath)) {
  app.use('/', express.static(distPath));
} else {
  app.use('/', express.static(path.join(__dirname, '..', 'app')));
}

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server listening on http://localhost:${PORT}`));
