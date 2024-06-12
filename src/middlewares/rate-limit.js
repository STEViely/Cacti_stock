const { rateLimit } = require("express-rate-limit");

const limiter = rateLimit({
  windowMs: 10 * 60 * 1000,
  linit: 100,
  message: { message: "too many request in a given period" },
});

module.exports = limiter;
