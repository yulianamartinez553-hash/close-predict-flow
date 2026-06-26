import { createContext, useContext, useEffect, useState, type ReactNode } from "react";

const QUERY = "(prefers-reduced-motion: reduce)";

type ReducedMotionContextValue = {
  reduced: boolean;
  ready: boolean;
};

const ReducedMotionContext = createContext<ReducedMotionContextValue>({
  reduced: false,
  ready: false,
});

export function ReducedMotionProvider({ children }: { children: ReactNode }) {
  const [reduced, setReduced] = useState(false);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia(QUERY);
    setReduced(mq.matches);
    setReady(true);
    const onChange = (e: MediaQueryListEvent) => setReduced(e.matches);
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);

  return (
    <ReducedMotionContext.Provider value={{ reduced, ready }}>
      {children}
    </ReducedMotionContext.Provider>
  );
}

export function useReducedMotion(): boolean {
  return useContext(ReducedMotionContext).reduced;
}

export function useReducedMotionState(): ReducedMotionContextValue {
  return useContext(ReducedMotionContext);
}
