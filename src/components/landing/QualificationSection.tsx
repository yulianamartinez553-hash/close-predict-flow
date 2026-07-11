import { useRef, useEffect } from "react";
import { motion, useInView } from "framer-motion";
import { useReducedMotion } from "@/lib/use-reduced-motion";

/* ─────────────────────────────────────────────────────────────────
   DATOS
───────────────────────────────────────────────────────────────── */
const NOT_FOR_YOU: string[] = [
  "Tu negocio lleva menos de 6 meses en el mercado o aún estás validando tu oferta.",
  "Nunca has cerrado una venta tú mismo — sin proceso no hay nada que sistematizar.",
  "Tienes un negocio de retail o productos físicos.",
  "No estás dispuesto a soltar el control de las ventas, aunque eso te cueste crecer.",
  "Esperas fórmulas mágicas que funcionen sin pasar por el proceso real.",
  "Buscas resultados en menos tiempo del que toma construir algo sólido.",
  "No estás dispuesto a comprometerte con el proceso completo.",
];

const FOR_YOU: string[] = [
  "Eres infoproductor, consultor o dueño de negocio con más de 6 meses vendiendo.",
  "Ya vendes, pero cada cierre depende de que tú estés ahí.",
  "Facturas +$5K/mes pero el crecimiento tiene techo — y ese techo eres tú.",
  "Estás cansado de ser el mejor vendedor de tu propio negocio.",
  "Intentaste delegar las ventas y los resultados no fueron los mismos sin ti.",
  "Quieres escalar sin más tiempo ni más gestión tuya.",
  "Quieres facturación escalable con un sistema medible y predecible.",
  "Invertiste en pauta o planeas hacerlo para potenciar tus ventas.",
  "Estás listo para implementar un sistema que funcione sin ti en cada venta.",
];

/* ─────────────────────────────────────────────────────────────────
   TOKENS
───────────────────────────────────────────────────────────────── */
const BG      = "#1A1038"; /* color plano — usado para las máscaras de fundido del video-bridge */
const BG_GRADIENT = "var(--gradient-section)"; /* fondo real del wrapper — igual al de las secciones 4-8 */
const POPPINS  = "'Poppins', 'Inter', system-ui, sans-serif";
const ACCENT_SERIF = "'Cormorant Garamond', 'Playfair Display', Georgia, serif";
const BULLET   = "#7209B7";
const VIDEO_URL =
  "https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260328_105406_16f4600d-7a92-4292-b96e-b19156c7830a.mp4";

/* ─────────────────────────────────────────────────────────────────
   FRAMER MOTION VARIANTS
───────────────────────────────────────────────────────────────── */
const EASE = [0.22, 1, 0.36, 1] as const;

const titleContainer = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.12 } },
};
const titleLine = {
  hidden:   { opacity: 0, y: 20, filter: "blur(4px)" },
  visible:  { opacity: 1, y: 0,  filter: "blur(0px)", transition: { duration: 0.80, ease: EASE } },
};

const listContainer = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.08, delayChildren: 0.12 } },
};
const listItem = {
  hidden:  { opacity: 0, y: 14 },
  visible: { opacity: 1, y: 0,  transition: { duration: 0.60, ease: EASE } },
};

