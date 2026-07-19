import { useEffect, useRef } from "react";
import { animate, motion, useInView, useMotionValue, useTransform } from "framer-motion";
import { useReducedMotion } from "@/lib/use-reduced-motion";
import { DUR, EASE } from "@/lib/motion";

/* Contador robusto — corrige el bug conocido del "0+" clavado:
   1. El `ref` va SIEMPRE en un nodo renderizado (nunca dentro de un condicional).
   2. Se valida Number.isFinite(to) antes de animar.
   3. El número se renderiza dentro de un motion.span con un motion-value, no como texto plano.
   4. StrictMode monta dos veces → controls.stop() en el cleanup es obligatorio.
   Para valores < 100, 2.2s se percibe roto → se usa 1.4s. */
function Counter({
  to,
  suffix = "+",
  label,
  locale = "es-AR",
}: {
  to: number;
  suffix?: string;
  label: string;
  locale?: string;
}) {
  const reduced = useReducedMotion();
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.5, margin: "0px 0px -15% 0px" });
  const valid = Number.isFinite(to);

  const count = useMotionValue(reduced ? to : 0);
  const rounded = useTransform(count, (v) =>
    new Intl.NumberFormat(locale, { maximumFractionDigits: 0 }).format(Math.round(v)),
  );

  useEffect(() => {
    if (reduced || !valid || !inView) {
      if (reduced || !valid) count.set(to);
      return;
    }
    const duration = to < 100 ? 1.4 : DUR.count;
    const controls = animate(count, to, { duration, ease: EASE.out });
    return () => controls.stop();
  }, [inView, to, valid, reduced, count]);

  return (
    <div
      style={{ display: "flex", flexDirection: "column", gap: "0.35rem" }}
      role="group"
      aria-label={`${to}${suffix} ${label}`}
    >
      <span
        ref={ref}
        className="tabular-nums about-display"
        aria-hidden
        style={{
          color: "var(--violet)",
          fontSize: "clamp(48px, 7vw, 92px)",
          lineHeight: 1,
          display: "inline-flex",
          alignItems: "baseline",
        }}
      >
        <motion.span>{valid ? rounded : to}</motion.span>
        <span style={{ fontSize: "0.6em", fontWeight: 800, marginLeft: "0.04em" }}>{suffix}</span>
      </span>
      <span
        aria-hidden
        style={{
          color: "var(--text-muted)",
          fontSize: 14,
          textTransform: "uppercase",
          letterSpacing: "0.12em",
          fontFamily: "'Montserrat', system-ui, sans-serif",
          fontWeight: 600,
        }}
      >
        {label}
      </span>
    </div>
  );
}

export { Counter };
