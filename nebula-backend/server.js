require('dotenv').config();
const express   = require('express');
const mongoose  = require('mongoose');
const cors      = require('cors');
const helmet    = require('helmet');
const rateLimit = require('express-rate-limit');

const app = express();
const FRONTEND_ORIGINS = (process.env.FRONTEND_URL || '*')
  .split(',')
  .map(value => value.trim())
  .filter(Boolean);
const allowAllOrigins = FRONTEND_ORIGINS.includes('*');

/* ── Middleware ── */
app.use(helmet({ contentSecurityPolicy: false }));
app.use(cors({
  origin(origin, callback) {
    if (!origin || allowAllOrigins || FRONTEND_ORIGINS.includes(origin)) {
      return callback(null, true);
    }
    return callback(new Error('CORS origin not allowed'));
  },
  credentials: true
}));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

/* ── Rate Limits ── */
const aiLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, max: 30,
  message: { error: 'Too many AI requests. Try again in 1 hour.' }
});
const contactLimiter = rateLimit({
  windowMs: 24 * 60 * 60 * 1000, max: 5,
  message: { error: 'Max 5 messages per day.' }
});
const generalLimiter = rateLimit({ windowMs: 15 * 60 * 1000, max: 200 });
app.use(generalLimiter);

/* ── MongoDB ── */
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/nebula')
  .then(() => console.log('✅ MongoDB connected'))
  .catch(err => console.error('❌ MongoDB error:', err.message));

/* ── Routes ── */
app.use('/api/ai',       aiLimiter,      require('./routes/ai'));
app.use('/api/auth',                     require('./routes/auth'));
app.use('/api/visitors',                 require('./routes/visitors'));
app.use('/api/messages', contactLimiter, require('./routes/messages'));
app.use('/api/analytics',                require('./routes/analytics'));
app.use('/api/features',                 require('./routes/features'));

/* ── Health Check ── */
const healthHandler = (req, res) => res.json({
  status: 'ok',
  uptime: process.uptime(),
  timestamp: new Date().toISOString(),
  version: '2.0.25'
});
app.get('/health', healthHandler);
app.get('/api/health', healthHandler);

/* ── SSE — Real-time Visitor Count ── */
const sseClients = new Set();

app.get('/api/live', (req, res) => {
  res.setHeader('Content-Type', 'text/event-stream');
  res.setHeader('Cache-Control', 'no-cache');
  res.setHeader('Connection', 'keep-alive');
  res.flushHeaders();
  sseClients.add(res);
  res.write(`data: ${JSON.stringify({ visitors: sseClients.size })}\n\n`);
  req.on('close', () => { sseClients.delete(res); broadcastCount(); });
  broadcastCount();
});

function broadcastCount() {
  const data = JSON.stringify({ visitors: sseClients.size });
  sseClients.forEach(client => client.write(`data: ${data}\n\n`));
}

/* ── Error Handler ── */
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Internal server error' });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`🚀 NebulaOS Backend running → http://localhost:${PORT}`));
