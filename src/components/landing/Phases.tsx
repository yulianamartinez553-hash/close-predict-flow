import { useState, useRef } from "react";
import {
  motion,
  useScroll,
  useTransform,
  AnimatePresence,
  type MotionValue,
} from "framer-motion";
import { Plus, Minus } from "lucide-react";
import { useReducedMotion } from "@/lib/use-reduced-motion";
import { instantTransition, viewTransition } from "@/lib/animations";

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
    background: linear-gradient(180deg, #f0e8ff 0%, #c084fc 100%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
  }
  .phase-gradient-bg {
    background: linear-gradient(123deg, #4a2878 7%, #8B3FD6 37%, #9D4EDD 72%, #936ce3 100%);
  }
`;

/* ── DATA ─────────────────────────────────────────────────────── */
interface Phase {
  num: string;
  weeks: string;
  name: string;
  duration: string;
  objetivo: string;
  items: string[];
  variant: "default" | "transparent" | "highlighted" | "light" | "lighter";
}

const PHASES: Phase[] = [
  {
    num: "01", weeks: "Sem 1–2", name: "Radiografía Comercial", duration: "2 semanas",
    objetivo: "Diagnóstico del estado real: ventas, procesos, fugas, punto actual vs. meta.",
    items: [
      "Número de leads que entran por semana",
      "Fuente de leads (pauta vs referidos)",
      "Tasa de conversión actual",
    ],
    variant: "transparent",
  },
  {
    num: "02", weeks: "Sem 3–4", name: "Arquitectura Comercial", duration: "2 semanas",
    objetivo: "Diseño del sistema: embudo, fases, criterios de calificación, herramientas para decidir y escalar.",
    items: [
      "% de leads calificados vs descartados (criterios BANT)",
      "Tiempo promedio de respuesta al lead",
    ],
    variant: "default",
  },
  {
    num: "03", weeks: "Sem 5–7", name: "Cierre", duration: "3 semanas",
    objetivo: "Crear una ruta de comunicación completa: qué decir y cuándo. Cómo calificar, cerrar o descartar leads.",
    items: [
      "Tasa de cierre (benchmark: 25% → 35%)",
      "Número de llamadas de venta realizadas por semana",
      "Objeciones más frecuentes registradas",
    ],
    variant: "highlighted",
  },
  {
    num: "04", weeks: "Sem 8–9", name: "KPIs y Dashboard", duration: "2 semanas",
    objetivo: "Brindarte métricas claves del embudo para decidir sobre precios, equipo, optimización y rentabilidad.",
    items: [
      "Leads en seguimiento activo",
      "Tasa de conversión post-seguimiento",
      "Reporte semanal de avance comercial",
    ],
    variant: "light",
  },
  {
    num: "05", weeks: "Sem 10–12", name: "Delegación", duration: "3 semanas",
    objetivo: "Entrega de roadmap de ejecución para el equipo. Sistema aplicable y delegable.",
    items: [
      "% del playbook documentado y listo para delegar",
      "Número de guiones completados y validados",
      "Cumplimiento del Roadmap de 90 días",
    ],
    variant: "lighter",
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
  const reduced = useReducedMotion();
  return (
    <motion.div
      className={className}
      initial={reduced ? false : { opacity: 0, x, y }}
      whileInView={reduced ? undefined : { opacity: 1, x: 0, y: 0 }}
      viewport={{ once: true, margin: "50px", amount: 0 }}
      transition={viewTransition(reduced, { duration, delay, ease: [0.25, 0.1, 0.25, 1] })}
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
  const reduced = useReducedMotion();
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
              initial={reduced ? false : { height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={reduced ? undefined : { height: 0, opacity: 0 }}
              transition={viewTransition(reduced, { duration: 0.45, ease: [0.25, 0.1, 0.25, 1] })}
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
              fontSize: "clamp(2rem, 6vw, 72px)",
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

/* ── ESTILOS POR VARIANTE ─────────────────────────────────────── */
const CARD_STYLES = {
  default: {
    border: "2px solid #8B3FD630",
    background: "linear-gradient(145deg, #1E0A33 0%, #2B1142 100%)",
    boxShadow: "0 8px 40px #1E0A3360",
    divider: "linear-gradient(90deg, transparent, #8B3FD625, transparent)",
    durationLabel: "#9D4EDD80",
    durationValue: "#C084FC",
  },
  transparent: {
    border: "2px solid #6B30A040",
    background: "#240046",
    boxShadow: "0 8px 40px #24004670",
    divider: "linear-gradient(90deg, transparent, #6B30A028, transparent)",
    durationLabel: "#B06EDD80",
    durationValue: "#D4A0FF",
  },
  highlighted: {
    border: "2px solid #9D4EDD",
    background: "linear-gradient(145deg, #2B1142 0%, #3D1660 50%, #8B3FD620 100%)",
    boxShadow: "0 0 0 2px #9D4EDD30, 0 24px 64px #8B3FD635, inset 0 1px 0 #9D4EDD20",
    divider: "linear-gradient(90deg, transparent, #9D4EDD70, transparent)",
    durationLabel: "#9D4EDD80",
    durationValue: "#C084FC",
  },
  light: {
    border: "2px solid #B07EE8",
    background: "linear-gradient(145deg, #3D1660 0%, #7040B0 100%)",
    boxShadow: "0 0 0 1px #B07EE830, 0 24px 64px #6B35A840",
    divider: "linear-gradient(90deg, transparent, #B07EE860, transparent)",
    durationLabel: "rgba(255,255,255,0.45)",
    durationValue: "rgba(255,255,255,0.85)",
  },
  lighter: {
    border: "2px solid #C49AEE50",
    background: "linear-gradient(145deg, #4A1E78 0%, #8A50C8 62%, rgba(138,80,200,0.68) 100%)",
    boxShadow: "0 0 0 1px #C49AEE25, 0 24px 64px #7B40B835",
    divider: "linear-gradient(90deg, transparent, #C49AEE50, transparent)",
    durationLabel: "rgba(255,255,255,0.50)",
    durationValue: "rgba(255,255,255,0.92)",
  },
} as const;

/* ── SECCIÓN 2: CARDS STICKY ──────────────────────────────────── */
function PhaseCard({
  phase, index, totalCards, progress, reduced,
}: {
  phase: Phase; index: number; totalCards: number; progress: MotionValue<number>;
  reduced: boolean;
}) {
  const targetScale = 1 - (totalCards - 1 - index) * 0.035;
  const scaleMotion = useTransform(progress, [index / totalCards, 1], [1, targetScale]);
  const styles = CARD_STYLES[phase.variant];
  const isHighlighted = phase.variant === "highlighted";

  return (
    <div style={{
      height: reduced ? "auto" : "85vh",
      display: "flex", alignItems: "flex-start", justifyContent: "center",
      position: reduced ? "relative" : "sticky",
      top: reduced ? undefined : `${88 + index * 28}px`,
      marginBottom: reduced ? "1.5rem" : undefined,
    }}>
      <motion.div
        style={{
          scale: reduced ? 1 : scaleMotion,
          width: "100%",
          maxWidth: "64rem",
          margin: "0 auto",
          borderRadius: "clamp(30px, 5vw, 60px)",
          border: styles.border,
          background: styles.background,
          padding: "clamp(1.5rem, 3vw, 2.5rem)",
          willChange: "transform",
          boxShadow: styles.boxShadow,
          position: "relative",
          overflow: "hidden",
        }}>
        {/* Blob decorativo — solo en highlighted */}
        {isHighlighted && (
          <div style={{
            position: "absolute", top: -60, right: -60,
            width: 260, height: 260, borderRadius: "50%",
            background: "radial-gradient(circle, #9D4EDD45 0%, #8B3FD615 50%, transparent 70%)",
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
            {/* Número */}
            <span style={{
              fontFamily: SERIF, fontWeight: 700,
              fontSize: "clamp(3rem, 8vw, 120px)", lineHeight: 1,
              background: "linear-gradient(180deg, #9D4EDD 0%, #F5F3F7 100%)",
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
                borderRadius: "999px", border: "1px solid #9D4EDD50",
                color: "#C084FC", background: "#8B3FD615", marginBottom: "0.5rem",
              }}>
                {phase.weeks}
              </span>

              {/* Nombre */}
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
          {isHighlighted && (
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
          background: styles.divider,
          marginBottom: "clamp(1.5rem, 3vw, 2rem)",
        }} />

        {/* Objetivo + Ítems */}
        <div>
          <p style={{
            fontFamily: SANS, fontWeight: 300,
            fontSize: "clamp(0.75rem, 1.2vw, 1rem)", textTransform: "uppercase",
            letterSpacing: "0.12em", color: "#C084FC", marginBottom: "0.75rem",
          }}>
            Objetivo
          </p>
          <p style={{
            fontFamily: SANS, fontWeight: 400,
            fontSize: "clamp(0.9rem, 1.8vw, 1.35rem)",
            color: "#F5F3F7", lineHeight: 1.6, maxWidth: "48rem",
          }}>
            {phase.objetivo}
          </p>

          {phase.items.length > 0 && (
            <ul style={{
              marginTop: "clamp(0.9rem, 1.8vw, 1.4rem)",
              paddingLeft: 0, listStyle: "none",
              display: "flex", flexDirection: "column", gap: "0.5rem",
            }}>
              {phase.items.map((item, i) => (
                <li key={i} style={{
                  fontFamily: SANS, fontWeight: 400,
                  fontSize: "clamp(0.78rem, 1.35vw, 1rem)",
                  color: "#C084FC",
                  display: "flex", alignItems: "flex-start", gap: "0.55rem",
                  lineHeight: 1.5,
                }}>
                  <span style={{ color: "#9D4EDD", flexShrink: 0 }}>·</span>
                  {item}
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Duración */}
        <div style={{ marginTop: "clamp(1.5rem, 3vw, 2rem)" }}>
          <span style={{
            fontFamily: SANS, fontWeight: 800,
            fontSize: "clamp(0.7rem, 1.1vw, 0.85rem)", textTransform: "uppercase",
            letterSpacing: "0.15em", color: styles.durationLabel,
          }}>
            Duración:{" "}
            <span style={{ color: styles.durationValue }}>{phase.duration}</span>
          </span>
        </div>
      </motion.div>
    </div>
  );
}

function PhaseCardsSection() {
  const reduced = useReducedMotion();
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
      id="detalle"
      ref={containerRef}
      style={{
        position: "relative",
        zIndex: 10,
        background: "transparent",
        paddingBottom: "clamp(0.25rem, 0.5vw, 0.5rem)",
        overflow: "clip",
      }}
    >
      {/* Título — flujo normal, desaparece al hacer scroll */}
      <div style={{
        paddingTop: "clamp(2.5rem, 5vw, 4rem)",
        paddingBottom: "clamp(1.2rem, 2.5vw, 2rem)",
        paddingLeft: "clamp(1.25rem, 5vw, 2.5rem)",
        paddingRight: "clamp(1.25rem, 5vw, 2.5rem)",
      }}>
        <div style={{ maxWidth: "64rem", margin: "0 auto" }}>
          <FadeIn y={40}>
            <h2
              className="heading-gradient"
              style={{
                fontFamily: SERIF, fontWeight: 700,
                textTransform: "uppercase", letterSpacing: "-0.01em", lineHeight: 1,
                fontSize: "clamp(1.4rem, 3.5vw, 44px)",
                textAlign: "center", margin: 0,
              }}
            >
              Fases
            </h2>
          </FadeIn>
        </div>
      </div>

      {/* Tarjetas sticky — apilan debajo del título */}
      <div style={{
        maxWidth: "64rem", margin: "0 auto",
        paddingLeft: "clamp(1.25rem, 5vw, 2.5rem)",
        paddingRight: "clamp(1.25rem, 5vw, 2.5rem)",
        paddingTop: "clamp(1.5rem, 3vw, 2.5rem)",
      }}>
        {PHASES.map((phase, i) => (
          <PhaseCard
            key={phase.num} phase={phase} index={i}
            totalCards={PHASES.length} progress={scrollYProgress}
            reduced={reduced}
          />
        ))}
      </div>
    </section>
  );
}

/* ── FAQ DATA ─────────────────────────────────────────────────── */
interface FaqItem {
  num: string;
  question: string;
  shortAnswer: string;
  fullAnswer: string;
}

const FAQ_ITEMS: FaqItem[] = [
  {
    num: "01",
    question: "¿En cuánto tiempo veo resultados?",
    shortAnswer: "Desde el primer mes",
    fullAnswer: "Detectamos dónde se están escapando tus ventas y empezamos a optimizar el proceso. Al final de las 12 semanas tienes un sistema completo, con datos reales y listo para escalar.",
  },
  {
    num: "02",
    question: "¿Necesito tener un equipo de ventas para entrar al programa?",
    shortAnswer: "No, no necesitas tener un equipo para entrar al programa",
    fullAnswer: "El programa está diseñado para que primero construyas el sistema, y después decidas si y cuándo delegarlo. Empeza siendo tú el único que vende.",
  },
  {
    num: "03",
    question: "¿Qué pasa si no puedo asistir a alguna sesión?",
    shortAnswer: "Todas las sesiones se coordinan contigo",
    fullAnswer: "Si surge algún imprevisto, se reagenda. Lo importante es mantener la continuidad del proceso.",
  },
  {
    num: "04",
    question: "¿Esto funciona para mi tipo de negocio?",
    shortAnswer: "Si tienes un negocio que ya vende, sí",
    fullAnswer: "El sistema está diseñado para infoproductores, consultores y dueños de negocio que venden servicios o programas. Si tienes una oferta que ya vende y quieres escalarla sin depender de ti, aplica.",
  },
  {
    num: "05",
    question: "¿Esto funciona si vendo programas de bajo ticket?",
    shortAnswer: "Sí, funciona",
    fullAnswer: "Lo importante no es el precio de tu oferta sino que ya se haya vendido y validado en el mercado. Si ya tienes clientes reales y quieres escalar sin depender de ti en cada venta, el sistema aplica.",
  },
  {
    num: "06",
    question: "¿Cuánto tiempo debo dedicarle por semana?",
    shortAnswer: "El avance depende directamente de tu ejecución entre sesiones",
    fullAnswer: "Una sesión semanal de 60 minutos más el tiempo de implementación de las tareas acordadas.",
  },
  {
    num: "07",
    question: "¿Qué diferencia este programa de otros de ventas?",
    shortAnswer: "Esto no es un curso de guiones ni respuestas automáticas",
    fullAnswer: "Entramos desde la raíz a crear e implementar un sistema comercial que no dependa de ti, con datos, estructura y capacidad de delegación. No te doy una fórmula genérica. Construimos el sistema específico de tu negocio para que puedas escalar sin que todo dependa de tu presencia en cada venta.",
  },
  {
    num: "08",
    question: "¿Qué tan personalizado es el programa?",
    shortAnswer: "100%",
    fullAnswer: "No trabajamos con una plantilla genérica. Cada entregable: playbook, guiones, dashboard, se construye con la información real de tu negocio, tu oferta y tu proceso actual.",
  },
  {
    num: "09",
    question: "¿Qué pasa si ya tengo un proceso de ventas armado?",
    shortAnswer: "Partimos del que ya tienes",
    fullAnswer: "Identificamos qué está funcionando, qué no, y lo convertimos en un sistema documentado y delegable. No empezamos desde cero si no es necesario.",
  },
  {
    num: "10",
    question: "¿Necesito saber de ventas para entrar?",
    shortAnswer: "No, no necesitas ser experto en ventas",
    fullAnswer: "Necesitas tener un negocio que ya vende y querer dejar de ser el cuello de botella. El sistema se construye contigo, no te lo dejamos para que lo figures solo.",
  },
];

/* ── FAQ ITEM ─────────────────────────────────────────────────── */
function FaqAccordionItem({
  item, index, isOpen, onToggle,
}: {
  item: FaqItem; index: number; isOpen: boolean; onToggle: () => void;
}) {
  const reduced = useReducedMotion();
  return (
    <FadeIn delay={index * 0.06} y={18}>
      <div style={{
        borderTop: index === 0 ? "1px solid rgba(139,63,214,0.2)" : "none",
        borderBottom: "1px solid rgba(139,63,214,0.2)",
      }}>
        <button
          onClick={onToggle}
          style={{
            width: "100%", background: "transparent", border: "none", cursor: "pointer",
            padding: "clamp(1.4rem, 2.8vw, 2.2rem) 0",
            display: "flex", alignItems: "center",
            gap: "clamp(1rem, 2.5vw, 2rem)", textAlign: "left",
          }}
        >
          {/* Número */}
          <span style={{
            fontFamily: SERIF, fontWeight: 700,
            fontSize: "clamp(2.4rem, 7vw, 100px)", lineHeight: 1,
            color: isOpen ? "#c084fc" : "rgba(255,255,255,0.22)",
            minWidth: "clamp(3rem, 11vw, 130px)",
            transition: "color 0.3s ease", flexShrink: 0,
          }}>
            {item.num}
          </span>

          {/* Pregunta */}
          <span style={{
            flex: 1, fontFamily: SANS, fontWeight: 500,
            fontSize: "clamp(0.88rem, 1.7vw, 1.4rem)",
            color: "#f0ecff", lineHeight: 1.35,
            transition: "color 0.3s ease",
          }}>
            {item.question}
          </span>

          {/* Botón +/- */}
          <span style={{
            width: "clamp(34px, 3.8vw, 52px)", height: "clamp(34px, 3.8vw, 52px)",
            borderRadius: "50%", border: "2px solid #8B3FD6",
            display: "flex", alignItems: "center", justifyContent: "center",
            flexShrink: 0, transition: "background 0.3s ease",
            background: isOpen ? "#8B3FD6" : "transparent",
          }}>
            {isOpen ? <Minus size={17} color="#fff" /> : <Plus size={17} color="#8B3FD6" />}
          </span>
        </button>

        <AnimatePresence initial={false}>
          {isOpen && (
            <motion.div
              key="faq-content"
              initial={reduced ? false : { height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={reduced ? undefined : { height: 0, opacity: 0 }}
              transition={viewTransition(reduced, { duration: 0.42, ease: [0.25, 0.1, 0.25, 1] })}
              style={{ overflow: "hidden" }}
            >
              <div style={{
                paddingBottom: "clamp(1.4rem, 2.8vw, 2.2rem)",
                paddingLeft: "clamp(4rem, 13vw, 160px)",
                display: "flex", alignItems: "flex-start",
                gap: "clamp(1rem, 3vw, 2.5rem)", flexWrap: "wrap",
              }}>
                {/* Óvalo violeta — respuesta corta */}
                <span
                  className="phase-gradient-bg"
                  style={{
                    fontFamily: SANS, fontWeight: 600,
                    fontSize: "clamp(0.72rem, 1.2vw, 0.92rem)", letterSpacing: "0.05em",
                    padding: "0.38rem 1.15rem", borderRadius: "999px", color: "#fff",
                    flexShrink: 0,
                  }}
                >
                  {item.shortAnswer}
                </span>

                {/* Respuesta completa */}
                <p style={{
                  fontFamily: SANS, fontWeight: 400,
                  fontSize: "clamp(0.85rem, 1.45vw, 1.1rem)",
                  color: "rgba(240,236,255,0.70)", lineHeight: 1.7, maxWidth: "40rem",
                  margin: 0,
                }}>
                  {item.fullAnswer}
                </p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </FadeIn>
  );
}

/* ── FAQ SECTION ──────────────────────────────────────────────── */
function FaqSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <section style={{
      background: "transparent",
      padding: "clamp(4rem, 8vw, 8rem) clamp(1.25rem, 5vw, 2.5rem)",
    }}>
      <div style={{ maxWidth: "64rem", margin: "0 auto" }}>
        <FadeIn y={40}>
          <h2
            className="heading-gradient"
            style={{
              fontFamily: SERIF, fontWeight: 700,
              letterSpacing: "-0.01em", lineHeight: 1,
              fontSize: "clamp(1.4rem, 3.5vw, 44px)",
              textAlign: "center", marginBottom: "clamp(3rem, 6vw, 6rem)",
            }}
          >
            FAQ - CLOSE PREDICT™
          </h2>
        </FadeIn>

        <div>
          {FAQ_ITEMS.map((item, i) => (
            <FaqAccordionItem
              key={item.num} item={item} index={i}
              isOpen={openIndex === i}
              onToggle={() => setOpenIndex(openIndex === i ? null : i)}
            />
          ))}
        </div>
      </div>
    </section>
  );
}

/* ── EXPORTS ──────────────────────────────────────────────────── */
export function Phases() {
  return (
    <>
      <style>{GLOBAL_CSS}</style>
      <div style={{ background: "#ffffff", overflowX: "clip" }}>
        <PhasesAccordionSection />
        <PhaseCardsSection />
      </div>
    </>
  );
}

/* Preguntas frecuentes — reemplaza la lista de fases en posición 9 */
export function FAQ() {
  return (
    <>
      <style>{GLOBAL_CSS}</style>
      <div style={{ background: "transparent", overflowX: "clip" }}>
        <FaqSection />
      </div>
    </>
  );
}

/* Lista simple del acordeón — conservada pero no usada en el orden actual */
export function PhasesSimpleList() {
  return (
    <>
      <style>{GLOBAL_CSS}</style>
      <div style={{ background: "#ffffff", overflowX: "clip" }}>
        <PhasesAccordionSection />
      </div>
    </>
  );
}

/* Tarjetas sticky con id="detalle" — se usa en posición 4 */
export function PhasesDetail() {
  return (
    <>
      <style>{GLOBAL_CSS}</style>
      {/*
        overflowX: "clip" — CRÍTICO para que position: sticky funcione.
        "hidden" crea un nuevo contexto de formato que rompe el sticky.
      */}
      <div style={{ background: "transparent", overflowX: "clip" }}>
        <PhaseCardsSection />
      </div>
    </>
  );
}
