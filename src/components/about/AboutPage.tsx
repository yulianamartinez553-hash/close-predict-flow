import { useRef, type ReactNode } from "react";
import {
  motion,
  useInView,
  useMotionValue,
  useScroll,
  useSpring,
  useTransform,
} from "framer-motion";
import { useReducedMotion } from "@/lib/use-reduced-motion";
import { DUR, EASE, STAGGER, VIEWPORT, revealUp, revealScale, staggerParent } from "@/lib/motion";
import "./about.css";

import {
  AuroraLayer,
  MaskedLines,
  RevealBlock,
  ScrollCue,
  WordReveal,
} from "./primitives";
import { ImageSlot } from "./ImageSlot";
import { Marquee } from "./Marquee";
import { DiagonalMosaic } from "./DiagonalMosaic";
import { Counter } from "./Counter";
import { RotatingSeal } from "./RotatingSeal";
import { MilestoneSection } from "./MilestoneSection";
import { TestimonialGrid } from "./TestimonialGrid";
import { testimonials } from "@/content/about/testimonials";

/* ── Helpers locales ──────────────────────────────────────────── */

/* Palabra destacada con subrayado que crece al entrar en viewport */
function Mark({ children }: { children: ReactNode }) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.6 });
  return (
    <span ref={ref} className="about-mark" data-inview={inView ? "true" : "false"}>
      {children}
    </span>
  );
}

/* Sección estándar (fondo ink + aurora) */
function Shell({
  id,
  children,
  pad = "clamp(5rem, 10vh, 9rem)",
  aurora = true,
  style,
}: {
  id?: string;
  children: ReactNode;
  pad?: string;
  aurora?: boolean;
  style?: React.CSSProperties;
}) {
  return (
    <section
      id={id}
      style={{
        position: "relative",
        background: "var(--ink)",
        paddingTop: pad,
        paddingBottom: pad,
        ...style,
      }}
    >
      {aurora && <AuroraLayer />}
      <div style={{ position: "relative", zIndex: 1 }}>{children}</div>
    </section>
  );
}

const container: React.CSSProperties = {
  maxWidth: 1180,
  margin: "0 auto",
  padding: "0 clamp(1.5rem, 5vw, 4rem)",
};

/* Tarjeta con tilt seguido por el puntero (S9) */
function TiltCard({ id }: { id: string }) {
  const reduced = useReducedMotion();
  const rx = useMotionValue(0);
  const ry = useMotionValue(0);
  const srx = useSpring(rx, { stiffness: 150, damping: 18 });
  const sry = useSpring(ry, { stiffness: 150, damping: 18 });

  const onMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (reduced) return;
    const r = e.currentTarget.getBoundingClientRect();
    const px = (e.clientX - r.left) / r.width - 0.5;
    const py = (e.clientY - r.top) / r.height - 0.5;
    ry.set(px * 12);
    rx.set(-py * 8);
  };
  const onLeave = () => {
    rx.set(0);
    ry.set(0);
  };

  return (
    <motion.div variants={revealScale} style={{ perspective: 1000 }}>
      <motion.div
        onMouseMove={onMove}
        onMouseLeave={onLeave}
        style={{
          rotateX: reduced ? 0 : srx,
          rotateY: reduced ? 0 : sry,
          transformStyle: "preserve-3d",
          borderRadius: 14,
          overflow: "hidden",
          border: "1px solid color-mix(in oklab, #7b2cbf 30%, transparent)",
        }}
      >
        <ImageSlot id={id} ratio="3/4" />
      </motion.div>
    </motion.div>
  );
}

