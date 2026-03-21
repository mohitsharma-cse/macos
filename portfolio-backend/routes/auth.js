const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// POST /api/auth/login - Admin login (password from .env as bcrypt hash)
router.post('/login', async (req, res) => {
  const { password } = req.body;
  if (!password) return res.status(400).json({ error: 'Password required.' });

  try {
    const match = await bcrypt.compare(password, process.env.ADMIN_PASSWORD_HASH);
    if (!match) return res.status(401).json({ error: 'Invalid credentials.' });

    const token = jwt.sign({ role: 'admin' }, process.env.JWT_SECRET, { expiresIn: '24h' });
    res.json({ token, expiresIn: '24h' });
  } catch (err) {
    res.status(500).json({ error: 'Auth error', detail: err.message });
  }
});

module.exports = router;
