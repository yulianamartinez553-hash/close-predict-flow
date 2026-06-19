import { useEffect, useRef } from "react";
import { motion } from "framer-motion";

/* ═══════════════════════════════════════════════════════════════
   CANVAS PARTICLE FUNNEL  (portado de hero-v3.html)
   · Canvas lógico: 500 × 650
   · 4 piezas trapezoidales con 27 px de GAP entre sí
   · Cada pieza: vidrio + glow violeta + sombra flotante
   · Partículas: anillos morados con física spring + repulsión
═══════════════════════════════════════════════════════════════ */

const W = 500, H = 650, CX = 250;

/* Piezas: [yTop, yBot, wTop, wBot, n_desktop, n_mobile]
   Los gaps de 27 px entre piezas son explícitos en los valores de yTop/yBot */
const PIECES: [number, number, number, number, number, number][] = [
  [  26, 149, 430, 340,  900, 360 ],   // Pieza 1 (más ancha)
  [ 176, 299, 320, 250,  680, 270 ],   // gap 27 px ↑
  [ 326, 429, 230, 175,  460, 185 ],   // gap 27 px ↑
  [ 456, 546, 160, 105,  290, 115 ],   // gap 27 px ↑
];

interface Pt {
  ox: number; oy: number;
  x: number;  y: number;
  vx: number; vy: number;
  r: number;  alpha: number;
}

function buildParticles(mobile: boolean): Pt[] {
  const pts: Pt[] = [];
  PIECES.forEach(([yT, yB, wT, wB, nd, nm]) => {
    const n = mobile ? nm : nd;
    for (let i = 0; i < n; i++) {
      const t = Math.random();
      const y = yT + t * (yB - yT);
      const w = wT + t * (wB - wT);
      const x = CX - w / 2 + Math.random() * w;
      pts.push({
        ox: x, oy: y,
        x: x + (Math.random() - 0.5) * 3,
        y: y + (Math.random() - 0.5) * 3,
        vx: 0, vy: 0,
        r:     1.0 + Math.random() * 1.5,    // radio 1–2.5 px
        alpha: 0.45 + Math.random() * 0.55,
      });
    }
  });
  return pts;
}

function initFunnel(canvas: HTMLCanvasElement): () => void {
  const ctx = canvas.getContext("2d")!;
  const REDUCED = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* Física — cambiar aquí para ajustar el comportamiento:
     R   = radio de influencia del cursor (px)
     STR = fuerza de empuje
     SP  = velocidad de retorno al origen
     DM  = amortiguación (0.80 = más fricción, 0.90 = más deslizamiento) */
  const R = 70, STR = 6.5, SP = 0.065, DM = 0.82;

  let pts: Pt[] = [];
  let mx = -9999, my = -9999;
  let rafId = 0;

  function resize() {
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    canvas.width  = W * dpr;
    canvas.height = H * dpr;
    canvas.style.width  = "100%";
    canvas.style.height = "100%";
    ctx.scale(dpr, dpr);
  }

  function rebuild() {
    pts = buildParticles(window.innerWidth < 900);
  }

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
  }

  function draw() {
    ctx.clearRect(0, 0, W, H);

    /* ── Partículas (anillos morados) ── */
    ctx.save();
    ctx.strokeStyle = "#8B3FD6"; ctx.lineWidth = 1.2;
    pts.forEach(p => {
      ctx.globalAlpha = p.alpha;
      ctx.beginPath(); ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2); ctx.stroke();
    });
    ctx.restore();
  }

  function loop() {
    if (!REDUCED) update();
    draw();
    rafId = requestAnimationFrame(loop);
  }

  resize();
  rebuild();

  const onMouseMove = (e: MouseEvent) => {
    const r = canvas.getBoundingClientRect();
    mx = (e.clientX - r.left) * (W / r.width);
    my = (e.clientY - r.top)  * (H / r.height);
  };
  const onTouchMove = (e: TouchEvent) => {
    const r = canvas.getBoundingClientRect();
    mx = (e.touches[0].clientX - r.left) * (W / r.width);
    my = (e.touches[0].clientY - r.top)  * (H / r.height);
  };
  const onLeave = () => { mx = -9999; my = -9999; };

  canvas.addEventListener("mousemove",  onMouseMove,  { passive: true });
  canvas.addEventListener("touchmove",  onTouchMove,  { passive: true });
  canvas.addEventListener("mouseleave", onLeave);
  canvas.addEventListener("touchend",   onLeave);

  let resizeTimer: ReturnType<typeof setTimeout>;
  const onResize = () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => { resize(); rebuild(); }, 250);
  };
  window.addEventListener("resize", onResize);

  rafId = requestAnimationFrame(loop);

  return () => {
    cancelAnimationFrame(rafId);
    canvas.removeEventListener("mousemove",  onMouseMove);
    canvas.removeEventListener("touchmove",  onTouchMove);
    canvas.removeEventListener("mouseleave", onLeave);
    canvas.removeEventListener("touchend",   onLeave);
    window.removeEventListener("resize", onResize);
    clearTimeout(resizeTimer);
  };
}

