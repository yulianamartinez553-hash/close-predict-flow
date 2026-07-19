import { useRef, useState } from "react";
import { motion, useInView, useScroll, useSpring, useTransform } from "framer-motion";
import { useReducedMotion } from "@/lib/use-reduced-motion";
import { useMediaQuery, useIsMobile } from "@/lib/use-media-query";
import { DUR, EASE } from "@/lib/motion";
import { ImageSlot } from "./ImageSlot";

/* ─────────────────────────────────────────────────────────────────
   MOSAICO DIAGONAL (⭐ movimiento prioritario)
   - Contenedor rotado → lectura en diagonal.
   - Cada fila: wrapper con x ligado a scroll (opuesto por fila) +
     track interno con deriva autónoma infinita (nunca queda quieto).
   - Hover de imagen: escala/rotación, desaturación→color, borde violeta,
     glow y atenuado de las hermanas.
   - Touch: la imagen centrada (amount 0.8) toma el estado destacado.
───────────────────────────────────────────────────────────────── */

interface MosaicFigureProps {
  id: string;
  myKey: string;
  activeKey: string | null;
  setActive: (k: string | null) => void;
  isTouch: boolean;
  width: string;
  priority: boolean;
}

function MosaicFigure({
  id,
  myKey,
  activeKey,
  setActive,
  isTouch,
  width,
  priority,
}: MosaicFigureProps) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { amount: 0.8 });

  const isActive = isTouch ? inView : activeKey === myKey;
  const dimmed = activeKey != null && activeKey !== myKey && !isTouch;

  return (
    <motion.figure
      ref={ref}
      className="about-mosaic-fig"
      data-active={isActive ? "true" : "false"}
      style={{ width, margin: "0 0.6vw", aspectRatio: "3 / 4" }}
      onHoverStart={() => !isTouch && setActive(myKey)}
      onHoverEnd={() => !isTouch && setActive(null)}
      animate={{
        scale: dimmed ? 0.98 : isActive ? 1.07 : 1,
        rotate: isActive && !isTouch ? 1.5 : 0,
        opacity: dimmed ? 0.45 : 1,
        zIndex: isActive ? 20 : 1,
      }}
      transition={{ duration: DUR.micro, ease: EASE.soft }}
    >
      <ImageSlot id={id} ratio="3/4" priority={priority} />
    </motion.figure>
  );
}

interface DiagonalMosaicProps {
  slots: string[];
  rows: number;
  rotate?: number;
  /** duración de la deriva autónoma por fila (segundos) */
  speeds: number[];
  /** rango de x ligado a scroll por fila, ej. ['-14%','10%'] */
  scrollRange: [string, string][];
  heightDesktop: string;
  heightMobile: string;
  itemWidthDesktop?: string;
  itemWidthMobile?: string;
}

export function DiagonalMosaic({
  slots,
  rows,
  rotate = -8,
  speeds,
  scrollRange,
  heightDesktop,
  heightMobile,
  itemWidthDesktop = "22vw",
  itemWidthMobile = "46vw",
}: DiagonalMosaicProps) {
  const reduced = useReducedMotion();
  const isMobile = useIsMobile();
  const isTouch = useMediaQuery("(pointer: coarse)");
  const [activeKey, setActiveKey] = useState<string | null>(null);
  const ref = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });

  const width = isMobile ? itemWidthMobile : itemWidthDesktop;
  const height = isMobile ? heightMobile : heightDesktop;

  // Reparto de slots en filas
  const perRow = Math.ceil(slots.length / rows);
  const rowSlots = Array.from({ length: rows }, (_, r) => slots.slice(r * perRow, (r + 1) * perRow));

  return (
    <div
      ref={ref}
      style={{
        position: "relative",
        height,
        overflow: "hidden",
        transform: `rotate(${rotate}deg)`,
        width: "130%",
        marginLeft: "-15%",
        contentVisibility: "auto",
        containIntrinsicSize: `${height} 130vw`,
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        gap: "clamp(0.8rem, 2vw, 1.6rem)",
        WebkitMaskImage:
          "linear-gradient(to right, transparent, black 12%, black 88%, transparent)",
        maskImage: "linear-gradient(to right, transparent, black 12%, black 88%, transparent)",
      }}
    >
      {rowSlots.map((ids, r) => (
        <MosaicRow
          key={r}
          ids={ids}
          rowIndex={r}
          activeKey={activeKey}
          setActive={setActiveKey}
          isTouch={isTouch}
          width={width}
          reduced={reduced}
          speed={speeds[r] ?? 44}
          range={scrollRange[r] ?? ["-12%", "10%"]}
          scrollYProgress={scrollYProgress}
        />
      ))}
    </div>
  );
}

function MosaicRow({
  ids,
  rowIndex,
  activeKey,
  setActive,
  isTouch,
  width,
  reduced,
  speed,
  range,
  scrollYProgress,
}: {
  ids: string[];
  rowIndex: number;
  activeKey: string | null;
  setActive: (k: string | null) => void;
  isTouch: boolean;
  width: string;
  reduced: boolean;
  speed: number;
  range: [string, string];
  scrollYProgress: ReturnType<typeof useScroll>["scrollYProgress"];
}) {
  // x ligado a scroll (wrapper). Reduced → posición central fija.
  const x = useTransform(scrollYProgress, [0, 1], range);
  const smooth = useSpring(x, { stiffness: 70, damping: 24, mass: 0.4 });

  // deriva autónoma (track interno) — direcciones alternadas por fila
  const driftFrom = rowIndex % 2 === 0 ? "0%" : "-50%";
  const driftTo = rowIndex % 2 === 0 ? "-50%" : "0%";

  const Track = ({ dup }: { dup: number }) => (
    <>
      {ids.map((id, i) => (
        <MosaicFigure
          key={`${dup}-${id}-${i}`}
          id={id}
          myKey={`${rowIndex}-${id}-${i}`}
          activeKey={activeKey}
          setActive={setActive}
          isTouch={isTouch}
          width={width}
          priority={rowIndex === 0 && dup === 0 && i < 5}
        />
      ))}
    </>
  );

  return (
    <motion.div
      className="about-mosaic-row"
      style={{
        x: reduced ? 0 : smooth,
        marginLeft: rowIndex % 2 === 1 ? "6vw" : undefined,
        transform: rowIndex % 2 === 1 ? "translateY(6%)" : undefined,
      }}
    >
      <motion.div
        className="about-mosaic-row"
        style={{ willChange: "transform" }}
        animate={reduced ? undefined : { x: [driftFrom, driftTo] }}
        transition={reduced ? undefined : { duration: speed, ease: "linear", repeat: Infinity }}
      >
        <Track dup={0} />
        {!reduced && <Track dup={1} />}
      </motion.div>
    </motion.div>
  );
}
