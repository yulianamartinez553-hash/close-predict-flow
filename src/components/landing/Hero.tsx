import { useEffect, useRef } from "react";
import { motion } from "framer-motion";

/* ─── CANVAS PARTICLE SYSTEM ────────────────────────────────────── */

const W = 500, H = 650, CX = 250;

const PIECES = [
  { yT: H * 0.04, yB: H * 0.23, wT: W * 0.86, wB: W * 0.68, frac: 0.35 },
  { yT: H * 0.27, yB: H * 0.46, wT: W * 0.64, wB: W * 0.50, frac: 0.28 },
  { yT: H * 0.50, yB: H * 0.66, wT: W * 0.46, wB: W * 0.35, frac: 0.22 },
  { yT: H * 0.70, yB: H * 0.84, wT: W * 0.32, wB: W * 0.21, frac: 0.15 },
];

const RADII = [1, 2, 3] as const; // → 2px, 4px, 6px diameter
const TOTAL = 185;
const FLOW_N = 12;
const R = 55, STR = 3.0, SP = 0.055, DM = 0.86;

interface Pt {
  ox: number; oy: number;
  x: number; y: number;
  vx: number; vy: number;
  r: number; alpha: number;
}

interface Flow {
  x: number; y: number;
  vy: number; r: number; alpha: number;
}

function buildParticles(): Pt[] {
  const pts: Pt[] = [];
  PIECES.forEach(({ yT, yB, wT, wB, frac }) => {
    const n = Math.round(TOTAL * frac);
    for (let i = 0; i < n; i++) {
      const t = Math.random();
      const y = yT + t * (yB - yT);
      const w = wT + t * (wB - wT);
      const x = CX - w / 2 + Math.random() * w;
      const solid = Math.random() > 0.38;
      pts.push({
        ox: x, oy: y,
        x: x + (Math.random() - 0.5) * 2,
        y: y + (Math.random() - 0.5) * 2,
        vx: 0, vy: 0,
        r: RADII[Math.floor(Math.random() * 3)],
        alpha: solid ? 0.72 + Math.random() * 0.28 : 0.38 + Math.random() * 0.28,
      });
    }
  });
  return pts;
}

function buildFlow(): Flow[] {
  return Array.from({ length: FLOW_N }, () => ({
    x: CX - 150 + Math.random() * 300,
    y: -25 - Math.random() * 35,
    vy: 0.45 + Math.random() * 0.75,
    r: 0.8 + Math.random() * 1.0,
    alpha: 0.22 + Math.random() * 0.28,
  }));
}

function initFunnel(canvas: HTMLCanvasElement): () => void {
  const ctx = canvas.getContext("2d")!;
  canvas.width = W;
  canvas.height = H;

  const REDUCED = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const FLOW_TOP = PIECES[0].yT;

  let pts = buildParticles();
  let flow = buildFlow();
  let mx = -9999, my = -9999;
  let rafId = 0;

  function update() {
    const RR = R * R;
    pts.forEach(p => {
      const dx = p.x - mx, dy = p.y - my, d2 = dx * dx + dy * dy;
      if (d2 < RR && d2 > 0.01) {
        const d = Math.sqrt(d2), f = ((R - d) / R) * STR;
        p.vx += (dx / d) * f; p.vy += (dy / d) * f;
      }
      p.vx += (p.ox - p.x) * SP; p.vy += (p.oy - p.y) * SP;
      p.vx *= DM; p.vy *= DM;
      p.x += p.vx; p.y += p.vy;
    });

    flow.forEach(fp => {
      fp.y += fp.vy;
      if (fp.y > FLOW_TOP + 8) {
        fp.x = CX - 150 + Math.random() * 300;
        fp.y = -25 - Math.random() * 40;
        fp.vy = 0.45 + Math.random() * 0.75;
      }
    });
  }

  function draw() {
    ctx.clearRect(0, 0, W, H);

    // Funnel particles
    ctx.fillStyle = "#8B3FD6";
    pts.forEach(p => {
      ctx.save();
      ctx.globalAlpha = p.alpha;
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    });

    // Flow particles (fade as they approach funnel entrance)
    flow.forEach(fp => {
      const fade = Math.max(0, 1 - fp.y / FLOW_TOP);
      ctx.save();
      ctx.globalAlpha = fp.alpha * fade;
      ctx.fillStyle = "#8B3FD6";
      ctx.beginPath();
      ctx.arc(fp.x, fp.y, fp.r, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    });
  }

  function loop() {
    if (!REDUCED) update();
    draw();
    rafId = requestAnimationFrame(loop);
  }

  const onMouseMove = (e: MouseEvent) => {
    const rect = canvas.getBoundingClientRect();
    mx = (e.clientX - rect.left) * (W / rect.width);
    my = (e.clientY - rect.top) * (H / rect.height);
  };
  const onLeave = () => { mx = -9999; my = -9999; };

  canvas.addEventListener("mousemove", onMouseMove, { passive: true });
  canvas.addEventListener("mouseleave", onLeave);

  let resizeTimer: ReturnType<typeof setTimeout>;
  const onResize = () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => { pts = buildParticles(); flow = buildFlow(); }, 200);
  };
  window.addEventListener("resize", onResize);

  rafId = requestAnimationFrame(loop);

  return () => {
    cancelAnimationFrame(rafId);
    canvas.removeEventListener("mousemove", onMouseMove);
    canvas.removeEventListener("mouseleave", onLeave);
    window.removeEventListener("resize", onResize);
    clearTimeout(resizeTimer);
  };
}

