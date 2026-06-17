import { motion } from "framer-motion";
import { ArrowRight, TrendingUp, Target, DollarSign } from "lucide-react";
import caroPortrait from "@/assets/caro-portrait.png";

export function Hero() {
  return (
    <section className="relative min-h-screen overflow-hidden aurora-bg text-white">
      {/* Particles */}
      <div className="pointer-events-none absolute inset-0">
        {[...Array(40)].map((_, i) => (
          <motion.span
            key={i}
            className="absolute rounded-full"
            style={{
              left: `${(i * 53) % 100}%`,
              top: `${(i * 37) % 100}%`,
              width: `${2 + (i % 4)}px`,
              height: `${2 + (i % 4)}px`,
              background: i % 3 === 0 ? "#F4C430" : "#9D4EDD",
              opacity: 0.25,
            }}
            animate={{ y: [0, -30, 0], opacity: [0.15, 0.5, 0.15] }}
            transition={{ duration: 6 + (i % 5), repeat: Infinity, delay: i * 0.1 }}
          />
        ))}
      </div>

      {/* Nodes / connections */}
      <svg className="pointer-events-none absolute inset-0 h-full w-full opacity-20" aria-hidden>
        <defs>
          <linearGradient id="line" x1="0" x2="1">
            <stop offset="0" stopColor="#9D4EDD" />
            <stop offset="1" stopColor="#F4C430" stopOpacity="0.5" />
          </linearGradient>
        </defs>
        {[...Array(8)].map((_, i) => (
          <line key={i} x1={`${i * 13}%`} y1={`${10 + i * 8}%`} x2={`${20 + i * 11}%`} y2={`${30 + i * 7}%`} stroke="url(#line)" strokeWidth="1" />
        ))}
      </svg>

      {/* Top nav */}
      <nav className="relative z-20 mx-auto flex max-w-7xl items-center justify-between px-6 py-6">
        <div className="serif text-2xl tracking-tight">Caro <em className="text-gold">Chaparro</em></div>
        <div className="hidden gap-8 text-sm text-white/70 md:flex">
          <a href="#sistema" className="hover:text-white">Sistema</a>
          <a href="#entregables" className="hover:text-white">Entregables</a>
          <a href="#testimonios" className="hover:text-white">Testimonios</a>
          <a href="#contacto" className="hover:text-white">Contacto</a>
        </div>
        <a href="/diagnostico.html" className="hidden rounded-full border border-white/20 px-4 py-2 text-sm hover:bg-white/10 md:inline-block">Agendar</a>
      </nav>

      <div className="relative z-10 mx-auto grid max-w-7xl items-center gap-12 px-6 pb-24 pt-12 lg:grid-cols-[1.15fr_1fr] lg:pt-20">
        {/* Left: copy */}
        <div>
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
            className="mb-6 inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-3 py-1 text-xs uppercase tracking-[0.18em] text-white/80 backdrop-blur"
          >
            <span className="h-1.5 w-1.5 rounded-full bg-gold" />
            CLOSE-PREDICT™ · Mentoría high-ticket
          </motion.div>

          <h1 className="serif text-4xl leading-[1.05] text-balance sm:text-5xl lg:text-[64px]">
            {["Tu negocio", "no tiene un problema", "de ventas."].map((line, i) => (
              <motion.span
                key={i}
                initial={{ opacity: 0, y: 20, filter: "blur(8px)" }}
                animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                transition={{ duration: 0.8, delay: 0.2 + i * 0.15 }}
                className="block"
              >
                {line}
              </motion.span>
            ))}
            <motion.span
              initial={{ opacity: 0, y: 20, filter: "blur(8px)" }}
              animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
              transition={{ duration: 0.9, delay: 0.7 }}
              className="block"
            >
              Tiene un problema de{" "}
              <em className="bg-gradient-to-r from-violet-bright to-gold bg-clip-text not-italic font-semibold text-transparent">
                sistema.
              </em>
            </motion.span>
          </h1>

          <motion.p
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 1.05 }}
            className="mt-6 max-w-xl text-base leading-relaxed text-white/75 sm:text-lg"
          >
            Transformo ventas que dependen del dueño en un <em className="text-white">sistema comercial predecible</em> y escalable en 12 semanas.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 1.25 }}
            className="mt-10 flex flex-wrap items-center gap-4"
          >
            <a
              href="/diagnostico.html"
              className="btn-gold pulse-glow group inline-flex items-center gap-2 rounded-full px-7 py-4 text-sm font-semibold uppercase tracking-wider hover:scale-[1.02]"
            >
              Agendar diagnóstico estratégico
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </a>
            <a href="#sistema" className="text-sm text-white/70 underline-offset-4 hover:text-white hover:underline">
              Ver cómo funciona →
            </a>
          </motion.div>
        </div>

        {/* Right: portrait + floating dashboard cards */}
        <div className="relative mx-auto h-[520px] w-full max-w-md lg:h-[600px]">
          {/* Soft glow halo behind portrait */}
          <div className="absolute left-1/2 top-10 -z-0 h-[480px] w-[420px] -translate-x-1/2 rounded-full bg-[radial-gradient(closest-side,rgba(157,78,221,0.55),transparent_70%)] blur-2xl" />

          {/* Portrait — no frame, blends with aurora */}
          <motion.img
            src={caroPortrait}
            alt="Caro Chaparro, mentora y estratega de ventas"
            initial={{ opacity: 0, scale: 0.96, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 1.1, delay: 0.4, ease: [0.22, 1, 0.36, 1] }}
            className="absolute left-1/2 bottom-0 h-[560px] w-auto max-w-none -translate-x-1/2 object-contain drop-shadow-[0_40px_60px_rgba(30,10,51,0.55)] lg:h-[640px]"
          />

          {/* Floating metric cards */}
          <motion.div
            initial={{ opacity: 0, x: -20, y: 10 }}
            animate={{ opacity: 1, x: 0, y: 0 }}
            transition={{ duration: 0.8, delay: 1.1 }}
            className="float-y absolute -left-2 top-24 z-10 w-[170px] rounded-2xl border border-white/20 bg-white/10 p-4 backdrop-blur-xl sm:-left-8"
          >
            <div className="flex items-center gap-2 text-[10px] uppercase tracking-widest text-white/60">
              <Target className="h-3 w-3 text-gold" /> Pipeline
            </div>
            <div className="serif mt-1 text-3xl text-white">245</div>
            <div className="mt-1 text-[11px] text-emerald-300">+18% mes</div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20, y: 10 }}
            animate={{ opacity: 1, x: 0, y: 0 }}
            transition={{ duration: 0.8, delay: 1.3 }}
            className="float-y absolute -right-2 top-40 z-10 w-[170px] rounded-2xl border border-white/20 bg-white/10 p-4 backdrop-blur-xl sm:-right-8"
            style={{ animationDelay: "1.5s" }}
          >
            <div className="flex items-center gap-2 text-[10px] uppercase tracking-widest text-white/60">
              <TrendingUp className="h-3 w-3 text-gold" /> Conversión
            </div>
            <div className="serif mt-1 text-3xl text-white">13.1%</div>
            <div className="mt-1 text-[11px] text-emerald-300">+4.2 pts</div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 1.5 }}
            className="float-y absolute bottom-6 left-1/2 z-10 w-[200px] -translate-x-1/2 rounded-2xl border border-white/20 bg-white/10 p-4 backdrop-blur-xl"
            style={{ animationDelay: "3s" }}
          >
            <div className="flex items-center gap-2 text-[10px] uppercase tracking-widest text-white/60">
              <DollarSign className="h-3 w-3 text-gold" /> Ventas
            </div>
            <div className="serif mt-1 text-3xl text-white">$158K</div>
            <div className="mt-2 flex h-1.5 gap-0.5">
              {[40, 60, 75, 55, 85, 70, 95].map((h, i) => (
                <div key={i} className="flex-1 rounded-full bg-gradient-to-t from-violet-bright to-gold" style={{ opacity: h / 100 }} />
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
