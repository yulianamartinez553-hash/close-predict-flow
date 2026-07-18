import { useMemo, useRef, type ElementType, type ReactNode } from "react";
import { motion, useInView } from "framer-motion";
import { useReducedMotion } from "@/lib/use-reduced-motion";
import { DUR, EASE, STAGGER, VIEWPORT, revealUp, staggerParent } from "@/lib/motion";
import { useStaticReveal } from "./static-mode";

/* ═══════════ AuroraLayer ═══════════
   3–5 manchas radiales #240046, mix-blend-mode soft-light. Estáticas
   (no animadas por keyframe de layout); el movimiento lo dan las
   secciones que las escalan con scroll cuando corresponde. */
interface Blob {
  x: string;
  y: string;
  size: string;
  opacity?: number;
}
const DEFAULT_BLOBS: Blob[] = [
  { x: "-10%", y: "-8%", size: "42vw", opacity: 0.55 },
  { x: "75%", y: "12%", size: "34vw", opacity: 0.45 },
  { x: "20%", y: "70%", size: "48vw", opacity: 0.5 },
  { x: "88%", y: "82%", size: "30vw", opacity: 0.4 },
];
export function AuroraLayer({
  blobs = DEFAULT_BLOBS,
  intensity = 1,
}: {
  blobs?: Blob[];
  intensity?: number;
}) {
  return (
    <div aria-hidden style={{ position: "absolute", inset: 0, overflow: "hidden", pointerEvents: "none", zIndex: 0 }}>
      {blobs.map((b, i) => (
        <div
          key={i}
          style={{
            position: "absolute",
            left: b.x,
            top: b.y,
            width: b.size,
            height: b.size,
            transform: "translate(-30%, -30%)",
            borderRadius: "50%",
            background: "radial-gradient(circle, var(--ink-accent) 0%, transparent 68%)",
            mixBlendMode: "soft-light",
            opacity: (b.opacity ?? 0.5) * intensity,
            filter: "blur(30px)",
          }}
        />
      ))}
    </div>
  );
}

/* ═══════════ RevealBlock ═══════════
   Entrada whileInView (once) de un bloque; con stagger opcional para hijos. */
export function RevealBlock({
  children,
  as = "div",
  stagger,
  amount = VIEWPORT.text.amount,
  margin = VIEWPORT.text.margin,
  className,
  style,
}: {
  children: ReactNode;
  as?: ElementType;
  stagger?: number;
  amount?: number;
  margin?: string;
  className?: string;
  style?: React.CSSProperties;
}) {
  const reduced = useReducedMotion();
  const staticMode = useStaticReveal();
  // memoizado: evita crear un tipo nuevo por render (remontaría los hijos)
  const MotionTag = useMemo(() => motion.create(as as ElementType), [as]);
  // initial={false} → framer renderiza el estado final (show) sin transición.
  const initial = reduced || staticMode ? false : "hidden";
  const animateProps = staticMode
    ? { animate: "show" as const }
    : { whileInView: "show" as const, viewport: { once: true, amount, margin: margin as any } };

  if (stagger != null) {
    return (
      <MotionTag className={className} style={style} initial={initial} {...animateProps} variants={staggerParent(stagger)}>
        {children}
      </MotionTag>
    );
  }

  return (
    <MotionTag
      className={className}
      style={style}
      initial={initial}
      {...animateProps}
      variants={reduced ? undefined : revealUp}
    >
      {children}
    </MotionTag>
  );
}

/* Hijo directo de un RevealBlock con stagger */
export function RevealItem({
  children,
  className,
  style,
}: {
  children: ReactNode;
  className?: string;
  style?: React.CSSProperties;
}) {
  return (
    <motion.div className={className} style={style} variants={revealUp}>
      {children}
    </motion.div>
  );
}

/* ═══════════ WordReveal ═══════════
   Título que entra palabra por palabra. Acepta \n para forzar líneas. */
