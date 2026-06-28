import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { Hero } from "@/components/landing/Hero";
import { SequenceIntro } from "@/components/landing/SequenceIntro";
import { AboutMe } from "@/components/landing/AboutMe";
import { Phases } from "@/components/landing/Phases";
import { InterludeParticles } from "@/components/landing/InterludeParticles";
import {
  Sistema, Resultado, Garantia,
  Testimonios, LeadCapture, CtaFinal, Footer, WhatsAppFloat,
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
      <Hero introComplete={introComplete} />
      <AboutMe />
      <InterludeParticles />
      <Phases />
      <Sistema />
      <Resultado />
      <Garantia />
      <Testimonios />
      <LeadCapture />
      <CtaFinal portrait={caroPortrait} />
      <Footer />
      <WhatsAppFloat />
    </main>
  );
}
