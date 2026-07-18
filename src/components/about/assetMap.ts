/* ─────────────────────────────────────────────────────────────────
   Resolución automática de assets por nombre de archivo.
   El nombre del archivo ES el id del slot (sin extensión, minúsculas).
   Colocar un archivo en public/images/about o public/video/about y
   guardar es suficiente — no hay que registrar nada.
───────────────────────────────────────────────────────────────── */

/* Vite copia /public verbatim; globamos ambas carpetas (imágenes y videos).
   Con las carpetas vacías el glob devuelve {} y todo cae a placeholder. */
const imageFiles = import.meta.glob(
  "/public/images/about/*.{webp,jpg,jpeg,png,svg,avif}",
  { eager: true, query: "?url", import: "default" },
) as Record<string, string>;

const videoFiles = import.meta.glob("/public/video/about/*.{mp4,webm}", {
  eager: true,
  query: "?url",
  import: "default",
}) as Record<string, string>;

const posterFiles = import.meta.glob("/public/video/about/*.{jpg,jpeg,png,webp}", {
  eager: true,
  query: "?url",
  import: "default",
}) as Record<string, string>;

function idFrom(path: string): string {
  return path.split("/").pop()!.replace(/\.[^.]+$/, "");
}

/* Las rutas de /public se sirven en la raíz: /public/images/about/x.webp -> /images/about/x.webp */
function publicUrl(path: string, resolved: string): string {
  // Si el bundler devuelve una URL ya lista, la usamos; si devuelve la ruta con
  // /public, la normalizamos a la ruta servida.
  if (resolved && !resolved.includes("/public/")) return resolved;
  return path.replace(/^\/public/, "");
}

export const imageMap: Record<string, string> = Object.fromEntries(
  Object.entries(imageFiles).map(([path, url]) => [idFrom(path), publicUrl(path, url)]),
);

export const videoMap: Record<string, string> = Object.fromEntries(
  Object.entries(videoFiles).map(([path, url]) => [idFrom(path), publicUrl(path, url)]),
);

export const posterMap: Record<string, string> = Object.fromEntries(
  Object.entries(posterFiles).map(([path, url]) => [idFrom(path), publicUrl(path, url)]),
);
