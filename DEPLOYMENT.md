# Deployment Guide

## Production Backend

Use [nebula-backend](C:/dj%20raaajesh%20web%20dev/dj%20raaajesh%20web%20dev/nebula-backend) as the only production backend.

## 1. Backend Environment

Copy [nebula-backend/.env.example](C:/dj%20raaajesh%20web%20dev/dj%20raaajesh%20web%20dev/nebula-backend/.env.example) to `nebula-backend/.env` and fill in:

- `MONGODB_URI`
- `JWT_SECRET`
- `ADMIN_PASSWORD_HASH`
- `OPENROUTER_API_KEY`
- `GMAIL_USER`
- `GMAIL_APP_PASSWORD`
- `PORT`
- `FRONTEND_URL`

`FRONTEND_URL` can be a comma-separated list of origins in production.

Example:

```env
FRONTEND_URL=https://your-frontend-domain.com,https://www.your-frontend-domain.com
```

## 2. Local Run

From [nebula-backend](C:/dj%20raaajesh%20web%20dev/dj%20raaajesh%20web%20dev/nebula-backend):

```bash
npm install
npm start
```

Health checks:

- `GET /health`
- `GET /api/health`
- `GET /api/features/stats`
- `GET /api/features?limit=10`

## 3. Frontend API URL

The frontend in [index.html](C:/dj%20raaajesh%20web%20dev/dj%20raaajesh%20web%20dev/index.html) works like this:

- local `localhost` uses `http://localhost:3000`
- hosted mode uses `window.NEBULA_API_BASE` or `localStorage['nebula-api-base']`

For production, set the API base before the page loads:

```html
<script>
  window.NEBULA_API_BASE = "https://your-backend-domain.com";
</script>
```

## 4. Recommended Hosting

### Frontend

- Netlify
- Vercel
- GitHub Pages

### Backend

- Railway
- Render
- Fly.io

### Database

- MongoDB Atlas

## 5. Minimum Production Checklist

1. Deploy `nebula-backend`
2. Set all backend env vars
3. Deploy frontend static files
4. Set `window.NEBULA_API_BASE` to your backend URL
5. Set `FRONTEND_URL` on the backend to your real frontend domain
6. Test:
   - health route
   - AI chat
   - contact form
   - visitor logging
   - feature catalog stats/list routes
   - SSE live route

## 6. Current Behavior Without Mongo

If MongoDB is unavailable, the backend now falls back to in-memory storage for visitors, messages, and analytics so local development still works. For real hosting, you should still provide MongoDB.
