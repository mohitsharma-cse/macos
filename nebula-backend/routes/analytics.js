const router  = require('express').Router();
const Visitor = require('../models/Visitor');
const Message = require('../models/Message');

router.get('/', require('../middleware/auth'), async (req, res) => {
  try {
    const [totalVisitors, totalMessages, recentVisitors] = await Promise.all([
      Visitor.countDocuments(),
      Message.countDocuments(),
      Visitor.find().sort({ visitedAt: -1 }).limit(10)
    ]);
    res.json({ totalVisitors, totalMessages, recentVisitors });
  } catch (err) {
    res.status(500).json({ error: 'Analytics failed' });
  }
});

module.exports = router;
