/**
 * Agenda ROMS | Tax & Accounting MX
 * Programa para Google Apps Script que conecta la página /agendar con tu Google Calendar.
 *
 * Qué hace:
 *  - Muestra a tus clientes solo los horarios libres de tu calendario.
 *  - Crea la cita en tu Google Calendar con todos los datos del cliente.
 *  - Te avisa por correo de cada cita nueva (y al cliente, si dejó su correo, le llega la invitación).
 *  - Cada día a las 9:00 te manda por correo las citas del día con un botón de WhatsApp
 *    para enviarle el recordatorio a cada cliente.
 *
 * Instalación: ver apps-script/INSTRUCCIONES.md
 */

const CONFIG = {
  CALENDARIO: 'primary',            // 'primary' = tu calendario principal de Google
  ZONA: 'America/Mexico_City',
  OFFSET: '-06:00',                 // Centro de México (sin horario de verano)
  DURACION_MIN: 60,
  DESCANSO_MIN: 30,                 // espacio libre entre citas
  ANTICIPACION_HORAS: 12,           // no se puede agendar con menos de 12 h de anticipación
  DIAS_ADELANTE: 30,
  // 1 = lunes … 6 = sábado, 7 = domingo. [inicio, fin]; la cita debe terminar antes del fin.
  HORARIO: {
    1: [['19:00', '21:00']], 2: [['19:00', '21:00']], 3: [['19:00', '21:00']],
    4: [['19:00', '21:00']], 5: [['19:00', '21:00']],
    6: [['13:00', '17:00']]
  },
  SERVICIOS: { fiscal: 'Asesoría Fiscal', contable: 'Asesoría Contable y Financiera' },
  PRECIO: 600,
  WHATSAPP_ODET: '524776461540',
  MARCA: '[Agenda ROMS]',           // etiqueta para reconocer las citas creadas desde el sitio
  HORA_RESUMEN: 9                   // hora del correo diario con las citas del día
};

/* ---------------- Puntos de entrada ---------------- */

function doGet(e) {
  const accion = (e && e.parameter && e.parameter.action) || '';
  if (accion === 'slots') return responder({ ok: true, zona: CONFIG.ZONA, dias: horariosDisponibles() });
  return responder({ ok: true, servicio: 'Agenda ROMS activa' });
}

function doPost(e) {
  let d;
  try { d = JSON.parse(e.postData.contents); } catch (err) { return responder({ ok: false, error: 'Solicitud inválida.' }); }
  if (d.website) return responder({ ok: true }); // trampa para bots

  const error = validar(d);
  if (error) return responder({ ok: false, error: error });

  const lock = LockService.getScriptLock();
  if (!lock.tryLock(15000)) return responder({ ok: false, error: 'La agenda está ocupada, intenta de nuevo en unos segundos.' });
  try {
    const dia = horariosDisponibles().find(x => x.fecha === d.fecha);
    if (!dia || dia.horas.indexOf(d.hora) === -1) {
      return responder({ ok: false, codigo: 'ocupado', error: 'Ese horario se acaba de ocupar. Elige otro, por favor.' });
    }
    const inicio = new Date(d.fecha + 'T' + d.hora + ':00' + CONFIG.OFFSET);
    const fin = new Date(inicio.getTime() + CONFIG.DURACION_MIN * 60000);
    const servicio = CONFIG.SERVICIOS[d.servicio];
    const titulo = servicio + ' · ' + d.nombre;
    const descripcion = [
      CONFIG.MARCA,
      'Servicio: ' + servicio + ' (' + CONFIG.DURACION_MIN + ' min · $' + CONFIG.PRECIO + ' MXN, pago al finalizar)',
      'Cliente: ' + d.nombre,
      'WhatsApp: +52 ' + d.whatsapp + '  →  https://wa.me/52' + d.whatsapp,
      d.email ? 'Correo: ' + d.email : '',
      'Domicilio: ' + d.domicilio,
      d.referencias ? 'Referencias: ' + d.referencias : '',
      '',
      (d.respuestas || []).map(r => '• ' + r.pregunta + '\n  ' + r.respuesta).join('\n')
    ].filter(x => x !== '').join('\n');

    const opciones = { location: d.domicilio, description: descripcion };
    if (d.email) { opciones.guests = d.email; opciones.sendInvites = true; }
    const ev = calendario().createEvent(titulo, inicio, fin, opciones);
    ev.setColor(CalendarApp.EventColor.RED);
    ev.addPopupReminder(120);
    ev.setTag('whatsapp', d.whatsapp);
    ev.setTag('nombre', d.nombre);
    ev.setTag('servicio', servicio);

    avisarCitaNueva(d, servicio, inicio, descripcion);
    return responder({ ok: true, id: ev.getId() });
  } catch (err) {
    console.error(err);
    return responder({ ok: false, error: 'No se pudo registrar la cita. Escríbeme por WhatsApp, por favor.' });
  } finally {
    lock.releaseLock();
  }
}

