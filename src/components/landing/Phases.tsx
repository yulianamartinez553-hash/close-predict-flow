import { useState, useRef } from "react";
import {
  motion,
  useScroll,
  useTransform,
  AnimatePresence,
  type MotionValue,
} from "framer-motion";
import { Plus, Minus } from "lucide-react";

/* ─────────────────────────────────────────────────────────────────
   FUENTES
   • Editorial (números, nombres de fase, heading): Cormorant Garamond
     → var(--font-serif) ya cargada en el root del proyecto
   • Body (labels, objetivo, píldoras): Montserrat
     → var(--font-sans) / 'Montserrat', system-ui
   No se necesita importar Kanit ni font adicional.
───────────────────────────────────────────────────────────────── */
const SERIF = "'Cormorant Garamond', Georgia, serif";
const SANS  = "'Montserrat', system-ui, sans-serif";

/* ── CSS global inyectado una vez ─────────────────────────────── */
const GLOBAL_CSS = `
  .heading-gradient {
    background: linear-gradient(180deg, #2B1142 0%, #8B3FD6 100%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
  }
  .phase-gradient-bg {
    background: linear-gradient(123deg, #1E0A33 7%, #8B3FD6 37%, #9D4EDD 72%, #2B1142 100%);
  }
`;

/* ── DATA ─────────────────────────────────────────────────────── */
interface Phase {
  num: string;
  weeks: string;
  name: string;
  duration: string;
  objetivo: string;
  highlighted: boolean;
}

const PHASES: Phase[] = [
  {
    num: "01", weeks: "Sem 1–2", name: "Radiografía Comercial", duration: "2 semanas",
    objetivo: "Diagnóstico del estado real: leads, ventas, pauta, procesos. Identifica fugas. Punto actual vs. meta.",
    highlighted: false,
  },
  {
    num: "02", weeks: "Sem 3–4", name: "Arquitectura Comercial", duration: "2 semanas",
    objetivo: "Diseño del sistema: embudo, fases, criterios de calificación, herramientas para decidir y escalar.",
    highlighted: false,
  },
  {
    num: "03", weeks: "Sem 5–7", name: "Guiones y Calificación", duration: "3 semanas",
    objetivo: "Ruta de comunicación completa: qué decir y cuándo. Cómo calificar, cerrar o descartar leads.",
    highlighted: true,
  },
  {
    num: "04", weeks: "Sem 8–9", name: "KPIs y Dashboard", duration: "2 semanas",
    objetivo: "Métricas clave del embudo para decidir sobre precios y equipo. Optimización y rentabilidad.",
    highlighted: false,
  },
  {
    num: "05", weeks: "Sem 10–12", name: "Delegación y Escala", duration: "3 semanas",
    objetivo: "Roadmap de ejecución para el equipo. Sistema aplicable y delegable.",
    highlighted: false,
  },
];

/* ── FadeIn reutilizable ──────────────────────────────────────── */
function FadeIn({
  children, delay = 0, duration = 0.7, x = 0, y = 30, className = "",
}: {
  children: React.ReactNode;
  delay?: number; duration?: number;
  x?: number; y?: number; className?: string;
}) {
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, x, y }}
      whileInView={{ opacity: 1, x: 0, y: 0 }}
      viewport={{ once: true, margin: "50px", amount: 0 }}
      transition={{ duration, delay, ease: [0.25, 0.1, 0.25, 1] }}
    >
      {children}
    </motion.div>
  );
}

