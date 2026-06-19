import { useState, useRef } from "react";
import { motion, useInView } from "framer-motion";
import { MetricCounter } from "@/components/animations/MetricCounter";
import { TickerHorizontal } from "@/components/animations/TickerHorizontal";

/* ── DATOS ──────────────────────────────────────────────────── */
const STATS = [
  { value: 10, label: "Años como dueña de negocio", suffix: "+" },
  { value: 20, label: "Proyectos como closer",       suffix: "+" },
  { value: 5,  label: "Empresas asesoradas",         suffix: "+" },
];

const CREDENTIALS = [
  "Profesional en Comercio Internacional",
  "Closer Digital Certificada",
  "Customer Service",
  "Neuroventas",
  "Estratega Comercial",
  "Mentora High-Ticket",
];

/* ── VARIANTES FRAMER MOTION ───────────────────────────────── */
const fadeUp = {
  hidden: { opacity: 0, y: 18 },
  show:   { opacity: 1, y: 0,  transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] } },
};

/* ── COMPONENTE ─────────────────────────────────────────────── */
export function AboutMe() {
  /* Ref para saber cuándo entra la foto en viewport */
  const photoRef = useRef<HTMLDivElement>(null);
  const photoInView = useInView(photoRef, { once: true, amount: 0.2 });

  /* El float empieza cuando termina la animación de revelado */
  const [floating, setFloating] = useState(false);

  return (
    <>
      {/* Keyframe del float — inyectado una vez */}
      <style>{`
        @keyframes photoFloat {
          0%, 100% { transform: translateY(0); }
          50%       { transform: translateY(-12px); }
        }
        /* Amplitud 12 px, período 5.5 s — ajustable aquí */
        .about-float { animation: photoFloat 5.5s ease-in-out infinite; }
      `}</style>

      <section id="sobre-mi" className="relative overflow-hidden bg-white py-28">
        {/* Halos de ambiente */}
        <div className="pointer-events-none absolute inset-0" aria-hidden>
          <div className="absolute -left-32 top-1/4 h-[460px] w-[460px] rounded-full"
            style={{ background: "rgba(139,63,214,.06)", filter: "blur(80px)" }} />
          <div className="absolute -right-24 bottom-1/4 h-[360px] w-[360px] rounded-full"
            style={{ background: "rgba(157,78,221,.05)", filter: "blur(80px)" }} />
        </div>

        <div className="relative mx-auto max-w-[1160px] px-6 lg:px-[64px]">
          <div className="grid items-center gap-20 lg:grid-cols-[1fr_1.15fr]">

            {/* ── COLUMNA FOTO ── */}
            <div className="mx-auto w-full max-w-[420px]" ref={photoRef}>

              {/* Revelado: clip-path de abajo hacia arriba + escala 0.96 → 1
                  Ajustar duration y ease de la transición aquí               */}
              <motion.div
                className="relative"
                initial={{ clipPath: "inset(0 0 100% 0)", opacity: 0, scale: 0.96 }}
                animate={photoInView
                  ? { clipPath: "inset(0 0 0% 0)", opacity: 1, scale: 1 }
                  : {}}
                transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
                onAnimationComplete={() => setFloating(true)}
              >
                {/* Halo debajo de la foto */}
                <div
                  className="pointer-events-none absolute"
                  style={{
                    inset: "-20px -14px",
                    background: "radial-gradient(ellipse 68% 55% at 50% 90%, rgba(139,63,214,.20) 0%, transparent 70%)",
                  }}
                  aria-hidden
                />

                {/* Foto principal — usa /images/caro-01.webp del directorio public */}
                <img
                  src="/images/caro-01.webp"
                  alt="Caro Chaparro — mentora y estratega comercial"
                  width={420}
                  height={560}
                  className={`relative z-10 block w-full h-auto rounded-sm${floating ? " about-float" : ""}`}
                  style={{
                    filter:
                      "drop-shadow(0 28px 56px rgba(139,63,214,.14)) drop-shadow(0 4px 12px rgba(0,0,0,.07))",
                  }}
                  loading="lazy"
                />
              </motion.div>
            </div>

            {/* ── COLUMNA COPY ── */}
            <div className="flex flex-col gap-7">

              {/* Eyebrow */}
              <motion.p
                variants={fadeUp}
                initial="hidden"
                whileInView="show"
                viewport={{ once: true, amount: 0.2 }}
                style={{
                  fontSize: "10.5px", fontWeight: 700, letterSpacing: ".28em",
                  textTransform: "uppercase", color: "#8B3FD6",
                }}
              >
                SOBRE MÍ
              </motion.p>

              {/* Título — 2 líneas con tratamiento tipográfico distinto */}
              <motion.h2
                style={{ fontFamily: "var(--font-serif)", lineHeight: 1.1 }}
                initial="hidden"
                whileInView="show"
                viewport={{ once: true, amount: 0.2 }}
                transition={{ staggerChildren: 0.15 }}
              >
                {/* Línea 1: serif bold oscuro */}
                <motion.span
                  variants={fadeUp}
                  className="block"
                  style={{
                    fontSize: "clamp(28px,3.2vw,44px)",
                    fontWeight: 700,
                    color: "#1E0A33",
                  }}
                >
                  No te habla la teoría.
                </motion.span>
                {/* Línea 2: cursiva elegante violeta */}
                <motion.span
                  variants={fadeUp}
                  className="block"
                  style={{
                    fontSize: "clamp(28px,3.2vw,44px)",
                    fontStyle: "italic",
                    fontWeight: 600,
                    color: "#8B3FD6",
                    letterSpacing: ".01em",
                  }}
                >
                  Te habla la experiencia.
                </motion.span>
              </motion.h2>

              {/* Párrafo — copy exacto, no modificar */}
              <motion.p
                variants={fadeUp}
                initial="hidden"
                whileInView="show"
                viewport={{ once: true, amount: 0.2 }}
                transition={{ delay: 0.15 }}
                style={{
                  fontSize: "15.5px", lineHeight: 1.92,
                  color: "#4B5563", maxWidth: "520px",
                }}
              >
                Durante más de 10 años fui dueña de negocio. Sentí en carne propia el dolor de sacar
                plata de donde no había, de contratar un closer que aprendía y se iba, de tener todo
                en la cabeza y nada documentado. Por eso construí{" "}
                <strong style={{ color: "#1E0A33", fontWeight: 700 }}>CLOSE-PREDICT™</strong>:{" "}
                el sistema que ordena lo que a la mayoría de los dueños los tiene apagando incendios.
              </motion.p>

              {/* Estadísticas — MetricCounter anima de 0 al valor al entrar en viewport */}
              <motion.div
                className="grid grid-cols-3 gap-[14px]"
                initial="hidden"
                whileInView="show"
                viewport={{ once: true, amount: 0.2 }}
                transition={{ staggerChildren: 0.18 }}
              >
                {STATS.map(s => (
                  <motion.div
                    key={s.label}
                    variants={fadeUp}
                    className="rounded-[18px] border py-[22px] px-3 text-center"
                    style={{
                      borderColor: "rgba(139,63,214,.13)",
                      background: "#fff",
                      boxShadow: "0 4px 24px rgba(139,63,214,.07)",
                    }}
                  >
                    <MetricCounter value={s.value} label={s.label} suffix={s.suffix} />
                  </motion.div>
                ))}
              </motion.div>

              {/* Ticker horizontal de credenciales — loop infinito */}
              <div
                className="rounded-[14px] border"
                style={{ borderColor: "rgba(139,63,214,.12)", background: "rgba(249,248,255,.7)" }}
              >
                <TickerHorizontal items={CREDENTIALS} speed={30} />
              </div>

            </div>
          </div>
        </div>
      </section>
    </>
  );
}
