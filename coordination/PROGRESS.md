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
| T-020 | Garantía real                                 | blocked  | —           | 2026-06-26  |
| T-021 | Testimonios reales                            | blocked  | —           | 2026-06-26  |
| T-022 | KPIs / métricas dashboard                     | blocked  | —           | 2026-06-26  |
| T-023 | Copy fases (veracidad)                        | blocked  | —           | 2026-06-26  |
| T-024 | Slogan CLOSE-PREDICT™                         | blocked  | —           | 2026-06-26  |
| T-025 | Carrusel entregables                          | blocked  | —           | 2026-06-26  |
| T-026 | Video hero / VSL                              | blocked  | —           | 2026-06-26  |
| T-027 | Cuenta Hostinger                              | todo     | Sebas       | 2026-06-26  |
| T-028 | Dominio carochaparro.co                       | blocked  | Sebas       | 2026-06-26  |
| T-029 | Hosting + deploy producción                     | blocked  | Sebas       | 2026-06-26  |
| T-030 | DNS dominio → servidor                        | blocked  | Sebas       | 2026-06-26  |

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
