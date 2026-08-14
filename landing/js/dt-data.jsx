const { useState, useEffect, useRef } = React;

/* ── Tweaks defaults ── */
const TWEAK_DEFAULTS = /*EDITMODE-BEGIN*/{
  "primaryColor": "#FE0002",
  "secondaryColor": "#4C4C4C",
  "bgColor": "#ffffff",
  "headingFont": "Sora",
  "heroLayout": "split",
  "showBadge": true,
  "ctaText": "Únete al Equipo"
} /*EDITMODE-END*/;

/* ── Animated counter ── */
function useCounter(target, duration = 1800) {
  const [val, setVal] = useState(0);
  const ref = useRef(null);
  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => {
      if (!entry.isIntersecting) return;
      observer.disconnect();
      let start = null;
      const step = (ts) => {
        if (!start) start = ts;
        const p = Math.min((ts - start) / duration, 1);
        const ease = 1 - Math.pow(1 - p, 3);
        setVal(Math.floor(ease * target));
        if (p < 1) requestAnimationFrame(step);
      };
      requestAnimationFrame(step);
    }, { threshold: 0.3 });
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [target, duration]);
  return [val, ref];
}
