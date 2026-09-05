/**
 * FUENTE DE VERDAD COMERCIAL CENTRALIZADA - VODAFONE SEPTIEMBRE 2026
 * 
 * Reglas absolutas:
 * 1. NO reinterpretar precios ni reglas.
 * 2. Trazabilidad completa con sourceType, status, sourcePage/sourceReference, calculationFormula.
 * 3. Estados no confirmados bloquean comercialización automática:
 *    - CONFLICT
 *    - UNCONFIRMED
 *    - PENDING_COMMERCIAL_VALIDATION
 *    - DERIVED_HYPOTHESIS_PENDING_VALIDATION
 *    - CONFLICTO_DOCUMENTAL
 */

export type CommercialStatus = 
  | 'CONFIRMED'
  | 'CONFLICT'
  | 'UNCONFIRMED'
  | 'PENDING_COMMERCIAL_VALIDATION'
  | 'DERIVED_HYPOTHESIS_PENDING_VALIDATION'
  | 'CONFLICTO_DOCUMENTAL'
  | 'INTERNAL_CONFIRMED'
  | 'DEPRECATED_INVALID'
  | 'BLOCKED_INCOMPATIBLE'
  | 'RESTRICTED_CHANNEL'
  | 'EXTERNAL_PROJECT_SOURCE';

export type SourceType = 
  | 'OFFICIAL_TABLE'
  | 'DERIVED'
  | 'PROMOTIONAL'
  | 'ADDON'
  | 'OFFICIAL_AACC_EXAMPLE'
  | 'INTERNAL_COMMERCIAL_INFORMATION'
  | 'EXTERNAL_PROJECT_SOURCE';

export interface CommercialPriceItem {
  id: string;
  name: string;
  price: number;
  currency: 'EUR';
  sourceType: SourceType;
  status: CommercialStatus;
  sourcePage: string;
  sourceReference: string;
  calculationFormula?: string;
  description?: string;
  notes?: string[];
  conflictDetails?: {
    publishedPrice?: number;
    calculatedPrice?: number;
    implicitReferencePrice?: number;
    discrepancyNote: string;
  };
}

/**
 * Función de guardia comercial:
 * Comprueba si un estado comercial es apto para propuesta oficial.
 * Bloquea estrictamente CONFLICT, UNCONFIRMED, PENDING_COMMERCIAL_VALIDATION, DEPRECATED_INVALID, EXTERNAL_PROJECT_SOURCE, etc.
 */
export function isCommerciallyValid(status: CommercialStatus): boolean {
  const BLOCKING_STATUSES: CommercialStatus[] = [
    'CONFLICT',
    'UNCONFIRMED',
    'PENDING_COMMERCIAL_VALIDATION',
    'DERIVED_HYPOTHESIS_PENDING_VALIDATION',
    'CONFLICTO_DOCUMENTAL',
    'DEPRECATED_INVALID',
    'BLOCKED_INCOMPATIBLE',
    'EXTERNAL_PROJECT_SOURCE'
  ];
  return !BLOCKING_STATUSES.includes(status);
}

// ============================================================================
// 1. 12 CONFIGURACIONES BASE OFICIALES
// ============================================================================
export interface VodafoneBaseConfig extends CommercialPriceItem {
  fiberSpeed: '600M' | '1G';
  mobileTier: '60GB' | '160GB' | 'ilimitada';
  linesCount: 1 | 2;
  btsMaxOtts: 1 | 2 | 3;
  tryAndPayEligible: boolean;
}

export const VODAFONE_BASE_CONFIGS: Record<string, VodafoneBaseConfig> = {
  // --- 60GB Tier ---
  'vdf-base-600m-1x60gb': {
    id: 'vdf-base-600m-1x60gb',
    name: 'Vodafone One 600M + 1x60GB',
    fiberSpeed: '600M',
    mobileTier: '60GB',
    linesCount: 1,
    btsMaxOtts: 1,
    tryAndPayEligible: false,
    price: 43,
    currency: 'EUR',
    sourceType: 'OFFICIAL_TABLE',
    status: 'CONFIRMED',
    sourcePage: 'AACC Septiembre 2026 - Pág. 6',
    sourceReference: 'Ejemplo mono/multi oferta habituales: La más económica',
    description: 'Fibra 600Mbps con 1 línea móvil 60GB 5G'
  },
  'vdf-base-600m-2x60gb': {
    id: 'vdf-base-600m-2x60gb',
    name: 'Vodafone One 600M + 2x60GB',
    fiberSpeed: '600M',
    mobileTier: '60GB',
    linesCount: 2,
    btsMaxOtts: 1,
    tryAndPayEligible: false,
    price: 49,
    currency: 'EUR',
    sourceType: 'DERIVED',
    status: 'CONFIRMED',
    sourcePage: 'AACC Septiembre 2026 - Pág. 6 & 7',
    sourceReference: 'Base 43€ + 6€ línea adicional igual a convergente',
    calculationFormula: '43€ (base 1L 600M 60GB) + 6€ (2ª línea convergente) = 49€',
    description: 'Fibra 600Mbps con 2 líneas móviles 60GB 5G'
  },
  'vdf-base-1g-1x60gb': {
    id: 'vdf-base-1g-1x60gb',
    name: 'Vodafone One 1G + 1x60GB',
    fiberSpeed: '1G',
    mobileTier: '60GB',
    linesCount: 1,
    btsMaxOtts: 1,
    tryAndPayEligible: true,
    price: 53,
    currency: 'EUR',
    sourceType: 'DERIVED',
    status: 'CONFIRMED',
    sourcePage: 'AACC Septiembre 2026 - Pág. 6',
    sourceReference: 'Base 600M (43€) + 10€ salto estándar 1Gbps',
    calculationFormula: '43€ (base 600M 1x60GB) + 10€ (salto a 1G) = 53€',
    description: 'Fibra 1Gbps con 1 línea móvil 60GB 5G'
  },
  'vdf-base-1g-2x60gb': {
    id: 'vdf-base-1g-2x60gb',
    name: 'Vodafone One 1G + 2x60GB',
    fiberSpeed: '1G',
    mobileTier: '60GB',
    linesCount: 2,
    btsMaxOtts: 1,
    tryAndPayEligible: true,
    price: 59,
    currency: 'EUR',
    sourceType: 'DERIVED',
    status: 'CONFIRMED',
    sourcePage: 'AACC Septiembre 2026 - Pág. 6 & 7',
    sourceReference: 'Base 49€ (600M 2x60GB) + 10€ salto 1G',
    calculationFormula: '49€ (base 600M 2x60GB) + 10€ (salto a 1G) = 59€',
    description: 'Fibra 1Gbps con 2 líneas móviles 60GB 5G'
  },

  // --- 160GB Tier ---
  'vdf-base-600m-1x160gb': {
    id: 'vdf-base-600m-1x160gb',
    name: 'Vodafone One 600M + 1x160GB',
    fiberSpeed: '600M',
    mobileTier: '160GB',
    linesCount: 1,
    btsMaxOtts: 2,
    tryAndPayEligible: false,
    price: 48,
    currency: 'EUR',
    sourceType: 'OFFICIAL_TABLE',
    status: 'CONFIRMED',
    sourcePage: 'AACC Septiembre 2026 - Pág. 6',
    sourceReference: 'Ejemplo mono/multi oferta habituales: La más vendida',
    description: 'Fibra 600Mbps con 1 línea móvil 160GB 5G'
  },
  'vdf-base-600m-2x160gb': {
    id: 'vdf-base-600m-2x160gb',
    name: 'Vodafone One 600M + 2x160GB',
    fiberSpeed: '600M',
    mobileTier: '160GB',
    linesCount: 2,
    btsMaxOtts: 2,
    tryAndPayEligible: false,
    price: 54,
    currency: 'EUR',
    sourceType: 'OFFICIAL_TABLE',
    status: 'CONFIRMED',
    sourcePage: 'AACC Septiembre 2026 - Pág. 6 & 17',
    sourceReference: 'Ejemplo mono/multi oferta: La familiar / Fin promo sin TV',
    calculationFormula: '48€ (base 1L 600M 160GB) + 6€ (2ª línea convergente) = 54€',
    description: 'Fibra 600Mbps con 2 líneas móviles 160GB 5G'
  },
  'vdf-base-1g-1x160gb': {
    id: 'vdf-base-1g-1x160gb',
    name: 'Vodafone One 1G + 1x160GB',
    fiberSpeed: '1G',
    mobileTier: '160GB',
    linesCount: 1,
    btsMaxOtts: 2,
    tryAndPayEligible: true,
    price: 58,
    currency: 'EUR',
    sourceType: 'DERIVED',
    status: 'CONFIRMED',
    sourcePage: 'AACC Septiembre 2026 - Pág. 6',
    sourceReference: 'Base 600M 1x160GB (48€) + 10€ salto 1G',
    calculationFormula: '48€ + 10€ = 58€',
    description: 'Fibra 1Gbps con 1 línea móvil 160GB 5G'
  },
  'vdf-base-1g-2x160gb': {
    id: 'vdf-base-1g-2x160gb',
    name: 'Vodafone One 1G + 2x160GB',
    fiberSpeed: '1G',
    mobileTier: '160GB',
    linesCount: 2,
    btsMaxOtts: 2,
    tryAndPayEligible: true,
    price: 64,
    currency: 'EUR',
    sourceType: 'DERIVED',
    status: 'CONFIRMED',
    sourcePage: 'AACC Septiembre 2026 - Pág. 6 & 7',
    sourceReference: 'Base 600M 2x160GB (54€) + 10€ salto 1G',
    calculationFormula: '54€ + 10€ = 64€',
    description: 'Fibra 1Gbps con 2 líneas móviles 160GB 5G'
  },

  // --- Ilimitadas Tier ---
  'vdf-base-600m-1xilim': {
    id: 'vdf-base-600m-1xilim',
    name: 'Vodafone One 600M + 1 Ilimitada',
    fiberSpeed: '600M',
    mobileTier: 'ilimitada',
    linesCount: 1,
    btsMaxOtts: 3,
    tryAndPayEligible: false,
    price: 53,
    currency: 'EUR',
    sourceType: 'DERIVED',
    status: 'CONFIRMED',
    sourcePage: 'AACC Septiembre 2026 - Pág. 6 & 7',
    sourceReference: 'Base 600M 1x160GB (48€) + 5€ salto a ilimitada',
    calculationFormula: '48€ + 5€ = 53€',
    description: 'Fibra 600Mbps con 1 línea móvil Ilimitada 5G'
  },
  'vdf-base-600m-2xilim': {
    id: 'vdf-base-600m-2xilim',
    name: 'Vodafone One 600M + 2 Ilimitadas',
    fiberSpeed: '600M',
    mobileTier: 'ilimitada',
    linesCount: 2,
    btsMaxOtts: 3,
    tryAndPayEligible: false,
    price: 59,
    currency: 'EUR',
    sourceType: 'OFFICIAL_TABLE',
    status: 'CONFIRMED',
    sourcePage: 'AACC Septiembre 2026 - Pág. 6 & 17',
    sourceReference: 'Ejemplo mono/multi oferta habituales: La completa (T&P 3 meses a 59€)',
    calculationFormula: '53€ (base 1L 600M ilim) + 6€ (2ª línea convergente) = 59€',
    description: 'Fibra 600Mbps con 2 líneas móviles Ilimitadas 5G'
  },
  'vdf-base-1g-1xilim': {
    id: 'vdf-base-1g-1xilim',
    name: 'Vodafone One 1G + 1 Ilimitada',
    fiberSpeed: '1G',
    mobileTier: 'ilimitada',
    linesCount: 1,
    btsMaxOtts: 3,
    tryAndPayEligible: true,
    price: 63,
    currency: 'EUR',
    sourceType: 'DERIVED',
    status: 'CONFIRMED',
    sourcePage: 'AACC Septiembre 2026 - Pág. 6',
    sourceReference: 'Base 600M 1xIlim (53€) + 10€ salto 1G',
    calculationFormula: '53€ + 10€ = 63€',
    description: 'Fibra 1Gbps con 1 línea móvil Ilimitada 5G'
  },
  'vdf-base-1g-2xilim': {
    id: 'vdf-base-1g-2xilim',
    name: 'Vodafone One 1G + 2 Ilimitadas',
    fiberSpeed: '1G',
    mobileTier: 'ilimitada',
    linesCount: 2,
    btsMaxOtts: 3,
    tryAndPayEligible: true,
    price: 69,
    currency: 'EUR',
    sourceType: 'OFFICIAL_TABLE',
    status: 'CONFIRMED',
    sourcePage: 'AACC Septiembre 2026 - Pág. 6 & 17',
    sourceReference: 'Pág 6 (fin T&P 70€ con SN 1€ => base 69€) & Pág 17 (Fin promo 59€ base 600M + 10€)',
    calculationFormula: '59€ (base 600M 2xIlim) + 10€ (salto 1G) = 69€',
    description: 'Fibra 1Gbps con 2 líneas móviles Ilimitadas 5G'
  }
};

