// src/components/landing/IntroPortada.tsx
import { useRef, useState, useCallback, useEffect, type MouseEvent } from "react";
import { motion, AnimatePresence, useMotionValue, useTransform, animate as fmAnimate } from "framer-motion";
import { useReducedMotion } from "@/lib/use-reduced-motion";

interface Props { onComplete: () => void }
type Phase = "idle" | "covering" | "revealing" | "done";

const EXPO = [0.16, 1, 0.3, 1] as const;
const HLS_SRC = "https://stream.mux.com/kimF2ha9zLrX64H00UgLGPflCzNtl1T0215MlAmeOztv8.m3u8";

/* Mismo color para la capa sobre el video Y el círculo de transición */
const OVERLAY_COLOR = "#1E0A33";

/* ─────────────────────────────────────────────────────────────────
   GLASS PILL — typewriter "CONOCER CLOSE PREDICT"
───────────────────────────────────────────────────────────────── */
const PILL_TEXT = "CONOCER CLOSE PREDICT";

function GlassPill({
  onClickFn,
  btnRef,
  reduced,
}: {
  onClickFn: (e: MouseEvent<HTMLButtonElement>) => void;
  btnRef: React.RefObject<HTMLButtonElement>;
  reduced: boolean;
}) {
  const [displayed, setDisplayed] = useState(reduced ? PILL_TEXT : "");
  const [done,      setDone]      = useState(reduced);
  const idxRef   = useRef(reduced ? PILL_TEXT.length : 0);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (reduced) return;
    idxRef.current = 0;
    setDisplayed("");
    setDone(false);

    const tick = () => {
      idxRef.current++;
      setDisplayed(PILL_TEXT.slice(0, idxRef.current));
      if (idxRef.current < PILL_TEXT.length) {
        timerRef.current = setTimeout(tick, 60);
      } else {
        setDone(true);
      }
    };

    timerRef.current = setTimeout(tick, 700);
    return () => { if (timerRef.current) clearTimeout(timerRef.current); };
  }, [reduced]);

  return (
    <AnimatePresence>
      <motion.button
        ref={btnRef}
        onClick={onClickFn}
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.55, duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
        whileHover={{
          borderColor: "rgba(139,99,217,0.70)",
          background: "rgba(255,255,255,0.07)",
        }}
        style={{
          display: "inline-flex",
          alignItems: "center",
          gap: "10px",
          padding: "16px 36px",
          borderRadius: "9999px",
          background: "rgba(255,255,255,0.04)",
          backdropFilter: "blur(16px) saturate(180%)",
          WebkitBackdropFilter: "blur(16px) saturate(180%)",
          border: "1px solid rgba(139,99,217,0.40)",
          cursor: "pointer",
          minWidth: "280px",
          justifyContent: "center",
        }}
      >
        <span
          style={{
            fontFamily: "'Poppins', 'Inter', sans-serif",
            letterSpacing: "0.22em",
            fontWeight: 600,
            fontSize: "13px",
            color: "rgba(255,255,255,0.88)",
          }}
        >
          {displayed}
          {!done && (
            <span
              className="cursor-blink"
              style={{
                display: "inline-block", width: "2px", height: "1em",
                background: "rgba(255,255,255,0.72)",
                marginLeft: "3px", verticalAlign: "middle",
              }}
            />
          )}
        </span>

        {done && (
          <motion.span
            initial={{ opacity: 0, x: -5 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.28 }}
            style={{ color: "rgba(155,114,224,0.85)", fontSize: "16px", lineHeight: 1 }}
          >
            →
          </motion.span>
        )}
      </motion.button>
    </AnimatePresence>
  );
}

/* ─────────────────────────────────────────────────────────────────
   VIDEO HLS DE FONDO
───────────────────────────────────────────────────────────────── */
function BackgroundVideo() {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    let hls: any = null;

    if (video.canPlayType("application/vnd.apple.mpegurl")) {
      video.src = HLS_SRC;
    } else {
      import("hls.js").then(({ default: Hls }) => {
        if ((Hls as any).isSupported()) {
          hls = new (Hls as any)();
          hls.loadSource(HLS_SRC);
          hls.attachMedia(video);
        }
      });
    }

    return () => { hls?.destroy?.(); };
  }, []);

  return (
    <video
      ref={videoRef}
      autoPlay
      muted
      loop
      playsInline
      style={{
        position: "absolute", inset: 0, zIndex: 0,
        width: "100%", height: "100%", objectFit: "cover",
      }}
    />
  );
}

