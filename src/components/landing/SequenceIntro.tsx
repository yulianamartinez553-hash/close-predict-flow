import { useState, useEffect, useRef, useCallback } from "react";
import { motion } from "framer-motion";
import { useReducedMotion } from "@/lib/use-reduced-motion";

/* ─────────────────────────────────────────────────────────────────
   TIPOS
───────────────────────────────────────────────────────────────── */
interface Props { onComplete: () => void }
type Phase = "idle" | "smoke-accel" | "contracting" | "traveling" | "done";

/* ─────────────────────────────────────────────────────────────────
   UTILIDADES
───────────────────────────────────────────────────────────────── */
const sleep = (ms: number) => new Promise<void>(r => setTimeout(r, ms));

const CHAR_COUNT = 13; // C l o s e P r e d i c t ®

/* Clip-path del embudo — revela barra a barra desde arriba */
const FUNNEL_CLIPS = [
  "inset(0% 0% 69% 0%)",
  "inset(0% 0% 46% 0%)",
  "inset(0% 0% 27% 0%)",
  "inset(0% 0% 0%  0%)",
];

/* ─────────────────────────────────────────────────────────────────
   FLECHA SVG — misma geometría que barra superior del embudo real
───────────────────────────────────────────────────────────────── */
function ArrowSVG() {
  return (
    <svg viewBox="0 0 342 65" xmlns="http://www.w3.org/2000/svg"
      style={{ width: 110, height: "auto", display: "block", overflow: "visible" }}>
      <defs>
        <linearGradient id="aFg" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%"   stopColor="#2D0057"/>
          <stop offset="45%"  stopColor="#6B00B6"/>
          <stop offset="100%" stopColor="#A855F7"/>
        </linearGradient>
        <filter id="aGlow" x="-30%" y="-60%" width="160%" height="220%">
          <feGaussianBlur stdDeviation="7" result="b" in="SourceGraphic"/>
          <feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge>
        </filter>
      </defs>
      <path d="M 0,18 L 0,65 Q 150,61 300,47 L 342,8 L 300,23 Q 150,25 0,18 Z"
        fill="url(#aFg)" filter="url(#aGlow)"/>
      <path d="M 0,18 L 0,65 Q 150,61 300,47 L 342,8 L 300,23 Q 150,25 0,18 Z"
        fill="rgba(255,255,255,0.13)"/>
    </svg>
  );
}

/* ─────────────────────────────────────────────────────────────────
   OPCIONES DE HUMO tsParticles
───────────────────────────────────────────────────────────────── */
const SMOKE_OPTIONS = {
  fullScreen: false,
  background: { color: { value: "transparent" } },
  particles: {
    number: { value: 0 },
    color: { value: ["#7C3AED", "#A855F7", "#6D28D9", "#4C1080"] },
    shape: { type: "circle" },
    opacity: {
      value: { min: 0.04, max: 0.45 },
      animation: { enable: true, speed: 0.5, sync: false },
    },
    size: { value: { min: 45, max: 125 } },
    move: {
      enable: true,
      speed: { min: 0.4, max: 1.6 },
      direction: "top" as const,
      outModes: { default: "destroy" as const, top: "destroy" as const },
      random: true,
    },
  },
  emitters: {
    position: { x: 50, y: 90 },
    rate: { quantity: 2, delay: 0.35 },
  },
  detectRetina: true,
};

