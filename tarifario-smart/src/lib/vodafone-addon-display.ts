import type { VodafoneCalculationResult } from './vodafone-calculator.ts';

type DisplayAddon = { id: string; price: number; isInformative?: boolean; tags?: string[] };

export function isVodafonePublicOffer(id: string): boolean {
  return ['vdf-oferta-39-euros', 'vdf-public-600m-2x160gb-39', 'vdf-public-600m-2xilim-44'].includes(id);
}

const ottIds = new Set([
  'vdf-addon-prime', 'vdf-addon-disney', 'vdf-addon-hbo',
  'vdf-addon-netflix-standalone', 'vdf-addon-netflix-added',
  'vdf-tv-prime', 'vdf-tv-disney', 'vdf-tv-hbo',
  'vdf-tv-netflix-standalone', 'vdf-tv-2otts-familiar', 'vdf-tv-3otts-completa',
]);

// TV platforms are priced together by the calculator, not as standalone subscriptions.
export function getVodafoneAddonLabel(addon: DisplayAddon, quote: VodafoneCalculationResult | null): string | null {
  if (!quote?.isValidForCommercialization || !quote.summary) return null;
  const period = quote.periods.months1to3;
  if (ottIds.has(addon.id)) {
    return quote.btsApplied && period.tvAndOttPrice === 0
      ? 'Gratis (BTS hasta 31/12/2026)'
      : `Incluido en TV/OTT: ${period.tvAndOttPrice.toFixed(2)} €/mes en conjunto`;
  }
  if (['vdf-addon-deco-3', 'vdf-addon-deco-4'].includes(addon.id)) {
    return quote.btsApplied && period.decoderPrice === 0 ? 'Gratis (BTS)' : null;
  }
  if (addon.id === 'vdf-addon-secure-net') {
    return `0 €/mes los primeros 3 meses; después ${quote.periods.months4toDec2026.secureNetPrice} €/mes`;
  }
  return null;
}

export function getVodafoneServicesTotal(quote: VodafoneCalculationResult): number {
  const period = quote.periods.months1to3;
  return Math.round((period.totalPrice - period.netBasePrice) * 100) / 100;
}