/* ── SECCIÓN 1: ACORDEÓN ──────────────────────────────────────── */
function AccordionItem({
  phase, index, isOpen, onToggle,
}: {
  phase: Phase; index: number; isOpen: boolean; onToggle: () => void;
}) {
  return (
    <FadeIn delay={index * 0.1} y={20}>
      <div style={{
        borderTop: index === 0 ? "1px solid rgba(139,63,214,0.2)" : "none",
        borderBottom: "1px solid rgba(139,63,214,0.2)",
      }}>
        <button
          onClick={onToggle}
          style={{
            width: "100%", background: "transparent", border: "none", cursor: "pointer",
            padding: "clamp(1.5rem, 3vw, 2.5rem) 0",
            display: "flex", alignItems: "center",
            gap: "clamp(1rem, 3vw, 2.5rem)", textAlign: "left",
          }}
        >
          {/* Número — fuente editorial (Cormorant Garamond) */}
          <span style={{
            fontFamily: SERIF, fontWeight: 700,
            fontSize: "clamp(3rem, 10vw, 140px)", lineHeight: 1,
            color: isOpen ? "#8B3FD6" : "#2B1142",
            minWidth: "clamp(3.5rem, 12vw, 160px)",
            transition: "color 0.3s ease", flexShrink: 0,
          }}>
            {phase.num}
          </span>

          {/* Nombre — fuente body (Montserrat) */}
          <span style={{
            flex: 1, fontFamily: SANS, fontWeight: 500,
            textTransform: "uppercase",
            fontSize: "clamp(1rem, 2.2vw, 2.1rem)", letterSpacing: "0.06em",
            color: "#2B1142", transition: "color 0.3s ease",
          }}>
            {phase.name}
          </span>

          {/* Ícono +/- */}
          <span style={{
            width: "clamp(36px, 4vw, 56px)", height: "clamp(36px, 4vw, 56px)",
            borderRadius: "50%", border: "2px solid #8B3FD6",
            display: "flex", alignItems: "center", justifyContent: "center",
            flexShrink: 0, transition: "background 0.3s ease",
            background: isOpen ? "#8B3FD6" : "transparent",
          }}>
            {isOpen ? <Minus size={18} color="#fff" /> : <Plus size={18} color="#8B3FD6" />}
          </span>
        </button>

        <AnimatePresence initial={false}>
          {isOpen && (
            <motion.div
              key="content"
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.45, ease: [0.25, 0.1, 0.25, 1] }}
              style={{ overflow: "hidden" }}
            >
              <div style={{
                paddingBottom: "clamp(1.5rem, 3vw, 2.5rem)",
                paddingLeft: "clamp(4.5rem, 14vw, 180px)",
                display: "flex", alignItems: "center",
                gap: "clamp(1.5rem, 4vw, 3rem)", flexWrap: "wrap",
              }}>
                {/* Píldora semanas · duración */}
                <span
                  className="phase-gradient-bg"
                  style={{
                    fontFamily: SANS, fontWeight: 600,
                    fontSize: "clamp(0.75rem, 1.4vw, 1rem)", letterSpacing: "0.08em",
                    textTransform: "uppercase",
                    padding: "0.35rem 1.1rem", borderRadius: "999px", color: "#fff",
                  }}
                >
                  {phase.weeks} · {phase.duration}
                </span>

                {/* Objetivo */}
                <p style={{
                  fontFamily: SANS, fontWeight: 400,
                  fontSize: "clamp(0.9rem, 1.6vw, 1.15rem)",
                  color: "#4B5563", lineHeight: 1.65, maxWidth: "38rem",
                }}>
                  {phase.objetivo}
                </p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </FadeIn>
  );
}

function PhasesAccordionSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <section style={{
      background: "#ffffff",
      padding: "clamp(4rem, 8vw, 8rem) clamp(1.25rem, 5vw, 2.5rem)",
    }}>
      <div style={{ maxWidth: "64rem", margin: "0 auto" }}>
        <FadeIn y={40}>
          <h2
            className="heading-gradient"
            style={{
              fontFamily: SERIF, fontWeight: 700,
              textTransform: "uppercase", letterSpacing: "-0.01em", lineHeight: 1,
              fontSize: "clamp(3rem, 12vw, 140px)",
              textAlign: "center", marginBottom: "clamp(3rem, 6vw, 6rem)",
            }}
          >
            Fases
          </h2>
        </FadeIn>

        <div>
          {PHASES.map((phase, i) => (
            <AccordionItem
              key={phase.num} phase={phase} index={i}
              isOpen={openIndex === i}
              onToggle={() => setOpenIndex(openIndex === i ? null : i)}
            />
          ))}
        </div>
      </div>
    </section>
  );
}

