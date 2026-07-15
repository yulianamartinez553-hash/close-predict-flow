# 01 — IDENTIDAD BLOQUEADA STLABS
> Nunca preguntar por la marca. Estos valores están fijos.

Marca: **Sebastián García** — RevOps · CRM · IA. Firma: **sebastian.stlabs.ar**.

## Paleta

| Token | HEX | Uso |
|---|---|---|
| Verde neón | `#00FFB2` | Acento principal. **Nunca** se modifica, mezcla ni degrada a otros verdes. 1–2 usos fuertes por slide. |
| Negro mineral | `#0A0A0A` | Fondo base en modo negro. |
| Grafito | `#141414` / `#1E1E1E` | Cards, cajas. |
| Blanco cálido | `#F2F2F2` | Texto principal sobre negro. |
| Gris | `#9aa39c` | Texto secundario. |
| Rojo | `#FF5247` | **SOLO** datos de riesgo/peligro. Nunca decorativo. |
| Ámbar | `#FF9D3C` | **SOLO** énfasis negativo puntual. |

Regla de contraste: el verde `#00FFB2` **nunca** se usa como texto de cuerpo sobre blanco (contraste insuficiente).

## Tipografías (stack base — todas base64-embebidas, nunca CDN)

| Familia | Peso | Rol |
|---|---|---|
| Bebas Neue | 400 | Display, portada, números gigantes |
| Poppins | 700 / 800 | Titulares de paso, flecha → del nodo |
| Barlow Condensed | 400–700 | Cuerpo, bullets, claims — **jamás título** |
| IBM Plex Mono | 400–600 | Labels, PASO, footer, URL — **jamás título** |
| Lora *itálica* | 400–700 | Palabras-acento editoriales, siempre en verde |

Archivos TTF empaquetados en `assets/fonts/`; instalar con `assets/install_fonts.py`.

### REGLA DE TÍTULOS — característica, no familia fija

- La **única** exigencia del título: **grande y grueso** (nunca finito).
- **No fijar una tipografía única.** Ser **muy diversa**: la familia del título **varía entre carruseles** y puede **seguir el carácter de la referencia** — incluida una **serif elegante** usada en su peso **grueso y grande**.
- Al clonar: reconocer la tipografía del título de la referencia y usar una equivalente grande y gruesa. Nunca forzar todo a una única fuente recta ni reducir un título a una fuente delgada.
- **Prohibido** Barlow Condensed e IBM Plex Mono como título.
- Las familias del stack base son un **punto de partida disponible**, no una imposición. Familias nuevas: descargar de GitHub google/fonts (`https://raw.githubusercontent.com/google/fonts/main/ofl/<familia>/<Archivo>.ttf`), embeber en base64, declarar en el manifiesto.

## Voz

Español argentino, **voseo**: Empezá, Elegí, Dejá, Hacé, Creá, Conectá, Comentá, Deslizá, Querés, Escogé.
**Sin emojis. Sin inglés. Sin "Inteligencia Artificial".** Mayúsculas en display. Copy corto y punchy.

## Firma (obligatoria en cada slide)

`sebastian.stlabs.ar` · IBM Plex Mono · verde · centrado · `bottom ~70px`.
**Nunca** un @handle de Instagram (ni propio ni de terceros).

## Modos de fondo según mes vigente

El fondo rota por mes. La skill **asume** el modo vigente sin preguntar; **Yuli avisa cuando cambia** (`@mesnegro` / `@mesblanco`). Estado actual declarado en SKILL.md (`FONDO_MES_VIGENTE`).

### Modo NEGRO
- Fondo base: negro mineral `#0A0A0A` + textura física (ver 04-fondos-familias.md).
- Texto principal `#F2F2F2`, secundario `#9aa39c`.
- Verde: acento + títulos display + palabra-clave.

### Modo BLANCO (actual)
- Fondo base: blanco (`#FFFFFF` / `#F2F2F2`).
- Texto principal: **grafito/negro** (`#0A0A0A` / `#141414`). Nunca verde en cuerpo pequeño.
- Verde `#00FFB2`: **solo acento de alto contraste** → subrayados, bordes, kickers/labels, barra de progreso, footer y títulos display grandes. Nunca texto de cuerpo.
- Textura física atenuada o versión clara equivalente, manteniendo variedad entre piezas.

> Implementación: toda la lógica de tokens vive en CSS variables — cambiar el modo reconfigura fondo + colores de texto sin tocar la estructura de los slides.
