const { isAuthenticated } = require('../lib/auth');
const fallback = require('../data/clubs.json');

const SHEETS_FEED_URL = "https://script.google.com/macros/s/AKfycbzI-LcgST-jB6f6Y8p_brlg7pzAP8aJpdBGUJdOOMvvR4M4BTyly8PXX1hCdySFXTLpEw/exec";

module.exports = async (req, res) => {
  res.setHeader('Cache-Control', 'no-store, max-age=0');
  res.setHeader('Content-Type', 'application/json; charset=utf-8');
  res.setHeader('X-Robots-Tag', 'noindex, nofollow, noarchive');

  if (!isAuthenticated(req)) {
    res.statusCode = 401;
    return res.end(JSON.stringify({ success:false, error:'No autorizado' }));
  }

  try {
    const response = await fetch(SHEETS_FEED_URL, {
      method: 'GET',
      redirect: 'follow',
      cache: 'no-store'
    });

    if (!response.ok) {
      throw new Error(`Google Sheets respondió ${response.status}`);
    }

    const payload = await response.json();
    const source = Array.isArray(payload?.clubes) ? payload.clubes : [];

    if (!source.length) {
      throw new Error('La respuesta de Google Sheets no contiene clubes.');
    }

    const clubes = source
      .map((item, index) => ({
        n: Number(item.id) || index + 1,
        club: String(item.club || '').trim(),
        instagram: String(item.instagram || '').trim(),
        facebook: String(item.facebook || '').trim(),
        activityInstagram: Boolean(item.activityInstagram || item.actividadInstagram || item.actividad_instagram),
        activityFacebook: Boolean(item.activityFacebook || item.actividadFacebook || item.actividad_facebook),
        instagramLast: String(item.instagramLast || item.ultimaActividadInstagram || item.ultima_actividad_instagram || '').trim(),
        facebookLast: String(item.facebookLast || item.ultimaActividadFacebook || item.ultima_actividad_facebook || '').trim()
      }))
      .filter(item => item.club)
      .sort((a,b) => a.n - b.n);

    res.statusCode = 200;
    return res.end(JSON.stringify({
      success: true,
      source: 'google-sheets',
      total: clubes.length,
      clubes
    }));
  } catch (error) {
    // La landing sigue funcionando con la última copia local si Google falla.
    res.statusCode = 200;
    return res.end(JSON.stringify({
      success: true,
      source: 'fallback-local',
      warning: error.message,
      total: fallback.length,
      clubes: fallback
    }));
  }
};
