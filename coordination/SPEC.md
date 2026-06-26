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
- CRM, automatización ManyChat/WhatsApp API, embudo Evergreen completo (reunión futura).

**Entregables de cliente (bloquean tareas):** ver [REUNION-SEBAS-CARO.md](./REUNION-SEBAS-CARO.md) (`C-01`…`C-16`).

---

## Plan de trabajo (post-reunión Caro)

Orden sugerido de ejecución. Cada hito agrupa tareas relacionadas; dentro del hito,
respetar dependencias (`depende de:`).

| Hito | Nombre | Objetivo | Tareas |
|------|--------|----------|--------|
| 0 | Referencia | Mejoras ya hechas | T-001…T-003 |
| 1 | Conversión base | CTAs y accesibilidad sin esperar a Caro | T-004, T-005, T-006 |
| 2 | Integraciones | Calendly + Medidor CLOSE-PREDICT™ | T-007…T-009 |
| 3 | Marca y diseño | Logo, paleta, fotos, tokens | T-010…T-013 |
| 4 | Copy e idioma | Español colombiano y textos corregibles ya | T-014…T-016 |
| 5 | Contenido de negocio | Secciones con copy real de Caro | T-017…T-025 |
| 6 | Media | Video hero / VSL | T-026 |
| 7 | Despliegue | Dominio, hosting, DNS | T-027…T-030 |

**Siguiente tarea recomendada (sin bloqueos):** T-004 o T-005.  
**Con material de Caro (Calendly + medidor):** encadenar T-007 → T-008 → T-009.

---

## Backlog de tareas

> `[ ]` pendiente · `[x]` done. Formato:
> `- [ ] **T-XXX** — Título · _prioridad_ · depende de: TYYY` + _Done cuando_.

### Hito 0 — Hecho recientemente (referencia)

- [x] **T-001** — Restyle de tarjetas de entregables: gradientes rotativos + línea diagonal neón.
- [x] **T-002** — Video full-bleed de fondo en sección `#entregables` + marquee más rápido (`duration: 25`).
- [x] **T-003** — Texto del CTA cambiado a "Solicita tu diagnóstico".

### Hito 1 — Conversión y accesibilidad (pendiente)

- [x] **T-004** — Hacer accionables las 3 tarjetas de `LeadCapture` · _alta_ · depende de: —
  - **Contexto:** hoy son `<motion.div>` sin enlace (`Sections.tsx:919`).
  - **Done cuando:** cada tarjeta (Diagnóstico / Comunidad "Sala Flows" / Recursos)
    lleva a su destino real con un CTA visible y verificable en el navegador.
- [x] **T-005** — Respetar `prefers-reduced-motion` en todo el sitio · _media_ · depende de: —
  - **Contexto:** solo `Hero.tsx` lo respeta; el resto anima siempre.
  - **Done cuando:** con reduce-motion activo, las animaciones intensas (partículas,
    marquees, aurora, intro) se desactivan o atenúan en todas las secciones.
- [ ] **T-006** — Definir destino de "Recursos / lead magnets" · _baja_ · depende de: T-004
  - **Done cuando:** existe una URL/recurso real al que apunta la tarjeta, o se decide
    quitarla (registrar la decisión en DECISIONS).

### Hito 2 — Integraciones de conversión (reunión Caro)

- [ ] **T-007** — Conectar Calendly al CTA "Agendar" / diagnóstico · _alta_ · depende de: C-08
  - **Contexto:** hoy el botón pide mail; Caro usa Calendly (`Sections.tsx` / `LeadCapture`).
  - **Done cuando:** el CTA principal de diagnóstico abre el link de Calendly de Caro en nueva pestaña o embed verificado.
- [ ] **T-008** — Integrar Medidor CLOSE-PREDICT™ en la landing · _alta_ · depende de: C-09
  - **Contexto:** Caro tiene un formulario diagnóstico hecho con Claude; referencia en `public/diagnostico.html`.
  - **Done cuando:** el visitante puede completar el medidor desde la web (embed, ruta o enlace integrado en el funnel).
- [ ] **T-009** — WhatsApp del medidor → línea de negocio · _alta_ · depende de: T-008, C-10
  - **Done cuando:** el CTA final del medidor abre el WhatsApp de Close Predict (no el personal de Caro).

### Hito 3 — Marca y diseño visual

- [ ] **T-010** — Integrar logo CLOSE-PREDICT™ · _alta_ · depende de: C-07
  - **Contexto:** usar logo de Close Predict; ignorar borrador "Caro Chaparro" (D-002).
  - **Done cuando:** logo visible en header/footer o hero según diseño acordado con Yuli.
- [ ] **T-011** — Ajustar paleta del hero / secciones iniciales · _media_ · depende de: —
  - **Contexto:** Caro pidió menos blanco al inicio; probar fondo morado o gris (`src/styles.css`, `Hero.tsx`).
  - **Done cuando:** variante revisada en navegador sin romper contraste ni legibilidad.
