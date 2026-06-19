import { useEffect, useState } from "react";

export function CursorFollower() {
  const [pos, setPos] = useState({ x: -100, y: -100 });
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const isTouchDevice = window.matchMedia("(pointer: coarse)").matches;
    if (isTouchDevice) return;

    const onMove = (e: MouseEvent) => {
      setPos({ x: e.clientX, y: e.clientY });
      setVisible(true);
    };
    const onLeave = () => setVisible(false);

    window.addEventListener("mousemove", onMove);
    document.addEventListener("mouseleave", onLeave);
    return () => {
      window.removeEventListener("mousemove", onMove);
      document.removeEventListener("mouseleave", onLeave);
    };
  }, []);

  return (
    <div
      className="pointer-events-none fixed z-[9999] rounded-full transition-opacity duration-300"
      style={{
        left: pos.x,
        top: pos.y,
        width: 3,
        height: 3,
        transform: "translate(-50%, -50%)",
        opacity: visible ? 1 : 0,
        background: "#8B3FD6",
      }}
    />
  );
}