/* ---------------- Disponibilidad ---------------- */

function horariosDisponibles() {
  const ahora = new Date();
  const limite = new Date(ahora.getTime() + CONFIG.ANTICIPACION_HORAS * 3600000);
  const hasta = new Date(ahora.getTime() + (CONFIG.DIAS_ADELANTE + 1) * 86400000);
  const ocupados = calendario().getEvents(ahora, hasta)
    .filter(ev => ev.getMyStatus() !== CalendarApp.GuestStatus.NO)
    .map(ev => ev.isAllDayEvent()
      ? [ev.getAllDayStartDate().getTime(), ev.getAllDayEndDate().getTime()]
      : [ev.getStartTime().getTime(), ev.getEndTime().getTime()]);
  const margen = CONFIG.DESCANSO_MIN * 60000;

  const dias = [];
  const hoy = Utilities.formatDate(ahora, CONFIG.ZONA, 'yyyy-MM-dd');
  for (let i = 0; i <= CONFIG.DIAS_ADELANTE; i++) {
    const fecha = sumarDias(hoy, i);
    const dow = Number(Utilities.formatDate(new Date(fecha + 'T12:00:00' + CONFIG.OFFSET), CONFIG.ZONA, 'u'));
    const rangos = CONFIG.HORARIO[dow] || [];
    const horas = [];
    rangos.forEach(r => {
      for (let t = aMin(r[0]); t + CONFIG.DURACION_MIN <= aMin(r[1]); t += CONFIG.DURACION_MIN + CONFIG.DESCANSO_MIN) {
        const ini = new Date(fecha + 'T' + aHHMM(t) + ':00' + CONFIG.OFFSET).getTime();
        const fin = ini + CONFIG.DURACION_MIN * 60000;
        if (ini < limite.getTime()) continue;
        const choca = ocupados.some(o => ini - margen < o[1] && fin + margen > o[0]);
        if (!choca) horas.push(aHHMM(t));
      }
    });
    if (horas.length) dias.push({ fecha: fecha, horas: horas });
  }
  return dias;
}

/* ---------------- Avisos ---------------- */

function avisarCitaNueva(d, servicio, inicio, descripcion) {
  const yo = Session.getEffectiveUser().getEmail();
  const cuando = Utilities.formatDate(inicio, CONFIG.ZONA, "EEEE d 'de' MMMM, h:mm a");
  const wa = 'https://wa.me/52' + d.whatsapp + '?text=' + encodeURIComponent(
    'Hola ' + d.nombre.split(' ')[0] + ', soy Odet Romero de ROMS. Recibí tu cita de ' + servicio + ' para el ' + cuando + ' en ' + d.domicilio + '. ¡Te espero!');
  MailApp.sendEmail({
    to: yo,
    subject: 'Nueva cita: ' + servicio + ' · ' + d.nombre + ' · ' + cuando,
    htmlBody: '<div style="font-family:Arial,sans-serif;font-size:14px;color:#0b1b2b">' +
      '<h2 style="margin:0 0 8px">Nueva cita desde tu sitio</h2>' +
      '<p><b>' + escapar(servicio) + '</b><br>' + escapar(cuando) + '</p>' +
      '<pre style="white-space:pre-wrap;font-family:Arial,sans-serif;background:#f0f4f8;padding:12px;border-radius:6px">' + escapar(descripcion) + '</pre>' +
      '<p><a href="' + wa + '" style="background:#10b981;color:#fff;padding:10px 16px;border-radius:6px;text-decoration:none;font-weight:bold">Confirmar al cliente por WhatsApp</a></p>' +
      '</div>'
  });
}

