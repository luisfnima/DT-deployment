/**
 * ╔══════════════════════════════════════════════════════════════════════════╗
 * ║                 CONFIGURACIÓN DE MÚSICA DE FONDO                         ║
 * ╠══════════════════════════════════════════════════════════════════════════╣
 * ║                                                                          ║
 * ║   ────────  CÓMO SUBIR / CAMBIAR LA CANCIÓN  ────────                    ║
 * ║                                                                          ║
 * ║   1. Coloca tu archivo de audio en la carpeta:   music/                  ║
 * ║   2. Escribe el nombre del archivo en  file  (abajo)                     ║
 * ║   3. Guarda y recarga la landing                                         ║
 * ║                                                                          ║
 * ║   ────────  🎵 FORMATO DEL AUDIO (IMPORTANTE)  ────────                  ║
 * ║                                                                          ║
 * ║   FORMATO:   MP3 (recomendado — funciona en todos los navegadores).     ║
 * ║              También sirven: .m4a / .aac  y  .ogg                        ║
 * ║              EVITA .wav (pesa demasiado para una web).                   ║
 * ║                                                                          ║
 * ║   CALIDAD:   128 – 192 kbps es suficiente para música de fondo.          ║
 * ║   PESO:      idealmente menos de 8 MB (una canción de 3-4 min            ║
 * ║              a 128 kbps pesa ~3.5 MB, perfecto).                         ║
 * ║                                                                          ║
 * ║   TIP: si tu canción está en otro formato, conviértela gratis en         ║
 * ║        cloudconvert.com o con Audacity (exportar como MP3).              ║
 * ║                                                                          ║
 * ║   ────────  PARÁMETROS  ────────                                         ║
 * ║                                                                          ║
 * ║     file      → nombre del archivo dentro de music/                      ║
 * ║                 Ej: 'last-surprise.mp3'                                  ║
 * ║                 (también acepta una URL completa https://...)            ║
 * ║                                                                          ║
 * ║     volume    → volumen de 0.0 (mudo) a 1.0 (máximo).                    ║
 * ║                 Recomendado 0.25 – 0.40 para música de fondo.            ║
 * ║                                                                          ║
 * ║     loop      → true  = la canción se repite en bucle infinito           ║
 * ║                 false = suena una sola vez y se detiene                  ║
 * ║                                                                          ║
 * ║     autoplay  → true  = intenta sonar al entrar a la página.             ║
 * ║                 OJO: los navegadores bloquean el audio automático,       ║
 * ║                 así que empezará a sonar con el PRIMER click/tap         ║
 * ║                 del visitante en cualquier parte de la página.           ║
 * ║                 false = solo suena si le dan click al botón 🎵.          ║
 * ║                                                                          ║
 * ║     title     → nombre de la canción (aparece como tooltip al            ║
 * ║                 pasar el mouse sobre el botón flotante).                 ║
 * ║                                                                          ║
 * ╚══════════════════════════════════════════════════════════════════════════╝
 */

window.MUSIC_CONFIG = {

  file:     'music/Mask.mp3',   // ← tu canción (carpeta music/)

  volume:   0.12,                     // ← volumen (0.0 a 1.0)

  loop:     true,                     // ← repetir en bucle

  autoplay: true,                     // ← intentar reproducir al entrar

  title:    'Música DreamTeam',       // ← tooltip del botón

};