/* ══════════════════════ S1 — HERO ══════════════════════ */
function S1Hero() {
  const reduced = useReducedMotion();
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const yRaw = useTransform(scrollYProgress, [0, 1], ["-6%", "6%"]);
  const y = useSpring(yRaw, { stiffness: 60, damping: 20 });
  const auroraScale = useTransform(scrollYProgress, [0, 1], [1, 1.08]);

  return (
    <Shell aurora={false} pad="clamp(6rem, 12vh, 10rem)" style={{ overflow: "hidden" }}>
      <AuroraLayer />
      <div
        style={{
          ...container,
          display: "grid",
          gap: "clamp(2rem, 6vw, 5rem)",
          alignItems: "center",
          gridTemplateColumns: "minmax(0, 1.1fr) minmax(0, 0.9fr)",
        }}
        className="milestone-grid"
      >
        {/* Texto */}
        <div>
          <div className="about-kicker" style={{ marginBottom: "1.4rem" }}>
            Sobre mí
          </div>
          <WordReveal
            text={"Hola, soy\nCaro Chaparro."}
            trigger="mount"
            className="about-display"
            style={{ fontSize: "clamp(40px, 7vw, 88px)", color: "var(--text-primary)" }}
          />
          <p className="about-body" style={{ marginTop: "2rem", color: "var(--text-muted)" }}>
            Una estratega comercial, consultora y creadora de{" "}
            <span style={{ color: "var(--violet-glow)", fontWeight: 600 }}>CLOSE-PREDICT™</span> con
            un propósito claro:
          </p>
          <p className="about-body" style={{ marginTop: "0.8rem" }}>
            Ayudarte a construir un negocio que pueda crecer sin depender completamente de vos.
          </p>
          <div style={{ marginTop: "2.5rem" }}>
            <ScrollCue targetId="about-intro" />
          </div>
        </div>

        {/* Retrato con parallax + aurora que escala */}
        <div ref={ref} style={{ position: "relative" }}>
          <motion.div
            aria-hidden
            style={{
              position: "absolute",
              inset: "-12%",
              borderRadius: "50%",
              background: "radial-gradient(circle, var(--ink-accent) 0%, transparent 66%)",
              mixBlendMode: "soft-light",
              scale: reduced ? 1 : auroraScale,
              zIndex: 0,
            }}
          />
          <motion.div
            initial={reduced ? false : "hidden"}
            whileInView="show"
            viewport={{ once: true, amount: 0.2 }}
            variants={reduced ? undefined : revealScale}
            transition={{ delay: 0.35 }}
            style={{ position: "relative", zIndex: 1, y: reduced ? 0 : y, willChange: "transform" }}
          >
            <div style={{ borderRadius: 16, overflow: "hidden" }}>
              {/* desktop 4:5 / mobile 3:4 — un solo slot responsive por CSS */}
              <div className="about-hero-portrait">
                <ImageSlot id="hero-portrait-desktop" ratio="4/5" priority />
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </Shell>
  );
}

/* ══════════════════════ S2 — POSICIONAMIENTO ══════════════════════ */
function S2Positioning() {
  return (
    <Shell id="about-intro">
      <RevealBlock stagger={STAGGER.base} style={{ ...container }}>
        <motion.p variants={revealUp} className="about-body" style={{ fontSize: "clamp(20px, 2.6vw, 30px)", maxWidth: "48ch" }}>
          Para algunas personas soy consultora. Para otras, estratega comercial. Y algunos me
          definen como mentora.
        </motion.p>
        <motion.p variants={revealUp} className="about-body" style={{ marginTop: "1.4rem", fontSize: "clamp(20px, 2.6vw, 30px)", maxWidth: "52ch" }}>
          Pero yo me considero una{" "}
          <Mark>constructora de negocios que crecen sin depender de una sola persona</Mark>.
        </motion.p>
        <motion.p variants={revealUp} className="about-body" style={{ marginTop: "1.4rem", color: "var(--text-muted)" }}>
          Siempre con estrategia, pero también con cercanía.
        </motion.p>
        <motion.p variants={revealUp} className="about-body" style={{ marginTop: "1.4rem", color: "var(--text-muted)" }}>
          Soy colombiana y emprendedora. Trabajo de cerca con infoproductores, consultores y
          empresarios que ya venden, pero quieren dejar de ser el centro de todo.
        </motion.p>
      </RevealBlock>
    </Shell>
  );
}

/* ══════════════════════ S3 — MOSAICO DIAGONAL #1 ══════════════════════ */
function S3Mosaic() {
  const slots = Array.from({ length: 10 }, (_, i) => `mosaic1-${String(i + 1).padStart(2, "0")}`);
  return (
    <section style={{ position: "relative", background: "var(--ink)", padding: "clamp(2rem, 5vh, 4rem) 0" }}>
      <DiagonalMosaic
        slots={slots}
        rows={2}
        rotate={-8}
        speeds={[40, 48]}
        scrollRange={[["-14%", "10%"], ["10%", "-14%"]]}
        heightDesktop="62vh"
        heightMobile="44vh"
      />
    </section>
  );
}

