# SPEC — Fuente de verdad

> **Qué es esto:** el "qué" y el "por qué". Define alcance y la pila completa de
> tareas. Es la fuente de verdad: si algo no está aquí, no es parte del trabajo.
> Cambia poco. El avance NO se registra aquí — eso vive en [PROGRESS.md](./PROGRESS.md).

## Cómo trabajan las IAs con estos archivos

- **3 archivos, 3 preguntas:** `SPEC` = qué/por qué · `PROGRESS` = cómo va ·
  `DECISIONS` = por qué se decidió.
- **IDs estables:** cada tarea tiene un ID (`T-001`) que **nunca se reusa ni se renumera**.
  Se referencia ese ID desde PROGRESS y DECISIONS.
- **Una tarea, un dueño a la vez.** Antes de empezar `T-XXX`, marcá tu nombre/agente
  como responsable en PROGRESS y ponela `in-progress`.
- **Marcar `[x]` aquí solo cuando la tarea cumple su _Criterio de done_.**
- **No edites el trabajo de otra IA en PROGRESS:** agregá una línea nueva en la bitácora.
- **Estados válidos:** `todo` · `in-progress` · `blocked` · `review` · `done`.

---

## Objetivo

Landing page one-page (español, LATAM) para la oferta de consultoría **CLOSE-PREDICT™**
de Caro Chaparro: convertir ventas que dependen del dueño en un sistema comercial
predecible y delegable en 12 semanas. La página es una experiencia visual/narrativa
animada cuyo fin es que el visitante **solicite su Diagnóstico Comercial Estratégico**.

## Alcance

**Incluye:**
- Las secciones de la landing en `src/components/landing/` (Hero, AboutMe, Phases,
  y las secciones de `Sections.tsx`: Sistema, Resultado, Garantía, Testimonios,
  LeadCapture, CtaFinal, Footer, WhatsAppFloat).
- Animaciones (Framer Motion) y el sistema de tokens de marca en `src/styles.css`.
- Conversión: CTAs hacia el diagnóstico.

**No incluye (out of scope):**
- Backend / base de datos / autenticación.
- Multi-idioma (el sitio es solo español).
- Rutas adicionales más allá de `/` (las páginas en `public/*.html` son estáticas).

---

## Backlog de tareas

> `[ ]` pendiente · `[x]` done. Formato:
> `- [ ] **T-XXX** — Título · _prioridad_ · depende de: TYYY` + _Done cuando_.

### Hito 0 — Hecho recientemente (referencia)

- [x] **T-001** — Restyle de tarjetas de entregables: gradientes rotativos + línea diagonal neón.
- [x] **T-002** — Video full-bleed de fondo en sección `#entregables` + marquee más rápido (`duration: 25`).
- [x] **T-003** — Texto del CTA cambiado a "Solicita tu diagnóstico".

### Hito 1 — Conversión y accesibilidad (pendiente)

- [ ] **T-004** — Hacer accionables las 3 tarjetas de `LeadCapture` · _alta_ · depende de: —
  - **Contexto:** hoy son `<motion.div>` sin enlace (`Sections.tsx:919`).
  - **Done cuando:** cada tarjeta (Diagnóstico / Comunidad "Sala Flows" / Recursos)
    lleva a su destino real con un CTA visible y verificable en el navegador.
- [ ] **T-005** — Respetar `prefers-reduced-motion` en todo el sitio · _media_ · depende de: —
  - **Contexto:** solo `Hero.tsx` lo respeta; el resto anima siempre.
  - **Done cuando:** con reduce-motion activo, las animaciones intensas (partículas,
    marquees, aurora, intro) se desactivan o atenúan en todas las secciones.
- [ ] **T-006** — Definir destino de "Recursos / lead magnets" · _baja_ · depende de: T-004
  - **Done cuando:** existe una URL/recurso real al que apunta la tarjeta, o se decide
    quitarla (registrar la decisión en DECISIONS).

> ➕ Nuevas tareas: agregalas aquí con el siguiente ID libre y reflejalas en PROGRESS.
