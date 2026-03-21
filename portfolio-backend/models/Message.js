const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema({
  name:      { type: String, required: true, trim: true, maxlength: 100 },
  email:     { type: String, required: true, trim: true, lowercase: true },
  company:   { type: String, trim: true, maxlength: 100 },
  message:   { type: String, required: true, maxlength: 2000 },
  intent:    { type: String, enum: ['Full-time','Freelance','Collaboration','Just saying hi'], default: 'Just saying hi' },
  isRead:    { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Message', messageSchema);
