import { motion } from "framer-motion";
import { useReducedMotion } from "@/lib/use-reduced-motion";
import { STAGGER, VIEWPORT, revealUp, staggerParent } from "@/lib/motion";
import { ImageSlot } from "./ImageSlot";
import type { Testimonial } from "@/content/about/testimonials";

/* Grid estático de testimonios (S10). Sin loop.
   4 col desktop / 2 tablet / 1 móvil. Hover: sube la tarjeta, borde+glow;
   las hermanas NO se atenúan (ese gesto queda reservado a los mosaicos). */
export function TestimonialGrid({ items }: { items: Testimonial[] }) {
  const reduced = useReducedMotion();

  return (
    <motion.div
      className="about-testi-grid"
      initial={reduced ? false : "hidden"}
      whileInView="show"
      viewport={{ once: true, amount: VIEWPORT.image.amount }}
      variants={staggerParent(STAGGER.base)}
      style={{ display: "grid", gap: "1rem" }}
    >
      {items.map((t) => (
        <motion.article
          key={t.id}
          variants={reduced ? undefined : revealUp}
          className="glass-card about-testi-card"
          whileHover={reduced ? undefined : { y: -6 }}
          transition={{ duration: 0.28, ease: [0.33, 1, 0.68, 1] }}
          style={{
            borderRadius: 16,
            padding: "1.4rem",
            border: "1px solid color-mix(in oklab, #7b2cbf 25%, transparent)",
            background: "color-mix(in oklab, #240046 40%, transparent)",
            display: "flex",
            flexDirection: "column",
            gap: "0.9rem",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "0.7rem" }}>
            <div style={{ width: 56, height: 56, flexShrink: 0, borderRadius: "50%", overflow: "hidden" }}>
              <ImageSlot id={t.id} ratio="1/1" />
            </div>
            <div style={{ minWidth: 0 }}>
              <div style={{ fontWeight: 700, color: "var(--text-primary)", fontSize: 15 }}>{t.name}</div>
              <div
                style={{
                  color: "var(--text-muted)",
                  fontSize: 13,
                  textTransform: "uppercase",
                  letterSpacing: "0.1em",
                }}
              >
                {t.role}
              </div>
            </div>
          </div>
          <p style={{ color: "var(--text-primary)", fontSize: 15, lineHeight: 1.55, margin: 0 }}>
            “{t.quote}”
          </p>
        </motion.article>
      ))}
    </motion.div>
  );
}
