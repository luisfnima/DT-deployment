# Caída de Evolution API — Diagnóstico y Solución

**Fecha del incidente:** 2026-07-10
**Síntoma:** Todos los envíos automáticos de reportes por WhatsApp fallan con `HTTP 500: Error: Connection Closed`. Los textos de los reportes se loguean como "despachando" pero el socket de Baileys está muerto.

---

## 1. Diagnóstico

### Cómo se manifiesta en los logs
```
{"level":"error","source":"Sender",
 "message":"❌ Fallo al enviar a \"Dev\": Fallo al enviar mensaje por Evolution API:
            HTTP Error 500: {\"status\":500,\"error\":\"Internal Server Error\",
            \"response\":{\"message\":[\"Error: Connection Closed\"]}}"}
```

### Causa raíz (CORREGIDA — no es la sesión, es el código)

**Mi diagnóstico original estaba mal.** En una primera versión de este documento afirmé que la sesión de WhatsApp murió el 2026-07-07 basándome en el campo `disconnectionAt` de Evolution. **Eso fue una mala interpretación de ese campo.** Los hechos reales:

| Fecha | Estado real (logs) |
|---|---|
| 8 de julio (mañana) | ✅ Reportes enviados con éxito |
| 8 de julio (noche) | ✅ Más reportes enviados con éxito |
| 9 de julio 17:17 | ✅ **Último envío exitoso** |
| 9 de julio noche en adelante | ❌ Empiezan a fallar con `Connection Closed` |
| 10 de julio | ❌ Sigue fallando (21+ errores) |

**El campo `disconnectionAt: 2026-07-07T23:31:27` en Evolution NO significa que la sesión murió ese día.** Es la fecha del último evento de desconexión que Evolution registró — que pudo haber sido un reconnect normal y momentáneo (Baileys reconecta sin perder la sesión). Las credenciales en `evolution-api/instances/<UUID>/` **siguieron vivas** y se siguieron usando con éxito hasta el 9 de julio a las 17:17.

**La causa real fue doble:**
1. **Bug de código en `backend/src/services/whatsapp/EvolutionService.ts`**: el payload de media usaba el formato v1/mock (`mediaMessage: { mediatype, media, caption }`) en vez del formato v2.x real que pide Evolution (`{ number, mediatype, media, fileName, caption }` con base64 puro sin prefijo MIME). Este bug existe desde algún cambio en el código, y rompe los envíos de **imágenes**. Los envíos de **texto** probablemente también fallan por el mismo motivo raíz (el `textMessage` anidado tampoco es el formato que Evolution v2.x espera). El README del proyecto (línea 60) ya advertía sobre el formato correcto.
2. **Estado de Evolution "mintiendo"**: cuando el socket de Baileys se cierra por un transient (laptop suspendida, WiFi caído, etc.), Evolution reporta `state: open` aunque el socket esté muerto. El campo `connectionStatus` no se actualiza hasta que se intente un envío real y falle.

**Lección importante: NO usar `disconnectionAt` como indicador de "sesión muerta".** El único test confiable es `POST /message/sendText/...` y ver si devuelve 200 o 500.

---

## 2. Procedimiento de recuperación (escalonado — intentar de menos a más)

**IMPORTANTE:** NO saltar al reset completo de entrada. En la mayoría de los casos, el problema es solo de código (Paso 1) o de socket transitorio (Paso 2). Solo llegar al Paso 3 si nada de eso funciona.

### Paso 1: Verificar primero si el bug es de código (lo más común)

El `EvolutionService.ts` puede tener un payload mal formado. Comparar con el README línea 60: *"Las imágenes se envían optimizadas como base64 puro sin prefijo MIME"*. Formato correcto:
```js
{ number, mediatype: "image", media: "<base64 puro>", fileName: "report.png", caption: "..." }
```
Si está con `mediaMessage: { mediatype, media, caption }` anidado, **ese es el bug**. Corregir, guardar el `.ts` y `ts-node-dev` recarga solo. Esperar al próximo ciclo del scheduler y ver si los envíos pasan.

