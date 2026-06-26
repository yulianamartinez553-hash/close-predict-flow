import { useRef, type ReactNode } from "react";
import { motion, useScroll, useTransform, type MotionValue } from "framer-motion";
import { useReducedMotion } from "@/lib/use-reduced-motion";

/* ─── Data ──────────────────────────────────────────────────────────── */

const CHAOS = [
  { id: 1,  line1: "¿Me podés mandar el precio?",     line2: "hace 2 h · sin leer",      accent: "#25D366", x: 7,  y: 10, dx: 12,  dy: -18, dur: 8  },
  { id: 2,  line1: "🎤 Audio · 0:47",                 line2: "sin escuchar",              accent: "#25D366", x: 62, y: 7,  dx: -10, dy:  22, dur: 11 },
  { id: 3,  line1: "Pipeline_mayo_v3.xlsx",            line2: "Modificado hace 5 días",   accent: "#217346", x: 28, y: 58, dx:  18, dy: -12, dur: 9  },
  { id: 4,  line1: "Llamar a Juan 📌",                line2: "mañana sin falta",          accent: "#EAB308", x: 70, y: 53, dx: -22, dy:  18, dur: 7  },
  { id: 5,  line1: "Llamada perdida × 3",             line2: "María García · 09:14",      accent: "#EF4444", x: 12, y: 70, dx:  28, dy:  -8, dur: 12 },
  { id: 6,  line1: "Re: Propuesta pendiente",          line2: "sin responder",             accent: "#3B82F6", x: 48, y: 18, dx: -14, dy:  28, dur: 10 },
  { id: 7,  line1: "⚠ Seguimiento Pérez",             line2: "Vencido hace 3 días",       accent: "#F97316", x: 78, y: 28, dx:   8, dy: -22, dur: 8  },
  { id: 8,  line1: "¿Seguimos esta semana?",           line2: "Ayer · sin leer",           accent: "#25D366", x: 18, y: 33, dx:  22, dy:  14, dur: 13 },
  { id: 9,  line1: "Cotización enviada",               line2: "– no respondió",            accent: "#EAB308", x: 55, y: 73, dx: -18, dy: -18, dur: 9  },
  { id: 10, line1: "Seguimiento_FINAL(2).xlsx",       line2: "5 versiones abiertas",      accent: "#217346", x: 3,  y: 48, dx:  32, dy:   8, dur: 11 },
  { id: 11, line1: "¿Sigue disponible el servicio?",  line2: "Lun · 1 sin leer",          accent: "#25D366", x: 38, y: 83, dx: -28, dy: -12, dur: 7  },
  { id: 12, line1: "Carlos Martínez",                 line2: "Duplicado ×2",              accent: "#9D4EDD", x: 83, y: 65, dx:  -8, dy:  18, dur: 10 },
  { id: 13, line1: "FW: Info solicitada × 7",         line2: "en espera",                 accent: "#3B82F6", x: 22, y: 13, dx:  18, dy:  28, dur: 8  },
  { id: 14, line1: "¡URGENTE! Devolver llamada",      line2: "sin atender",               accent: "#EF4444", x: 68, y: 85, dx:  12, dy: -16, dur: 6  },
];

type Node = { id: string; label: string; x: number; y: number; r: number };
const NODES: Node[] = [
  { id: "crm",   label: "CRM",             x: 50, y: 47, r: 10  },
  { id: "pipe",  label: "Pipeline",        x: 22, y: 28, r: 7   },
  { id: "auto",  label: "Automatización",  x: 78, y: 28, r: 7   },
  { id: "seg",   label: "Seguimiento",     x: 17, y: 67, r: 6.5 },
  { id: "met",   label: "Métricas",        x: 83, y: 67, r: 6.5 },
  { id: "cal",   label: "Calificación",    x: 50, y: 14, r: 6.5 },
  { id: "lead",  label: "Lead",            x: 50, y: 80, r: 6   },
];

const EDGES: [string, string][] = [
  ["crm","pipe"], ["crm","auto"], ["crm","seg"],
  ["crm","met"],  ["crm","cal"],  ["crm","lead"],
  ["pipe","cal"], ["auto","met"], ["seg","lead"],
];

const PARTICLES = Array.from({ length: 16 }, (_, i) => ({
  id: i,
  x:     12 + (i * 5)  % 76,
  exitX: -40 + (i * 13) % 120,
  dur:   1.6 + (i % 5) * 0.35,
  delay: i * 0.14,
  size:  5 + (i % 3) * 2,
}));

/* ─── Chaos Card ─────────────────────────────────────────────────────── */

type ChaosItem = typeof CHAOS[number];

