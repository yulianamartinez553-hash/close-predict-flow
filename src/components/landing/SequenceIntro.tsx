import React, { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useReducedMotion } from "@/lib/use-reduced-motion";

/* ─────────────────────────────────────────────────────────────────
   TIPOS
───────────────────────────────────────────────────────────────── */
interface Props { onComplete: () => void }
type Phase = "idle" | "contracting" | "done";

const sleep = (ms: number) => new Promise<void>(r => setTimeout(r, ms));

const CHAR_COUNT = 13; // C l o s e P r e d i c t ®

const FUNNEL_CLIPS = [
  "inset(0% 0% 69% 0%)",
  "inset(0% 0% 46% 0%)",
  "inset(0% 0% 27% 0%)",
  "inset(0% 0% 0%  0%)",
];

const HLS_SRC =
  "https://stream.mux.com/kimF2ha9zLrX64H00UgLGPflCzNtl1T0215MlAmeOztv8.m3u8";

/* ─────────────────────────────────────────────────────────────────
   VIDEO DE FONDO
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
    <div style={{ position: "absolute", inset: 0, overflow: "hidden", pointerEvents: "none" }}>
      <video
        ref={videoRef}
        autoPlay
        muted
        loop
        playsInline
        style={{ width: "100%", height: "100%", objectFit: "cover" }}
      />
      {/* Overlay #1A1038 al 72% para legibilidad sobre el video */}
      <div
        aria-hidden
        style={{
          position: "absolute", inset: 0,
          backgroundColor: "#1A1038",
          opacity: 0.72,
          zIndex: 1,
        }}
      />
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────────
   TYPEWRITER DEL SUBTÍTULO
───────────────────────────────────────────────────────────────── */
function TypewriterText({
  text, startDelay = 0, speed = 52, style,
}: {
  text: string; startDelay?: number; speed?: number; style?: React.CSSProperties;
}) {
  const [displayed, setDisplayed] = useState("");
  const [done,      setDone]      = useState(false);
  const idxRef   = useRef(0);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    idxRef.current = 0;
    setDisplayed("");
    setDone(false);

    const tick = () => {
      idxRef.current++;
      setDisplayed(text.slice(0, idxRef.current));
      if (idxRef.current < text.length) {
        timerRef.current = setTimeout(tick, speed);
      } else {
        setDone(true);
      }
    };

    timerRef.current = setTimeout(tick, startDelay);
    return () => { if (timerRef.current) clearTimeout(timerRef.current); };
  }, [text, startDelay, speed]);

  return (
    <p style={style}>
      {displayed}
      {!done && (
        <span
          className="cursor-blink"
          style={{
            display: "inline-block", width: "2px", height: "1.1em",
            background: "rgba(255,255,255,0.75)",
            marginLeft: "3px", verticalAlign: "text-bottom",
          }}
        />
      )}
    </p>
  );
}

/* ─────────────────────────────────────────────────────────────────
   GLASS PILL CTA — typewriter "CONOCER CLOSE PREDICT"
───────────────────────────────────────────────────────────────── */
const PILL_TEXT = "CONOCER CLOSE PREDICT";

function GlassPill({
  onClick, reduced,
}: {
  onClick: () => void; reduced: boolean;
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

    timerRef.current = setTimeout(tick, 2200);
    return () => { if (timerRef.current) clearTimeout(timerRef.current); };
  }, [reduced]);

  return (
    <motion.button
      onClick={onClick}
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: 0.5, duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
      whileHover={{ borderColor: "rgba(155,114,224,0.60)", background: "rgba(255,255,255,0.07)" }}
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: "10px",
        padding: "16px 36px",
        borderRadius: "9999px",
        background: "rgba(255,255,255,0.04)",
        backdropFilter: "blur(16px) saturate(180%)",
        WebkitBackdropFilter: "blur(16px) saturate(180%)",
        border: "1px solid rgba(255,255,255,0.13)",
        cursor: "pointer",
        minWidth: "280px",
        justifyContent: "center",
        marginTop: "3rem",
      }}
    >
      <span
        style={{
          fontFamily: "'Montserrat','Inter',sans-serif",
          fontWeight: 700,
          fontSize: "13px",
          letterSpacing: "0.22em",
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
  );
}

