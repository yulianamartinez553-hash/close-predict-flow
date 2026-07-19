// src/components/landing/IntroPortada.tsx
import { useRef, useState, useCallback, useEffect, type MouseEvent } from "react";
import { motion, useScroll, useTransform, useMotionTemplate } from "framer-motion";
import { useReducedMotion } from "@/lib/use-reduced-motion";

const EXPO = [0.16, 1, 0.3, 1] as const;
const HLS_SRC = "https://stream.mux.com/kimF2ha9zLrX64H00UgLGPflCzNtl1T0215MlAmeOztv8.m3u8";

/* Capa de degradé sobre el video: arranca en el tono dominante del video
   (violeta oscuro) y aclara hacia un violeta clarísimo/casi blanco a medida
   que se hace scroll — mismo tono con el que arranca el fondo del Hero. */
const SCRIM_FROM = "#1E0A33";
const SCRIM_TO = "#F0ECFF";

/* ─────────────────────────────────────────────────────────────────
   GLASS PILL — typewriter "CONOCER CLOSE PREDICT"
───────────────────────────────────────────────────────────────── */
const PILL_TEXT = "CONOCER CLOSE PREDICT";

function GlassPill({
  onClickFn,
  btnRef,
  reduced,
}: {
  onClickFn: (e: MouseEvent<HTMLButtonElement>) => void;
  btnRef: React.RefObject<HTMLButtonElement>;
  reduced: boolean;
}) {
  const [displayed, setDisplayed] = useState(reduced ? PILL_TEXT : "");
  const [done, setDone] = useState(reduced);
  const idxRef = useRef(reduced ? PILL_TEXT.length : 0);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (reduced) return;
    idxRef.current = 0;
    setDisplayed("");
    setDone(false);

    const tick = () => {
      idxRef.current++;
      setDisplayed(PILL_TEXT.slice(0, idxRef.current));
      if (idxRef.current < PILL_TEXT.length) {
        timerRef.current = setTimeout(tick, 60);
      } else {
        setDone(true);
      }
    };

    timerRef.current = setTimeout(tick, 700);
    return () => { if (timerRef.current) clearTimeout(timerRef.current); };
  }, [reduced]);

  return (
    <motion.button
      ref={btnRef}
      onClick={onClickFn}
      initial={reduced ? false : { opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.55, duration: 0.45, ease: EXPO }}
      whileHover={{
        borderColor: "rgba(139,99,217,0.70)",
        background: "rgba(255,255,255,0.07)",
      }}
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: "10px",
        padding: "16px 36px",
        borderRadius: "9999px",
        background: "rgba(255,255,255,0.04)",
        backdropFilter: "blur(16px) saturate(180%)",
        WebkitBackdropFilter: "blur(16px) saturate(180%)",
        border: "1px solid rgba(139,99,217,0.40)",
        cursor: "pointer",
        minWidth: "280px",
        justifyContent: "center",
      }}
    >
      <span
        style={{
          fontFamily: "'Poppins', 'Inter', sans-serif",
          letterSpacing: "0.22em",
          fontWeight: 600,
          fontSize: "13px",
          color: "rgba(255,255,255,0.88)",
        }}
      >
        {displayed}
        {!done && (
          <span
            className="cursor-blink"
            style={{
              display: "inline-block", width: "2px", height: "1em",
              background: "rgba(255,255,255,0.72)",
              marginLeft: "3px", verticalAlign: "middle",
            }}
          />
        )}
      </span>

      {done && (
        <motion.span
          initial={{ opacity: 0, x: -5 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.28 }}
          style={{ color: "rgba(155,114,224,0.85)", fontSize: "16px", lineHeight: 1 }}
        >
          →
        </motion.span>
      )}
    </motion.button>
  );
}

/* ─────────────────────────────────────────────────────────────────
   VIDEO HLS DE FONDO
───────────────────────────────────────────────────────────────── */
function BackgroundVideo() {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    let hls: any = null;

    if (video.canPlayType("application/vnd.apple.mpegurl")) {
      video.src = HLS_SRC;
    } else {
      import("hls.js").then(({ default: Hls }) => {
        if ((Hls as any).isSupported()) {
          hls = new (Hls as any)();
          hls.loadSource(HLS_SRC);
          hls.attachMedia(video);
        }
      });
    }

    return () => { hls?.destroy?.(); };
  }, []);

  return (
    <video
      ref={videoRef}
      autoPlay
      muted
      loop
      playsInline
      style={{
        position: "absolute", inset: 0, zIndex: 0,
        width: "100%", height: "100%", objectFit: "cover",
      }}
    />
  );
}

/* ─────────────────────────────────────────────────────────────────
   COMPONENTE PRINCIPAL — preportada en flujo normal, scrolleable.
   El navbar NO vive acá a propósito: emerge en el Hero (ver Hero.tsx).
───────────────────────────────────────────────────────────────── */
/* Alto extra de scroll "pineado" antes de ceder el paso al Hero.
   180vh = 100vh visibles + 80vh de recorrido para que el degradé
   termine de cubrir el video antes de que la capa se libere. */
const PIN_HEIGHT_VH = 180;