/* ══════════════════════ S4 — FRASE PUENTE ══════════════════════ */
function S4Bridge() {
  const reduced = useReducedMotion();
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const scale = useTransform(scrollYProgress, [0, 0.5, 1], [0.94, 1, 0.98]);

  return (
    <Shell>
      <div ref={ref} style={{ ...container, textAlign: "center" }}>
        <motion.div style={{ scale: reduced ? 1 : scale }}>
          <RevealBlock amount={VIEWPORT.phrase.amount}>
            <h2
              className="about-display"
              style={{ fontSize: "clamp(30px, 5.5vw, 72px)", color: "var(--text-primary)", margin: 0 }}
            >
              Vení, te cuento cómo llegué acá.
              <br />
              <span style={{ color: "var(--violet-glow)" }}>Y cómo vos también podés lograrlo.</span>
            </h2>
          </RevealBlock>
        </motion.div>
      </div>
    </Shell>
  );
}

/* ══════════════════════ S5 — PREGUNTA + MARQUEE #1 ══════════════════════ */
function S5Question() {
  return (
    <Shell>
      <div style={{ ...container }}>
        <RevealBlock stagger={STAGGER.base}>
          <motion.div variants={revealUp} className="about-kicker" style={{ marginBottom: "1rem" }}>
            Una de las preguntas que más me hacen es:
          </motion.div>
          <motion.h2
            variants={revealUp}
            className="about-display"
            style={{ fontSize: "clamp(28px, 4.4vw, 58px)", color: "var(--text-primary)", maxWidth: "18ch", margin: 0 }}
          >
            ¿Cómo puede crecer un negocio si depende de una sola persona?
          </motion.h2>
        </RevealBlock>
      </div>

      <div style={{ margin: "clamp(2.5rem, 6vh, 5rem) 0" }}>
        <Marquee text="Decime" repeat={6} direction="left" durationDesktop={22} durationMobile={14} />
      </div>

      <div style={{ ...container, display: "grid", gridTemplateColumns: "repeat(2, minmax(0,1fr))", gap: "1.5rem", maxWidth: 760 }}>
        <RevealBlock stagger={STAGGER.loose} style={{ display: "contents" }}>
          <motion.div variants={revealScale}>
            <ImageSlot id="loop-gesture-01" kind="video" ratio="1/1" />
          </motion.div>
          <motion.div variants={revealScale}>
            <ImageSlot id="loop-gesture-02" kind="video" ratio="1/1" />
          </motion.div>
        </RevealBlock>
      </div>
    </Shell>
  );
}

/* ══════════════════════ S6 — HITO 1 ══════════════════════ */
function S6() {
  return (
    <MilestoneSection index={0} kicker="El comienzo" title="La observación">
      <RevealBlock stagger={STAGGER.base}>
        {[
          "Durante muchos años me apasionó entender cómo funcionan las empresas por dentro. Siempre me llamó la atención descubrir por qué algunos negocios lograban crecer con tranquilidad mientras otros, aun vendiendo bien, parecían vivir apagando incendios todos los días.",
          "Con el tiempo entendí que detrás de cada resultado había mucho más que una buena estrategia de ventas. Había decisiones, procesos, liderazgo y una forma de construir empresa que casi nadie enseñaba.",
          "Y desde ese momento supe que quería dedicarme a eso. No solamente a vender. Sino a ayudar a construir negocios que realmente pudieran crecer.",
        ].map((p, i) => (
          <motion.p key={i} variants={revealUp} className="about-body" style={{ marginBottom: "1.3rem" }}>
            {p}
          </motion.p>
        ))}
      </RevealBlock>

      <div style={{ marginTop: "2.5rem" }}>
        <WordReveal
          text={"Mi pasión: que un negocio\npueda crecer sin cargar\na una sola persona."}
          className="about-display"
          style={{ fontSize: "clamp(24px, 3.4vw, 44px)", color: "var(--violet-glow)" }}
          amount={0.4}
        />
      </div>
    </MilestoneSection>
  );
}

