import { useRef, type ReactNode } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { useReducedMotion } from "@/lib/use-reduced-motion";
import { AuroraLayer } from "./primitives";

const ROMAN = ["I", "II", "III", "IV", "V"] as const;

/* Estructura de hito (S6, S7, S9, S11, S14):
   - Columna izquierda sticky con categoría + título + numeral romano detrás (sin años).
   - Columna derecha: cuerpo que scrollea contra la etiqueta fija.
   - El numeral romano tiene desplazamiento propio ligado al scroll. */
export function MilestoneSection({
  index,
  kicker,
  title,
  children,
  id,
  extraTopPad = false,
}: {
  index: number; // 0-based → numeral romano
  kicker: string;
  title: string;
  children: ReactNode;
  id?: string;
  extraTopPad?: boolean;
}) {
  const reduced = useReducedMotion();
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });
  const romanY = useTransform(scrollYProgress, [0, 1], ["15%", "-15%"]);

  return (
    <section
      id={id}
      ref={ref}
      style={{
        position: "relative",
        background: "var(--ink)",
        paddingTop: extraTopPad ? "clamp(6rem, 12vh, 10rem)" : "clamp(4rem, 9vh, 8rem)",
        paddingBottom: "clamp(4rem, 9vh, 8rem)",
      }}
    >
      <AuroraLayer intensity={0.8} />
      <div
        style={{
          position: "relative",
          zIndex: 1,
          maxWidth: "1180px",
          margin: "0 auto",
          padding: "0 clamp(1.5rem, 5vw, 4rem)",
          display: "grid",
          gap: "clamp(2rem, 5vw, 5rem)",
          gridTemplateColumns: "minmax(0, 0.8fr) minmax(0, 1.2fr)",
        }}
        className="milestone-grid"
      >
        {/* Etiqueta sticky */}
        <div style={{ position: "relative" }}>
          <div style={{ position: "sticky", top: "18vh" }}>
            {/* Numeral romano decorativo detrás */}
            <motion.span
              aria-hidden
              className="about-display"
              style={{
                position: "absolute",
                top: "-0.35em",
                left: "-0.06em",
                fontSize: "clamp(120px, 20vw, 300px)",
                color: "var(--ink-accent)",
                opacity: 0.9,
                y: reduced ? 0 : romanY,
                zIndex: 0,
                pointerEvents: "none",
                lineHeight: 0.8,
              }}
            >
              {ROMAN[index] ?? index + 1}
            </motion.span>
            <div style={{ position: "relative", zIndex: 1 }}>
              <div
                style={{
                  color: "var(--violet)",
                  fontFamily: "'Montserrat', system-ui, sans-serif",
                  fontWeight: 700,
                  textTransform: "uppercase",
                  letterSpacing: "0.2em",
                  fontSize: "clamp(11px, 1vw, 13px)",
                  marginBottom: "0.6rem",
                }}
              >
                {kicker}
              </div>
              <h2
                className="about-display"
                style={{
                  fontSize: "clamp(30px, 4.5vw, 60px)",
                  color: "var(--text-primary)",
                  textTransform: "uppercase",
                  margin: 0,
                }}
              >
                {title}
              </h2>
            </div>
          </div>
        </div>

        {/* Cuerpo */}
        <div style={{ position: "relative", zIndex: 1 }}>{children}</div>
      </div>
    </section>
  );
}
