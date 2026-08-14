/* ── MAIN (v20260814.1) ── */
function App() {
  const [tweaks, setTweak] = window.useTweaks(TWEAK_DEFAULTS);
  const primary = tweaks.primaryColor;
  const secondary = tweaks.secondaryColor;
  const bg = tweaks.bgColor;

  // Slide index state para sincronizar burbuja y notita en tiempo real con las fotos
  const [slideIndex, setSlideIndex] = React.useState(0);
  React.useEffect(() => {
    const handleSlide = (e) => {
      if (e && e.detail && typeof e.detail.index === 'number') {
        setSlideIndex(e.detail.index);
      }
    };
    window.addEventListener('hero-slide-change', handleSlide);
    return () => window.removeEventListener('hero-slide-change', handleSlide);
  }, []);

  // Counters
  const [pros, prosRef] = useCounter(80);
  const [yrs, yrsRef] = useCounter(10);

  return (
    <div style={{ background: bg, minHeight: '100vh' }}>
      <Nav primary={primary} secondary={secondary} bg={bg} />

      {/* ── HERO ── */}
      <section id="inicio" className="p5-hero-section" style={{
        position: 'relative',
        overflow: 'visible',
        display: 'flex'
      }}>
        <div style={{
          maxWidth: 1280, margin: '0 auto', width: '100%',
          padding: '80px 40px 60px 40px',
          display: 'flex', alignItems: 'center',
          gap: 48, position: 'relative'
        }}>

        {/* LEFT COPY */}
        <div style={{ flex: '1 1 650px', maxWidth: 650, minWidth: 0, paddingTop: 20 }}>

          {/* Badge */}
          {tweaks.showBadge &&
            <div className="fade-up fade-up-1" style={{
              display: 'inline-flex', alignItems: 'center', gap: 8,
              background: `${primary}12`, border: `1px solid ${primary}28`,
              borderRadius: 100, padding: '6px 14px 6px 8px',
              marginBottom: 28
            }}>
              <div style={{ width: 8, height: 8, borderRadius: '50%', background: primary, flexShrink: 0,
                animation: 'shimmer 2s ease infinite', boxShadow: `0 0 0 3px ${primary}30` }} />
              <span style={{ fontSize: 12, fontWeight: 600, color: primary, fontFamily: 'DM Sans', letterSpacing: '0.2px' }}>
                Líderes en Televentas para España
              </span>
            </div>
            }

          {/* Headline */}
          <h1 className="fade-up fade-up-2" style={{
              fontFamily: tweaks.headingFont + ', sans-serif',
              fontWeight: 800,
              fontSize: 'clamp(52px, 6vw, 80px)',
              lineHeight: 1.02,
              letterSpacing: '-2.5px',
              color: secondary,
              marginBottom: 28
            }}>
            Construye{' '}
            <span style={{ color: primary }}>Tu</span>
            <br />
            Equipo{' '}
            <span style={{
                display: 'inline-flex', alignItems: 'center', gap: 14
              }}>
              Ideal
              <span style={{
                  display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
                  width: 'clamp(52px, 6vw, 72px)', height: 'clamp(52px, 6vw, 72px)',
                  borderRadius: '50%', background: secondary, flexShrink: 0,
                  cursor: 'pointer', transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                  verticalAlign: 'middle'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'scale(1.1) rotate(180deg)';
                  e.currentTarget.style.background = primary;
                  e.currentTarget.style.borderRadius = '0%';
                  e.currentTarget.style.clipPath = 'polygon(50% 0%, 61% 35%, 98% 35%, 68% 57%, 79% 91%, 50% 70%, 21% 91%, 32% 57%, 2% 35%, 39% 35%)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'scale(1) rotate(0deg)';
                  e.currentTarget.style.background = secondary;
                  e.currentTarget.style.borderRadius = '50%';
                  e.currentTarget.style.clipPath = 'none';
                }}>
                
                <svg width="26" height="26" viewBox="0 0 26 26" fill="none">
                  <path d="M6 20L20 6M20 6H10M20 6v10" stroke="white" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </span>
            </span>
          </h1>

          {/* Sub */}
          <p className="fade-up fade-up-3 hero-desc-text" style={{
              fontSize: 17, lineHeight: 1.7, color: '#1f2937',
              maxWidth: 440, marginBottom: 36, fontWeight: 400
            }}>Somos más que un contact center, somos tu aliado estratégico en ventas telefónicas y telecomunicaciones para el mercado español.
          </p>

          {/* Social proof */}
          <div className="fade-up fade-up-4" style={{
              display: 'flex', alignItems: 'center', gap: 16, marginBottom: 40
            }}>
            {/* Avatar stack */}
            <div style={{ display: 'flex' }}>
              {(window.__resources ? [window.__resources.avatar1, window.__resources.avatar2, window.__resources.avatar3, window.__resources.avatar5] : ["https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=80&h=80&fit=crop&crop=faces&q=80", "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=80&h=80&fit=crop&crop=faces&q=80", "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=80&h=80&fit=crop&crop=faces&q=80", "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=80&h=80&fit=crop&crop=faces&q=80"]).map((url, i) =>
                <img key={i} src={url} alt="avatar"
                style={{
                  width: 56, height: 56, borderRadius: '50%',
                  border: '3px solid #fafafa',
                  marginLeft: i === 0 ? 0 : -18,
                  objectFit: 'cover',
                  zIndex: 5 - i,
                  position: 'relative',
                  boxShadow: '0 2px 6px rgba(0,0,0,0.12)'
                }} />

                )}
            </div>
            <div>
              <div ref={prosRef} style={{ fontFamily: 'Sora', fontWeight: 700, fontSize: 18, color: 'var(--text-main)' }}>
                {pros}+
              </div>
              <div style={{ fontSize: 13, color: '#374151' }}>Profesionales en el equipo</div>
            </div>
          </div>

          {/* CTAs */}
          <div className="fade-up fade-up-5" style={{ display: 'flex', gap: 14, alignItems: 'center', flexWrap: 'wrap' }}>
            <a href="https://forms.gle/9AWQbTY2SBmc3Yg77" target="_blank" rel="noopener" style={{
                display: 'inline-flex', alignItems: 'center', gap: 10,
                background: primary, color: 'white',
                borderRadius: 100, padding: '14px 30px',
                fontSize: 15, fontWeight: 600, fontFamily: 'DM Sans',
                textDecoration: 'none', transition: 'transform 0.2s, box-shadow 0.2s',
                boxShadow: `0 6px 24px ${primary}44`
              }}
              onMouseEnter={(e) => {e.currentTarget.style.transform = 'scale(1.04)';e.currentTarget.style.boxShadow = `0 10px 36px ${primary}60`;}}
              onMouseLeave={(e) => {e.currentTarget.style.transform = 'scale(1)';e.currentTarget.style.boxShadow = `0 6px 24px ${primary}44`;}}>
              
              {tweaks.ctaText}
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                <path d="M3 13L13 3M13 3H7M13 3v6" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </a>

            <a href="https://api.whatsapp.com/send?phone=51920133394&text=Hola%20DreamTeam" target="_blank" rel="noopener" style={{
                display: 'inline-flex', alignItems: 'center', gap: 10,
                background: 'transparent', color: secondary,
                borderRadius: 100, padding: '13px 24px',
                fontSize: 15, fontWeight: 600, fontFamily: 'DM Sans',
                textDecoration: 'none', border: `1.5px solid ${secondary}30`,
                transition: 'border-color 0.2s, color 0.2s'
              }}
              onMouseEnter={(e) => {e.currentTarget.style.borderColor = primary;e.currentTarget.style.color = primary;}}
              onMouseLeave={(e) => {e.currentTarget.style.borderColor = `${secondary}30`;e.currentTarget.style.color = secondary;}}>
              
              WhatsApp
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z" fill="currentColor" />
                <path d="M12 0C5.373 0 0 5.373 0 12c0 2.127.558 4.126 1.533 5.862L.054 23.25a.75.75 0 00.916.938l5.535-1.453A11.953 11.953 0 0012 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 21.75a9.713 9.713 0 01-4.964-1.363l-.356-.213-3.686.968.984-3.595-.232-.37A9.712 9.712 0 012.25 12C2.25 6.615 6.615 2.25 12 2.25S21.75 6.615 21.75 12 17.385 21.75 12 21.75z" fill="currentColor" />
              </svg>
            </a>
          </div>
        </div>

        {/* RIGHT: Image */}
        <div className="hero-image-wrapper" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 24, flexShrink: 0 }}>
          <HeroImage primary={primary} secondary={secondary} slideIndex={slideIndex} />
        </div>
        </div>
      </section>
      {/* ── TICKER ── */}
      <Ticker secondary={secondary} />

      {/* ── CÓMO TRABAJAMOS ── */}
      <div id="como-trabajamos">
      <ComoTrabajamos primary={primary} secondary={secondary} bg={bg} />
      </div>

      {/* ── NOSOTROS ── */}
      <Nosotros primary={primary} secondary={secondary} bg={bg} />

      {/* ── BRANDS ── */}
      <BrandsCarousel secondary={secondary} />

      {/* ── CTA JOIN ── */}
      <CTAJoin primary={primary} secondary={secondary} />

      {/* ── FOOTER ── */}
      <Footer primary={primary} secondary={secondary} />

      {/* ── TWEAKS PANEL ── */}
      <window.TweaksPanel>
        <window.TweakSection label="Colores" />
        <window.TweakColor
          label="Color Primario"
          value={tweaks.primaryColor}
          options={['#FE0002', '#E63535', '#CC0000', '#FF4444']}
          onChange={(v) => setTweak('primaryColor', v)} />
        
        <window.TweakColor
          label="Color Secundario"
          value={tweaks.secondaryColor}
          options={['#4C4C4C', '#2a2a2a', '#1a1a1a', '#333333']}
          onChange={(v) => setTweak('secondaryColor', v)} />
        
        <window.TweakColor
          label="Fondo"
          value={tweaks.bgColor}
          options={['#f5f4f1', '#ffffff', '#fafafa', '#f0ede8']}
          onChange={(v) => setTweak('bgColor', v)} />
        
        <window.TweakSection label="Tipografía" />
        <window.TweakSelect
          label="Fuente Titular"
          value={tweaks.headingFont}
          options={['Sora', 'DM Sans', 'Georgia', 'Arial']}
          onChange={(v) => setTweak('headingFont', v)} />
        
        <window.TweakSection label="Contenido" />
        <window.TweakToggle
          label="Mostrar Badge"
          value={tweaks.showBadge}
          onChange={(v) => setTweak('showBadge', v)} />
        
        <window.TweakText
          label="Texto CTA"
          value={tweaks.ctaText}
          onChange={(v) => setTweak('ctaText', v)} />
        
      </window.TweaksPanel>
    </div>);

}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<App />);