/* ─────────────────────────────────────────────────────────────────
   COMPONENTE PRINCIPAL
───────────────────────────────────────────────────────────────── */
export function IntroPortada({ onComplete }: Props) {
  const reduced = useReducedMotion();
  const [phase, setPhase] = useState<Phase>("idle");
  const btnRef = useRef<HTMLButtonElement>(null);

  /* Bloquear scroll mientras corre */
  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = ""; };
  }, []);

  /* Posición del clic (en % del viewport) para centrar el círculo */
  const originX = useMotionValue(50);
  const originY = useMotionValue(50);
  const radius  = useMotionValue(0);
  const clipPath = useTransform(
    [radius, originX, originY] as any,
    ([r, x, y]: number[]) => `circle(${r}% at ${x}% ${y}%)`
  );

  const handleClick = useCallback((e: MouseEvent<HTMLButtonElement>) => {
    if (phase !== "idle") return;

    const rect = btnRef.current?.getBoundingClientRect();
    if (rect) {
      originX.set(((rect.left + rect.width / 2) / window.innerWidth) * 100);
      originY.set(((rect.top  + rect.height / 2) / window.innerHeight) * 100);
    }

    if (reduced) { onComplete(); return; }

    setPhase("covering");

    /* FASE 1 — círculo crece hasta cubrir toda la pantalla */
    fmAnimate(radius, 140, {
      duration: 0.9,
      ease: [0.7, 0, 0.84, 0],
      onComplete: () => {
        setPhase("revealing");
        /* FASE 2 — círculo se achica revelando el Hero debajo */
        fmAnimate(radius, 0, {
          duration: 0.85,
          delay: 0.12,
          ease: EXPO,
          onComplete: () => {
            setPhase("done");
            onComplete();
          },
        });
      },
    });
  }, [phase, reduced, onComplete, radius, originX, originY]);

  /* Teclado: Enter / Space */
  useEffect(() => {
    const k = (e: KeyboardEvent) => {
      if (["Enter", " "].includes(e.key)) { e.preventDefault(); btnRef.current?.click(); }
    };
    window.addEventListener("keydown", k);
    return () => window.removeEventListener("keydown", k);
  }, []);

  if (phase === "done") return null;

  const showFirstScreen = phase === "idle" || phase === "covering";

  return (
    <div className="fixed inset-0 z-[200] overflow-hidden">
      <style>{`
        @media (max-width: 600px) {
          .ip-line1, .ip-line2 { white-space: normal !important; }
        }
      `}</style>

      {/* ── Primera pantalla: video + texto + botón ── */}
      {showFirstScreen && (
        <>
          <BackgroundVideo />

          {/* Capa oscura sobre el video */}
          <div
            aria-hidden
            style={{
              position: "absolute", inset: 0, zIndex: 1,
              background: OVERLAY_COLOR, opacity: 0.62,
            }}
          />

          {/* Contenido */}
          <motion.div
            style={{
              position: "absolute", inset: 0, zIndex: 2,
              display: "flex", flexDirection: "column",
              alignItems: "center", justifyContent: "center",
              padding: "0 1.5rem", textAlign: "center",
            }}
            animate={phase === "covering"
              ? { opacity: 0, filter: "blur(10px)", y: -18 }
              : undefined}
            transition={{ duration: 0.45 }}
          >
            {/* Línea 1 — serif editorial grande (Cormorant Garamond) */}
            <motion.p
              className="ip-line1"
              initial={{ opacity: 0, y: 14, filter: "blur(6px)" }}
              animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
              transition={{ duration: 0.7, delay: 0.15, ease: EXPO }}
              style={{
                fontFamily: "'Cormorant Garamond', 'Playfair Display', Georgia, serif",
                fontSize: "clamp(36px, 6vw, 80px)",
                fontWeight: 600,
                lineHeight: 1.05,
                letterSpacing: "-0.01em",
                color: "#fff",
                whiteSpace: "nowrap",
                marginBottom: "0.45em",
              }}
            >
              Los dueños que escalan no venden
            </motion.p>

            {/* Línea 2 — Poppins limpio (sans-serif de la página) */}
            <motion.p
              className="ip-line2"
              initial={{ opacity: 0, y: 18, filter: "blur(6px)" }}
              animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
              transition={{ duration: 0.7, delay: 0.32, ease: EXPO }}
              style={{
                fontFamily: "'Poppins', 'Inter', sans-serif",
                fontSize: "clamp(14px, 1.6vw, 20px)",
                fontWeight: 400,
                lineHeight: 1.5,
                letterSpacing: "0.08em",
                textTransform: "uppercase",
                color: "rgba(255,255,255,0.60)",
                whiteSpace: "nowrap",
                marginBottom: "2.8em",
              }}
            >
              Tienen sistemas que venden por ellos
            </motion.p>

            {/* Glass pill */}
            <GlassPill onClickFn={handleClick} btnRef={btnRef} reduced={reduced} />
          </motion.div>
        </>
      )}

      {/* ── Círculo de transición ── */}
      {(phase === "covering" || phase === "revealing") && (
        <motion.div
          aria-hidden
          style={{
            position: "absolute", inset: 0, zIndex: 10,
            background: OVERLAY_COLOR,
            clipPath,
            pointerEvents: "none",
          }}
        />
      )}

      {/* ── Fondo del Hero montado debajo mientras el círculo se achica ── */}
      {phase === "revealing" && (
        <div
          style={{
            position: "absolute", inset: 0, zIndex: 5,
            display: "flex", alignItems: "center", justifyContent: "center",
            background: `
              radial-gradient(circle at center, rgba(155,90,255,.22) 0%, rgba(110,55,210,.14) 18%, transparent 60%),
              radial-gradient(ellipse at center, #6C39B3 0%, #431C73 35%, #1A0A2B 82%, #08030F 100%)
            `,
          }}
        >
          <motion.div
            initial={{ opacity: 0, y: 10, filter: "blur(8px)" }}
            animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
            transition={{ duration: 0.6, delay: 0.25, ease: EXPO }}
            style={{ textAlign: "center" }}
          >
            <div style={{
              fontFamily: "'Plus Jakarta Sans','Outfit','Manrope',system-ui,sans-serif",
              fontWeight: 800,
              fontSize: "clamp(46px, 6vw, 84px)",
              lineHeight: 0.93,
              letterSpacing: "-0.028em",
              background: "linear-gradient(180deg, #9B72E0 0%, #6C39B3 100%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
            }}>
              Close<br />Predict<sup style={{ fontSize: "0.4em" }}>®</sup>
            </div>
            <p style={{
              marginTop: "1.4rem",
              fontFamily: "'Poppins','Montserrat','Inter',sans-serif",
              fontWeight: 500,
              fontSize: "clamp(9px, 0.92vw, 11px)",
              letterSpacing: "0.32em",
              textTransform: "uppercase",
              color: "rgba(155,114,224,0.55)",
            }}>
              Sistema Comercial Predecible
            </p>
          </motion.div>
        </div>
      )}
    </div>
  );
}
