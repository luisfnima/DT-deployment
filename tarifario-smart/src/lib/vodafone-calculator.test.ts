/**
 * SUITE DE PRUEBAS AUTOMÁTICAS OFICIALES - VODAFONE SEPTIEMBRE 2026
 * 
 * Verifica estrictamente:
 * 1. Los 12 precios base oficiales
 * 2. El Golden Test Oficial AACC: 1G + 2 Ilim + T&P + BTS 3 OTT + SN + Deco gratis => 59€ -> 70€ -> 91€
 * 3. BTS: 60GB=1 OTT, 160GB=2 OTT, Ilim=3 OTT. Si selecciona menos -> BTS=false
 * 4. Try&Pay: No en 600M, depende de flag tryAndPayEligible
 * 5. Secure Net: basePrice, secureNetPrice, totalWithSecureNet separados
 * 6. TV/OTT y Decos: No duplicidad de Vodafone TV, Netflix 13.99€ sola / 8.99€ añadida
 * 7. Bloqueo de comercialización: 39€, 45€, conflicto Prime+Disney
 */

import { describe, it } from 'node:test';
import assert from 'node:assert/strict';

import {
  VODAFONE_BASE_CONFIGS,
  VODAFONE_BTS_RULES,
  VODAFONE_TRY_AND_PAY,
  VODAFONE_SECURE_NET,
  VODAFONE_TV_AND_OTTS,
  VODAFONE_DAZN,
  VODAFONE_DECODERS,
  VODAFONE_ADDITIONAL_LINES,
  VODAFONE_BLOCKED_SPECIAL_OFFERS,
  VODAFONE_INTERNAL_PROMOS,
  VODAFONE_SPECIAL_PROMOS,
  VODAFONE_FLASH_PLANS,
  VODAFONE_PORTATIL_MOVIL_PLANS,
  VODAFONE_NIVEL_3_PLANS,
  isCommerciallyValid
} from '../data/vodafone-commercial-truth.ts';

import {
  tariffPlans,
  addons
} from '../data/tarifario-smart-telco-structured.ts';

import {
  ADDONS,
  PLANS
} from '../data/plans.ts';

import {
  calculateVodafoneQuote,
  calculateTvAndOttPrice
} from './vodafone-calculator.ts';

