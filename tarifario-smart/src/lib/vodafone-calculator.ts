/**
 * MOTOR DE CÁLCULO TARIFARIO VODAFONE SEPTIEMBRE 2026
 * 
 * Reglas de implementación:
 * 1. NO reinterpretar precios ni reglas.
 * 2. Bloqueo estricto de comercialización ante estados no confirmados / conflictos.
 * 3. BTS: 60GB=1 OTT, 160GB=2 OTT, Ilimitada=3 OTT. Si se seleccionan menos, BTS=false y aplica PVP normal.
 * 4. Try&Pay: depende de tryAndPayEligible===true y fiberSpeed==='1G'. En 600M: NOT_APPLICABLE.
 * 5. Secure Net: basePrice, secureNetPrice, totalWithSecureNet SIEMPRE separados.
 * 6. TV/OTT: No duplicar Vodafone TV. PVP de pack ya incluye TV. Netflix sola=13.99€, añadida=+8.99€.
 * 7. Decodificadores: 3€ / 4€, en BTS gratis = 0€.
 */

import {
  type CommercialStatus,
  isCommerciallyValid,
  VODAFONE_BASE_CONFIGS,
  type VodafoneBaseConfig,
  VODAFONE_BTS_RULES,
  type BtsOttId,
  VODAFONE_TRY_AND_PAY,
  VODAFONE_SECURE_NET,
  VODAFONE_TV_AND_OTTS,
  VODAFONE_DAZN,
  VODAFONE_DECODERS,
  VODAFONE_ADDITIONAL_LINES,
  VODAFONE_BLOCKED_SPECIAL_OFFERS,
  VODAFONE_FLASH_PLANS,
  VODAFONE_PORTATIL_MOVIL_PLANS,
  VODAFONE_NIVEL_3_PLANS
} from '../data/vodafone-commercial-truth.ts';

export interface VodafoneCalculationInput {
  baseConfigId: string; // ID de una de las 12 bases o de ofertas especiales
  tryAndPayEligible?: boolean;
  selectedOtts?: BtsOttId[]; // Netflix, HBO Max, Prime, Disney
  includeVodafoneTvStandalone?: boolean; // Solo si no hay OTT con TV
  decoderOptionId?: 'vdf-deco-standard-3' | 'vdf-deco-premium-4' | 'none';
  includeSecureNet?: boolean;
  daznPackId?: string;
  customDaznPrice?: number;
  extraLinesCount?: number; // Líneas extra más allá de las 1 o 2 del base
  extraLineType?: 'convergente' | 'basica-10gb' | 'negocio-60gb';
  customPromoId?: string; // Para probar ofertas especiales como vdf-oferta-39-euros
  specialPromoId?: string; // Para promo especial confirmada como vdf-internal-1g-2ilim-39 o SPECIAL_PROMO_39
  conflictPackId?: string; // Para probar paquetes en conflicto documental
  selectedAddonIds?: string[]; // IDs de añadidos seleccionados para comprobación de conflictos
  btsRequested?: boolean; // Si se solicita explícitamente BTS
  applyBts?: boolean;
}

export interface VodafoneQuoteBreakdown {
  periodLabel: string;
  basePrice: number;
  tryAndPayDiscount: number;
  specialPromoDiscount?: number;
  netBasePrice: number;
  secureNetPrice: number;
  totalWithSecureNet: number;
  tvAndOttPrice: number;
  decoderPrice: number;
  daznPrice: number;
  additionalLinesPrice: number;
  otherAddonsPrice?: number;
  totalPrice: number;
}

export interface VodafoneQuoteSummary {
  meses1_3: number;
  meses4_dic2026: number;
  desde2027: number;
  desde_01_01_2027?: number;
}

export interface VodafoneCalculationResult {
  isValidForCommercialization: boolean;
  blockingReasons: string[];
  baseConfig: VodafoneBaseConfig | null;
  commercialStatus: CommercialStatus;
  tryAndPayApplied: boolean;
  specialPromoApplied?: boolean;
  specialPromoId?: string;
  btsApplied: boolean;
  btsOttCountGranted: number;
  btsReason?: string;
  price?: number | null;
  periods: {
    months1to3: VodafoneQuoteBreakdown;
    months4toDec2026: VodafoneQuoteBreakdown;
    from2027: VodafoneQuoteBreakdown;
  };
  summary: VodafoneQuoteSummary | null;
}

/**
 * Calcula la cotización oficial de Vodafone para los tres periodos temporales
 */
