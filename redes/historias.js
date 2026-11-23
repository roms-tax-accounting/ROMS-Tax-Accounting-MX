// Historias de Instagram (1080x1920) a partir de las imágenes de WhatsApp. Uso: node stories.js salida/
const { chromium } = require('playwright');
const fs = require('fs'), path = require('path');
const R = __dirname;
const F = p => 'data:font/woff2;base64,' + fs.readFileSync(path.join(R, 'node_modules/@fontsource', p)).toString('base64');
const LOGO = 'data:image/png;base64,' + fs.readFileSync(path.join(R, 'marca/logo_monograma_oscuro.png')).toString('base64');
const ICON = (n, s = 50) => fs.readFileSync(path.join(R, 'node_modules/lucide-static/icons', n + '.svg'), 'utf8')
  .replace(/<!--[\s\S]*?-->/g, '').replace(/width="24"/, `width="${s}"`).replace(/height="24"/, `height="${s}"`).replace(/stroke-width="2"/, 'stroke-width="1.6"');
const BG = n => fs.readFileSync(path.join(R, 'node_modules/lucide-static/icons', n + '.svg'), 'utf8')
  .replace(/<!--[\s\S]*?-->/g, '').replace(/width="24"/, '').replace(/height="24"/, '').replace(/stroke-width="2"/, 'stroke-width="0.32"');
const item = (icon, title, body) => `<div class="it"><span class="ic">${ICON(icon)}</span><div><h4>${title}</h4><p>${body}</p></div></div>`;

const css = `
@font-face{font-family:IS;src:url(${F('instrument-serif/files/instrument-serif-latin-400-normal.woff2')})}
@font-face{font-family:IS;font-style:italic;src:url(${F('instrument-serif/files/instrument-serif-latin-400-italic.woff2')})}
@font-face{font-family:PJ;font-weight:400;src:url(${F('plus-jakarta-sans/files/plus-jakarta-sans-latin-400-normal.woff2')})}
@font-face{font-family:PJ;font-weight:700;src:url(${F('plus-jakarta-sans/files/plus-jakarta-sans-latin-700-normal.woff2')})}
@font-face{font-family:PX;src:url(${F('ibm-plex-mono/files/ibm-plex-mono-latin-500-normal.woff2')})}
*{box-sizing:border-box;margin:0}
html,body{width:1080px;height:1920px;overflow:hidden}
.s{position:relative;width:1080px;height:1920px;padding:230px 84px 340px;display:flex;flex-direction:column;font-family:PJ;color:#334155;
 background:radial-gradient(900px 800px at 0% 0%,rgba(65,201,226,.13),transparent 62%),radial-gradient(800px 700px at 100% 100%,rgba(220,38,38,.09),transparent 60%),#f4f0e8;overflow:hidden}
.dots{position:absolute;right:0;top:0;width:420px;height:420px;opacity:.28;background-image:radial-gradient(#ef4444 2px,transparent 2.4px);background-size:28px 28px;-webkit-mask-image:radial-gradient(circle at 100% 0%,#000 0%,transparent 70%)}
.bgart{position:absolute;right:-190px;bottom:60px;width:1000px;height:1000px;color:#0b1f33;opacity:.06}
.bgart svg{width:100%;height:100%}
.z{position:relative;z-index:2}
.top{display:flex;justify-content:space-between;align-items:center}
.top img{height:130px}
.count{font:500 22px/1 PX;color:#64748b;letter-spacing:.12em}
.mid{flex:1;display:flex;flex-direction:column;justify-content:center}
.kicker{font:500 24px/1.3 PX;letter-spacing:.16em;text-transform:uppercase;color:#c81e1e;display:flex;align-items:center;gap:16px}
.kicker::before{content:"";width:48px;height:2px;background:#c81e1e}
h1{margin-top:22px;font:400 116px/1.0 IS;color:#0b1f33;letter-spacing:-.01em}
h1 em,h2 em{color:#c81e1e}
h2{font:400 84px/1.02 IS;color:#0b1f33}
.lead{margin-top:30px;font:400 36px/1.45 PJ}.lead b{color:#0b1f33}
.hero{margin-top:50px;background:#0b1f33;border-radius:6px;padding:44px 46px;color:#cbd5e1}
.hero .old{font:500 24px/1.3 PX;letter-spacing:.08em;color:#f87171;text-transform:uppercase}
.hero .big{font:400 190px/.9 IS;color:#fff;margin-top:10px}
.hero p{margin-top:16px;font:400 34px/1.4 PJ}.hero p b{color:#fff}
.it{display:grid;grid-template-columns:92px 1fr;gap:26px;margin-top:46px;align-items:start}
.ic{width:92px;height:92px;border-radius:50%;display:grid;place-items:center;color:#0b1f33;border:2px solid rgba(200,30,30,.65);background:radial-gradient(circle at 30% 25%,rgba(65,201,226,.18),rgba(220,38,38,.06) 70%)}
h4{font:700 36px/1.25 PJ;color:#0b1f33}
.it p{margin-top:8px;font:400 31px/1.45 PJ}.it p b{color:#0b1f33}
.sub{margin-top:54px;font:500 24px/1.3 PX;letter-spacing:.16em;text-transform:uppercase;color:#0b1f33;display:flex;gap:16px;align-items:center}
.sub span{color:#c81e1e}.sub::after{content:"";flex:1;height:1px;background:rgba(11,31,51,.18)}
.dates{margin-top:34px;display:grid;gap:18px}
.d{background:rgba(255,255,255,.7);border:1px solid rgba(11,31,51,.12);border-left:5px solid #c81e1e;border-radius:4px;padding:22px 26px;display:flex;gap:26px;align-items:center}
.d .n{font:400 64px/1 IS;color:#c81e1e;min-width:200px}
.d p{font:400 30px/1.35 PJ}.d p b{color:#0b1f33}
.close{background:#0b1f33;border-radius:6px;padding:54px 50px;color:#cbd5e1}
.close h2{color:#fff;font-size:96px}.close h2 em{color:#f87171}
.close p{margin-top:22px;font:400 36px/1.45 PJ}
.cta{display:inline-block;margin-top:34px;background:#dc2626;color:#fff;font:700 36px/1 PJ;padding:30px 36px;border-radius:4px}
.src{margin-top:34px;font:400 22px/1.45 PJ;color:#64748b}
.foot{position:absolute;left:84px;right:84px;bottom:250px;z-index:2;display:flex;justify-content:space-between;align-items:flex-end;font:600 24px/1.45 PJ;color:#64748b}
.foot b{color:#0b1f33}
`;
const page = (body, i, n, bg) => `<!doctype html><html><head><meta charset="utf-8"><style>${css}</style></head><body><div class="s"><div class="dots"></div>${bg ? `<div class="bgart">${BG(bg)}</div>` : ''}
<div class="z top"><img src="${LOGO}" alt="ROMS"><span class="count">${String(i).padStart(2,'0')} / ${String(n).padStart(2,'0')}</span></div>
<div class="z mid">${body}</div>
<div class="foot"><span><b>L.C.F. Odet Romero</b><br>León, Guanajuato</span><span>@romstaxaccountingmx</span></div></div></body></html>`;