/* ══════════════════════ S7 — HITO 2 + CONTADORES ══════════════════════ */
function S7() {
  return (
    <MilestoneSection index={1} kicker="Mi apuesta" title="Procesos comerciales">
      <RevealBlock stagger={STAGGER.base}>
        <motion.p variants={revealUp} className="about-body" style={{ marginBottom: "1.3rem" }}>
          Mientras acompañaba empresarios y trabajaba de cerca con equipos comerciales, veía una
          escena repetirse una y otra vez. Había dueños de negocio que conocían mejor que nadie a sus
          clientes. Tenían excelentes productos. Sabían vender. Pero cargaban con una responsabilidad
          enorme.
        </motion.p>
      </RevealBlock>

      <RevealBlock stagger={STAGGER.base} style={{ margin: "1.5rem 0" }}>
        {[
          "Si ellos no estaban, las ventas bajaban.",
          "Si ellos no respondían, las decisiones se detenían.",
          "Si ellos salían unos días, todo parecía quedarse en pausa.",
        ].map((l, i) => (
          <motion.p
            key={i}
            variants={revealUp}
            className="about-display"
            style={{ fontSize: "clamp(18px, 2.4vw, 28px)", color: "var(--text-primary)", marginBottom: "0.6rem" }}
          >
            {l}
          </motion.p>
        ))}
      </RevealBlock>

      <RevealBlock>
        <p className="about-body" style={{ color: "var(--text-muted)" }}>
          Por eso empecé a estudiar con profundidad procesos comerciales, liderazgo, documentación,
          automatización y sistemas de ventas.
        </p>
      </RevealBlock>

      {/* Contadores */}
      <div style={{ display: "flex", flexWrap: "wrap", gap: "clamp(2rem, 6vw, 4rem)", marginTop: "3rem" }}>
        <Counter to={20} suffix="+" label="Proyectos como closer" />
        <Counter to={5} suffix="+" label="Empresas asesoradas" />
      </div>
    </MilestoneSection>
  );
}

/* ══════════════════════ S9 — HITO 3 ══════════════════════ */
function S9() {
  const reduced = useReducedMotion();
  return (
    <MilestoneSection index={2} kicker="La consecuencia" title="Close-Predict™" extraTopPad>
      <RevealBlock stagger={STAGGER.base}>
        <motion.p variants={revealUp} className="about-body" style={{ marginBottom: "1.3rem" }}>
          Todo ese recorrido terminó dándole vida a CLOSE-PREDICT™. No nació de un plan de negocios.
          Nació de años observando los mismos errores repetirse en empresas de diferentes tamaños.
        </motion.p>
        <motion.p variants={revealUp} className="about-body">
          Nació de conversaciones con dueños de negocio que sentían que trabajaban más que nunca, pero
          seguían siendo el cuello de botella de su propia empresa.
        </motion.p>
      </RevealBlock>

      <div style={{ margin: "2.2rem 0" }}>
        <MaskedLines
          lines={["Un negocio debería darle libertad", "a quien lo construyó, no quitarla."]}
          className="about-display"
          style={{ fontSize: "clamp(24px, 3.6vw, 46px)", color: "var(--violet-glow)" }}
        />
      </div>

      <RevealBlock
        stagger={STAGGER.loose}
        amount={VIEWPORT.image.amount}
        style={{ display: "grid", gridTemplateColumns: "repeat(2, minmax(0,1fr))", gap: "1.2rem", maxWidth: 560 }}
      >
        <TiltCard id="asset-sistema-01" />
        <TiltCard id="asset-sistema-02" />
      </RevealBlock>

      {/* CTA */}
      <div style={{ marginTop: "2.5rem" }}>
        <motion.a
          href="#newsletter"
          className="btn-gold about-glow"
          whileHover={reduced ? undefined : { scale: 1.03 }}
          transition={{ duration: DUR.micro, ease: EASE.soft }}
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 10,
            padding: "0.9rem 1.8rem",
            borderRadius: 999,
            fontWeight: 700,
            textTransform: "uppercase",
            letterSpacing: "0.06em",
            fontSize: 14,
          }}
        >
          Quiero enterarme de lo próximo
        </motion.a>
      </div>
    </MilestoneSection>
  );
}

