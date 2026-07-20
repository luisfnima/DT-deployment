# Tarifador Inteligente (Smart Telco) - Documentación General de TI

Este repositorio contiene la plataforma integrada de herramientas de venta y cumplimiento legal de **Smart Telco**. El sistema está diseñado para optimizar el embudo de ventas de los asesores comerciales y automatizar la inyección de avisos legales exigidos por las regulaciones de telecomunicaciones.

---

## 📋 Arquitectura General del Proyecto

La plataforma se compone de dos aplicaciones principales que operan de forma coordinada:
1. **Frontend (Next.js / TypeScript)**:
   - Servidor local por defecto en puerto `3005` (o `3000`).
   - Interfaz web interactiva con tres módulos principales: **Tarifario Inteligente**, **Permiso de Llamada** y **Embudo de Contraofertas (WhatsApp)**.
2. **Backend de Audio (Python 3 / Tkinter)**:
   - Servidor local en el puerto `5005` (corre de forma silenciosa/headless).
   - Controla el mezclador de sonido físico mediante la API de PortAudio (`sounddevice`), inyecta los audios legales (Edge TTS) y genera la música de fondo procedimental.

---

## 🛠️ Módulos de la Plataforma

### 1. Tarifario Inteligente (Core Venta)
Es la herramienta principal para la consulta de ofertas vigentes de Smart Telco (fibra, móvil, televisión, planes convergentes y promociones).
* **Base de Datos de Planes**: Estructurada en archivos TypeScript locales (`src/data/plans.ts` y `src/data/tarifario-smart-telco-structured.ts`) para garantizar tiempos de respuesta instantáneos.
* **Campaña Estacional (World Cup Mode)**: Capa temática interactiva que inyecta elementos dinámicos en la UI (confeti, balones flotantes, banners de goles y estética del Mundial de Fútbol) vinculada a promociones especiales.

---

### 2. Permiso de Llamada (Inyección de Consentimiento) - [Finalizado]
Módulo crítico que inyecta los avisos legales requeridos directamente en la llamada telefónica del asesor y graba el consentimiento del cliente.

```
[Voz Agente (Mic)]  ──(100% Vol)──┐
                                  ├──> [AudioMixer Python] ──> [VB-Cable Input] ──> [eyeBeam]
[Aviso legal + Bg]  ──(12% Vol)───┘            │
                                              └─── (Copia local) ───> [Auriculares Agente]
```

* **Ruteo de Audio Virtual**: Captura el micrófono físico del asesor, mezcla digitalmente la locución grabada con música de fondo (12% vol.) y envía el resultado hacia el dispositivo de entrada virtual **VB-Cable**, el cual alimenta la llamada en el softphone **eyeBeam**.
* **Monitoreo Local de Asesor**: Duplica la señal del aviso y la envía al canal de auriculares físicos del agente para que escuche la locución, apagando el canal en cuanto termina la reproducción para evitar ruidos de fondo.
* **Síntesis y Estilos de Música**: Usa `edge-tts` para la voz (soporta tasas de velocidad de `+0%`, `+15%`, `+30%`, `+45%`) y sintetiza procedimentalmente 6 estilos de música de fondo (Lounge, Rhodes Jazz, Ambient Chill, Electro Deep House, Kalimba Pluck y Space Future) con efectos de coro, retardo y filtros paso bajo analógicos para un sonido cálido y profesional.
* **Auto-Recuperación de Dispositivos (Hot-Swap)**: Si el agente desconecta sus audífonos en medio de una operación, el motor de Python detecta el error de PortAudio, interroga al sistema de sonido y re-asigna en milisegundos un hardware de repuesto (bocinas/mic integrados) de manera transparente.

---

### 3. Embudo de Contraofertas / WhatsApp - [En Desarrollo / Pendiente]
Módulo de negociación interactivo para ayudar a los agentes a rebatir objeciones y retener clientes de la competencia mediante mensajería instantánea.
* **Embudo de Ventas (`EmbudoPanel.tsx`)**: Interfaz visual basada en embudos y tarjetas de objeción (ej. precio alto, permanencia, cobertura).
* **WhatsApp Contraofertas**: Genera textos de negociación dinámicos y formateados listos para copiar y enviar mediante enlace directo a la API de WhatsApp, agilizando el contacto y cierre con el prospecto.

---

## 🚀 Despliegue y Ejecución

### Requisitos Previos (Servidor de Audio)
1. Instalar la controladora virtual **VB-Audio Virtual Cable** en Windows.
2. Configurar en **eyeBeam** (o el softphone activo) el micrófono de entrada como `CABLE Output (VB-Audio Virtual Cable)`.

### Comandos de Inicio

1. **Servidor de Audio Python (Backend)**:
   ```bash
   # Ejecutar el servidor en segundo plano (headless)
   python app.py --headless
   ```
2. **Aplicación Web Next.js (Frontend)**:
   ```bash
   # Instalar dependencias
   npm install
   # Ejecutar en el puerto 3005 (para evitar conflictos)
   npm run dev -- -p 3005
   ```

Una vez iniciados, accede a la plataforma desde tu navegador en:
👉 **`http://localhost:3005`**
