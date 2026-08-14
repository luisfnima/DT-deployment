/* ── Nav ── */
function Nav({ primary, secondary, bg }) {
  const [scrolled, setScrolled] = useState(false);
  const [isDark, setIsDark] = useState(() => {
    return document.documentElement.getAttribute('data-theme') === 'dark';
  });

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', fn);
    return () => window.removeEventListener('scroll', fn);
  }, []);

  const toggleTheme = () => {
    const next = isDark ? 'light' : 'dark';
    document.documentElement.setAttribute('data-theme', next);
    localStorage.setItem('dt_theme', next);
    setIsDark(!isDark);
  };

  const links = [
    { label: 'Inicio', href: '#inicio' },
    { label: 'Sobre Nosotros', href: '#sobre-nosotros' },
    { label: 'Proceso', href: '#como-trabajamos' },
    { label: 'Únete al Equipo', href: '#unete' },
  ];

  return (
    <nav style={{
      position: 'fixed', top: 0, left: 0, right: 0, zIndex: 100,
      background: scrolled ? 'var(--bg-navbar)' : 'transparent',
      backdropFilter: scrolled ? 'blur(16px)' : 'none',
      borderBottom: scrolled ? '1px solid var(--border-color)' : 'none',
      transition: 'all 0.35s ease'
    }}>
      <div style={{
        maxWidth: 1440, margin: '0 auto', width: '100%',
        padding: scrolled ? '10px 40px' : '18px 40px',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between'
      }}>
      {/* Logo */}
      <div style={{ display: 'flex', alignItems: 'center' }}>
        <img src={(window.__resources && window.__resources.logoImg || "images/logoImg_nuevo.png") + "?v=4"} alt="DreamTeam" style={{ height: 52, width: 'auto', objectFit: 'contain', display: 'block' }} />
      </div>

      {/* Links */}
      {/* Nav pill */}
      <div style={{
          display: 'flex', gap: 2, alignItems: 'center',
          background: 'var(--glass-bg)',
          backdropFilter: 'blur(12px)',
          borderRadius: 100,
          padding: '5px 6px',
          border: '1px solid var(--glass-border)',
          boxShadow: '0 2px 12px rgba(0,0,0,0.06)', fontSize: "14px"
        }} data-comment-anchor="296348093c-div-73-7">
        {links.map((l) =>
          <a key={l.label} href={l.href} style={{
            fontFamily: 'DM Sans', fontWeight: 500,
            color: 'var(--text-main)', textDecoration: 'none', opacity: 0.72,
            padding: '5px 15px', borderRadius: 100,
            transition: 'opacity 0.2s, background 0.15s', fontSize: "14px"
          }}
          onMouseEnter={(e) => {e.currentTarget.style.opacity = 1;e.currentTarget.style.background = 'rgba(0,0,0,0.05)';}}
          onMouseLeave={(e) => {e.currentTarget.style.opacity = 0.72;e.currentTarget.style.background = 'transparent';}}>
            {l.label}
          </a>
          )}
      </div>

      {/* CTA & Theme Switch */}
      <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
        {/* React Dynamic theme toggle button */}
        <div onClick={toggleTheme} style={{
          background: 'none', border: '1px solid var(--border-color)',
          width: '38px', height: '38px', borderRadius: '50%',
          cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
          color: 'var(--text-main)', transition: 'all 0.2s ease'
        }} onMouseEnter={(e) => {e.currentTarget.style.background = 'var(--border-color)';}}
           onMouseLeave={(e) => {e.currentTarget.style.background = 'none';}}
           aria-label="Alternar Tema">
          {isDark ? (
            <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ display: 'block' }}>
              <circle cx="12" cy="12" r="5"></circle>
              <line x1="12" y1="1" x2="12" y2="3"></line>
              <line x1="12" y1="21" x2="12" y2="23"></line>
              <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line>
              <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line>
              <line x1="1" y1="12" x2="3" y2="12"></line>
              <line x1="21" y1="12" x2="23" y2="12"></line>
              <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line>
              <line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line>
            </svg>
          ) : (
            <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ display: 'block' }}>
              <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path>
            </svg>
          )}
        </div>

        <button style={{
            background: primary, color: 'white', border: 'none',
            borderRadius: 100, padding: '9px 22px',
            fontWeight: 600, cursor: 'pointer', fontFamily: 'DM Sans',
            transition: 'transform 0.2s, box-shadow 0.2s',
            boxShadow: `0 4px 16px ${primary}55`, fontSize: "14px"
          }}
          onMouseEnter={(e) => {e.target.style.transform = 'scale(1.04)';e.target.style.boxShadow = `0 6px 24px ${primary}77`;}}
          onMouseLeave={(e) => {e.target.style.transform = 'scale(1)';e.target.style.boxShadow = `0 4px 16px ${primary}55`;}} id="colaboradores-btn">Colaboradores
        </button>
      </div>
      </div>
    </nav>);

}

