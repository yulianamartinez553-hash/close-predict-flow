import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import caroPortrait from "@/assets/caro-portrait.png";

const VIDEO_URL =
  "https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260210_031346_d87182fb-b0af-4273-84d1-c6fd17d6bf0f.mp4";

function useTypewriter(text: string, charDelay = 200, startDelay = 1200) {
  const [displayed, setDisplayed] = useState("");

  useEffect(() => {
    const timeout = setTimeout(() => {
      let i = 0;
      const interval = setInterval(() => {
        i++;
        setDisplayed(text.slice(0, i));
        if (i >= text.length) clearInterval(interval);
      }, charDelay);
      return () => clearInterval(interval);
    }, startDelay);
    return () => clearTimeout(timeout);
  }, [text, charDelay, startDelay]);

  return displayed;
}

export function Hero() {
  const caroTyped = useTypewriter("CARO");

  return (
    <section className="relative min-h-screen overflow-hidden text-white">
      {/* Full-screen video background — no overlay */}
      <video
        autoPlay
        loop
        muted
        playsInline
        src={VIDEO_URL}
        className="absolute inset-0 h-full w-full object-cover"
      />

      {/* Navbar */}
      <nav className="relative z-20 flex w-full items-center justify-between px-6 py-[16px] transition-opacity hover:opacity-80 md:px-[120px]">
        <div className="serif text-2xl tracking-tight">
          Caro <em className="text-gold">Chaparro</em>
        </div>
        <div className="hidden gap-8 text-sm text-white/70 md:flex">
          <a href="#sistema" className="hover:text-white">Sistema</a>
          <a href="#entregables" className="hover:text-white">Entregables</a>
          <a href="#testimonios" className="hover:text-white">Testimonios</a>
          <a href="#contacto" className="hover:text-white">Contacto</a>
        </div>
        <a
          href="/diagnostico.html"
          className="hidden rounded-full border border-white/20 px-4 py-2 text-sm hover:bg-white/10 md:inline-block"
        >
          Agendar
        </a>
      </nav>

      {/* Hero content */}
      <div className="relative z-10 mx-auto grid max-w-7xl items-center gap-12 px-6 pb-24 pt-12 lg:grid-cols-[1.15fr_1fr] lg:px-[120px] lg:pt-20">
        {/* Title & subtitle */}
        <div>
          <h1 className="serif text-4xl leading-[1.05] text-balance sm:text-5xl lg:text-[64px]">
            {["Tu negocio", "no tiene un problema", "de ventas."].map((line, i) => (
              <motion.span
                key={i}
                initial={{ opacity: 0, y: 20, filter: "blur(8px)" }}
                animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                transition={{ duration: 0.8, delay: 0.2 + i * 0.15 }}
                className="block"
              >
                {line}
              </motion.span>
            ))}
            <motion.span
              initial={{ opacity: 0, y: 20, filter: "blur(8px)" }}
              animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
              transition={{ duration: 0.9, delay: 0.7 }}
              className="block"
            >
              Tiene un problema de{" "}
              <em className="bg-gradient-to-r from-violet-bright to-gold bg-clip-text not-italic font-semibold text-transparent">
                sistema.
              </em>
            </motion.span>
          </h1>

          <motion.p
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 1.05 }}
            className="mt-6 max-w-xl text-base leading-relaxed text-white/75 sm:text-lg"
          >
            Transformo ventas que dependen del dueño en un{" "}
            <em className="text-white">sistema comercial predecible</em> y escalable en 12 semanas.
          </motion.p>
        </div>

        {/* Portrait + typing CARO */}
        <div className="relative mx-auto h-[520px] w-full max-w-md lg:h-[600px]">
          <motion.img
            src={caroPortrait}
            alt="Caro Chaparro, mentora y estratega de ventas"
            initial={{ opacity: 0, scale: 0.96, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 1.1, delay: 0.4, ease: [0.22, 1, 0.36, 1] }}
            className="absolute bottom-0 left-1/2 h-[560px] w-auto max-w-none -translate-x-1/2 object-contain drop-shadow-[0_40px_60px_rgba(30,10,51,0.55)] lg:h-[640px]"
          />

          {/* CARO typewriter — overlaps image at bottom */}
          <div className="pointer-events-none absolute bottom-0 left-0 right-0 z-10 select-none text-center">
            <span
              className="display font-black leading-none tracking-tight text-white drop-shadow-[0_4px_24px_rgba(0,0,0,0.6)]"
              style={{ fontSize: "clamp(88px, 22vw, 180px)", lineHeight: 0.82 }}
            >
              {caroTyped}
              <span className="cursor-blink">|</span>
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}
