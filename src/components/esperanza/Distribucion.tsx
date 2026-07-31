import { useRevelar } from "@/hooks/useProgresoScroll";

const anaqueles = [
  {
    src: "/fotos/anaquel-harina.jpg",
    alt: "Pasillo de supermercado con Harina de Maíz Precocida Esperanza en anaquel",
  },
  {
    src: "/fotos/anaquel-arroz.jpg",
    alt: "Cliente tomando un paquete de Arroz Blanco Tipo 1 Esperanza del anaquel",
  },
  {
    src: "/fotos/anaquel-azucar.jpg",
    alt: "Dos clientas eligiendo Azúcar Refinada Esperanza en el anaquel",
  },
  {
    src: "/fotos/anaquel-aceite.jpg",
    alt: "Botellas de Aceite de Soya Refinado Esperanza en el anaquel",
  },
];

export function Distribucion() {
  const titulo = useRevelar<HTMLDivElement>(0.3);
  const grilla = useRevelar<HTMLDivElement>(0.2);

  return (
    <section className="textura-papel bg-white pt-24 md:pt-32">
      <div className="mx-auto max-w-[1400px] px-6 md:px-12">
        <div
          ref={titulo.ref}
          className="max-w-2xl"
          style={{
            opacity: titulo.visible ? 1 : 0,
            transform: titulo.visible ? "translateY(0)" : "translateY(28px)",
            transition:
              "opacity .9s cubic-bezier(.16,1,.3,1), transform .9s cubic-bezier(.16,1,.3,1)",
          }}
        >
          <p className="antetitulo mb-5 text-esperanza">Distribución</p>
          <h2 className="font-display text-[clamp(2.6rem,6.4vw,6.2rem)] leading-[0.98] tracking-[-0.02em] text-tinta">
            En el anaquel de tu bodega, tu abasto y tu supermercado.
          </h2>
        </div>
      </div>
      <div ref={grilla.ref} className="mt-16 grid grid-cols-2 md:grid-cols-4">
        {anaqueles.map((a, i) => (
          <div
            key={a.src}
            style={{
              clipPath: grilla.visible ? "inset(0 0 0 0)" : "inset(0 0 100% 0)",
              transform: grilla.visible ? "scale(1)" : "scale(1.06)",
              transition: `clip-path 1.05s cubic-bezier(.16,1,.3,1) ${i * 100}ms, transform 1.35s cubic-bezier(.16,1,.3,1) ${i * 100}ms`,
            }}
          >
            <div className="relative aspect-[3/4] overflow-hidden sm:aspect-[4/5]">
              <img
                src={a.src}
                alt={a.alt}
                loading="lazy"
                className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 ease-asiento hover:scale-105"
              />
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
