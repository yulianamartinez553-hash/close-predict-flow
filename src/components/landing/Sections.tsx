import { motion, useInView } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import {
  Shield, Play, Quote, ArrowRight, Check, Sparkles, Mail, Phone,
  Instagram, Linkedin, MessageCircle, Star,
} from "lucide-react";

/* ========================= 2. PROBLEMA — embudo + palabras ========================= */
const FALLING_WORDS = [
  "LEADS", "CLIENTES", "OPORTUNIDADES", "MENSAJES", "CONSULTAS", "REUNIONES",
  "WHATSAPP", "EMAILS", "CONTACTOS", "COTIZACIONES", "REFERIDOS",
  "CLIENTE PERDIDO", "SIN SEGUIMIENTO", "VENTA PERDIDA", "OPORTUNIDAD FRÍA", "NUNCA LO LLAMARON",
];
const NEGATIVE = new Set(["CLIENTE PERDIDO", "SIN SEGUIMIENTO", "VENTA PERDIDA", "OPORTUNIDAD FRÍA", "NUNCA LO LLAMARON"]);

export function Problema() {
  const ref = useRef<HTMLDivElement>(null);
  const [mouse, setMouse] = useState({ x: 0, y: 0 });
  const [drops, setDrops] = useState<{ id: number; word: string; x: number; delay: number; dur: number; size: number }[]>([]);

  useEffect(() => {
    let id = 0;
    const interval = setInterval(() => {
      const word = FALLING_WORDS[Math.floor(Math.random() * FALLING_WORDS.length)];
      const x = 10 + Math.random() * 80;
      const dur = 7 + Math.random() * 5;
      setDrops((d) => [...d.slice(-22), { id: id++, word, x, delay: 0, dur, size: 10 + Math.random() * 6 }]);
    }, 350);
    return () => clearInterval(interval);
  }, []);

  return (
    <section
      ref={ref}
      onMouseMove={(e) => {
        const r = ref.current?.getBoundingClientRect();
        if (!r) return;
        setMouse({ x: (e.clientX - r.left) / r.width - 0.5, y: (e.clientY - r.top) / r.height - 0.5 });
      }}
      className="relative min-h-[110vh] overflow-hidden bg-white py-24"
    >
      {/* radial lights */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute left-1/4 top-1/4 h-[500px] w-[500px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-violet/10 blur-3xl" />
        <div className="absolute right-1/4 bottom-1/4 h-[400px] w-[400px] rounded-full bg-violet-bright/10 blur-3xl" />
      </div>

      {/* falling words */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        {drops.map((d) => {
          const neg = NEGATIVE.has(d.word);
          return (
            <motion.span
              key={d.id}
              initial={{ y: -40, opacity: 0, filter: "blur(2px)" }}
              animate={{ y: "110vh", opacity: [0, 0.7, 0.7, 0], filter: ["blur(2px)", "blur(0px)", "blur(0px)", "blur(6px)"] }}
              transition={{ duration: d.dur, ease: "easeIn" }}
              className="display absolute font-medium uppercase tracking-[0.18em]"
              style={{
                left: `${d.x}%`,
                top: 0,
                fontSize: `${d.size}px`,
                color: neg ? "#9D4EDD" : "#2B1142",
                opacity: neg ? 0.55 : 0.4,
              }}
            >
              {d.word}
            </motion.span>
          );
        })}
      </div>

      {/* Funnel */}
      <motion.div
        className="relative mx-auto flex h-[55vh] items-center justify-center"
        animate={{ x: mouse.x * 18, y: mouse.y * 12 }}
        transition={{ type: "spring", stiffness: 40, damping: 18 }}
      >
        <motion.div
          className="relative"
          animate={{ y: [0, -12, 0], rotate: [0, 0.6, 0] }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
        >
          <svg width="380" height="420" viewBox="0 0 380 420" className="drop-shadow-[0_30px_60px_rgba(139,63,214,0.25)]">
            <defs>
              <linearGradient id="funnelBorder" x1="0" x2="1" y1="0" y2="1">
                <stop offset="0" stopColor="#8B3FD6" />
                <stop offset="1" stopColor="#9D4EDD" />
              </linearGradient>
              <linearGradient id="funnelFill" x1="0" x2="0" y1="0" y2="1">
                <stop offset="0" stopColor="#9D4EDD" stopOpacity="0.12" />
                <stop offset="1" stopColor="#8B3FD6" stopOpacity="0.05" />
              </linearGradient>
              <linearGradient id="funnelShine" x1="0" x2="1" y1="0" y2="0">
                <stop offset="0" stopColor="white" stopOpacity="0" />
                <stop offset="0.5" stopColor="white" stopOpacity="0.25" />
                <stop offset="1" stopColor="white" stopOpacity="0" />
              </linearGradient>
            </defs>
            {/* outer glass funnel */}
            <path d="M30 30 L350 30 L240 250 L240 400 L140 400 L140 250 Z" fill="url(#funnelFill)" stroke="url(#funnelBorder)" strokeWidth="1.5" />
            <path d="M30 30 L350 30 L240 250 L240 400 L140 400 L140 250 Z" fill="url(#funnelShine)" opacity="0.6" />
            {/* inner divisions */}
            <line x1="80" y1="110" x2="300" y2="110" stroke="#8B3FD6" strokeOpacity="0.25" strokeWidth="0.5" />
            <line x1="120" y1="190" x2="260" y2="190" stroke="#8B3FD6" strokeOpacity="0.25" strokeWidth="0.5" />
          </svg>
        </motion.div>
      </motion.div>

      {/* Title bottom */}
      <div className="relative mx-auto mt-12 max-w-4xl px-6 text-center">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="serif text-3xl leading-[1.1] text-ink text-balance sm:text-5xl lg:text-6xl"
        >
          ¿Cuántas oportunidades estás perdiendo<br />
          <em className="text-violet">sin darte cuenta?</em>
        </motion.h2>
      </div>
    </section>
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
    body: "Un mes creces.\n\nAl siguiente,\nno sabés por qué cayó.",
  },
  {
    title: "No necesitás trabajar más.",
    body: "Necesitás un proceso\nque convierta mejor.",
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

/* ========================= 4. SISTEMA CLOSE-PREDICT ========================= */
const PHASES = [
  { n: 1, weeks: "Sem 1–2", name: "Radiografía Comercial", desc: "Diagnóstico del estado real: leads, ventas, pauta, procesos. Identifica fugas. Punto actual vs. meta." },
  { n: 2, weeks: "Sem 3–4", name: "Arquitectura Comercial", desc: "Diseño del sistema: embudo, fases, criterios de calificación, herramientas para decidir y escalar." },
  { n: 3, weeks: "Sem 5–7", name: "Guiones y Calificación", desc: "Ruta de comunicación completa: qué decir y cuándo. Cómo calificar, cerrar o descartar leads.", highlight: true },
  { n: 4, weeks: "Sem 8–9", name: "KPIs y Dashboard", desc: "Métricas clave del embudo para decidir sobre precios y equipo. Optimización y rentabilidad." },
  { n: 5, weeks: "Sem 10–12", name: "Delegación y Escala", desc: "Roadmap de ejecución para el equipo. Sistema aplicable y delegable." },
];

export function Sistema() {
  return (
    <section id="sistema" className="relative overflow-hidden bg-cloud py-28">
      <div className="grid-noise absolute inset-0 opacity-50" />
      <div className="relative mx-auto max-w-7xl px-6">
        <div className="mx-auto max-w-3xl text-center">
          <div className="display mb-4 text-xs uppercase tracking-[0.3em] text-violet">CLOSE-PREDICT™ · 5 fases · 12 semanas</div>
          <h2 className="serif text-4xl text-ink text-balance sm:text-5xl lg:text-6xl">
            Un sistema comercial delegable y <em className="text-violet">predecible</em>, en 12 semanas.
          </h2>
          <p className="mt-6 text-base leading-relaxed text-muted-foreground sm:text-lg">
            Cada fase tiene criterios claros, guiones documentados y métricas de control — para que tu equipo ejecute sin depender de ti.
          </p>
        </div>

        {/* roadmap */}
        <div className="relative mt-20">
          <motion.div
            initial={{ scaleX: 0 }}
            whileInView={{ scaleX: 1 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 1.6, ease: "easeInOut" }}
            className="absolute left-0 right-0 top-12 hidden h-px origin-left bg-gradient-to-r from-violet/0 via-violet to-violet/0 lg:block"
          />
          <div className="grid gap-6 lg:grid-cols-5">
            {PHASES.map((p, i) => (
              <motion.div
                key={p.n}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.2 }}
                transition={{ duration: 0.6, delay: i * 0.12 }}
                className={`relative rounded-3xl border bg-white p-6 shadow-[0_20px_60px_-30px_rgba(43,17,66,0.25)] ${p.highlight ? "border-violet shadow-[0_24px_70px_-20px_rgba(139,63,214,0.5)] ring-1 ring-violet/30" : "border-border"}`}
              >
                <div
                  className={`mx-auto -mt-12 mb-4 flex h-12 w-12 items-center justify-center rounded-full font-semibold text-white ${p.highlight ? "bg-violet ring-4 ring-violet/20" : "bg-ink"}`}
                  style={p.highlight ? { boxShadow: "0 0 30px rgba(139,63,214,0.6)" } : undefined}
                >
                  {p.n}
                </div>
                <div className="display text-[10px] uppercase tracking-[0.25em] text-violet">{p.weeks}</div>
                <h3 className="serif mt-2 text-xl text-ink">{p.name}</h3>
                <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{p.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

/* ========================= 5. ENTREGABLES CAROUSEL ========================= */
const DELIVERABLES = [
  { title: "Calculadora comercial", desc: "Modelo de simulación de pipeline, conversiones y rentabilidad." },
  { title: "Playbook de ventas completo", desc: "Procesos, scripts y estructura comercial documentada.", featured: true },
  { title: "BANT de calificación", desc: "Marco para calificar oportunidades con criterio." },
  { title: "Mapa de fuga", desc: "Visualizá dónde se cae cada venta y por qué." },
  { title: "Cierres en 5 pasos", desc: "Secuencia probada para cerrar high-ticket." },
  { title: "KPIs comerciales", desc: "Métricas clave para decidir con datos." },
  { title: "Roadmap de ejecución", desc: "Plan claro de implementación semana a semana." },
  { title: "Roleplay comercial", desc: "Entrená objeciones reales con tu equipo." },
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
  return (
    <section id="entregables" className="relative overflow-hidden bg-ink-deep py-28 text-white">
      {/* radial glow */}
      <div className="pointer-events-none absolute left-1/2 top-1/2 h-[700px] w-[700px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-violet/20 blur-3xl" />
      {/* particles */}
      <div className="pointer-events-none absolute inset-0">
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

      <div className="relative mx-auto max-w-7xl px-6 text-center">
        <div className="display mb-4 text-xs uppercase tracking-[0.3em] text-gold">Entregables · Bonos</div>
        <h2 className="serif text-4xl text-balance sm:text-5xl lg:text-6xl">
          14 entregables + 2 bonos incluidos
        </h2>
        <p className="mx-auto mt-6 max-w-2xl text-base leading-relaxed text-white/70 sm:text-lg">
          Todo el sistema comercial que necesitas para construir un proceso de ventas más claro, eficiente y verdaderamente <em className="text-white">predecible</em>.
        </p>
      </div>

      {/* Marquee carousel */}
      <div className="relative mt-20 overflow-hidden" style={{ maskImage: "linear-gradient(90deg, transparent, #000 12%, #000 88%, transparent)" }}>
        <motion.div
          className="flex gap-6 px-6"
          animate={{ x: ["0%", "-50%"] }}
          transition={{ duration: 60, repeat: Infinity, ease: "linear" }}
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
      className="group relative w-[300px] shrink-0 rounded-3xl border p-7 backdrop-blur-xl transition-all duration-500 hover:scale-[1.06]"
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
  return (
    <section className="relative bg-white py-28">
      <div className="mx-auto grid max-w-7xl items-center gap-16 px-6 lg:grid-cols-2">
        <div>
          <div className="display mb-4 text-xs uppercase tracking-[0.3em] text-violet">Resultado final</div>
          <h2 className="serif text-4xl text-ink text-balance sm:text-5xl">
            Al finalizar, tenés un <em className="text-violet">sistema comercial</em> funcionando y escalando.
          </h2>
          <ul className="mt-10 space-y-4">
            {CHECKS.map((c, i) => (
              <motion.li
                key={c}
                initial={{ opacity: 0, x: -10 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.08 }}
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
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
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
                      initial={{ width: 0 }}
                      whileInView={{ width: `${b.w}%` }}
                      viewport={{ once: true }}
                      transition={{ duration: 1, delay: 0.2 }}
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
  return (
    <section className="relative bg-cloud py-28">
      <div className="mx-auto max-w-3xl px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="glass-card relative overflow-hidden rounded-3xl p-10 text-center sm:p-14"
        >
          <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-violet via-gold to-violet" />
          <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-violet/10 text-violet">
            <Shield className="h-7 w-7" />
          </div>
          <div className="display mb-2 text-xs uppercase tracking-[0.3em] text-gold">Nuestro compromiso</div>
          <h2 className="serif text-3xl text-ink sm:text-4xl">Nuestra garantía</h2>
          <p className="mx-auto mt-6 max-w-xl text-base leading-relaxed text-muted-foreground sm:text-lg">
            Si al terminar el programa aún no tenés tu sistema comercial implementado correctamente, seguimos contigo hasta dejarlo 100% listo. Tu éxito es nuestro compromiso.
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
              <button className="group/play flex h-20 w-20 items-center justify-center rounded-full bg-white/95 text-ink shadow-2xl transition hover:scale-110">
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
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
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
  return (
    <section id="contacto" className="relative bg-cloud py-28">
      <div className="mx-auto max-w-7xl px-6">
        <div className="mx-auto max-w-3xl text-center">
          <h2 className="serif text-3xl text-ink text-balance sm:text-5xl">
            ¿Todavía no es tu momento para el <em className="text-violet">sistema completo</em>?
          </h2>
          <p className="mt-4 text-muted-foreground">Tres puertas suaves para empezar a ordenar tus ventas hoy.</p>
        </div>

        <div className="mt-14 grid gap-5 lg:grid-cols-3">
          {[
            { t: "Diagnóstico gratuito", d: "Responde unas preguntas y obtené una primera luz de dónde está fallando tu proceso." },
            { t: "Comunidad gratuita “Sala Flows”", d: "Conectate cada 15 días y recibí contenido de valor en ventas y marketing." },
            { t: "Recursos / lead magnets", d: "Guías prácticas para empezar a ordenar tus ventas hoy." },
          ].map((c, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              className="rounded-3xl border border-violet/20 bg-white p-7 shadow-[0_18px_50px_-30px_rgba(43,17,66,0.25)] transition hover:-translate-y-1 hover:shadow-[0_30px_70px_-30px_rgba(139,63,214,0.4)]"
            >
              <div className="display text-[10px] uppercase tracking-[0.25em] text-violet">Opción 0{i + 1}</div>
              <h3 className="serif mt-2 text-2xl text-ink">{c.t}</h3>
              <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{c.d}</p>
            </motion.div>
          ))}
        </div>

        {/* Form */}
        <motion.form
          onSubmit={(e) => e.preventDefault()}
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="glass-card mx-auto mt-14 max-w-2xl rounded-3xl p-8 sm:p-10"
        >
          <div className="display mb-2 text-[10px] uppercase tracking-[0.3em] text-violet">Quiero más información</div>
          <h3 className="serif text-2xl text-ink sm:text-3xl">Contame de tu proyecto</h3>

          <div className="mt-6 grid gap-4 sm:grid-cols-2">
            {[
              { l: "Nombre", t: "text", ph: "Tu nombre" },
              { l: "Gmail", t: "email", ph: "tucorreo@gmail.com" },
              { l: "Compañía", t: "text", ph: "Nombre de tu empresa" },
              { l: "WhatsApp", t: "tel", ph: "+57 322 0000000" },
            ].map((f) => (
              <label key={f.l} className="block">
                <span className="display text-[10px] uppercase tracking-[0.25em] text-muted-foreground">{f.l}</span>
                <input
                  type={f.t}
                  placeholder={f.ph}
                  className="mt-1.5 w-full rounded-xl border border-violet/20 bg-white px-4 py-3 text-sm text-ink outline-none transition focus:border-violet focus:ring-2 focus:ring-violet/20"
                />
              </label>
            ))}
          </div>
          <label className="mt-4 block">
            <span className="display text-[10px] uppercase tracking-[0.25em] text-muted-foreground">Descripción de tu proyecto</span>
            <textarea
              rows={4}
              placeholder="Contame en qué estás trabajando hoy"
              className="mt-1.5 w-full resize-none rounded-xl border border-violet/20 bg-white px-4 py-3 text-sm text-ink outline-none transition focus:border-violet focus:ring-2 focus:ring-violet/20"
            />
          </label>

          <button
            type="submit"
            className="btn-violet mt-6 inline-flex w-full items-center justify-center gap-2 rounded-full px-7 py-4 text-sm font-semibold uppercase tracking-wider hover:scale-[1.01]"
          >
            Quiero más información
            <ArrowRight className="h-4 w-4" />
          </button>
        </motion.form>
      </div>
    </section>
  );
}

/* ========================= 10. CTA FINAL ========================= */
export function CtaFinal({ portrait }: { portrait: string }) {
  return (
    <section id="cta" className="relative overflow-hidden aurora-bg py-28 text-white">
      {/* particles */}
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

      <div className="relative mx-auto grid max-w-7xl items-center gap-12 px-6 lg:grid-cols-[1fr_1.2fr]">
        {/* Portrait */}
        <div className="relative mx-auto h-[460px] w-[300px] sm:h-[520px] sm:w-[340px]">
          <div className="absolute inset-0 rounded-[36px]" style={{ background: "radial-gradient(120% 80% at 50% 0%, #5B2A8C 0%, #2B1142 55%, #1E0A33 100%)" }} />
          <div className="absolute inset-0 overflow-hidden rounded-[36px] border border-white/15 shadow-[0_40px_120px_-30px_rgba(244,196,48,0.35)]">
            <img src={portrait} alt="Caro Chaparro" className="absolute inset-x-0 bottom-0 mx-auto h-[96%] w-auto object-contain object-bottom" />
          </div>
          <div className="absolute -bottom-4 -right-4 rounded-2xl bg-white/10 px-4 py-2 backdrop-blur-xl">
            <div className="display text-[10px] uppercase tracking-[0.25em] text-gold">Caro Chaparro</div>
            <div className="text-xs text-white/80">Mentora · Estratega</div>
          </div>
        </div>

        <div>
          <div className="display mb-4 text-xs uppercase tracking-[0.3em] text-gold">Tu próximo paso</div>
          <h2 className="serif text-4xl leading-[1.05] text-balance sm:text-5xl lg:text-6xl">
            ¿Listo para construir tu <em className="text-gold">sistema comercial</em>?
          </h2>
          <p className="mt-6 max-w-xl text-base leading-relaxed text-white/80 sm:text-lg">
            Agendá tu Diagnóstico Comercial Estratégico y descubrí exactamente dónde se están perdiendo tus ventas y cómo convertirlas en crecimiento.
          </p>

          <a
            href="https://wa.me/573229172709"
            target="_blank"
            rel="noreferrer"
            className="btn-gold pulse-glow group mt-10 inline-flex items-center gap-3 rounded-full px-9 py-5 text-base font-semibold uppercase tracking-wider hover:scale-[1.03]"
          >
            Agenda tu llamada
            <ArrowRight className="h-5 w-5 transition group-hover:translate-x-1" />
          </a>

          <p className="display mt-8 text-sm tracking-[0.15em] text-gold/90 sm:text-base">
            A la cima de ventas no se llega con conocimiento,<br className="hidden sm:block" /> sino con <em>estrategia</em>.
          </p>
        </div>
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
          <div className="serif text-3xl text-white">Caro <em className="text-gold">Chaparro</em></div>
          <p className="mt-3 max-w-sm text-sm text-white/60">
            Caro Chaparro · Mentora & Estratega de ventas. Sistemas comerciales predecibles para infoproductores LATAM.
          </p>
          <a
            href="#cta"
            className="mt-6 inline-flex items-center gap-2 rounded-full border border-gold/40 px-5 py-2.5 text-xs font-semibold uppercase tracking-[0.2em] text-gold transition hover:bg-gold hover:text-ink-deep"
          >
            Agendar diagnóstico
            <ArrowRight className="h-3.5 w-3.5" />
          </a>
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
      href="https://wa.me/573229172709"
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
