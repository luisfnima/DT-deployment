'use client';

import React, { useState, useEffect } from 'react';
import { 
  Bot, Send, FileText, Settings, Upload, Clock, 
  HelpCircle, History, MessageSquare, AlertCircle
} from 'lucide-react';

interface EmbudoPanelProps {
  darkMode: boolean;
  operatorColor: string;
}

export default function EmbudoPanel({ darkMode, operatorColor }: EmbudoPanelProps) {
  // Form fields
  const [numCliente, setNumCliente] = useState('');
  const [nombreCliente, setNombreCliente] = useState('');
  const [operadorDonante, setOperadorDonante] = useState('');
  const [companiaNueva, setCompaniaNueva] = useState('');
  const [nombreSupervisor, setNombreSupervisor] = useState('');
  const [cargo, setCargo] = useState('');
  const [area, setArea] = useState('');
  const [precio, setPrecio] = useState('');
  const [plan, setPlan] = useState('');

  // Premium / Settings fields
  const [rutaAdjunto, setRutaAdjunto] = useState('');
  const [programar, setProgramar] = useState('');
  const [ipServidor, setIpServidor] = useState('localhost');
  const [modoGuardia, setModoGuardia] = useState(false);
  const [statsCount, setStatsCount] = useState(0);

  // Template lists and active selection
  const templatesList = [
    "1. Mejora de tarifa (Contacto inicial)",
    "2. Despedida y Plan Vuelta a Casa (6 meses)",
    "3. Advertencia - Suspensión temporal",
    "4. Confirmación - Portabilidad Cancelada",
    "5. Seguimiento - Mensaje corto",
    "6. Incidencia - Bloqueo de operador",
    "7. Aclaración - Error de otro comercial",
    "8. Pérdida de números (1 año)",
    "9. Plan Vuelta a Casa - Oferta (6 meses)",
    "10. Seguimiento - Proceso en curso (7 meses)",
    "11. Notificación Automática Sistema"
  ];
  const [selectedTemplate, setSelectedTemplate] = useState(templatesList[0]);
  const [previewText, setPreviewText] = useState('');
  const [showHistory, setShowHistory] = useState(false);

  // Load defaults from local storage if any
  useEffect(() => {
    if (typeof window !== 'undefined') {
      setNombreSupervisor(localStorage.getItem('advisorName') || 'Carlos Mendoza');
      setCargo(localStorage.getItem('advisorRole') || 'Supervisor de Ventas');
      setArea('Área de Retenciones');
    }
  }, []);

  // Update preview text whenever form fields or selected template change
  useEffect(() => {
    const values: Record<string, string> = {
      cliente: nombreCliente || 'NOMBRE DEL CLIENTE',
      op_donante: operadorDonante || 'OPERADOR DONANTE',
      comp_nueva: companiaNueva || 'COMPAÑÍA NUEVA',
      supervisor: nombreSupervisor || 'NOMBRE DEL SUPERVISOR',
      cargo: cargo || 'CARGO Y OPERADOR DONANTE',
      area: area || 'ÁREA DE LA QUE SE ENVÍA',
      precio: precio || 'PRECIO OFRECIDO',
      plan: plan || 'PLAN OFERTADO'
    };

    let templateContent = '';
    
    switch (selectedTemplate) {
      case "1. Mejora de tarifa (Contacto inicial)":
        templateContent = "Hola *{cliente}* 👋🏼\n\nTe saludamos desde *{op_donante}*.\nHemos detectado que iniciaste un proceso de cambio de compañía y por eso intentamos ponernos en contacto contigo.\n\n*Queremos informarte que actualmente tienes disponible una mejora en tu tarifa que podría ajustarse mejor a tu consumo, con condiciones más ventajosas que las de tu contrato actual*.\n\nSi deseas revisarlo, por favor responde a este mensaje y uno de nuestros asesores se comunicará contigo dentro del horario de atención de 14:00 a 22:00 hrs.\n\nQuedamos atentos a tu respuesta.\n\n*{supervisor}*\n*{cargo}*";
        break;
      case "2. Despedida y Plan Vuelta a Casa (6 meses)":
        templateContent = "Hola *{cliente}* 👋🏻\n\nVaya, nos sabe mal que hayas decidido marcharte, pero entendemos que a veces apetece probar otros aires.\nEstamos ya tramitando la baja y la recogida del router.\nEso sí, recuerda que en *{op_donante}* siempre tendrás las puertas abiertas por si en algún momento decides volver 😉.\n\n🔸 *Importante: tus números ya han sido transferidos al nuevo operador, por lo que no podrás recuperarlos con nosotros hasta dentro de un minimo de 6 meses*.\n\n*Si quisieras volver antes, tendría que ser con numeraciones nuevas y asumiendo la penalización que aplique el operador al que te has cambiado*.\n\nA partir de ahora, cualquier cosa que necesites, la gestionamos directamente tú y yo, ¿de acuerdo?\nAsí evitamos confusiones si te contacta otro compañero con distintas ofertas.\n\n📲 *Estoy disponible de lunes a viernes, de 15:00 a 22:00 h.*\n*Este número es solo para mensajes; me escribes y te llamo en cuanto pueda.*\n\nUn cordial saludo,\n*{supervisor}*\n*{cargo}*";
        break;
      case "3. Advertencia - Suspensión temporal":
        templateContent = "Estimado *{cliente}*,\nLe informamos que hemos intentado establecer comunicación con usted en reiteradas ocasiones, sin obtener respuesta. ⚠️\nActualmente existe una retención activa sobre sus líneas derivada del proceso de portabilidad iniciado con otra compañía. Es imprescindible contar con su confirmación para determinar el procedimiento correspondiente.\nEn caso de no recibir contacto por su parte en el plazo inmediato, nos veremos obligados a ejecutar una suspensión temporal de los servicios hasta esclarecer la situación y validar los datos pertinentes. 🚨\nLe solicitamos que nos escriba a la mayor brevedad para realizar la llamada de verificación de forma inmediata.\nAtentamente,\n*{op_donante} - {area}*";
        break;
      case "4. Confirmación - Portabilidad Cancelada":
        templateContent = "Hola *{cliente}* 👋🏻\nTe saludamos desde *{op_donante}*.\nConfirmamos que la portabilidad hacia *{comp_nueva}* ha sido cancelada correctamente, por lo que tu línea continuará activa con *{op_donante}*.\n\n*Durante las próximas 24 horas se realizará la actualización de sus nuevos números de contacto, y es posible que el servicio quede temporalmente interrumpido mientras finaliza el proceso, conforme al periodo de revisión establecido por la OCU*.\n\nSi ya realizaste la devolución de los equipos anteriores, confírmalo por este medio, por favor.\nCualquier duda o incidencia, puedes escribirme directamente y te atenderé personalmente.\n\nUn saludo cordial,\n\n*{supervisor}*\n*{cargo}*";
        break;
      case "5. Seguimiento - Mensaje corto":
        templateContent = "Buen día, *{cliente}* 👋🏻\nTe escribo para confirmar si pudiste leer mi mensaje anterior.\nQuedo atento a tu respuesta.\n\n*{supervisor}*\n*{cargo}*";
        break;
      case "6. Incidencia - Bloqueo de operador":
        templateContent = "Hola *{cliente}* 👋🏻\n\nDesde *{op_donante}* nos estamos intentando comunicar contigo respecto a una incidencia detectada en el proceso de retro portabilidad que habías iniciado.\n\n*Actualmente, tenemos un bloqueo pendiente por parte del operador al que intentaste portar, y necesitamos tu confirmación para evitar la suspensión temporal del servicio mientras se revisa la retención de líneas*.\n\n*Por favor, respóndenos este mensaje lo antes posible y te llamamos de inmediato para resolverlo*.\n\n*{supervisor}*\n*{cargo}*";
        break;
      case "7. Aclaración - Error de otro comercial":
        templateContent = "Hola *{cliente}* 👋🏼\n\nMe pongo en contacto contigo porque he visto que un compañero mío inició una solicitud con numeraciones nuevas, y quería confirmar contigo qué ha pasado.\nRecuerda que habíamos acordado que todas las gestiones las haríamos directamente tú y yo, para evitar confusiones y mantener el plan de regreso dentro de 7 meses con el descuento asegurado.\n\nEntiendo que te sigan llamando para ofrecerte alternativas, es normal, pero como te comenté, esas opciones no aplican a tu caso. Por suerte, el comercial se dio cuenta a tiempo y no se completó nada fuera de lo previsto 🙌🏼\n\nSigamos con lo acordado, ¿vale? Quiero asegurarme de que todo te salga perfecto y sin contratiempos.\n\n*{supervisor}*\n*{cargo}*";
        break;
      case "8. Pérdida de números (1 año)":
        templateContent = "Hola, *{cliente}* 👋🏻\n\nDesde *{op_donante}* queremos informarte que, por el cambio que has realizado a *{comp_nueva}*, tus números han pasado a ser propiedad de ese operador.\n\nPor este motivo, no es posible volver a *{op_donante}* hasta dentro de un año.\nSi se intenta antes de ese plazo, los números podrían perderse definitivamente.\n\n*Si tienes consultas, contéstame este mensaje y te atenderá un asesor personalizado*.\n\nAgradecemos el tiempo que has estado con nosotros y esperamos poder atenderte nuevamente más adelante. 💛\n\nEquipo *{op_donante}*";
        break;
      case "9. Plan Vuelta a Casa - Oferta (6 meses)":
        templateContent = "Hola *{cliente}* 👋\nTranquilo, esto no es un adiós, es solo un hasta luego.\n\n*Durante estos 6 meses te daré un pequeño recordatorio para que no olvides el Plan Vuelta a Casa*.\n*Antes de cumplir ese tiempo no podemos recuperarte sin penalización, ya que la otra compañía solo te permitiría un contrato con número nuevo*.\n\nPor eso, te lo dejo ya reservado para cuando llegue el momento:\n\n✅ *{precio}* IVA incl. para siempre\n✅ Con tus mismos números\n✅ *{plan}*\n\nA partir de ahora cuentas directamente conmigo para cualquier cosa. Si alguien más te llama, simplemente indícales que ya tienes todo gestionado conmigo, así evitamos confusiones o que te intenten ofrecer algo distinto.\n\n📅 Estoy disponible de lunes a viernes, de 15:00 a 22:00 h.\n📲 Este número es solo para mensajes: me escribes y te llamo enseguida.\n\nNos volvemos a hablar pronto 😉\n\n*{supervisor}*\n*{cargo}*";
        break;
      case "10. Seguimiento - Proceso en curso (7 meses)":
        templateContent = "Hola *{cliente}* 👋🏻\n\nTe contacto para confirmar que tu proceso de portabilidad con *{comp_nueva}* se está gestionando correctamente.\n\n*Confírmame, por favor, si tienes alguna duda sobre lo que comentamos acerca del Plan Vuelta a Casa.\nRecuerda que estaré en contacto contigo mes a mes durante estos 7 meses para que podamos tramitar tu regreso a {op_donante} en el momento acordado, con el descuento que dejamos reservado para ti*.\n\nQuedo atento a cualquier consulta o incidencia que pueda surgir.\nNo dudes de escribirme por este medio cuando lo necesites.\n\nUn saludo,\n*{supervisor}*\n*{cargo}*";
        break;
      case "11. Notificación Automática Sistema":
        templateContent = "🔔 *{op_donante}* - Notificación Automática\n\nHola *{cliente}* 👋🏻\nEste es un mensaje generado automáticamente por el Sistema de Gestión de Portabilidades de *{op_donante}*.\n\nHemos detectado una portabilidad en proceso asociada a su línea y necesitamos verificar información obligatoria para continuar.\n\n⚠️ *Si no recibimos respuesta, su servicio podría quedar en suspensión temporal hasta completar la validación*.\n\nPor favor, responda a este mensaje y te llamamos enseguida.\n\n🟢 Atención *{op_donante}*";
        break;
      default:
        templateContent = "";
    }

    // Replace placeholders dynamically
    let formattedText = templateContent;
    Object.keys(values).forEach(key => {
      const regex = new RegExp(`\\{${key}\\}`, 'g');
      formattedText = formattedText.replace(regex, values[key]);
    });

    setPreviewText(formattedText);
  }, [selectedTemplate, nombreCliente, operadorDonante, companiaNueva, nombreSupervisor, cargo, area, precio, plan]);

  const handleAttachFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setRutaAdjunto(file.name);
    }
  };

  const handleSend = () => {
    if (!numCliente) {
      alert('Ingresa el número del cliente para enviar el mensaje.');
      return;
    }
    // Resolve target URL dynamically (supports local ports or cloud URLs)
    const targetUrl = (ipServidor.startsWith('http://') || ipServidor.startsWith('https://'))
      ? (ipServidor.endsWith('/') ? `${ipServidor}api/send` : `${ipServidor}/api/send`)
      : `http://${ipServidor}:8000/api/send`;

    fetch(targetUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        number: numCliente,
        message: previewText,
        scheduled: programar,
        attachment: rutaAdjunto
      })
    })
    .then(() => {
      setStatsCount(prev => prev + 1);
      alert('¡Mensaje enviado exitosamente a la cola de WhatsApp!');
    })
    .catch(() => {
      // Mock history insert in localStorage if local API isn't running
      const now = new Date().toLocaleString();
      const currentHistory = JSON.parse(localStorage.getItem('wsp_history') || '[]');
      currentHistory.unshift({
        fecha: now,
        numero: numCliente,
        cliente: nombreCliente || 'Desconocido',
        mensaje: previewText,
        remitente: nombreSupervisor
      });
      localStorage.setItem('wsp_history', JSON.stringify(currentHistory));
      setStatsCount(prev => prev + 1);
      alert('¡Simulación local exitosa! (No se detectó el motor en el puerto 8000. Se guardó en el historial local).');
    });
  };

  return (
    <div className="flex flex-col gap-5 w-full bg-white dark:bg-[#111827] rounded-3xl border border-slate-200/80 dark:border-slate-800 p-6 shadow-sm">
      {/* Top Header */}
      <div className="flex justify-between items-center border-b border-slate-100 dark:border-slate-800 pb-3">
        <div>
          <h3 className="text-lg font-black text-slate-900 dark:text-slate-100 tracking-tight flex items-center gap-1.5">
            <Bot className="h-5 w-5" style={{ color: operatorColor }} />
            ENVIAR MENSAJE CONTRAOFERTA (WSP)
          </h3>
          <p className="text-[10px] text-slate-450 dark:text-slate-500">Módulo local de retención y contraofertas rápidas.</p>
        </div>
        <span className="text-xs font-black text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/20 px-3 py-1 rounded-full uppercase tracking-wider">
          Enviados hoy: {statsCount}
        </span>
      </div>

      {/* Form Fields Section */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 bg-slate-50/50 dark:bg-slate-900/10 p-4 border border-slate-150 dark:border-slate-800 rounded-2xl">
        <div>
          <label className="text-[9px] font-extrabold text-slate-450 block mb-1 uppercase">Número Cliente:</label>
          <input 
            type="text" 
            value={numCliente} 
            onChange={(e) => setNumCliente(e.target.value)}
            placeholder="Ej: 34612345678"
            className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl px-3 py-1.5 text-xs font-bold focus:outline-none"
          />
        </div>

        <div>
          <label className="text-[9px] font-extrabold text-slate-450 block mb-1 uppercase">Nombre Cliente:</label>
          <input 
            type="text" 
            value={nombreCliente} 
            onChange={(e) => setNombreCliente(e.target.value)}
            placeholder="Ej: Juan Pérez"
            className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl px-3 py-1.5 text-xs font-bold focus:outline-none"
          />
        </div>

        <div>
          <label className="text-[9px] font-extrabold text-slate-450 block mb-1 uppercase">Operador Donante:</label>
          <input 
            type="text" 
            value={operadorDonante} 
            onChange={(e) => setOperadorDonante(e.target.value)}
            placeholder="Ej: Vodafone"
            className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl px-3 py-1.5 text-xs font-bold focus:outline-none"
          />
        </div>

        <div>
          <label className="text-[9px] font-extrabold text-slate-450 block mb-1 uppercase">Compañía Nueva:</label>
          <input 
            type="text" 
            value={companiaNueva} 
            onChange={(e) => setCompaniaNueva(e.target.value)}
            placeholder="Ej: Movistar"
            className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl px-3 py-1.5 text-xs font-bold focus:outline-none"
          />
        </div>

        <div>
          <label className="text-[9px] font-extrabold text-slate-450 block mb-1 uppercase">Nombre Supervisor:</label>
          <input 
            type="text" 
            value={nombreSupervisor} 
            onChange={(e) => setNombreSupervisor(e.target.value)}
            placeholder="Ej: Tu Nombre"
            className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl px-3 py-1.5 text-xs font-bold focus:outline-none"
          />
        </div>

        <div>
          <label className="text-[9px] font-extrabold text-slate-450 block mb-1 uppercase">Cargo y Op. Donante:</label>
          <input 
            type="text" 
            value={cargo} 
            onChange={(e) => setCargo(e.target.value)}
            placeholder="Ej: Supervisor de Ventas - Vodafone"
            className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl px-3 py-1.5 text-xs font-bold focus:outline-none"
          />
        </div>

        <div>
          <label className="text-[9px] font-extrabold text-slate-450 block mb-1 uppercase">Área de Envío:</label>
          <input 
            type="text" 
            value={area} 
            onChange={(e) => setArea(e.target.value)}
            placeholder="Ej: Área de Retenciones"
            className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl px-3 py-1.5 text-xs font-bold focus:outline-none"
          />
        </div>

        <div>
          <label className="text-[9px] font-extrabold text-slate-450 block mb-1 uppercase">Precio Ofrecido:</label>
          <input 
            type="text" 
            value={precio} 
            onChange={(e) => setPrecio(e.target.value)}
            placeholder="Ej: 29.90€"
            className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl px-3 py-1.5 text-xs font-bold focus:outline-none"
          />
        </div>

        <div>
          <label className="text-[9px] font-extrabold text-slate-450 block mb-1 uppercase">Plan Ofertado:</label>
          <input 
            type="text" 
            value={plan} 
            onChange={(e) => setPlan(e.target.value)}
            placeholder="Ej: Fibra 600MB + 2 Líneas"
            className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl px-3 py-1.5 text-xs font-bold focus:outline-none"
          />
        </div>
      </div>

      {/* Select Template */}
      <div>
        <label className="text-[9px] font-extrabold text-slate-450 block mb-1.5 uppercase">Seleccionar Plantilla:</label>
        <select
          value={selectedTemplate}
          onChange={(e) => setSelectedTemplate(e.target.value)}
          className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-250 dark:border-slate-800 rounded-xl px-3 py-2 text-xs font-bold focus:outline-none"
        >
          {templatesList.map((tmpl, idx) => (
            <option key={idx} value={tmpl}>{tmpl}</option>
          ))}
        </select>
      </div>

      {/* Preview Box */}
      <div>
        <label className="text-[9px] font-extrabold text-slate-450 block mb-1.5 uppercase">Vista Previa del Mensaje:</label>
        <textarea
          value={previewText}
          readOnly
          rows={7}
          className="w-full bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-850 rounded-2xl px-4 py-3 text-xs text-slate-700 dark:text-slate-350 font-bold font-mono focus:outline-none resize-none leading-relaxed"
        />
      </div>

      {/* Premium options (Attach, Schedule, Server IP, Guard switch) */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 p-4 border border-slate-150 dark:border-slate-800 rounded-2xl bg-slate-50/20 dark:bg-slate-900/5">
        <div className="flex flex-col gap-1 justify-center">
          <label className="text-[9px] font-extrabold text-slate-400 uppercase tracking-wider block">Adjunto:</label>
          <div className="flex items-center gap-2 mt-1">
            <label className="bg-indigo-50 hover:bg-indigo-100 dark:bg-indigo-950/20 border border-indigo-200/30 text-indigo-600 dark:text-indigo-400 text-xs font-black px-3.5 py-1.5 rounded-xl cursor-pointer flex items-center gap-1">
              <Upload className="h-3 w-3" />
              Adjuntar
              <input type="file" onChange={handleAttachFile} className="hidden" />
            </label>
            <span className="text-[10px] text-slate-450 dark:text-slate-500 font-bold truncate max-w-[100px]">
              {rutaAdjunto || 'Ninguno'}
            </span>
          </div>
        </div>

        <div>
          <label className="text-[9px] font-extrabold text-slate-400 uppercase tracking-wider block mb-1.5">Programar (HH:MM):</label>
          <input 
            type="text" 
            value={programar} 
            onChange={(e) => setProgramar(e.target.value)}
            placeholder="Opcional (Ej: 18:30)"
            className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl px-3 py-1.5 text-xs font-bold focus:outline-none"
          />
        </div>

        <div>
          <label className="text-[9px] font-extrabold text-slate-400 uppercase tracking-wider block mb-1.5">IP Servidor:</label>
          <input 
            type="text" 
            value={ipServidor} 
            onChange={(e) => setIpServidor(e.target.value)}
            placeholder="localhost"
            className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl px-3 py-1.5 text-xs font-bold focus:outline-none"
          />
        </div>

        <div className="flex items-center justify-between border-t lg:border-t-0 lg:border-l border-slate-150 dark:border-slate-850 pt-2 lg:pt-0 lg:pl-4 select-none">
          <div>
            <span className="text-[9px] font-extrabold text-slate-400 uppercase tracking-wider block">Modo Guardia:</span>
            <p className="text-[8px] text-slate-400">Escucha con IA en background</p>
          </div>
          <label className="relative inline-flex items-center cursor-pointer">
            <input 
              type="checkbox" 
              checked={modoGuardia} 
              onChange={(e) => setModoGuardia(e.target.checked)}
              className="sr-only peer" 
            />
            <div className="w-8 h-4.5 bg-slate-200 dark:bg-slate-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-3.5 after:w-3.5 after:transition-all peer-checked:bg-purple-600"></div>
          </label>
        </div>
      </div>

      {/* Buttons */}
      <div className="flex flex-col gap-2.5">
        <button
          onClick={handleSend}
          className="w-full bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-black uppercase py-3.5 rounded-xl transition-all shadow-md shadow-emerald-500/10 flex items-center justify-center gap-1.5 cursor-pointer"
        >
          <Send className="h-4 w-4" />
          ENVIAR POR WHATSAPP
        </button>

        <button
          onClick={() => setShowHistory(!showHistory)}
          className="w-full bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-750 text-slate-700 dark:text-slate-200 text-xs font-black uppercase py-2.5 rounded-xl transition-all flex items-center justify-center gap-1.5 cursor-pointer"
        >
          <History className="h-4 w-4" />
          {showHistory ? 'Ocultar Historial de Envíos' : 'VER HISTORIAL DE ENVÍOS'}
        </button>
      </div>

      {/* History Log Display */}
      {showHistory && (
        <div className="border border-slate-150 dark:border-slate-850 rounded-2xl p-4 bg-slate-50/50 dark:bg-slate-900/20 max-h-48 overflow-y-auto mt-2 animate-in fade-in slide-in-from-top-2 duration-200">
          <div className="text-[9px] font-extrabold text-slate-400 border-b border-slate-100 dark:border-slate-800 pb-2 mb-2 grid grid-cols-4 uppercase tracking-wider">
            <span>Fecha</span>
            <span>Número</span>
            <span>Cliente</span>
            <span>Remitente</span>
          </div>
          <div className="space-y-2">
            {JSON.parse(localStorage.getItem('wsp_history') || '[]').length === 0 ? (
              <p className="text-[10px] text-slate-400 font-bold text-center py-2">Ningún registro en el historial local.</p>
            ) : (
              JSON.parse(localStorage.getItem('wsp_history') || '[]').map((log: any, idx: number) => (
                <div key={idx} className="grid grid-cols-4 text-[10px] text-slate-650 dark:text-slate-350 border-b border-slate-50 dark:border-slate-900/50 pb-1">
                  <span>{log.fecha}</span>
                  <span className="font-mono">{log.numero}</span>
                  <span className="font-bold">{log.cliente}</span>
                  <span>{log.remitente}</span>
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
}