/* ── SECCIÓN 2: CARDS STICKY ──────────────────────────────────── */
function PhaseCard({
  phase, index, totalCards, progress,
}: {
  phase: Phase; index: number; totalCards: number; progress: MotionValue<number>;
}) {
  /* La última carta mantiene escala 1; las anteriores se achican 0.035 por posición */
  const targetScale = 1 - (totalCards - 1 - index) * 0.035;
  const scale = useTransform(progress, [index / totalCards, 1], [1, targetScale]);

  return (
    /* Contenedor sticky — offset escalonado: 80 · 108 · 136 · 164 · 192 px */
    <div style={{
      height: "85vh",
      display: "flex", alignItems: "flex-start", justifyContent: "center",
      position: "sticky",
      top: `${80 + index * 28}px`,
    }}>
      <motion.div style={{
        scale,
        width: "100%", maxWidth: "64rem", margin: "0 auto",
        borderRadius: "clamp(30px, 5vw, 60px)",
        border: phase.highlighted ? "2px solid #9D4EDD" : "2px solid #2B1142",
        background: phase.highlighted
          ? "linear-gradient(145deg, #1E0A33 0%, #2B1142 60%, #1a0530 100%)"
          : "#0C0C0C",
        padding: "clamp(1.5rem, 3vw, 2.5rem)",
        willChange: "transform",
        boxShadow: phase.highlighted
          ? "0 0 0 1px #8B3FD640, 0 24px 64px #8B3FD620"
          : "0 8px 32px rgba(0,0,0,0.4)",
        position: "relative", overflow: "hidden",
      }}>
        {/* Blob de resplandor en fase destacada */}
        {phase.highlighted && (
          <div style={{
            position: "absolute", top: -60, right: -60,
            width: 260, height: 260, borderRadius: "50%",
            background: "radial-gradient(circle, #8B3FD630 0%, transparent 70%)",
            pointerEvents: "none",
          }} />
        )}

        {/* Fila superior: número + meta */}
        <div style={{
          display: "flex", alignItems: "flex-start", justifyContent: "space-between",
          flexWrap: "wrap", gap: "1rem",
          marginBottom: "clamp(1.5rem, 3vw, 2.5rem)",
        }}>
          <div style={{ display: "flex", alignItems: "flex-start", gap: "clamp(1rem, 2.5vw, 2rem)" }}>
            {/* Número — editorial */}
            <span style={{
              fontFamily: SERIF, fontWeight: 700,
              fontSize: "clamp(3rem, 8vw, 120px)", lineHeight: 1,
              background: "linear-gradient(180deg, #646973 0%, #BBCCD7 100%)",
              WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text",
            }}>
              {phase.num}
            </span>

            <div style={{ paddingTop: "clamp(0.5rem, 1.5vw, 1.5rem)" }}>
              {/* Píldora semanas */}
              <span style={{
                display: "inline-block",
                fontFamily: SANS, fontWeight: 500,
                fontSize: "clamp(0.7rem, 1.2vw, 0.9rem)", textTransform: "uppercase",
                letterSpacing: "0.1em", padding: "0.25rem 0.9rem",
                borderRadius: "999px", border: "1px solid #8B3FD6",
                color: "#9D4EDD", marginBottom: "0.5rem",
              }}>
                {phase.weeks}
              </span>

              {/* Nombre — editorial */}
              <p style={{
                fontFamily: SERIF, fontWeight: 600,
                fontSize: "clamp(1rem, 2vw, 1.8rem)", textTransform: "uppercase",
                letterSpacing: "0.04em", color: "#D7E2EA",
              }}>
                {phase.name}
              </p>
            </div>
          </div>

          {/* Badge fase destacada */}
          {phase.highlighted && (
            <span
              className="phase-gradient-bg"
              style={{
                fontFamily: SANS, fontWeight: 600,
                fontSize: "clamp(0.65rem, 1vw, 0.85rem)", textTransform: "uppercase",
                letterSpacing: "0.1em", color: "#fff",
                padding: "0.4rem 1.1rem", borderRadius: "999px", alignSelf: "flex-start",
              }}
            >
              Fase destacada
            </span>
          )}
        </div>

        {/* Divisor */}
        <div style={{
          height: 1,
          background: phase.highlighted
            ? "linear-gradient(90deg, #8B3FD640, #9D4EDD60, #8B3FD640)"
            : "rgba(215,226,234,0.1)",
          marginBottom: "clamp(1.5rem, 3vw, 2rem)",
        }} />

        {/* Objetivo */}
        <div>
          <p style={{
            fontFamily: SANS, fontWeight: 300,
            fontSize: "clamp(0.75rem, 1.2vw, 1rem)", textTransform: "uppercase",
            letterSpacing: "0.12em", color: "#8B3FD6", marginBottom: "0.75rem",
          }}>
            Objetivo
          </p>
          <p style={{
            fontFamily: SANS, fontWeight: 400,
            fontSize: "clamp(0.9rem, 1.8vw, 1.35rem)",
            color: "#D7E2EA", lineHeight: 1.6, maxWidth: "48rem",
          }}>
            {phase.objetivo}
          </p>
        </div>

        {/* Duración */}
        <div style={{ marginTop: "clamp(1.5rem, 3vw, 2rem)" }}>
          <span style={{
            fontFamily: SANS, fontWeight: 800,
            fontSize: "clamp(0.7rem, 1.1vw, 0.85rem)", textTransform: "uppercase",
            letterSpacing: "0.15em", color: "#646973",
          }}>
            Duración:{" "}
            <span style={{ color: "#9D4EDD" }}>{phase.duration}</span>
          </span>
        </div>
      </motion.div>
    </div>
  );
}