// ============================================================================
// 2. BTS (BACK TO SCHOOL / CAMPAÑA VUELTA AL COLE)
// ============================================================================
export type BtsOttId = 'netflix' | 'hbo_max' | 'prime' | 'disney';

export interface BtsRules {
  campaignName: string;
  sourcePage: string;
  promoEndDate: string; // '2026-12-31'
  billingStartDate: string; // '2027-01-01'
  eligibleOtts: BtsOttId[];
  ottAllowanceByTier: Record<'60GB' | '160GB' | 'ilimitada', number>;
  promoPrice: number; // 0€ during campaign
  decoIncludedGratis: boolean; // 0€
}

export const VODAFONE_BTS_RULES: BtsRules = {
  campaignName: 'Campaña BTS Vuelta al Cole Septiembre 2026',
  sourcePage: 'AACC Septiembre 2026 - Pág. 2, 3, 5, 6',
  promoEndDate: '2026-12-31',
  billingStartDate: '2027-01-01',
  eligibleOtts: ['netflix', 'hbo_max', 'prime', 'disney'],
  ottAllowanceByTier: {
    '60GB': 1,
    '160GB': 2,
    'ilimitada': 3
  },
  promoPrice: 0,
  decoIncludedGratis: true
};

// ============================================================================
// 3. TRY & PAY (FIBRA 1GB A PRECIO DE 600MB DURANTE 3 MESES)
// ============================================================================
export interface TryAndPayMeta {
  promoDurationMonths: number;
  monthlyDiscountInPromo: number; // 10€ discount on 1G during months 1-3
  sourcePage: string;
  ruleNote: string;
}

export const VODAFONE_TRY_AND_PAY: TryAndPayMeta = {
  promoDurationMonths: 3,
  monthlyDiscountInPromo: 10,
  sourcePage: 'AACC Septiembre 2026 - Pág. 5 & 6',
  ruleNote: 'Solo aplicable si tryAndPayEligible === true y velocidad es 1G. En 600M es NOT_APPLICABLE.'
};

// ============================================================================
// 4. SECURE NET
// ============================================================================
export interface SecureNetPricing extends CommercialPriceItem {
  promoPriceMonths1to3: number;
  regularPriceMonth4Onwards: number;
}

export const VODAFONE_SECURE_NET: SecureNetPricing = {
  id: 'vdf-secure-net',
  name: 'Vodafone Secure Net (Fijo y Móvil)',
  price: 1,
  promoPriceMonths1to3: 0,
  regularPriceMonth4Onwards: 1,
  currency: 'EUR',
  sourceType: 'OFFICIAL_TABLE',
  status: 'CONFIRMED',
  sourcePage: 'AACC Septiembre 2026 - Pág. 6',
  sourceReference: 'Diferencial en Ejemplos Pág. 6: Meses 1-3 0€, luego +1€/mes (fin SN)',
  description: 'Seguridad Digital en tu hogar y móvil. Meses 1-3 gratis (0€), luego 1€/mes.'
};

// ============================================================================
// 5. VODAFONE TV Y PLATAFORMAS OTT
// ============================================================================
export interface OttPackPricing extends CommercialPriceItem {
  ottsIncluded: string[];
  tvIncluded: boolean;
  requiresDecoder: boolean;
}

