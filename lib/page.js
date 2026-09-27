const esc = (s='') => String(s).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));

function baseStyles(){return `
@import url('https://fonts.googleapis.com/css2?family=Open+Sans:wght@400;600;700;800&family=Roboto+Condensed:wght@700&display=swap');
:root{--royal:#17458F;--gold:#F7A81B;--azure:#0067C8;--slate:#687D92;--paper:#F5F7F9;--ink:#263746;--white:#fff}
*{box-sizing:border-box} body{margin:0;font-family:'Open Sans',Arial,sans-serif;background:var(--paper);color:var(--ink)}
button,input{font:inherit}
`}

function renderLogin(error=''){
  return `<!doctype html><html lang="es"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Acceso interno · Rotary 4905</title><style>${baseStyles()}
.login-wrap{min-height:100vh;display:grid;place-items:center;padding:24px;background:linear-gradient(135deg,#f8fafc 0%,#eef3f8 100%)}
.login-card{width:min(470px,100%);background:#fff;border:1px solid #dfe6ec;border-top:6px solid var(--gold);border-radius:16px;box-shadow:0 20px 55px rgba(23,69,143,.13);padding:30px}
.logo{display:block;width:min(360px,90%);margin:0 auto 25px}.eyebrow{font-size:12px;letter-spacing:.13em;text-transform:uppercase;color:var(--slate);font-weight:800;text-align:center}
h1{font-family:'Roboto Condensed','Arial Narrow',sans-serif;color:var(--royal);font-size:38px;line-height:1;margin:9px 0 9px;text-align:center}p{margin:0 0 25px;text-align:center;color:var(--slate);font-size:14px;line-height:1.55}
label{display:block;font-weight:700;font-size:13px;margin-bottom:8px}.field{width:100%;border:1px solid #cfd9e2;border-radius:9px;padding:13px 14px;outline:0}.field:focus{border-color:var(--azure);box-shadow:0 0 0 3px rgba(0,103,200,.11)}
.btn{width:100%;margin-top:14px;border:0;border-radius:9px;background:var(--royal);color:#fff;padding:13px 16px;font-weight:800;cursor:pointer}.btn:hover{filter:brightness(.96)}
.error{background:#fff4f4;border:1px solid #f1c6c6;color:#9a2e2e;border-radius:8px;padding:10px 12px;font-size:13px;margin-bottom:13px;text-align:center;display:${error?'block':'none'}}
.help{text-align:center;margin-top:18px;color:#8290a0;font-size:11px}.spinner{display:none;margin-left:8px}.loading .spinner{display:inline}.loading .label{opacity:.7}
</style></head><body><main class="login-wrap"><section class="login-card"><img class="logo" src="/assets/rotary-color.png" alt="Rotary Distrito 4905 · Comité de Imagen Pública"><div class="eyebrow">Acceso interno</div><h1>MONITOREO DE REDES</h1><p>Herramienta de uso interno del Comité de Imagen Pública. Ingresá la contraseña compartida por el equipo.</p><div id="error" class="error">${esc(error)}</div><form id="loginForm"><label for="password">Contraseña</label><input class="field" id="password" type="password" autocomplete="current-password" required autofocus><button class="btn" id="submit" type="submit"><span class="label">Ingresar</span><span class="spinner">…</span></button></form><div class="help">Rotary Distrito 4905</div></section></main><script>
const form=document.getElementById('loginForm'), error=document.getElementById('error'), btn=document.getElementById('submit');
form.addEventListener('submit',async(e)=>{e.preventDefault();error.style.display='none';btn.classList.add('loading');btn.disabled=true;try{const r=await fetch('/api/login',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({password:document.getElementById('password').value})});if(r.ok){location.href='/';return;}const d=await r.json().catch(()=>({}));error.textContent=d.error||'Contraseña incorrecta.';error.style.display='block';}catch(_){error.textContent='No se pudo iniciar sesión. Probá nuevamente.';error.style.display='block';}finally{btn.classList.remove('loading');btn.disabled=false;}});
</script></body></html>`;
}

function renderLanding(){
  const fs = require('fs');
  const path = require('path');
  return fs.readFileSync(path.join(__dirname, 'landing.html'), 'utf8');
}

module.exports = { renderLogin, renderLanding };
