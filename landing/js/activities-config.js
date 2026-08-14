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

  // ── DEPORTIVAS ─────────────────────────────────────────────
  {
    id:          'act-001',
    title:       'CAMPEONATO Y JORNADA DEPORTIVA DREAMTEAM ⚽🏆',
    category:    'deportivas',
    date:        '2026-06-15',
    location:    'Cancha Deportiva Izaguirre',
    description: 'Nuestros asesores demostraron su garra y compañerismo en un apasionante torneo deportivo de integración.',
    image:       'deporte.jpg',
    author:      'DreamTeam',
    featured:    true,
  },

  // ── CUMPLEAÑOS Y CELEBRACIONES ──────────────────────────────
  {
    id:          'act-002',
    title:       'CELEBRACIÓN DE CUMPLEAÑOS DEL MES 🎉🎂',
    category:    'cumpleanos',
    date:        '2026-06-10',
    location:    'Sede DreamTeam',
    description: 'Festejamos juntos a los cumpleañeros del mes con torta, abrazos y los mejores deseos de todo el equipo.',
    image:       'cumpleanos2.jpg',
    author:      'DreamTeam',
    featured:    false,
  },
  {
    id:          'act-003',
    title:       'FIESTA DE CUMPLEAÑOS EN PLATAFORMA 🎈',
    category:    'cumpleanos',
    date:        '2026-05-28',
    location:    'Sala de Ventas DreamTeam',
    description: 'Un momento especial para celebrar la vida y la alegría de nuestros talentos en su día especial.',
    image:       'cumple.jpg',
    author:      'DreamTeam',
    featured:    false,
  },
  {
    id:          'act-004',
    title:       'FESTEJO DE CUMPLEAÑOS EQUIPO COMERCIAL ✨',
    category:    'cumpleanos',
    date:        '2026-05-15',
    location:    'Sede Izaguirre',
    description: 'Celebrando el compromiso y la buena energía de nuestros asesores en sus cumpleaños.',
    image:       'cumpleanos.jpg',
    author:      'DreamTeam',
    featured:    false,
  },

  // ── FESTIVIDADES ───────────────────────────────────────────
  {
    id:          'act-005',
    title:       'HOMENAJE AL DÍA DE LA MADRE 💐❤️',
    category:    'festividades',
    date:        '2026-05-10',
    location:    'Plataforma DreamTeam',
    description: 'Rendimos homenaje a las madres guerreras de nuestro contact center que inspiran y superan metas todos los días.',
    image:       'dia-de-la-madre-.jpg',
    author:      'DreamTeam',
    featured:    false,
  },
  {
    id:          'act-006',
    title:       'CELEBRACIÓN DÍA DEL PADRE 👔👑',
    category:    'festividades',
    date:        '2026-06-20',
    location:    'Sede DreamTeam',
    description: 'Reconocimiento y sorpresas para los papás ejecutivos que dan lo mejor por sus familias y su equipo.',
    image:       'dia-del-padre.jpg',
    author:      'DreamTeam',
    featured:    false,
  },

  // ── LOGROS Y BONOS ─────────────────────────────────────────
  {
    id:          'act-007',
    title:       'ENTREGA DE BONOS Y PREMIOS MENSUALES 💰🔥',
    category:    'logros',
    date:        '2026-06-01',
    location:    'Plataforma Principal',
    description: 'Premiamos el esfuerzo de los mejores asesores comerciales con sus comisiones y bonos en efectivo sin techo.',
    image:       'bonos-mensuales.jpg',
    author:      'DreamTeam',
    featured:    false,
  },
  {
    id:          'act-008',
    title:       'GRAN RULETA DE PREMIOS Y SORPRESAS 🎯🎁',
    category:    'dinamicas',
    date:        '2026-05-22',
    location:    'Sala de Ventas',
    description: 'Los asesores con mayor número de cierres giraron la Ruleta DreamTeam llevándose vales y premios al instante.',
    image:       'ruleta.jpg',
    author:      'DreamTeam',
    featured:    false,
  },
  {
    id:          'act-009',
    title:       'DINÁMICA VENTA O CHUCHE 🍬📱',
    category:    'dinamicas',
    date:        '2026-05-18',
    location:    'Plataforma Comercial',
    description: 'Jugamos y nos divertimos en plena jornada de gestión premiando cada venta realizada durante el turno.',
    image:       'venta-o-chuche.jpg',
    author:      'DreamTeam',
    featured:    false,
  },
  {
    id:          'act-010',
    title:       'RECONOCIMIENTO AL MEJOR VENDEDOR DEL MES 🏅⭐',
    category:    'logros',
    date:        '2026-06-05',
    location:    'Sede DreamTeam',
    description: 'Festejamos el triunfo y el liderazgo de nuestros asesores estrella que baten récords en el mercado español.',
    image:       'recompensa.jpg',
    author:      'DreamTeam',
    featured:    false,
  },

  // ── DINÁMICAS E INTEGRACIÓN ────────────────────────────────
  {
    id:          'act-011',
    title:       'ALMUERZO DE INTEGRACIÓN Y CAMARADERÍA 🍔🍕',
    category:    'dinamicas',
    date:        '2026-04-25',
    location:    'Área de Descanso',
    description: 'Compartimos un gran almuerzo en equipo para reforzar lazos, celebrar logros y recargar energías.',
    image:       'almuerzo-integracion.jpg',
    author:      'DreamTeam',
    featured:    false,
  },
  {
    id:          'act-012',
    title:       'COMPARTIR Y CELEBRACIÓN DE EQUIPO 🥳🍿',
    category:    'dinamicas',
    date:        '2026-04-18',
    location:    'Plataforma Comercial',
    description: 'Risas, bocaditos y unión en un ambiente de trabajo positivo donde cada logro colectivo se festeja.',
    image:       'compartir.jpg',
    author:      'DreamTeam',
    featured:    false,
  },
  {
    id:          'act-013',
    title:       'ACTIVIDADES Y JUEGOS DE INTEGRACIÓN ⚡',
    category:    'dinamicas',
    date:        '2026-04-05',
    location:    'Sede Izaguirre',
    description: 'Dinámicas grupales para potenciar las técnicas de persuasión, trabajo en equipo y clima laboral.',
    image:       'dinamicas.jpg',
    author:      'DreamTeam',
    featured:    false,
  },

  // ── CAPACITACIÓN Y TRABAJO DIARIO ──────────────────────────
  {
    id:          'act-014',
    title:       'CAPACITACIÓN Y FORMACIÓN DE ALTO NIVEL 📚🎙️',
    category:    'entrevistas',
    date:        '2026-06-08',
    location:    'Auditorio DreamTeam',
    description: 'Entrenamiento continuo en productos de telecomunicaciones de España y técnicas de cierre comerciales.',
    image:       'capacitaciones.jpg',
    author:      'DreamTeam',
    featured:    false,
  },
  {
    id:          'act-015',
    title:       'NUESTRA PLATAFORMA DE TRABAJO Y SEDE COVIDA 🏢🚀',
    category:    'entrevistas',
    date:        '2026-05-30',
    location:    'Sede Covida',
    description: 'Conoce nuestras modernas instalaciones equipadas para potenciar al máximo la gestión de nuestros ejecutivos.',
    image:       'sede-covida.jpg',
    author:      'DreamTeam',
    featured:    false,
  },
  {
    id:          'act-016',
    title:       'EQUIPO DREAMTEAM EN ACCIÓN 🎧🔥',
    category:    'entrevistas',
    date:        '2026-05-02',
    location:    'Sala de Ventas',
    description: 'Nuestra fuerza de ventas demostrando profesionalismo y energía positiva llamada tras llamada.',
    image:       'equipo-dreamteam.jpg',
    author:      'DreamTeam',
    featured:    false,
  },
  {
    id:          'act-017',
    title:       'DÍA A DÍA EN LA SALA DE VENTAS 📞💼',
    category:    'entrevistas',
    date:        '2026-04-28',
    location:    'Plataforma DreamTeam',
    description: 'Acompañamiento diario de supervisores y coordinadores garantizando el crecimiento de cada asesor.',
    image:       'trbajo.jpg',
    author:      'DreamTeam',
    featured:    false,
  },
  {
    id:          'act-018',
    title:       'NUESTROS ASESORES EN GESTIÓN COMERCIAL 💼',
    category:    'entrevistas',
    date:        '2026-04-20',
    location:    'Sede DreamTeam',
    description: 'Enfoque, constancia y disciplina diaria en el desarrollo de ventas internacionales.',
    image:       'trabajador.jpg',
    author:      'DreamTeam',
    featured:    false,
  },
  {
    id:          'act-019',
    title:       'EQUIPO UNIDO ALCANZANDO METAS 🚀',
    category:    'entrevistas',
    date:        '2026-04-12',
    location:    'Plataforma de Ventas',
    description: 'Compañerismo y energía positiva en cada turno de trabajo.',
    image:       'equipo.jpg',
    author:      'DreamTeam',
    featured:    false,
  },
  {
    id:          'act-020',
    title:       'MOMENTOS DREAMTEAM 📸✨',
    category:    'dinamicas',
    date:        '2026-03-25',
    location:    'Sede Principal',
    description: 'Instantáneas que reflejan el gran clima laboral de nuestra empresa.',
    image:       'img_2694-2.jpg',
    author:      'DreamTeam',
    featured:    false,
  },
  {
    id:          'act-021',
    title:       'HOMENAJE AL MES DE LA MUJER 💐',
    category:    'festividades',
    date:        '2026-03-08',
    location:    'DreamTeam Contact Center',
    description: 'Reconocimiento especial a todas nuestras colaboradoras en su mes.',
    image:       'mes-mujer.jpg',
    author:      'DreamTeam',
    featured:    false,
  },
  {
    id:          'act-022',
    title:       'NUEVOS INTEGRANTES DEL EQUIPO DE TELEFONÍA 📱',
    category:    'entrevistas',
    date:        '2026-03-15',
    location:    'Plataforma Izaguirre',
    description: 'Damos la bienvenida a los nuevos asesores comerciales que se suman a la familia DreamTeam.',
    image:       'equipo-telefonia.jpeg',
    author:      'DreamTeam',
    featured:    false,
  },
  {
    id:          'act-023',
    title:       'CUMPLEAÑOS SORPRESA DE RRHH 🎉',
    category:    'cumpleanos',
    date:        '2026-05-09',
    location:    'Sede Izaguirre',
    description: 'Celebración sorpresa para nuestro equipo de Gestión Humana.',
    image:       'cumple-walter.jpeg',
    author:      'DreamTeam',
    featured:    false,
  },
  {
    id:          'act-024',
    title:       'CELEBRACIÓN Y HOMENAJE A LAS MADRES DREAMTEAM 💜',
    category:    'festividades',
    date:        '2026-05-11',
    location:    'Plataforma DreamTeam',
    description: 'Un día dedicado a las heroínas detrás del auricular en nuestro contact center.',
    image:       'felizdiamama.png',
    author:      'DreamTeam',
    featured:    false,
  }

];
