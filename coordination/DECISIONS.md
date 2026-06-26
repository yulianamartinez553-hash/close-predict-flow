# DECISIONS — Registro de decisiones (append-only)

> **Qué es esto:** el "por qué". Cada decisión de diseño/arquitectura/alcance que
> deba sobrevivir entre sesiones. Evita que la próxima IA vuelva a debatir algo ya
> resuelto. **Append-only:** no borres decisiones; si una cambia, agregá una nueva
> que la reemplace (`Reemplaza a: D-00X`).

## Plantilla

```
## D-001 — <título corto de la decisión>
- **Fecha:** YYYY-MM-DD
- **Decidió:** <IA/agente o persona>
- **Tareas relacionadas:** T-XXX, T-YYY
- **Contexto:** <qué problema o disyuntiva había>
- **Decisión:** <qué se eligió>
- **Alternativas descartadas:** <opción B y por qué no>
- **Consecuencias:** <qué implica / qué cuidar a futuro>
- **Estado:** vigente | reemplazada por D-00Z
```

---

## D-001 — Estructura de coordinación con 3 archivos
- **Fecha:** 2026-06-23
- **Decidió:** Claude
- **Tareas relacionadas:** —
- **Contexto:** Se necesita un esquema markdown para que varias IAs trabajen en equipo sin pisarse.
- **Decisión:** Separar en `SPEC.md` (qué/por qué), `PROGRESS.md` (cómo va) y `DECISIONS.md` (por qué se decidió), con IDs estables `T-XXX` y bitácora append-only.
- **Alternativas descartadas:** Un solo `TASKS.md` (mezcla alcance con avance y genera conflictos de merge entre agentes).
- **Consecuencias:** Cada IA debe respetar los IDs y el modo append-only de la bitácora.
- **Estado:** vigente

## D-002 — Dominio principal carochaparro.co
- **Fecha:** 2026-06-26
- **Decidió:** Caro + Sebas (reunión presentación)
- **Tareas relacionadas:** T-028, T-030
- **Contexto:** `carochaparro.com` no disponible; varias extensiones evaluadas en Hostinger.
- **Decisión:** Dominio principal `carochaparro.co` (~USD 27/año). Opcional reservar `.us` más adelante para pauta US.
- **Alternativas descartadas:** `.online` (menos marca), múltiples dominios activos en paralelo (Sebas recomienda usar uno).
- **Consecuencias:** Compra guiada con Caro; DNS en Hostinger cuando esté el hosting.
- **Estado:** vigente

## D-003 — No mostrar métricas inventadas en el dashboard
- **Fecha:** 2026-06-26
- **Decidió:** Caro + Sebas (reunión presentación)
- **Tareas relacionadas:** T-022
- **Contexto:** La sección de métricas muestra cifras de ejemplo (158k, 205k, ticket 4,9%) que no son reales.
- **Decisión:** Sustituir por KPIs/caps que Caro apruebe, o simplificar la UI sin cifras falsas hasta tener datos reales.
- **Alternativas descartadas:** Mantener números genéricos "de marketing".
- **Consecuencias:** T-022 bloqueada hasta `C-02` (lista de KPIs de Caro).
- **Estado:** vigente

## D-004 — Logo y marca en la web
- **Fecha:** 2026-06-26
- **Decidió:** Caro + Sebas (reunión presentación)
- **Tareas relacionadas:** T-010
- **Contexto:** Caro compartió borradores de logo Caro Chaparro y Close Predict.
- **Decisión:** Usar logo **CLOSE-PREDICT™** en la landing; ignorar borrador "Caro Chaparro" por ahora.
- **Alternativas descartadas:** Logo dual Caro Chaparro + Close Predict en header.
- **Consecuencias:** Esperar archivo final/ampliado (`C-07`) antes de cerrar T-010.
- **Estado:** vigente

## D-005 — Calendly reemplaza captura de mail en Agendar
- **Fecha:** 2026-06-26
- **Decidió:** Caro + Sebas (reunión presentación)
- **Tareas relacionadas:** T-004, T-007
- **Contexto:** El CTA "Agendar" hoy pide email; Caro ya usa Calendly.
- **Decisión:** Conectar el botón de diagnóstico al link de Calendly de Caro.
- **Alternativas descartadas:** Formulario propio de captura de mail en la landing.
- **Consecuencias:** T-007 bloqueada hasta `C-08`.
- **Estado:** vigente

## D-006 — Lead magnets vía WhatsApp (interim)
- **Fecha:** 2026-06-26
- **Decidió:** Sebas (implementación T-004)
- **Tareas relacionadas:** T-004, T-006
- **Contexto:** La tarjeta "Recursos / lead magnets" en LeadCapture no tenía URL dedicada; el mockup `hero-funnel.html` usa WhatsApp.
- **Decisión:** Apuntar temporalmente a `https://wa.me/573229172709` con CTA "Descargar" hasta que Caro defina recurso/URL real (T-006).
- **Alternativas descartadas:** Dejar tarjeta sin enlace; inventar URL placeholder.
- **Consecuencias:** T-006 sigue pendiente para reemplazar por lead magnet real.
- **Estado:** vigente