const close = (txt, src) => `<div class="close"><h2>¿Qué <em>sigue</em>?</h2><p>${txt}</p><span class="cta">Escríbenos · 479 390 0639</span></div><p class="src">${src}</p>`;

const sets = {
 'historia-resico-2027': { bg: 'chart-line', pages: [
  `<p class="kicker">RESICO · Personas físicas</p><h1>Lo que cambia para ti en <em>2027</em></h1>
   <p class="lead">Reforma publicada en el <b>Diario Oficial el 13 de noviembre de 2026</b>. Aplica desde el <b>1 de enero de 2027</b>.</p>
   <div class="hero"><p class="old">Antes $3.5 M</p><div class="big">$5 M</div><p>Nuevo <b>límite de ingresos al año</b> para tributar en RESICO como persona física.</p></div>`,
  `<p class="kicker">01 · Lo que cambia</p><h2>Dos <em>novedades</em></h2>
   ${item('rotate-ccw', 'Puedes regresar a RESICO', 'Si saliste del régimen, podrás volver al año siguiente si tus ingresos del año anterior no pasan de <b>$5 millones</b> y estás al corriente. El SAT definirá el trámite.')}
   ${item('percent', 'IVA opcional de 7%', 'Pagas IVA aplicando <b>7% a lo que cobras</b>, sin restar el IVA de tus gastos. Se elige con aviso al SAT dentro de los <b>30 días</b> siguientes a tu primer cobro del año. No le conviene a todos.')}`,
  `<p class="kicker">02 · Lo que no cambia</p><h2>Se <em>mantiene</em></h2>
   ${item('scale', 'Tasas de ISR de 1% a 2.5%', 'Sobre tus <b>ingresos efectivamente cobrados</b>, con pagos mensuales.')}
   ${item('shield-check', 'Cumplimiento puntual', 'Declaraciones a tiempo, <b>buzón tributario</b> activo y <b>e.firma vigente</b>.')}
   ${item('eye', 'En 2026 el tope sigue en $3.5 M', 'Nosotros vigilamos tus ingresos para que no rebases el límite.')}
   <div class="dates"><div class="d"><div class="n">17 dic</div><p>Vence la <b>declaración de noviembre</b></p></div><div class="d"><div class="n">18 ene</div><p>Vence la <b>declaración de diciembre</b></p></div></div>`,
  close('En ROMS revisamos tu caso y te decimos si en 2027 te conviene el IVA de 7%, regresar a RESICO o mantener tu régimen actual.', 'Fuentes: reforma a la LISR (art. 113-E) y Ley de Ingresos 2027 (art. 25, fr. XVIII), DOF 13/11/2026.')
 ]},
 'historia-pfae-2027': { bg: 'briefcase', pages: [
  `<p class="kicker">Actividad empresarial y profesional</p><h1>2027: lo que debes saber si eres <em>PFAE</em></h1>
   <p class="lead">La reforma del <b>13 de noviembre de 2026</b> no cambia tu tarifa ni tus deducciones, pero abre una opción importante.</p>
   <div class="hero"><p class="old">Antes $3.5 M</p><div class="big">$5 M</div><p>Si en 2026 ingresaste <b>hasta $5 millones</b>, podrías pasarte a RESICO en 2027.</p></div>`,
  `<p class="kicker">01 · Lo que se abre en 2027</p><h2>Tres <em>novedades</em></h2>
   ${item('arrow-right-left', 'Opción de cambiarte a RESICO', 'ISR de <b>1% a 2.5%</b> sobre lo que cobras, sin deducciones para ISR. Si tus gastos deducibles son altos, el régimen general puede salir mejor.')}
   ${item('badge-percent', 'Estímulo de regularización', 'Adeudos de <b>2025 o antes</b>: 100% de descuento en multas y recargos, pagando en una sola exhibición a más tardar el <b>31 de diciembre de 2027</b>.')}
   ${item('landmark', 'Retención por intereses: 0.68%', 'La retención anual de ISR de los bancos sobre tus inversiones en 2027.')}`,
  `<p class="kicker">02 · Lo que no cambia</p><h2>Se <em>mantiene</em></h2>
   ${item('scale', 'Tarifa de ISR y deducciones', 'La tarifa (hasta 35%), tus <b>deducciones autorizadas</b> y los <b>pagos provisionales</b> mensuales.')}
   ${item('receipt', 'Deducciones personales', 'Tope: <b>15% de tus ingresos o $213,973.20</b>, lo menor. Pagadas en 2026, con factura y sin efectivo.')}
   <div class="dates"><div class="d"><div class="n">17 dic</div><p>Vence la <b>declaración de noviembre</b></p></div><div class="d"><div class="n">31 dic</div><p>Último día para pagar <b>deducciones personales</b></p></div><div class="d"><div class="n">Abril</div><p><b>Declaración anual</b> 2026</p></div></div>`,
  close('En ROMS hacemos los números contigo para saber si en 2027 te conviene seguir en el régimen general o pasarte a RESICO.', 'Fuentes: reforma a la LISR (art. 113-E), Ley de Ingresos 2027 (art. 24 y transitorio vigésimo primero), DOF 13/11/2026; art. 151 LISR.')
 ]}
};

(async () => {
  const out = process.argv[2]; fs.mkdirSync(out, { recursive: true });
  const b = await chromium.launch();
  const p = await b.newPage({ viewport: { width: 1080, height: 1920 } });
  for (const [id, set] of Object.entries(sets)) {
    for (const [i, body] of set.pages.entries()) {
      await p.setContent(page(body, i + 1, set.pages.length, i === 0 ? set.bg : null));
      await p.evaluate(() => document.fonts.ready);
      const over = await p.evaluate(() => { const m = document.querySelector('.mid'), f = document.querySelector('.foot'); const kids=[...m.children]; const last=kids[kids.length-1].getBoundingClientRect().bottom; const first=kids[0].getBoundingClientRect().top; return last > f.getBoundingClientRect().top - 20 || first < 380; });
      if (over) console.log('DESBORDA', id, i + 1);
      await p.screenshot({ path: path.join(out, `${id}-${i + 1}.png`) });
    }
  }
  await b.close(); console.log('ok');
})();