### Paso 2: Test directo contra Evolution (sin tocar nada)
```bash
curl -s -X POST http://localhost:8080/message/sendText/dreamteam \
  -H "Content-Type: application/json" \
  -H "apikey: NEXO_SECRET_KEY_2026" \
  -d '{"number":"51929459788","textMessage":{"text":"test reconexion"}}'
```
- **Si responde 200** → la sesión está OK, el problema era del Paso 1.
- **Si responde 500 con `Connection Closed`** → la sesión está zombie. Ir al Paso 3.

### Paso 3: Reset completo (último recurso, requiere reescanear QR)
Solo hacer esto si el Paso 2 confirma que la sesión está realmente muerta. **Implica reescanear el QR desde el celular.**

#### Paso 3.1: Localizar el proyecto Evolution
Evolution está en un **proyecto hermano** (no dentro de este repo):
```
D:\Documentos\Antigravity\evolution-api\
```
Tiene su propio `.env` y su propio `node_modules`. Corre en el puerto 8080 con `node dist/main` (script `npm run start:prod`).

#### Paso 3.2: Matar el proceso de Evolution
```bash
# Ver PID en 8080
netstat -ano | grep ":8080.*LISTENING"
# Matarlo
powershell -Command "Stop-Process -Id <PID> -Force"
```
Verificar que el puerto quedó libre: `netstat -ano | grep ":8080"` no debe mostrar `LISTENING`.

### Paso 3: Borrar la instancia dreamteam en DOS lados
**A) Disco local** (carpeta con credenciales de WhatsApp):
```bash
# Buscar la carpeta con el ID de la instancia
ls "D:/Documentos/Antigravity/evolution-api/instances/"
# Borrar la dreamteam (la que NO es smart-telco, la que tiene archivos)
rm -rf "D:/Documentos/Antigravity/evolution-api/instances/<UUID_DE_DREAMTEAM>"
```

**B) Base de datos Neon** (metadata de la instancia). Script de una sola ejecución:
```js
// reset-instance.js
const { Client } = require('pg');
require('dotenv').config();
(async () => {
  const c = new Client({
    connectionString: process.env.DATABASE_CONNECTION_URI,
    ssl: { rejectUnauthorized: false }
  });
  await c.connect();
  // Borrar FKs primero (Setting, Webhook, Chatwoot, Proxy, Rabbitmq, Nats, Sqs, Kafka, Websocket, Label, Typebot)
  const tables = ['Setting','Webhook','Chatwoot','Proxy','Rabbitmq','Nats','Sqs','Kafka','Websocket','Label','Typebot'];
  for (const t of tables) {
    await c.query(`DELETE FROM "${t}" WHERE "instanceId" IN (SELECT id FROM "Instance" WHERE name = $1);`, ['dreamteam']);
  }
  await c.query('DELETE FROM "Instance" WHERE name = $1', ['dreamteam']);
  await c.end();
})();
```
```bash
cd "D:\Documentos\Antigravity\evolution-api"
node reset-instance.js
rm reset-instance.js   # limpiar
```

### Paso 4: Reiniciar Evolution DOS veces
La primera vez queda con caché de la instancia vieja ("already in use"). Hay que matar y reiniciar de nuevo:
```bash
cd "D:\Documentos\Antigravity\evolution-api"
nohup npm run start:prod > /tmp/evolution.log 2>&1 &
sleep 8
# Verificar que arrancó limpio
curl -s http://localhost:8080/instance/fetchInstances -H "apikey: NEXO_SECRET_KEY_2026"
# Debe devolver [] (o solo smart-telco si existe)
```

### Paso 5: Recrear la instancia y verificar QR
```bash
curl -s -X POST http://localhost:8080/instance/create \
  -H "Content-Type: application/json" \
  -H "apikey: NEXO_SECRET_KEY_2026" \
  -d '{"instanceName":"dreamteam","token":"NEXO_SECRET_KEY_2026","qrcode":true,"integration":"WHATSAPP-BAILEYS"}'
# Debe devolver status: "connecting" con qrcode.code y qrcode.base64

# Verificar que el backend lo refleja
curl -s http://localhost:5000/api/status/whatsapp/qr
# Debe devolver {"state":"connecting","qr":"data:image/png;base64,..."}
```

