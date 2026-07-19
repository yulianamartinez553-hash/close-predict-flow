import { createFileRoute } from "@tanstack/react-router";
import { AboutPage } from "@/components/about/AboutPage";

export const Route = createFileRoute("/sobre-mi")({
  head: () => ({
    meta: [
      { title: "Sobre mí · Caro Chaparro — CLOSE-PREDICT™" },
      {
        name: "description",
        content:
          "La historia de Caro Chaparro: de observar cómo crecen las empresas a construir CLOSE-PREDICT™, el sistema comercial que crece sin depender de una sola persona.",
      },
      { property: "og:title", content: "Sobre mí · Caro Chaparro" },
      {
        property: "og:description",
        content: "Estratega comercial y creadora de CLOSE-PREDICT™.",
      },
    ],
  }),
  component: AboutPage,
});