export function calculateVodafoneQuote(input: VodafoneCalculationInput): VodafoneCalculationResult {
  const blockingReasons: string[] = [];

  // 0. Ofertas informativas Nivel 3 (Retención): no cotizables automáticamente y nunca 0€
  if (
    input.baseConfigId === 'vdf-retencion-anti-digi' ||
    input.baseConfigId === 'vdf-retencion-dto-30' ||
    input.baseConfigId === 'vdf-retencion-dto-40' ||
    input.customPromoId === 'vdf-retencion-anti-digi' ||
    input.customPromoId === 'vdf-retencion-dto-30' ||
    input.customPromoId === 'vdf-retencion-dto-40'
  ) {
    return {
      isValidForCommercialization: false,
      blockingReasons: ['Oferta informativa de retención / Nivel 3. Requiere verificación directa con canal. No cotizable automáticamente.'],
      baseConfig: null,
      commercialStatus: 'RESTRICTED_CHANNEL',
      tryAndPayApplied: false,
      specialPromoApplied: false,
      btsApplied: false,
      btsOttCountGranted: 0,
      price: null, // NUNCA mostrar 0€ o gratis
      periods: createEmptyPeriods(),
      summary: null
    };
  }
  
  // 1. Verificar si es una oferta especial bloqueada o descartada (por baseConfigId, customPromoId o specialPromoId)
  const blockedOffer = 
    VODAFONE_BLOCKED_SPECIAL_OFFERS[input.baseConfigId] ||
    (input.customPromoId ? VODAFONE_BLOCKED_SPECIAL_OFFERS[input.customPromoId] : undefined) ||
    (input.specialPromoId ? VODAFONE_BLOCKED_SPECIAL_OFFERS[input.specialPromoId] : undefined);

  if (blockedOffer) {
    blockingReasons.push(
      `Oferta '${blockedOffer.name}' bloqueada para comercialización (Estado: ${blockedOffer.status}). ${blockedOffer.notes?.join(' ') || ''}`
    );
    const isDeprecated = blockedOffer.status === 'DEPRECATED_INVALID';
    return {
      isValidForCommercialization: false,
      blockingReasons,
      baseConfig: null,
      commercialStatus: blockedOffer.status,
      tryAndPayApplied: false,
      specialPromoApplied: false,
      btsApplied: false,
      btsOttCountGranted: 0,
      price: isDeprecated ? null : blockedOffer.price,
      periods: createEmptyPeriods(),
      summary: isDeprecated 
        ? null 
        : { meses1_3: blockedOffer.price, meses4_dic2026: blockedOffer.regularPrice ?? blockedOffer.price, desde2027: blockedOffer.regularPrice ?? blockedOffer.price }
    };
  }

  // 1.1 Identificar promociones y ofertas especiales confirmadas
  let isSpecialPromo39 = false;
  let isPublicSinTv39 = false;
  let isPublicSinTv44 = false;
  let isFlash = false;
  let isFlash4p = false;
  let flashPrice = 0;
  let isPortatilMovil = false;
  let portatilMovilPrice = 0;
  let effectiveBaseConfigId = input.baseConfigId;

  // A) Promo interna confirmada 1Gb + fijo + 2 ilimitadas = 39€ x 3m
  if (
    input.baseConfigId === 'vdf-internal-1g-2ilim-39' ||
    input.baseConfigId === 'SPECIAL_PROMO_39'
  ) {
    isSpecialPromo39 = true;
    effectiveBaseConfigId = 'vdf-base-1g-2xilim';
  } else if (
    (input.specialPromoId === 'vdf-internal-1g-2ilim-39' ||
     input.specialPromoId === 'SPECIAL_PROMO_39' ||
     input.customPromoId === 'vdf-internal-1g-2ilim-39' ||
     input.customPromoId === 'SPECIAL_PROMO_39') &&
    (effectiveBaseConfigId === 'vdf-base-1g-2xilim' || !effectiveBaseConfigId)
  ) {
    isSpecialPromo39 = true;
    effectiveBaseConfigId = 'vdf-base-1g-2xilim';
  }

  // B) Oferta pública confirmada Sin TV 39€ (Fibra 600M + 2x160GB)
  if (
    input.baseConfigId === 'vdf-oferta-39-euros' ||
    input.baseConfigId === 'vdf-public-600m-2x160gb-39' ||
    input.customPromoId === 'vdf-oferta-39-euros' ||
    input.customPromoId === 'vdf-public-600m-2x160gb-39'
  ) {
    isPublicSinTv39 = true;
    effectiveBaseConfigId = 'vdf-base-600m-2x160gb';
  }

  // C) Oferta pública confirmada Sin TV 44€ (Fibra 600M + 2 ilimitadas)
  if (
    input.baseConfigId === 'vdf-public-600m-2xilim-44' ||
    input.customPromoId === 'vdf-public-600m-2xilim-44'
  ) {
    isPublicSinTv44 = true;
    effectiveBaseConfigId = 'vdf-base-600m-2xilim';
  }

  // D) Ofertas Flash (Canal Privado)
  if (input.baseConfigId === 'vdf-flash-3p-1g-2x160gb') {
    isFlash = true;
    flashPrice = 44.70;
    effectiveBaseConfigId = 'vdf-base-1g-2x160gb';
  } else if (input.baseConfigId === 'vdf-flash-4p-600m-2x160gb-prime') {
    isFlash = true;
    isFlash4p = true;
    flashPrice = 51;
    effectiveBaseConfigId = 'vdf-base-600m-2x160gb';
  } else if (input.baseConfigId === 'vdf-flash-4p-600m-2x160gb-netflix') {
    isFlash = true;
    isFlash4p = true;
    flashPrice = 56;
    effectiveBaseConfigId = 'vdf-base-600m-2x160gb';
  } else if (input.baseConfigId === 'vdf-flash-4p-600m-2x160gb-hbo') {
    isFlash = true;
    isFlash4p = true;
    flashPrice = 53;
    effectiveBaseConfigId = 'vdf-base-600m-2x160gb';
  } else if (input.baseConfigId === 'vdf-flash-4p-600m-2x160gb-disney') {
    isFlash = true;
    isFlash4p = true;
    flashPrice = 53;
    effectiveBaseConfigId = 'vdf-base-600m-2x160gb';
  }

  // E) Internet Portátil + Móvil
  if (input.baseConfigId === 'vdf-portatil-movil-60gb') {
    isPortatilMovil = true;
    portatilMovilPrice = 43;
    effectiveBaseConfigId = 'vdf-base-600m-1x60gb';
  } else if (input.baseConfigId === 'vdf-portatil-movil-160gb') {
    isPortatilMovil = true;
    portatilMovilPrice = 48;
    effectiveBaseConfigId = 'vdf-base-600m-1x160gb';
  } else if (input.baseConfigId === 'vdf-portatil-movil-ilim') {
    isPortatilMovil = true;
    portatilMovilPrice = 53;
    effectiveBaseConfigId = 'vdf-base-600m-1xilim';
  }

  // 2. Obtener configuración base
  const baseConfig = VODAFONE_BASE_CONFIGS[effectiveBaseConfigId];
  if (!baseConfig) {
    blockingReasons.push(`Configuración base '${effectiveBaseConfigId}' no encontrada.`);
    return {
      isValidForCommercialization: false,
      blockingReasons,
      baseConfig: null,
      commercialStatus: 'UNCONFIRMED',
      tryAndPayApplied: false,
      specialPromoApplied: false,
      btsApplied: false,
      btsOttCountGranted: 0,
      price: null,
      periods: createEmptyPeriods(),
      summary: null
    };
  }

  if (!isCommerciallyValid(baseConfig.status)) {
    blockingReasons.push(`La tarifa base '${baseConfig.name}' está en estado bloqueante: ${baseConfig.status}`);
  }

  // 3. Regla Try&Pay (Regla 7)
  // NO inferir por fiberSpeed === '1G'. Debe depender de tryAndPayEligible === true.
  // En 600M: NOT_APPLICABLE.
  // En ofertas sin TV (39€/44€), Flash y Portátil+Móvil: NO aplica Try&Pay.
  let tryAndPayApplied = false;
  if (isPublicSinTv39 || isPublicSinTv44 || isFlash || isPortatilMovil) {
    tryAndPayApplied = false;
  } else if (baseConfig.fiberSpeed === '600M' || baseConfig.tryAndPayEligible === false) {
    tryAndPayApplied = false;
  } else if (baseConfig.fiberSpeed === '1G' && baseConfig.tryAndPayEligible && input.tryAndPayEligible === true) {
    tryAndPayApplied = true;
  }

  // 4. Regla BTS (Regla 6)
  // 60GB = exactamente 1 OTT
  // 160GB = exactamente 2 OTT
  // Ilimitada = exactamente 3 OTT
  const selectedOtts = input.selectedOtts || [];
  const allowedOttsCount = VODAFONE_BTS_RULES.ottAllowanceByTier[baseConfig.mobileTier];
  
  let btsApplied = false;
  let btsOttCountGranted = 0;
  let btsReason = '';

  if (input.btsRequested === false || input.applyBts === false) {
    btsApplied = false;
    btsReason = 'BTS no solicitada o expresamente deshabilitada.';
  } else if (selectedOtts.length === 0) {
    btsApplied = false;
    btsReason = 'Sin plataformas OTT seleccionadas.';
  } else if (allowedOttsCount >= 2 && selectedOtts.length < allowedOttsCount) {
    btsApplied = false;
    btsReason = `Cliente con derecho a ${allowedOttsCount} OTTs ha seleccionado ${selectedOtts.length}. BTS no aplica y se factura a PVP normal.`;
  } else {
    btsApplied = true;
    btsOttCountGranted = Math.min(selectedOtts.length, allowedOttsCount);
    btsReason = `Campaña BTS activa: ${btsOttCountGranted} plataforma(s) bonificadas al 100% hasta 31/12/2026.`;
  }

  // 4.1 Incompatibilidades con BTS:
  // A) PROMO ESPECIAL 39€ + BTS => BLOCKED_INCOMPATIBLE
  let isBtsIncompatible = false;
  if (isSpecialPromo39) {
    const btsAttempted = btsApplied || 
      input.btsRequested === true || 
      input.applyBts === true ||
      (selectedOtts.length >= allowedOttsCount && selectedOtts.length > 0) ||
      input.selectedAddonIds?.some(id => id.toLowerCase().includes('bts')) ||
      input.conflictPackId?.toLowerCase().includes('bts');

    if (btsAttempted) {
      isBtsIncompatible = true;
      btsApplied = false;
      btsOttCountGranted = 0;
      btsReason = 'Incompatible con BTS: La promoción especial 39€ (vdf-internal-1g-2ilim-39 / SPECIAL_PROMO_39) no es compatible con la campaña BTS según AACC.';
      blockingReasons.push(
        'Incompatibilidad detectada: La compatibilidad entre la promoción especial de 39€ (vdf-internal-1g-2ilim-39 / SPECIAL_PROMO_39) y BTS no está confirmada (AACC indica que BTS no es compatible con promociones privadas). Estado: BLOCKED_INCOMPATIBLE.'
      );
    }
  }

  // B) FLASH / PRIVADAS + BTS => INCOMPATIBLE_WITH_BTS => BLOCKED_INCOMPATIBLE
  if (isFlash) {
    const btsAttempted = btsApplied || 
      input.btsRequested === true || 
      input.applyBts === true ||
      (selectedOtts.length > 0 && !isFlash4p) ||
      input.selectedAddonIds?.some(id => id.toLowerCase().includes('bts')) ||
      input.conflictPackId?.toLowerCase().includes('bts');

    if (btsAttempted) {
      isBtsIncompatible = true;
      btsApplied = false;
      btsOttCountGranted = 0;
      btsReason = 'Incompatible con BTS: Las tarifas Flash / Privadas son incompatibles con la campaña BTS según AACC.';
      blockingReasons.push(
        'Incompatibilidad detectada: Las tarifas Flash / Privadas son incompatibles con la campaña BTS. Estado: BLOCKED_INCOMPATIBLE.'
      );
    }
  }

  // 4.2 Incompatibilidad: Servicios B2B en planes residenciales
  const isResidentialPlan = !effectiveBaseConfigId.includes('empresa') && !effectiveBaseConfigId.includes('negocio') && !effectiveBaseConfigId.includes('tv-bares');
  if (isResidentialPlan && input.selectedAddonIds) {
    for (const addonId of input.selectedAddonIds) {
      const lineItem = VODAFONE_ADDITIONAL_LINES[addonId];
      if (lineItem?.isB2BExclusive) {
        blockingReasons.push(
          `El servicio '${lineItem.name}' es exclusivo para planes de empresa (fibra_movil_empresa) y no puede contratarse con tarifas residenciales.`
        );
      }
    }
  }

  // 5. Verificar posibles conflictos documentales abiertos en los packs seleccionados (Regla 4)
  let activeConflictStatus: CommercialStatus | undefined = undefined;

  // Conflicto 1: Prime + Disney+ (14€ vs 15€)
  // IMPORTANTE: Detectar conflicto ante la combinación real de addons (no solo el ID artificial vdf-conflict-*)
  const hasSelectedPrimeAddon = input.selectedAddonIds?.includes('vdf-addon-prime');
  const hasSelectedDisneyAddon = input.selectedAddonIds?.includes('vdf-addon-disney');
  const hasIndividualPrimeAndDisney = hasSelectedPrimeAddon && hasSelectedDisneyAddon;
  const hasGenericPrimeAndDisneyWithoutBts = !btsApplied && selectedOtts.includes('prime') && selectedOtts.includes('disney');

  if (
    input.conflictPackId === 'vdf-conflict-prime-disney' ||
    input.selectedAddonIds?.includes('vdf-conflict-prime-disney') ||
    hasIndividualPrimeAndDisney ||
    hasGenericPrimeAndDisneyWithoutBts
  ) {
    const conflictItem = VODAFONE_TV_AND_OTTS['vdf-conflict-prime-disney'];
    if (conflictItem && !isCommerciallyValid(conflictItem.status)) {
      activeConflictStatus = conflictItem.status;
      blockingReasons.push(
        `Conflicto TV abierto detectado (${conflictItem.name}): ${conflictItem.conflictDetails?.discrepancyNote || conflictItem.description || ''}`
      );
    }
  }

  // Conflicto 2: Prime + HBO sin anuncios (19€ vs 20€)
  const hasSelectedHboSinAnuncios = input.selectedAddonIds?.includes('vdf-addon-autogestion-hbo-sin-anuncios') ||
    input.selectedAddonIds?.includes('vdf-addon-hbo-sin-anuncios');
  if (
    input.conflictPackId === 'vdf-conflict-prime-hbo-sin-anuncios' ||
    input.selectedAddonIds?.includes('vdf-conflict-prime-hbo-sin-anuncios') ||
    (hasSelectedPrimeAddon && hasSelectedHboSinAnuncios)
  ) {
    const conflictItem = VODAFONE_TV_AND_OTTS['vdf-conflict-prime-hbo-sin-anuncios'];
    if (conflictItem && !isCommerciallyValid(conflictItem.status)) {
      activeConflictStatus = conflictItem.status;
      blockingReasons.push(
        `Conflicto TV abierto detectado (${conflictItem.name}): ${conflictItem.conflictDetails?.discrepancyNote || conflictItem.description || ''}`
      );
    }
  }

  // Conflicto 3: 3 OTT sin anuncios (25€ vs 29€)
  if (
    input.conflictPackId === 'vdf-conflict-3otts-sin-anuncios' ||
    input.selectedAddonIds?.includes('vdf-conflict-3otts-sin-anuncios')
  ) {
    const conflictItem = VODAFONE_TV_AND_OTTS['vdf-conflict-3otts-sin-anuncios'];
    if (conflictItem && !isCommerciallyValid(conflictItem.status)) {
      activeConflictStatus = conflictItem.status;
      blockingReasons.push(
        `Conflicto TV abierto detectado (${conflictItem.name}): ${conflictItem.conflictDetails?.discrepancyNote || conflictItem.description || ''}`
      );
    }
  }

  // 6. Precios de TV / OTT (Regla 9)
  // En Flash 4P la TV y la OTT ya están incluidas en la cuota fija
  let tvOttPricingPromo = isFlash4p 
    ? 0 
    : calculateTvAndOttPrice(selectedOtts, btsApplied, btsOttCountGranted, input.includeVodafoneTvStandalone, false);
  let tvOttPricingPostBts = isFlash4p 
    ? 0 
    : calculateTvAndOttPrice(selectedOtts, false, 0, input.includeVodafoneTvStandalone, true);

  // 7. Decodificador (Regla 10)
  let decoPromoFee = 0;
  let decoPostBtsFee = 0;
  if (input.decoderOptionId && input.decoderOptionId !== 'none') {
    const decoItem = VODAFONE_DECODERS[input.decoderOptionId];
    if (decoItem) {
      if (btsApplied) {
        decoPromoFee = 0; // Deco gratis en BTS
        decoPostBtsFee = 0; // Se mantiene gratis en BTS
      } else {
        decoPromoFee = decoItem.monthlyFee;
        decoPostBtsFee = decoItem.monthlyFee;
      }
    }
  }

  // 8. Secure Net (Regla 8)
  const hasSecureNet = input.includeSecureNet ?? false;
  const snPriceMonths1to3 = hasSecureNet ? VODAFONE_SECURE_NET.promoPriceMonths1to3 : 0; // 0€
  const snPriceMonth4Onwards = hasSecureNet ? VODAFONE_SECURE_NET.regularPriceMonth4Onwards : 0; // 1€

  // 9. DAZN
  let daznMonthlyPrice = 0;
  let effectiveDaznPackId = input.daznPackId;
  if (!effectiveDaznPackId && input.selectedAddonIds) {
    effectiveDaznPackId = input.selectedAddonIds.find(id => id in VODAFONE_DAZN || id.startsWith('vdf-dazn-'));
  }
  if (input.customDaznPrice !== undefined) {
    daznMonthlyPrice = input.customDaznPrice;
  } else if (effectiveDaznPackId) {
    const dazn = VODAFONE_DAZN[effectiveDaznPackId];
    if (dazn) {
      daznMonthlyPrice = dazn.price;
      if (!isCommerciallyValid(dazn.status)) {
        blockingReasons.push(
          `Paquete DAZN '${dazn.name}' no está confirmado oficialmente por AACC (Estado: ${dazn.status}). Bloqueado para propuesta comercial automática hasta validar circular externa.`
        );
      }
    }
  }
  if (input.selectedAddonIds) {
    for (const addonId of input.selectedAddonIds) {
      const dazn = VODAFONE_DAZN[addonId];
      if (dazn && !isCommerciallyValid(dazn.status) && addonId !== effectiveDaznPackId) {
        blockingReasons.push(
          `Paquete DAZN '${dazn.name}' no está confirmado oficialmente por AACC (Estado: ${dazn.status}). Bloqueado para propuesta comercial automática hasta validar circular externa.`
        );
      }
    }
  }

  // 10. Líneas adicionales más allá del base
  const extraLinesCount = input.extraLinesCount || 0;
  let extraLinePriceUnit = 0;
  if (extraLinesCount > 0) {
    const type = input.extraLineType || 'convergente';
    if (type === 'convergente') {
      extraLinePriceUnit = VODAFONE_ADDITIONAL_LINES['vdf-linea-adicional-convergente'].price; // 6€
    } else if (type === 'basica-10gb') {
      extraLinePriceUnit = VODAFONE_ADDITIONAL_LINES['vdf-linea-adicional-basica-10gb'].price; // 2€
    } else if (type === 'negocio-60gb') {
      extraLinePriceUnit = VODAFONE_ADDITIONAL_LINES['vdf-linea-adicional-negocio-60gb'].price; // 4.96€
    }
  }
  const totalExtraLinesPrice = extraLinesCount * extraLinePriceUnit;

  // CÁLCULO DE LOS TRES PERIODOS
  const basePrice = baseConfig.price;

  let specialPromoApplied = false;
  let specialPromoDiscountM1to3 = 0;
  let specialPromoDiscountM4toDec = 0;
  let tpDiscountM1to3 = 0;
  let netBaseM1to3 = basePrice;
  let netBaseM4toDec = basePrice;
  let netBase2027 = basePrice;

  if (isSpecialPromo39) {
    specialPromoApplied = true;
    netBaseM1to3 = 39;
    specialPromoDiscountM1to3 = Math.max(0, basePrice - 39); // 69 - 39 = 30€
    tpDiscountM1to3 = 0;
    netBaseM4toDec = basePrice;
    netBase2027 = basePrice;
  } else if (isPublicSinTv39) {
    specialPromoApplied = true;
    netBaseM1to3 = 39;
    netBaseM4toDec = 39;
    netBase2027 = 54;
    specialPromoDiscountM1to3 = basePrice - 39; // 54 - 39 = 15€
    specialPromoDiscountM4toDec = basePrice - 39; // 54 - 39 = 15€ (promo activa hasta 31/12/2026)
    tpDiscountM1to3 = 0;
  } else if (isPublicSinTv44) {
    specialPromoApplied = true;
    netBaseM1to3 = 44;
    netBaseM4toDec = 44;
    netBase2027 = 59;
    specialPromoDiscountM1to3 = basePrice - 44; // 59 - 44 = 15€
    specialPromoDiscountM4toDec = basePrice - 44; // 59 - 44 = 15€ (promo activa hasta 31/12/2026)
    tpDiscountM1to3 = 0;
  } else if (isFlash) {
    netBaseM1to3 = flashPrice;
    netBaseM4toDec = flashPrice;
    netBase2027 = flashPrice;
    tpDiscountM1to3 = 0;
  } else if (isPortatilMovil) {
    netBaseM1to3 = portatilMovilPrice;
    netBaseM4toDec = portatilMovilPrice;
    netBase2027 = portatilMovilPrice;
    tpDiscountM1to3 = 0;
  } else if (tryAndPayApplied) {
    tpDiscountM1to3 = VODAFONE_TRY_AND_PAY.monthlyDiscountInPromo;
    netBaseM1to3 = basePrice - tpDiscountM1to3;
    netBaseM4toDec = basePrice;
    netBase2027 = basePrice;
  } else {
    netBaseM1to3 = basePrice;
    netBaseM4toDec = basePrice;
    netBase2027 = basePrice;
  }

  // 11. Otros Addons Seleccionables Confirmados (Extras TV, B2B, etc.)
  let otherAddonsPrice = 0;
  if (input.selectedAddonIds && input.selectedAddonIds.length > 0) {
    for (const addonId of input.selectedAddonIds) {
      // Omitir los que ya forman parte de otros cálculos dedicados
      if (
        addonId.startsWith('vdf-dazn-') ||
        addonId.startsWith('vdf-linea-adicional-') ||
        addonId === 'vdf-addon-linea-convergente' ||
        addonId === 'vdf-addon-linea-basica' ||
        addonId === 'vdf-addon-linea-negocio-60gb' ||
        addonId === 'vdf-addon-deco-3' ||
        addonId === 'vdf-addon-deco-4' ||
        addonId === 'vdf-addon-secure-net' ||
        addonId === 'vdf-addon-prime' ||
        addonId === 'vdf-addon-disney' ||
        addonId === 'vdf-addon-hbo' ||
        addonId === 'vdf-addon-netflix-standalone' ||
        addonId === 'vdf-addon-netflix-added' ||
        addonId === 'vdf-addon-tv-sola' ||
        addonId === 'vdf-addon-videoclub-rakuten' ||
        addonId === 'vdf-addon-disney-sin-anuncios' ||
        addonId === 'vdf-addon-disney-premium' ||
        addonId === 'vdf-addon-hbo-sin-anuncios' ||
        addonId === 'vdf-addon-netflix-estandar' ||
        addonId === 'vdf-addon-netflix-premium'
      ) {
        continue;
      }

      // Addons TV extras confirmados
      if (addonId === 'vdf-addon-pack-deportes') otherAddonsPrice += 6;
      else if (addonId === 'vdf-addon-tv-filmin') otherAddonsPrice += 10;
      else if (addonId === 'vdf-addon-pack-documentales') otherAddonsPrice += 8;
      else if (addonId === 'vdf-addon-amc') otherAddonsPrice += 4.99;
      else if (addonId === 'vdf-addon-mas-series') otherAddonsPrice += 6;
      else if (addonId === 'vdf-addon-premium-familiar') otherAddonsPrice += 9.99;
      else if (addonId === 'vdf-addon-onetoro') otherAddonsPrice += 14.99;
      else if (addonId === 'vdf-addon-pack-caza') otherAddonsPrice += 7;
      else if (addonId === 'vdf-addon-pack-adulto') otherAddonsPrice += 10;
      // Addons B2B confirmados
      else if (addonId === 'vdf-b2b-addon-ott-tv') otherAddonsPrice += 7.43;
      else if (addonId === 'vdf-b2b-addon-linea-ilimitada') otherAddonsPrice += 9.09;
      else if (addonId === 'vdf-b2b-addon-fibra-1gb') otherAddonsPrice += 16.53;
    }
  }

  const totalWithSnM1to3 = netBaseM1to3 + snPriceMonths1to3;
  const totalM1to3 = totalWithSnM1to3 + tvOttPricingPromo + decoPromoFee + daznMonthlyPrice + totalExtraLinesPrice + otherAddonsPrice;

  // Periodo 2: Meses 4 a Dic 2026
  const totalWithSnM4toDec = netBaseM4toDec + snPriceMonth4Onwards;
  const totalM4toDec = totalWithSnM4toDec + tvOttPricingPromo + decoPromoFee + daznMonthlyPrice + totalExtraLinesPrice + otherAddonsPrice;

  // Periodo 3: Desde 01/01/2027
  const totalWithSn2027 = netBase2027 + snPriceMonth4Onwards;
  const total2027 = totalWithSn2027 + tvOttPricingPostBts + decoPostBtsFee + daznMonthlyPrice + totalExtraLinesPrice + otherAddonsPrice;

  const isValid = !isBtsIncompatible && blockingReasons.length === 0 && isCommerciallyValid(baseConfig.status);

  let periodLabelM1to3 = 'Meses 1-3';
  if (specialPromoApplied) {
    periodLabelM1to3 = btsApplied
      ? 'Meses 1-3 (Promo Especial + BTS + SN)'
      : 'Meses 1-3 (Promo Especial)';
  } else if (tryAndPayApplied) {
    periodLabelM1to3 = btsApplied
      ? 'Meses 1-3 (Promo Try&Pay / primeros 3 meses + BTS + SN)'
      : 'Meses 1-3 (Promo Try&Pay / primeros 3 meses)';
  } else if (btsApplied) {
    periodLabelM1to3 = 'Meses 1-3 (BTS + SN)';
  }

  let finalCommercialStatus: CommercialStatus;
  if (isBtsIncompatible) {
    finalCommercialStatus = 'BLOCKED_INCOMPATIBLE';
  } else if (activeConflictStatus) {
    finalCommercialStatus = activeConflictStatus;
  } else if (isFlash) {
    finalCommercialStatus = isValid ? 'RESTRICTED_CHANNEL' : 'BLOCKED_INCOMPATIBLE';
  } else if (isSpecialPromo39) {
    finalCommercialStatus = isValid ? 'INTERNAL_CONFIRMED' : 'CONFLICT';
  } else if (isPublicSinTv39 || isPublicSinTv44) {
    finalCommercialStatus = isValid ? 'CONFIRMED' : 'CONFLICT';
  } else {
    finalCommercialStatus = isValid ? 'CONFIRMED' : baseConfig.status;
  }

  let effectivePromoId: string | undefined = undefined;
  if (isSpecialPromo39) effectivePromoId = 'vdf-internal-1g-2ilim-39';
  else if (isPublicSinTv39) effectivePromoId = 'vdf-oferta-39-euros';
  else if (isPublicSinTv44) effectivePromoId = 'vdf-public-600m-2xilim-44';

  return {
    isValidForCommercialization: isValid,
    blockingReasons,
    baseConfig,
    commercialStatus: finalCommercialStatus,
    tryAndPayApplied: specialPromoApplied ? false : tryAndPayApplied,
    specialPromoApplied,
    specialPromoId: specialPromoApplied ? effectivePromoId : undefined,
    btsApplied,
    btsOttCountGranted,
    btsReason,
    price: isValid ? Math.round(totalM1to3 * 100) / 100 : null,
    periods: {
      months1to3: {
        periodLabel: periodLabelM1to3,
        basePrice,
        tryAndPayDiscount: tpDiscountM1to3,
        specialPromoDiscount: specialPromoDiscountM1to3,
        netBasePrice: netBaseM1to3,
        secureNetPrice: snPriceMonths1to3,
        totalWithSecureNet: totalWithSnM1to3,
        tvAndOttPrice: tvOttPricingPromo,
        decoderPrice: decoPromoFee,
        daznPrice: daznMonthlyPrice,
        additionalLinesPrice: totalExtraLinesPrice,
        otherAddonsPrice: Math.round(otherAddonsPrice * 100) / 100,
        totalPrice: Math.round(totalM1to3 * 100) / 100
      },
      months4toDec2026: {
        periodLabel: tryAndPayApplied && !specialPromoApplied
          ? 'Meses 4-Dic 2026 (Fin Try&Pay & SN, BTS Activo)'
          : (btsApplied ? 'Meses 4-Dic 2026 (Fin SN, BTS Activo)' : 'Meses 4-Dic 2026'),
        basePrice,
        tryAndPayDiscount: 0,
        specialPromoDiscount: 0,
        netBasePrice: netBaseM4toDec,
        secureNetPrice: snPriceMonth4Onwards,
        totalWithSecureNet: totalWithSnM4toDec,
        tvAndOttPrice: tvOttPricingPromo,
        decoderPrice: decoPromoFee,
        daznPrice: daznMonthlyPrice,
        additionalLinesPrice: totalExtraLinesPrice,
        otherAddonsPrice: Math.round(otherAddonsPrice * 100) / 100,
        totalPrice: Math.round(totalM4toDec * 100) / 100
      },
      from2027: {
        periodLabel: 'Desde 01/01/2027 (PVP Estándar Fin BTS)',
        basePrice,
        tryAndPayDiscount: 0,
        specialPromoDiscount: 0,
        netBasePrice: netBase2027,
        secureNetPrice: snPriceMonth4Onwards,
        totalWithSecureNet: totalWithSn2027,
        tvAndOttPrice: tvOttPricingPostBts,
        decoderPrice: decoPostBtsFee,
        daznPrice: daznMonthlyPrice,
        additionalLinesPrice: totalExtraLinesPrice,
        otherAddonsPrice: Math.round(otherAddonsPrice * 100) / 100,
        totalPrice: Math.round(total2027 * 100) / 100
      }
    },
    summary: {
      meses1_3: Math.round(totalM1to3 * 100) / 100,
      meses4_dic2026: Math.round(totalM4toDec * 100) / 100,
      desde2027: Math.round(total2027 * 100) / 100,
      desde_01_01_2027: Math.round(total2027 * 100) / 100
    }
  };
}