/* ══════════════════════ S10 — PRUEBA SOCIAL ══════════════════════ */
function S10() {
  return (
    <Shell>
      <div style={{ ...container }}>
        <RevealBlock stagger={STAGGER.base} style={{ marginBottom: "2.5rem", textAlign: "center" }}>
          <motion.div variants={revealUp} className="about-kicker">
            Prueba social
          </motion.div>
          <motion.h2
            variants={revealUp}
            className="about-display"
            style={{ fontSize: "clamp(26px, 4vw, 52px)", color: "var(--text-primary)", marginTop: "0.8rem" }}
          >
            Lo que dicen quienes ya ordenaron sus ventas.
          </motion.h2>
        </RevealBlock>
        <TestimonialGrid items={testimonials} />
      </div>
    </Shell>
  );
}

/* ══════════════════════ S11 — HITO 4 ══════════════════════ */
function S11() {
  return (
    <MilestoneSection index={3} kicker="El siguiente paso" title="Acompañar">
      <RevealBlock>
        <p className="about-body" style={{ marginBottom: "1.6rem" }}>
          Como ves, desde el principio mi trabajo se ha apoyado en compartir lo que sé. Por eso el
          siguiente paso lógico era acompañar de cerca.
        </p>
      </RevealBlock>

      <div style={{ margin: "1.8rem 0" }}>
        <MaskedLines
          lines={["Yo pertenezco a las mesas", "donde se toman decisiones."]}
          className="about-display"
          style={{ fontSize: "clamp(24px, 3.6vw, 48px)", color: "var(--text-primary)" }}
        />
      </div>

      <RevealBlock>
        <p className="about-body" style={{ color: "var(--text-muted)" }}>
          Es en ese lugar donde exploto toda mi energía y mi pasión. Donde acompaño a empresarios que
          confían en mí para construir negocios más sólidos.
        </p>
      </RevealBlock>

      <div
        style={{
          marginTop: "2.5rem",
          display: "grid",
          gridTemplateColumns: "repeat(3, minmax(0,1fr))",
          gap: "1rem",
        }}
      >
        <div style={{ gridColumn: "span 1" }}>
          <ImageSlot id="loop-speaker" kind="video" ratio="4/5" />
        </div>
        <ImageSlot id="stage-01" ratio="3/2" className="about-mosaic-fig" />
        <ImageSlot id="stage-02" ratio="4/5" className="about-mosaic-fig" />
      </div>
    </MilestoneSection>
  );
}

/* ══════════════════════ S13 — MARQUEE #2 + MOSAICO GRANDE ══════════════════════ */
function S13() {
  const slots = Array.from({ length: 21 }, (_, i) => `mosaic2-${String(i + 1).padStart(2, "0")}`);
  return (
    <section style={{ position: "relative", background: "var(--ink)", padding: "clamp(2rem, 5vh, 4rem) 0" }}>
      <div style={{ marginBottom: "clamp(1.5rem, 4vh, 3rem)" }}>
        <Marquee text="Acá" repeat={7} direction="right" durationDesktop={26} durationMobile={16} />
      </div>
      <div style={{ ...container, marginBottom: "clamp(2rem, 5vh, 3.5rem)" }}>
        <RevealBlock amount={VIEWPORT.phrase.amount}>
          <h2
            className="about-display"
            style={{ fontSize: "clamp(24px, 3.4vw, 44px)", color: "var(--text-primary)", maxWidth: "24ch", margin: 0 }}
          >
            Acompaño a empresarios que confían en mí para construir negocios que no dependan de ellos.
          </h2>
        </RevealBlock>
      </div>
      <DiagonalMosaic
        slots={slots}
        rows={3}
        rotate={-6}
        speeds={[46, 54, 50]}
        scrollRange={[["-16%", "12%"], ["12%", "-16%"], ["-10%", "8%"]]}
        heightDesktop="78vh"
        heightMobile="52vh"
      />
    </section>
  );
}