/* ── Scroll Ring ── */
function ScrollRing({ color }) {
  const text = 'SCROLL TO EXPLORE · SCROLL TO EXPLORE · ';
  const r = 38;
  const circumference = 2 * Math.PI * r;
  return (
    <div style={{ position: 'relative', width: 96, height: 96, flexShrink: 0 }}>
      <svg width="96" height="96" viewBox="0 0 96 96" style={{ animation: 'spin-slow 12s linear infinite' }}>
        <defs>
          <path id="circle-path" d={`M 48,48 m -${r},0 a ${r},${r} 0 1,1 ${r * 2},0 a ${r},${r} 0 1,1 -${r * 2},0`} />
        </defs>
        <text fill={color} fontSize="8.5" fontFamily="DM Sans" fontWeight="500" letterSpacing="2.5">
          <textPath href="#circle-path">{text}</textPath>
        </text>
      </svg>
      <div style={{
        position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center'
      }}>
        <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
          <path d="M10 4v12M4 10l6 6 6-6" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </div>
    </div>);

}

/* ── Datos Dinámicos de Testimonios y Beneficios ── */
const DOODLE_DATA = [
  { bubble: "¡Un gran lugar para trabajar!", notes: ["Buen ambiente", "Grandes beneficios", "Crecimiento profesional"] },
  { bubble: "¡Terminé mi carrera mientras trabajaba aquí!", notes: ["Horarios universitarios", "Capacitación constante", "Línea de carrera"] },
  { bubble: "¡Los mejores incentivos y comisiones sin techo!", notes: ["Pagos puntuales", "Soporte 24/7", "Comisiones sin tope"] },
  { bubble: "¡Orgulloso de ser parte del equipo DreamTeam!", notes: ["Excelente clima", "Premios y bonos", "Comunidad unida"] },
  { bubble: "¡Crecimiento real desde el primer mes!", notes: ["Acompañamiento constante", "Metas alcanzables", "Liderazgo positivo"] },
  { bubble: "¡Aquí el trabajo en equipo se vive a diario!", notes: ["Respeto e integración", "Formación continua", "Premios semanales"] },
  { bubble: "¡Logré ascender a supervisor en 6 meses!", notes: ["Línea de carrera rápida", "Capacitación en ventas", "Buen sueldo"] },
  { bubble: "¡Flexibilidad total con mis horarios de estudio!", notes: ["Turnos rotativos", "Ambiente universitario", "Facilidades de estudio"] },
  { bubble: "¡Comisiones altas y capacitación desde el día 1!", notes: ["Bonos por desempeño", "Entrenamiento pagado", "Gran equipo"] },
  { bubble: "¡Me encanta la cultura y la energía de este equipo!", notes: ["Cultura motivacional", "Eventos de integración", "Feedback constante"] },
  { bubble: "¡Puntualidad de pago y excelente ambiente laboral!", notes: ["Pagos exactos", "Reconocimiento constante", "Soporte de gestión"] },
  { bubble: "¡Un ambiente de trabajo súper dinámico y motivador!", notes: ["Desafíos diarios", "Compañerismo", "Recompensas por ventas"] },
  { bubble: "¡Gané mis primeros premios internacionales este año!", notes: ["Incentivos especiales", "Reconocimientos", "Crecimiento personal"] },
  { bubble: "¡Acompañamiento constante de los supervisores!", notes: ["Liderazgo cercano", "Coaching de ventas", "Confianza laboral"] },
  { bubble: "¡La mejor oportunidad para tu primer trabajo formal!", notes: ["Ingreso inmediato", "Planilla y beneficios", "Desarrollo de habilidades"] },
  { bubble: "¡Sentir que tu esfuerzo diario realmente se valora!", notes: ["Meritocracia real", "Ambiente positivo", "Bonos semanales"] },
  { bubble: "¡Orgullosa del equipo comercial que construimos juntos!", notes: ["Compañerismo puro", "Altos estándares", "Excelencia en ventas"] }
];

