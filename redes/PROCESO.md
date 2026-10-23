# Contenido mensual de redes · ROMS | Tax & Accounting MX

Instrucciones para preparar, diseñar y programar cada mes los posts y reels de Instagram y Facebook de ROMS.
Las sigue la tarea programada mensual (y cualquier sesión de Claude que retome el trabajo).

## Cuentas y herramientas
- Instagram: @romstaxaccountingmx (antes @romerointegratedservices; cuenta de empresa, vinculada a la página de Facebook).
- Facebook: página "ROMS Tax & Accounting MX".
- Publicación: Postiz, a través del conector de Postiz en Claude (herramientas `integrationList`, `integrationSchema`,
  `uploadFromUrlTool`, `integrationSchedulePostTool`, `postsListTool`, `deletePostTool`).
  En Postiz el Instagram es `ROMS | Tax & Accounting MX` (identifier `instagram`) y Facebook `ROMS Tax & Accounting MX`
  (identifier `facebook`). Confirma sus ids con `integrationList` antes de programar.
- Calendario para aprobación: un documento de Claude Docs por mes, como "Calendario de contenido ROMS · Noviembre 2026".
- Diseños: `redes/render.js` (posts 1080×1350 y portadas de reel 1080×1920) y `redes/mkreel.py` (reels animados).

## Ritmo y horarios (hora del centro de México)
- 3 posts por semana: lunes, miércoles y viernes a la 1:00 p. m. (19:00 UTC).
- 1 reel por semana, jueves a las 8:00 p. m. (02:00 UTC del viernes).
- Por mes: 2 reels con Odet a cámara (ella los graba; tú das el guion y la portada) y el resto animados.
- Cada pieza se publica en Instagram y en Facebook con el mismo texto.

## Voz y reglas de contenido
- Español de México, tú al cliente. Odet habla en primera persona: "te respondo personalmente", "yo misma te atiendo".
  Firma: L.C.F. Odet Romero, León, Guanajuato.
- RESICO: el enfoque es evitar discrepancias fiscales (que depósitos, facturas y declaraciones cuadren), no "ahorrar impuestos".
- Temas: calendario fiscal real del mes (declaración mensual del 17, anual de personas físicas en abril, aguinaldo, PTU en mayo,
  cierre fiscal en diciembre), RESICO, deducciones, nómina e IMSS, defensa fiscal y materialidad, LLC y comercio exterior.
- Al menos 1 post al mes lleva a la agenda: https://roms-tax-accounting.github.io/ROMS-Tax-Accounting-MX/agendar/
  (asesoría fiscal o contable y financiera, $600 por hora, pago al terminar, en una cafetería de la zona o en el domicilio).
- Toda cifra (UMA, salario mínimo, tarifas, fechas) se verifica en fuentes vigentes y se cita en el calendario.
  Nunca inventes testimonios ni reseñas de clientes.
- Texto del post: 3 a 5 párrafos cortos, cierre con invitación a escribir o a agendar, 4 a 6 hashtags
  (#ContadorLeón #LeónGuanajuato y los del tema).

## Diseño
- Estilo del sitio: fondo azul marino, títulos en serif (Instrument Serif) con la palabra clave en rojo (`*palabra*`),
  texto en Plus Jakarta Sans, etiquetas en IBM Plex Mono, malla de puntos rojos, firma de Odet abajo.
- Especificaciones de ejemplo en `redes/plantillas/*.json`. Cada lámina acepta: `kicker`, `title` (+ `tsize` m o s),
  `h2`, `n` (número grande), `big` (+ `bigClass: "sky"`), `body`, `list`, `note`, `cta`, `rule`, `swipe`,
  `photo` (archivo de `assets/img/` o `redes/fotos/`), `portrait` (foto de persona con texto abajo). `"size":"reel"` = 1080×1920.
- Render:
  ```
  cd redes && npm install
  node render.js plantillas/<mes>.json out
  node render.js plantillas/<mes>-reels.json reelframes
  python3 mkreel.py <prefijo-del-reel> out/<nombre>.mp4 reelframes
  ```
  (Playwright debe estar disponible; usa NODE_PATH=$(npm root -g) si está instalado globalmente.)
- Revisa visualmente al menos una lámina de cada tipo antes de subir.

## Subir y programar
1. Copia los archivos finales a `redes/media/<AAAA-MM>/`, haz commit y push a una rama `redes-<AAAA-MM>`.
   Las URL públicas quedan como
   `https://raw.githubusercontent.com/roms-tax-accounting/ROMS-Tax-Accounting-MX/redes-<AAAA-MM>/redes/media/<AAAA-MM>/<archivo>`.
2. Sube cada archivo con `uploadFromUrlTool` y usa el `path` que devuelve.
3. Lee `integrationSchema` de cada canal y respeta sus reglas: Instagram necesita `post_type: "post"`;
   a los reels animados de Instagram puedes agregar música con la herramienta `audioSearch` y el ajuste `audio`
   (`audio_volume` 70). Facebook: `post_type: "post"`.
4. Primero crea todo como **borrador** (`type: "draft"`). Solo cuando Odet apruebe el calendario, cámbialo a programado
   (borra el borrador y vuelve a crearlo con `type: "schedule"`, misma fecha).
5. Verifica con `postsListTool` que cada pieza esté dos veces (Instagram y Facebook) en la fecha correcta.

## Aprobación
- Odet aprueba en el documento del calendario (columna Estado: Por revisar / Aprobado / Cambiar) o respondiendo en la sesión.
- Nada se programa como publicación definitiva sin su aprobación.
- Los reels a cámara se programan cuando ella mande los videos; ponles la portada diseñada como `thumbnail`.
