const mongoose = require('mongoose');

const visitorSchema = new mongoose.Schema({
  sessionId:    { type: String, unique: true, index: true },
  country:      String,
  device:       { type: String, enum: ['desktop','mobile','tablet'], default: 'desktop' },
  browser:      String,
  appsOpened:   [String],
  timeSpent:    { type: Number, default: 0 }, // seconds
  commandsTyped:[String],
  codeRan:      { type: Boolean, default: false },
  gamesPlayed:  [String],
  visitedAt:    { type: Date, default: Date.now }
});

module.exports = mongoose.model('Visitor', visitorSchema);
