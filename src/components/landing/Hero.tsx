import { useRef, useCallback, useState, useEffect, type MouseEvent } from "react";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import { useReducedMotion } from "@/lib/use-reduced-motion";

/* ─────────────────────────────────────────────────────────────────
   CONSTANTES
───────────────────────────────────────────────────────────────── */
const EXPO = [0.16, 1, 0.3, 1] as const;

/* 4 barras del embudo — paths exactos del logo original */
const BARS = [
  { key: "b0", d: "M 0,18 L 0,65 Q 150,61 300,47 L 342,8 L 300,23 Q 150,25 0,18 Z", gloss: 0.70, delay: 0.10 },
  { key: "b1", d: "M 0,93 L 0,133 Q 112,129 238,119 L 238,99 Q 112,100 0,93 Z",       gloss: 0.58, delay: 0.26 },
  { key: "b2", d: "M 0,157 L 0,189 Q 84,186 182,177 L 182,163 Q 84,162 0,157 Z",      gloss: 0.50, delay: 0.42 },
  { key: "b3", d: "M 0,213 L 0,237 Q 58,235 133,228 L 133,216 Q 58,214 0,213 Z",      gloss: 0.42, delay: 0.58 },
];

const NAV_LINKS = [
  { label: "Sobre mí",      href: "#sobre-mi"   },
  { label: "Close Predict", href: "#sistema"    },
  { label: "Recursos",      href: "#no-momento" },
  { label: "Contacto",      href: "#contacto"   },
];

