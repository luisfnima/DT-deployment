'use client';

import React, { useState, useMemo, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  OPERATORS, 
  PLANS as PLANS_DEFAULT, 
  ADDONS as ADDONS_DEFAULT, 
  getSalesArgument, 
  Plan, 
  Addon, 
  Operator 
} from '@/data/plans';
import CompactPermisoPanel from '@/components/CompactPermisoPanel';
import AdminConfigPanel from '@/components/AdminConfigPanel';
import { 
  Smartphone, 
  Wifi, 
  Tv, 
  Film, 
  Sparkles, 
  Video, 
  Tablet, 
  Wrench, 
  Copy, 
  RotateCcw, 
  Check, 
  Info, 
  PhoneCall, 
  Share2, 
  TrendingUp,
  Award,
  Layers,
  Bot,
  Settings,
  Users,
  FileText,
  History,
  HelpCircle,
  Plus,
  Lock,
  Zap,
  Sun,
  Moon,
  Shield
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';

// Ilustraciones premium y logotipos oficiales de visuals.tsx
import { 
  RouterMobileComboVisual, 
  TvStreamingComboVisual, 
  RouterTvComboVisual, 
  AddonSmartphoneVisual, 
  AddonMeshVisual, 
  AddonTvVisual, 
  AddonNetflixVisual, 
  AddonDisneyVisual, 
  AddonMaxVisual,
  AddonPrimeVisual, 
  AddonTripleBundleVisual,
  AddonFinancingVisual, 
  AddonSetupVisual, 
  FiberLinesVisual, 
  TelecomVisual,
  YoigoLogo,
  OrangeLogo,
  VodafoneLogo,
  LowiLogo,
  WinLogo,
  AddonFonoWinVisual,
  AddonWinboxVisual,
  AddonDgoVisual
} from '@/components/visuals';
import SmartTelcoWordmark from '@/components/branding/SmartTelcoWordmark';



// Animaciones Spring Premium
const fadeIn = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.35 } }
} as const;

const fadeUp = {
  hidden: { opacity: 0, y: 15 },
  visible: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 130, damping: 17 } }
} as const;

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.05
    }
  }
} as const;

const popSelect = {
  rest: { scale: 1, y: 0 },
  hover: { scale: 1.03, y: -3, transition: { duration: 0.15, ease: "easeOut" } },
  pressed: { scale: 0.97 }
} as const;

const getMaxLinesCount = (operatorId: string, planId: string, planName: string) => {
  if (operatorId === 'orange') {
    const nameLower = planName.toLowerCase();
    if (nameLower.includes('extra 3') || nameLower.includes('extra 5')) {
      return 4;
    }
    if (nameLower.includes('extra 10')) {
      return 9;
    }
    if (nameLower.includes('extra 20')) {
      return 20;
    }
  }
  if (operatorId === 'lowi') {
    return 4; // Límite de 4 líneas adicionales en Lowi
  }
  return 5; // Límite por defecto para Yoigo y Vodafone
};

function sha256(ascii: string): string {
  function rightRotate(value: number, amount: number) {
    return (value >>> amount) | (value << (32 - amount));
  }
  
  const asciiLength = ascii.length;
  const words: number[] = [];
  const hash = [
    0x6a09e667, 0xbb67ae85, 0x3c6ef372, 0xa54ff53a,
    0x510e527f, 0x9b05688c, 0x1f83d9ab, 0x5be0cd19
  ];
  const k = [
    0x428a2f98, 0x71374491, 0xb5c0fbcf, 0xe9b5dba5, 0x3956c25b, 0x59f111f1, 0x923f82a4, 0xab1c5ed5,
    0xd807aa98, 0x12835b01, 0x243185be, 0x550c7dc3, 0x72be5d74, 0x80deb1fe, 0x9bdc06a7, 0xc19bf174,
    0xe49b69c1, 0xefbe4786, 0x0fc19dc6, 0x240ca1cc, 0x2de92c6f, 0x4a7484aa, 0x5cb0a9dc, 0x76f988da,
    0x983e5152, 0xa831c66d, 0xb00327c8, 0xbf597fc7, 0xc6e00bf3, 0xd5a79147, 0x06ca6351, 0x14292967,
    0x27b70a85, 0x2e1b2138, 0x4d2c6dfc, 0x53380d13, 0x650a7354, 0x766a0abb, 0x81c2c92e, 0x92722c85,
    0xa2bfe8a1, 0xa81a664b, 0xc24b8b70, 0xc76c51a3, 0xd192e819, 0xd6990624, 0xf40e3585, 0x106aa070,
    0x19a4c116, 0x1e376c08, 0x2748774c, 0x34b0bcb5, 0x391c0cb3, 0x4ed8aa4a, 0x5b9cca4f, 0x682e6ff3,
    0x748f82ee, 0x78a5636f, 0x84c87814, 0x8cc70208, 0x90befffa, 0xa4506ceb, 0xbef9a3f7, 0xc67178f2
  ];
  
  let i, j;
  for (i = 0; i < asciiLength; i++) {
    const charCode = ascii.charCodeAt(i);
    words[i >> 2] |= (charCode & 0xff) << (24 - (i % 4) * 8);
  }
  words[asciiLength >> 2] |= 0x80 << (24 - (asciiLength % 4) * 8);
  words[(((asciiLength + 8) >> 6) + 1) * 16 - 1] = asciiLength * 8;
  
  const w = new Array(64);
  for (i = 0; i < words.length; i += 16) {
    for (j = 0; j < 16; j++) w[j] = words[i + j] || 0;
    for (j = 16; j < 64; j++) {
      const s0 = rightRotate(w[j - 15], 7) ^ rightRotate(w[j - 15], 18) ^ (w[j - 15] >>> 3);
      const s1 = rightRotate(w[j - 2], 17) ^ rightRotate(w[j - 2], 19) ^ (w[j - 2] >>> 10);
      w[j] = (w[j - 16] + s0 + w[j - 7] + s1) | 0;
    }
    let [a, b, c, d, e, f, g, h] = hash;
    for (j = 0; j < 64; j++) {
      const S1 = rightRotate(e, 6) ^ rightRotate(e, 11) ^ rightRotate(e, 25);
      const ch = (e & f) ^ (~e & g);
      const temp1 = (h + S1 + ch + k[j] + w[j]) | 0;
      const S0 = rightRotate(a, 2) ^ rightRotate(a, 13) ^ rightRotate(a, 22);
      const maj = (a & b) ^ (a & c) ^ (b & c);
      const temp2 = (S0 + maj) | 0;
      
      h = g;
      g = f;
      f = e;
      e = (d + temp1) | 0;
      d = c;
      c = b;
      b = a;
      a = (temp1 + temp2) | 0;
    }
    hash[0] = (hash[0] + a) | 0;
    hash[1] = (hash[1] + b) | 0;
    hash[2] = (hash[2] + c) | 0;
    hash[3] = (hash[3] + d) | 0;
    hash[4] = (hash[4] + e) | 0;
    hash[5] = (hash[5] + f) | 0;
    hash[6] = (hash[6] + g) | 0;
    hash[7] = (hash[7] + h) | 0;
  }
  
  let result = '';
  for (i = 0; i < 8; i++) {
    const word = hash[i];
    const byte0 = (word >>> 24) & 0xff;
    const byte1 = (word >>> 16) & 0xff;
    const byte2 = (word >>> 8) & 0xff;
    const byte3 = word & 0xff;
    result += byte0.toString(16).padStart(2, '0') +
              byte1.toString(16).padStart(2, '0') +
              byte2.toString(16).padStart(2, '0') +
              byte3.toString(16).padStart(2, '0');
  }
  return result;
}

