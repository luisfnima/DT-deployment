/* ── Nosotros Bento ── */
function Nosotros({ primary, secondary, bg }) {
  return (
    <section id="sobre-nosotros" style={{ background: bg }}>
      <div style={{
        maxWidth: 1280, margin: '0 auto', width: '100%',
        padding: 'clamp(64px, 8vw, 112px) clamp(24px, 4vw, 80px)'
      }}>
      {/* Section label */}
      <div data-anim="nosotros-label" style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 48 }}>
        <div style={{ width: 8, height: 8, borderRadius: '50%', background: primary }} />
        <span style={{
            fontSize: 11, fontWeight: 700, letterSpacing: '3px',
            textTransform: 'uppercase', color: 'var(--text-muted)',
            fontFamily: 'DM Sans'
          }}>Sobre Nosotros</span>
      </div>

      {/* Bento grid */}
      <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(12, 1fr)',
          gridTemplateRows: 'auto',
          gap: 16
        }}>

        {/* Card 1 — Big intro (col 5-12, row 1) */}
        <div style={{
            gridColumn: '5 / 13', gridRow: '1',
            background: 'var(--bg-card)',
            border: '1.5px solid var(--border-color)',
            borderRadius: 28, padding: '48px 52px',
            display: 'flex', flexDirection: 'column', justifyContent: 'space-between',
            minHeight: 280,
            position: 'relative', overflow: 'hidden'
          }}>
          {/* Decorative ring */}
          <svg style={{ position: 'absolute', right: -40, top: -40, opacity: 0.07 }}
            width="280" height="280" viewBox="0 0 280 280">
            <circle cx="140" cy="140" r="120" stroke="currentColor" strokeWidth="1.5" fill="none" />
            <circle cx="140" cy="140" r="90" stroke="currentColor" strokeWidth="1" fill="none" />
            <circle cx="140" cy="140" r="60" stroke="currentColor" strokeWidth="0.8" fill="none" />
          </svg>
          <h2 style={{
              fontFamily: 'Sora', fontWeight: 800,
              fontSize: 'clamp(28px, 3.2vw, 46px)',
              lineHeight: 1.1, letterSpacing: '-1.5px',
              color: 'var(--text-main)', maxWidth: 480
            }}>
            Tu talento merece crecer.<br />
            <span style={{ color: primary }}>Aquí lo impulsamos.</span>
          </h2>
          <p style={{
              fontSize: 16, lineHeight: 1.7, color: 'var(--text-muted)',
              maxWidth: 520, marginTop: 20
            }}>
            Formamos a los mejores asesores comerciales en telecomunicaciones. Te brindamos capacitación constante, comisiones sin techo y una cultura enfocada en tu éxito.
          </p>
        </div>

        {/* Card 2 — Años de experiencia (col 1-4, row 1-3) */}
        <div style={{
            gridColumn: '1 / 5', gridRow: '1 / 3',
            background: `${primary}`,
            borderRadius: 28, padding: '40px 40px',
            display: 'flex', flexDirection: 'column', justifyContent: 'space-between',
            minHeight: 280,
            position: 'relative', overflow: 'hidden'
          }}>
          <svg style={{ position: 'absolute', bottom: -20, right: -20, opacity: 0.12 }}
            width="200" height="200" viewBox="0 0 200 200">
            <path d="M100 10 L120 80 L190 80 L135 125 L155 195 L100 150 L45 195 L65 125 L10 80 L80 80 Z" fill="white" />
          </svg>
          <span style={{
              fontFamily: 'Sora', fontWeight: 800,
              fontSize: 'clamp(56px, 7vw, 96px)',
              lineHeight: 1, letterSpacing: '-3px',
              color: 'white'
            }}>10+</span>
          <div>
            <div style={{ fontFamily: 'Sora', fontWeight: 700, fontSize: 20, color: 'white', marginBottom: 6 }}>
              Años de Experiencia
            </div>
            <div style={{ fontSize: 14, color: 'rgba(255,255,255,0.85)', lineHeight: 1.6 }}>
              Impulsando talentos y construyendo carreras sólidas en ventas para el mercado español
            </div>
          </div>
        </div>

        {/* Card 3 — Misión */}
        <div style={{
            gridColumn: '5 / 8', gridRow: '2',
            borderRadius: 28, padding: '32px 28px',
            minHeight: 240,
            display: 'flex', flexDirection: 'column', justifyContent: 'space-between',
            position: 'relative', overflow: 'hidden',
            background: 'var(--bg-card)',
            border: '1.5px solid var(--border-color)'
          }}>
          {/* Large faded word */}
          <div style={{
              position: 'absolute', bottom: -10, right: -4,
              fontFamily: 'Sora', fontWeight: 900, fontSize: 88,
              color: primary, opacity: 0.06, lineHeight: 1,
              letterSpacing: '-4px', userSelect: 'none',
              pointerEvents: 'none'
            }}>M</div>

          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <span style={{
                fontFamily: 'Sora', fontWeight: 700, fontSize: 11,
                color: primary, letterSpacing: '2.5px', textTransform: 'uppercase'
              }}>Misión</span>
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
              <circle cx="10" cy="10" r="4" fill={primary} opacity="0.9" />
              <circle cx="10" cy="10" r="7.5" stroke={primary} strokeWidth="1.2" opacity="0.4" />
              <circle cx="10" cy="10" r="9.5" stroke={primary} strokeWidth="0.8" opacity="0.2" />
            </svg>
          </div>

          <div>
            <p style={{
                fontFamily: 'Sora', fontWeight: 800,
                fontSize: 'clamp(17px, 1.8vw, 22px)',
                color: 'var(--text-main)', lineHeight: 1.2,
                letterSpacing: '-0.5px', marginBottom: 10
              }}>
              Impulsar tu<br />potencial<br />comercial.
            </p>
            <p style={{ fontSize: 12.5, color: 'var(--text-muted)', lineHeight: 1.5 }}>
              Capacitación cercana, acompañamiento diario y herramientas para que superes tus metas económicas.
            </p>
          </div>
        </div>

        {/* Card 4 — Visión */}
        <div style={{
            gridColumn: '8 / 11', gridRow: '2',
            borderRadius: 28, padding: '32px 28px',
            minHeight: 240,
            display: 'flex', flexDirection: 'column', justifyContent: 'space-between',
            position: 'relative', overflow: 'hidden',
            background: `${primary}`
          }}>
          {/* Concentric arcs */}
          <svg style={{ position: 'absolute', bottom: -30, right: -30, opacity: 0.12 }}
            width="200" height="200" viewBox="0 0 200 200">
            <circle cx="200" cy="200" r="80" stroke="white" strokeWidth="1" fill="none" />
            <circle cx="200" cy="200" r="120" stroke="white" strokeWidth="1" fill="none" />
            <circle cx="200" cy="200" r="160" stroke="white" strokeWidth="1" fill="none" />
          </svg>

          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <span style={{
                fontFamily: 'Sora', fontWeight: 700, fontSize: 11,
                color: 'rgba(255,255,255,0.75)', letterSpacing: '2.5px', textTransform: 'uppercase'
              }}>Visión</span>
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
              <path d="M1 10s3.5-7 9-7 9 7 9 7-3.5 7-9 7-9-7-9-7z" stroke="white" strokeWidth="1.5" fill="none" opacity="0.7" />
              <circle cx="10" cy="10" r="3" fill="white" />
            </svg>
          </div>

          <div>
            <p style={{
                fontFamily: 'Sora', fontWeight: 800,
                fontSize: 'clamp(17px, 1.8vw, 22px)',
                color: 'white', lineHeight: 1.2,
                letterSpacing: '-0.5px', marginBottom: 10
              }}>
              Crecimiento<br />profesional<br />garantizado.
            </p>
            <p style={{ fontSize: 12.5, color: 'rgba(255,255,255,0.85)', lineHeight: 1.5 }}>
              Línea de carrera real: nuestros supervisores y coordinadores se formaron desde la sala de ventas.
            </p>
          </div>
        </div>

        {/* Card 5 — Beneficio / Pagos Puntuales */}
        <div style={{
            gridColumn: '11 / 13', gridRow: '2',
            borderRadius: 28, padding: '32px 24px',
            minHeight: 240,
            display: 'flex', flexDirection: 'column', justifyContent: 'space-between',
            position: 'relative', overflow: 'hidden',
            background: 'var(--bg-card)',
            border: '1.5px solid var(--border-color)'
          }}>
          {/* Animated pulse ring */}
          <svg style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%,-50%)', opacity: 0.07 }}
            width="280" height="280" viewBox="0 0 280 280">
            <circle cx="140" cy="140" r="60" stroke="currentColor" strokeWidth="1" fill="none" />
            <circle cx="140" cy="140" r="90" stroke="currentColor" strokeWidth="0.8" fill="none" />
            <circle cx="140" cy="140" r="120" stroke="currentColor" strokeWidth="0.6" fill="none" />
          </svg>

          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <span style={{
                fontFamily: 'Sora', fontWeight: 700, fontSize: 10.5,
                color: 'var(--text-muted)', letterSpacing: '2px', textTransform: 'uppercase'
              }}>Beneficio</span>
            <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
              <div style={{ width: 6, height: 6, borderRadius: '50%', background: '#22c55e',
                  boxShadow: '0 0 0 3px rgba(34,197,94,0.25)' }} />
              <span style={{ fontSize: 10.5, color: '#22c55e', fontWeight: 700 }}>Activo</span>
            </div>
          </div>

          <div>
            <div style={{
                fontFamily: 'Sora', fontWeight: 900,
                fontSize: 'clamp(36px, 4vw, 52px)',
                color: 'var(--text-main)', lineHeight: 1,
                letterSpacing: '-2px', marginBottom: 8
              }}>
              100<span style={{ color: primary, opacity: 0.9 }}>%</span>
            </div>
            <p style={{
                fontFamily: 'Sora', fontWeight: 700, fontSize: 14.5,
                color: 'var(--text-main)', marginBottom: 4
              }}>Pagos Puntuales.</p>
            <p style={{ fontSize: 11.5, color: 'var(--text-muted)', lineHeight: 1.5 }}>
              Sueldo fijo + comisiones transparentes pagadas a tiempo.
            </p>
          </div>
        </div>

        {/* Card 6 — Valores redesigned */}
        <div style={{
            gridColumn: '1 / 13', gridRow: '3',
            background: 'var(--bg-card)',
            border: '1.5px solid var(--border-color)',
            borderRadius: 28,
            overflow: 'hidden',
            position: 'relative',
            minHeight: 260
          }}>
          {/* Subtle grid texture */}
          <svg style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', opacity: 0.04 }}
            preserveAspectRatio="xMidYMid slice" viewBox="0 0 1200 260">
            {Array.from({ length: 20 }).map((_, i) =>
              <line key={'h' + i} x1="0" y1={i * 14} x2="1200" y2={i * 14} stroke="currentColor" strokeWidth="0.5" />
              )}
            {Array.from({ length: 86 }).map((_, i) =>
              <line key={'v' + i} x1={i * 14} y1="0" x2={i * 14} y2="260" stroke="currentColor" strokeWidth="0.5" />
              )}
          </svg>

          <div style={{
              position: 'relative',
              display: 'grid',
              gridTemplateColumns: 'repeat(4, 1fr)',
              height: '100%'
            }}>
            {[
              {
                num: '01', title: 'Compañerismo',
                quote: 'Juntos más lejos.',
                desc: 'Un ambiente de trabajo unido donde celebramos tus logros y nos apoyamos en cada llamada.',
                svg: <svg width="24" height="24" viewBox="0 0 24 24" fill="none"><circle cx="8" cy="7" r="3.5" stroke="currentColor" strokeWidth="1.5" opacity="0.7" /><circle cx="16" cy="7" r="3.5" stroke="currentColor" strokeWidth="1.5" opacity="0.7" /><path d="M1 21c0-3.87 3.13-7 7-7h8c3.87 0 7 3.13 7 7" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" opacity="0.7" /></svg>
              },
              {
                num: '02', title: 'Transparencia',
                quote: 'Comisiones transparentes.',
                desc: 'Reglas de juego claras, bonos alcanzables y pagos sin sorpresas ni retrasos.',
                svg: <svg width="24" height="24" viewBox="0 0 24 24" fill="none"><path d="M12 2L4 6v6c0 5.25 3.5 10.15 8 11.5C16.5 22.15 20 17.25 20 12V6L12 2z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" opacity="0.7" /><path d="M8.5 12l2.5 2.5 5-5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /></svg>
              },
              {
                num: '03', title: 'Crecimiento',
                quote: 'Línea de carrera real.',
                desc: 'Premia tu esfuerzo continuo con ascensos a supervisión, monitoreo, calidad y formación.',
                svg: <svg width="24" height="24" viewBox="0 0 24 24" fill="none"><path d="M12 2a7 7 0 017 7c0 3-1.8 5.4-4 6.5V17H9v-1.5C6.8 14.4 5 12 5 9a7 7 0 017-7z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" opacity="0.7" /><path d="M9 20h6M10 22h4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" /></svg>
              },
              {
                num: '04', title: 'Capacitación',
                quote: 'Formación continua.',
                desc: 'Te capacitamos en técnicas de negociación y ventas telefónicas para potenciar tu perfil profesional.',
                svg: <svg width="24" height="24" viewBox="0 0 24 24" fill="none"><path d="M12 2l3 7h7l-5.5 4.5 2 7L12 17l-6.5 3.5 2-7L2 9h7L12 2z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" opacity="0.7" /></svg>
              }].map((v, i) =>
              <div key={i} style={{
                padding: '40px 36px',
                borderLeft: i > 0 ? '1px solid var(--border-color)' : 'none',
                display: 'flex', flexDirection: 'column', gap: 16,
                transition: 'background 0.25s',
                cursor: 'default'
              }}
              onMouseEnter={(e) => e.currentTarget.style.background = 'var(--bg-card-hover)'}
              onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}>
              
                {/* Número gigante tenue de fondo */}
                <div className="p5-watermark-num" style={{
                  position: 'absolute', bottom: -10, right: 10,
                  fontFamily: 'Anton, Sora, sans-serif', fontWeight: 900,
                  fontSize: 110, color: 'var(--text-main)',
                  opacity: 0.04, lineHeight: 1, userSelect: 'none',
                  pointerEvents: 'none'
                }}>{v.num}</div>

                {/* Number + icon row */}
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', position: 'relative', zIndex: 2 }}>
                  <span style={{
                    fontFamily: 'Sora', fontWeight: 800, fontSize: 13,
                    color: primary, letterSpacing: '1px'
                  }}>{v.num}</span>
                  <div style={{ color: 'var(--text-main)' }}>{v.svg}</div>
                </div>

                {/* Big quote */}
                <div style={{
                  fontFamily: 'Sora', fontWeight: 800,
                  fontSize: 'clamp(18px, 1.8vw, 22px)',
                  color: 'var(--text-main)', lineHeight: 1.2,
                  letterSpacing: '-0.5px'
                }}>{v.quote}</div>

                {/* Divider */}
                <div style={{ width: 28, height: 2, background: primary, borderRadius: 2 }} />

                {/* Title + desc */}
                <div>
                  <div style={{ fontFamily: 'Sora', fontWeight: 600, fontSize: 13, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '1.5px', marginBottom: 8 }}>{v.title}</div>
                  <p style={{ fontSize: 13, color: 'var(--text-muted)', lineHeight: 1.7 }}>{v.desc}</p>
                </div>
              </div>
              )}
          </div>
        </div>

      </div>
      </div>
    </section>);

}

