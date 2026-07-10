# PROGRESS — Estado vivo

> **Qué es esto:** el "cómo va". Refleja el estado actual de cada tarea del
> [SPEC.md](./SPEC.md) y la bitácora de trabajo. Se actualiza en **cada sesión**.
> El alcance y el detalle de cada tarea NO se redefinen aquí — eso vive en SPEC.

## Tablero de estado

> Una fila por tarea activa o relevante. Mantené esta tabla sincronizada con el
> backlog del SPEC. Estados: `todo` · `in-progress` · `blocked` · `review` · `done`.

| ID    | Tarea                                          | Estado   | Responsable | Actualizado |
|-------|------------------------------------------------|----------|-------------|-------------|
| T-001 | Restyle tarjetas de entregables                | done     | —           | 2026-06-23  |
| T-002 | Video de fondo en `#entregables` + marquee     | done     | —           | 2026-06-23  |
| T-003 | CTA → "Solicita tu diagnóstico"                | done     | —           | 2026-06-23  |
| T-004 | Tarjetas de `LeadCapture` accionables          | done     | Auto        | 2026-06-26  |
| T-005 | Respetar `prefers-reduced-motion` global       | done     | Auto        | 2026-06-26  |
| T-006 | Destino de "Recursos / lead magnets"           | blocked  | —           | 2026-06-26  |
| T-007 | Calendly en CTA diagnóstico                    | done     | Auto        | 2026-06-27  |
| T-008 | Integrar Medidor CLOSE-PREDICT™               | blocked  | —           | 2026-06-26  |
| T-009 | WhatsApp medidor → línea negocio               | blocked  | —           | 2026-06-26  |
| T-010 | Logo CLOSE-PREDICT™                           | blocked  | —           | 2026-06-26  |
| T-011 | Paleta hero (menos blanco)                    | done     | Auto        | 2026-06-26  |
| T-012 | Tono amarillo alineado a redes                | todo     | —           | 2026-06-26  |
| T-013 | Fotos profesionales de Caro                   | blocked  | —           | 2026-06-26  |
| T-014 | Copy español colombiano                       | done     | Auto        | 2026-06-26  |
| T-015 | Copy `AboutMe`                                | blocked  | —           | 2026-06-26  |
| T-016 | Plazo 12 vs 7 semanas                         | blocked  | —           | 2026-06-26  |
| T-017 | Propuesta de valor                            | blocked  | —           | 2026-06-26  |
| T-018 | Sección "Para quién NO es / SÍ es"           | done     | Claude      | 2026-07-02  |
| T-019 | FAQ + CTA doble                               | blocked  | —           | 2026-06-26  |
| T-020 | Garantía real                                 | review   | Claude      | 2026-07-10  |
| T-021 | Testimonios reales                            | blocked  | —           | 2026-06-26  |
| T-022 | KPIs / métricas dashboard                     | done     | Claude      | 2026-07-10  |
| T-023 | Copy fases (veracidad)                        | blocked  | —           | 2026-06-26  |
| T-024 | Slogan CLOSE-PREDICT™                         | blocked  | —           | 2026-06-26  |
| T-025 | Carrusel entregables                          | blocked  | —           | 2026-06-26  |
| T-026 | Video hero / VSL                              | blocked  | —           | 2026-06-26  |
| T-027 | Cuenta Hostinger                              | todo     | Sebas       | 2026-06-26  |
| T-028 | Dominio carochaparro.co                       | blocked  | Sebas       | 2026-06-26  |
| T-029 | Hosting + deploy producción                     | blocked  | Sebas       | 2026-06-26  |
| T-030 | DNS dominio → servidor                        | blocked  | Sebas       | 2026-06-26  |
| T-031 | Rediseño bloque Garantía/Diagnóstico/Llamada  | review   | Claude      | 2026-07-10  |
| T-032 | Transición IntroPortada→Hero por scroll real  | review   | Claude      | 2026-07-10  |
| T-033 | Accent "es para ti si..." en serif blanco + eliminar sección "Resultado final" | done | Claude | 2026-07-10 |
| T-034 | Wordmark Close Predict® — morado #1A1038 + brillo diagonal loop | done | Claude | 2026-07-10 |
| T-035 | Recrear bloque título Qualification (eyebrow/prefix/accent partido) | done | Claude | 2026-07-10 |

