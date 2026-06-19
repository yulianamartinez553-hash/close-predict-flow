import { useEffect, useRef, useState } from "react";
import { useInView } from "framer-motion";

interface MetricCounterProps {
  value: number;
  label: string;
  suffix?: string;
}

export function MetricCounter({ value, label, suffix = "+" }: MetricCounterProps) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.5 });
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!inView) return;
    let frame: number;
    const start = performance.now();
    const duration = 2000;
    const tick = (now: number) => {
      const progress = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setCount(Math.round(eased * value));
      if (progress < 1) frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [inView, value]);

  return (
    <div ref={ref} className="text-center">
      <p className="font-black text-5xl md:text-6xl" style={{ color: "var(--violet)" }}>
        {count}{suffix}
      </p>
      <p className="display mt-1 text-[10px] uppercase tracking-[0.25em] text-muted-foreground">
        {label}
      </p>
    </div>
  );
}
