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
