import { useState, useEffect, useCallback, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useReducedMotion } from "@/lib/use-reduced-motion";

/* ─────────────────────────────────────────────────────────────────
   TIPOS Y CONSTANTES
───────────────────────────────────────────────────────────────── */
interface Props { onComplete: () => void }

type Phase = "idle" | "contracting" | "traveling" | "fusing" | "done";

const CLOSE_PREDICT = "Close Predict";
const CHARS = CLOSE_PREDICT.split("");

/* Partículas decorativas — seed estático para SSR */
const PARTICLES = Array.from({ length: 38 }, (_, i) => ({
  id: i,
  x: ((i * 37 + 13) % 97) + 1.5,
  y: ((i * 53 + 7) % 95) + 2,
  size: 2 + (i % 3) * 1.5,
  duration: 3.5 + (i % 5) * 0.7,
  delay: (i % 8) * 0.35,
  opacity: 0.18 + (i % 5) * 0.07,
}));

const sleep = (ms: number) => new Promise<void>(r => setTimeout(r, ms));

/* ─────────────────────────────────────────────────────────────────
   PARTÍCULAS DE FONDO
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
   ARROW SVG — forma exacta de la barra superior del embudo
───────────────────────────────────────────────────────────────── */
function ArrowShape({ glow = false }: { glow?: boolean }) {
  return (
    <svg
      viewBox="0 0 342 65"
      xmlns="http://www.w3.org/2000/svg"
      style={{ width: 130, height: "auto", display: "block", overflow: "visible" }}
    >
      <defs>
        <linearGradient id="arrowFg" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%"   stopColor="#2D0057"/>
          <stop offset="45%"  stopColor="#6B00B6"/>
          <stop offset="100%" stopColor="#A855F7"/>
        </linearGradient>
        {glow && (
          <filter id="arrowGlow" x="-30%" y="-30%" width="160%" height="160%">
            <feGaussianBlur stdDeviation="8" result="blur" in="SourceGraphic"/>
            <feMerge>
              <feMergeNode in="blur"/>
              <feMergeNode in="SourceGraphic"/>
            </feMerge>
          </filter>
        )}
      </defs>
      <path
        d="M 0,18 L 0,65 Q 150,61 300,47 L 342,8 L 300,23 Q 150,25 0,18 Z"
        fill="url(#arrowFg)"
        filter={glow ? "url(#arrowGlow)" : undefined}
      />
      {/* Gloss superior */}
      <path
        d="M 0,18 L 0,65 Q 150,61 300,47 L 342,8 L 300,23 Q 150,25 0,18 Z"
        fill="rgba(255,255,255,0.14)"
      />
    </svg>
  );
}

