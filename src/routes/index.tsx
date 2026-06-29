import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { Hero } from "@/components/landing/Hero";
import { SequenceIntro } from "@/components/landing/SequenceIntro";
import { AboutMe } from "@/components/landing/AboutMe";
import { PhasesDetail, PhasesSimpleList } from "@/components/landing/Phases";
import { ClosingSection } from "@/components/landing/ClosingSection";
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
  const [introComplete, setIntroComplete] = useState(false);

  const showIntro = ready && !reduced && !introComplete;

  return (
    <main className="bg-surface-soft text-foreground" style={{ overflowX: "clip" }}>
      {ready && !reduced && <CursorFollower />}
      {showIntro && (
        <SequenceIntro onComplete={() => setIntroComplete(true)} />
      )}
      {/* 2. HERO */}
      <Hero introComplete={introComplete} />
      {/* 4. DETALLE — tarjetas sticky de las 5 fases (id="detalle") */}
      <PhasesDetail />
      {/* 5. ENTREGABLES — CLOSE-PREDICT™ label + 14 tarjetas carousel (id="entregables") */}
      <Sistema />
      {/* 6. RESULTADO FINAL */}
      <Resultado />
      {/* 7. SOBRE MÍ */}
      <AboutMe />
      {/* 8. TESTIMONIOS */}
      <Testimonios />
      {/* 9. FASES — lista simple acordeón */}
      <PhasesSimpleList />
      {/* 10–12. GARANTÍA + COMUNIDAD + DIAGNÓSTICO — scroll snapping */}
      <ClosingSection />
      <Footer />
      <WhatsAppFloat />
    </main>
  );
}