function ChaosCard({ item, opacity, reduced }: { item: ChaosItem; opacity: MotionValue<number>; reduced: boolean }) {
  if (reduced) {
    return (
      <div
        className="pointer-events-none absolute"
        style={{ left: `${item.x}%`, top: `${item.y}%` }}
      >
        <div
          className="min-w-[130px] max-w-[190px] rounded-xl border bg-white px-3 py-2 shadow-lg"
          style={{
            borderColor: `${item.accent}35`,
            boxShadow: `0 4px 16px ${item.accent}18`,
          }}
        >
          <div className="mb-0.5 flex items-center gap-1.5">
            <span className="h-2 w-2 flex-shrink-0 rounded-full" style={{ background: item.accent }} />
            <span className="truncate text-[11px] font-medium text-gray-700">{item.line1}</span>
          </div>
          <span className="text-[10px] leading-tight text-gray-400">{item.line2}</span>
        </div>
      </div>
    );
  }

  return (
    <motion.div
      className="pointer-events-none absolute"
      style={{ left: `${item.x}%`, top: `${item.y}%`, opacity }}
      animate={{
        x: [0, item.dx, -(item.dx * 0.5), 0],
        y: [0, item.dy, -(item.dy * 0.6), 0],
        rotate: [0, 1.2, -0.8, 0],
      }}
      transition={{ duration: item.dur, repeat: Infinity, ease: "easeInOut" }}
    >
      <div
        className="min-w-[130px] max-w-[190px] rounded-xl border bg-white px-3 py-2 shadow-lg"
        style={{
          borderColor: `${item.accent}35`,
          boxShadow: `0 4px 16px ${item.accent}18`,
        }}
      >
        <div className="mb-0.5 flex items-center gap-1.5">
          <span className="h-2 w-2 flex-shrink-0 rounded-full" style={{ background: item.accent }} />
          <span className="truncate text-[11px] font-medium text-gray-700">{item.line1}</span>
        </div>
        <span className="text-[10px] leading-tight text-gray-400">{item.line2}</span>
      </div>
    </motion.div>
  );
}

/* ─── Network SVG ────────────────────────────────────────────────────── */

function Network({ opacity, reduced }: { opacity: MotionValue<number>; reduced: boolean }) {
  const nodeMap: Record<string, Node> = Object.fromEntries(NODES.map(n => [n.id, n]));

  return (
    <motion.div
      className="pointer-events-none absolute inset-0 flex items-center justify-center"
      style={{ opacity }}
    >
      <svg
        viewBox="0 0 100 100"
        className="h-full max-h-[66vh] w-full max-w-[66vh]"
        preserveAspectRatio="xMidYMid meet"
      >
        <defs>
          <radialGradient id="cts-ng" cx="30%" cy="20%" r="80%">
            <stop offset="0%" stopColor="#9D4EDD" />
            <stop offset="100%" stopColor="#4B1E7A" />
          </radialGradient>
          <filter id="cts-glow" x="-60%" y="-60%" width="220%" height="220%">
            <feGaussianBlur stdDeviation="1.8" result="b" />
            <feComposite in="SourceGraphic" in2="b" operator="over" />
          </filter>
        </defs>

        {/* Edges */}
        {EDGES.map(([a, b], i) => {
          const na = nodeMap[a], nb = nodeMap[b];
          const len = Math.hypot(nb.x - na.x, nb.y - na.y);
          return (
            <motion.line
              key={`e-${i}`}
              x1={na.x} y1={na.y} x2={nb.x} y2={nb.y}
              stroke="#9D4EDD"
              strokeWidth="0.4"
              strokeDasharray={String(len)}
              initial={{ strokeDashoffset: len, opacity: 0.6 }}
              animate={{ strokeDashoffset: 0, opacity: 0.45 }}
              transition={{ duration: 0.9, delay: 0.25 + i * 0.07, ease: "easeOut" }}
            />
          );
        })}

        {/* Pulse rings */}
        {!reduced && NODES.map((n, i) => (
          <motion.circle
            key={`ring-${n.id}`}
            cx={n.x} cy={n.y}
            fill="none"
            stroke="#9D4EDD"
            strokeWidth="0.25"
            animate={{
              r: [n.r * 1.15, n.r * 1.55, n.r * 1.15],
              opacity: [0.12, 0.38, 0.12],
            }}
            transition={{ duration: 2.8 + i * 0.22, repeat: Infinity, delay: i * 0.18 }}
          />
        ))}

        {/* Node circles */}
        {NODES.map((n, i) => (
          <motion.circle
            key={`nc-${n.id}`}
            cx={n.x} cy={n.y}
            fill="url(#cts-ng)"
            filter="url(#cts-glow)"
            initial={{ r: 0, opacity: 0 }}
            animate={{ r: n.r, opacity: 1 } as Record<string, unknown>}
            transition={{ duration: 0.5, delay: 0.1 + i * 0.1, ease: [0.34, 1.56, 0.64, 1] }}
          />
        ))}

        {/* Labels */}
        {NODES.map((n, i) => (
          <motion.text
            key={`lbl-${n.id}`}
            x={n.x} y={n.y + 0.5}
            textAnchor="middle"
            dominantBaseline="middle"
            fontSize={n.r > 8 ? "3.1" : "2.5"}
            fill="white"
            fontFamily="Inter, Montserrat, sans-serif"
            fontWeight="500"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.4, delay: 0.45 + i * 0.1 }}
          >
            {n.label}
          </motion.text>
        ))}

        {/* Traveling gold particles along edges */}
        {!reduced && EDGES.slice(0, 7).map(([a, b], i) => {
          const na = nodeMap[a], nb = nodeMap[b];
          return (
            <motion.circle
              key={`tp-${i}`}
              r="0.9"
              fill="#F4C430"
              animate={{
                cx: [na.x, nb.x, na.x],
                cy: [na.y, nb.y, na.y],
                opacity: [0, 1, 1, 0],
              }}
              transition={{
                duration: 2.4 + i * 0.28,
                repeat: Infinity,
                delay: 0.6 + i * 0.45,
                ease: "easeInOut",
              }}
            />
          );
        })}
      </svg>
    </motion.div>
  );
}

