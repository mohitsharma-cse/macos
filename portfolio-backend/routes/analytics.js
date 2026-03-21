const express = require('express');
const router = express.Router();
const Visitor = require('../models/Visitor');
const authMiddleware = require('../middleware/auth');

// GET /api/analytics/summary — Admin dashboard summary  
router.get('/summary', authMiddleware, async (req, res) => {
  try {
    const now = new Date();
    const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const weekStart = new Date(now - 7 * 24 * 60 * 60 * 1000);

    const [total, today, week, appStats, recentVisitors] = await Promise.all([
      Visitor.countDocuments(),
      Visitor.countDocuments({ visitedAt: { $gte: todayStart } }),
      Visitor.countDocuments({ visitedAt: { $gte: weekStart } }),
      Visitor.aggregate([
        { $unwind: '$appsOpened' },
        { $group: { _id: '$appsOpened', count: { $sum: 1 } } },
        { $sort: { count: -1 } },
        { $limit: 10 }
      ]),
      Visitor.find().sort({ visitedAt: -1 }).limit(20).select('-__v')
    ]);

    res.json({ total, today, week, appStats, recentVisitors });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET /api/analytics/daily — Last 30 days visitor counts
router.get('/daily', authMiddleware, async (req, res) => {
  try {
    const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
    const daily = await Visitor.aggregate([
      { $match: { visitedAt: { $gte: thirtyDaysAgo } } },
      { $group: {
        _id: { $dateToString: { format: '%Y-%m-%d', date: '$visitedAt' } },
        count: { $sum: 1 }
      }},
      { $sort: { _id: 1 } }
    ]);
    res.json(daily);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
