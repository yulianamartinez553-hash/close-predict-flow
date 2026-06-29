import { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useReducedMotion } from "@/lib/use-reduced-motion";

/* ─────────────────────────────────────────────────────────────────
   TIPOS
───────────────────────────────────────────────────────────────── */
interface Props { onComplete: () => void }
type Phase = "idle" | "smoke-accel" | "contracting" | "done";

const sleep = (ms: number) => new Promise<void>(r => setTimeout(r, ms));

const CHAR_COUNT = 13; // C l o s e P r e d i c t ®

const FUNNEL_CLIPS = [
  "inset(0% 0% 69% 0%)",
  "inset(0% 0% 46% 0%)",
  "inset(0% 0% 27% 0%)",
  "inset(0% 0% 0%  0%)",
];

/* ─────────────────────────────────────────────────────────────────
   OPCIONES DE HUMO
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
  emitters: { position: { x: 50, y: 90 }, rate: { quantity: 2, delay: 0.35 } },
  detectRetina: true,
};

/* ─────────────────────────────────────────────────────────────────
   COMPONENTE
───────────────────────────────────────────────────────────────── */
export function SequenceIntro({ onComplete }: Props) {
  const reduced = useReducedMotion();
  const [screen,     setScreen]     = useState<0 | 1>(0);
  const [phase,      setPhase]      = useState<Phase>("idle");
  const [overlayOut, setOverlayOut] = useState(false);

  const particlesRef = useRef<any>(null);
  const titleRef     = useRef<HTMLHeadingElement>(null);

  /* Bloquear scroll */
  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = ""; };
  }, []);

  /* ── Humo tsParticles + reveal Splitting.js en pantalla 0 ── */
  useEffect(() => {
    if (reduced) return;
    let destroyed = false;

    const run = async () => {
      /* Humo */
      try {
        const { tsParticles } = await import("@tsparticles/engine");
        const { loadSlim }    = await import("@tsparticles/slim");
        await loadSlim(tsParticles);
        if (!destroyed) {
          const pc = await tsParticles.load({ id: "cp-smoke", options: SMOKE_OPTIONS as any });
          particlesRef.current = pc;
        }
      } catch (_) {}

      /* 800ms → revelar título letra a letra */
      await sleep(800);
      if (destroyed) return;

      try {
        const [gsapMod, splitMod] = await Promise.all([
          import("gsap"),
          // @ts-ignore
          import("splitting"),
        ]);
        const gsap      = (gsapMod as any).gsap ?? (gsapMod as any).default ?? gsapMod;
        const Splitting = (splitMod  as any).default ?? splitMod;

        if (titleRef.current && !destroyed) {
          Splitting({ target: titleRef.current });
          const chars = Array.from(titleRef.current.querySelectorAll(".char"));
          gsap.fromTo(chars,
            { opacity: 0, filter: "blur(10px)", y: 16 },
            {
              opacity: 1, filter: "blur(0px)", y: 0,
              duration: 0.38, stagger: 0.028, ease: "power3.out",
              onComplete() {
                const sub  = document.getElementById("s0-subtitle");
                const hint = document.getElementById("s0-hint");
                if (sub)  gsap.to(sub,  { opacity: 1, y: 0, duration: 0.5,        ease: "power2.out" });
                if (hint) gsap.to(hint, { opacity: 1,       duration: 0.5, delay: 0.2, ease: "power2.out" });
              },
            }
          );
        }
      } catch (_) {
        /* Fallback sin librerías */
        if (titleRef.current) (titleRef.current as HTMLElement).style.opacity = "1";
        ["s0-subtitle","s0-hint"].forEach(id => {
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

  /* ── Avanzar: pantalla 0 → 1 → transición ── */
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

  /* ── Transición al Hero ── */
  const startTransition = useCallback(async () => {
    if (phase !== "idle") return;

    /* Acelerar humo 320ms */
    setPhase("smoke-accel");
    try {
      const pc = particlesRef.current;
      if (pc?.options?.particles?.move) {
        pc.options.particles.move.speed = { min: 3, max: 7 };
        if (pc.options.emitters) pc.options.emitters.rate = { quantity: 5, delay: 0.08 };
        await pc.refresh();
      }
    } catch (_) {}
    await sleep(320);

    try { particlesRef.current?.destroy?.(); } catch (_) {}
    particlesRef.current = null;

    /* Contracción iris 1.25s */
    setPhase("contracting");
    await sleep(1280);

    /* Revelar elementos del Hero con GSAP */
    const gsapMod = await import("gsap");
    const gsap    = (gsapMod as any).gsap ?? (gsapMod as any).default ?? gsapMod;

    /* Texto "Close Predict®" */
    const chars: Element[] = [];
    for (let i = 0; i < CHAR_COUNT; i++) {
      const el = document.getElementById(`cp-char-${i}`);
      if (el) chars.push(el);
    }
    if (chars.length) {
      gsap.fromTo(chars,
        { opacity: 0, filter: "blur(8px)", y: 14 },
        { opacity: 1, filter: "blur(0px)", y: 0, duration: 0.42, stagger: 0.04, ease: "power3.out", delay: 0.15 }
      );
    }

    /* Embudo: opacidad + clip-path barra a barra */
    const funnelEl = document.getElementById("cp-funnel-img");
    if (funnelEl) {
      gsap.to(funnelEl, { opacity: 1, duration: 0.4, ease: "power2.out" });
      await sleep(250);
      gsap.to(funnelEl, { clipPath: FUNNEL_CLIPS[1], duration: 0.28, ease: "power2.out" });
      await sleep(170);
      gsap.to(funnelEl, { clipPath: FUNNEL_CLIPS[2], duration: 0.28, ease: "power2.out" });
      await sleep(170);
      gsap.to(funnelEl, {
        clipPath: FUNNEL_CLIPS[3], duration: 0.28, ease: "power2.out",
        onComplete: () => gsap.set(funnelEl, { clearProps: "clipPath" }),
      });
    }

    /* Tagline */
    await sleep(200);
    const tagEl = document.getElementById("cp-tagline");
    if (tagEl) gsap.to(tagEl, { opacity: 1, duration: 0.45, ease: "power2.out" });

    /* Disolver overlay */
    await sleep(450);
    setOverlayOut(true);
    await sleep(700);
    setPhase("done");
    onComplete();
  }, [phase, onComplete]);

  /* ── RENDER ── */
  if (phase === "done") return null;

  const isIdle        = phase === "idle" || phase === "smoke-accel";
  const isContracting = phase === "contracting";
  const EASE          = [0.22, 1, 0.36, 1] as const;

  return (
    <div
      className="fixed inset-0 z-[200] overflow-hidden cursor-pointer select-none"
      style={{
        opacity:       overlayOut ? 0 : 1,
        transition:    overlayOut ? "opacity 0.65s ease" : "none",
        pointerEvents: overlayOut ? "none" : "auto",
      }}
      onClick={() => { if (isIdle) advance(); }}
    >
      {/* ── Fondo violeta — contrae en iris al transicionar ── */}
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

      {/* ── Humo tsParticles ── */}
      <div
        id="cp-smoke"
        aria-hidden
        style={{
          position: "absolute", inset: 0, zIndex: 0,
          filter: "blur(28px)",
          opacity: isIdle ? 0.75 : 0,
          transition: "opacity 0.45s ease",
          pointerEvents: "none",
        }}
      />

      {/* ── Pantallas — AnimatePresence para transición suave ── */}
      {isIdle && (
        <AnimatePresence mode="wait">

          {/* PANTALLA 0 */}
          {screen === 0 && (
            <motion.div
              key="s0"
              initial={reduced ? false : { opacity: 0, y: 28 }}
              animate={reduced ? undefined : { opacity: 1, y: 0 }}
              exit={reduced ? undefined : { opacity: 0, y: -28 }}
              transition={{ duration: 0.65, ease: EASE }}
              style={{
                position: "absolute", inset: 0, zIndex: 2,
                display: "flex", flexDirection: "column",
                alignItems: "center", justifyContent: "center",
                textAlign: "center", padding: "0 2rem",
              }}
            >
              <h1
                ref={titleRef}
                style={{
                  color: "#fff",
                  fontSize: "clamp(36px, 5.5vw, 66px)",
                  fontWeight: 900, lineHeight: 1.08, letterSpacing: "-0.02em",
                  maxWidth: 820,
                  opacity: 0, /* Splitting.js + GSAP revelan */
                }}
              >
                ¿TUS VENTAS DEPENDEN SOLO DE VOS?
              </h1>

              <p
                id="s0-subtitle"
                style={{
                  marginTop: "1.6rem",
                  fontSize: "clamp(15px, 1.55vw, 20px)",
                  color: "rgba(255,255,255,0.62)", lineHeight: 1.65, maxWidth: 560,
                  opacity: 0, transform: "translateY(12px)",
                }}
              >
                Te llegan clientes, pero el proceso es un caos<br/>
                y todo termina en tus manos.
              </p>

              <p
                id="s0-hint"
                style={{
                  marginTop: "3rem",
                  fontSize: "11px", letterSpacing: "0.3em",
                  textTransform: "uppercase",
                  color: "rgba(255,255,255,0.22)",
                  opacity: 0,
                }}
              >
                Click para continuar
              </p>
            </motion.div>
          )}

          {/* PANTALLA 1 */}
          {screen === 1 && (
            <motion.div
              key="s1"
              initial={reduced ? false : { opacity: 0, y: 28 }}
              animate={reduced ? undefined : { opacity: 1, y: 0 }}
              exit={reduced ? undefined : { opacity: 0, y: -28 }}
              transition={{ duration: 0.65, ease: EASE }}
              style={{
                position: "absolute", inset: 0, zIndex: 2,
                display: "flex", flexDirection: "column",
                alignItems: "center", justifyContent: "center",
                textAlign: "center", padding: "0 2rem",
              }}
            >
              <h1 style={{
                color: "#fff",
                fontSize: "clamp(36px, 5.5vw, 66px)",
                fontWeight: 900, lineHeight: 1.08, letterSpacing: "-0.02em",
              }}>
                NO NECESITAS<br/>TRABAJAR MÁS
              </h1>

              <p style={{
                marginTop: "1.6rem",
                fontSize: "clamp(15px, 1.55vw, 20px)",
                color: "rgba(255,255,255,0.62)",
              }}>
                Necesitas mejorar tu proceso.
              </p>

              <button
                onClick={e => { e.stopPropagation(); startTransition(); }}
                style={{
                  marginTop: "2.8rem",
                  padding: "16px 44px", borderRadius: "100px",
                  fontFamily: "'Montserrat','Inter',sans-serif",
                  fontWeight: 900, fontSize: "15px",
                  letterSpacing: "0.06em", textTransform: "uppercase", color: "#fff",
                  background: "linear-gradient(135deg, #6B00B6, #A855F7)",
                  boxShadow: "0 0 28px rgba(124,58,237,0.55)",
                  border: "none", cursor: "pointer",
                  position: "relative", overflow: "hidden",
                }}
              >
                <span style={{ position: "relative", zIndex: 1 }}>
                  Entrá y mirá cómo cambia eso
                </span>
                {!reduced && (
                  <motion.span
                    aria-hidden
                    style={{
                      position: "absolute", inset: 0,
                      background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.26) 50%, transparent)",
                      transform: "skewX(-12deg)",
                    }}
                    animate={{ x: ["-120%", "220%"] }}
                    transition={{ duration: 1.1, repeat: Infinity, repeatDelay: 2.2, ease: "linear" }}
                  />
                )}
              </button>
            </motion.div>
          )}

        </AnimatePresence>
      )}
    </div>
  );
}
