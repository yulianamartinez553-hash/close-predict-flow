import { motion } from "framer-motion";
import caroPortrait from "@/assets/caro-portrait.png";
import { MetricCounter } from "@/components/animations/MetricCounter";
import { TickerHorizontal } from "@/components/animations/TickerHorizontal";
import { ShiningButton } from "@/components/animations/ShiningButton";

const CREDENTIALS = [
  "Profesional en Comercio Internacional",
  "Closer Digital Certificada",
  "Customer Service",
  "Neuroventas",
  "Certificación Premium",
  "Estratega Comercial",
  "Mentora High-Ticket",
  "Infoproductora LATAM",
];

const STATS = [
  { value: 100, label: "Clientes acompañados", suffix: "+" },
  { value: 12,  label: "Semanas del programa",  suffix: "" },
  { value: 3,   label: "Años de experiencia",   suffix: "+" },
];

export function AboutMe() {
  return (
    <section id="sobre-mi" className="relative overflow-hidden bg-white py-28">
      {/* soft ambient glows */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -left-40 top-1/3 h-[500px] w-[500px] rounded-full bg-violet/5 blur-3xl" />
        <div className="absolute -right-40 bottom-1/3 h-[400px] w-[400px] rounded-full bg-gold/5 blur-3xl" />
      </div>

      <div className="relative mx-auto max-w-7xl px-6">
        <div className="grid items-center gap-16 lg:grid-cols-[1fr_1.15fr]">

          {/* Portrait */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
            className="relative mx-auto w-full max-w-sm"
          >
            {/* glow halo */}
            <div className="absolute inset-0 rounded-[40px] bg-gradient-to-br from-violet/20 to-gold/10 blur-2xl" />
            <div
              className="relative overflow-hidden rounded-[40px] border border-violet/15"
              style={{ boxShadow: "0 40px 100px -30px rgba(43,17,66,0.35)" }}
            >
              <img
                src={caroPortrait}
                alt="Caro Chaparro, mentora y estratega de ventas"
                className="w-full object-cover"
              />
              {/* bottom fade */}
              <div className="absolute bottom-0 left-0 right-0 h-20 bg-gradient-to-t from-white/20 to-transparent" />
            </div>

            {/* floating tag */}
            <div className="absolute -bottom-4 -right-4 rounded-2xl border border-violet/15 bg-white/90 px-4 py-2 shadow-lg backdrop-blur-xl">
              <div className="display text-[10px] uppercase tracking-[0.25em] text-violet">Caro Chaparro</div>
              <div className="text-xs text-muted-foreground">Mentora · Estratega Comercial</div>
            </div>
          </motion.div>

          {/* Content */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.9, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
          >
            <div className="display mb-4 text-xs uppercase tracking-[0.3em] text-violet">
              Sobre mí
            </div>

            <h2 className="serif text-4xl text-ink text-balance sm:text-5xl">
              Del caos comercial al{" "}
              <em className="text-violet">sistema predecible</em>.
            </h2>

            <p className="mt-6 text-base leading-relaxed text-muted-foreground sm:text-lg">
              Soy Caro Chaparro — estratega comercial y mentora high-ticket. Ayudo a infoproductores y dueños de negocios LATAM a convertir ventas impredecibles en un sistema escalable. En 12 semanas transformamos el caos en un proceso que funciona sin vos.
            </p>

            {/* Stats row */}
            <div className="mt-10 grid grid-cols-3 gap-6 border-t border-violet/10 pt-8">
              {STATS.map((s) => (
                <MetricCounter key={s.label} {...s} />
              ))}
            </div>

            {/* Credentials ticker */}
            <div className="mt-8 rounded-2xl border border-violet/10 bg-cloud/60">
              <TickerHorizontal items={CREDENTIALS} />
            </div>

            {/* CTA */}
            <div className="mt-10">
              <ShiningButton
                href="/diagnostico.html"
                text="Agendar diagnóstico estratégico"
                size="lg"
              />
            </div>
          </motion.div>

        </div>
      </div>
    </section>
  );
}