/* ═══════════════════════════════════════════════════════════════
   NAV + COMPONENT
═══════════════════════════════════════════════════════════════ */

const NAV_LINKS = [
  { label: "Sobre mí",      href: "#sobre-mi" },
  { label: "Close Predict", href: "#sistema" },
  { label: "Recursos",      href: "#no-momento" },
  { label: "Contacto",      href: "#contacto" },
];

export function Hero() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (!canvasRef.current) return;
    return initFunnel(canvasRef.current);
  }, []);

  const scrollTo = (e: React.MouseEvent, id: string) => {
    e.preventDefault();
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <>
      {/* ── CSS keyframes inyectados una sola vez ── */}
      <style>{`
        @keyframes heroShine {
          0%   { background-position: -200% center; }
          30%  { background-position:  200% center; }
          100% { background-position:  200% center; }
        }
        .hero-title {
          background: linear-gradient(90deg,#8B3FD6 0%,#9D4EDD 35%,#c4b5fd 50%,#9D4EDD 65%,#8B3FD6 100%);
          background-size: 200% auto;
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          animation: heroShine 3s linear infinite;
        }
        .sistema-word {
          background: linear-gradient(90deg,#8B3FD6 0%,#9D4EDD 30%,#e9d5ff 50%,#9D4EDD 70%,#8B3FD6 100%);
          background-size: 200% auto;
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          animation: heroShine 3s linear infinite;
          filter: drop-shadow(0 0 8px rgba(139,63,214,.55));
        }
        .nav-pill {
          position: relative;
          color: #8B3FD6;
          font-size: 13.5px;
          font-weight: 500;
          text-decoration: none;
          padding-bottom: 2px;
        }
        .nav-pill::after {
          content: '';
          position: absolute;
          bottom: -2px; left: 0; right: 0;
          height: 1.5px;
          background: #8B3FD6;
          transform: scaleX(0);
          transform-origin: left;
          transition: transform 300ms ease;
        }
        .nav-pill:hover::after { transform: scaleX(1); }
        @media (prefers-reduced-motion: reduce) {
          .hero-title, .sistema-word { animation: none; -webkit-text-fill-color: #8B3FD6; }
        }
      `}</style>

      <section className="relative min-h-screen" style={{ background: "#fff" }}>

        {/* ── Navegación ── */}
        <nav
          className="fixed top-0 left-0 right-0 z-[100] flex items-center justify-between px-6 md:px-16 py-[18px]"
          style={{
            background: "rgba(255,255,255,.90)",
            backdropFilter: "blur(14px)",
            borderBottom: "1px solid rgba(139,63,214,.07)",
          }}
        >
          <a href="#" style={{ fontFamily: "var(--font-serif)", fontSize: "21px", fontWeight: 700, color: "#1E0A33", textDecoration: "none" }}>
            Caro <em style={{ fontStyle: "italic", color: "#8B3FD6" }}>Chaparro</em>
          </a>
          <div className="hidden md:flex items-center gap-8">
            {NAV_LINKS.map(({ label, href }) => (
              <a key={href} href={href} className="nav-pill" onClick={e => scrollTo(e, href.slice(1))}>
                {label}
              </a>
            ))}
            <a
              href="/diagnostico.html"
              style={{
                padding: "7px 22px",
                border: "1.5px solid rgba(139,63,214,.35)",
                borderRadius: "100px",
                fontSize: "13px",
                fontWeight: 600,
                color: "#8B3FD6",
                textDecoration: "none",
              }}
            >
              Agendar
            </a>
          </div>
        </nav>

        {/* ── Hero grid ── */}
        <div
          className="mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 items-center px-6 lg:px-[64px] pt-[148px] pb-24"
          style={{ maxWidth: "1280px" }}
        >
          {/* Columna texto */}
          <motion.div
            className="flex flex-col gap-7"
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          >
            <span
              className="inline-flex items-center gap-2 w-fit rounded-full px-4 py-[5px]"
              style={{
                fontSize: "10.5px", fontWeight: 700, letterSpacing: ".22em",
                textTransform: "uppercase", color: "#8B3FD6",
                border: "1px solid rgba(139,63,214,.22)",
                background: "rgba(139,63,214,.05)",
              }}
            >
              <span className="w-[6px] h-[6px] rounded-full flex-shrink-0" style={{ background: "#8B3FD6" }} />
              CLOSE-PREDICT™ · Mentoría high-ticket
            </span>

            <h1
              className="hero-title"
              style={{
                fontFamily: "var(--font-serif)",
                fontSize: "clamp(38px, 5vw, 72px)",
                fontWeight: 900,
                lineHeight: 1.05,
                letterSpacing: "-.015em",
              }}
            >
              TU NEGOCIO NO TIENE<br />
              UN PROBLEMA DE VENTAS.<br />
              TIENE UN PROBLEMA DE{" "}
              <span className="sistema-word">SISTEMA.</span>
            </h1>

            <p style={{ fontSize: "15.5px", lineHeight: 1.85, color: "#64748B", maxWidth: "450px" }}>
              Transformo ventas que dependen del dueño en un{" "}
              <strong style={{ color: "#1E0A33", fontWeight: 600 }}>sistema comercial predecible</strong>{" "}
              y escalable en 12 semanas.
            </p>

            {/* Botón SOBRE MÍ con shine continuo */}
            <button
              onClick={e => scrollTo(e as unknown as React.MouseEvent, "sobre-mi")}
              className="relative overflow-hidden text-white font-black uppercase w-fit"
              style={{
                height: 52,
                padding: "0 48px",
                borderRadius: "100px",
                background: "#8B3FD6",
                fontSize: "14px",
                letterSpacing: ".1em",
                border: "none",
                cursor: "pointer",
                boxShadow: "0 0 30px rgba(139,63,214,.6)",
              }}
            >
              <span className="relative z-10">SOBRE MÍ</span>
              <motion.span
                aria-hidden
                className="pointer-events-none absolute inset-0 -skew-x-12"
                style={{
                  background:
                    "linear-gradient(90deg,transparent 0%,rgba(255,255,255,.30) 50%,transparent 100%)",
                }}
                animate={{ x: ["-120%", "220%"] }}
                transition={{ duration: 1.0, repeat: Infinity, repeatDelay: 2.0, ease: "linear" }}
              />
            </button>
          </motion.div>

          {/* Columna canvas */}
          <motion.div
            className="flex items-center justify-center"
            initial={{ opacity: 0, scale: 0.97 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1.0, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
          >
            <div
              className="relative w-full cursor-crosshair"
              style={{ maxWidth: "480px", aspectRatio: "500/650" }}
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