/* ─── Scene title wrapper ────────────────────────────────────────────── */

function SceneTitle({ opacity, className = "", children }: {
  opacity: MotionValue<number>;
  className?: string;
  children: ReactNode;
}) {
  return (
    <motion.div
      className={`absolute inset-x-0 z-20 px-6 text-center ${className}`}
      style={{ opacity }}
    >
      {children}
    </motion.div>
  );
}

/* ─── Main component ─────────────────────────────────────────────────── */

export function CaosToSistema() {
  const reduced = useReducedMotion();
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress: prog } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  });

  /* Background transitions white → dark purple */
  const bgColor = useTransform(
    prog,
    [0, 0.24, 0.36, 1],
    ["#FFFFFF", "#FFFFFF", "#1E0A33", "#1E0A33"]
  );

  /* Chaos cards: appear then fade */
  const chaosOpacity = useTransform(prog, [0, 0.04, 0.30, 0.42], [0, 1, 1, 0]);

  /* Purple escape particles (scene 2) */
  const particlesOpacity = useTransform(prog, [0.16, 0.22, 0.32, 0.40], [0, 1, 1, 0]);

  /* Network: appears from scene 3 onward */
  const netOpacity = useTransform(prog, [0.36, 0.50, 0.92, 1], [0, 1, 1, 1]);

  /* Per-scene title opacities */
  const s1 = useTransform(prog, [0,    0.04, 0.18, 0.24], [0, 1, 1, 0]);
  const s2 = useTransform(prog, [0.16, 0.22, 0.30, 0.36], [0, 1, 1, 0]);
  const s3 = useTransform(prog, [0.36, 0.42, 0.52, 0.58], [0, 1, 1, 0]);
  const s4 = useTransform(prog, [0.54, 0.60, 0.70, 0.76], [0, 1, 1, 0]);
  const s5 = useTransform(prog, [0.72, 0.78, 0.86, 0.92], [0, 1, 1, 0]);
  const s6 = useTransform(prog, [0.88, 0.94, 1,    1   ], [0, 1, 1, 1]);

  return (
    <section ref={containerRef} style={{ height: "500vh" }} className="relative">
      <motion.div
        className="sticky top-0 h-screen overflow-hidden"
        style={{ backgroundColor: bgColor }}
      >

        {/* ── Chaos cards ── */}
        {CHAOS.map(item => (
          <ChaosCard key={item.id} item={item} opacity={chaosOpacity} reduced={reduced} />
        ))}

        {/* ── Escape particles ── */}
        {!reduced && (
        <motion.div
          className="pointer-events-none absolute inset-0"
          style={{ opacity: particlesOpacity }}
        >
          {PARTICLES.map(pt => (
            <motion.div
              key={pt.id}
              className="absolute rounded-full"
              style={{
                left: `${pt.x}%`,
                bottom: "25%",
                width: pt.size,
                height: pt.size,
                background: "radial-gradient(circle at 30% 30%, #B36FE8, #4B1E7A)",
                boxShadow: "0 0 8px #9D4EDD55",
              }}
              animate={{
                y: [-10, -340],
                x: [0, pt.exitX],
                opacity: [0.9, 0.9, 0],
                scale: [1, 0.3],
              }}
              transition={{
                duration: pt.dur,
                repeat: Infinity,
                delay: pt.delay,
                ease: "easeOut",
              }}
            />
          ))}
        </motion.div>
        )}

        {/* ── Network (scenes 3-6) ── */}
        <Network opacity={netOpacity} reduced={reduced} />

        {/* ── Scene 1: ¿Te suena familiar? ── */}
        <SceneTitle opacity={s1} className="top-1/2 -translate-y-1/2">
          <h2 className="serif mb-4 text-4xl font-bold text-[#2B1142] sm:text-5xl lg:text-6xl">
            ¿Te suena familiar?
          </h2>
          <p className="mx-auto max-w-sm text-base leading-relaxed text-gray-500 sm:text-lg">
            Cada contacto parece importante.<br />
            Pero nadie sabe exactamente qué está pasando.
          </p>
        </SceneTitle>

        {/* ── Scene 2: No estás perdiendo clientes ── */}
        <SceneTitle opacity={s2} className="top-1/2 -translate-y-1/2">
          <h2 className="serif mb-2 text-3xl font-bold text-[#2B1142] sm:text-4xl lg:text-[52px] lg:leading-[1.1]">
            No estás perdiendo{" "}
            <em className="text-[#8B3FD6]">clientes.</em>
          </h2>
          <h2 className="serif text-3xl font-bold text-[#2B1142] sm:text-4xl lg:text-[52px] lg:leading-[1.1]">
            Estás perdiendo{" "}
            <span className="relative inline-block">
              <span className="relative z-10 text-[#9D4EDD]">seguimiento.</span>
              {!reduced && (
              <motion.span
                className="absolute inset-0 -z-0 rounded-md"
                style={{ background: "#9D4EDD1A" }}
                animate={{ opacity: [0.4, 1, 0.4] }}
                transition={{ duration: 2.2, repeat: Infinity }}
              />
              )}
            </span>
          </h2>
        </SceneTitle>

        {/* ── Scene 3: Todo ya existe ── */}
        <SceneTitle opacity={s3} className="top-1/2 -translate-y-1/2">
          <h2 className="serif mb-3 text-4xl font-bold text-white sm:text-5xl lg:text-6xl">
            Todo ya existe.
          </h2>
          <p className="text-lg text-[#C9C5D1] sm:text-xl">
            Solo necesita conectarse.
          </p>
        </SceneTitle>

        {/* ── Scene 4: Cada oportunidad ── */}
        <SceneTitle opacity={s4} className="bottom-20">
          <h2 className="serif text-3xl font-bold text-white sm:text-4xl lg:text-5xl">
            Cada oportunidad sabe dónde ir.
          </h2>
        </SceneTitle>

        {/* ── Scene 5: De perseguir a dirigir ── */}
        <SceneTitle opacity={s5} className="bottom-20">
          <p className="serif mb-2 text-xl text-[#C9C5D1] sm:text-2xl lg:text-3xl">
            De perseguir clientes…
          </p>
          <h2 className="serif text-3xl font-bold text-white sm:text-4xl lg:text-[52px]">
            …a dirigir un sistema.
          </h2>
        </SceneTitle>

        {/* ── Scene 6: Final CTA ── */}
        <motion.div
          className="absolute inset-0 z-30 flex flex-col items-center justify-center px-6 text-center"
          style={{ opacity: s6 }}
        >
          <h2 className="serif mb-3 text-5xl font-bold text-white sm:text-6xl lg:text-7xl">
            Close<em className="text-[#9D4EDD]">Predict</em>
          </h2>
          <p className="mx-auto mb-10 max-w-lg text-base text-[#C9C5D1] sm:text-lg">
            Transformamos oportunidades olvidadas en ventas predecibles.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-4">
            <a
              href="/diagnostico.html"
              className="rounded-full bg-[#9D4EDD] px-8 py-4 text-sm font-semibold uppercase tracking-wider text-white shadow-[0_0_32px_#9D4EDD50] transition-all duration-300 hover:scale-[1.04] hover:shadow-[0_0_48px_#9D4EDD70] motion-reduce:hover:scale-100"
            >
              Diagnosticar mi proceso comercial
            </a>
            <a
              href="#sistema"
              className="rounded-full border border-white/25 px-8 py-4 text-sm font-semibold uppercase tracking-wider text-white/80 transition-all duration-300 hover:bg-white/10"
            >
              Ver metodología
            </a>
          </div>
        </motion.div>

        {!reduced && (
        <motion.div
          className="absolute bottom-8 left-1/2 z-10 -translate-x-1/2"
          style={{ opacity: s1 }}
        >
          <motion.div
            className="flex flex-col items-center gap-1 text-xs tracking-wider text-gray-400"
            animate={{ y: [0, 6, 0] }}
            transition={{ duration: 1.8, repeat: Infinity }}
          >
            <span>Seguí bajando</span>
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 9l-7 7-7-7" />
            </svg>
          </motion.div>
        </motion.div>
        )}

      </motion.div>
    </section>
  );
}