/* ─────────────────────────────────────────────────────────────────
   COMPONENTE PRINCIPAL
───────────────────────────────────────────────────────────────── */
export function SequenceIntro({ onComplete }: Props) {
  const reduced = useReducedMotion();
  const [phase,      setPhase]      = useState<Phase>("idle");
  const [overlayOut, setOverlayOut] = useState(false);

  /* Bloquear scroll mientras corre */
  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = ""; };
  }, []);

  /* ── Transición al Hero (iris + reveal de chars GSAP) ── */
  const startTransition = useCallback(async () => {
    if (phase !== "idle") return;

    /* Contracción iris */
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

    /* Embudo: clip-path barra a barra */
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

  /* Teclas de acceso rápido */
  useEffect(() => {
    const k = (e: KeyboardEvent) => {
      if (["Enter", " ", "ArrowDown", "ArrowRight"].includes(e.key)) {
        e.preventDefault();
        startTransition();
      }
    };
    window.addEventListener("keydown", k);
    return () => window.removeEventListener("keydown", k);
  }, [startTransition]);

  /* ── RENDER ── */
  if (phase === "done") return null;

  const isContracting = phase === "contracting";

  return (
    <div
      className="fixed inset-0 z-[200] overflow-hidden select-none"
      style={{
        opacity:       overlayOut ? 0 : 1,
        transition:    overlayOut ? "opacity 0.65s ease" : "none",
        pointerEvents: overlayOut ? "none" : "auto",
      }}
    >
      {/* ── Video de fondo ── */}
      <BackgroundVideo />

      {/* ── Iris contraction al transicionar ── */}
      {isContracting && (
        <motion.div
          aria-hidden
          style={{
            position: "absolute", inset: 0, zIndex: 10,
            background: "#08030F",
          }}
          initial={{ clipPath: "inset(0% 0% round 0%)" }}
          animate={{ clipPath: "inset(50% 50% round 50%)" }}
          transition={{ duration: 1.2, ease: [0.7, 0, 0.84, 0] }}
        />
      )}

      {/* ── Contenido ── */}
      {!isContracting && (
        <div
          style={{
            position: "absolute", inset: 0, zIndex: 2,
            display: "flex", flexDirection: "column",
            alignItems: "center", justifyContent: "center",
            textAlign: "center", padding: "0 2rem",
          }}
        >
          {/* Título — misma tipografía que antes */}
          <motion.h1
            initial={reduced ? false : { opacity: 0, filter: "blur(10px)", y: 16 }}
            animate={{ opacity: 1, filter: "blur(0px)", y: 0 }}
            transition={{ duration: 0.7, delay: reduced ? 0 : 0.4, ease: [0.16, 1, 0.3, 1] }}
            style={{
              color: "#fff",
              fontSize: "clamp(36px, 5.5vw, 66px)",
              fontWeight: 900,
              lineHeight: 1.08,
              letterSpacing: "-0.02em",
              maxWidth: 820,
              textTransform: "uppercase",
              margin: 0,
            }}
          >
            Los dueños que escalan no venden.
          </motion.h1>

          {/* Subtítulo typewriter */}
          <TypewriterText
            text="Tienen sistemas que venden por ellos."
            startDelay={reduced ? 0 : 1100}
            speed={reduced ? 0 : 52}
            style={{
              marginTop: "1.6rem",
              fontSize: "clamp(15px, 1.55vw, 20px)",
              color: "rgba(255,255,255,0.62)",
              lineHeight: 1.65,
              maxWidth: 560,
              minHeight: "1.65em",
            }}
          />

          {/* Glass pill CTA */}
          <GlassPill onClick={startTransition} reduced={reduced} />
        </div>
      )}
    </div>
  );
}
