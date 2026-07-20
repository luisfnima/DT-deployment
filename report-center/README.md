# DreamTeam Report Center — Centro de Distribución de Reportes

Este proyecto es una plataforma web (SaaS-like) diseñada para automatizar la extracción de datos de ventas de un CRM en producción, generar reportes formateados en HTML, convertirlos a imágenes de alta definición y distribuirlos de manera automatizada a través de WhatsApp (utilizando Evolution API).

---

## 🏛️ Arquitectura General del Sistema

El sistema está diseñado bajo una arquitectura de servicios desacoplados, lo que permite escalabilidad, tolerancia a fallos y mantenimiento sencillo.

```mermaid
graph TD
    subgraph Frontend (React + Vite)
        UI[Panel de Dashboard & Scheduler]
        LiveTracker[Live Execution Stepper]
    end

    subgraph Backend (Node.js + Express + TypeScript)
        API[Servicios REST API]
        Scheduler[SchedulerService - Cron Loop]
        Engine[ReportEngine - Motor de Ejecución]
        Renderer[Playwright Renderer - Conversión HTML a PNG]
        Repo[ReportRepository - Base de Datos JSON]
    end

    subgraph Canales Externos
        CRM[API del CRM Izaguirre]
        EvoAPI[Evolution API - Instancia WhatsApp]
        WA[Destinatarios Finales - WhatsApp]
    end

    UI <--> API
    Scheduler --> Engine
    Engine --> CRM
    Engine --> Renderer
    Engine --> EvoAPI
    EvoAPI --> WA
```

---

## 🛠️ Componentes Clave y Flujo de Trabajo

### 1. Frontend (Vite + React + TypeScript)
* **Dashboard Ejecutivo**: Muestra KPIs dinámicos calculados a partir de históricos reales (latencia, ejecuciones exitosas/fallidas, canales).
* **Live Stepper Progress**: Cuando se gatilla un envío (manual o programado), el frontend recibe eventos del progreso del backend en tiempo real (Consultando CRM -> Generando HTML -> Renderizando Imagen -> Despachando -> Finalizado).
* **Administración Sólida (CRUD)**:
  * **Destinatarios**: Gestión de nombres, prioridades (`priority`), canales de envío, y ventanas horarias de descanso (`allowedWindow` para no molestar fuera de horas de trabajo).
  * **Scheduler**: Programación avanzada que soporta múltiples horarios en el día (separados por coma, ej. `08:00, 18:30, 22:00`) y días de la semana específicos (ej. Lunes a Viernes).

### 2. Backend (Node.js + Express + TypeScript)
* **Scheduler Service**: Un loop interno (`setInterval`) corre cada 60 segundos. Evalúa las horas configuradas y el día de la semana actual en la zona horaria `America/Lima` para disparar las ejecuciones automáticas correspondientes.
* **Playwright Renderer**: Utiliza instancias headless de Chromium para abrir los reportes HTML autogenerados, ajustar el viewport para evitar scrollbars y tomar una captura de pantalla PNG limpia y nítida.
* **Caché y Cooldown en QR**: El backend implementa un mecanismo de cooldown de 25 segundos para la consulta del código QR de WhatsApp, evitando reconexiones y re-generaciones compulsivas del socket Baileys.

### 3. CRM Integration
* Consulta directamente el endpoint en producción: `http://31.97.165.147/api/export/sales` utilizando el API Key autorizado de la campaña *Telefonía Izaguirre*.

### 4. Evolution API
* Se encarga de la comunicación directa con Baileys (WhatsApp Web Protocol). Las imágenes se envían optimizadas como base64 puro sin prefijo MIME para asegurar total compatibilidad.

---

## 🚀 Guía de Configuración e Inicio

### Requisitos Previos
* Node.js v18 o superior.
* Gestor de paquetes npm.

### Estructura de Directorios
* `/backend`: Código del servidor y persistencia local de reportes e históricos.
* `/frontend`: Código de la interfaz de usuario.
* `../evolution-api`: Servidor del gateway de WhatsApp (proyecto paralelo).

### Configuración del Entorno (`.env`)

#### Backend (`/backend/.env`):
```env
PORT=5000
EVOLUTION_API_URL=http://localhost:8080
EVOLUTION_API_KEY=apikey_dreamteam_secure
CRM_API_URL=http://31.97.165.147/api/export/sales
CRM_API_KEY=8b4e1a3c26a98e4bc2fb88aebdd3109e5ad24b8ae3b3d0710f4663e07f1c6ba4
```

#### Evolution API (`../evolution-api/.env`):
```env
# Configuración optimizada para evitar saturación de BD Neon
DATABASE_SAVE_DATA_NEW_MESSAGE=false
DATABASE_SAVE_MESSAGE_UPDATE=false
DATABASE_SAVE_DATA_CHATS=false
DATABASE_SAVE_DATA_CONTACTS=false
```

---

## ⚡ Comandos para el Arranque en Desarrollo

Arranque en paralelo en tres terminales independientes:

1. **Evolution API**:
   ```bash
   cd evolution-api
   npm run dev:server
   ```
2. **Backend**:
   ```bash
   cd "DreamTeam Report Center/backend"
   npm run dev
   ```
3. **Frontend**:
   ```bash
   cd "DreamTeam Report Center/frontend"
   npm run dev
   ```

La plataforma estará accesible en: `http://localhost:3000/`.

---

## 📦 Plan de Despliegue en Producción (Recomendado por TI)

Para desplegar esta arquitectura en producción en servidores locales (VPS) o la nube (AWS/DigitalOcean):

1. **Contenedorización (Docker)**:
   * Crear un archivo `docker-compose.yml` que empaquete:
     * El contenedor de `Evolution API` (imagen oficial de Docker).
     * El contenedor del `Backend` (instalando previamente dependencias de Playwright para Chromium headless).
     * El servidor del `Frontend` (servido estáticamente vía Nginx).
2. **Administrador de Procesos (PM2)**:
   * En caso de correr directamente en Windows Server o Linux sin Docker, se recomienda utilizar **PM2** para mantener vivos los procesos:
     ```bash
     pm2 start npm --name "report-backend" -- run start
     ```
3. **Base de Datos**:
   * Los metadatos de configuración se guardan de forma nativa en archivos estructurados JSON dentro de la carpeta `/backend/data/`. Para escalabilidad futura a múltiples campañas, esta capa de datos puede migrarse a PostgreSQL o MongoDB de manera transparente.