/* ── Cómo Trabajamos ── */
function ComoTrabajamos({ primary, secondary, bg }) {
  const steps = [
  {
    num: '01',
    title: 'Postulación',
    sub: 'Postula en minutos.',
    desc: 'Completa tus datos en nuestro formulario o envíanos tu CV por WhatsApp. Evaluamos tu perfil rápidamente.',
    accent: primary
  },
  {
    num: '02',
    title: 'Entrevista',
    sub: 'Conociendo tu potencial.',
    desc: 'Participa en una entrevista cercana con nuestro equipo de selección donde evaluamos tus ganas de crecer.',
    accent: secondary
  },
  {
    num: '03',
    title: 'Formación',
    sub: 'Capacitación de alto nivel.',
    desc: 'Te preparamos en productos de telecomunicaciones y técnicas de persuasión comercial antes de salir a gestión.',
    accent: primary
  },
  {
    num: '04',
    title: 'Despegue',
    sub: 'Comisiones sin techo.',
    desc: 'Comienza tu gestión con el respaldo de tu supervisor, alcanza tus metas e incrementa tus ingresos día a día.',
    accent: secondary
  }];

  return (
    <section style={{
      background: 'var(--bg-card)',
      borderTop: '1px solid var(--border-color)',
      borderBottom: '1px solid var(--border-color)',
      position: 'relative',
      overflow: 'hidden'
    }}>
      <div style={{
        maxWidth: 1600, margin: '0 auto', width: '100%',
        padding: 'clamp(64px, 8vw, 112px) clamp(24px, 4vw, 80px)',
        position: 'relative'
      }}>
      {/* Background texture */}
      <svg style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', opacity: 0.04, pointerEvents: 'none' }}
        preserveAspectRatio="xMidYMid slice" viewBox="0 0 1440 700">
        {Array.from({ length: 14 }).map((_, i) =>
          <line key={'h' + i} x1="0" y1={i * 52} x2="1440" y2={i * 52} stroke="currentColor" strokeWidth="0.5" />
          )}
        {Array.from({ length: 30 }).map((_, i) =>
          <line key={'v' + i} x1={i * 52} y1="0" x2={i * 52} y2="700" stroke="currentColor" strokeWidth="0.5" />
          )}
      </svg>

      {/* Header row */}
      <div style={{
          display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between',
          marginBottom: 72, flexWrap: 'wrap', gap: 24
        }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 20 }}>
            <div style={{ width: 8, height: 8, borderRadius: '50%', background: primary }} />
            <span style={{ fontSize: 11, fontWeight: 700, letterSpacing: '3px', textTransform: 'uppercase', color: 'var(--text-muted)', fontFamily: 'DM Sans' }}>
              Proceso
            </span>
          </div>
          <h2 style={{
              fontFamily: 'Sora', fontWeight: 800,
              fontSize: 'clamp(36px, 4.5vw, 56px)',
              lineHeight: 1.0, letterSpacing: '-2px',
              color: 'var(--text-main)'
            }}>
            Cómo<br />
            <span style={{ color: primary }}>trabajamos.</span>
          </h2>
        </div>
        <p style={{
            fontSize: 15, lineHeight: 1.7,
            color: 'var(--text-muted)',
            maxWidth: 340, fontFamily: 'DM Sans'
          }}>
          Un proceso diseñado para minimizar fricciones y maximizar resultados desde el primer día.
        </p>
      </div>

      {/* Steps */}
      <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(4, 1fr)',
          gap: 16,
          borderRadius: 28
        }}>
        {steps.map((s, i) =>
          <div key={i}
          style={{
            background: 'var(--bg-color)',
            border: '1px solid var(--border-color)',
            borderRadius: 24,
            padding: '48px 36px 40px',
            position: 'relative',
            overflow: 'hidden',
            transition: 'all 0.3s ease',
            boxShadow: 'var(--shadow-main)',
            cursor: 'default'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = 'translateY(-4px)';
            e.currentTarget.style.borderColor = primary;
            e.currentTarget.style.boxShadow = 'var(--shadow-hover)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'translateY(0)';
            e.currentTarget.style.borderColor = 'var(--border-color)';
            e.currentTarget.style.boxShadow = 'var(--shadow-main)';
          }}>
          
            {/* Giant number bg */}
            <div style={{
              position: 'absolute', top: -15, right: 0,
              fontFamily: 'Anton, Sora, sans-serif', fontWeight: 900,
              fontSize: 135, lineHeight: 1,
              color: 'var(--text-main)', opacity: 0.22,
              letterSpacing: '-4px', userSelect: 'none',
              pointerEvents: 'none'
            }}>{s.num}</div>

            {/* Step indicator */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 36 }}>
              <div style={{
                width: 36, height: 36, borderRadius: 12,
                background: primary,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                flexShrink: 0
              }}>
                <span style={{ fontFamily: 'Sora', fontWeight: 800, fontSize: 13, color: 'white' }}>{s.num}</span>
              </div>
              {/* Connector line */}
              {i < 3 &&
              <div style={{
                flex: 1, height: 1,
                background: `linear-gradient(to right, ${primary}60, transparent)`
              }} />
              }
            </div>

            {/* Content */}
            <div style={{ fontFamily: 'Sora', fontWeight: 700, fontSize: 22, color: 'var(--text-main)', marginBottom: 8, letterSpacing: '-0.5px' }}>
              {s.title}
            </div>
            <div style={{ fontFamily: 'Sora', fontWeight: 600, fontSize: 13, color: primary, marginBottom: 16, letterSpacing: '-0.2px' }}>
              {s.sub}
            </div>
            <p style={{ fontSize: 14, color: 'var(--text-muted)', lineHeight: 1.7 }}>
              {s.desc}
            </p>
          </div>
          )}
      </div>


      </div>
        </section>);

}

