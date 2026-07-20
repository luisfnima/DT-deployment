import { 
  tariffPlans, 
  addons as rawAddons,
  TariffPlan, 
  Addon as RawAddon,
  PriceKind,
  PlanCategory
} from './tarifario-smart-telco-structured';

export interface Plan {
  id: string;
  operatorId: string;
  name: string;
  speed: string;
  mobile: string;
  tv?: string;
  price: number; // Precio mensual base o precio promocional si existe
  priceAfterPromo?: number; // Precio real después de la promo
  isPromo: boolean;
  promoLabel?: string;
  features: string[];
  
  // Nuevos campos para soporte tarifario real
  priceKind: PriceKind;
  monthlyPrice?: number;
  promoPrice?: number;
  promoMonths?: number;
  regularPrice?: number;
  segment?: string;
  category: PlanCategory;
  notes?: string[];
  streamingIncluded?: string[];
  portabilityFrom?: string;
  fixedLineIncluded?: boolean;
  mobileLines?: number;
  tvIncluded?: boolean;
  isNewCampaign?: boolean;
}

export interface Addon {
  id: string;
  name: string;
  price: number;
  description: string;
  iconName: string;
  category: 'mobile' | 'connectivity' | 'tv' | 'streaming' | 'hardware' | 'setup';
  isOneTime?: boolean;
  
  // Nuevos campos de data real
  operatorId?: string;
  monthlyPrice?: number;
  oneTimePrice?: number;
  promoPrice?: number;
  promoMonths?: number;
  regularPrice?: number;
  notes?: string[];
}

export interface Operator {
  id: string;
  name: string;
  colorTheme: {
    primary: string;
    border: string;
    bg: string;
    text: string;
    hover: string;
    glow: string;
  };
  slogan: string;
}

export const OPERATORS: Operator[] = [
  {
    id: 'yoigo',
    name: 'Yoigo',
    colorTheme: {
      primary: 'bg-fuchsia-600',
      border: 'border-fuchsia-500/30 hover:border-fuchsia-500/70',
      bg: 'bg-fuchsia-950/20',
      text: 'text-fuchsia-400',
      hover: 'hover:bg-fuchsia-950/40',
      glow: 'shadow-[0_0_15px_rgba(217,70,239,0.15)]',
    },
    slogan: 'Pienso, luego Yoigo. Sencillez, ahorro y la red más rápida.',
  },
  {
    id: 'orange',
    name: 'Orange',
    colorTheme: {
      primary: 'bg-orange-600',
      border: 'border-orange-500/30 hover:border-orange-500/70',
      bg: 'bg-orange-950/20',
      text: 'text-orange-400',
      hover: 'hover:bg-orange-950/40',
      glow: 'shadow-[0_0_15px_rgba(249,115,22,0.15)]',
    },
    slogan: 'Conectamos a las personas con lo que más quieren. Tecnología premium.',
  },
  {
    id: 'vodafone',
    name: 'Vodafone',
    colorTheme: {
      primary: 'bg-red-600',
      border: 'border-red-500/30 hover:border-red-500/70',
      bg: 'bg-red-950/20',
      text: 'text-red-400',
      hover: 'hover:bg-red-950/40',
      glow: 'shadow-[0_0_15px_rgba(239,68,68,0.15)]',
    },
    slogan: 'El futuro es apasionante. Ready? Red 5G líder y máxima fiabilidad.',
  },
  {
    id: 'lowi',
    name: 'Lowi',
    colorTheme: {
      primary: 'bg-[#E50015]',
      border: 'border-[#E50015]/30 hover:border-[#E50015]/70',
      bg: 'bg-[#E50015]/10',
      text: 'text-[#E50015]',
      hover: 'hover:bg-[#E50015]/20',
      glow: 'shadow-[0_0_15px_rgba(229,0,21,0.15)]',
    },
    slogan: 'Simple, acumulable y sin complicaciones. La red de Vodafone al mejor precio.',
  },
  {
    id: 'win',
    name: 'WIN',
    colorTheme: {
      primary: 'bg-[#FF5A00]',
      border: 'border-[#FF5A00]/30 hover:border-[#FF5A00]/70',
      bg: 'bg-[#FF5A00]/10',
      text: 'text-[#FF5A00]',
      hover: 'hover:bg-[#FF5A00]/20',
      glow: 'shadow-[0_0_15px_rgba(255,90,0,0.15)]',
    },
    slogan: 'El Internet de los Winners. 100% Fibra Óptica simétrica de alta velocidad.',
  }
];

