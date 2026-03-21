# 🖥️ PortfolioOS — Full Stack Developer Portfolio

> An Ubuntu-style interactive OS portfolio with AI features, built as a single HTML file + Node.js backend.

---

## 🗂️ Project Structure

```
dj rajesh web page/
├── index.html                  ← Frontend (deploy to Netlify)
└── portfolio-backend/          ← Backend (deploy to Railway)
    ├── server.js
    ├── package.json
    ├── .env.example            ← Copy to .env and fill in values
    ├── routes/
    │   ├── ai.js               (Gemini AI + HuggingFace)
    │   ├── auth.js             (Admin JWT login)
    │   ├── visitor.js          (Anonymous tracking)
    │   ├── messages.js         (Contact form + Nodemailer)
    │   └── analytics.js        (Admin dashboard data)
    ├── models/
    │   ├── Visitor.js
    │   ├── Message.js
    │   └── Chat.js
    └── middleware/
        ├── auth.js             (JWT verify)
        └── rateLimit.js        (IP throttling)
```

---

## 🔑 Step 1 — Get Your Free API Keys

| Service | URL | What it does |
|---------|-----|-------------|
| **Google Gemini** | [aistudio.google.com](https://aistudio.google.com) | AI terminal, code review, chatbot |
| **HuggingFace** | [huggingface.co/settings/tokens](https://huggingface.co/settings/tokens) | AI wallpaper generation |
| **MongoDB Atlas** | [mongodb.com/atlas](https://www.mongodb.com/atlas) | Free 512MB database |
| **Gmail App Password** | [myaccount.google.com/apppasswords](https://myaccount.google.com/apppasswords) | Contact form emails |

---

## ⚙️ Step 2 — Configure Environment Variables

```bash
cd portfolio-backend
cp .env.example .env
```

Edit `.env`:
```env
MONGODB_URI=mongodb+srv://user:pass@cluster0.xxxxx.mongodb.net/portfolioDB
JWT_SECRET=any_long_random_string_here
ADMIN_PASSWORD_HASH=    # generate with: node -e "const b=require('bcryptjs');b.hash('yourpassword',10).then(console.log)"
GEMINI_API_KEY=AIzaSy...
HUGGINGFACE_API_KEY=hf_...
GMAIL_USER=your@gmail.com
GMAIL_APP_PASSWORD=xxxx xxxx xxxx xxxx
PORT=3000
FRONTEND_URL=https://yourname.netlify.app
```

---

## 🚀 Step 3 — Deploy Backend to Railway (5 min)

1. Go to [railway.app](https://railway.app) → New Project → Deploy from GitHub
2. Push this `portfolio-backend` folder to a GitHub repo
3. Railway auto-detects Node.js and runs `npm start`
4. In Railway dashboard → Variables tab → paste all your `.env` values
5. Copy the generated Railway URL (e.g. `https://portfolio-backend.up.railway.app`)

---

## 🌐 Step 4 — Deploy Frontend to Netlify (2 min)

1. Go to [netlify.com](https://netlify.com) → New site → Drag & Drop
2. Drag the `index.html` file into the deploy box
3. Netlify gives you a URL like `https://yourname.netlify.app`
4. Update `FRONTEND_URL` in Railway variables to this URL

---

## 🔗 Step 5 — Connect Frontend to Backend

In `index.html`, find the line:
```js
const API_BASE = 'http://localhost:3000'; // change this!
```
Update it to your Railway URL:
```js
const API_BASE = 'https://portfolio-backend.up.railway.app';
```

---

## 🔒 Security Features

- ✅ CORS restricted to your Netlify domain
- ✅ Helmet.js HTTP security headers
- ✅ AI endpoints: 10 req/hour/IP
- ✅ Contact form: 3 msg/day/IP  
- ✅ Input validation with express-validator
- ✅ JWT admin tokens expire in 24h
- ✅ API keys never sent to frontend

---

## 🎮 Features Quick Reference

| Feature | How to access |
|---------|--------------|
| Terminal AI | Type `ai <your question>` in Terminal app |
| Code Review | Run code → click "Review with AI" button |
| AI Chatbot | Open "Chat" app from desktop |
| Admin Panel | Type `admin` in Terminal, enter password |
| Change Wallpaper | Right-click desktop → Change Wallpaper |
| Konami Code | ↑↑↓↓←→←→BA |

---

*Built with ❤️ by Mohit — PortfolioOS v2.0.25*