/* ── CTA Join ── */
function CTAJoin({ primary, secondary }) {
  const [formData, setFormData] = useState({ name: '', email: '', phone: '', cv: null });
  const [submitted, setSubmitted] = useState(false);
  const [fileName, setFileName] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);

    const data = new FormData();
    data.append('name', formData.name);
    data.append('email', formData.email);
    data.append('phone', formData.phone);
    if (formData.cv) {
      data.append('cv', formData.cv);
    }

    fetch('https://formspree.io/f/wrosario@dreamteam.pe', {
      method: 'POST',
      body: data,
      headers: {
        'Accept': 'application/json'
      }
    }).catch((err) => {
      console.error('Error submitting form:', err);
    });
  };

  const photoSrc = window.__resources && window.__resources.ctaBg || "images/ctaBg.jpg";

  return (
    <section id="unete" style={{ background: '#0a0a0a', position: 'relative', overflow: 'hidden' }}>
      <div className="up5-grid" style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))',
        minHeight: '580px',
        position: 'relative'
      }}>
        {/* Left Side: Photo with duotone and clip path */}
        <div className="up5-photo p5-rv-l" style={{
          position: 'relative',
          overflow: 'hidden',
          minHeight: '400px',
          width: '100%',
          height: '100%'
        }}>
          <img
            src={photoSrc}
            alt="Equipo DreamTeam trabajando"
            style={{
              position: 'absolute',
              top: 0, left: 0,
              width: '100%', height: '100%',
              objectFit: 'cover',
              objectPosition: 'center',
              filter: 'grayscale(1) contrast(1.2) brightness(0.85)'
            }}
          />
          <div style={{
            position: 'absolute', inset: 0,
            background: 'linear-gradient(120deg, rgba(230,0,19,0.55), rgba(10,10,10,0.2) 60%)',
            mixBlendMode: 'multiply', pointerEvents: 'none'
          }} />
          <div className="up5-half" style={{
            position: 'absolute', inset: 0, zIndex: 2, pointerEvents: 'none',
            backgroundImage: 'radial-gradient(circle, rgba(255,255,255,0.9) 1px, transparent 1.5px)',
            backgroundSize: '8px 8px', opacity: 0.14
          }} />
          <div className="up5-clip" style={{
            position: 'absolute', inset: 0, zIndex: 3, pointerEvents: 'none',
            background: '#0a0a0a',
            clipPath: 'polygon(78% 0, 100% 0, 100% 100%, 92% 100%)'
          }} />
        </div>

        {/* Right Side: Copy and Form */}
        <div className="up5-copy" style={{
          padding: 'clamp(36px, 4vw, 56px) clamp(20px, 3.5vw, 48px)',
          position: 'relative',
          display: 'flex', flexDirection: 'column', justifyContent: 'center',
          alignItems: 'flex-start',
          background: '#0a0a0a',
          zIndex: 4
        }}>
          <div className="p5-star-deco" style={{ width: 44, height: 44, top: 24, right: 32, background: 'var(--p5-red)', opacity: 0.9 }} />
          
          <div className="up5-eyebrow p5-rv">
            <span><span className="tri"></span>Únete al Equipo</span>
          </div>

          <h2 className="up5-title p5-rv" style={{
            fontFamily: "'Anton', 'Impact', sans-serif",
            fontSize: 'clamp(28px, 3.5vw, 48px)',
            fontStyle: 'italic',
            lineHeight: 0.95,
            letterSpacing: '1px',
            textTransform: 'uppercase',
            color: 'var(--p5-paper)',
            margin: '16px 0 12px'
          }}>
            ¿Quieres trabajar <span className="red" style={{ color: 'var(--p5-red)' }}>con nosotros?</span>
          </h2>

          <p className="p5-rv" style={{
            fontSize: 14, lineHeight: 1.6,
            color: 'var(--p5-text-muted)',
            marginBottom: 20,
            maxWidth: 480
          }}>
            Déjanos tus datos y adjunta tu currículum. Evaluaremos tu perfil para nuestras vacantes comerciales en televentas.
          </p>

          {/* Form Container */}
          <div style={{ width: '100%', maxWidth: '440px' }}>
            {submitted ? (
              <div style={{
                background: 'rgba(255,255,255,0.06)',
                backdropFilter: 'blur(16px)',
                border: '1px solid rgba(255,255,255,0.1)',
                borderRadius: 0,
                padding: '40px 32px',
                textAlign: 'center',
                boxShadow: '0 8px 32px rgba(0,0,0,0.2)'
              }}>
                <div style={{
                  width: 56, height: 56, borderRadius: '50%',
                  background: '#22c55e20', border: '1px solid #22c55e40',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  margin: '0 auto 20px', color: '#22c55e'
                }}>
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <polyline points="20 6 9 17 4 12"></polyline>
                  </svg>
                </div>
                <h3 style={{ fontFamily: 'Sora', fontWeight: 700, fontSize: 22, color: 'var(--p5-paper)', marginBottom: 8 }}>
                  ¡Candidatura Recibida!
                </h3>
                <p style={{ fontSize: 14, color: 'var(--p5-text-muted)' }}>
                  Gracias por postularte. Nuestro departamento de Selección de Personal revisará tu perfil y se ponerá en contacto contigo.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} style={{
                background: 'rgba(230,0,19,0.03)',
                backdropFilter: 'blur(16px)',
                border: '2px solid var(--p5-red)',
                borderRadius: 0,
                padding: '20px',
                display: 'flex', flexDirection: 'column', gap: 12,
                boxShadow: '6px 6px 0 #000'
              }}>
                <input
                  type="text"
                  placeholder="Nombre Completo"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  style={{
                    background: 'rgba(255,255,255,0.1)',
                    border: '1px solid var(--border-color)',
                    borderRadius: 0, padding: '8px 12px',
                    color: 'var(--p5-paper)', fontSize: 13, fontFamily: 'DM Sans',
                    outline: 'none'
                  }}
                />

                <input
                  type="email"
                  placeholder="Email"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  style={{
                    background: 'rgba(255,255,255,0.1)',
                    border: '1px solid var(--border-color)',
                    borderRadius: 0, padding: '8px 12px',
                    color: 'var(--p5-paper)', fontSize: 13, fontFamily: 'DM Sans',
                    outline: 'none'
                  }}
                />

                <input
                  type="tel"
                  placeholder="Teléfono"
                  required
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  style={{
                    background: 'rgba(255,255,255,0.1)',
                    border: '1px solid var(--border-color)',
                    borderRadius: 0, padding: '8px 12px',
                    color: 'var(--p5-paper)', fontSize: 13, fontFamily: 'DM Sans',
                    outline: 'none'
                  }}
                />

                {/* File upload */}
                <div style={{ position: 'relative' }}>
                  <input
                    type="file"
                    id="cv-upload-new"
                    accept=".pdf,.doc,.docx"
                    required
                    onChange={(e) => {
                      const file = e.target.files[0];
                      setFormData({ ...formData, cv: file });
                      setFileName(file ? file.name : '');
                    }}
                    style={{
                      position: 'absolute', inset: 0, opacity: 0, cursor: 'pointer', zIndex: 2
                    }}
                  />
                  <div style={{
                    background: 'rgba(255,255,255,0.05)',
                    border: '1px dashed var(--p5-red)',
                    borderRadius: 0, padding: '10px',
                    textAlign: 'center', display: 'flex', alignItems: 'center', justifyContent: 'center',
                    gap: 8, color: 'var(--p5-text-muted)', fontSize: 12
                  }}>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                      <polyline points="17 8 12 3 7 8"></polyline>
                      <line x1="12" y1="3" x2="12" y2="15"></line>
                    </svg>
                    {fileName ? `Archivo: ${fileName}` : 'Seleccionar archivo CV (PDF, Word)'}
                  </div>
                </div>

                <button type="submit" style={{
                  background: 'var(--p5-red)', color: 'white', border: 'none',
                  borderRadius: 0, padding: '10px',
                  fontWeight: 700, cursor: 'pointer', fontFamily: 'Oswald',
                  textTransform: 'uppercase', letterSpacing: '1.5px',
                  transition: 'transform 0.12s, box-shadow 0.12s',
                  boxShadow: '4px 4px 0 #000',
                  fontSize: 13, marginTop: 2
                }}
                onMouseEnter={(e) => {e.target.style.transform = 'translate(-2px,-2px)'; e.target.style.boxShadow = '6px 6px 0 #000';}}
                onMouseLeave={(e) => {e.target.style.transform = 'none'; e.target.style.boxShadow = '4px 4px 0 #000';}}>
                  Enviar Candidatura
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}

