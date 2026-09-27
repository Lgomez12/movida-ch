const { isAuthenticated } = require('../lib/auth');
const { renderLogin, renderLanding } = require('../lib/page');

module.exports = (req, res) => {
  res.setHeader('Cache-Control', 'no-store, max-age=0');
  res.setHeader('X-Robots-Tag', 'noindex, nofollow, noarchive');
  res.setHeader('Content-Type', 'text/html; charset=utf-8');
  if (!process.env.SITE_PASSWORD || !process.env.AUTH_SECRET) {
    res.statusCode = 500;
    return res.end(renderLogin('Falta configurar SITE_PASSWORD o AUTH_SECRET en Vercel.'));
  }
  res.statusCode = 200;
  res.end(isAuthenticated(req) ? renderLanding() : renderLogin());
};