export const VODAFONE_TV_AND_OTTS: Record<string, OttPackPricing> = {
  'vdf-tv-standalone': {
    id: 'vdf-tv-standalone',
    name: 'Vodafone TV (sola sin OTT)',
    price: 5,
    currency: 'EUR',
    sourceType: 'OFFICIAL_TABLE',
    status: 'CONFIRMED',
    sourcePage: 'AACC Septiembre 2026 - Pág. 6 & 9',
    sourceReference: 'PVP Vodafone TV standalone sin plataformas',
    ottsIncluded: [],
    tvIncluded: true,
    requiresDecoder: true,
    description: 'Vodafone TV básica (5€/mes + decodificador si corresponde)'
  },
  'vdf-tv-prime': {
    id: 'vdf-tv-prime',
    name: 'Vodafone TV + Prime (con anuncios)',
    price: 9,
    currency: 'EUR',
    sourceType: 'OFFICIAL_TABLE',
    status: 'CONFIRMED',
    sourcePage: 'AACC Septiembre 2026 - Pág. 6',
    sourceReference: 'Ejemplo La más económica fin BTS: 54€ + 9€ = 63€',
    calculationFormula: 'Vodafone TV (5€) + Prime con dto 1€ (4€) = 9€/mes',
    ottsIncluded: ['prime'],
    tvIncluded: true,
    requiresDecoder: false
  },
  'vdf-tv-disney': {
    id: 'vdf-tv-disney',
    name: 'Vodafone TV + Disney+ (con anuncios)',
    price: 11,
    currency: 'EUR',
    sourceType: 'OFFICIAL_TABLE',
    status: 'CONFIRMED',
    sourcePage: 'AACC Septiembre 2026 - Pág. 6 & 9',
    sourceReference: 'Vodafone TV (5€) + Disney+ con anuncios (6€) = 11€',
    calculationFormula: '5€ + 6€ = 11€/mes',
    ottsIncluded: ['disney'],
    tvIncluded: true,
    requiresDecoder: false
  },
  'vdf-tv-hbo': {
    id: 'vdf-tv-hbo',
    name: 'Vodafone TV + HBO Max (con anuncios)',
    price: 11,
    currency: 'EUR',
    sourceType: 'OFFICIAL_TABLE',
    status: 'CONFIRMED',
    sourcePage: 'AACC Septiembre 2026 - Pág. 6 & 9',
    sourceReference: 'Vodafone TV (5€) + HBO Max con anuncios (6€) = 11€',
    calculationFormula: '5€ + 6€ = 11€/mes',
    ottsIncluded: ['hbo_max'],
    tvIncluded: true,
    requiresDecoder: false
  },
  'vdf-tv-netflix-standalone': {
    id: 'vdf-tv-netflix-standalone',
    name: 'Vodafone TV + Netflix (sola única plataforma)',
    price: 13.99,
    currency: 'EUR',
    sourceType: 'OFFICIAL_TABLE',
    status: 'CONFIRMED',
    sourcePage: 'AACC Septiembre 2026 - Pág. 6 & 9',
    sourceReference: 'Pág. 9: "Netflix: tendrá un precio de 13,99€/mes (incluido Vodafone TV), en contratación de única plataforma"',
    ottsIncluded: ['netflix'],
    tvIncluded: true,
    requiresDecoder: false,
    description: 'Netflix con Vodafone TV incluida a 13,99€/mes'
  },
  'vdf-addon-netflix-added': {
    id: 'vdf-addon-netflix-added',
    name: 'Netflix añadida a otro pack TV',
    price: 8.99,
    currency: 'EUR',
    sourceType: 'OFFICIAL_TABLE',
    status: 'CONFIRMED',
    sourcePage: 'AACC Septiembre 2026 - Pág. 9',
    sourceReference: 'Pág. 9: "caso de hacerlo con otras plataformas, el coste será de 8,99€/mes"',
    ottsIncluded: ['netflix'],
    tvIncluded: false, // La TV ya está en el pack principal
    requiresDecoder: false,
    description: 'Netflix añadido sobre un pack existente con TV (+8,99€/mes)'
  },
  'vdf-tv-2otts-familiar': {
    id: 'vdf-tv-2otts-familiar',
    name: 'Pack Vodafone TV + 2 OTTs (con anuncios)',
    price: 15,
    currency: 'EUR',
    sourceType: 'OFFICIAL_AACC_EXAMPLE',
    status: 'CONFIRMED',
    sourcePage: 'AACC Septiembre 2026 - Pág. 6',
    sourceReference: 'Ejemplo La familiar fin BTS: 80€ - 65€ = 15€',
    calculationFormula: '80€ (total desde 1/1/27) - 65€ (base + SN) = 15€',
    ottsIncluded: ['prime', 'disney'], // o prime + hbo
    tvIncluded: true,
    requiresDecoder: false
  },
  'vdf-tv-3otts-completa': {
    id: 'vdf-tv-3otts-completa',
    name: 'Pack Vodafone TV + 3 OTTs (con anuncios)',
    price: 21,
    currency: 'EUR',
    sourceType: 'OFFICIAL_AACC_EXAMPLE',
    status: 'CONFIRMED',
    sourcePage: 'AACC Septiembre 2026 - Pág. 6',
    sourceReference: 'Ejemplo La completa fin BTS: 91€ - 70€ = 21€',
    calculationFormula: '91€ (total desde 1/1/27) - 70€ (base 69€ + SN 1€) = 21€',
    ottsIncluded: ['prime', 'disney', 'hbo_max'],
    tvIncluded: true,
    requiresDecoder: false
  },

  // --- PACKS Y SERVICIOS ADICIONALES DE TV Y STREAMING CONFIRMADOS (AACC Pág. 9) ---
  'vdf-addon-pack-deportes': {
    id: 'vdf-addon-pack-deportes',
    name: 'Pack Deportes',
    price: 6,
    currency: 'EUR',
    sourceType: 'OFFICIAL_TABLE',
    status: 'CONFIRMED',
    sourcePage: 'AACC Septiembre 2026 - Pág. 9',
    sourceReference: 'Pack Deportes a 6€/mes (Eurosport, LaLiga Hypermotion, etc.)',
    ottsIncluded: [],
    tvIncluded: false,
    requiresDecoder: false,
    description: 'Pack Deportes con Eurosport 1 y 2, LaLiga Hypermotion y eventos deportivos por 6€/mes.'
  },
  'vdf-addon-tv-filmin': {
    id: 'vdf-addon-tv-filmin',
    name: 'Vodafone TV + Filmin',
    price: 10,
    currency: 'EUR',
    sourceType: 'OFFICIAL_TABLE',
    status: 'CONFIRMED',
    sourcePage: 'AACC Septiembre 2026 - Pág. 9',
    sourceReference: 'Vodafone TV + Filmin a 10€/mes total',
    calculationFormula: 'Vodafone TV + Filmin = 10€/mes total',
    ottsIncluded: ['filmin'],
    tvIncluded: true,
    requiresDecoder: false,
    description: 'Vodafone TV + suscripción a Filmin por 10€/mes total.'
  },
  'vdf-addon-pack-documentales': {
    id: 'vdf-addon-pack-documentales',
    name: 'Pack Documentales',
    price: 8,
    currency: 'EUR',
    sourceType: 'OFFICIAL_TABLE',
    status: 'CONFIRMED',
    sourcePage: 'AACC Septiembre 2026 - Pág. 9',
    sourceReference: 'Pack Documentales a 8€/mes (National Geographic Now, Discovery, etc.)',
    ottsIncluded: [],
    tvIncluded: false,
    requiresDecoder: false,
    description: 'El mejor contenido documental y naturaleza por 8€/mes.'
  },
  'vdf-addon-amc': {
    id: 'vdf-addon-amc',
    name: 'AMC Selekt',
    price: 4.99,
    currency: 'EUR',
    sourceType: 'OFFICIAL_TABLE',
    status: 'CONFIRMED',
    sourcePage: 'AACC Septiembre 2026 - Pág. 9',
    sourceReference: 'AMC Selekt a 4,99€/mes',
    ottsIncluded: [],
    tvIncluded: false,
    requiresDecoder: false,
    description: 'Canales y catálogo bajo demanda de AMC Selekt por 4,99€/mes.'
  },
  'vdf-addon-mas-series': {
    id: 'vdf-addon-mas-series',
    name: 'Más Series',
    price: 6,
    currency: 'EUR',
    sourceType: 'OFFICIAL_TABLE',
    status: 'CONFIRMED',
    sourcePage: 'AACC Septiembre 2026 - Pág. 9',
    sourceReference: 'Más Series a 6€/mes',
    ottsIncluded: [],
    tvIncluded: false,
    requiresDecoder: false,
    description: 'Canales especializados en series por 6€/mes.'
  },
  'vdf-addon-premium-familiar': {
    id: 'vdf-addon-premium-familiar',
    name: 'Premium Familiar',
    price: 9.99,
    currency: 'EUR',
    sourceType: 'OFFICIAL_TABLE',
    status: 'CONFIRMED',
    sourcePage: 'AACC Septiembre 2026 - Pág. 9',
    sourceReference: 'Premium Familiar a 9,99€/mes',
    ottsIncluded: [],
    tvIncluded: false,
    requiresDecoder: false,
    description: 'Contenido infantil y familiar de alta calidad por 9,99€/mes.'
  },
  'vdf-addon-onetoro': {
    id: 'vdf-addon-onetoro',
    name: 'OneToro TV',
    price: 14.99,
    currency: 'EUR',
    sourceType: 'OFFICIAL_TABLE',
    status: 'CONFIRMED',
    sourcePage: 'AACC Septiembre 2026 - Pág. 9',
    sourceReference: 'OneToro a 14,99€/mes',
    ottsIncluded: [],
    tvIncluded: false,
    requiresDecoder: false,
    description: 'Canal temático taurino OneToro por 14,99€/mes.'
  },
  'vdf-addon-pack-caza': {
    id: 'vdf-addon-pack-caza',
    name: 'Pack Caza',
    price: 7,
    currency: 'EUR',
    sourceType: 'OFFICIAL_TABLE',
    status: 'CONFIRMED',
    sourcePage: 'AACC Septiembre 2026 - Pág. 9',
    sourceReference: 'Pack Caza a 7€/mes (Caza y Pesca)',
    ottsIncluded: [],
    tvIncluded: false,
    requiresDecoder: false,
    description: 'Canal especializado en caza y naturaleza por 7€/mes.'
  },
  'vdf-addon-pack-adulto': {
    id: 'vdf-addon-pack-adulto',
    name: 'Pack Adulto',
    price: 10,
    currency: 'EUR',
    sourceType: 'OFFICIAL_TABLE',
    status: 'CONFIRMED',
    sourcePage: 'AACC Septiembre 2026 - Pág. 9',
    sourceReference: 'Pack Adulto a 10€/mes',
    ottsIncluded: [],
    tvIncluded: false,
    requiresDecoder: false,
    description: 'Contenido para adultos por 10€/mes.'
  },
  'vdf-addon-videoclub-rakuten': {
    id: 'vdf-addon-videoclub-rakuten',
    name: 'Videoclub / Rakuten',
    price: 0,
    currency: 'EUR',
    sourceType: 'OFFICIAL_TABLE',
    status: 'CONFIRMED',
    sourcePage: 'AACC Septiembre 2026 - Pág. 9',
    sourceReference: 'Videoclub Rakuten: Pago por visión sin cuota fija',
    ottsIncluded: [],
    tvIncluded: false,
    requiresDecoder: false,
    description: 'Videoclub Rakuten TV integrado. Ficha informativa sin cuota mensual fija (pago por alquiler de contenidos).'
  },

  // --- SERVICIOS DE AUTOGESTIÓN POR EL CLIENTE (INFORMATIVOS, NO VENTA AUTOMÁTICA) ---
  'vdf-addon-autogestion-disney-sin-anuncios': {
    id: 'vdf-addon-autogestion-disney-sin-anuncios',
    name: 'Disney+ Sin Anuncios (Autogestión)',
    price: 15,
    currency: 'EUR',
    sourceType: 'INTERNAL_COMMERCIAL_INFORMATION',
    status: 'RESTRICTED_CHANNEL',
    sourcePage: 'AACC Septiembre 2026 - Pág. 9',
    sourceReference: 'Upgrade Disney+ Estándar sin anuncios a 15€/mes (autogestión cliente)',
    ottsIncluded: ['disney'],
    tvIncluded: false,
    requiresDecoder: false,
    description: 'Modalidad sin anuncios autogestionada directamente por el cliente por 15€/mes.'
  },
  'vdf-addon-autogestion-disney-premium': {
    id: 'vdf-addon-autogestion-disney-premium',
    name: 'Disney+ Premium 4K (Autogestión)',
    price: 20,
    currency: 'EUR',
    sourceType: 'INTERNAL_COMMERCIAL_INFORMATION',
    status: 'RESTRICTED_CHANNEL',
    sourcePage: 'AACC Septiembre 2026 - Pág. 9',
    sourceReference: 'Disney+ Premium 4K a 20€/mes (autogestión cliente)',
    ottsIncluded: ['disney'],
    tvIncluded: false,
    requiresDecoder: false,
    description: 'Modalidad Premium 4K autogestionada directamente por el cliente por 20€/mes.'
  },
  'vdf-addon-autogestion-hbo-sin-anuncios': {
    id: 'vdf-addon-autogestion-hbo-sin-anuncios',
    name: 'Max (HBO) Sin Anuncios (Autogestión)',
    price: 15,
    currency: 'EUR',
    sourceType: 'INTERNAL_COMMERCIAL_INFORMATION',
    status: 'RESTRICTED_CHANNEL',
    sourcePage: 'AACC Septiembre 2026 - Pág. 9',
    sourceReference: 'Upgrade Max Estándar sin anuncios a 15€/mes (autogestión cliente)',
    ottsIncluded: ['hbo_max'],
    tvIncluded: false,
    requiresDecoder: false,
    description: 'Modalidad sin anuncios autogestionada directamente por el cliente por 15€/mes.'
  },
  'vdf-addon-autogestion-netflix-estandar': {
    id: 'vdf-addon-autogestion-netflix-estandar',
    name: 'Netflix Estándar sin anuncios (Autogestión)',
    price: 14.99,
    currency: 'EUR',
    sourceType: 'INTERNAL_COMMERCIAL_INFORMATION',
    status: 'RESTRICTED_CHANNEL',
    sourcePage: 'AACC Septiembre 2026 - Pág. 9',
    sourceReference: 'Netflix Estándar sin anuncios a 14,99€/mes (autogestión cliente)',
    ottsIncluded: ['netflix'],
    tvIncluded: false,
    requiresDecoder: false,
    description: 'Plan Estándar de Netflix autogestionado por el cliente por 14,99€/mes.'
  },
  'vdf-addon-autogestion-netflix-premium': {
    id: 'vdf-addon-autogestion-netflix-premium',
    name: 'Netflix Premium 4K (Autogestión)',
    price: 21.99,
    currency: 'EUR',
    sourceType: 'INTERNAL_COMMERCIAL_INFORMATION',
    status: 'RESTRICTED_CHANNEL',
    sourcePage: 'AACC Septiembre 2026 - Pág. 9',
    sourceReference: 'Netflix Premium 4K a 21,99€/mes (autogestión cliente)',
    ottsIncluded: ['netflix'],
    tvIncluded: false,
    requiresDecoder: false,
    description: 'Plan Premium 4K de Netflix autogestionado por el cliente por 21,99€/mes.'
  },

  // --- CONFLICTOS DOCUMENTALES ABIERTOS (BLOQUEADOS PARA COMERCIALIZACIÓN) ---
  'vdf-conflict-prime-disney': {
    id: 'vdf-conflict-prime-disney',
    name: 'Conflicto Pack Prime + Disney+',
    price: 14,
    currency: 'EUR',
    sourceType: 'DERIVED',
    status: 'CONFLICTO_DOCUMENTAL',
    sourcePage: 'AACC Septiembre 2026 - Pág. 6 & 9',
    sourceReference: 'Discrepancia entre cálculo de sumatorio de packs y referencia implícita',
    calculationFormula: '5€ (Vodafone TV) + 4€ (Prime) + 5€ (Disney+) = 14€ vs 15€ referencia implícita en Slide 6',
    conflictDetails: {
      publishedPrice: 14,
      implicitReferencePrice: 15,
      discrepancyNote: 'Prime + Disney+: 14€ vs referencia implícita 15€. Bloqueado para selección automática.'
    },
    ottsIncluded: ['prime', 'disney'],
    tvIncluded: true,
    requiresDecoder: false
  },
  'vdf-conflict-prime-hbo-sin-anuncios': {
    id: 'vdf-conflict-prime-hbo-sin-anuncios',
    name: 'Conflicto Prime + HBO sin anuncios',
    price: 19,
    currency: 'EUR',
    sourceType: 'DERIVED',
    status: 'CONFLICTO_DOCUMENTAL',
    sourcePage: 'AACC Septiembre 2026 - Pág. 9',
    sourceReference: 'Cálculo de upgrade sin anuncios (+4€) vs PVP publicado',
    calculationFormula: '15€ (Pack Prime + HBO base) + 4€ (upgrade sin anuncios HBO) = 19€ vs 20€ publicado en tabla comercial',
    conflictDetails: {
      calculatedPrice: 19,
      publishedPrice: 20,
      discrepancyNote: 'Prime + HBO sin anuncios: 19€ calculado vs 20€ publicado. Bloqueado.'
    },
    ottsIncluded: ['prime', 'hbo_max'],
    tvIncluded: true,
    requiresDecoder: false
  },
  'vdf-conflict-3otts-sin-anuncios': {
    id: 'vdf-conflict-3otts-sin-anuncios',
    name: 'Conflicto 3 OTT sin anuncios',
    price: 25,
    currency: 'EUR',
    sourceType: 'DERIVED',
    status: 'CONFLICTO_DOCUMENTAL',
    sourcePage: 'AACC Septiembre 2026 - Pág. 9',
    sourceReference: 'Publicado 25€ vs teórico calculado 29€',
    calculationFormula: '21€ (Pack 3 OTTs con anuncios) + 4€ (sin anuncios HBO) + 4€ (sin anuncios Disney) = 29€ teórico vs 25€ publicado',
    conflictDetails: {
      publishedPrice: 25,
      calculatedPrice: 29,
      discrepancyNote: '3 OTT sin anuncios: 25€ publicado vs 29€ calculado teóricamente. Bloqueado.'
    },
    ottsIncluded: ['prime', 'disney', 'hbo_max'],
    tvIncluded: true,
    requiresDecoder: false
  }
};