/* ── Footer ── */
function Footer({ primary, secondary }) {
  const navLinks = [
  { label: 'Inicio', href: '#inicio' },
  { label: 'Sobre Nosotros', href: '#sobre-nosotros' },
  { label: 'Proceso', href: '#como-trabajamos' },
  { label: 'Actividades', href: '#actividades' },
  { label: 'Únete al Equipo', href: '#unete' },
  { label: 'Colaboradores', href: '#colaboradores' }];

  const socials = [
  {
    name: 'WhatsApp', href: 'https://api.whatsapp.com/send?phone=51920133394&text=Hola%20DreamTeam',
    svg: <svg width="18" height="18" viewBox="0 0 24 24" fill="none"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z" fill="currentColor" /><path d="M12 0C5.373 0 0 5.373 0 12c0 2.127.558 4.126 1.533 5.862L.054 23.25a.75.75 0 00.916.938l5.535-1.453A11.953 11.953 0 0012 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 21.75a9.713 9.713 0 01-4.964-1.363l-.356-.213-3.686.968.984-3.595-.232-.37A9.712 9.712 0 012.25 12C2.25 6.615 6.615 2.25 12 2.25S21.75 6.615 21.75 12 17.385 21.75 12 21.75z" fill="currentColor" /></svg>
  },
  {
    name: 'TikTok', href: 'https://www.tiktok.com/@postuladreamteam',
    svg: <svg width="18" height="18" viewBox="0 0 24 24" fill="none"><path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-2.88 2.5 2.89 2.89 0 01-2.89-2.89 2.89 2.89 0 012.89-2.89c.28 0 .54.04.79.1V9.01a6.33 6.33 0 00-.79-.05 6.34 6.34 0 00-6.34 6.34 6.34 6.34 0 006.34 6.34 6.34 6.34 0 006.33-6.34V8.69a8.18 8.18 0 004.78 1.52V6.77a4.85 4.85 0 01-1.01-.08z" fill="currentColor" /></svg>
  },
  {
    name: 'Instagram', href: 'https://www.instagram.com/dreamteam.peru/',
    svg: <svg width="18" height="18" viewBox="0 0 24 24" fill="none"><rect x="2" y="2" width="20" height="20" rx="5" stroke="currentColor" strokeWidth="1.8" /><circle cx="12" cy="12" r="5" stroke="currentColor" strokeWidth="1.8" /><circle cx="17.5" cy="6.5" r="1.2" fill="currentColor" /></svg>
  },
  {
    name: 'Facebook', href: 'https://www.facebook.com/DreamTeamContactCenter/',
    svg: <svg width="18" height="18" viewBox="0 0 24 24" fill="none"><path d="M18 2h-3a5 5 0 00-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 011-1h3z" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" /></svg>
  }];


  return (
    <footer style={{
      background: '#0f0f0f',
      position: 'relative', overflow: 'hidden'
    }}>
      <div style={{ maxWidth: 1600, margin: '0 auto', width: '100%', padding: 'clamp(48px, 6vw, 80px) clamp(24px, 4vw, 80px) 0' }}>
      {/* Top accent */}
      <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 3, background: `linear-gradient(to right, ${primary}, transparent)` }} />

      {/* Main grid */}
      <div style={{
          maxWidth: 1600, margin: '0 auto', width: '100%'
        }}>
      <div style={{
            display: 'grid',
            gridTemplateColumns: '1.4fr 1fr 1fr',
            gap: 64,
            marginBottom: 64
          }}>

        {/* Brand column */}
        <div data-anim="footer-col">
          {/* Logo */}
          <div style={{ marginBottom: 24 }}>
            <img src={window.__resources && window.__resources.logoImg || "images/logoImg_nuevo.png"} alt="DreamTeam" style={{ height: 56, width: 'auto', objectFit: 'contain', display: 'block', filter: 'brightness(0) invert(1)' }} />
          </div>

          <p style={{
                fontSize: 14, lineHeight: 1.8,
                color: 'rgba(255,255,255,0.4)',
                fontFamily: 'DM Sans', maxWidth: 280, marginBottom: 32
              }}>
            Innovación y excelencia en telecomunicaciones. El aliado estratégico que convierte llamadas en resultados.
          </p>

          {/* Socials */}
          <div style={{ display: 'flex', gap: 10 }}>
            {socials.map((s) =>
                <a key={s.name} href={s.href} target="_blank" rel="noopener"
                title={s.name}
                style={{
                  width: 38, height: 38, borderRadius: 10,
                  background: 'rgba(255,255,255,0.06)',
                  border: '1px solid rgba(255,255,255,0.08)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  color: 'rgba(255,255,255,0.5)', textDecoration: 'none',
                  transition: 'background 0.2s, color 0.2s, border-color 0.2s'
                }}
                onMouseEnter={(e) => {e.currentTarget.style.background = `${primary}22`;e.currentTarget.style.color = primary;e.currentTarget.style.borderColor = `${primary}44`;}}
                onMouseLeave={(e) => {e.currentTarget.style.background = 'rgba(255,255,255,0.06)';e.currentTarget.style.color = 'rgba(255,255,255,0.5)';e.currentTarget.style.borderColor = 'rgba(255,255,255,0.08)';}}>
                  {s.svg}</a>
                )}
          </div>
        </div>

        {/* Nav column */}
        <div data-anim="footer-col">
          <div style={{ fontFamily: 'Sora', fontWeight: 700, fontSize: 12, color: 'rgba(255,255,255,0.35)', letterSpacing: '2px', textTransform: 'uppercase', marginBottom: 24 }}>
            Navegación
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {navLinks.map((l) =>
                <a key={l.label} href={l.href}
                style={{
                  fontFamily: 'DM Sans', fontSize: 14, fontWeight: 500,
                  color: 'rgba(255,255,255,0.45)', textDecoration: 'none',
                  transition: 'color 0.2s'
                }}
                onMouseEnter={(e) => e.currentTarget.style.color = 'white'}
                onMouseLeave={(e) => e.currentTarget.style.color = 'rgba(255,255,255,0.45)'}>
                  {l.label}</a>
                )}
          </div>
        </div>

        {/* Contact column */}
        <div data-anim="footer-col">
          <div style={{ fontFamily: 'Sora', fontWeight: 700, fontSize: 12, color: 'rgba(255,255,255,0.35)', letterSpacing: '2px', textTransform: 'uppercase', marginBottom: 24 }}>
            Contacto
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
            <a href="https://api.whatsapp.com/send?phone=51920133394&text=Hola%20DreamTeam" target="_blank" rel="noopener"
                style={{
                  display: 'inline-flex', alignItems: 'center', gap: 10,
                  background: primary, color: 'white',
                  borderRadius: 100, padding: '11px 22px',
                  fontSize: 13, fontWeight: 600, fontFamily: 'DM Sans',
                  textDecoration: 'none', width: 'fit-content',
                  boxShadow: `0 4px 18px ${primary}44`,
                  transition: 'transform 0.2s'
                }}
                onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.04)'}
                onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}>
                  
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z" fill="white" /><path d="M12 0C5.373 0 0 5.373 0 12c0 2.127.558 4.126 1.533 5.862L.054 23.25a.75.75 0 00.916.938l5.535-1.453A11.953 11.953 0 0012 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 21.75a9.713 9.713 0 01-4.964-1.363l-.356-.213-3.686.968.984-3.595-.232-.37A9.712 9.712 0 012.25 12C2.25 6.615 6.615 2.25 12 2.25S21.75 6.615 21.75 12 17.385 21.75 12 21.75z" fill="white" />
              </svg>
              Escríbenos
            </a>

            <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.3)', lineHeight: 1.7, fontFamily: 'DM Sans' }}>
              Perú · España<br />
              Innovación y Excelencia<br />
              en Telecomunicaciones
            </div>
          </div>
        </div>
      </div>

      </div>
      {/* Bottom bar */}
      <div style={{
          borderTop: '1px solid rgba(255,255,255,0.06)',
          maxWidth: 1440, margin: '0 auto', width: '100%',
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          padding: '24px 32px 28px',
          flexWrap: 'wrap', gap: 12
        }}>
        <span style={{ fontSize: 12, color: 'rgba(255,255,255,0.25)', fontFamily: 'DM Sans' }}>
          © 2026 DreamTeam. Todos los derechos reservados.
        </span>
        <span style={{ fontSize: 12, color: 'rgba(255,255,255,0.2)', fontFamily: 'DM Sans' }}>
          Innovación y Excelencia en Telecomunicaciones
        </span>
      </div>
      </div>
    </footer>);

}

