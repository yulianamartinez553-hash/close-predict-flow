/* Loop vertical de compromisos — adaptado de Uiverse.io by kennyotsu a los tokens de marca.
   Sin caja/fondo propio: el mask del loop necesita el color de fondo real detrás
   (por defecto el violeta de la diapositiva de garantía) para que el fundido sea invisible. */
interface GuaranteeLoopProps {
  bg?: string;
}

export function GuaranteeLoop({ bg = "#55108C" }: GuaranteeLoopProps) {
  return (
    <div>
      <style>{`
        .gl-loader {
          color: #FFFFFF;
          font-family: var(--font-display);
          font-weight: 600;
          font-size: clamp(15px, 1.8vw, 22px);
          text-transform: uppercase;
          letter-spacing: 0.04em;
          box-sizing: content-box;
          height: 40px;
          display: flex;
          align-items: center;
        }
        .gl-words {
          overflow: hidden;
          position: relative;
          height: 100%;
        }
        .gl-words::after {
          content: "";
          position: absolute;
          inset: 0;
          background: linear-gradient(
            var(--gl-bg) 10%,
            transparent 30%,
            transparent 70%,
            var(--gl-bg) 90%
          );
          z-index: 20;
        }
        .gl-word {
          display: block;
          height: 100%;
          padding-left: 6px;
          color: var(--violet);
          animation: glSpin 4s infinite;
        }
        @keyframes glSpin {
          10% { transform: translateY(-102%); }
          25% { transform: translateY(-100%); }
          35% { transform: translateY(-202%); }
          50% { transform: translateY(-200%); }
          60% { transform: translateY(-302%); }
          75% { transform: translateY(-300%); }
          85% { transform: translateY(-402%); }
          100% { transform: translateY(-400%); }
        }
        @media (prefers-reduced-motion: reduce) {
          .gl-word { animation: none; }
        }
      `}</style>
      <div
        className="gl-loader"
        style={{ "--gl-bg": bg } as React.CSSProperties}
        aria-label="Sin letra pequeña. Sin excusas. Sin depende."
      >
        <span style={{ color: "#FFFFFF" }}>Sin&nbsp;</span>
        <div className="gl-words" aria-hidden>
          <span className="gl-word">letra pequeña.</span>
          <span className="gl-word">excusas.</span>
          <span className="gl-word">«depende».</span>
          <span className="gl-word">letra pequeña.</span>
        </div>
      </div>
    </div>
  );
}
