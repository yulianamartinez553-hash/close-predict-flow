/* 8 testimonios de la sección PRUEBA SOCIAL (S10).
   Editable sin tocar componentes. El `id` casa con el avatar (testimonial-0X). */
export interface Testimonial {
  id: string;
  quote: string;
  name: string;
  role: string;
}

export const testimonials: Testimonial[] = [
  {
    id: "testimonial-01",
    quote:
      "Por primera vez sé cuántos leads necesito para llegar a mi meta. Dejé de improvisar.",
    name: "María L.",
    role: "Mentora high-ticket",
  },
  {
    id: "testimonial-02",
    quote: "Mi equipo cerró sin mí. Eso solo ya pagó el programa diez veces.",
    name: "Sebastián R.",
    role: "Infoproductor LATAM",
  },
  {
    id: "testimonial-03",
    quote: "El playbook nos ordenó. Hoy cualquiera del equipo puede atender un lead bien.",
    name: "Andrea P.",
    role: "Agencia digital",
  },
  {
    id: "testimonial-04",
    quote: "Dejé de ser el cuello de botella. El negocio por fin respira sin mí encima.",
    name: "Diego M.",
    role: "Consultor B2B",
  },
  {
    id: "testimonial-05",
    quote: "Pasamos de vender por impulso a tener un proceso que puedo medir y mejorar.",
    name: "Valentina C.",
    role: "Coach de negocios",
  },
  {
    id: "testimonial-06",
    quote: "Documentamos todo. Contratar y entrenar a un closer dejó de ser una pesadilla.",
    name: "Tomás G.",
    role: "Dueño de academia",
  },
  {
    id: "testimonial-07",
    quote: "Los números dejaron de asustarme. Ahora decido con datos, no con corazonadas.",
    name: "Lucía F.",
    role: "Consultora de marca",
  },
  {
    id: "testimonial-08",
    quote: "Escalé la facturación sin sumar horas mías. Ese era el objetivo y se cumplió.",
    name: "Martín A.",
    role: "Infoproductor fitness",
  },
];
