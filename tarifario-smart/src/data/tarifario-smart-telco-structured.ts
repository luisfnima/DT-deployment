// Tarifario Smart Telco - datos estructurados desde PDFs del usuario
// Fuentes:
// - TARIFARIO_VODAFONE_MAYO_2026.pdf
// - YOIGO 02.06.26.pdf
// - Tarifario Orange.pdf
// Nota: algunos datos de Yoigo vienen de capturas/imagen y deben ser validados antes de producción.

export type OperatorId = 'vodafone' | 'yoigo' | 'orange' | 'lowi' | 'win';
export type PriceKind = 'final' | 'promo_then_regular' | 'segmented_discount' | 'one_time';
export type PlanCategory =
  | 'fibra_movil'
  | 'fibra_fijo_movil'
  | 'fibra_movil_tv'
  | 'fibra_movil_streaming'
  | 'fibra_movil_empresa'
  | 'solo_addon';

export interface OperatorMeta {
  id: OperatorId;
  name: string;
  accent: string;
  shortPitch: string;
}

export interface TariffPlan {
  id: string;
  operatorId: OperatorId;
  category: PlanCategory;
  name: string;
  description?: string;
  fiber?: '600Mb' | '1Gb' | '500Mb' | '750Mb' | '850Mb' | '1.5Gb' | '2Gb' | '2.5Gb';
  mobileLines?: number;
  mobileData?: string;
  fixedLineIncluded?: boolean;
  tvIncluded?: boolean;
  streamingIncluded?: string[];
  priceKind: PriceKind;
  monthlyPrice?: number;
  promoPrice?: number;
  promoMonths?: number;
  regularPrice?: number;
  segment?: string;
  portabilityFrom?: string;
  permanenceMonths?: number;
  tags: string[];
  highlights: string[];
  notes?: string[];
  source: string;
  isNewCampaign?: boolean;
}

export interface Addon {
  id: string;
  operatorId?: OperatorId; // si se omite, es addon global
  name: string;
  category:
    | 'mobile_line'
    | 'tv'
    | 'streaming'
    | 'fiber_upgrade'
    | 'sim'
    | 'security'
    | 'business'
    | 'installation'
    | 'football';
  monthlyPrice?: number;
  oneTimePrice?: number;
  promoPrice?: number;
  promoMonths?: number;
  regularPrice?: number;
  description: string;
  tags: string[];
  notes?: string[];
  source: string;
}

export const operators: OperatorMeta[] = [
  {
    id: 'yoigo',
    name: 'Yoigo',
    accent: '#B026FF',
    shortPitch: 'Sencillez, ahorro y packs con TV/streaming.',
  },
  {
    id: 'orange',
    name: 'Orange',
    accent: '#FF7900',
    shortPitch: 'Fibra 1Gb, móvil 5G+ y paquetes escalables.',
  },
  {
    id: 'vodafone',
    name: 'Vodafone',
    accent: '#E60000',
    shortPitch: 'Promos fuertes de entrada y packs con plataformas.'
  },
  {
    id: 'lowi',
    name: 'Lowi',
    accent: '#E50015',
    shortPitch: 'Simple, acumulable y sin complicaciones. Cobertura Vodafone.'
  },
  {
    id: 'win',
    name: 'WIN',
    accent: '#FF5A00',
    shortPitch: 'El Internet de los Winners. 100% Fibra Óptica simétrica.'
  }
];

