# Rotary Distrito 4905 · Monitoreo de Redes

Versión preparada para GitHub + Vercel a partir de la última landing responsive.

## Qué conserva
- Acceso privado mediante `SITE_PASSWORD` y `AUTH_SECRET`.
- Sesión de 12 horas.
- Botón para cerrar sesión.
- Diseño responsive para móvil, tablet, notebook y escritorio.
- Pestañas Instagram/Facebook, buscador, numeración de cards y capacidad prevista hasta 120 clubes.
- Contador/filtro de actividad preparado para la conexión posterior.

## Datos actuales
- 108 clubes en la base.
- 103 enlaces de Instagram en esta versión.
- 6 enlaces de Facebook en esta versión.

Los clubes se encuentran en `data/clubs.json`. La interfaz está en `lib/landing.html`.

## Variables de entorno en Vercel
- `SITE_PASSWORD`
- `AUTH_SECRET`

No incluyas los valores de estas variables dentro del repositorio.

## Próxima etapa
Cuando la planilla de Google Sheets quede completa, la fuente de clubes/enlaces podrá reemplazarse por Google Sheets + Apps Script sin rehacer el diseño.


## Google Sheets conectado

La landing ya no depende de editar manualmente los enlaces dentro del HTML.

Flujo:
1. Se editan las pestañas `Instagram` y `Facebook` en Google Sheets.
2. Apps Script publica los datos.
3. `/api/clubs` consulta Apps Script desde Vercel.
4. La landing carga automáticamente clubes y URLs al abrirse.

Apps Script configurado:
`https://script.google.com/macros/s/AKfycbzI-LcgST-jB6f6Y8p_brlg7pzAP8aJpdBGUJdOOMvvR4M4BTyly8PXX1hCdySFXTLpEw/exec`

Si Google Sheets no responde, `/api/clubs` usa `data/clubs.json` como respaldo para que el panel no quede vacío.

**Actividad / punto azul:** la estructura visual está preparada, pero la detección de publicaciones nuevas todavía requiere una fuente de actividad separada. El Apps Script actual solo entrega clubes y enlaces.


## Nueva vista semanal
La landing ahora tiene dos vistas: **Actividad de la semana** y **Todos los clubes**.

- Todos los clubes se cargan desde `/api/clubs`, que toma la base viva de Google Sheets.
- Los contadores de Instagram/Facebook se calculan con los enlaces reales recibidos.
- Los filtros Todos / Instagram / Facebook actúan dentro de la vista seleccionada.
- La vista de actividad acepta campos opcionales por club: `activityInstagram`, `activityFacebook`, `instagramLast`, `facebookLast` (también variantes en español contempladas en `api/clubs.js`).
- Mientras la fuente automática de actividad no envíe esos campos, la vista semanal queda vacía; **no se inventa actividad en producción**.
- Para revisar el diseño con datos simulados, agregar `?demo=1` a la URL después de iniciar sesión.

## Semana de monitoreo (lunes a domingo)
La vista `Actividad de la semana` calcula automáticamente el período semanal de lunes a domingo y cambia cada lunes.
Las fechas se cargan en `lib/landing.html`, dentro del objeto `ACTIVITY_DATES`, con formato `AAAA-MM-DD`.
Ejemplo: `"Chivilcoy": { instagram: "2026-09-22", facebook: "" }`.
La tarjeta aparece solo si la fecha está dentro de la semana actual. `Todos los clubes` permanece siempre disponible.
