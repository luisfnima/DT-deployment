import { it } from 'node:test';
import assert from 'node:assert/strict';
import { calculateVodafoneQuote } from './vodafone-calculator.ts';
import { getVodafoneAddonLabel, getVodafoneServicesTotal } from './vodafone-addon-display.ts';
import { ADDONS } from '../data/plans.ts';
import { addons } from '../data/tarifario-smart-telco-structured.ts';

it('Netflix por encima de BTS se cobra y nunca se anuncia gratis', () => {
  const quote = calculateVodafoneQuote({baseConfigId: 'vdf-base-1g-2xilim', selectedOtts: ['disney', 'prime', 'hbo_max', 'netflix']});
  assert.equal(quote.btsApplied, true);
  assert.equal(quote.periods.months1to3.tvAndOttPrice, 8.99);
  const label = getVodafoneAddonLabel({id: 'vdf-addon-netflix-standalone', price: 13.99}, quote);
  assert.ok(label?.includes('8.99'));
  assert.ok(!label?.includes('Gratis'));
  assert.equal(getVodafoneServicesTotal(quote), 8.99);
});

it('BTS cubierto conserva bonificación y Deportes suma exactamente 6 euros', () => {
  const quote = calculateVodafoneQuote({baseConfigId: 'vdf-base-600m-1x60gb', selectedOtts: ['prime'], decoderOptionId: 'vdf-deco-standard-3', selectedAddonIds: ['vdf-addon-pack-deportes']});
  assert.equal(quote.periods.months1to3.totalPrice, 49);
  assert.equal(getVodafoneServicesTotal(quote), 6);
  assert.ok(getVodafoneAddonLabel({id: 'vdf-addon-prime', price: 9}, quote)?.startsWith('Gratis'));
});

it('El cambio de precios Vodafone conserva el mapeo promocional de las otras operadoras', () => {
  for (const raw of addons.filter(a => a.operatorId !== 'vodafone')) {
    assert.equal(ADDONS.find(a => a.id === raw.id)?.price, raw.promoPrice ?? raw.monthlyPrice ?? raw.oneTimePrice ?? 0, raw.id);
  }
});
