import { useState, useEffect, useCallback, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useReducedMotion } from "@/lib/use-reduced-motion";

/* ─────────────────────────────────────────────────────────────────
   TIPOS
───────────────────────────────────────────────────────────────── */
interface Props { onComplete: () => void }
type Phase = "idle" | "contracting" | "traveling" | "done";

/* ─────────────────────────────────────────────────────────────────
   CONSTANTES
───────────────────────────────────────────────────────────────── */
/* Partículas decorativas — seed estático (SSR safe) */
const PARTICLES = Array.from({ length: 38 }, (_, i) => ({
  id: i,
  x: ((i * 37 + 13) % 97) + 1.5,
  y: ((i * 53 + 7) % 95) + 2,
  size: 2 + (i % 3) * 1.5,
  duration: 3.5 + (i % 5) * 0.7,
  delay: (i % 8) * 0.35,
  opacity: 0.18 + (i % 5) * 0.07,
}));

/* IDs de los chars en el Hero: C(0) l(1) o(2) s(3) e(4) P(5) r(6) e(7) d(8) i(9) c(10) t(11) ®(12) */
const CHAR_COUNT = 13;

const sleep = (ms: number) => new Promise<void>(r => setTimeout(r, ms));

/* Clip-path del embudo por barra (inset desde abajo) */
const FUNNEL_CLIPS = [
  "inset(0% 0% 69% 0%)",  // solo barra 1 (arrow)
  "inset(0% 0% 46% 0%)",  // + barra 2
  "inset(0% 0% 27% 0%)",  // + barra 3
  "inset(0% 0% 0%  0%)",  // todo visible
];