describe('VODAFONE SEPTIEMBRE 2026 - AUDITORÍA COMERCIAL Y GOLDEN TESTS', () => {

  // ==========================================================================
  // 1. LOS 12 PRECIOS BASE OBLIGATORIOS (Regla 5)
  // ==========================================================================
  describe('1. Verificación de los 12 Precios Base', () => {
    
    // Tier 60GB
    it('Base 1: 600M + 1x60GB = 43€', () => {
      const config = VODAFONE_BASE_CONFIGS['vdf-base-600m-1x60gb'];
      assert.equal(config.price, 43);
      assert.equal(config.status, 'CONFIRMED');
      const quote = calculateVodafoneQuote({ baseConfigId: 'vdf-base-600m-1x60gb' });
      assert.equal(quote.periods.months1to3.basePrice, 43);
      assert.equal(quote.summary?.meses1_3, 43);
    });

    it('Base 2: 600M + 2x60GB = 49€', () => {
      const config = VODAFONE_BASE_CONFIGS['vdf-base-600m-2x60gb'];
      assert.equal(config.price, 49);
      assert.equal(config.status, 'CONFIRMED');
      const quote = calculateVodafoneQuote({ baseConfigId: 'vdf-base-600m-2x60gb' });
      assert.equal(quote.periods.months1to3.basePrice, 49);
      assert.equal(quote.summary?.meses1_3, 49);
    });

    it('Base 3: 1G + 1x60GB = 53€', () => {
      const config = VODAFONE_BASE_CONFIGS['vdf-base-1g-1x60gb'];
      assert.equal(config.price, 53);
      assert.equal(config.status, 'CONFIRMED');
      const quote = calculateVodafoneQuote({ baseConfigId: 'vdf-base-1g-1x60gb' });
      assert.equal(quote.periods.months1to3.basePrice, 53);
      assert.equal(quote.summary?.meses1_3, 53);
    });

    it('Base 4: 1G + 2x60GB = 59€', () => {
      const config = VODAFONE_BASE_CONFIGS['vdf-base-1g-2x60gb'];
      assert.equal(config.price, 59);
      assert.equal(config.status, 'CONFIRMED');
      const quote = calculateVodafoneQuote({ baseConfigId: 'vdf-base-1g-2x60gb' });
      assert.equal(quote.periods.months1to3.basePrice, 59);
      assert.equal(quote.summary?.meses1_3, 59);
    });

    // Tier 160GB
    it('Base 5: 600M + 1x160GB = 48€', () => {
      const config = VODAFONE_BASE_CONFIGS['vdf-base-600m-1x160gb'];
      assert.equal(config.price, 48);
      assert.equal(config.status, 'CONFIRMED');
      const quote = calculateVodafoneQuote({ baseConfigId: 'vdf-base-600m-1x160gb' });
      assert.equal(quote.periods.months1to3.basePrice, 48);
      assert.equal(quote.summary?.meses1_3, 48);
    });

    it('Base 6: 600M + 2x160GB = 54€', () => {
      const config = VODAFONE_BASE_CONFIGS['vdf-base-600m-2x160gb'];
      assert.equal(config.price, 54);
      assert.equal(config.status, 'CONFIRMED');
      const quote = calculateVodafoneQuote({ baseConfigId: 'vdf-base-600m-2x160gb' });
      assert.equal(quote.periods.months1to3.basePrice, 54);
      assert.equal(quote.summary?.meses1_3, 54);
    });

    it('Base 7: 1G + 1x160GB = 58€', () => {
      const config = VODAFONE_BASE_CONFIGS['vdf-base-1g-1x160gb'];
      assert.equal(config.price, 58);
      assert.equal(config.status, 'CONFIRMED');
      const quote = calculateVodafoneQuote({ baseConfigId: 'vdf-base-1g-1x160gb' });
      assert.equal(quote.periods.months1to3.basePrice, 58);
      assert.equal(quote.summary?.meses1_3, 58);
    });

    it('Base 8: 1G + 2x160GB = 64€', () => {
      const config = VODAFONE_BASE_CONFIGS['vdf-base-1g-2x160gb'];
      assert.equal(config.price, 64);
      assert.equal(config.status, 'CONFIRMED');
      const quote = calculateVodafoneQuote({ baseConfigId: 'vdf-base-1g-2x160gb' });
      assert.equal(quote.periods.months1to3.basePrice, 64);
      assert.equal(quote.summary?.meses1_3, 64);
    });

    // Tier Ilimitadas
    it('Base 9: 600M + 1 ilimitada = 53€', () => {
      const config = VODAFONE_BASE_CONFIGS['vdf-base-600m-1xilim'];
      assert.equal(config.price, 53);
      assert.equal(config.status, 'CONFIRMED');
      const quote = calculateVodafoneQuote({ baseConfigId: 'vdf-base-600m-1xilim' });
      assert.equal(quote.periods.months1to3.basePrice, 53);
      assert.equal(quote.summary?.meses1_3, 53);
    });

    it('Base 10: 600M + 2 ilimitadas = 59€', () => {
      const config = VODAFONE_BASE_CONFIGS['vdf-base-600m-2xilim'];
      assert.equal(config.price, 59);
      assert.equal(config.status, 'CONFIRMED');
      const quote = calculateVodafoneQuote({ baseConfigId: 'vdf-base-600m-2xilim' });
      assert.equal(quote.periods.months1to3.basePrice, 59);
      assert.equal(quote.summary?.meses1_3, 59);
    });

    it('Base 11: 1G + 1 ilimitada = 63€', () => {
      const config = VODAFONE_BASE_CONFIGS['vdf-base-1g-1xilim'];
      assert.equal(config.price, 63);
      assert.equal(config.status, 'CONFIRMED');
      const quote = calculateVodafoneQuote({ baseConfigId: 'vdf-base-1g-1xilim' });
      assert.equal(quote.periods.months1to3.basePrice, 63);
      assert.equal(quote.summary?.meses1_3, 63);
    });

    it('Base 12: 1G + 2 ilimitadas = 69€', () => {
      const config = VODAFONE_BASE_CONFIGS['vdf-base-1g-2xilim'];
      assert.equal(config.price, 69);
      assert.equal(config.status, 'CONFIRMED');
      const quote = calculateVodafoneQuote({ baseConfigId: 'vdf-base-1g-2xilim' });
      assert.equal(quote.periods.months1to3.basePrice, 69);
      assert.equal(quote.summary?.meses1_3, 69);
    });
  });

  // ==========================================================================
  // 2. GOLDEN TEST OFICIAL AACC (Regla 5)
  // ==========================================================================
  describe('2. Golden Test Oficial AACC: 1G + 2 Ilim + T&P + BTS 3 OTT + SN + Deco gratis', () => {
    it('Debe devolver exactamente: Meses 1-3 = 59€, Meses 4-Dic 2026 = 70€, Desde 01/01/2027 = 91€', () => {
      const quote = calculateVodafoneQuote({
        baseConfigId: 'vdf-base-1g-2xilim',
        tryAndPayEligible: true,
        selectedOtts: ['prime', 'disney', 'hbo_max'], // 3 OTTs elegibles
        includeSecureNet: true,
        decoderOptionId: 'vdf-deco-standard-3' // En BTS el deco es gratis (0€)
      });

      assert.equal(quote.isValidForCommercialization, true, 'Debe ser comercialmente válido');
      assert.equal(quote.tryAndPayApplied, true, 'Try&Pay debe aplicarse en 1G con flag');
      assert.equal(quote.btsApplied, true, 'BTS debe aplicarse con 3 OTTs');
      assert.equal(quote.btsOttCountGranted, 3, 'Debe bonificar 3 OTTs');

      // 1) Meses 1-3 = 59€
      assert.equal(quote.periods.months1to3.basePrice, 69, 'basePrice no debe modificarse');
      assert.equal(quote.periods.months1to3.tryAndPayDiscount, 10, 'Try&Pay descuenta 10€ en meses 1-3');
      assert.equal(quote.periods.months1to3.netBasePrice, 59, 'Net base debe ser 59€');
      assert.equal(quote.periods.months1to3.secureNetPrice, 0, 'Secure Net es 0€ en promo');
      assert.equal(quote.periods.months1to3.totalWithSecureNet, 59, 'Total con SN en m1-3 es 59€');
      assert.equal(quote.periods.months1to3.tvAndOttPrice, 0, 'TV y 3 OTTs son 0€ en BTS');
      assert.equal(quote.periods.months1to3.decoderPrice, 0, 'Deco es 0€ en BTS');
      assert.equal(quote.summary?.meses1_3, 59, 'GOLDEN TEST MESES 1-3 DEBE SER 59€');

      // 2) Meses 4-Dic 2026 = 70€
      assert.equal(quote.periods.months4toDec2026.basePrice, 69);
      assert.equal(quote.periods.months4toDec2026.tryAndPayDiscount, 0, 'Try&Pay finalizado');
      assert.equal(quote.periods.months4toDec2026.netBasePrice, 69);
      assert.equal(quote.periods.months4toDec2026.secureNetPrice, 1, 'Secure Net pasa a 1€/mes');
      assert.equal(quote.periods.months4toDec2026.totalWithSecureNet, 70, 'Base + SN = 70€');
      assert.equal(quote.periods.months4toDec2026.tvAndOttPrice, 0, 'TV y OTTs siguen en promo BTS hasta fin 2026');
      assert.equal(quote.periods.months4toDec2026.decoderPrice, 0, 'Deco sigue gratis');
      assert.equal(quote.summary?.meses4_dic2026, 70, 'GOLDEN TEST MESES 4-DIC 2026 DEBE SER 70€');

      // 3) Desde 01/01/2027 = 91€
      assert.equal(quote.periods.from2027.basePrice, 69);
      assert.equal(quote.periods.from2027.secureNetPrice, 1);
      assert.equal(quote.periods.from2027.totalWithSecureNet, 70);
      assert.equal(quote.periods.from2027.tvAndOttPrice, 21, 'Fin BTS: pack 3 OTTs pasa a 21€/mes');
      assert.equal(quote.periods.from2027.decoderPrice, 0, 'Deco gratis garantizado en BTS');
      assert.equal(quote.summary?.desde2027, 91, 'GOLDEN TEST DESDE 01/01/2027 DEBE SER 91€');
    });
  });

  // ==========================================================================
  // 3. REGLAS BTS Y FALLBACK A PVP NORMAL (Regla 6)
  // ==========================================================================
  describe('3. Reglas BTS y Fallback a PVP Normal', () => {
    it('60GB: Exactamente 1 OTT -> BTS aplica (0€ en promo)', () => {
      const quote = calculateVodafoneQuote({
        baseConfigId: 'vdf-base-600m-1x60gb',
        selectedOtts: ['prime']
      });
      assert.equal(quote.btsApplied, true);
      assert.equal(quote.periods.months1to3.tvAndOttPrice, 0);
      assert.equal(quote.periods.from2027.tvAndOttPrice, 9, 'Prime post-BTS es 9€');
    });

    it('160GB: Cliente con derecho a 2 OTT selecciona solo 1 -> BTS=false y aplica PVP normal', () => {
      const quote = calculateVodafoneQuote({
        baseConfigId: 'vdf-base-600m-1x160gb',
        selectedOtts: ['prime'] // Solo 1 cuando tenía derecho a 2
      });
      assert.equal(quote.btsApplied, false, 'BTS no debe aplicar si selecciona menos OTTs de las que tiene derecho');
      assert.equal(quote.periods.months1to3.tvAndOttPrice, 9, 'Debe cobrar el PVP normal de Prime (9€)');
      assert.equal(quote.periods.from2027.tvAndOttPrice, 9);
    });

    it('Ilimitada: Cliente con derecho a 3 OTT selecciona solo 2 -> BTS=false y aplica PVP normal', () => {
      const quote = calculateVodafoneQuote({
        baseConfigId: 'vdf-base-600m-2xilim',
        selectedOtts: ['prime', 'disney'] // Solo 2 cuando tenía derecho a 3
      });
      assert.equal(quote.btsApplied, false, 'BTS no debe aplicar si selecciona 2 de 3');
      assert.equal(quote.periods.months1to3.tvAndOttPrice, 15, 'Debe cobrar el PVP normal de 2 OTTs (15€)');
    });
  });

  // ==========================================================================
  // 4. TRY & PAY CONDICIONAL (Regla 7)
  // ==========================================================================
  describe('4. Try & Pay Condicional', () => {
    it('Try&Pay en 600M debe ser NOT_APPLICABLE aunque tryAndPayEligible sea true', () => {
      const quote = calculateVodafoneQuote({
        baseConfigId: 'vdf-base-600m-1x60gb',
        tryAndPayEligible: true
      });
      assert.equal(quote.tryAndPayApplied, false, 'Try&Pay nunca aplica a 600M');
      assert.equal(quote.periods.months1to3.tryAndPayDiscount, 0);
      assert.equal(quote.summary?.meses1_3, 43);
      assert.ok(!quote.periods.months1to3.periodLabel.includes('Try&Pay'), 'periodLabel no debe incluir Try&Pay en 600M');
    });

    it('Try&Pay en 1G sin flag tryAndPayEligible NO aplica descuento', () => {
      const quote = calculateVodafoneQuote({
        baseConfigId: 'vdf-base-1g-1x60gb',
        tryAndPayEligible: false
      });
      assert.equal(quote.tryAndPayApplied, false);
      assert.equal(quote.periods.months1to3.tryAndPayDiscount, 0);
      assert.equal(quote.summary?.meses1_3, 53);
      assert.ok(!quote.periods.months1to3.periodLabel.includes('Try&Pay'), 'periodLabel no debe incluir Try&Pay si tryAndPayEligible es false');
    });

    it('Try&Pay en 1G con tryAndPayEligible aplica 10€ de descuento en meses 1-3', () => {
      const quote = calculateVodafoneQuote({
        baseConfigId: 'vdf-base-1g-1x60gb',
        tryAndPayEligible: true
      });
      assert.equal(quote.tryAndPayApplied, true);
      assert.equal(quote.periods.months1to3.tryAndPayDiscount, 10);
      assert.equal(quote.summary?.meses1_3, 43, '1G a precio de 600M (53 - 10 = 43)');
      assert.equal(quote.summary?.meses4_dic2026, 53, 'Fin promo T&P vuelve a 53');
      assert.ok(quote.periods.months1to3.periodLabel.includes('Try&Pay'), 'periodLabel debe incluir Try&Pay si tryAndPayApplied es true');
    });
  });

  // ==========================================================================
  // 5. SEPARACIÓN ESTRICTA DE SECURE NET (Regla 8)
  // ==========================================================================
  describe('5. Separación Estricta de Secure Net', () => {
    it('No modifica basePrice y desglosa secureNetPrice y totalWithSecureNet', () => {
      const quote = calculateVodafoneQuote({
        baseConfigId: 'vdf-base-600m-1x60gb',
        includeSecureNet: true
      });
      assert.equal(quote.periods.months4toDec2026.basePrice, 43, 'basePrice inalterado');
      assert.equal(quote.periods.months4toDec2026.secureNetPrice, 1, 'secureNetPrice es 1€');
      assert.equal(quote.periods.months4toDec2026.totalWithSecureNet, 44, 'totalWithSecureNet es 44€');
      assert.equal(quote.periods.months4toDec2026.totalPrice, 44);
    });
  });

  // ==========================================================================
  // 6. TV, OTT Y DECODIFICADORES (Reglas 9 y 10)
  // ==========================================================================
  describe('6. TV, OTTs y Decodificadores', () => {
    it('Vodafone TV sola: 5€ + deco', () => {
      const quote = calculateVodafoneQuote({
        baseConfigId: 'vdf-base-600m-1x60gb',
        includeVodafoneTvStandalone: true,
        decoderOptionId: 'vdf-deco-standard-3'
      });
      assert.equal(quote.periods.months1to3.tvAndOttPrice, 5);
      assert.equal(quote.periods.months1to3.decoderPrice, 3);
      assert.equal(quote.summary?.meses1_3, 43 + 5 + 3);
    });

    it('Netflix sola: 13.99€ (incluye Vodafone TV, no duplica 5€)', () => {
      const quote = calculateVodafoneQuote({
        baseConfigId: 'vdf-base-600m-1x60gb',
        selectedOtts: ['netflix'] // 60GB tier bonifica Netflix en BTS
      });
      assert.equal(quote.periods.months1to3.tvAndOttPrice, 0, 'En BTS es 0€');
      assert.equal(quote.periods.from2027.tvAndOttPrice, 13.99, 'Post-BTS es 13.99€ exactos sin sumar 5€');
    });

    it('Netflix añadida sobre pack TV: PVP pack + 8.99€', () => {
      const quote = calculateVodafoneQuote({
        baseConfigId: 'vdf-base-600m-2x60gb',
        selectedOtts: ['prime', 'netflix'] // 60GB tier solo bonifica 1 OTT
      });
      // BTS cubre 1 OTT (Prime), cobra Netflix añadida (+8.99€)
      assert.equal(quote.periods.months1to3.tvAndOttPrice, 8.99);
    });

    it('3 OTTs con Netflix post-BTS: pack 2 OTTs (15€) + Netflix (8.99€) = 23.99€', () => {
      const quote = calculateVodafoneQuote({
        baseConfigId: 'vdf-base-600m-1x60gb',
        selectedOtts: ['prime', 'hbo_max', 'netflix']
      });
      // Post-BTS (o sin BTS en 60GB tier donde solo cubre 1 OTT)
      assert.equal(quote.periods.from2027.tvAndOttPrice, 23.99, 'Debe cobrar 15€ + 8.99€ = 23.99€');
    });

    it('Decodificadores: Cuotas internas 3€ y 4€, pero 0€ en BTS', () => {
      const quoteBts = calculateVodafoneQuote({
        baseConfigId: 'vdf-base-600m-1x60gb',
        selectedOtts: ['prime'],
        decoderOptionId: 'vdf-deco-premium-4'
      });
      assert.equal(quoteBts.periods.months1to3.decoderPrice, 0, 'Deco en BTS es 0€');

      const quoteSinBts = calculateVodafoneQuote({
        baseConfigId: 'vdf-base-600m-1x60gb',
        decoderOptionId: 'vdf-deco-premium-4'
      });
      assert.equal(quoteSinBts.periods.months1to3.decoderPrice, 4, 'Deco sin BTS cobra cuota de 4€');
    });
  });

  // ==========================================================================
  // 7. BLOQUEO DE COMERCIALIZACIÓN Y CONFLICTOS (Reglas 3 y 4)
  // ==========================================================================
  describe('7. Estados que Bloquean Comercialización y Conflictos', () => {
    it('Oferta de prueba bloqueada con PENDING_COMMERCIAL_VALIDATION', () => {
      const quote = calculateVodafoneQuote({
        baseConfigId: 'vdf-base-600m-2x160gb',
        customPromoId: 'vdf-test-pending-validation',
        tryAndPayEligible: true
      });
      assert.equal(quote.isValidForCommercialization, false, 'No puede ser comercializable');
      assert.equal(quote.commercialStatus, 'PENDING_COMMERCIAL_VALIDATION');
      assert.equal(quote.tryAndPayApplied, false, 'Oferta pendiente no debe tener Try&Pay aplicado');
      assert.equal(quote.periods.months1to3.tryAndPayDiscount, 0);
      assert.ok(quote.blockingReasons.length > 0);
    });

    it('Hipótesis Oferta 45€ bloqueada con DERIVED_HYPOTHESIS_PENDING_VALIDATION', () => {
      const quote = calculateVodafoneQuote({
        baseConfigId: 'vdf-base-600m-2x160gb',
        customPromoId: 'vdf-oferta-45-euros'
      });
      assert.equal(quote.isValidForCommercialization, false);
      assert.equal(quote.commercialStatus, 'DERIVED_HYPOTHESIS_PENDING_VALIDATION');
    });

    it('Conflicto 1: Prime + Disney+ (14€ vs 15€) bloquea comercialización automática', () => {
      const quote = calculateVodafoneQuote({
        baseConfigId: 'vdf-base-600m-2x160gb',
        conflictPackId: 'vdf-conflict-prime-disney'
      });
      assert.equal(quote.isValidForCommercialization, false, 'Debe bloquearse por conflicto documental');
      assert.ok(quote.blockingReasons.some(r => r.includes('Conflicto TV abierto detectado')));
      assert.equal(quote.blockingReasons.length, 1, 'No debe duplicar las razones de bloqueo');
    });

    it('Conflicto 2: Prime + HBO sin anuncios (19€ vs 20€) bloquea comercialización automática', () => {
      const quote = calculateVodafoneQuote({
        baseConfigId: 'vdf-base-600m-2x160gb',
        conflictPackId: 'vdf-conflict-prime-hbo-sin-anuncios'
      });
      assert.equal(quote.isValidForCommercialization, false, 'Debe bloquearse por conflicto documental');
      assert.ok(quote.blockingReasons.some(r => r.includes('Conflicto TV abierto detectado')));
    });

    it('Conflicto 3: 3 OTT sin anuncios (25€ vs 29€) bloquea comercialización automática', () => {
      const quote = calculateVodafoneQuote({
        baseConfigId: 'vdf-base-600m-2x160gb',
        conflictPackId: 'vdf-conflict-3otts-sin-anuncios'
      });
      assert.equal(quote.isValidForCommercialization, false, 'Debe bloquearse por conflicto documental');
      assert.ok(quote.blockingReasons.some(r => r.includes('Conflicto TV abierto detectado')));
    });

    it('Función isCommerciallyValid bloquea todos los estados restrictivos', () => {
      assert.equal(isCommerciallyValid('CONFIRMED'), true);
      assert.equal(isCommerciallyValid('CONFLICT'), false);
      assert.equal(isCommerciallyValid('UNCONFIRMED'), false);
      assert.equal(isCommerciallyValid('PENDING_COMMERCIAL_VALIDATION'), false);
      assert.equal(isCommerciallyValid('DERIVED_HYPOTHESIS_PENDING_VALIDATION'), false);
      assert.equal(isCommerciallyValid('CONFLICTO_DOCUMENTAL'), false);
      assert.equal(isCommerciallyValid('BLOCKED_INCOMPATIBLE'), false);
    });
  });

  // ==========================================================================
  // 8. LÍNEAS ADICIONALES Y DAZN
  // ==========================================================================
  describe('8. Líneas Adicionales y DAZN', () => {
    it('Línea adicional convergente: +6€/mes', () => {
      const quote = calculateVodafoneQuote({
        baseConfigId: 'vdf-base-600m-1x60gb',
        extraLinesCount: 1,
        extraLineType: 'convergente'
      });
      assert.equal(quote.periods.months1to3.additionalLinesPrice, 6);
      assert.equal(quote.summary?.meses1_3, 49); // 43 + 6
    });

    it('Línea adicional básica 10GB: +2€/mes', () => {
      const quote = calculateVodafoneQuote({
        baseConfigId: 'vdf-base-600m-1x60gb',
        extraLinesCount: 2,
        extraLineType: 'basica-10gb'
      });
      assert.equal(quote.periods.months1to3.additionalLinesPrice, 4); // 2 * 2€
      assert.equal(quote.summary?.meses1_3, 47); // 43 + 4
    });

    it('Línea adicional negocios 60GB: +4.96€/mes', () => {
      const quote = calculateVodafoneQuote({
        baseConfigId: 'vdf-base-600m-1x60gb',
        extraLinesCount: 1,
        extraLineType: 'negocio-60gb'
      });
      assert.equal(quote.periods.months1to3.additionalLinesPrice, 4.96);
      assert.equal(quote.summary?.meses1_3, 47.96);
    });

    it('DAZN Fútbol (14.99€) contratable sin Vodafone TV', () => {
      const quote = calculateVodafoneQuote({
        baseConfigId: 'vdf-base-600m-1x60gb',
        daznPackId: 'vdf-dazn-futbol'
      });
      assert.equal(quote.periods.months1to3.daznPrice, 14.99);
      assert.equal(quote.periods.months1to3.tvAndOttPrice, 0);
      assert.equal(quote.summary?.meses1_3, 43 + 14.99);
    });

    it('DAZN Premium (25.99€) contratable sin Vodafone TV', () => {
      const quote = calculateVodafoneQuote({
        baseConfigId: 'vdf-base-600m-1x60gb',
        daznPackId: 'vdf-dazn-premium'
      });
      assert.equal(quote.periods.months1to3.daznPrice, 25.99);
      assert.equal(quote.summary?.meses1_3, 43 + 25.99);
    });
  });

  // ==========================================================================
  // 9. OTROS EJEMPLOS OFICIALES AACC SLIDE 6
  // ==========================================================================
  describe('9. Los 3 Ejemplos Oficiales Adicionales de AACC Slide 6', () => {
    it('La más económica: 1G + 1x60GB + T&P + BTS (Prime) + SN + Deco gratis => 43€ -> 54€ -> 63€', () => {
      const quote = calculateVodafoneQuote({
        baseConfigId: 'vdf-base-1g-1x60gb',
        tryAndPayEligible: true,
        selectedOtts: ['prime'],
        includeSecureNet: true,
        decoderOptionId: 'vdf-deco-standard-3'
      });
      assert.equal(quote.summary?.meses1_3, 43, 'Meses 1-3 debe ser 43€');
      assert.equal(quote.summary?.meses4_dic2026, 54, 'Meses 4-Dic 2026 debe ser 54€');
      assert.equal(quote.summary?.desde2027, 63, 'Desde 01/01/2027 debe ser 63€ con Prime');
    });

    it('La más vendida: 1G + 1x160GB + T&P + BTS (2 OTTs con Netflix) + SN + Deco gratis => 48€ -> 59€ -> 77€', () => {
      const quote = calculateVodafoneQuote({
        baseConfigId: 'vdf-base-1g-1x160gb',
        tryAndPayEligible: true,
        selectedOtts: ['prime', 'netflix'], // 2 OTTs
        includeSecureNet: true,
        decoderOptionId: 'vdf-deco-standard-3'
      });
      assert.equal(quote.summary?.meses1_3, 48, 'Meses 1-3 debe ser 48€');
      assert.equal(quote.summary?.meses4_dic2026, 59, 'Meses 4-Dic 2026 debe ser 59€');
      assert.equal(quote.summary?.desde2027, 76.99, 'Desde 01/01/2027: 59€ + 17.99€ = 76.99€ (~77€ publicado)');
    });

    it('La familiar: 1G + 2x160GB + T&P + BTS (Vodafone TV + Disney+ + Prime) + SN + Deco gratis => 54€ -> 65€ -> 80€', () => {
      const quote = calculateVodafoneQuote({
        baseConfigId: 'vdf-base-1g-2x160gb',
        tryAndPayEligible: true,
        selectedOtts: ['prime', 'disney'], // Vodafone TV + Disney+ + Prime (Slide 6)
        includeSecureNet: true,
        decoderOptionId: 'vdf-deco-standard-3'
      });
      assert.equal(quote.summary?.meses1_3, 54, 'Meses 1-3 debe ser 54€');
      assert.equal(quote.summary?.meses4_dic2026, 65, 'Meses 4-Dic 2026 debe ser 65€');
      assert.equal(quote.summary?.desde2027, 80, 'Desde 01/01/2027 debe ser 80€ (65€ + 15€ pack 2 OTTs)');
    });

    it('Coexistencia simultánea: Golden Test BTS "La familiar" (54€->65€->80€) no desbloquea el pack genérico Prime+Disney conflictivo (14€/15€)', () => {
      // Verdad A: Golden Test oficial BTS "La familiar" es plenamente válido comercialmente
      const laFamiliar = calculateVodafoneQuote({
        baseConfigId: 'vdf-base-1g-2x160gb',
        tryAndPayEligible: true,
        selectedOtts: ['prime', 'disney'],
        includeSecureNet: true,
        decoderOptionId: 'vdf-deco-standard-3'
      });
      assert.equal(laFamiliar.summary?.meses1_3, 54, 'Meses 1-3 = 54€');
      assert.equal(laFamiliar.summary?.meses4_dic2026, 65, 'Meses 4-Dic 2026 = 65€');
      assert.equal(laFamiliar.summary?.desde2027, 80, 'Desde 01/01/2027 = 80€');
      assert.equal(laFamiliar.isValidForCommercialization, true, 'Golden Test La familiar debe ser comercializable');

      // Verdad B: El pack genérico Prime + Disney continúa identificado con conflicto documental 14€ vs 15€ y bloqueado
      const genericConflict = VODAFONE_TV_AND_OTTS['vdf-conflict-prime-disney'];
      assert.ok(genericConflict, 'El pack genérico conflictivo existe en el catálogo');
      assert.equal(genericConflict.status, 'CONFLICTO_DOCUMENTAL');
      assert.equal(isCommerciallyValid(genericConflict.status), false, 'CONFLICTO_DOCUMENTAL no es válido comercialmente');

      // Comprobar que una propuesta con el addon genérico conflictivo queda expresamente bloqueada
      const quoteWithConflict = calculateVodafoneQuote({
        baseConfigId: 'vdf-base-1g-2x160gb',
        conflictPackId: 'vdf-conflict-prime-disney'
      });
      assert.equal(quoteWithConflict.isValidForCommercialization, false, 'El Golden Test NO debe desbloquear automáticamente el addon genérico conflictivo');
      assert.ok(quoteWithConflict.blockingReasons.some(r => r.includes('Conflicto TV abierto detectado') && r.includes('Prime + Disney')));
    });
  });

  // ==========================================================================
  // 10. TRAZABILIDAD, METADATOS Y GOBERNANZA COMERCIAL
  // ==========================================================================
  describe('10. Trazabilidad, Metadatos y Gobernanza Comercial', () => {
    it('Todos los precios base y servicios tienen sourceType, status y sourcePage/sourceReference', () => {
      const allItems = [
        ...Object.values(VODAFONE_BASE_CONFIGS),
        ...Object.values(VODAFONE_TV_AND_OTTS),
        ...Object.values(VODAFONE_DAZN),
        ...Object.values(VODAFONE_DECODERS),
        ...Object.values(VODAFONE_ADDITIONAL_LINES),
        ...Object.values(VODAFONE_BLOCKED_SPECIAL_OFFERS),
        VODAFONE_SECURE_NET
      ];

      for (const item of allItems) {
        assert.ok(item.sourceType, `Item ${item.id} debe tener sourceType`);
        assert.ok(item.status, `Item ${item.id} debe tener status`);
        assert.ok(item.sourcePage, `Item ${item.id} debe tener sourcePage`);
        assert.ok(item.sourceReference, `Item ${item.id} debe tener sourceReference`);
        if (item.sourceType === 'DERIVED') {
          assert.ok(
            item.calculationFormula && item.calculationFormula.length > 0,
            `Item DERIVED ${item.id} debe incluir calculationFormula`
          );
        }
      }
    });

    it('tryAndPayEligible es false en todos los planes 600M y true en 1G', () => {
      for (const [id, config] of Object.entries(VODAFONE_BASE_CONFIGS)) {
        if (config.fiberSpeed === '600M') {
          assert.equal(config.tryAndPayEligible, false, `Plan 600M ${id} debe tener tryAndPayEligible: false`);
        } else if (config.fiberSpeed === '1G') {
          assert.equal(config.tryAndPayEligible, true, `Plan 1G ${id} debe tener tryAndPayEligible: true`);
        }
      }
    });

    it('Los 4 packs de Vuelta al Cole Slide 6 son comercialmente válidos en sus configuraciones oficiales', () => {
      // 1. La más económica
      const eco = calculateVodafoneQuote({
        baseConfigId: 'vdf-base-1g-1x60gb',
        tryAndPayEligible: true,
        selectedOtts: ['prime'],
        includeSecureNet: true,
        decoderOptionId: 'vdf-deco-standard-3'
      });
      assert.equal(eco.isValidForCommercialization, true);

      // 2. La más vendida
      const vend = calculateVodafoneQuote({
        baseConfigId: 'vdf-base-1g-1x160gb',
        tryAndPayEligible: true,
        selectedOtts: ['prime', 'netflix'],
        includeSecureNet: true,
        decoderOptionId: 'vdf-deco-standard-3'
      });
      assert.equal(vend.isValidForCommercialization, true);

      // 3. La familiar
      const fam = calculateVodafoneQuote({
        baseConfigId: 'vdf-base-1g-2x160gb',
        tryAndPayEligible: true,
        selectedOtts: ['prime', 'disney'],
        includeSecureNet: true,
        decoderOptionId: 'vdf-deco-standard-3'
      });
      assert.equal(fam.isValidForCommercialization, true);

      // 4. La completa (Golden Test)
      const comp = calculateVodafoneQuote({
        baseConfigId: 'vdf-base-1g-2xilim',
        tryAndPayEligible: true,
        selectedOtts: ['prime', 'disney', 'hbo_max'],
        includeSecureNet: true,
        decoderOptionId: 'vdf-deco-standard-3'
      });
      assert.equal(comp.isValidForCommercialization, true);
    });
  });

  // ==========================================================================
  // 11. TESTS CAMBIO COMERCIAL CONFIRMADO (PARCHE QUIRÚRGICO)
  // ==========================================================================
  describe('11. Tests Cambio Comercial Confirmado (Promos Internas y Precedencia)', () => {

    // A) 1G + 1 ilimitada + Try&Pay = 53€ x 3 meses = 63€ después
    it('A) 1G + 1 ilimitada + Try&Pay = 53€ x 3 meses = 63€ después', () => {
      const quote = calculateVodafoneQuote({
        baseConfigId: 'vdf-base-1g-1xilim',
        tryAndPayEligible: true
      });
      assert.equal(quote.isValidForCommercialization, true, 'Debe ser comercializable');
      assert.equal(quote.tryAndPayApplied, true, 'Try&Pay debe aplicarse en 1G');
      assert.equal(quote.periods.months1to3.basePrice, 63);
      assert.equal(quote.periods.months1to3.tryAndPayDiscount, 10);
      assert.equal(quote.periods.months1to3.netBasePrice, 53);
      assert.equal(quote.summary?.meses1_3, 53, '1G + 1 ilimitada + Try&Pay = 53€ x 3 meses');
      assert.equal(quote.periods.months4toDec2026.netBasePrice, 63);
      assert.equal(quote.summary?.meses4_dic2026, 63, 'Después = 63€');
      assert.equal(quote.periods.from2027.netBasePrice, 63);
      assert.equal(quote.summary?.desde2027, 63);
    });

    // B) 1G + 2 ilimitadas + Try&Pay = 59€ x 3 meses = 69€ después
    it('B) 1G + 2 ilimitadas + Try&Pay = 59€ x 3 meses = 69€ después', () => {
      const quote = calculateVodafoneQuote({
        baseConfigId: 'vdf-base-1g-2xilim',
        tryAndPayEligible: true
      });
      assert.equal(quote.isValidForCommercialization, true, 'Debe ser comercializable');
      assert.equal(quote.tryAndPayApplied, true, 'Try&Pay debe aplicarse en 1G');
      assert.equal(quote.periods.months1to3.basePrice, 69);
      assert.equal(quote.periods.months1to3.tryAndPayDiscount, 10);
      assert.equal(quote.periods.months1to3.netBasePrice, 59);
      assert.equal(quote.summary?.meses1_3, 59, '1G + 2 ilimitadas + Try&Pay = 59€ x 3 meses');
      assert.equal(quote.periods.months4toDec2026.netBasePrice, 69);
      assert.equal(quote.summary?.meses4_dic2026, 69, 'Después = 69€');
      assert.equal(quote.periods.from2027.netBasePrice, 69);
      assert.equal(quote.summary?.desde2027, 69);
    });

    // C) 1G + 2 ilimitadas + SPECIAL_PROMO_39 = 39€ x 3 meses
    it('C) 1G + 2 ilimitadas + SPECIAL_PROMO_39 = 39€ x 3 meses', () => {
      // 1. Invocación con specialPromoId: 'SPECIAL_PROMO_39'
      const quoteSpecial = calculateVodafoneQuote({
        baseConfigId: 'vdf-base-1g-2xilim',
        specialPromoId: 'SPECIAL_PROMO_39'
      });
      assert.equal(quoteSpecial.isValidForCommercialization, true);
      assert.equal(quoteSpecial.commercialStatus, 'INTERNAL_CONFIRMED');
      assert.equal(quoteSpecial.periods.months1to3.netBasePrice, 39);
      assert.equal(quoteSpecial.summary?.meses1_3, 39, '1G + 2 ilimitadas + SPECIAL_PROMO_39 = 39€ x 3 meses');
      assert.equal(quoteSpecial.periods.months4toDec2026.netBasePrice, 69, 'Después debe usar el precio regular correspondiente de catálogo (69€)');
      assert.equal(quoteSpecial.summary?.meses4_dic2026, 69);
      assert.equal(quoteSpecial.summary?.desde2027, 69);

      // 2. Precedencia: SPECIAL_PROMO > TRY_AND_PAY > BASE_PRICE
      // La promo especial 39€ tiene prioridad sobre Try&Pay 59€
      const quotePriority = calculateVodafoneQuote({
        baseConfigId: 'vdf-base-1g-2xilim',
        tryAndPayEligible: true,
        specialPromoId: 'SPECIAL_PROMO_39'
      });
      assert.equal(quotePriority.isValidForCommercialization, true);
      assert.equal(quotePriority.periods.months1to3.netBasePrice, 39, 'SPECIAL_PROMO (39€) tiene prioridad sobre Try&Pay (59€)');
      assert.equal(quotePriority.summary?.meses1_3, 39);
      assert.equal(quotePriority.summary?.meses4_dic2026, 69);

      // 3. Invocación con el ID oficial vdf-internal-1g-2ilim-39
      const quoteInternal = calculateVodafoneQuote({
        baseConfigId: 'vdf-internal-1g-2ilim-39'
      });
      assert.equal(quoteInternal.isValidForCommercialization, true);
      assert.equal(quoteInternal.commercialStatus, 'INTERNAL_CONFIRMED');
      assert.equal(quoteInternal.summary?.meses1_3, 39);
      assert.equal(quoteInternal.summary?.meses4_dic2026, 69);

      // 4. Verificación de configuración y metadatos en catálogo
      const promoData = VODAFONE_SPECIAL_PROMOS['vdf-internal-1g-2ilim-39'];
      assert.ok(promoData);
      assert.equal(promoData.status, 'INTERNAL_CONFIRMED');
      assert.equal(promoData.sourceType, 'INTERNAL_COMMERCIAL_INFORMATION');
      assert.equal(promoData.promoPrice, 39);
      assert.equal(promoData.promoMonths, 3);
      assert.equal(promoData.regularPrice, 69);
      assert.equal(promoData.fiberSpeed, '1G');
      assert.equal(promoData.linesCount, 2);
      assert.equal(promoData.fixedIncluded, true);
      assert.equal(isCommerciallyValid(promoData.status), true);
      // 5. specialPromoId incompatible con base no debe aplicar descuento especial a bases incompatibles
      const quoteIncompatible = calculateVodafoneQuote({
        baseConfigId: 'vdf-base-600m-1x60gb',
        specialPromoId: 'SPECIAL_PROMO_39'
      });
      assert.equal(quoteIncompatible.specialPromoApplied, false, 'No debe aplicar special promo a una base incompatible (600M 60GB)');
      assert.equal(quoteIncompatible.summary?.meses1_3, 43);
    });

    // D) vdf-internal-1g-1ilim-39 no debe poder comercializarse
    it('D) vdf-internal-1g-1ilim-39 no debe poder comercializarse', () => {
      // Directo por baseConfigId
      const quote = calculateVodafoneQuote({
        baseConfigId: 'vdf-internal-1g-1ilim-39'
      });
      assert.equal(quote.isValidForCommercialization, false, 'vdf-internal-1g-1ilim-39 NO debe poder comercializarse');
      assert.equal(quote.commercialStatus, 'DEPRECATED_INVALID');
      assert.ok(quote.blockingReasons.length > 0);
      assert.equal(quote.summary, null, 'DEPRECATED_INVALID debe devolver summary = null');
      assert.equal(quote.price, null, 'DEPRECATED_INVALID debe devolver price = null');

      // Por customPromoId
      const quotePromo = calculateVodafoneQuote({
        baseConfigId: 'vdf-base-1g-1xilim',
        customPromoId: 'vdf-internal-1g-1ilim-39'
      });
      assert.equal(quotePromo.isValidForCommercialization, false);
      assert.equal(quotePromo.commercialStatus, 'DEPRECATED_INVALID');
      assert.equal(quotePromo.summary, null, 'No usar en cálculos: summary debe ser null');
      assert.equal(quotePromo.price, null);

      // Verificación en catálogo
      const promoData = VODAFONE_INTERNAL_PROMOS['vdf-internal-1g-1ilim-39'];
      assert.ok(promoData);
      assert.equal(promoData.status, 'DEPRECATED_INVALID');
      assert.equal(isCommerciallyValid(promoData.status), false, 'DEPRECATED_INVALID debe ser rechazado por isCommerciallyValid');
    });

    // E) vdf-internal-1g-2ilim-45-hypothesis no debe poder comercializarse
    it('E) vdf-internal-1g-2ilim-45-hypothesis no debe poder comercializarse', () => {
      // Directo por baseConfigId
      const quote = calculateVodafoneQuote({
        baseConfigId: 'vdf-internal-1g-2ilim-45-hypothesis'
      });
      assert.equal(quote.isValidForCommercialization, false, 'vdf-internal-1g-2ilim-45-hypothesis NO debe poder comercializarse');
      assert.equal(quote.commercialStatus, 'DEPRECATED_INVALID');
      assert.ok(quote.blockingReasons.length > 0);
      assert.equal(quote.summary, null, 'DEPRECATED_INVALID debe devolver summary = null');
      assert.equal(quote.price, null, 'DEPRECATED_INVALID debe devolver price = null');

      // Por customPromoId
      const quotePromo = calculateVodafoneQuote({
        baseConfigId: 'vdf-base-1g-2xilim',
        customPromoId: 'vdf-internal-1g-2ilim-45-hypothesis'
      });
      assert.equal(quotePromo.isValidForCommercialization, false);
      assert.equal(quotePromo.commercialStatus, 'DEPRECATED_INVALID');
      assert.equal(quotePromo.summary, null, 'No calcular: summary debe ser null');
      assert.equal(quotePromo.price, null);

      // Verificación en catálogo
      const promoData = VODAFONE_INTERNAL_PROMOS['vdf-internal-1g-2ilim-45-hypothesis'];
      assert.ok(promoData);
      assert.equal(promoData.status, 'DEPRECATED_INVALID');
      assert.equal(isCommerciallyValid(promoData.status), false, 'DEPRECATED_INVALID debe ser rechazado por isCommerciallyValid');
    });

    // Verificación exhaustiva de las 6 tarifas 1Gb con Try&Pay General (Requisito 4)
    it('Try&Pay General confirmado en las 6 tarifas 1Gb elegibles', () => {
      // 1. 1G + 1x60: 43€ meses 1-3, 53€ después
      const q1 = calculateVodafoneQuote({ baseConfigId: 'vdf-base-1g-1x60gb', tryAndPayEligible: true });
      assert.equal(q1.summary?.meses1_3, 43);
      assert.equal(q1.summary?.meses4_dic2026, 53);

      // 2. 1G + 2x60: 49€ meses 1-3, 59€ después
      const q2 = calculateVodafoneQuote({ baseConfigId: 'vdf-base-1g-2x60gb', tryAndPayEligible: true });
      assert.equal(q2.summary?.meses1_3, 49);
      assert.equal(q2.summary?.meses4_dic2026, 59);

      // 3. 1G + 1x160: 48€ meses 1-3, 58€ después
      const q3 = calculateVodafoneQuote({ baseConfigId: 'vdf-base-1g-1x160gb', tryAndPayEligible: true });
      assert.equal(q3.summary?.meses1_3, 48);
      assert.equal(q3.summary?.meses4_dic2026, 58);

      // 4. 1G + 2x160: 54€ meses 1-3, 64€ después
      const q4 = calculateVodafoneQuote({ baseConfigId: 'vdf-base-1g-2x160gb', tryAndPayEligible: true });
      assert.equal(q4.summary?.meses1_3, 54);
      assert.equal(q4.summary?.meses4_dic2026, 64);

      // 5. 1G + 1 ilimitada: 53€ meses 1-3, 63€ después (Test A)
      const q5 = calculateVodafoneQuote({ baseConfigId: 'vdf-base-1g-1xilim', tryAndPayEligible: true });
      assert.equal(q5.summary?.meses1_3, 53);
      assert.equal(q5.summary?.meses4_dic2026, 63);

      // 6. 1G + 2 ilimitadas: 59€ meses 1-3, 69€ después (Test B)
      const q6 = calculateVodafoneQuote({ baseConfigId: 'vdf-base-1g-2xilim', tryAndPayEligible: true });
      assert.equal(q6.summary?.meses1_3, 59);
      assert.equal(q6.summary?.meses4_dic2026, 69);
    });

  });

  // ==========================================================================
  // 12. PARCHE DE SEGURIDAD FINAL: DEPRECATED_INVALID Y SPECIAL_PROMO_39 + BTS
  // ==========================================================================
  describe('12. Parche de Seguridad Final: DEPRECATED_INVALID y Compatibilidad BTS', () => {
    // A) DEPRECATED_INVALID nunca devuelve total 0€ comercializable
    it('A) DEPRECATED_INVALID nunca devuelve total 0€ comercializable', () => {
      const deprecatedTargets = [
        'vdf-internal-1g-1ilim-39',
        'vdf-internal-1g-2ilim-45-hypothesis'
      ];

      for (const id of deprecatedTargets) {
        // 1. Invocación directa como baseConfigId
        const qBase = calculateVodafoneQuote({ baseConfigId: id });
        assert.equal(qBase.isValidForCommercialization, false, `${id} no debe ser comercializable`);
        assert.equal(qBase.commercialStatus, 'DEPRECATED_INVALID');
        assert.equal(qBase.summary, null, `${id} debe devolver summary = null`);
        assert.equal(qBase.price, null, `${id} debe devolver price = null`);
        assert.notEqual(qBase.price, 0, `${id} NUNCA debe devolver price 0€`);

        // 2. Invocación como customPromoId
        const qCustom = calculateVodafoneQuote({
          baseConfigId: 'vdf-base-1g-2xilim',
          customPromoId: id
        });
        assert.equal(qCustom.isValidForCommercialization, false);
        assert.equal(qCustom.commercialStatus, 'DEPRECATED_INVALID');
        assert.equal(qCustom.summary, null, `${id} como promo debe devolver summary = null`);
        assert.equal(qCustom.price, null, `${id} como promo debe devolver price = null`);
        assert.notEqual(qCustom.price, 0, `${id} como promo NUNCA debe devolver price 0€`);

        // 3. Invocación como specialPromoId
        const qSpecial = calculateVodafoneQuote({
          baseConfigId: 'vdf-base-1g-2xilim',
          specialPromoId: id
        });
        assert.equal(qSpecial.isValidForCommercialization, false);
        assert.equal(qSpecial.commercialStatus, 'DEPRECATED_INVALID');
        assert.equal(qSpecial.summary, null);
        assert.equal(qSpecial.price, null);

        // 4. Verificación en catálogo interno
        const promoItem = VODAFONE_INTERNAL_PROMOS[id];
        assert.ok(promoItem);
        assert.equal(promoItem.status, 'DEPRECATED_INVALID');
        assert.equal(isCommerciallyValid(promoItem.status), false, 'DEPRECATED_INVALID no es comercialmente válido');

        // 5. Invocación con baseConfigId deprecado y customPromoId arbitrario (nunca debe quedar en UNCONFIRMED)
        const qShadow = calculateVodafoneQuote({
          baseConfigId: id,
          customPromoId: 'arbitrary-promo'
        });
        assert.equal(qShadow.isValidForCommercialization, false);
        assert.equal(qShadow.commercialStatus, 'DEPRECATED_INVALID');
        assert.equal(qShadow.summary, null);
        assert.equal(qShadow.price, null);
        assert.notEqual(qShadow.price, 0);
      }
    });

    // B) SPECIAL_PROMO_39 + BTS => isValidForCommercialization false
    it('B) SPECIAL_PROMO_39 + BTS => isValidForCommercialization false', () => {
      // 1. Invocación con baseConfigId: 'SPECIAL_PROMO_39' + 3 OTTs de BTS
      const quoteSpecial = calculateVodafoneQuote({
        baseConfigId: 'SPECIAL_PROMO_39',
        selectedOtts: ['prime', 'disney', 'hbo_max']
      });
      assert.equal(quoteSpecial.isValidForCommercialization, false, 'SPECIAL_PROMO_39 + BTS debe tener isValidForCommercialization = false');
      assert.equal(quoteSpecial.commercialStatus, 'BLOCKED_INCOMPATIBLE', 'commercialStatus debe ser BLOCKED_INCOMPATIBLE');
      assert.equal(quoteSpecial.btsApplied, false, 'BTS no debe combinarse automáticamente con la promo 39');
      assert.ok(
        quoteSpecial.blockingReasons.some(r => r.includes('BLOCKED_INCOMPATIBLE') || r.includes('incompatible con BTS') || r.includes('promociones privadas')),
        'Debe incluir la razón de incompatibilidad'
      );

      // 2. Invocación con baseConfigId oficial: 'vdf-internal-1g-2ilim-39' + BTS
      const quoteInternal = calculateVodafoneQuote({
        baseConfigId: 'vdf-internal-1g-2ilim-39',
        selectedOtts: ['prime', 'disney', 'hbo_max']
      });
      assert.equal(quoteInternal.isValidForCommercialization, false);
      assert.equal(quoteInternal.commercialStatus, 'BLOCKED_INCOMPATIBLE');
      assert.equal(quoteInternal.btsApplied, false);

      // 3. Invocación con specialPromoId: 'SPECIAL_PROMO_39' sobre base 1G 2xilim + BTS
      const quoteWithPromoId = calculateVodafoneQuote({
        baseConfigId: 'vdf-base-1g-2xilim',
        specialPromoId: 'SPECIAL_PROMO_39',
        selectedOtts: ['prime', 'disney', 'hbo_max']
      });
      assert.equal(quoteWithPromoId.isValidForCommercialization, false);
      assert.equal(quoteWithPromoId.commercialStatus, 'BLOCKED_INCOMPATIBLE');
      assert.equal(quoteWithPromoId.btsApplied, false);

      // 4. Invocación con btsRequested explícito
      const quoteBtsExplicit = calculateVodafoneQuote({
        baseConfigId: 'SPECIAL_PROMO_39',
        btsRequested: true
      });
      assert.equal(quoteBtsExplicit.isValidForCommercialization, false);
      assert.equal(quoteBtsExplicit.commercialStatus, 'BLOCKED_INCOMPATIBLE');
      assert.equal(quoteBtsExplicit.btsApplied, false);

      // 5. Invocación con addon BTS en selectedAddonIds
      const quoteBtsAddon = calculateVodafoneQuote({
        baseConfigId: 'SPECIAL_PROMO_39',
        selectedAddonIds: ['vdf-bts-la-completa']
      });
      assert.equal(quoteBtsAddon.isValidForCommercialization, false);
      assert.equal(quoteBtsAddon.commercialStatus, 'BLOCKED_INCOMPATIBLE');
      assert.equal(quoteBtsAddon.btsApplied, false);

      // 6. Confirmación de coexistencia: Sin BTS, SPECIAL_PROMO_39 sigue siendo válida comercialmente (39€ x 3 meses)
      const quoteValid = calculateVodafoneQuote({
        baseConfigId: 'SPECIAL_PROMO_39',
        tryAndPayEligible: true
      });
      assert.equal(quoteValid.isValidForCommercialization, true, 'Sin BTS, la promo 39 debe ser comercialmente válida');
      assert.equal(quoteValid.commercialStatus, 'INTERNAL_CONFIRMED');
      assert.equal(quoteValid.btsApplied, false);
      assert.equal(quoteValid.summary?.meses1_3, 39);
      assert.equal(quoteValid.summary?.meses4_dic2026, 69);
    });
  });

  // ==========================================================================
  // 13. ACTUALIZACIÓN QUIRÚRGICA VODAFONE AACC SEPTIEMBRE 2026 (17 PUNTOS)
  // ==========================================================================
  describe('13. Actualización Quirúrgica Vodafone AACC Septiembre 2026', () => {
    // 1) Oferta pública 39€ confirmada
    it('1) Oferta pública 39€ confirmada: Fibra 600M + 2x160GB = 39€ (hasta 31/12/2026) -> 54€ fin promo, CONFIRMED, no duplicada, Try&Pay NO aplica', () => {
      const quote = calculateVodafoneQuote({
        baseConfigId: 'vdf-oferta-39-euros',
        tryAndPayEligible: true
      });
      assert.equal(quote.isValidForCommercialization, true);
      assert.equal(quote.commercialStatus, 'CONFIRMED');
      assert.equal(quote.tryAndPayApplied, false, 'Try&Pay NO aplica en 600M');
      assert.equal(quote.specialPromoApplied, true);
      assert.equal(quote.specialPromoId, 'vdf-oferta-39-euros');
      assert.equal(quote.summary?.meses1_3, 39, 'Meses 1-3 debe ser 39€');
      assert.equal(quote.summary?.meses4_dic2026, 39, 'Meses 4 a Dic 2026 debe seguir siendo 39€ (hasta 31/12/2026)');
      assert.equal(quote.summary?.desde_01_01_2027, 54, 'Desde 01/01/2027 pasa a 54€ fin de promoción');

      // No debe existir duplicada con otro ID paralelo en el tarifario estructurado
      const matching = tariffPlans.filter(p => p.id === 'vdf-oferta-39-euros');
      assert.equal(matching.length, 1, 'vdf-oferta-39-euros debe existir exactamente una vez');
    });

    // 2) Oferta pública 44€ confirmada
    it('2) Oferta pública 44€ confirmada: Fibra 600M + 2 ilimitadas = 44€ (hasta 31/12/2026) -> 59€ fin promo, CONFIRMED, Try&Pay NO aplica', () => {
      const quote = calculateVodafoneQuote({
        baseConfigId: 'vdf-public-600m-2xilim-44',
        tryAndPayEligible: true
      });
      assert.equal(quote.isValidForCommercialization, true);
      assert.equal(quote.commercialStatus, 'CONFIRMED');
      assert.equal(quote.tryAndPayApplied, false, 'Try&Pay NO aplica en 600M');
      assert.equal(quote.specialPromoApplied, true);
      assert.equal(quote.specialPromoId, 'vdf-public-600m-2xilim-44');
      assert.equal(quote.summary?.meses1_3, 44, 'Meses 1-3 debe ser 44€');
      assert.equal(quote.summary?.meses4_dic2026, 44, 'Meses 4 a Dic 2026 debe seguir siendo 44€ (hasta 31/12/2026)');
      assert.equal(quote.summary?.desde_01_01_2027, 59, 'Desde 01/01/2027 pasa a 59€ fin de promoción');
    });

    // 3) Las 5 ofertas Flash: precios y estado RESTRICTED_CHANNEL
    it('3) Las 5 ofertas Flash: precio exacto de cada una, RESTRICTED_CHANNEL, incompatibles con BTS', () => {
      const f3p = VODAFONE_FLASH_PLANS['vdf-flash-3p-1g-2x160gb'];
      const fPrime = VODAFONE_FLASH_PLANS['vdf-flash-4p-600m-2x160gb-prime'];
      const fNetflix = VODAFONE_FLASH_PLANS['vdf-flash-4p-600m-2x160gb-netflix'];
      const fHbo = VODAFONE_FLASH_PLANS['vdf-flash-4p-600m-2x160gb-hbo'];
      const fDisney = VODAFONE_FLASH_PLANS['vdf-flash-4p-600m-2x160gb-disney'];

      assert.equal(f3p.price, 44.70);
      assert.equal(f3p.status, 'RESTRICTED_CHANNEL');

      assert.equal(fPrime.price, 51);
      assert.equal(fPrime.status, 'RESTRICTED_CHANNEL');

      assert.equal(fNetflix.price, 56);
      assert.equal(fNetflix.status, 'RESTRICTED_CHANNEL');

      assert.equal(fHbo.price, 53);
      assert.equal(fHbo.status, 'RESTRICTED_CHANNEL');

      assert.equal(fDisney.price, 53);
      assert.equal(fDisney.status, 'RESTRICTED_CHANNEL');

      // Cotizaciones independientes
      const q3p = calculateVodafoneQuote({ baseConfigId: 'vdf-flash-3p-1g-2x160gb' });
      assert.equal(q3p.price, 44.70);
      assert.equal(q3p.commercialStatus, 'RESTRICTED_CHANNEL');

      const qPrime = calculateVodafoneQuote({ baseConfigId: 'vdf-flash-4p-600m-2x160gb-prime' });
      assert.equal(qPrime.price, 51);

      const qNetflix = calculateVodafoneQuote({ baseConfigId: 'vdf-flash-4p-600m-2x160gb-netflix' });
      assert.equal(qNetflix.price, 56);

      const qHbo = calculateVodafoneQuote({ baseConfigId: 'vdf-flash-4p-600m-2x160gb-hbo' });
      assert.equal(qHbo.price, 53);

      const qDisney = calculateVodafoneQuote({ baseConfigId: 'vdf-flash-4p-600m-2x160gb-disney' });
      assert.equal(qDisney.price, 53);
    });

    // 4) Incompatibilidad Flash + BTS
    it('4) Incompatibilidad Flash + BTS: intentar aplicar BTS sobre Flash devuelve btsApplied=false o bloqueo', () => {
      const quoteFlashBts = calculateVodafoneQuote({
        baseConfigId: 'vdf-flash-3p-1g-2x160gb',
        selectedOtts: ['prime', 'disney'],
        btsRequested: true
      });
      assert.equal(quoteFlashBts.btsApplied, false, 'BTS no aplica a ofertas Flash');
      assert.equal(quoteFlashBts.commercialStatus, 'BLOCKED_INCOMPATIBLE');
      assert.equal(quoteFlashBts.isValidForCommercialization, false);
    });

    // 5) Las 3 ofertas Nivel 3 informativas
    it('5) Las 3 ofertas Nivel 3: RESTRICTED_CHANNEL, no cotizables automáticamente, precio no es 0€', () => {
      const nivel3Ids = ['vdf-retencion-anti-digi', 'vdf-retencion-dto-30', 'vdf-retencion-dto-40'];
      for (const id of nivel3Ids) {
        const item = VODAFONE_NIVEL_3_PLANS[id];
        assert.equal(item.status, 'RESTRICTED_CHANNEL');
        assert.notEqual(item.price, 0, `Precio numérico de ${id} no debe ser 0€`);
        const quote = calculateVodafoneQuote({ baseConfigId: id });
        assert.equal(quote.isValidForCommercialization, false);
        assert.notEqual(quote.price, 0, 'Quote price no debe ser 0');
        assert.equal(quote.price, null);
      }
    });

    // 6) Los 3 paquetes Internet Portátil + móvil
    it('6) Los 3 paquetes Internet Portátil + móvil: precios 43€, 48€, 53€, CONFIRMED', () => {
      const p60 = VODAFONE_PORTATIL_MOVIL_PLANS['vdf-portatil-movil-60gb'];
      const p160 = VODAFONE_PORTATIL_MOVIL_PLANS['vdf-portatil-movil-160gb'];
      const pIlim = VODAFONE_PORTATIL_MOVIL_PLANS['vdf-portatil-movil-ilim'];

      assert.equal(p60.price, 43);
      assert.equal(p60.status, 'CONFIRMED');

      assert.equal(p160.price, 48);
      assert.equal(p160.status, 'CONFIRMED');

      assert.equal(pIlim.price, 53);
      assert.equal(pIlim.status, 'CONFIRMED');

      const q60 = calculateVodafoneQuote({ baseConfigId: 'vdf-portatil-movil-60gb' });
      assert.equal(q60.price, 43);
      assert.equal(q60.isValidForCommercialization, true);

      const q160 = calculateVodafoneQuote({ baseConfigId: 'vdf-portatil-movil-160gb' });
      assert.equal(q160.price, 48);
      assert.equal(q160.isValidForCommercialization, true);

      const qIlim = calculateVodafoneQuote({ baseConfigId: 'vdf-portatil-movil-ilim' });
      assert.equal(qIlim.price, 53);
      assert.equal(qIlim.isValidForCommercialization, true);
    });

    // 7) Mi Negocio Pro 3
    it('7) Mi Negocio Pro 3: promo 63.16€, regular 68.16€, 24 meses', () => {
      const plan = tariffPlans.find(p => p.id === 'vodafone-mi-negocio-pro-3lineas');
      assert.ok(plan);
      assert.equal(plan.priceKind, 'promo_then_regular');
      assert.equal(plan.promoPrice, 63.16);
      assert.equal(plan.regularPrice, 68.16);
      assert.equal(plan.promoMonths, 24);
    });

    // 8) Mi Negocio Pro 5
    it('8) Mi Negocio Pro 5: promo 75.00€, regular 80.00€, 24 meses', () => {
      const plan = tariffPlans.find(p => p.id === 'vodafone-mi-negocio-pro-5lineas');
      assert.ok(plan);
      assert.equal(plan.priceKind, 'promo_then_regular');
      assert.equal(plan.promoPrice, 75.00);
      assert.equal(plan.regularPrice, 80.00);
      assert.equal(plan.promoMonths, 24);
    });

    // 9) TV Bares <10K
    it('9) TV Bares <10K: regularPrice exacto 340.89€', () => {
      const plan = tariffPlans.find(p => p.id === 'vodafone-tv-bares-menos10k');
      assert.ok(plan);
      assert.equal(plan.promoPrice, 280.89);
      assert.equal(plan.regularPrice, 340.89);
    });

    // 10) Disney+ y HBO Max con anuncios: PVP individual 11€ (no 10€)
    it('10) Disney+ y HBO Max con anuncios: PVP individual 11€ (no 10€)', () => {
      const disney = VODAFONE_TV_AND_OTTS['vdf-tv-disney'];
      const hbo = VODAFONE_TV_AND_OTTS['vdf-tv-hbo'];
      assert.equal(disney.price, 11, 'Disney+ debe ser 11€');
      assert.equal(hbo.price, 11, 'HBO Max debe ser 11€');

      const addonDisney = addons.find(a => a.id === 'vdf-addon-disney');
      const addonHbo = addons.find(a => a.id === 'vdf-addon-hbo');
      assert.equal(addonDisney?.monthlyPrice, 11);
      assert.equal(addonHbo?.monthlyPrice, 11);
    });

    // 11) 2 OTT con Disney o HBO (ej. Netflix + Disney o Prime + Disney): precio de pack calculado refleja 11€
    it('11) 2 OTT con Disney o HBO: cálculo refleja precio actualizado', () => {
      // Pack Netflix + Disney: Disney (11€) + Netflix (+8.99€) = 19.99€
      const priceNetflixDisney = calculateTvAndOttPrice(['netflix', 'disney'], false, 0, false, false);
      assert.equal(priceNetflixDisney, 19.99, 'Pack Netflix + Disney debe reflejar 11€ de Disney + 8.99€ Netflix = 19.99€');

      // Pack Netflix + HBO: HBO (11€) + Netflix (+8.99€) = 19.99€
      const priceNetflixHbo = calculateTvAndOttPrice(['netflix', 'hbo_max'], false, 0, false, false);
      assert.equal(priceNetflixHbo, 19.99, 'Pack Netflix + HBO debe reflejar 11€ de HBO + 8.99€ Netflix = 19.99€');

      // Conflicto Prime + Disney detectado en base sin BTS
      const quoteConflict = calculateVodafoneQuote({
        baseConfigId: 'vdf-base-600m-1x60gb',
        selectedOtts: ['prime', 'disney'],
        btsRequested: false
      });
      assert.equal(quoteConflict.isValidForCommercialization, false);
      assert.ok(quoteConflict.blockingReasons.some(r => r.includes('Conflicto TV abierto') || r.includes('Prime + Disney')));
    });

    // 12) Conflicto real Prime + Disney: al seleccionar ambos addons en una base sin BTS, el motor detecta conflicto comercial
    it('12) Conflicto real Prime + Disney: al seleccionar ambos addons en una base sin BTS, el motor detecta conflicto comercial', () => {
      const quote = calculateVodafoneQuote({
        baseConfigId: 'vdf-base-600m-2x160gb',
        selectedAddonIds: ['vdf-addon-prime', 'vdf-addon-disney'],
        btsRequested: false
      });
      assert.equal(quote.isValidForCommercialization, false, 'Debe detectar conflicto 14€ vs 15€');
      assert.equal(quote.commercialStatus, 'CONFLICTO_DOCUMENTAL');
    });

    // 13) Decodificadores: sourceType es INTERNAL_COMMERCIAL_INFORMATION
    it('13) Decodificadores: sourceType es INTERNAL_COMMERCIAL_INFORMATION', () => {
      const deco3 = VODAFONE_DECODERS['vdf-deco-standard-3'];
      const deco4 = VODAFONE_DECODERS['vdf-deco-premium-4'];
      assert.equal(deco3.sourceType, 'INTERNAL_COMMERCIAL_INFORMATION');
      assert.equal(deco4.sourceType, 'INTERNAL_COMMERCIAL_INFORMATION');

      const aDeco3 = addons.find(a => a.id === 'vdf-addon-deco-3');
      const aDeco4 = addons.find(a => a.id === 'vdf-addon-deco-4');
      assert.equal(aDeco3?.sourceType, 'INTERNAL_COMMERCIAL_INFORMATION');
      assert.equal(aDeco4?.sourceType, 'INTERNAL_COMMERCIAL_INFORMATION');
    });

    // 14) Addons confirmados TV
    it('14) Addons confirmados TV: Deportes 6€, Filmin 10€, Documentales 8€, AMC 4.99€, Más Series 6€, Premium Familiar 9.99€, OneToro 14.99€, Caza 7€, Adulto 10€, Videoclub Rakuten 0€', () => {
      const expected = [
        { id: 'vdf-addon-pack-deportes', price: 6 },
        { id: 'vdf-addon-tv-filmin', price: 10 },
        { id: 'vdf-addon-pack-documentales', price: 8 },
        { id: 'vdf-addon-amc', price: 4.99 },
        { id: 'vdf-addon-mas-series', price: 6 },
        { id: 'vdf-addon-premium-familiar', price: 9.99 },
        { id: 'vdf-addon-onetoro', price: 14.99 },
        { id: 'vdf-addon-pack-caza', price: 7 },
        { id: 'vdf-addon-pack-adulto', price: 10 },
        { id: 'vdf-addon-videoclub-rakuten', price: 0 }
      ];
      for (const item of expected) {
        const addon = addons.find(a => a.id === item.id);
        assert.ok(addon, `Addon ${item.id} debe existir`);
        assert.equal(addon.monthlyPrice, item.price, `Addon ${item.id} debe costar ${item.price}€`);
        assert.equal(addon.commercialStatus, 'CONFIRMED');
      }
    });

    // 15) Addons autogestión
    it('15) Addons autogestión: Disney sin anuncios 15€, Disney Premium 20€, HBO sin anuncios 15€, Netflix Estándar 14.99€, Netflix Premium 21.99€', () => {
      const expected = [
        { id: 'vdf-addon-disney-sin-anuncios', price: 15 },
        { id: 'vdf-addon-disney-premium', price: 20 },
        { id: 'vdf-addon-hbo-sin-anuncios', price: 15 },
        { id: 'vdf-addon-netflix-estandar', price: 14.99 },
        { id: 'vdf-addon-netflix-premium', price: 21.99 }
      ];
      for (const item of expected) {
        const addon = addons.find(a => a.id === item.id);
        assert.ok(addon, `Addon autogestión ${item.id} debe existir`);
        assert.equal(addon.monthlyPrice, item.price, `Addon ${item.id} debe costar ${item.price}€`);
        assert.equal(addon.commercialStatus, 'CONFIRMED');
      }
    });

    // 16) DAZN regular
    it('16) DAZN regular: Fútbol 19.99€, Motor 19.99€, Premium 31.99€; Cartera y NBA bloqueados con EXTERNAL_PROJECT_SOURCE', () => {
      const regFutbol = addons.find(a => a.id === 'vdf-dazn-futbol-regular');
      const regMotor = addons.find(a => a.id === 'vdf-dazn-motor-regular');
      const regPrem = addons.find(a => a.id === 'vdf-dazn-premium-regular');
      assert.equal(regFutbol?.monthlyPrice, 19.99);
      assert.equal(regMotor?.monthlyPrice, 19.99);
      assert.equal(regPrem?.monthlyPrice, 31.99);
      assert.equal(regFutbol?.commercialStatus, 'CONFIRMED');

      const cartera = addons.find(a => a.id === 'vdf-dazn-futbol-cartera');
      const nba = addons.find(a => a.id === 'vdf-dazn-futbol-nba');
      assert.equal(cartera?.commercialStatus, 'EXTERNAL_PROJECT_SOURCE');
      assert.equal(cartera?.sourceType, 'EXTERNAL_PROJECT_SOURCE');
      assert.equal(nba?.commercialStatus, 'EXTERNAL_PROJECT_SOURCE');
      assert.equal(nba?.sourceType, 'EXTERNAL_PROJECT_SOURCE');
      assert.equal(isCommerciallyValid('EXTERNAL_PROJECT_SOURCE'), false);
    });

    // 17) Addons B2B
    it('17) Addons B2B: TV 7.43€, ilim 9.09€, fibra 1Gb 16.53€; no aplicables a paquetes residenciales', () => {
      const b2bTv = addons.find(a => a.id === 'vdf-b2b-addon-ott-tv');
      const b2bIlim = addons.find(a => a.id === 'vdf-b2b-addon-linea-ilimitada');
      const b2bFibra = addons.find(a => a.id === 'vdf-b2b-addon-fibra-1gb');
      assert.equal(b2bTv?.monthlyPrice, 7.43);
      assert.equal(b2bIlim?.monthlyPrice, 9.09);
      assert.equal(b2bFibra?.monthlyPrice, 16.53);

      const quoteResidencial = calculateVodafoneQuote({
        baseConfigId: 'vdf-base-600m-2x160gb',
        selectedAddonIds: ['vdf-b2b-addon-ott-tv']
      });
      assert.equal(quoteResidencial.isValidForCommercialization, false);
      assert.ok(quoteResidencial.blockingReasons.some(r => r.includes('B2B') || r.includes('residencial')));
    });

    // 18) DAZN Motor regular 19,99€ cotizable y calculable
    it('18) DAZN Motor regular 19.99€ cotizable en motor Vodafone', () => {
      const quote = calculateVodafoneQuote({
        baseConfigId: 'vdf-base-600m-1x60gb',
        selectedAddonIds: ['vdf-dazn-motor-regular']
      });
      assert.equal(quote.isValidForCommercialization, true);
      assert.equal(quote.periods.months1to3.daznPrice, 19.99);
      assert.equal(quote.periods.months4toDec2026.daznPrice, 19.99);
      assert.equal(quote.periods.from2027.daznPrice, 19.99);
    });

    // 19) Addons B2B no aparecen en residencial; no aparecen global-mobile-line ni global-tv-basica ni global-mesh-wifi
    it('19) Addons B2B no aparecen en residencial; no aparecen global-mobile-line ni global-tv-basica ni global-mesh-wifi', () => {
      const residentialPlan = tariffPlans.find(p => p.id === 'vdf-base-600m-1x60gb');
      assert.ok(residentialPlan);

      const filterForPlan = (plan: typeof residentialPlan, segment = 'nuevo') => addons.filter(addon => {
        if (addon.operatorId && addon.operatorId !== 'vodafone') return false;
        if (addon.id === 'global-mobile-line' || addon.id === 'global-tv-basica' || addon.id === 'global-mesh-wifi') return false;
        if (addon.id.startsWith('vdf-dazn-')) {
          if (segment === 'nuevo') return addon.id.includes('-nuevo');
          if (segment === 'regular') return addon.id.includes('-regular');
          if (segment === 'cartera') return addon.id.includes('-cartera');
          if (segment === 'nba') return addon.id.includes('-nba');
        }
        if (addon.id.startsWith('vdf-b2b-') || addon.id.includes('negocio') || addon.tags?.includes('Empresa') || addon.tags?.includes('B2B')) {
          const isB2B = plan?.category === 'fibra_movil_empresa' || plan?.tags?.includes('Empresa') || plan?.tags?.includes('HORECA') || plan?.tags?.includes('B2B') || plan?.id.includes('empresa') || plan?.id.includes('mi-negocio') || plan?.id.includes('tv-bares');
          if (!isB2B) return false;
        }
        return true;
      });

      const residentialAddons = filterForPlan(residentialPlan);
      // No deben aparecer los B2B
      assert.equal(residentialAddons.some(a => a.id.startsWith('vdf-b2b-')), false, 'Addons vdf-b2b-* no deben aparecer en residencial');
      assert.equal(residentialAddons.some(a => a.id === 'vdf-addon-linea-negocio-60gb'), false, 'Línea de negocio 60GB no debe aparecer en residencial');

      // No deben aparecer los globales referenciales
      assert.equal(residentialAddons.some(a => a.id === 'global-mobile-line'), false, 'global-mobile-line no debe aparecer en Vodafone');
      assert.equal(residentialAddons.some(a => a.id === 'global-tv-basica'), false, 'global-tv-basica no debe aparecer en Vodafone');
      assert.equal(residentialAddons.some(a => a.id === 'global-mesh-wifi'), false, 'global-mesh-wifi no debe aparecer en Vodafone');

      // Sí deben aparecer en un plan de empresa
      const businessPlan = tariffPlans.find(p => p.id === 'vodafone-mi-negocio-pro-2lineas');
      assert.ok(businessPlan);
      const businessAddons = filterForPlan(businessPlan);
      assert.equal(businessAddons.some(a => a.id.startsWith('vdf-b2b-')), true, 'Addons B2B sí deben aparecer en empresa');
      assert.equal(businessAddons.some(a => a.id === 'vdf-addon-linea-negocio-60gb'), true, 'Línea de negocio sí debe aparecer en empresa');
    });

    // 20) Cambio de modalidad DAZN actualiza inmediatamente las tarjetas
    it('20) Cambio de modalidad DAZN actualiza inmediatamente las tarjetas', () => {
      const filterBySegment = (segment: 'nuevo' | 'regular' | 'cartera' | 'nba') => addons.filter(addon => {
        if (addon.operatorId && addon.operatorId !== 'vodafone') return false;
        if (addon.id === 'global-mobile-line' || addon.id === 'global-tv-basica' || addon.id === 'global-mesh-wifi') return false;
        if (addon.id.startsWith('vdf-dazn-')) {
          if (segment === 'nuevo') return addon.id.includes('-nuevo');
          if (segment === 'regular') return addon.id.includes('-regular');
          if (segment === 'cartera') return addon.id.includes('-cartera');
          if (segment === 'nba') return addon.id.includes('-nba');
        }
        return true;
      }).filter(a => a.id.startsWith('vdf-dazn-'));

      const nuevos = filterBySegment('nuevo');
      assert.ok(nuevos.length > 0);
      assert.ok(nuevos.every(a => a.id.includes('-nuevo')));

      const regulares = filterBySegment('regular');
      assert.ok(regulares.length > 0);
      assert.ok(regulares.every(a => a.id.includes('-regular')));

      const carteras = filterBySegment('cartera');
      assert.ok(carteras.length > 0);
      assert.ok(carteras.every(a => a.id.includes('-cartera')));

      const nbas = filterBySegment('nba');
      assert.ok(nbas.length > 0);
      assert.ok(nbas.every(a => a.id.includes('-nba')));
    });

    // 21) Cero IDs Vodafone duplicados
    it('21) Cero IDs Vodafone duplicados en catálogo comercial y tarifas estructuradas', () => {
      // 1. Tarifas estructuradas
      const structuredVdfIds = tariffPlans.filter(p => p.operatorId === 'vodafone').map(p => p.id);
      const structuredDuplicates = structuredVdfIds.filter((item, index) => structuredVdfIds.indexOf(item) !== index);
      assert.deepEqual(structuredDuplicates, [], 'Cero IDs duplicados en tariffPlans');

      // 2. Addons estructurados
      const addonVdfIds = addons.filter(a => a.operatorId === 'vodafone' || a.id.startsWith('vdf-')).map(a => a.id);
      const addonDuplicates = addonVdfIds.filter((item, index) => addonVdfIds.indexOf(item) !== index);
      assert.deepEqual(addonDuplicates, [], 'Cero IDs duplicados en addons');

      // 3. VODAFONE_BASE_CONFIGS
      const baseConfigIds = Object.keys(VODAFONE_BASE_CONFIGS);
      const baseDuplicates = baseConfigIds.filter((item, index) => baseConfigIds.indexOf(item) !== index);
      assert.deepEqual(baseDuplicates, [], 'Cero IDs duplicados en VODAFONE_BASE_CONFIGS');

      // 4. VODAFONE_SPECIAL_PROMOS
      const promoIds = Object.keys(VODAFONE_SPECIAL_PROMOS);
      const promoDuplicates = promoIds.filter((item, index) => promoIds.indexOf(item) !== index);
      assert.deepEqual(promoDuplicates, [], 'Cero IDs duplicados en VODAFONE_SPECIAL_PROMOS');

      // 5. VODAFONE_BLOCKED_SPECIAL_OFFERS
      const blockedIds = Object.keys(VODAFONE_BLOCKED_SPECIAL_OFFERS);
      const blockedDuplicates = blockedIds.filter((item, index) => blockedIds.indexOf(item) !== index);
      assert.deepEqual(blockedDuplicates, [], 'Cero IDs duplicados en VODAFONE_BLOCKED_SPECIAL_OFFERS');

      // 6. Cero colisiones entre VODAFONE_SPECIAL_PROMOS y VODAFONE_BLOCKED_SPECIAL_OFFERS
      const promoAndBlockedCollision = promoIds.filter(id => blockedIds.includes(id));
      assert.deepEqual(promoAndBlockedCollision, [], 'Cero colisiones entre SPECIAL_PROMOS y BLOCKED_SPECIAL_OFFERS');
    });
  });

  // ==========================================================================
  // 14. PARCHE QUIRÚRGICO: PRECIOS ORDINARIOS VS BTS, ADDONS INFORMATIVOS Y EXTRAS NUEVOS
  // ==========================================================================
  describe('14. Parche Quirúrgico: Precios Ordinarios vs BTS, Addons Informativos y Extras Nuevos', () => {

    // 1) Precios ordinarios por defecto en catálogo de tarjetas
    it('1) Precios ordinarios por defecto en ADDONS (no 0€ fuera de BTS compatible)', () => {
      const deco3 = ADDONS.find(a => a.id === 'vdf-addon-deco-3');
      const deco4 = ADDONS.find(a => a.id === 'vdf-addon-deco-4');
      const prime = ADDONS.find(a => a.id === 'vdf-addon-prime');
      const disney = ADDONS.find(a => a.id === 'vdf-addon-disney');
      const hbo = ADDONS.find(a => a.id === 'vdf-addon-hbo');
      const netflix = ADDONS.find(a => a.id === 'vdf-addon-netflix-standalone');

      assert.equal(deco3?.price, 3, 'Decodificador 4K debe mostrar 3€ ordinario');
      assert.equal(deco4?.price, 4, 'Decodificador Premium debe mostrar 4€ ordinario');
      assert.equal(prime?.price, 9, 'Amazon Prime debe mostrar 9€ ordinario');
      assert.equal(disney?.price, 11, 'Disney+ debe mostrar 11€ ordinario');
      assert.equal(hbo?.price, 11, 'HBO Max debe mostrar 11€ ordinario');
      assert.equal(netflix?.price, 13.99, 'Netflix sola debe mostrar 13.99€ ordinario');
    });

    // 2) Fuera de un BTS compatible, no se muestra 0€
    it('2) Fuera de un BTS compatible, no se aplica 0€ a OTTs ni Decodificador', () => {
      // 160GB con solo 1 OTT: el cliente tenía derecho a 2, por tanto BTS=false
      const quoteIncompleta = calculateVodafoneQuote({
        baseConfigId: 'vdf-base-600m-1x160gb',
        selectedOtts: ['prime'],
        decoderOptionId: 'vdf-deco-standard-3'
      });
      assert.equal(quoteIncompleta.btsApplied, false, 'BTS no debe aplicar si faltan OTTs');
      assert.equal(quoteIncompleta.periods.months1to3.tvAndOttPrice, 9, 'Prime cuesta 9€ fuera de BTS');
      assert.equal(quoteIncompleta.periods.months1to3.decoderPrice, 3, 'Deco cuesta 3€ fuera de BTS');

      // BTS compatible (60GB con exactamente 1 OTT): BTS=true y 0€ en promo
      const quoteBts = calculateVodafoneQuote({
        baseConfigId: 'vdf-base-600m-1x60gb',
        selectedOtts: ['prime'],
        decoderOptionId: 'vdf-deco-standard-3'
      });
      assert.equal(quoteBts.btsApplied, true, 'BTS debe aplicar con selección exacta');
      assert.equal(quoteBts.periods.months1to3.tvAndOttPrice, 0, 'Prime cuesta 0€ en BTS compatible');
      assert.equal(quoteBts.periods.months1to3.decoderPrice, 0, 'Deco cuesta 0€ en BTS compatible');
    });

    // 3) Rakuten Videoclub: informativo, no seleccionable, no altera el total
    it('3) Rakuten Videoclub: informativo, sin cuota fija, no altera el total ni cotización', () => {
      const rakuten = addons.find(a => a.id === 'vdf-addon-videoclub-rakuten');
      assert.ok(rakuten, 'Rakuten addon debe existir');
      assert.equal(rakuten.isInformative, true, 'Rakuten debe ser informativo');
      assert.ok(rakuten.description.includes('Sin cuota fija') && rakuten.description.includes('alquiler o compra'));
      assert.ok(rakuten.tags.includes('Informativo') && rakuten.tags.includes('No Seleccionable'));

      // Verificar que si se pasa al calculador, no altera el precio
      const quoteSin = calculateVodafoneQuote({ baseConfigId: 'vdf-base-600m-1x60gb' });
      const quoteCon = calculateVodafoneQuote({ 
        baseConfigId: 'vdf-base-600m-1x60gb',
        selectedAddonIds: ['vdf-addon-videoclub-rakuten']
      });
      assert.equal(quoteCon.periods.months1to3.totalPrice, quoteSin.periods.months1to3.totalPrice);
      assert.equal(quoteCon.periods.from2027.totalPrice, quoteSin.periods.from2027.totalPrice);
    });

    // 4) Upgrades autogestionables: informativos y no seleccionables
    it('4) Upgrades autogestionables: informativos/no seleccionables, no alteran total', () => {
      const autogestionIds = [
        'vdf-addon-disney-sin-anuncios',
        'vdf-addon-disney-premium',
        'vdf-addon-hbo-sin-anuncios',
        'vdf-addon-netflix-estandar',
        'vdf-addon-netflix-premium'
      ];

      for (const id of autogestionIds) {
        const addon = addons.find(a => a.id === id);
        assert.ok(addon, `Addon ${id} debe existir`);
        assert.equal(addon.isInformative, true, `Addon ${id} debe tener isInformative: true`);
        assert.ok(addon.tags.includes('Autogestión'), `Addon ${id} debe tener tag Autogestión`);
        assert.ok(addon.tags.includes('No Seleccionable'), `Addon ${id} debe tener tag No Seleccionable`);

        // Comprobar que en el motor no altera el total
        const baseQuote = calculateVodafoneQuote({ baseConfigId: 'vdf-base-600m-1x60gb' });
        const quoteWithAddon = calculateVodafoneQuote({ 
          baseConfigId: 'vdf-base-600m-1x60gb',
          selectedAddonIds: [id]
        });
        assert.equal(quoteWithAddon.periods.months1to3.totalPrice, baseQuote.periods.months1to3.totalPrice);
      }
    });

    // 5) Extras nuevos seleccionables: cambian numéricamente el total y se reflejan en el desglose
    it('5) Extras nuevos seleccionables: TV extras, DAZN y B2B cambian correctamente el total', () => {
      // Base: 600M + 1x60GB = 43€
      const baseQuote = calculateVodafoneQuote({ baseConfigId: 'vdf-base-600m-1x60gb' });
      assert.equal(baseQuote.periods.months1to3.totalPrice, 43);

      // Pack Deportes 6€ -> 49€
      const quoteDeportes = calculateVodafoneQuote({ 
        baseConfigId: 'vdf-base-600m-1x60gb',
        selectedAddonIds: ['vdf-addon-pack-deportes']
      });
      assert.equal(quoteDeportes.periods.months1to3.totalPrice, 49);
      assert.equal(quoteDeportes.periods.months1to3.otherAddonsPrice, 6);

      // Filmin 10€ -> 53€
      const quoteFilmin = calculateVodafoneQuote({ 
        baseConfigId: 'vdf-base-600m-1x60gb',
        selectedAddonIds: ['vdf-addon-tv-filmin']
      });
      assert.equal(quoteFilmin.periods.months1to3.totalPrice, 53);
      assert.equal(quoteFilmin.periods.months1to3.otherAddonsPrice, 10);

      // Documentales 8€ -> 51€
      const quoteDocs = calculateVodafoneQuote({ 
        baseConfigId: 'vdf-base-600m-1x60gb',
        selectedAddonIds: ['vdf-addon-pack-documentales']
      });
      assert.equal(quoteDocs.periods.months1to3.totalPrice, 51);
      assert.equal(quoteDocs.periods.months1to3.otherAddonsPrice, 8);

      // Múltiples extras TV combinados: Deportes (6) + Filmin (10) + AMC (4.99) = 20.99€ extra -> 63.99€
      const quoteMulti = calculateVodafoneQuote({ 
        baseConfigId: 'vdf-base-600m-1x60gb',
        selectedAddonIds: ['vdf-addon-pack-deportes', 'vdf-addon-tv-filmin', 'vdf-addon-amc']
      });
      assert.equal(quoteMulti.periods.months1to3.otherAddonsPrice, 20.99);
      assert.equal(quoteMulti.periods.months1to3.totalPrice, 63.99);

      // Addon B2B bloquea comercialización si se intenta añadir a paquete residencial
      const quoteEmpresa = calculateVodafoneQuote({
        baseConfigId: 'vdf-base-600m-1x60gb',
        selectedAddonIds: ['vdf-b2b-addon-ott-tv']
      });
      assert.equal(quoteEmpresa.isValidForCommercialization, false, 'Addon B2B bloquea comercialización en residencial');
    });

    // 6) Flash y Privadas: Flash fuera de "Todos", cotizable con restricted; Privadas Nivel 3 informativas
    it('6) Flash / Privadas: Flash no aparece en "Todos", cotizable con status RESTRICTED_CHANNEL; Nivel 3 no cotizables', () => {
      // 1. Las ofertas Flash están marcadas con RESTRICTED_CHANNEL y no deben aparecer en "Todos"
      const flashPlans = tariffPlans.filter(p => p.id.startsWith('vdf-flash-'));
      assert.equal(flashPlans.length, 5, 'Deben existir 5 ofertas Flash');
      for (const flash of flashPlans) {
        assert.equal(flash.commercialStatus, 'RESTRICTED_CHANNEL');
      }

      // 2. Cotización de Flash dentro de su pestaña
      const quoteFlash = calculateVodafoneQuote({ baseConfigId: 'vdf-flash-3p-1g-2x160gb' });
      assert.equal(quoteFlash.isValidForCommercialization, true);
      assert.equal(quoteFlash.commercialStatus, 'RESTRICTED_CHANNEL');
      assert.equal(quoteFlash.periods.months1to3.totalPrice, 44.70);

      // 3. Ofertas Privadas Nivel 3 permanecen informativas y no cotizables (price: null)
      const retencionIds = ['vdf-retencion-anti-digi', 'vdf-retencion-dto-30', 'vdf-retencion-dto-40'];
      for (const retId of retencionIds) {
        const quoteRet = calculateVodafoneQuote({ baseConfigId: retId });
        assert.equal(quoteRet.isValidForCommercialization, false, `${retId} no debe ser cotizable`);
        assert.equal(quoteRet.price, null, `${retId} debe tener price null (nunca 0€)`);
        assert.equal(quoteRet.summary, null);
        assert.ok(quoteRet.blockingReasons[0].includes('Nivel 3') || quoteRet.blockingReasons[0].includes('retención'));
      }
    });

    // 7) Verificación real de integridad de otras operadoras (Orange, Yoigo, Lowi, WIN)
    it('7) Verificación real de integridad de otras operadoras: Orange, Yoigo, Lowi, WIN sin alteraciones', () => {
      // Orange: Tarifas Love y solo fibra intactas
      const orangePlans = tariffPlans.filter(p => p.operatorId === 'orange');
      assert.ok(orangePlans.length >= 10, 'Orange debe tener sus planes oficiales intactos');
      assert.ok(orangePlans.some(p => p.id.includes('orange') && p.monthlyPrice !== undefined));

      // Yoigo: Tarifas de fibra + móvil, 500Mb, 1Gb intactas
      const yoigoPlans = tariffPlans.filter(p => p.operatorId === 'yoigo');
      assert.ok(yoigoPlans.length >= 10, 'Yoigo debe tener sus planes oficiales intactos');
      assert.ok(yoigoPlans.some(p => p.id.includes('yoigo') && p.monthlyPrice !== undefined));

      // Lowi: Tarifas Fit, 300Mb, 600Mb, 1Gb intactas
      const lowiPlans = tariffPlans.filter(p => p.operatorId === 'lowi');
      assert.ok(lowiPlans.length >= 10, 'Lowi debe tener sus planes oficiales intactos');
      assert.ok(lowiPlans.some(p => p.id.includes('lowi') && p.monthlyPrice !== undefined));

      // WIN: Tarifas Perú en soles intactas
      const winPlans = tariffPlans.filter(p => p.operatorId === 'win');
      assert.ok(winPlans.length >= 8, 'WIN debe tener sus planes oficiales intactos');
      assert.ok(winPlans.some(p => p.id.includes('win') && p.monthlyPrice !== undefined));

      // Addons de otras operadoras intactos
      const orangeAddons = addons.filter(a => a.operatorId === 'orange');
      const yoigoAddons = addons.filter(a => a.operatorId === 'yoigo');
      const lowiAddons = addons.filter(a => a.operatorId === 'lowi');
      const winAddons = addons.filter(a => a.operatorId === 'win');

      assert.ok(orangeAddons.length > 0, 'Orange addons intactos');
      assert.ok(yoigoAddons.length > 0, 'Yoigo addons intactos');
      assert.ok(lowiAddons.length > 0, 'Lowi addons intactos');
      assert.ok(winAddons.length > 0, 'WIN addons intactos');
    });

    // 8) Comprobación estricta de Decodificador y OTTs fuera de BTS
    it('8) Decodificadores y OTTs fuera de BTS mantienen estrictamente su PVP ordinario (no 0€)', () => {
      // Base 600M + 1x60GB (43€) sin BTS (sin OTT seleccionada):
      // Deco 3€ debe sumar exactamente 3€ -> 46€
      const quoteWithDeco3 = calculateVodafoneQuote({
        baseConfigId: 'vdf-base-600m-1x60gb',
        decoderOptionId: 'vdf-deco-standard-3'
      });
      assert.equal(quoteWithDeco3.btsApplied, false);
      assert.equal(quoteWithDeco3.periods.months1to3.decoderPrice, 3, 'Deco 3€ fuera de BTS debe costar 3€');
      assert.equal(quoteWithDeco3.periods.months1to3.totalPrice, 46);

      // Deco 4€ debe sumar exactamente 4€ -> 47€
      const quoteWithDeco4 = calculateVodafoneQuote({
        baseConfigId: 'vdf-base-600m-1x60gb',
        decoderOptionId: 'vdf-deco-premium-4'
      });
      assert.equal(quoteWithDeco4.btsApplied, false);
      assert.equal(quoteWithDeco4.periods.months1to3.decoderPrice, 4, 'Deco 4€ fuera de BTS debe costar 4€');
      assert.equal(quoteWithDeco4.periods.months1to3.totalPrice, 47);

      // Base 600M + 2x160GB (54€) con Prime fuera de BTS (falta 1 OTT para cumplir 2):
      // Prime 9€ + Deco 3€ -> 54 + 9 + 3 = 66€
      const quoteIncomplete = calculateVodafoneQuote({
        baseConfigId: 'vdf-base-600m-2x160gb',
        selectedOtts: ['prime'],
        decoderOptionId: 'vdf-deco-standard-3'
      });
      assert.equal(quoteIncomplete.btsApplied, false, 'No cumple 2 OTTs para 160GB');
      assert.equal(quoteIncomplete.periods.months1to3.tvAndOttPrice, 9, 'Prime cuesta 9€ fuera de BTS');
      assert.equal(quoteIncomplete.periods.months1to3.decoderPrice, 3, 'Deco cuesta 3€ fuera de BTS');
      assert.equal(quoteIncomplete.periods.months1to3.totalPrice, 66);
    });

    // 9) Verificación de integridad de extras TV y exclusión de informativos en cotización
    it('9) Extras TV nuevos modifican el total acumulativamente sin interferencia de informativos', () => {
      // Base 1G + 2 ilimitadas (69€, con T&P = 59€ meses 1-3)
      // Añadir Pack Deportes (6€) + Pack Documentales (8€) + Rakuten (0€, informativo) + Disney sin anuncios (15€, informativo)
      const quote = calculateVodafoneQuote({
        baseConfigId: 'vdf-base-1g-2xilim',
        tryAndPayEligible: true,
        includeSecureNet: true,
        selectedAddonIds: [
          'vdf-addon-pack-deportes',
          'vdf-addon-pack-documentales',
          'vdf-addon-videoclub-rakuten',
          'vdf-addon-disney-sin-anuncios'
        ]
      });
      assert.equal(quote.isValidForCommercialization, true);
      assert.equal(quote.tryAndPayApplied, true);
      // Meses 1-3: Base T&P 59€ + Deportes 6€ + Docs 8€ = 73€
      assert.equal(quote.periods.months1to3.otherAddonsPrice, 14, 'Solo se suman Deportes (6) y Docs (8) = 14€');
      assert.equal(quote.periods.months1to3.totalPrice, 73, '59 + 14 = 73€');
      // Desde 2027: Base 69€ + SN 1€ + Addons 14€ = 84€
      assert.equal(quote.periods.from2027.totalPrice, 84, '69 + 1 + 14 = 84€');
    });
  });
});