// Mapper de TariffPlan real a Plan de UI
export const PLANS: Plan[] = tariffPlans.map((p: TariffPlan) => {
  const isPromo = p.priceKind === 'promo_then_regular' || p.priceKind === 'segmented_discount';
  const basePrice = isPromo ? (p.promoPrice ?? p.monthlyPrice ?? 0) : (p.monthlyPrice ?? 0);
  
  const featuresList = [
    p.fiber ? `Fibra ${p.fiber}` : 'Fibra Alta Velocidad',
    p.mobileData ? `Móvil: ${p.mobileData}` : (p.mobileLines ? `${p.mobileLines} líneas móviles` : undefined),
    p.fixedLineIncluded ? 'Línea fija incluida' : undefined,
    p.tvIncluded ? 'Televisión incluida' : undefined,
    ...(p.streamingIncluded || []).map(s => `${s} incluido`),
    ...(p.highlights || [])
  ].filter((f): f is string => !!f);

  const isWin = p.operatorId === 'win';
  const promoLabel = isPromo 
    ? (isWin 
        ? `Promo ${p.promoMonths || 2} meses, luego S/ ${(p.regularPrice ?? p.monthlyPrice ?? basePrice).toFixed(2)}/mes`
        : `Promo ${p.promoMonths || 3} meses, luego ${(p.regularPrice ?? p.monthlyPrice ?? basePrice)}€/mes`) 
    : undefined;

  let speedVal = 'Fibra óptica';
  if (p.fiber) {
    if (p.fiber === '1Gb') {
      speedVal = '1 Gbps (1000 Mbps)';
    } else if (p.fiber.includes('Gb')) {
      speedVal = `${p.fiber}ps Simétricos`;
    } else {
      speedVal = `${p.fiber} Simétricos`;
    }
  }

  const mobileVal = isWin 
    ? 'Solo Internet (Sin móvil)' 
    : (p.mobileData ? `${p.mobileLines || 1} línea(s): ${p.mobileData}` : `${p.mobileLines || 1} línea(s)`);

  return {
    id: p.id,
    operatorId: p.operatorId,
    name: p.name,
    speed: speedVal,
    mobile: mobileVal,
    tv: p.tvIncluded || (p.streamingIncluded && p.streamingIncluded.length > 0) 
      ? `TV + ${p.streamingIncluded?.join(', ') || ''}` 
      : undefined,
    price: basePrice,
    priceAfterPromo: p.regularPrice ?? p.monthlyPrice,
    isPromo: isPromo,
    promoLabel: promoLabel,
    features: Array.from(new Set(featuresList)).slice(0, 4),
    
    // Metadatos reales para filtros
    priceKind: p.priceKind,
    monthlyPrice: p.monthlyPrice,
    promoPrice: p.promoPrice,
    promoMonths: p.promoMonths,
    regularPrice: p.regularPrice,
    segment: p.segment,
    category: p.category,
    notes: p.notes,
    streamingIncluded: p.streamingIncluded,
    portabilityFrom: p.portabilityFrom,
    fixedLineIncluded: p.fixedLineIncluded,
    mobileLines: p.mobileLines,
    tvIncluded: p.tvIncluded,
    isNewCampaign: p.isNewCampaign
  };
});