// ============================================================================
// 6. DAZN
// ============================================================================
export interface DaznPricing extends CommercialPriceItem {
  requiresVodafoneTv: boolean;
  permanenceMonths: number;
}

export const VODAFONE_DAZN: Record<string, DaznPricing> = {
  'vdf-dazn-futbol': {
    id: 'vdf-dazn-futbol',
    name: 'DAZN Fútbol (Captación con Permanencia 12m)',
    price: 14.99,
    currency: 'EUR',
    sourceType: 'PROMOTIONAL',
    status: 'CONFIRMED',
    sourcePage: 'AACC Septiembre 2026 - Pág. 11',
    sourceReference: 'Promo captación DAZN Fútbol del 13/8 al 20/9 con perma 12m (-5€/mes)',
    requiresVodafoneTv: false,
    permanenceMonths: 12,
    description: 'DAZN Fútbol contratable de forma independiente sin Vodafone TV.'
  },
  'vdf-dazn-futbol-nuevo': {
    id: 'vdf-dazn-futbol-nuevo',
    name: 'DAZN Fútbol (Captación con Permanencia 12m)',
    price: 14.99,
    currency: 'EUR',
    sourceType: 'PROMOTIONAL',
    status: 'CONFIRMED',
    sourcePage: 'AACC Septiembre 2026 - Pág. 11',
    sourceReference: 'Promo captación DAZN Fútbol del 13/8 al 20/9 con perma 12m (-5€/mes)',
    requiresVodafoneTv: false,
    permanenceMonths: 12,
    description: 'DAZN Fútbol contratable de forma independiente sin Vodafone TV.'
  },
  'vdf-dazn-premium': {
    id: 'vdf-dazn-premium',
    name: 'DAZN Total / Premium (Captación con Permanencia 12m)',
    price: 25.99,
    currency: 'EUR',
    sourceType: 'PROMOTIONAL',
    status: 'CONFIRMED',
    sourcePage: 'AACC Septiembre 2026 - Pág. 11',
    sourceReference: 'Promo captación DAZN Premium con perma 12m (-6€/mes)',
    requiresVodafoneTv: false,
    permanenceMonths: 12,
    description: 'DAZN Total/Premium contratable de forma independiente sin Vodafone TV.'
  },
  'vdf-dazn-premium-nuevo': {
    id: 'vdf-dazn-premium-nuevo',
    name: 'DAZN Total / Premium (Captación con Permanencia 12m)',
    price: 25.99,
    currency: 'EUR',
    sourceType: 'PROMOTIONAL',
    status: 'CONFIRMED',
    sourcePage: 'AACC Septiembre 2026 - Pág. 11',
    sourceReference: 'Promo captación DAZN Premium con perma 12m (-6€/mes)',
    requiresVodafoneTv: false,
    permanenceMonths: 12,
    description: 'DAZN Total/Premium contratable de forma independiente sin Vodafone TV.'
  },
  // --- DAZN MODO PVP REGULAR ---
  'vdf-dazn-futbol-regular': {
    id: 'vdf-dazn-futbol-regular',
    name: 'DAZN Fútbol (PVP Regular)',
    price: 19.99,
    currency: 'EUR',
    sourceType: 'OFFICIAL_TABLE',
    status: 'CONFIRMED',
    sourcePage: 'AACC Septiembre 2026 - Pág. 11',
    sourceReference: 'PVP regular oficial DAZN Fútbol a 19,99€/mes',
    requiresVodafoneTv: false,
    permanenceMonths: 0,
    description: 'DAZN Fútbol a PVP regular de 19,99€/mes sin compromiso de permanencia promocional.'
  },
  'vdf-dazn-motor-regular': {
    id: 'vdf-dazn-motor-regular',
    name: 'DAZN Motor (PVP Regular)',
    price: 19.99,
    currency: 'EUR',
    sourceType: 'OFFICIAL_TABLE',
    status: 'CONFIRMED',
    sourcePage: 'AACC Septiembre 2026 - Pág. 11',
    sourceReference: 'PVP regular oficial DAZN Motor (F1 + MotoGP) a 19,99€/mes',
    requiresVodafoneTv: false,
    permanenceMonths: 0,
    description: 'DAZN Motor (F1, MotoGP) a PVP regular oficial de 19,99€/mes.'
  },
  'vdf-dazn-premium-regular': {
    id: 'vdf-dazn-premium-regular',
    name: 'DAZN Total / Premium (PVP Regular)',
    price: 31.99,
    currency: 'EUR',
    sourceType: 'OFFICIAL_TABLE',
    status: 'CONFIRMED',
    sourcePage: 'AACC Septiembre 2026 - Pág. 11',
    sourceReference: 'PVP regular oficial DAZN Total / Premium a 31,99€/mes',
    requiresVodafoneTv: false,
    permanenceMonths: 0,
    description: 'DAZN Total/Premium a PVP regular oficial de 31,99€/mes.'
  },
  // --- DAZN CARTERA Y NBA (FUENTES EXTERNAS PENDIENTES DE VALIDACIÓN FORMAL AACC) ---
  'vdf-dazn-futbol-cartera': {
    id: 'vdf-dazn-futbol-cartera',
    name: 'DAZN Fútbol (Cartera 24M)',
    price: 9.99,
    currency: 'EUR',
    sourceType: 'EXTERNAL_PROJECT_SOURCE',
    status: 'EXTERNAL_PROJECT_SOURCE',
    sourcePage: 'Vodafone Circular Externa DAZN Cartera',
    sourceReference: 'LaLiga EA Sports y fútbol internacional a 9,99€/mes durante 24 meses (fuente externa no validada en AACC)',
    requiresVodafoneTv: false,
    permanenceMonths: 24,
    description: 'Promo DAZN Fútbol cartera 24 meses a 9,99€/mes. Pendiente de validación de circular externa. Bloqueada para propuesta automática.'
  },
  'vdf-dazn-premium-cartera': {
    id: 'vdf-dazn-premium-cartera',
    name: 'DAZN Premium (Cartera 24M)',
    price: 11.99,
    currency: 'EUR',
    sourceType: 'EXTERNAL_PROJECT_SOURCE',
    status: 'EXTERNAL_PROJECT_SOURCE',
    sourcePage: 'Vodafone Circular Externa DAZN Cartera',
    sourceReference: 'Todo el deporte: Fútbol + Motor F1/MotoGP a 11,99€/mes durante 24 meses (fuente externa no validada en AACC)',
    requiresVodafoneTv: false,
    permanenceMonths: 24,
    description: 'Promo DAZN Premium cartera 24 meses a 11,99€/mes. Pendiente de validación de circular externa. Bloqueada para propuesta automática.'
  },
  'vdf-dazn-futbol-nba': {
    id: 'vdf-dazn-futbol-nba',
    name: 'DAZN Fútbol (Oferta Exclusiva NBA)',
    price: 6.99,
    currency: 'EUR',
    sourceType: 'EXTERNAL_PROJECT_SOURCE',
    status: 'EXTERNAL_PROJECT_SOURCE',
    sourcePage: 'Vodafone Circular Externa DAZN NBA',
    sourceReference: 'Oferta personalizada NBA: Fútbol a 6,99€/mes durante 24 meses (fuente externa no validada en AACC)',
    requiresVodafoneTv: false,
    permanenceMonths: 24,
    description: 'Oferta personalizada NBA Fútbol a 6,99€/mes. Pendiente de validación de circular externa. Bloqueada para propuesta automática.'
  },
  'vdf-dazn-motor-nba': {
    id: 'vdf-dazn-motor-nba',
    name: 'DAZN Motor (Oferta Exclusiva NBA)',
    price: 6.99,
    currency: 'EUR',
    sourceType: 'EXTERNAL_PROJECT_SOURCE',
    status: 'EXTERNAL_PROJECT_SOURCE',
    sourcePage: 'Vodafone Circular Externa DAZN NBA',
    sourceReference: 'Oferta personalizada NBA: F1 y MotoGP a 6,99€/mes durante 24 meses (fuente externa no validada en AACC)',
    requiresVodafoneTv: false,
    permanenceMonths: 24,
    description: 'Oferta personalizada NBA Motor a 6,99€/mes. Pendiente de validación de circular externa. Bloqueada para propuesta automática.'
  }
};