/* ── Componentes Cómic SVG & Pergamino Decorativos ── */
function HeroNotepad({ slideIndex }) {
  const currentData = DOODLE_DATA[slideIndex % DOODLE_DATA.length];
  return (
    <div className="p5-notepad" style={{
      position: 'absolute', top: 80, right: -120, zIndex: 99,
      width: 190, background: '#ffffff', color: '#000000',
      border: '3.5px solid #000000', borderRadius: '3px',
      padding: '14px 16px', boxShadow: '6px 6px 0 #000000',
      transform: 'rotate(4deg)', pointerEvents: 'none',
      transition: 'opacity 0.4s ease, transform 0.4s ease'
    }}>
      <div style={{
        fontFamily: "'Caveat', 'Comic Sans MS', cursive, sans-serif",
        fontSize: 16, fontWeight: 700, fontStyle: 'italic',
        display: 'flex', flexDirection: 'column', gap: 8
      }}>
        {currentData.notes.map((item, i) => (
          <div key={i} className="p5-notepad-item" style={{
            display: 'flex', alignItems: 'center', gap: 6,
            ...(i === currentData.notes.length - 1 ? { borderBottom: '2.5px solid #e60013', paddingBottom: 4 } : {})
          }}>
            <i style={{ color: '#e60013', fontStyle: 'normal', fontWeight: 800 }}>✓</i> {item}
          </div>
        ))}
      </div>
    </div>
  );
}

function HeroSpeechBubble({ slideIndex }) {
  const currentData = DOODLE_DATA[slideIndex % DOODLE_DATA.length];
  return (
    <div className="p5-speech-bubble" style={{
      position: 'absolute', bottom: 90, left: -145, zIndex: 99,
      minWidth: 195, maxWidth: 250, width: 'max-content',
      padding: '24px 28px',
      transform: 'rotate(-4deg)', textAlign: 'center',
      pointerEvents: 'none', overflow: 'visible',
      display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
      transition: 'opacity 0.4s ease, transform 0.4s ease, width 0.3s ease, height 0.3s ease',
      filter: 'drop-shadow(6px 6px 0 rgba(0,0,0,1))'
    }}>
      {/* Fondo SVG vectorial de Óvalo Cerrado continuo 360° elástico */}
      <svg viewBox="0 0 200 100" preserveAspectRatio="none" style={{
        position: 'absolute', top: 0, left: 0, width: '100%', height: '100%',
        overflow: 'visible', zIndex: 0, pointerEvents: 'none'
      }}>
        <ellipse cx="100" cy="50" rx="98" ry="48" fill="#ffffff" stroke="#000000" strokeWidth="4.5" vectorEffect="non-scaling-stroke" />
      </svg>

      {/* Flechita manuscrita curva apuntando hacia el pecho del comercial con borde blanco protector */}
      <svg className="p5-bubble-arrow" width="50" height="35" viewBox="0 0 50 35" fill="none" style={{
        position: 'absolute', zIndex: 2, pointerEvents: 'none', overflow: 'visible'
      }}>
        {/* Contorno blanco exterior protector */}
        <path d="M 5 5 Q 28 12 42 26" stroke="#ffffff" strokeWidth="8" strokeLinecap="round" fill="none" />
        <path d="M 30 22 L 44 28 L 38 12" stroke="#ffffff" strokeWidth="8" strokeLinecap="round" strokeLinejoin="round" fill="none" />
        {/* Trazo negro principal */}
        <path d="M 5 5 Q 28 12 42 26" stroke="#000000" strokeWidth="4" strokeLinecap="round" fill="none" />
        <path d="M 30 22 L 44 28 L 38 12" stroke="#000000" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" fill="none" />
      </svg>

      {/* Texto manuscrito del testimonio */}
      <span style={{
        position: 'relative', zIndex: 1,
        fontFamily: "'Caveat', 'Comic Sans MS', cursive, sans-serif",
        fontSize: 18, fontWeight: 700, fontStyle: 'italic', color: '#000000',
        lineHeight: 1.2, display: 'block', wordBreak: 'break-word'
      }}>
        {currentData.bubble}
      </span>
      <div style={{
        position: 'relative', zIndex: 1,
        width: '75%', height: '3.5px', background: '#e60013',
        marginTop: 6, borderRadius: '2px', flexShrink: 0
      }} />
    </div>
  );
}

