import { useRevelar } from "@/hooks/useProgresoScroll";

const ventajas = [
  {
    titulo: "Ingredientes naturales",
    texto: "Materia prima seleccionada, sin atajos.",
    d: "M12 22c0-7 4-11 9-12-1 7-4 11-9 12zm0 0C12 15 8 11 3 10c1 7 4 11 9 12z",
  },
  {
    titulo: "Calidad certificada",
    texto: "Procesos que garantizan cada lote.",
    d: "M12 2l8 3v7c0 5-3.5 8.5-8 10-4.5-1.5-8-5-8-10V5l8-3zm-1 13l6-6-1.5-1.5L11 12l-2.5-2.5L7 11l4 4z",
  },
  {
    titulo: "Hecho para la familia",
    texto: "La mesa venezolana de todos los días.",
    d: "M12 21C7 17 3 13.5 3 9.5A4.5 4.5 0 0 1 12 7a4.5 4.5 0 0 1 9 2.5c0 4-4 7.5-9 11.5z",
  },
  {
    titulo: "Origen local",
    texto: "Productores del llano de Portuguesa.",
    d: "M12 2C8.7 2 6 4.7 6 8c0 4.5 6 14 6 14s6-9.5 6-14c0-3.3-2.7-6-6-6zm0 8.5A2.5 2.5 0 1 1 12 5.5a2.5 2.5 0 0 1 0 5z",
  },
];

export function Ventajas() {
  const { ref, visible } = useRevelar<HTMLDivElement>(0.25);

  return (
    <section className="textura-papel textura-papel-oscuro bg-anil py-8 text-white md:py-16">
      <div
        ref={ref}
        className="mx-auto grid max-w-[1400px] grid-cols-1 px-6 sm:grid-cols-2 sm:gap-x-10 md:grid-cols-4 md:px-12"
      >
        {ventajas.map((v, i) => (
          <div
            key={v.titulo}
            className={`flex items-start gap-5 border-white/15 py-7 sm:border-b-0 sm:py-6 md:px-8 md:py-0 ${
              i < 3 ? "border-b" : ""
            } ${i > 0 ? "md:border-l" : ""}`}
            style={{
              opacity: visible ? 1 : 0,
              transform: visible ? "translateY(0)" : "translateY(28px)",
              transition: `opacity .9s cubic-bezier(.16,1,.3,1) ${i * 100}ms, transform .9s cubic-bezier(.16,1,.3,1) ${i * 100}ms`,
            }}
          >
            <svg
              viewBox="0 0 24 24"
              fill="currentColor"
              aria-hidden="true"
              className="mt-0.5 h-9 w-9 shrink-0 text-trigo md:h-8 md:w-8"
            >
              <path d={v.d} />
            </svg>
            <div>
              <h3 className="font-display text-2xl leading-tight md:text-lg">{v.titulo}</h3>
              <p className="mt-2 leading-relaxed text-white/70 md:text-sm">{v.texto}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
