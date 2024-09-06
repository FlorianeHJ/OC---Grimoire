const rateLimit = require("express-rate-limit");

const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 3,
  message: "Trop de tentatives de connexion. Réessayez dans 15 minutes.",
  headers: true,
});

module.exports = loginLimiter;