/* ── Hero Image Panel ── */
function HeroImage({ primary, secondary, slideIndex }) {
  const cardW = 410;
  const cardH = 515;

  return (
    <div style={{
      flex: '0 0 auto',
      width: cardW,
      height: cardH,
      position: 'relative',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      flexShrink: 0
    }}>
      {/* Nubes decorativas adicionales de cómic */}
      <HeroNotepad slideIndex={slideIndex} />
      <HeroSpeechBubble slideIndex={slideIndex} />
      {/* Tarjetas traseras de adorno apiladas estrictamente detrás de la foto */}
      <div style={{
        position: 'absolute', top: 15, right: 15,
        width: '100%', height: '100%',
        borderRadius: '0px',
        border: `3px solid ${primary || '#fe0002'}40`,
        background: `${primary || '#fe0002'}10`,
        transform: 'rotate(-4deg)',
        zIndex: 0,
        pointerEvents: 'none'
      }} />
      <div style={{
        position: 'absolute', top: 25, right: 25,
        width: '100%', height: '100%',
        borderRadius: '0px',
        border: `3px solid ${secondary || '#000'}30`,
        background: `${primary || '#fe0002'}08`,
        transform: 'rotate(3deg)',
        zIndex: 0,
        pointerEvents: 'none'
      }} />

      {/* Main card */}
      <div
        style={{
          position: 'relative',
          width: cardW, height: cardH,
          overflow: 'hidden',
          flexShrink: 0,
          cursor: 'pointer',
          borderRadius: '0px',
          zIndex: 2
        }}>
        <img
          src={window.__resources && window.__resources.heroPhoto || "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=640&q=80&fit=crop&crop=faces"}
          alt="Agente de contact center"
          style={{
            width: '100%', height: '100%',
            objectFit: 'cover', objectPosition: 'top center',
            display: 'block',
            borderRadius: '0px'
          }} />
      </div>
    </div>
  );
}

/* ── Marquee Ticker ── */
function Ticker({ secondary }) {
  const baseItems = ['VENTAS TELEFÓNICAS', 'CONTACT CENTER', 'TELECOMUNICACIONES', 'SOPORTE 24/7', 'EQUIPO PROFESIONAL', 'INNOVACIÓN', 'EXCELENCIA', 'ESPAÑA'];
  const items = [...baseItems, ...baseItems, ...baseItems, ...baseItems];

  return (
    <div data-anim="ticker" style={{
      background: secondary, overflow: 'hidden',
      padding: '20px 0', userSelect: 'none',
      transform: 'rotate(-2deg) scaleX(1.04)',
      margin: '0 -20px',
      boxShadow: '0 8px 32px rgba(0,0,0,0.18)'
    }}>
      <div className="marquee-track">
        {items.map((item, i) =>
        <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 20, paddingRight: 20 }}>
            <span style={{
            color: 'white', fontFamily: 'Sora', fontWeight: 700,
            fontSize: 13, letterSpacing: '2.5px', textTransform: 'uppercase',
            whiteSpace: 'nowrap'
          }}>{item}</span>
            <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
              <path d="M9 1 L10.2 7.8 L17 9 L10.2 10.2 L9 17 L7.8 10.2 L1 9 L7.8 7.8 Z"
            fill="#FE0002" opacity="0.8" />
            </svg>
          </div>
        )}
      </div>
    </div>);

}
