const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const helmet = require('helmet');
require('dotenv').config();

const app = express();

// ─── Security Middleware ───────────────────────────────────────────────────────
app.use(helmet());
app.use(cors({
  origin: process.env.FRONTEND_URL || '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json({ limit: '10kb' })); // Body size limit

// ─── Database Connection ───────────────────────────────────────────────────────
mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(() => console.log('✅ MongoDB Atlas connected'))
  .catch(err => console.error('❌ MongoDB error:', err));

// ─── Routes ───────────────────────────────────────────────────────────────────
app.use('/api/ai',        require('./routes/ai'));
app.use('/api/auth',       require('./routes/auth'));
app.use('/api/visitor',    require('./routes/visitor'));
app.use('/api/messages',   require('./routes/messages'));
app.use('/api/analytics',  require('./routes/analytics'));

// ─── SSE: Real-time Active Visitor Count ──────────────────────────────────────
let activeConnections = 0;
const sseClients = new Set();

app.get('/api/sse/visitors', (req, res) => {
  res.writeHead(200, {
    'Content-Type': 'text/event-stream',
    'Cache-Control': 'no-cache',
    'Connection': 'keep-alive',
    'Access-Control-Allow-Origin': process.env.FRONTEND_URL || '*'
  });

  activeConnections++;
  sseClients.add(res);
  broadcast({ activeVisitors: activeConnections });

  req.on('close', () => {
    activeConnections = Math.max(0, activeConnections - 1);
    sseClients.delete(res);
    broadcast({ activeVisitors: activeConnections });
  });
});

function broadcast(data) {
  const msg = `data: ${JSON.stringify(data)}\n\n`;
  sseClients.forEach(client => client.write(msg));
}

// ─── Health Check ─────────────────────────────────────────────────────────────
app.get('/api/health', (req, res) => res.json({ status: 'ok', uptime: process.uptime() }));

// ─── 404 Handler ──────────────────────────────────────────────────────────────
app.use((req, res) => res.status(404).json({ error: 'Route not found' }));

// ─── Start Server ─────────────────────────────────────────────────────────────
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`🚀 Portfolio Backend running on port ${PORT}`));
