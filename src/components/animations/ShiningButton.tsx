import { motion } from "framer-motion";

interface ShiningButtonProps {
  text: string;
  href?: string;
  target?: string;
  rel?: string;
  onClick?: () => void;
  size?: "sm" | "md" | "lg";
  variant?: "gold" | "violet";
  className?: string;
}

export function ShiningButton({
  text,
  href,
  target,
  rel,
  onClick,
  size = "md",
  variant = "gold",
  className = "",
}: ShiningButtonProps) {
  const sizes = {
    sm: "px-6 py-2 text-xs",
    md: "px-8 py-3 text-sm",
    lg: "px-12 py-4 text-base",
  };

  /* Brillo diagonal que barre de izquierda a derecha */
  const shine = (
    <motion.span
      aria-hidden
      style={{
        position: "absolute",
        top: "-60%",
        width: "45%",
        height: "220%",
        background: variant === "gold"
          ? "linear-gradient(105deg, transparent 35%, rgba(255,248,200,0.75) 50%, rgba(255,255,255,0.55) 55%, transparent 65%)"
          : "linear-gradient(105deg, transparent 35%, rgba(255,255,255,0.45) 50%, rgba(255,255,255,0.25) 55%, transparent 65%)",
        transform: "skewX(-22deg)",
        pointerEvents: "none",
      }}
      animate={{ left: ["-45%", "135%"] }}
      transition={{ duration: 2.2, repeat: Infinity, repeatDelay: 2.4, ease: "easeInOut" }}
    />
  );

  const base = `${variant === "gold" ? "btn-gold" : "btn-violet"} relative overflow-hidden inline-flex items-center justify-center rounded-full font-semibold uppercase tracking-wider transition-transform hover:scale-[1.04] active:scale-[0.97] ${sizes[size]} ${className}`;

  if (href) {
    return (
      <a href={href} target={target} rel={rel} className={base}>
        {shine}
        <span className="relative z-10">{text}</span>
      </a>
    );
  }

  return (
    <button onClick={onClick} className={base}>
      {shine}
      <span className="relative z-10">{text}</span>
    </button>
  );
}