// ============================================================================
// 7. DECODIFICADORES
// ============================================================================
export interface DecoderPricing extends CommercialPriceItem {
  monthlyFee: number;
  btsFee: number; // 0€ en campaña BTS
}

export const VODAFONE_DECODERS: Record<string, DecoderPricing> = {
  'vdf-deco-standard-3': {
    id: 'vdf-deco-standard-3',
    name: 'Decodificador Vodafone TV (Cuota 3€)',
    price: 3,
    monthlyFee: 3,
    btsFee: 0,
    currency: 'EUR',
    sourceType: 'INTERNAL_COMMERCIAL_INFORMATION',
    status: 'CONFIRMED',
    sourcePage: 'AACC Septiembre 2026 - Regla 10 / Cuota Interna',
    sourceReference: 'Opción comercial de decodificador a 3€/mes (gratis 0€ en BTS)',
    description: 'Decodificador 4K con cuota estándar de 3€/mes (0€ en promo BTS).'
  },
  'vdf-deco-premium-4': {
    id: 'vdf-deco-premium-4',
    name: 'Decodificador Vodafone TV (Cuota 4€)',
    price: 4,
    monthlyFee: 4,
    btsFee: 0,
    currency: 'EUR',
    sourceType: 'INTERNAL_COMMERCIAL_INFORMATION',
    status: 'CONFIRMED',
    sourcePage: 'AACC Septiembre 2026 - Regla 10 / Cuota Interna',
    sourceReference: 'Opción comercial de decodificador a 4€/mes (gratis 0€ en BTS)',
    description: 'Decodificador con cuota de 4€/mes (0€ en promo BTS).'
  }
};

