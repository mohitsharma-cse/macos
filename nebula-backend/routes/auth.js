const router  = require('express').Router();
const bcrypt  = require('bcryptjs');
const jwt     = require('jsonwebtoken');

router.post('/login', async (req, res) => {
  const { password } = req.body;
  if (!password) return res.status(400).json({ error: 'Password required' });

  try {
    const valid = await bcrypt.compare(password, process.env.ADMIN_PASSWORD_HASH || '');
    if (!valid) return res.status(401).json({ error: 'Invalid password' });
    const token = jwt.sign({ admin: true }, process.env.JWT_SECRET || 'fallback_secret', { expiresIn: '24h' });
    res.json({ token });
  } catch (err) {
    res.status(500).json({ error: 'Auth failed' });
  }
});

module.exports = router;