function PhaseCardsSection() {
  const containerRef = useRef<HTMLElement>(null);

  /* useScroll apunta al contenedor de las cards, no al window */
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  });

  return (
    /*
      ⚠️ FIX SUPERPOSICIÓN — tres propiedades obligatorias:
      1. position: "relative"  → establece contexto de apilamiento
      2. zIndex: 10            → se superpone sobre la sección del acordeón
      3. marginTop: "-3rem"    → pull-up sobre la sección anterior
      NO usar Tailwind -mt-* aquí porque overflow-x: clip en el padre
      puede interactuar con las clases negativas de margin.
    */
    <section
      ref={containerRef}
      style={{
        position: "relative",          /* ← obligatorio para z-index */
        zIndex: 10,                    /* ← se superpone sobre sección 1 */
        background: "#ffffff",
        marginTop: "-3rem",            /* ← pull-up sobre sección acordeón */
        borderRadius: "clamp(30px, 5vw, 60px) clamp(30px, 5vw, 60px) 0 0",
        paddingTop: "clamp(4rem, 8vw, 8rem)",
        paddingBottom: "clamp(4rem, 8vw, 8rem)",
        paddingLeft: "clamp(1.25rem, 5vw, 2.5rem)",
        paddingRight: "clamp(1.25rem, 5vw, 2.5rem)",
      }}
    >
      <div style={{ maxWidth: "64rem", margin: "0 auto" }}>
        <FadeIn y={40}>
          <h2
            className="heading-gradient"
            style={{
              fontFamily: SERIF, fontWeight: 700,
              textTransform: "uppercase", letterSpacing: "-0.01em", lineHeight: 1,
              fontSize: "clamp(3rem, 12vw, 140px)",
              textAlign: "center", marginBottom: "clamp(3rem, 6vw, 6rem)",
            }}
          >
            Detalle
          </h2>
        </FadeIn>
      </div>

      <div style={{ maxWidth: "64rem", margin: "0 auto" }}>
        {PHASES.map((phase, i) => (
          <PhaseCard
            key={phase.num} phase={phase} index={i}
            totalCards={PHASES.length} progress={scrollYProgress}
          />
        ))}
      </div>
    </section>
  );
}

/* ── EXPORT ───────────────────────────────────────────────────── */
export function Phases() {
  return (
    <>
      <style>{GLOBAL_CSS}</style>
      {/*
        overflowX: "clip" — CRÍTICO para que position: sticky funcione.
        "hidden" crea un nuevo contexto de formato que rompe el sticky.
        "clip" recorta el overflow horizontal sin afectar el scroll vertical.
      */}
      <div style={{ background: "#ffffff", overflowX: "clip" }}>
        <PhasesAccordionSection />
        <PhaseCardsSection />
      </div>
    </>
  );
}
