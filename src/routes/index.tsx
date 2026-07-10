import { createFileRoute } from "@tanstack/react-router";
import { Hero } from "@/components/landing/Hero";
import { IntroPortada } from "@/components/landing/IntroPortada";
import { AboutMe } from "@/components/landing/AboutMe";
import { PhasesDetail, FAQ } from "@/components/landing/Phases";
import { ClosingSection } from "@/components/landing/ClosingSection";
import { QualificationSections } from "@/components/landing/QualificationSection";
import {
  Sistema, Resultado,
  Testimonios, Footer, WhatsAppFloat,
} from "@/components/landing/Sections";
import { CursorFollower } from "@/components/animations/CursorFollower";
import { useReducedMotionState } from "@/lib/use-reduced-motion";
import caroPortrait from "@/assets/caro-portrait.png";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Caro Chaparro · CLOSE-PREDICT™ — Sistema comercial predecible en 12 semanas" },
      { name: "description", content: "Transformo ventas que dependen del dueño en un sistema comercial predecible y escalable. Agenda tu Diagnóstico Comercial Estratégico." },
      { property: "og:title", content: "Caro Chaparro · CLOSE-PREDICT™" },
      { property: "og:description", content: "Sistema comercial delegable y predecible para infoproductores LATAM." },
    ],
  }),
  component: Landing,
});

function Landing() {
  const { reduced, ready } = useReducedMotionState();

  return (
    <main style={{ overflowX: "clip", color: "var(--color-foreground)" }}>
      {ready && !reduced && <CursorFollower />}
      {ready && !reduced && <IntroPortada />}
      {/* 2. HERO */}
      <Hero />
      {/* 4. DETALLE — tarjetas sticky de las 5 fases (id="detalle") */}
      <PhasesDetail />
      {/* 5. ENTREGABLES — CLOSE-PREDICT™ label + 14 tarjetas carousel (id="entregables") */}
      <Sistema />
      {/* 6. CALIFICACIÓN — Para quién no es / para quién sí es */}
      <QualificationSections />
      {/* 7. RESULTADO FINAL */}
      <Resultado />
      {/* 7. SOBRE MÍ */}
      <AboutMe />
      {/* 8. TESTIMONIOS */}
      <Testimonios />
      {/* 9. PREGUNTAS FRECUENTES */}
      <FAQ />
      {/* 10–12. GARANTÍA + COMUNIDAD + DIAGNÓSTICO — scroll snapping */}
      <ClosingSection />
      <Footer />
      <WhatsAppFloat />
    </main>
  );
}