/* ══════════════════════ S14 — HITO 5 ══════════════════════ */
function S14() {
  const reduced = useReducedMotion();
  const trioA = ["today-01", "today-02", "today-03"];
  const trioB = ["today-04", "today-05", "today-06"];
  return (
    <MilestoneSection index={4} kicker="Mi presente" title="Acompañar empresas">
      <RevealBlock>
        <p className="about-body" style={{ marginBottom: "1.8rem" }}>
          Hoy tengo el privilegio de acompañar a infoproductores, consultores y empresarios que
          decidieron dejar de improvisar para empezar a construir empresas mucho más sólidas.
        </p>
      </RevealBlock>

      {/* Trío 1 */}
      <RevealBlock
        stagger={STAGGER.loose}
        amount={VIEWPORT.image.amount}
        style={{ display: "grid", gridTemplateColumns: "repeat(3, minmax(0,1fr))", gap: "0.9rem" }}
      >
        {trioA.map((id) => (
          <motion.div key={id} variants={revealUp}>
            <ImageSlot id={id} ratio="4/5" className="about-mosaic-fig" />
          </motion.div>
        ))}
      </RevealBlock>

      <div style={{ margin: "2.2rem 0" }}>
        <MaskedLines
          lines={["Sí podés tenerlo todo."]}
          className="about-display"
          style={{ fontSize: "clamp(28px, 4.4vw, 58px)", color: "var(--violet-glow)" }}
        />
      </div>

      {/* Trío 2 con escalonado vertical */}
      <motion.div
        initial={reduced ? false : "hidden"}
        whileInView="show"
        viewport={{ once: true, amount: VIEWPORT.image.amount }}
        variants={staggerParent(STAGGER.loose)}
        style={{ display: "grid", gridTemplateColumns: "repeat(3, minmax(0,1fr))", gap: "0.9rem" }}
      >
        {trioB.map((id, i) => (
          <motion.div key={id} variants={revealUp} style={{ marginTop: [0, 24, 48][i] }}>
            <ImageSlot id={id} ratio="4/5" className="about-mosaic-fig" />
          </motion.div>
        ))}
      </motion.div>

      <RevealBlock>
        <p className="about-body" style={{ color: "var(--text-muted)", marginTop: "2rem" }}>
          Mi trabajo no consiste solamente en hablar de ventas. Consiste en ayudarles a recuperar
          claridad, estructura y confianza para que puedan volver a enfocarse en lo que realmente hace
          crecer un negocio.
        </p>
      </RevealBlock>
    </MilestoneSection>
  );
}

/* ══════════════════════ S15 — VALORES + SELLOS ══════════════════════ */
function S15() {
  const bullets = ["Desarrollan procesos.", "Sirven a otros.", 'Son "hacedores".'];
  return (
    <Shell>
      <div
        style={{
          ...container,
          display: "grid",
          gap: "clamp(2.5rem, 6vw, 5rem)",
          gridTemplateColumns: "minmax(0,1.1fr) minmax(0,0.9fr)",
          alignItems: "center",
        }}
        className="milestone-grid"
      >
        <div>
          <RevealBlock>
            <p className="about-body" style={{ marginBottom: "1.6rem" }}>
              Este camino me hizo entender que quienes construyen negocios sólidos tienen tres
              características fundamentales:
            </p>
          </RevealBlock>

          <RevealBlock stagger={STAGGER.base}>
            {bullets.map((b, i) => (
              <motion.div
                key={i}
                variants={revealUp}
                style={{ display: "flex", alignItems: "center", gap: "0.8rem", marginBottom: "0.9rem" }}
              >
                <motion.span
                  aria-hidden
                  initial={{ scaleX: 0 }}
                  whileInView={{ scaleX: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: DUR.base, ease: EASE.out }}
                  style={{ display: "block", width: 28, height: 2, background: "var(--violet)", transformOrigin: "left" }}
                />
                <span className="about-display" style={{ fontSize: "clamp(18px, 2.4vw, 28px)", color: "var(--text-primary)" }}>
                  {b}
                </span>
              </motion.div>
            ))}
          </RevealBlock>

          <RevealBlock>
            <p className="about-body" style={{ color: "var(--text-muted)", marginTop: "1.6rem" }}>
              Y así mismo me defino. Me capacito constantemente, sirvo a otros con mis conocimientos,
              mentorías y consultorías. Hago lo que tengo que hacer para crecer.
            </p>
          </RevealBlock>
        </div>

        {/* Sellos + retrato */}
        <div style={{ position: "relative", display: "flex", flexDirection: "column", gap: "2rem", alignItems: "center" }}>
          <div style={{ width: "100%", maxWidth: 320 }}>
            <ImageSlot id="values-01" ratio="4/5" />
          </div>
          <div style={{ display: "flex", gap: "1.5rem", flexWrap: "wrap", justifyContent: "center" }}>
            <RotatingSeal
              text="Yo vine a construir negocios que no dependan de una sola persona"
              size={200}
              duration={18}
              direction="cw"
            />
            <RotatingSeal
              text="Estrategia que transforma decisiones en resultados"
              size={200}
              duration={22}
              direction="ccw"
            />
          </div>
        </div>
      </div>
    </Shell>
  );
}

