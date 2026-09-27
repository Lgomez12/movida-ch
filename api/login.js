const { authToken, safeEqual } = require('../lib/auth');

module.exports = (req, res) => {
  if (req.method !== 'POST') { res.statusCode = 405; return res.end('Method Not Allowed'); }
  res.setHeader('Cache-Control', 'no-store, max-age=0');
  let body = req.body || {};
  if (typeof body === 'string') { try { body = JSON.parse(body); } catch (_) { body = {}; } }
  const expected = process.env.SITE_PASSWORD || '';
  const given = body.password || '';
  if (!expected || !process.env.AUTH_SECRET) {
    res.statusCode = 500;
    res.setHeader('Content-Type','application/json');
    return res.end(JSON.stringify({error:'Falta configurar la contraseña en Vercel.'}));
  }
  if (!safeEqual(given, expected)) {
    res.statusCode = 401;
    res.setHeader('Content-Type','application/json');
    return res.end(JSON.stringify({error:'Contraseña incorrecta.'}));
  }
  const maxAge = 60 * 60 * 12;
  res.setHeader('Set-Cookie', `rotary_auth=${encodeURIComponent(authToken())}; Path=/; HttpOnly; Secure; SameSite=Lax; Max-Age=${maxAge}`);
  res.statusCode = 200;
  res.setHeader('Content-Type','application/json');
  res.end(JSON.stringify({ok:true}));
};
