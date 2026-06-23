# Caro Chaparro · CLOSE-PREDICT™

Landing page de una sola página (one-page) para la oferta de consultoría **CLOSE-PREDICT™** de Caro Chaparro: un sistema comercial predecible y delegable en 12 semanas para infoproductores de LATAM.

La página es una experiencia visual y narrativa con animaciones intensivas; el "producto" es el recorrido por las secciones, no una app genérica.

## Stack

- **TanStack Start** (React 19, SSR con Nitro) + **TanStack Router** (file-based) + **TanStack Query**
- **Tailwind CSS v4** (config CSS-first en `src/styles.css`) + **shadcn/ui** (estilo "new-york")
- **Framer Motion** para las animaciones
- **Vite 8** · **TypeScript** · gestor de paquetes **Bun**

## Requisitos

- [Bun](https://bun.sh) instalado

## Comandos

```bash
bun install          # instalar dependencias
bun run dev          # servidor de desarrollo (Vite)
bun run build        # build de producción (SSR con Nitro)
bun run build:dev    # build en modo desarrollo
bun run preview      # previsualizar el build de producción
bun run lint         # ESLint
bun run format       # Prettier --write .
```

No hay suite de tests configurada.

## Estructura

```
src/
  routes/                  Rutas file-based de TanStack (index.tsx = /, __root.tsx = shell)
  components/
    landing/               Secciones de la landing (Hero, AboutMe, Phases, Sections.tsx…)
    animations/            Primitivas animadas reutilizables
    ui/                    Componentes shadcn/ui
  lib/                     Utilidades (animations.ts, manejo de errores, cn())
  styles.css               Tokens de marca + utilidades Tailwind v4
public/                    Assets estáticos e imágenes
```

`index.tsx` compone la página en orden: `SequenceIntro` → `Hero` → `AboutMe` → `InterludeParticles` → `Phases` → `Sistema`, `Resultado`, `Garantia`, `Testimonios`, `LeadCapture`, `CtaFinal`, `Footer`, `WhatsAppFloat`.

## Marca y diseño

Los tokens de marca (colores `ink`, `violet`, `gold`…, fuentes y utilidades como `glass-card`, `btn-gold`, `aurora-bg`) se definen en `src/styles.css`. Usá los tokens en lugar de hex/clases ad-hoc.

## Lovable

Este proyecto está conectado a [Lovable](https://lovable.dev). Los commits que se hacen push a la rama conectada se sincronizan con el editor de Lovable.

- **No** reescribas historia ya publicada (force-push, rebase, amend, squash): corrompe el historial en Lovable.
- Mantené la rama en estado funcional al hacer push.

## Notas

- `vite.config.ts` usa `@lovable.dev/vite-tanstack-config`, que ya incluye los plugins necesarios — no los agregues manualmente.
- `bunfig.toml` aplica un guard de cadena de suministro (omite paquetes publicados hace menos de 24h).

Para más detalle de arquitectura, ver [CLAUDE.md](./CLAUDE.md).
