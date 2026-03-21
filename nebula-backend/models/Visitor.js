const { Schema, model } = require('mongoose');
module.exports = model('Visitor', new Schema({
  sessionId:     { type: String, required: true, unique: true },
  country:       String,
  device:        String,
  browser:       String,
  appsOpened:    [String],
  timeSpent:     Number,
  commandsTyped: [String],
  gamesPlayed:   [String],
  visitedAt:     { type: Date, default: Date.now },
  updatedAt:     { type: Date, default: Date.now }
}));
