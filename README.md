# Nebula macOS Web Desktop

A browser-based macOS-inspired desktop experience with a large app catalog, a playable game center, and a Node.js backend for AI, analytics, visitors, messages, and feature APIs.

## Highlights

- macOS-style desktop UI with windows, dock, launcher, and desktop interactions
- 100+ app catalog across system, productivity, developer, creative, lifestyle, and games
- 50 playable games inside the Games app
- Feature Lab app with a 10,000-item roadmap catalog
- unified `nebula-backend` for auth, AI, messages, analytics, visitors, and feature routes
- backend-safe frontend behavior when API base is not configured
- in-memory backend fallback for local development when MongoDB is unavailable

## Main project files

```text
.
|-- index.html
|-- catalog-apps.js
|-- games-center.js
|-- desktop-enhancements.js
|-- feature-catalog-core.js
|-- feature-lab.js
|-- APP_INVENTORY.md
|-- FEATURE_CATALOG.md
|-- DEPLOYMENT.md
`-- nebula-backend/
    |-- server.js
    |-- package.json
    |-- .env.example
    |-- lib/
    `-- routes/
```

## Included experiences

- Finder, Safari, Mail, Messages, Settings, Calculator, Terminal, VS Code, Weather, Clock, Camera, Music, Photos, App Store, Activity Monitor, and more
- template-driven apps such as TextEdit, Pages, Numbers, Keynote, JSON Lab, Regex Lab, Passwords, Dictionary, Unit Converter, and Preview
- 50-game hub covering board, puzzle, quiz, reflex, math, word, and duel-style mini games
- Feature Lab for browsing 10,000 possible upgrades to the platform

See `APP_INVENTORY.md` for the full app list and `FEATURE_CATALOG.md` for the roadmap system.

## Quick start

### Frontend

Open `index.html` directly in the browser for basic local use.

If you want the backend-connected experience, serve the folder with a static server and point the frontend at your backend URL before page load:

```html
<script>
  window.NEBULA_API_BASE = "http://localhost:3000";
</script>
```

### Backend

```bash
cd nebula-backend
npm install
npm start
```

The backend runs on `http://localhost:3000` by default.

## Backend environment

Copy `nebula-backend/.env.example` to `nebula-backend/.env` and fill in:

- `MONGODB_URI`
- `JWT_SECRET`
- `ADMIN_PASSWORD_HASH`
- `OPENROUTER_API_KEY`
- `GMAIL_USER`
- `GMAIL_APP_PASSWORD`
- `PORT`
- `FRONTEND_URL`

`FRONTEND_URL` can be a comma-separated list in production.

## Useful routes

- `GET /health`
- `GET /api/health`
- `GET /api/features/stats`
- `GET /api/features?limit=10`
- `POST /api/visitors/log`
- `GET /api/live`

## Verification

From the project root:

```bash
npm install
npm run verify
```

That runs the basic syntax and frontend validation checks.

## Deployment

- Frontend: Netlify, Vercel, or GitHub Pages
- Backend: Railway, Render, or Fly.io
- Database: MongoDB Atlas

See `DEPLOYMENT.md` for the production checklist.

## Repository docs

- `APP_INVENTORY.md` - current app list and roadmap phases
- `FEATURE_CATALOG.md` - 10,000-item feature catalog overview
- `DEPLOYMENT.md` - hosting and environment setup

## Status

The project now has a strong foundation:

- large app catalog
- real game center
- backend unification
- feature roadmap system

The next major phase is deeper polish for the highest-visibility apps like Finder, Safari, Mail, Messages, Settings, and VS Code.