export const tariffPlans: TariffPlan[] = [
  // ===================== VODAFONE =====================
  // Productos 3P permanencia 12 meses - Solo 1 línea móvil
  {
    id: 'vodafone-fibra600-1linea-60gb',
    operatorId: 'vodafone',
    category: 'fibra_movil',
    name: 'Fibra 600Mb + 1 línea 60GB',
    fiber: '600Mb',
    mobileLines: 1,
    mobileData: '60GB 5G, luego 2Mbps',
    priceKind: 'final',
    monthlyPrice: 43,
    permanenceMonths: 12,
    tags: ['Fibra 600', '1 línea', '60GB'],
    highlights: ['Fibra 600Mb', '1 línea móvil 60GB', 'Velocidad 5G hasta consumir GB'],
    notes: ['Después de consumir GB, baja a 2Mbps.'],
    source: 'Vodafone mayo 2026 - tabla superior',
  },
  {
    id: 'vodafone-fibra600-1linea-160gb',
    operatorId: 'vodafone',
    category: 'fibra_movil',
    name: 'Fibra 600Mb + 1 línea 160GB',
    fiber: '600Mb',
    mobileLines: 1,
    mobileData: '160GB 5G, luego 2Mbps',
    priceKind: 'final',
    monthlyPrice: 48,
    permanenceMonths: 12,
    tags: ['Fibra 600', '1 línea', '160GB'],
    highlights: ['Fibra 600Mb', '1 línea móvil 160GB', 'Velocidad 5G hasta consumir GB'],
    notes: ['Después de consumir GB, baja a 2Mbps.'],
    source: 'Vodafone mayo 2026 - tabla superior',
  },
  {
    id: 'vodafone-fibra600-1linea-ilimitado',
    operatorId: 'vodafone',
    category: 'fibra_movil',
    name: 'Fibra 600Mb + 1 línea ilimitada',
    fiber: '600Mb',
    mobileLines: 1,
    mobileData: 'Ilimitado 5G',
    priceKind: 'final',
    monthlyPrice: 53,
    permanenceMonths: 12,
    tags: ['Fibra 600', '1 línea', 'Ilimitado'],
    highlights: ['Fibra 600Mb', '1 línea móvil ilimitada', 'Velocidad 5G'],
    source: 'Vodafone mayo 2026 - tabla superior',
  },
  {
    id: 'vodafone-fibra1gb-1linea-60gb',
    operatorId: 'vodafone',
    category: 'fibra_movil',
    name: 'Fibra 1Gb + 1 línea 60GB',
    fiber: '1Gb',
    mobileLines: 1,
    mobileData: '60GB 5G, luego 2Mbps',
    priceKind: 'final',
    monthlyPrice: 53,
    permanenceMonths: 12,
    tags: ['Fibra 1Gb', '1 línea', '60GB'],
    highlights: ['Fibra 1Gb', '1 línea móvil 60GB', 'Velocidad 5G hasta consumir GB'],
    notes: ['Después de consumir GB, baja a 2Mbps.'],
    source: 'Vodafone mayo 2026 - tabla superior',
  },
  {
    id: 'vodafone-fibra1gb-1linea-160gb',
    operatorId: 'vodafone',
    category: 'fibra_movil',
    name: 'Fibra 1Gb + 1 línea 160GB',
    fiber: '1Gb',
    mobileLines: 1,
    mobileData: '160GB 5G, luego 2Mbps',
    priceKind: 'final',
    monthlyPrice: 58,
    permanenceMonths: 12,
    tags: ['Fibra 1Gb', '1 línea', '160GB'],
    highlights: ['Fibra 1Gb', '1 línea móvil 160GB', 'Velocidad 5G hasta consumir GB'],
    notes: ['Después de consumir GB, baja a 2Mbps.'],
    source: 'Vodafone mayo 2026 - tabla superior',
  },
  {
    id: 'vodafone-fibra1gb-1linea-ilimitado',
    operatorId: 'vodafone',
    category: 'fibra_movil',
    name: 'Fibra 1Gb + 1 línea ilimitada',
    fiber: '1Gb',
    mobileLines: 1,
    mobileData: 'Ilimitado 5G',
    priceKind: 'final',
    monthlyPrice: 63,
    permanenceMonths: 12,
    tags: ['Fibra 1Gb', '1 línea', 'Ilimitado'],
    highlights: ['Fibra 1Gb', '1 línea móvil ilimitada', 'Velocidad 5G'],
    source: 'Vodafone mayo 2026 - tabla superior',
  },

  // Vodafone plan sin TV - 2 líneas incluidas
  {
    id: 'vodafone-fibra600-2lineas-160gb-promo',
    operatorId: 'vodafone',
    category: 'fibra_movil',
    name: 'Fibra 600Mb + 2 líneas 160GB',
    fiber: '600Mb',
    mobileLines: 2,
    mobileData: '160GB 5G',
    priceKind: 'promo_then_regular',
    promoPrice: 39,
    promoMonths: 3,
    regularPrice: 54,
    permanenceMonths: 12,
    tags: ['Fibra 600', '2 líneas', '160GB', 'Promo 3 meses'],
    highlights: ['2 líneas móviles incluidas', '160GB compartidos/por plan según validación', 'Promo 3 meses'],
    source: 'Vodafone mayo 2026 - Plan sin TV',
  },
  {
    id: 'vodafone-fibra1gb-2lineas-160gb-promo',
    operatorId: 'vodafone',
    category: 'fibra_movil',
    name: 'Fibra 1Gb + 2 líneas 160GB',
    fiber: '1Gb',
    mobileLines: 2,
    mobileData: '160GB 5G',
    priceKind: 'promo_then_regular',
    promoPrice: 39,
    promoMonths: 3,
    regularPrice: 65,
    permanenceMonths: 12,
    tags: ['Fibra 1Gb', '2 líneas', '160GB', 'Promo 3 meses'],
    highlights: ['2 líneas móviles incluidas', 'Fibra 1Gb', 'Promo 3 meses'],
    source: 'Vodafone mayo 2026 - Plan sin TV',
  },
  {
    id: 'vodafone-fibra600-2lineas-ilimitadas-promo',
    operatorId: 'vodafone',
    category: 'fibra_movil',
    name: 'Fibra 600Mb + 2 líneas ilimitadas',
    fiber: '600Mb',
    mobileLines: 2,
    mobileData: 'Ilimitado 5G',
    priceKind: 'promo_then_regular',
    promoPrice: 44,
    promoMonths: 3,
    regularPrice: 59,
    permanenceMonths: 12,
    tags: ['Fibra 600', '2 líneas', 'Ilimitadas', 'Promo 3 meses'],
    highlights: ['2 líneas móviles ilimitadas', 'Fibra 600Mb', 'Promo 3 meses'],
    source: 'Vodafone mayo 2026 - Plan sin TV',
  },
  {
    id: 'vodafone-fibra1gb-2lineas-ilimitadas-promo',
    operatorId: 'vodafone',
    category: 'fibra_movil',
    name: 'Fibra 1Gb + 2 líneas ilimitadas',
    fiber: '1Gb',
    mobileLines: 2,
    mobileData: 'Ilimitado 5G',
    priceKind: 'promo_then_regular',
    promoPrice: 44,
    promoMonths: 3,
    regularPrice: 70,
    permanenceMonths: 12,
    tags: ['Fibra 1Gb', '2 líneas', 'Ilimitadas', 'Promo 3 meses'],
    highlights: ['2 líneas móviles ilimitadas', 'Fibra 1Gb', 'Promo 3 meses'],
    source: 'Vodafone mayo 2026 - Plan sin TV',
  },

  // Vodafone 2 plataformas: Netflix + una a elegir: HBO/Prime/Disney + 100 canales
  ...[
    ['prime', 'Prime', 67, 62, 78, 73],
    ['hbo', 'HBO Max', 71, 66, 82, 77],
    ['disney', 'Disney+', 72, 67, 83, 78],
  ].flatMap(([key, label, p600Il, p600160, p1Il, p1160]) => [
    {
      id: `vodafone-fibra600-2lineas-ilimitadas-netflix-${key}`,
      operatorId: 'vodafone' as const,
      category: 'fibra_movil_streaming' as const,
      name: `Fibra 600Mb + 2 ilimitadas + Netflix + ${label}`,
      fiber: '600Mb' as const,
      mobileLines: 2,
      mobileData: 'Ilimitado 5G',
      tvIncluded: true,
      streamingIncluded: ['Netflix', String(label)],
      priceKind: 'promo_then_regular' as const,
      promoPrice: 50,
      promoMonths: 3,
      regularPrice: Number(p600Il),
      permanenceMonths: 12,
      tags: ['2 plataformas', 'Netflix', String(label), '100 canales'],
      highlights: ['Netflix incluido', `${label} incluido`, '100 canales'],
      source: 'Vodafone mayo 2026 - 2 plataformas',
    },
    {
      id: `vodafone-fibra600-2lineas-160gb-netflix-${key}`,
      operatorId: 'vodafone' as const,
      category: 'fibra_movil_streaming' as const,
      name: `Fibra 600Mb + 2 líneas 160GB + Netflix + ${label}`,
      fiber: '600Mb' as const,
      mobileLines: 2,
      mobileData: '160GB 5G',
      tvIncluded: true,
      streamingIncluded: ['Netflix', String(label)],
      priceKind: 'promo_then_regular' as const,
      promoPrice: 45,
      promoMonths: 3,
      regularPrice: Number(p600160),
      permanenceMonths: 12,
      tags: ['2 plataformas', 'Netflix', String(label), '100 canales'],
      highlights: ['Netflix incluido', `${label} incluido`, '100 canales'],
      source: 'Vodafone mayo 2026 - 2 plataformas',
    },
    {
      id: `vodafone-fibra1gb-2lineas-ilimitadas-netflix-${key}`,
      operatorId: 'vodafone' as const,
      category: 'fibra_movil_streaming' as const,
      name: `Fibra 1Gb + 2 ilimitadas + Netflix + ${label}`,
      fiber: '1Gb' as const,
      mobileLines: 2,
      mobileData: 'Ilimitado 5G',
      tvIncluded: true,
      streamingIncluded: ['Netflix', String(label)],
      priceKind: 'promo_then_regular' as const,
      promoPrice: 50,
      promoMonths: 3,
      regularPrice: Number(p1Il),
      permanenceMonths: 12,
      tags: ['2 plataformas', 'Netflix', String(label), '100 canales'],
      highlights: ['Netflix incluido', `${label} incluido`, '100 canales'],
      source: 'Vodafone mayo 2026 - 2 plataformas',
    },
    {
      id: `vodafone-fibra1gb-2lineas-160gb-netflix-${key}`,
      operatorId: 'vodafone' as const,
      category: 'fibra_movil_streaming' as const,
      name: `Fibra 1Gb + 2 líneas 160GB + Netflix + ${label}`,
      fiber: '1Gb' as const,
      mobileLines: 2,
      mobileData: '160GB 5G',
      tvIncluded: true,
      streamingIncluded: ['Netflix', String(label)],
      priceKind: 'promo_then_regular' as const,
      promoPrice: 45,
      promoMonths: 3,
      regularPrice: Number(p1160),
      permanenceMonths: 12,
      tags: ['2 plataformas', 'Netflix', String(label), '100 canales'],
      highlights: ['Netflix incluido', `${label} incluido`, '100 canales'],
      source: 'Vodafone mayo 2026 - 2 plataformas',
    },
  ]),

  // Vodafone 3 plataformas: Netflix + 2 más + 100 canales
  ...[
    ['prime-hbo', ['Prime', 'HBO Max'], 75, 70, 86, 79],
    ['prime-disney', ['Prime', 'Disney+'], 76, 71, 87, 82],
    ['hbo-disney', ['HBO Max', 'Disney+'], 80, 75, 91, 86],
  ].flatMap(([key, labels, p600Il, p600160, p1Il, p1160]) => [
    {
      id: `vodafone-fibra600-2lineas-ilimitadas-netflix-${key}`,
      operatorId: 'vodafone' as const,
      category: 'fibra_movil_streaming' as const,
      name: `Fibra 600Mb + 2 ilimitadas + Netflix + ${(labels as string[]).join(' + ')}`,
      fiber: '600Mb' as const,
      mobileLines: 2,
      mobileData: 'Ilimitado 5G',
      tvIncluded: true,
      streamingIncluded: ['Netflix', ...(labels as string[])],
      priceKind: 'promo_then_regular' as const,
      promoPrice: 54,
      promoMonths: 3,
      regularPrice: Number(p600Il),
      permanenceMonths: 12,
      tags: ['3 plataformas', 'Netflix', ...(labels as string[]), '100 canales'],
      highlights: ['Netflix incluido', `${(labels as string[]).join(' + ')} incluido`, '100 canales'],
      source: 'Vodafone mayo 2026 - 3 plataformas',
    },
    {
      id: `vodafone-fibra600-2lineas-160gb-netflix-${key}`,
      operatorId: 'vodafone' as const,
      category: 'fibra_movil_streaming' as const,
      name: `Fibra 600Mb + 2 líneas 160GB + Netflix + ${(labels as string[]).join(' + ')}`,
      fiber: '600Mb' as const,
      mobileLines: 2,
      mobileData: '160GB 5G',
      tvIncluded: true,
      streamingIncluded: ['Netflix', ...(labels as string[])],
      priceKind: 'promo_then_regular' as const,
      promoPrice: 49,
      promoMonths: 3,
      regularPrice: Number(p600160),
      permanenceMonths: 12,
      tags: ['3 plataformas', 'Netflix', ...(labels as string[]), '100 canales'],
      highlights: ['Netflix incluido', `${(labels as string[]).join(' + ')} incluido`, '100 canales'],
      source: 'Vodafone mayo 2026 - 3 plataformas',
    },
    {
      id: `vodafone-fibra1gb-2lineas-ilimitadas-netflix-${key}`,
      operatorId: 'vodafone' as const,
      category: 'fibra_movil_streaming' as const,
      name: `Fibra 1Gb + 2 ilimitadas + Netflix + ${(labels as string[]).join(' + ')}`,
      fiber: '1Gb' as const,
      mobileLines: 2,
      mobileData: 'Ilimitado 5G',
      tvIncluded: true,
      streamingIncluded: ['Netflix', ...(labels as string[])],
      priceKind: 'promo_then_regular' as const,
      promoPrice: 54,
      promoMonths: 3,
      regularPrice: Number(p1Il),
      permanenceMonths: 12,
      tags: ['3 plataformas', 'Netflix', ...(labels as string[]), '100 canales'],
      highlights: ['Netflix incluido', `${(labels as string[]).join(' + ')} incluido`, '100 canales'],
      source: 'Vodafone mayo 2026 - 3 plataformas',
    },
    {
      id: `vodafone-fibra1gb-2lineas-160gb-netflix-${key}`,
      operatorId: 'vodafone' as const,
      category: 'fibra_movil_streaming' as const,
      name: `Fibra 1Gb + 2 líneas 160GB + Netflix + ${(labels as string[]).join(' + ')}`,
      fiber: '1Gb' as const,
      mobileLines: 2,
      mobileData: '160GB 5G',
      tvIncluded: true,
      streamingIncluded: ['Netflix', ...(labels as string[])],
      priceKind: 'promo_then_regular' as const,
      promoPrice: 49,
      promoMonths: 3,
      regularPrice: Number(p1160),
      permanenceMonths: 12,
      tags: ['3 plataformas', 'Netflix', ...(labels as string[]), '100 canales'],
      highlights: ['Netflix incluido', `${(labels as string[]).join(' + ')} incluido`, '100 canales'],
      source: 'Vodafone mayo 2026 - 3 plataformas',
    },
  ]),

  // Vodafone 4 plataformas: Netflix + HBO/Prime/Disney + 100 canales
  {
    id: 'vodafone-fibra600-2lineas-ilimitadas-4plataformas',
    operatorId: 'vodafone',
    category: 'fibra_movil_streaming',
    name: 'Fibra 600Mb + 2 ilimitadas + 4 plataformas',
    fiber: '600Mb',
    mobileLines: 2,
    mobileData: 'Ilimitado 5G',
    tvIncluded: true,
    streamingIncluded: ['Netflix', 'Prime', 'HBO Max', 'Disney+'],
    priceKind: 'promo_then_regular',
    promoPrice: 58,
    promoMonths: 3,
    regularPrice: 83,
    permanenceMonths: 12,
    tags: ['4 plataformas', 'Netflix', 'Prime', 'HBO Max', 'Disney+', '100 canales'],
    highlights: ['4 plataformas', '100 canales', 'Promo 3 meses'],
    notes: ['En el PDF la fila regular aparece como N + Prime + HBO; se asume que incluye Disney+ por ser bloque de 4 plataformas. Validar.'],
    source: 'Vodafone mayo 2026 - 4 plataformas',
  },
  {
    id: 'vodafone-fibra600-2lineas-160gb-4plataformas',
    operatorId: 'vodafone',
    category: 'fibra_movil_streaming',
    name: 'Fibra 600Mb + 2 líneas 160GB + 4 plataformas',
    fiber: '600Mb',
    mobileLines: 2,
    mobileData: '160GB 5G',
    tvIncluded: true,
    streamingIncluded: ['Netflix', 'Prime', 'HBO Max', 'Disney+'],
    priceKind: 'promo_then_regular',
    promoPrice: 55,
    promoMonths: 3,
    regularPrice: 78,
    permanenceMonths: 12,
    tags: ['4 plataformas', 'Netflix', 'Prime', 'HBO Max', 'Disney+', '100 canales'],
    highlights: ['4 plataformas', '100 canales', 'Promo 3 meses'],
    notes: ['Validar composición exacta de plataformas.'],
    source: 'Vodafone mayo 2026 - 4 plataformas',
  },
  {
    id: 'vodafone-fibra1gb-2lineas-ilimitadas-4plataformas',
    operatorId: 'vodafone',
    category: 'fibra_movil_streaming',
    name: 'Fibra 1Gb + 2 ilimitadas + 4 plataformas',
    fiber: '1Gb',
    mobileLines: 2,
    mobileData: 'Ilimitado 5G',
    tvIncluded: true,
    streamingIncluded: ['Netflix', 'Prime', 'HBO Max', 'Disney+'],
    priceKind: 'promo_then_regular',
    promoPrice: 58,
    promoMonths: 3,
    regularPrice: 94,
    permanenceMonths: 12,
    tags: ['4 plataformas', 'Netflix', 'Prime', 'HBO Max', 'Disney+', '100 canales'],
    highlights: ['Fibra 1Gb', '4 plataformas', '100 canales'],
    notes: ['Validar composición exacta de plataformas.'],
    source: 'Vodafone mayo 2026 - 4 plataformas',
  },
  {
    id: 'vodafone-fibra1gb-2lineas-160gb-4plataformas',
    operatorId: 'vodafone',
    category: 'fibra_movil_streaming',
    name: 'Fibra 1Gb + 2 líneas 160GB + 4 plataformas',
    fiber: '1Gb',
    mobileLines: 2,
    mobileData: '160GB 5G',
    tvIncluded: true,
    streamingIncluded: ['Netflix', 'Prime', 'HBO Max', 'Disney+'],
    priceKind: 'promo_then_regular',
    promoPrice: 53,
    promoMonths: 3,
    regularPrice: 89,
    permanenceMonths: 12,
    tags: ['4 plataformas', 'Netflix', 'Prime', 'HBO Max', 'Disney+', '100 canales'],
    highlights: ['Fibra 1Gb', '4 plataformas', '100 canales'],
    notes: ['Validar composición exacta de plataformas.'],
    source: 'Vodafone mayo 2026 - 4 plataformas',
  },

  // --- VODAFONE NUEVAS TARIFAS (Julio 2026) ---
  {
    id: 'vodafone-fibra1gb-2lineas-ilimitadas-prime-or-disney-new',
    operatorId: 'vodafone',
    category: 'fibra_movil_streaming',
    name: 'Fibra 1Gb + 2 ilimitadas + Prime o Disney+ (con anuncios)',
    fiber: '1Gb',
    mobileLines: 2,
    mobileData: 'Ilimitado 5G',
    tvIncluded: true,
    streamingIncluded: ['Amazon Prime o Disney+ con anuncios'],
    priceKind: 'promo_then_regular',
    promoPrice: 54,
    promoMonths: 3,
    regularPrice: 65,
    permanenceMonths: 12,
    tags: ['Nuevas Tarifas', '1Gb', '2 líneas', 'Ilimitadas', 'Prime o Disney+'],
    highlights: ['Fibra 1Gb', '2 líneas ilimitadas', 'Amazon Prime o Disney+ con anuncios'],
    source: 'Vodafone Nuevas Tarifas Julio 2026',
    isNewCampaign: true
  },
  {
    id: 'vodafone-fibra1gb-2lineas-ilimitadas-netflix-anuncios-new',
    operatorId: 'vodafone',
    category: 'fibra_movil_streaming',
    name: 'Fibra 1Gb + 2 ilimitadas + Netflix con anuncios',
    fiber: '1Gb',
    mobileLines: 2,
    mobileData: 'Ilimitado 5G',
    tvIncluded: true,
    streamingIncluded: ['Netflix con anuncios'],
    priceKind: 'promo_then_regular',
    promoPrice: 49,
    promoMonths: 3,
    regularPrice: 79,
    permanenceMonths: 12,
    tags: ['Nuevas Tarifas', '1Gb', '2 líneas', 'Ilimitadas', 'Netflix'],
    highlights: ['Fibra 1Gb', '2 líneas ilimitadas', 'Netflix con anuncios incluido'],
    source: 'Vodafone Nuevas Tarifas Julio 2026',
    isNewCampaign: true
  },
  {
    id: 'vodafone-fibra1gb-2lineas-ilimitadas-hbo-new',
    operatorId: 'vodafone',
    category: 'fibra_movil_streaming',
    name: 'Fibra 1Gb + 2 ilimitadas + HBO Max (Max)',
    fiber: '1Gb',
    mobileLines: 2,
    mobileData: 'Ilimitado 5G',
    tvIncluded: true,
    streamingIncluded: ['HBO Max'],
    priceKind: 'promo_then_regular',
    promoPrice: 49,
    promoMonths: 3,
    regularPrice: 81,
    permanenceMonths: 12,
    tags: ['Nuevas Tarifas', '1Gb', '2 líneas', 'Ilimitadas', 'HBO Max'],
    highlights: ['Fibra 1Gb', '2 líneas ilimitadas', 'HBO Max / Max incluido'],
    source: 'Vodafone Nuevas Tarifas Julio 2026',
    isNewCampaign: true
  },
  {
    id: 'vodafone-fibra1gb-2lineas-ilimitadas-disney-estandar-new',
    operatorId: 'vodafone',
    category: 'fibra_movil_streaming',
    name: 'Fibra 1Gb + 2 ilimitadas + Disney+ Estándar',
    fiber: '1Gb',
    mobileLines: 2,
    mobileData: 'Ilimitado 5G',
    tvIncluded: true,
    streamingIncluded: ['Disney+ Estándar'],
    priceKind: 'promo_then_regular',
    promoPrice: 49,
    promoMonths: 3,
    regularPrice: 82,
    permanenceMonths: 12,
    tags: ['Nuevas Tarifas', '1Gb', '2 líneas', 'Ilimitadas', 'Disney+ Estándar'],
    highlights: ['Fibra 1Gb', '2 líneas ilimitadas', 'Disney+ Estándar (sin anuncios)'],
    source: 'Vodafone Nuevas Tarifas Julio 2026',
    isNewCampaign: true
  },
  {
    id: 'vodafone-fibra1gb-2lineas-ilimitadas-4plataformas-new',
    operatorId: 'vodafone',
    category: 'fibra_movil_streaming',
    name: 'Fibra 1Gb + 2 ilimitadas + 4 Plataformas',
    fiber: '1Gb',
    mobileLines: 2,
    mobileData: 'Ilimitado 5G',
    tvIncluded: true,
    streamingIncluded: ['Disney+', 'Prime Video', 'Max', 'Netflix con anuncios'],
    priceKind: 'promo_then_regular',
    promoPrice: 60,
    promoMonths: 3,
    regularPrice: 94,
    permanenceMonths: 12,
    tags: ['Nuevas Tarifas', '1Gb', '2 líneas', 'Ilimitadas', '4 Plataformas'],
    highlights: ['Fibra 1Gb', '2 líneas ilimitadas', 'Disney+, Prime, Max y Netflix con anuncios'],
    source: 'Vodafone Nuevas Tarifas Julio 2026',
    isNewCampaign: true
  },
  {
    id: 'vodafone-fibra1gb-2lineas-160gb-sintv-definitivo-new',
    operatorId: 'vodafone',
    category: 'fibra_movil',
    name: 'Fibra 1Gb + 2 líneas 160GB (Solo Portabilidad)',
    fiber: '1Gb',
    mobileLines: 2,
    mobileData: '160GB 5G',
    tvIncluded: false,
    priceKind: 'final',
    monthlyPrice: 45.70,
    permanenceMonths: 12,
    tags: ['Nuevas Tarifas', 'Solo Portabilidad', '1Gb', '2 líneas', '160GB', 'Sin TV'],
    highlights: ['Fibra 1Gb', '2 líneas 160GB', 'Precio definitivo 45.70€/mes'],
    source: 'Vodafone Nuevas Tarifas Julio 2026',
    isNewCampaign: true
  },
  {
    id: 'vodafone-fibra1gb-2lineas-160gb-sintv-promo-new',
    operatorId: 'vodafone',
    category: 'fibra_movil',
    name: 'Fibra 1Gb + 2 líneas 160GB (Sin TV)',
    fiber: '1Gb',
    mobileLines: 2,
    mobileData: '160GB 5G',
    tvIncluded: false,
    priceKind: 'promo_then_regular',
    promoPrice: 39,
    promoMonths: 3,
    regularPrice: 65,
    permanenceMonths: 12,
    tags: ['Nuevas Tarifas', '1Gb', '2 líneas', '160GB', 'Promo 3 meses'],
    highlights: ['Fibra 1Gb', '2 líneas 160GB', 'Promo 39€ x 3 meses, luego 65€/mes'],
    source: 'Vodafone Nuevas Tarifas Julio 2026',
    isNewCampaign: true
  },

  // ===================== YOIGO =====================
  {
    id: 'yoigo-portabilidad-fibra600-2lineas-tv-1plataforma',
    operatorId: 'yoigo',
    category: 'fibra_movil_tv',
    name: 'Fibra 600Mb + 2 líneas + Yoigo TV + 1 plataforma',
    fiber: '600Mb',
    mobileLines: 2,
    mobileData: 'GB ilimitados',
    tvIncluded: true,
    streamingIncluded: ['Elegir 1: Disney+ o HBO Max'],
    priceKind: 'promo_then_regular',
    promoPrice: 45,
    promoMonths: 12,
    regularPrice: 73,
    tags: ['Portabilidad', 'Fibra 600', '2 líneas', 'Yoigo TV', '1 plataforma'],
    highlights: ['Yoigo TV incluido', 'Elegir Disney+ o HBO Max', 'Precio 12 meses'],
    source: 'Yoigo 02.06.26 - página 1',
  },
  {
    id: 'yoigo-portabilidad-fibra600-2lineas-netflix',
    operatorId: 'yoigo',
    category: 'fibra_movil_streaming',
    name: 'Fibra 600Mb + 2 líneas + Netflix',
    fiber: '600Mb',
    mobileLines: 2,
    mobileData: 'GB ilimitados',
    tvIncluded: true,
    streamingIncluded: ['Netflix'],
    priceKind: 'promo_then_regular',
    promoPrice: 47,
    promoMonths: 12,
    regularPrice: 75,
    tags: ['Portabilidad', 'Fibra 600', '2 líneas', 'Netflix'],
    highlights: ['Netflix incluido', '2 líneas móviles', 'Precio 12 meses'],
    source: 'Yoigo 02.06.26 - página 1',
  },
  {
    id: 'yoigo-digi-fibra1gb-1linea-ilimitada',
    operatorId: 'yoigo',
    category: 'fibra_movil',
    name: 'Especial Digi: Fibra 1Gb + 1 línea GB ilimitados',
    fiber: '1Gb',
    mobileLines: 1,
    mobileData: 'GB ilimitados',
    priceKind: 'promo_then_regular',
    promoPrice: 25,
    promoMonths: 3,
    regularPrice: 40,
    segment: 'Especial portabilidades Digi',
    tags: ['Especial Digi', 'Fibra 1Gb', '1 línea', 'GB ilimitados'],
    highlights: ['Fibra 1Gb', '1 línea con GB ilimitados', 'Promo 3 meses'],
    source: 'Yoigo 02.06.26 - página 1',
  },
  {
    id: 'yoigo-portabilidad-fibra600-2lineas-ilimitadas-final',
    operatorId: 'yoigo',
    category: 'fibra_movil',
    name: 'Fibra 600Mb + 2 líneas GB ilimitados',
    fiber: '600Mb',
    mobileLines: 2,
    mobileData: 'GB ilimitados',
    priceKind: 'final',
    monthlyPrice: 31,
    tags: ['Portabilidad', 'Fibra 600', '2 líneas', 'GB ilimitados'],
    highlights: ['Fibra 600Mb', '2 líneas con GB ilimitados', 'Precio final'],
    source: 'Yoigo 02.06.26 - página 1',
  },
  {
    id: 'yoigo-portabilidad-fibra600-1linea-ilimitada-ott-final',
    operatorId: 'yoigo',
    category: 'fibra_movil_tv',
    name: 'Fibra 600Mb + 1 línea GB ilimitados + OTT',
    fiber: '600Mb',
    mobileLines: 1,
    mobileData: 'GB ilimitados',
    tvIncluded: true,
    priceKind: 'final',
    monthlyPrice: 31,
    tags: ['Portabilidad', 'Fibra 600', '1 línea', 'OTT'],
    highlights: ['Fibra 600Mb', '1 línea GB ilimitados', 'OTT incluido'],
    source: 'Yoigo 02.06.26 - página 1',
  },
  {
    id: 'yoigo-fibra-fijo-movil-fibra600-2lineas-4plataformas',
    operatorId: 'yoigo',
    category: 'fibra_fijo_movil',
    name: 'Fibra 600Mb + fijo + móvil + 2 líneas + plataformas',
    fiber: '600Mb',
    mobileLines: 2,
    mobileData: 'GB ilimitados',
    fixedLineIncluded: true,
    tvIncluded: true,
    streamingIncluded: ['Netflix', 'Disney+', 'HBO Max', 'Yoigo TV'],
    priceKind: 'promo_then_regular',
    promoPrice: 57,
    promoMonths: 6,
    regularPrice: 87,
    tags: ['Fibra + fijo + móvil', '2 líneas', 'Netflix', 'Disney+', 'HBO Max', 'Yoigo TV'],
    highlights: ['Incluye fijo', '2 líneas móviles', 'Netflix + Disney+ + HBO Max + Yoigo TV'],
    source: 'Yoigo 02.06.26 - página 1',
  },

  // Yoigo empresa / Digital Pro
  {
    id: 'yoigo-digital-pro-fibra600-2moviles-otros-operadores',
    operatorId: 'yoigo',
    category: 'fibra_movil_empresa',
    name: 'Digital Pro - Fibra 600Mb + 2 móviles GB ilimitados',
    fiber: '600Mb',
    mobileLines: 2,
    mobileData: 'GB ilimitados',
    priceKind: 'final',
    monthlyPrice: 49.61,
    portabilityFrom: 'Otros operadores',
    tags: ['Digital Pro', 'Fibra 600', '2 móviles', 'Empresa'],
    highlights: ['Servicios incluidos', '2 móviles GB ilimitados', 'Precio para otros operadores'],
    notes: ['En imagen también aparece precio Movistar/Vodafone 54.45€.'],
    source: 'Yoigo 02.06.26 - página 2',
  },
  {
    id: 'yoigo-digital-pro-fibra600-2moviles-movistar-vodafone',
    operatorId: 'yoigo',
    category: 'fibra_movil_empresa',
    name: 'Digital Pro - Fibra 600Mb + 2 móviles GB ilimitados',
    fiber: '600Mb',
    mobileLines: 2,
    mobileData: 'GB ilimitados',
    priceKind: 'final',
    monthlyPrice: 54.45,
    portabilityFrom: 'Movistar o Vodafone',
    tags: ['Digital Pro', 'Fibra 600', '2 móviles', 'Empresa'],
    highlights: ['Servicios incluidos', '2 móviles GB ilimitados', 'Precio para Movistar/Vodafone'],
    source: 'Yoigo 02.06.26 - página 2',
  },
  {
    id: 'yoigo-digital-pro-fibra1gb-prime-otros-operadores',
    operatorId: 'yoigo',
    category: 'fibra_movil_empresa',
    name: 'Digital Pro - Fibra 1Gb + 2 móviles + Prime',
    fiber: '1Gb',
    mobileLines: 2,
    mobileData: 'GB ilimitados',
    streamingIncluded: ['Prime'],
    priceKind: 'promo_then_regular',
    promoPrice: 49.61,
    promoMonths: 3,
    regularPrice: 64.13,
    portabilityFrom: 'Otros operadores',
    tags: ['Digital Pro', 'Fibra 1Gb', 'Prime gratis', 'Empresa'],
    highlights: ['Fibra 1Gb', 'Prime gratis', '2 móviles GB ilimitados'],
    source: 'Yoigo 02.06.26 - página 2',
  },
  {
    id: 'yoigo-digital-pro-fibra1gb-prime-movistar-vodafone',
    operatorId: 'yoigo',
    category: 'fibra_movil_empresa',
    name: 'Digital Pro - Fibra 1Gb + 2 móviles + Prime',
    fiber: '1Gb',
    mobileLines: 2,
    mobileData: 'GB ilimitados',
    streamingIncluded: ['Prime'],
    priceKind: 'promo_then_regular',
    promoPrice: 54.45,
    promoMonths: 3,
    regularPrice: 68.97,
    portabilityFrom: 'Movistar o Vodafone',
    tags: ['Digital Pro', 'Fibra 1Gb', 'Prime gratis', 'Empresa'],
    highlights: ['Fibra 1Gb', 'Prime gratis', '2 móviles GB ilimitados'],
    source: 'Yoigo 02.06.26 - página 2',
  },
  {
    id: 'yoigo-digital-pro-total-fibra1gb-prime-otros-operadores',
    operatorId: 'yoigo',
    category: 'fibra_movil_empresa',
    name: 'Digital Pro Total - Fibra 1Gb + 2 móviles + Prime',
    fiber: '1Gb',
    mobileLines: 2,
    mobileData: 'GB ilimitados',
    streamingIncluded: ['Prime'],
    priceKind: 'promo_then_regular',
    promoPrice: 56.87,
    promoMonths: 3,
    regularPrice: 71.39,
    portabilityFrom: 'Otros operadores',
    tags: ['Digital Pro Total', 'Fibra 1Gb', 'Prime gratis', 'Empresa'],
    highlights: ['Fibra 1Gb', '2 móviles GB ilimitados', 'Servicios empresariales incluidos'],
    source: 'Yoigo 02.06.26 - página 2',
  },
  {
    id: 'yoigo-digital-pro-total-fibra1gb-prime-movistar-vodafone',
    operatorId: 'yoigo',
    category: 'fibra_movil_empresa',
    name: 'Digital Pro Total - Fibra 1Gb + 2 móviles + Prime',
    fiber: '1Gb',
    mobileLines: 2,
    mobileData: 'GB ilimitados',
    streamingIncluded: ['Prime'],
    priceKind: 'promo_then_regular',
    promoPrice: 61.71,
    promoMonths: 3,
    regularPrice: 76.23,
    portabilityFrom: 'Movistar o Vodafone',
    tags: ['Digital Pro Total', 'Fibra 1Gb', 'Prime gratis', 'Empresa'],
    highlights: ['Fibra 1Gb', '2 móviles GB ilimitados', 'Servicios empresariales incluidos'],
    source: 'Yoigo 02.06.26 - página 2',
  },

  // ===================== ORANGE =====================

  {
    id: 'orange-n-extra-3-real', operatorId: 'orange', category: 'fibra_movil', name: 'N Extra 3 - Tarifa real', fiber: '1Gb', mobileData: '5G+ llamadas y GB ilimitados', priceKind: 'final', monthlyPrice: 99.22, tags: ['N Extra 3', 'Tarifa real'], highlights: ['Fibra 1Gb WiFi 6', 'Móviles 5G+ ilimitados', 'Escalable'], source: 'Orange - tabla N Extra'
  },
  {
    id: 'orange-n-extra-3-equipo-menos-movistar-20-24m', operatorId: 'orange', category: 'fibra_movil', name: 'N Extra 3 - 20% x 24 meses con equipo VALIDO PARA CLIENTES MOVISTAR', fiber: '1Gb', mobileData: '5G+ llamadas y GB ilimitados', priceKind: 'segmented_discount', monthlyPrice: 77.20, promoMonths: 24, segment: 'Clientes Movistar con equipo', tags: ['N Extra 3', '20% x 24 meses', 'Movistar con equipo'], highlights: ['Fibra 1Gb WiFi 6', 'GB ilimitados 5G+', 'Descuento 24 meses con equipo'], source: 'Orange - tabla N Extra'
  },
  {
    id: 'orange-n-extra-3-sin-equipo-10-24m', operatorId: 'orange', category: 'fibra_movil', name: 'N Extra 3 - 10% x 24 meses sin equipo', fiber: '1Gb', mobileData: '5G+ llamadas y GB ilimitados', priceKind: 'segmented_discount', monthlyPrice: 88.21, promoMonths: 24, segment: 'Sin equipo', tags: ['N Extra 3', '10% x 24 meses', 'Sin equipo'], highlights: ['Fibra 1Gb WiFi 6', 'GB ilimitados 5G+', 'Sin equipo'], source: 'Orange - tabla N Extra'
  },
  {
    id: 'orange-n-extra-5-real', operatorId: 'orange', category: 'fibra_movil', name: 'N Extra 5 - Tarifa real', fiber: '1Gb', mobileData: '5G+ llamadas y GB ilimitados', priceKind: 'final', monthlyPrice: 129.47, tags: ['N Extra 5', 'Tarifa real'], highlights: ['Fibra 1Gb WiFi 6', 'Móviles 5G+ ilimitados', 'Escalable'], source: 'Orange - tabla N Extra'
  },
  {
    id: 'orange-n-extra-5-equipo-menos-movistar-20-24m', operatorId: 'orange', category: 'fibra_movil', name: 'N Extra 5 - 20% x 24 meses con equipo VALIDO PARA CLIENTES MOVISTAR', fiber: '1Gb', mobileData: '5G+ llamadas y GB ilimitados', priceKind: 'segmented_discount', monthlyPrice: 99.95, promoMonths: 24, segment: 'Clientes Movistar con equipo', tags: ['N Extra 5', '20% x 24 meses', 'Movistar con equipo'], highlights: ['Fibra 1Gb WiFi 6', 'GB ilimitados 5G+', 'Descuento 24 meses con equipo'], source: 'Orange - tabla N Extra'
  },
  {
    id: 'orange-n-extra-10-real', operatorId: 'orange', category: 'fibra_movil', name: 'N Extra 10 - Tarifa real', fiber: '1Gb', mobileData: '5G+ llamadas y GB ilimitados', priceKind: 'final', monthlyPrice: 251.68, tags: ['N Extra 10', 'Tarifa real'], highlights: ['Fibra 1Gb WiFi 6', 'Móviles 5G+ ilimitados', 'Hasta 9 líneas según tarifa'], source: 'Orange - tabla N Extra'
  },
  {
    id: 'orange-n-extra-10-equipo-menos-movistar-15-24m', operatorId: 'orange', category: 'fibra_movil', name: 'N Extra 10 - 15% x 24 meses con equipo menos Movistar', fiber: '1Gb', mobileData: '5G+ llamadas y GB ilimitados', priceKind: 'segmented_discount', monthlyPrice: 208.48, promoMonths: 24, segment: 'Con equipo menos Movistar', tags: ['N Extra 10', '15% x 24 meses', 'Con equipo'], highlights: ['Fibra 1Gb WiFi 6', 'GB ilimitados 5G+', 'Descuento 24 meses'], source: 'Orange - tabla N Extra'
  },
  {
    id: 'orange-n-extra-10-movistar-equipo-10-24m', operatorId: 'orange', category: 'fibra_movil', name: 'N Extra 10 - 10% x 24 meses clientes Movistar con equipo', fiber: '1Gb', mobileData: '5G+ llamadas y GB ilimitados', priceKind: 'segmented_discount', monthlyPrice: 222.88, promoMonths: 24, segment: 'Clientes Movistar con equipo', tags: ['N Extra 10', '10% x 24 meses', 'Movistar con equipo'], highlights: ['Fibra 1Gb WiFi 6', 'GB ilimitados 5G+', 'Descuento 24 meses'], source: 'Orange - tabla N Extra'
  },
  {
    id: 'orange-n-extra-20-real', operatorId: 'orange', category: 'fibra_movil', name: 'N Extra 20 - Tarifa real', fiber: '1Gb', mobileData: '5G+ llamadas y GB ilimitados', priceKind: 'final', monthlyPrice: 384.78, tags: ['N Extra 20', 'Tarifa real'], highlights: ['Fibra 1Gb WiFi 6', 'Móviles 5G+ ilimitados', 'Hasta 20 líneas según tarifa'], source: 'Orange - tabla N Extra'
  },
  {
    id: 'orange-n-extra-20-equipo-menos-movistar-15-24m', operatorId: 'orange', category: 'fibra_movil', name: 'N Extra 20 - 15% x 24 meses con equipo menos Movistar', fiber: '1Gb', mobileData: '5G+ llamadas y GB ilimitados', priceKind: 'segmented_discount', monthlyPrice: 316.17, promoMonths: 24, segment: 'Con equipo menos Movistar', tags: ['N Extra 20', '15% x 24 meses', 'Con equipo'], highlights: ['Fibra 1Gb WiFi 6', 'GB ilimitados 5G+', 'Descuento 24 meses'], source: 'Orange - tabla N Extra'
  },
  {
    id: 'orange-n-extra-20-movistar-equipo-10-24m', operatorId: 'orange', category: 'fibra_movil', name: 'N Extra 20 - 10% x 24 meses clientes Movistar con equipo', fiber: '1Gb', mobileData: '5G+ llamadas y GB ilimitados', priceKind: 'segmented_discount', monthlyPrice: 339.04, promoMonths: 24, segment: 'Clientes Movistar con equipo', tags: ['N Extra 20', '10% x 24 meses', 'Movistar con equipo'], highlights: ['Fibra 1Gb WiFi 6', 'GB ilimitados 5G+', 'Descuento 24 meses'], source: 'Orange - tabla N Extra'
  },
  
  // ===================== LOWI =====================
  {
    id: 'lowi-fibra600-50gb',
    operatorId: 'lowi',
    category: 'fibra_movil',
    name: 'Fibra 600Mb + Móvil 50GB',
    fiber: '600Mb',
    mobileLines: 1,
    mobileData: '50GB 5G, llamadas ilimitadas',
    priceKind: 'final',
    monthlyPrice: 30,
    tags: ['Fibra 600', '1 línea', '50GB'],
    highlights: ['Fibra 600Mb Simétrica', 'Móvil 50GB 5G', 'Gigas acumulables'],
    source: 'Lowi España 2026'
  },
  {
    id: 'lowi-fibra600-100gb',
    operatorId: 'lowi',
    category: 'fibra_movil',
    name: 'Fibra 600Mb + Móvil 100GB',
    fiber: '600Mb',
    mobileLines: 1,
    mobileData: '100GB 5G, llamadas ilimitadas',
    priceKind: 'final',
    monthlyPrice: 33,
    tags: ['Fibra 600', '1 línea', '100GB'],
    highlights: ['Fibra 600Mb Simétrica', 'Móvil 100GB 5G', 'Gigas acumulables'],
    source: 'Lowi España 2026'
  },
  {
    id: 'lowi-fibra1gb-50gb',
    operatorId: 'lowi',
    category: 'fibra_movil',
    name: 'Fibra 1Gb + Móvil 50GB',
    mobileLines: 1,
    mobileData: '300GB 5G, llamadas ilimitadas',
    priceKind: 'final',
    monthlyPrice: 40,
    tags: ['Fibra 1Gb', '1 línea', '300GB'],
    highlights: ['Fibra 1Gb Simétrica', 'Móvil 300GB 5G', 'WiFi 6 incluido'],
    source: 'Lowi España 2026'
  },

  // ===================== WIN (PERÚ) =====================
  // --- Regular LIMA GPON Solo Internet ---
  {
    id: 'win-gpon-500',
    operatorId: 'win',
    category: 'fibra_movil', // Mapeado a fibra_movil para compatibilidad con UI principal
    name: 'WIN Fibra 500 Mbps (Solo Internet)',
    fiber: '500Mb',
    priceKind: 'final',
    monthlyPrice: 99.00,
    tags: ['Fibra 500', 'GPON', 'Solo Internet'],
    highlights: ['100% Fibra Óptica simétrica', 'Tecnología WiFi 6', '1 equipo MESH/WINBOX a solicitud'],
    source: 'WIN Comercial Mayo-Junio - pág 5'
  },
  {
    id: 'win-gpon-750',
    operatorId: 'win',
    category: 'fibra_movil',
    name: 'WIN Fibra 750 Mbps (Solo Internet)',
    fiber: '750Mb',
    priceKind: 'final',
    monthlyPrice: 109.90,
    tags: ['Fibra 750', 'GPON', 'Solo Internet'],
    highlights: ['100% Fibra Óptica simétrica', 'Tecnología WiFi 6', '1 equipo MESH/WINBOX a solicitud'],
    source: 'WIN Comercial Mayo-Junio - pág 5'
  },
  {
    id: 'win-gpon-850',
    operatorId: 'win',
    category: 'fibra_movil',
    name: 'WIN Fibra 850 Mbps (Solo Internet)',
    fiber: '850Mb',
    priceKind: 'final',
    monthlyPrice: 119.90,
    tags: ['Fibra 850', 'GPON', 'Solo Internet'],
    highlights: ['100% Fibra Óptica simétrica', 'Tecnología WiFi 6', '1 equipo MESH/WINBOX a solicitud'],
    source: 'WIN Comercial Mayo-Junio - pág 5'
  },
  {
    id: 'win-gpon-1000',
    operatorId: 'win',
    category: 'fibra_movil',
    name: 'WIN Fibra 1000 Mbps (Solo Internet)',
    fiber: '1Gb',
    priceKind: 'final',
    monthlyPrice: 139.90,
    tags: ['Fibra 1000', 'GPON', 'Solo Internet'],
    highlights: ['100% Fibra Óptica simétrica', 'Tecnología WiFi 6', '2 equipos MESH/WINBOX a solicitud'],
    source: 'WIN Comercial Mayo-Junio - pág 5'
  },

  // --- Regular LIMA GPON + winTV Premium (Dúos) ---
  {
    id: 'win-gpon-500-tv',
    operatorId: 'win',
    category: 'fibra_movil_tv',
    name: 'WIN Fibra 500 Mbps + winTV Premium',
    fiber: '500Mb',
    tvIncluded: true,
    priceKind: 'final',
    monthlyPrice: 99.90,
    tags: ['Fibra 500', 'GPON', 'Dúo TV', 'winTV Premium'],
    highlights: ['winTV Premium incluido (+80 canales)', '100% Fibra Óptica simétrica', 'Precio especial por Dupla Winner'],
    source: 'WIN Comercial Mayo-Junio - pág 5'
  },
  {
    id: 'win-gpon-750-tv',
    operatorId: 'win',
    category: 'fibra_movil_tv',
    name: 'WIN Fibra 750 Mbps + winTV Premium',
    fiber: '750Mb',
    tvIncluded: true,
    priceKind: 'final',
    monthlyPrice: 119.90,
    tags: ['Fibra 750', 'GPON', 'Dúo TV', 'winTV Premium'],
    highlights: ['winTV Premium incluido (+80 canales)', '100% Fibra Óptica simétrica', '1 equipo MESH/WINBOX a solicitud'],
    source: 'WIN Comercial Mayo-Junio - pág 5'
  },
  {
    id: 'win-gpon-850-tv',
    operatorId: 'win',
    category: 'fibra_movil_tv',
    name: 'WIN Fibra 850 Mbps + winTV Premium',
    fiber: '850Mb',
    tvIncluded: true,
    priceKind: 'final',
    monthlyPrice: 129.90,
    tags: ['Fibra 850', 'GPON', 'Dúo TV', 'winTV Premium'],
    highlights: ['winTV Premium incluido (+80 canales)', '100% Fibra Óptica simétrica', '1 equipo MESH/WINBOX a solicitud'],
    source: 'WIN Comercial Mayo-Junio - pág 5'
  },
  {
    id: 'win-gpon-1000-tv',
    operatorId: 'win',
    category: 'fibra_movil_tv',
    name: 'WIN Fibra 1000 Mbps + winTV Premium',
    fiber: '1Gb',
    tvIncluded: true,
    priceKind: 'final',
    monthlyPrice: 149.90,
    tags: ['Fibra 1000', 'GPON', 'Dúo TV', 'winTV Premium'],
    highlights: ['winTV Premium incluido (+80 canales)', '100% Fibra Óptica simétrica', '2 equipos MESH/WINBOX a solicitud'],
    source: 'WIN Comercial Mayo-Junio - pág 5'
  },

  // --- Regular LIMA GPON + DGO Hogar / DGO Full ---
  {
    id: 'win-gpon-850-dgo-hogar',
    operatorId: 'win',
    category: 'fibra_movil_streaming',
    name: 'WIN Fibra 850 Mbps + DGO Hogar',
    fiber: '850Mb',
    tvIncluded: true,
    streamingIncluded: ['DGO Hogar'],
    priceKind: 'final',
    monthlyPrice: 139.90,
    tags: ['Fibra 850', 'GPON', 'Dúo Streaming', 'DGO Hogar'],
    highlights: ['DGO Hogar incluido (30+ canales en vivo)', '2 dispositivos en simultáneo', '1 equipo MESH/WINBOX a solicitud'],
    source: 'WIN Comercial Mayo-Junio - pág 5'
  },
  {
    id: 'win-gpon-1000-dgo-hogar',
    operatorId: 'win',
    category: 'fibra_movil_streaming',
    name: 'WIN Fibra 1000 Mbps + DGO Hogar',
    fiber: '1Gb',
    tvIncluded: true,
    streamingIncluded: ['DGO Hogar'],
    priceKind: 'final',
    monthlyPrice: 159.90,
    tags: ['Fibra 1000', 'GPON', 'Dúo Streaming', 'DGO Hogar'],
    highlights: ['DGO Hogar incluido (30+ canales en vivo)', '2 dispositivos en simultáneo', '2 equipos MESH/WINBOX a solicitud'],
    source: 'WIN Comercial Mayo-Junio - pág 5'
  },
  {
    id: 'win-gpon-1000-dgo-full',
    operatorId: 'win',
    category: 'fibra_movil_streaming',
    name: 'WIN Fibra 1000 Mbps + DGO Full',
    fiber: '1Gb',
    tvIncluded: true,
    streamingIncluded: ['DGO Full'],
    priceKind: 'final',
    monthlyPrice: 179.90,
    tags: ['Fibra 1000', 'GPON', 'Dúo Streaming', 'DGO Full'],
    highlights: ['DGO Full incluido (100+ canales en vivo)', '4 dispositivos en simultáneo', '2 equipos MESH/WINBOX a solicitud'],
    source: 'WIN Comercial Mayo-Junio - pág 5'
  },

  // --- Regular LIMA XGSPON ---
  {
    id: 'win-xgspon-1500',
    operatorId: 'win',
    category: 'fibra_movil',
    name: 'WIN XGSPON 1500 Mbps',
    fiber: '1.5Gb',
    priceKind: 'final',
    monthlyPrice: 189.00,
    tags: ['XGSPON', '1500 Mbps', 'Ultra Velocidad'],
    highlights: ['Tecnología XGSPON 10G', 'Simétrico', 'Router WiFi 6 premium + MESH gratis'],
    source: 'WIN Tarifas de Mercado / pág 4 catálogo'
  },
  {
    id: 'win-xgspon-2000',
    operatorId: 'win',
    category: 'fibra_movil',
    name: 'WIN XGSPON 2000 Mbps',
    fiber: '2Gb',
    priceKind: 'final',
    monthlyPrice: 219.00,
    tags: ['XGSPON', '2000 Mbps', 'Ultra Velocidad'],
    highlights: ['Tecnología XGSPON 10G', 'Simétrico', 'Router WiFi 6 premium + MESH gratis'],
    source: 'WIN Tarifas de Mercado / pág 4 catálogo'
  },
  {
    id: 'win-xgspon-2500',
    operatorId: 'win',
    category: 'fibra_movil',
    name: 'WIN XGSPON 2500 Mbps',
    fiber: '2.5Gb',
    priceKind: 'final',
    monthlyPrice: 239.00,
    tags: ['XGSPON', '2500 Mbps', 'Ultra Velocidad'],
    highlights: ['Tecnología XGSPON 10G', 'Simétrico', 'Router WiFi 6 premium + MESH gratis'],
    source: 'WIN Tarifas de Mercado / pág 4 catálogo'
  },

  // --- Gamer Plans ---
  {
    id: 'win-gamer-600',
    operatorId: 'win',
    category: 'fibra_movil',
    name: 'WIN Gamer 600 Mbps',
    fiber: '600Mb',
    priceKind: 'final',
    monthlyPrice: 129.00,
    tags: ['Gamer', '600 Mbps', 'ExitLag'],
    highlights: [
      'Enrutamiento optimizado ExitLag (Ping ultra bajo)', 
      '120 horas de Nitro al mes (Hasta 1000 Mbps)', 
      'Cambio de IP hasta 3 veces al mes', 
      'NAT 1 y NAT 2'
    ],
    source: 'WIN Gamer Oficial 2026'
  },
  {
    id: 'win-gamer-1000',
    operatorId: 'win',
    category: 'fibra_movil',
    name: 'WIN Gamer 1000 Mbps',
    fiber: '1Gb',
    priceKind: 'final',
    monthlyPrice: 159.00,
    tags: ['Gamer', '1000 Mbps', 'ExitLag'],
    highlights: [
      'Enrutamiento optimizado ExitLag (Ping ultra bajo)', 
      'Nitro ILIMITADO para acelerar tu conexión', 
      'Cambio de IP hasta 3 veces al mes', 
      'NAT 1 y NAT 2'
    ],
    source: 'WIN Gamer Oficial 2026'
  },

  // --- Vertical LIMA (Promo Edificios S/ 1 x 2 meses) ---
  {
    id: 'win-vertical-850',
    operatorId: 'win',
    category: 'fibra_movil',
    name: 'WIN Edificios 850 Mbps',
    fiber: '850Mb',
    priceKind: 'promo_then_regular',
    promoPrice: 1.00,
    promoMonths: 2,
    regularPrice: 119.90,
    segment: 'Vertical Lima',
    tags: ['Promo S/1', 'Vertical', 'Edificios', '850 Mbps'],
    highlights: ['Solo S/ 1.00 los 2 primeros meses', 'Luego S/ 119.90/mes', '1 equipo MESH/WINBOX a solicitud'],
    source: 'WIN Promociones Verticales 2026'
  },
  {
    id: 'win-vertical-1000',
    operatorId: 'win',
    category: 'fibra_movil',
    name: 'WIN Edificios 1000 Mbps',
    fiber: '1Gb',
    priceKind: 'promo_then_regular',
    promoPrice: 1.00,
    promoMonths: 2,
    regularPrice: 139.90,
    segment: 'Vertical Lima',
    tags: ['Promo S/1', 'Vertical', 'Edificios', '1000 Mbps'],
    highlights: ['Solo S/ 1.00 los 2 primeros meses', 'Luego S/ 139.90/mes', '2 equipos MESH/WINBOX a solicitud'],
    source: 'WIN Promociones Verticales 2026'
  },
  {
    id: 'win-vertical-1500',
    operatorId: 'win',
    category: 'fibra_movil',
    name: 'WIN Edificios 1500 Mbps (XGSPON)',
    fiber: '1.5Gb',
    priceKind: 'promo_then_regular',
    promoPrice: 1.00,
    promoMonths: 2,
    regularPrice: 189.00,
    segment: 'Vertical Lima',
    tags: ['Promo S/1', 'Vertical', 'Edificios', 'XGSPON'],
    highlights: ['Solo S/ 1.00 los 2 primeros meses', 'Luego S/ 189.00/mes', 'Ultra velocidad XGSPON 10G'],
    source: 'WIN Promociones Verticales 2026'
  },
  {
    id: 'win-vertical-2000',
    operatorId: 'win',
    category: 'fibra_movil',
    name: 'WIN Edificios 2000 Mbps (XGSPON)',
    fiber: '2Gb',
    priceKind: 'promo_then_regular',
    promoPrice: 1.00,
    promoMonths: 2,
    regularPrice: 219.00,
    segment: 'Vertical Lima',
    tags: ['Promo S/1', 'Vertical', 'Edificios', 'XGSPON'],
    highlights: ['Solo S/ 1.00 los 2 primeros meses', 'Luego S/ 219.00/mes', 'Ultra velocidad XGSPON 10G'],
    source: 'WIN Promociones Verticales 2026'
  },
  {
    id: 'win-vertical-2500',
    operatorId: 'win',
    category: 'fibra_movil',
    name: 'WIN Edificios 2500 Mbps (XGSPON)',
    fiber: '2.5Gb',
    priceKind: 'promo_then_regular',
    promoPrice: 1.00,
    promoMonths: 2,
    regularPrice: 239.00,
    segment: 'Vertical Lima',
    tags: ['Promo S/1', 'Vertical', 'Edificios', 'XGSPON'],
    highlights: ['Solo S/ 1.00 los 2 primeros meses', 'Luego S/ 239.00/mes', 'Ultra velocidad XGSPON 10G'],
    source: 'WIN Promociones Verticales 2026'
  },

  // --- Pago Adelantado GPON ---
  {
    id: 'win-adelantado-850',
    operatorId: 'win',
    category: 'fibra_movil',
    name: 'WIN Fibra 850 Mbps (Pago Adelantado)',
    fiber: '850Mb',
    priceKind: 'promo_then_regular',
    promoPrice: 79.00,
    promoMonths: 3,
    regularPrice: 119.00,
    segment: 'Pago Adelantado',
    tags: ['Pago Adelantado', 'GPON', 'Promo 3 meses'],
    highlights: ['S/ 79.00 por los 3 primeros meses', 'Luego S/ 119.00/mes', 'Ahorro inmediato por adelanto'],
    source: 'WIN Comercial Ofertas Especiales'
  },

  // --- RUC 20 Corporate GPON ---
  {
    id: 'win-corp-500',
    operatorId: 'win',
    category: 'fibra_movil_empresa',
    name: 'WIN Negocios 500 Mbps (RUC 20)',
    fiber: '500Mb',
    priceKind: 'final',
    monthlyPrice: 99.00,
    segment: 'RUC 20 Business',
    tags: ['Empresa', 'RUC 20', 'Business'],
    highlights: ['Incluye 2 equipos MESH gratis', 'Ideal para RUC 20', 'Factura corporativa'],
    notes: ['Costo de instalación: S/ 120 (en 3 cuotas de S/ 40) o S/ 60 en una cuota única.'],
    source: 'WIN Negocios Oferta Comercial'
  },
  {
    id: 'win-corp-750',
    operatorId: 'win',
    category: 'fibra_movil_empresa',
    name: 'WIN Negocios 750 Mbps (RUC 20)',
    fiber: '750Mb',
    priceKind: 'final',
    monthlyPrice: 109.00,
    segment: 'RUC 20 Business',
    tags: ['Empresa', 'RUC 20', 'Business'],
    highlights: ['Incluye 2 equipos MESH gratis', 'Ideal para RUC 20', 'Factura corporativa'],
    notes: ['Costo de instalación: S/ 120 (en 3 cuotas de S/ 40) o S/ 60 en una cuota única.'],
    source: 'WIN Negocios Oferta Comercial'
  },
  {
    id: 'win-corp-850',
    operatorId: 'win',
    category: 'fibra_movil_empresa',
    name: 'WIN Negocios 850 Mbps (RUC 20)',
    fiber: '850Mb',
    priceKind: 'final',
    monthlyPrice: 119.00,
    segment: 'RUC 20 Business',
    tags: ['Empresa', 'RUC 20', 'Business'],
    highlights: ['Incluye 2 equipos MESH gratis', 'Ideal para RUC 20', 'Factura corporativa'],
    notes: ['Costo de instalación: S/ 120 (en 3 cuotas de S/ 40) o S/ 60 en una cuota única.'],
    source: 'WIN Negocios Oferta Comercial'
  },
  {
    id: 'win-corp-1000',
    operatorId: 'win',
    category: 'fibra_movil_empresa',
    name: 'WIN Negocios 1000 Mbps (RUC 20)',
    fiber: '1Gb',
    priceKind: 'final',
    monthlyPrice: 139.00,
    segment: 'RUC 20 Business',
    tags: ['Empresa', 'RUC 20', 'Business'],
    highlights: ['Incluye 2 equipos MESH gratis', 'Ideal para RUC 20', 'Factura corporativa'],
    notes: ['Costo de instalación: S/ 120 (en 3 cuotas de S/ 40) o S/ 60 en una cuota única.'],
    source: 'WIN Negocios Oferta Comercial'
  }
];