### Paso 6 (manual del usuario)
Desde el celular: **WhatsApp → ⋮ → Dispositivos vinculados → Vincular dispositivo → Escanear QR** que aparece en la pantalla de Configuración de la app.

---

## 3. El bug de código que también estaba presente

El `EvolutionService.ts` tenía un payload incorrecto que NO coincidía con el formato de Evolution API v2.x real. El README del proyecto (línea 60) dice:

> *"Las imágenes se envían optimizadas como base64 puro sin prefijo MIME"*

**Formato correcto (lo que funciona):**
```js
{
  number: "51929459788",
  mediatype: "image",          // raíz, NO dentro de mediaMessage
  media: "<base64 puro>",
  fileName: "report.png",
  caption: "Reporte automático"
}
```

**Formato incorrecto (lo que estaba):**
```js
{
  number: "51929459788",
  mediaMessage: { mediatype: "image", media: "data:image/png;base64,...", caption: "..." }
}
```

El backend usa `ts-node-dev --respawn`, así que **se autorrecarga solo al guardar el `.ts`**. No hay que reiniciar el backend a mano después de editar el servicio.

---

## 4. Verificación final

```bash
# Test directo contra Evolution (debe devolver 200 con status SUCCESS)
curl -s -X POST http://localhost:8080/message/sendText/dreamteam \
  -H "Content-Type: application/json" -H "apikey: NEXO_SECRET_KEY_2026" \
  -d '{"number":"51929459788","textMessage":{"text":"Test reconexion"}}'

# Test desde el backend
curl -s -X POST http://localhost:5000/api/reports/1/run-test
```

Si el primer test devuelve 200 y el segundo muestra `success: true`, todo está OK.

---

## 5. Cómo prevenirlo a futuro

1. **Monitoreo**: agregar un watchdog que detecte `state: open` + `Error: Connection Closed` durante >5 min y gatille una alerta.
2. **Reintento con backoff**: el `ReportEngine` ya tiene `retryCount: 3`, pero no distingue entre error de payload (no reintentar) y error de socket (reintentar con espera).
3. **Healthcheck real**: `/instance/connectionState/dreamteam` mintiendo `open` cuando el socket está muerto. Considerar validar con un `sendText` de prueba cada N minutos a un número propio.

---

## 6. Archivos y procesos tocados en este incidente

| Qué | Path / PID | Acción |
|---|---|---|
| Cliente (fixeado) | `backend/src/services/whatsapp/EvolutionService.ts` | Editado |
| Evolution API | PID 2912 → 15140 → 11908 | Matado y reiniciado 2 veces |
| Instancia dreamteam (disco) | `evolution-api/instances/13084df6-...` | Borrado |
| Instancia dreamteam (Neon) | Tabla `Instance` de PostgreSQL | Borrado |
| Backend (este repo) | PID 19516 → 11460 | Auto-recargado por `ts-node-dev` (no toqué) |
| Frontend | PID 4416 (puerto 3002) | No tocado |
| Otros proyectos (Next.js) | PIDs 16644 (3000) y 16528 (3001) | No tocados |

---

## 7. Endpoints clave para diagnosticar en el futuro

```bash
# Estado de la instancia
curl -H "apikey: $EVOLUTION_API_KEY" http://localhost:8080/instance/connectionState/dreamteam

# QR actual
curl -H "apikey: $EVOLUTION_API_KEY" http://localhost:8080/instance/connect/dreamteam

# Listar instancias con metadata detallada
curl -H "apikey: $EVOLUTION_API_KEY" http://localhost:8080/instance/fetchInstances

# Logs del backend
tail -30 backend/data/logs.json | grep -A1 "Connection Closed"

# Estado desde el backend
curl http://localhost:5000/api/status
```