// ============================================================================
// 8. LÍNEAS ADICIONALES Y SERVICIOS B2B
// ============================================================================
export interface AdditionalLinePricing extends CommercialPriceItem {
  mobileData?: string;
  isB2BExclusive?: boolean;
}

export const VODAFONE_ADDITIONAL_LINES: Record<string, AdditionalLinePricing> = {
  'vdf-linea-adicional-convergente': {
    id: 'vdf-linea-adicional-convergente',
    name: 'Línea adicional igual que convergente',
    price: 6,
    mobileData: 'Misma capacidad del paquete contratado (60GB / 160GB / Ilimitada)',
    currency: 'EUR',
    sourceType: 'OFFICIAL_TABLE',
    status: 'CONFIRMED',
    sourcePage: 'AACC Septiembre 2026 - Pág. 7',
    sourceReference: 'Pág. 7: "Lineas adicionales igual que la convergente por +6€/mes"',
    description: 'Línea adicional multilínea con los mismos gigas que el paquete principal.'
  },
  'vdf-linea-adicional-basica-10gb': {
    id: 'vdf-linea-adicional-basica-10gb',
    name: 'Línea adicional básica 10GB',
    price: 2,
    mobileData: '10GB 5G + 50 min llamadas',
    currency: 'EUR',
    sourceType: 'OFFICIAL_TABLE',
    status: 'CONFIRMED',
    sourcePage: 'AACC Septiembre 2026 - Pág. 7',
    sourceReference: 'Pág. 7: "Lineas básicas de 10GB por +2€/mes (50min + 10GB)"',
    description: 'Línea adicional básica para usos secundarios.'
  },
  'vdf-linea-adicional-negocio-60gb': {
    id: 'vdf-linea-adicional-negocio-60gb',
    name: 'Línea adicional Negocios 60GB',
    price: 4.96,
    mobileData: '60GB 5G',
    currency: 'EUR',
    sourceType: 'OFFICIAL_TABLE',
    status: 'CONFIRMED',
    sourcePage: 'AACC Septiembre 2026 - Pág. 31',
    sourceReference: 'Pág. 31: "Opción de línea de 60 GB a 4,96€"',
    description: 'Línea adicional segmento Autónomos y Negocios.',
    isB2BExclusive: true
  },
  // --- ADDONS EXCLUSIVOS DE PLANES FIBRA_MOVIL_EMPRESA (NEGOCIOS) ---
  'vdf-b2b-addon-ott-tv': {
    id: 'vdf-b2b-addon-ott-tv',
    name: 'Cualquier OTT + Vodafone TV (Negocios)',
    price: 7.43,
    currency: 'EUR',
    sourceType: 'OFFICIAL_TABLE',
    status: 'CONFIRMED',
    sourcePage: 'AACC Septiembre 2026 - Pág. 31',
    sourceReference: 'Cualquier OTT + Vodafone TV por 7,43€/mes sin IVA para planes de empresa',
    description: 'Cualquier OTT + Vodafone TV por 7,43€ sin IVA exclusivo para planes fibra_movil_empresa.',
    isB2BExclusive: true
  },
  'vdf-b2b-addon-linea-ilimitada': {
    id: 'vdf-b2b-addon-linea-ilimitada',
    name: 'Línea adicional ilimitada (Negocios)',
    price: 9.09,
    mobileData: 'Ilimitada 5G',
    currency: 'EUR',
    sourceType: 'OFFICIAL_TABLE',
    status: 'CONFIRMED',
    sourcePage: 'AACC Septiembre 2026 - Pág. 31',
    sourceReference: 'Línea adicional ilimitada por 9,09€/mes sin IVA para planes de empresa',
    description: 'Línea adicional ilimitada por 9,09€ sin IVA exclusivo para planes fibra_movil_empresa.',
    isB2BExclusive: true
  },
  'vdf-b2b-addon-fibra-1gb': {
    id: 'vdf-b2b-addon-fibra-1gb',
    name: 'Fibra adicional 1Gb (Negocios)',
    price: 16.53,
    currency: 'EUR',
    sourceType: 'OFFICIAL_TABLE',
    status: 'CONFIRMED',
    sourcePage: 'AACC Septiembre 2026 - Pág. 31',
    sourceReference: 'Fibra adicional 1Gb por 16,53€/mes sin IVA para planes de empresa',
    description: 'Fibra adicional 1Gb por 16,53€ sin IVA exclusivo para planes fibra_movil_empresa.',
    isB2BExclusive: true
  }
};

// ============================================================================
// 9. OFERTAS ESPECIALES BLOQUEADAS (NO COMERCIALIZABLES AUTOMÁTICAMENTE)
// ============================================================================
export interface BlockedSpecialOffer extends CommercialPriceItem {
  promoPrice?: number;
  promoEndDate?: string;
  regularPrice?: number;
  btlPrice?: number;
}

export const VODAFONE_BLOCKED_SPECIAL_OFFERS: Record<string, BlockedSpecialOffer> = {
  'vdf-test-pending-validation': {
    id: 'vdf-test-pending-validation',
    name: 'Oferta de Prueba Pendiente de Validación Comercial',
    price: 39,
    currency: 'EUR',
    sourceType: 'PROMOTIONAL',
    status: 'PENDING_COMMERCIAL_VALIDATION',
    sourcePage: 'AACC Septiembre 2026 - Control Comercial',
    sourceReference: 'Oferta no homologada pendiente de validación formal',
    description: 'Oferta pendiente de validación comercial. BLOQUEADA para comercialización.',
    notes: [
      'Bloqueada hasta validación comercial formal.',
      'No se permite propuesta automática a cliente.'
    ]
  },
  'vdf-oferta-45-euros': {
    id: 'vdf-oferta-45-euros',
    name: 'Hipótesis Oferta 45€',
    price: 45,
    currency: 'EUR',
    sourceType: 'DERIVED',
    status: 'DERIVED_HYPOTHESIS_PENDING_VALIDATION',
    sourcePage: 'Auditoría Comercial Septiembre 2026 - Pág. 17 & Hipótesis BTL',
    sourceReference: 'Hipótesis derivada pendiente de validación comercial',
    calculationFormula: 'Hipótesis BTL: 39€ (oferta sin TV) + 6€ (línea adicional) = 45€ (pendiente de validación comercial)',
    description: 'Tarifa hipotética de 45€ derivada de comparativa BTL. BLOQUEADA.',
    notes: [
      'Bloqueada hasta validación comercial explícita.'
    ]
  },
  'vdf-internal-1g-1ilim-39': {
    id: 'vdf-internal-1g-1ilim-39',
    name: 'Promo Falsa 1G + 1 Ilim 39€ (NO EXISTE)',
    price: 39,
    promoPrice: 39,
    regularPrice: 63,
    currency: 'EUR',
    sourceType: 'INTERNAL_COMMERCIAL_INFORMATION',
    status: 'DEPRECATED_INVALID',
    sourcePage: 'Canal Comercial Interno - Eliminada',
    sourceReference: 'La oferta 1Gb + 1 línea ilimitada = 39€ x 3 meses NO EXISTE',
    description: 'La oferta 1Gb + 1 línea ilimitada = 39€ x 3 meses NO EXISTE. No mostrar en UI. No usar en cálculos.',
    notes: [
      'NO EXISTE.',
      'No mostrar en UI.',
      'No usar en cálculos.'
    ]
  },
  'vdf-internal-1g-2ilim-45-hypothesis': {
    id: 'vdf-internal-1g-2ilim-45-hypothesis',
    name: 'Hipótesis 45€ (39 + 6) [INVALIDADA]',
    price: 45,
    currency: 'EUR',
    sourceType: 'INTERNAL_COMMERCIAL_INFORMATION',
    status: 'DEPRECATED_INVALID',
    sourcePage: 'Canal Comercial Interno - Hipótesis Descartada',
    sourceReference: 'La hipótesis 39 + 6 ya no es válida',
    calculationFormula: '39€ + 6€ = 45€ (Hipótesis descartada)',
    description: 'La hipótesis 39 + 6 ya no es válida. No mostrar. No calcular.',
    notes: [
      'La hipótesis 39 + 6 ya no es válida.',
      'No mostrar.',
      'No calcular.'
    ]
  }
};

