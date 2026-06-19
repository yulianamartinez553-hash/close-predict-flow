import { useState, useEffect, useCallback, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ShiningButton } from "@/components/animations/ShiningButton";

const SCREENS = [
  {
    title: "¿TENÉS VENTAS IMPREDECIBLES?",
    subtitle: ["Un mes crecés.", "Al siguiente no sabés por qué cayó."],
    showButton: false,
  },
  {
    title: "LEADS SIN SEGUIMIENTO",
    subtitle: ["Los contactos te llegan, pero nadie sabe qué hacer después."],
    showButton: false,
  },
  {
    title: "NO NECESITÁS TRABAJAR MÁS",
    subtitle: ["Necesitás un proceso mejor."],
    showButton: true,
  },
] as const;

interface Props {
  onComplete: () => void;
}

export function SequenceIntro({ onComplete }: Props) {
  const [current, setCurrent] = useState(0);
  const cooldownRef = useRef(false);

  const advance = useCallback(() => {
    if (cooldownRef.current) return;
    cooldownRef.current = true;
    setTimeout(() => { cooldownRef.current = false; }, 900);

    setCurrent((prev) => {
      if (prev < SCREENS.length - 1) return prev + 1;
      onComplete();
      return prev;
    });
  }, [onComplete]);

  // Scroll ≥ 30px triggers advance
  useEffect(() => {
    const onWheel = (e: WheelEvent) => {
      if (e.deltaY > 30) advance();
    };
    const onTouch = (() => {
      let startY = 0;
      return {
        start: (e: TouchEvent) => { startY = e.touches[0].clientY; },
        end: (e: TouchEvent) => {
          if (startY - e.changedTouches[0].clientY > 30) advance();
        },
      };
    })();
    window.addEventListener("wheel", onWheel, { passive: true });
    window.addEventListener("touchstart", onTouch.start, { passive: true });
    window.addEventListener("touchend", onTouch.end, { passive: true });
    return () => {
      window.removeEventListener("wheel", onWheel);
      window.removeEventListener("touchstart", onTouch.start);
      window.removeEventListener("touchend", onTouch.end);
    };
  }, [advance]);

  const screen = SCREENS[current];

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={current}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.75, ease: "easeInOut" }}
        className="fixed inset-0 z-[100] flex cursor-pointer items-center justify-center overflow-hidden"
        style={{
          background:
            "linear-gradient(160deg, #1a0533 0%, #0d0118 45%, #000000 100%)",
        }}
        onClick={!screen.showButton ? advance : undefined}
      >
        {/* Floating particles */}
        <div className="pointer-events-none absolute inset-0">
          {[...Array(32)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute rounded-full"
              style={{
                left: `${(i * 37) % 100}%`,
                top: `${(i * 53) % 100}%`,
                width: 2 + (i % 3) * 2,
                height: 2 + (i % 3) * 2,
                background: i % 3 === 0 ? "#F4C430" : "#9D4EDD",
                opacity: 0.25,
              }}
              animate={{ y: [0, -22, 0], opacity: [0.1, 0.4, 0.1] }}
              transition={{
                duration: 4 + (i % 5),
                repeat: Infinity,
                delay: i * 0.14,
              }}
            />
          ))}
        </div>

        {/* Radial glow */}
        <div
          className="pointer-events-none absolute inset-0"
          style={{
            background:
              "radial-gradient(ellipse 65% 55% at 50% 50%, rgba(139,63,214,0.22) 0%, transparent 70%)",
          }}
        />

        {/* Content */}
        <div className="relative z-10 px-6 text-center">
          <motion.h1
            initial={{ opacity: 0, y: 28, filter: "blur(10px)" }}
            animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
            transition={{ delay: 0.18, duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
            className="display font-black text-white text-balance leading-tight tracking-tight"
            style={{ fontSize: "clamp(34px, 7vw, 80px)" }}
          >
            {screen.title}
          </motion.h1>

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.42, duration: 0.8 }}
            className="mt-6 space-y-3"
          >
            {screen.subtitle.map((line, i) => (
              <p key={i} className="text-lg font-light text-white/70 sm:text-2xl">
                {line}
              </p>
            ))}
          </motion.div>

          {screen.showButton ? (
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.62, duration: 0.8 }}
              className="mt-12"
              onClick={(e) => e.stopPropagation()}
            >
              <ShiningButton
                text="CONOCER CLOSE PREDICT"
                onClick={onComplete}
                size="lg"
              />
            </motion.div>
          ) : (
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.85, duration: 0.8 }}
              className="display mt-12 text-[11px] uppercase tracking-[0.3em] text-white/30"
            >
              Click o scroll para continuar
            </motion.p>
          )}
        </div>

        {/* Progress dots */}
        <div className="absolute bottom-8 left-1/2 flex -translate-x-1/2 gap-2">
          {SCREENS.map((_, i) => (
            <div
              key={i}
              className="h-1 rounded-full transition-all duration-500"
              style={{
                width: i === current ? 24 : 8,
                background:
                  i === current
                    ? "#F4C430"
                    : "rgba(255,255,255,0.22)",
              }}
            />
          ))}
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
