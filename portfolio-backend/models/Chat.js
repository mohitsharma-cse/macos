const mongoose = require('mongoose');

const chatSchema = new mongoose.Schema({
  sessionId: { type: String, index: true },
  role:      { type: String, enum: ['user', 'assistant'] },
  content:   String,
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Chat', chatSchema);