/* ─────────────────────────────────────────────────────────────────
   COMPONENTE PRINCIPAL
───────────────────────────────────────────────────────────────── */
export function SequenceIntro({ onComplete }: Props) {
  const reduced = useReducedMotion();
  const [screen, setScreen]           = useState<0 | 1>(0);
  const [phase, setPhase]             = useState<Phase>("idle");
  const [letters, setLetters]         = useState<boolean[]>(Array(CHARS.length).fill(false));
  const [bars, setBars]               = useState([false, false, false]);
  const [overlayFade, setOverlayFade] = useState(false);

  const arrowRef  = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const tlRef     = useRef<{ kill(): void } | null>(null);

  /* Bloquear scroll mientras la intro está activa */
  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "";
      tlRef.current?.kill();
    };
  }, []);

  /* Teclado / wheel */
  const advance = useCallback(() => {
    if (phase !== "idle") return;
    if (screen === 0) { setScreen(1); return; }
    startTransition();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [screen, phase]);

  useEffect(() => {
    const onKey   = (e: KeyboardEvent) => { if (["Enter"," ","ArrowDown","ArrowRight"].includes(e.key)) { e.preventDefault(); advance(); } };
    const onWheel = (e: WheelEvent)    => { if (e.deltaY > 20) advance(); };
    window.addEventListener("keydown", onKey);
    window.addEventListener("wheel", onWheel, { passive: true });
    return () => { window.removeEventListener("keydown", onKey); window.removeEventListener("wheel", onWheel); };
  }, [advance]);

  /* ── LÓGICA DE TRANSICIÓN ── */
  const startTransition = useCallback(async () => {
    if (reduced) { onComplete(); return; }

    /* FASE 1 — Contracción del fondo (0 → 1.8s) */
    setPhase("contracting");
    await sleep(1800);

    /* FASE 2 — Flecha viaja (1.8 → 4.5s) */
    setPhase("traveling");

    /* Inicializar canvas para la estela */
    const canvas = canvasRef.current;
    if (canvas) {
      canvas.width  = window.innerWidth;
      canvas.height = window.innerHeight;
    }

    /* Cargar GSAP en cliente */
    const gsapPkg = await import("gsap");
    const gsap    = (gsapPkg as any).gsap ?? (gsapPkg as any).default ?? gsapPkg;
    const { MotionPathPlugin } = await import("gsap/MotionPathPlugin");
    gsap.registerPlugin(MotionPathPlugin);

    const vw = window.innerWidth;
    const vh = window.innerHeight;
    const arrowEl = arrowRef.current;
    if (!arrowEl) return;

    /* Posición inicial: centro de pantalla */
    gsap.set(arrowEl, { x: vw * 0.50 - 65, y: vh * 0.50 - 16, rotation: -45 });

    /* Estela */
    const trail: { x: number; y: number; born: number }[] = [];
    let rafId = 0;
    const ctx = canvas?.getContext("2d") ?? null;

    function drawTrail() {
      if (!ctx || !canvas) return;
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      const now = Date.now();
      trail.forEach(p => {
        const age = (now - p.born) / 300;
        if (age > 1) return;
        ctx.globalAlpha = 0.08 * (1 - age);
        ctx.fillStyle = "#7C3AED";
        ctx.beginPath();
        ctx.arc(p.x, p.y, 4 * (1 - age * 0.5), 0, Math.PI * 2);
        ctx.fill();
      });
      // limpiar puntos viejos
      while (trail.length && Date.now() - trail[0].born > 300) trail.shift();
      rafId = requestAnimationFrame(drawTrail);
    }
    drawTrail();

    /* Timeline GSAP */
    const tl = gsap.timeline({
      onComplete: async () => {
        cancelAnimationFrame(rafId);
        ctx?.clearRect(0, 0, canvas!.width, canvas!.height);

        /* FASE 4 — Barras del embudo */
        setPhase("fusing");
        setBars([true, false, false]);
        await sleep(150); setBars([true, true, false]);
        await sleep(150); setBars([true, true, true]);
        await sleep(600);

        /* Fade out del overlay */
        setOverlayFade(true);
        await sleep(700);
        setPhase("done");
        onComplete();
      },
    });
    tlRef.current = tl as any;

    /*
     * Trayectoria de la flecha — curva Bézier cúbica a través de waypoints:
     * A) centro → sube hacia borde superior
     * B) avanza hacia derecha a lo largo del tope
     * C) curva hacia esquina superior derecha
     * D) desciende diagonal hacia hero (texto "Close Predict")
     * E) continúa hacia posición del embudo
     */
    tl.to(arrowEl, {
      duration: 2.7,
      ease: "power2.inOut",
      motionPath: {
        path: [
          { x: vw * 0.50 - 65, y: vh * 0.50 - 16 },  // centro
          { x: vw * 0.50 - 65, y: vh * 0.05 - 16 },   // A: sube al tope
          { x: vw * 0.75 - 65, y: vh * 0.06 - 16 },   // B: desliza a la derecha
          { x: vw * 0.82 - 65, y: vh * 0.10 - 16 },   // C: curva esquina
          { x: vw * 0.68 - 65, y: vh * 0.42 - 16 },   // D: baja hacia texto
          { x: vw * 0.30 - 65, y: vh * 0.44 - 16 },   // E: viaja al embudo
        ],
        curviness: 1.4,
        autoRotate: true,
        type: "thru",
      },
      onUpdate() {
        /* Estela */
        const rect = arrowEl.getBoundingClientRect();
        trail.push({ x: rect.left + rect.width / 2, y: rect.top + rect.height / 2, born: Date.now() });

        /* Revelar letras según posición X de la flecha */
        const ax = rect.left + rect.width / 2;
        /* Zona del texto "Close Predict": 45%-70% del viewport */
        const textZoneLeft  = vw * 0.45;
        const textZoneRight = vw * 0.72;
        if (ax > textZoneLeft && ax < textZoneRight) {
          const progress = (ax - textZoneLeft) / (textZoneRight - textZoneLeft);
          const lettersToShow = Math.floor(progress * CHARS.length);
          setLetters(prev => {
            if (prev[lettersToShow]) return prev;
            const next = [...prev];
            for (let i = 0; i <= lettersToShow && i < CHARS.length; i++) next[i] = true;
            return next;
          });
        }
      },
    });
  }, [reduced, onComplete]);

  /* ── RENDER ── */

  /* Overlay de transición */
  if (phase !== "idle") {
    return (
      <div
        className="fixed inset-0 z-[200] overflow-hidden"
        style={{
          background: "#08030F",
          opacity: overlayFade ? 0 : 1,
          transition: overlayFade ? "opacity 0.7s ease" : "none",
          pointerEvents: overlayFade ? "none" : "auto",
        }}
      >
        {/* Fondo violeta que se contrae hacia el centro */}
        <motion.div
          aria-hidden
          initial={{ clipPath: "inset(0% 0% round 0%)" }}
          animate={{ clipPath: "inset(50% 50% round 50%)" }}
          transition={{ duration: 1.5, ease: [0.7, 0, 0.84, 0] }}
          style={{
            position: "absolute", inset: 0,
            background: "radial-gradient(ellipse at center, #3D1A7A 0%, #2B1142 50%, #1A0A2B 100%)",
          }}
        />

        {/* Canvas de estela */}
        <canvas
          ref={canvasRef}
          aria-hidden
          style={{ position: "absolute", inset: 0, pointerEvents: "none" }}
        />

        {/* Texto "Close Predict" — revelado letra por letra */}
        {(phase === "traveling" || phase === "fusing") && (
          <div
            aria-hidden
            style={{
              position: "absolute",
              left: "53%",
              top: "50%",
              transform: "translateY(-50%)",
            }}
          >
            <div style={{
              fontFamily: "'Plus Jakarta Sans','Outfit','Manrope',system-ui,sans-serif",
              fontWeight: 800,
              fontSize: "clamp(46px, 5vw, 84px)",
              lineHeight: 0.93,
              letterSpacing: "-0.028em",
            }}>
              {/* "Close" */}
              <div style={{ display: "flex" }}>
                {"Close".split("").map((ch, i) => (
                  <span
                    key={i}
                    style={{
                      background: "linear-gradient(180deg, #9B72E0 0%, #6C39B3 100%)",
                      WebkitBackgroundClip: "text",
                      WebkitTextFillColor: "transparent",
                      backgroundClip: "text",
                      opacity: letters[i] ? 1 : 0,
                      filter: letters[i] ? "blur(0px)" : "blur(8px)",
                      transform: letters[i] ? "translateY(0)" : "translateY(6px)",
                      transition: "opacity 0.4s ease, filter 0.4s ease, transform 0.4s ease",
                      display: "inline-block",
                    }}
                  >
                    {ch}
                  </span>
                ))}
              </div>
              {/* "Predict" */}
              <div style={{ display: "flex", marginTop: "0.04em" }}>
                {"Predict".split("").map((ch, i) => {
                  const gi = i + 6; // "Close " = 6 chars, but we skip space visually
                  return (
                    <span
                      key={i}
                      style={{
                        background: "linear-gradient(180deg, #9B72E0 0%, #6C39B3 100%)",
                        WebkitBackgroundClip: "text",
                        WebkitTextFillColor: "transparent",
                        backgroundClip: "text",
                        opacity: letters[gi] ? 1 : 0,
                        filter: letters[gi] ? "blur(0px)" : "blur(8px)",
                        transform: letters[gi] ? "translateY(0)" : "translateY(6px)",
                        transition: "opacity 0.4s ease, filter 0.4s ease, transform 0.4s ease",
                        display: "inline-block",
                      }}
                    >
                      {ch}
                    </span>
                  );
                })}
                <sup style={{
                  fontSize: "0.40em", verticalAlign: "super",
                  background: "linear-gradient(180deg, #9B72E0 0%, #6C39B3 100%)",
                  WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent",
                  backgroundClip: "text", fontWeight: 800,
                  opacity: letters[12] ? 1 : 0,
                  transition: "opacity 0.4s ease",
                }}>®</sup>
              </div>
            </div>

            {/* Tagline */}
            <p style={{
              margin: 0, marginTop: "1.4rem",
              fontFamily: "'Montserrat','Inter',sans-serif",
              fontSize: "clamp(9px, 0.9vw, 11px)", fontWeight: 700,
              letterSpacing: "0.30em", textTransform: "uppercase",
              color: "rgba(155,114,224,0.48)",
              opacity: bars[0] ? 1 : 0,
              transition: "opacity 0.5s ease 0.3s",
            }}>
              Sistema Comercial Predecible
            </p>
          </div>
        )}

        {/* Embudo — barras que aparecen en fase 4 */}
        {(phase === "traveling" || phase === "fusing") && (
          <div
            aria-hidden
            style={{
              position: "absolute",
              left: "12%",
              top: "50%",
              transform: "translateY(-52%)",
              width: "min(34%, 320px)",
            }}
          >
            <svg viewBox="-12 -24 366 290" style={{ width: "100%", height: "auto", overflow: "visible" }}>
              <defs>
                <linearGradient id="tFg" x1="0" y1="0" x2="1" y2="0">
                  <stop offset="0%"   stopColor="#223B8F"/>
                  <stop offset="20%"  stopColor="#6B1FD1"/>
                  <stop offset="50%"  stopColor="#9D4EDD"/>
                  <stop offset="78%"  stopColor="#C77DFF"/>
                  <stop offset="100%" stopColor="#A869E8"/>
                </linearGradient>
                <linearGradient id="tGl" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%"   stopColor="rgba(255,255,255,0.22)"/>
                  <stop offset="100%" stopColor="rgba(255,255,255,0.00)"/>
                </linearGradient>
              </defs>

              {/* Barra 1 — siempre visible en traveling (es la flecha que llegó) */}
              <g style={{
                opacity: phase === "fusing" || bars[0] ? 1 : 0.7,
                transition: "opacity 0.4s ease",
              }}>
                <path d="M 0,18 L 0,65 Q 150,61 300,47 L 342,8 L 300,23 Q 150,25 0,18 Z" fill="url(#tFg)"/>
                <path d="M 0,18 L 0,65 Q 150,61 300,47 L 342,8 L 300,23 Q 150,25 0,18 Z" fill="url(#tGl)" opacity={0.70}/>
              </g>

              {/* Barra 2 */}
              <g style={{
                opacity: bars[1] ? 1 : 0,
                transform: bars[1] ? "scaleX(1)" : "scaleX(0)",
                transformOrigin: "left center",
                transformBox: "fill-box",
                transition: "opacity 0.35s ease, transform 0.35s cubic-bezier(0.16,1,0.3,1)",
              }}>
                <path d="M 0,93 L 0,133 Q 112,129 238,119 L 238,99 Q 112,100 0,93 Z" fill="url(#tFg)"/>
                <path d="M 0,93 L 0,133 Q 112,129 238,119 L 238,99 Q 112,100 0,93 Z" fill="url(#tGl)" opacity={0.58}/>
              </g>

              {/* Barra 3 */}
              <g style={{
                opacity: bars[2] ? 1 : 0,
                transform: bars[2] ? "scaleX(1)" : "scaleX(0)",
                transformOrigin: "left center",
                transformBox: "fill-box",
                transition: "opacity 0.35s ease 0.15s, transform 0.35s cubic-bezier(0.16,1,0.3,1) 0.15s",
              }}>
                <path d="M 0,157 L 0,189 Q 84,186 182,177 L 182,163 Q 84,162 0,157 Z" fill="url(#tFg)"/>
                <path d="M 0,157 L 0,189 Q 84,186 182,177 L 182,163 Q 84,162 0,157 Z" fill="url(#tGl)" opacity={0.50}/>
              </g>

              {/* Barra 4 */}
              <g style={{
                opacity: bars[2] ? 1 : 0,
                transform: bars[2] ? "scaleX(1)" : "scaleX(0)",
                transformOrigin: "left center",
                transformBox: "fill-box",
                transition: "opacity 0.35s ease 0.30s, transform 0.35s cubic-bezier(0.16,1,0.3,1) 0.30s",
              }}>
                <path d="M 0,213 L 0,237 Q 58,235 133,228 L 133,216 Q 58,214 0,213 Z" fill="url(#tFg)"/>
                <path d="M 0,213 L 0,237 Q 58,235 133,228 L 133,216 Q 58,214 0,213 Z" fill="url(#tGl)" opacity={0.42}/>
              </g>
            </svg>
          </div>
        )}

        {/* Flecha animada por GSAP */}
        <div
          ref={arrowRef}
          aria-hidden
          style={{
            position: "absolute",
            top: 0, left: 0,
            opacity: phase === "traveling" || phase === "fusing" ? 1 : 0,
            transition: "opacity 0.3s ease",
            pointerEvents: "none",
            zIndex: 10,
          }}
        >
          <ArrowShape glow />
        </div>
      </div>
    );
  }

  /* ── PANTALLAS INTRO (screen 0 y 1) ── */
  return (
    <div
      className="fixed inset-0 z-[200] flex cursor-pointer select-none items-center justify-center overflow-hidden"
      style={{ background: "linear-gradient(160deg, #2B1142 0%, #1E0A33 100%)" }}
      onClick={advance}
    >
      <BgParticles reduced={reduced} />

      <AnimatePresence mode="wait">
        {screen === 0 ? (
          <motion.div
            key="s0"
            initial={reduced ? false : { opacity: 0, y: 28 }}
            animate={reduced ? undefined : { opacity: 1, y: 0 }}
            exit={reduced ? undefined : { opacity: 0, y: -28 }}
            transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1] }}
            className="relative z-10 mx-auto max-w-3xl px-8 text-center"
          >
            <h1
              className="text-white"
              style={{ fontSize: "clamp(44px, 6.5vw, 68px)", fontWeight: 900, lineHeight: 1.08, letterSpacing: "-0.02em" }}
            >
              ¿TUS VENTAS DEPENDEN<br />SOLO DE VOS?
            </h1>
            <p
              className="mt-6"
              style={{ fontSize: "clamp(16px, 1.8vw, 21px)", color: "rgba(255,255,255,0.62)", lineHeight: 1.65 }}
            >
              Te llegan clientes, pero el proceso es un caos<br />y todo termina en tus manos.
            </p>
            <p
              className="mt-12 text-xs uppercase"
              style={{ color: "rgba(255,255,255,0.22)", letterSpacing: "0.3em" }}
            >
              Click para continuar
            </p>
          </motion.div>
        ) : (
          <motion.div
            key="s1"
            initial={reduced ? false : { opacity: 0, y: 28 }}
            animate={reduced ? undefined : { opacity: 1, y: 0 }}
            exit={reduced ? undefined : { opacity: 0, y: -28 }}
            transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1] }}
            className="relative z-10 mx-auto max-w-3xl px-8 text-center"
          >
            <h1
              className="text-white"
              style={{ fontSize: "clamp(44px, 6.5vw, 68px)", fontWeight: 900, lineHeight: 1.08, letterSpacing: "-0.02em" }}
            >
              NO NECESITAS<br />TRABAJAR MÁS
            </h1>
            <p
              className="mt-6"
              style={{ fontSize: "clamp(16px, 1.8vw, 20px)", color: "rgba(255,255,255,0.62)" }}
            >
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
                <motion.span
                  aria-hidden
                  className="pointer-events-none absolute inset-0 -skew-x-12"
                  style={{ background: "linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.28) 50%, transparent 100%)" }}
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
