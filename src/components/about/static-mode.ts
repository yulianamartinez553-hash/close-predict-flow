import { useState } from "react";

/* Modo de revisión: con ?static=1 las animaciones de entrada se saltan y todo
   se renderiza en su estado final visible. Útil para revisar la composición
   completa y colocar imágenes sin esperar animaciones de scroll.

   Se lee de forma síncrona en el cliente (lazy initializer) para que el flag
   ya esté disponible en el primer render y `initial={false}` aplique al montar.
   En SSR devuelve false; con ?static=1 puede haber un aviso de hidratación —
   es intencional y solo ocurre en este modo de depuración. */
export function useStaticReveal(): boolean {
  const [on] = useState(
    () => typeof window !== "undefined" && new URLSearchParams(window.location.search).has("static"),
  );
  return on;
}
