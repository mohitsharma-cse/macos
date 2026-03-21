const { Schema, model } = require('mongoose');
module.exports = model('Message', new Schema({
  name:      { type: String, required: true },
  email:     { type: String, required: true },
  company:   String,
  message:   { type: String, required: true },
  type:      String,
  ip:        String,
  read:      { type: Boolean, default: false },
  timestamp: { type: Date, default: Date.now }
}));
