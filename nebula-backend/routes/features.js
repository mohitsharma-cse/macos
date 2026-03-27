const router = require('express').Router();
const {
  getFeatureById,
  getFeatureStats,
  queryFeatureCatalog
} = require('../lib/featureCatalog');

router.get('/', (req, res) => {
  try {
    const result = queryFeatureCatalog({
      search: req.query.search,
      category: req.query.category,
      surface: req.query.surface,
      capability: req.query.capability,
      layer: req.query.layer,
      status: req.query.status,
      priority: req.query.priority,
      backendRequired: req.query.backendRequired,
      frontendRequired: req.query.frontendRequired,
      page: req.query.page,
      limit: req.query.limit
    });
    res.json(result);
  } catch (err) {
    res.status(500).json({ error: 'Feature catalog query failed' });
  }
});

router.get('/stats', (req, res) => {
  try {
    res.json(getFeatureStats());
  } catch (err) {
    res.status(500).json({ error: 'Feature catalog stats failed' });
  }
});

router.get('/:id', (req, res) => {
  try {
    const item = getFeatureById(req.params.id);
    if (!item) {
      return res.status(404).json({ error: 'Feature not found' });
    }
    res.json(item);
  } catch (err) {
    res.status(500).json({ error: 'Feature lookup failed' });
  }
});

module.exports = router;
