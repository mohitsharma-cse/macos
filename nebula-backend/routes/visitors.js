const router  = require('express').Router();
const Visitor = require('../models/Visitor');
const { v4: uuidv4 } = require('uuid');

/* Log visitor activity */
router.post('/log', async (req, res) => {
  const { sessionId, country, device, browser, appsOpened=[], timeSpent=0, commandsTyped=[], gamesPlayed=[] } = req.body;
  try {
    await Visitor.findOneAndUpdate(
      { sessionId: sessionId || uuidv4() },
      {
        $set: { country, device, browser, timeSpent, updatedAt: new Date() },
        $addToSet: { appsOpened: { $each: appsOpened }, commandsTyped: { $each: commandsTyped }, gamesPlayed: { $each: gamesPlayed } },
        $setOnInsert: { visitedAt: new Date() }
      },
      { upsert: true, new: true }
    );
    res.json({ success: true });
  } catch (err) { res.status(500).json({ error: 'Logging failed' }); }
});

/* Analytics summary (admin only) */
router.get('/summary', require('../middleware/auth'), async (req, res) => {
  try {
    const total  = await Visitor.countDocuments();
    const today  = await Visitor.countDocuments({ visitedAt: { $gte: new Date(new Date().setHours(0,0,0,0)) } });
    const week   = await Visitor.countDocuments({ visitedAt: { $gte: new Date(Date.now() - 7*24*60*60*1000) } });
    const recent = await Visitor.find().sort({ visitedAt: -1 }).limit(20);
    const appCounts = {};
    recent.forEach(v => v.appsOpened.forEach(a => { appCounts[a] = (appCounts[a]||0)+1; }));
    res.json({ total, today, week, recent, appCounts });
  } catch (err) { res.status(500).json({ error: 'Stats failed' }); }
});

module.exports = router;
