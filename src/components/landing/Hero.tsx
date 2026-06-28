import { useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { useReducedMotion } from "@/lib/use-reduced-motion";
import { viewTransition } from "@/lib/animations";

/* ═══════════════════════════════════════════════════════════
   SMOKE PARTICLE SYSTEM — efecto de humo localizado al cursor
═══════════════════════════════════════════════════════════ */

interface SmokeParticle {
  x: number; y: number;
  vx: number; vy: number;
  size: number; alpha: number;
  decay: number; color: string;
}

const SMOKE_COLORS = ["#C77DFF", "#B08FFF", "#9D4EDD", "#D4AAFF", "#8B3FD6"];

function spawnSmoke(x: number, y: number): SmokeParticle[] {
  return Array.from({ length: 4 }, () => ({
    x: x + (Math.random() - 0.5) * 30,
    y: y + (Math.random() - 0.5) * 30,
    vx: (Math.random() - 0.5) * 1.5,
    vy: -(0.5 + Math.random() * 1.8),
    size: 14 + Math.random() * 28,
    alpha: 0.10 + Math.random() * 0.22,
    decay: 0.007 + Math.random() * 0.014,
    color: SMOKE_COLORS[Math.floor(Math.random() * SMOKE_COLORS.length)],
  }));
}

function initSmoke(canvas: HTMLCanvasElement): () => void {
  const ctx = canvas.getContext("2d")!;
  let W = 1, H = 1;
  let particles: SmokeParticle[] = [];
  let rafId = 0;
  let running = false;

  function resize() {
    const rect = canvas.getBoundingClientRect();
    W = Math.max(rect.width, 1);
    H = Math.max(rect.height, 1);
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    canvas.width  = Math.round(W * dpr);
    canvas.height = Math.round(H * dpr);
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  }

  function tick() {
    ctx.clearRect(0, 0, W, H);
    const alive: SmokeParticle[] = [];
    for (const p of particles) {
      p.x  += p.vx;  p.y  += p.vy;
      p.vy *= 0.985; p.vx *= 0.99;
      p.size  *= 1.018;
      p.alpha -= p.decay;
      if (p.alpha <= 0) continue;
      ctx.save();
      ctx.filter      = "blur(14px)";
      ctx.globalAlpha = p.alpha;
      ctx.fillStyle   = p.color;
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
      alive.push(p);
    }
    particles = alive;
    if (particles.length > 0) {
      rafId = requestAnimationFrame(tick);
    } else {
      running = false;
    }
  }

  function onMove(e: MouseEvent) {
    const rect = canvas.getBoundingClientRect();
    particles.push(...spawnSmoke(e.clientX - rect.left, e.clientY - rect.top));
    if (!running) { running = true; rafId = requestAnimationFrame(tick); }
  }

  const obs = new ResizeObserver(() => resize());
  obs.observe(canvas);
  resize();
  canvas.addEventListener("mousemove", onMove, { passive: true });

  return () => {
    cancelAnimationFrame(rafId);
    canvas.removeEventListener("mousemove", onMove);
    obs.disconnect();
  };
}

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
  const reduced  = useReducedMotion();
  const smokeRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (reduced || !smokeRef.current) return;
    return initSmoke(smokeRef.current);
  }, [reduced]);

  const scrollTo = (e: { preventDefault(): void }, id: string) => {
    e.preventDefault();
    document.getElementById(id)?.scrollIntoView({ behavior: reduced ? "auto" : "smooth" });
  };

  return (
    <>
      <style>{`
        @keyframes cpShimmer {
          0%   { background-position: -270% center; }
          40%  { background-position: 270% center; }
          100% { background-position: 270% center; }
        }
        .cp-logo-text {
          font-family: 'Montserrat', 'Inter', system-ui, sans-serif;
          font-weight: 900;
          letter-spacing: -0.025em;
          line-height: 1.0;
          background: linear-gradient(
            100deg,
            #8B3FD6 0%,
            #B689FF 38%,
            #DCC2FF 52%,
            #B689FF 66%,
            #8B3FD6 100%
          );
          background-size: 280% auto;
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          filter: drop-shadow(0 2px 28px rgba(157,78,221,0.55));
          animation: cpShimmer 3.8s ease-in-out infinite;
        }
        @media (prefers-reduced-motion: reduce) {
          .cp-logo-text {
            animation: none;
            -webkit-text-fill-color: #C077FF;
            filter: none;
          }
        }
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
        className="relative flex items-center justify-center overflow-hidden"
        style={{
          minHeight: "100vh",
          background: "radial-gradient(ellipse 105% 88% at 48% 52%, #1B0F3F 0%, #160B35 44%, #10072A 100%)",
        }}
      >
        {/* Textura de ruido digital */}
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
          <div style={{
            position: "absolute", left: "44%", top: "30%",
            width: 260, height: 260, borderRadius: "50%",
            background: "radial-gradient(circle, rgba(199,125,255,0.08) 0%, transparent 70%)",
            filter: "blur(45px)",
          }} />
        </div>

        {/* ── Logo centrado con animación de flotación ── */}
        <motion.div
          style={{
            position: "relative", zIndex: 10,
            display: "flex", flexDirection: "column",
            alignItems: "center", gap: "2rem",
          }}
          initial={reduced ? false : { opacity: 0, y: 24 }}
          animate={reduced ? undefined : { opacity: 1, y: 0 }}
          transition={viewTransition(reduced, { duration: 1.1, ease: [0.22, 1, 0.36, 1] })}
        >
          {/* Logo flotante */}
          <motion.div
            style={{ position: "relative" }}
            animate={reduced ? undefined : { y: [0, -14, 0] }}
            transition={reduced ? undefined : {
              duration: 5.2,
              repeat: Infinity,
              ease: "easeInOut",
              repeatType: "loop",
            }}
          >
            <picture>
              <source srcSet="/images/logo-close-predict.webp" type="image/webp" />
              <img
                src="/images/logo-close-predict.png"
                alt="Close Predict® — Sistema comercial predecible"
                draggable={false}
                style={{
                  width: "min(75vw, 560px)",
                  height: "auto",
                  display: "block",
                  userSelect: "none",
                  filter:
                    "drop-shadow(0 0 48px rgba(107,31,209,0.55)) drop-shadow(0 0 20px rgba(199,125,255,0.30))",
                }}
              />
            </picture>

            {/* Canvas de humo — captura el mouse sobre el logo */}
            {!reduced && (
              <canvas
                ref={smokeRef}
                aria-hidden
                style={{
                  position: "absolute", inset: 0,
                  width: "100%", height: "100%",
                  cursor: "crosshair",
                  pointerEvents: "auto",
                }}
              />
            )}
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
