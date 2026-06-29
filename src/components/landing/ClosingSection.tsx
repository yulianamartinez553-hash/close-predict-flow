import { useState, useRef, useEffect, useCallback, type RefObject } from "react";
import { ShieldCheck, Stethoscope, Users, Download, ChevronDown } from "lucide-react";

/* ─────────────────────────────────────────────────────────────────
   TIPOS
───────────────────────────────────────────────────────────────── */
type CardItem = {
  icon: "stethoscope" | "users" | "download";
  title: string;
  desc: string;
  cta: string;
  href: string;
};

type SlideData = {
  id: string;
  bg: string;
  textColor: string;
  accentColor: string;
  ghostText: string;
  badge: string;
  title: string;
  body: string;
  visual?: "shield" | "arrow";
  cards?: CardItem[];
  cta: null | { label: string; href: string };
};

/* ─────────────────────────────────────────────────────────────────
   DATOS DE LOS 3 SLIDES
───────────────────────────────────────────────────────────────── */
const SLIDES: SlideData[] = [
  {
    id: "garantia",
    bg: "#dee2e6",
    textColor: "#1A0533",
    accentColor: "#7B5EA7",
    ghostText: "GARANTÍA",
    badge: "Nuestro compromiso",
    title: "Tu resultado es\nnuestra responsabilidad.",
    body: "Si al terminar el programa tu sistema de ventas todavía no está funcionando como debe, seguimos trabajando contigo hasta dejarlo 100% listo.",
    visual: "shield",
    cta: null,
  },
  {
    id: "sala-flows",
    bg: "#5d2e8c",
    textColor: "#FFFFFF",
    accentColor: "#F5C842",
    ghostText: "COMUNIDAD",
    badge: "Sala Flows · Gratis",
    title: "¿Todavía no estás\nlisto/a para el sistema completo?",
    body: "Tres formas de empezar a organizar tus ventas desde hoy, sin compromiso.",
    cards: [
      {
        icon: "stethoscope",
        title: "Diagnóstico gratuito",
        desc: "Responde unas preguntas y te digo exactamente en qué parte de tu proceso se están perdiendo tus ventas.",
        cta: "Empezar diagnóstico",
        href: "/diagnostico.html",
      },
      {
        icon: "users",
        title: 'Comunidad gratuita "Sala Flows"',
        desc: "Cada 15 días te comparto contenido práctico sobre ventas y marketing que puedes aplicar de una.",
        cta: "Unirme",
        href: "https://wa.me/573229172709",
      },
      {
        icon: "download",
        title: "Herramientas y recursos",
        desc: "Guías y herramientas prácticas para que empieces a organizar tus ventas desde ya.",
        cta: "Descargar",
        href: "https://wa.me/573229172709",
      },
    ],
    cta: null,
  },
  {
    id: "diagnostico",
    bg: "#541388",
    textColor: "#FFFFFF",
    accentColor: "#F5C842",
    ghostText: "DIAGNÓSTICO",
    badge: "Tu próximo paso",
    title: "¿Listo/a para tener un sistema\nde ventas que trabaje por ti?",
    body: "Agenda tu Diagnóstico Comercial y descubre en qué parte de tu proceso se están escapando tus ventas — y cómo convertirlas en crecimiento real.",
    visual: "arrow",
    cta: { label: "Solicita tu diagnóstico", href: "/diagnostico.html" },
  },
];

/* Partículas deterministas para slide 2 (SSR-safe) */
const PARTICLES = Array.from({ length: 12 }, (_, i) => ({
  left: `${((i * 7 + 13) % 90) + 5}%`,
  top:  `${((i * 11 + 17) % 80) + 10}%`,
  size: 4 + (i % 5) * 2,
  duration: 3 + (i % 5),
  delay: i * 0.4,
}));

const ICON_MAP = { stethoscope: Stethoscope, users: Users, download: Download } as const;