/** Correo diario con las citas del día y su botón de recordatorio por WhatsApp. */
function resumenDiario() {
  const zona = CONFIG.ZONA;
  const hoy = Utilities.formatDate(new Date(), zona, 'yyyy-MM-dd');
  const ini = new Date(hoy + 'T00:00:00' + CONFIG.OFFSET), fin = new Date(hoy + 'T23:59:59' + CONFIG.OFFSET);
  const citas = calendario().getEvents(ini, fin).filter(ev => (ev.getDescription() || '').indexOf(CONFIG.MARCA) === 0);
  if (!citas.length) return;
  const filas = citas.map(ev => {
    const hora = Utilities.formatDate(ev.getStartTime(), zona, 'h:mm a');
    const nombre = ev.getTag('nombre') || ev.getTitle();
    const tel = ev.getTag('whatsapp');
    const texto = 'Hola ' + String(nombre).split(' ')[0] + ', te escribe Odet Romero de ROMS. Te recuerdo tu ' +
      (ev.getTag('servicio') || 'asesoría') + ' hoy a las ' + hora + ' en ' + ev.getLocation() + '. ¿Sigue en pie?';
    const boton = tel ? '<a href="https://wa.me/52' + tel + '?text=' + encodeURIComponent(texto) + '" style="background:#10b981;color:#fff;padding:8px 12px;border-radius:6px;text-decoration:none;font-weight:bold">Enviar recordatorio</a>' : '';
    return '<tr><td style="padding:10px 12px 10px 0;vertical-align:top"><b>' + hora + '</b></td>' +
      '<td style="padding:10px 12px 10px 0">' + escapar(ev.getTitle()) + '<br><span style="color:#64748b">' + escapar(ev.getLocation()) + '</span></td>' +
      '<td style="padding:10px 0">' + boton + '</td></tr>';
  }).join('');
  MailApp.sendEmail({
    to: Session.getEffectiveUser().getEmail(),
    subject: 'Tus citas de hoy (' + citas.length + ')',
    htmlBody: '<div style="font-family:Arial,sans-serif;font-size:14px;color:#0b1b2b"><h2 style="margin:0 0 12px">Citas de hoy</h2><table style="border-collapse:collapse">' + filas + '</table></div>'
  });
}

/** Ejecuta esta función UNA vez para activar el correo diario de las 9:00. */
function instalarResumenDiario() {
  ScriptApp.getProjectTriggers().filter(t => t.getHandlerFunction() === 'resumenDiario').forEach(t => ScriptApp.deleteTrigger(t));
  ScriptApp.newTrigger('resumenDiario').timeBased().atHour(CONFIG.HORA_RESUMEN).everyDays(1).inTimezone(CONFIG.ZONA).create();
}

/** Prueba rápida: ejecútala y revisa el registro para ver los horarios que verán tus clientes. */
function probarHorarios() {
  console.log(JSON.stringify(horariosDisponibles(), null, 2));
}

/* ---------------- Utilidades ---------------- */

function validar(d) {
  if (!CONFIG.SERVICIOS[d.servicio]) return 'Elige un tipo de asesoría.';
  if (!/^\d{4}-\d{2}-\d{2}$/.test(d.fecha || '') || !/^\d{2}:\d{2}$/.test(d.hora || '')) return 'Elige día y hora.';
  if (!d.nombre || String(d.nombre).trim().length < 3) return 'Escribe tu nombre.';
  if (!/^\d{10}$/.test(d.whatsapp || '')) return 'Escribe tu WhatsApp a 10 dígitos.';
  if (d.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(d.email)) return 'Revisa tu correo.';
  if (!d.domicilio || String(d.domicilio).trim().length < 8) return 'Escribe el domicilio de la asesoría.';
  ['nombre', 'domicilio', 'referencias', 'email'].forEach(k => { if (d[k]) d[k] = String(d[k]).slice(0, 300); });
  d.respuestas = (d.respuestas || []).slice(0, 6).map(r => ({ pregunta: String(r.pregunta).slice(0, 200), respuesta: String(r.respuesta).slice(0, 1000) }));
  return '';
}
function calendario() { return CONFIG.CALENDARIO === 'primary' ? CalendarApp.getDefaultCalendar() : CalendarApp.getCalendarById(CONFIG.CALENDARIO); }
function responder(obj) { return ContentService.createTextOutput(JSON.stringify(obj)).setMimeType(ContentService.MimeType.JSON); }
function aMin(t) { const p = t.split(':'); return Number(p[0]) * 60 + Number(p[1]); }
function aHHMM(m) { return ('0' + Math.floor(m / 60)).slice(-2) + ':' + ('0' + (m % 60)).slice(-2); }
function sumarDias(iso, n) { const d = new Date(iso + 'T12:00:00Z'); d.setUTCDate(d.getUTCDate() + n); return d.toISOString().slice(0, 10); }
function escapar(s) { return String(s || '').replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c])); }
