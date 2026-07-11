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
- [x] **T-011** — Ajustar paleta del hero / secciones iniciales · _media_ · depende de: —
  - **Contexto:** Caro pidió menos blanco al inicio; probar fondo morado o gris (`src/styles.css`, `Hero.tsx`).
  - **Done cuando:** variante revisada en navegador sin romper contraste ni legibilidad.
- [ ] **T-012** — Alinear tono de amarillo (`gold`) a publicaciones de Caro · _media_ · depende de: —
  - **Done cuando:** token `gold` / `gold-soft` coincide visualmente con el amarillo de sus redes (validar con Caro/Yuli).
- [ ] **T-013** — Incorporar fotos profesionales de Caro · _alta_ · depende de: C-06
  - **Contexto:** mínimo 2–3 outfits; hero, `AboutMe`, posible galería en medidor.
  - **Done cuando:** fotos reales reemplazan placeholders en las secciones acordadas.

### Hito 4 — Copy e idioma

- [x] **T-014** — Pasar copy a español colombiano (ajustes conocidos) · _media_ · depende de: —
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
  - **Nota (2026-07-10):** el slide "Garantía" de `ClosingSection.tsx` ya no tiene copy
    placeholder (ver T-031: titular partido, loop de compromisos, tarjeta de condiciones,
    párrafo de cierre). Queda en `review` — falta confirmación explícita de Caro vía C-03
    antes de marcar `[x]`.
- [ ] **T-021** — Testimonios reales (video + escritos) · _media_ · depende de: C-11, C-12
  - **Done cuando:** al menos 2 testimonios reales integrados; genéricos removidos o relegados.
- [x] **T-022** — Dashboard de métricas con KPIs reales o simplificado · _media_ · depende de: C-02
  - **Contexto:** quitar datos inventados (158k, 205k, ticket 4,9%) hasta tener caps reales (D-003).
  - **Done cuando:** solo métricas aprobadas por Caro, o UI demo sin cifras falsas.
  - **Resuelto (2026-07-10):** Yuli pidió eliminar directamente la sección "Resultado final"
    (`Resultado()` en `Sections.tsx`, con el dashboard de métricas inventadas) en vez de
    esperar cifras reales de Caro. Sección borrada por completo de la landing.
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

### Nuevas tareas

- [x] **T-031** — Rediseño del bloque final Garantía → Diagnóstico → Llamada (`ClosingSection.tsx`) · _alta_ · depende de: —
  - **Contexto:** slide 1 (Garantía) recibe titular partido ("si no funciona," pequeño/minúscula +
    "NO PAGAS MÁS" grande), ghost text en `--violet-soft`, tira horizontal reemplazada por
    `GuaranteeLoop` (loop vertical de compromisos) + `ConditionsCard` (tarjeta interactiva con las
    3 condiciones reales) + párrafo de cierre. Slide 2 pasa a ser Diagnóstico (contenido que antes
    vivía en el slide 3, mismo botón "Diagnóstico Comercial" → `/diagnostico.html`). Slide 3 pasa a
    ser Llamada, contenido nuevo con CTA "Agendar" → Calendly (misma URL que el botón del navbar en
    `Hero.tsx`). Reemplaza el contenido de la extinta sección "Sala Flows".
  - **Done cuando:** los 3 slides mantienen scroll-snap fullscreen y el sistema de
    partículas/flash existente intacto; solo tokens de marca (`--violet`, `--violet-soft`,
    `--gold`, `--ink`, `--ink-deep`); tipografías Montserrat/Poppins sin cambios;
    `styled-components` agregado como dependencia (`ConditionsCard.tsx`); responsive verificado a
    375px. — **Hecho 2026-07-10; pendiente que Yuli corra `bun install` (sin runtime JS disponible
    en el entorno donde se implementó) y verifique visualmente en `bun run dev`.**

