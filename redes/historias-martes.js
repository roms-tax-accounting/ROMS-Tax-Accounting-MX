// Historias destacadas de los martes de diciembre (1080x1920) y carátula. Uso: node historias-martes.js salida/
const { chromium } = require('playwright');
const fs = require('fs'), path = require('path');
const R = __dirname;
const F = p => 'data:font/woff2;base64,' + fs.readFileSync(path.join(R, 'node_modules/@fontsource', p)).toString('base64');
const LOGOC = 'data:image/png;base64,' + fs.readFileSync(path.join(R, 'marca/logo_monograma_claro.png')).toString('base64');
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

.s.dark{background:radial-gradient(900px 800px at 0% 0%,rgba(65,201,226,.10),transparent 62%),radial-gradient(900px 800px at 100% 100%,rgba(220,38,38,.22),transparent 60%),#0b1f33;color:#cbd5e1}
.dark .bgart{color:#e8edf3;opacity:.05}
.dark .kicker{color:#f87171}.dark .kicker::before{background:#f87171}
.dark h1,.dark h2{color:#fff}.dark h1 em,.dark h2 em{color:#f87171}
.dark .lead b{color:#fff}
.dark .foot{color:#94a3b8}.dark .foot b{color:#fff}
.dark .count{color:#94a3b8}
.dark .ic{color:#fff;border-color:rgba(248,113,113,.8);background:rgba(255,255,255,.04)}
.dark h4{color:#fff}.dark .it p b{color:#fff}
.dark .src{color:#94a3b8}
.tap{margin-top:70px;font:500 24px/1.3 PX;letter-spacing:.16em;text-transform:uppercase;color:#94a3b8}
.mega{margin-top:46px;font:400 230px/.9 IS;color:#fff;letter-spacing:-.02em}.mega.sm{font-size:170px}
.megap{margin-top:26px;font:400 40px/1.4 PJ;color:#cbd5e1}.megap b{color:#fff}
.quote{margin-top:44px;border-left:6px solid #dc2626;padding:8px 0 8px 36px;font:400 64px/1.12 IS;color:#fff}.quote em{color:#f87171}
.chk{margin-top:28px;display:grid;gap:22px}
.chk div{display:flex;gap:22px;align-items:center;font:400 38px/1.3 PJ;color:#fff}
.chk svg{color:#f87171;flex:none}
.cta{margin-top:56px;align-self:flex-start}
.rt{display:flex;align-items:center;gap:26px}
.tk{width:118px;height:118px;border-radius:50%;display:grid;place-items:center;color:#fff;background:radial-gradient(circle at 35% 30%,#ef4444,#c81e1e 55%,#9b1515);box-shadow:0 0 0 6px #0b1f33,0 0 0 8px rgba(248,113,113,.6)}
.s:not(.dark) .tk{box-shadow:0 0 0 6px #f4f0e8,0 0 0 8px rgba(200,30,30,.45)}
`;
const TK = n => `<span class="tk">${ICON(n, 62).replace('stroke-width="1.6"','stroke-width="1.8"')}</span>`;
const page = (body, i, n, bg, dark, tok) => `<!doctype html><html><head><meta charset="utf-8"><style>${css}</style></head><body><div class="s${dark?' dark':''}"><div class="dots"></div>${bg ? `<div class="bgart">${BG(bg)}</div>` : ''}
<div class="z top"><img src="${dark?LOGOC:LOGO}" alt="ROMS"><span class="rt"><span class="count">${String(i).padStart(2,'0')} / ${String(n).padStart(2,'0')}</span>${tok?TK(tok):''}</span></div>
<div class="z mid">${body}</div>
<div class="foot"><span><b>L.C.F. Odet Romero</b><br>León, Guanajuato</span><span>@romstaxaccountingmx</span></div></div></body></html>`;

const close = (txt, src) => `<div class="close"><h2>¿Qué <em>sigue</em>?</h2><p>${txt}</p><span class="cta">Escríbenos · 479 390 0639</span></div><p class="src">${src}</p>`;

const CK = t => `<div>${ICON('circle-check', 46)}<span>${t}</span></div>`;
const CTA = '<span class="cta">Escríbeme · 479 390 0639</span>';
const TAP = '<p class="tap">Toca para ver más →</p>';

// Cada historia: [html, oscura?]
const sets = {
 'hist-abrir-negocio': { bg: 'lightbulb', pages: [
  [`<p class="kicker">Antes de emprender</p><h1>¿Vas a abrir tu <em>negocio</em>?</h1>
    <p class="lead">Los errores más caros se cometen <b>antes de la primera venta</b>. Estos son los 5 básicos que reviso con cada persona que empieza.</p>${TAP}`, true],
  [`<p class="kicker">Los 5 básicos</p><h2>Antes de darte de <em>alta</em></h2>
    ${item('wallet', 'Una cuenta solo del negocio', 'Es lo primero: sin mezclar con lo personal.')}
    ${item('receipt', 'Factura todo', 'Cada gasto e inversión, a tu RFC.')}
    ${item('book-open-check', 'Todo se contabiliza', 'Ventas, compras, pagos y depósitos.')}
    ${item('layers', '¿Gasto o costo?', '<b>Costo</b>: lo que va en tu producto. <b>Gasto</b>: lo que mantiene abierto el negocio.')}
    ${item('tag', 'Precio bien calculado', 'Costo + parte de gastos + utilidad.')}`, false],
  [`<p class="kicker">Lo más importante</p><p class="quote">Si tus precios no consideran tus impuestos, <em>trabajas gratis</em>.</p>
    <p class="megap">Empieza con el <b>panorama completo</b>: régimen, cuentas, facturación y precios. Te atiendo personalmente.</p>${CTA}`, true]
 ]},
 'hist-antes-de-comprar': { bg: 'car', pages: [
  [`<p class="kicker">Antes de comprar</p><h1>¿Vas por <em>coche</em> o <em>casa</em>?</h1>
    <p class="lead">Antes de firmar, revisa el <b>efecto fiscal</b>. Comprar a ciegas te puede costar beneficios que vas a necesitar después.</p>${TAP}`, true],
  [`<p class="kicker">4 cosas que cambian todo</p><h2>Antes de <em>firmar</em></h2>
    ${item('user-check', '¿A nombre de quién?', 'No es lo mismo como asalariado, con actividad empresarial o como empresa.')}
    ${item('car-front', 'El auto tiene tope', 'Lo que pase del límite no se deduce.')}
    ${item('search-check', 'Tu dinero debe cuadrar', 'El SAT compara lo que compras con lo que declaras.')}
    ${item('file-check', 'Paga y documenta bien', 'Transferencia, factura o escritura a tu nombre y origen del dinero.')}`, false],
  [`<p class="kicker">El dato</p><div class="mega sm">$175,000</div>
    <p class="megap">es lo máximo que puedes deducir de un <b>auto de combustión</b>, a 25% por año, si tu actividad lo permite.</p>${CTA}
    <p class="src">Arts. 34 y 36, fr. II de la LISR.</p>`, true]
 ]},
 'hist-movimientos-bancarios': { bg: 'landmark', pages: [
  [`<p class="kicker">Tus cuentas bancarias</p><h1>¿Mueves dinero entre <em>cuentas</em>?</h1>
    <p class="lead">Cada depósito, traspaso o pago puede <b>llegar al SAT</b>, y se compara con tus facturas y declaraciones.</p>${TAP}`, true],
  [`<p class="kicker">Lo que el SAT ve</p><h2>Mover dinero no es tan <em>simple</em></h2>
    ${item('banknote', 'Efectivo', 'Más de <b>$15,000</b> al mes: tu banco lo reporta.')}
    ${item('arrow-left-right', 'Traspasos entre tus cuentas', 'Identifícalos para que no parezcan ingresos.')}
    ${item('hand-coins', 'Préstamos de familiares', 'Con contrato y comprobante.')}`, false],
  [`<p class="kicker">Lo más importante</p><p class="quote">Un préstamo no es un ingreso, pero si nadie lo documenta, <em>puede parecerlo</em>.</p>
    <p class="megap">Tu <b>contabilidad</b> es la que explica cada movimiento antes de que el SAT pregunte.</p>${CTA}
    <p class="src">Depósitos en efectivo: art. 55, fr. IV de la LISR.</p>`, true]
 ]},
 'hist-auditoria': { bg: 'search', pages: [
  [`<p class="kicker">Defensa fiscal</p><h1>¿Sabes para qué es una <em>auditoría</em>?</h1>
    <p class="lead">Su objeto es <b>comprobar que pagaste bien tus impuestos</b> y cumpliste tus obligaciones.</p>${TAP}`, true],
  [`<p class="kicker">Cómo puede llegar</p><h2>De tres <em>formas</em></h2>
    ${item('house', 'Visita domiciliaria', 'El SAT acude a tu domicilio fiscal.')}
    ${item('folder-open', 'Revisión de gabinete', 'Te piden documentos para revisarlos.')}
    ${item('inbox', 'Revisión electrónica', 'Por tu buzón tributario.')}
    <p class="src">Art. 42 del Código Fiscal de la Federación.</p>`, false],
  [`<p class="kicker">La pregunta</p><h2>¿Tendrías esto <em>hoy</em>?</h2>
    <div class="chk">${CK('Contabilidad al día')}${CK('CFDI de ingresos y gastos')}${CK('Estados de cuenta')}${CK('Contratos y evidencia')}</div>
    <p class="megap">Revisamos tu expediente <b>antes de que lo haga el SAT</b>.</p>${CTA}`, true]
 ]},
 'hist-empieza-a-facturar': { bg: 'receipt-text', pages: [
  [`<p class="kicker">Facturación</p><h1>¿Tu negocio aún no <em>factura</em>?</h1>
    <p class="lead"><b>Estás perdiendo clientes.</b> No te quedes atrás y no le temas a pagar impuestos.</p>${TAP}`, true],
  [`<p class="kicker">Por qué facturar</p><h2>Facturar te abre <em>puertas</em></h2>
    ${item('users', 'Tus clientes lo necesitan', 'Sin CFDI no pueden deducir lo que te compran.')}
    ${item('trending-up', 'Más oportunidades', 'Empresas, licitaciones, plataformas y créditos.')}
    ${item('user-search', 'Analizamos tu perfil', 'Elegimos el régimen y la estrategia para optimizar tu carga tributaria, dentro de la ley.')}`, false],
  [`<p class="kicker">El dato</p><div class="mega sm">1% a 2.5%</div>
    <p class="megap">de ISR sobre lo que cobras pagan las personas físicas en <b>RESICO</b>. Pagar impuestos no tiene que asustarte.</p>${CTA}
    <p class="src">Art. 113-E de la LISR. CFDI para deducir: art. 27, fr. IV de la LISR.</p>`, true]
 ]}
};

const cover = (icon) => `<!doctype html><html><head><meta charset="utf-8"><style>
*{margin:0;box-sizing:border-box}html,body{width:1080px;height:1920px;overflow:hidden}
.c{width:1080px;height:1920px;display:grid;place-items:center;background:radial-gradient(700px 700px at 50% 50%,rgba(220,38,38,.28),transparent 70%),#0b1f33}
.r{width:640px;height:640px;border-radius:50%;background:radial-gradient(circle at 35% 30%,#ef4444,#c81e1e 55%,#9b1515);display:grid;place-items:center;box-shadow:0 0 0 18px #0b1f33,0 0 0 22px rgba(248,113,113,.55)}
.r svg{color:#fff}
</style></head><body><div class="c"><div class="r">${fs.readFileSync(path.join(R,'node_modules/lucide-static/icons',icon+'.svg'),'utf8').replace(/<!--[\s\S]*?-->/g,'').replace(/width="24"/,'width="300"').replace(/height="24"/,'height="300"').replace(/stroke-width="2"/,'stroke-width="1.4"')}</div></div></body></html>`;

(async () => {
  const out = process.argv[2]; fs.mkdirSync(out, { recursive: true });
  const b = await chromium.launch();
  const p = await b.newPage({ viewport: { width: 1080, height: 1920 } });
  for (const [id, set] of Object.entries(sets)) {
    for (const [i, [body, dark]] of set.pages.entries()) {
      await p.setContent(page(body, i + 1, set.pages.length, i === 0 ? set.bg : null, dark, set.bg));
      await p.evaluate(() => document.fonts.ready);
      const over = await p.evaluate(() => { const m = document.querySelector('.mid'), f = document.querySelector('.foot'); const kids=[...m.children]; const last=kids[kids.length-1].getBoundingClientRect().bottom; const first=kids[0].getBoundingClientRect().top; return last > f.getBoundingClientRect().top - 20 || first < 380; });
      if (over) console.log('DESBORDA', id, i + 1);
      await p.screenshot({ path: path.join(out, `${id}-${i + 1}.png`) });
    }
  }
  for (const ic of Object.values(sets).map(x=>x.bg)) {
    await p.setContent(cover(ic)); await p.screenshot({ path: path.join(out, `caratula-${Object.keys(sets).find(k=>sets[k].bg===ic).replace('hist-','')}.png`) });
  }
  await b.close(); console.log('ok');
})();