export const addons: Addon[] = [
  // Globales de UI / genéricos para no romper app actual
  { id: 'global-mobile-line', operatorId: 'vodafone', name: 'Línea móvil adicional', category: 'mobile_line', monthlyPrice: 9, description: 'Línea móvil adicional para Vodafone.', tags: ['Vodafone', 'Móvil'], source: 'Valor referencial inicial / ajustar por operador' },
  { id: 'global-mesh-wifi', name: 'Mesh WiFi', category: 'business', monthlyPrice: 5, description: 'Repetidor Mesh / mejora de cobertura.', tags: ['Global', 'WiFi'], source: 'Valor referencial inicial / ajustar por operador' },
  { id: 'global-tv-basica', operatorId: 'vodafone', name: 'TV básica / Pack extra', category: 'tv', monthlyPrice: 10, description: 'Pack TV básico referencial.', tags: ['Global', 'TV'], source: 'Valor referencial inicial / ajustar por operador' },

  // Vodafone: no aparecen añadidos sueltos detallados en el PDF, se modelan por packs de plataformas.

  // Yoigo extras página 1 y 2
  { id: 'yoigo-upgrade-fibra-1gb', operatorId: 'yoigo', name: 'Upgrade Fibra 1Gb', category: 'fiber_upgrade', promoPrice: 0, promoMonths: 3, regularPrice: 15, description: '1Gb gratis 3 primeros meses, luego 15€/mes.', tags: ['Yoigo', 'Fibra 1Gb'], source: 'Yoigo 02.06.26 - página 1' },
  { id: 'yoigo-duo-adicional', operatorId: 'yoigo', name: 'Duo adicional', category: 'mobile_line', monthlyPrice: 9, description: 'Línea duo adicional.', tags: ['Yoigo', 'Línea adicional'], source: 'Yoigo 02.06.26 - página 1/2' },
  { id: 'yoigo-disney', operatorId: 'yoigo', name: 'Disney+', category: 'streaming', monthlyPrice: 6, description: 'Añadir Disney+.', tags: ['Yoigo', 'Streaming'], source: 'Yoigo 02.06.26 - página 1' },
  { id: 'yoigo-hbo', operatorId: 'yoigo', name: 'Max (HBO Max)', category: 'streaming', monthlyPrice: 6, description: 'Añadir Max (HBO Max).', tags: ['Yoigo', 'Streaming'], source: 'Yoigo 02.06.26 - página 1' },
  { id: 'yoigo-netflix', operatorId: 'yoigo', name: 'Netflix', category: 'streaming', monthlyPrice: 8, description: 'Añadir Netflix.', tags: ['Yoigo', 'Streaming'], source: 'Yoigo 02.06.26 - página 1' },
  { id: 'yoigo-tv', operatorId: 'yoigo', name: 'Yoigo TV', category: 'tv', monthlyPrice: 6, description: 'Yoigo TV.', tags: ['Yoigo', 'TV'], source: 'Yoigo 02.06.26 - página 2' },
  { id: 'yoigo-tv-depor', operatorId: 'yoigo', name: 'Yoigo TV Depor', category: 'tv', monthlyPrice: 12, description: 'Yoigo TV deportes.', tags: ['Yoigo', 'TV', 'Deportes'], source: 'Yoigo 02.06.26 - página 2' },
  { id: 'yoigo-prime-disney-hbo-bundle', operatorId: 'yoigo', name: 'Prime + Disney+ + HBO Max', category: 'streaming', promoPrice: 0, promoMonths: 3, regularPrice: 15.37, description: 'Pack plataformas gratis 3 meses, desde 4to mes 15.37€/mes.', tags: ['Yoigo', 'Prime', 'Disney+', 'HBO Max'], source: 'Yoigo 02.06.26 - página 2' },

  // Orange extras / SVA
  { id: 'orange-linea-adicional-1573', operatorId: 'orange', name: 'Línea adicional (N Extra 3, 5 y 10)', category: 'mobile_line', monthlyPrice: 15.73, description: 'Línea adicional para planes N Extra 3, N Extra 5 y N Extra 10.', tags: ['Orange', 'Línea adicional'], source: 'Orange - líneas adicionales' },
  { id: 'orange-linea-adicional-1331', operatorId: 'orange', name: 'Línea adicional (N Extra 20)', category: 'mobile_line', monthlyPrice: 13.31, description: 'Línea adicional para plan N Extra 20.', tags: ['Orange', 'Línea adicional'], source: 'Orange - líneas adicionales' },
  { id: 'orange-capta-24m', operatorId: 'orange', name: 'Capta x 24M', category: 'business', monthlyPrice: 9.95, description: 'Servicio Capta por 24 meses.', tags: ['Orange', 'Empresa'], source: 'Orange - líneas adicionales/SVA' },
  { id: 'orange-cartera-24m', operatorId: 'orange', name: 'Cartera x 24M', category: 'business', monthlyPrice: 9.95, description: 'Servicio Cartera por 24 meses.', tags: ['Orange', 'Empresa'], source: 'Orange - líneas adicionales/SVA' },
  { id: 'orange-multisede-1gb', operatorId: 'orange', name: 'Línea adicional multisede 1Gb', category: 'business', promoPrice: 18.15, regularPrice: 33.28, description: '1Gb por 18.15€, después 33.28€.', tags: ['Orange', 'Multisede', '1Gb'], source: 'Orange - línea adicional multisede' },
  { id: 'orange-multisede-futbol', operatorId: 'orange', name: 'Multisede con fútbol', category: 'football', promoPrice: 53.24, promoMonths: 12, regularPrice: 68.37, description: 'Con fútbol 53.24€ x 12 meses, después 68.37€.', tags: ['Orange', 'Multisede', 'Fútbol'], source: 'Orange - línea adicional multisede' },
  { id: 'orange-esim', operatorId: 'orange', name: 'E-SIM', category: 'sim', monthlyPrice: 9, description: 'E-SIM.', tags: ['Orange', 'SIM'], source: 'Orange - E-SIM' },
  { id: 'orange-prime', operatorId: 'orange', name: 'Prime', category: 'streaming', monthlyPrice: 4.99, description: 'SVA Prime.', tags: ['Orange', 'Prime'], source: 'Orange - SVA' },
  { id: 'orange-disney', operatorId: 'orange', name: 'Disney+', category: 'streaming', monthlyPrice: 5.99, description: 'SVA Disney+.', tags: ['Orange', 'Disney+'], source: 'Orange - SVA' },
  { id: 'orange-max', operatorId: 'orange', name: 'Max', category: 'streaming', monthlyPrice: 6.99, description: 'SVA Max.', tags: ['Orange', 'Max'], source: 'Orange - SVA' },
  { id: 'orange-tv-futbol-actual', operatorId: 'orange', name: 'TV + Fútbol', category: 'football', monthlyPrice: 37.51, description: 'Televisión con todo el fútbol incluido.', tags: ['Orange', 'TV', 'Fútbol'], source: 'Orange - Fútbol' },
  { id: 'orange-tv-futbol-dazn-actual', operatorId: 'orange', name: 'TV + Fútbol + DAZN', category: 'football', monthlyPrice: 42.35, description: 'Televisión con todo el fútbol y DAZN incluidos.', tags: ['Orange', 'TV', 'Fútbol', 'DAZN'], source: 'Orange - Fútbol' },

  // Lowi España extras / SVA
  { id: 'lowi-linea-adicional-5gb', operatorId: 'lowi', name: 'Línea adicional 5GB', category: 'mobile_line', monthlyPrice: 4, description: 'Línea móvil adicional con 5GB y llamadas ilimitadas.', tags: ['Lowi', 'Línea adicional', '5GB'], source: 'Lowi España 2026' },
  { id: 'lowi-linea-adicional-50gb', operatorId: 'lowi', name: 'Línea adicional 50GB', category: 'mobile_line', monthlyPrice: 5, description: 'Línea móvil adicional con 50GB y llamadas ilimitadas.', tags: ['Lowi', 'Línea adicional', '50GB'], source: 'Lowi España 2026' },
  { id: 'lowi-linea-adicional-100gb', operatorId: 'lowi', name: 'Línea adicional 100GB', category: 'mobile_line', monthlyPrice: 8, description: 'Línea móvil adicional con 100GB y llamadas ilimitadas.', tags: ['Lowi', 'Línea adicional', '100GB'], source: 'Lowi España 2026' },
  { id: 'lowi-linea-adicional-150gb', operatorId: 'lowi', name: 'Línea adicional 150GB', category: 'mobile_line', monthlyPrice: 10, description: 'Línea móvil adicional con 150GB y llamadas ilimitadas.', tags: ['Lowi', 'Línea adicional', '150GB'], source: 'Lowi España 2026' },
  { id: 'lowi-linea-adicional-300gb', operatorId: 'lowi', name: 'Línea adicional 300GB', category: 'mobile_line', monthlyPrice: 12, description: 'Línea móvil adicional con 300GB y llamadas ilimitadas.', tags: ['Lowi', 'Línea adicional', '300GB'], source: 'Lowi España 2026' },
  { id: 'lowi-tv-basica', operatorId: 'lowi', name: 'Lowi TV Básica', category: 'tv', monthlyPrice: 5, description: 'Más de 100 canales de cine, series, documentales y entretenimiento.', tags: ['Lowi', 'TV'], source: 'Lowi España 2026' },
  { id: 'lowi-tv-deportes', operatorId: 'lowi', name: 'Pack Deportes', category: 'tv', monthlyPrice: 3, description: 'Incluye LaLiga Hypermotion, Eurosport 1 y 2.', tags: ['Lowi', 'TV', 'Deportes'], source: 'Lowi España 2026' },
  { id: 'lowi-prime', operatorId: 'lowi', name: 'Amazon Prime', category: 'streaming', monthlyPrice: 4, description: 'Suscripción mensual de Amazon Prime integrada en tu factura.', tags: ['Lowi', 'Prime'], source: 'Lowi España 2026' },
  { id: 'lowi-netflix', operatorId: 'lowi', name: 'Netflix con anuncios', category: 'streaming', monthlyPrice: 5.49, description: 'Suscripción de Netflix Plan Estándar con anuncios integrada.', tags: ['Lowi', 'Netflix'], source: 'Lowi España 2026' },
  { id: 'lowi-disney', operatorId: 'lowi', name: 'Disney+', category: 'streaming', monthlyPrice: 5.99, description: 'Suscripción de Disney+ Plan Estándar integrada.', tags: ['Lowi', 'Disney+'], source: 'Lowi España 2026' },
  { id: 'lowi-max', operatorId: 'lowi', name: 'Max', category: 'streaming', monthlyPrice: 6.99, description: 'Suscripción de Max Plan Estándar integrada.', tags: ['Lowi', 'Max'], source: 'Lowi España 2026' },
  { id: 'lowi-setup', operatorId: 'lowi', name: 'Instalación y Router WiFi 6', category: 'installation', oneTimePrice: 0, description: 'Alta, instalación y cesión de router WiFi 6 premium gratis.', tags: ['Lowi', 'Setup'], source: 'Lowi España 2026' },

  // WIN SVAs (Perú)
  { id: 'win-addon-fonowin', operatorId: 'win', name: 'fonoWIN', category: 'mobile_line', monthlyPrice: 10.00, description: 'Telefonía fija en tu celular. Llamadas ilimitadas a WIN y 1000 min nacionales.', tags: ['WIN', 'Fijo', 'FonoWin'], source: 'WIN Productos 2026 - pág 9' },
  { id: 'win-addon-winbox', operatorId: 'win', name: 'WINBOX Smart TV', category: 'tv', monthlyPrice: 15.00, description: 'Dispositivo WINBOX para convertir tu TV en Smart. 8GB ROM, 1GB RAM, Full HD.', tags: ['WIN', 'WINBOX', 'Hardware'], source: 'WIN Productos 2026 - pág 8' },
  { id: 'win-addon-mesh', operatorId: 'win', name: 'Mesh WiFi 6', category: 'business', monthlyPrice: 9.90, description: 'Punto Mesh adicional para expandir tu red WiFi 6 en casa.', tags: ['WIN', 'Mesh', 'WiFi'], source: 'WIN Productos 2026 - pág 3' },
  { id: 'win-addon-dgo-hogar', operatorId: 'win', name: 'DGO Hogar', category: 'streaming', monthlyPrice: 59.00, description: 'Plataforma Directv Go Hogar. Más de 30 canales en vivo, series y películas.', tags: ['WIN', 'Streaming', 'DGO'], source: 'WIN Productos 2026 - pág 7' },
  { id: 'win-addon-dgo-full', operatorId: 'win', name: 'DGO Full', category: 'streaming', monthlyPrice: 76.00, description: 'Plataforma Directv Go Full. Más de 100 canales en vivo, 4 pantallas simultáneas.', tags: ['WIN', 'Streaming', 'DGO'], source: 'WIN Productos 2026 - pág 7' },
  { id: 'win-addon-tv-l1max', operatorId: 'win', name: 'winTV L1 MAX', category: 'tv', monthlyPrice: 29.50, description: 'winTV con Liga 1 MAX para ver todos los partidos del fútbol peruano. Promo 50% de descuento.', tags: ['WIN', 'winTV', 'Liga 1 MAX'], source: 'WIN Oferta Mayo-Junio' },
  { id: 'win-addon-tv-l1max-premium', operatorId: 'win', name: 'winTV L1 MAX Premium', category: 'tv', monthlyPrice: 34.50, description: 'winTV L1 MAX Premium. Con canales adicionales exclusivos de entretenimiento.', tags: ['WIN', 'winTV', 'Premium'], source: 'WIN Oferta Mayo-Junio' }
];

export const dataValidationNotes = [
  'Vodafone: la sección 4 plataformas del PDF muestra el bloque como Netflix/HBO/Prime/Disney + 100 canales, pero la fila regular dice N + Prime + HBO. Validar si Disney está incluido en todos los precios.',
  'Yoigo: muchas tarifas vienen como imagen y no como texto seleccionable. Validar condiciones exactas de datos móviles, permanencia e IVA antes de producción.',
  'Orange: la fila de líneas adicionales muestra tres precios: 18.15€, 15.73€ y 13.31€. Validar la regla exacta de aplicación por tarifa/tramo.',
  'Orange: los planes N Extra son más empresariales/paquetes escalables. Puede convenir separarlos en una pestaña B2B o Empresas dentro del cotizador.',
];
