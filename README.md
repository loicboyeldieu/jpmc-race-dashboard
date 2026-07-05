# JP Morgan Race Runners Distribution

A dashboard that visualises finish-time distribution for the JP Morgan corporate race in London (2026) and lets you search for runners, compare colleagues, and discover where you stand.

**Live demo:** [https://jpmc-race-dashboard.onrender.com](https://jpmc-race-dashboard.onrender.com)

---

## Quick start

```bash
npm install
npm start
# then open http://localhost:3000
```

## Development (React + Vite)

```bash
npm run dev
# Vite dev server with HMR on http://localhost:5174
```

## Production build

```bash
npm run build
npm start
# then open http://localhost:3000
```

## Project structure

- `app/` — Frontend source (React + Vite)
- `server/server.js` — Express API server
- `data/jp_results_2026/` — Raw race JSON results
- `data/scoring_results_downloader.py` — Data download script

---

## Disclaimer

This is an independent project and is not affiliated with, endorsed by, or associated with JPMorgan Chase & Co. The data used is from publicly available race results. This project is for educational and informational purposes only.

Built by [Loïc Boyeldieu](https://github.com/loicboyeldieu) — 2026