import { useState, useRef, useEffect, useCallback } from "react";
import { ShiningButton } from "@/components/animations/ShiningButton";
import { GuaranteeLoop } from "@/components/animations/GuaranteeLoop";
import { ConditionsCard } from "@/components/landing/ConditionsCard";

/* ─────────────────────────────────────────────────────────────────
   TIPOS
───────────────────────────────────────────────────────────────── */
type SlideData = {
  id: string;
  bg: string;
  textColor: string;
  accentColor: string;
  ghostText: string;
  ghostColor?: string;
  ghostOpacity?: number;
  badge?: string;
  titleLead?: string;
  title: string;
  subtitle?: string;
  body: string;
  visual?: "guarantee" | "particles";
  cta: null | { label: string; href: string };
};

/* ─────────────────────────────────────────────────────────────────
   DATOS DE LOS 3 SLIDES
───────────────────────────────────────────────────────────────── */
const SLIDES: SlideData[] = [
  {
    id: "garantia",
    bg: "#55108C",
    textColor: "#FFFFFF",
    accentColor: "#C084FC",
    ghostText: "GARANTIA",
    ghostColor: "var(--violet-soft)",
    ghostOpacity: 0.1,
    badge: "Nuestro compromiso",
    titleLead: "si no funciona,",
    title: "NO PAGAS MÁS",
    subtitle: "SEGUIMOS HASTA QUE FUNCIONE.",
    body: "Al terminar las 12 semanas, si no tienes un sistema comercial documentado, delegable y funcionando en tu negocio, continuamos el acompañamiento sin costo adicional hasta que lo tengas.",
    visual: "guarantee",
    cta: null,
  },
  {
    id: "diagnostico",
    bg: "#2C0A5A",
    textColor: "#FFFFFF",
    accentColor: "#F5C842",
    ghostText: "DIAGNÓSTICO",
    badge: "Tu próximo paso",
    title: "Agenda tu Diagnóstico Comercial",
    body: "Descubre en qué parte de tu proceso se están escapando tus ventas.",
    visual: undefined,
    cta: { label: "Diagnóstico Comercial", href: "/diagnostico.html" },
  },
  {
    id: "llamada",
    bg: "#1E0A33",
    textColor: "#FFFFFF",
    accentColor: "#F5C842",
    ghostText: "LLAMADA",
    title: "¿Listo/a para tener un sistema\nde ventas que trabaje por ti?",
    body: "Organicemos tus ventas desde hoy, sin compromiso.",
    visual: "particles",
    cta: {
      label: "Agendar",
      href: "https://calendly.com/caroventascoach/30min?month=2026-06",
    },
  },
];

/* Partículas deterministas para slide diagnóstico (SSR-safe) */
const PARTICLES = Array.from({ length: 12 }, (_, i) => ({
  left: `${((i * 7 + 13) % 90) + 5}%`,
  top: `${((i * 11 + 17) % 80) + 10}%`,
  size: 4 + (i % 5) * 2,
  duration: 3 + (i % 5),
  delay: i * 0.4,
}));

