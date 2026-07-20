/**
 * ╔══════════════════════════════════════════════════════════════════════════╗
 * ║              CONFIGURACIÓN DE DINÁMICAS / ACTIVIDADES                    ║
 * ╠══════════════════════════════════════════════════════════════════════════╣
 * ║                                                                          ║
 * ║   ────────  CÓMO AÑADIR UNA PUBLICACIÓN  ────────                        ║
 * ║                                                                          ║
 * ║   1. Coloca la imagen en:   images/activities/                           ║
 * ║   2. Copia la PLANTILLA del final de este archivo                        ║
 * ║   3. Pégala como bloque nuevo dentro de ACTIVITIES (arriba o abajo)      ║
 * ║   4. Cambia los datos y pon el nombre de tu imagen en  image             ║
 * ║   5. Guarda y recarga la landing                                         ║
 * ║                                                                          ║
 * ║   ────────  📸 FORMATO DE LAS IMÁGENES (IMPORTANTE)  ────────            ║
 * ║                                                                          ║
 * ║   FORMATO:    JPG para fotos (recomendado) o WebP.                       ║
 * ║               PNG solo para gráficos/logos con transparencia.            ║
 * ║                                                                          ║
 * ║   RELACIÓN DE ASPECTO:  4:5 vertical (formato post de Instagram)         ║
 * ║               → Sirve para TODAS las tarjetas (normales y destacada).    ║
 * ║                                                                          ║
 * ║   RESOLUCIÓN RECOMENDADA:                                                ║
 * ║     · Tarjeta normal    → 1080 × 1350 px  (4:5)                          ║
 * ║     · Tarjeta destacada → 1350 × 1500 px  (9:10) para más nitidez,       ║
 * ║       aunque 1080 × 1350 también se ve bien.                             ║
 * ║                                                                          ║
 * ║   PESO: idealmente menos de 500 KB por imagen (usa tinypng.com           ║
 * ║         o squoosh.app para comprimir sin perder calidad).                ║
 * ║                                                                          ║
 * ║   NOTA: la tarjeta recorta la imagen automáticamente (object-fit         ║
 * ║   cover), centrada. Deja el sujeto principal al CENTRO de la foto        ║
 * ║   y evita texto importante en los bordes.                                ║
 * ║                                                                          ║
 * ║   ────────  CÓMO ELIMINAR UNA PUBLICACIÓN  ────────                      ║
 * ║                                                                          ║
 * ║   Borra el bloque completo (desde el  {  hasta la  },  inclusive).       ║
 * ║                                                                          ║
 * ║   ────────  CAMPOS  ────────                                             ║
 * ║                                                                          ║
 * ║     id          → identificador único (sin espacios, ej: 'act-008')      ║
 * ║     title       → título que aparece en la tarjeta                       ║
 * ║     category    → ver categorías permitidas más abajo                    ║
 * ║     date        → fecha en formato YYYY-MM-DD                            ║
 * ║     location    → lugar donde ocurrió                                    ║
 * ║     description → texto breve que verá el visitante                      ║
 * ║     image       → SOLO EL NOMBRE del archivo (se busca en                ║
 * ║                   images/activities/ automáticamente).                   ║
 * ║                   Ej: 'copa-2026.jpg'                                    ║
 * ║     author      → quién publica (aparece con círculo de iniciales)       ║
 * ║                   Ej: 'Andrea Lozano'  →  chip "AL"                      ║
 * ║     featured    → true = tarjeta GRANDE destacada (badge ★ DESTACADO).   ║
 * ║                   Solo debe haber UNA con true a la vez.                 ║
 * ║                                                                          ║
 * ║   ────────  CATEGORÍAS PERMITIDAS  ────────                              ║
 * ║                                                                          ║
 * ║     'deportivas'    🏆  torneos, encuentros deportivos                   ║
 * ║     'entrevistas'   🎤  charlas, conociendo al equipo                    ║
 * ║     'cumpleanos'    🎂  cumpleaños y celebraciones                       ║
 * ║     'festividades'  ✨  Día de Muertos, Navidad, etc.                    ║
 * ║     'dinamicas'     ⚡  dinámicas, juegos y concursos del equipo         ║
 * ║     'logros'        🎯  hitos, reconocimientos, posadas                  ║
 * ║     'pausas'        🌿  pausas activas, wellness, yoga                   ║
 * ║                                                                          ║
 * ╚══════════════════════════════════════════════════════════════════════════╝
 */