/* ══════════════════════ S16 — CIERRE MANIFIESTO ══════════════════════ */
function S16() {
  const reduced = useReducedMotion();
  return (
    <Shell>
      <div
        style={{
          ...container,
          display: "grid",
          gap: "clamp(2.5rem, 6vw, 5rem)",
          gridTemplateColumns: "minmax(0,1fr) minmax(0,0.8fr)",
          alignItems: "start",
        }}
        className="milestone-grid"
      >
        <div>
          <RevealBlock stagger={STAGGER.base}>
            {[
              "Yo estoy acá para acompañarte. Cada uno de mis proyectos está construido sobre el servicio, la estrategia y una misión clara.",
              "No busco solo transacciones, busco relaciones.",
              "Soy colombiana, emprendedora y una convencida de que el crecimiento profesional siempre empieza por el crecimiento personal. Disfruto aprender, cuestionar lo establecido y encontrar maneras más simples de resolver problemas complejos.",
              "Creo en hacer las cosas con estrategia, pero también con cercanía. En escuchar antes de hablar. En construir relaciones antes que vender.",
            ].map((p, i) => (
              <motion.p key={i} variants={revealUp} className="about-body" style={{ marginBottom: "1.2rem" }}>
                {p}
              </motion.p>
            ))}
          </RevealBlock>

          <div style={{ margin: "2rem 0" }}>
            <MaskedLines
              lines={[
                "No sueño con que me recuerden",
                "por un sistema de ventas.",
                "Sueño con que cada empresario",
                "que pase por CLOSE-PREDICT™",
                "pueda mirar su negocio y decir:",
                "«Hoy mi empresa puede crecer",
                "sin depender completamente de mí.»",
              ]}
              className="about-display"
              style={{ fontSize: "clamp(20px, 2.8vw, 36px)", color: "var(--violet-glow)" }}
            />
          </div>

          <RevealBlock>
            <p className="about-body">
              Si leíste hasta acá, gracias. Este es solo el primer paso de esta relación.
            </p>
          </RevealBlock>

          {/* Firma dibujada (flourish + slot para signature.svg) */}
          <div style={{ marginTop: "1.5rem", display: "flex", alignItems: "center", gap: "1rem" }}>
            <motion.svg width="180" height="60" viewBox="0 0 180 60" fill="none" aria-hidden>
              <motion.path
                d="M4 40 C 30 4, 50 4, 60 34 S 96 60, 120 26 S 168 8, 176 30"
                stroke="var(--violet-glow)"
                strokeWidth="2.2"
                strokeLinecap="round"
                initial={reduced ? { pathLength: 1 } : { pathLength: 0 }}
                whileInView={{ pathLength: 1 }}
                viewport={{ once: true, amount: 0.6 }}
                transition={{ duration: 1.8, ease: EASE.out }}
              />
            </motion.svg>
            <div style={{ width: 120 }}>
              <ImageSlot id="signature" ratio="libre" style={{ aspectRatio: "3 / 1" }} />
            </div>
          </div>
        </div>

        {/* Retrato con aurora */}
        <div style={{ position: "relative" }}>
          <AuroraLayer blobs={[{ x: "50%", y: "40%", size: "38vw", opacity: 0.6 }]} />
          <div style={{ position: "relative", zIndex: 1, borderRadius: 16, overflow: "hidden" }}>
            <ImageSlot id="closing-portrait" ratio="4/5" />
          </div>
        </div>
      </div>
    </Shell>
  );
}

