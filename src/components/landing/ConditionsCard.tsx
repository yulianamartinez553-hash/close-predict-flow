import { useState } from "react";
import styled from "styled-components";

/* Tarjeta de condiciones — adaptada de Uiverse (glass hover card) a copy y tokens de marca */
const StyledWrapper = styled.div`
  .card {
    width: 220px;
    max-width: calc(100vw - 4rem);
    min-height: 90px;
    padding: 1rem;
    background: color-mix(in oklab, var(--ink) 55%, transparent);
    border-radius: 12px;
    backdrop-filter: blur(6px);
    border-bottom: 3px solid color-mix(in oklab, var(--violet-soft) 40%, transparent);
    border-left: 2px color-mix(in oklab, var(--violet-soft) 50%, transparent) outset;
    box-shadow: -30px 40px 30px rgba(0, 0, 0, 0.28);
    transform: skewX(8deg);
    transition: 0.4s ease;
    overflow: hidden;
    color: #ffffff;
    cursor: pointer;
  }
  .card:hover,
  .card:focus-within,
  .card.is-expanded {
    min-height: 260px;
    width: 320px;
    transform: skew(0deg);
  }
  .card h1 {
    font-family: var(--font-display);
    text-align: center;
    margin: 0.5rem 0 0.8rem;
    font-size: 15px;
    letter-spacing: 0.18em;
    text-transform: uppercase;
    color: #D0B95A;
    text-shadow: -6px 4px 8px rgba(0, 0, 0, 0.5);
  }
  .content {
    opacity: 0;
    transition: opacity 0.3s ease 0.15s;
  }
  .card:hover .content,
  .card:focus-within .content,
  .card.is-expanded .content {
    opacity: 1;
  }
  .content .lead {
    font-family: var(--font-sans);
    font-weight: 500;
    font-size: 13.5px;
    margin-bottom: 8px;
  }
  .content ul {
    font-family: var(--font-sans);
    font-weight: 300;
    font-size: 12.5px;
    padding-left: 16px;
    line-height: 1.5;
    margin: 0;
  }
  .content li + li {
    margin-top: 4px;
  }
`;

export function ConditionsCard() {
  const [expanded, setExpanded] = useState(false);

  return (
    <StyledWrapper>
      <div
        className={`card${expanded ? " is-expanded" : ""}`}
        role="button"
        tabIndex={0}
        aria-expanded={expanded}
        aria-label="Condiciones de la garantía"
        onClick={() => setExpanded((v) => !v)}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            setExpanded((v) => !v);
          }
        }}
      >
        <h1>Condiciones</h1>
        <div className="content">
          <p className="lead">Que hayas hecho tu parte.</p>
          <ul>
            <li>Asististe a las 12 sesiones</li>
            <li>Compartiste la información que se te pidió en cada fase</li>
            <li>Ejecutaste los avances y tareas del camino</li>
          </ul>
        </div>
      </div>
    </StyledWrapper>
  );
}