// Mapper de Addon de datos reales a estructura de UI
export const ADDONS: Addon[] = rawAddons.map((a: RawAddon) => {
  const isOneTime = a.oneTimePrice !== undefined && a.monthlyPrice === undefined;
  const price = a.promoPrice ?? a.monthlyPrice ?? a.oneTimePrice ?? 0;
  
  // Asignar iconos de Lucide correspondientes
  let iconName = 'Smartphone';
  if (a.category === 'tv' || a.category === 'football') iconName = 'Tv';
  else if (a.category === 'streaming') iconName = 'Film';
  else if (a.category === 'fiber_upgrade') iconName = 'Wifi';
  else if (a.category === 'installation') iconName = 'Wrench';
  else if (a.category === 'security') iconName = 'Sparkles';
  else if (a.category === 'business') iconName = 'Tablet';

  // Mapear categorías a los tipos permitidos por el UI anterior
  let uiCategory: 'mobile' | 'connectivity' | 'tv' | 'streaming' | 'hardware' | 'setup' = 'mobile';
  if (a.category === 'tv' || a.category === 'football') uiCategory = 'tv';
  else if (a.category === 'streaming') uiCategory = 'streaming';
  else if (a.category === 'fiber_upgrade') uiCategory = 'connectivity';
  else if (a.category === 'installation') uiCategory = 'setup';
  else if (a.category === 'business') uiCategory = 'connectivity';

  return {
    id: a.id,
    name: a.name,
    price: price,
    description: a.description,
    iconName: iconName,
    category: uiCategory,
    isOneTime: isOneTime,
    
    // Metadatos adicionales reales
    operatorId: a.operatorId,
    monthlyPrice: a.monthlyPrice,
    oneTimePrice: a.oneTimePrice,
    promoPrice: a.promoPrice,
    promoMonths: a.promoMonths,
    regularPrice: a.regularPrice,
    notes: a.notes
  };
});

export interface SalesArgument {
  headline: string;
  gancho: string;
  beneficio: string;
  fraseCliente: string;
  objecionSugerida: string;
  rebuttalOptions: { objection: string; counter: string }[];
  sellingPoints: string[];
}

