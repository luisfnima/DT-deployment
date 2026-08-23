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
  | 'fibra_tv'
  | 'solo_movil'
  | 'solo_fibra'
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
}

export interface Addon {
  id: string;
  operatorId?: OperatorId; // si se omite, es addon global
  name: string;
  category:
    | 'mobile_line'
    | 'fiber_upgrade'
    | 'tv'
    | 'streaming'
    | 'football'
    | 'security'
    | 'business'
    | 'installation';
  monthlyPrice?: number;
  promoPrice?: number;
  promoMonths?: number;
  regularPrice?: number;
  oneTimePrice?: number;
  description?: string;
  tags?: string[];
  source: string;
}