/* ─────────────────────────────────────────────────────────────────
   VIDEO BRIDGE — cruza ambas secciones con parallax suave
───────────────────────────────────────────────────────────────── */
function VideoBridge() {
  const innerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const onScroll = () => {
      if (!innerRef.current) return;
      const wrapper = innerRef.current.closest("[data-qs-wrapper]") as HTMLElement | null;
      if (!wrapper) return;
      const scrolled = -wrapper.getBoundingClientRect().top;
      innerRef.current.style.transform = `translateY(${scrolled * 0.15}px)`;
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <div
      aria-hidden
      style={{
        position:      "absolute",
        top:           "50vh",      /* empieza en la mitad del wrapper — 50% en sección 1 y 50% en sección 2 */
        left:          0,
        right:         0,
        height:        "100vh",
        zIndex:        1,
        overflow:      "hidden",
        pointerEvents: "none",
      }}
    >
      {/* Fade — borde superior */}
      <div style={{
        position:   "absolute", top: 0, left: 0, right: 0, height: "38%", zIndex: 2,
        background: `linear-gradient(to bottom, ${BG} 0%, transparent 100%)`,
      }} />
      {/* Fade — borde inferior */}
      <div style={{
        position:   "absolute", bottom: 0, left: 0, right: 0, height: "38%", zIndex: 2,
        background: `linear-gradient(to top, ${BG} 0%, transparent 100%)`,
      }} />

      {/* Video con parallax vía ref */}
      <div ref={innerRef} style={{ width: "100%", height: "120%", marginTop: "-10%" }}>
        <video
          src={VIDEO_URL}
          autoPlay
          muted
          loop
          playsInline
          style={{ width: "100%", height: "100%", objectFit: "cover", opacity: 0.22 }}
        />
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────────
   BLOCK — una sección individual
───────────────────────────────────────────────────────────────── */
interface BlockProps {
  eyebrow:  string;
  prefix:   string;
  accent:   string;
  phrases:  string[];
  listSide: "left" | "right";
}

function Block({ eyebrow, prefix, accent, phrases, listSide }: BlockProps) {
  const reduced     = useReducedMotion();
  const titleRef    = useRef<HTMLDivElement>(null);
  const listRef     = useRef<HTMLDivElement>(null);
  const titleInView = useInView(titleRef, { once: true, amount: 0.30 });
  const listInView  = useInView(listRef,  { once: true, amount: 0.15 });

  return (
    <section
      style={{
        position:       "relative",
        zIndex:         2,
        minHeight:      "100vh",
        background:     "transparent",
        display:        "flex",
        alignItems:     "center",
        justifyContent: "center",
      }}
    >
      <div
        style={{
          maxWidth:      "1360px",
          width:         "100%",
          padding:       "clamp(5rem, 9vh, 9rem) clamp(2rem, 5vw, 5rem)",
          display:       "flex",
          alignItems:    "center",
          gap:           "clamp(5rem, 10vw, 12rem)",
          flexDirection: listSide === "right" ? "row" : "row-reverse",
        }}
      >

        {/* ── Columna del título ── */}
        <motion.div
          ref={titleRef}
          style={{
            flex:          "0 0 38%",
            display:       "flex",
            flexDirection: "column",
            alignItems:    "center",
            textAlign:     "center",
          }}
          initial={reduced ? false : "hidden"}
          animate={reduced || titleInView ? "visible" : "hidden"}
          variants={titleContainer}
        >
          {/* Eyebrow — "ANTES DE EMPEZAR" */}
          <motion.p
            variants={titleLine}
            style={{
              margin:        0,
              fontFamily:    POPPINS,
              fontWeight:    600,
              fontSize:      "clamp(9px, 0.68vw, 11px)",
              letterSpacing: "0.35em",
              textTransform: "uppercase",
              color:         "#FFFFFF",
              lineHeight:    1.4,
            }}
          >
            {eyebrow}
          </motion.p>

          {/* Prefix — "Este programa", serif editorial */}
          <motion.p
            variants={titleLine}
            style={{
              margin:     "8px 0 0",
              fontFamily: ACCENT_SERIF,
              fontWeight: 500,
              fontStyle:  "italic",
              fontSize:   "clamp(16px, 1.8vw, 22px)",
              letterSpacing: "0.01em",
              color:      "rgba(255,255,255,0.82)",
              lineHeight: 1.4,
            }}
          >
            {prefix}
          </motion.p>

          {/* Título — "No"/"Sí" en degradé violeta/lila, resto en blanco marfil */}
          <motion.p
            variants={titleLine}
            style={{
              margin:     "10px 0 0",
              fontFamily: ACCENT_SERIF,
              fontStyle:  "normal",
              fontWeight: 400,
              fontSize:   "clamp(44px, 4.6vw, 68px)",
              lineHeight: 1.0,
              whiteSpace: "nowrap",
            }}
          >
            <span
              style={{
                background: "linear-gradient(135deg, #8B3FD6 0%, #C9A7F0 100%)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
              }}
            >
              {accent.split(" ")[0]}
            </span>
            <span style={{ color: "#F5F3EF" }}>
              {" " + accent.split(" ").slice(1).join(" ")}
            </span>
          </motion.p>
        </motion.div>

        {/* ── Columna de la lista ── */}
        <motion.div
          ref={listRef}
          style={{
            flex:          "0 0 50%",
            display:       "flex",
            flexDirection: "column",
            gap:           "22px",
          }}
          initial={reduced ? false : "hidden"}
          animate={reduced || listInView ? "visible" : "hidden"}
          variants={listContainer}
        >
          {phrases.map((text, i) => (
            <motion.div
              key={i}
              variants={listItem}
              style={{ display: "flex", gap: "16px", alignItems: "flex-start" }}
            >
              <svg
                width="8"
                height="8"
                viewBox="0 0 8 8"
                aria-hidden
                style={{ flexShrink: 0, marginTop: "8px" }}
              >
                <circle cx="4" cy="4" r="4" fill={BULLET} />
              </svg>
              <span
                style={{
                  fontFamily:      POPPINS,
                  fontWeight:      500,
                  fontSize:        "clamp(13px, 1.1vw, 16px)",
                  lineHeight:      1.6,
                  color:           "rgba(240,236,255,0.90)",
                  display:         "-webkit-box",
                  WebkitLineClamp: 2,
                  WebkitBoxOrient: "vertical",
                  overflow:        "hidden",
                }}
              >
                {text}
              </span>
            </motion.div>
          ))}
        </motion.div>

      </div>
    </section>
  );
}

/* ─────────────────────────────────────────────────────────────────
   EXPORT PRINCIPAL — wrapper con video bridge entre ambas secciones
───────────────────────────────────────────────────────────────── */
export function QualificationSections() {
  return (
    <div data-qs-wrapper="" style={{ position: "relative", background: BG_GRADIENT }}>
      <VideoBridge />
      <Block
        eyebrow="ANTES DE EMPEZAR"
        prefix="Este programa"
        accent="No es para ti si..."
        phrases={NOT_FOR_YOU}
        listSide="right"
      />
      <Block
        eyebrow="ANTES DE EMPEZAR"
        prefix="Este programa"
        accent="Sí es para ti si..."
        phrases={FOR_YOU}
        listSide="left"
      />
    </div>
  );
}

/* Exports individuales — compatibilidad con imports existentes */
export function NotForYouSection() {
  return (
    <Block
      eyebrow="ANTES DE EMPEZAR"
      prefix="Este programa"
      accent="No es para ti si..."
      phrases={NOT_FOR_YOU}
      listSide="right"
    />
  );
}
export function ForYouSection() {
  return (
    <Block
      eyebrow="ANTES DE EMPEZAR"
      prefix="Este programa"
      accent="Sí es para ti si..."
      phrases={FOR_YOU}
      listSide="left"
    />
  );
}