/**
 * Cálculo auxiliar de TV y OTTs
 */
export function calculateTvAndOttPrice(
  selectedOtts: BtsOttId[],
  btsApplied: boolean,
  btsOttCountGranted: number,
  includeVodafoneTvStandalone?: boolean,
  isPostBts: boolean = false
): number {
  if (selectedOtts.length === 0) {
    return includeVodafoneTvStandalone ? VODAFONE_TV_AND_OTTS['vdf-tv-standalone'].price : 0;
  }

  // Durante BTS y mientras el número de OTTs esté cubierto por BTS: coste = 0€
  if (btsApplied && !isPostBts && selectedOtts.length <= btsOttCountGranted) {
    return 0;
  }

  // Si BTS aplica y hay más OTTs de las bonificadas:
  // Slide 5: "Si hay más OTTs de la oferta, se regala siempre la o las de mayor valor excepto Netflix."
  // Aquí calculamos el PVP regular de las OTTs (o las no bonificadas)
  const countToCharge = btsApplied && !isPostBts 
    ? Math.max(0, selectedOtts.length - btsOttCountGranted)
    : selectedOtts.length;

  if (countToCharge === 0) return 0;

  const hasNetflix = selectedOtts.includes('netflix');

  // Si BTS está activo durante la promo, la TV ya está bonificada/incluida en el paquete BTS
  if (btsApplied && !isPostBts && btsOttCountGranted > 0) {
    if (countToCharge === 1) {
      if (hasNetflix) {
        // Regla 9: "Netflix añadida: PVP pack + 8,99€" (la TV ya la aporta el paquete base BTS)
        return VODAFONE_TV_AND_OTTS['vdf-addon-netflix-added'].price; // 8.99€
      }
      if (selectedOtts.includes('prime')) {
        return 4; // Prime añadido (+4€/mes sin duplicar TV de 5€)
      }
      if (selectedOtts.includes('disney') || selectedOtts.includes('hbo_max')) {
        return 6; // Disney o HBO añadido (+6€/mes sin duplicar TV de 5€ = 11€ total)
      }
    }
  }

  // Caso 1 OTT (Standalone o sin TV previa)
  if (countToCharge === 1) {
    if (hasNetflix) {
      return VODAFONE_TV_AND_OTTS['vdf-tv-netflix-standalone'].price; // 13.99€ (TV incluida)
    }
    if (selectedOtts.includes('prime')) {
      return VODAFONE_TV_AND_OTTS['vdf-tv-prime'].price; // 9€ (TV incluida)
    }
    if (selectedOtts.includes('disney')) {
      return VODAFONE_TV_AND_OTTS['vdf-tv-disney'].price; // 11€ (TV incluida)
    }
    if (selectedOtts.includes('hbo_max')) {
      return VODAFONE_TV_AND_OTTS['vdf-tv-hbo'].price; // 11€ (TV incluida)
    }
  }

  // Caso 2 OTTs
  if (countToCharge === 2) {
    if (hasNetflix) {
      // Regla 9: "Netflix añadida: PVP pack + 8,99€"
      // Si la otra es Prime (9€): 9 + 8.99 = 17.99€
      // Si la otra es Disney o HBO (11€): 11 + 8.99 = 19.99€
      const otherIsPrime = selectedOtts.includes('prime');
      const basePackPrice = otherIsPrime ? 9 : 11;
      return Math.round((basePackPrice + VODAFONE_TV_AND_OTTS['vdf-addon-netflix-added'].price) * 100) / 100;
    } else {
      // Pack 2 OTTs sin Netflix (ej. La familiar: Prime + Disney/HBO = 15€)
      return VODAFONE_TV_AND_OTTS['vdf-tv-2otts-familiar'].price; // 15€
    }
  }

  // Caso 3 OTTs
  if (countToCharge === 3) {
    if (hasNetflix) {
      // Regla 9: "Netflix añadida: PVP pack + 8,99€" sobre pack 2 OTTs (15€) = 23.99€
      return Math.round((VODAFONE_TV_AND_OTTS['vdf-tv-2otts-familiar'].price + VODAFONE_TV_AND_OTTS['vdf-addon-netflix-added'].price) * 100) / 100;
    }
    // Ejemplo La Completa oficial (Pág. 6): Total desde 1/1/27 = 91€, base + SN = 70€ => pack 3 OTTs = 21€
    return VODAFONE_TV_AND_OTTS['vdf-tv-3otts-completa'].price; // 21€
  }

  // Caso 4 OTTs (las 4 plataformas)
  if (countToCharge === 4) {
    // 3 OTTs (21€) + Netflix añadida (8.99€) = 29.99€
    return Math.round((VODAFONE_TV_AND_OTTS['vdf-tv-3otts-completa'].price + VODAFONE_TV_AND_OTTS['vdf-addon-netflix-added'].price) * 100) / 100;
  }

  return 0;
}

function createEmptyPeriods(): VodafoneCalculationResult['periods'] {
  const emptyBreakdown: VodafoneQuoteBreakdown = {
    periodLabel: '',
    basePrice: 0,
    tryAndPayDiscount: 0,
    specialPromoDiscount: 0,
    netBasePrice: 0,
    secureNetPrice: 0,
    totalWithSecureNet: 0,
    tvAndOttPrice: 0,
    decoderPrice: 0,
    daznPrice: 0,
    additionalLinesPrice: 0,
    totalPrice: 0
  };
  return {
    months1to3: { ...emptyBreakdown },
    months4toDec2026: { ...emptyBreakdown },
    from2027: { ...emptyBreakdown }
  };
}
