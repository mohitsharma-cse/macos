const express = require('express');
const router = express.Router();
const Visitor = require('../models/Visitor');

// POST /api/visitor/ping — Log/update a visitor session
router.post('/ping', async (req, res) => {
  const { sessionId, device, browser, appOpened, commandTyped, codeRan, gamePlayed } = req.body;
  if (!sessionId) return res.status(400).json({ error: 'sessionId required.' });

  try {
    const update = { $setOnInsert: { visitedAt: new Date() }, $inc: { timeSpent: 1 } };
    if (device) update.$set = { device, browser };
    if (appOpened) update.$addToSet = { appsOpened: appOpened };
    if (commandTyped) (update.$push = update.$push || {}).commandsTyped = commandTyped;
    if (codeRan)  update.$set = { ...(update.$set||{}), codeRan: true };
    if (gamePlayed) (update.$addToSet = update.$addToSet || {}).gamesPlayed = gamePlayed;

    await Visitor.findOneAndUpdate({ sessionId }, update, { upsert: true, new: true });
    res.json({ ok: true });
  } catch (err) {
    res.status(500).json({ error: 'Visitor tracking error', detail: err.message });
  }
});

module.exports = router;
