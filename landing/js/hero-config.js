/**
 * ╔══════════════════════════════════════════════════════════════════════════╗
 * ║           CONFIGURACIÓN DE FOTOS DE LA PORTADA (HERO)                    ║
 * ╠══════════════════════════════════════════════════════════════════════════╣
 * ║                                                                          ║
 * ║   Las fotos de los asesores/trabajadores que rotan en la tarjeta         ║
 * ║   principal de la portada, con fundido (interpolación) entre ellas.      ║
 * ║                                                                          ║
 * ║   ────────  CÓMO SUBIR LAS FOTOS  ────────                               ║
 * ║                                                                          ║
 * ║   1. Coloca las fotos en la carpeta:   images/hero/                      ║
 * ║   2. Escribe el nombre de cada archivo en la lista  images  (abajo)      ║
 * ║   3. Guarda y recarga la landing                                         ║
 * ║                                                                          ║
 * ║   Se muestran en el orden de la lista y giran en bucle infinito.         ║
 * ║   Si la lista está VACÍA, se queda la foto original de la landing.       ║
 * ║                                                                          ║
 * ║   ────────  📸 FORMATO DE LAS FOTOS (IMPORTANTE)  ────────               ║
 * ║                                                                          ║
 * ║   FORMATO:    JPG (recomendado) o WebP.                                  ║
 * ║                                                                          ║
 * ║   RELACIÓN DE ASPECTO:  4:5 vertical (formato retrato,                   ║
 * ║               igual que un post de Instagram).                           ║
 * ║                                                                          ║
 * ║   RESOLUCIÓN RECOMENDADA:  1080 × 1350 px                                ║
 * ║               (mínimo 800 × 1000 px para que no se vea pixelada).        ║
 * ║                                                                          ║
 * ║   PESO: menos de 400 KB por foto (comprime en tinypng.com).              ║
 * ║                                                                          ║
 * ║   IMPORTANTE: todas las fotos deben tener la MISMA relación de           ║
 * ║   aspecto para que el fundido se vea parejo. El recorte es               ║
 * ║   automático y centrado: deja a la persona al CENTRO de la foto,         ║
 * ║   de la cintura hacia arriba, con algo de aire sobre la cabeza.          ║
 * ║                                                                          ║
 * ║   ────────  PARÁMETROS  ────────                                         ║
 * ║                                                                          ║
 * ║     duration    → segundos que dura cada foto en pantalla                ║
 * ║     transition  → segundos que dura el fundido entre fotos               ║
 * ║     images      → lista de archivos (dentro de images/hero/)             ║
 * ║                                                                          ║
 * ╚══════════════════════════════════════════════════════════════════════════╝
 */

window.HERO_SLIDES = {

  duration:   8,      // ← cada foto dura 8 segundos

  transition: 1.4,    // ← fundido de 1.4 segundos entre fotos

  images: [
    'asesor 1.png',
    'asesor 2.png',
    'asesor 3.png',
    'asesor 4.png',
    'asesor 5.png',
    'asesor 6.png'
    // 👇 escribe aquí tus fotos (una por línea, entre comillas y con coma)
    // 'asesor-1.jpg',
    // 'asesor-2.jpg',
    // 'asesor-3.jpg',
  ],

};
