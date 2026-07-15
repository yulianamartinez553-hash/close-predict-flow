# 05 — PIPELINE TÉCNICO, QA Y MANIFIESTO DE FUENTES

## Estructura de build

```
/home/claude/buildN/
├── stlabs_kit.py     ← copiar de assets/ de la skill
├── generate.py       ← arma HTML + CSS con tokens de marca
├── render.py         ← Playwright screenshot por .slide
├── package.py        ← embebe fuentes base64 + PNGs + tira preview + ZIP → /mnt/user-data/outputs/
├── assets/           ← recortes de la referencia, fotos
└── png/              ← slides renderizados
```

## Setup de fuentes (una vez por chat)

```bash
python <skill>/assets/install_fonts.py
```
Instala los TTF empaquetados en:
- `/usr/share/fonts/truetype/stlabs/` (Bebas, Barlow Condensed R/M/SB/B/Black, IBM Plex Mono R/M/SB)
- `/usr/share/fonts/truetype/google-fonts/` (Poppins-Bold/ExtraBold, Lora-Italic-Variable)
- `/usr/share/fonts/truetype/ibm-plex/` (IBM Plex Mono)

Sin red. Fallback si faltara algo: GitHub `raw.githubusercontent.com/google/fonts/main/ofl/<familia>/` o `apt-get install -y fonts-ibm-plex`.

**Familias nuevas** (título diverso que lo requiera): descargar el TTF de google/fonts, guardarlo en `buildN/assets/`, sumarlo a `FONT_FACES` (o `@font-face` propio en base64) y **declararlo en el manifiesto**.

## Render (parámetros exactos)

- Lienzo **1080×1350** por slide · viewport **1180** · **`device_scale_factor=2`** → PNG retina **2160×2700**.
- **Crítico:** `page.wait_for_function("document.fonts.ready")` + `page.wait_for_timeout(4000)` antes de cada screenshot.
- Fuentes **siempre embebidas en base64** en el HTML final (nunca CDN — inaccesible en el entorno y el HTML debe ser standalone). El HTML final pesa cientos de KB: es la señal de que las fuentes están adentro.
- `text-align:left` **explícito** en todos los heroes/títulos (evita centrados fantasma).
- Usar `stlabs_kit.py`: `write_html() → render() → package()`.

## QA geométrico (obligatorio antes de empaquetar)

1. **Overlaps:** medir con **bounding boxes de Playwright** (`element.bounding_box()`) que ningún texto tape otro texto ni ningún elemento tape la legibilidad. Medición en px de overlaps/gaps — no alcanza con mirar.

```python
boxes = [(el, el.bounding_box()) for el in page.query_selector_all(".slide *")]
# comparar rects de textos vs. todo elemento con z-index superior: intersección == 0
```

2. **Seam tests:** componer los bordes de slides adyacentes (franja derecha de N + franja izquierda de N+1) y verificar que los elementos partidos (nodo-flecha, teléfono, número) se completan perfectamente al deslizar.
3. **Contact sheet:** tira de preview para revisión general (la genera `package()`).
4. **Checklist final:**
   - [ ] `sebastian.stlabs.ar` en todos los slides (IBM Plex Mono verde, bottom ~70px)
   - [ ] Sin @handles de Instagram · sin contador de slides del screenshot
   - [ ] Título grande y grueso (nunca Barlow/Plex Mono como título)
   - [ ] Verde solo 1–2 usos fuertes por slide, sin modificar el HEX
   - [ ] Cantidad de slides = la del original
   - [ ] Imágenes internas recreadas o recortadas en la misma posición
   - [ ] Logo de Claude intacto y naranja (si aparece)
   - [ ] Sin elementos cortados por los bordes · sin texto a <60px del borde
   - [ ] Fuentes embebidas (HTML standalone)
   - [ ] Voseo, sin emojis, sin inglés

## Entrega (siempre, en este orden)

1. **Tira de preview** (montage horizontal).
2. **ZIP** de los PNGs + HTML.
3. **Slides retina** individuales (2160×2700).
4. **HTML** standalone editable con fuentes embebidas.
5. **Manifiesto de fuentes** (obligatorio — abajo).
6. **Caption** en voseo con keyword-CTA, si se pide.

## §Manifiesto de fuentes (obligatorio en cada entrega)

Tabla con **cada** tipografía usada en el carrusel, para que Yuli pueda pedirle a alguien que las cargue:

| Fuente | Peso / estilo | Rol | Origen | Código / comando de carga |
|---|---|---|---|---|
| Bebas Neue | 400 | título portada | GitHub google/fonts (`ofl/bebasneue/BebasNeue-Regular.ttf`) | `@font-face{font-family:'Bebas Neue';src:url(data:font/ttf;base64,...) format('truetype');}` |
| Playfair Display *(ejemplo de familia nueva)* | 800 | título serif | GitHub google/fonts (`ofl/playfairdisplay/`) | `curl -LO https://raw.githubusercontent.com/google/fonts/main/ofl/playfairdisplay/PlayfairDisplay%5Bwght%5D.ttf` + `@font-face` en base64 |
| IBM Plex Mono | 400 | footer/labels | `apt-get install -y fonts-ibm-plex` → `/usr/share/fonts/truetype/ibm-plex/` | ruta local + `@font-face` |

Incluir por fila: **nombre exacto** · peso/estilo · rol (título/cuerpo/label/footer) · de dónde se obtiene (GitHub / Google Fonts / apt / archivo local) · el **fragmento de código de carga** real usado (`@font-face` con ruta o base64, o comando de instalación). Si el carrusel usa una familia fuera del stack base, el manifiesto es lo que permite instalarla y embeberla.

## Troubleshooting

| Problema | Causa | Solución |
|---|---|---|
| Texto se ve "fake bold" | El peso no existe en el TTF cargado | Descargar el peso real (Bold/ExtraBold/Black) y declarar su `@font-face` |
| Fuentes distintas en HTML vs PNG | No se embebieron / no cargaron | Verificar `@font-face` base64 + `document.fonts.ready` |
| Texto cortado en bordes | Sin safe zone | Padding ≥60px del borde para texto crítico |
| Imagen pixelada | Falta retina | `device_scale_factor=2` en Playwright |
| Nodo-flecha no coincide entre slides | Posiciones distintas | Mismo `top` y transform en `.br-r`/`.br-l`; seam test |
| Recorte de referencia tapa un texto | Posicionamiento a ojo | Reposicionar según la referencia y validar con bounding boxes |
| CDN de fuentes no carga | Entorno sin acceso | Nunca CDN: siempre TTF local + base64 |
