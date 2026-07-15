# 03 — MECÁNICAS VISUALES REUTILIZABLES (parámetros exactos)
> Todas implementadas también en `assets/stlabs_kit.py` (componentes `bridge`, `phone`, `donut`, clases `.paper`, `.ph-bg`).

## (1) Nodo-flecha partido por la costura — continuidad del carrusel
*El elemento que casi siempre pide Yuli: media flecha en un slide, la otra mitad en el siguiente, se completa al deslizar.*

- Círculo verde diámetro **156px**, borde `2px solid var(--verde)`, `→` en Poppins 800 **74px**, `top:597px`.
- Slide N, borde derecho: `.br-r { left:1002px }` (1080 − 78 = mitad visible).
- Slide N+1, borde izquierdo: `.br-l { left:-78px }`.
- El nodo es **idéntico** en ambos lados → al deslizar se completa.
- Portada: solo `right`. Último slide: solo `left`. Intermedios: `both`.

```css
.brnode{position:absolute;top:597px;width:156px;height:156px;border-radius:50%;z-index:8;
 background:radial-gradient(circle at 50% 45%,#151515,#0b0b0b);border:2px solid var(--verde);
 box-shadow:0 0 30px rgba(0,255,178,.3), inset 0 0 22px rgba(0,0,0,.6);
 display:flex;align-items:center;justify-content:center;}
.brnode span{font-family:var(--pop);font-weight:800;font-size:74px;color:var(--verde);line-height:1;}
.br-r{left:1002px;} .br-l{left:-78px;}
```

**Regla general del mecanismo partido** (vale para cualquier objeto: número, teléfono, foto): centrar el objeto en la costura, ambos slides con `overflow:hidden`, misma posición y transform en ambos lados. Verificar con seam test.

## (2) iPhone realista en CSS puro (sin imágenes externas)

- Marco titanio: `linear-gradient(125deg, #4a4e54 0%, #1b1d20 15%, #0b0c0e 38%, #101113 52%, #1b1d20 78%, #52565c 100%)`.
- Dynamic island con cámara, brillo diagonal `.ip-reflect`, botones laterales.
- Tilt: `transform: perspective(2500px) rotateX(5deg) rotateY(-16deg) rotateZ(-7deg)`.
- Partido por costura: contenedor width 600 centrado → `.pb-right { left:780px }` / `.pb-left { left:-300px }`.
- Código completo en `stlabs_kit.py` (`phone()`, `PHONE_UI_CSS`).

## (3) Donas de porcentaje

- `background: conic-gradient(from 0deg, var(--verde) 0 X%, #2c2c2c X% 100%)` + hueco interno (`<i>`) del color de la card.
- Verde = IA, gris = humanos. Arrancan desde las 12.
- Helper: `donut(year, rank, ia)` en `stlabs_kit.py`.

## (4) Textura papel corrugado

```css
.paper::after{content:'';position:absolute;inset:0;z-index:1;pointer-events:none;opacity:.8;mix-blend-mode:overlay;
 background:repeating-linear-gradient(90deg,
   rgba(255,255,255,.11) 0px, rgba(255,255,255,.11) 1.5px,
   rgba(255,255,255,0) 3px, rgba(255,255,255,0) 10px,
   rgba(0,0,0,.5) 12px, rgba(0,0,0,.5) 13.5px, rgba(255,255,255,0) 15px);}
.paper.sutil::after{opacity:.45;}
```
`opacity .8` = notoria · `~.45` = sutil. Ranuras verticales.

## (5) Foto real integrada al negro

- `object-fit: cover` + `filter: brightness(.5–.6) contrast(1.05) saturate(.6–.85)`.
- Scrim gradiente vertical encima + glow verde sutil en esquina.
- Título sobre el scrim inferior. Opcionales: puntitos verdes en esquinas y/o marco de corchetes `[ ]`.
- Foto real de Sebastián/familia > cualquier render de IA.
- Clases `.ph-bg` / `.ph-scrim` en `stlabs_kit.py`.

## (6) Gradiente interno en la letra
*Activar cuando Yuli diga "con degradé en las letras", "gradiente en el título", "como el follow" o use `@degradé`.*

```css
.grad-1 { background:linear-gradient(180deg,#B0FFE8 0%,#00FFB2 42%,#007A52 100%); -webkit-background-clip:text; -webkit-text-fill-color:transparent; background-clip:text; }
.grad-2 { background:linear-gradient(180deg,#FFFFFF 0%,#E0FFF6 22%,#00FFB2 62%,#009E6E 100%); -webkit-background-clip:text; -webkit-text-fill-color:transparent; background-clip:text; }
.grad-3 { background:linear-gradient(135deg,#D0FFF3 0%,#00FFB2 50%,#005C3E 100%); -webkit-background-clip:text; -webkit-text-fill-color:transparent; background-clip:text; }
.grad-4 { background:linear-gradient(0deg,#B0FFE8 0%,#00FFB2 40%,#FFFFFF 100%); -webkit-background-clip:text; -webkit-text-fill-color:transparent; background-clip:text; }
```

- V1 = mint claro → verde oscuro (más cercano al "follow" de referencia).
- V2 = blanco → verde (máximo contraste).
- V3 = diagonal izq-der. V4 = luz desde abajo.
- **Solo en títulos display grandes** (grande y grueso, ej. Bebas ≥180px o Poppins 800 ≥130px, o la display equivalente del carrusel). **Nunca en texto chico.**