/* ─────────────────────────────────────────────────────────────────
   COMPONENTE SLIDE
───────────────────────────────────────────────────────────────── */
function Slide({
  slide, index, isActive, scrollRef,
}: {
  slide: SlideData;
  index: number;
  isActive: boolean;
  scrollRef: RefObject<HTMLDivElement | null>;
}) {
  const isLast = index === SLIDES.length - 1;

  /* Helper: animación de entrada con delay */
  const anim = (delay: number): React.CSSProperties => ({
    opacity: 0,
    animation: isActive
      ? `csSlideUp 500ms cubic-bezier(0.4,0,0.2,1) ${delay}ms forwards`
      : "none",
  });

  const scrollToNext = () => {
    const slides = scrollRef.current?.querySelectorAll("[data-slide]");
    slides?.[index + 1]?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div
      data-slide={index}
      aria-label={`Sección ${slide.badge}`}
      style={{ height: "100vh", scrollSnapAlign: "start", position: "relative", overflow: "hidden" }}
    >
      {/* Ghost text */}
      <div
        aria-hidden
        style={{
          position: "absolute", left: 0, right: 0, top: "18%",
          display: "flex", alignItems: "center", justifyContent: "center",
          pointerEvents: "none", userSelect: "none", zIndex: 2,
          opacity: 0,
          animation: isActive ? "csGhostReveal 900ms cubic-bezier(0.4,0,0.2,1) forwards" : "none",
        }}
      >
        <span style={{
          fontFamily: "'Montserrat', sans-serif", fontWeight: 900,
          fontSize: "clamp(60px, 20vw, 320px)",
          color: "white", lineHeight: 1, letterSpacing: "-0.02em",
          whiteSpace: "nowrap", textTransform: "uppercase",
        }}>
          {slide.ghostText}
        </span>
      </div>

      {/* Partículas (solo slide 2) */}
      {slide.visual === "arrow" && (
        <div aria-hidden style={{ position: "absolute", inset: 0, pointerEvents: "none", zIndex: 1 }}>
          {PARTICLES.map((p, i) => (
            <div key={i} style={{
              position: "absolute", left: p.left, top: p.top,
              width: p.size, height: p.size,
              background: "rgba(245,200,66,0.18)", borderRadius: "50%",
              animation: `csFloatParticle ${p.duration}s ease-in-out ${p.delay}s infinite`,
            }} />
          ))}
        </div>
      )}

      {/* Contenido central */}
      <div style={{
        position: "absolute", inset: 0, zIndex: 10,
        display: "flex", flexDirection: "column",
        alignItems: "center", justifyContent: "center",
        padding: "2rem", textAlign: "center",
        overflowY: "auto",
      }}>
        {/* Badge */}
        <div style={anim(0)}>
          <span style={{
            fontSize: "11px", fontWeight: 600, letterSpacing: "0.22em",
            textTransform: "uppercase", color: slide.accentColor,
            opacity: 0.9, display: "block", marginBottom: "1rem",
          }}>
            {slide.badge}
          </span>
        </div>

        {/* Título */}
        <div style={anim(120)}>
          <h2 style={{
            fontFamily: "'Montserrat', sans-serif", fontWeight: 700,
            fontSize: "clamp(22px, 4vw, 52px)",
            color: slide.textColor, lineHeight: 1.15,
            whiteSpace: "pre-line", marginBottom: "1.25rem", maxWidth: 780,
          }}>
            {slide.title}
          </h2>
        </div>

        {/* Body */}
        <div style={anim(240)}>
          <p style={{
            fontSize: "clamp(14px, 1.6vw, 19px)", lineHeight: 1.65,
            color: slide.textColor, opacity: 0.85,
            maxWidth: 600, marginBottom: "2rem",
          }}>
            {slide.body}
          </p>
        </div>

        {/* Visual / Tarjetas / CTA */}
        <div style={{ ...anim(360), width: "100%", display: "flex", justifyContent: "center" }}>

          {/* Slide 0 — Shield */}
          {slide.visual === "shield" && (
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
              <ShieldCheck
                size={80} color={slide.accentColor}
                aria-label="Garantía"
                style={{ animation: "csShieldPulse 2.8s ease-in-out infinite" }}
              />
              <div style={{
                width: 60, height: 2, margin: "1.5rem auto",
                background: `linear-gradient(90deg, transparent, ${slide.accentColor}, transparent)`,
              }} />
            </div>
          )}

          {/* Slide 1 — Tarjetas */}
          {slide.cards && (
            <div style={{
              display: "flex", flexWrap: "wrap", gap: "1.25rem",
              justifyContent: "center", maxWidth: 960, margin: "0 auto",
            }}>
              {slide.cards.map((card) => {
                const Icon = ICON_MAP[card.icon];
                return (
                  <div
                    key={card.title}
                    style={{
                      background: "rgba(255,255,255,0.10)",
                      backdropFilter: "blur(8px)", WebkitBackdropFilter: "blur(8px)",
                      border: "1px solid rgba(255,255,255,0.18)",
                      borderRadius: 16, padding: "1.5rem",
                      maxWidth: 280, flex: "1 1 220px", textAlign: "left",
                      transition: "transform 250ms ease, box-shadow 250ms ease",
                    }}
                    onMouseEnter={e => {
                      const el = e.currentTarget as HTMLDivElement;
                      el.style.transform = "translateY(-6px)";
                      el.style.boxShadow = "0 16px 40px rgba(0,0,0,0.25)";
                    }}
                    onMouseLeave={e => {
                      const el = e.currentTarget as HTMLDivElement;
                      el.style.transform = "translateY(0)";
                      el.style.boxShadow = "none";
                    }}
                  >
                    <Icon size={32} color={slide.accentColor} aria-hidden />
                    <h3 style={{
                      fontFamily: "'Montserrat', sans-serif", fontWeight: 700,
                      fontSize: "15px", color: "#FFFFFF",
                      marginTop: "0.75rem", marginBottom: "0.5rem",
                    }}>
                      {card.title}
                    </h3>
                    <p style={{ fontSize: "13px", color: "rgba(255,255,255,0.75)", lineHeight: 1.6 }}>
                      {card.desc}
                    </p>
                    <a
                      href={card.href}
                      target={card.href.startsWith("http") ? "_blank" : undefined}
                      rel={card.href.startsWith("http") ? "noopener noreferrer" : undefined}
                      aria-label={`${card.cta} — ${card.title}`}
                      style={{
                        display: "inline-block", marginTop: "1rem",
                        fontSize: "12px", fontWeight: 600, letterSpacing: "0.12em",
                        textTransform: "uppercase", color: slide.accentColor,
                        borderBottom: `1px solid ${slide.accentColor}`,
                        paddingBottom: "2px", textDecoration: "none",
                        transition: "opacity 150ms",
                      }}
                      onMouseEnter={e => (e.currentTarget.style.opacity = "0.7")}
                      onMouseLeave={e => (e.currentTarget.style.opacity = "1")}
                    >
                      {card.cta}
                    </a>
                  </div>
                );
              })}
            </div>
          )}

          {/* Slide 2 — CTA + indicador subir */}
          {slide.visual === "arrow" && slide.cta && (
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
              <a
                href={slide.cta.href}
                aria-label={`${slide.cta.label} — Diagnóstico Comercial Estratégico`}
                style={{
                  background: slide.accentColor, color: "#541388",
                  fontFamily: "'Montserrat', sans-serif", fontWeight: 700,
                  fontSize: "clamp(14px, 1.8vw, 18px)",
                  letterSpacing: "0.06em", textTransform: "uppercase",
                  padding: "1rem 2.5rem", borderRadius: 9999,
                  border: "none", cursor: "pointer", textDecoration: "none",
                  display: "inline-block",
                  transition: "transform 180ms ease, box-shadow 180ms ease",
                }}
                onMouseEnter={e => {
                  const el = e.currentTarget as HTMLAnchorElement;
                  el.style.transform = "scale(1.04)";
                  el.style.boxShadow = `0 0 0 6px ${slide.accentColor}40`;
                }}
                onMouseLeave={e => {
                  const el = e.currentTarget as HTMLAnchorElement;
                  el.style.transform = "scale(1)";
                  el.style.boxShadow = "none";
                }}
              >
                {slide.cta.label}
              </a>
              <div style={{
                fontSize: "11px", letterSpacing: "0.15em", textTransform: "uppercase",
                color: "white", opacity: 0.5, marginTop: "1.5rem",
                animation: "csBounceUp 1.8s ease-in-out infinite",
              }}>
                ↑ Subir
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Indicador scroll (no en el último slide) */}
      {!isLast && (
        <button
          onClick={scrollToNext}
          aria-label="Siguiente sección"
          style={{
            position: "absolute", bottom: "2rem", left: "50%",
            transform: "translateX(-50%)", zIndex: 20,
            display: "flex", flexDirection: "column", alignItems: "center", gap: "4px",
            background: "none", border: "none", cursor: "pointer", padding: 0,
          }}
        >
          <ChevronDown
            size={20} color={slide.accentColor}
            style={{ animation: "csBounceDown 1.6s ease-in-out infinite" }}
          />
          <span style={{
            fontSize: "10px", letterSpacing: "0.2em",
            color: slide.textColor, opacity: 0.5, textTransform: "uppercase",
          }}>
            SCROLL
          </span>
        </button>
      )}
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────────
   COMPONENTE PRINCIPAL
───────────────────────────────────────────────────────────────── */
export function ClosingSection() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [flash,       setFlash]       = useState(false);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const lastIdxRef   = useRef(0);

  /* IntersectionObserver — root = scroll container */
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const slides = container.querySelectorAll("[data-slide]");

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const idx = Number(entry.target.getAttribute("data-slide"));
            if (idx !== lastIdxRef.current) {
              lastIdxRef.current = idx;
              setFlash(true);
              setTimeout(() => setFlash(false), 400);
              setActiveIndex(idx);
            }
          }
        });
      },
      { root: container, threshold: 0.6 }
    );

    slides.forEach((s) => observer.observe(s));
    return () => observer.disconnect();
  }, []);

  const scrollToSlide = useCallback((idx: number) => {
    const slides = containerRef.current?.querySelectorAll("[data-slide]");
    slides?.[idx]?.scrollIntoView({ behavior: "smooth" });
  }, []);

  const current = SLIDES[activeIndex];

  return (
    <section
      id="contacto"
      aria-label="Sección de garantía, comunidad y diagnóstico"
    >
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Montserrat:wght@400;500;600;700;900&display=swap');

        @media (prefers-reduced-motion: no-preference) {
          @keyframes csGhostReveal {
            from { opacity: 0;    transform: scale(1.08); }
            to   { opacity: 0.07; transform: scale(1);    }
          }
          @keyframes csSlideUp {
            from { opacity: 0; transform: translateY(32px); }
            to   { opacity: 1; transform: translateY(0);    }
          }
          @keyframes csShieldPulse {
            0%   { transform: scale(1);    filter: drop-shadow(0 0  0px #7B5EA7);   }
            50%  { transform: scale(1.08); filter: drop-shadow(0 0 18px #7B5EA780); }
            100% { transform: scale(1);    filter: drop-shadow(0 0  0px #7B5EA7);   }
          }
          @keyframes csFloatParticle {
            0%   { transform: translateY(0px)   scale(1);   opacity: 0.4; }
            50%  { transform: translateY(-20px) scale(1.2); opacity: 0.7; }
            100% { transform: translateY(0px)   scale(1);   opacity: 0.4; }
          }
          @keyframes csBounceDown {
            0%, 100% { transform: translateY(0);  }
            50%       { transform: translateY(5px); }
          }
          @keyframes csBounceUp {
            0%, 100% { transform: translateY(0);   }
            50%       { transform: translateY(-4px); }
          }
          @keyframes csFlashIn {
            0%   { opacity: 0.18; }
            100% { opacity: 0;    }
          }
        }
      `}</style>

      <div
        style={{
          backgroundColor: current.bg,
          transition: "background-color 700ms cubic-bezier(0.4, 0, 0.2, 1)",
          position: "relative", width: "100%",
        }}
      >
        {/* Textura grain */}
        <div
          aria-hidden
          style={{
            position: "absolute", inset: 0, pointerEvents: "none", zIndex: 50,
            opacity: 0.35,
            backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='180' height='180'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.75' numOctaves='4'/%3E%3CfeColorMatrix type='saturate' values='0'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.06'/%3E%3C/svg%3E")`,
            backgroundSize: "180px 180px",
          }}
        />

        {/* Flash de transición */}
        {flash && (
          <div
            aria-hidden
            style={{
              position: "fixed", inset: 0, zIndex: 999,
              background: current.accentColor,
              opacity: 0,
              animation: "csFlashIn 400ms ease forwards",
              pointerEvents: "none",
            }}
          />
        )}

        {/* Dots de navegación lateral */}
        <nav
          aria-label="Navegación entre secciones"
          style={{
            position: "fixed", right: "1.5rem", top: "50%",
            transform: "translateY(-50%)", zIndex: 100,
            display: "flex", flexDirection: "column", gap: "10px",
          }}
        >
          {SLIDES.map((s, i) => (
            <button
              key={s.id}
              onClick={() => scrollToSlide(i)}
              aria-label={`Ir a ${s.badge}`}
              aria-current={activeIndex === i ? "true" : undefined}
              style={{
                width: activeIndex === i ? 10 : 8,
                height: activeIndex === i ? 10 : 8,
                background: activeIndex === i ? current.accentColor : "rgba(255,255,255,0.4)",
                borderRadius: "50%", border: "none", cursor: "pointer",
                padding: 0, display: "block",
                transition: "all 300ms ease",
              }}
            />
          ))}
        </nav>

        {/* Scroll container con snap */}
        <div
          ref={containerRef}
          role="region"
          aria-label="Sección de garantía, comunidad y diagnóstico"
          style={{ overflowY: "scroll", scrollSnapType: "y mandatory", height: "100vh" }}
        >
          {SLIDES.map((slide, i) => (
            <Slide
              key={slide.id}
              slide={slide}
              index={i}
              isActive={activeIndex === i}
              scrollRef={containerRef}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
