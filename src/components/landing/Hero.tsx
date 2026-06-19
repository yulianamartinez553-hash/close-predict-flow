import { useEffect, useRef } from "react";

interface Pt {
  ox: number; oy: number;
  x: number; y: number;
  vx: number; vy: number;
  r: number; alpha: number;
}

function initFunnel(canvas: HTMLCanvasElement): () => void {
  const ctx = canvas.getContext("2d")!;
  canvas.width = 500;
  canvas.height = 650;

  const isMob = () => window.innerWidth < 900;
  const REDUCED = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const R = 72, STR = 5.8, SP = 0.07, DM = 0.83;

  let pts: Pt[] = [];
  let pcs: number[][] = [];
  let mx = -9999, my = -9999;
  let rafId = 0;

  function build() {
    pts = [];
    const W = 500, H = 650, cx = 250, m = isMob();
    pcs = [
      [H * 0.04, H * 0.23, W * 0.86, W * 0.68, m ? 480 : 1150],
      [H * 0.27, H * 0.46, W * 0.64, W * 0.50, m ? 360 : 870],
      [H * 0.50, H * 0.66, W * 0.46, W * 0.35, m ? 240 : 590],
      [H * 0.70, H * 0.84, W * 0.32, W * 0.21, m ? 140 : 370],
    ];
    pcs.forEach(([yT, yB, wT, wB, n]) => {
      for (let i = 0; i < n; i++) {
        const t = Math.random();
        const y = yT + t * (yB - yT);
        const w = wT + t * (wB - wT);
        const x = cx - w / 2 + Math.random() * w;
        pts.push({
          ox: x, oy: y,
          x: x + (Math.random() - 0.5) * 3,
          y: y + (Math.random() - 0.5) * 3,
          vx: 0, vy: 0,
          r: 1.4 + Math.random() * 1.4,
          alpha: 0.5 + Math.random() * 0.5,
        });
      }
    });
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
    const cx = 250;
    ctx.clearRect(0, 0, 500, 650);
    pcs.forEach(([yT, yB, wT, wB]) => {
      const x1 = cx - wT / 2, x2 = cx + wT / 2, x3 = cx + wB / 2, x4 = cx - wB / 2;
      ctx.save();
      const g = ctx.createLinearGradient(0, yT, 0, yB);
      g.addColorStop(0, "rgba(255,255,255,.58)");
      g.addColorStop(1, "rgba(237,233,254,.22)");
      ctx.fillStyle = g;
      ctx.shadowOffsetY = 10; ctx.shadowBlur = 26; ctx.shadowColor = "rgba(0,0,0,.07)";
      ctx.beginPath();
      ctx.moveTo(x1, yT); ctx.lineTo(x2, yT); ctx.lineTo(x3, yB); ctx.lineTo(x4, yB);
      ctx.closePath(); ctx.fill();
      ctx.shadowOffsetY = 0; ctx.shadowBlur = 22; ctx.shadowColor = "rgba(124,58,237,.28)";
      ctx.strokeStyle = "rgba(124,58,237,.11)"; ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(x1, yT); ctx.lineTo(x2, yT); ctx.lineTo(x3, yB); ctx.lineTo(x4, yB);
      ctx.closePath(); ctx.stroke();
      ctx.shadowBlur = 14; ctx.shadowColor = "#7C3AED"; ctx.strokeStyle = "#7C3AED"; ctx.lineWidth = 2.8;
      ctx.beginPath(); ctx.moveTo(x1, yT); ctx.lineTo(x2, yT); ctx.stroke();
      ctx.restore();
    });
    ctx.save();
    ctx.strokeStyle = "#7C3AED"; ctx.lineWidth = 1.1;
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

  build();

  const onMouseMove = (e: MouseEvent) => {
    const r = canvas.getBoundingClientRect();
    mx = (e.clientX - r.left) * (500 / r.width);
    my = (e.clientY - r.top) * (650 / r.height);
  };
  const onTouchMove = (e: TouchEvent) => {
    const r = canvas.getBoundingClientRect();
    mx = (e.touches[0].clientX - r.left) * (500 / r.width);
    my = (e.touches[0].clientY - r.top) * (650 / r.height);
  };
  const onLeave = () => { mx = -9999; my = -9999; };

  canvas.addEventListener("mousemove", onMouseMove, { passive: true });
  canvas.addEventListener("touchmove", onTouchMove, { passive: true });
  canvas.addEventListener("mouseleave", onLeave);
  canvas.addEventListener("touchend", onLeave);

  let resizeTimer: ReturnType<typeof setTimeout>;
  const onResize = () => { clearTimeout(resizeTimer); resizeTimer = setTimeout(build, 200); };
  window.addEventListener("resize", onResize);

  rafId = requestAnimationFrame(loop);

  return () => {
    cancelAnimationFrame(rafId);
    canvas.removeEventListener("mousemove", onMouseMove);
    canvas.removeEventListener("touchmove", onTouchMove);
    canvas.removeEventListener("mouseleave", onLeave);
    canvas.removeEventListener("touchend", onLeave);
    window.removeEventListener("resize", onResize);
    clearTimeout(resizeTimer);
  };
}

export function Hero() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (!canvasRef.current) return;
    return initFunnel(canvasRef.current);
  }, []);

  return (
    <section className="relative min-h-screen" style={{ background: "#fff" }}>
      {/* Nav */}
      <nav
        className="fixed top-0 left-0 right-0 z-[100] flex items-center justify-between px-6 py-[18px] md:px-[72px]"
        style={{
          background: "rgba(255,255,255,.88)",
          backdropFilter: "blur(14px)",
          borderBottom: "1px solid rgba(124,58,237,.08)",
        }}
      >
        <a
          href="#"
          className="no-underline"
          style={{ fontFamily: "var(--font-serif)", fontSize: "22px", fontWeight: 700, color: "#1E0A33" }}
        >
          Caro <em style={{ fontStyle: "italic", color: "#7C3AED" }}>Chaparro</em>
        </a>
        <ul className="hidden md:flex gap-7 list-none m-0 p-0" style={{ fontSize: "13px", fontWeight: 500, color: "#64748B" }}>
          {[
            { href: "#about", label: "Sobre mí" },
            { href: "#fases", label: "Sistema" },
            { href: "#testimonios", label: "Testimonios" },
            { href: "#no-momento", label: "Recursos" },
          ].map(({ href, label }) => (
            <li key={href}>
              <a href={href} className="no-underline transition-colors hover:text-[#1E0A33]" style={{ color: "inherit" }}>
                {label}
              </a>
            </li>
          ))}
        </ul>
        <a
          href="/diagnostico.html"
          className="hidden md:inline-block no-underline"
          style={{
            padding: "8px 22px",
            border: "1.5px solid rgba(124,58,237,.35)",
            borderRadius: "100px",
            fontSize: "13px",
            fontWeight: 600,
            color: "#7C3AED",
          }}
        >
          Agendar
        </a>
      </nav>

      {/* Hero grid */}
      <div
        className="mx-auto grid grid-cols-1 lg:grid-cols-2 gap-14 items-center px-6 lg:px-[72px] pt-[152px] pb-24"
        style={{ maxWidth: "1280px" }}
      >
        {/* Copy */}
        <div className="flex flex-col gap-7">
          <span
            className="inline-flex items-center gap-2 text-[10.5px] font-bold uppercase w-fit px-4 py-[5px] rounded-full"
            style={{
              letterSpacing: ".22em",
              color: "#7C3AED",
              border: "1px solid rgba(124,58,237,.22)",
              background: "rgba(124,58,237,.05)",
            }}
          >
            <span className="w-[6px] h-[6px] rounded-full flex-shrink-0" style={{ background: "#7C3AED" }} />
            CLOSE-PREDICT™ · Mentoría high-ticket
          </span>

          <h1
            style={{
              fontFamily: "var(--font-serif)",
              fontSize: "clamp(32px,3.8vw,58px)",
              fontWeight: 700,
              lineHeight: 1.07,
              color: "#1E0A33",
            }}
          >
            Tu negocio no tiene<br />
            un problema de ventas.<br />
            Tiene un problema de{" "}
            <em
              style={{
                fontStyle: "normal",
                background: "linear-gradient(130deg,#7C3AED,#A78BFA)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
              }}
            >
              sistema.
            </em>
          </h1>

          <p style={{ fontSize: "15.5px", lineHeight: 1.85, color: "#64748B", maxWidth: "460px" }}>
            Transformo ventas que dependen del dueño en un{" "}
            <strong style={{ color: "#1E0A33", fontWeight: 600 }}>sistema comercial predecible</strong>{" "}
            y escalable en 12 semanas.
          </p>

          <a
            href="/diagnostico.html"
            className="inline-flex items-center gap-2 w-fit no-underline transition-transform hover:-translate-y-0.5"
            style={{
              padding: "14px 32px",
              background: "#7C3AED",
              color: "#fff",
              borderRadius: "100px",
              fontSize: "13.5px",
              fontWeight: 700,
              letterSpacing: ".04em",
              boxShadow: "0 8px 32px rgba(124,58,237,.38)",
            }}
          >
            Agendar diagnóstico estratégico →
          </a>
        </div>

        {/* Canvas funnel */}
        <div className="flex items-center justify-center">
          <div className="relative w-full" style={{ maxWidth: "480px", aspectRatio: "5/6.5" }}>
            <canvas
              ref={canvasRef}
              aria-label="Embudo de ventas interactivo CLOSE-PREDICT™"
              className="absolute inset-0 w-full h-full block cursor-crosshair"
              style={{ filter: "drop-shadow(0 0 5px rgba(124,58,237,.42))" }}
            />
          </div>
        </div>
      </div>
    </section>
  );
}