// ============================================================================
// 10. PROMOCIONES Y OFERTAS ESPECIALES CONFIRMADAS
// ============================================================================
export interface VodafoneSpecialPromo extends CommercialPriceItem {
  fiberSpeed?: '1G' | '600M';
  mobileTier?: 'ilimitada' | '160GB' | '60GB';
  linesCount?: number;
  fixedIncluded?: boolean;
  promoPrice?: number;
  promoMonths?: number;
  regularPrice?: number;
}

export const VODAFONE_SPECIAL_PROMOS: Record<string, VodafoneSpecialPromo> = {
  'vdf-oferta-39-euros': {
    id: 'vdf-oferta-39-euros',
    name: 'Oferta Pública Sin TV 39€ (Fibra 600M + 2x160GB)',
    price: 39,
    promoPrice: 39,
    promoMonths: 4,
    regularPrice: 54,
    fiberSpeed: '600M',
    mobileTier: '160GB',
    linesCount: 2,
    fixedIncluded: false,
    currency: 'EUR',
    sourceType: 'OFFICIAL_TABLE',
    status: 'CONFIRMED',
    sourcePage: 'AACC Septiembre 2026 - Pág. 17',
    sourceReference: 'Pág. 17: "Fibra 600Mbps + 2 líneas Móvil Precios sin TV 2x Ilimitadas (160GB): PVP hasta 31/12 39 €, Fin de promo 54 €, PVP BTL 49 €"',
    calculationFormula: 'PVP hasta 31/12/2026: 39€/mes, Fin promo: 54€/mes, PVP BTL: 49€/mes',
    description: 'Oferta pública oficial sin TV: Fibra 600Mbps + 2 líneas 160GB 5G a 39€/mes hasta 31/12/2026, después 54€/mes.'
  },
  'vdf-public-600m-2x160gb-39': {
    id: 'vdf-public-600m-2x160gb-39',
    name: 'Oferta Pública Sin TV 39€ (Fibra 600M + 2x160GB) [Alias]',
    price: 39,
    promoPrice: 39,
    promoMonths: 4,
    regularPrice: 54,
    fiberSpeed: '600M',
    mobileTier: '160GB',
    linesCount: 2,
    fixedIncluded: false,
    currency: 'EUR',
    sourceType: 'OFFICIAL_TABLE',
    status: 'CONFIRMED',
    sourcePage: 'AACC Septiembre 2026 - Pág. 17',
    sourceReference: 'Alias canónico de vdf-oferta-39-euros',
    calculationFormula: 'PVP hasta 31/12/2026: 39€/mes, Fin promo: 54€/mes',
    description: 'Alias canónico de vdf-oferta-39-euros.'
  },
  'vdf-public-600m-2xilim-44': {
    id: 'vdf-public-600m-2xilim-44',
    name: 'Oferta Pública Sin TV 44€ (Fibra 600M + 2 Ilimitadas)',
    price: 44,
    promoPrice: 44,
    promoMonths: 4,
    regularPrice: 59,
    fiberSpeed: '600M',
    mobileTier: 'ilimitada',
    linesCount: 2,
    fixedIncluded: false,
    currency: 'EUR',
    sourceType: 'OFFICIAL_TABLE',
    status: 'CONFIRMED',
    sourcePage: 'AACC Septiembre 2026 - Pág. 17',
    sourceReference: 'Pág. 17: "Fibra 600Mbps + 2 líneas Móvil Precios sin TV 2x Ilimitadas: PVP hasta 31/12 44 €, Fin de promo 59 €, PVP BTL 54 €"',
    calculationFormula: 'PVP hasta 31/12/2026: 44€/mes, Fin promo: 59€/mes, PVP BTL: 54€/mes',
    description: 'Oferta pública oficial sin TV: Fibra 600Mbps + 2 líneas Ilimitadas 5G a 44€/mes hasta 31/12/2026, después 59€/mes.'
  },
  'vdf-internal-1g-2ilim-39': {
    id: 'vdf-internal-1g-2ilim-39',
    name: 'Promo Confirmada Fibra 1Gb + Fijo + 2 Líneas Ilimitadas 39€',
    price: 39,
    promoPrice: 39,
    promoMonths: 3,
    regularPrice: 69,
    fiberSpeed: '1G',
    mobileTier: 'ilimitada',
    linesCount: 2,
    fixedIncluded: true,
    currency: 'EUR',
    sourceType: 'INTERNAL_COMMERCIAL_INFORMATION',
    status: 'INTERNAL_CONFIRMED',
    sourcePage: 'Canal Comercial Interno Confirmado',
    sourceReference: 'Promo confirmada: Fibra 1Gb + Fijo incluido + 2 líneas ilimitadas = 39€/mes durante 3 meses, luego regular 69€',
    calculationFormula: 'Promo confirmada 39€/mes x 3 meses, luego regular de catálogo vdf-base-1g-2xilim = 69€/mes',
    description: 'Configuración: Fibra 1Gb, Fijo incluido, 2 líneas ilimitadas. 39€/mes durante 3 meses. Luego precio regular del catálogo correspondiente (69€/mes).'
  },
  'SPECIAL_PROMO_39': {
    id: 'SPECIAL_PROMO_39',
    name: 'Promo Confirmada Fibra 1Gb + Fijo + 2 Líneas Ilimitadas 39€ (Alias)',
    price: 39,
    promoPrice: 39,
    promoMonths: 3,
    regularPrice: 69,
    fiberSpeed: '1G',
    mobileTier: 'ilimitada',
    linesCount: 2,
    fixedIncluded: true,
    currency: 'EUR',
    sourceType: 'INTERNAL_COMMERCIAL_INFORMATION',
    status: 'INTERNAL_CONFIRMED',
    sourcePage: 'Canal Comercial Interno Confirmado',
    sourceReference: 'Promo confirmada: Fibra 1Gb + Fijo incluido + 2 líneas ilimitadas = 39€/mes durante 3 meses, luego regular 69€',
    calculationFormula: 'Promo confirmada 39€/mes x 3 meses, luego regular de catálogo vdf-base-1g-2xilim = 69€/mes',
    description: 'Alias de vdf-internal-1g-2ilim-39.'
  }
};

export const VODAFONE_INTERNAL_PROMOS: Record<string, VodafoneSpecialPromo | BlockedSpecialOffer> = {
  ...VODAFONE_SPECIAL_PROMOS,
  ...VODAFONE_BLOCKED_SPECIAL_OFFERS
};

// ============================================================================
// 11. OFERTAS FLASH Y PRIVADAS (CANAL RESTRINGIDO, INCOMPATIBLES CON BTS)
// ============================================================================
export interface VodafoneFlashPlan extends CommercialPriceItem {
  fiberSpeed: '600M' | '1G';
  mobileTier: '160GB';
  linesCount: 2;
  ottIncluded?: string;
  tvIncluded?: boolean;
}

