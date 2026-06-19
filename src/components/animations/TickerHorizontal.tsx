import { motion } from "framer-motion";

interface TickerHorizontalProps {
  items: string[];
  speed?: number;
}

export function TickerHorizontal({ items, speed = 30 }: TickerHorizontalProps) {
  const doubled = [...items, ...items];
  const duration = (items.length * 200) / speed;

  return (
    <div
      className="overflow-hidden"
      style={{ maskImage: "linear-gradient(90deg, transparent, #000 10%, #000 90%, transparent)" }}
    >
      <motion.div
        className="flex gap-8 whitespace-nowrap py-3"
        animate={{ x: ["0%", "-50%"] }}
        transition={{ duration, repeat: Infinity, ease: "linear" }}
      >
        {doubled.map((item, i) => (
          <div key={i} className="flex flex-shrink-0 items-center gap-6">
            <span className="display text-[11px] font-medium uppercase tracking-[0.22em] text-muted-foreground">
              {item}
            </span>
            <span
              className="h-1 w-1 flex-shrink-0 rounded-full"
              style={{ background: "var(--violet)" }}
            />
          </div>
        ))}
      </motion.div>
    </div>
  );
}
