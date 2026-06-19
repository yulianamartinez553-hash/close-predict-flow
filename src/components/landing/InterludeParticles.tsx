import { useEffect, useRef } from "react";

/* ── PALETA ──────────────────────────────────────────────────── */
const COLORS = ["#8B3FD6", "#9D4EDD", "#F4C430", "#FFFFFF", "#C9C5D1"];

interface Pt {
  x: number; y: number;
  vx: number; vy: number; // vy negativo → sube
  size: number;
  alpha: number;
  decay: number;
  color: string;
}

function spawnPt(x: number, y: number): Pt {
  return {
    x: x + (Math.random() - 0.5) * 24,
    y: y + (Math.random() - 0.5) * 24,
    vx: (Math.random() - 0.5) * 1.6,
    vy: -(1.0 + Math.random() * 1.8),    // deriva hacia arriba
    size: 2 + Math.random() * 4,
    alpha: 0.65 + Math.random() * 0.35,
    decay: 0.007 + Math.random() * 0.009,
    color: COLORS[Math.floor(Math.random() * COLORS.length)],
  };
}

export function InterludeParticles() {
  const sectionRef = useRef<HTMLElement>(null);
  const canvasRef  = useRef<HTMLCanvasElement>(null);
  const ptsRef     = useRef<Pt[]>([]);
  const rafRef     = useRef(0);
  const runningRef = useRef(false);
  const visibleRef = useRef(true);
  /* 30 FPS limit */
  const lastRef    = useRef(0);
  const INTERVAL   = 1000 / 30;

  useEffect(() => {
    const section = sectionRef.current;
    const canvas  = canvasRef.current;
    if (!section || !canvas) return;
    const ctx = canvas.getContext("2d")!;

    /* Ajustar tamaño del canvas a la sección */
    const resize = () => {
      canvas.width  = section.offsetWidth;
      canvas.height = section.offsetHeight;
    };
    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(section);

    /* ── Loop de animación (30 fps) ─────────────────────────────
       Reglas de rendimiento:
       1. Frame-limiting a 30 FPS con INTERVAL check.
       2. Pausa cuando la sección no está en viewport (visibleRef).
       3. Pausa cuando la pestaña está inactiva (document.hidden).
       4. El loop se DETIENE solo cuando no quedan partículas.
    ────────────────────────────────────────────────────────────── */
    function loop(now: number) {
      /* Pausa si no visible o pestaña oculta — pero mantiene el RAF
         para reanudar automáticamente cuando vuelva a ser visible */
      if (!visibleRef.current || document.hidden) {
        rafRef.current = requestAnimationFrame(loop);
        return;
      }

      const delta = now - lastRef.current;
      if (delta < INTERVAL) {
        rafRef.current = requestAnimationFrame(loop);
        return;
      }
      lastRef.current = now - (delta % INTERVAL);

      ctx.clearRect(0, 0, canvas.width, canvas.height);

      /* Actualizar y dibujar partículas vivas */
      ptsRef.current = ptsRef.current.filter(p => p.alpha > 0.015);
      ptsRef.current.forEach(p => {
        p.x += p.vx;
        p.y += p.vy;
        p.alpha -= p.decay;
        ctx.save();
        ctx.globalAlpha = Math.max(0, p.alpha);
        ctx.fillStyle = p.color;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size / 2, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      });

      /* Detener el loop cuando no quedan partículas */
      if (ptsRef.current.length === 0) {
        runningRef.current = false;
        return;
      }
      rafRef.current = requestAnimationFrame(loop);
    }

    function startLoop() {
      if (runningRef.current) return;
      runningRef.current = true;
      lastRef.current = performance.now();
      rafRef.current = requestAnimationFrame(loop);
    }

    /* Generar partículas solo al mover el mouse */
    const onMouseMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const n = 2 + Math.floor(Math.random() * 2);
      for (let i = 0; i < n; i++) ptsRef.current.push(spawnPt(x, y));
      startLoop();
    };
    section.addEventListener("mousemove", onMouseMove, { passive: true });

    /* Pausar cuando la sección sale del viewport */
    const io = new IntersectionObserver(
      ([e]) => { visibleRef.current = e.isIntersecting; },
      { threshold: 0 }
    );
    io.observe(section);

    /* visibilitychange ya se maneja en el loop con document.hidden */
    return () => {
      cancelAnimationFrame(rafRef.current);
      ro.disconnect();
      io.disconnect();
      section.removeEventListener("mousemove", onMouseMove);
    };
  }, []);

  return (
    <section
      ref={sectionRef}
      style={{
        position: "relative",
        minHeight: "72vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "radial-gradient(ellipse at center, #2B1142 0%, #1E0A33 100%)",
        overflow: "hidden",
      }}
    >
      {/* Canvas de partículas — pointer-events:none para no bloquear el texto */}
      <canvas
        ref={canvasRef}
        style={{
          position: "absolute", inset: 0,
          pointerEvents: "none",
          width: "100%", height: "100%",
        }}
      />

      {/* Título — movido desde Sistema() */}
      <div
        style={{
          position: "relative", zIndex: 1,
          textAlign: "center",
          padding: "0 clamp(1.5rem, 6vw, 4rem)",
          maxWidth: "56rem", margin: "0 auto",
        }}
      >
        <p style={{
          fontFamily: "'Montserrat', system-ui, sans-serif",
          fontWeight: 600, fontSize: "11px",
          textTransform: "uppercase", letterSpacing: "0.3em",
          color: "#8B3FD6", marginBottom: "1.5rem",
        }}>
          CLOSE-PREDICT™ · 5 fases · 12 semanas
        </p>

        <h2 style={{
          fontFamily: "'Cormorant Garamond', Georgia, serif",
          fontWeight: 700,
          fontSize: "clamp(2rem, 5vw, 3.75rem)",
          lineHeight: 1.1,
          color: "#ffffff",
          letterSpacing: "-0.01em",
        }}>
          Un sistema comercial delegable y{" "}
          <em style={{ fontStyle: "normal", color: "#F4C430" }}>predecible</em>
          , en 12 semanas.
        </h2>
      </div>
    </section>
  );
}