export const VODAFONE_FLASH_PLANS: Record<string, VodafoneFlashPlan> = {
  'vdf-flash-3p-1g-2x160gb': {
    id: 'vdf-flash-3p-1g-2x160gb',
    name: 'Flash 3P Fibra 1Gbps + 2x160GB',
    price: 44.70,
    currency: 'EUR',
    fiberSpeed: '1G',
    mobileTier: '160GB',
    linesCount: 2,
    sourceType: 'OFFICIAL_TABLE',
    status: 'RESTRICTED_CHANNEL',
    sourcePage: 'AACC Septiembre 2026 - Ofertas Flash',
    sourceReference: 'Flash 3P: Fibra 1Gbps + 2 líneas 160GB a 44,70€/mes PVP indefinido',
    description: 'Oferta privada Flash 3P: Fibra 1Gbps + 2 líneas 160GB a 44,70€/mes. Incompatible con BTS. Oferta privada — verificar disponibilidad en canal.'
  },
  'vdf-flash-4p-600m-2x160gb-prime': {
    id: 'vdf-flash-4p-600m-2x160gb-prime',
    name: 'Flash 4P Fibra 600M + 2x160GB + TV + Prime',
    price: 51,
    currency: 'EUR',
    fiberSpeed: '600M',
    mobileTier: '160GB',
    linesCount: 2,
    ottIncluded: 'prime',
    tvIncluded: true,
    sourceType: 'OFFICIAL_TABLE',
    status: 'RESTRICTED_CHANNEL',
    sourcePage: 'AACC Septiembre 2026 - Ofertas Flash',
    sourceReference: 'Flash 4P Prime: 51€/mes',
    description: 'Oferta privada Flash 4P: Fibra 600Mbps + 2 líneas 160GB + Vodafone TV + Prime a 51€/mes. Incompatible con BTS. Oferta privada — verificar disponibilidad en canal.'
  },
  'vdf-flash-4p-600m-2x160gb-netflix': {
    id: 'vdf-flash-4p-600m-2x160gb-netflix',
    name: 'Flash 4P Fibra 600M + 2x160GB + TV + Netflix',
    price: 56,
    currency: 'EUR',
    fiberSpeed: '600M',
    mobileTier: '160GB',
    linesCount: 2,
    ottIncluded: 'netflix',
    tvIncluded: true,
    sourceType: 'OFFICIAL_TABLE',
    status: 'RESTRICTED_CHANNEL',
    sourcePage: 'AACC Septiembre 2026 - Ofertas Flash',
    sourceReference: 'Flash 4P Netflix: 56€/mes',
    description: 'Oferta privada Flash 4P: Fibra 600Mbps + 2 líneas 160GB + Vodafone TV + Netflix a 56€/mes. Incompatible con BTS. Oferta privada — verificar disponibilidad en canal.'
  },
  'vdf-flash-4p-600m-2x160gb-hbo': {
    id: 'vdf-flash-4p-600m-2x160gb-hbo',
    name: 'Flash 4P Fibra 600M + 2x160GB + TV + HBO Max',
    price: 53,
    currency: 'EUR',
    fiberSpeed: '600M',
    mobileTier: '160GB',
    linesCount: 2,
    ottIncluded: 'hbo_max',
    tvIncluded: true,
    sourceType: 'OFFICIAL_TABLE',
    status: 'RESTRICTED_CHANNEL',
    sourcePage: 'AACC Septiembre 2026 - Ofertas Flash',
    sourceReference: 'Flash 4P HBO Max: 53€/mes',
    description: 'Oferta privada Flash 4P: Fibra 600Mbps + 2 líneas 160GB + Vodafone TV + HBO Max a 53€/mes. Incompatible con BTS. Oferta privada — verificar disponibilidad en canal.'
  },
  'vdf-flash-4p-600m-2x160gb-disney': {
    id: 'vdf-flash-4p-600m-2x160gb-disney',
    name: 'Flash 4P Fibra 600M + 2x160GB + TV + Disney+',
    price: 53,
    currency: 'EUR',
    fiberSpeed: '600M',
    mobileTier: '160GB',
    linesCount: 2,
    ottIncluded: 'disney',
    tvIncluded: true,
    sourceType: 'OFFICIAL_TABLE',
    status: 'RESTRICTED_CHANNEL',
    sourcePage: 'AACC Septiembre 2026 - Ofertas Flash',
    sourceReference: 'Flash 4P Disney+: 53€/mes',
    description: 'Oferta privada Flash 4P: Fibra 600Mbps + 2 líneas 160GB + Vodafone TV + Disney+ a 53€/mes. Incompatible con BTS. Oferta privada — verificar disponibilidad en canal.'
  }
};

// ============================================================================
// 12. PAQUETES INTERNET PORTÁTIL + MÓVIL (RESUMEN AACC)
// ============================================================================
export interface VodafonePortatilMovilPlan extends CommercialPriceItem {
  mobileData: string;
}

export const VODAFONE_PORTATIL_MOVIL_PLANS: Record<string, VodafonePortatilMovilPlan> = {
  'vdf-portatil-movil-60gb': {
    id: 'vdf-portatil-movil-60gb',
    name: 'Internet Portátil + Móvil 60GB',
    price: 43,
    currency: 'EUR',
    mobileData: '60GB 5G',
    sourceType: 'OFFICIAL_TABLE',
    status: 'CONFIRMED',
    sourcePage: 'AACC Septiembre 2026 - Resumen Portátil + Móvil',
    sourceReference: 'Internet Portátil + móvil 60GB: 43€/mes',
    description: 'Internet Portátil hasta 1Gbps + 1 línea móvil 60GB 5G por 43€/mes.'
  },
  'vdf-portatil-movil-160gb': {
    id: 'vdf-portatil-movil-160gb',
    name: 'Internet Portátil + Móvil 160GB',
    price: 48,
    currency: 'EUR',
    mobileData: '160GB 5G',
    sourceType: 'OFFICIAL_TABLE',
    status: 'CONFIRMED',
    sourcePage: 'AACC Septiembre 2026 - Resumen Portátil + Móvil',
    sourceReference: 'Internet Portátil + móvil 160GB: 48€/mes',
    description: 'Internet Portátil hasta 1Gbps + 1 línea móvil 160GB 5G por 48€/mes.'
  },
  'vdf-portatil-movil-ilim': {
    id: 'vdf-portatil-movil-ilim',
    name: 'Internet Portátil + Móvil Ilimitada',
    price: 53,
    currency: 'EUR',
    mobileData: 'Ilimitada 5G',
    sourceType: 'OFFICIAL_TABLE',
    status: 'CONFIRMED',
    sourcePage: 'AACC Septiembre 2026 - Resumen Portátil + Móvil',
    sourceReference: 'Internet Portátil + móvil ilimitada: 53€/mes',
    description: 'Internet Portátil hasta 1Gbps + 1 línea móvil ilimitada 5G por 53€/mes.'
  }
};

// ============================================================================
// 13. OFERTAS INFORMATIVAS DE RETENCIÓN NIVEL 3 (NO COTIZABLES AUTOMÁTICAMENTE)
// ============================================================================
export interface VodafoneNivel3Plan extends Omit<CommercialPriceItem, 'price'> {
  price?: number;
  discountType: 'anti_digi' | 'descuento_30' | 'descuento_40';
}

export const VODAFONE_NIVEL_3_PLANS: Record<string, VodafoneNivel3Plan> = {
  'vdf-retencion-anti-digi': {
    id: 'vdf-retencion-anti-digi',
    name: 'Oferta Especial Retención Anti-Digi (Nivel 3)',
    currency: 'EUR',
    discountType: 'anti_digi',
    sourceType: 'INTERNAL_COMMERCIAL_INFORMATION',
    status: 'RESTRICTED_CHANNEL',
    sourcePage: 'Canal Retención / Fidelización Nivel 3',
    sourceReference: 'Oferta Nivel 3 Anti Digi informativa - consultar canal',
    description: 'Oferta Nivel 3 informativa: Anti Digi. Requiere validación directa con canal de retención. No cotizable automáticamente.'
  },
  'vdf-retencion-dto-30': {
    id: 'vdf-retencion-dto-30',
    name: 'Oferta Especial Descuento 30% (Nivel 3)',
    currency: 'EUR',
    discountType: 'descuento_30',
    sourceType: 'INTERNAL_COMMERCIAL_INFORMATION',
    status: 'RESTRICTED_CHANNEL',
    sourcePage: 'Canal Retención / Fidelización Nivel 3',
    sourceReference: 'Oferta Nivel 3 Descuento 30% informativa - consultar canal',
    description: 'Oferta Nivel 3 informativa: Descuento 30%. Requiere validación directa con canal de retención. No cotizable automáticamente.'
  },
  'vdf-retencion-dto-40': {
    id: 'vdf-retencion-dto-40',
    name: 'Oferta Especial Descuento 40% (Nivel 3)',
    currency: 'EUR',
    discountType: 'descuento_40',
    sourceType: 'INTERNAL_COMMERCIAL_INFORMATION',
    status: 'RESTRICTED_CHANNEL',
    sourcePage: 'Canal Retención / Fidelización Nivel 3',
    sourceReference: 'Oferta Nivel 3 Descuento 40% informativa - consultar canal',
    description: 'Oferta Nivel 3 informativa: Descuento 40%. Requiere validación directa con canal de retención. No cotizable automáticamente.'
  }
};