/* ─────────────────────────────────────────────────────────────────
   HERO
───────────────────────────────────────────────────────────────── */
export function Hero() {
  const reduced    = useReducedMotion();
  const funnelRef  = useRef<HTMLDivElement>(null);

  /* Respiración empieza cuando el embudo terminó de construirse */
  const [funnelDone, setFunnelDone] = useState(!!reduced);
  useEffect(() => {
    if (reduced) return;
    /* última barra: delay 0.58 + duración 0.55 = 1.13 s */
    const t = setTimeout(() => setFunnelDone(true), 1180);
    return () => clearTimeout(t);
  }, [reduced]);

  /* ── Mouse → tilt del embudo ── */
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
    document.getElementById(id)?.scrollIntoView({ behavior: reduced ? "auto" : "smooth" });
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@700;800&display=swap');

        .cp-nav-link {
          color: rgba(220,194,255,.68); font-size: 13px; font-weight: 500;
          text-decoration: none; position: relative; padding-bottom: 2px;
          transition: color 220ms;
        }
        .cp-nav-link:hover { color: #DCC2FF; }
        .cp-nav-link::after {
          content: ''; position: absolute; bottom: -2px; left: 0; right: 0;
          height: 1px; background: #C77DFF;
          transform: scaleX(0); transform-origin: left;
          transition: transform 260ms ease;
        }
        .cp-nav-link:hover::after { transform: scaleX(1); }

        .cp-agendar {
          padding: 8px 24px; border: 1.5px solid rgba(199,125,255,.42);
          border-radius: 100px; font-size: 13px; font-weight: 600;
          color: #C77DFF; text-decoration: none; background: rgba(199,125,255,.07);
          transition: border-color 220ms, background 220ms, color 220ms;
          display: inline-block;
        }
        .cp-agendar:hover {
          border-color: rgba(199,125,255,.75);
          background: rgba(199,125,255,.15); color: #EDD6FF;
        }

        /* Texto del logo — gradiente vertical de violeta claro a oscuro */
        .cp-word {
          font-family: 'Plus Jakarta Sans', 'Outfit', 'Manrope', system-ui, sans-serif;
          font-weight: 800;
          line-height: 0.93;
          letter-spacing: -0.028em;
          display: block;
          background: linear-gradient(180deg, #9B72E0 0%, #6C39B3 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          will-change: transform;
        }
        .cp-sup {
          font-size: 0.40em;
          vertical-align: super;
          letter-spacing: 0;
          background: linear-gradient(180deg, #9B72E0 0%, #6C39B3 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          font-weight: 800;
        }
      `}</style>

      {/* ── NAV ── */}
      <nav
        className="fixed top-0 left-0 right-0 z-[100] flex items-center justify-between px-6 md:px-16 py-[18px]"
        style={{
          background: "rgba(10,4,28,0.90)",
          backdropFilter: "blur(18px)",
          WebkitBackdropFilter: "blur(18px)",
          borderBottom: "1px solid rgba(108,57,179,0.18)",
        }}
      >
        <a href="#" style={{
          fontFamily: "'Montserrat','Inter',sans-serif",
          fontSize: "15px", fontWeight: 800,
          letterSpacing: "0.12em", color: "#9B72E0",
          textDecoration: "none",
        }}>
          CLOSE<span style={{ color: "rgba(155,114,224,.35)", margin: "0 3px", fontWeight: 300 }}>·</span>PREDICT
        </a>
        <div className="hidden md:flex items-center gap-7">
          {NAV_LINKS.map(({ label, href }) => (
            <a key={href} href={href} className="cp-nav-link"
               onClick={e => scrollTo(e, href.slice(1))}>
              {label}
            </a>
          ))}
          <a
            href="https://calendly.com/caroventascoach/30min?month=2026-06"
            target="_blank" rel="noopener noreferrer"
            className="cp-agendar"
          >
            Agendar
          </a>
        </div>
      </nav>

      {/* ── HERO ── */}
      <section
        className="relative flex items-center justify-center overflow-hidden"
        style={{
          minHeight: "100vh",
          background: `
            radial-gradient(circle at center, rgba(155,90,255,.22) 0%, rgba(110,55,210,.14) 18%, rgba(70,30,130,.08) 35%, transparent 60%),
            radial-gradient(ellipse at center, #6C39B3 0%, #572996 15%, #431C73 35%, #2F124D 58%, #1A0A2B 82%, #08030F 100%)
          `,
        }}
      >
        {/* Textura noise sutil */}
        <svg style={{ position: "absolute", width: 0, height: 0 }} aria-hidden>
          <filter id="cp-noise">
            <feTurbulence type="fractalNoise" baseFrequency="0.70" numOctaves="4" stitchTiles="stitch"/>
            <feColorMatrix type="saturate" values="0"/>
          </filter>
        </svg>
        <div aria-hidden style={{
          position: "absolute", inset: 0, pointerEvents: "none",
          filter: "url(#cp-noise)", opacity: 0.028,
        }}/>

        {/* Halos de profundidad */}
        <div aria-hidden style={{ position: "absolute", inset: 0, pointerEvents: "none" }}>
          <div style={{
            position: "absolute", left: "4%", top: "12%",
            width: 500, height: 500, borderRadius: "50%",
            background: "radial-gradient(circle, rgba(108,57,179,0.20) 0%, transparent 70%)",
            filter: "blur(70px)",
          }}/>
          <div style={{
            position: "absolute", right: "6%", bottom: "12%",
            width: 360, height: 360, borderRadius: "50%",
            background: "radial-gradient(circle, rgba(155,90,255,0.12) 0%, transparent 70%)",
            filter: "blur(65px)",
          }}/>
        </div>

        {/* ── Composición principal ── */}
        <div style={{
          position: "relative", zIndex: 10,
          width: "88%", maxWidth: 1020,
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
            {/* Glow radial detrás del embudo */}
            <div aria-hidden style={{
              position: "absolute",
              top: "-28%", left: "-22%", right: "-22%", bottom: "-28%",
              background: "radial-gradient(circle at 42% 52%, rgba(108,57,179,0.13) 0%, transparent 60%)",
              pointerEvents: "none",
            }}/>

            {/* Tilt con mouse — perspectiva 3D */}
            <motion.div
              style={{
                rotateX,
                rotateY,
                perspective: "900px",
                willChange: "transform",
                transformStyle: "preserve-3d",
              }}
            >
              {/* Respiración suave — solo activa tras construirse el embudo */}
              <motion.div
                style={{ filter: "drop-shadow(0 0 22px rgba(108,57,179,0.42))" }}
                animate={funnelDone ? { scale: [1, 1.012, 1] } : undefined}
                transition={funnelDone
                  ? { duration: 6.5, repeat: Infinity, ease: "easeInOut" }
                  : undefined
                }
              >
                <svg
                  viewBox="-12 -24 366 290"
                  xmlns="http://www.w3.org/2000/svg"
                  style={{ width: "100%", height: "auto", display: "block", overflow: "visible" }}
                  aria-label="Embudo de ventas Close Predict"
                >
                  <defs>
                    {/* Degradado horizontal — azul profundo → violeta → lila */}
                    <linearGradient id="cpHFg" x1="0" y1="0" x2="1" y2="0">
                      <stop offset="0%"   stopColor="#223B8F"/>
                      <stop offset="20%"  stopColor="#6B1FD1"/>
                      <stop offset="50%"  stopColor="#9D4EDD"/>
                      <stop offset="78%"  stopColor="#C77DFF"/>
                      <stop offset="100%" stopColor="#A869E8"/>
                    </linearGradient>
                    {/* Gloss superior */}
                    <linearGradient id="cpHGl" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%"   stopColor="rgba(255,255,255,0.22)"/>
                      <stop offset="45%"  stopColor="rgba(255,255,255,0.05)"/>
                      <stop offset="100%" stopColor="rgba(255,255,255,0.00)"/>
                    </linearGradient>
                  </defs>

                  {/* Las 4 barras, cada una como motion.g independiente */}
                  {BARS.map((bar) => (
                    <motion.g
                      key={bar.key}
                      style={{
                        transformBox: "fill-box",
                        transformOrigin: "center",
                        willChange: "transform",
                      }}
                      initial={reduced ? undefined : {
                        opacity: 0,
                        y: 18,
                        scale: 0.92,
                        filter: "blur(6px)",
                      }}
                      animate={reduced ? undefined : {
                        opacity: 1,
                        y: 0,
                        scale: 1,
                        filter: "blur(0px)",
                      }}
                      transition={reduced ? undefined : {
                        delay: bar.delay,
                        duration: 0.55,
                        ease: EXPO,
                      }}
                    >
                      <path d={bar.d} fill="url(#cpHFg)"/>
                      <path d={bar.d} fill="url(#cpHGl)" opacity={bar.gloss}/>
                    </motion.g>
                  ))}
                </svg>
              </motion.div>
            </motion.div>
          </div>

          {/* ══════════ TEXTO HTML/CSS ══════════ */}
          <motion.div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "flex-start",
              flexShrink: 0,
              minWidth: 200,
            }}
            initial={reduced ? undefined : { opacity: 0, y: 18, filter: "blur(10px)" }}
            animate={reduced ? undefined : { opacity: 1, y: 0,  filter: "blur(0px)"  }}
            transition={reduced ? undefined : { delay: 0.90, duration: 0.60, ease: EXPO }}
          >
            <span
              className="cp-word"
              style={{ fontSize: "clamp(46px, 5.0vw, 84px)" }}
            >
              Close
            </span>
            <span
              className="cp-word"
              style={{ fontSize: "clamp(46px, 5.0vw, 84px)", marginTop: "0.04em" }}
            >
              Predict<sup className="cp-sup">®</sup>
            </span>

            {/* Tagline */}
            <motion.p
              style={{
                margin: 0,
                marginTop: "1.7rem",
                fontSize: "clamp(9px, 0.92vw, 11px)",
                fontFamily: "'Montserrat','Inter',sans-serif",
                fontWeight: 700,
                letterSpacing: "0.32em",
                textTransform: "uppercase",
                color: "rgba(155,114,224,0.48)",
              }}
              initial={reduced ? undefined : { opacity: 0, y: 10 }}
              animate={reduced ? undefined : { opacity: 1, y: 0  }}
              transition={reduced ? undefined : { delay: 1.30, duration: 0.50, ease: EXPO }}
            >
              Sistema Comercial Predecible
            </motion.p>
          </motion.div>

        </div>
      </section>
    </>
  );
}