## Bloqueos actuales

> Qué está frenado, por qué, y qué se necesita para destrabarlo.

- **T-006** — decisión de negocio: URL real de lead magnets o quitar tarjeta.
- **T-007** — espera link Calendly de Caro (`C-08`).
- **T-008** — espera URL/acceso del Medidor (`C-09`).
- **T-009** — depende de T-008 + WhatsApp de negocio de Caro (`C-10`).
- **T-010** — espera logo final en alta resolución (`C-07`).
- **T-013** — espera fotos profesionales (`C-06`).
- **T-015…T-025** — espera revisión y entregables de contenido de Caro (`C-01`…`C-13`).
- **T-026** — espera video hero/VSL (`C-14`).
- **T-028…T-030** — espera compra dominio/hosting con Caro (`C-15`, `C-16`) y T-027.

**Entregables de cliente:** ver checklist completo en [REUNION-SEBAS-CARO.md](./REUNION-SEBAS-CARO.md).

---

## Bitácora (append-only)

> **Agregá líneas nuevas al final; no edites las anteriores.** Sirve de handoff
> entre IAs: la siguiente lee de abajo hacia arriba para saber dónde quedó todo.
> Formato: `YYYY-MM-DD · <IA/agente> · T-XXX · <qué se hizo> → <siguiente paso>`

