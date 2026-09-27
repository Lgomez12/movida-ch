const crypto = require('crypto');

function authToken() {
  const secret = process.env.AUTH_SECRET || '';
  if (!secret) return '';
  return crypto.createHmac('sha256', secret).update('rotary-4905-monitor').digest('hex');
}

function cookieValue(req, name) {
  const raw = req.headers.cookie || '';
  const match = raw.split(';').map(v => v.trim()).find(v => v.startsWith(name + '='));
  return match ? decodeURIComponent(match.slice(name.length + 1)) : '';
}

function safeEqual(a, b) {
  if (!a || !b) return false;
  const ba = Buffer.from(String(a));
  const bb = Buffer.from(String(b));
  if (ba.length !== bb.length) return false;
  return crypto.timingSafeEqual(ba, bb);
}

function isAuthenticated(req) {
  return safeEqual(cookieValue(req, 'rotary_auth'), authToken());
}

module.exports = { authToken, isAuthenticated, safeEqual };