/* ─────────────────────────────────────────────────────────────────
   COMPONENTE SLIDE
───────────────────────────────────────────────────────────────── */
function Slide({
  slide, index, isActive,
}: {
  slide: SlideData;
  index: number;
  isActive: boolean;
}) {
  const anim = (delay: number): React.CSSProperties => ({
    opacity: 0,
    animation: isActive
      ? `csSlideUp 500ms cubic-bezier(0.4,0,0.2,1) ${delay}ms forwards`
      : "none",
  });

  return (
    <div
      data-slide={index}
      aria-label={`Sección ${slide.badge ?? slide.ghostText}`}
      style={{ height: "100vh", scrollSnapAlign: "start", position: "relative", overflow: "hidden" }}
    >
      {/* Ghost text de fondo */}
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
          color: slide.ghostColor ?? "white",
          opacity: slide.ghostOpacity ?? 0.07,
          lineHeight: 1, letterSpacing: "-0.02em",
          whiteSpace: "nowrap", textTransform: "uppercase",
        }}>
          {slide.ghostText}
        </span>
      </div>

      {/* Partículas — solo slide diagnóstico, solo cuando activo */}
      {slide.visual === "particles" && isActive && (
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
        {slide.badge && (
          <div style={anim(0)}>
            <span style={{
              fontSize: "11px", fontWeight: 600, letterSpacing: "0.22em",
              textTransform: "uppercase", color: slide.accentColor,
              opacity: 0.9, display: "block", marginBottom: "1rem",
            }}>
              {slide.badge}
            </span>
          </div>
        )}

        {/* Titular pequeño (ej. "si no funciona,") — solo slide garantia */}
        {slide.titleLead && (
          <div style={anim(90)}>
            <p style={{
              fontFamily: "'Montserrat', sans-serif", fontWeight: 800,
              fontSize: "clamp(14px, 2vw, 26px)",
              color: slide.textColor, lineHeight: 1.2,
              marginBottom: "0.35rem", maxWidth: 780,
            }}>
              {slide.titleLead}
            </p>
          </div>
        )}

        {/* Título principal */}
        <div style={anim(150)}>
          <h2 style={{
            fontFamily: "'Montserrat', sans-serif", fontWeight: 800,
            fontSize: "clamp(22px, 4vw, 52px)",
            color: slide.textColor, lineHeight: 1.15,
            whiteSpace: "pre-line",
            marginBottom: slide.subtitle ? "0.6rem" : "1.25rem",
            maxWidth: 780,
          }}>
            {slide.title}
          </h2>
        </div>

        {/* Subtítulo (solo slide garantia) */}
        {slide.subtitle && (
          <div style={anim(240)}>
            <p style={{
              fontFamily: "'Montserrat', sans-serif", fontWeight: 600,
              fontSize: "clamp(13px, 1.8vw, 20px)",
              color: slide.accentColor, letterSpacing: "0.06em",
              marginBottom: "1.25rem", textTransform: "uppercase",
            }}>
              {slide.subtitle}
            </p>
          </div>
        )}

        {/* Body */}
        <div style={anim(slide.subtitle ? 330 : 240)}>
          <p style={{
            fontSize: "clamp(14px, 1.6vw, 19px)", lineHeight: 1.65,
            color: slide.textColor, opacity: 0.85,
            maxWidth: 600, marginBottom: "2rem",
          }}>
            {slide.body}
          </p>
        </div>

        {/* Loop de garantía + tarjeta de condiciones — solo slide garantia */}
        {slide.visual === "guarantee" && (
          <div style={{
            ...anim(420),
            position: "relative",
            display: "flex", flexDirection: "column", alignItems: "center",
            width: "100%",
          }}>
            <div style={{ marginBottom: "1.75rem" }}>
              <GuaranteeLoop />
            </div>

            <div style={{ position: "relative" }}>
              <ConditionsCard />
            </div>

            <p
              className="conditions-followup"
              style={{
                position: "relative",
                marginTop: "300px",
                fontFamily: "'Poppins', sans-serif",
                fontSize: "clamp(14px, 1.6vw, 19px)",
                lineHeight: 1.65,
                color: slide.textColor,
                opacity: 0.85,
                maxWidth: 600,
              }}
            >
              Si cumpliste con eso y el sistema NO está funcionando, el problema es mío. Y lo resuelvo yo.
            </p>
          </div>
        )}

        {/* CTA */}
        {slide.cta && (
          <div style={anim(slide.subtitle ? 420 : 360)}>
            <ShiningButton
              text={slide.cta.label}
              href={slide.cta.href}
              target={slide.cta.href.startsWith("http") ? "_blank" : undefined}
              rel={slide.cta.href.startsWith("http") ? "noopener noreferrer" : undefined}
              variant="gold"
              size="lg"
            />
          </div>
        )}
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────────
   COMPONENTE PRINCIPAL
───────────────────────────────────────────────────────────────── */
export function ClosingSection() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [flash, setFlash] = useState(false);
  const [sectionInView, setSectionInView] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const lastIdxRef = useRef(0);
  /* Refs para el handler de wheel (sin stale closures) */
  const activeIndexRef = useRef(0);
  const isTransitioningRef = useRef(false);

  /* Muestra dots solo cuando la sección está completamente en vista */
  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;
    const obs = new IntersectionObserver(
      ([entry]) => setSectionInView(entry.isIntersecting),
      { threshold: 0.8 }
    );
    obs.observe(section);
    return () => obs.disconnect();
  }, []);

  /* Detecta el slide activo dentro del scroll container */
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
              activeIndexRef.current = idx;
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

  /* Bloqueo de scroll de la página principal mientras la sección está activa */
  useEffect(() => {
    const sectionEl = sectionRef.current;
    if (!sectionEl) return;

    const handleWheel = (e: WheelEvent) => {
      const rect = sectionEl.getBoundingClientRect();
      /* Solo actuar cuando la sección cubre sustancialmente el viewport */
      const fullyInView = rect.top < window.innerHeight * 0.35 && rect.bottom > window.innerHeight * 0.65;
      if (!fullyInView) return;

      const isDown = e.deltaY > 0;
      const curIdx = activeIndexRef.current;

      /* En los límites dejamos pasar el scroll de la página */
      if (isDown && curIdx >= SLIDES.length - 1) return;
      if (!isDown && curIdx <= 0) return;

      /* Entre slides intermedios: bloquear página y navegar internamente */
      e.preventDefault();

      if (isTransitioningRef.current) return;
      isTransitioningRef.current = true;
      setTimeout(() => { isTransitioningRef.current = false; }, 950);

      scrollToSlide(isDown ? curIdx + 1 : curIdx - 1);
    };

    window.addEventListener("wheel", handleWheel, { passive: false });
    return () => window.removeEventListener("wheel", handleWheel);
  }, [scrollToSlide]);

  const current = SLIDES[activeIndex];

  return (
    <section
      id="contacto"
      ref={sectionRef}
      aria-label="Sección de garantía, diagnóstico y llamada"
      style={{ height: "100vh", position: "relative" }}
    >
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Montserrat:wght@400;500;600;700;900&display=swap');

        @media (prefers-reduced-motion: no-preference) {
          @keyframes csGhostReveal {
            from { opacity: 0; transform: scale(1.08); }
            to   { opacity: 1; transform: scale(1);    }
          }
          @keyframes csSlideUp {
            from { opacity: 0; transform: translateY(32px); }
            to   { opacity: 1; transform: translateY(0);    }
          }
          @keyframes csFloatParticle {
            0%   { transform: translateY(0px)   scale(1);   opacity: 0.4; }
            50%  { transform: translateY(-20px) scale(1.2); opacity: 0.7; }
            100% { transform: translateY(0px)   scale(1);   opacity: 0.4; }
          }
          @keyframes csFlashIn {
            0%   { opacity: 0.18; }
            100% { opacity: 0;    }
          }
        }
      `}</style>

      <div
        style={{
          height: "100vh",
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

        {/* Dots — solo visibles cuando la sección está completamente en vista */}
        {sectionInView && (
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
                aria-label={`Ir a ${s.id}`}
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
        )}

        {/* Scroll container con snap */}
        <div
          ref={containerRef}
          role="region"
          aria-label="Sección de garantía, diagnóstico y llamada"
          style={{ overflowY: "scroll", scrollSnapType: "y mandatory", height: "100vh" }}
        >
          {SLIDES.map((slide, i) => (
            <Slide
              key={slide.id}
              slide={slide}
              index={i}
              isActive={activeIndex === i}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