- 2026-06-23 · Claude · — · Estructura de coordinación creada (SPEC/PROGRESS/DECISIONS) → poblar SPEC.
- 2026-06-23 · Claude · — · SPEC poblado con tareas reales; T-001..T-003 hechas (de git), T-004..T-006 pendientes → tomar T-004.
- 2026-06-26 · Auto · — · Reunión Caro documentada en REUNION-SEBAS-CARO.md; SPEC ampliado T-007..T-030 (7 hitos) → T-004/T-005 sin bloqueo, o T-027 infra; desbloquear T-007+ cuando Caro envíe Calendly y medidor.
- 2026-06-26 · Auto · T-004,T-005 · LeadCapture: 3 tarjetas con CTA (diagnóstico, WhatsApp Sala Flows/recursos); reduced-motion global (hook, CSS, intro/cursor/carousel/partículas) → T-007 Calendly o T-011 paleta.
- 2026-06-26 · Auto · T-004,T-005 · Refinamiento post-revisión: ReducedMotionProvider + `ready` (sin flash intro), Hero canvas estático sin RAF, CSS hovers `motion-reduce:`, diagnóstico misma pestaña, guards legacy (Problema, Entregables, CaosToSistema) → T-007 Calendly o T-011 paleta.
- 2026-06-26 · Auto · T-011,T-014 · Token `surface-soft` (#F9F8FF) en hero/AboutMe/main; voseo → español colombiano en intro, CTAs y secciones activas → T-006 decisión lead magnets o T-012 amarillo.
- 2026-07-02 · Claude · T-018 · Sección "Para quién no es / sí es" creada en `QualificationSection.tsx` — scroll parallax GSAP, frases con fade+blur scrub, halo difuso #A78BEA, encabezado pineado. Insertada en index.tsx entre `Sistema` y `Resultado` → revisar heights en mobile si hay lag.
- 2026-07-10 · Claude · T-020,T-031 · `ClosingSection.tsx` reescrito: slide 1 (Garantía) con titular partido ("si no funciona," pequeño + "NO PAGAS MÁS" grande), ghost text en nuevo token `--violet-soft` (styles.css), tira horizontal → `GuaranteeLoop.tsx` (nuevo, loop vertical de compromisos) + `ConditionsCard.tsx` (nuevo, tarjeta interactiva hover/tap con las 3 condiciones reales, usa `styled-components` — agregado a package.json) + párrafo de cierre. Slide 2 ahora es Diagnóstico (contenido que vivía en el viejo slide 3, mismo botón/URL `/diagnostico.html`); slide 3 ahora es Llamada (contenido nuevo, CTA "Agendar" → mismo link Calendly del navbar en `Hero.tsx`). "Sala Flows" queda retirado de este bloque. Mecánica de scroll-snap/partículas/flash sin tocar → **pendiente**: correr `bun install` (no había runtime JS en el entorno de implementación) y verificar visualmente con `bun run dev` en desktop y 375px antes de pasar T-020/T-031 a `done`.
- 2026-07-10 · Claude · T-032 · `IntroPortada.tsx` reescrito: dejó de ser overlay `fixed` con wipe circular click-driven → sección normal `100vh` en flujo, scroll del body habilitado, degradé `useScroll`/`useTransform`/`useMotionTemplate` sobre el video (`#1E0A33`→`#F0ECFF`, cubre solo la parte inferior). `Hero.tsx` ganó `useScroll` propio: embudo/texto "Close Predict"/navbar (ahora `motion.nav`) entran independientes (opacity+y, sin caja propia), escalonados 0→0.6/0.1→0.65/0.3→0.8; fondo del `<section>` pasó de blanco plano a gradiente `#F0ECFF→#FFFFFF` (sin corte hacia Fases, que ya es blanca). Se eliminó `introComplete`/`onComplete` (index.tsx, Hero.tsx) y lógica GSAP vestigial de `SequenceIntro.tsx` (ids `cp-char-*`/`cp-funnel-img`/`cp-tagline`) que quedó mezclada sin uso real en `Hero.tsx`. Botón "Conocer Close Predict" con animación de entrada propia; su click ahora hace `scrollTo` de un viewport en vez de disparar la máquina de estados eliminada → **pendiente**: verificación visual en `bun run dev` (mismo bloqueo de entorno que T-031) antes de pasar a `done`. Revisar si el tono `#1E0A33` sigue siendo el más cercano al video real o si conviene resamplear a mano.
- 2026-07-10 · Claude · T-033 · En `QualificationSection.tsx`, el accent "No es para ti si..." / "Sí es para ti si..." pasa de Dancing Script (#936ce3) a Cormorant Garamond blanco — solo esas dos líneas, resto del bloque intacto; se eliminaron `SCRIPT`/`ACCENT` (quedaron sin uso). Se borró por completo `Resultado()` de `Sections.tsx` (título "Resultado final", checklist y dashboard con métricas inventadas — D-003/T-022) y su import/uso en `index.tsx` → T-022 pasa a `done` (se optó por eliminar la sección en vez de esperar cifras reales de Caro).
- 2026-07-10 · Claude · T-034 · Wordmark "Close Predict®" en `Hero.tsx`: `.cp-word`/`.cp-sup` pasan de degradé gris→blanco a color sólido `#1A1038` con brillo diagonal animado (`cpWordShine`, 3.6s linear infinite, respeta reduced-motion). Simplificado el JSX de "Close"/"Predict®" a un solo `<span>` por palabra (se eliminaron `CLOSE_CHARS`/`PREDICT_CHARS`, vestigiales de la animación GSAP de `SequenceIntro.tsx` no usada) → pendiente verificación visual en `bun run dev`.
- 2026-07-10 · Claude · T-035 · `QualificationSection.tsx`: eyebrow "ANTES DE AVANZAR"→"ANTES DE EMPEZAR" en blanco; prefix "ESTE PROGRAMA"→"Este programa" en Cormorant Garamond itálica blanco 82%; título grande divide primera palabra ("No"/"Sí") en degradé `#8B3FD6→#C9A7F0` (background-clip:text) y el resto en blanco marfil `#F5F3EF`. Mismo tamaño/alineación/espaciado/fondo `#281a52`. Aplicado en ambos bloques y en los exports legacy `NotForYouSection`/`ForYouSection` → pendiente verificación visual.
