# Activar la agenda con tu Google Calendar

La página `agendar/` ya funciona sin este paso: calcula tus horarios y envía cada reserva a tu WhatsApp.
Al activarlo, además:

- solo se muestran los horarios que tienes libres en tu Google Calendar;
- cada cita se guarda sola en tu calendario (en rojo, con todos los datos del cliente);
- te llega un correo por cada cita nueva con un botón para confirmarle al cliente por WhatsApp;
- si el cliente dejó su correo, recibe la invitación de calendario;
- cada día a las 9:00 te llega un correo con las citas del día y un botón de recordatorio por WhatsApp para cada cliente.

Toma unos 5 minutos y se hace una sola vez, con la cuenta de Google donde tienes tu calendario.

## 1. Crear el proyecto
1. Entra a https://script.google.com y presiona **Nuevo proyecto**.
2. Arriba a la izquierda cambia el nombre "Proyecto sin título" por **Agenda ROMS**.

## 2. Pegar el programa
1. Borra todo lo que aparece en el archivo `Código.gs`.
2. Copia todo el contenido de `apps-script/Codigo.gs` de este repositorio y pégalo ahí.
3. Presiona el ícono de **Guardar** (disquete).

## 3. Ajustar la zona horaria
1. En el menú de la izquierda, entra a **Configuración del proyecto** (engrane).
2. En **Zona horaria** elige **(GMT-06:00) Hora central - Ciudad de México**.

## 4. Probar y dar permisos
1. Regresa al **Editor** (ícono `< >`).
2. Arriba, en la lista de funciones, elige **probarHorarios** y presiona **Ejecutar**.
3. Google te pedirá permisos: **Revisar permisos** → elige tu cuenta → **Configuración avanzada** → **Ir a Agenda ROMS (no seguro)** → **Permitir**.
   El aviso de "no seguro" aparece porque el programa es tuyo y no está publicado en la tienda de Google; solo tiene acceso a tu calendario y a enviarte correos.
4. Abajo verás la lista de días y horarios que verán tus clientes.

## 5. Activar el correo diario de las 9:00
En la lista de funciones elige **instalarResumenDiario** y presiona **Ejecutar**. Solo una vez.

## 6. Publicar la agenda
1. Arriba a la derecha: **Implementar** → **Nueva implementación**.
2. En el engrane de "Seleccionar tipo" elige **Aplicación web**.
3. Descripción: `Agenda ROMS`. **Ejecutar como:** *Yo*. **Quién tiene acceso:** *Cualquier usuario*.
4. Presiona **Implementar** y copia la **URL de la aplicación web** (termina en `/exec`).

## 7. Conectarla con tu sitio
Mándale esa URL a Claude y la conectará en `agendar/index.html` (en la línea `const AGENDA_API = '';`).

## Cambiar horarios o reglas después
Todo se ajusta en el bloque `CONFIG` al inicio de `Codigo.gs` (y el mismo bloque en `agendar/index.html`):
horario por día, duración, descanso entre citas, anticipación mínima y días hacia adelante.
Después de cambiar `Codigo.gs`: **Implementar** → **Administrar implementaciones** → lápiz → **Versión: Nueva versión** → **Implementar**. La URL no cambia.

Para bloquear un día u horario (vacaciones, un compromiso), basta con crear un evento en tu Google Calendar: la agenda ya no lo ofrecerá. Los eventos de todo el día bloquean el día completo.
