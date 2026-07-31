import { useRef } from "react";
import { tramo, useProgresoScroll } from "@/hooks/useProgresoScroll";

const empaques = [
  {
    src: "/productos/harina-maiz-1kg.png",
    alt: "Empaque de Harina de Maíz Precocida Esperanza de 1 kg",
    clase: "left-0 z-10 w-[42%] md:w-[40%]",
    desde: 0,
    hasta: 0.2,
  },
  {
    src: "/productos/azucar-refinada-1kg.png",
    alt: "Empaque de Azúcar Refinada Esperanza de 1 kg",
    clase: "right-0 z-10 w-[42%] md:w-[40%]",
    desde: 0.03,
    hasta: 0.24,
  },
  {
    src: "/productos/arroz-blanco-1kg.png",
    alt: "Empaque de Arroz Blanco Tipo 1 Esperanza de 1 kg",
    clase: "left-1/2 z-20 w-[42%] -translate-x-1/2 md:w-[40%]",
    desde: 0.07,
    hasta: 0.29,
  },
];

export function Calidad() {
  const ref = useRef<HTMLElement | null>(null);
  const { progreso } = useProgresoScroll(ref);

  const opacidadTexto = tramo(progreso, 0.12, 0.36);
  const yTexto = (1 - tramo(progreso, 0.12, 0.36)) * 40;
  const opacidadEmpaques = tramo(progreso, 0.015, 0.07);

  return (
    <section
      ref={ref}
      className="relative -mt-[120vh] h-[280vh] bg-white"
      aria-label="Calidad de nuestros productos"
    >
      <div className="sticky top-0 flex h-screen items-center overflow-hidden">
        <div className="relative mx-auto grid w-full max-w-[1400px] grid-cols-1 items-center gap-10 px-6 md:grid-cols-2 md:px-12">
          <div className="relative h-[42vh] md:h-[72vh]">
            {empaques.map((e) => {
              const caida = tramo(progreso, e.desde, e.hasta);
              const rebote =
                tramo(progreso, e.hasta, e.hasta + 0.05) *
                (1 - tramo(progreso, e.hasta + 0.05, e.hasta + 0.14));
              return (
                <div
                  key={e.src}
                  className={`absolute bottom-0 ${e.clase}`}
                  style={{
                    transform: `translate3d(0, ${-85 * (1 - caida * caida)}vh, 0)`,
                    opacity: opacidadEmpaques,
                    willChange: "transform",
                  }}
                >
                  <div
                    className="relative"
                    style={{
                      transform: `scale(${1 + 0.04 * rebote}, ${1 - 0.055 * rebote})`,
                      transformOrigin: "bottom center",
                    }}
                  >
                    <img
                      src={e.src}
                      alt={e.alt}
                      width={900}
                      height={1200}
                      className="h-auto w-full object-contain"
                    />
                    <span
                      aria-hidden="true"
                      className="absolute inset-x-[8%] -bottom-2 h-4 rounded-[100%] bg-tinta/18 blur-md transition-opacity duration-300"
                      style={{ opacity: caida >= 1 ? 1 : 0 }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
          <div
            style={{
              opacity: opacidadTexto,
              transform: `translate3d(0, ${yTexto}px, 0)`,
            }}
          >
            <p className="antetitulo mb-5 text-llano">Calidad Esperanza</p>
            <p className="font-display text-[clamp(2rem,3.6vw,3.8rem)] leading-[1.08] tracking-[-0.015em] text-tinta">
              Nuestros productos cumplen con los{" "}
              <span className="text-llano">más altos estándares de calidad</span> en
              Venezuela.
            </p>
            <div className="surco mt-8 max-w-xs" />
          </div>
        </div>
      </div>
    </section>
  );
}