- [x] **T-032** — Transición IntroPortada → Hero ligada a scroll real (reemplaza wipe circular) · _alta_ · depende de: —
  - **Contexto:** `IntroPortada.tsx` dejó de ser overlay `fixed` con máquina de estados
    click-driven (círculo creciendo/achicándose + bloque `#6C39B3` con fondo propio).
    Ahora es una sección normal de `100vh` en el flujo del documento; el body ya no
    bloquea el scroll. Encima del video hay una capa de degradé (`useScroll` +
    `useTransform` + `useMotionTemplate`) que arranca en `#1E0A33` (tono oscuro del
    video) y aclara hacia `#F0ECFF` a medida que esa pantalla scrollea fuera de vista,
    cubriendo solo la parte inferior del video. `Hero.tsx` ganó su propio
    `useScroll({target: sectionRef, offset:["start end","start start"]})`: embudo,
    texto "Close Predict" y navbar (ahora `motion.nav`) entran de forma independiente
    con `opacity`+`y`, escalonados (0→0.6 / 0.1→0.65 / 0.3→0.8), sin caja/fondo propio.
    El fondo del `<section>` del Hero pasa de blanco plano a
    `linear-gradient(180deg, #F0ECFF 0%, #FFFFFF 600px)` para que no haya corte con el
    degradé del video ni con la sección Fases (blanca). Se eliminó el prop
    `introComplete`/`onComplete` (y la lógica GSAP vestigial de `SequenceIntro.tsx`
    —ids `cp-char-*`, `cp-funnel-img`, `cp-tagline`— que había quedado mezclada en
    `Hero.tsx` sin uso real, ya que el proyecto usa `IntroPortada`, no `SequenceIntro`).
    El botón "Conocer Close Predict" suma su propia animación de entrada
    (`opacity`+`y`) y, en vez de disparar el wipe, hace `scrollTo` de un viewport para
    llevar al visitante al Hero (conserva la intención de "ir a la siguiente sección").
  - **Done cuando:** scroll real dispara la entrada escalonada de embudo/texto/navbar
    sin fondo propio; degradé continuo sin línea de corte entre video → Hero → Fases;
    navbar visible en todo el sitio salvo la preportada; tipografías sin cambios.
    — **Hecho 2026-07-10; pendiente verificación visual en `bun run dev`** (mismo
    entorno sin runtime JS que T-031, ver nota ahí).

- [x] **T-033** — Accent "es para ti si..." en Cormorant Garamond blanco + eliminar sección "Resultado final" · _media_ · depende de: —
  - **Contexto:** en `QualificationSection.tsx`, el texto grande "No es para ti si..." /
    "Sí es para ti si..." pasa de Dancing Script violeta a Cormorant Garamond blanco
    (solo esas dos líneas; eyebrow, prefijo y lista de frases sin cambios). Se elimina
    por completo `Resultado()` de `Sections.tsx` (título "Resultado final", checklist y
    el dashboard con métricas inventadas — la misma sección que D-003/T-022 marcaban
    como pendiente de reemplazo) junto a su import/uso en `index.tsx`.
  - **Done cuando:** las dos líneas accent se ven en serif blanco sin tocar el resto del
    bloque; la sección "Resultado final" ya no existe en la landing ni en el código.
    — **Hecho 2026-07-10.**

- [x] **T-034** — Wordmark "Close Predict®" del Hero: morado sólido + brillo diagonal en loop · _media_ · depende de: —
  - **Contexto:** `.cp-word`/`.cp-sup` en `Hero.tsx` pasan del degradé gris→blanco a color
    sólido `#1A1038` con un barrido diagonal blanco animado (`background-position` +
    gradiente 115deg, `cpWordShine` 3.6s linear infinite) simulando brillo/lujo dentro
    de las letras. Se simplificó el JSX de "Close"/"Predict®": ya no se parte letra por
    letra (`CLOSE_CHARS`/`PREDICT_CHARS` eliminados) — era vestigial de la animación GSAP
    de `SequenceIntro.tsx`, no utilizada. Respeta `prefers-reduced-motion` (animación
    desactivada, posición estática).
  - **Done cuando:** el wordmark se ve morado `#1A1038` con el brillo diagonal en loop
    constante. — **Hecho 2026-07-10.**

