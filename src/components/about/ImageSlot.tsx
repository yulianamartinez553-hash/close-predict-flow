import { useEffect, useState } from "react";
import { imageMap, videoMap, posterMap } from "./assetMap";

/* Muestra la etiqueta con el id cuando la URL trae ?slots=1 */
function useSlotsDebug(): boolean {
  const [on, setOn] = useState(false);
  useEffect(() => {
    if (typeof window === "undefined") return;
    setOn(new URLSearchParams(window.location.search).has("slots"));
  }, []);
  return on;
}

type Ratio = string; // "4/5", "3/4", "1/1", "3/2", "libre"

interface ImageSlotProps {
  id: string;
  ratio?: Ratio;
  /** "video" renderiza un loop MP4/WebM con póster en vez de imagen */
  kind?: "image" | "video";
  /** desactiva loading=lazy (solo el retrato del hero) */
  priority?: boolean;
  className?: string;
  style?: React.CSSProperties;
  alt?: string;
}

function aspectStyle(ratio?: Ratio): React.CSSProperties {
  if (!ratio || ratio === "libre") return {};
  return { aspectRatio: ratio.replace("/", " / ") };
}

export function ImageSlot({
  id,
  ratio = "3/4",
  kind = "image",
  priority = false,
  className = "",
  style,
  alt = "",
}: ImageSlotProps) {
  const debug = useSlotsDebug();
  const src = kind === "video" ? videoMap[id] : imageMap[id];
  const poster = kind === "video" ? posterMap[id] : undefined;

  return (
    <div className={`about-slot ${className}`} style={{ ...aspectStyle(ratio), ...style }}>
      {debug && <span className="about-slot-tag">{id}</span>}

      {src ? (
        kind === "video" ? (
          <video
            src={src}
            poster={poster}
            autoPlay
            muted
            loop
            playsInline
            preload="metadata"
            aria-hidden
          />
        ) : (
          <img
            src={src}
            alt={alt}
            loading={priority ? "eager" : "lazy"}
            decoding="async"
            draggable={false}
          />
        )
      ) : (
        <div className="about-slot-ph" aria-hidden>
          <span>{id}</span>
        </div>
      )}
    </div>
  );
}
