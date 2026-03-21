const express = require('express');
const router = express.Router();
const nodemailer = require('nodemailer');
const Message = require('../models/Message');
const { contactLimiter } = require('../middleware/rateLimit');
const { body, validationResult } = require('express-validator');
const authMiddleware = require('../middleware/auth');

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: { user: process.env.GMAIL_USER, pass: process.env.GMAIL_APP_PASSWORD }
});

// POST /api/messages — Submit contact form
router.post('/', contactLimiter, [
  body('name').trim().isLength({ min: 1, max: 100 }).escape(),
  body('email').isEmail().normalizeEmail(),
  body('message').trim().isLength({ min: 5, max: 2000 }).escape(),
], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

  try {
    const msg = await Message.create(req.body);

    // Notify owner
    await transporter.sendMail({
      from: process.env.GMAIL_USER,
      to: process.env.GMAIL_USER,
      subject: `📬 New Portfolio Message from ${msg.name}`,
      html: `<b>From:</b> ${msg.name} (${msg.email})<br><b>Company:</b> ${msg.company || 'N/A'}<br><b>Intent:</b> ${msg.intent}<br><br><p>${msg.message}</p>`
    });

    // Auto-reply to sender
    await transporter.sendMail({
      from: process.env.GMAIL_USER,
      to: msg.email,
      subject: `Thanks for reaching out, ${msg.name}!`,
      html: `<p>Hi ${msg.name},</p><p>I received your message and will get back to you soon!</p><p>— Mohit</p>`
    });

    res.json({ ok: true, id: msg._id });
  } catch (err) {
    res.status(500).json({ error: 'Message error', detail: err.message });
  }
});

// GET /api/messages — Admin: list all messages (requires auth)
router.get('/', authMiddleware, async (req, res) => {
  try {
    const messages = await Message.find().sort({ createdAt: -1 }).limit(100);
    res.json(messages);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// PATCH /api/messages/:id/read — Mark as read
router.patch('/:id/read', authMiddleware, async (req, res) => {
  try {
    await Message.findByIdAndUpdate(req.params.id, { isRead: true });
    res.json({ ok: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
