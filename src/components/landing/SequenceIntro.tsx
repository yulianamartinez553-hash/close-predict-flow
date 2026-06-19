import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface Props {
  onComplete: () => void;
}

// Static seed — values must not change between SSR and hydration
const PARTICLES = Array.from({ length: 38 }, (_, i) => ({
  id: i,
  x: ((i * 37 + 13) % 97) + 1.5,
  y: ((i * 53 + 7) % 95) + 2,
  size: 2 + (i % 3) * 1.5,
  duration: 3.5 + (i % 5) * 0.7,
  delay: (i % 8) * 0.35,
  opacity: 0.18 + (i % 5) * 0.07,
}));

function BgParticles() {
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden>
      {PARTICLES.map(p => (
        <motion.div
          key={p.id}
          className="absolute rounded-full"
          style={{
            left: `${p.x}%`,
            top: `${p.y}%`,
            width: p.size,
            height: p.size,
            background: "#8B3FD6",
            opacity: p.opacity,
          }}
          animate={{ y: [0, -16, 0], opacity: [p.opacity, p.opacity * 2.2, p.opacity] }}
          transition={{ duration: p.duration, delay: p.delay, repeat: Infinity, ease: "easeInOut" }}
        />
      ))}
    </div>
  );
}

export function SequenceIntro({ onComplete }: Props) {
  const [screen, setScreen] = useState(0);

  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = ""; };
  }, []);

  const advance = useCallback(() => {
    if (screen === 0) {
      setScreen(1);
    } else {
      document.body.style.overflow = "";
      onComplete();
    }
  }, [screen, onComplete]);

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (["Enter", " ", "ArrowDown", "ArrowRight"].includes(e.key)) {
        e.preventDefault();
        advance();
      }
    };
    const handleWheel = (e: WheelEvent) => { if (e.deltaY > 20) advance(); };
    window.addEventListener("keydown", handleKey);
    window.addEventListener("wheel", handleWheel, { passive: true });
    return () => {
      window.removeEventListener("keydown", handleKey);
      window.removeEventListener("wheel", handleWheel);
    };
  }, [advance]);

  return (
    <div
      className="fixed inset-0 z-[200] flex cursor-pointer select-none items-center justify-center overflow-hidden"
      style={{ background: "linear-gradient(160deg, #2B1142 0%, #1E0A33 100%)" }}
      onClick={advance}
    >
      <BgParticles />

      <AnimatePresence mode="wait">
        {screen === 0 ? (
          <motion.div
            key="s1"
            initial={{ opacity: 0, y: 28 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -28 }}
            transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1] }}
            className="relative z-10 mx-auto max-w-3xl px-8 text-center"
          >
            <h1
              className="text-white"
              style={{
                fontSize: "clamp(48px, 7vw, 72px)",
                fontWeight: 900,
                lineHeight: 1.08,
                letterSpacing: "-0.02em",
              }}
            >
              ¿VENTAS IMPREDECIBLES?
            </h1>
            <p
              className="mt-6"
              style={{
                fontSize: "clamp(16px, 2vw, 22px)",
                color: "rgba(255,255,255,0.62)",
                lineHeight: 1.65,
              }}
            >
              Los contactos te llegan, pero nadie sabe qué hacer después.
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
            key="s2"
            initial={{ opacity: 0, y: 28 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -28 }}
            transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1] }}
            className="relative z-10 mx-auto max-w-3xl px-8 text-center"
          >
            <h1
              className="text-white"
              style={{
                fontSize: "clamp(48px, 7vw, 72px)",
                fontWeight: 900,
                lineHeight: 1.08,
                letterSpacing: "-0.02em",
              }}
            >
              NO NECESITÁS<br />TRABAJAR MÁS
            </h1>
            <p
              className="mt-6"
              style={{
                fontSize: "clamp(16px, 2vw, 20px)",
                color: "rgba(255,255,255,0.62)",
              }}
            >
              Necesitás mejorar tu proceso.
            </p>
            <button
              onClick={e => { e.stopPropagation(); advance(); }}
              className="relative mt-10 overflow-hidden rounded-full font-black uppercase text-white"
              style={{
                fontSize: "16px",
                padding: "16px 40px",
                background: "#8B3FD6",
                boxShadow: "0 0 20px rgba(139,63,214,0.6)",
                cursor: "pointer",
                border: "none",
                letterSpacing: "0.1em",
              }}
            >
              <span className="relative z-10">CONOCER CLOSE PREDICT</span>
              <motion.span
                aria-hidden
                className="pointer-events-none absolute inset-0 -skew-x-12"
                style={{
                  background:
                    "linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.32) 50%, transparent 100%)",
                }}
                animate={{ x: ["-120%", "220%"] }}
                transition={{ duration: 1.1, repeat: Infinity, repeatDelay: 1.9, ease: "linear" }}
              />
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