/* ─── NAV LINKS ─────────────────────────────────────────────────── */

const NAV_LINKS = [
  { label: "Sobre mí",      href: "#sobre-mi" },
  { label: "Close Predict", href: "#sistema" },
  { label: "Recursos",      href: "#no-momento" },
  { label: "Contacto",      href: "#contacto" },
];

/* ─── COMPONENT ──────────────────────────────────────────────────── */

export function Hero() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (!canvasRef.current) return;
    return initFunnel(canvasRef.current);
  }, []);

  const scrollToSobreMi = (e: React.MouseEvent) => {
    e.preventDefault();
    document.getElementById("sobre-mi")?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <>
      {/* ── CSS keyframes injected once ── */}
      <style>{`
        @keyframes heroShine {
          0%   { background-position: -200% center; }
          30%  { background-position: 200% center; }
          100% { background-position: 200% center; }
        }
        .hero-title-gradient {
          background: linear-gradient(90deg, #8B3FD6 0%, #9D4EDD 35%, #c4b5fd 50%, #9D4EDD 65%, #8B3FD6 100%);
          background-size: 200% auto;
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          animation: heroShine 3s linear infinite;
        }
        .sistema-word {
          background: linear-gradient(90deg, #8B3FD6 0%, #9D4EDD 35%, #e9d5ff 50%, #9D4EDD 65%, #8B3FD6 100%);
          background-size: 200% auto;
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          animation: heroShine 3s linear infinite;
          filter: drop-shadow(0 0 8px rgba(139,63,214,0.55));
        }
        .nav-pill-link {
          position: relative;
          text-decoration: none;
          color: #8B3FD6;
          font-size: 13.5px;
          font-weight: 500;
          font-family: 'Inter', 'Montserrat', system-ui, sans-serif;
          padding-bottom: 2px;
          transition: opacity 200ms;
        }
        .nav-pill-link::after {
          content: '';
          position: absolute;
          bottom: -2px;
          left: 0;
          right: 0;
          height: 1.5px;
          background: #8B3FD6;
          transform: scaleX(0);
          transform-origin: left center;
          transition: transform 300ms ease;
        }
        .nav-pill-link:hover::after { transform: scaleX(1); }
        .nav-pill-link:hover { opacity: 0.8; }
      `}</style>

      <section className="relative min-h-screen" style={{ background: "#fff" }}>
        {/* ── Navigation ── */}
        <nav
          className="fixed top-0 left-0 right-0 z-[100] flex items-center justify-between px-6 py-[18px] md:px-[64px]"
          style={{
            background: "rgba(255,255,255,0.9)",
            backdropFilter: "blur(14px)",
            borderBottom: "1px solid rgba(139,63,214,0.07)",
          }}
        >
          {/* Brand */}
          <a
            href="#"
            className="no-underline"
            style={{ fontFamily: "var(--font-serif)", fontSize: "20px", fontWeight: 700, color: "#1E0A33" }}
          >
            Caro <em style={{ fontStyle: "italic", color: "#8B3FD6" }}>Chaparro</em>
          </a>

          {/* Links — top right */}
          <div className="hidden md:flex items-center gap-8">
            {NAV_LINKS.map(({ label, href }) => (
              <a key={href} href={href} className="nav-pill-link">
                {label}
              </a>
            ))}
            <a
              href="/diagnostico.html"
              className="no-underline"
              style={{
                padding: "7px 20px",
                borderRadius: "100px",
                border: "1.5px solid rgba(139,63,214,0.35)",
                color: "#8B3FD6",
                fontSize: "13px",
                fontWeight: 600,
                fontFamily: "Inter, system-ui, sans-serif",
              }}
            >
              Agendar
            </a>
          </div>
        </nav>

        {/* ── Hero grid ── */}
        <div
          className="mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 items-center px-6 lg:px-[72px] pt-[148px] pb-24"
          style={{ maxWidth: "1280px" }}
        >
          {/* Copy */}
          <motion.div
            className="flex flex-col gap-7"
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          >
            {/* Eyebrow */}
            <span
              className="inline-flex items-center gap-2 w-fit rounded-full px-4 py-[5px]"
              style={{
                fontSize: "10.5px",
                fontWeight: 700,
                letterSpacing: "0.22em",
                textTransform: "uppercase",
                color: "#8B3FD6",
                border: "1px solid rgba(139,63,214,0.22)",
                background: "rgba(139,63,214,0.05)",
              }}
            >
              <span
                className="w-[6px] h-[6px] rounded-full flex-shrink-0"
                style={{ background: "#8B3FD6" }}
              />
              CLOSE-PREDICT™ · Mentoría high-ticket
            </span>

            {/* Main title */}
            <h1
              className="hero-title-gradient"
              style={{
                fontSize: "clamp(48px, 6vw, 96px)",
                fontWeight: 900,
                lineHeight: 1.03,
                letterSpacing: "-0.02em",
              }}
            >
              TU NEGOCIO NO TIENE UN PROBLEMA DE VENTAS.
              <br />
              TIENE UN PROBLEMA DE{" "}
              <span className="sistema-word">SISTEMA.</span>
            </h1>

            {/* Subtitle */}
            <p style={{ fontSize: "15.5px", lineHeight: 1.85, color: "#64748B", maxWidth: "460px" }}>
              Transformo ventas que dependen del dueño en un{" "}
              <strong style={{ color: "#1E0A33", fontWeight: 600 }}>
                sistema comercial predecible
              </strong>{" "}
              y escalable en 12 semanas.
            </p>

            {/* SOBRE MÍ button */}
            <button
              onClick={scrollToSobreMi}
              className="relative overflow-hidden text-white font-black uppercase cursor-pointer w-fit"
              style={{
                height: "48px",
                padding: "0 48px",
                borderRadius: "100px",
                background: "#8B3FD6",
                fontSize: "14px",
                letterSpacing: "0.1em",
                border: "none",
                boxShadow: "0 0 30px rgba(139,63,214,0.6)",
              }}
            >
              <span className="relative z-10">SOBRE MÍ</span>
              <motion.span
                aria-hidden
                className="pointer-events-none absolute inset-0 -skew-x-12"
                style={{
                  background:
                    "linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.3) 50%, transparent 100%)",
                }}
                animate={{ x: ["-120%", "220%"] }}
                transition={{ duration: 1.0, repeat: Infinity, repeatDelay: 2.0, ease: "linear" }}
              />
            </button>
          </motion.div>

          {/* Canvas */}
          <motion.div
            className="flex items-center justify-center"
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1.0, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
          >
            <div
              className="relative w-full cursor-crosshair"
              style={{ maxWidth: "480px", aspectRatio: "5/6.5" }}
            >
              <canvas
                ref={canvasRef}
                aria-label="Embudo de ventas interactivo CLOSE-PREDICT™"
                className="absolute inset-0 w-full h-full block"
              />
            </div>
          </motion.div>
        </div>
      </section>
    </>
  );
}
