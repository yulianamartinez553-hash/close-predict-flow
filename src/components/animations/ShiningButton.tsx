import { motion } from "framer-motion";

interface ShiningButtonProps {
  text: string;
  href?: string;
  onClick?: () => void;
  size?: "sm" | "md" | "lg";
  variant?: "violet" | "gold";
  className?: string;
}

export function ShiningButton({
  text,
  href,
  onClick,
  size = "md",
  variant = "violet",
  className = "",
}: ShiningButtonProps) {
  const sizes = {
    sm: "px-6 py-2 text-xs",
    md: "px-8 py-3 text-sm",
    lg: "px-12 py-4 text-base",
  };

  const inner = (
    <>
      <motion.span
        className="pointer-events-none absolute inset-0 bg-gradient-to-r from-transparent via-white/25 to-transparent"
        animate={{ x: ["-100%", "100%"] }}
        transition={{ duration: 3, repeat: Infinity, repeatDelay: 1.5, ease: "linear" }}
      />
      <span className="relative z-10">{text}</span>
    </>
  );

  const base = `${variant === "gold" ? "btn-gold" : "btn-violet"} relative overflow-hidden inline-flex items-center justify-center rounded-full font-semibold uppercase tracking-wider transition-transform hover:scale-[1.04] active:scale-[0.97] ${sizes[size]} ${className}`;

  if (href) {
    return (
      <a href={href} className={base}>
        {inner}
      </a>
    );
  }

  return (
    <button onClick={onClick} className={base}>
      {inner}
    </button>
  );
}
