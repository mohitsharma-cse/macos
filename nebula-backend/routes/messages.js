const router    = require('express').Router();
const nodemailer = require('nodemailer');
const Message   = require('../models/Message');
const { body, validationResult } = require('express-validator');
const mongoose = require('mongoose');
const { isDbReady, addMessage, getMessages } = require('../lib/fallbackStore');

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: { user: process.env.GMAIL_USER, pass: process.env.GMAIL_APP_PASSWORD }
});

router.post('/',
  [
    body('name').trim().isLength({ min: 2, max: 100 }).withMessage('Name: 2-100 chars'),
    body('email').isEmail().normalizeEmail().withMessage('Invalid email'),
    body('message').trim().isLength({ min: 10, max: 2000 }).withMessage('Message: 10-2000 chars'),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

    const { name, email, company, message, type } = req.body;

    try {
      const msg = isDbReady(mongoose)
        ? await Message.create({ name, email, company, message, type, ip: req.ip })
        : addMessage({ name, email, company, message, type, ip: req.ip });

      // Email to portfolio owner
      if (process.env.GMAIL_USER) {
        await transporter.sendMail({
          from: process.env.GMAIL_USER, to: process.env.GMAIL_USER,
          subject: `💼 NebulaOS message from ${name}`,
          html: `<h2>New Portfolio Message</h2><p><b>From:</b> ${name} (${email})</p>${company?`<p><b>Company:</b> ${company}</p>`:''}<p><b>Message:</b></p><p>${message.replace(/\n/g,'<br>')}</p><small>${new Date().toLocaleString()}</small>`
        });
        // Auto-reply
        await transporter.sendMail({
          from: process.env.GMAIL_USER, to: email,
          subject: `Hey ${name}! Got your message 🚀`,
          html: `<h2>Hey ${name}! 👋</h2><p>Thanks for reaching out via NebulaOS! I'll reply within 24 hours.</p><p>Best,<br>Mohit</p>`
        });
      }

      res.json({ success: true, id: msg._id });
    } catch (err) {
      console.error('Message error:', err.message);
      res.status(500).json({ error: 'Failed to send message' });
    }
  }
);

// Get all messages (admin)
router.get('/', require('../middleware/auth'), async (req, res) => {
  if (isDbReady(mongoose)) {
    const msgs = await Message.find().sort({ timestamp: -1 }).limit(100);
    return res.json(msgs);
  }
  res.json(getMessages().slice(0, 100));
});

module.exports = router;
