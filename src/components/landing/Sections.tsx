import { motion, useInView } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import {
  Shield, Play, Quote, ArrowRight, Check, Sparkles, Mail, Phone,
  Instagram, Linkedin, MessageCircle, Star,
} from "lucide-react";
import { useReducedMotion } from "@/lib/use-reduced-motion";
import { viewTransition } from "@/lib/animations";

const WHATSAPP_URL = "https://wa.me/573229172709";

const LEAD_CAPTURE_CARDS = [
  {
    title: "Diagnóstico gratuito",
    description: "Responde unas preguntas y obtén una primera luz de dónde está fallando tu proceso.",
    href: "/diagnostico.html",
    cta: "Empezar diagnóstico",
    external: false,
  },
  {
    title: 'Comunidad gratuita "Sala Flows"',
    description: "Conéctate cada 15 días y recibe contenido de valor en ventas y marketing.",
    href: WHATSAPP_URL,
    cta: "Unirme",
    external: true,
  },
  {
    title: "Recursos / lead magnets",
    description: "Guías prácticas para empezar a ordenar tus ventas hoy.",
    href: WHATSAPP_URL,
    cta: "Descargar",
    external: true,
  },
] as const;

/* ========================= 2. PROBLEMA — embudo + palabras laterales ========================= */
const SIDE_WORDS = [
  "LEADS", "CLIENTES", "CONSULTAS", "WHATSAPP", "EMAILS", "CONTACTOS",
  "COTIZACIONES", "REFERIDOS", "SIN SEGUIMIENTO", "CLIENTE PERDIDO",
  "VENTA PERDIDA", "NUNCA LO LLAMARON", "OPORTUNIDAD FRÍA",
];
const WORD_COLORS = [
  { c: "#2B1142", o: 0.7 },
  { c: "#1E0A33", o: 0.65 },
  { c: "#6B2BBF", o: 0.6 },
  { c: "#8B3FD6", o: 0.5 },
  { c: "#4B1E7A", o: 0.65 },
];

// Funnel bars: built bottom→top (index 0 = smallest at bottom)
const FUNNEL_BARS = [
  { w: 120, h: 40, label: "bottom" },
  { w: 180, h: 48 },
  { w: 250, h: 56 },
  { w: 340, h: 70, label: "top" },
];

type SideWord = {
  id: number;
  word: string;
  side: "left" | "right";
  topPct: number;
  fontSize: number;
  color: string;
  opacity: number;
  drift: number;
  dur: number;
  exploded: boolean;
};