/* ─────────────────────────────────────────────────────────────────
   COMPONENTE PRINCIPAL
───────────────────────────────────────────────────────────────── */
export function SequenceIntro({ onComplete }: Props) {
  const reduced = useReducedMotion();
  const [phase,      setPhase]      = useState<Phase>("idle");
  const [overlayOut, setOverlayOut] = useState(false);

  const particlesRef    = useRef<any>(null);
  const titleRef        = useRef<HTMLHeadingElement>(null);
  const arrowRef        = useRef<HTMLDivElement>(null);
  const trailCanvasRef  = useRef<HTMLCanvasElement>(null);

  /* Bloquear scroll */
  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = ""; };
  }, []);

  /* ── Inicializar humo + revelar texto con Splitting.js ── */
  useEffect(() => {
    if (reduced) return;
    let destroyed = false;

    const run = async () => {
      /* 1. tsParticles smoke */
      try {
        const { tsParticles } = await import("@tsparticles/engine");
        const { loadSlim }    = await import("@tsparticles/slim");
        await loadSlim(tsParticles);

        if (!destroyed) {
          const pc = await tsParticles.load({ id: "cp-smoke", options: SMOKE_OPTIONS as any });
          particlesRef.current = pc;
        }
      } catch (e) { /* humo no crítico */ }

      /* 2. Esperar 800ms → revelar texto letra a letra */
      await sleep(800);
      if (destroyed) return;

      try {
        const [gsapMod, splitMod] = await Promise.all([
          import("gsap"),
          // eslint-disable-next-line @typescript-eslint/ban-ts-comment
          // @ts-ignore — tipos de splitting no incluidos
          import("splitting"),
        ]);

        const gsap      = (gsapMod as any).gsap ?? (gsapMod as any).default ?? gsapMod;
        const Splitting = (splitMod  as any).default ?? splitMod;

        if (titleRef.current && !destroyed) {
          /* Splitting envuelve cada char en <span class="char"> */
          Splitting({ target: titleRef.current });
          const chars = Array.from(titleRef.current.querySelectorAll(".char"));

          gsap.fromTo(
            chars,
            { opacity: 0, filter: "blur(10px)", y: 16 },
            {
              opacity: 1, filter: "blur(0px)", y: 0,
              duration: 0.38, stagger: 0.028, ease: "power3.out",
              onComplete() {
                const sub = document.getElementById("cp-subtitle");
                const btn = document.getElementById("cp-btn");
                if (sub) gsap.to(sub, { opacity: 1, y: 0, duration: 0.5,        ease: "power2.out" });
                if (btn) gsap.to(btn, { opacity: 1, y: 0, duration: 0.5, delay: 0.15, ease: "power2.out" });
              },
            }
          );
        }
      } catch (e) {
        /* Fallback: mostrar todo inmediatamente */
        if (titleRef.current) (titleRef.current as HTMLElement).style.opacity = "1";
        ["cp-subtitle","cp-btn"].forEach(id => {
          const el = document.getElementById(id);
          if (el) { el.style.opacity = "1"; el.style.transform = "none"; }
        });
      }
    };

    run();
    return () => {
      destroyed = true;
      try { particlesRef.current?.destroy?.(); } catch (_) {}
      particlesRef.current = null;
    };
  }, [reduced]);

  /* ── SECUENCIA AL HACER CLIC ── */
  const startTransition = useCallback(async () => {
    if (phase !== "idle") return;

    /* 3A — Acelerar humo 300ms */
    setPhase("smoke-accel");
    try {
      const pc = particlesRef.current;
      if (pc?.options?.particles?.move) {
        pc.options.particles.move.speed = { min: 3, max: 7 };
        if (pc.options.emitters) {
          pc.options.emitters.rate = { quantity: 5, delay: 0.08 };
        }
        await pc.refresh();
      }
    } catch (_) {}

    await sleep(320);

    /* Destruir humo antes de contraer */
    try { particlesRef.current?.destroy?.(); } catch (_) {}
    particlesRef.current = null;

    /* FASE 1 — Contracción del fondo (1.25s) */
    setPhase("contracting");
    await sleep(1280);

    /* FASE 2 — Vuelo de la flecha */
    setPhase("traveling");

    const gsapMod = await import("gsap");
    const gsap    = (gsapMod as any).gsap ?? (gsapMod as any).default ?? gsapMod;
    const { MotionPathPlugin } = await import("gsap/MotionPathPlugin");
    gsap.registerPlugin(MotionPathPlugin);

    /* Canvas de estela */
    const canvas = trailCanvasRef.current;
    if (canvas) {
      canvas.width  = window.innerWidth;
      canvas.height = window.innerHeight;
    }
    const ctx = canvas?.getContext("2d") ?? null;

    /* Posición real del embudo en el Hero */
    const funnelEl   = document.getElementById("cp-funnel-img") as HTMLImageElement | null;
    const funnelRect = funnelEl?.getBoundingClientRect();
    const funnelTX   = funnelRect ? funnelRect.left + funnelRect.width  * 0.40 : window.innerWidth  * 0.22;
    const funnelTY   = funnelRect ? funnelRect.top  + funnelRect.height * 0.12 : window.innerHeight * 0.45;

    /* Posiciones X de cada carácter del Hero */
    const charXPos: number[] = Array.from({ length: CHAR_COUNT }, (_, i) => {
      const el = document.getElementById(`cp-char-${i}`);
      if (!el) return window.innerWidth * (0.55 + i * 0.015);
      const r = el.getBoundingClientRect();
      return r.left + r.width / 2;
    });

    const vw = window.innerWidth;
    const vh = window.innerHeight;

    const arrowEl = arrowRef.current;
    if (!arrowEl) return;

    gsap.set(arrowEl, {
      xPercent: -50, yPercent: -50,
      x: vw * 0.5, y: vh * 0.5,
      opacity: 1, rotation: 0,
    });

    /* RAF de estela */
    const trail: { x: number; y: number; t: number }[] = [];
    let rafId = 0;

    function drawTrail() {
      if (!ctx || !canvas) return;
      ctx.fillStyle = "rgba(8,3,15,0.35)";
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      const now = Date.now();
      for (const p of trail) {
        const age = (now - p.t) / 300;
        if (age >= 1) continue;
        ctx.globalAlpha = 0.10 * (1 - age);
        ctx.fillStyle   = "#7C3AED";
        ctx.beginPath();
        ctx.arc(p.x, p.y, 5 * (1 - age * 0.6), 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.globalAlpha = 1;
      let i = 0;
      while (i < trail.length && now - trail[i].t > 300) i++;
      if (i > 0) trail.splice(0, i);
      rafId = requestAnimationFrame(drawTrail);
    }
    drawTrail();

    /* Revelado de letras */
    const revealed = new Set<number>();
    function revealChar(idx: number) {
      if (revealed.has(idx)) return;
      revealed.add(idx);
      const el = document.getElementById(`cp-char-${idx}`);
      if (!el) return;
      gsap.to(el, { opacity: 1, filter: "blur(0px)", y: 0, duration: 0.35, ease: "power2.out", overwrite: "auto" });
    }

    /* Timeline principal */
    const tl = gsap.timeline({
      async onComplete() {
        cancelAnimationFrame(rafId);
        if (ctx && canvas) ctx.clearRect(0, 0, canvas.width, canvas.height);

        /* Fusión: flecha → 0, embudo → 1 (simultáneo 200ms) */
        if (arrowEl) gsap.to(arrowEl, { opacity: 0, duration: 0.2, ease: "power1.in" });
        if (funnelEl) {
          gsap.to(funnelEl, { opacity: 1, duration: 0.2, ease: "power1.out" });
          await sleep(210);
          /* Revelar barras 2 → 3 → 4 via clip-path sobre la imagen real */
          gsap.to(funnelEl, { clipPath: FUNNEL_CLIPS[1], duration: 0.28, ease: "power2.out" });
          await sleep(165);
          gsap.to(funnelEl, { clipPath: FUNNEL_CLIPS[2], duration: 0.28, ease: "power2.out" });
          await sleep(165);
          gsap.to(funnelEl, {
            clipPath: FUNNEL_CLIPS[3], duration: 0.28, ease: "power2.out",
            onComplete: () => gsap.set(funnelEl, { clearProps: "clipPath" }),
          });
        }

        /* Tagline */
        await sleep(190);
        const tagEl = document.getElementById("cp-tagline");
        if (tagEl) gsap.to(tagEl, { opacity: 1, duration: 0.45, ease: "power2.out" });

        /* Disolver overlay */
        await sleep(520);
        setOverlayOut(true);
        await sleep(700);
        setPhase("done");
        onComplete();
      },
    });

    /* Trayectoria Bézier de 6 waypoints */
    tl.to(arrowEl, {
      duration: 3.3,
      ease: "power2.inOut",
      motionPath: {
        path: [
          { x: vw * 0.50, y: vh * 0.50 },
          { x: vw * 0.18, y: 20         },
          { x: vw * 0.78, y: 18         },
          { x: vw * 0.84, y: vh * 0.12  },
          { x: vw * 0.62, y: vh * 0.48  },
          { x: funnelTX,  y: funnelTY   },
        ],
        curviness: 1.5,
        autoRotate: true,
        type: "thru",
      },
      onUpdate() {
        const rect = arrowEl.getBoundingClientRect();
        const ax = rect.left + rect.width  / 2;
        const ay = rect.top  + rect.height / 2;
        trail.push({ x: ax, y: ay, t: Date.now() });
        for (let i = 0; i < CHAR_COUNT; i++) {
          if (ax >= charXPos[i] - 28) revealChar(i);
        }
      },
    });
  }, [phase, onComplete]);

  /* ── RENDER ── */
  if (phase === "done") return null;

  const isIdle       = phase === "idle" || phase === "smoke-accel";
  const isContracting = phase === "contracting";

  return (
    <div
      className="fixed inset-0 z-[200] overflow-hidden"
      style={{
        opacity:    overlayOut ? 0 : 1,
        transition: overlayOut ? "opacity 0.65s ease" : "none",
        pointerEvents: overlayOut ? "none" : "auto",
      }}
    >
      {/* ── Fondo violeta — se contrae en FASE 1 ── */}
      {(isIdle || isContracting) && (
        <motion.div
          aria-hidden
          style={{
            position: "absolute", inset: 0, zIndex: 1,
            background: "linear-gradient(160deg, #2B1142 0%, #1E0A33 100%)",
          }}
          initial={{ clipPath: "inset(0% 0% round 0%)" }}
          animate={isContracting ? { clipPath: "inset(50% 50% round 50%)" } : undefined}
          transition={isContracting ? { duration: 1.2, ease: [0.7, 0, 0.84, 0] } : undefined}
        />
      )}

      {/* ── Humo tsParticles — siempre en DOM, opacity controla visibilidad ── */}
      <div
        id="cp-smoke"
        aria-hidden
        style={{
          position: "absolute", inset: 0, zIndex: 0,
          filter:     "blur(28px)",
          opacity:    isIdle ? 0.75 : 0,
          transition: "opacity 0.45s ease",
          pointerEvents: "none",
        }}
      />

      {/* ── Contenido de la intro ── */}
      <div
        style={{
          position: "absolute", inset: 0, zIndex: 2,
          display: "flex", flexDirection: "column",
          alignItems: "center", justifyContent: "center",
          textAlign: "center", padding: "0 2rem",
          opacity:    isIdle ? 1 : 0,
          transition: "opacity 0.35s ease",
          pointerEvents: isIdle ? "auto" : "none",
        }}
      >
        {/* Título — Splitting.js lo descompone en .char spans */}
        <h1
          ref={titleRef}
          id="intro-title"
          style={{
            color: "#fff",
            fontSize: "clamp(36px, 5.5vw, 66px)",
            fontWeight: 900, lineHeight: 1.08, letterSpacing: "-0.02em",
            maxWidth: 820,
            opacity: 0, /* GSAP lo revela letra a letra */
          }}
        >
          ¿TUS VENTAS DEPENDEN SOLO DE VOS?
        </h1>

        <p
          id="cp-subtitle"
          style={{
            marginTop: "1.6rem",
            fontSize: "clamp(15px, 1.55vw, 20px)",
            color: "rgba(255,255,255,0.62)", lineHeight: 1.65, maxWidth: 560,
            opacity: 0, transform: "translateY(12px)", /* GSAP revela */
          }}
        >
          Te llegan clientes, pero el proceso es un caos<br/>
          y todo termina en tus manos.
        </p>

        <button
          id="cp-btn"
          onClick={startTransition}
          style={{
            marginTop: "2.8rem",
            padding: "16px 44px", borderRadius: "100px",
            fontFamily: "'Montserrat','Inter',sans-serif",
            fontWeight: 900, fontSize: "15px",
            letterSpacing: "0.06em", textTransform: "uppercase", color: "#fff",
            background: "linear-gradient(135deg, #6B00B6, #A855F7)",
            boxShadow: "0 0 28px rgba(124,58,237,0.55)",
            border: "none", cursor: "pointer",
            opacity: 0, transform: "translateY(12px)", /* GSAP revela */
            position: "relative", overflow: "hidden",
          }}
        >
          Entrá y mirá cómo cambia eso
        </button>
      </div>

      {/* ── Canvas de estela ── */}
      <canvas
        ref={trailCanvasRef}
        aria-hidden
        style={{
          position: "fixed", inset: 0,
          pointerEvents: "none", zIndex: 3,
          opacity: phase === "traveling" ? 1 : 0,
          transition: "opacity 0.2s",
        }}
      />

      {/* ── Flecha — único elemento, vive todo el viaje ── */}
      <div
        ref={arrowRef}
        id="arrow-hero"
        aria-hidden
        style={{
          position: "fixed", top: 0, left: 0,
          opacity: 0, pointerEvents: "none",
          zIndex: 4, willChange: "transform",
        }}
      >
        <ArrowSVG />
      </div>
    </div>
  );
}
