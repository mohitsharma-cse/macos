const router  = require('express').Router();
const Visitor = require('../models/Visitor');
const { v4: uuidv4 } = require('uuid');
const mongoose = require('mongoose');
const { isDbReady, upsertVisitor, getVisitorSummary } = require('../lib/fallbackStore');

/* Log visitor activity */
router.post('/log', async (req, res) => {
  const { sessionId, country, device, browser, appsOpened=[], timeSpent=0, commandsTyped=[], gamesPlayed=[] } = req.body;
  try {
    const payload = { sessionId: sessionId || uuidv4(), country, device, browser, appsOpened, timeSpent, commandsTyped, gamesPlayed };
    if (isDbReady(mongoose)) {
      await Visitor.findOneAndUpdate(
        { sessionId: payload.sessionId },
        {
          $set: { country, device, browser, timeSpent, updatedAt: new Date() },
          $addToSet: { appsOpened: { $each: appsOpened }, commandsTyped: { $each: commandsTyped }, gamesPlayed: { $each: gamesPlayed } },
          $setOnInsert: { visitedAt: new Date() }
        },
        { upsert: true, new: true }
      );
    } else {
      upsertVisitor(payload);
    }
    res.json({ success: true });
  } catch (err) { res.status(500).json({ error: 'Logging failed' }); }
});

/* Analytics summary (admin only) */
router.get('/summary', require('../middleware/auth'), async (req, res) => {
  try {
    if (isDbReady(mongoose)) {
      const total  = await Visitor.countDocuments();
      const today  = await Visitor.countDocuments({ visitedAt: { $gte: new Date(new Date().setHours(0,0,0,0)) } });
      const week   = await Visitor.countDocuments({ visitedAt: { $gte: new Date(Date.now() - 7*24*60*60*1000) } });
      const recent = await Visitor.find().sort({ visitedAt: -1 }).limit(20);
      const appCounts = {};
      recent.forEach(v => v.appsOpened.forEach(a => { appCounts[a] = (appCounts[a]||0)+1; }));
      return res.json({ total, today, week, recent, appCounts });
    }
    res.json(getVisitorSummary());
  } catch (err) { res.status(500).json({ error: 'Stats failed' }); }
});

module.exports = router;
