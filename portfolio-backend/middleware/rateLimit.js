const rateLimit = require('express-rate-limit');

// General API rate limiter
exports.apiLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 100,
  message: { error: 'Too many requests. Try again later.' }
});

// Strict AI endpoint limiter
exports.aiLimiter = rateLimit({
  windowMs: 60 * 60 * 1000,
  max: 10,
  message: { error: 'AI rate limit reached (10/hour). Try again later.' }
});

// Contact form limiter
exports.contactLimiter = rateLimit({
  windowMs: 24 * 60 * 60 * 1000, // 24 hours
  max: 3,
  message: { error: 'Max 3 messages per day per IP.' }
});