export function WordReveal({
  text,
  className,
  style,
  stagger = STAGGER.tight,
  delayChildren = 0.15,
  amount = 0.55,
  trigger = "view",
}: {
  text: string;
  className?: string;
  style?: React.CSSProperties;
  stagger?: number;
  delayChildren?: number;
  amount?: number;
  /** "mount": anima al montar (hero, primer bloque). "view": al entrar en viewport. */
  trigger?: "view" | "mount";
}) {
  const reduced = useReducedMotion();
  const staticMode = useStaticReveal();
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, amount });
  // "mount": anima apenas hidrata; "view": cuando entra en viewport.
  const active = staticMode || (trigger === "mount" ? true : inView);
  const lines = text.split("\n");
  let wordIndex = 0;

  return (
    <span
      ref={ref}
      className={className}
      style={{ display: "block", ...style }}
      aria-label={text.replace(/\n/g, " ")}
    >
      {lines.map((line, li) => (
        <span key={li} style={{ display: "block" }} aria-hidden>
          {line.split(" ").map((word, wi) => (
            <span
              key={wi}
              style={{ display: "inline-block", overflow: "hidden", verticalAlign: "top" }}
            >
              <motion.span
                style={{ display: "inline-block", willChange: "transform" }}
                initial={staticMode ? false : reduced ? { opacity: 0 } : { opacity: 0, y: "0.6em" }}
                animate={
                  reduced
                    ? { opacity: active ? 1 : 0 }
                    : active
                      ? { opacity: 1, y: 0 }
                      : { opacity: 0, y: "0.6em" }
                }
                transition={{
                  duration: 0.55,
                  ease: EASE.out,
                  delay: active && !staticMode ? delayChildren + wordIndex++ * stagger : 0,
                }}
              >
                {word}
                {wi < line.split(" ").length - 1 ? " " : ""}
              </motion.span>
            </span>
          ))}
        </span>
      ))}
    </span>
  );
}

/* ═══════════ MaskedLines ═══════════
   Frases display reveladas línea por línea: cada línea en overflow hidden,
   el texto sube desde y:110% a 0. */
export function MaskedLines({
  lines,
  className,
  style,
  stagger = STAGGER.base,
  amount = 0.55,
}: {
  lines: string[];
  className?: string;
  style?: React.CSSProperties;
  stagger?: number;
  amount?: number;
}) {
  const reduced = useReducedMotion();
  const staticMode = useStaticReveal();
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, amount }) || staticMode;

  return (
    <div ref={ref} className={className} style={style} aria-label={lines.join(" ")}>
      {lines.map((line, i) => (
        <span key={i} style={{ display: "block", overflow: "hidden" }} aria-hidden>
          <motion.span
            style={{ display: "block", willChange: "transform" }}
            initial={staticMode ? false : reduced ? { opacity: 0 } : { y: "110%" }}
            animate={
              reduced
                ? inView
                  ? { opacity: 1 }
                  : { opacity: 0 }
                : inView
                  ? { y: "0%" }
                  : { y: "110%" }
            }
            transition={{ duration: 0.75, ease: EASE.out, delay: staticMode ? 0 : i * stagger }}
          >
            {line}
          </motion.span>
        </span>
      ))}
    </div>
  );
}

/* ═══════════ ScrollCue ═══════════
   Flecha idle que ancla a un id con scroll suave. */
export function ScrollCue({ targetId }: { targetId: string }) {
  const reduced = useReducedMotion();
  const go = () => {
    document.getElementById(targetId)?.scrollIntoView({
      behavior: reduced ? "auto" : "smooth",
      block: "start",
    });
  };
  return (
    <motion.button
      type="button"
      onClick={go}
      aria-label="Bajar a la siguiente sección"
      whileHover={{ scale: 1.15 }}
      transition={{ duration: DUR.micro, ease: EASE.soft }}
      style={{
        background: "transparent",
        border: "none",
        cursor: "pointer",
        color: "var(--violet)",
        display: "inline-flex",
        padding: 8,
      }}
    >
      <motion.svg
        width="30"
        height="30"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
        animate={reduced ? undefined : { y: [0, 8, 0] }}
        transition={reduced ? undefined : { duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
      >
        <path d="M12 5v14M19 12l-7 7-7-7" />
      </motion.svg>
    </motion.button>
  );
}
