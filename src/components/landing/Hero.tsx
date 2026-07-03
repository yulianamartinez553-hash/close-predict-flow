import { useRef, useCallback, useState, useEffect, type MouseEvent } from "react";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import { useReducedMotion } from "@/lib/use-reduced-motion";

/* ─────────────────────────────────────────────────────────────────
   CONSTANTES
───────────────────────────────────────────────────────────────── */
const EXPO = [0.16, 1, 0.3, 1] as const;

const NAV_LINKS = [
  { label: "Sobre mí",        href: "#sobre-mi"    },
  { label: "Close Predict™",  href: "#detalle"     },
  { label: "Herramientas",    href: "#entregables" },
  { label: "Contáctame",      href: "#contacto"    },
];

/* "Close" = índices 0-4 · "Predict" = índices 5-11 · "®" = 12 */
const CLOSE_CHARS   = ["C","l","o","s","e"];
const PREDICT_CHARS = ["P","r","e","d","i","c","t"];

/* ─────────────────────────────────────────────────────────────────
   HERO
───────────────────────────────────────────────────────────────── */
export function Hero({ introComplete }: { introComplete?: boolean }) {
  const reduced   = useReducedMotion();
  const funnelRef = useRef<HTMLDivElement>(null);
  const navRef    = useRef<HTMLElement>(null);
  const [menuOpen, setMenuOpen] = useState(false);

  const [funnelDone, setFunnelDone] = useState(!!reduced);
  useEffect(() => {
    if (reduced) return;
    if (introComplete === false) return;
    const delay = introComplete === true ? 120 : 1180;
    const t = setTimeout(() => setFunnelDone(true), delay);
    return () => clearTimeout(t);
  }, [reduced, introComplete]);

  /* Cerrar dropdown al hacer click fuera del nav */
  useEffect(() => {
    if (!menuOpen) return;
    const handler = (e: Event) => {
      if (navRef.current && !navRef.current.contains(e.target as Node)) {
        setMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [menuOpen]);

  /* Mouse → tilt del embudo */
  const rawX = useMotionValue(0);
  const rawY = useMotionValue(0);
  const sx   = useSpring(rawX, { stiffness: 110, damping: 22 });
  const sy   = useSpring(rawY, { stiffness: 110, damping: 22 });
  const rotateY = useTransform(sx, [-0.5, 0.5], [-8,  8]);
  const rotateX = useTransform(sy, [-0.5, 0.5], [ 6, -6]);

  const onMouseMove = useCallback(
    (e: MouseEvent<HTMLDivElement>) => {
      if (reduced) return;
      const rect = funnelRef.current?.getBoundingClientRect();
      if (!rect) return;
      rawX.set((e.clientX - rect.left  - rect.width  / 2) / rect.width);
      rawY.set((e.clientY - rect.top   - rect.height / 2) / rect.height);
    },
    [reduced, rawX, rawY],
  );
  const onMouseLeave = useCallback(() => {
    rawX.set(0); rawY.set(0);
  }, [rawX, rawY]);

  const scrollTo = (e: { preventDefault(): void }, id: string) => {
    e.preventDefault();
    setMenuOpen(false);
    document.getElementById(id)?.scrollIntoView({ behavior: reduced ? "auto" : "smooth" });
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@700;800&family=Dancing+Script:wght@400&display=swap');

        /* ── Logo personal Caro Chaparro ── */
        .cp-logo {
          text-decoration: none;
          display: flex;
          flex-direction: column;
          align-items: flex-start;
          gap: 2px;
          line-height: 1;
        }
        .cp-logo-name {
          font-family: 'Dancing Script', cursive;
          font-weight: 400;
          font-size: 28px;
          line-height: 1;
          letter-spacing: 0.01em;
          white-space: nowrap;
          color: #6C39B3;
        }
        .cp-logo-sub {
          display: flex;
          align-items: center;
          gap: 7px;
        }
        .cp-logo-sub::before,
        .cp-logo-sub::after {
          content: '';
          display: block;
          width: 20px;
          height: 1px;
          background: rgba(108,57,179,0.28);
        }
        .cp-logo-sub span {
          font-family: 'Montserrat','Inter',sans-serif;
          font-size: 9.5px;
          font-weight: 600;
          letter-spacing: 0.42em;
          text-transform: uppercase;
          color: rgba(70,50,117,0.62);
        }

        /* ── Botón Agendar — brillo diagonal en loop ── */
        .cp-agendar {
          position: relative;
          overflow: hidden;
          padding: 8px 22px;
          border-width: 1.5px;
          border-style: solid;
          border-radius: 100px;
          font-size: 13px;
          font-weight: 600;
          text-decoration: none;
          display: inline-block;
          color: #6C39B3;
          border-color: rgba(108,57,179,0.45);
          background: rgba(108,57,179,0.10);
          transition: border-color 350ms ease, background 350ms ease;
        }
        .cp-agendar:hover {
          border-color: rgba(108,57,179,0.75);
          background: rgba(108,57,179,0.16);
        }
        .cp-agendar::after {
          content: '';
          position: absolute;
          top: -50%;
          left: -120%;
          width: 55%;
          height: 200%;
          background: linear-gradient(
            to right,
            transparent 0%,
            rgba(255,255,255,0.80) 50%,
            transparent 100%
          );
          transform: skewX(-18deg);
          animation: cpShine 2.8s ease-in-out infinite;
        }
        @keyframes cpShine {
          0%        { left: -120%; }
          55%, 100% { left: 180%;  }
        }

        /* ── Hamburger icon button ── */
        .cp-menu-btn {
          display: flex;
          flex-direction: column;
          justify-content: center;
          gap: 4.5px;
          padding: 7px 8px;
          background: none;
          border: none;
          cursor: pointer;
          border-radius: 8px;
          transition: background 200ms;
        }
        .cp-menu-btn span {
          display: block;
          width: 20px;
          height: 2px;
          border-radius: 2px;
          background: #6C39B3;
        }
        .cp-menu-btn:hover { background: rgba(108,57,179,0.08); }

        /* ── Dropdown menú ── */
        .cp-dropdown {
          position: absolute;
          top: calc(100% + 10px);
          right: 1rem;
          background: #ffffff;
          border: 1px solid rgba(108,57,179,0.14);
          border-radius: 14px;
          box-shadow: 0 8px 32px rgba(70,50,117,0.14), 0 2px 8px rgba(0,0,0,0.06);
          min-width: 210px;
          overflow: hidden;
          z-index: 200;
        }
        .cp-dropdown a {
          display: block;
          padding: 13px 20px;
          color: #3d2470;
          font-family: 'Poppins','Inter',system-ui,sans-serif;
          font-size: 14px;
          font-weight: 500;
          text-decoration: none;
          transition: background 180ms, color 180ms;
          border-bottom: 1px solid rgba(108,57,179,0.07);
        }
        .cp-dropdown a:last-child { border-bottom: none; }
        .cp-dropdown a:hover {
          background: rgba(108,57,179,0.06);
          color: #6C39B3;
        }

        /* ── Logo Close Predict® — degradé gris claro → blanco ── */
        .cp-word {
          font-family: 'Plus Jakarta Sans', 'Outfit', 'Manrope', system-ui, sans-serif;
          font-weight: 800;
          line-height: 0.93;
          letter-spacing: -0.028em;
          display: block;
          background: linear-gradient(180deg, #A8A4BC 0%, #FFFFFF 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          will-change: transform;
        }
        .cp-sup {
          font-size: 0.40em;
          vertical-align: super;
          letter-spacing: 0;
          background: linear-gradient(180deg, #A8A4BC 0%, #FFFFFF 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          font-weight: 800;
        }

        /* ── Aurora keyframes — manchas moradas sobre blanco ── */
        @keyframes aurora1 {
          0%, 100% { transform: translate(0,    0)    scale(1);    }
          25%       { transform: translate(8%,  -7%)   scale(1.09); }
          50%       { transform: translate(-6%,  10%)  scale(0.94); }
          75%       { transform: translate(11%,  5%)   scale(1.05); }
        }
        @keyframes aurora2 {
          0%, 100% { transform: translate(0,    0)    scale(1);    }
          33%       { transform: translate(-10%, 9%)   scale(1.12); }
          66%       { transform: translate(7%,  -11%)  scale(0.91); }
        }
        @keyframes aurora3 {
          0%, 100% { transform: translate(0,    0)    scale(1);    }
          40%       { transform: translate(9%,   13%)  scale(1.07); }
          80%       { transform: translate(-7%, -5%)   scale(0.97); }
        }
        @keyframes aurora4 {
          0%, 100% { transform: translate(0,    0)    scale(1);    }
          45%       { transform: translate(-5%,  8%)   scale(1.08); }
          70%       { transform: translate(9%,  -6%)   scale(0.95); }
        }

        @media (prefers-reduced-motion: reduce) {
          .cp-agendar::after { animation: none !important; }
        }
      `}</style>

      {/* ── NAV — fondo blanco fijo ── */}
      <nav
        ref={navRef}
        className="fixed top-0 left-0 right-0 z-[100] flex items-center justify-between px-6 md:px-16 py-[18px]"
        style={{
          background: "#FFFFFF",
          boxShadow: "0 1px 0 rgba(108,57,179,0.08)",
        }}
      >
        {/* ── Logo personal — izquierda ── */}
        <a href="#" className="cp-logo">
          <span className="cp-logo-name">Caro Chaparro</span>
          <div className="cp-logo-sub"><span>Ventas</span></div>
        </a>

        {/* ── Derecha: botón Agendar + ícono hamburger ── */}
        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          <a
            href="https://calendly.com/caroventascoach/30min?month=2026-06"
            target="_blank" rel="noopener noreferrer"
            className="cp-agendar"
          >
            Agendar
          </a>

          <button
            className="cp-menu-btn"
            onClick={() => setMenuOpen(o => !o)}
            aria-label={menuOpen ? "Cerrar menú" : "Abrir menú"}
            aria-expanded={menuOpen}
          >
            <span /><span /><span />
          </button>
        </div>

        {/* ── Dropdown de navegación ── */}
        {menuOpen && (
          <div className="cp-dropdown">
            {NAV_LINKS.map(({ label, href }) => (
              <a key={href} href={href} onClick={e => scrollTo(e, href.slice(1))}>
                {label}
              </a>
            ))}
          </div>
        )}
      </nav>

      {/* ── HERO — fondo blanco con manchas aurora moradas ── */}
      <section
        className="relative flex items-center justify-center overflow-hidden"
        style={{ minHeight: "100vh", background: "#FFFFFF" }}
      >
        {/* ── Manchas aurora moradas (puntuales, difuminadas, en movimiento) ── */}
        <div aria-hidden style={{
          position: "absolute", top: "-12%", left: "-10%",
          width: "46vw", height: "46vw",
          background: "#463275", borderRadius: "50%",
          filter: "blur(130px)", opacity: 0.13,
          animation: "aurora1 20s ease-in-out infinite",
          pointerEvents: "none",
        }} />
        <div aria-hidden style={{
          position: "absolute", top: "20%", right: "-8%",
          width: "34vw", height: "34vw",
          background: "#463275", borderRadius: "50%",
          filter: "blur(110px)", opacity: 0.10,
          animation: "aurora2 26s ease-in-out infinite",
          pointerEvents: "none",
        }} />
        <div aria-hidden style={{
          position: "absolute", bottom: "-10%", left: "22%",
          width: "38vw", height: "38vw",
          background: "#463275", borderRadius: "50%",
          filter: "blur(120px)", opacity: 0.11,
          animation: "aurora3 22s ease-in-out infinite",
          pointerEvents: "none",
        }} />
        <div aria-hidden style={{
          position: "absolute", top: "40%", left: "40%",
          width: "20vw", height: "20vw",
          background: "#6B2BB5", borderRadius: "50%",
          filter: "blur(90px)", opacity: 0.07,
          animation: "aurora4 30s ease-in-out infinite",
          pointerEvents: "none",
        }} />

        {/* Textura noise sutil */}
        <svg style={{ position: "absolute", width: 0, height: 0 }} aria-hidden>
          <filter id="cp-noise">
            <feTurbulence type="fractalNoise" baseFrequency="0.70" numOctaves="4" stitchTiles="stitch"/>
            <feColorMatrix type="saturate" values="0"/>
          </filter>
        </svg>
        <div aria-hidden style={{
          position: "absolute", inset: 0, pointerEvents: "none",
          filter: "url(#cp-noise)", opacity: 0.022,
        }}/>

        {/* ── Composición principal ── */}
        <div style={{
          position: "relative", zIndex: 10,
          width: "88%", maxWidth: 1060,
          display: "flex", alignItems: "center",
          justifyContent: "center",
          gap: "clamp(2rem, 5vw, 5.5rem)",
          flexWrap: "wrap",
        }}>

          {/* ══════════ EMBUDO SVG ══════════ */}
          <div
            ref={funnelRef}
            onMouseMove={onMouseMove}
            onMouseLeave={onMouseLeave}
            style={{ position: "relative", width: "min(44%, 400px)", flexShrink: 0 }}
          >
            <div aria-hidden style={{
              position: "absolute",
              top: "-28%", left: "-22%", right: "-22%", bottom: "-28%",
              background: "radial-gradient(circle at 42% 52%, rgba(70,50,117,0.10) 0%, transparent 60%)",
              pointerEvents: "none",
            }}/>

            <motion.div
              style={{
                rotateX,
                rotateY,
                perspective: "900px",
                willChange: "transform",
                transformStyle: "preserve-3d",
              }}
            >
              <motion.div
                style={{ filter: "drop-shadow(0 0 24px rgba(108,57,179,0.30))", willChange: "transform" }}
                animate={funnelDone ? { scale: [1, 1.012, 1] } : undefined}
                transition={funnelDone
                  ? { duration: 6.5, repeat: Infinity, ease: "easeInOut" }
                  : undefined
                }
              >
                <motion.div
                  style={{ willChange: "transform" }}
                  initial={reduced || introComplete === false ? false : { opacity: 0, y: 22, scale: 0.93, filter: "blur(8px)" }}
                  animate={reduced || introComplete === false ? undefined : { opacity: 1, y: 0, scale: 1, filter: "blur(0px)" }}
                  transition={reduced || introComplete === false ? undefined : { delay: 0.10, duration: 0.65, ease: EXPO }}
                  onAnimationComplete={introComplete === false ? undefined : () => setFunnelDone(true)}
                >
                  <picture>
                    <source srcSet="/images/embudo-close-predict.avif" type="image/avif" />
                    <source srcSet="/images/embudo-close-predict.webp" type="image/webp" />
                    <img
                      id="cp-funnel-img"
                      src="/images/embudo-close-predict.png"
                      alt="Embudo Close Predict"
                      draggable={false}
                      width={532}
                      height={552}
                      style={{
                        width: "100%",
                        height: "auto",
                        display: "block",
                        userSelect: "none",
                        opacity:  introComplete === false ? 0 : undefined,
                        clipPath: introComplete === false ? "inset(0% 0% 69% 0%)" : undefined,
                      }}
                    />
                  </picture>
                </motion.div>
              </motion.div>
            </motion.div>
          </div>

          {/* ══════════ TEXTO — Close Predict® (degradé gris claro → blanco, levemente más grande) ══════════ */}
          <div
            translate="no"
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "flex-start",
              flexShrink: 0,
              minWidth: 200,
            }}
          >
            {/* "Close" */}
            <div style={{ display: "flex" }}>
              {CLOSE_CHARS.map((ch, i) => (
                <span
                  key={i}
                  id={`cp-char-${i}`}
                  className="cp-word"
                  style={{
                    fontSize: "clamp(54px, 6vw, 96px)",
                    display: "inline-block",
                    opacity:   introComplete === false ? 0      : undefined,
                    filter:    introComplete === false ? "blur(6px)" : undefined,
                    transform: introComplete === false ? "translateY(8px)" : undefined,
                    transition: "none",
                  }}
                >
                  {ch}
                </span>
              ))}
            </div>

            {/* "Predict®" */}
            <div style={{ display: "flex", alignItems: "baseline", marginTop: "0.04em" }}>
              {PREDICT_CHARS.map((ch, i) => (
                <span
                  key={i}
                  id={`cp-char-${i + 5}`}
                  className="cp-word"
                  style={{
                    fontSize: "clamp(54px, 6vw, 96px)",
                    display: "inline-block",
                    opacity:   introComplete === false ? 0      : undefined,
                    filter:    introComplete === false ? "blur(6px)" : undefined,
                    transform: introComplete === false ? "translateY(8px)" : undefined,
                    transition: "none",
                  }}
                >
                  {ch}
                </span>
              ))}
              <sup
                id="cp-char-12"
                className="cp-sup"
                style={{
                  opacity:   introComplete === false ? 0 : undefined,
                  transition: "none",
                }}
              >®</sup>
            </div>

            {/* Tagline */}
            <p
              id="cp-tagline"
              style={{
                margin: 0,
                marginTop: "1.7rem",
                fontSize: "clamp(9px, 0.92vw, 11px)",
                fontFamily: "'Montserrat','Inter',sans-serif",
                fontWeight: 700,
                letterSpacing: "0.32em",
                textTransform: "uppercase",
                color: "rgba(70,50,117,0.50)",
                opacity: introComplete === false ? 0 : undefined,
                transition: "none",
              }}
            >
              Sistema Comercial Predecible
            </p>
          </div>

        </div>
      </section>
    </>
  );
}
