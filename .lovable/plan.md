## Cambios en `src/components/landing/Sections.tsx` → `Entregables`

**1. Fondo de video full-bleed en la sección de "14 entregables + 2 bonos"**

Dentro del `<section id="entregables">` (actualmente `bg-ink-deep`), agregar como primer hijo:

```tsx
<video
  autoPlay
  loop
  muted
  playsInline
  className="pointer-events-none absolute inset-0 h-full w-full object-cover"
  src="https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260328_105406_16f4600d-7a92-4292-b96e-b19156c7830a.mp4"
/>
<div className="pointer-events-none absolute inset-0 bg-ink-deep/70" />
```

- La sección mantiene `bg-ink-deep` (morado) como fallback mientras carga el video.
- Overlay morado semi-transparente (`bg-ink-deep/70`) para garantizar contraste del texto blanco y los cards sobre el video.
- Envolver el contenido existente (título, párrafo, marquee) en un wrapper `relative z-10` para asegurar que quede por encima del video.
- Las partículas existentes se mantienen pero pasan también a `z-10` sobre el video (o se reducen si compiten visualmente — mantenerlas por ahora).

**2. Marquee más rápido**

En el `motion.div` del carrusel (línea 448), cambiar:
```tsx
transition={{ duration: 60, repeat: Infinity, ease: "linear" }}
```
a:
```tsx
transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
```
Eso hace que los recuadros pasen ~2.4× más rápido manteniendo el loop infinito suave.

## Lo que NO se toca

- No se crea un nuevo Hero ni componente `ShinyText` — el usuario aclaró que el fondo va en la sección de entregables, no como hero nuevo.
- No se modifica el resto de secciones (Hero actual, Problema, Sistema, etc.).
- No se cambia el contenido textual ni el diseño de las tarjetas (`DeliverableCard`).

## Detalles técnicos

- El `<video>` queda fuera del contenedor `max-w-7xl` para cubrir todo el ancho de la sección.
- `pointer-events-none` evita que el video intercepte clicks/hover de las tarjetas.
- `object-cover` + `inset-0 h-full w-full` lo escala correctamente.
- `playsInline` (camelCase en JSX) es requerido para autoplay en iOS Safari.