export default function Home() {
  // Estados de cotización
  const [selectedOperatorId, setSelectedOperatorId] = useState<string>('yoigo');
  const [selectedPlanId, setSelectedPlanId] = useState<string>('yoigo-600');
  const [taxType, setTaxType] = useState<'none' | 'iva' | 'igic'>('none');
  const [selectedAddonIds, setSelectedAddonIds] = useState<Set<string>>(new Set());
  const [copySuccess, setCopySuccess] = useState<boolean>(false);
  const [mobileLinesCount, setMobileLinesCount] = useState<number>(1);
  const [planFilter, setPlanFilter] = useState<string>('all');
  const [showOnlySelectedPlan, setShowOnlySelectedPlan] = useState<boolean>(false);

  
  // Reiniciar filtro de planes al cambiar de operador
  useEffect(() => {
    setPlanFilter('all');
    setPortabilityOrigin('all');
    setShowOnlySelectedPlan(false);
    setTaxType('none');
  }, [selectedOperatorId]);

  // Restablecer vista completa cuando cambia la categoría del filtro
  useEffect(() => {
    setShowOnlySelectedPlan(false);
  }, [planFilter]);
  
  // Estado de navegación en Sidebar
  const [activeTab, setActiveTab] = useState<string>('cotizador');
  const [globalPlans, setGlobalPlans] = useState<Plan[]>([]);
  const [globalAddons, setGlobalAddons] = useState<Addon[]>([]);
  const [isAdminMode, setIsAdminMode] = useState<boolean>(false);
  const [showPermisoModal, setShowPermisoModal] = useState<boolean>(false);
  const [showAdminModal, setShowAdminModal] = useState<boolean>(false);
  const [adminPasswordInput, setAdminPasswordInput] = useState<string>('');
  const [adminError, setAdminError] = useState<string>('');
  const [clientIp, setClientIp] = useState<string>('');
  const [ipRestrictionEnabled, setIpRestrictionEnabled] = useState<boolean>(false);
  const [allowedIps, setAllowedIps] = useState<string[]>([]);
  const [ipBypassGranted, setIpBypassGranted] = useState<boolean>(false);

  // Estados de cliente y asesor
  const [clientName, setClientName] = useState<string>('');
  const [clientPhone, setClientPhone] = useState<string>('');
  const [advisorName, setAdvisorName] = useState<string>('Carlos Mendoza');
  const [advisorRole, setAdvisorRole] = useState<string>('Asesor Comercial');

  // Estados de Evolution API
  const [evolutionUrl, setEvolutionUrl] = useState<string>('https://evolution-api-smart.onrender.com');
  const [evolutionApiKey, setEvolutionApiKey] = useState<string>('NEXO_SECRET_KEY_2026');
  const [evolutionInstance, setEvolutionInstance] = useState<string>('smart-telco');
  const [sendingProposal, setSendingProposal] = useState<boolean>(false);

  // Estados de conexión QR automatizada
  const [wspConnectionState, setWspConnectionState] = useState<'open' | 'close' | 'connecting' | 'loading'>('loading');
  const [qrCodeBase64, setQrCodeBase64] = useState<string>('');

  // Estados de conexión QR para Contraofertas
  const [wspConnectionStateContra, setWspConnectionStateContra] = useState<'open' | 'close' | 'connecting' | 'loading'>('loading');
  const [qrCodeBase64Contra, setQrCodeBase64Contra] = useState<string>('');

  // Estados de Imagen de Propuesta
  const [showImageModal, setShowImageModal] = useState<boolean>(false);
  const [generatedImageUrl, setGeneratedImageUrl] = useState<string>('');
  
  // Estado de modo oscuro
  const [darkMode, setDarkMode] = useState<boolean>(false);

  // Estado de portabilidad de origen
  const [portabilityOrigin, setPortabilityOrigin] = useState<string>('all');

  // Estados de autenticación
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [passwordInput, setPasswordInput] = useState<string>('');
  const [loginError, setLoginError] = useState<string>('');

  // Cargar de localStorage en el cliente
  useEffect(() => {
    if (typeof window !== 'undefined') {
      setAdvisorName(localStorage.getItem('advisorName') || 'Carlos Mendoza');
      setAdvisorRole(localStorage.getItem('advisorRole') || 'Asesor Comercial');
      setEvolutionUrl('https://evolution-api-smart.onrender.com');
      setEvolutionApiKey('NEXO_SECRET_KEY_2026');
      setEvolutionInstance('smart-telco');

      // Single-Sign-On (SSO) from Colaboradores gateway
      let authenticated = false;
      if (typeof window !== 'undefined') {
        const urlParams = new URLSearchParams(window.location.search);
        const ssoRole = urlParams.get('role');
        if (ssoRole === 'admin' || ssoRole === 'asesor') {
          sessionStorage.setItem('dt_auth', 'true');
          setIsAuthenticated(true);
          authenticated = true;
          if (ssoRole === 'admin') {
            setIsAdminMode(true);
            sessionStorage.setItem('admin_mode', 'true');
          } else {
            setIsAdminMode(false);
            sessionStorage.removeItem('admin_mode');
          }
          // Clean the query parameters from the address bar for aesthetic reasons
          const cleanUrl = window.location.protocol + "//" + window.location.host + window.location.pathname;
          window.history.replaceState({ path: cleanUrl }, '', cleanUrl);
        }
      }

      if (!authenticated) {
        const auth = sessionStorage.getItem('dt_auth');
        if (auth === 'true') {
          setIsAuthenticated(true);
        }
      }
      
      // Cargar planes y añadidos de localStorage
      const savedPlans = localStorage.getItem('custom_plans');
      const savedAddons = localStorage.getItem('custom_addons');
      if (savedPlans) {
        setGlobalPlans(JSON.parse(savedPlans));
      } else {
        setGlobalPlans(PLANS_DEFAULT);
      }
      if (savedAddons) {
        setGlobalAddons(JSON.parse(savedAddons));
      } else {
        setGlobalAddons(ADDONS_DEFAULT);
      }

      // Cargar configuración de IP local
      const localIpRestriction = localStorage.getItem('ip_restriction_enabled') === 'true';
      const localAllowedIps = JSON.parse(localStorage.getItem('allowed_ips') || '[]');
      setIpRestrictionEnabled(localIpRestriction);
      setAllowedIps(localAllowedIps);

      // Sincronizar con el backend de Python si está disponible
      fetch('http://localhost:5005/api/config')
        .then(res => {
          if (!res.ok) throw new Error();
          return res.json();
        })
        .then(data => {
          if (data.ip_restriction_enabled !== undefined) {
            setIpRestrictionEnabled(data.ip_restriction_enabled);
            localStorage.setItem('ip_restriction_enabled', String(data.ip_restriction_enabled));
          }
          if (data.allowed_ips !== undefined) {
            setAllowedIps(data.allowed_ips);
            localStorage.setItem('allowed_ips', JSON.stringify(data.allowed_ips));
          }
        })
        .catch(() => {});

      // Obtener IP pública del cliente con redundancia (api.ipify.org -> ipapi.co)
      fetch('https://api.ipify.org?format=json')
        .then(res => res.json())
        .then(data => {
          setClientIp(data.ip || '');
          const savedAdminIp = localStorage.getItem('admin_ip') || '181.176.120.40';
          if (data.ip === savedAdminIp) {
            setIsAdminMode(true);
            sessionStorage.setItem('admin_mode', 'true');
          }
        })
        .catch(() => {
          // Fallback a ipapi
          fetch('https://ipapi.co/json/')
            .then(res => res.json())
            .then(data => {
              setClientIp(data.ip || '');
            })
            .catch(() => {});
        });

      const savedAdminMode = sessionStorage.getItem('admin_mode');
      if (savedAdminMode === 'true') {
        setIsAdminMode(true);
      }

      const savedTheme = localStorage.getItem('theme');
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      if (savedTheme === 'dark' || (!savedTheme && prefersDark)) {
        setDarkMode(true);
        document.documentElement.classList.add('dark');
      } else {
        setDarkMode(false);
        document.documentElement.classList.remove('dark');
      }
    }
  }, []);

  // Función auxiliar de fetch con reintentos para soportar caídas/inactividad de Render
  const fetchWithRetry = async (url: string, options: RequestInit, retries = 3, delay = 3500): Promise<Response> => {
    try {
      const res = await fetch(url, options);
      if (!res.ok && retries > 0) {
        await new Promise(resolve => setTimeout(resolve, delay));
        return fetchWithRetry(url, options, retries - 1, delay);
      }
      return res;
    } catch (err) {
      if (retries > 0) {
        await new Promise(resolve => setTimeout(resolve, delay));
        return fetchWithRetry(url, options, retries - 1, delay);
      }
      throw err;
    }
  };

  // Wake up Render Evolution API on page load (prevents cold start delay)
  useEffect(() => {
    if (typeof window !== 'undefined' && evolutionUrl) {
      console.log('⚡ [Evolution API] Mandando ping de despertar a Render...');
      // Despertar propuestas
      fetch(`${evolutionUrl}/instance/connectionState/smart-telco`, {
        headers: { 'apikey': evolutionApiKey }
      }).catch(() => {});
      // Despertar contraofertas
      fetch(`${evolutionUrl}/instance/connectionState/contraofertas-dreamteam`, {
        headers: { 'apikey': evolutionApiKey }
      }).catch(() => {});
    }
  }, [evolutionUrl, evolutionApiKey]);

  // Verificar estado de conexión de WhatsApp periódicamente
  useEffect(() => {
    let interval: any;
    const checkStatus = async () => {
      if (!evolutionUrl || !evolutionInstance || !evolutionApiKey) return;
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 6000);

      try {
        const response = await fetch(`${evolutionUrl}/instance/connectionState/${evolutionInstance}`, {
          headers: { 'apikey': evolutionApiKey },
          signal: controller.signal
        });
        clearTimeout(timeoutId);
        if (response.ok) {
          const data = await response.json();
          if (data.instance?.state === 'open') {
            setWspConnectionState('open');
            setQrCodeBase64('');
          } else {
            setWspConnectionState(prev => prev === 'connecting' ? 'connecting' : 'close');
          }
        } else {
          setWspConnectionState('close');
        }
      } catch (err) {
        setWspConnectionState('close');
      }
    };

    const timer = setTimeout(() => {
      checkStatus();
      interval = setInterval(checkStatus, 10000);
    }, 1500);

  }, [evolutionUrl, evolutionApiKey, evolutionInstance]);

  // Verificar estado de conexión de WhatsApp Contraofertas periódicamente
  useEffect(() => {
    let interval: any;
    const checkStatusContra = async () => {
      if (!evolutionUrl || !evolutionApiKey) return;
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 6000);

      try {
        const response = await fetch(`${evolutionUrl}/instance/connectionState/contraofertas-dreamteam`, {
          headers: { 'apikey': evolutionApiKey },
          signal: controller.signal
        });
        clearTimeout(timeoutId);
        if (response.ok) {
          const data = await response.json();
          if (data.instance?.state === 'open') {
            setWspConnectionStateContra('open');
            setQrCodeBase64Contra('');
          } else {
            setWspConnectionStateContra(prev => prev === 'connecting' ? 'connecting' : 'close');
          }
        } else {
          setWspConnectionStateContra('close');
        }
      } catch (err) {
        setWspConnectionStateContra('close');
      }
    };

    const timer = setTimeout(() => {
      checkStatusContra();
      interval = setInterval(checkStatusContra, 10000);
    }, 2000);

    return () => {
      clearTimeout(timer);
      if (interval) clearInterval(interval);
    };
  }, [evolutionUrl, evolutionApiKey]);

  const handleConnectWSPContra = async () => {
    setWspConnectionStateContra('connecting');
    try {
      // 1. Intentar crear la instancia si no existe
      await fetch(`${evolutionUrl}/instance/create`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'apikey': evolutionApiKey
        },
        body: JSON.stringify({
          instanceName: 'contraofertas-dreamteam',
          token: evolutionApiKey,
          qrcode: true,
          integration: 'WHATSAPP-BAILEYS'
        })
      });

      // 2. Pedir el código QR
      const qrResponse = await fetch(`${evolutionUrl}/instance/connect/contraofertas-dreamteam`, {
        headers: { 'apikey': evolutionApiKey }
      });
      if (qrResponse.ok) {
        const qrData = await qrResponse.json();
        if (qrData.base64) {
          setQrCodeBase64Contra(qrData.base64);
          setWspConnectionStateContra('close'); // render QR in UI
        } else {
          setWspConnectionStateContra('close');
        }
      } else {
        setWspConnectionStateContra('close');
      }
    } catch (err) {
      alert('Error de conexión con la Evolution API de Contraofertas.');
      setWspConnectionStateContra('close');
    }
  };

  const handleDisconnectWSPContra = async () => {
    try {
      await fetch(`${evolutionUrl}/instance/logout/contraofertas-dreamteam`, {
        method: 'POST',
        headers: { 'apikey': evolutionApiKey }
      });
      setWspConnectionStateContra('close');
      setQrCodeBase64Contra('');
    } catch (err) {
      alert('Error al desconectar la instancia de Contraofertas.');
    }
  };

  const handleResetWSPContra = async () => {
    setWspConnectionStateContra('connecting');
    setQrCodeBase64Contra('');
    try {
      // Logout
      await fetch(`${evolutionUrl}/instance/logout/contraofertas-dreamteam`, {
        method: 'POST',
        headers: { 'apikey': evolutionApiKey }
      }).catch(() => {});
      
      // Delete
      await fetch(`${evolutionUrl}/instance/delete/contraofertas-dreamteam`, {
        method: 'DELETE',
        headers: { 'apikey': evolutionApiKey }
      }).catch(() => {});

      // Recreate
      const createRes = await fetch(`${evolutionUrl}/instance/create`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'apikey': evolutionApiKey
        },
        body: JSON.stringify({
          instanceName: 'contraofertas-dreamteam',
          token: evolutionApiKey,
          qrcode: true,
          integration: 'WHATSAPP-BAILEYS'
        })
      });

      if (!createRes.ok) {
        throw new Error('No se pudo recrear la instancia.');
      }

      // Connect (QR)
      const qrResponse = await fetch(`${evolutionUrl}/instance/connect/contraofertas-dreamteam`, {
        headers: { 'apikey': evolutionApiKey }
      });
      if (qrResponse.ok) {
        const qrData = await qrResponse.json();
        if (qrData.base64) {
          setQrCodeBase64Contra(qrData.base64);
          setWspConnectionStateContra('close');
        } else {
          setWspConnectionStateContra('close');
        }
      } else {
        setWspConnectionStateContra('close');
      }
    } catch (err) {
      alert('Error al restablecer la conexión de Contraofertas.');
      setWspConnectionStateContra('close');
    }
  };

  const handleConnectWSP = async () => {
    setWspConnectionState('connecting');
    try {
      // 1. Intentar crear la instancia por si no existe
      await fetch(`${evolutionUrl}/instance/create`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'apikey': evolutionApiKey
        },
        body: JSON.stringify({
          instanceName: evolutionInstance,
          token: evolutionApiKey,
          qrcode: true,
          integration: 'WHATSAPP-BAILEYS'
        })
      });

      // 2. Solicitar el código QR
      const qrResponse = await fetch(`${evolutionUrl}/instance/connect/${evolutionInstance}`, {
        headers: { 'apikey': evolutionApiKey }
      });
      if (qrResponse.ok) {
        const qrData = await qrResponse.json();
        if (qrData.base64) {
          setQrCodeBase64(qrData.base64);
        } else {
          alert('No se pudo obtener la imagen base64 del código QR.');
          setWspConnectionState('close');
        }
      } else {
        setWspConnectionState('close');
      }
    } catch (err) {
      console.error(err);
      alert('Error de conexión con la Evolution API. ¿Está encendido el servidor?');
      setWspConnectionState('close');
    }
  };

  const handleDisconnectWSP = async () => {
    if (confirm('¿Estás seguro de que deseas desconectar WhatsApp y cerrar la sesión?')) {
      try {
        await fetch(`${evolutionUrl}/instance/logout/${evolutionInstance}`, {
          method: 'DELETE',
          headers: { 'apikey': evolutionApiKey }
        });
        setWspConnectionState('close');
        setQrCodeBase64('');
      } catch (err) {
        console.error(err);
      }
    }
  };

  const handleResetWSP = async () => {
    if (confirm('¿Deseas restablecer y reiniciar la instancia de WhatsApp? Esto eliminará sesiones colgadas y generará un QR fresco.')) {
      setWspConnectionState('connecting');
      setQrCodeBase64('');
      try {
        // 1. Forzar logout/delete para limpiar la sesión rota de Baileys
        try {
          await fetch(`${evolutionUrl}/instance/logout/${evolutionInstance}`, {
            method: 'DELETE',
            headers: { 'apikey': evolutionApiKey }
          });
        } catch (e) {}

        try {
          await fetch(`${evolutionUrl}/instance/delete/${evolutionInstance}`, {
            method: 'DELETE',
            headers: { 'apikey': evolutionApiKey }
          });
        } catch (e) {}

        // 2. Crear una instancia totalmente limpia
        const createRes = await fetch(`${evolutionUrl}/instance/create`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'apikey': evolutionApiKey
          },
          body: JSON.stringify({
            instanceName: evolutionInstance,
            token: evolutionApiKey,
            qrcode: true,
            integration: 'WHATSAPP-BAILEYS'
          })
        });

        if (!createRes.ok) {
          throw new Error('No se pudo recrear la instancia en la Evolution API.');
        }

        // 3. Solicitar el código QR
        const qrResponse = await fetch(`${evolutionUrl}/instance/connect/${evolutionInstance}`, {
          headers: { 'apikey': evolutionApiKey }
        });
        if (qrResponse.ok) {
          const qrData = await qrResponse.json();
          if (qrData.base64) {
            setQrCodeBase64(qrData.base64);
          } else {
            alert('No se pudo obtener la imagen base64 del código QR.');
            setWspConnectionState('close');
          }
        } else {
          setWspConnectionState('close');
        }
      } catch (err: any) {
        console.error(err);
        alert(`Error al reiniciar la instancia: ${err.message}`);
        setWspConnectionState('close');
      }
    }
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (sha256(passwordInput) === '90b99f7cb1dff6ef96daf8596b31546027a75fc1f0db7f61eddcee88eb91b7b7') {
      setIsAuthenticated(true);
      sessionStorage.setItem('dt_auth', 'true');
      setLoginError('');
    } else {
      setLoginError('Contraseña incorrecta. Inténtalo de nuevo.');
    }
  };

  const toggleDarkMode = () => {
    const nextDark = !darkMode;
    setDarkMode(nextDark);
    if (typeof window !== 'undefined') {
      if (nextDark) {
        document.documentElement.classList.add('dark');
        localStorage.setItem('theme', 'dark');
      } else {
        document.documentElement.classList.remove('dark');
        localStorage.setItem('theme', 'light');
      }
    }
  };

  // Guardar en localStorage cuando cambien
  const saveAdvisorInfo = (name: string, role: string) => {
    setAdvisorName(name);
    setAdvisorRole(role);
    localStorage.setItem('advisorName', name);
    localStorage.setItem('advisorRole', role);
  };

  const saveApiSettings = (url: string, key: string, inst: string) => {
    setEvolutionUrl(url);
    setEvolutionApiKey(key);
    setEvolutionInstance(inst);
    localStorage.setItem('evolutionUrl', url);
    sessionStorage.setItem('evolutionApiKey', key);
    localStorage.setItem('evolutionInstance', inst);
  };

  // Función para generar la propuesta gráfica usando HTML5 Canvas (100% Gratis y Local)
  const generateProposalImage = () => {
    const canvas = document.createElement('canvas');
    canvas.width = 800;
    canvas.height = 560;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Colores de marca
    let brandColor = '#B026FF'; // Yoigo
    if (selectedOperatorId === 'orange') {
      brandColor = '#FF7900';
    } else if (selectedOperatorId === 'vodafone') {
      brandColor = '#E60000';
    } else if (selectedOperatorId === 'lowi') {
      brandColor = '#E50015';
    } else if (selectedOperatorId === 'win') {
      brandColor = '#FFCC00';
    }

    // 1. Fondo general
    ctx.fillStyle = '#F4F7FB';
    ctx.fillRect(0, 0, 800, 560);

    // 2. Encabezado principal (negro para Lowi, color de marca para otros)
    ctx.fillStyle = selectedOperatorId === 'lowi' ? '#0A0A0A' : brandColor;
    ctx.fillRect(0, 0, 800, 110);

    // 3. Dibujar Logo de la Compañía en el header
    ctx.save();
    if (selectedOperatorId === 'yoigo') {
      ctx.translate(30, 22);
      ctx.scale(0.85, 0.85);
      ctx.fillStyle = '#FFFFFF';
      const p = new Path2D("m 197.42407,51.55475 c -2.32534,-2.78186 -3.91379,-10.4887 -4.67421,-9.80354 -0.63437,0.57158 -0.61568,8.97997 -0.68934,12.20058 m 0,0 c -0.0984,4.30052 -3.95932,12.73113 -7.19063,15.70115 -6.62642,6.0906 -20.5368,8.56281 -32.6059,5.79486 -11.96926,-2.74506 -14.93719,-5.54465 -13.35294,-12.59562 1.38007,-6.14224 3.26071,-7.67951 7.34254,-6.00191 6.65909,2.73683 14.04765,4.26759 17.48551,3.62264 3.81674,-0.71602 8.2609,-4.50172 8.2609,-7.03694 0,-1.36311 -0.7202,-1.48467 -4.75,-0.80173 -6.64648,1.1264 -14.9674,0.54549 -18.89709,-1.31927 -12.93596,-6.13852 -16.30536,-25.25892 -6.94396,-39.40496 5.48721,-8.29173 17.26957,-11.96341 25.99903,-8.10195 l 4.73786,2.09578 2.86992,-2.12183 c 2.41495,-1.78544 3.76187,-2.02977 8.49615,-1.54115 7.56683,0.78097 8.48809,1.7333 8.48809,8.77436 0,3.20019 0.3599,12.82668 0.79977,13.09853 0.43988,0.27186 2.35238,-8.37799 4.25,-10.92825 5.32518,-7.1566 11.2643,-9.73386 22.42917,-9.73306 7.65052,5.6e-4 9.87291,0.4 14.62802,2.62919 9.72296,4.55812 13.89304,12.47328 13.89304,26.37016 0,10.06121 -1.83908,15.72271 -6.73772,20.74171 -5.25696,5.38611 -10.92223,7.26592 -21.76228,7.22098 -11.16064,-0.0463 -16.49997,-2.1891 -22.07593,-8.85973 m 30.36043,-11.93292 c 2.94996,-2.94995 3.4019,-10.21042 0.87558,-14.06607 -2.30754,-3.52175 -8.51866,-5.10791 -12.87351,-3.28757 -4.34415,1.81587 -5.87279,3.81597 -6.41564,8.39438 -0.5774,4.86987 1.26703,8.3303 5.64298,10.58707 4.39547,2.26684 9.53048,1.6123 12.77059,-1.62781 z M 171.8,36.75179 c 0.69804,-0.69804 1.2,-4.04444 1.2,-8 0,-7.6466 -1.91708,-10.8 -6.56574,-10.8 -6.02261,0 -9.3584,3.65261 -9.40246,10.29546 -0.043,6.48499 3.0167,9.70454 9.22275,9.70454 2.39,0 4.88545,-0.54 5.54545,-1.2 z m -157.67924,36.13731 c -2.95858,-0.52693 -7.34608,-1.82809 -9.75,-2.89145 -3.92745,-1.7373 -4.37076,-2.27896 -4.37076,-5.34041 0,-8.71876 3.89847,-12.36067 9.90599,-9.25406 9.78554,5.06029 23.09401,2.55885 23.09401,-4.34073 0,-1.74566 -0.64553,-1.84906 -8.48852,-1.35976 -13.37277,0.8343 -20.0727,-2.79183 -23.37338,-12.65012 -1.41439,-4.22443 -1.48287,-20.00981 -0.11804,-27.20658 1.55507,-8.19982 3.16272,-9.29481 12.11552,-8.252 l 7.36442,0.8578 0,14.13402 c 0,12.49186 0.22133,14.37986 1.90499,16.25 2.42803,2.69695 6.97804,2.73295 9.63476,0.0762 1.87157,-1.87157 2.01968,-3.10807 1.79623,-14.99623 -0.15522,-8.25859 0.14781,-13.34781 0.83574,-14.03574 1.29057,-1.29057 16.27419,-1.38237 17.54903,-0.10752 0.48973,0.48972 1.12748,5.11789 1.41724,10.28482 0.28975,5.16693 -0.70391,15.37672 1.68076,15.78366 0.27022,0.85389 1.16192,-5.66535 3.4533,-8.94247 5.30828,-7.59188 11.01216,-10.34106 22.3956,-10.79433 11.45664,-0.45619 17.24994,1.40719 22.67575,7.2935 2.19834,2.38491 4.81352,6.63522 5.81151,9.44514 0.99799,2.8099 1.71714,12.60892 2.03461,12.60892 0.31747,0 1.93246,-8.85 3.15236,-10.5 2.03364,-2.75065 2.71421,-3 8.18806,-3 10.04162,0 11.47006,3.01534 11.47006,24.21246 0,15.40285 -0.45512,16.19898 -9.29102,16.25248 -8.07484,0.0489 -10.70762,-1.86556 -12.29012,-8.93689 -0.68041,-3.04043 -0.17539,-10.17091 -0.62374,-10.17091 -0.44835,0 -2.90118,5.91418 -3.7047,7.46801 -2.27153,4.39266 -9.03584,9.94045 -13.78374,11.30483 -6.16671,1.77209 -19.48476,1.53944 -24.05629,-0.42025 -5.88553,-2.52296 -10.29054,-6.36679 -12.87128,-11.23154 -1.30691,-2.46354 -2.7709,-13.6333 -3.25331,-13.4725 -0.48242,0.16081 -1.65801,12.1019 -2.61242,15.18655 -2.3982,7.75101 -5.18005,11.25295 -11.32872,14.26122 -6.0832,2.97623 -17.70032,4.06248 -26.5639,2.48385 z m 75.12072,-26.45151 c 3.06346,-3.06347 3.92147,-6.82884 2.74513,-12.04707 -1.12165,-4.97561 -4.11553,-7.43873 -9.04163,-7.43873 -6.00902,0 -9.14068,3.31481 -9.71889,10.28725 -0.43343,5.22656 -0.25044,5.84225 2.57675,8.66944 4.01841,4.0184 9.72467,4.24307 13.43864,0.52911 z m 28.40107,-27.47025 c -8.64492,-2.72303 -10.01698,-12.37794 -2.41748,-17.01135 3.88788,-2.37044 10.67332,-2.62523 14.68374,-0.55136 5.8218,3.01058 6.42631,11.75627 1.08295,15.66758 -3.0181,2.20923 -9.45216,3.12264 -13.34921,1.89513 z");
      ctx.fill(p);
    } else if (selectedOperatorId === 'orange') {
      ctx.fillStyle = '#FFFFFF';
      ctx.fillRect(30, 25, 60, 60);
      ctx.fillStyle = '#FF7900';
      ctx.font = '900 13px Helvetica, Arial, sans-serif';
      ctx.textAlign = 'right';
      ctx.fillText('orange', 85, 78);
    } else if (selectedOperatorId === 'vodafone') {
      ctx.fillStyle = '#FFFFFF';
      ctx.beginPath();
      ctx.arc(65, 55, 32, 0, Math.PI * 2);
      ctx.fill();
      
      // Dibujar texto "vodafone" con tipografía geométrica (Century Gothic / Futura)
      ctx.fillStyle = '#FFFFFF';
      ctx.font = 'bold 24px "Century Gothic", "Avant Garde", Futura, sans-serif';
      ctx.textAlign = 'left';
      ctx.textBaseline = 'middle';
      ctx.fillText('vodafone', 112, 55);
      ctx.textBaseline = 'alphabetic'; // Restaurar
      
      ctx.save();
      ctx.translate(49, 39);
      ctx.scale(1.33, 1.33);
      ctx.fillStyle = '#E60000';
      const p = new Path2D("M 16.25 1.12 C 16.57 1.12 16.9 1.15 17.11 1.22 C 14.94 1.67 13.21 3.69 13.22 6 C 13.22 6.05 13.22 6.11 13.23 6.17 C 16.87 7.06 18.5 9.25 18.5 12.28 C 18.54 15.31 16.14 18.64 12.09 18.65 C 8.82 18.66 5.41 15.86 5.39 11.37 C 5.38 8.4 7 5.54 9.04 3.85 C 11.04 2.19 13.77 1.13 16.25 1.12 Z");
      ctx.fill(p);
      ctx.restore();
    } else if (selectedOperatorId === 'lowi') {
      // Recreamos de forma exacta y fiel el logotipo vectorial oficial de Lowi en el Canvas (letras rojas en fondo negro)
      ctx.save();
      ctx.translate(30, 35); // Posicionamiento exacto y alineado
      
      // 'l': rect x="15" y="5" width="8" height="26" rx="4"
      ctx.fillStyle = '#E50015';
      ctx.beginPath();
      ctx.roundRect ? ctx.roundRect(15, 5, 8, 26, 4) : ctx.rect(15, 5, 8, 26);
      ctx.fill();
      
      // 'o': circle cx="37" cy="21" r="7" con borde de 6px
      ctx.strokeStyle = '#E50015';
      ctx.lineWidth = 6;
      ctx.beginPath();
      ctx.arc(37, 21, 7, 0, Math.PI * 2);
      ctx.stroke();
      
      // 'w': trazado redondeado grueso de la marca con Path2D exacto del SVG
      ctx.lineWidth = 6;
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';
      const wPath = new Path2D("M 51 14 L 55 27 A 1.5 1.5 0 0 0 58 27 L 61 19 L 64 27 A 1.5 1.5 0 0 0 67 27 L 71 14");
      ctx.stroke(wPath);
      
      // 'i': rect x="81" y="13" width="8" height="18" rx="4"
      ctx.fillStyle = '#E50015';
      ctx.beginPath();
      ctx.roundRect ? ctx.roundRect(81, 13, 8, 18, 4) : ctx.rect(81, 13, 8, 18);
      ctx.fill();
      
      // Punto de la 'i': círculo cx="85" cy="7" r="4.5" en Blanco
      ctx.fillStyle = '#FFFFFF';
      ctx.beginPath();
      ctx.arc(85, 7, 4.5, 0, Math.PI * 2);
      ctx.fill();
      
      ctx.restore();
    } else if (selectedOperatorId === 'win') {
      ctx.save();
      ctx.translate(30, 38);
      ctx.fillStyle = '#0F172A';
      ctx.strokeStyle = '#0F172A';
      ctx.lineWidth = 5.5;
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';
      
      // Draw 'w'
      const wPath = new Path2D("M 15 8 L 22 25 L 29 8 L 36 25 L 43 8");
      ctx.stroke(wPath);
      
      // Draw 'i'
      ctx.beginPath();
      ctx.fillRect(50, 8, 5.5, 17);
      
      // Draw 'n'
      const nPath = new Path2D("M 62 25 L 62 13 L 73 25 L 73 8");
      ctx.stroke(nPath);
      
      ctx.restore();
    }
    ctx.restore();

    // 4. Texto del Encabezado
    ctx.fillStyle = selectedOperatorId === 'win' ? '#0F172A' : '#FFFFFF';
    ctx.font = '900 24px Inter, sans-serif';
    ctx.textAlign = 'right';
    ctx.fillText('PROPUESTA COMERCIAL', 770, 52);
    ctx.font = 'bold 12px Inter, sans-serif';
    ctx.fillStyle = selectedOperatorId === 'win' ? 'rgba(15,23,42,0.7)' : 'rgba(255,255,255,0.8)';
    ctx.fillText('SOLUCIONES DE CONECTIVIDAD SMART TELCO', 770, 75);

    // 5. Card principal de la propuesta
    ctx.fillStyle = '#FFFFFF';
    ctx.shadowColor = 'rgba(15,23,42,0.08)';
    ctx.shadowBlur = 18;
    ctx.shadowOffsetY = 6;
    ctx.beginPath();
    ctx.roundRect ? ctx.roundRect(30, 130, 740, 330, 20) : ctx.rect(30, 130, 740, 330);
    ctx.fill();
    ctx.shadowColor = 'transparent'; // Reset

    // 6. Título del Cliente
    ctx.fillStyle = '#0F172A';
    ctx.font = '900 18px Inter, sans-serif';
    ctx.textAlign = 'left';
    ctx.fillText(`Propuesta para: ${clientName || 'Cliente Estimado'}`, 60, 180);
    
    // Línea divisoria
    ctx.strokeStyle = '#F1F5F9';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(60, 205);
    ctx.lineTo(740, 205);
    ctx.stroke();

    // 7. Detalles del Plan Base
    ctx.fillStyle = brandColor;
    ctx.font = '900 11px Inter, sans-serif';
    ctx.fillText('PLAN BASE CONTRATADO', 60, 235);

    ctx.fillStyle = '#0F172A';
    ctx.font = '900 15px Inter, sans-serif';
    
    const planName = activePlan ? activePlan.name : 'Plan Base';
    let bulletPointsY = 288;
    
    const words = planName.split(' ');
    let firstLine = '';
    let secondLine = '';
    let isWrapped = false;
    
    for (let i = 0; i < words.length; i++) {
      const testLine = firstLine + (firstLine ? ' ' : '') + words[i];
      const metrics = ctx.measureText(testLine);
      if (metrics.width > 310) {
        secondLine = words.slice(i).join(' ');
        isWrapped = true;
        break;
      } else {
        firstLine = testLine;
      }
    }
    
    if (isWrapped) {
      ctx.fillText(firstLine, 60, 258);
      ctx.fillText(secondLine, 60, 278);
      bulletPointsY = 308;
    } else {
      ctx.fillText(firstLine, 60, 260);
      bulletPointsY = 288;
    }

    ctx.fillStyle = '#475569';
    ctx.font = 'bold 12px Inter, sans-serif';
    ctx.fillText(`• Fibra: ${activePlan ? activePlan.speed : ''}`, 60, bulletPointsY);
    ctx.fillText(`• Móvil: ${activePlan ? activePlan.mobile : ''}`, 60, bulletPointsY + 22);
    if (activePlan?.tv) {
      ctx.fillText(`• TV: ${activePlan.tv}`, 60, bulletPointsY + 44);
    }

    // 8. Servicios Adicionales (Addons)
    ctx.fillStyle = brandColor;
    ctx.font = '900 11px Inter, sans-serif';
    ctx.fillText('SERVICIOS ADICIONALES', 400, 235);

    let startY = 260;
    if (activeAddons.length === 0) {
      ctx.fillStyle = '#94A3B8';
      ctx.font = 'italic bold 12px Inter, sans-serif';
      ctx.fillText('Ninguno seleccionado', 400, startY);
    } else {
      ctx.font = 'bold 12px Inter, sans-serif';
      activeAddons.forEach((addon, index) => {
        if (index < 4) {
          const qty = addon.id === 'addon-line-mobile' || addon.id === 'global-mobile-line' || addon.id === 'yoigo-duo-adicional' || addon.id.includes('linea-adicional') ? mobileLinesCount : 1;
          const nameText = qty > 1 ? `+ ${addon.name} (x${qty})` : `+ ${addon.name}`;
          const priceValue = addon.price === 0 
            ? 'Gratis' 
            : (selectedOperatorId === 'win' 
                ? `+S/ ${(addon.price * qty).toFixed(2)}/mes` 
                : `+${addon.price * qty} €/mes`);
          ctx.fillStyle = '#0F172A';
          ctx.fillText(nameText, 400, startY);
          ctx.fillStyle = '#64748B';
          ctx.fillText(`(${priceValue})`, 610, startY);
          startY += 25;
        }
      });
    }

    // 9. Ahorro Promocional
    if (hasPromo && savingsAmount > 0) {
      ctx.fillStyle = '#FEF2F2';
      ctx.beginPath();
      ctx.roundRect ? ctx.roundRect(60, 370, 310, 68, 12) : ctx.rect(60, 370, 310, 68);
      ctx.fill();
      ctx.strokeStyle = '#FEE2E2';
      ctx.lineWidth = 1;
      ctx.stroke();

      const months = activePlan?.promoMonths || 3;
      ctx.fillStyle = '#EF4444';
      ctx.font = '900 10px Inter, sans-serif';
      ctx.fillText('🐷 BENEFICIO EXCLUSIVO', 75, 392);
      ctx.fillStyle = '#991B1B';
      ctx.font = '900 13px Inter, sans-serif';
      const savingsText = selectedOperatorId === 'win'
        ? `¡Ahorras S/ ${savingsAmount.toFixed(2)}/mes por ${months} meses!`
        : `¡Ahorras ${savingsAmount} €/mes por ${months} meses!`;
      ctx.fillText(savingsText, 75, 415);
    }

    // 10. Bloque de Precio Total
    ctx.fillStyle = brandColor;
    ctx.beginPath();
    ctx.roundRect ? ctx.roundRect(400, 370, 340, 68, 14) : ctx.rect(400, 370, 340, 68);
    ctx.fill();

    ctx.fillStyle = selectedOperatorId === 'win' ? '#0F172A' : '#FFFFFF';
    ctx.textAlign = 'center';
    ctx.font = '900 9px Inter, sans-serif';
    ctx.fillText(selectedOperatorId === 'win' ? 'CUOTA MENSUAL TOTAL (IGV INC.)' : 'CUOTA MENSUAL TOTAL (IVA INC.)', 570, 392);

    const priceText = selectedOperatorId === 'win'
      ? `S/ ${(hasPromo ? totalPricePromo : totalPriceNormal).toFixed(2)}/mes`
      : `${hasPromo ? totalPricePromo : totalPriceNormal} €/mes`;
    ctx.fillStyle = selectedOperatorId === 'win' ? '#0F172A' : '#FFFFFF';
    ctx.font = '900 24px Inter, sans-serif';
    ctx.fillText(priceText, 570, 420);

    // 11. Footer Asesor
    ctx.fillStyle = '#94A3B8';
    ctx.font = 'bold 11px Inter, sans-serif';
    ctx.textAlign = 'left';
    ctx.fillText(`Asesor Comercial: ${advisorName} (${advisorRole})`, 30, 510);

    ctx.textAlign = 'right';
    const dateStr = new Date().toLocaleDateString('es-ES', { day: '2-digit', month: '2-digit', year: 'numeric' });
    ctx.fillText(`Propuesta Válida: ${dateStr}`, 770, 510);

    const dataUrl = canvas.toDataURL('image/png');
    setGeneratedImageUrl(dataUrl);
    setShowImageModal(true);
  };

  // Función para enviar la propuesta usando la Evolution API (WhatsApp)
  const sendEvolutionProposal = async () => {
    if (!evolutionUrl || !evolutionApiKey || !evolutionInstance || !clientPhone) {
      alert('Por favor configura la URL, API Key, Nombre de Instancia y el Teléfono del Cliente para enviar.');
      return;
    }

    setSendingProposal(true);
    try {
      const cleanPhone = clientPhone.replace(/\D/g, '');
      if (cleanPhone.length < 9 || cleanPhone.length > 15) {
        alert('Número de teléfono inválido. Debe tener entre 9 y 15 dígitos.');
        setSendingProposal(false);
        return;
      }
      const number = cleanPhone;

      const separatorLine = '---------------------------------------------';
      let captionText = `*PROPUESTA COMERCIAL PERSONALIZADA - SMART TELCO*\n`;
      captionText += `${separatorLine}\n`;
      captionText += `*Hola ${clientName || 'Cliente'}!*\n`;
      captionText += `Aquí tienes el resumen de tu propuesta personalizada con *${activeOperator.name}*:\n\n`;
      
      const formatPrice = (price: number) => {
        return selectedOperatorId === 'win' ? `S/ ${price.toFixed(2)}` : `${price} €`;
      };

      captionText += `*Plan Base:* ${activePlan?.name} (${formatPrice(basePrice)}/mes)\n`;
      captionText += `*Velocidad Fibra:* ${activePlan?.speed}\n`;
      captionText += `*Móvil:* ${activePlan?.mobile}\n`;
      if (activePlan?.tv) {
        captionText += `*Televisión:* ${activePlan.tv}\n`;
      }
      captionText += `\n`;

      if (activeAddons.length > 0) {
        captionText += `*Servicios Adicionales:*\n`;
        activeAddons.forEach(addon => {
          const qty = addon.id === 'addon-line-mobile' || addon.id === 'global-mobile-line' || addon.id === 'yoigo-duo-adicional' || addon.id.includes('linea-adicional') ? mobileLinesCount : 1;
          const qtyStr = qty > 1 ? ` (x${qty})` : '';
          const addonPriceText = selectedOperatorId === 'win' 
            ? `+S/ ${(addon.price * qty).toFixed(2)}/mes` 
            : `+${addon.price * qty} €/mes`;
          captionText += `• ${addon.name}${qtyStr}: ${addonPriceText}\n`;
        });
        captionText += `\n`;
      }

      if (hasPromo) {
        captionText += `*PRECIO PROMOCIONAL:* *${formatPrice(totalPricePromo)}/mes* (${activePlan?.promoLabel})\n`;
        captionText += `*Precio Regular posterior:* *${formatPrice(totalPriceNormal)}/mes*\n`;
      } else {
        captionText += `*TOTAL MENSUAL:* *${formatPrice(totalPriceNormal)}/mes*\n`;
      }
      
      captionText += `${separatorLine}\n`;
      captionText += `_Preparado por tu asesor: ${advisorName} (${advisorRole})_`;

      let endpoint = '';
      let bodyData = {};

      if (generatedImageUrl) {
        let mediaPayload = generatedImageUrl;
        if (mediaPayload.startsWith('data:')) {
          const base64Index = mediaPayload.indexOf('base64,');
          if (base64Index !== -1) {
            mediaPayload = mediaPayload.substring(base64Index + 7);
          }
        }

        // Enviar con imagen usando sendMedia
        endpoint = `${evolutionUrl}/message/sendMedia/${evolutionInstance}`;
        bodyData = {
          "number": number,
          "mediatype": "image",
          "mimetype": "image/png",
          "caption": captionText,
          "media": mediaPayload,
          "fileName": "propuesta.png",
          "options": {
            "delay": 1200,
            "presence": "composing"
          }
        };
      } else {
        // Enviar solo texto
        endpoint = `${evolutionUrl}/message/sendText/${evolutionInstance}`;
        bodyData = {
          "number": number,
          "options": {
            "delay": 1200,
            "presence": "composing"
          },
          "textMessage": {
            "text": captionText
          }
        };
      }

      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'apikey': evolutionApiKey
        },
        body: JSON.stringify(bodyData)
      });

      if (response.ok) {
        alert('¡Propuesta enviada con éxito por WhatsApp!');
        setShowImageModal(false);
      } else {
        const errorText = await response.text();
        alert(`Error al enviar por Evolution API: ${response.status} - ${errorText}`);
      }
    } catch (err: any) {
      console.error(err);
      alert(`Error de conexión de red: ${err.message}`);
    } finally {
      setSendingProposal(false);
    }
  };

  const handleSaveSecurityConfig = async (enabled: boolean, ips: string[]) => {
    setIpRestrictionEnabled(enabled);
    setAllowedIps(ips);
    localStorage.setItem('ip_restriction_enabled', String(enabled));
    localStorage.setItem('allowed_ips', JSON.stringify(ips));

    try {
      // 1. Obtener la config actual de Python
      const res = await fetch('http://localhost:5005/api/config');
      if (res.ok) {
        const currentConfig = await res.json();
        // 2. Modificar con los nuevos campos de seguridad
        const updatedConfig = {
          ...currentConfig,
          ip_restriction_enabled: enabled,
          allowed_ips: ips
        };
        // 3. Enviar de vuelta a Python
        await fetch('http://localhost:5005/api/config', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(updatedConfig)
        });
      }
    } catch (e) {
      console.error('Error al guardar configuración de seguridad en backend local:', e);
    }
  };

  // Obtener operador activo
  const activeOperator = useMemo(() => {
    return OPERATORS.find(op => op.id === selectedOperatorId) || OPERATORS[0];
  }, [selectedOperatorId]);

  // Colores de acento según operador
  const operatorColor = useMemo(() => {
    switch (selectedOperatorId) {
      case 'yoigo': return '#B026FF';
      case 'orange': return '#FF7900';
      case 'vodafone': return '#E60000';
      case 'lowi': return darkMode ? '#FFFFFF' : '#0A0A0A';
      case 'win': return '#FFCC00';
      default: return '#3B82F6';
    }
  }, [selectedOperatorId, darkMode]);

  // Clases CSS de texto dinámicas
  const operatorTextClass = useMemo(() => {
    switch (selectedOperatorId) {
      case 'yoigo': return 'text-[#B026FF]';
      case 'orange': return 'text-[#FF7900]';
      case 'vodafone': return 'text-[#E60000]';
      case 'lowi': return 'text-[#E50015]';
      case 'win': return 'text-[#FFCC00]';
      default: return 'text-[#FE0002]';
    }
  }, [selectedOperatorId]);

  // Clases CSS de fondo para el botón
  const operatorBtnBgClass = useMemo(() => {
    switch (selectedOperatorId) {
      case 'yoigo': return 'bg-[#B026FF] hover:bg-[#971de0] text-white shadow-lg shadow-purple-500/20';
      case 'orange': return 'bg-[#FF7900] hover:bg-[#e06b00] text-white shadow-lg shadow-orange-500/20';
      case 'vodafone': return 'bg-[#E60000] hover:bg-[#c40000] text-white shadow-lg shadow-red-500/20';
      case 'lowi': return 'bg-[#E50015] hover:bg-[#c40000] text-white shadow-lg shadow-red-500/20';
      case 'win': return 'bg-[#FFCC00] hover:bg-[#e6b800] text-slate-900 shadow-lg shadow-yellow-500/20';
      default: return 'bg-[#FE0002] hover:bg-[#D10002] text-white';
    }
  }, [selectedOperatorId]);

  // Filtrar planes del operador seleccionado y tab activa con origen de portabilidad
  const filteredPlans = useMemo(() => {
    let plans = globalPlans.filter(plan => plan.operatorId === selectedOperatorId);

    // Filtrar por operador de origen de portabilidad
    if (portabilityOrigin !== 'all') {
      if (selectedOperatorId === 'yoigo') {
        if (portabilityOrigin === 'digi') {
          // Digi: Mostrar ÚNICAMENTE el plan de 25€ y los planes residenciales de 31€
          plans = plans.filter(p => p.price === 25 || p.price === 31);
        } else if (portabilityOrigin === 'vodafone') {
          // Vodafone (VDF): Mostrar ÚNICAMENTE el plan de 45€
          plans = plans.filter(p => p.price === 45);
        } else {
          // Otros: Mostrar los planes que no sean exclusivos de Digi (25€, 31€) ni de Vodafone (45€)
          plans = plans.filter(p => p.price !== 25 && p.price !== 31 && p.price !== 45);
        }
      } else if (selectedOperatorId === 'orange') {
        if (portabilityOrigin === 'movistar') {
          // Movistar (Con equipo): Mostrar ÚNICAMENTE tarifas especiales de Movistar con equipo
          plans = plans.filter(p => p.segment === 'Clientes Movistar con equipo');
        } else if (portabilityOrigin === 'otros') {
          // Otros operadores (Con equipo menos Movistar): Mostrar ÚNICAMENTE tarifas con equipo menos Movistar
          plans = plans.filter(p => p.segment === 'Con equipo menos Movistar');
        } else if (portabilityOrigin === 'sin-equipo') {
          // Sin equipo: Mostrar tarifas reales/cartera y tarifas promocionales sin equipo
          plans = plans.filter(p => !p.segment || p.segment === 'Sin equipo');
        }
      }
    }
    
    if (planFilter === 'all') return plans;
    
    if (selectedOperatorId === 'vodafone') {
      if (planFilter === 'sin-tv') {
        return plans.filter(p => !p.tvIncluded && !p.tv);
      }
      if (planFilter === '2-platforms') {
        return plans.filter(p => p.streamingIncluded?.length === 2);
      }
      if (planFilter === '3-platforms') {
        return plans.filter(p => p.streamingIncluded?.length === 3);
      }
      if (planFilter === '4-platforms') {
        return plans.filter(p => p.streamingIncluded?.length === 4);
      }
      if (planFilter === '1-linea') {
        return plans.filter(p => p.mobileLines === 1);
      }
    }
    
    if (selectedOperatorId === 'yoigo') {
      if (planFilter === 'portabilidad') {
        return plans.filter(p => p.id.includes('portabilidad'));
      }
      if (planFilter === 'especial-digi') {
        return plans.filter(p => p.id.includes('digi'));
      }
      if (planFilter === 'fibra-fijo-movil') {
        return plans.filter(p => p.category === 'fibra_fijo_movil' || p.fixedLineIncluded);
      }
      if (planFilter === 'empresa') {
        return plans.filter(p => p.category === 'fibra_movil_empresa');
      }
    }
    
    if (selectedOperatorId === 'orange') {
      if (planFilter === 'n-extra') {
        return plans.filter(p => p.id.includes('n-extra'));
      }
      if (planFilter === 'con-equipo') {
        return plans.filter(p => p.segment === 'Con equipo');
      }
      if (planFilter === 'sin-equipo') {
        return plans.filter(p => p.segment === 'Sin equipo');
      }
      if (planFilter === 'movistar-equipo') {
        return plans.filter(p => p.segment === 'Clientes Movistar con equipo' || p.segment === 'Con equipo menos Movistar');
      }
      if (planFilter === 'sva-futbol') {
        return plans;
      }
    }
    
    if (selectedOperatorId === 'win') {
      if (planFilter === 'gpon') {
        return plans.filter(p => p.id.includes('gpon') && !p.segment && p.category !== 'fibra_movil_empresa');
      }
      if (planFilter === 'xgspon') {
        return plans.filter(p => p.id.includes('xgspon') && !p.segment && p.category !== 'fibra_movil_empresa');
      }
      if (planFilter === 'gamer') {
        return plans.filter(p => p.id.includes('gamer'));
      }
      if (planFilter === 'vertical') {
        return plans.filter(p => p.segment === 'Vertical Lima');
      }
      if (planFilter === 'pago-adelantado') {
        return plans.filter(p => p.segment === 'Pago Adelantado');
      }
      if (planFilter === 'empresa') {
        return plans.filter(p => p.category === 'fibra_movil_empresa');
      }
    }
    
    return plans;
  }, [selectedOperatorId, planFilter, portabilityOrigin]);

  // Obtener plan activo
  const activePlan = useMemo(() => {
    const plan = globalPlans.find(p => p.id === selectedPlanId);
    if (!plan || plan.operatorId !== selectedOperatorId) {
      return filteredPlans[0] || null;
    }
    return plan;
  }, [selectedPlanId, selectedOperatorId, filteredPlans]);

  // Sincronizar plan activo si cambia el operador
  useEffect(() => {
    if (filteredPlans.length > 0) {
      const currentPlan = globalPlans.find(p => p.id === selectedPlanId);
      if (!currentPlan || currentPlan.operatorId !== selectedOperatorId) {
        setSelectedPlanId(filteredPlans[0].id);
      }
    }
  }, [selectedOperatorId, filteredPlans, selectedPlanId]);

  // Validar y limitar líneas móviles adicionales según el plan seleccionado
  useEffect(() => {
    if (activePlan) {
      const maxLines = getMaxLinesCount(selectedOperatorId, activePlan.id, activePlan.name);
      if (mobileLinesCount > maxLines) {
        setMobileLinesCount(maxLines);
      }
    }
  }, [activePlan, selectedOperatorId, mobileLinesCount]);

  // Alternar selección de añadidos
  const toggleAddon = (addonId: string) => {
    const updated = new Set(selectedAddonIds);
    if (updated.has(addonId)) {
      updated.delete(addonId);
    } else {
      updated.add(addonId);
      if (addonId === 'addon-line-mobile' || addonId === 'global-mobile-line' || addonId === 'yoigo-duo-adicional' || addonId.includes('linea-adicional')) {
        setMobileLinesCount(1);
      }
    }
    setSelectedAddonIds(updated);
  };

  // Obtener añadidos activos
  const activeAddons = useMemo(() => {
    return globalAddons.filter(addon => selectedAddonIds.has(addon.id));
  }, [selectedAddonIds]);

  // Filtrar los añadidos a mostrar por operador seleccionado y plan activo (ej. líneas adicionales de Orange)
  const displayedAddons = useMemo(() => {
    return globalAddons.filter(addon => {
      // Filtrar por operador
      if (addon.operatorId && addon.operatorId !== selectedOperatorId) {
        return false;
      }
      
      // Filtrado específico para Orange y sus líneas adicionales por plan
      if (selectedOperatorId === 'orange') {
        const planName = activePlan?.name.toLowerCase() || '';
        if (addon.id === 'orange-linea-adicional-1573') {
          // Mostrar 15.73€ solo para Extra 3, 5, 10
          return planName.includes('extra 3') || planName.includes('extra 5') || planName.includes('extra 10') || planName === '';
        }
        if (addon.id === 'orange-linea-adicional-1331') {
          // Mostrar 13.31€ solo para Extra 20
          return planName.includes('extra 20');
        }
      }
      
      return true;
    });
  }, [selectedOperatorId, activePlan]);

  // Calcular precios
  const basePrice = activePlan ? activePlan.price : 0;
  
  const addonsTotalPromo = useMemo(() => {
    return activeAddons.reduce((sum, addon) => {
      const qty = addon.id === 'addon-line-mobile' || addon.id === 'global-mobile-line' || addon.id === 'yoigo-duo-adicional' || addon.id.includes('linea-adicional') ? mobileLinesCount : 1;
      if (addon.isOneTime) return sum;
      return sum + (addon.price * qty);
    }, 0);
  }, [activeAddons, mobileLinesCount]);

  const addonsTotalRegular = useMemo(() => {
    return activeAddons.reduce((sum, addon) => {
      const qty = addon.id === 'addon-line-mobile' || addon.id === 'global-mobile-line' || addon.id === 'yoigo-duo-adicional' || addon.id.includes('linea-adicional') ? mobileLinesCount : 1;
      if (addon.isOneTime) return sum;
      const regPrice = addon.regularPrice ?? addon.monthlyPrice ?? addon.price;
      return sum + (regPrice * qty);
    }, 0);
  }, [activeAddons, mobileLinesCount]);

  const addonsTotal = addonsTotalPromo; // Compatibilidad

  const taxRate = useMemo(() => {
    if (selectedOperatorId !== 'orange') return 1.0;
    if (taxType === 'iva') return 1.21;
    if (taxType === 'igic') return 1.07;
    return 1.0;
  }, [selectedOperatorId, taxType]);

  const totalPricePromo = useMemo(() => {
    const raw = (basePrice + addonsTotalPromo) * taxRate;
    return Math.round(raw * 100) / 100;
  }, [basePrice, addonsTotalPromo, taxRate]);

  const totalPriceNormal = useMemo(() => {
    if (!activePlan) return 0;
    const priceAfter = activePlan.priceAfterPromo !== undefined ? activePlan.priceAfterPromo : activePlan.price;
    const raw = (priceAfter + addonsTotalRegular) * taxRate;
    return Math.round(raw * 100) / 100;
  }, [activePlan, addonsTotalRegular, taxRate]);

  const hasPromo = activePlan?.isPromo || false;

  // Diferencia de ahorro
  const savingsAmount = useMemo(() => {
    return Math.round((totalPriceNormal - totalPricePromo) * 100) / 100;
  }, [totalPriceNormal, totalPricePromo]);

  // Argumentos de venta
  const salesArgument = useMemo(() => {
    const finalPrice = hasPromo ? totalPricePromo : totalPriceNormal;
    return getSalesArgument(selectedOperatorId, finalPrice, selectedAddonIds.size);
  }, [selectedOperatorId, hasPromo, totalPricePromo, totalPriceNormal, selectedAddonIds.size]);

  // Copiar resumen para WhatsApp
  const handleCopyWhatsApp = () => {
    if (!activePlan) return;

    const separatorLine = '---------------------------------------------';
    let text = `*RESUMEN DE COTIZACIÓN - SMART TELCO*\n`;
    text += `${separatorLine}\n`;
    text += `*Operador:* ${activeOperator.name}\n`;

    const formatPrice = (price: number) => {
      return selectedOperatorId === 'win' ? `S/ ${price.toFixed(2)}` : `${price} €`;
    };

    text += `*Plan Base:* ${activePlan.name} (${formatPrice(basePrice)}/mes)\n`;
    text += `*Velocidad Fibra:* ${activePlan.speed}\n`;
    text += `*Móvil:* ${activePlan.mobile}\n`;
    if (activePlan.tv) {
      text += `*Televisión:* ${activePlan.tv}\n`;
    }
    text += `\n`;

    if (activeAddons.length > 0) {
      text += `*Añadidos Seleccionados:*\n`;
      activeAddons.forEach(addon => {
        const qty = addon.id === 'addon-line-mobile' || addon.id === 'global-mobile-line' || addon.id === 'yoigo-duo-adicional' || addon.id.includes('linea-adicional') ? mobileLinesCount : 1;
        const qtyStr = qty > 1 ? ` (x${qty})` : '';
        const costType = addon.isOneTime ? ' (Pago único)' : '';
        const addonPriceText = selectedOperatorId === 'win'
          ? `+S/ ${(addon.price * qty).toFixed(2)}/mes`
          : `+${addon.price * qty} €/mes`;
        text += `• ${addon.name}${qtyStr}: ${addonPriceText}${costType}\n`;
      });
      text += `\n`;
    }

    text += `*DESGLOSE DE PRECIOS:*\n`;
    text += `• Cuota Base Plan: ${formatPrice(basePrice)}/mes\n`;
    text += `• Total Servicios Adicionales: ${selectedOperatorId === 'win' ? `+S/ ${addonsTotal.toFixed(2)}` : `+${addonsTotal} €`}/mes\n`;
    text += `${separatorLine}\n`;

    if (selectedOperatorId === 'orange') {
      if (taxType === 'iva') {
        text += `*Impuesto Aplicado:* IVA (+21%)\n`;
      } else if (taxType === 'igic') {
        text += `*Impuesto Aplicado:* IGIC (+7%)\n`;
      } else {
        text += `*Impuesto Aplicado:* Sin Impuestos\n`;
      }
    }
    
    if (hasPromo) {
      text += `*PRECIO PROMOCIONAL:* *${formatPrice(totalPricePromo)}/mes* (${activePlan.promoLabel})\n`;
      text += `*Precio Regular Posterior:* *${formatPrice(totalPriceNormal)}/mes*\n`;
    } else {
      text += `*TOTAL MENSUAL:* *${formatPrice(totalPriceNormal)}/mes*\n`;
    }
    
    const installationAddon = activeAddons.find(a => a.isOneTime);
    if (installationAddon) {
      text += `*Instalación Premium:* Coste único de 0 €\n`;
    }

    text += `${separatorLine}\n`;
    text += `_¡Cotización realizada en directo por tu asesor comercial!_`;

    navigator.clipboard.writeText(text).then(() => {
      setCopySuccess(true);
      setTimeout(() => setCopySuccess(false), 2500);
    });
  };

  // Reiniciar cotización
  const handleReset = () => {
    setSelectedOperatorId('yoigo');
    setSelectedPlanId('yoigo-600');
    setSelectedAddonIds(new Set());
  };

  // Mapear iconos de Lucide
  const getIcon = (iconName: string, className: string = "h-5 w-5") => {
    switch (iconName) {
      case 'Smartphone': return <Smartphone className={className} />;
      case 'Wifi': return <Wifi className={className} />;
      case 'Tv': return <Tv className={className} />;
      case 'Film': return <Film className={className} />;
      case 'Sparkles': return <Sparkles className={className} />;
      case 'Video': return <Video className={className} />;
      case 'Tablet': return <Tablet className={className} />;
      case 'Wrench': return <Wrench className={className} />;
      default: return <Info className={className} />;
    }
  };

  // Renderizar mockup de plan
  const renderPlanMockup = (plan: Plan) => {
    if (plan.id.includes('1gb')) {
      return <RouterTvComboVisual color={operatorColor} />;
    }
    if (plan.id.includes('tv') || plan.tv) {
      return <TvStreamingComboVisual color={operatorColor} />;
    }
    return <RouterMobileComboVisual color={operatorColor} />;
  };

  // Renderizar miniatura de añadidos
  const renderAddonThumbnail = (addonId: string) => {
    const idLower = addonId.toLowerCase();
    
    if (idLower.includes('fonowin')) {
      return <AddonFonoWinVisual />;
    }
    if (idLower.includes('winbox')) {
      return <AddonWinboxVisual />;
    }
    if (idLower.includes('dgo')) {
      return <AddonDgoVisual />;
    }
    if (idLower.includes('bundle')) {
      return <AddonTripleBundleVisual />;
    }
    if (idLower.includes('netflix')) {
      return <AddonNetflixVisual />;
    }
    if (idLower.includes('disney')) {
      return <AddonDisneyVisual />;
    }
    if (idLower.includes('hbo') || idLower.includes('max')) {
      return <AddonMaxVisual />;
    }
    if (idLower.includes('prime')) {
      return <AddonPrimeVisual />;
    }
    if (idLower.includes('tv') || idLower.includes('futbol') || idLower.includes('fútbol')) {
      return <AddonTvVisual />;
    }
    if (idLower.includes('mesh') || idLower.includes('wifi') || idLower.includes('repetidor')) {
      return <AddonMeshVisual />;
    }
    if (idLower.includes('linea') || idLower.includes('móvil') || idLower.includes('movil') || idLower.includes('duo') || idLower.includes('esim')) {
      return <AddonSmartphoneVisual />;
    }
    if (idLower.includes('device') || idLower.includes('aparato') || idLower.includes('financiacion')) {
      return <AddonFinancingVisual />;
    }
    if (idLower.includes('installation') || idLower.includes('setup') || idLower.includes('instalacion')) {
      return <AddonSetupVisual />;
    }
    
    return <AddonSmartphoneVisual />;
  };

  // Renderizar logo oficial SVG en el Ticket
  const renderOperatorLogoSymbol = (operatorId: string) => {
    switch (operatorId) {
      case 'yoigo':
        return <YoigoLogo className="h-7 w-auto" color="#FFFFFF" />;
      case 'orange':
        return <OrangeLogo className="h-6 w-6 rounded" bgColor="#FFFFFF" textColor="text-[#FF7900]" />;
      case 'vodafone':
        return <VodafoneLogo className="h-7 w-7" color="#FFFFFF" symbolColor="#E60000" />;
      case 'lowi':
        return <LowiLogo className="h-6 w-auto" color="#000000" symbolColor="#E50015" />;
      case 'win':
        return <WinLogo className="h-7 w-auto" color="#0F172A" />;
      default:
        return null;
    }
  };

  // Renderizar logo de operador en la tarjeta grande
  const renderOperatorLogoOnCard = (operatorId: string, isSelected: boolean) => {
    switch (operatorId) {
      case 'yoigo':
        return <YoigoLogo className="h-9 w-auto" color="#FFFFFF" />;
      case 'orange':
        return isSelected ? (
          <div className="flex items-center gap-2.5">
            <OrangeLogo className="h-8 w-8 rounded-lg" bgColor="#FFFFFF" textColor="text-[#FF7900]" />
            <span className="operator-wordmark-orange text-white text-base">orange</span>
          </div>
        ) : (
          <div className="flex items-center gap-2.5">
            <OrangeLogo className="h-8 w-8 rounded-lg" bgColor="#FF7900" textColor="text-white" />
            <span className="operator-wordmark-orange text-white/90 text-base">orange</span>
          </div>
        );
      case 'vodafone':
        return isSelected ? (
          <div className="flex items-center gap-2.5">
            <VodafoneLogo className="h-8 w-8 shadow-sm" color="#FFFFFF" symbolColor="#E60000" />
            <span className="operator-wordmark-vodafone text-white text-base">vodafone</span>
          </div>
        ) : (
          <div className="flex items-center gap-2.5">
            <VodafoneLogo className="h-8 w-8" color="#E60000" symbolColor="white" />
            <span className="operator-wordmark-vodafone text-white/90 text-base">vodafone</span>
          </div>
        );
      case 'lowi':
        return isSelected ? (
          <div className="flex items-center gap-2.5">
            <LowiLogo className="h-7 w-auto shadow-sm" color="#FFFFFF" symbolColor="#FFFFFF" />
          </div>
        ) : (
          <div className="flex items-center gap-2.5">
            <LowiLogo className="h-7 w-auto opacity-80" color="#FFFFFF" symbolColor="#FFFFFF" />
          </div>
        );
      case 'win':
        return isSelected ? (
          <div className="flex items-center gap-2.5">
            <WinLogo className="h-7 w-auto" color="#0F172A" />
          </div>
        ) : (
          <div className="flex items-center gap-2.5">
            <WinLogo className="h-7 w-auto opacity-80" color="#0F172A" />
          </div>
        );
      default:
        return null;
    }
  };

  const isIpBlocked = ipRestrictionEnabled && clientIp && !allowedIps.includes(clientIp) && !ipBypassGranted && !isAdminMode;

  if (isIpBlocked) {
    return (
      <div className="min-h-screen w-full flex items-center justify-center bg-slate-950 text-slate-100 relative overflow-hidden font-sans">
        <TelecomVisual />
        <div className="absolute inset-0 bg-gradient-to-tr from-amber-950/10 via-transparent to-red-950/20 pointer-events-none" />
        
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.4 }}
          className="w-full max-w-md p-8 bg-[#0F172A] border border-red-500/20 rounded-3xl shadow-2xl relative z-10 flex flex-col gap-6 mx-4 text-center"
        >
          <div className="flex justify-center">
            <div className="h-16 w-16 bg-red-500/10 rounded-full flex items-center justify-center border border-red-500/30">
              <Shield className="h-8 w-8 text-red-500 animate-pulse" />
            </div>
          </div>

          <div>
            <h3 className="text-xl font-black tracking-tight text-white uppercase flex items-center justify-center gap-1.5">
              Acceso Restringido por IP
            </h3>
            <p className="text-xs text-slate-400 mt-2 leading-relaxed">
              Esta aplicación solo está autorizada para uso dentro de la red corporativa u oficinas autorizadas de la empresa.
            </p>
          </div>

          <div className="bg-slate-900 border border-slate-800 p-4 rounded-2xl flex flex-col gap-1.5">
            <span className="text-[9px] font-extrabold text-slate-500 uppercase tracking-wider block">Tu Dirección IP Pública:</span>
            <span className="text-sm font-black text-red-400 font-mono tracking-wider">{clientIp}</span>
            <span className="text-[8px] font-bold text-red-400/80 uppercase">No Autorizada</span>
          </div>

          <p className="text-[11px] text-slate-400 leading-normal font-medium">
            Por favor, solicita a tu supervisor o administrador de DreamTeam que registre tu IP pública en el panel de configuración de seguridad.
          </p>

          <div className="flex flex-col gap-2 mt-2">
            <button
              onClick={() => {
                const pass = prompt('Ingresa el código maestro de administración para bypass temporal de IP:');
                if (pass) {
                  if (sha256(pass) === '90b99f7cb1dff6ef96daf8596b31546027a75fc1f0db7f61eddcee88eb91b7b7') {
                    setIpBypassGranted(true);
                    setIsAdminMode(true);
                    sessionStorage.setItem('admin_mode', 'true');
                    alert('Bypass concedido. Has accedido en modo administrador.');
                  } else {
                    alert('Código incorrecto.');
                  }
                }
              }}
              className="w-full bg-slate-800 hover:bg-slate-700 text-white text-xs font-black uppercase py-3 rounded-xl transition-all flex items-center justify-center gap-1.5 cursor-pointer border border-slate-700"
            >
              🔐 Bypass de Administración (Supervisor)
            </button>
            
            <button
              onClick={() => {
                window.location.reload();
              }}
              className="text-[10px] font-bold text-slate-450 hover:text-white transition-all underline cursor-pointer"
            >
              Volver a comprobar IP
            </button>
          </div>

          <div className="text-center text-[10px] text-slate-500 font-bold uppercase tracking-wider border-t border-slate-850 pt-4 mt-2">
            DREAMTEAM SECURITY
          </div>
        </motion.div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen w-full flex items-center justify-center bg-black text-[#f1f5f9] relative overflow-hidden font-sans">
        <TelecomVisual />
        <div className="absolute inset-0 bg-gradient-to-tr from-red-950/10 via-transparent to-red-950/25 pointer-events-none" />
        
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.4, ease: "easeOut" }}
          className="w-full max-w-md p-8 bg-[#0A0A0A] border border-slate-800 rounded-3xl shadow-2xl relative z-10 flex flex-col gap-6 mx-4 overflow-hidden"
        >
          {/* Header Image matching background */}
          <div className="relative w-[calc(100%+4rem)] -mx-8 -mt-8 overflow-hidden rounded-t-3xl select-none">
            <img 
              src="/images/dreamteam_header.png" 
              alt="DreamTeam Contact Center" 
              className="w-full object-cover h-48"
            />
            {/* Sutil difuminado en la parte inferior para fundir con el color de la tarjeta */}
            <div className="absolute inset-x-0 bottom-0 h-12 bg-gradient-to-t from-[#0A0A0A] to-transparent pointer-events-none" />
          </div>

          <div className="text-center mt-2">
            <h3 className="text-lg font-black tracking-tight text-white uppercase">Acceso Restringido</h3>
            <p className="text-xs text-slate-400 mt-1">Introduce la contraseña general del Call Center para ingresar al cotizador.</p>
          </div>

          <form onSubmit={handleLogin} className="flex flex-col gap-4">
            <div className="relative">
              <input
                type="password"
                value={passwordInput}
                onChange={(e) => setPasswordInput(e.target.value)}
                placeholder="Contraseña de acceso"
                className="w-full bg-[#1e293b] border border-[#334155] rounded-xl px-4 py-3 text-sm text-white font-bold text-center focus:outline-none focus:ring-2 focus:ring-red-500/20 placeholder:text-slate-500"
                autoFocus
              />
            </div>

            {loginError && (
              <motion.p 
                initial={{ opacity: 0, y: -2 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-[11px] text-red-500 font-semibold text-center"
              >
                ⚠️ {loginError}
              </motion.p>
            )}

            <Button
              type="submit"
              className="w-full bg-[#FE0002] hover:bg-[#D10002] text-white text-xs font-extrabold uppercase py-3 rounded-xl transition-all shadow-md shadow-red-500/10 flex items-center justify-center gap-1.5"
            >
              Ingresar al Tarifario
            </Button>
          </form>

          <div className="text-center text-[10px] text-slate-500 font-bold uppercase tracking-wider">
            DREAMTEAM © 2026
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-[#F9FAFB] dark:bg-black text-[#0F172A] dark:text-[#f1f5f9] font-sans antialiased relative overflow-x-hidden selection:bg-red-500/20">
      


      {/* Patrón de red sutil de fondo */}
      <TelecomVisual />

      {/* 1. SIDEBAR IZQUIERDA COMPACTA */}
      <aside className="w-20 bg-background border-r border-border flex flex-col justify-between shrink-0 hidden md:flex sticky top-0 h-screen z-30">
        <div className="flex flex-col items-center">
          {/* Logo DTC */}
          <div className="p-4 border-b border-slate-100 w-full flex justify-center">
            <div className="h-10 w-10 rounded-xl bg-[#FE0002] flex items-center justify-center text-white font-extrabold text-xs shadow-md shadow-red-500/10">
              DTC
            </div>
          </div>

          {/* Menú de navegación de iconos */}
          <nav className="p-2 space-y-4 mt-6">
            {[
              { id: 'cotizador', label: 'Cotizador', icon: Layers },
              ...(isAdminMode ? [{ id: 'admin-config', label: 'Admin', icon: Settings }] : [])
            ].map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`w-14 h-14 rounded-xl flex flex-col items-center justify-center transition-all ${
                    isActive 
                      ? 'bg-slate-100 text-slate-900 shadow-sm' 
                      : 'text-slate-500 hover:text-slate-900 hover:bg-slate-50'
                  }`}
                  style={isActive ? { borderLeft: `3px solid ${operatorColor}` } : {}}
                  title={item.label}
                >
                  <Icon className="h-5 w-5" style={isActive ? { color: operatorColor } : {}} />
                  <span className="text-[8px] font-bold mt-1 text-slate-500">{item.label}</span>
                </button>
              );
            })}
          </nav>
        </div>

        {/* Footer Sidebar */}
        <div className="p-4 border-t border-slate-100 text-[8px] text-slate-400 font-extrabold text-center">
          v3.5
        </div>
      </aside>

      {/* ÁREA DE CONTENIDO */}
      <div className="flex-1 flex flex-col min-w-0">
        
        {/* 2. HEADER SUPERIOR */}
        <header className="bg-background border-b border-border h-16 shrink-0 flex items-center justify-between px-8 sticky top-0 z-40">
          <SmartTelcoWordmark />

          <div className="flex items-center gap-4">


            {/* Selector de Rol / Botón Admin */}
            <div className="flex items-center gap-1.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-1 rounded-xl shadow-sm">
              <span className="text-[9px] font-black text-slate-400 uppercase px-2">Rol:</span>
              <button
                onClick={() => {
                  if (isAdminMode) {
                    setIsAdminMode(false);
                    sessionStorage.removeItem('admin_mode');
                    if (activeTab === 'admin-config') setActiveTab('cotizador');
                  } else {
                    // Si la IP coincide con el bypass, habilitar de inmediato
                    const savedAdminIp = localStorage.getItem('admin_ip') || '181.176.120.40';
                    if (clientIp === savedAdminIp) {
                      setIsAdminMode(true);
                      sessionStorage.setItem('admin_mode', 'true');
                    } else {
                      setShowAdminModal(true);
                    }
                  }
                }}
                className={`text-[9px] font-black uppercase px-2.5 py-1 rounded-lg transition-all cursor-pointer ${
                  isAdminMode 
                    ? 'bg-red-500 text-white shadow-sm' 
                    : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 border border-slate-250/20'
                }`}
              >
                {isAdminMode ? 'Administrador' : 'Acceso Admin'}
              </button>
            </div>

            {/* Estado Asesor conectado */}
            <div className="flex items-center gap-2 bg-emerald-50 border border-emerald-200/30 px-3.5 py-1.5 rounded-full shadow-sm">
              <span className="relative flex h-2.5 w-2.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
              </span>
              <span className="text-[9px] text-emerald-600 font-bold uppercase tracking-wider">Asesor Online</span>
            </div>

            {/* Botón de Modo Claro / Oscuro */}
            <Button
              variant="outline"
              size="sm"
              onClick={toggleDarkMode}
              className="h-8 w-8 p-0 rounded-xl border-slate-200 hover:bg-slate-50 text-slate-700 transition-all flex items-center justify-center shadow-sm"
              title={darkMode ? "Modo Claro" : "Modo Oscuro"}
            >
              {darkMode ? <Sun className="h-4 w-4 text-amber-500" /> : <Moon className="h-4 w-4 text-slate-700" />}
            </Button>



            <Button 
              variant="outline" 
              size="sm" 
              onClick={handleReset}
              className="text-xs font-bold border-slate-200 hover:border-slate-350 hover:bg-slate-50 text-slate-700 transition-all flex items-center gap-1.5 shadow-sm"
            >
              <RotateCcw className="h-3 w-3" />
              Reiniciar Cotización
            </Button>
          </div>
        </header>

        {/* 3. CORE CONTENT GRID */}
        <main className="flex-1 p-6 lg:p-8 grid grid-cols-1 xl:grid-cols-12 gap-8 max-w-[1440px] w-full mx-auto">
          {/* Admin Modal Passcode */}
          {showAdminModal && (
            <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
              <motion.div 
                initial={{ scale: 0.95, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="bg-white dark:bg-[#111827] max-w-sm w-full p-6 rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-xl flex flex-col gap-4"
              >
                <div>
                  <h4 className="text-sm font-black text-slate-900 dark:text-slate-100 flex items-center gap-1.5 uppercase tracking-wider">
                    🔒 Contraseña de Administrador
                  </h4>
                  <p className="text-[10px] text-slate-450 mt-1">Ingresa el código maestro para modificar tarifas.</p>
                </div>
                <input 
                  type="password"
                  value={adminPasswordInput}
                  onChange={(e) => setAdminPasswordInput(e.target.value)}
                  className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl px-3.5 py-2 text-xs font-bold text-slate-800 dark:text-slate-200"
                  placeholder="Código de seguridad"
                />
                {adminError && <p className="text-[10px] text-red-500 font-bold">{adminError}</p>}
                <div className="flex gap-2 justify-end">
                  <button
                    onClick={() => {
                      setShowAdminModal(false);
                      setAdminPasswordInput('');
                      setAdminError('');
                    }}
                    className="bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-350 text-xs font-black uppercase px-4 py-2 rounded-xl"
                  >
                    Cancelar
                  </button>
                  <button
                    onClick={() => {
                      // Contraseña maestra: DT2026ADMIN
                      // Hash sha256('DT2026ADMIN') = 'a8ef71661158a7be7cff4cf939bf877f9859f518e38d76a7593c6f856bf8f47f'
                      if (sha256(adminPasswordInput) === 'f84bcc9bf30abd300b9079403d0ecbc45c6fb54f4ea126c21b8378ae0f780177') {
                        setIsAdminMode(true);
                        sessionStorage.setItem('admin_mode', 'true');
                        setShowAdminModal(false);
                        setAdminPasswordInput('');
                        setAdminError('');
                      } else {
                        setAdminError('Código incorrecto.');
                      }
                    }}
                    className="bg-[#FE0002] hover:bg-[#D10002] text-white text-xs font-black uppercase px-4 py-2 rounded-xl"
                  >
                    Entrar
                  </button>
                </div>
              </motion.div>
            </div>
          )}

          {activeTab === 'permiso' && (
            <div className="col-span-12 w-full">
              <CompactPermisoPanel darkMode={darkMode} operatorColor={operatorColor} />
            </div>
          )}
          {activeTab === 'admin-config' && (
            <div className="col-span-12 w-full">
              <AdminConfigPanel 
                 darkMode={darkMode} 
                 operatorColor={operatorColor} 
                 plans={globalPlans}
                 setPlans={setGlobalPlans}
                 addons={globalAddons}
                 setAddons={setGlobalAddons}
                 
                 evolutionUrl={evolutionUrl}
                 setEvolutionUrl={setEvolutionUrl}
                 evolutionApiKey={evolutionApiKey}
                 setEvolutionApiKey={setEvolutionApiKey}
                 evolutionInstance={evolutionInstance}
                 setEvolutionInstance={setEvolutionInstance}
                 wspConnectionState={wspConnectionState}
                 setWspConnectionState={setWspConnectionState}
                 qrCodeBase64={qrCodeBase64}
                 setQrCodeBase64={setQrCodeBase64}
                 handleConnectWSP={handleConnectWSP}
                 handleDisconnectWSP={handleDisconnectWSP}
                 handleResetWSP={handleResetWSP}
                 wspConnectionStateContra={wspConnectionStateContra}
                 qrCodeBase64Contra={qrCodeBase64Contra}
                 handleConnectWSPContra={handleConnectWSPContra}
                 handleDisconnectWSPContra={handleDisconnectWSPContra}
                 handleResetWSPContra={handleResetWSPContra}
                 advisorName={advisorName}
                 advisorRole={advisorRole}
                 saveAdvisorInfo={saveAdvisorInfo}
                 setAdvisorName={setAdvisorName}
                 setAdvisorRole={setAdvisorRole}
                 setActiveTab={setActiveTab}
                 ipRestrictionEnabled={ipRestrictionEnabled}
                 allowedIps={allowedIps}
                 handleSaveSecurityConfig={handleSaveSecurityConfig}
               />
            </div>
          )}

          {activeTab === 'cotizador' && (
            <>
              {/* COLUMNA PRINCIPAL IZQUIERDA (CONFIGURADOR) */}
              <motion.div 
                initial="hidden"
                animate="visible"
                variants={staggerContainer}
                className="xl:col-span-8 flex flex-col gap-8"
              >
            
            {/* HERO COMPACTO */}
            <motion.div 
              variants={fadeUp}
              className="relative bg-card border border-border rounded-3xl p-6 overflow-hidden flex flex-col md:flex-row items-center justify-between gap-6"
            >

              {/* Fibra óptica visual */}
              <div className="absolute right-0 top-0 bottom-0 w-1/2 hidden md:block">
                <FiberLinesVisual color={operatorColor} />
              </div>

              <div className="relative z-10 max-w-md">
                <h3 className="text-xl md:text-2xl font-black text-slate-900 tracking-tight leading-tight">
                  Crea el <span style={{ color: operatorColor }} className="transition-colors duration-300">combo</span> perfecto para tu cliente
                </h3>
                <p className="text-xs text-slate-500 mt-2 leading-relaxed">
                  Selecciona operador, plan base y servicios adicionales. Los precios se actualizan al instante de forma automática.
                </p>
                <div className="flex flex-wrap gap-2 mt-4">
                  <div className="flex items-center gap-1.5 bg-slate-50 border border-slate-100 px-2.5 py-1.5 rounded-lg shadow-sm">
                    <Zap className="h-3.5 w-3.5 text-amber-500" />
                    <span className="text-[10px] font-bold text-slate-700">Cotización en vivo</span>
                  </div>
                  <div className="flex items-center gap-1.5 bg-slate-50 border border-slate-100 px-2.5 py-1.5 rounded-lg shadow-sm">
                    <RotateCcw className="h-3.5 w-3.5 text-[#FF7900]" />
                    <span className="text-[10px] font-bold text-slate-700">Precios actualizados</span>
                  </div>
                  <div className="flex items-center gap-1.5 bg-slate-50 border border-slate-100 px-2.5 py-1.5 rounded-lg shadow-sm">
                    <Share2 className="h-3.5 w-3.5 text-[#B026FF]" />
                    <span className="text-[10px] font-bold text-slate-700">Propuesta lista para enviar</span>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* OPERADORES: GLOBO A TODO COLOR */}
            <motion.div variants={fadeUp} className="flex flex-col gap-3">
              <h4 className="ui-label text-[10px] text-slate-400 flex items-center gap-2">
                <span className="h-1.5 w-1.5 rounded-full" style={{ backgroundColor: operatorColor }}></span>
                1. ELIGE OPERADOR
              </h4>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {OPERATORS.map((operator) => {
                  const isSelected = selectedOperatorId === operator.id;
                  
                  // Colores de Globo Sólido Completo
                  let globoBg = 'bg-gradient-to-br from-fuchsia-600/90 to-fuchsia-700/90 text-white';
                  let activeStyles = '';
                  
                  if (operator.id === 'yoigo') {
                    globoBg = isSelected 
                      ? 'bg-gradient-to-br from-[#B026FF] to-[#7800D6] border-2 border-white ring-4 ring-[#B026FF]/20 shadow-xl shadow-purple-500/25 scale-[1.02]' 
                      : 'bg-gradient-to-br from-[#B026FF]/80 to-[#7800D6]/80 hover:from-[#B026FF] hover:to-[#7800D6] border border-transparent shadow-sm opacity-80 hover:opacity-100';
                  } else if (operator.id === 'orange') {
                    globoBg = isSelected 
                      ? 'bg-gradient-to-br from-[#FF7900] to-[#D65F00] border-2 border-white ring-4 ring-[#FF7900]/20 shadow-xl shadow-orange-500/25 scale-[1.02]' 
                      : 'bg-gradient-to-br from-[#FF7900]/80 to-[#D65F00]/80 hover:from-[#FF7900] hover:to-[#D65F00] border border-transparent shadow-sm opacity-80 hover:opacity-100';
                  } else if (operator.id === 'vodafone') {
                    globoBg = isSelected 
                      ? 'bg-gradient-to-br from-[#E60000] to-[#B30000] border-2 border-white ring-4 ring-[#E60000]/20 shadow-xl shadow-red-500/25 scale-[1.02]' 
                      : 'bg-gradient-to-br from-[#E60000]/80 to-[#B30000]/80 hover:from-[#E60000] hover:to-[#B30000] border border-transparent shadow-sm opacity-80 hover:opacity-100';
                  } else if (operator.id === 'lowi') {
                    globoBg = isSelected 
                      ? 'bg-gradient-to-br from-[#121212] to-[#000000] border-2 border-[#E50015] ring-4 ring-[#E50015]/20 shadow-xl shadow-red-500/25 scale-[1.02]' 
                      : 'bg-gradient-to-br from-[#1c1c1e] to-[#0f0f10] hover:from-[#121212] hover:to-[#000000] border border-[#E50015]/20 shadow-sm opacity-90 hover:opacity-100';
                  } else if (operator.id === 'win') {
                    globoBg = isSelected 
                      ? 'bg-gradient-to-br from-[#FFCC00] to-[#E6B800] border-2 border-white ring-4 ring-[#FFCC00]/20 shadow-xl shadow-yellow-500/25 scale-[1.02] text-slate-900' 
                      : 'bg-gradient-to-br from-[#FFCC00]/80 to-[#E6B800]/80 hover:from-[#FFCC00] hover:to-[#E6B800] border border-transparent shadow-sm opacity-90 hover:opacity-100 text-slate-900/90';
                  }

                  return (
                    <motion.button
                      key={operator.id}
                      onClick={() => setSelectedOperatorId(operator.id)}
                      variants={popSelect}
                      whileHover="hover"
                      whileTap="pressed"
                      className={`relative p-5 rounded-2xl text-left overflow-hidden flex flex-col justify-between h-32 transition-all duration-300 ${globoBg}`}
                    >
                      {/* Patrón de ondas de fondo */}
                      <div className="absolute right-0 bottom-0 opacity-10 pointer-events-none">
                        <svg width="100" height="100" viewBox="0 0 100 100" className="text-white">
                          <circle cx="100" cy="100" r="80" stroke="currentColor" strokeWidth="2" strokeDasharray="3 3" fill="none" />
                          <circle cx="100" cy="100" r="50" stroke="currentColor" strokeWidth="2" fill="none" />
                        </svg>
                      </div>

                      {/* Check visual */}
                      <AnimatePresence>
                        {isSelected && (
                          <motion.span 
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            exit={{ scale: 0 }}
                            className={`absolute top-4 right-4 h-5 w-5 rounded-full flex items-center justify-center shadow-md ${
                              selectedOperatorId === 'win' ? 'bg-slate-900 text-white' : 'bg-white text-slate-900'
                            }`}
                          >
                            <Check className="h-3.5 w-3.5 stroke-[3px]" />
                          </motion.span>
                        )}
                      </AnimatePresence>

                      <div className="relative z-10 flex flex-col h-full justify-between">
                        <div>
                          {renderOperatorLogoOnCard(operator.id, isSelected)}
                        </div>
                        <p className={`text-[10px] font-bold uppercase mt-1 tracking-wider leading-relaxed ${
                          operator.id === 'win' ? 'text-slate-900/80' : 'text-white/90'
                        }`}>
                          {operator.slogan}
                        </p>
                      </div>
                    </motion.button>
                  );
                })}
              </div>
            </motion.div>

            {/* PLANES BASE */}
            <motion.div variants={fadeUp} className="flex flex-col gap-3">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <h4 className="ui-label text-[10px] text-slate-400 flex items-center gap-2">
                  <span className="h-1.5 w-1.5 rounded-full" style={{ backgroundColor: operatorColor }}></span>
                  2. ELIGE TU PLAN BASE
                </h4>
                {/* Selectores de filtrado y búsqueda */}
                <div className="flex flex-wrap items-center gap-3 self-start sm:self-auto">
                  {/* Selector de Portabilidad de Origen (solo se muestra para Yoigo y Orange) */}
                  {(selectedOperatorId === 'yoigo' || selectedOperatorId === 'orange') && (
                    <div className="flex items-center gap-1.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 px-3 py-1.5 rounded-xl shadow-sm text-slate-700">
                      <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Origen Portabilidad:</span>
                      <select
                        value={portabilityOrigin}
                        onChange={(e) => {
                          setPortabilityOrigin(e.target.value);
                          setShowOnlySelectedPlan(false);
                        }}
                        className="text-[11px] font-bold bg-transparent border-none outline-none focus:ring-0 cursor-pointer text-slate-700 dark:text-slate-200"
                      >
                        {selectedOperatorId === 'yoigo' ? (
                          <>
                            <option value="all">Cualquier operador</option>
                            <option value="digi">Digi (Promos Especiales 25€/31€)</option>
                            <option value="vodafone">Vodafone (Promo 45€)</option>
                            <option value="otros">Otros operadores</option>
                          </>
                        ) : (
                          <>
                            <option value="all">Cualquier operador</option>
                            <option value="movistar">Movistar (Con equipo)</option>
                            <option value="otros">Otros operadores (Con equipo menos Movistar)</option>
                            <option value="sin-equipo">Sin equipo</option>
                          </>
                        )}
                      </select>
                    </div>
                  )}

                  {/* Selector rápido desplegable */}
                  <div className="flex items-center gap-1.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 px-3 py-1.5 rounded-xl shadow-sm text-slate-700">
                    <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Búsqueda rápida:</span>
                    <select
                      value={showOnlySelectedPlan ? selectedPlanId : 'all'}
                      onChange={(e) => {
                        if (e.target.value === 'all') {
                          setShowOnlySelectedPlan(false);
                        } else {
                          setSelectedPlanId(e.target.value);
                          setShowOnlySelectedPlan(true);
                        }
                      }}
                      className="text-[11px] font-bold bg-transparent border-none outline-none focus:ring-0 cursor-pointer text-slate-700 dark:text-slate-200 max-w-[200px] truncate"
                    >
                      <option value="all">-- Mostrar todos --</option>
                      {filteredPlans.map(p => (
                        <option key={p.id} value={p.id}>
                          {p.name} ({p.price}€)
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>

              {/* Filtros de planes por operador */}
              <div className="flex flex-wrap gap-2 mb-2">
                <button
                  onClick={() => setPlanFilter('all')}
                  className={`text-[10px] font-bold px-3 py-1.5 rounded-xl border transition-all duration-200 ${
                    planFilter === 'all'
                      ? 'bg-slate-900 border-slate-900 text-white shadow-sm'
                      : 'bg-white hover:bg-slate-50 border-slate-200 text-slate-650'
                  }`}
                >
                  Todos
                </button>
                
                {selectedOperatorId === 'vodafone' && (
                  <>
                    {[
                      { id: 'sin-tv', label: 'Sin TV' },
                      { id: '2-platforms', label: '2 plataformas' },
                      { id: '3-platforms', label: '3 plataformas' },
                      { id: '4-platforms', label: '4 plataformas' },
                      { id: '1-linea', label: '1 línea móvil' }
                    ].map(tab => (
                      <button
                        key={tab.id}
                        onClick={() => setPlanFilter(tab.id)}
                        className={`text-[10px] font-bold px-3 py-1.5 rounded-xl border transition-all duration-200 ${
                          planFilter === tab.id
                            ? 'bg-[#E60000] border-[#E60000] text-white shadow-sm'
                            : 'bg-white hover:bg-slate-50 border-slate-200 text-slate-650'
                        }`}
                      >
                        {tab.label}
                      </button>
                    ))}
                  </>
                )}

                {selectedOperatorId === 'yoigo' && (
                  <>
                    {[
                      { id: 'portabilidad', label: 'Portabilidad' },
                      { id: 'especial-digi', label: 'Especial Digi' },
                      { id: 'fibra-fijo-movil', label: 'Fibra + fijo + móvil' },
                      { id: 'empresa', label: 'Digital Pro / Empresa' }
                    ].map(tab => (
                      <button
                        key={tab.id}
                        onClick={() => setPlanFilter(tab.id)}
                        className={`text-[10px] font-bold px-3 py-1.5 rounded-xl border transition-all duration-200 ${
                          planFilter === tab.id
                            ? 'bg-[#B026FF] border-[#B026FF] text-white shadow-sm'
                            : 'bg-white hover:bg-slate-50 border-slate-200 text-slate-650'
                        }`}
                      >
                        {tab.label}
                      </button>
                    ))}
                  </>
                )}

                {selectedOperatorId === 'orange' && (
                  <>
                    {[
                      { id: 'n-extra', label: 'N Extra 1/3/5/10/20' },
                      { id: 'con-equipo', label: 'Con equipo' },
                      { id: 'sin-equipo', label: 'Sin equipo' },
                      { id: 'movistar-equipo', label: 'Movistar con equipo' },
                      { id: 'sva-futbol', label: 'SVA / Fútbol' }
                    ].map(tab => (
                      <button
                        key={tab.id}
                        onClick={() => setPlanFilter(tab.id)}
                        className={`text-[10px] font-bold px-3 py-1.5 rounded-xl border transition-all duration-200 ${
                          planFilter === tab.id
                            ? 'bg-[#FF7900] border-[#FF7900] text-white shadow-sm'
                            : 'bg-white hover:bg-slate-50 border-slate-200 text-slate-650'
                        }`}
                      >
                        {tab.label}
                      </button>
                    ))}
                  </>
                )}

                {selectedOperatorId === 'win' && (
                  <>
                    {[
                      { id: 'gpon', label: 'GPON Regular' },
                      { id: 'xgspon', label: 'XGSPON 10G' },
                      { id: 'gamer', label: 'Gamer' },
                      { id: 'vertical', label: 'Edificios (S/ 1)' },
                      { id: 'pago-adelantado', label: 'Pago Adelantado' },
                      { id: 'empresa', label: 'Negocios RUC 20' }
                    ].map(tab => (
                      <button
                        key={tab.id}
                        onClick={() => setPlanFilter(tab.id)}
                        className={`text-[10px] font-bold px-3 py-1.5 rounded-xl border transition-all duration-200 ${
                          planFilter === tab.id
                            ? 'bg-[#FFCC00] border-[#FFCC00] text-slate-900 shadow-sm'
                            : 'bg-white hover:bg-slate-50 border-slate-200 text-slate-650'
                        }`}
                      >
                        {tab.label}
                      </button>
                    ))}
                  </>
                )}
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                {filteredPlans
                  .filter(p => !showOnlySelectedPlan || p.id === selectedPlanId)
                  .map((plan) => {
                  const isSelected = selectedPlanId === plan.id;
                  
                  let cardBorder = 'border-slate-200/80 hover:border-slate-350';
                  let cardShadow = 'hover:shadow-lg shadow-sm';
                  let activeBadge = 'bg-slate-100 text-slate-650';
                  
                  // Colores dinámicos del plan según operador (90% Opacidad de Marca)
                  let planDetailsBgClass = 'bg-slate-50/50 dark:bg-slate-900/30';
                  let planTextClass = 'text-slate-650 dark:text-slate-350';
                  let planTitleClass = 'text-slate-900 dark:text-slate-100 font-black';
                  let planPriceClass = 'text-slate-950 dark:text-white';
                  let planBorderClass = 'border-slate-200/60 dark:border-border/40';
                  let planCheckClass = 'text-emerald-500 dark:text-emerald-400';

                  if (selectedOperatorId === 'yoigo') {
                    planDetailsBgClass = 'bg-[#B026FF]/90 text-white';
                    planTextClass = 'text-white/90';
                    planTitleClass = 'text-white font-black';
                    planPriceClass = 'text-white font-black';
                    planBorderClass = 'border-white/20';
                    planCheckClass = 'text-white';
                  } else if (selectedOperatorId === 'orange') {
                    planDetailsBgClass = 'bg-[#FF7900]/95 text-white';
                    planTextClass = 'text-white/95';
                    planTitleClass = 'text-white font-black';
                    planPriceClass = 'text-white font-black';
                    planBorderClass = 'border-white/25';
                    planCheckClass = 'text-white';
                  } else if (selectedOperatorId === 'vodafone') {
                    planDetailsBgClass = 'bg-[#E60000]/95 text-white';
                    planTextClass = 'text-white/95';
                    planTitleClass = 'text-white font-black';
                    planPriceClass = 'text-white font-black';
                    planBorderClass = 'border-white/25';
                    planCheckClass = 'text-white';
                  } else if (selectedOperatorId === 'win') {
                    planDetailsBgClass = 'bg-[#FFCC00]/95 text-slate-950';
                    planTextClass = 'text-slate-900';
                    planTitleClass = 'text-slate-950 font-black';
                    planPriceClass = 'text-slate-950 font-black';
                    planBorderClass = 'border-slate-950/20';
                    planCheckClass = 'text-slate-950';
                  } else if (selectedOperatorId === 'lowi') {
                    planDetailsBgClass = 'bg-[#0B0B0C] text-white';
                    planTextClass = 'text-white/80';
                    planTitleClass = 'text-white font-black';
                    planPriceClass = 'text-[#E50015] font-black';
                    planBorderClass = 'border-white/10';
                    planCheckClass = 'text-[#E50015]';
                  }

                  if (isSelected) {
                    cardShadow = 'shadow-md';
                    activeBadge = 'bg-slate-900 text-white';
                     if (selectedOperatorId === 'yoigo') {
                       cardBorder = 'border-[#B026FF] ring-2 ring-[#B026FF]/10';
                     } else if (selectedOperatorId === 'orange') {
                       cardBorder = 'border-[#FF7900] ring-2 ring-[#FF7900]/10';
                     } else if (selectedOperatorId === 'vodafone') {
                       cardBorder = 'border-[#E60000] ring-2 ring-[#E60000]/10';
                     } else if (selectedOperatorId === 'lowi') {
                       cardBorder = 'border-[#E50015] ring-2 ring-[#E50015]/10';
                     } else if (selectedOperatorId === 'win') {
                       cardBorder = 'border-[#FFCC00] ring-2 ring-[#FFCC00]/10';
                     }
                   }

                  return (
                    <motion.div
                      key={plan.id}
                      onClick={() => setSelectedPlanId(plan.id)}
                      variants={popSelect}
                      whileHover="hover"
                      whileTap="pressed"
                      className={`cursor-pointer rounded-2xl border bg-white overflow-hidden flex flex-col justify-between transition-all duration-300 relative group ${cardBorder} ${cardShadow}`}
                    >
                      {/* Zona Visual Protagonista (40% - 50% de la card) */}
                      <div className="relative h-32 w-full overflow-hidden">
                        {renderPlanMockup(plan)}
                        
                        {/* Badges del plan */}
                        <div className="absolute top-3 left-3 flex flex-wrap gap-1">
                          {plan.operatorId === 'yoigo' && (plan.price === 25 || plan.price === 31 || plan.price === 45) && (
                            <span className="text-[8px] px-2 py-0.5 bg-emerald-600 text-white rounded font-black uppercase tracking-wider shadow-sm">
                              TARIFA RESIDENCIAL
                            </span>
                          )}
                          {plan.isPromo && (
                            <span className="text-[8px] px-2 py-0.5 bg-red-600 text-white rounded font-black uppercase tracking-wider shadow-sm">
                              {plan.promoMonths ? `PROMO ${plan.promoMonths} MESES` : 'DESCUENTO'}
                            </span>
                          )}
                          {!plan.isPromo && (
                            <span className="text-[8px] px-2 py-0.5 bg-slate-800 text-slate-200 rounded font-black uppercase tracking-wider shadow-sm">
                              SIN PROMOCIÓN
                            </span>
                          )}
                        </div>

                        {/* Check de selección superior */}
                        {isSelected && (
                          <div className="absolute top-3 right-3 h-5 w-5 rounded-full bg-slate-900 flex items-center justify-center text-white shadow-md z-30">
                            <Check className="h-3 w-3 stroke-[3px]" />
                          </div>
                        )}

                        {/* Sticker de Nuevas Tarifas */}
                        {plan.isNewCampaign && (
                          <div className="scotch-tape-sticker animate-scotch-tape">
                            Nuevas Tarifas
                          </div>
                        )}
                      </div>

                      {/* Detalles técnicos */}
                      <div className={`p-4 flex-1 flex flex-col justify-between transition-colors duration-300 ${planDetailsBgClass}`}>
                        <div>
                          <h5 className={`font-black text-sm leading-snug ${planTitleClass}`}>
                            {plan.name}
                          </h5>
                          {plan.segment && (
                            <span className="inline-block text-[8px] font-bold bg-red-50 text-[#FE0002] px-1.5 py-0.5 rounded-md mt-1">
                              {plan.segment}
                            </span>
                          )}
                          
                          <ul className="mt-3 space-y-1.5">
                            {plan.features.slice(0, 3).map((feat, idx) => (
                              <li key={idx} className={`text-xs flex items-start gap-1.5 font-medium ${planTextClass}`}>
                                <Check className={`h-3.5 w-3.5 shrink-0 mt-0.5 ${planCheckClass}`} />
                                <span className="line-clamp-2">{feat}</span>
                              </li>
                            ))}
                          </ul>

                          {plan.notes && plan.notes.length > 0 && (() => {
                            const isDarkBg = ['yoigo', 'orange', 'vodafone'].includes(selectedOperatorId);
                            return (
                              <div className={`mt-2.5 p-2 rounded-lg flex items-start gap-1.5 ${
                                isDarkBg 
                                  ? 'bg-white/15 border border-white/25' 
                                  : 'bg-amber-500/5 border border-amber-500/10'
                              }`}>
                                <Info className={`h-3.5 w-3.5 shrink-0 mt-0.5 ${isDarkBg ? 'text-white' : 'text-amber-600'}`} />
                                <div className={`text-[10px] leading-tight ${isDarkBg ? 'text-white font-bold' : 'text-amber-700 font-medium'}`}>
                                  {plan.notes.map((note, index) => (
                                    <p key={index}>
                                      {note}
                                    </p>
                                  ))}
                                </div>
                              </div>
                            );
                          })()}
                        </div>

                        {/* Fila precio */}
                        <div className={`mt-4 pt-3 border-t flex flex-col gap-1 ${planBorderClass}`}>
                          <div className="flex items-baseline justify-between w-full">
                            <div className="flex items-baseline gap-0.5">
                              {plan.operatorId === 'win' ? (
                                <>
                                  <span className="price-suffix text-[10px] text-slate-400 mr-0.5 font-bold">S/</span>
                                  <span className={`price-main text-2xl font-black ${planPriceClass}`}>{plan.price.toFixed(2)}</span>
                                </>
                              ) : (
                                <>
                                  <span className={`price-main text-2xl font-black ${planPriceClass}`}>{plan.price}</span>
                                  <span className="price-suffix text-[10px] text-slate-400 font-bold">€</span>
                                </>
                              )}
                              <span className="price-suffix text-[11px] text-slate-400 font-medium">/mes</span>
                              <span className={`text-[9px] font-black uppercase tracking-wider ml-1.5 px-1.5 py-0.5 rounded ${
                                plan.operatorId === 'orange' 
                                  ? 'bg-white/20 text-white' 
                                  : plan.operatorId === 'win'
                                    ? 'bg-slate-950/15 text-slate-950'
                                    : plan.operatorId === 'lowi'
                                      ? 'bg-white/10 text-white/80'
                                      : 'bg-white/20 text-white/90'
                              }`}>
                                {plan.operatorId === 'orange' ? 'SIN IMPUESTOS' : 'IVA INCLUIDO'}
                              </span>
                            </div>
                            {plan.priceAfterPromo && plan.priceAfterPromo !== plan.price && (
                              <span className="price-suffix text-[9px] text-slate-400 font-bold">
                                Luego {plan.operatorId === 'win' ? `S/ ${plan.priceAfterPromo.toFixed(2)}` : `${plan.priceAfterPromo}€`}/mes
                              </span>
                            )}
                          </div>
                          {plan.promoMonths && (
                            <span className={`text-[10px] font-black block text-left ${
                              ['yoigo', 'orange', 'vodafone'].includes(selectedOperatorId) 
                                ? 'text-white' 
                                : 'text-red-500'
                            }`}>
                              Promoción durante {plan.promoMonths} meses
                            </span>
                          )}
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            </motion.div>

            {/* AÑADIDOS CARDS COMPACTAS EN GRID */}
            <motion.div variants={fadeUp} className="flex flex-col gap-3">
              <h4 className="ui-label text-[10px] text-slate-400 flex items-center gap-2">
                <span className="h-1.5 w-1.5 rounded-full" style={{ backgroundColor: operatorColor }}></span>
                3. AÑADE SERVICIOS ADICIONALES
              </h4>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {displayedAddons.map((addon) => {
                  const isSelected = selectedAddonIds.has(addon.id);
                  
                  let cardBorder = 'border-slate-200/80 hover:border-slate-350';
                  let cardBg = 'bg-white';
                  let btnColor = 'bg-slate-100 hover:bg-slate-200 text-slate-650';

                  if (isSelected) {
                    cardBg = 'bg-white shadow-sm';
                    if (selectedOperatorId === 'yoigo') {
                      cardBorder = 'border-[#B026FF] shadow-[0_0_12px_rgba(176,38,255,0.05)]';
                      btnColor = 'bg-[#B026FF] text-white';
                    } else if (selectedOperatorId === 'orange') {
                      cardBorder = 'border-[#FF7900] shadow-[0_0_12px_rgba(255,121,0,0.05)]';
                      btnColor = 'bg-[#FF7900] text-white';
                    } else if (selectedOperatorId === 'vodafone') {
                      cardBorder = 'border-[#E60000] shadow-[0_0_12px_rgba(230,0,0,0.05)]';
                      btnColor = 'bg-[#E60000] text-white';
                    } else if (selectedOperatorId === 'win') {
                      cardBorder = 'border-[#FFCC00] shadow-[0_0_12px_rgba(255,204,0,0.05)]';
                      btnColor = 'bg-[#FFCC00] text-slate-900';
                    }
                  }

                  const isMobileLineAddon = addon.id === 'addon-line-mobile' || addon.id === 'global-mobile-line' || addon.id === 'yoigo-duo-adicional' || addon.id.includes('linea-adicional');

                  return (
                    <motion.div
                      key={addon.id}
                      onClick={() => toggleAddon(addon.id)}
                      variants={popSelect}
                      whileHover="hover"
                      whileTap="pressed"
                      className={`cursor-pointer rounded-2xl border p-2.5 flex flex-col justify-between gap-3 transition-all duration-300 h-44 ${cardBorder} ${cardBg}`}
                    >
                      {/* Fila Superior: Mini visual e Icono de apoyo */}
                      <div className="flex justify-between items-start">
                        {renderAddonThumbnail(addon.id)}
                        <span 
                          className="price-main text-[11px] font-black border px-2 py-0.5 rounded-lg transition-all duration-300 shadow-sm"
                          style={{
                            color: operatorColor,
                            borderColor: `${operatorColor}40`,
                            backgroundColor: darkMode ? `${operatorColor}20` : `${operatorColor}08`
                          }}
                        >
                          {addon.price === 0 ? 'Gratis' : (selectedOperatorId === 'win' ? `+S/ ${addon.price.toFixed(2)}` : `+${addon.price}`)}
                          {addon.price !== 0 && selectedOperatorId !== 'win' && <span className="price-suffix text-[9px] ml-0.5" style={{ color: operatorColor }}>€</span>}
                        </span>
                      </div>

                      {/* Textos de Añadido */}
                      <div className="flex-1 flex flex-col justify-end">
                        <h5 className="font-extrabold text-[11px] text-slate-800 flex items-center gap-1.5 font-bold">
                          {addon.name}
                        </h5>
                        <p className="text-[9px] text-slate-400 mt-0.5 line-clamp-2 leading-relaxed">
                          {addon.description}
                        </p>
                      </div>

                      {/* Botón Añadir circular */}
                      <div className="flex items-center justify-between mt-1 pt-2 border-t border-slate-100">
                        <span className="text-[9px] text-slate-400 font-bold uppercase">
                          {addon.price === 0 ? 'Único' : 'Mensual'}
                        </span>
                        {isSelected && isMobileLineAddon ? (
                          <div className="flex items-center gap-1.5 bg-slate-100/80 rounded-full p-0.5" onClick={(e) => e.stopPropagation()}>
                            <button
                              type="button"
                              onClick={() => {
                                if (mobileLinesCount > 1) {
                                  setMobileLinesCount(mobileLinesCount - 1);
                                } else {
                                  const updated = new Set(selectedAddonIds);
                                  updated.delete(addon.id);
                                  setSelectedAddonIds(updated);
                                }
                              }}
                              className="h-5 w-5 rounded-full bg-white hover:bg-slate-50 flex items-center justify-center text-[10px] font-black text-slate-700 shadow-sm transition-all cursor-pointer select-none"
                            >
                              -
                            </button>
                            <span className="text-[10px] font-extrabold px-1 min-w-[12px] text-center text-slate-800">{mobileLinesCount}</span>
                            <button
                              type="button"
                              onClick={() => {
                                const maxLines = getMaxLinesCount(selectedOperatorId, activePlan?.id || '', activePlan?.name || '');
                                if (mobileLinesCount < maxLines) {
                                  setMobileLinesCount(mobileLinesCount + 1);
                                }
                              }}
                              className="h-5 w-5 rounded-full bg-white hover:bg-slate-50 flex items-center justify-center text-[10px] font-black text-slate-700 shadow-sm transition-all cursor-pointer select-none"
                            >
                              +
                            </button>
                          </div>
                        ) : (
                          <div className={`h-5 w-5 rounded-full flex items-center justify-center transition-all ${btnColor}`}>
                            {isSelected ? (
                              <Check className="h-3 w-3 stroke-[3px]" />
                            ) : (
                              <Plus className="h-3 w-3" />
                            )}
                          </div>
                        )}
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            </motion.div>

            {/* BANNER DE VELOCIDAD INFERIOR */}
            <motion.div 
              variants={fadeUp}
              className="relative rounded-2xl bg-gradient-to-r from-red-50/15 via-white to-slate-50 dark:from-indigo-950/20 dark:via-[#131b2e] dark:to-slate-900 border border-slate-200/80 dark:border-slate-800 p-5 overflow-hidden flex items-center justify-between gap-6"
            >
              <div className="relative z-10">
                <span className="text-[9px] font-black text-[#FE0002] dark:text-red-400 tracking-widest uppercase flex items-center gap-1.5">
                  <span className="text-2xl leading-none">🚀</span> SUBE DE NIVEL TU CONEXIÓN
                </span>
                <h4 className="text-sm font-extrabold text-slate-800 dark:text-slate-200 mt-1.5">Más velocidad, más cobertura, más entretenimiento. Ofrece siempre lo mejor.</h4>
              </div>
              <div className="w-24 h-16 opacity-85 dark:opacity-75 relative hidden md:block">
                {/* SVG del velocímetro */}
                <svg viewBox="0 0 100 50" className="w-full h-full text-[#FE0002] dark:text-red-400">
                  {/* Arco de fondo */}
                  <path d="M 10 50 A 40 40 0 0 1 90 50" fill="none" stroke="currentColor" strokeWidth="6" strokeDasharray="3 3" className="opacity-40" />
                  {/* Arco de aceleración (Rojo) */}
                  <path d="M 10 50 A 40 40 0 0 1 70 20" fill="none" stroke="#ef4444" strokeWidth="8" />
                  {/* Aguja (Rojo) */}
                  <line x1="50" y1="50" x2="70" y2="25" stroke="#ef4444" strokeWidth="3" strokeLinecap="round" />
                </svg>
              </div>
            </motion.div>

          </motion.div>

          {/* COLUMNA DERECHA TICKET DE COTIZACIÓN */}
          <section className="xl:col-span-4 flex flex-col gap-6 sticky top-24">
            
            {/* CARD DATOS CLIENTE */}
            <Card className="border-border bg-card overflow-hidden rounded-3xl">
              <CardHeader className="pb-3 border-b border-slate-100 bg-slate-50/50 py-3">
                <CardTitle className="text-xs uppercase tracking-widest text-[#FE0002] font-bold flex items-center gap-1.5 font-bold">
                  <Users className="h-4 w-4" />
                  Datos de Propuesta & WhatsApp
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-4 flex flex-col gap-3.5">
                <div className="grid grid-cols-1 gap-3">
                  <div>
                    <label className="text-[9px] font-extrabold text-slate-400 block mb-1 uppercase tracking-wider">Nombre del Cliente</label>
                    <input
                      type="text"
                      value={clientName}
                      onChange={(e) => setClientName(e.target.value)}
                      placeholder="Ej: Juan Pérez"
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-800 font-bold focus:outline-none focus:ring-2 focus:ring-red-500/20"
                    />
                  </div>
                  <div>
                    <label className="text-[9px] font-extrabold text-slate-400 block mb-1 uppercase tracking-wider">Teléfono WhatsApp Cliente</label>
                    <input
                      type="text"
                      value={clientPhone}
                      onChange={(e) => setClientPhone(e.target.value)}
                      placeholder="Ej: 34600000000"
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-800 font-bold focus:outline-none focus:ring-2 focus:ring-red-500/20"
                    />
                  </div>
                </div>
                
                <Button
                  onClick={generateProposalImage}
                  className="w-full mt-1 bg-[#FE0002] hover:bg-[#D10002] text-white text-[11px] font-extrabold uppercase py-2.5 rounded-xl transition-all shadow-md shadow-indigo-500/10 flex items-center justify-center gap-1.5"
                >
                  <Sparkles className="h-3.5 w-3.5" />
                  Generar Imagen de Propuesta (Gratis)
                </Button>
              </CardContent>
            </Card>

            {/* TICKET / RECIBO DE COTIZACIÓN */}
            <motion.div
              initial="hidden"
              animate="visible"
              variants={fadeUp}
              className="bg-white border border-slate-200/85 rounded-3xl shadow-xl overflow-hidden flex flex-col justify-between"
            >
              {/* Cabecera del ticket coloreada con el color del operador (negro para Lowi) */}
              <div className={`p-5 flex items-center justify-between transition-colors duration-350 ${
                selectedOperatorId === 'win' ? 'text-slate-900' : 'text-white'
              }`} style={{ backgroundColor: selectedOperatorId === 'lowi' ? '#0A0A0A' : operatorColor }}>
                <div className="flex items-center gap-3">
                  {renderOperatorLogoSymbol(selectedOperatorId)}
                  <div>
                    <h4 className={`text-sm tracking-tight leading-none lowercase ${
                      selectedOperatorId === 'yoigo' ? 'operator-wordmark-yoigo text-white' :
                      selectedOperatorId === 'orange' ? 'operator-wordmark-orange text-white' :
                      selectedOperatorId === 'vodafone' ? 'operator-wordmark-vodafone text-white' :
                      selectedOperatorId === 'lowi' ? 'operator-wordmark-lowi text-white' :
                      selectedOperatorId === 'win' ? 'font-black text-white' : 'font-extrabold'
                    }`}>{activeOperator.name}</h4>
                    <span className={`ui-label text-[8px] mt-1 block ${
                      selectedOperatorId === 'win' ? 'text-slate-900/70' : 'opacity-80'
                    }`}>SMART CONFIGURATOR</span>
                  </div>
                </div>
                <div className={`text-[9px] font-extrabold px-2 py-0.5 rounded uppercase ${
                  selectedOperatorId === 'win' ? 'bg-black/10 border border-black/15 text-slate-900' : 'bg-white/20 border border-white/25 text-white'
                }`}>
                  ASESOR
                </div>
              </div>

              <div className="p-6 flex flex-col gap-4">
                
                {/* Sección PLAN BASE */}
                <div>
                  <span className="text-[10px] text-slate-500 font-black uppercase tracking-wider block mb-2.5">
                    PLAN CONTRATADO
                  </span>
                  {activePlan && (
                    <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 space-y-1">
                      <div className="flex justify-between items-center text-xs">
                        <span className="font-extrabold text-slate-800 truncate max-w-[170px]">{activePlan.name}</span>
                        <div className="flex items-center gap-1 shrink-0">
                          {(selectedOperatorId === 'yoigo' || selectedOperatorId === 'vodafone' || selectedOperatorId === 'lowi') && (
                            <span className="text-[8px] bg-slate-100 border border-slate-200 text-slate-600 px-1.5 py-0.5 rounded font-black uppercase tracking-wider">
                              IVA INCLUIDO
                            </span>
                          )}
                          {activePlan.isPromo && (
                            <span className="text-[8px] bg-red-600 px-1.5 py-0.5 rounded font-black text-white">
                              PROMO {activePlan.promoMonths || 3} MESES
                            </span>
                          )}
                        </div>
                      </div>
                      <div className="flex items-baseline gap-0.5 mt-1">
                        {selectedOperatorId === 'win' ? (
                          <>
                            <span className="price-suffix text-[10px] text-slate-400 mr-0.5 font-bold">S/</span>
                            <span className="price-main text-lg text-slate-900 font-black">{basePrice.toFixed(2)}</span>
                          </>
                        ) : (
                          <>
                            <span className="price-main text-lg text-slate-900 font-black">{basePrice}</span>
                            <span className="price-suffix text-[10px] text-slate-400 font-bold">€</span>
                          </>
                        )}
                        <span className="price-suffix text-[11px] text-slate-400 font-medium">/mes</span>
                        {activePlan.priceAfterPromo && activePlan.priceAfterPromo !== basePrice && (
                          <span className="price-suffix text-[9px] text-slate-400 font-bold ml-2">
                            Luego {selectedOperatorId === 'win' ? `S/ ${activePlan.priceAfterPromo.toFixed(2)}` : `${activePlan.priceAfterPromo}€`}/mes
                          </span>
                        )}
                      </div>
                    </div>
                  )}
                </div>

                {/* Selector de Impuestos (Solo para Orange) */}
                {selectedOperatorId === 'orange' && (
                  <div className="p-3 bg-orange-50/80 border border-orange-200 rounded-2xl flex flex-col gap-2 shadow-sm">
                    <span className="text-[10px] text-orange-950 font-black uppercase tracking-wider block">
                      Impuesto a aplicar (Zona de envío):
                    </span>
                    <div className="grid grid-cols-3 gap-2">
                      <button
                        type="button"
                        onClick={() => setTaxType('none')}
                        className={`text-[10px] py-2 px-2.5 rounded-xl border font-extrabold transition-all ${
                          taxType === 'none'
                            ? 'bg-[#FF7900] text-white border-[#FF7900] shadow-md shadow-orange-500/10'
                            : 'bg-white border-orange-200/80 text-orange-950/80 hover:bg-orange-100/50'
                        }`}
                      >
                        Sin Impuesto
                      </button>
                      <button
                        type="button"
                        onClick={() => setTaxType('iva')}
                        className={`text-[10px] py-2 px-2.5 rounded-xl border font-extrabold transition-all ${
                          taxType === 'iva'
                            ? 'bg-[#FF7900] text-white border-[#FF7900] shadow-md shadow-orange-500/10'
                            : 'bg-white border-orange-200/80 text-orange-950/80 hover:bg-orange-100/50'
                        }`}
                      >
                        +21% IVA
                      </button>
                      <button
                        type="button"
                        onClick={() => setTaxType('igic')}
                        className={`text-[10px] py-2 px-2.5 rounded-xl border font-extrabold transition-all ${
                          taxType === 'igic'
                            ? 'bg-[#FF7900] text-white border-[#FF7900] shadow-md shadow-orange-500/10'
                            : 'bg-white border-orange-200/80 text-orange-950/80 hover:bg-orange-100/50'
                        }`}
                      >
                        +7% IGIC
                      </button>
                    </div>
                  </div>
                )}

                {/* Resaltado de IGV para Win */}
                {selectedOperatorId === 'win' && (
                  <div className="text-[9px] text-slate-500/70 italic px-1">
                    * Precios con IGV incluido de forma predeterminada.
                  </div>
                )}

                {/* Sección SERVICIOS AÑADIDOS */}
                <div>
                  <span className="text-[10px] text-slate-500 font-black uppercase tracking-wider block mb-2.5">
                    AÑADIDOS SELECCIONADOS
                  </span>
                  
                  {activeAddons.length === 0 ? (
                    <p className="text-xs text-slate-400 italic pl-1 font-medium">Ningún servicio adicional agregado.</p>
                  ) : (
                    <div className="space-y-1.5 max-h-[140px] overflow-y-auto pr-1">
                      {activeAddons.map(addon => {
                        const qty = addon.id === 'addon-line-mobile' || addon.id === 'global-mobile-line' || addon.id === 'yoigo-duo-adicional' || addon.id.includes('linea-adicional') ? mobileLinesCount : 1;
                        return (
                          <div key={addon.id} className="flex justify-between items-center text-xs py-1.5 px-2.5 bg-slate-50 border border-slate-100 rounded-lg">
                            <span className="text-slate-600 flex items-center gap-1.5 truncate font-medium">
                              {getIcon(addon.iconName, "h-3.5 w-3.5 text-slate-400 shrink-0")}
                              <span className="truncate">{addon.name}{qty > 1 && ` (x${qty})`}</span>
                            </span>
                            <div className="flex flex-col items-end shrink-0">
                              <span className="price-main text-xs text-slate-900 font-bold">
                                {addon.price === 0 ? 'Gratis' : (
                                  <>
                                    {selectedOperatorId === 'win' ? 'S/ ' : '+'}{(addon.price * qty).toFixed(2)}
                                    {selectedOperatorId !== 'win' && <span className="price-suffix text-[9px] text-slate-400">€/mes</span>}
                                    {selectedOperatorId === 'win' && <span className="price-suffix text-[9px] text-slate-400 font-normal">/mes</span>}
                                  </>
                                )}
                              </span>
                              {addon.regularPrice !== undefined && addon.regularPrice !== addon.price && (
                                <span className="text-[8px] text-slate-400 font-medium">
                                  Luego: {selectedOperatorId === 'win' ? `S/ ${(addon.regularPrice * qty).toFixed(2)}` : `+${(addon.regularPrice * qty).toFixed(2)}€`}/mes
                                </span>
                              )}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>

                <Separator className="bg-slate-100 border-dashed" />

                {/* Desglose matemático */}
                <div className="space-y-2 text-[13px] text-slate-650 font-bold">
                  <div className="flex justify-between">
                    <span className="ui-label text-[10px] text-slate-500 font-bold">CUOTA BASE PLAN</span>
                    <span className="price-main text-slate-800 flex items-center gap-1">
                      {selectedOperatorId === 'win' ? (
                        `S/ ${basePrice.toFixed(2)}`
                      ) : (
                        `${basePrice.toFixed(2)} €`
                      )}
                      {(selectedOperatorId === 'yoigo' || selectedOperatorId === 'vodafone' || selectedOperatorId === 'lowi') && (
                        <span className="text-[7.5px] bg-slate-100 text-slate-500 px-1 py-0.2 rounded border border-slate-200/50 font-black">
                          IVA INC.
                        </span>
                      )}
                      <span className="price-suffix text-[11px] text-slate-400 font-medium">/mes</span>
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="ui-label text-[10px] text-slate-500 font-bold">CUOTA ADICIONALES</span>
                    <span className="price-main text-slate-800">
                      {selectedOperatorId === 'win' ? `+S/ ${addonsTotalPromo.toFixed(2)}` : `+${addonsTotalPromo.toFixed(2)} €`}
                      <span className="price-suffix text-[11px] text-slate-400 font-medium">/mes</span>
                    </span>
                  </div>
                  {selectedOperatorId === 'orange' && taxType !== 'none' && (
                    <div className="flex justify-between pt-1 border-t border-slate-200 text-slate-650 font-semibold">
                      <span className="ui-label text-[10px] text-slate-500 font-bold">
                        {taxType === 'iva' ? 'IMPUESTO APLICADO (IVA 21%)' : 'IMPUESTO APLICADO (IGIC 7%)'}
                      </span>
                      <span className="price-main text-slate-900 font-black">
                        {`+${((basePrice + addonsTotalPromo) * (taxType === 'iva' ? 0.21 : 0.07)).toFixed(2)} €`}
                      </span>
                    </div>
                  )}
                  {hasPromo && (
                    <div className="flex justify-between pt-1 border-t border-slate-100/50">
                      <span className="ui-label text-[10px] text-slate-500 font-bold">DESPUÉS DE PROMO (PLAN + ADIC.)</span>
                      <span className="price-main text-slate-800">
                        {selectedOperatorId === 'win' ? `S/ ${totalPriceNormal.toFixed(2)}` : `${totalPriceNormal.toFixed(2)} €`}
                        <span className="price-suffix text-[11px] text-slate-400 font-medium">/mes</span>
                      </span>
                    </div>
                  )}
                </div>

                {/* TOTAL MENSUAL GRANDE */}
                <div className="p-4 bg-slate-50 border border-slate-100 rounded-2xl text-center relative overflow-hidden shadow-inner">
                  <span className="ui-label text-[9px] text-slate-400 block">
                    TOTAL MENSUAL NETO
                  </span>
                  
                  <div className="flex items-baseline justify-center gap-0.5 mt-1.5">
                    {selectedOperatorId === 'win' && (
                      <span className="price-suffix text-xl text-slate-500 font-black mr-1">S/</span>
                    )}
                    <motion.span
                      key={hasPromo ? totalPricePromo : totalPriceNormal}
                      initial={{ scale: 0.85, opacity: 0.7 }}
                      animate={{ scale: 1, opacity: 1 }}
                      transition={{ type: "spring", stiffness: 200, damping: 14 }}
                      className="price-main text-5xl tracking-tight font-black"
                      style={{ color: operatorColor }}
                    >
                      {selectedOperatorId === 'win' 
                        ? (hasPromo ? totalPricePromo.toFixed(2) : totalPriceNormal.toFixed(2)) 
                        : (hasPromo ? totalPricePromo : totalPriceNormal)}
                    </motion.span>
                    {selectedOperatorId !== 'win' && (
                      <span className="price-suffix text-sm text-slate-500 font-black ml-0.5">€</span>
                    )}
                    <span className="price-suffix text-xs text-slate-450 ml-0.5">/mes</span>
                  </div>

                  {hasPromo && (
                    <div className="mt-2.5 pt-2.5 border-t border-slate-200 flex justify-between items-center text-[10px]">
                      <span className="ui-label text-[10px] text-slate-500 font-bold">LUEGO DE PROMO</span>
                      <span className="price-main text-slate-800 font-bold">
                        {selectedOperatorId === 'win' ? `S/ ${totalPriceNormal.toFixed(2)}` : `${totalPriceNormal.toFixed(2)} €`}
                        <span className="price-suffix text-[9px] text-slate-400">/mes</span>
                      </span>
                    </div>
                  )}
                </div>

                {/* Banner de Ahorro Promocional */}
                {hasPromo && savingsAmount > 0 && (
                  <div className="p-3 bg-gradient-to-r from-red-50 to-white border border-red-200 rounded-2xl flex items-center justify-between gap-2 shadow-sm">
                    <div className="flex items-center gap-2">
                      <span className="text-lg">🐷</span>
                      <div>
                        <span className="text-[10px] font-black text-red-600 block leading-tight">
                          Ahorra {selectedOperatorId === 'win' ? `S/ ${savingsAmount.toFixed(2)}` : `${savingsAmount}€`} cada mes durante {activePlan?.promoMonths || 3} meses
                        </span>
                        <span className="text-[9px] text-slate-400 mt-0.5 block leading-none">
                          Aprovecha esta promoción exclusiva
                        </span>
                      </div>
                    </div>
                  </div>
                )}

              </div>

              {/* Acciones */}
              <div className="px-6 pb-6 pt-2 flex flex-col gap-3">
                <Button 
                  onClick={handleCopyWhatsApp}
                  className={`w-full py-6 text-xs uppercase tracking-wider font-extrabold flex items-center justify-center gap-2 rounded-xl transition-all duration-300 ${operatorBtnBgClass}`}
                >
                  {copySuccess ? (
                    <>
                      <Check className="h-4 w-4 stroke-[3.5px]" />
                      ¡PROPUESTA COPIADA!
                    </>
                  ) : (
                    <>
                      <Share2 className="h-4 w-4" />
                      COPIAR PROPUESTA PARA WHATSAPP
                    </>
                  )}
                </Button>

                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleReset}
                  className="w-full border-slate-200 hover:border-slate-350 hover:bg-slate-50 text-[10px] uppercase tracking-wider font-bold py-4.5 rounded-xl text-slate-500"
                >
                  <RotateCcw className="h-3 w-3 mr-1" />
                  LIMPIAR COTIZACIÓN
                </Button>

                <div className="border-t border-slate-100 dark:border-slate-800 my-2 pt-2 flex flex-col gap-1.5">
                  <div className="flex justify-between items-center text-[10px] text-slate-500 font-bold">
                    <span className="flex items-center gap-1">👤 Asesor: {advisorName} ({advisorRole})</span>
                    <button 
                      onClick={() => {
                        const name = prompt('Nombre del Asesor:', advisorName);
                        if (name !== null) {
                          const role = prompt('Cargo / Rol del Asesor:', advisorRole);
                          if (role !== null) {
                            saveAdvisorInfo(name.trim() || 'Carlos Mendoza', role.trim() || 'Asesor Comercial');
                            alert('¡Datos de asesor actualizados!');
                          }
                        }
                      }}
                      className="text-indigo-650 hover:text-indigo-750 dark:text-indigo-400 dark:hover:text-indigo-300 underline text-[9px] cursor-pointer"
                    >
                      Cambiar
                    </button>
                  </div>
                </div>

                <div className="flex items-center justify-center gap-1.5 text-[9px] text-slate-400 font-semibold mt-1">
                  <Lock className="h-3 w-3 text-slate-300" />
                  <span>Información confidencial para uso interno</span>
                </div>
              </div>
            </motion.div>

            {/* DYNAMIC SALES ARGUMENT */}
            <motion.div
              initial="hidden"
              animate="visible"
              variants={fadeUp}
            >
              <Card className="border-border bg-card overflow-hidden rounded-3xl">
                <CardHeader className="pb-3 border-b border-slate-100 bg-slate-50/50">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-xs uppercase tracking-widest text-[#FE0002] font-bold flex items-center gap-1.5">
                      <Award className="h-4 w-4" />
                      Argumentario Comercial
                    </CardTitle>
                    <span className="text-[9px] text-slate-550 bg-slate-100 border border-slate-200 px-2 py-0.5 rounded font-extrabold uppercase">
                      {activeOperator.name}
                    </span>
                  </div>
                </CardHeader>
                <CardContent className="pt-4 flex flex-col gap-4">
                  <div className="space-y-4">
                    {/* Gancho principal */}
                    <div>
                      <span className="text-[9px] font-extrabold text-slate-400 uppercase tracking-wider block">Gancho Principal</span>
                      <h5 className="text-xs font-bold text-slate-800 mt-0.5">{salesArgument.gancho}</h5>
                    </div>

                    {/* Beneficio clave */}
                    <div>
                      <span className="text-[9px] font-extrabold text-slate-400 uppercase tracking-wider block">Beneficio Principal</span>
                      <p className="text-xs text-slate-600 mt-0.5 font-semibold">{salesArgument.beneficio}</p>
                    </div>

                    {/* Puntos Fuertes */}
                    {salesArgument.sellingPoints && salesArgument.sellingPoints.length > 0 && (
                      <div>
                        <span className="text-[9px] font-extrabold text-slate-400 uppercase tracking-wider block mb-1">Beneficios Clave del Plan</span>
                        <ul className="space-y-1">
                          {salesArgument.sellingPoints.map((point, idx) => (
                            <li key={idx} className="text-xs text-slate-700 flex items-start gap-1.5 font-semibold">
                              <span className="text-red-500 font-bold shrink-0">•</span>
                              <span>{point}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {/* Frase para decir al cliente */}
                    <div className="p-3 bg-slate-50 border border-slate-100 rounded-xl relative">
                      <span className="text-[9px] font-extrabold text-slate-400 uppercase tracking-wider block mb-1">Frase sugerida al cliente</span>
                      <p className="text-xs text-slate-700 italic font-semibold leading-relaxed">
                        {salesArgument.fraseCliente}
                      </p>
                    </div>

                    {/* Objeción sugerida (Principal) */}
                    <div className="flex gap-2 items-start pt-1.5 border-t border-slate-100">
                      <Info className="h-4.5 w-4.5 text-amber-500 shrink-0 mt-0.5" />
                      <div>
                        <span className="text-[9px] font-extrabold text-slate-400 uppercase tracking-wider block">Consejo de Cierre</span>
                        <p className="text-xs text-slate-500 font-semibold mt-0.5 leading-relaxed">
                          {salesArgument.objecionSugerida}
                        </p>
                      </div>
                    </div>

                    {/* Rebates y Objeciones Comunes */}
                    {salesArgument.rebuttalOptions && salesArgument.rebuttalOptions.length > 0 && (
                      <div className="space-y-2 pt-2 border-t border-slate-100">
                        <span className="text-[9px] font-extrabold text-slate-405 uppercase tracking-wider block mb-1">Manejo de Objeciones (Respuestas / Rebate)</span>
                        <div className="space-y-2.5">
                          {salesArgument.rebuttalOptions.map((opt, idx) => (
                            <div key={idx} className="p-2.5 bg-slate-50/70 border border-slate-200/80 rounded-2xl">
                              <p className="text-[10px] font-black text-amber-700 flex items-center gap-1">
                                <span>❓ Objeción:</span>
                                <span className="italic">"{opt.objection}"</span>
                              </p>
                              <p className="text-xs text-slate-650 mt-1 font-semibold leading-relaxed pl-2 border-l-2 border-amber-500">
                                {opt.counter}
                              </p>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </motion.div>

          </section>
          </>
        )}
      </main>

      {/* MODAL DE IMAGEN DE PROPUESTA */}
      <AnimatePresence>
        {showImageModal && (
          <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-3xl overflow-hidden shadow-2xl max-w-2xl w-full border border-slate-150 flex flex-col justify-between"
            >
              <div className="p-5 border-b border-slate-100 flex items-center justify-between">
                <div>
                  <h4 className="font-black text-slate-900 text-sm uppercase tracking-wider flex items-center gap-2">
                    <Sparkles className="h-4 w-4 text-amber-500" />
                    Propuesta Gráfica Generada (Gratis)
                  </h4>
                  <p className="text-[10px] text-slate-400 mt-0.5">Vista previa de la propuesta comercial que se enviará al cliente.</p>
                </div>
                <button 
                  onClick={() => setShowImageModal(false)}
                  className="text-slate-450 hover:text-slate-700 bg-slate-100 rounded-full h-7 w-7 flex items-center justify-center font-bold"
                >
                  ✕
                </button>
              </div>

              {/* Contenedor de la Imagen */}
              <div className="p-6 bg-slate-50 flex justify-center items-center overflow-auto max-h-[400px]">
                {generatedImageUrl && (
                  <img 
                    src={generatedImageUrl} 
                    alt="Propuesta comercial generada" 
                    className="max-w-full h-auto rounded-xl border border-slate-200 shadow-md" 
                  />
                )}
              </div>

              {/* Botones de acción */}
              <div className="p-5 border-t border-border bg-card flex flex-col sm:flex-row gap-3">
                <Button
                  onClick={() => {
                    const link = document.createElement('a');
                    link.download = `Propuesta_${clientName || 'Cliente'}.png`;
                    link.href = generatedImageUrl;
                    link.click();
                  }}
                  variant="outline"
                  className="flex-1 py-5 text-xs font-bold border-slate-200 hover:border-slate-350 rounded-xl"
                >
                  Descargar Imagen (PNG)
                </Button>

                <Button
                  onClick={sendEvolutionProposal}
                  disabled={sendingProposal}
                  className={`flex-1 py-5 text-xs font-black text-white rounded-xl ${operatorBtnBgClass}`}
                >
                  {sendingProposal ? (
                    <>
                      <span className="animate-spin mr-1.5 h-3.5 w-3.5 border-2 border-white border-t-transparent rounded-full" />
                      ENVIANDO...
                    </>
                  ) : (
                    <>
                      <Share2 className="h-4 w-4 mr-1.5" />
                      ENVIAR POR WHATSAPP (EVOLUTION API)
                    </>
                  )}
                </Button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* FLOTANTE DE PERMISO LLAMADA (COMPACTO - NO BLOQUEANTE) */}
      <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-3 pointer-events-none">
        {showPermisoModal && (
          <motion.div 
            initial={{ scale: 0.9, opacity: 0, y: 15 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            className="w-96 shadow-2xl border border-border rounded-3xl overflow-hidden pointer-events-auto bg-card text-[#0F172A]"
          >
            {/* Header / Barra de arrastre/cierre */}
            <div className="bg-slate-50/50 dark:bg-slate-950 px-4 py-2 border-b border-border flex justify-between items-center">
              <span className="text-[9px] font-black text-slate-450 dark:text-slate-400 uppercase tracking-widest">Aviso Legal Flotante</span>
              <button 
                onClick={() => setShowPermisoModal(false)}
                className="text-slate-450 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200 text-[10px] font-bold cursor-pointer"
              >
                ✕ Minimizar
              </button>
            </div>
            <div className="p-1">
              <CompactPermisoPanel darkMode={darkMode} operatorColor={operatorColor} />
            </div>
          </motion.div>
        )}

        <button
          onClick={() => setShowPermisoModal(prev => !prev)}
          className="h-14 w-14 rounded-full bg-gradient-to-r from-red-600 to-red-700 hover:scale-105 active:scale-95 text-white flex items-center justify-center shadow-lg shadow-red-500/25 transition-all cursor-pointer pointer-events-auto relative group"
          title="Permiso de Llamada"
        >
          <PhoneCall className="h-6 w-6 animate-pulse text-white" />
          <span className="absolute right-16 bg-slate-900 text-white text-[9px] font-extrabold uppercase px-2.5 py-1.5 rounded-lg whitespace-nowrap shadow-md opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none">
            Aviso de llamada
          </span>
        </button>
      </div>

      </div>

    </div>
  );
}
