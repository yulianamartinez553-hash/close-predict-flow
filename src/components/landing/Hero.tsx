import { useRef, useCallback, type MouseEvent } from "react";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import { useReducedMotion } from "@/lib/use-reduced-motion";
import { viewTransition } from "@/lib/animations";

/* ═══════════════════════════════════════════════════════════
   NAV
═══════════════════════════════════════════════════════════ */
const NAV_LINKS = [
  { label: "Sobre mí",      href: "#sobre-mi"   },
  { label: "Close Predict", href: "#sistema"    },
  { label: "Recursos",      href: "#no-momento" },
  { label: "Contacto",      href: "#contacto"   },
];

/* ═══════════════════════════════════════════════════════════
   COMPONENT
═══════════════════════════════════════════════════════════ */
export function Hero() {
  const reduced     = useReducedMotion();
  const sectionRef  = useRef<HTMLElement>(null);

  /* ── Mouse tracking → deformación del embudo ── */
  const rawX = useMotionValue(0);
  const rawY = useMotionValue(0);

  /* Spring suave: amortiguación elástica para que se vea como jelly */
  const springX = useSpring(rawX, { stiffness: 65, damping: 14 });
  const springY = useSpring(rawY, { stiffness: 65, damping: 14 });

  /*
   * transformOrigin en 72% derecha → la rotación pivota cerca del texto,
   * por lo que el embudo (lado izquierdo) se deforma mucho más que el texto
   */
  const rotateY = useTransform(springX, [-0.5, 0.5], [12, -12]);
  const rotateX = useTransform(springY, [-0.5, 0.5], [-7,   7]);

  const onMouseMove = useCallback(
    (e: MouseEvent<HTMLElement>) => {
      if (reduced) return;
      const rect = e.currentTarget.getBoundingClientRect();
      rawX.set((e.clientX - rect.left  - rect.width  / 2) / rect.width);
      rawY.set((e.clientY - rect.top   - rect.height / 2) / rect.height);
    },
    [reduced, rawX, rawY],
  );

  const onMouseLeave = useCallback(() => {
    rawX.set(0);
    rawY.set(0);
  }, [rawX, rawY]);

  const scrollTo = (e: { preventDefault(): void }, id: string) => {
    e.preventDefault();
    document.getElementById(id)?.scrollIntoView({ behavior: reduced ? "auto" : "smooth" });
  };

  return (
    <>
      <style>{`
        .cp-nav-link {
          color: rgba(220,194,255,0.68);
          font-size: 13px; font-weight: 500;
          text-decoration: none;
          position: relative; padding-bottom: 2px;
          transition: color 220ms;
        }
        .cp-nav-link:hover { color: #DCC2FF; }
        .cp-nav-link::after {
          content: '';
          position: absolute; bottom: -2px; left: 0; right: 0;
          height: 1px; background: #C77DFF;
          transform: scaleX(0); transform-origin: left;
          transition: transform 260ms ease;
        }
        .cp-nav-link:hover::after { transform: scaleX(1); }
        .cp-agendar {
          padding: 8px 24px;
          border: 1.5px solid rgba(199,125,255,0.42);
          border-radius: 100px;
          font-size: 13px; font-weight: 600;
          color: #C77DFF; text-decoration: none;
          background: rgba(199,125,255,0.07);
          transition: border-color 220ms, background 220ms, color 220ms;
          display: inline-block;
        }
        .cp-agendar:hover {
          border-color: rgba(199,125,255,0.75);
          background: rgba(199,125,255,0.15);
          color: #EDD6FF;
        }
      `}</style>

      {/* ── NAV ── */}
      <nav
        className="fixed top-0 left-0 right-0 z-[100] flex items-center justify-between px-6 md:px-16 py-[18px]"
        style={{
          background: "rgba(16,7,42,0.88)",
          backdropFilter: "blur(18px)",
          WebkitBackdropFilter: "blur(18px)",
          borderBottom: "1px solid rgba(157,78,221,0.14)",
        }}
      >
        <a href="#" style={{
          fontFamily: "'Montserrat','Inter',sans-serif",
          fontSize: "15px", fontWeight: 800,
          letterSpacing: "0.12em", color: "#C77DFF",
          textDecoration: "none",
        }}>
          CLOSE<span style={{ color: "rgba(199,125,255,0.38)", margin: "0 3px", fontWeight: 300 }}>·</span>PREDICT
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
        ref={sectionRef}
        onMouseMove={onMouseMove}
        onMouseLeave={onMouseLeave}
        className="relative flex items-center justify-center overflow-hidden"
        style={{
          minHeight: "100vh",
          background: `
            radial-gradient(circle at center, rgba(155,90,255,.22) 0%, rgba(110,55,210,.14) 18%, rgba(70,30,130,.08) 35%, transparent 60%),
            radial-gradient(ellipse at center, #6C39B3 0%, #572996 15%, #431C73 35%, #2F124D 58%, #1A0A2B 82%, #08030F 100%)
          `,
        }}
      >
        {/* Textura de ruido */}
        <svg style={{ position: "absolute", width: 0, height: 0 }} aria-hidden>
          <filter id="cp-noise">
            <feTurbulence type="fractalNoise" baseFrequency="0.70" numOctaves="4" stitchTiles="stitch" />
            <feColorMatrix type="saturate" values="0" />
          </filter>
        </svg>
        <div aria-hidden style={{
          position: "absolute", inset: 0, pointerEvents: "none",
          filter: "url(#cp-noise)", opacity: 0.028,
        }} />

        {/* Halos de ambiente */}
        <div aria-hidden style={{ position: "absolute", inset: 0, pointerEvents: "none" }}>
          <div style={{
            position: "absolute", left: "5%", top: "14%",
            width: 520, height: 520, borderRadius: "50%",
            background: "radial-gradient(circle, rgba(107,31,209,0.22) 0%, transparent 70%)",
            filter: "blur(65px)",
          }} />
          <div style={{
            position: "absolute", right: "8%", bottom: "14%",
            width: 380, height: 380, borderRadius: "50%",
            background: "radial-gradient(circle, rgba(157,78,221,0.15) 0%, transparent 70%)",
            filter: "blur(60px)",
          }} />
        </div>

        {/* ── Logo centrado ── */}
        <motion.div
          style={{ position: "relative", zIndex: 10, display: "flex", flexDirection: "column", alignItems: "center", gap: "2rem" }}
          initial={reduced ? false : { opacity: 0, y: 24 }}
          animate={reduced ? undefined : { opacity: 1, y: 0 }}
          transition={viewTransition(reduced, { duration: 1.1, ease: [0.22, 1, 0.36, 1] })}
        >
          {/* Flotación continua */}
          <motion.div
            animate={reduced ? undefined : { y: [0, -14, 0] }}
            transition={reduced ? undefined : { duration: 5.2, repeat: Infinity, ease: "easeInOut" }}
          >
            {/* Perspectiva 3D — pivot desplazado a la derecha para que el embudo deforme más */}
            <div style={{ perspective: "900px" }}>
              <motion.div
                style={{
                  rotateX,
                  rotateY,
                  transformStyle: "preserve-3d",
                  transformOrigin: "72% 50%",
                  willChange: "transform",
                }}
              >
                <picture>
                  <source srcSet="/images/logo-close-predict.avif" type="image/avif" />
                  <source srcSet="/images/logo-close-predict.webp" type="image/webp" />
                  <img
                    src="/images/logo-close-predict.png"
                    alt="Close Predict® — Sistema comercial predecible"
                    draggable={false}
                    width={1600}
                    height={700}
                    style={{
                      width: "min(88vw, 660px)",
                      height: "auto",
                      display: "block",
                      userSelect: "none",
                    }}
                  />
                </picture>
              </motion.div>
            </div>
          </motion.div>

          {/* Tagline */}
          <motion.div
            initial={reduced ? false : { opacity: 0, y: 10 }}
            animate={reduced ? undefined : { opacity: 1, y: 0 }}
            transition={viewTransition(reduced, { duration: 0.9, delay: 0.55, ease: [0.22, 1, 0.36, 1] })}
            style={{
              fontSize: "clamp(9px, 1.1vw, 12px)",
              fontFamily: "'Montserrat','Inter',sans-serif",
              fontWeight: 700, letterSpacing: "0.32em",
              textTransform: "uppercase",
              color: "rgba(199,125,255,0.48)",
            }}
          >
            Sistema comercial predecible
          </motion.div>
        </motion.div>
      </section>
    </>
  );
}
