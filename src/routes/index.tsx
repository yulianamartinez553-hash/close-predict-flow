import { createFileRoute } from "@tanstack/react-router";
import { Hero } from "@/components/landing/Hero";
import { AboutMe } from "@/components/landing/AboutMe";
import { CaosToSistema } from "@/components/landing/CaosToSistema";
import {
  Problema, Narrative, Sistema, Entregables, Resultado, Garantia,
  Testimonios, LeadCapture, CtaFinal, Footer, WhatsAppFloat,
} from "@/components/landing/Sections";
import caroPortrait from "@/assets/caro-portrait.png";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Caro Chaparro · CLOSE-PREDICT™ — Sistema comercial predecible en 12 semanas" },
      { name: "description", content: "Transformo ventas que dependen del dueño en un sistema comercial predecible y escalable. Agendá tu Diagnóstico Comercial Estratégico." },
      { property: "og:title", content: "Caro Chaparro · CLOSE-PREDICT™" },
      { property: "og:description", content: "Sistema comercial delegable y predecible para infoproductores LATAM." },
    ],
  }),
  component: Landing,
});

function Landing() {
  return (
    <main className="overflow-x-hidden bg-white text-foreground">
      <Hero />
      <AboutMe />
      <Problema />
      <CaosToSistema />
      <Narrative />
      <Sistema />
      <Entregables />
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
