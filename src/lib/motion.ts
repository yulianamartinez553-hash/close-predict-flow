/* ─────────────────────────────────────────────────────────────────
   Sistema de movimiento global — "Sobre mí" (réplica del ritmo de
   vilmanunez.com/sobre-vilma adaptada a Caro Chaparro).
   Definido una sola vez; ningún componente define duraciones inline.
───────────────────────────────────────────────────────────────── */
import type { Variants } from "framer-motion";

export const EASE = {
  out: [0.22, 1, 0.36, 1] as const, // reveals, entradas
  inOut: [0.65, 0, 0.35, 1] as const, // desplazamientos ligados a scroll
  soft: [0.33, 1, 0.68, 1] as const, // hover, micro-interacción
} as const;

export const DUR = {
  micro: 0.28, // hover, cambio de estado
  base: 0.7, // reveal de bloque
  slow: 1.1, // frase a pantalla completa
  count: 2.2, // contadores
} as const;

export const STAGGER = {
  tight: 0.06, // palabras dentro de una frase
  base: 0.1, // elementos hermanos
  loose: 0.16, // tarjetas grandes
} as const;

/* Umbrales de viewport (§3.3) */
export const VIEWPORT = {
  text: { amount: 0.35, margin: "0px 0px -10% 0px" },
  image: { amount: 0.25, margin: "0px 0px -8% 0px" },
  phrase: { amount: 0.55, margin: "0px" },
  counter: { amount: 0.5, margin: "0px 0px -15% 0px" },
  mosaic: { amount: 0.1, margin: "0px 0px -5% 0px" },
} as const;

/* ── Variantes base ──────────────────────────────────────────── */
export const revealUp: Variants = {
  hidden: { opacity: 0, y: 32 },
  show: { opacity: 1, y: 0, transition: { duration: DUR.base, ease: EASE.out } },
};

export const revealScale: Variants = {
  hidden: { opacity: 0, scale: 0.94 },
  show: { opacity: 1, scale: 1, transition: { duration: DUR.base, ease: EASE.out } },
};

export const wordReveal: Variants = {
  hidden: { opacity: 0, y: "0.6em" },
  show: { opacity: 1, y: 0, transition: { duration: 0.55, ease: EASE.out } },
};

/* Contenedor genérico con stagger configurable */
export const staggerParent = (stagger: number, delayChildren = 0): Variants => ({
  hidden: {},
  show: { transition: { staggerChildren: stagger, delayChildren } },
});

/* Variante "reveal solo opacidad" para prefers-reduced-motion */
export const revealReduced: Variants = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { duration: 0.3 } },
};
