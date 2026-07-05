function normalizeResultRow(row) {
  return {
    name: row.name || row.displayName || '',
    entrantId: row.entrantId || null,
    bibNumber: row.bibNumber || null,
    companyName: row.companyName || null,
    gender: row.gender,
    ageMin: row.ageMin,
    ageMax: row.ageMax,
    timeSeconds: Number(row.time_s ?? row.timeSeconds ?? row.time ?? row.finishTime ?? 0),
  }
}

export async function fetchResultRows() {
  const response = await fetch('/api/results')
  if (!response.ok) {
    throw new Error(`Failed to load results: ${response.status} ${response.statusText}`)
  }

  const payload = await response.json()
  const rows = Array.isArray(payload.results) ? payload.results : []
  return rows.map(normalizeResultRow)
}