// Generador dinámico de argumentos de venta
export function getSalesArgument(operatorId: string, totalPrice: number, selectedAddonsCount: number): SalesArgument {
  const isCheap = totalPrice < 50;
  const hasAddons = selectedAddonsCount > 0;

  switch (operatorId) {
    case 'yoigo':
      return {
        headline: 'Yoigo: Fibra Estable y Sin Sorpresas',
        gancho: 'Precio cerrado definitivo sin subidas a los tres meses ni letra pequeña.',
        beneficio: isCheap 
          ? 'Ahorro inmediato en el presupuesto familiar garantizando 2 líneas móviles ilimitadas y fibra simétrica.'
          : 'Gran volumen de servicios adicionales bajo una infraestructura robusta y la facturación más sencilla del sector.',
        fraseCliente: `"Señor cliente, con esta tarifa de Yoigo usted se asegura un precio fijo de ${totalPrice} € al mes, con fibra simétrica de alta velocidad y llamadas ilimitadas. Lo que contrata hoy es lo que pagará."`,
        objecionSugerida: 'Si el cliente duda de la permanencia: recalcar la alta satisfacción de cliente de Yoigo que hace que no necesiten retener a la fuerza.',
        rebuttalOptions: [
          {
            objection: 'Prefiero otra compañía con fútbol.',
            counter: 'Yoigo se centra en ofrecer la mejor fibra y tarifas móviles sin inflar tu factura con fútbol que a veces no usas. Si quieres fútbol, puedes añadir Yoigo TV Depor o contratar plataformas externas y seguirás ahorrando.'
          },
          {
            objection: 'La permanencia es de 12 meses.',
            counter: 'La satisfacción de cliente en Yoigo es la más alta del mercado. La permanencia garantiza la instalación gratis de fibra de última generación y equipamiento premium sin coste inicial.'
          },
          {
            objection: 'El precio me parece elevado.',
            counter: 'Este plan incluye GB ilimitados reales en 2 líneas móviles. Si contratas fibra y 2 líneas por separado en otra compañía pagarías más de 70€ al mes.'
          }
        ],
        sellingPoints: [
          'Precio definitivo garantizado por contrato (sin sorpresas ni subidas tras la promo).',
          'Red de Fibra simétrica de alta velocidad con router autoinstalable inteligente.',
          'Línea telefónica fija incluida sin costes ocultos.',
          'Segunda línea móvil gratis con llamadas y datos ilimitados.'
        ]
      };
    case 'orange':
      return {
        headline: 'Orange: Entretenimiento y Conectividad Premium',
        gancho: 'Centro de entretenimiento familiar completo con TV de más de 60 canales y router WiFi 6 premium.',
        beneficio: hasAddons 
          ? 'Descuento convergente óptimo: al agrupar la televisión y los adicionales en Orange se paga mucho menos que por separado.'
          : 'Conectividad móvil 5G de máxima velocidad en España y equipamiento de enrutamiento WiFi de última generación.',
        fraseCliente: `"Con Orange no solo se lleva una excelente conexión de fibra, sino un pack completo de entretenimiento y televisión para su hogar por ${totalPrice} € al mes. Toda la familia estará conectada y disfrutando de series, cine y datos 5G ilimitados."`,
        objecionSugerida: 'Si encuentra el precio elevado: desglosar el coste del deco 4K y de los canales de TV que ya vienen incluidos sin coste extra.',
        rebuttalOptions: [
          {
            objection: 'No quiero pagar tanto por la televisión.',
            counter: 'Con Orange, la televisión no es un extra costoso; está integrada en el paquete de forma que el precio conjunto es mucho menor que contratar la fibra y plataformas de streaming por separado.'
          },
          {
            objection: 'Movistar me ofrece mejor cobertura.',
            counter: 'Orange cuenta con la red 5G+ más moderna de España, con una cobertura excelente en interiores y velocidades que superan los 1 Gbps en zonas urbanas.'
          },
          {
            objection: 'No necesito router WiFi 6.',
            counter: 'El router WiFi 6 de Orange mejora la cobertura en toda la casa, reduce interferencias con vecinos y permite conectar hasta 50 dispositivos a la vez sin perder velocidad.'
          }
        ],
        sellingPoints: [
          'Pack completo de entretenimiento con más de 60 canales y contenido premium.',
          'Fibra simétrica de 1Gbps óptima para teletrabajo, gaming y streaming en 4K simultáneo.',
          'Descuentos exclusivos de portabilidad (hasta 20% de descuento durante 24 meses).',
          'Hasta 9 líneas en N Extra 10 y 20 líneas en N Extra 20 con llamadas y GB ilimitados.'
        ]
      };
    case 'win':
      return {
        headline: 'WIN: El Internet de los Winners',
        gancho: 'Fibra 100% simétrica con latencia ultra baja, ideal para gaming y teletrabajo.',
        beneficio: 'Equipamiento WiFi 6 de última generación con Mesh y WINBOX, y planes Gamer con ExitLag gratis.',
        fraseCliente: `"Señor cliente, con WIN se asegura una conexión de Fibra Óptica 100% simétrica real por solo S/ ${totalPrice.toFixed(2)} al mes. Con la tecnología de los Winners, navegará a la máxima velocidad y sin caídas."`,
        objecionSugerida: 'Destacar la simetría y los beneficios exclusivos de latencia (ExitLag) en comparación con el cable coaxial (HFC) de otros operadores.',
        rebuttalOptions: [
          {
            objection: '¿Tiene costo de instalación?',
            counter: 'La instalación regular está totalmente bonificada. Para planes corporativos RUC 20 es sumamente accesible: solo S/ 60 pago único o S/ 120 en 3 meses.'
          },
          {
            objection: '¿Qué es ExitLag?',
            counter: 'ExitLag optimiza tu conexión redirigiendo tu tráfico por las rutas de internet más cortas y estables, reduciendo drásticamente el lag (ping) en tus juegos favoritos.'
          },
          {
            objection: '¿Es realmente simétrico?',
            counter: 'Sí, a diferencia de otros operadores, la subida tiene exactamente la misma velocidad que la bajada, lo que es vital para videollamadas, subir archivos y streaming sin cortes.'
          }
        ],
        sellingPoints: [
          'Fibra 100% Simétrica (Misma velocidad de subida y bajada).',
          'Equipamiento WiFi 6 dual (2.4 GHz y 5 GHz) para mayor alcance.',
          'Planes Gamer con ExitLag, cambio de IP y Nitro incluidos.',
          'Dúos con winTV Premium o Directv Go (DGO) integrados.'
        ]
      };
    case 'vodafone':
      return {
        headline: 'Vodafone: Máximo Ahorro Inicial y Red Líder',
        gancho: 'La tarifa promocional más baja de entrada del mercado convergente y Roaming gratis en EE.UU. y Europa.',
        beneficio: totalPrice < 60 
          ? 'Acceso inmediato a la red móvil 5G número 1 del país por una cuota de entrada de tan solo 39€/49€ al mes.'
          : 'La máxima velocidad de fibra y conectividad total móvil con soporte prioritario para familias exigentes.',
        fraseCliente: `"Aproveche la promoción de Vodafone: pagará una cuota reducida los primeros meses y disfrutará de roaming completo y la mejor red móvil del país. Es la oportunidad ideal para ahorrar desde el primer día."`,
        objecionSugerida: 'Si le preocupa el precio después de la promo: hacer el cálculo anual promedio para demostrarle que el ahorro de los primeros meses compensa holgadamente el precio regular.',
        rebuttalOptions: [
          {
            objection: 'El precio sube mucho tras los 3 meses de promoción.',
            counter: 'El descuento de los primeros meses es tan agresivo que, al promediar el coste total del primer año, terminarás pagando mucho menos que con cualquier otra tarifa plana regular.'
          },
          {
            objection: 'No necesito tantas plataformas de streaming.',
            counter: 'Vodafone te permite elegir y agrupar tus plataformas favoritas (Netflix, Prime, Disney, HBO) bajo una única factura y con un descuento que no conseguirás contratándolas por separado.'
          },
          {
            objection: '¿Cómo sé si la red es buena?',
            counter: 'Vodafone cuenta con la red 5G certificada como la más rápida y con mejor latencia de España por múltiples auditorías independientes.'
          }
        ],
        sellingPoints: [
          'Máximo ahorro inicial con cuotas de entrada sumamente competitivas.',
          'Roaming gratuito incluido en toda la Unión Europea y EE.UU.',
          'Más de 100 canales de televisión con decodificador inteligente 4K incluido.',
          'Segunda línea móvil de 160GB o Ilimitada 5G incluida en el pack.'
        ]
      };
    default:
      return {
        headline: 'Conectividad Total Garantizada',
        gancho: 'Tarifa a la medida del cliente sin pagar de más por servicios que no va a utilizar.',
        beneficio: 'Fibra de alta velocidad simétrica y cobertura móvil nacional garantizada.',
        fraseCliente: `"Este paquete le ofrece exactamente lo que necesita para estar comunicado en casa y en movilidad por un total mensual de ${totalPrice} €."`,
        objecionSugerida: 'Validar la cobertura geográfica para asegurar el cierre inmediato.',
        rebuttalOptions: [
          {
            objection: '¿Qué cobertura tiene?',
            counter: 'Contamos con acceso a las tres redes principales de España, garantizando cobertura en el 99% del territorio nacional.'
          }
        ],
        sellingPoints: [
          'Fibra óptica simétrica garantizada.',
          'Cobertura nacional multi-operador.',
          'Soporte técnico local.'
        ]
      };
  }
}
