// Carátula de destacada (1080x1920): círculo rojo con ícono blanco sobre azul marino. Uso: node caratula.js icono salida.png
const { chromium } = require('playwright'); const fs = require('fs'), path = require('path');
const [icon, out] = process.argv.slice(2);
const svg = fs.readFileSync(path.join(__dirname,'node_modules/lucide-static/icons',icon+'.svg'),'utf8').replace(/<!--[\s\S]*?-->/g,'').replace(/width="24"/,'width="300"').replace(/height="24"/,'height="300"').replace(/stroke-width="2"/,'stroke-width="1.4"');
const html = `<!doctype html><html><head><meta charset="utf-8"><style>*{margin:0;box-sizing:border-box}html,body{width:1080px;height:1920px;overflow:hidden}
.c{width:1080px;height:1920px;display:grid;place-items:center;background:radial-gradient(700px 700px at 50% 50%,rgba(220,38,38,.28),transparent 70%),#0b1f33}
.r{width:640px;height:640px;border-radius:50%;background:radial-gradient(circle at 35% 30%,#ef4444,#c81e1e 55%,#9b1515);display:grid;place-items:center;box-shadow:0 0 0 18px #0b1f33,0 0 0 22px rgba(248,113,113,.55),0 0 0 40px #0b1f33,0 0 0 56px #f4f0e8}
.r svg{color:#fff}</style></head><body><div class="c"><div class="r">${svg}</div></div></body></html>`;
(async()=>{const b=await chromium.launch();const p=await b.newPage({viewport:{width:1080,height:1920}});await p.setContent(html);await p.screenshot({path:out});await b.close();})();