/* ══════════════════════ S17 — NEWSLETTER / CTA ══════════════════════ */
function S17() {
  const reduced = useReducedMotion();
  return (
    <Shell id="newsletter">
      <div style={{ ...container, maxWidth: 900, textAlign: "center" }}>
        <RevealBlock>
          <h2
            className="about-display"
            style={{ fontSize: "clamp(26px, 4vw, 52px)", color: "var(--text-primary)", margin: "0 auto", maxWidth: "20ch" }}
          >
            ¿Querés ser de las primeras personas en enterarte de lo próximo de CLOSE-PREDICT™?
          </h2>
        </RevealBlock>

        <form
          onSubmit={(e) => e.preventDefault()}
          style={{ marginTop: "2.5rem", display: "flex", flexDirection: "column", gap: "1.6rem", alignItems: "center" }}
        >
          <InlineField label="Me llamo" placeholder="tu nombre" name="nombre" />
          <InlineField label="Mi correo electrónico es" placeholder="tu@correo.com" name="email" type="email" />

          <motion.button
            type="submit"
            className="btn-gold about-glow"
            whileHover={reduced ? undefined : { scale: 1.03 }}
            transition={{ duration: DUR.micro, ease: EASE.soft }}
            style={{
              marginTop: "0.6rem",
              padding: "0.9rem 2.4rem",
              borderRadius: 999,
              fontWeight: 700,
              textTransform: "uppercase",
              letterSpacing: "0.08em",
              fontSize: 14,
              border: "none",
              cursor: "pointer",
            }}
          >
            Enviar
          </motion.button>

          <p style={{ fontSize: 12, color: "var(--text-muted)", maxWidth: "52ch", lineHeight: 1.6 }}>
            Al enviar aceptás nuestra{" "}
            <a href="#" style={{ color: "var(--violet-glow)", textDecoration: "underline" }}>Política de Privacidad</a>{" "}
            y el{" "}
            <a href="#" style={{ color: "var(--violet-glow)", textDecoration: "underline" }}>Aviso legal</a>.
          </p>
        </form>

        <div style={{ marginTop: "3rem", display: "grid", gridTemplateColumns: "repeat(2, minmax(0,1fr))", gap: "1.2rem", maxWidth: 460, marginInline: "auto" }}>
          {["loop-pointing-01", "loop-pointing-02"].map((id) => (
            <motion.div
              key={id}
              variants={revealScale}
              initial={reduced ? false : "hidden"}
              whileInView="show"
              viewport={{ once: true, amount: 0.3 }}
              animate={reduced ? undefined : { rotate: [-2, 2, -2] }}
              transition={reduced ? undefined : { duration: 3.2, repeat: Infinity, ease: "easeInOut" }}
            >
              <ImageSlot id={id} kind="video" ratio="1/1" />
            </motion.div>
          ))}
        </div>
      </div>
    </Shell>
  );
}

function InlineField({
  label,
  placeholder,
  name,
  type = "text",
}: {
  label: string;
  placeholder: string;
  name: string;
  type?: string;
}) {
  return (
    <label
      style={{
        display: "flex",
        alignItems: "baseline",
        gap: "0.6rem",
        flexWrap: "wrap",
        justifyContent: "center",
        fontFamily: "'Montserrat', system-ui, sans-serif",
        fontSize: "clamp(18px, 2.4vw, 26px)",
        color: "var(--text-primary)",
      }}
    >
      <span>{label}</span>
      <input
        name={name}
        type={type}
        placeholder={placeholder}
        className="about-inline-input"
      />
    </label>
  );
}

/* ══════════════════════ PÁGINA ══════════════════════ */
export function AboutPage() {
  return (
    <main className="about-root">
      <S1Hero />
      <S2Positioning />
      <S3Mosaic />
      <S4Bridge />
      <S5Question />
      <S6 />
      <S7 />
      {/* S8 eliminada (muro de logos) — S7 conecta directo con S9 */}
      <S9 />
      <S10 />
      <S11 />
      {/* S12 eliminada (frase geográfica) — su marquee se reubicó en S13 */}
      <S13 />
      <S14 />
      <S15 />
      <S16 />
      <S17 />
    </main>
  );
}
