// Tarifario Smart Telco - datos estructurados desde PDFs del usuario
// Fuentes:
// - TARIFARIO_VODAFONE_MAYO_2026.pdf
// - YOIGO 02.06.26.pdf
// - Tarifario Orange.pdf
// Nota: algunos datos de Yoigo vienen de capturas/imagen y deben ser validados antes de producción.

import {
  type CommercialStatus,
  type SourceType
} from './vodafone-commercial-truth.ts';

export type { CommercialStatus, SourceType };

export type OperatorId = 'vodafone' | 'yoigo' | 'orange' | 'lowi' | 'win';
export type PriceKind = 'final' | 'promo_then_regular' | 'segmented_discount' | 'one_time';
export type PlanCategory =
  | 'fibra_movil'
  | 'fibra_fijo_movil'
  | 'fibra_movil_tv'
  | 'fibra_tv'
  | 'solo_movil'
  | 'solo_fibra'
  | 'flash_agosto'
  | 'dazn_deportes'
  | 'segunda_residencia'
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
  tvPackage?: string;
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
  
  // Metadatos de trazabilidad y gobernanza comercial
  commercialStatus?: CommercialStatus;
  sourceType?: SourceType;
  calculationFormula?: string;
  tryAndPayEligible?: boolean;
  btsMaxOtts?: number;
  blockedReason?: string;
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
  
  // Metadatos de trazabilidad y gobernanza comercial
  isInformative?: boolean;
  commercialStatus?: CommercialStatus;
  sourceType?: SourceType;
  calculationFormula?: string;
  blockedReason?: string;
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
  // ===================== VODAFONE SEPTIEMBRE 2026 =====================
  // --- 1. LAS 12 TARIFAS BASE OFICIALES AUDITADAS ---
  {
    id: 'vdf-base-600m-1x60gb',
    operatorId: 'vodafone',
    category: 'fibra_movil',
    name: 'Vodafone One 600M + 1x60GB',
    fiber: '600Mb',
    mobileLines: 1,
    mobileData: '60GB 5G (luego 2Mbps)',
    priceKind: 'final',
    monthlyPrice: 43,
    permanenceMonths: 12,
    commercialStatus: 'CONFIRMED',
    sourceType: 'OFFICIAL_TABLE',
    btsMaxOtts: 1,
    tryAndPayEligible: false,
    tags: ['Tarifa Base', 'Fibra 600', '1 línea', '60GB', 'AACC Septiembre 2026'],
    highlights: ['Fibra 600Mbps Simétrica', '1 línea móvil 60GB 5G', 'Baja a 2Mbps sin cortes', 'Fijo con llamadas ilimitadas'],
    notes: ['Tarifa base oficial AACC Septiembre 2026 - Pág. 6.'],
    source: 'Vodafone AACC Septiembre 2026 - Pág. 6'
  },
  {
    id: 'vdf-base-600m-2x60gb',
    operatorId: 'vodafone',
    category: 'fibra_movil',
    name: 'Vodafone One 600M + 2x60GB',
    fiber: '600Mb',
    mobileLines: 2,
    mobileData: '2x 60GB 5G (luego 2Mbps)',
    priceKind: 'final',
    monthlyPrice: 49,
    permanenceMonths: 12,
    commercialStatus: 'CONFIRMED',
    sourceType: 'DERIVED',
    calculationFormula: '43€ (base 1L 600M 60GB) + 6€ (2ª línea convergente) = 49€',
    btsMaxOtts: 1,
    tryAndPayEligible: false,
    tags: ['Tarifa Base', 'Fibra 600', '2 líneas', '60GB', 'Multilínea'],
    highlights: ['Fibra 600Mbps', '2 líneas móviles 60GB 5G cada una', '2ª línea convergente por +6€/mes', 'Fijo ilimitado'],
    notes: ['Base 43€ + 6€ línea adicional según Pág. 7.'],
    source: 'Vodafone AACC Septiembre 2026 - Pág. 6 y 7'
  },
  {
    id: 'vdf-base-1g-1x60gb',
    operatorId: 'vodafone',
    category: 'fibra_movil',
    name: 'Vodafone One 1G + 1x60GB',
    fiber: '1Gb',
    mobileLines: 1,
    mobileData: '60GB 5G (luego 2Mbps)',
    priceKind: 'final',
    monthlyPrice: 53,
    permanenceMonths: 12,
    commercialStatus: 'CONFIRMED',
    sourceType: 'DERIVED',
    calculationFormula: '43€ (base 600M 1x60GB) + 10€ (salto 1G) = 53€',
    btsMaxOtts: 1,
    tryAndPayEligible: true,
    tags: ['Tarifa Base', 'Fibra 1Gb', '1 línea', '60GB', 'Try&Pay Elegible'],
    highlights: ['Fibra 1Gbps Simétrica', '1 línea móvil 60GB 5G', 'Compatible con Try&Pay 3 meses a precio de 600M', 'Router WiFi 6'],
    notes: ['Base 43€ + 10€ salto estándar 1Gbps.'],
    source: 'Vodafone AACC Septiembre 2026 - Pág. 6'
  },
  {
    id: 'vdf-base-1g-2x60gb',
    operatorId: 'vodafone',
    category: 'fibra_movil',
    name: 'Vodafone One 1G + 2x60GB',
    fiber: '1Gb',
    mobileLines: 2,
    mobileData: '2x 60GB 5G (luego 2Mbps)',
    priceKind: 'final',
    monthlyPrice: 59,
    permanenceMonths: 12,
    commercialStatus: 'CONFIRMED',
    sourceType: 'DERIVED',
    calculationFormula: '49€ (base 600M 2x60GB) + 10€ (salto 1G) = 59€',
    btsMaxOtts: 1,
    tryAndPayEligible: true,
    tags: ['Tarifa Base', 'Fibra 1Gb', '2 líneas', '60GB', 'Try&Pay Elegible'],
    highlights: ['Fibra 1Gbps Simétrica', '2 líneas móviles 60GB 5G', 'Compatible con Try&Pay 3 meses a 49€/mes', 'Router WiFi 6'],
    notes: ['Base 49€ + 10€ salto a 1Gbps.'],
    source: 'Vodafone AACC Septiembre 2026 - Pág. 6 y 7'
  },
  {
    id: 'vdf-base-600m-1x160gb',
    operatorId: 'vodafone',
    category: 'fibra_movil',
    name: 'Vodafone One 600M + 1x160GB',
    fiber: '600Mb',
    mobileLines: 1,
    mobileData: '160GB 5G (luego 2Mbps)',
    priceKind: 'final',
    monthlyPrice: 48,
    permanenceMonths: 12,
    commercialStatus: 'CONFIRMED',
    sourceType: 'OFFICIAL_TABLE',
    btsMaxOtts: 2,
    tryAndPayEligible: false,
    tags: ['Tarifa Base', 'Fibra 600', '1 línea', '160GB', 'AACC Septiembre 2026'],
    highlights: ['Fibra 600Mbps', '1 línea móvil 160GB 5G', 'Derecho a 2 OTTs en campaña BTS', 'Fijo ilimitado'],
    notes: ['Tarifa base oficial AACC Septiembre 2026 - Pág. 6 (La más vendida).'],
    source: 'Vodafone AACC Septiembre 2026 - Pág. 6'
  },
  {
    id: 'vdf-base-600m-2x160gb',
    operatorId: 'vodafone',
    category: 'fibra_movil',
    name: 'Vodafone One 600M + 2x160GB',
    fiber: '600Mb',
    mobileLines: 2,
    mobileData: '2x 160GB 5G (luego 2Mbps)',
    priceKind: 'final',
    monthlyPrice: 54,
    permanenceMonths: 12,
    commercialStatus: 'CONFIRMED',
    sourceType: 'OFFICIAL_TABLE',
    calculationFormula: '48€ (base 1L 600M 160GB) + 6€ (2ª línea) = 54€',
    btsMaxOtts: 2,
    tryAndPayEligible: false,
    tags: ['Tarifa Base', 'Fibra 600', '2 líneas', '160GB', 'La familiar base'],
    highlights: ['Fibra 600Mbps', '2 líneas móviles 160GB 5G cada una', 'Derecho a 2 OTTs en campaña BTS', 'Fijo ilimitado'],
    notes: ['Oficial AACC Septiembre 2026 - Pág. 6 y Pág. 17 (Fin promo sin TV).'],
    source: 'Vodafone AACC Septiembre 2026 - Pág. 6 y 17'
  },
  {
    id: 'vdf-base-1g-1x160gb',
    operatorId: 'vodafone',
    category: 'fibra_movil',
    name: 'Vodafone One 1G + 1x160GB',
    fiber: '1Gb',
    mobileLines: 1,
    mobileData: '160GB 5G (luego 2Mbps)',
    priceKind: 'final',
    monthlyPrice: 58,
    permanenceMonths: 12,
    commercialStatus: 'CONFIRMED',
    sourceType: 'DERIVED',
    calculationFormula: '48€ (base 600M 1x160GB) + 10€ (salto 1G) = 58€',
    btsMaxOtts: 2,
    tryAndPayEligible: true,
    tags: ['Tarifa Base', 'Fibra 1Gb', '1 línea', '160GB', 'Try&Pay Elegible'],
    highlights: ['Fibra 1Gbps Simétrica', '1 línea móvil 160GB 5G', 'Compatible con Try&Pay 3 meses a 48€/mes', 'Router WiFi 6'],
    notes: ['Base 48€ + 10€ salto a 1Gbps.'],
    source: 'Vodafone AACC Septiembre 2026 - Pág. 6'
  },
  {
    id: 'vdf-base-1g-2x160gb',
    operatorId: 'vodafone',
    category: 'fibra_movil',
    name: 'Vodafone One 1G + 2x160GB',
    fiber: '1Gb',
    mobileLines: 2,
    mobileData: '2x 160GB 5G (luego 2Mbps)',
    priceKind: 'final',
    monthlyPrice: 64,
    permanenceMonths: 12,
    commercialStatus: 'CONFIRMED',
    sourceType: 'DERIVED',
    calculationFormula: '54€ (base 600M 2x160GB) + 10€ (salto 1G) = 64€',
    btsMaxOtts: 2,
    tryAndPayEligible: true,
    tags: ['Tarifa Base', 'Fibra 1Gb', '2 líneas', '160GB', 'Try&Pay Elegible'],
    highlights: ['Fibra 1Gbps Simétrica', '2 líneas móviles 160GB 5G', 'Compatible con Try&Pay 3 meses a 54€/mes', 'Router WiFi 6'],
    notes: ['Base 54€ + 10€ salto a 1Gbps.'],
    source: 'Vodafone AACC Septiembre 2026 - Pág. 6 y 7'
  },
  {
    id: 'vdf-base-600m-1xilim',
    operatorId: 'vodafone',
    category: 'fibra_movil',
    name: 'Vodafone One 600M + 1 Ilimitada',
    fiber: '600Mb',
    mobileLines: 1,
    mobileData: 'Ilimitado 5G',
    priceKind: 'final',
    monthlyPrice: 53,
    permanenceMonths: 12,
    commercialStatus: 'CONFIRMED',
    sourceType: 'DERIVED',
    calculationFormula: '48€ (base 160GB) + 5€ (salto ilimitada) = 53€',
    btsMaxOtts: 3,
    tryAndPayEligible: false,
    tags: ['Tarifa Base', 'Fibra 600', '1 línea', 'Ilimitada', 'Datos Ilimitados'],
    highlights: ['Fibra 600Mbps', '1 línea móvil Ilimitada 5G continua', 'Derecho a 3 OTTs en campaña BTS', 'Fijo ilimitado'],
    notes: ['Base 48€ + 5€ salto a ilimitada.'],
    source: 'Vodafone AACC Septiembre 2026 - Pág. 6 y 7'
  },
  {
    id: 'vdf-base-600m-2xilim',
    operatorId: 'vodafone',
    category: 'fibra_movil',
    name: 'Vodafone One 600M + 2 Ilimitadas',
    fiber: '600Mb',
    mobileLines: 2,
    mobileData: '2x Ilimitadas 5G',
    priceKind: 'final',
    monthlyPrice: 59,
    permanenceMonths: 12,
    commercialStatus: 'CONFIRMED',
    sourceType: 'OFFICIAL_TABLE',
    calculationFormula: '53€ (base 1L ilim) + 6€ (2ª línea convergente) = 59€',
    btsMaxOtts: 3,
    tryAndPayEligible: false,
    tags: ['Tarifa Base', 'Fibra 600', '2 líneas', 'Ilimitadas', 'Datos Ilimitados'],
    highlights: ['Fibra 600Mbps', '2 líneas móviles Ilimitadas 5G', 'Derecho a 3 OTTs en campaña BTS', 'Fijo ilimitado'],
    notes: ['Base oficial 59€ reflejada en promo sin TV (Pág. 17) y referencia Try&Pay (Pág. 6).'],
    source: 'Vodafone AACC Septiembre 2026 - Pág. 6 y 17'
  },
  {
    id: 'vdf-base-1g-1xilim',
    operatorId: 'vodafone',
    category: 'fibra_movil',
    name: 'Vodafone One 1G + 1 Ilimitada',
    fiber: '1Gb',
    mobileLines: 1,
    mobileData: 'Ilimitado 5G',
    priceKind: 'final',
    monthlyPrice: 63,
    permanenceMonths: 12,
    commercialStatus: 'CONFIRMED',
    sourceType: 'DERIVED',
    calculationFormula: '53€ (base 600M ilim) + 10€ (salto 1G) = 63€',
    btsMaxOtts: 3,
    tryAndPayEligible: true,
    tags: ['Tarifa Base', 'Fibra 1Gb', '1 línea', 'Ilimitada', 'Try&Pay Elegible'],
    highlights: ['Fibra 1Gbps Simétrica', '1 línea móvil Ilimitada 5G', 'Compatible con Try&Pay 3 meses a 53€/mes', 'Router WiFi 6'],
    notes: ['Base 53€ + 10€ salto a 1Gbps.'],
    source: 'Vodafone AACC Septiembre 2026 - Pág. 6'
  },
  {
    id: 'vdf-base-1g-2xilim',
    operatorId: 'vodafone',
    category: 'fibra_movil',
    name: 'Vodafone One 1G + 2 Ilimitadas',
    fiber: '1Gb',
    mobileLines: 2,
    mobileData: '2x Ilimitadas 5G',
    priceKind: 'final',
    monthlyPrice: 69,
    permanenceMonths: 12,
    commercialStatus: 'CONFIRMED',
    sourceType: 'OFFICIAL_TABLE',
    calculationFormula: '59€ (base 600M 2xIlim) + 10€ (salto 1G) = 69€',
    btsMaxOtts: 3,
    tryAndPayEligible: true,
    tags: ['Tarifa Base', 'Fibra 1Gb', '2 líneas', 'Ilimitadas', 'Try&Pay Elegible', 'Golden Base'],
    highlights: ['Fibra 1Gbps Simétrica', '2 líneas móviles Ilimitadas 5G', 'Compatible con Try&Pay 3 meses a 59€/mes', 'Router WiFi 6'],
    notes: ['Base de la oferta oficial La Completa: 69€ base + 1€ SN = 70€ al fin de Try&Pay.'],
    source: 'Vodafone AACC Septiembre 2026 - Pág. 6 y 17'
  },

  // --- 2. PACKS OFICIALES CAMPAÑA BTS VUELTA AL COLE (AACC Slide 6) ---
  {
    id: 'vdf-bts-la-completa',
    operatorId: 'vodafone',
    category: 'fibra_movil_streaming',
    name: 'BTS: La Completa (Fibra 1Gbps + 2 Ilimitadas + 3 OTTs)',
    fiber: '1Gb',
    mobileLines: 2,
    mobileData: '2x Ilimitadas 5G',
    tvIncluded: true,
    tvPackage: 'Vodafone TV + 3 OTTs (Regalo hasta 2027) + Deco 4K gratis',
    streamingIncluded: ['Prime', 'Disney+', 'HBO Max'],
    priceKind: 'promo_then_regular',
    promoPrice: 59,
    promoMonths: 3,
    regularPrice: 70,
    permanenceMonths: 12,
    commercialStatus: 'CONFIRMED',
    sourceType: 'OFFICIAL_AACC_EXAMPLE',
    tryAndPayEligible: true,
    btsMaxOtts: 3,
    tags: ['Campaña BTS', 'La Completa', 'Golden Test', 'Try&Pay', 'Deco gratis', 'Vuelta al Cole'],
    highlights: [
      'Meses 1-3: 59€/mes (Try&Pay 1G a precio de 600M + Secure Net gratis)',
      'Meses 4-Dic 2026: 70€/mes (Fin T&P + SN 1€, 3 OTTs gratis de regalo)',
      'Desde 01/01/2027: 91€/mes (Fin BTS: 70€ base+SN + 21€ pack 3 OTTs)',
      'Decodificador 4K incluido gratis (0€ cuota)',
      'Secure Net Fijo y Móvil incluido'
    ],
    notes: ['GOLDEN TEST OFICIAL AACC: 59€ (m1-3) -> 70€ (m4-dic 26) -> 91€ (desde 1/1/27).'],
    source: 'Vodafone AACC Septiembre 2026 - Pág. 6'
  },
  {
    id: 'vdf-bts-la-mas-economica',
    operatorId: 'vodafone',
    category: 'fibra_movil_streaming',
    name: 'BTS: La Más Económica (Fibra 1Gbps + 1x60GB + 1 OTT)',
    fiber: '1Gb',
    mobileLines: 1,
    mobileData: '60GB 5G',
    tvIncluded: true,
    tvPackage: 'Vodafone TV + 1 OTT (Regalo hasta 2027) + Deco gratis',
    streamingIncluded: ['Prime'],
    priceKind: 'promo_then_regular',
    promoPrice: 43,
    promoMonths: 3,
    regularPrice: 54,
    permanenceMonths: 12,
    commercialStatus: 'CONFIRMED',
    sourceType: 'OFFICIAL_AACC_EXAMPLE',
    tryAndPayEligible: true,
    btsMaxOtts: 1,
    tags: ['Campaña BTS', 'La más económica', 'Try&Pay', 'Deco gratis', 'Vuelta al Cole'],
    highlights: [
      'Meses 1-3: 43€/mes (Try&Pay + Secure Net Fijo gratis)',
      'Meses 4-Dic 2026: 54€/mes (Fin T&P + SN 1€)',
      'Desde 01/01/2027: 63€/mes con Prime (67,99€/mes con Netflix)',
      'Decodificador gratis incluido'
    ],
    notes: ['Oficial AACC Septiembre 2026 - Pág. 6.'],
    source: 'Vodafone AACC Septiembre 2026 - Pág. 6'
  },
  {
    id: 'vdf-bts-la-mas-vendida',
    operatorId: 'vodafone',
    category: 'fibra_movil_streaming',
    name: 'BTS: La Más Vendida (Fibra 1Gbps + 1x160GB + 2 OTTs)',
    fiber: '1Gb',
    mobileLines: 1,
    mobileData: '160GB 5G',
    tvIncluded: true,
    tvPackage: 'Vodafone TV + 2 OTTs (Regalo hasta 2027) + Deco gratis',
    streamingIncluded: ['Prime', 'Netflix'],
    priceKind: 'promo_then_regular',
    promoPrice: 48,
    promoMonths: 3,
    regularPrice: 59,
    permanenceMonths: 12,
    commercialStatus: 'CONFIRMED',
    sourceType: 'OFFICIAL_AACC_EXAMPLE',
    tryAndPayEligible: true,
    btsMaxOtts: 2,
    tags: ['Campaña BTS', 'La más vendida', 'Try&Pay', 'Deco gratis', 'Vuelta al Cole'],
    highlights: [
      'Meses 1-3: 48€/mes (Try&Pay + Secure Net gratis)',
      'Meses 4-Dic 2026: 59€/mes (Fin T&P + SN 1€)',
      'Desde 01/01/2027: 77€/mes (Fin BTS con 2 OTTs)',
      'Decodificador gratis incluido'
    ],
    notes: ['Oficial AACC Septiembre 2026 - Pág. 6.'],
    source: 'Vodafone AACC Septiembre 2026 - Pág. 6'
  },
  {
    id: 'vdf-bts-la-familiar',
    operatorId: 'vodafone',
    category: 'fibra_movil_streaming',
    name: 'BTS: La Familiar (Fibra 1Gbps + 2x160GB + 2 OTTs)',
    fiber: '1Gb',
    mobileLines: 2,
    mobileData: '2x 160GB 5G',
    tvIncluded: true,
    tvPackage: 'Vodafone TV + 2 OTTs (Regalo hasta 2027) + Deco gratis',
    streamingIncluded: ['Prime', 'Disney+'],
    priceKind: 'promo_then_regular',
    promoPrice: 54,
    promoMonths: 3,
    regularPrice: 65,
    permanenceMonths: 12,
    commercialStatus: 'CONFIRMED',
    sourceType: 'OFFICIAL_AACC_EXAMPLE',
    tryAndPayEligible: true,
    btsMaxOtts: 2,
    tags: ['Campaña BTS', 'La familiar', 'Try&Pay', 'Deco gratis', 'Vuelta al Cole'],
    highlights: [
      'Meses 1-3: 54€/mes (Try&Pay + Secure Net gratis)',
      'Meses 4-Dic 2026: 65€/mes (Fin T&P + SN 1€)',
      'Desde 01/01/2027: 80€/mes (Fin BTS: 65€ + 15€ pack 2 OTTs)',
      'Decodificador gratis incluido'
    ],
    notes: ['Oficial AACC Septiembre 2026 - Pág. 6.'],
    source: 'Vodafone AACC Septiembre 2026 - Pág. 6'
  },

  // --- 3. SOLO FIBRA & SOLO MÓVIL & SEGUNDAS RESIDENCIAS ---
  {
    id: 'vodafone-solofibra-600mb',
    operatorId: 'vodafone',
    category: 'solo_fibra',
    name: 'Solo Fibra 600Mbps (Residencia Principal)',
    fiber: '600Mb',
    priceKind: 'final',
    monthlyPrice: 30,
    permanenceMonths: 12,
    commercialStatus: 'CONFIRMED',
    sourceType: 'OFFICIAL_TABLE',
    tags: ['Solo Fibra', 'Fibra 600', 'Residencia Principal', 'Fijo incluido'],
    highlights: ['Fibra 600Mbps Simétrica', 'Fijo con llamadas ilimitadas', 'Router WiFi incluido', 'Instalación gratis'],
    source: 'Vodafone AACC Septiembre 2026 - Pág. 4'
  },
  {
    id: 'vodafone-solofibra-1gb',
    operatorId: 'vodafone',
    category: 'solo_fibra',
    name: 'Solo Fibra 1Gbps (Residencia Principal)',
    fiber: '1Gb',
    priceKind: 'final',
    monthlyPrice: 35,
    permanenceMonths: 12,
    commercialStatus: 'CONFIRMED',
    sourceType: 'OFFICIAL_TABLE',
    tags: ['Solo Fibra', 'Fibra 1Gb', 'Residencia Principal', 'Fijo incluido'],
    highlights: ['Fibra 1Gbps Simétrica', 'Fijo con llamadas ilimitadas', 'Router WiFi 6 incluido', 'Instalación gratis'],
    source: 'Vodafone AACC Septiembre 2026 - Pág. 4'
  },
  {
    id: 'vodafone-solomovil-60gb',
    operatorId: 'vodafone',
    category: 'solo_movil',
    name: 'Solo Móvil 60GB 5G',
    mobileLines: 1,
    mobileData: '60GB 5G (luego 2Mbps ilimitado)',
    priceKind: 'final',
    monthlyPrice: 16,
    commercialStatus: 'CONFIRMED',
    sourceType: 'OFFICIAL_TABLE',
    tags: ['Solo Móvil', '60GB', '5G', 'Llamadas ilimitadas'],
    highlights: ['60GB a velocidad 5G', 'Llamadas ilimitadas', 'Roaming en UE y EE.UU.'],
    source: 'Vodafone AACC Septiembre 2026 - Pág. 4'
  },
  {
    id: 'vodafone-solomovil-160gb',
    operatorId: 'vodafone',
    category: 'solo_movil',
    name: 'Solo Móvil 160GB 5G',
    mobileLines: 1,
    mobileData: '160GB 5G (luego 2Mbps ilimitado)',
    priceKind: 'final',
    monthlyPrice: 21,
    commercialStatus: 'CONFIRMED',
    sourceType: 'OFFICIAL_TABLE',
    tags: ['Solo Móvil', '160GB', '5G', 'Llamadas ilimitadas'],
    highlights: ['160GB a velocidad 5G', 'Llamadas ilimitadas', 'Roaming en UE y EE.UU.'],
    source: 'Vodafone AACC Septiembre 2026 - Pág. 4'
  },
  {
    id: 'vodafone-solomovil-siempre5g',
    operatorId: 'vodafone',
    category: 'solo_movil',
    name: 'Solo Móvil Ilimitado Siempre 5G',
    mobileLines: 1,
    mobileData: 'Datos Ilimitados Siempre a velocidad 5G',
    priceKind: 'final',
    monthlyPrice: 26,
    commercialStatus: 'CONFIRMED',
    sourceType: 'OFFICIAL_TABLE',
    tags: ['Solo Móvil', 'Ilimitado', 'Siempre 5G'],
    highlights: ['Datos Ilimitados a máxima velocidad 5G continua', 'Llamadas ilimitadas', 'Roaming en UE y EE.UU.'],
    source: 'Vodafone AACC Septiembre 2026 - Pág. 4'
  },
  {
    id: 'vodafone-segunda-residencia-fibra600',
    operatorId: 'vodafone',
    category: 'segunda_residencia',
    name: 'Segunda Residencia: Fibra 600Mb',
    fiber: '600Mb',
    priceKind: 'final',
    monthlyPrice: 15,
    commercialStatus: 'CONFIRMED',
    sourceType: 'OFFICIAL_TABLE',
    tags: ['Segunda Residencia', 'Fibra 600', 'Vacaciones'],
    highlights: ['Fibra 600Mbps para segunda vivienda', 'Fijo con llamadas ilimitadas incluido'],
    notes: ['Exclusivo para clientes con paquete convergente principal activo.'],
    source: 'Vodafone AACC Septiembre 2026 - Pág. 4 y 8'
  },
  {
    id: 'vodafone-segunda-residencia-fibra1gb',
    operatorId: 'vodafone',
    category: 'segunda_residencia',
    name: 'Segunda Residencia: Fibra 1Gbps',
    fiber: '1Gb',
    priceKind: 'final',
    monthlyPrice: 20,
    commercialStatus: 'CONFIRMED',
    sourceType: 'OFFICIAL_TABLE',
    tags: ['Segunda Residencia', 'Fibra 1Gb', 'Vacaciones'],
    highlights: ['Fibra 1Gbps para segunda vivienda', 'Fijo con llamadas ilimitadas'],
    notes: ['Exclusivo para clientes con paquete convergente principal activo.'],
    source: 'Vodafone AACC Septiembre 2026 - Pág. 4 y 8'
  },
  {
    id: 'vodafone-segunda-residencia-portatil',
    operatorId: 'vodafone',
    category: 'segunda_residencia',
    name: 'Segunda Residencia: Internet Portátil hasta 1Gbps',
    priceKind: 'final',
    monthlyPrice: 16,
    commercialStatus: 'CONFIRMED',
    sourceType: 'OFFICIAL_TABLE',
    tags: ['Segunda Residencia', 'Internet Portátil', 'Sin instalación'],
    highlights: ['Internet portátil hasta 1Gbps', 'Sin cables ni obras', 'Llévalo contigo'],
    notes: ['Exclusivo para clientes convergentes.'],
    source: 'Vodafone AACC Septiembre 2026 - Pág. 4 y 8'
  },
  {
    id: 'vodafone-portatil-residencia-principal',
    operatorId: 'vodafone',
    category: 'segunda_residencia',
    name: 'Internet Portátil (Residencia Principal) hasta 1Gbps',
    priceKind: 'final',
    monthlyPrice: 30,
    commercialStatus: 'CONFIRMED',
    sourceType: 'OFFICIAL_TABLE',
    tags: ['Internet Portátil', 'Residencia Principal', 'Sin cables'],
    highlights: ['Internet Portátil 5G hasta 1Gbps', 'Enchufar y navegar'],
    source: 'Vodafone AACC Septiembre 2026 - Pág. 4'
  },

  // --- 4. AUTÓNOMOS & EMPRESAS & TV BARES ---
  {
    id: 'vodafone-mi-negocio-pro-2lineas',
    operatorId: 'vodafone',
    category: 'fibra_movil_empresa',
    name: 'Mi Negocio Pro (2 Líneas) - Fibra 1Gb + 2 Móviles Ilimitadas 5G',
    fiber: '1Gb',
    mobileLines: 2,
    mobileData: '2 líneas móviles Ilimitadas 5G (MultiSIM incluida)',
    priceKind: 'final',
    monthlyPrice: 50.89,
    commercialStatus: 'CONFIRMED',
    sourceType: 'OFFICIAL_TABLE',
    tags: ['Mi Negocio Pro', 'Empresa', 'Fibra 1Gb', '2 líneas', 'MultiSIM'],
    highlights: ['Fibra 1Gbps WiFi 6', '2 líneas móviles ilimitadas 5G con MultiSIM', '200 min internacionales por línea', 'Seguridad Digital'],
    notes: ['Precios profesionales sin IVA.'],
    source: 'Vodafone AACC Septiembre 2026 - Pág. 28'
  },
  {
    id: 'vodafone-mi-negocio-pro-3lineas',
    operatorId: 'vodafone',
    category: 'fibra_movil_empresa',
    name: 'Mi Negocio Pro (3 Líneas) - Fibra 1Gb + 3 Móviles Ilimitadas 5G',
    fiber: '1Gb',
    mobileLines: 3,
    mobileData: '3 líneas móviles Ilimitadas 5G',
    priceKind: 'promo_then_regular',
    promoPrice: 63.16,
    regularPrice: 68.16,
    promoMonths: 24,
    monthlyPrice: 63.16,
    commercialStatus: 'CONFIRMED',
    sourceType: 'OFFICIAL_TABLE',
    tags: ['Mi Negocio Pro', 'Empresa', 'Fibra 1Gb', '3 líneas'],
    highlights: ['Fibra 1Gbps WiFi 6', '3 líneas móviles ilimitadas 5G', 'Seguridad Digital incluida', 'Descuento 5€ aplicado durante 24 meses'],
    notes: ['Formado por Mi Negocio Pro 2 + línea móvil + Seguridad Digital + dto 5€.'],
    source: 'Vodafone AACC Septiembre 2026 - Pág. 28 y 30'
  },
  {
    id: 'vodafone-mi-negocio-pro-5lineas',
    operatorId: 'vodafone',
    category: 'fibra_movil_empresa',
    name: 'Mi Negocio Pro (5 Líneas) - Fibra 1Gb + 5 Móviles Ilimitadas 5G',
    fiber: '1Gb',
    mobileLines: 5,
    mobileData: '5 líneas móviles Ilimitadas 5G',
    priceKind: 'promo_then_regular',
    promoPrice: 75.00,
    regularPrice: 80.00,
    promoMonths: 24,
    monthlyPrice: 75.00,
    commercialStatus: 'CONFIRMED',
    sourceType: 'OFFICIAL_TABLE',
    tags: ['Mi Negocio Pro', 'Empresa', 'Fibra 1Gb', '5 líneas'],
    highlights: ['Fibra 1Gbps WiFi 6', '5 líneas móviles ilimitadas 5G', 'Atención Premium especializada', 'Descuento 5€ aplicado durante 24 meses'],
    notes: ['Promo 75€/mes durante 24 meses, luego regular 80€/mes sin IVA.'],
    source: 'Vodafone AACC Septiembre 2026 - Pág. 28'
  },
  {
    id: 'vodafone-tv-bares-menos10k',
    operatorId: 'vodafone',
    category: 'fibra_movil_empresa',
    name: 'Vodafone TV Bares (<10K hab) + Mi Negocio Pro 2',
    fiber: '1Gb',
    mobileLines: 2,
    mobileData: '2 líneas móviles Ilimitadas 5G',
    tvIncluded: true,
    tvPackage: 'Vodafone TV Bares (Fútbol LaLiga, Champions, DAZN Bar)',
    priceKind: 'promo_then_regular',
    promoPrice: 280.89,
    promoMonths: 6,
    regularPrice: 340.89,
    commercialStatus: 'CONFIRMED',
    sourceType: 'OFFICIAL_TABLE',
    tags: ['TV Bares', 'HORECA', 'Fútbol', 'DAZN Bar', '<10K hab'],
    highlights: ['Todo el Fútbol HORECA', 'Hasta 3 decodificadores gratis', 'Fibra 1Gb + 2 móviles 5G', 'Ahorro 60€/mes por 6 meses'],
    source: 'Vodafone AACC Septiembre 2026'
  },
  {
    id: 'vodafone-tv-bares-10k-45k',
    operatorId: 'vodafone',
    category: 'fibra_movil_empresa',
    name: 'Vodafone TV Bares (10K-45K hab) + Mi Negocio Pro 2',
    fiber: '1Gb',
    mobileLines: 2,
    mobileData: '2 líneas móviles Ilimitadas 5G',
    tvIncluded: true,
    tvPackage: 'Vodafone TV Bares (Fútbol LaLiga, Champions, DAZN Bar)',
    priceKind: 'promo_then_regular',
    promoPrice: 305.89,
    promoMonths: 6,
    regularPrice: 365.89,
    commercialStatus: 'CONFIRMED',
    sourceType: 'OFFICIAL_TABLE',
    tags: ['TV Bares', 'HORECA', 'Fútbol', 'DAZN Bar', '10K-45K hab'],
    highlights: ['Todo el Fútbol HORECA', 'Hasta 3 decos gratis', 'Fibra 1Gb + 2 líneas ilimitadas'],
    source: 'Vodafone AACC Septiembre 2026'
  },
  {
    id: 'vodafone-tv-bares-45k-250k',
    operatorId: 'vodafone',
    category: 'fibra_movil_empresa',
    name: 'Vodafone TV Bares (45K-250K hab) + Mi Negocio Pro 2',
    fiber: '1Gb',
    mobileLines: 2,
    mobileData: '2 líneas móviles Ilimitadas 5G',
    tvIncluded: true,
    tvPackage: 'Vodafone TV Bares (Fútbol LaLiga, Champions, DAZN Bar)',
    priceKind: 'promo_then_regular',
    promoPrice: 330.89,
    promoMonths: 6,
    regularPrice: 390.89,
    commercialStatus: 'CONFIRMED',
    sourceType: 'OFFICIAL_TABLE',
    tags: ['TV Bares', 'HORECA', 'Fútbol', 'DAZN Bar', '45K-250K hab'],
    highlights: ['Todo el Fútbol HORECA', 'Hasta 3 decos incluidos'],
    source: 'Vodafone AACC Septiembre 2026'
  },
  {
    id: 'vodafone-tv-bares-mas250k',
    operatorId: 'vodafone',
    category: 'fibra_movil_empresa',
    name: 'Vodafone TV Bares (>250K hab) + Mi Negocio Pro 2',
    fiber: '1Gb',
    mobileLines: 2,
    mobileData: '2 líneas móviles Ilimitadas 5G',
    tvIncluded: true,
    tvPackage: 'Vodafone TV Bares (Fútbol LaLiga, Champions, DAZN Bar)',
    priceKind: 'promo_then_regular',
    promoPrice: 355.89,
    promoMonths: 6,
    regularPrice: 415.89,
    commercialStatus: 'CONFIRMED',
    sourceType: 'OFFICIAL_TABLE',
    tags: ['TV Bares', 'HORECA', 'Fútbol', 'DAZN Bar', '>250K hab'],
    highlights: ['Todo el Fútbol HORECA', 'Hasta 3 decos incluidos'],
    source: 'Vodafone AACC Septiembre 2026'
  },

  // --- 5. OFERTAS PÚBLICAS SIN TV (Pág. 17) ---
  {
    id: 'vdf-oferta-39-euros',
    operatorId: 'vodafone',
    category: 'fibra_movil',
    name: 'Oferta Pública Sin TV 39€ (Fibra 600M + 2x160GB)',
    fiber: '600Mb',
    mobileLines: 2,
    mobileData: '2x 160GB 5G',
    priceKind: 'promo_then_regular',
    promoPrice: 39,
    promoMonths: 3,
    regularPrice: 54,
    monthlyPrice: 39,
    permanenceMonths: 12,
    commercialStatus: 'CONFIRMED',
    sourceType: 'OFFICIAL_TABLE',
    tags: ['Oferta 39€', 'Sin TV', 'Fibra 600M', '2x160GB'],
    highlights: [
      'PVP hasta 31/12: 39€/mes (Fin promo: 54€/mes, PVP BTL: 49€/mes)',
      'Fibra 600Mbps + 2 líneas móviles 160GB 5G',
      'Oferta pública confirmada sin TV'
    ],
    notes: [
      'Página 17 del documento comercial AACC Septiembre 2026.',
      'PVP hasta 31/12: 39 € | Fin de promo: 54 € | PVP BTL: 49 €.'
    ],
    source: 'Vodafone AACC Septiembre 2026 - Pág. 17'
  },
  {
    id: 'vdf-public-600m-2xilim-44',
    operatorId: 'vodafone',
    category: 'fibra_movil',
    name: 'Oferta Pública Sin TV 44€ (Fibra 600M + 2 Ilimitadas)',
    fiber: '600Mb',
    mobileLines: 2,
    mobileData: '2 líneas ilimitadas 5G',
    priceKind: 'promo_then_regular',
    promoPrice: 44,
    promoMonths: 3,
    regularPrice: 59,
    monthlyPrice: 44,
    permanenceMonths: 12,
    commercialStatus: 'CONFIRMED',
    sourceType: 'OFFICIAL_TABLE',
    tags: ['Oferta 44€', 'Sin TV', 'Fibra 600M', '2 Ilimitadas'],
    highlights: [
      'PVP hasta 31/12: 44€/mes (Fin promo: 59€/mes, PVP BTL: 54€/mes)',
      'Fibra 600Mbps + 2 líneas ilimitadas 5G',
      'Oferta pública confirmada sin TV'
    ],
    notes: [
      'Página 17 del documento comercial AACC Septiembre 2026.',
      'PVP hasta 31/12: 44 € | Fin de promo: 59 € | PVP BTL: 54 €.'
    ],
    source: 'Vodafone AACC Septiembre 2026 - Pág. 17'
  },
  {
    id: 'vdf-oferta-45-euros',
    operatorId: 'vodafone',
    category: 'fibra_movil',
    name: '⚠️ Hipótesis Oferta 45€ [BLOQUEADA]',
    fiber: '1Gb',
    mobileLines: 2,
    mobileData: '2x 160GB 5G',
    priceKind: 'final',
    monthlyPrice: 45,
    permanenceMonths: 12,
    commercialStatus: 'DERIVED_HYPOTHESIS_PENDING_VALIDATION',
    sourceType: 'DERIVED',
    calculationFormula: 'Hipótesis BTL: 39€ (oferta sin TV) + 6€ (línea adicional) = 45€ (pendiente de validación comercial)',
    blockedReason: 'Hipótesis derivada pendiente de validación comercial. BLOQUEADA para propuesta automática.',
    tags: ['⚠️ BLOQUEADA', 'Hipótesis 45€', 'En Validación Comercial'],
    highlights: [
      '⚠️ TARIFA BLOQUEADA: No comercializable automáticamente',
      'Tarifa hipotética derivada de comparativa BTL',
      'Requiere validación comercial formal'
    ],
    notes: [
      'ESTADO: DERIVED_HYPOTHESIS_PENDING_VALIDATION.',
      'Bloqueada hasta validación comercial explícita.'
    ],
    source: 'Auditoría Comercial Septiembre 2026 - Pág. 17 & Hipótesis BTL'
  },

  // --- 6. OFERTAS INTERNAS VODAFONE (CAMBIO COMERCIAL CONFIRMADO) ---
  {
    id: 'vdf-internal-1g-2ilim-39',
    operatorId: 'vodafone',
    category: 'fibra_fijo_movil',
    name: '⭐ Vodafone One 1Gb + 2 Ilimitadas (Promo 39€)',
    fiber: '1Gb',
    fixedLineIncluded: true,
    mobileLines: 2,
    mobileData: '2x Ilimitadas 5G',
    priceKind: 'promo_then_regular',
    promoPrice: 39,
    promoMonths: 3,
    regularPrice: 69,
    monthlyPrice: 39,
    commercialStatus: 'INTERNAL_CONFIRMED',
    sourceType: 'INTERNAL_COMMERCIAL_INFORMATION',
    tryAndPayEligible: true,
    tags: ['⭐ PROMO CONFIRMADA', '1Gb', '2 Ilimitadas', 'Fijo Incluido', '39€'],
    highlights: [
      'Fibra 1Gb simétrica con teléfono fijo incluido',
      '2 líneas móviles con datos y llamadas ilimitadas 5G',
      '39€/mes durante 3 meses, después 69€/mes (PVP regular de catálogo)',
      'Oferta comercial interna confirmada'
    ],
    notes: [
      'Configuración: Fibra 1Gb, Fijo incluido, 2 líneas ilimitadas.',
      '39€/mes durante 3 meses.',
      'Precio posterior: regular de catálogo correspondiente (69€).'
    ],
    source: 'Canal Comercial Interno Confirmado'
  },
  {
    id: 'vdf-internal-1g-1ilim-39',
    operatorId: 'vodafone',
    category: 'fibra_movil',
    name: '❌ Promo Falsa 1G + 1 Ilim 39€ [NO EXISTE]',
    fiber: '1Gb',
    mobileLines: 1,
    mobileData: '1x Ilimitada 5G',
    priceKind: 'promo_then_regular',
    promoPrice: 39,
    promoMonths: 3,
    regularPrice: 63,
    commercialStatus: 'DEPRECATED_INVALID',
    sourceType: 'INTERNAL_COMMERCIAL_INFORMATION',
    blockedReason: 'La oferta 1Gb + 1 línea ilimitada = 39€ x 3 meses NO EXISTE. No mostrar en UI. No usar en cálculos.',
    tags: ['❌ DEPRECATED', 'No Comercializable'],
    highlights: ['Oferta inexistente', 'DEPRECATED_INVALID'],
    notes: ['NO EXISTE', 'No mostrar en UI', 'No usar en cálculos'],
    source: 'Canal Comercial Interno - Eliminada'
  },
  {
    id: 'vdf-internal-1g-2ilim-45-hypothesis',
    operatorId: 'vodafone',
    category: 'fibra_movil',
    name: '❌ Hipótesis Oferta 45€ [INVALIDADA]',
    fiber: '1Gb',
    mobileLines: 2,
    mobileData: '2x Ilimitadas 5G',
    priceKind: 'final',
    monthlyPrice: 45,
    commercialStatus: 'DEPRECATED_INVALID',
    sourceType: 'INTERNAL_COMMERCIAL_INFORMATION',
    calculationFormula: '39€ + 6€ = 45€ (Hipótesis descartada)',
    blockedReason: 'La hipótesis 39 + 6 ya no es válida. No mostrar. No calcular.',
    tags: ['❌ DEPRECATED', 'No Comercializable'],
    highlights: ['Hipótesis descartada', 'DEPRECATED_INVALID'],
    notes: ['La hipótesis 39 + 6 ya no es válida', 'No mostrar', 'No calcular'],
    source: 'Canal Comercial Interno - Hipótesis Descartada'
  },

  // --- 7. OFERTAS FLASH Y PRIVADAS (RESTRICTED_CHANNEL, INCOMPATIBLES CON BTS) ---
  {
    id: 'vdf-flash-3p-1g-2x160gb',
    operatorId: 'vodafone',
    category: 'fibra_movil',
    name: 'Flash 3P: Fibra 1Gbps + 2x160GB',
    fiber: '1Gb',
    mobileLines: 2,
    mobileData: '2x 160GB 5G',
    priceKind: 'final',
    monthlyPrice: 44.70,
    commercialStatus: 'RESTRICTED_CHANNEL',
    sourceType: 'OFFICIAL_TABLE',
    tags: ['Flash', 'Oferta Privada', '1Gb', '2x160GB', 'Incompatible BTS'],
    highlights: [
      'Fibra 1Gbps + 2 líneas 160GB a 44,70€/mes PVP indefinido',
      'Incompatible con campaña BTS',
      '🔒 Oferta privada — verificar disponibilidad en canal'
    ],
    notes: [
      'Oferta privada Flash 3P. Incompatible con BTS.',
      'Verificar disponibilidad en canal comercial.'
    ],
    source: 'Vodafone AACC Septiembre 2026 - Ofertas Flash'
  },
  {
    id: 'vdf-flash-4p-600m-2x160gb-prime',
    operatorId: 'vodafone',
    category: 'fibra_movil_streaming',
    name: 'Flash 4P: Fibra 600M + 2x160GB + TV + Prime',
    fiber: '600Mb',
    mobileLines: 2,
    mobileData: '2x 160GB 5G',
    tvIncluded: true,
    streamingIncluded: ['Amazon Prime'],
    priceKind: 'final',
    monthlyPrice: 51,
    commercialStatus: 'RESTRICTED_CHANNEL',
    sourceType: 'OFFICIAL_TABLE',
    tags: ['Flash', 'Oferta Privada', '600M', 'Prime', 'Incompatible BTS'],
    highlights: [
      'Fibra 600Mbps + 2x160GB + TV + Prime a 51€/mes',
      'Incompatible con campaña BTS',
      '🔒 Oferta privada — verificar disponibilidad en canal'
    ],
    notes: [
      'Oferta privada Flash 4P Prime. Incompatible con BTS.',
      'Verificar disponibilidad en canal comercial.'
    ],
    source: 'Vodafone AACC Septiembre 2026 - Ofertas Flash'
  },
  {
    id: 'vdf-flash-4p-600m-2x160gb-netflix',
    operatorId: 'vodafone',
    category: 'fibra_movil_streaming',
    name: 'Flash 4P: Fibra 600M + 2x160GB + TV + Netflix',
    fiber: '600Mb',
    mobileLines: 2,
    mobileData: '2x 160GB 5G',
    tvIncluded: true,
    streamingIncluded: ['Netflix'],
    priceKind: 'final',
    monthlyPrice: 56,
    commercialStatus: 'RESTRICTED_CHANNEL',
    sourceType: 'OFFICIAL_TABLE',
    tags: ['Flash', 'Oferta Privada', '600M', 'Netflix', 'Incompatible BTS'],
    highlights: [
      'Fibra 600Mbps + 2x160GB + TV + Netflix a 56€/mes',
      'Incompatible con campaña BTS',
      '🔒 Oferta privada — verificar disponibilidad en canal'
    ],
    notes: [
      'Oferta privada Flash 4P Netflix. Incompatible con BTS.',
      'Verificar disponibilidad en canal comercial.'
    ],
    source: 'Vodafone AACC Septiembre 2026 - Ofertas Flash'
  },
  {
    id: 'vdf-flash-4p-600m-2x160gb-hbo',
    operatorId: 'vodafone',
    category: 'fibra_movil_streaming',
    name: 'Flash 4P: Fibra 600M + 2x160GB + TV + HBO Max',
    fiber: '600Mb',
    mobileLines: 2,
    mobileData: '2x 160GB 5G',
    tvIncluded: true,
    streamingIncluded: ['HBO Max'],
    priceKind: 'final',
    monthlyPrice: 53,
    commercialStatus: 'RESTRICTED_CHANNEL',
    sourceType: 'OFFICIAL_TABLE',
    tags: ['Flash', 'Oferta Privada', '600M', 'HBO Max', 'Incompatible BTS'],
    highlights: [
      'Fibra 600Mbps + 2x160GB + TV + HBO Max a 53€/mes',
      'Incompatible con campaña BTS',
      '🔒 Oferta privada — verificar disponibilidad en canal'
    ],
    notes: [
      'Oferta privada Flash 4P HBO Max. Incompatible con BTS.',
      'Verificar disponibilidad en canal comercial.'
    ],
    source: 'Vodafone AACC Septiembre 2026 - Ofertas Flash'
  },
  {
    id: 'vdf-flash-4p-600m-2x160gb-disney',
    operatorId: 'vodafone',
    category: 'fibra_movil_streaming',
    name: 'Flash 4P: Fibra 600M + 2x160GB + TV + Disney+',
    fiber: '600Mb',
    mobileLines: 2,
    mobileData: '2x 160GB 5G',
    tvIncluded: true,
    streamingIncluded: ['Disney+'],
    priceKind: 'final',
    monthlyPrice: 53,
    commercialStatus: 'RESTRICTED_CHANNEL',
    sourceType: 'OFFICIAL_TABLE',
    tags: ['Flash', 'Oferta Privada', '600M', 'Disney+', 'Incompatible BTS'],
    highlights: [
      'Fibra 600Mbps + 2x160GB + TV + Disney+ a 53€/mes',
      'Incompatible con campaña BTS',
      '🔒 Oferta privada — verificar disponibilidad en canal'
    ],
    notes: [
      'Oferta privada Flash 4P Disney+. Incompatible con BTS.',
      'Verificar disponibilidad en canal comercial.'
    ],
    source: 'Vodafone AACC Septiembre 2026 - Ofertas Flash'
  },

  // --- 8. OFERTAS INFORMATIVAS RETENCIÓN NIVEL 3 (RESTRICTED_CHANNEL, NO COTIZABLES) ---
  {
    id: 'vdf-retencion-anti-digi',
    operatorId: 'vodafone',
    category: 'fibra_movil',
    name: 'Oferta Especial Retención Anti-Digi (Nivel 3)',
    priceKind: 'segmented_discount',
    commercialStatus: 'RESTRICTED_CHANNEL',
    sourceType: 'INTERNAL_COMMERCIAL_INFORMATION',
    tags: ['Retención', 'Nivel 3', 'Anti-Digi', 'Oferta Privada'],
    highlights: [
      'Oferta privada de retención Nivel 3',
      'Descuento segmentado según cartera',
      'Consultar condiciones exactas en canal de fidelización'
    ],
    notes: [
      'Oferta informativa de retención/fidelización Nivel 3.',
      'No cotizable automáticamente.'
    ],
    source: 'Canal Retención / Fidelización Nivel 3'
  },
  {
    id: 'vdf-retencion-dto-30',
    operatorId: 'vodafone',
    category: 'fibra_movil',
    name: 'Oferta Especial Descuento 30% (Nivel 3)',
    priceKind: 'segmented_discount',
    commercialStatus: 'RESTRICTED_CHANNEL',
    sourceType: 'INTERNAL_COMMERCIAL_INFORMATION',
    tags: ['Retención', 'Nivel 3', 'Descuento 30%', 'Oferta Privada'],
    highlights: [
      'Oferta privada de retención Nivel 3',
      'Descuento 30% segmentado en factura',
      'Consultar condiciones exactas en canal de fidelización'
    ],
    notes: [
      'Oferta informativa de retención/fidelización Nivel 3.',
      'No cotizable automáticamente.'
    ],
    source: 'Canal Retención / Fidelización Nivel 3'
  },
  {
    id: 'vdf-retencion-dto-40',
    operatorId: 'vodafone',
    category: 'fibra_movil',
    name: 'Oferta Especial Descuento 40% (Nivel 3)',
    priceKind: 'segmented_discount',
    commercialStatus: 'RESTRICTED_CHANNEL',
    sourceType: 'INTERNAL_COMMERCIAL_INFORMATION',
    tags: ['Retención', 'Nivel 3', 'Descuento 40%', 'Oferta Privada'],
    highlights: [
      'Oferta privada de retención Nivel 3',
      'Descuento 40% segmentado en factura',
      'Consultar condiciones exactas en canal de fidelización'
    ],
    notes: [
      'Oferta informativa de retención/fidelización Nivel 3.',
      'No cotizable automáticamente.'
    ],
    source: 'Canal Retención / Fidelización Nivel 3'
  },

  // --- 9. INTERNET PORTÁTIL + MÓVIL (Pág. Resumen Portátil) ---
  {
    id: 'vdf-portatil-movil-60gb',
    operatorId: 'vodafone',
    category: 'fibra_movil',
    name: 'Internet Portátil hasta 1Gbps + Móvil 60GB 5G',
    mobileLines: 1,
    mobileData: '60GB 5G',
    priceKind: 'final',
    monthlyPrice: 43,
    commercialStatus: 'CONFIRMED',
    sourceType: 'OFFICIAL_TABLE',
    tags: ['Internet Portátil', 'Móvil 60GB', '43€'],
    highlights: [
      'Internet Portátil hasta 1Gbps sin cables',
      '1 línea móvil 60GB 5G',
      '43€/mes PVP final'
    ],
    notes: ['Paquete Internet Portátil + móvil 60GB.'],
    source: 'Vodafone AACC Septiembre 2026 - Resumen Portátil + Móvil'
  },
  {
    id: 'vdf-portatil-movil-160gb',
    operatorId: 'vodafone',
    category: 'fibra_movil',
    name: 'Internet Portátil hasta 1Gbps + Móvil 160GB 5G',
    mobileLines: 1,
    mobileData: '160GB 5G',
    priceKind: 'final',
    monthlyPrice: 48,
    commercialStatus: 'CONFIRMED',
    sourceType: 'OFFICIAL_TABLE',
    tags: ['Internet Portátil', 'Móvil 160GB', '48€'],
    highlights: [
      'Internet Portátil hasta 1Gbps sin cables',
      '1 línea móvil 160GB 5G',
      '48€/mes PVP final'
    ],
    notes: ['Paquete Internet Portátil + móvil 160GB.'],
    source: 'Vodafone AACC Septiembre 2026 - Resumen Portátil + Móvil'
  },
  {
    id: 'vdf-portatil-movil-ilim',
    operatorId: 'vodafone',
    category: 'fibra_movil',
    name: 'Internet Portátil hasta 1Gbps + Móvil Ilimitada 5G',
    mobileLines: 1,
    mobileData: 'Ilimitada 5G',
    priceKind: 'final',
    monthlyPrice: 53,
    commercialStatus: 'CONFIRMED',
    sourceType: 'OFFICIAL_TABLE',
    tags: ['Internet Portátil', 'Móvil Ilimitada', '53€'],
    highlights: [
      'Internet Portátil hasta 1Gbps sin cables',
      '1 línea móvil Ilimitada 5G',
      '53€/mes PVP final'
    ],
    notes: ['Paquete Internet Portátil + móvil Ilimitada.'],
    source: 'Vodafone AACC Septiembre 2026 - Resumen Portátil + Móvil'
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
  // --- 1. Fibra + Móvil 600Mb (Multilínea y Monolínea) ---
  {
    id: 'lowi-fibra600-multilinea-25gb',
    operatorId: 'lowi',
    category: 'fibra_movil',
    name: 'Fibra 600Mb + Multilínea 25GB + 25GB',
    fiber: '600Mb',
    mobileLines: 2,
    mobileData: '25GB + 25GB (2 líneas 5G, llamadas ilimitadas)',
    priceKind: 'final',
    monthlyPrice: 30,
    segment: 'Multilínea (2 líneas)',
    tags: ['Fibra 600', 'Multilínea', '2 líneas', '25GB+25GB'],
    highlights: ['Fibra 600Mb Simétrica', '2 líneas móviles incluidas (25GB cada una)', 'Llamadas ilimitadas 5G'],
    notes: ['Pack multilínea base con 2 líneas móviles independientes.'],
    source: 'Lowi Tarifario Oficial 2026'
  },
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
    source: 'Lowi Tarifario Oficial 2026'
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
    source: 'Lowi Tarifario Oficial 2026'
  },
  {
    id: 'lowi-fibra600-150gb',
    operatorId: 'lowi',
    category: 'fibra_movil',
    name: 'Fibra 600Mb + Móvil 150GB',
    fiber: '600Mb',
    mobileLines: 1,
    mobileData: '150GB 5G, llamadas ilimitadas',
    priceKind: 'final',
    monthlyPrice: 35,
    tags: ['Fibra 600', '1 línea', '150GB'],
    highlights: ['Fibra 600Mb Simétrica', 'Móvil 150GB 5G', 'Gigas acumulables'],
    source: 'Lowi Tarifario Oficial 2026'
  },
  {
    id: 'lowi-fibra600-300gb',
    operatorId: 'lowi',
    category: 'fibra_movil',
    name: 'Fibra 600Mb + Móvil 300GB',
    fiber: '600Mb',
    mobileLines: 1,
    mobileData: '300GB 5G, llamadas ilimitadas',
    priceKind: 'final',
    monthlyPrice: 37,
    tags: ['Fibra 600', '1 línea', '300GB'],
    highlights: ['Fibra 600Mb Simétrica', 'Móvil 300GB 5G', 'Gigas acumulables'],
    source: 'Lowi Tarifario Oficial 2026'
  },

  // --- 2. Fibra + Móvil 1Gb (Multilínea y Monolínea) ---
  {
    id: 'lowi-fibra1gb-multilinea-25gb',
    operatorId: 'lowi',
    category: 'fibra_movil',
    name: 'Fibra 1Gb + Multilínea 25GB + 25GB',
    fiber: '1Gb',
    mobileLines: 2,
    mobileData: '25GB + 25GB (2 líneas 5G, llamadas ilimitadas)',
    priceKind: 'final',
    monthlyPrice: 33,
    segment: 'Multilínea (2 líneas)',
    tags: ['Fibra 1Gb', 'Multilínea', '2 líneas', '25GB+25GB'],
    highlights: ['Fibra 1Gbps Simétrica', '2 líneas móviles incluidas (25GB cada una)', 'WiFi 6 incluido'],
    notes: ['Máxima velocidad simétrica con 2 líneas móviles independientes.'],
    source: 'Lowi Tarifario Oficial 2026'
  },
  {
    id: 'lowi-fibra1gb-50gb',
    operatorId: 'lowi',
    category: 'fibra_movil',
    name: 'Fibra 1Gb + Móvil 50GB',
    fiber: '1Gb',
    mobileLines: 1,
    mobileData: '50GB 5G, llamadas ilimitadas',
    priceKind: 'final',
    monthlyPrice: 33,
    tags: ['Fibra 1Gb', '1 línea', '50GB'],
    highlights: ['Fibra 1Gbps Simétrica', 'Móvil 50GB 5G', 'WiFi 6 incluido'],
    source: 'Lowi Tarifario Oficial 2026'
  },
  {
    id: 'lowi-fibra1gb-100gb',
    operatorId: 'lowi',
    category: 'fibra_movil',
    name: 'Fibra 1Gb + Móvil 100GB',
    fiber: '1Gb',
    mobileLines: 1,
    mobileData: '100GB 5G, llamadas ilimitadas',
    priceKind: 'final',
    monthlyPrice: 36,
    tags: ['Fibra 1Gb', '1 línea', '100GB'],
    highlights: ['Fibra 1Gbps Simétrica', 'Móvil 100GB 5G', 'WiFi 6 incluido'],
    source: 'Lowi Tarifario Oficial 2026'
  },
  {
    id: 'lowi-fibra1gb-150gb',
    operatorId: 'lowi',
    category: 'fibra_movil',
    name: 'Fibra 1Gb + Móvil 150GB',
    fiber: '1Gb',
    mobileLines: 1,
    mobileData: '150GB 5G, llamadas ilimitadas',
    priceKind: 'final',
    monthlyPrice: 38,
    tags: ['Fibra 1Gb', '1 línea', '150GB'],
    highlights: ['Fibra 1Gbps Simétrica', 'Móvil 150GB 5G', 'WiFi 6 incluido'],
    source: 'Lowi Tarifario Oficial 2026'
  },
  {
    id: 'lowi-fibra1gb-300gb',
    operatorId: 'lowi',
    category: 'fibra_movil',
    name: 'Fibra 1Gb + Móvil 300GB',
    fiber: '1Gb',
    mobileLines: 1,
    mobileData: '300GB 5G, llamadas ilimitadas',
    priceKind: 'final',
    monthlyPrice: 40,
    tags: ['Fibra 1Gb', '1 línea', '300GB'],
    highlights: ['Fibra 1Gbps Simétrica', 'Móvil 300GB 5G', 'WiFi 6 incluido'],
    source: 'Lowi Tarifario Oficial 2026'
  },

  // --- 3. Fibra y Móvil con Lowi TV (Packs cerrados) ---
  {
    id: 'lowi-pack-tv-fibra600-40gb',
    operatorId: 'lowi',
    category: 'fibra_tv',
    name: 'Fibra 600Mb + Móvil 40GB + Lowi TV',
    fiber: '600Mb',
    mobileLines: 1,
    mobileData: '40GB 5G, llamadas ilimitadas',
    tvIncluded: true,
    tvPackage: 'Lowi TV (Deco + 100 canales)',
    priceKind: 'final',
    monthlyPrice: 33,
    tags: ['Fibra 600', 'Lowi TV', 'Deco incluido', '40GB'],
    highlights: ['Fibra 600Mb', 'Móvil 40GB 5G', 'Lowi TV con Decodificador incluido'],
    notes: ['Pack cerrado convergente con TV y decodificador incluido en la cuota.'],
    source: 'Lowi Tarifario Oficial 2026'
  },
  {
    id: 'lowi-pack-tv-fibra1gb-40gb',
    operatorId: 'lowi',
    category: 'fibra_tv',
    name: 'Fibra 1Gbps + Móvil 40GB + Lowi TV',
    fiber: '1Gb',
    mobileLines: 1,
    mobileData: '40GB 5G, llamadas ilimitadas',
    tvIncluded: true,
    tvPackage: 'Lowi TV (Deco + 100 canales)',
    priceKind: 'final',
    monthlyPrice: 36,
    tags: ['Fibra 1Gb', 'Lowi TV', 'Deco incluido', '40GB'],
    highlights: ['Fibra 1Gbps Simétrica', 'Móvil 40GB 5G', 'Lowi TV con Decodificador incluido'],
    notes: ['Pack cerrado convergente 1Gbps con TV y decodificador incluido.'],
    source: 'Lowi Tarifario Oficial 2026'
  },

  // --- 4. Solo Móvil 5G (Llamadas ilimitadas) ---
  {
    id: 'lowi-solomovil-50gb',
    operatorId: 'lowi',
    category: 'solo_movil',
    name: 'Solo Móvil 50GB',
    mobileLines: 1,
    mobileData: '50GB 5G',
    priceKind: 'final',
    monthlyPrice: 8,
    tags: ['Solo Móvil', '50GB', '5G', 'Sin permanencia'],
    highlights: ['Móvil 50GB 5G', 'Llamadas ilimitadas a fijos y móviles', 'Acumula gigas'],
    source: 'Lowi Tarifario Oficial 2026'
  },
  {
    id: 'lowi-solomovil-100gb',
    operatorId: 'lowi',
    category: 'solo_movil',
    name: 'Solo Móvil 100GB',
    mobileLines: 1,
    mobileData: '100GB 5G',
    priceKind: 'final',
    monthlyPrice: 10,
    tags: ['Solo Móvil', '100GB', '5G', 'Sin permanencia'],
    highlights: ['Móvil 100GB 5G', 'Llamadas ilimitadas a fijos y móviles', 'Acumula gigas'],
    source: 'Lowi Tarifario Oficial 2026'
  },
  {
    id: 'lowi-solomovil-150gb',
    operatorId: 'lowi',
    category: 'solo_movil',
    name: 'Solo Móvil 150GB',
    mobileLines: 1,
    mobileData: '150GB 5G',
    priceKind: 'final',
    monthlyPrice: 15,
    tags: ['Solo Móvil', '150GB', '5G', 'Sin permanencia'],
    highlights: ['Móvil 150GB 5G', 'Llamadas ilimitadas a fijos y móviles', 'Acumula gigas'],
    source: 'Lowi Tarifario Oficial 2026'
  },
  {
    id: 'lowi-solomovil-300gb',
    operatorId: 'lowi',
    category: 'solo_movil',
    name: 'Solo Móvil 300GB',
    mobileLines: 1,
    mobileData: '300GB 5G',
    priceKind: 'final',
    monthlyPrice: 20,
    tags: ['Solo Móvil', '300GB', '5G', 'Sin permanencia'],
    highlights: ['Móvil 300GB 5G', 'Llamadas ilimitadas a fijos y móviles', 'Acumula gigas'],
    source: 'Lowi Tarifario Oficial 2026'
  },

  // --- 5. Solo Fibra ---
  {
    id: 'lowi-solofibra-600mb',
    operatorId: 'lowi',
    category: 'solo_fibra',
    name: 'Solo Fibra 600Mb',
    fiber: '600Mb',
    priceKind: 'final',
    monthlyPrice: 27,
    tags: ['Solo Fibra', '600Mb', 'WiFi 6'],
    highlights: ['Fibra 600Mb Simétrica', 'Router WiFi 6 incluido', 'Instalación gratis'],
    source: 'Lowi Tarifario Oficial 2026'
  },
  {
    id: 'lowi-solofibra-1gb',
    operatorId: 'lowi',
    category: 'solo_fibra',
    name: 'Solo Fibra 1Gbps',
    fiber: '1Gb',
    priceKind: 'final',
    monthlyPrice: 31,
    tags: ['Solo Fibra', '1Gb', 'WiFi 6'],
    highlights: ['Fibra 1Gbps Simétrica', 'Router WiFi 6 incluido', 'Instalación gratis'],
    source: 'Lowi Tarifario Oficial 2026'
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

  // ===================== VODAFONE SVA, TV & DAZN SEPTIEMBRE 2026 =====================
  // --- Líneas Móviles Adicionales (Pág. 7 & 31) ---
  {
    id: 'vdf-addon-linea-convergente',
    operatorId: 'vodafone',
    name: 'Línea adicional convergente (+6€/mes)',
    category: 'mobile_line',
    monthlyPrice: 6,
    commercialStatus: 'CONFIRMED',
    sourceType: 'OFFICIAL_TABLE',
    description: 'Línea adicional con los mismos gigas del paquete principal (60GB / 160GB / Ilimitada).',
    tags: ['Vodafone', 'Línea Adicional', '6€', 'Convergente'],
    source: 'Vodafone AACC Septiembre 2026 - Pág. 7'
  },
  {
    id: 'vdf-addon-linea-basica',
    operatorId: 'vodafone',
    name: 'Línea adicional básica 10GB (+2€/mes)',
    category: 'mobile_line',
    monthlyPrice: 2,
    commercialStatus: 'CONFIRMED',
    sourceType: 'OFFICIAL_TABLE',
    description: 'Línea adicional básica: 10GB a máxima velocidad 5G y 50 minutos en llamadas.',
    tags: ['Vodafone', 'Línea Adicional', '2€', '10GB'],
    source: 'Vodafone AACC Septiembre 2026 - Pág. 7'
  },
  {
    id: 'vdf-addon-linea-negocio-60gb',
    operatorId: 'vodafone',
    name: 'Línea adicional Negocios 60GB (+4,96€/mes)',
    category: 'mobile_line',
    monthlyPrice: 4.96,
    commercialStatus: 'CONFIRMED',
    sourceType: 'OFFICIAL_TABLE',
    description: 'Línea adicional para autónomos y negocios con 60GB 5G y llamadas ilimitadas.',
    tags: ['Vodafone', 'Empresa', 'Línea 60GB'],
    source: 'Vodafone AACC Septiembre 2026 - Pág. 31'
  },

  // --- Seguridad Digital & Secure Net (Pág. 6) ---
  {
    id: 'vdf-addon-secure-net',
    operatorId: 'vodafone',
    name: 'Vodafone Secure Net (Fijo y Móvil)',
    category: 'security',
    monthlyPrice: 1,
    promoPrice: 0,
    promoMonths: 3,
    regularPrice: 1,
    commercialStatus: 'CONFIRMED',
    sourceType: 'OFFICIAL_TABLE',
    description: 'Protección antivirus y antifraude para fijos y móviles. Gratis meses 1-3, luego 1€/mes.',
    tags: ['Vodafone', 'Seguridad', 'Secure Net', '1€'],
    source: 'Vodafone AACC Septiembre 2026 - Pág. 6'
  },

  // --- Decodificadores Vodafone TV (Regla 10: 3€ / 4€, gratis en BTS) ---
  {
    id: 'vdf-addon-deco-3',
    operatorId: 'vodafone',
    name: 'Decodificador Vodafone TV 4K (Cuota 3€)',
    category: 'installation',
    monthlyPrice: 3,
    promoPrice: 0,
    commercialStatus: 'CONFIRMED',
    sourceType: 'INTERNAL_COMMERCIAL_INFORMATION',
    description: 'Decodificador 4K con control del directo y grabación. Cuota interna 3€/mes (0€ en BTS).',
    tags: ['Vodafone', 'Deco 3€', 'Hardware'],
    source: 'Vodafone AACC Septiembre 2026 - Regla 10'
  },
  {
    id: 'vdf-addon-deco-4',
    operatorId: 'vodafone',
    name: 'Decodificador Vodafone TV Premium (Cuota 4€)',
    category: 'installation',
    monthlyPrice: 4,
    promoPrice: 0,
    commercialStatus: 'CONFIRMED',
    sourceType: 'INTERNAL_COMMERCIAL_INFORMATION',
    description: 'Decodificador 4K avanzado. Cuota interna 4€/mes (0€ en BTS).',
    tags: ['Vodafone', 'Deco 4€', 'Hardware'],
    source: 'Vodafone AACC Septiembre 2026 - Regla 10'
  },

  // --- Vodafone TV y Streaming / OTTs (Pág. 6 & 9) ---
  {
    id: 'vdf-addon-tv-sola',
    operatorId: 'vodafone',
    name: 'Vodafone TV básica (sin OTTs)',
    category: 'tv',
    monthlyPrice: 5,
    commercialStatus: 'CONFIRMED',
    sourceType: 'OFFICIAL_TABLE',
    description: 'Vodafone TV con más de 100 canales (5€/mes + decodificador si corresponde).',
    tags: ['Vodafone', 'TV Sola', '5€'],
    source: 'Vodafone AACC Septiembre 2026 - Pág. 6 y 9'
  },
  {
    id: 'vdf-addon-prime',
    operatorId: 'vodafone',
    name: 'Vodafone TV + Amazon Prime',
    category: 'streaming',
    monthlyPrice: 9,
    promoPrice: 0,
    regularPrice: 9,
    commercialStatus: 'CONFIRMED',
    sourceType: 'OFFICIAL_TABLE',
    description: 'Vodafone TV + Prime con anuncios. Gratis hasta 2027 en campaña BTS, luego 9€/mes.',
    tags: ['Vodafone', 'Prime', 'BTS Elegible', 'TV incluida'],
    source: 'Vodafone AACC Septiembre 2026 - Pág. 6'
  },
  {
    id: 'vdf-addon-disney',
    operatorId: 'vodafone',
    name: 'Vodafone TV + Disney+ (con anuncios)',
    category: 'streaming',
    monthlyPrice: 11,
    promoPrice: 0,
    regularPrice: 11,
    commercialStatus: 'CONFIRMED',
    sourceType: 'OFFICIAL_TABLE',
    description: 'Vodafone TV + Disney+ con anuncios. Gratis hasta 2027 en campaña BTS, luego 11€/mes.',
    tags: ['Vodafone', 'Disney+', 'BTS Elegible', 'TV incluida', '11€'],
    source: 'Vodafone AACC Septiembre 2026 - Pág. 6 y 9'
  },
  {
    id: 'vdf-addon-hbo',
    operatorId: 'vodafone',
    name: 'Vodafone TV + HBO Max (con anuncios)',
    category: 'streaming',
    monthlyPrice: 11,
    promoPrice: 0,
    regularPrice: 11,
    commercialStatus: 'CONFIRMED',
    sourceType: 'OFFICIAL_TABLE',
    description: 'Vodafone TV + HBO Max con anuncios. Gratis hasta 2027 en campaña BTS, luego 11€/mes.',
    tags: ['Vodafone', 'HBO Max', 'BTS Elegible', 'TV incluida', '11€'],
    source: 'Vodafone AACC Septiembre 2026 - Pág. 6 y 9'
  },
  {
    id: 'vdf-addon-netflix-standalone',
    operatorId: 'vodafone',
    name: 'Vodafone TV + Netflix sola (Única plataforma)',
    category: 'streaming',
    monthlyPrice: 13.99,
    promoPrice: 0,
    regularPrice: 13.99,
    commercialStatus: 'CONFIRMED',
    sourceType: 'OFFICIAL_TABLE',
    description: 'Netflix con Vodafone TV incluida (13,99€/mes). Gratis hasta 2027 en campaña BTS.',
    tags: ['Vodafone', 'Netflix', 'BTS Elegible', '13.99€', 'TV incluida'],
    source: 'Vodafone AACC Septiembre 2026 - Pág. 9'
  },
  {
    id: 'vdf-addon-netflix-added',
    operatorId: 'vodafone',
    name: 'Netflix añadida a otro pack TV (+8,99€/mes)',
    category: 'streaming',
    monthlyPrice: 8.99,
    commercialStatus: 'CONFIRMED',
    sourceType: 'OFFICIAL_TABLE',
    description: 'Netflix contratado sobre un pack TV existente por solo +8,99€/mes sin duplicar TV.',
    tags: ['Vodafone', 'Netflix Añadida', '8.99€'],
    source: 'Vodafone AACC Septiembre 2026 - Pág. 9'
  },

  // --- Addons Confirmados TV y Especializados ---
  {
    id: 'vdf-addon-pack-deportes',
    operatorId: 'vodafone',
    name: 'Pack Deportes (Eurosport 1 y 2, LaLiga Hypermotion)',
    category: 'tv',
    monthlyPrice: 6,
    commercialStatus: 'CONFIRMED',
    sourceType: 'OFFICIAL_TABLE',
    description: 'Eurosport 1, Eurosport 2, LaLiga Hypermotion y canales multideporte.',
    tags: ['Vodafone', 'TV', 'Deportes', '6€'],
    source: 'Vodafone AACC Septiembre 2026 - Pág. 9'
  },
  {
    id: 'vdf-addon-tv-filmin',
    operatorId: 'vodafone',
    name: 'Vodafone TV + Filmin',
    category: 'streaming',
    monthlyPrice: 10,
    commercialStatus: 'CONFIRMED',
    sourceType: 'OFFICIAL_TABLE',
    description: 'Vodafone TV con más de 100 canales + suscripción a Filmin incluida.',
    tags: ['Vodafone', 'TV', 'Filmin', 'Cine', '10€'],
    source: 'Vodafone AACC Septiembre 2026 - Pág. 9'
  },
  {
    id: 'vdf-addon-pack-documentales',
    operatorId: 'vodafone',
    name: 'Pack Documentales',
    category: 'tv',
    monthlyPrice: 8,
    commercialStatus: 'CONFIRMED',
    sourceType: 'OFFICIAL_TABLE',
    description: 'Canales especializados: National Geographic, Odisea, Historia, Discovery Channel.',
    tags: ['Vodafone', 'TV', 'Documentales', '8€'],
    source: 'Vodafone AACC Septiembre 2026 - Pág. 9'
  },
  {
    id: 'vdf-addon-amc',
    operatorId: 'vodafone',
    name: 'AMC SELEKT',
    category: 'tv',
    monthlyPrice: 4.99,
    commercialStatus: 'CONFIRMED',
    sourceType: 'OFFICIAL_TABLE',
    description: '14 canales temáticos AMC SELEKT (cine, series, factual y entretenimiento).',
    tags: ['Vodafone', 'TV', 'AMC', '4.99€'],
    source: 'Vodafone AACC Septiembre 2026 - Pág. 9'
  },
  {
    id: 'vdf-addon-mas-series',
    operatorId: 'vodafone',
    name: 'Pack Más Series',
    category: 'tv',
    monthlyPrice: 6,
    commercialStatus: 'CONFIRMED',
    sourceType: 'OFFICIAL_TABLE',
    description: 'Canales de series internacionales y estrenos exclusivos.',
    tags: ['Vodafone', 'TV', 'Series', '6€'],
    source: 'Vodafone AACC Septiembre 2026 - Pág. 9'
  },
  {
    id: 'vdf-addon-premium-familiar',
    operatorId: 'vodafone',
    name: 'Vodafone TV Premium Familiar',
    category: 'tv',
    monthlyPrice: 9.99,
    commercialStatus: 'CONFIRMED',
    sourceType: 'OFFICIAL_TABLE',
    description: 'Pack familiar completo con entretenimiento, infantiles, series y cine.',
    tags: ['Vodafone', 'TV', 'Familiar', '9.99€'],
    source: 'Vodafone AACC Septiembre 2026 - Pág. 9'
  },
  {
    id: 'vdf-addon-onetoro',
    operatorId: 'vodafone',
    name: 'OneToro TV',
    category: 'tv',
    monthlyPrice: 14.99,
    commercialStatus: 'CONFIRMED',
    sourceType: 'OFFICIAL_TABLE',
    description: 'Canal especializado taurino con las principales ferias en directo.',
    tags: ['Vodafone', 'TV', 'OneToro', '14.99€'],
    source: 'Vodafone AACC Septiembre 2026 - Pág. 9'
  },
  {
    id: 'vdf-addon-pack-caza',
    operatorId: 'vodafone',
    name: 'Pack Caza',
    category: 'tv',
    monthlyPrice: 7,
    commercialStatus: 'CONFIRMED',
    sourceType: 'OFFICIAL_TABLE',
    description: 'Canales Cazavisión e Iberalia TV para aficionados a la caza y pesca.',
    tags: ['Vodafone', 'TV', 'Caza', '7€'],
    source: 'Vodafone AACC Septiembre 2026 - Pág. 9'
  },
  {
    id: 'vdf-addon-pack-adulto',
    operatorId: 'vodafone',
    name: 'Pack Adulto',
    category: 'tv',
    monthlyPrice: 10,
    commercialStatus: 'CONFIRMED',
    sourceType: 'OFFICIAL_TABLE',
    description: 'Canales temáticos para adultos con control parental.',
    tags: ['Vodafone', 'TV', 'Adulto', '10€'],
    source: 'Vodafone AACC Septiembre 2026 - Pág. 9'
  },
  {
    id: 'vdf-addon-videoclub-rakuten',
    operatorId: 'vodafone',
    name: 'Videoclub by Rakuten TV (Informativo)',
    category: 'tv',
    monthlyPrice: 0,
    isInformative: true,
    commercialStatus: 'CONFIRMED',
    sourceType: 'OFFICIAL_TABLE',
    description: 'Sin cuota fija. Pago por alquiler o compra.',
    tags: ['Vodafone', 'TV', 'Rakuten', 'Videoclub', 'Informativo', 'No Seleccionable'],
    source: 'Vodafone AACC Septiembre 2026 - Pág. 9'
  },

  // --- Addons Autogestión (Plataformas Streaming desde App/Web Sin Promo) ---
  {
    id: 'vdf-addon-disney-sin-anuncios',
    operatorId: 'vodafone',
    name: 'Disney+ Estándar (Sin Anuncios)',
    category: 'streaming',
    monthlyPrice: 15,
    isInformative: true,
    commercialStatus: 'CONFIRMED',
    sourceType: 'OFFICIAL_TABLE',
    description: 'Suscripción directa Disney+ Estándar sin interrupciones publicitarias (15€/mes). Autogestión.',
    tags: ['Vodafone', 'Disney+', 'Sin Anuncios', 'Autogestión', '15€', 'No Seleccionable'],
    source: 'Vodafone AACC Septiembre 2026 - Pág. 9'
  },
  {
    id: 'vdf-addon-disney-premium',
    operatorId: 'vodafone',
    name: 'Disney+ Premium 4K UHD',
    category: 'streaming',
    monthlyPrice: 20,
    isInformative: true,
    commercialStatus: 'CONFIRMED',
    sourceType: 'OFFICIAL_TABLE',
    description: 'Suscripción Disney+ Premium con calidad 4K UHD, Dolby Atmos y 4 pantallas (20€/mes). Autogestión.',
    tags: ['Vodafone', 'Disney+', 'Premium 4K', 'Autogestión', '20€', 'No Seleccionable'],
    source: 'Vodafone AACC Septiembre 2026 - Pág. 9'
  },
  {
    id: 'vdf-addon-hbo-sin-anuncios',
    operatorId: 'vodafone',
    name: 'Max / HBO Max Estándar (Sin Anuncios)',
    category: 'streaming',
    monthlyPrice: 15,
    isInformative: true,
    commercialStatus: 'CONFIRMED',
    sourceType: 'OFFICIAL_TABLE',
    description: 'Suscripción directa Max Estándar sin anuncios publicitarios (15€/mes). Autogestión.',
    tags: ['Vodafone', 'HBO Max', 'Sin Anuncios', 'Autogestión', '15€', 'No Seleccionable'],
    source: 'Vodafone AACC Septiembre 2026 - Pág. 9'
  },
  {
    id: 'vdf-addon-netflix-estandar',
    operatorId: 'vodafone',
    name: 'Netflix Estándar (Sin Anuncios)',
    category: 'streaming',
    monthlyPrice: 14.99,
    isInformative: true,
    commercialStatus: 'CONFIRMED',
    sourceType: 'OFFICIAL_TABLE',
    description: 'Suscripción directa Netflix Estándar sin anuncios en 2 pantallas Full HD (14,99€/mes). Autogestión.',
    tags: ['Vodafone', 'Netflix', 'Estándar', 'Autogestión', '14.99€', 'No Seleccionable'],
    source: 'Vodafone AACC Septiembre 2026 - Pág. 9'
  },
  {
    id: 'vdf-addon-netflix-premium',
    operatorId: 'vodafone',
    name: 'Netflix Premium 4K UHD',
    category: 'streaming',
    monthlyPrice: 21.99,
    isInformative: true,
    commercialStatus: 'CONFIRMED',
    sourceType: 'OFFICIAL_TABLE',
    description: 'Suscripción directa Netflix Premium 4K UHD en 4 dispositivos simultáneos (21,99€/mes). Autogestión.',
    tags: ['Vodafone', 'Netflix', 'Premium 4K', 'Autogestión', '21.99€', 'No Seleccionable'],
    source: 'Vodafone AACC Septiembre 2026 - Pág. 9'
  },

  // --- DAZN Promociones (Pág. 11: Contratable sin Vodafone TV) ---
  {
    id: 'vdf-dazn-futbol-nuevo',
    operatorId: 'vodafone',
    name: 'DAZN Fútbol (Captación con Perma 12M)',
    category: 'football',
    monthlyPrice: 14.99,
    promoPrice: 14.99,
    promoMonths: 12,
    regularPrice: 19.99,
    commercialStatus: 'CONFIRMED',
    sourceType: 'PROMOTIONAL',
    description: 'LaLiga EA Sports, Premier League, Serie A y Bundesliga. Promo captación 14,99€/mes.',
    tags: ['Vodafone', 'DAZN', 'Fútbol', 'Cliente Nuevo', '14.99€'],
    source: 'Vodafone AACC Septiembre 2026 - Pág. 11'
  },
  {
    id: 'vdf-dazn-premium-nuevo',
    operatorId: 'vodafone',
    name: 'DAZN Total / Premium (Captación con Perma 12M)',
    category: 'football',
    monthlyPrice: 25.99,
    promoPrice: 25.99,
    promoMonths: 12,
    regularPrice: 31.99,
    commercialStatus: 'CONFIRMED',
    sourceType: 'PROMOTIONAL',
    description: 'Todo el fútbol + F1, MotoGP, NBA, NFL y Eurosport. Promo captación 25,99€/mes.',
    tags: ['Vodafone', 'DAZN', 'Premium', 'Cliente Nuevo', '25.99€'],
    source: 'Vodafone AACC Septiembre 2026 - Pág. 11'
  },
  // --- DAZN PVP Regular (Sin Promoción) ---
  {
    id: 'vdf-dazn-futbol-regular',
    operatorId: 'vodafone',
    name: 'DAZN Fútbol (PVP Regular)',
    category: 'football',
    monthlyPrice: 19.99,
    commercialStatus: 'CONFIRMED',
    sourceType: 'OFFICIAL_TABLE',
    description: 'LaLiga EA Sports, Premier League, Serie A y Bundesliga al PVP de catálogo (19,99€/mes).',
    tags: ['Vodafone', 'DAZN', 'Fútbol', 'PVP Regular', '19.99€'],
    source: 'Vodafone AACC Septiembre 2026 - Pág. 11'
  },
  {
    id: 'vdf-dazn-motor-regular',
    operatorId: 'vodafone',
    name: 'DAZN Motor (PVP Regular)',
    category: 'tv',
    monthlyPrice: 19.99,
    commercialStatus: 'CONFIRMED',
    sourceType: 'OFFICIAL_TABLE',
    description: 'Fórmula 1, MotoGP, Moto2, Moto3 y WorldSBK al PVP de catálogo (19,99€/mes).',
    tags: ['Vodafone', 'DAZN', 'Motor', 'PVP Regular', '19.99€'],
    source: 'Vodafone AACC Septiembre 2026 - Pág. 11'
  },
  {
    id: 'vdf-dazn-premium-regular',
    operatorId: 'vodafone',
    name: 'DAZN Pro / Premium (PVP Regular)',
    category: 'football',
    monthlyPrice: 31.99,
    commercialStatus: 'CONFIRMED',
    sourceType: 'OFFICIAL_TABLE',
    description: 'Todo el fútbol + F1, MotoGP, NBA, NFL y canales Eurosport al PVP de catálogo (31,99€/mes).',
    tags: ['Vodafone', 'DAZN', 'Premium', 'PVP Regular', '31.99€'],
    source: 'Vodafone AACC Septiembre 2026 - Pág. 11'
  },

  // --- DAZN Ofertas Cartera / NBA (EXTERNAL_PROJECT_SOURCE: Bloqueadas para propuesta automática) ---
  {
    id: 'vdf-dazn-futbol-cartera',
    operatorId: 'vodafone',
    name: 'DAZN Fútbol (Cartera 24M) [EXTERNO]',
    category: 'football',
    monthlyPrice: 9.99,
    promoPrice: 9.99,
    promoMonths: 24,
    regularPrice: 19.99,
    commercialStatus: 'EXTERNAL_PROJECT_SOURCE',
    sourceType: 'EXTERNAL_PROJECT_SOURCE',
    blockedReason: 'Origen de proyecto externo: DAZN Cartera no forma parte de la propuesta comercial estándar. Bloqueado para propuesta automática.',
    description: 'LaLiga EA Sports y fútbol internacional a 9,99€/mes durante 24 meses (Origen externo).',
    tags: ['Vodafone', 'DAZN', 'Fútbol', 'Cartera', 'Origen Externo', '⚠️ Bloqueado'],
    source: 'Vodafone Circular DAZN - Origen Externo'
  },
  {
    id: 'vdf-dazn-premium-cartera',
    operatorId: 'vodafone',
    name: 'DAZN Premium (Cartera 24M) [EXTERNO]',
    category: 'football',
    monthlyPrice: 11.99,
    promoPrice: 11.99,
    promoMonths: 24,
    regularPrice: 31.99,
    commercialStatus: 'EXTERNAL_PROJECT_SOURCE',
    sourceType: 'EXTERNAL_PROJECT_SOURCE',
    blockedReason: 'Origen de proyecto externo: DAZN Cartera no forma parte de la propuesta comercial estándar. Bloqueado para propuesta automática.',
    description: 'Todo el deporte: Fútbol + Motor F1/MotoGP a 11,99€/mes durante 24 meses (Origen externo).',
    tags: ['Vodafone', 'DAZN', 'Premium', 'Cartera', 'Origen Externo', '⚠️ Bloqueado'],
    source: 'Vodafone Circular DAZN - Origen Externo'
  },
  {
    id: 'vdf-dazn-futbol-nba',
    operatorId: 'vodafone',
    name: 'DAZN Fútbol (Oferta Exclusiva NBA) [EXTERNO]',
    category: 'football',
    monthlyPrice: 6.99,
    promoPrice: 6.99,
    promoMonths: 24,
    regularPrice: 19.99,
    commercialStatus: 'EXTERNAL_PROJECT_SOURCE',
    sourceType: 'EXTERNAL_PROJECT_SOURCE',
    blockedReason: 'Origen de proyecto externo: DAZN NBA no forma parte de la propuesta comercial estándar. Bloqueado para propuesta automática.',
    description: 'Oferta personalizada NBA: Fútbol a 6,99€/mes durante 24 meses (Origen externo).',
    tags: ['Vodafone', 'DAZN', 'Fútbol', 'NBA Exclusiva', 'Origen Externo', '⚠️ Bloqueado'],
    source: 'Vodafone Circular DAZN - Origen Externo'
  },
  {
    id: 'vdf-dazn-motor-nba',
    operatorId: 'vodafone',
    name: 'DAZN Motor (Oferta Exclusiva NBA) [EXTERNO]',
    category: 'tv',
    monthlyPrice: 6.99,
    promoPrice: 6.99,
    promoMonths: 24,
    regularPrice: 19.99,
    commercialStatus: 'EXTERNAL_PROJECT_SOURCE',
    sourceType: 'EXTERNAL_PROJECT_SOURCE',
    blockedReason: 'Origen de proyecto externo: DAZN NBA no forma parte de la propuesta comercial estándar. Bloqueado para propuesta automática.',
    description: 'Oferta personalizada NBA: Fórmula 1 y MotoGP a 6,99€/mes durante 24 meses (Origen externo).',
    tags: ['Vodafone', 'DAZN', 'Motor', 'NBA Exclusiva', 'Origen Externo', '⚠️ Bloqueado'],
    source: 'Vodafone Circular DAZN - Origen Externo'
  },

  // --- Addons Exclusivos B2B / Negocios (Precios Sin IVA) ---
  {
    id: 'vdf-b2b-addon-ott-tv',
    operatorId: 'vodafone',
    name: 'Vodafone TV + 1 OTT Selección B2B (Sin IVA)',
    category: 'tv',
    monthlyPrice: 7.43,
    commercialStatus: 'CONFIRMED',
    sourceType: 'OFFICIAL_TABLE',
    description: 'Vodafone TV con decodificador + 1 plataforma de streaming a elegir por 7,43€/mes sin IVA. Exclusivo autónomos y empresas.',
    tags: ['Vodafone', 'Empresa', 'B2B', 'TV', 'OTT', '7.43€'],
    notes: ['Precios profesionales sin IVA. No mostrar en residencial.'],
    source: 'Vodafone AACC Septiembre 2026 - Pág. 31'
  },
  {
    id: 'vdf-b2b-addon-linea-ilimitada',
    operatorId: 'vodafone',
    name: 'Línea Adicional Ilimitada B2B (Sin IVA)',
    category: 'mobile_line',
    monthlyPrice: 9.09,
    commercialStatus: 'CONFIRMED',
    sourceType: 'OFFICIAL_TABLE',
    description: 'Línea móvil adicional con llamadas y datos 5G ilimitados por 9,09€/mes sin IVA. Exclusivo autónomos y empresas.',
    tags: ['Vodafone', 'Empresa', 'B2B', 'Línea Ilimitada', '9.09€'],
    notes: ['Precios profesionales sin IVA. No mostrar en residencial.'],
    source: 'Vodafone AACC Septiembre 2026 - Pág. 31'
  },
  {
    id: 'vdf-b2b-addon-fibra-1gb',
    operatorId: 'vodafone',
    name: 'Fibra Secundaria 1Gbps B2B (Sin IVA)',
    category: 'business',
    monthlyPrice: 16.53,
    commercialStatus: 'CONFIRMED',
    sourceType: 'OFFICIAL_TABLE',
    description: 'Conexión de fibra secundaria 1Gbps para segunda sede o local por 16,53€/mes sin IVA.',
    tags: ['Vodafone', 'Empresa', 'B2B', 'Fibra 1Gb', '16.53€'],
    notes: ['Precios profesionales sin IVA. No mostrar en residencial.'],
    source: 'Vodafone AACC Septiembre 2026 - Pág. 31'
  },

  // --- CONFLICTOS DOCUMENTALES ABIERTOS (Regla 4: BLOQUEADOS PARA COMERCIALIZACIÓN) ---
  {
    id: 'vdf-conflict-prime-disney',
    operatorId: 'vodafone',
    name: '⚠️ Pack Prime + Disney+ [CONFLICTO DOCUMENTAL]',
    category: 'streaming',
    monthlyPrice: 14,
    commercialStatus: 'CONFLICTO_DOCUMENTAL',
    sourceType: 'DERIVED',
    calculationFormula: '5€ (Vodafone TV) + 4€ (Prime) + 5€ (Disney+) = 14€ vs 15€ referencia implícita en Slide 6',
    blockedReason: 'Prime + Disney+: 14€ vs referencia implícita 15€. Bloqueado para selección automática hasta confirmación comercial.',
    description: '⚠️ CONFLICTO DOCUMENTAL: 14€ vs 15€ referencia implícita. No utilizar en propuestas.',
    tags: ['⚠️ BLOQUEADO', 'Conflicto Documental', 'No Comercializable'],
    source: 'Vodafone AACC Septiembre 2026 - Pág. 6 y 9'
  },
  {
    id: 'vdf-conflict-prime-hbo-sin-anuncios',
    operatorId: 'vodafone',
    name: '⚠️ Prime + HBO sin anuncios [CONFLICTO DOCUMENTAL]',
    category: 'streaming',
    monthlyPrice: 19,
    commercialStatus: 'CONFLICTO_DOCUMENTAL',
    sourceType: 'DERIVED',
    calculationFormula: '15€ (Pack Prime + HBO base) + 4€ (upgrade sin anuncios HBO) = 19€ vs 20€ publicado en tabla comercial',
    blockedReason: 'Prime + HBO sin anuncios: 19€ calculado vs 20€ publicado. Bloqueado para selección automática.',
    description: '⚠️ CONFLICTO DOCUMENTAL: 19€ calculado vs 20€ publicado. Bloqueado.',
    tags: ['⚠️ BLOQUEADO', 'Conflicto Documental', 'No Comercializable'],
    source: 'Vodafone AACC Septiembre 2026 - Pág. 9'
  },
  {
    id: 'vdf-conflict-3otts-sin-anuncios',
    operatorId: 'vodafone',
    name: '⚠️ 3 OTT sin anuncios [CONFLICTO DOCUMENTAL]',
    category: 'streaming',
    monthlyPrice: 25,
    commercialStatus: 'CONFLICTO_DOCUMENTAL',
    sourceType: 'DERIVED',
    calculationFormula: '21€ (Pack 3 OTTs con anuncios) + 4€ (sin anuncios HBO) + 4€ (sin anuncios Disney) = 29€ teórico vs 25€ publicado',
    blockedReason: '3 OTT sin anuncios: 25€ publicado vs 29€ calculado teóricamente. Bloqueado.',
    description: '⚠️ CONFLICTO DOCUMENTAL: 25€ publicado vs 29€ teórico. Bloqueado.',
    tags: ['⚠️ BLOQUEADO', 'Conflicto Documental', 'No Comercializable'],
    source: 'Vodafone AACC Septiembre 2026 - Pág. 9'
  },

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
  // --- Líneas adicionales (Llamadas ilimitadas) ---
  { id: 'lowi-linea-adicional-10gb', operatorId: 'lowi', name: 'Línea adicional 10GB', category: 'mobile_line', monthlyPrice: 4, description: 'Línea móvil adicional con 10GB 5G y llamadas ilimitadas.', tags: ['Lowi', 'Línea adicional', '10GB'], source: 'Lowi Tarifario Oficial 2026' },
  { id: 'lowi-linea-adicional-50gb', operatorId: 'lowi', name: 'Línea adicional 50GB', category: 'mobile_line', monthlyPrice: 5, description: 'Línea móvil adicional con 50GB 5G y llamadas ilimitadas.', tags: ['Lowi', 'Línea adicional', '50GB'], source: 'Lowi Tarifario Oficial 2026' },
  { id: 'lowi-linea-adicional-100gb', operatorId: 'lowi', name: 'Línea adicional 100GB', category: 'mobile_line', monthlyPrice: 8, description: 'Línea móvil adicional con 100GB 5G y llamadas ilimitadas.', tags: ['Lowi', 'Línea adicional', '100GB'], source: 'Lowi Tarifario Oficial 2026' },
  { id: 'lowi-linea-adicional-150gb', operatorId: 'lowi', name: 'Línea adicional 150GB', category: 'mobile_line', monthlyPrice: 10, description: 'Línea móvil adicional con 150GB 5G y llamadas ilimitadas.', tags: ['Lowi', 'Línea adicional', '150GB'], source: 'Lowi Tarifario Oficial 2026' },
  { id: 'lowi-linea-adicional-300gb', operatorId: 'lowi', name: 'Línea adicional 300GB', category: 'mobile_line', monthlyPrice: 12, description: 'Línea móvil adicional con 300GB 5G y llamadas ilimitadas.', tags: ['Lowi', 'Línea adicional', '300GB'], source: 'Lowi Tarifario Oficial 2026' },

  // --- Televisión y Streaming ---
  { id: 'lowi-tv-basica', operatorId: 'lowi', name: 'Lowi TV', category: 'tv', monthlyPrice: 5, description: 'Decodificador incluido con más de 100 canales, cine, series y documentales.', tags: ['Lowi', 'TV', 'Deco'], source: 'Lowi Tarifario Oficial 2026' },
  { id: 'lowi-tv-deportes', operatorId: 'lowi', name: 'Pack Deportes', category: 'tv', monthlyPrice: 1, description: 'LaLiga Hypermotion, Eurosport 1 y 2 por solo 1€/mes más.', tags: ['Lowi', 'TV', 'Deportes'], source: 'Lowi Tarifario Oficial 2026' },
  { id: 'lowi-max', operatorId: 'lowi', name: 'HBO Max', category: 'streaming', monthlyPrice: 6, description: 'Suscripción de Max Plan Estándar por 6€/mes más.', tags: ['Lowi', 'Max', 'HBO'], source: 'Lowi Tarifario Oficial 2026' },
  { id: 'lowi-netflix', operatorId: 'lowi', name: 'Netflix', category: 'streaming', monthlyPrice: 8, description: 'Suscripción de Netflix Plan Estándar por 8€/mes más.', tags: ['Lowi', 'Netflix'], source: 'Lowi Tarifario Oficial 2026' },
  { id: 'lowi-disney', operatorId: 'lowi', name: 'Disney+', category: 'streaming', monthlyPrice: 3.99, description: 'Suscripción de Disney+ Plan Estándar por 3,99€/mes más.', tags: ['Lowi', 'Disney+'], source: 'Lowi Tarifario Oficial 2026' },
  { id: 'lowi-prime', operatorId: 'lowi', name: 'Amazon Prime', category: 'streaming', monthlyPrice: 4, description: 'Suscripción mensual de Amazon Prime integrada por 4€/mes más.', tags: ['Lowi', 'Prime'], source: 'Lowi Tarifario Oficial 2026' },

  // --- Gigas Extra & Promo Verano ---
  { id: 'lowi-promo-verano-300gb', operatorId: 'lowi', name: 'Promo Verano 300GB EXTRA', category: 'mobile_line', monthlyPrice: 0, description: '300GB EXTRA gratis este verano en tus líneas móviles Lowi.', tags: ['Lowi', 'Promo Verano', '300GB'], source: 'Lowi Tarifario Oficial 2026' },
  { id: 'lowi-gigas-extra-5gb', operatorId: 'lowi', name: '+5GB en cada línea', category: 'mobile_line', monthlyPrice: 0, description: 'Bono de 5GB adicionales en cada línea móvil.', tags: ['Lowi', 'Gigas Extra'], source: 'Lowi Tarifario Oficial 2026' },
  { id: 'lowi-gigas-extra-30gb', operatorId: 'lowi', name: '+30GB adicionales', category: 'mobile_line', monthlyPrice: 0, description: 'Bono de 30GB adicionales.', tags: ['Lowi', 'Gigas Extra'], source: 'Lowi Tarifario Oficial 2026' },
  { id: 'lowi-gigas-extra-40gb', operatorId: 'lowi', name: '+40GB adicionales', category: 'mobile_line', monthlyPrice: 0, description: 'Bono de 40GB adicionales.', tags: ['Lowi', 'Gigas Extra'], source: 'Lowi Tarifario Oficial 2026' },
  { id: 'lowi-gigas-extra-50gb', operatorId: 'lowi', name: '+50GB adicionales', category: 'mobile_line', monthlyPrice: 0, description: 'Bono de 50GB adicionales.', tags: ['Lowi', 'Gigas Extra'], source: 'Lowi Tarifario Oficial 2026' },
  { id: 'lowi-gigas-extra-100gb', operatorId: 'lowi', name: '+100GB adicionales', category: 'mobile_line', monthlyPrice: 0, description: 'Bono de 100GB adicionales.', tags: ['Lowi', 'Gigas Extra'], source: 'Lowi Tarifario Oficial 2026' },
  { id: 'lowi-setup', operatorId: 'lowi', name: 'Instalación y Router WiFi 6', category: 'installation', oneTimePrice: 0, description: 'Alta, instalación y cesión de router WiFi 6 gratis.', tags: ['Lowi', 'Setup'], source: 'Lowi Tarifario Oficial 2026' },

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
