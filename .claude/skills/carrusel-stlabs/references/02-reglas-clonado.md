# 02 — REGLAS DE CLONADO — NO NEGOCIABLES
> Aplican a TODO carrusel que venga de una imagen/screenshot de referencia. Sin excepción.

Cuando Yuli sube una imagen, la tarea por defecto es **clonar** ese carrusel con identidad STLabs. Yuli manda la imagen **también por su estética**, no solo por la info que contiene.

| # | Regla |
|---|---|
| 1 | **Reemplazar** todo @handle o cuenta de Instagram del original → `sebastian.stlabs.ar` en IBM Plex Mono verde. |
| 2 | **Eliminar** el contador de slides del screenshot (2/8, 3/8…). Nunca reproducirlo. |
| 3 | **Recrear siempre** las imágenes internas de la referencia (fotos, mockups, gráficos, robots, capturas, ilustraciones). Nunca reemplazar por texto ni omitir. Si no se logra recrear **idéntico**, **recortar directamente de la imagen que Yuli adjuntó** (crop con PIL) y colocarlo en la **MISMA posición exacta** del original — nunca reubicarlo, redimensionarlo ni tapar otros elementos. |
| 4 | **Mantener el logo/imagen de Claude** exactamente igual si aparece (Claude siempre naranja). |
| 5 | **Aplicar paleta + tipografías STLabs** según el modo del mes vigente (01-identidad-stlabs.md). |
| 6 | **Variedad de fondo obligatoria** entre carruseles (04-fondos-familias.md). |
| 7 | **Jamás texto tapando texto** ni ningún elemento tapando la legibilidad — verificado geométricamente con bounding boxes (05-pipeline-tecnico.md §QA), no solo a ojo. |
| 8 | Copy en **voseo**, sin emojis, sin inglés, sin "Inteligencia Artificial". |
| 9 | **Fidelidad estética total.** Replicar al **detalle mínimo**: posiciones, tamaños, fuentes, grosores y elementos, exactamente como el original. Analizar **primero** la tipografía del título de la referencia (grosor/estilo/posición) y matchearla con una equivalente. |
| 10 | **Título siempre grande y grueso, familia diversa.** Único requisito: grande + grueso (nunca finito). No fijar una familia única — variar entre carruseles y seguir el carácter de la referencia (serif elegante en peso grueso incluido). Prohibido Barlow Condensed e IBM Plex Mono como título. |
| 11 | **Manifiesto de fuentes obligatorio.** Analizar y declarar exactamente cada tipografía usada en el carrusel con su código de carga (05-pipeline-tecnico.md §Manifiesto). |

## Procedimiento de análisis de la referencia (antes de tocar código)

1. Contar slides → la copia tiene **la misma cantidad** (nunca forzar 10).
2. Por slide: mapear layout (zonas, márgenes, alineaciones), jerarquía tipográfica, y anotar **posición y tamaño** de cada elemento.
3. Identificar la **tipografía del título**: ¿sans condensada, geométrica, serif elegante, script? ¿Qué grosor? Elegir la equivalente **grande y gruesa** que respete ese carácter.
4. Inventariar imágenes internas → decidir por cada una: recrear (CSS/SVG/foto propia) o **recortar del adjunto**.
5. Detectar @handles y contadores de slides → marcar para reemplazo/eliminación.

## Recorte desde la imagen adjunta (regla 3, mecánica exacta)

```python
from PIL import Image
ref = Image.open("/mnt/user-data/uploads/referencia.jpg")
# medir bbox del elemento en la referencia (px) y recortar
elemento = ref.crop((x1, y1, x2, y2))
elemento.save("/home/claude/buildN/assets/elemento.png")
```
Luego posicionarlo en el HTML **en la misma posición relativa** que ocupa en el original (mismo % de ancho/alto del lienzo), con `position:absolute`. Verificar con bounding boxes que no tape ningún texto ni elemento.