export function IntroPortada() {
  const reduced = useReducedMotion();
  const btnRef = useRef<HTMLButtonElement>(null);
  const rootRef = useRef<HTMLDivElement>(null);

  /* progreso 0→1 mientras la capa está "pineada" (fija en el viewport) */
  const { scrollYProgress } = useScroll({
    target: rootRef,
    offset: ["start start", "end end"],
  });

  /* Color: oscuro (tono del video) → clarísimo, igual que el arranque del Hero.
     La forma de la capa NO se anima (nada de "cuadrado creciendo") — el degradé
     ya está presente de entrada, tapando siempre la misma porción inferior del
     video; lo único que cambia con el scroll es su color, hasta llegar al mismo
     tono con el que arranca el fondo del Hero. */
  const scrimColor = useTransform(scrollYProgress, [0, 1], [SCRIM_FROM, SCRIM_TO]);
  const scrimBackground = useMotionTemplate`linear-gradient(to bottom, transparent 0%, transparent 40%, ${scrimColor} 78%, ${scrimColor} 100%)`;

  /* El texto/botón de la primera pantalla se desvanece antes de que la
     capa empiece a cubrir el video, para no quedar ilegible sobre el
     fondo claro final. */
  const contentOpacity = useTransform(scrollYProgress, [0, 0.4], [1, 0]);
  const contentY = useTransform(scrollYProgress, [0, 0.4], [0, -24]);

  /* Clic / teclado: ya no dispara un wipe — hace scroll natural hasta el
     final de la capa pineada, directo al Hero. */
  const handleClick = useCallback((e: MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    const target = rootRef.current?.offsetHeight ?? window.innerHeight;
    window.scrollTo({ top: target, behavior: reduced ? "auto" : "smooth" });
  }, [reduced]);

  useEffect(() => {
    const k = (e: KeyboardEvent) => {
      if (["Enter", " "].includes(e.key)) { e.preventDefault(); btnRef.current?.click(); }
    };
    window.addEventListener("keydown", k);
    return () => window.removeEventListener("keydown", k);
  }, []);

  return (
    <div ref={rootRef} style={{ position: "relative", height: `${PIN_HEIGHT_VH}vh` }}>
      <style>{`
        /* Las frases se quiebran a 2 líneas balanceadas cuando no entran en una
           (tablets ~600–1333px), en vez de desbordar/recortarse con nowrap.
           En pantallas anchas siguen en una sola línea. */
        .ip-line1, .ip-line2 { text-wrap: balance; }
      `}</style>

      {/* Marco pineado — se mantiene fijo en el viewport mientras se scrollea
          el alto extra del wrapper; al agotarse, cede el paso al Hero. */}
      <div style={{ position: "sticky", top: 0, height: "100vh", overflow: "hidden" }}>
        <BackgroundVideo />

        {/* Capa de degradé sobre el video — misma capa que termina siendo el fondo del Hero */}
        <motion.div
          aria-hidden
          style={{
            position: "absolute", inset: 0, zIndex: 1,
            background: reduced ? SCRIM_TO : scrimBackground,
          }}
        />

        {/* Contenido */}
        <motion.div
          style={{
            position: "absolute", inset: 0, zIndex: 2,
            display: "flex", flexDirection: "column",
            alignItems: "center", justifyContent: "center",
            padding: "0 1.5rem", textAlign: "center",
            opacity: reduced ? 1 : contentOpacity,
            y: reduced ? 0 : contentY,
          }}
        >
          {/* Línea 1 — serif editorial grande (Cormorant Garamond) */}
          <motion.p
            className="ip-line1"
            initial={reduced ? false : { opacity: 0, y: 14, filter: "blur(6px)" }}
            animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
            transition={{ duration: 0.7, delay: 0.15, ease: EXPO }}
            style={{
              fontFamily: "'Cormorant Garamond', 'Playfair Display', Georgia, serif",
              fontSize: "clamp(36px, 6vw, 80px)",
              fontWeight: 600,
              lineHeight: 1.05,
              letterSpacing: "-0.01em",
              color: "#fff",
              marginBottom: "0.45em",
            }}
          >
            Los dueños que escalan no venden
          </motion.p>

          {/* Línea 2 — Poppins limpio (sans-serif de la página) */}
          <motion.p
            className="ip-line2"
            initial={reduced ? false : { opacity: 0, y: 18, filter: "blur(6px)" }}
            animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
            transition={{ duration: 0.7, delay: 0.32, ease: EXPO }}
            style={{
              fontFamily: "'Poppins', 'Inter', sans-serif",
              fontSize: "clamp(14px, 1.6vw, 20px)",
              fontWeight: 400,
              lineHeight: 1.5,
              letterSpacing: "0.08em",
              textTransform: "uppercase",
              color: "rgba(255,255,255,0.60)",
              marginBottom: "2.8em",
            }}
          >
            Tienen sistemas que venden por ellos
          </motion.p>

          {/* Glass pill — con su propia animación de entrada */}
          <GlassPill onClickFn={handleClick} btnRef={btnRef} reduced={reduced} />
        </motion.div>
      </div>
    </div>
  );
}
