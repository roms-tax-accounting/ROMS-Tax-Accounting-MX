// Renderiza piezas de redes de ROMS a PNG con Playwright. Uso: node render.js piezas.json salida/
const { chromium } = require('playwright');
const fs = require('fs'), path = require('path');
const F = p => 'data:font/woff2;base64,' + fs.readFileSync(path.join(__dirname, 'node_modules/@fontsource', p)).toString('base64'); // npm install en redes/
const IMG = n => {
  const cands = [path.join(__dirname, n), path.join(__dirname, 'fotos', n), path.join(__dirname, '..', 'assets', 'img', n)];
  const f = cands.find(c => fs.existsSync(c));
  if (!f) throw new Error('No encuentro la imagen ' + n);
  return 'data:image/' + (n.endsWith('.png') ? 'png' : 'jpeg') + ';base64,' + fs.readFileSync(f).toString('base64');
};
const css = `
@font-face{font-family:IS;src:url(${F('instrument-serif/files/instrument-serif-latin-400-normal.woff2')})}
@font-face{font-family:IS;font-style:italic;src:url(${F('instrument-serif/files/instrument-serif-latin-400-italic.woff2')})}
@font-face{font-family:PJ;font-weight:400;src:url(${F('plus-jakarta-sans/files/plus-jakarta-sans-latin-400-normal.woff2')})}
@font-face{font-family:PJ;font-weight:600;src:url(${F('plus-jakarta-sans/files/plus-jakarta-sans-latin-600-normal.woff2')})}
@font-face{font-family:PJ;font-weight:700;src:url(${F('plus-jakarta-sans/files/plus-jakarta-sans-latin-700-normal.woff2')})}
@font-face{font-family:PX;src:url(${F('ibm-plex-mono/files/ibm-plex-mono-latin-500-normal.woff2')})}
*{box-sizing:border-box;margin:0}
html,body{width:var(--w);height:var(--h);background:#060d16;overflow:hidden}
.s{position:relative;width:var(--w);height:var(--h);padding:88px 84px;display:flex;flex-direction:column;color:#cbd5e1;font-family:PJ;
 background:radial-gradient(900px 700px at 0% 0%,rgba(16,42,67,.95),transparent 65%),radial-gradient(700px 600px at 100% 100%,rgba(220,38,38,.10),transparent 60%),#060d16}
.s.photo::before{content:"";position:absolute;inset:0;background:var(--img) center/cover;opacity:.55}
.s.photo.portrait::before{opacity:1;background-position:center 12%}
.s.photo.portrait::after{background:linear-gradient(180deg,rgba(6,13,22,.55) 0%,rgba(6,13,22,0) 18%,rgba(6,13,22,0) 52%,rgba(6,13,22,.88) 70%,#060d16 84%)}
.s.portrait .mid{justify-content:flex-end;gap:22px;padding-bottom:36px}.s.portrait h1{font-size:88px}.s.portrait p.b{font-size:32px}.s.portrait .note{font-size:28px}
.s.photo::after{content:"";position:absolute;inset:0;background:linear-gradient(180deg,rgba(6,13,22,.55) 0%,rgba(6,13,22,.35) 35%,rgba(6,13,22,.92) 75%,#060d16)}
.dots{position:absolute;right:0;top:0;width:420px;height:420px;opacity:.35;background-image:radial-gradient(#ef4444 2px,transparent 2.4px);background-size:28px 28px;
 -webkit-mask-image:radial-gradient(circle at 100% 0%,#000 0%,transparent 70%)}
.grain{position:absolute;inset:0;opacity:.08;mix-blend-mode:overlay;background-image:url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='200' height='200'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='.9' numOctaves='2'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")}
.z{position:relative;z-index:2}
.top{display:flex;justify-content:space-between;align-items:center}
.brand{display:grid;gap:6px}.brand b{font:400 46px/0.9 IS;color:#e8edf3;letter-spacing:.02em}.brand span{font:500 14px/1 PX;letter-spacing:.24em;color:#ef4444}
.count{font:500 20px/1 PX;color:#94a3b8;letter-spacing:.1em}
.mid{flex:1;display:flex;flex-direction:column;justify-content:center;gap:34px}
.kicker{font:500 22px/1.3 PX;letter-spacing:.16em;text-transform:uppercase;color:#ef4444;display:flex;align-items:center;gap:18px}
.kicker::before{content:"";width:48px;height:2px;background:#ef4444}
h1{font:400 112px/1.0 IS;color:#e8edf3;letter-spacing:-.01em}
h1.t-m{font-size:96px} h1.t-s{font-size:84px}
h1 em,h2 em{color:#f87171}
h2{font:400 76px/1.05 IS;color:#e8edf3}
.reel h2{font-size:104px}.reel h1{font-size:128px}.reel .n{font-size:200px}
.n{font:400 150px/0.8 IS;color:#ef4444}
p.b{font:400 38px/1.45 PJ;color:#cbd5e1;max-width:880px}
p.b strong{color:#e8edf3;font-weight:700}
.big{font:400 190px/0.9 IS;color:#e8edf3;letter-spacing:-.02em}
.big.sky{color:#41c9e2}
.rule{height:2px;background:linear-gradient(90deg,#ef4444,rgba(239,68,68,0));width:260px}
.note{border-left:3px solid #ef4444;padding:6px 0 6px 28px;font:400 32px/1.45 PJ;color:#cbd5e1}
.foot{display:flex;justify-content:space-between;align-items:flex-end;font:600 22px/1.4 PJ;color:#94a3b8}
.foot b{color:#e8edf3;font-weight:700}
.cta{display:inline-flex;align-self:flex-start;background:#dc2626;color:#fff;font:700 30px/1 PJ;padding:26px 34px;border-radius:3px}
.swipe{font:500 22px/1 PX;color:#94a3b8;letter-spacing:.12em}
.list{display:grid;gap:26px}.list div{display:grid;grid-template-columns:56px 1fr;font:400 36px/1.4 PJ;color:#cbd5e1}.list div::before{content:"—";color:#ef4444}
`;
const md = t => String(t||'').replace(/\*\*(.+?)\*\*/g,'<strong>$1</strong>').replace(/\*(.+?)\*/g,'<em>$1</em>');
function slide(s, i, total, size) {
  const cls = ["s"]; if (size.h > 1500) cls.push("reel"); if (s.photo) cls.push('photo'); if (s.portrait) cls.push('portrait');
  const style = s.photo ? `--img:url(${IMG(s.photo)})` : '';
  const counter = total > 1 ? `<span class="count">${String(i+1).padStart(2,'0')} / ${String(total).padStart(2,'0')}</span>` : '';
  let mid = '';
  if (s.kicker) mid += `<p class="kicker">${md(s.kicker)}</p>`;
  if (s.n) mid += `<p class="n">${s.n}</p>`;
  if (s.big) mid += `<p class="big ${s.bigClass||''}">${s.big}</p>`;
  if (s.title) mid += `<h1 class="${s.tsize ? 't-'+s.tsize : ''}">${md(s.title)}</h1>`;
  if (s.h2) mid += `<h2>${md(s.h2)}</h2>`;
  if (s.rule) mid += `<div class="rule"></div>`;
  if (s.body) mid += `<p class="b">${md(s.body)}</p>`;
  if (s.list) mid += `<div class="list">${s.list.map(x=>`<div>${md(x)}</div>`).join('')}</div>`;
  if (s.note) mid += `<p class="note">${md(s.note)}</p>`;
  if (s.cta) mid += `<span class="cta">${md(s.cta)}</span>`;
  const right = s.swipe ? '<span class="swipe">DESLIZA →</span>' : '<span>@romstaxaccountingmx</span>';
  return `<div class="${cls.join(' ')}" style="${style}">${s.photo?'':'<div class="dots"></div>'}<div class="grain"></div>
   <div class="z top"><div class="brand"><b>ROMS</b><span>TAX &amp; ACCOUNTING MX</span></div>${counter}</div>
   <div class="z mid" style="${size.h>1500?'justify-content:flex-end;padding-bottom:180px':''}">${mid}</div>
   <div class="z foot"><span><b>L.C.F. Odet Romero</b><br>León, Guanajuato</span>${right}</div></div>`;
}
(async () => {
  const [specFile, outDir] = process.argv.slice(2);
  const pieces = JSON.parse(fs.readFileSync(specFile, 'utf8'));
  fs.mkdirSync(outDir, { recursive: true });
  const b = await chromium.launch();
  for (const pc of pieces) {
    const size = pc.size === 'reel' ? { w: 1080, h: 1920 } : { w: 1080, h: 1350 };
    const p = await b.newPage({ viewport: { width: size.w, height: size.h } });
    for (const [i, s] of pc.slides.entries()) {
      await p.setContent(`<!doctype html><html><head><meta charset="utf-8"><style>:root{--w:${size.w}px;--h:${size.h}px}${css}</style></head><body>${slide(s, i, pc.slides.length, size)}</body></html>`);
      await p.evaluate(() => document.fonts.ready);
      const name = pc.slides.length > 1 ? `${pc.id}-${i+1}.png` : `${pc.id}.png`;
      await p.screenshot({ path: path.join(outDir, name) });
    }
    await p.close();
  }
  await b.close(); console.log('ok');
})();
