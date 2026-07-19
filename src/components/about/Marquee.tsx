import { useState } from "react";
import { motion } from "framer-motion";
import { useReducedMotion } from "@/lib/use-reduced-motion";
import { useIsMobile } from "@/lib/use-media-query";

/* Marquee de texto reutilizable.
   - Track duplicado exactamente 2× → x: 0% → -50% en loop lineal.
   - Duración por JS (useMediaQuery), no por CSS.
   - Hover: no pausa; sube la opacidad (vía data-hover en about.css).
   - La copia duplicada es aria-hidden; el texto se anuncia una sola vez. */
export function Marquee({
  text,
  repeat = 5,
  direction = "left",
  durationDesktop = 22,
  durationMobile = 14,
  separator = "•",
}: {
  text: string;
  repeat?: number;
  direction?: "left" | "right";
  durationDesktop?: number;
  durationMobile?: number;
  separator?: string;
}) {
  const reduced = useReducedMotion();
  const isMobile = useIsMobile();
  const [hover, setHover] = useState(false);
  const duration = isMobile ? durationMobile : durationDesktop;

  const items = Array.from({ length: repeat });
  const OneTrack = ({ hidden = false }: { hidden?: boolean }) => (
    <span style={{ display: "inline-flex", alignItems: "center" }} aria-hidden={hidden || undefined}>
      {items.map((_, i) => (
        <span key={i} className="about-marquee-word">
          {text}
          <span style={{ opacity: 0.6, margin: "0 0.1em" }}>{separator}</span>
        </span>
      ))}
    </span>
  );

  /* Movimiento reducido: estático mostrando la primera copia */
  if (reduced) {
    return (
      <div className="about-marquee" role="presentation">
        <div className="about-marquee-track" style={{ transform: "translateX(0)" }}>
          <span className="sr-only">{text}</span>
          <OneTrack hidden />
        </div>
      </div>
    );
  }

  const from = direction === "left" ? "0%" : "-50%";
  const to = direction === "left" ? "-50%" : "0%";

  return (
    <div
      className="about-marquee"
      data-hover={hover ? "true" : "false"}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
    >
      {/* texto accesible una sola vez */}
      <span className="sr-only">{text}</span>
      <motion.div
        className="about-marquee-track"
        animate={{ x: [from, to] }}
        transition={{ duration, ease: "linear", repeat: Infinity }}
      >
        <OneTrack hidden />
        <OneTrack hidden />
      </motion.div>
    </div>
  );
}
