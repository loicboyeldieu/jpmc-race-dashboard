# JP Morgan Performance Distribution Dashboard

This is a small dashboard that visualises finish-time distribution for the JP Morgan race and lets you search for a runner to see where they lie in the distribution.

Quick start

1. Install dependencies:

```bash
npm install
```

2. Run the server and open the app:

```bash
npm start
# then open http://localhost:3000
```

Development (React + Vite)

Start the React dev server (Vite) for rapid frontend development:

```bash
npm run dev
```

Build for production (output to `app/dist`) and serve with the existing Express server:

```bash
npm run build
npm start
# then open http://localhost:3000
```

Notes
- Frontend source lives in the `app` folder.
- Backend entrypoint is `server/server.js`.
- Raw race JSON files are stored under `data/jp_results_2026`.
- The `data` folder also contains the downloader script.
- The app serves a static frontend at `/` and an API at `/api/results`.