export function Problema() {
  const reduced = useReducedMotion();
  const [words, setWords] = useState<SideWord[]>([]);
  const idRef = useRef(0);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  useEffect(() => {
    if (reduced) return;
    const maxVisible = isMobile ? 6 : 11;
    const interval = setInterval(() => {
      setWords((prev) => {
        if (prev.length >= maxVisible) return prev;
        const palette = WORD_COLORS[Math.floor(Math.random() * WORD_COLORS.length)];
        const next: SideWord = {
          id: idRef.current++,
          word: SIDE_WORDS[Math.floor(Math.random() * SIDE_WORDS.length)],
          side: Math.random() > 0.5 ? "left" : "right",
          topPct: 8 + Math.random() * 55,
          fontSize: isMobile ? 11 + Math.random() * 3 : 12 + Math.random() * 6,
          color: palette.c,
          opacity: palette.o,
          drift: 20 + Math.random() * 60,
          dur: 6.5 + Math.random() * 3,
          exploded: false,
        };
        return [...prev, next];
      });
    }, isMobile ? 900 : 600);
    return () => clearInterval(interval);
  }, [isMobile, reduced]);

  const removeWord = (id: number) =>
    setWords((prev) => prev.filter((w) => w.id !== id));

  return (
    <section className="relative min-h-[110vh] overflow-hidden bg-white py-24">
      {/* soft radial lights */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute left-1/4 top-1/3 h-[500px] w-[500px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-violet/8 blur-3xl" />
        <div className="absolute right-1/4 bottom-1/4 h-[400px] w-[400px] rounded-full bg-violet-bright/8 blur-3xl" />
      </div>

      {/* Side word zones — left & right only, center stays clear */}
      <div className="pointer-events-none absolute inset-y-0 left-0 w-[26%] overflow-hidden md:w-[28%]">
        {words.filter((w) => w.side === "left").map((w) => (
          <SideWordEl key={w.id} word={w} sideClass="right-2 md:right-4" onDone={() => removeWord(w.id)} />
        ))}
      </div>
      <div className="pointer-events-none absolute inset-y-0 right-0 w-[26%] overflow-hidden md:w-[28%]">
        {words.filter((w) => w.side === "right").map((w) => (
          <SideWordEl key={w.id} word={w} sideClass="left-2 md:left-4" onDone={() => removeWord(w.id)} />
        ))}
      </div>

      {/* Funnel — stacked floating bars, built bottom→top */}
      <div className="relative mx-auto flex h-[60vh] items-end justify-center">
        <div className="flex flex-col-reverse items-center gap-3">
          {FUNNEL_BARS.map((bar, i) => (
            <motion.div
              key={i}
              initial={reduced ? false : { opacity: 0, y: 28, scale: 0.92, filter: "blur(10px)" }}
              whileInView={reduced ? undefined : { opacity: 1, y: 0, scale: 1, filter: "blur(0px)" }}
              viewport={{ once: true, amount: 0.4 }}
              transition={viewTransition(reduced, {
                duration: 0.75,
                delay: i * 0.24,
                ease: [0.22, 1, 0.36, 1],
              })}
              style={{
                width: `min(${bar.w}px, 78vw)`,
                height: bar.h,
                clipPath:
                  i === FUNNEL_BARS.length - 1
                    ? "polygon(0% 0%, 100% 0%, 92% 100%, 8% 100%)"
                    : i === 0
                    ? "polygon(8% 0%, 92% 0%, 100% 100%, 0% 100%)"
                    : "polygon(6% 0%, 94% 0%, 88% 100%, 12% 100%)",
                background:
                  "linear-gradient(180deg, rgba(139,63,214,0.10) 0%, rgba(139,63,214,0.04) 100%)",
                border: "1.5px solid rgba(139,63,214,0.55)",
                boxShadow:
                  "0 0 0 1px rgba(139,63,214,0.08), inset 0 1px 0 rgba(255,255,255,0.6), inset 0 -10px 30px rgba(139,63,214,0.18), 0 20px 50px -20px rgba(139,63,214,0.45), 0 0 40px rgba(157,78,221,0.25)",
                backdropFilter: "blur(8px)",
              }}
              className="relative"
            >
              {/* subtle top reflection */}
              <div
                className="pointer-events-none absolute inset-x-3 top-0 h-px"
                style={{ background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.8), transparent)" }}
              />
            </motion.div>
          ))}
        </div>
      </div>

      {/* Title bottom */}
      <div className="relative mx-auto mt-12 max-w-4xl px-6 text-center">
        <motion.h2
          initial={reduced ? false : { opacity: 0, y: 20 }}
          whileInView={reduced ? undefined : { opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={viewTransition(reduced, { duration: 0.8 })}
          className="serif text-3xl leading-[1.1] text-ink text-balance sm:text-5xl lg:text-6xl"
        >
          ¿Cuántas oportunidades estás perdiendo<br />
          <em className="text-violet">sin darte cuenta?</em>
        </motion.h2>
      </div>
    </section>
  );
}

function SideWordEl({
  word,
  sideClass,
  onDone,
}: {
  word: SideWord;
  sideClass: string;
  onDone: () => void;
}) {
  const [phase, setPhase] = useState<"drift" | "explode">("drift");
  // direction: left-side words drift right toward funnel; right-side drift left
  const towardCenter = word.side === "left" ? word.drift : -word.drift;
  // bounce back away from funnel
  const bounceBack = word.side === "left" ? -word.drift * 0.4 : word.drift * 0.4;

  return (
    <>
      {phase === "drift" && (
        <motion.div
          initial={{ opacity: 0, x: word.side === "left" ? -30 : 30, y: 0, filter: "blur(4px)" }}
          animate={{
            opacity: [0, word.opacity, word.opacity, word.opacity * 0.9],
            x: [
              word.side === "left" ? -30 : 30,
              towardCenter * 0.6,
              towardCenter,
              bounceBack,
            ],
            y: [0, 60, 140, 220],
            filter: ["blur(4px)", "blur(0px)", "blur(0px)", "blur(0px)"],
          }}
          transition={{ duration: word.dur, times: [0, 0.25, 0.65, 1], ease: "easeInOut" }}
          onAnimationComplete={() => setPhase("explode")}
          className={`display absolute font-semibold uppercase tracking-[0.18em] whitespace-nowrap ${sideClass}`}
          style={{
            top: `${word.topPct}%`,
            fontSize: word.fontSize,
            color: word.color,
          }}
        >
          {word.word}
        </motion.div>
      )}
      {phase === "explode" && (
        <ExplodeBurst
          word={word}
          sideClass={sideClass}
          onDone={onDone}
        />
      )}
    </>
  );
}

function ExplodeBurst({
  word,
  sideClass,
  onDone,
}: {
  word: SideWord;
  sideClass: string;
  onDone: () => void;
}) {
  const towardCenter = word.side === "left" ? word.drift * 0.4 : -word.drift * 0.4;
  const letters = word.word.split("");
  return (
    <motion.div
      className={`absolute ${sideClass}`}
      style={{ top: `calc(${word.topPct}% + 220px)`, fontSize: word.fontSize }}
      initial={{ x: towardCenter }}
      animate={{ x: towardCenter }}
      onAnimationComplete={() => setTimeout(onDone, 700)}
    >
      <div className="relative flex">
        {letters.map((ch, i) => (
          <motion.span
            key={i}
            className="display font-semibold uppercase tracking-[0.18em]"
            style={{ color: word.color }}
            initial={{ opacity: word.opacity, y: 0, x: 0, scale: 1, filter: "blur(0px)" }}
            animate={{
              opacity: [word.opacity, word.opacity, 0],
              y: [0, -6, 14],
              x: [0, (i - letters.length / 2) * 4, (i - letters.length / 2) * 10],
              scale: [1, 1.05, 0.85],
              filter: ["blur(0px)", "blur(0.5px)", "blur(4px)"],
            }}
            transition={{ duration: 0.7, times: [0, 0.25, 1], ease: "easeOut", delay: i * 0.012 }}
          >
            {ch === " " ? "\u00A0" : ch}
          </motion.span>
        ))}
        {/* particle burst */}
        {[...Array(6)].map((_, i) => {
          const angle = (i / 6) * Math.PI * 2;
          return (
            <motion.span
              key={`p${i}`}
              className="absolute left-1/2 top-1/2 h-1 w-1 rounded-full"
              style={{ background: "#8B3FD6" }}
              initial={{ opacity: 0.7, x: 0, y: 0, scale: 1 }}
              animate={{
                opacity: [0.7, 0],
                x: Math.cos(angle) * 22,
                y: Math.sin(angle) * 22,
                scale: [1, 0.2],
              }}
              transition={{ duration: 0.6, ease: "easeOut" }}
            />
          );
        })}
      </div>
    </motion.div>
  );
}

/* ========================= 3. NARRATIVE SCROLL ========================= */
const STATES = [
  {
    title: "Leads sin seguimiento",
    body: "Los contactos llegan,\npero nadie sabe qué hacer después.",
  },
  {
    title: "Ventas impredecibles",
    body: "Un mes creces.\n\nAl siguiente,\nno sabes por qué cayó.",
  },
  {
    title: "No necesitas trabajar más.",
    body: "Necesitas un proceso\nque convierta mejor.",
  },
];

export function Narrative() {
  return (
    <section className="relative bg-ink-deep py-12 text-white">
      <div className="aurora-bg absolute inset-0 opacity-80" />
      <div className="relative">
        {STATES.map((s, i) => (
          <NarrativeBlock key={i} {...s} index={i} />
        ))}
        <div className="relative mx-auto max-w-3xl px-6 pb-32 pt-12 text-center">
          <a
            href="#sistema"
            className="group inline-flex items-center gap-3 rounded-full border border-white/30 bg-white/10 px-8 py-4 text-sm font-semibold uppercase tracking-[0.25em] backdrop-blur-xl transition hover:scale-[1.05] hover:brightness-110"
            style={{ background: "linear-gradient(135deg, rgba(139,63,214,0.55), rgba(157,78,221,0.55))", boxShadow: "0 20px 60px -20px rgba(139,63,214,0.6)" }}
          >
            Conocer Close Predict
            <ArrowRight className="h-4 w-4 transition group-hover:translate-x-1" />
          </a>
        </div>
      </div>
    </section>
  );
}

function NarrativeBlock({ title, body, index }: { title: string; body: string; index: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { amount: 0.5, once: false });
  return (
    <div ref={ref} className="relative flex min-h-[90vh] items-center justify-center px-6">
      <motion.div
        animate={inView ? { opacity: 1, y: 0, filter: "blur(0px)", scale: 1 } : { opacity: 0, y: 40, filter: "blur(14px)", scale: 0.98 }}
        transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
        className="glass-dark mx-auto max-w-3xl rounded-3xl p-12 text-center sm:p-16"
      >
        <div className="display mb-4 text-[11px] uppercase tracking-[0.3em] text-gold/80">Capítulo · {String(index + 1).padStart(2, "0")}</div>
        <h3 className="serif text-3xl text-balance sm:text-5xl">{title}</h3>
        <p className="mt-8 whitespace-pre-line text-lg leading-relaxed text-white/75 sm:text-xl">{body}</p>
      </motion.div>
    </div>
  );
}

/* ========================= 4. ENTREGABLES CAROUSEL ========================= */
interface Deliverable { num: string; title: string; premium?: boolean }
const ENTREGABLES_DATA: Deliverable[] = [
  { num: "01", title: "Calculadora comercial" },
  { num: "02", title: "Mapa de fuga personalizado" },
  { num: "03", title: "Arquitectura comercial" },
  { num: "04", title: "Playbook de ventas completo" },
  { num: "05", title: "Guión de calificación BANT" },
  { num: "06", title: "Guión de cierres en 5 pasos" },
  { num: "07", title: "Secuencia de seguimiento" },
  { num: "08", title: "Dashboards de KPIs" },
  { num: "09", title: "SOPs y Manual de ventas" },
  { num: "10", title: "Roadmap de 90 días" },
  { num: "11", title: "Roleplay en vivo",            premium: true },
  { num: "12", title: "Auditoría de 2 llamadas",     premium: true },
  { num: "13", title: "Sesión de Pauta Digital",     premium: true },
  { num: "14", title: "Agente de Objeciones IA",     premium: true },
];

/* Carousel geometry — igual al original */
const CARD_W   = 260;
const CARD_H   = 380;
const SPACING  = 300;
const DEPTH    = 240;
const TILT     = 42;
const SPEED    = 0.42;
const FPS_CAR  = 30;          /* frame-limit del carrusel */

/* Paleta de gradientes oscuros — rota por índice */
const DARK_GRADIENTS = [
  "linear-gradient(160deg, #2B1142, #1E0A33)",
  "linear-gradient(160deg, #3A1D63, #1E0A33)",
  "linear-gradient(160deg, #2B1142, #4B1E7A)",
  "linear-gradient(160deg, #1E0A33, #2B1142)",
  "linear-gradient(160deg, #4B1E7A, #2B1142)",
];

/* Tarjeta de entregable — fondo morado oscuro rotado + línea diagonal */
function EntregableCard({ card, index }: { card: Deliverable; index: number }) {
  const bg = DARK_GRADIENTS[index % DARK_GRADIENTS.length];

  /* Gradiente neón que se desvanece en los bordes — da profundidad */
  const lineGrad = card.premium
    ? "linear-gradient(90deg, transparent 0%, rgba(244,196,48,0.85) 18%, rgba(255,245,180,0.95) 50%, rgba(244,196,48,0.85) 82%, transparent 100%)"
    : "linear-gradient(90deg, transparent 0%, rgba(139,63,214,0.85) 18%, rgba(255,255,255,0.90) 50%, rgba(157,78,221,0.85) 82%, transparent 100%)";

  return (
    <div
      style={{
        position: "absolute", inset: 0,
        borderRadius: 16, overflow: "hidden",
        background: bg,
        border: card.premium
          ? "1px solid rgba(244,196,48,0.28)"
          : "1px solid rgba(255,255,255,0.15)",
        boxShadow: "0 20px 60px -16px rgba(30,10,51,0.7)",
        display: "flex", flexDirection: "column",
        padding: "28px 24px",
      }}
    >
      {/* Neón diagonal — 2 capas: outer glow + core brillante */}
      <div
        aria-hidden
        style={{
          position: "absolute",
          left: "-20%", top: "28%",
          width: "145%", height: 0,
          transform: "rotate(-35deg)",
          transformOrigin: "center",
          pointerEvents: "none",
        }}
      >
        {/* Capa 1 — glow amplio y difuminado */}
        <div style={{
          position: "absolute", left: 0, right: 0,
          top: -14, height: 28,
          background: lineGrad,
          filter: card.premium ? "blur(11px)" : "blur(9px)",
          borderRadius: 14,
          opacity: 0.75,
        }} />
        {/* Capa 2 — halo intermedio */}
        <div style={{
          position: "absolute", left: 0, right: 0,
          top: -6, height: 12,
          background: lineGrad,
          filter: "blur(4px)",
          borderRadius: 6,
          opacity: 0.88,
        }} />
        {/* Capa 3 — core: línea nítida y brillante */}
        <div style={{
          position: "absolute", left: 0, right: 0,
          top: -1.5, height: 3,
          background: lineGrad,
          filter: "blur(0.6px)",
          borderRadius: 2,
          opacity: 1,
        }} />
      </div>

      {/* Número — gris #C9C5D1 como indica la paleta */}
      <span style={{
        fontFamily: "'Montserrat', system-ui, sans-serif",
        fontWeight: 700, fontSize: 12,
        color: "#C9C5D1", letterSpacing: "0.12em",
        marginBottom: 16, position: "relative", zIndex: 1,
      }}>
        {card.num}
      </span>

      {/* Título grande */}
      <p style={{
        fontFamily: "'Cormorant Garamond', Georgia, serif",
        fontWeight: 700, fontSize: "clamp(1.25rem, 2.2vw, 1.75rem)",
        color: "#fff", lineHeight: 1.2, flex: 1,
        position: "relative", zIndex: 1,
      }}>
        {card.title}
      </p>

      {/* Badge PREMIUM */}
      {card.premium && (
        <span style={{
          fontFamily: "'Montserrat', system-ui, sans-serif",
          fontWeight: 700, fontSize: 10,
          textTransform: "uppercase", letterSpacing: "0.18em",
          color: "#F4C430", border: "1px solid rgba(244,196,48,0.6)",
          borderRadius: 4, padding: "3px 9px",
          alignSelf: "flex-start", marginTop: 16,
          position: "relative", zIndex: 1,
        }}>
          PREMIUM
        </span>
      )}

      {/* Gloss de esquina superior izquierda */}
      <div aria-hidden style={{
        position: "absolute", inset: 0, borderRadius: 16, pointerEvents: "none",
        background: "linear-gradient(135deg, rgba(255,255,255,0.08) 0%, transparent 50%)",
      }} />
    </div>
  );
}

function EntregablesCarousel3D() {
  const reduced = useReducedMotion();
  const N = ENTREGABLES_DATA.length;
  const stageRef    = useRef<HTMLDivElement>(null);
  const offsetRef   = useRef(0);
  const targetMouse = useRef({ x: 0, y: 0 });
  const smoothMouse = useRef({ x: 0, y: 0 });
  const lastFrameRef = useRef(0);
  const visibleRef  = useRef(true);
  const [offset, setOffset]     = useState(0);
  const [parallax, setParallax] = useState({ x: 0, y: 0 });

  useEffect(() => {
    if (reduced) return;
    let raf = 0;
    const INTERVAL = 1000 / FPS_CAR;

    /* Loop con 30 fps + pausa por IntersectionObserver + visibilitychange */
    const loop = (now: number) => {
      raf = requestAnimationFrame(loop);
      if (!visibleRef.current || document.hidden) return;
      const delta = now - lastFrameRef.current;
      if (delta < INTERVAL) return;
      lastFrameRef.current = now - (delta % INTERVAL);

      const dt = Math.min(delta / 1000, 0.05);
      offsetRef.current += dt * SPEED;
      smoothMouse.current.x += (targetMouse.current.x - smoothMouse.current.x) * 0.07;
      smoothMouse.current.y += (targetMouse.current.y - smoothMouse.current.y) * 0.07;
      setOffset(offsetRef.current);
      setParallax({ x: smoothMouse.current.x, y: smoothMouse.current.y });
    };
    raf = requestAnimationFrame(loop);

    /* Pausar cuando el carrusel no está en viewport */
    const io = new IntersectionObserver(
      ([e]) => { visibleRef.current = e.isIntersecting; },
      { threshold: 0 }
    );
    if (stageRef.current) io.observe(stageRef.current);

    return () => { cancelAnimationFrame(raf); io.disconnect(); };
  }, [reduced]);

  const handleMove = (e: React.MouseEvent) => {
    if (reduced) return;
    const r = stageRef.current?.getBoundingClientRect();
    if (!r) return;
    targetMouse.current.x = ((e.clientX - r.left) / r.width  - 0.5) * 2;
    targetMouse.current.y = ((e.clientY - r.top)  / r.height - 0.5) * 2;
  };
  const handleLeave = () => { targetMouse.current.x = 0; targetMouse.current.y = 0; };

  return (
    <div
      ref={stageRef}
      onMouseMove={handleMove}
      onMouseLeave={handleLeave}
      className="relative mx-auto flex h-[520px] w-full max-w-5xl items-center justify-center"
      style={{ perspective: "1350px" }}
    >
      <div
        className="relative h-full w-full"
        style={{
          transformStyle: "preserve-3d",
          transform: `rotateX(${-parallax.y * 8}deg) rotateY(${parallax.x * 14}deg)`,
          transition: "transform 0.05s linear",
        }}
      >
        {ENTREGABLES_DATA.map((card, i) => {
          /* Posición circular — mismas fórmulas del carrusel original */
          let p = (((i - offset) % N) + N) % N;
          if (p > N / 2) p -= N;
          const abs     = Math.abs(p);
          const tx      = p * SPACING;
          const tz      = -abs * DEPTH;
          const ry      = -p * TILT;
          const scale   = 1 - abs * 0.05;
          const opacity = abs > 2.2 ? 0 : 1 - Math.min(abs / 2.4, 1) * 0.9;
          const z       = 200 - Math.round(abs * 20);

          return (
            <div
              key={i}
              className="absolute left-1/2 top-1/2"
              style={{
                width: CARD_W, height: CARD_H,
                marginLeft: -CARD_W / 2, marginTop: -CARD_H / 2,
                transform: `translateX(${tx}px) translateZ(${tz}px) rotateY(${ry}deg) scale(${scale})`,
                opacity, zIndex: z,
                transition: "opacity 0.3s ease",
              }}
            >
              <EntregableCard card={card} index={i} />
            </div>
          );
        })}
      </div>
    </div>
  );
}

export function Sistema() {
  return (
    <section id="entregables" className="relative overflow-hidden py-28" style={{ background: "#F5F3F7" }}>
      <div className="relative mx-auto max-w-7xl px-6">
        {/* Nuevo encabezado — eyebrow + h2 + subtítulo */}
        <div className="mx-auto mb-16 max-w-3xl text-center">
          <div
            className="display mb-4 text-xs uppercase tracking-[0.3em]"
            style={{ color: "#8B3FD6" }}
          >
            CLOSE-PREDICT™
          </div>
          <h2
            className="serif text-4xl text-balance sm:text-5xl lg:text-6xl"
            style={{ color: "#2B1142" }}
          >
            Entregables
          </h2>
          <p className="mt-6 text-base leading-relaxed text-muted-foreground sm:text-lg">
            Cada fase tiene criterios claros, guiones documentados y métricas de control
            para que tu equipo ejecute sin depender de ti.
          </p>
        </div>

        {/* Carrusel 3D de entregables */}
        <EntregablesCarousel3D />
      </div>
    </section>
  );
}

/* ========================= 5. ENTREGABLES CAROUSEL ========================= */
const DELIVERABLES = [
  { title: "Calculadora comercial", desc: "Modelo de simulación de pipeline, conversiones y rentabilidad." },
  { title: "Playbook de ventas completo", desc: "Procesos, scripts y estructura comercial documentada.", featured: true },
  { title: "BANT de calificación", desc: "Marco para calificar oportunidades con criterio." },
  { title: "Mapa de fuga", desc: "Visualiza dónde se cae cada venta y por qué." },
  { title: "Cierres en 5 pasos", desc: "Secuencia probada para cerrar high-ticket." },
  { title: "KPIs comerciales", desc: "Métricas clave para decidir con datos." },
  { title: "Roadmap de ejecución", desc: "Plan claro de implementación semana a semana." },
  { title: "Roleplay comercial", desc: "Entrena objeciones reales con tu equipo." },
  { title: "Scripts de WhatsApp", desc: "Mensajes optimizados para cada fase del embudo." },
  { title: "Dashboard comercial", desc: "Tablero visual con métricas y alertas." },
  { title: "Sistema de seguimiento", desc: "Nada se pierde. Cada lead, trackeado." },
  { title: "Guía de calificación", desc: "Quién entra, quién no — sin perder tiempo." },
  { title: "Plantillas de mensajes", desc: "Para email, WhatsApp y llamadas." },
  { title: "Documentación del proceso", desc: "Tu sistema, listo para delegar." },
  { title: "Agente de Objeciones IA", desc: "Plantilla de IA entrenada en las objeciones reales de tu negocio.", bonus: true },
  { title: "Roleplay Comercial IA", desc: "Simulaciones para entrenar conversaciones de venta, objeciones y cierres.", bonus: true },
];

export function Entregables() {
  const reduced = useReducedMotion();

  return (
    <section id="entregables" className="relative overflow-hidden bg-ink-deep py-28 text-white">
      {/* Video background */}
      {!reduced ? (
      <video
        autoPlay
        loop
        muted
        playsInline
        className="pointer-events-none absolute inset-0 z-0 h-full w-full object-cover"
        src="https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260328_105406_16f4600d-7a92-4292-b96e-b19156c7830a.mp4"
      />
      ) : (
      <div className="pointer-events-none absolute inset-0 z-0 bg-ink-deep" aria-hidden />
      )}
      <div className="pointer-events-none absolute inset-0 z-0 bg-ink-deep/70" />

      {/* radial glow */}
      <div className="pointer-events-none absolute left-1/2 top-1/2 z-10 h-[700px] w-[700px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-violet/20 blur-3xl" />
      {/* particles */}
      {!reduced && (
      <div className="pointer-events-none absolute inset-0 z-10">
        {[...Array(30)].map((_, i) => (
          <motion.span
            key={i}
            className="absolute h-1 w-1 rounded-full bg-violet-bright"
            style={{ left: `${(i * 37) % 100}%`, top: `${(i * 53) % 100}%`, opacity: 0.2 }}
            animate={{ opacity: [0.1, 0.4, 0.1] }}
            transition={{ duration: 4 + (i % 4), repeat: Infinity, delay: i * 0.15 }}
          />
        ))}
      </div>
      )}

      <div className="relative z-10 mx-auto max-w-7xl px-6 text-center">
        <div className="display mb-4 text-xs uppercase tracking-[0.3em] text-gold">Entregables · Bonos</div>
        <h2 className="serif text-4xl text-balance sm:text-5xl lg:text-6xl">
          14 entregables + 2 bonos incluidos
        </h2>
        <p className="mx-auto mt-6 max-w-2xl text-base leading-relaxed text-white/70 sm:text-lg">
          Todo el sistema comercial que necesitas para construir un proceso de ventas más claro, eficiente y verdaderamente <em className="text-white">predecible</em>.
        </p>
      </div>

      {/* Marquee carousel */}
      <div className="relative z-10 mt-20 overflow-hidden" style={{ maskImage: "linear-gradient(90deg, transparent, #000 12%, #000 88%, transparent)" }}>
        <motion.div
          className="flex gap-6 px-6"
          animate={reduced ? undefined : { x: ["0%", "-50%"] }}
          transition={reduced ? undefined : { duration: 25, repeat: Infinity, ease: "linear" }}
        >
          {[...DELIVERABLES, ...DELIVERABLES].map((d, i) => (
            <DeliverableCard key={i} {...d} />
          ))}
        </motion.div>
      </div>

    </section>
  );
}

function DeliverableCard({ title, desc, featured, bonus }: { title: string; desc: string; featured?: boolean; bonus?: boolean }) {
  return (
    <div
      className="group relative w-[300px] shrink-0 rounded-3xl border p-7 backdrop-blur-xl transition-all duration-500 hover:scale-[1.06] motion-reduce:hover:scale-100"
      style={{
        background: bonus
          ? "linear-gradient(160deg, rgba(244,196,48,0.10), rgba(139,63,214,0.18))"
          : "linear-gradient(160deg, rgba(139,63,214,0.18), rgba(43,17,66,0.55))",
        borderColor: bonus ? "rgba(244,196,48,0.45)" : "rgba(255,255,255,0.12)",
        boxShadow: bonus
          ? "0 20px 60px -20px rgba(244,196,48,0.3), inset 0 1px 0 rgba(255,255,255,0.06)"
          : "0 20px 60px -20px rgba(139,63,214,0.4), inset 0 1px 0 rgba(255,255,255,0.06)",
      }}
    >
      {bonus && (
        <div className="display absolute -top-3 left-6 rounded-full bg-gradient-to-r from-gold to-gold-soft px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.25em] text-ink-deep shadow-lg">
          Bono
        </div>
      )}
      {featured && !bonus && <Sparkles className="absolute right-5 top-5 h-4 w-4 text-gold" />}
      <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-white/10">
        <Check className="h-4 w-4 text-violet-bright" />
      </div>
      <h3 className="serif mt-5 text-2xl leading-tight text-white">{title}</h3>
      <p className="mt-3 text-sm leading-relaxed text-white/65">{desc}</p>
    </div>
  );
}

/* ========================= 6. RESULTADO + DASHBOARD ========================= */
const CHECKS = [
  "Pipeline implementado y visible",
  "Métricas clave para tomar decisiones",
  "Seguimiento estructurado y automático",
  "Playbook de ventas documentado",
  "Equipo alineado y autónomo",
  "Crecimiento predecible y escalable",
];

export function Resultado() {
  const reduced = useReducedMotion();

  return (
    <section className="relative bg-white py-28">
      <div className="mx-auto grid max-w-7xl items-center gap-16 px-6 lg:grid-cols-2">
        <div>
          <div className="display mb-4 text-xs uppercase tracking-[0.3em] text-violet">Resultado final</div>
          <h2 className="serif text-4xl text-ink text-balance sm:text-5xl">
            Al finalizar, tienes un <em className="text-violet">sistema comercial</em> funcionando y escalando.
          </h2>
          <ul className="mt-10 space-y-4">
            {CHECKS.map((c, i) => (
              <motion.li
                key={c}
                initial={reduced ? false : { opacity: 0, x: -10 }}
                whileInView={reduced ? undefined : { opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={viewTransition(reduced, { duration: 0.5, delay: i * 0.08 })}
                className="flex items-start gap-3"
              >
                <span className="mt-1 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-violet/10 text-violet">
                  <Check className="h-3.5 w-3.5" />
                </span>
                <span className="text-base text-ink">{c}</span>
              </motion.li>
            ))}
          </ul>
        </div>

        {/* Dashboard card */}
        <motion.div
          initial={reduced ? false : { opacity: 0, y: 30 }}
          whileInView={reduced ? undefined : { opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={viewTransition(reduced, { duration: 0.8 })}
          className="glass-card relative rounded-3xl p-7"
        >
          <div className="mb-6 flex items-center justify-between">
            <div>
              <div className="display text-[10px] uppercase tracking-[0.25em] text-violet">Pipeline · Q actual</div>
              <div className="serif mt-1 text-xl text-ink">Dashboard Comercial</div>
            </div>
            <div className="flex gap-1.5">
              <span className="h-2 w-2 rounded-full bg-violet/30" />
              <span className="h-2 w-2 rounded-full bg-violet/60" />
              <span className="h-2 w-2 rounded-full bg-violet" />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
            {[
              { k: "Nuevos", v: "245", g: "+18%" },
              { k: "Oportunidades", v: "78", g: "+12%" },
              { k: "Cotizaciones", v: "32", g: "+9%" },
              { k: "Ventas", v: "$158K", g: "+24%" },
              { k: "Conversión", v: "13.1%", g: "+4.2 pts" },
              { k: "Ticket prom.", v: "$4.9K", g: "+6%" },
            ].map((m) => (
              <div key={m.k} className="rounded-2xl border border-violet/15 bg-white/70 p-3">
                <div className="text-[10px] uppercase tracking-wider text-muted-foreground">{m.k}</div>
                <div className="serif mt-1 text-2xl text-ink">{m.v}</div>
                <div className="text-[10px] text-emerald-600">{m.g}</div>
              </div>
            ))}
          </div>

          {/* mini funnel bars */}
          <div className="mt-6 rounded-2xl border border-violet/15 bg-white/70 p-4">
            <div className="mb-3 flex items-center justify-between">
              <span className="display text-[10px] uppercase tracking-wider text-muted-foreground">Embudo</span>
              <span className="text-[10px] text-violet">7 días</span>
            </div>
            <div className="space-y-2">
              {[{ l: "Leads", w: 100 }, { l: "Calificados", w: 62 }, { l: "Reuniones", w: 38 }, { l: "Cotizaciones", w: 22 }, { l: "Cierres", w: 13 }].map((b) => (
                <div key={b.l} className="flex items-center gap-3 text-xs">
                  <span className="w-24 text-muted-foreground">{b.l}</span>
                  <div className="relative h-2 flex-1 overflow-hidden rounded-full bg-muted">
                    <motion.div
                      initial={reduced ? false : { width: 0 }}
                      whileInView={reduced ? undefined : { width: `${b.w}%` }}
                      viewport={{ once: true }}
                      transition={viewTransition(reduced, { duration: 1, delay: 0.2 })}
                      className="absolute inset-y-0 left-0 rounded-full"
                      style={{ background: "var(--gradient-violet)" }}
                    />
                  </div>
                  <span className="w-8 text-right tabular-nums text-ink">{b.w}%</span>
                </div>
              ))}
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

/* ========================= 7. GARANTÍA ========================= */
export function Garantia() {
  const reduced = useReducedMotion();

  return (
    <section className="relative bg-cloud py-28">
      <div className="mx-auto max-w-3xl px-6">
        <motion.div
          initial={reduced ? false : { opacity: 0, y: 20 }}
          whileInView={reduced ? undefined : { opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={viewTransition(reduced, { duration: 0.8 })}
          className="glass-card relative overflow-hidden rounded-3xl p-10 text-center sm:p-14"
        >
          <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-violet via-gold to-violet" />
          <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-violet/10 text-violet">
            <Shield className="h-7 w-7" />
          </div>
          <div className="display mb-2 text-xs uppercase tracking-[0.3em] text-gold">Nuestro compromiso</div>
          <h2 className="serif text-3xl text-ink sm:text-4xl">Nuestra garantía</h2>
          <p className="mx-auto mt-6 max-w-xl text-base leading-relaxed text-muted-foreground sm:text-lg">
            Si al terminar el programa aún no tienes tu sistema comercial implementado correctamente, seguimos contigo hasta dejarlo 100% listo. Tu éxito es nuestro compromiso.
          </p>
        </motion.div>
      </div>
    </section>
  );
}

/* ========================= 8. TESTIMONIOS ========================= */
const TESTIMONIALS = [
  { name: "María L.", role: "Mentora high-ticket", text: "Por primera vez sé cuántos leads necesito para llegar a mi meta. Dejé de improvisar." },
  { name: "Sebastián R.", role: "Infoproductor LATAM", text: "Mi equipo cerró sin mí. Eso solo ya pagó el programa diez veces." },
  { name: "Andrea P.", role: "Agencia digital", text: "El playbook nos ordenó. Hoy cualquiera del equipo puede atender un lead bien." },
];

export function Testimonios() {
  const reduced = useReducedMotion();

  return (
    <section id="testimonios" className="relative bg-white py-28">
      <div className="mx-auto max-w-7xl px-6">
        <div className="mx-auto max-w-3xl text-center">
          <div className="display mb-4 text-xs uppercase tracking-[0.3em] text-violet">Prueba social</div>
          <h2 className="serif text-4xl text-ink text-balance sm:text-5xl">
            Lo que dicen quienes ya <em className="text-violet">ordenaron sus ventas</em>.
          </h2>
        </div>

        <div className="mt-16 grid gap-6 lg:grid-cols-[1.4fr_1fr]">
          {/* Featured video */}
          <div className="group relative aspect-video overflow-hidden rounded-3xl border border-violet/30 shadow-[0_30px_80px_-30px_rgba(43,17,66,0.4)]">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_40%,#3B1A5C,#1E0A33)]" />
            <div className="absolute inset-0 grid place-items-center">
              <button className="group/play flex h-20 w-20 items-center justify-center rounded-full bg-white/95 text-ink shadow-2xl transition hover:scale-110 motion-reduce:hover:scale-100">
                <Play className="ml-1 h-7 w-7 fill-current" />
              </button>
            </div>
            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-ink-deep to-transparent p-6 text-white">
              <div className="display text-[10px] uppercase tracking-[0.25em] text-gold/80">Caso de éxito</div>
              <div className="serif mt-1 text-2xl">"Pasamos de improvisar a tener un proceso real."</div>
              <div className="mt-1 text-sm text-white/70">Sebas · Próximamente</div>
            </div>
          </div>

          {/* Written cards */}
          <div className="flex flex-col gap-4">
            {TESTIMONIALS.map((t, i) => (
              <motion.div
                key={i}
                initial={reduced ? false : { opacity: 0, x: 20 }}
                whileInView={reduced ? undefined : { opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={viewTransition(reduced, { duration: 0.5, delay: i * 0.1 })}
                className="relative rounded-2xl border border-violet/15 bg-cloud p-6"
              >
                <Quote className="absolute right-4 top-4 h-5 w-5 text-violet/30" />
                <div className="mb-2 flex gap-0.5">
                  {[...Array(5)].map((_, j) => <Star key={j} className="h-3.5 w-3.5 fill-gold text-gold" />)}
                </div>
                <p className="serif text-lg leading-snug text-ink">"{t.text}"</p>
                <div className="mt-3 text-xs">
                  <span className="font-semibold text-ink">{t.name}</span>
                  <span className="text-muted-foreground"> · {t.role}</span>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* press strip placeholder */}
        <div className="mt-16 flex flex-wrap items-center justify-center gap-x-10 gap-y-4 opacity-50">
          <div className="display text-xs uppercase tracking-[0.3em] text-muted-foreground">Mencionada en</div>
          {["Forbes·LATAM", "Entrepreneur", "PODCAST PRO", "INFOPRO MAG", "VENTAS HOY"].map((m) => (
            <div key={m} className="display text-sm uppercase tracking-[0.25em] text-ink">{m}</div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ========================= 9. LEAD CAPTURE ========================= */
export function LeadCapture() {
  const reduced = useReducedMotion();

  return (
    <section id="no-momento" className="relative bg-cloud py-28">
      <div className="mx-auto max-w-7xl px-6">
        <div className="mx-auto max-w-3xl text-center">
          <h2 className="serif text-3xl text-ink text-balance sm:text-5xl">
            ¿Todavía no es tu momento para el <em className="text-violet">sistema completo</em>?
          </h2>
          <p className="mt-4 text-muted-foreground">Tres puertas suaves para empezar a ordenar tus ventas hoy.</p>
        </div>

        <div className="mt-14 grid gap-5 lg:grid-cols-3">
          {LEAD_CAPTURE_CARDS.map((card, i) => (
            <motion.a
              key={card.title}
              href={card.href}
              {...(card.external ? { target: "_blank", rel: "noreferrer" } : {})}
              initial={reduced ? false : { opacity: 0, y: 20 }}
              whileInView={reduced ? undefined : { opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={viewTransition(reduced, { duration: 0.5, delay: i * 0.1 })}
              className="group flex flex-col rounded-3xl border border-violet/20 bg-white p-7 shadow-[0_18px_50px_-30px_rgba(43,17,66,0.25)] transition hover:-translate-y-1 hover:shadow-[0_30px_70px_-30px_rgba(139,63,214,0.4)] motion-reduce:hover:translate-y-0"
            >
              <h3 className="serif mt-2 text-2xl text-ink">{card.title}</h3>
              <p className="mt-3 flex-1 text-sm leading-relaxed text-muted-foreground">{card.description}</p>
              <span className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-violet transition group-hover:gap-3">
                {card.cta}
                <ArrowRight className="h-4 w-4" />
              </span>
            </motion.a>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ========================= 10. CTA FINAL ========================= */
export function CtaFinal({ portrait }: { portrait: string }) {
  const reduced = useReducedMotion();

  return (
    <section id="contacto" className="relative overflow-hidden aurora-bg py-28 text-white">
      {/* particles */}
      {!reduced && (
      <div className="pointer-events-none absolute inset-0">
        {[...Array(25)].map((_, i) => (
          <motion.span
            key={i}
            className="absolute h-1 w-1 rounded-full bg-gold/60"
            style={{ left: `${(i * 41) % 100}%`, top: `${(i * 29) % 100}%` }}
            animate={{ opacity: [0.2, 0.7, 0.2], y: [0, -10, 0] }}
            transition={{ duration: 4 + (i % 4), repeat: Infinity, delay: i * 0.2 }}
          />
        ))}
      </div>
      )}

      <div className="relative mx-auto max-w-3xl px-6 text-center">
        <div className="display mb-4 text-xs uppercase tracking-[0.3em] text-gold">Tu próximo paso</div>
        <h2 className="serif text-4xl leading-[1.05] text-balance sm:text-5xl lg:text-6xl">
          ¿Listo para construir tu <em className="text-gold">sistema comercial</em>?
        </h2>
        <p className="mx-auto mt-6 max-w-xl text-base leading-relaxed text-white/80 sm:text-lg">
          Agenda tu Diagnóstico Comercial Estratégico y descubre exactamente dónde se están perdiendo tus ventas y cómo convertirlas en crecimiento.
        </p>

        <a
          href="/diagnostico.html"
          target="_blank"
          rel="noreferrer"
          className="btn-gold pulse-glow group mt-10 inline-flex items-center gap-3 rounded-full px-9 py-5 text-base font-semibold uppercase tracking-wider hover:scale-[1.03] motion-reduce:hover:scale-100"
        >
          Solicita tu diagnóstico
          <ArrowRight className="h-5 w-5 transition group-hover:translate-x-1" />
        </a>

        <p className="display mt-8 text-sm tracking-[0.15em] text-gold/90 sm:text-base">
          A la cima de ventas no se llega con conocimiento,<br className="hidden sm:block" /> sino con <em>estrategia</em>.
        </p>
      </div>
    </section>
  );
}

/* ========================= 11. FOOTER ========================= */
export function Footer() {
  return (
    <footer className="relative bg-ink-deep py-16 text-white/80">
      <div className="mx-auto grid max-w-7xl gap-12 px-6 lg:grid-cols-4">
        <div className="lg:col-span-2">
          <a href="#" className="cp-logo" style={{ alignItems: "flex-start" }}>
            <span className="cp-logo-name">Caro Chaparro</span>
            <div className="cp-logo-sub">
              <span>VENTAS</span>
            </div>
          </a>
          <p className="mt-4 max-w-sm text-sm text-white/60">
            Caro Chaparro · Mentora & Estratega de ventas. Sistemas comerciales predecibles para infoproductores LATAM.
          </p>
        </div>

        <div>
          <div className="display mb-4 text-[10px] uppercase tracking-[0.3em] text-gold">Contacto</div>
          <ul className="space-y-3 text-sm">
            <li className="flex items-center gap-2"><Phone className="h-4 w-4 text-violet-bright" /> +57 322 9172709</li>
            <li className="flex items-center gap-2"><Mail className="h-4 w-4 text-violet-bright" /> Caroventascoach@gmail.com</li>
          </ul>
          <div className="display mb-4 mt-8 text-[10px] uppercase tracking-[0.3em] text-gold">Redes</div>
          <ul className="space-y-3 text-sm">
            <li><a className="inline-flex items-center gap-2 hover:text-white" href="https://instagram.com/carochaparroventas" target="_blank" rel="noreferrer"><Instagram className="h-4 w-4 text-violet-bright" /> @carochaparroventas</a></li>
            <li><a className="inline-flex items-center gap-2 hover:text-white" href="https://www.tiktok.com/@carochaparrov" target="_blank" rel="noreferrer"><MessageCircle className="h-4 w-4 text-violet-bright" /> TikTok · carochaparrov</a></li>
            <li><a className="inline-flex items-center gap-2 hover:text-white" href="https://www.linkedin.com/in/carolina-chaparro-74602b18b/" target="_blank" rel="noreferrer"><Linkedin className="h-4 w-4 text-violet-bright" /> LinkedIn · Caro Chaparro</a></li>
          </ul>
        </div>

        <div>
          <div className="display mb-4 text-[10px] uppercase tracking-[0.3em] text-gold">Medios de pago</div>
          <ul className="space-y-2 text-sm text-white/70">
            <li>PayPal</li>
            <li>Transferencia internacional</li>
            <li>Transferencias locales</li>
            <li>Cripto / Binance</li>
          </ul>
        </div>
      </div>

      <div className="mx-auto mt-12 max-w-7xl border-t border-white/10 px-6 pt-6 text-center text-xs text-white/40">
        © {new Date().getFullYear()} Caro Chaparro · CLOSE-PREDICT™ · Todos los derechos reservados.
      </div>
    </footer>
  );
}

/* ========================= 12. WHATSAPP FLOAT ========================= */
export function WhatsAppFloat() {
  return (
    <a
      href={WHATSAPP_URL}
      target="_blank"
      rel="noreferrer"
      aria-label="WhatsApp Caro Chaparro"
      className="group fixed bottom-6 right-6 z-50 grid h-14 w-14 place-items-center rounded-full border-2 border-gold/60 transition hover:scale-110"
      style={{
        background: "linear-gradient(135deg, #2B1142, #1E0A33)",
        boxShadow: "0 10px 40px -10px rgba(244,196,48,0.5), 0 0 0 8px rgba(139,63,214,0.15)",
      }}
    >
      <svg viewBox="0 0 24 24" className="h-6 w-6 fill-white" aria-hidden>
        <path d="M.057 24l1.687-6.163a11.867 11.867 0 01-1.587-5.946C.16 5.335 5.495 0 12.05 0a11.82 11.82 0 018.413 3.488 11.82 11.82 0 013.48 8.414c-.003 6.557-5.338 11.892-11.893 11.892a11.9 11.9 0 01-5.688-1.448L.057 24zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884a9.86 9.86 0 001.51 5.26l-.999 3.648 3.978-.607zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.149-.173.198-.297.297-.495.099-.198.05-.372-.025-.521-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.71.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413z" />
      </svg>
    </a>
  );
}