/* ─────────────────────────────────────────────────────────────────
   PARTÍCULAS
───────────────────────────────────────────────────────────────── */
function BgParticles({ reduced }: { reduced: boolean }) {
  if (reduced) return null;
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden>
      {PARTICLES.map(p => (
        <motion.div
          key={p.id}
          className="absolute rounded-full"
          style={{ left: `${p.x}%`, top: `${p.y}%`, width: p.size, height: p.size, background: "#7C3AED", opacity: p.opacity }}
          animate={{ y: [0, -16, 0], opacity: [p.opacity, p.opacity * 2.2, p.opacity] }}
          transition={{ duration: p.duration, delay: p.delay, repeat: Infinity, ease: "easeInOut" }}
        />
      ))}
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────────
   FLECHA — misma geometría que la barra superior del logo
───────────────────────────────────────────────────────────────── */
function ArrowSVG() {
  return (
    <svg viewBox="0 0 342 65" xmlns="http://www.w3.org/2000/svg"
      style={{ width: 110, height: "auto", display: "block", overflow: "visible" }}
    >
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
   COMPONENTE PRINCIPAL
───────────────────────────────────────────────────────────────── */
export function SequenceIntro({ onComplete }: Props) {
  const reduced = useReducedMotion();
  const [screen, setScreen] = useState<0 | 1>(0);
  const [phase,  setPhase]  = useState<Phase>("idle");
  const [overlayOut, setOverlayOut] = useState(false);

  const arrowRef  = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const gsapTl    = useRef<{ kill(): void } | null>(null);

  /* Bloquear scroll */
  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "";
      gsapTl.current?.kill();
    };
  }, []);

  /* Teclado / wheel — solo en fase idle */
  const advance = useCallback(() => {
    if (phase !== "idle") return;
    if (screen === 0) { setScreen(1); return; }
    startTransition();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [screen, phase]);

  useEffect(() => {
    const k = (e: KeyboardEvent) => {
      if (["Enter"," ","ArrowDown","ArrowRight"].includes(e.key)) { e.preventDefault(); advance(); }
    };
    const w = (e: WheelEvent) => { if (e.deltaY > 20) advance(); };
    window.addEventListener("keydown", k);
    window.addEventListener("wheel", w, { passive: true });
    return () => { window.removeEventListener("keydown", k); window.removeEventListener("wheel", w); };
  }, [advance]);

  /* ── SECUENCIA DE TRANSICIÓN ── */
  const startTransition = useCallback(async () => {
    if (reduced) { onComplete(); return; }

    /* FASE 1: clip-path contrae el fondo violeta hacia el centro (1.2s) */
    setPhase("contracting");
    await sleep(1250);

    /* FASE 2: la flecha vuela — cargamos GSAP en cliente */
    setPhase("traveling");

    const gsapMod = await import("gsap");
    const gsap = (gsapMod as any).gsap ?? (gsapMod as any).default ?? gsapMod;
    const { MotionPathPlugin } = await import("gsap/MotionPathPlugin");
    gsap.registerPlugin(MotionPathPlugin);

    /* Canvas para la estela */
    const canvas = canvasRef.current;
    if (canvas) {
      canvas.width  = window.innerWidth;
      canvas.height = window.innerHeight;
    }
    const ctx = canvas?.getContext("2d") ?? null;

    /* Posición real del embudo en el Hero */
    const funnelEl = document.getElementById("cp-funnel-img") as HTMLImageElement | null;
    const funnelRect = funnelEl?.getBoundingClientRect();

    /* Centro de la barra superior del embudo = ~15% desde arriba del img */
    const funnelTargetX = funnelRect
      ? funnelRect.left + funnelRect.width  * 0.40
      : window.innerWidth  * 0.22;
    const funnelTargetY = funnelRect
      ? funnelRect.top  + funnelRect.height * 0.12
      : window.innerHeight * 0.45;

    /* Posiciones X de cada carácter para el revelado sincronizado */
    const charXPositions: number[] = Array.from({ length: CHAR_COUNT }, (_, i) => {
      const el = document.getElementById(`cp-char-${i}`);
      if (!el) return window.innerWidth * (0.55 + i * 0.015);
      const r = el.getBoundingClientRect();
      return r.left + r.width / 2;
    });

    const vw = window.innerWidth;
    const vh = window.innerHeight;

    /* Posición inicial de la flecha: centro de pantalla */
    const arrowEl = arrowRef.current;
    if (!arrowEl) return;
    gsap.set(arrowEl, { xPercent: -50, yPercent: -50, x: vw * 0.5, y: vh * 0.5, opacity: 1, rotation: 0 });

    /* Trail: puntos de posición con timestamp */
    const trail: { x: number; y: number; t: number }[] = [];
    let rafId = 0;

    function drawTrail() {
      if (!ctx || !canvas) return;
      /* Desvanecimiento semi-transparente en lugar de clearRect total */
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
      // limpiar puntos viejos
      let i = 0;
      while (i < trail.length && now - trail[i].t > 300) i++;
      if (i > 0) trail.splice(0, i);
      rafId = requestAnimationFrame(drawTrail);
    }
    drawTrail();

    /* Mapa de chars ya revelados */
    const revealed = new Set<number>();

    function revealChar(idx: number) {
      if (revealed.has(idx)) return;
      revealed.add(idx);
      const el = document.getElementById(`cp-char-${idx}`);
      if (!el) return;
      gsap.to(el, { opacity: 1, filter: "blur(0px)", y: 0, duration: 0.35, ease: "power2.out",
        overwrite: "auto" });
    }

    /* Timeline principal */
    const tl = gsap.timeline({
      onComplete: async () => {
        cancelAnimationFrame(rafId);
        if (ctx && canvas) ctx.clearRect(0, 0, canvas.width, canvas.height);

        /* Revelado simultáneo: flecha → opacity 0, embudo → opacity 1 */
        if (arrowEl) gsap.to(arrowEl, { opacity: 0, duration: 0.2, ease: "power1.in" });
        if (funnelEl) {
          gsap.to(funnelEl, { opacity: 1, duration: 0.2, ease: "power1.out" });

          /* Revelar barras 2 → 3 → 4 via clip-path */
          await sleep(200);
          gsap.to(funnelEl, { clipPath: FUNNEL_CLIPS[1], duration: 0.28, ease: "power2.out" });
          await sleep(165);
          gsap.to(funnelEl, { clipPath: FUNNEL_CLIPS[2], duration: 0.28, ease: "power2.out" });
          await sleep(165);
          gsap.to(funnelEl, { clipPath: FUNNEL_CLIPS[3], duration: 0.28, ease: "power2.out",
            onComplete: () => gsap.set(funnelEl, { clearProps: "clipPath" }) });
        }

        /* Revelar tagline */
        await sleep(180);
        const tagEl = document.getElementById("cp-tagline");
        if (tagEl) gsap.to(tagEl, { opacity: 1, duration: 0.45, ease: "power2.out" });

        /* Desvanecer overlay y llamar onComplete */
        await sleep(500);
        setOverlayOut(true);
        await sleep(650);
        setPhase("done");
        onComplete();
      },
    });
    gsapTl.current = tl as any;

    /*
     * Trayectoria de 6 waypoints (center de la flecha = xPercent:-50 yPercent:-50):
     * P0 centro → P1 tope izquierdo → P2 tope derecho →
     * P3 esquina superior derecha → P4 zona texto → P5 barra top del embudo
     */
    tl.to(arrowEl, {
      duration: 3.3,
      ease: "power2.inOut",
      motionPath: {
        path: [
          { x: vw * 0.50, y: vh * 0.50 },
          { x: vw * 0.18, y: 20 },
          { x: vw * 0.78, y: 18 },
          { x: vw * 0.84, y: vh * 0.12 },
          { x: vw * 0.62, y: vh * 0.48 },
          { x: funnelTargetX, y: funnelTargetY },
        ],
        curviness: 1.5,
        autoRotate: true,
        type: "thru",
      },
      onUpdate() {
        /* Estela */
        const rect = arrowEl.getBoundingClientRect();
        const ax = rect.left + rect.width  / 2;
        const ay = rect.top  + rect.height / 2;
        trail.push({ x: ax, y: ay, t: Date.now() });

        /* Revelar letras a medida que la flecha pasa sobre ellas */
        for (let i = 0; i < CHAR_COUNT; i++) {
          if (ax >= charXPositions[i] - 28) revealChar(i);
        }
      },
    });
  }, [reduced, onComplete]);

  /* ── OVERLAY DE TRANSICIÓN ── */
  if (phase !== "idle") {
    return (
      <div
        className="fixed inset-0 z-[200] overflow-hidden"
        style={{
          background: "#08030F",
          opacity: overlayOut ? 0 : 1,
          transition: overlayOut ? "opacity 0.65s ease" : "none",
          pointerEvents: overlayOut ? "none" : "auto",
        }}
      >
        {/* Fondo violeta que se contrae con clip-path iris */}
        <motion.div
          aria-hidden
          initial={{ clipPath: "inset(0% 0% round 0%)" }}
          animate={{ clipPath: "inset(50% 50% round 50%)" }}
          transition={{ duration: 1.2, ease: [0.7, 0, 0.84, 0] }}
          style={{
            position: "absolute", inset: 0,
            background: "radial-gradient(ellipse at center, #3D1A7A 0%, #2B1142 50%, #1A0A2B 100%)",
          }}
        />

        {/* Canvas de estela */}
        <canvas ref={canvasRef} aria-hidden
          style={{ position: "absolute", inset: 0, pointerEvents: "none" }}
        />

        {/* Flecha — único elemento, existe durante todo el vuelo */}
        <div
          ref={arrowRef}
          id="arrow-hero"
          aria-hidden
          style={{
            position: "fixed", top: 0, left: 0,
            opacity: 0,
            pointerEvents: "none",
            zIndex: 10,
            willChange: "transform",
          }}
        >
          <ArrowSVG />
        </div>
      </div>
    );
  }

  /* ── PANTALLAS INTRO ── */
  return (
    <div
      className="fixed inset-0 z-[200] flex cursor-pointer select-none items-center justify-center overflow-hidden"
      style={{ background: "linear-gradient(160deg, #2B1142 0%, #1E0A33 100%)" }}
      onClick={advance}
    >
      <BgParticles reduced={reduced} />

      <AnimatePresence mode="wait">
        {screen === 0 ? (
          <motion.div key="s0"
            initial={reduced ? false : { opacity: 0, y: 28 }}
            animate={reduced ? undefined : { opacity: 1, y: 0 }}
            exit={reduced ? undefined : { opacity: 0, y: -28 }}
            transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1] }}
            className="relative z-10 mx-auto max-w-3xl px-8 text-center"
          >
            <h1 className="text-white" style={{
              fontSize: "clamp(44px, 6.5vw, 68px)", fontWeight: 900,
              lineHeight: 1.08, letterSpacing: "-0.02em",
            }}>
              ¿TUS VENTAS DEPENDEN<br />SOLO DE VOS?
            </h1>
            <p className="mt-6" style={{
              fontSize: "clamp(16px, 1.8vw, 21px)",
              color: "rgba(255,255,255,0.62)", lineHeight: 1.65,
            }}>
              Te llegan clientes, pero el proceso es un caos<br />y todo termina en tus manos.
            </p>
            <p className="mt-12 text-xs uppercase"
              style={{ color: "rgba(255,255,255,0.22)", letterSpacing: "0.3em" }}>
              Click para continuar
            </p>
          </motion.div>
        ) : (
          <motion.div key="s1"
            initial={reduced ? false : { opacity: 0, y: 28 }}
            animate={reduced ? undefined : { opacity: 1, y: 0 }}
            exit={reduced ? undefined : { opacity: 0, y: -28 }}
            transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1] }}
            className="relative z-10 mx-auto max-w-3xl px-8 text-center"
          >
            <h1 className="text-white" style={{
              fontSize: "clamp(44px, 6.5vw, 68px)", fontWeight: 900,
              lineHeight: 1.08, letterSpacing: "-0.02em",
            }}>
              NO NECESITAS<br />TRABAJAR MÁS
            </h1>
            <p className="mt-6" style={{
              fontSize: "clamp(16px, 1.8vw, 20px)",
              color: "rgba(255,255,255,0.62)",
            }}>
              Necesitas mejorar tu proceso.
            </p>

            <button
              onClick={e => { e.stopPropagation(); startTransition(); }}
              className="relative mt-10 overflow-hidden rounded-full font-black uppercase text-white"
              style={{
                fontSize: "16px", padding: "16px 44px",
                background: "linear-gradient(135deg, #6B00B6, #A855F7)",
                boxShadow: "0 0 28px rgba(124,58,237,0.55)",
                cursor: "pointer", border: "none", letterSpacing: "0.1em",
              }}
            >
              <span className="relative z-10">Entrá y mirá cómo cambia eso</span>
              {!reduced && (
                <motion.span aria-hidden
                  className="pointer-events-none absolute inset-0 -skew-x-12"
                  style={{ background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.28) 50%, transparent)" }}
                  animate={{ x: ["-120%", "220%"] }}
                  transition={{ duration: 1.1, repeat: Infinity, repeatDelay: 2.2, ease: "linear" }}
                />
              )}
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
