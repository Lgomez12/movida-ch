module.exports = (req, res) => {
  if (req.method !== 'POST') { res.statusCode = 405; return res.end('Method Not Allowed'); }
  res.setHeader('Set-Cookie', 'rotary_auth=; Path=/; HttpOnly; Secure; SameSite=Lax; Max-Age=0');
  res.statusCode = 204;
  res.end();
};