- [ ] **T-012** — Alinear tono de amarillo (`gold`) a publicaciones de Caro · _media_ · depende de: —
  - **Done cuando:** token `gold` / `gold-soft` coincide visualmente con el amarillo de sus redes (validar con Caro/Yuli).
- [ ] **T-013** — Incorporar fotos profesionales de Caro · _alta_ · depende de: C-06
  - **Contexto:** mínimo 2–3 outfits; hero, `AboutMe`, posible galería en medidor.
  - **Done cuando:** fotos reales reemplazan placeholders en las secciones acordadas.

### Hito 4 — Copy e idioma

- [ ] **T-014** — Pasar copy a español colombiano (ajustes conocidos) · _media_ · depende de: —
  - **Contexto:** ej. hero "No necesitas trabajar más" (sin lápiz), "tienes" vs "tenés" según tono acordado.
  - **Done cuando:** textos acordados en reunión corregidos en `Hero`, `Sections.tsx` y CTAs.
- [ ] **T-015** — Revisar copy de `AboutMe` · _media_ · depende de: C-01
  - **Contexto:** Caro anotó cambios (ej. "carné propia"); certificaciones ya listadas.
  - **Done cuando:** sección refleja el texto aprobado por Caro.
- [ ] **T-016** — Confirmar plazo del programa en copy (12 vs 7 semanas) · _baja_ · depende de: C-01
  - **Done cuando:** un solo plazo consistente en hero, fases y CTAs (registrar en DECISIONS si cambia).

### Hito 5 — Contenido de negocio (espera material de Caro)

- [ ] **T-017** — Actualizar propuesta de valor / promesa · _alta_ · depende de: C-01, C-02
  - **Done cuando:** hero y secciones clave comunican la promesa real que Caro validó.
- [ ] **T-018** — Nueva sección "Para quién NO es" · _alta_ · depende de: C-04
  - **Done cuando:** bloque de calificación visible en la landing con la lista de Caro.
- [ ] **T-019** — Sección FAQ (objeciones) con CTA arriba y abajo · _alta_ · depende de: C-05
  - **Done cuando:** preguntas frecuentes renderizadas + dos CTAs de diagnóstico verificables.
- [ ] **T-020** — Garantía con texto real · _media_ · depende de: C-03
  - **Done cuando:** `Garantia` muestra el copy aprobado (no placeholder genérico).
- [ ] **T-021** — Testimonios reales (video + escritos) · _media_ · depende de: C-11, C-12
  - **Done cuando:** al menos 2 testimonios reales integrados; genéricos removidos o relegados.
- [ ] **T-022** — Dashboard de métricas con KPIs reales o simplificado · _media_ · depende de: C-02
  - **Contexto:** quitar datos inventados (158k, 205k, ticket 4,9%) hasta tener caps reales (D-003).
  - **Done cuando:** solo métricas aprobadas por Caro, o UI demo sin cifras falsas.
- [ ] **T-023** — Revisar copy de fases (Q&A) · _media_ · depende de: C-01
  - **Done cuando:** texto de `Phases` es veraz (marketing sí, pero sin afirmaciones falsas).
- [ ] **T-024** — Reemplazar slogan heredado (Sales Summit / Close Break) · _media_ · depende de: C-13
  - **Done cuando:** slogan CLOSE-PREDICT™ consistente en toda la página.
- [ ] **T-025** — Configurar carrusel de entregables por fase · _baja_ · depende de: C-01
  - **Done cuando:** íconos, textos y comportamiento por entregable alineados al programa real.

### Hito 6 — Media

- [ ] **T-026** — Video hero / VSL al inicio · _baja_ · depende de: C-14
  - **Done cuando:** video de Caro embebido en hero o sección acordada, responsive y con fallback.

### Hito 7 — Despliegue e infraestructura

- [ ] **T-027** — Cuenta Hostinger + credenciales para Caro · _alta_ · depende de: —
  - **Done cuando:** cuenta creada y accesos compartidos de forma segura.
- [ ] **T-028** — Compra y configuración de dominio `carochaparro.co` · _alta_ · depende de: T-027, C-15
  - **Done cuando:** dominio activo en Hostinger (D-002).
- [ ] **T-029** — Contratar hosting y desplegar build · _alta_ · depende de: T-028, C-16
  - **Done cuando:** `bun run build` servido en producción en Hostinger.
- [ ] **T-030** — DNS: apuntar dominio al servidor · _alta_ · depende de: T-029
  - **Done cuando:** `carochaparro.co` resuelve a la landing en producción.

> ➕ Nuevas tareas: agregalas aquí con el siguiente ID libre (`T-031`+) y reflejalas en PROGRESS.