window.ACTIVITIES_CONFIG = [

  // ─────────────────────────────────────────────────────────────
  {
    id:          'act-001',
    title:       'PARTIDOS DE FUTBOLL – Copa DreamTeam 2026',
    category:    'deportivas',
    date:        '2026-05-04',
    location:    'Cancha Izaguirre',
    description: 'La Copa DreamTeam reunió a 38 colaboradores en una tarde de goles, snacks y porras.',
    image:       'copa-dreamteam.jpg',
    author:      'DreamTeam',
    featured:    true,
  },

  // ─────────────────────────────────────────────────────────────
  {
    id:          'act-002',
    title:       'CELEBRANDO A NUESTRAS MUJERES TRABAJADORAS',
    category:    'dinamicas',
    date:        '2026-03-01',
    location:    'DREAMTEAM CONTAC CENTER',
    description: 'Aqui valoramos tu gran labor sacando adelante esta empresa con tu mayor esfuerzo.',
    image:       'mes-mujer.jpg',
    author:      'DreamTeam',
    featured:    false,
  },

  // ─────────────────────────────────────────────────────────────
  {
    id:          'act-003',
    title:       'Cumple sorpresa para WALTER 😁',
    category:    'cumpleanos',
    date:        '2026-05-09',
    location:    'PLATAFORMA DREAMTEAM - IZAGUIRRE',
    description: 'El equipo de DreamTeam organizó una mini fiesta sorpresa para Walter, responsable de RRHH.',
    image:       'cumple-walter.jpeg',
    author:      'DreamTeam',
    featured:    false,
  },

  // ─────────────────────────────────────────────────────────────
  {
    id:          'act-004',
    title:       'Feliz Dia de las Madres a nuestras guerreras del call center',
    category:    'festividades',
    date:        '2026-04-11',
    location:    'DreamTeam',
    description: '💜✨ En 𝗗𝗿𝗲𝗮𝗺 𝗧𝗲𝗮𝗺, celebramos a 𝐥𝐚𝐬 𝐯𝐞𝐫𝐝𝐚𝐝𝐞𝐫𝐚𝐬 𝐡𝐞𝐫𝐨𝐢́𝐧𝐚𝐬 𝐝𝐞𝐭𝐫𝐚́𝐬 𝐝𝐞𝐥 𝐚𝐮𝐫𝐢𝐜𝐮𝐥𝐚𝐫 ✨💜Cada 𝒍𝒍𝒂𝒎𝒂𝒅𝒂 atendida, cada 𝒄𝒍𝒊𝒆𝒏𝒕𝒆 satisfecho y cada 𝒎𝒆𝒕𝒂 alcanzada lleva detrás 𝒉𝒐𝒓𝒂𝒔 𝒅𝒆 𝒆𝒔𝒇𝒖𝒆𝒓𝒛𝒐, entrega y un 𝒄𝒐𝒓𝒂𝒛𝒐́𝒏 𝒍𝒍𝒆𝒏𝒐 𝒅𝒆 𝒂𝒎𝒐𝒓. Sabemos que no es fácil equilibrar el trabajo y la maternidad, pero ustedes lo hacen con una fuerza admirable que nos inspira cada día.',
    image:       'felizdiamama.png',
    author:      'DreamTeam',
    featured:    false,
  },

  // ─────────────────────────────────────────────────────────────
  {
    id:          'act-005',
    title:       'Conociendo al Equipo de Telefonia',
    category:    'entrevistas',
    date:        '2026-03-15',
    location:    'Plataforma DreamTeaam - Izaguirre',
    description: 'Llegaron nuevos refuerzos al equipo de Telefonia, vengan a conocerlos y unete a nosotros',
    image:       'equipo-telefonia.jpeg',
    author:      'DreamTeam',
    featured:    false,
  },

  // ─────────────────────────────────────────────────────────────
  {
    id:          'act-006',
    title:       'DIA DE ENTRENAMIENTO CON EL EQUIPO DREAMTEAM 💪',
    category:    'deportivas',
    date:        '2025-12-19',
    location:    'Loza deportiva - Izaguirre',
    description: 'Empezamos el finde con toda la energia, con un dia lleno de actividades y entrenamiento para trabajar fuertes y saludables',
    image:       'entrenamiento-dream.jpg',
    author:      'DreamTeam',
    featured:    false,
  },

  // ─────────────────────────────────────────────────────────────


  // ─────────────────────────────────────────────────────────────
  // 👇 PEGA AQUÍ NUEVAS PUBLICACIONES (copia la PLANTILLA de abajo)
  // ─────────────────────────────────────────────────────────────

];


/* ════════════════════════════════════════════════════════════════════════════
   PLANTILLA — copia este bloque (sin la barra-asterisco) y pégalo arriba
   dentro de ACTIVITIES_CONFIG. Cambia los valores por los tuyos.

      // ─────────────────────────────────────────────────────────────
      {
        id:          'act-008',                          // único, sin espacios
        title:       'Título de la nueva actividad',
        category:    'deportivas',                       // ver categorías arriba
        date:        '2026-07-20',                       // YYYY-MM-DD
        location:    'Dónde ocurrió',
        description: 'Una descripción breve de qué pasó en la actividad.',
        image:       'mi-foto.jpg',                      // JPG 4:5 (1080×1350) en images/activities/
        author:      'Nombre Apellido',                  // aparece con chip de iniciales
        featured:    false,                              // true = tarjeta GRANDE (solo una)
      },

   ────────────────────────────────────────────────────────────────────────────
   PARA ELIMINAR  →  borra el bloque entero (de  {  hasta  },  inclusive).
   PARA REORDENAR →  no hace falta: la sección ordena por fecha (más reciente
                     primero) y la destacada siempre va en la esquina grande.
   ════════════════════════════════════════════════════════════════════════════ */
