# 04 — VARIEDAD DE FONDOS Y FAMILIAS VISUALES
> Regla crítica: PROHIBIDO que todos los carruseles se vean iguales.

## Variedad de fondos (obligatoria)

**Prohibido:** todos los carruseles con la misma fórmula (fondo plano + título grande a la izquierda + texto chico).
**Obligatorio:** cada carrusel usa una **textura y composición distintas** al carrusel anterior.

### Catálogo de texturas (CSS puro)

Todas en tonos negro mineral (modo negro) o su versión clara equivalente (modo blanco):

| Textura | Técnica |
|---|---|
| Piedra/roca | SVG `feTurbulence` baseFrequency ~0.65 + `feColorMatrix` desaturado + overlay `rgba(7,7,7,.88)` |
| Papel corrugado | ver 03-mecanicas.md §4 |
| Concreto industrial | SVG `feTurbulence` baseFrequency ~0.9 tipo `fractalNoise` + overlay muy oscuro |
| Retícula fina | `linear-gradient(rgba(255,255,255,.016) 1px, transparent 1px)` + 90deg · size 60px |
| Lino/tela | `repeating-linear-gradient` cruzado en 0deg y 90deg · opacidad baja |
| Roca volcánica | SVG noise alta frecuencia + alto contraste + filter oscuro + glow verde sutil en esquina |
| Gradiente profundo | `radial-gradient` desde foco verde muy tenue en una esquina, resto negro puro |

- La textura va en `::before`/`::after` del `.slide` con `mix-blend-mode:overlay`.
- El fondo base es negro mineral `#0A0A0A` (modo negro) o blanco (modo blanco, textura atenuada).
- **La composición también rota:** centrada, asimétrica, dividida, full-foto.

## Familias visuales (rotar entre carruseles)

1. **Manifiesto** — display enorme + dato/badge
2. **Blueprint** — proceso en grid / pasos numerados
3. **Operator log** — flujo paso a paso con microprueba
4. **Dossier editorial** — foto full + texto monumental
5. **Before/After** — dos columnas, riesgo/seguro
6. **Dashboard mínimo** — donas, barras, métricas
7. **Guía editorial** — corchetes, número gigante de paso, barra de progreso

> Al clonar, la **estructura del original manda** la composición; la textura de fondo y la familia visual aportan la variedad respecto de los carruseles anteriores de la marca.
