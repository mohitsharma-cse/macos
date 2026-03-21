# NebulaOS Backend — Setup Guide

## Quick Start

### Step 1 — Get Free API Keys
- **MongoDB Atlas** (free DB): https://mongodb.com/atlas → Free 512MB cluster
- **Gmail App Password**: Google Account → Security → 2FA → App Passwords

### Step 2 — Configure Environment
```bash
cp .env.example .env
```
Fill in all values in `.env`:
- `MONGODB_URI` — from Atlas dashboard
- `OPENROUTER_API_KEY` — your key (already provided)
- `GMAIL_USER` — your Gmail address
- `GMAIL_APP_PASSWORD` — 16-char app password from Google
- `JWT_SECRET` — any long random string (32+ chars)
- `ADMIN_PASSWORD_HASH` — run: `node -e "console.log(require('bcryptjs').hashSync('yourpassword',12))"`

### Step 3 — Install & Run
```bash
cd nebula-backend
npm install
npm run dev
```
Server starts at: http://localhost:3000

### Step 4 — Deploy to Railway (free)
1. Push this folder to GitHub
2. Go to [railway.app](https://railway.app) → New Project → Deploy from GitHub
3. Set all `.env` variables in Railway dashboard
4. Railway gives you a URL like: `https://nebula-backend.up.railway.app`

### Step 5 — Connect Frontend
In `index.html` find:
```js
const API_BASE = 'http://localhost:3000';
```
Replace with:
```js
const API_BASE = 'https://your-railway-url.up.railway.app';
```

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | /api/ai/chat | AI chat (OpenRouter) |
| POST | /api/ai/terminal | AI terminal command |
| POST | /api/ai/review | Code review |
| POST | /api/ai/explain | Code explanation |
| POST | /api/messages | Contact form |
| POST | /api/visitors/log | Log visitor activity |
| GET  | /api/live | SSE live visitor count |
| POST | /api/auth/login | Admin login |
| GET  | /api/visitors/summary | Analytics (admin) |
| GET  | /health | Health check |
