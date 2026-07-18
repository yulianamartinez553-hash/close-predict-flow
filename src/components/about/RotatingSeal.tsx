import { motion } from "framer-motion";
import { useReducedMotion } from "@/lib/use-reduced-motion";

/* Sello circular con texto sobre un círculo (textPath) que rota en loop.
   aria-hidden; el contenido se ofrece como texto accesible fuera de pantalla. */
export function RotatingSeal({
  text,
  size = 240,
  duration = 18,
  direction = "cw",
}: {
  text: string;
  size?: number;
  duration?: number;
  direction?: "cw" | "ccw";
}) {
  const reduced = useReducedMotion();
  const r = size / 2 - 22;
  const cx = size / 2;
  const repeated = ` ${text} • `.toUpperCase();
  const target = direction === "cw" ? 360 : -360;

  return (
    <div style={{ position: "relative", width: size, height: size }}>
      <span className="sr-only">{text}</span>
      <motion.div
        aria-hidden
        style={{ width: size, height: size, willChange: "transform" }}
        animate={reduced ? undefined : { rotate: target }}
        transition={reduced ? undefined : { duration, ease: "linear", repeat: Infinity }}
      >
        <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
          <defs>
            <path
              id={`seal-${text.slice(0, 6).replace(/\W/g, "")}-${direction}`}
              d={`M ${cx},${cx} m -${r},0 a ${r},${r} 0 1,1 ${r * 2},0 a ${r},${r} 0 1,1 -${r * 2},0`}
              fill="none"
            />
          </defs>
          <text
            fill="var(--violet)"
            style={{
              fontFamily: "'Montserrat', system-ui, sans-serif",
              fontWeight: 700,
              fontSize: size < 200 ? 11 : 13,
              letterSpacing: "0.18em",
            }}
          >
            <textPath href={`#seal-${text.slice(0, 6).replace(/\W/g, "")}-${direction}`}>
              {repeated.repeat(3)}
            </textPath>
          </text>
        </svg>
      </motion.div>
      {/* Núcleo con glow estático */}
      <div
        aria-hidden
        className="about-glow"
        style={{
          position: "absolute",
          left: "50%",
          top: "50%",
          width: 14,
          height: 14,
          transform: "translate(-50%,-50%)",
          borderRadius: "50%",
          background: "var(--violet)",
        }}
      />
    </div>
  );
}
