const router  = require('express').Router();
const Visitor = require('../models/Visitor');
const Message = require('../models/Message');
const mongoose = require('mongoose');
const { isDbReady, getVisitorSummary, getMessages } = require('../lib/fallbackStore');

router.get('/', require('../middleware/auth'), async (req, res) => {
  try {
    if (isDbReady(mongoose)) {
      const [totalVisitors, totalMessages, recentVisitors] = await Promise.all([
        Visitor.countDocuments(),
        Message.countDocuments(),
        Visitor.find().sort({ visitedAt: -1 }).limit(10)
      ]);
      return res.json({ totalVisitors, totalMessages, recentVisitors });
    }
    const summary = getVisitorSummary();
    res.json({
      totalVisitors: summary.total,
      totalMessages: getMessages().length,
      recentVisitors: summary.recent.slice(0, 10),
    });
  } catch (err) {
    res.status(500).json({ error: 'Analytics failed' });
  }
});

module.exports = router;