/* ── Brands Carousel ── */
function BrandsCarousel({ secondary }) {
  const brands = [
    { name: 'Pepephone', logo: 'images/pepephone.png' },
    { name: 'DIGI', logo: 'images/digi.png' },
    { name: 'Euskaltel', logo: 'images/Euskaltel.png' },
    { name: 'R', logo: 'images/movil R.png' },
    { name: 'Movistar', logo: 'images/movistar.png' },
    { name: 'Yoigo', logo: 'images/yoigo.png' },
    { name: 'Vodafone', logo: 'images/vodafone.png' },
    { name: 'Jazztel', logo: 'images/Jazztel.png' }
  ];

  const allBrands = [...brands, ...brands];

  return (
    <div style={{
      background: 'var(--bg-card)',
      borderTop: '1px solid var(--border-color)',
      borderBottom: '1px solid var(--border-color)',
      padding: '56px 0',
      overflow: 'hidden'
    }}>
      <p style={{
        textAlign: 'center',
        fontSize: 11, fontWeight: 700, letterSpacing: '3px',
        textTransform: 'uppercase', color: 'var(--text-muted)', opacity: 0.75,
        marginBottom: 32, fontFamily: 'DM Sans'
      }}>Operadoras con las que trabajamos</p>

      <div style={{ overflow: 'hidden', userSelect: 'none' }}>
        <div style={{
          display: 'flex',
          width: 'max-content',
          animation: 'marquee-left 36s linear infinite',
          alignItems: 'center'
        }}>
          {allBrands.map((b, i) =>
          <div key={i} style={{
            display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 16,
            padding: '0 48px',
            borderRight: '1px solid var(--border-color)',
            flexShrink: 0,
            opacity: 1,
            transition: 'opacity 0.2s',
            width: 260, height: 260
          }}
          onMouseEnter={(e) => {e.currentTarget.parentNode.style.animationPlayState = 'paused';}}
          onMouseLeave={(e) => {e.currentTarget.parentNode.style.animationPlayState = 'running';}}>
            
              <img
              src={b.logo}
              alt={b.name}
              style={{ height: 80, width: 'auto', maxWidth: 180, objectFit: 'contain', display: 'block' }} />
              <span style={{
              fontFamily: 'DM Sans', fontWeight: 600, fontSize: 13,
              color: 'var(--text-main)', opacity: 0.9, whiteSpace: 'nowrap',
              textAlign: 'center'
            }}>{b.name}</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}