- [x] **T-035** — Recrear bloque de título (izq/der) de `QualificationSection.tsx` · _media_ · depende de: —
  - **Contexto:** eyebrow pasa de "ANTES DE AVANZAR" violeta a "ANTES DE EMPEZAR" blanco
    (mismo sans-serif, mismo tracking). Debajo, "ESTE PROGRAMA" (Poppins uppercase) pasa
    a "Este programa" en Cormorant Garamond itálica, blanco 82% opacidad — nuevo nivel
    de jerarquía "serif editorial". El título grande ("No es para ti si..." / "Sí es para
    ti si...") ahora divide la primera palabra ("No"/"Sí") con degradé violeta→lila
    (`#8B3FD6`→`#C9A7F0`, background-clip:text) y el resto en blanco marfil `#F5F3EF`.
    Tamaño, alineación, espaciados y fondo `#281a52` original sin cambios. Aplicado a
    ambos bloques (`NOT_FOR_YOU` y `FOR_YOU`) y a los exports de compatibilidad
    `NotForYouSection`/`ForYouSection`.
  - **Done cuando:** ambos bloques reflejan la jerarquía descrita. — **Hecho 2026-07-10.**

- [x] **T-036** — Fix layout slide Garantía: overflow, caja del loop, reorden y tarjeta lateral · _alta_ · depende de: T-031
  - **Contexto:** el slide 1 de `ClosingSection.tsx` desbordaba 100vh (la tarjeta apilada
    debajo del loop + `margin-top:300px` empujaban el título fuera de vista). Fixes:
    (1) `GuaranteeLoop` pierde la caja/fondo propio (`.gl-card`), ahora recibe `bg` por
    prop para que el mask del loop siga matcheando el fondo real de la diapositiva;
    (2) orden dentro de la columna centrada: badge → titleLead → título → subtítulo →
    body → loop (sin caja) → párrafo de cierre, igual que Diagnóstico/Llamada;
    (3) `ConditionsCard` sale del flujo central y pasa a `.garantia-card-slot`
    (absolute, izquierda, `top:62%` — a la altura del body, no del título) en desktop;
    en mobile (`max-width:860px`) esa versión se oculta y aparece una segunda instancia
    en flujo normal debajo del párrafo de cierre (`.garantia-card-slot-mobile`).
  - **Done cuando:** el slide entra completo en 100vh sin recorte; el loop no tiene
    recuadro; la tarjeta queda a la izquierda a la altura del body en desktop.
    — **Hecho 2026-07-10.**

- [ ] **T-037** — Fondo compartido (degradé `#1A1038`→`#A78BEA`) en secciones 4-8 · _media_ · depende de: —
  - **Contexto:** nuevo token `--gradient-section: linear-gradient(145deg, #1A1038 0%, #A78BEA 100%)`
    en `styles.css`. Aplicado como `background` en: `PhasesDetail` (Phases.tsx, era
    transparent), `Sistema` (Sections.tsx, era `#281a52` sólido), `QualificationSections`
    (era `#281a52` sólido — el color plano `BG` para las máscaras del video-bridge pasa
    a `#1A1038`, y el wrapper usa el nuevo token vía `BG_GRADIENT`), `AboutMe` (era
    transparent) y `Testimonios` (Sections.tsx, era transparent). Las 5 secciones
    quedan visualmente uniformes en vez de mezclar sólido/transparent/tonos distintos.
  - **Done cuando:** las 5 secciones muestran el mismo degradé. — **Hecho 2026-07-10.**
  - **Corrección (2026-07-10):** Yuli pidió específicamente manchas difusas de blur
    (varios tamaños, sin línea que divida colores), no un lineal de dos puntos. Se
    reemplazó `--gradient-section` por 5 `radial-gradient` de `#A78BEA` (tamaños y
    opacidades distintas vía `color-mix`, todas con `transparent` como stop final)
    sobre base sólida `#1A1038` — mismo enfoque que `--gradient-aurora` ya existente.
    Como las 5 secciones referencian el token, no hizo falta tocar los componentes.
  - **Revertida (2026-07-10):** Yuli pidió deshacer por completo esta tarea — volver
    al fondo de las 5 secciones tal como estaba antes de T-037 (`PhasesDetail`/
    `AboutMe`/`Testimonios` en `transparent`, `Sistema`/`QualificationSections` en
    `#281a52` sólido), manteniendo intactos los cambios de fondo del Hero/IntroPortada
    (T-032/T-038, de la misma tanda de pedidos) que **no** se tocan. Token
    `--gradient-section` eliminado de `styles.css`. Queda `[ ]` — no implementada.

- [x] **T-038** — Continuidad de scroll IntroPortada → Hero (capa pineada) · _alta_ · depende de: T-032
  - **Contexto:** Yuli reportó que la capa de degradé se veía "movida" y tapaba el logo
    al hacer scroll, y pidió que esa misma capa se convierta en el fondo del Hero para
    que el scroll se sienta continuo, no "por partes". `IntroPortada.tsx` pasa de
    sección normal `100vh` a wrapper `180vh` con un marco interno
    `position: sticky; top:0; height:100vh` (mismo patrón que `CaosToSistema.tsx`).
    Con `useScroll(offset:["start start","end end"])` sobre ese wrapper el color de la
    capa (no su forma) va de `#1E0A33` a `#F0ECFF` — el mismo tono con el que arranca
    el fondo del Hero. **Corrección post-review:** la primera versión animaba también
    el porcentaje de cobertura (crecía de "solo el borde inferior" a "todo el marco"),
    pero Yuli lo vio como "un cuadrado que se va haciendo grande" y pidió que la capa
    esté **ya presente en el fondo desde el inicio, sin animar su forma** — se revirtió
    esa parte: la capa tapa siempre la misma porción inferior del video (stops fijos
    40%/78%), solo el color transiciona. El texto/botón de la primera pantalla se
    desvanece (`opacity`+`y`) antes de que la capa llegue a su tono final. El botón
    "Conocer Close Predict" hace scroll hasta el final real del wrapper
    (`rootRef.offsetHeight`), no solo un viewport.
  - **Done cuando:** al scrollear, la capa (con forma fija, ya presente) solo cambia de
    color hasta empalmar con el fondo del Hero; sin tapar el logo.
    — **Hecho 2026-07-10; timing (alto del pin) es una primera
    aproximación — necesita ajuste fino visual en `bun run dev`.**

> ➕ Nuevas tareas: agregalas aquí con el siguiente ID libre (`T-039`+) y reflejalas en PROGRESS.
