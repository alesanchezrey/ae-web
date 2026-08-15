import { Link } from "@tanstack/react-router";
import { useCallback, useRef, useState } from "react";
import { productosDisponibles } from "@/lib/esperanza";

export function Productos() {
  const pista = useRef<HTMLDivElement | null>(null);
  const [activo, setActivo] = useState<number | null>(null);

  const desplazar = useCallback((dir: number) => {
    const el = pista.current;
    if (!el) return;
    const card = el.querySelector("article");
    const paso = card ? card.clientWidth + 24 : el.clientWidth * 0.8;
    el.scrollBy({ left: paso * dir, behavior: "smooth" });
  }, []);

  return (
    <section id="productos" className="textura-papel bg-white py-24 md:py-32">
      <div className="mx-auto max-w-[1400px] px-6 md:px-12">
        <div className="flex flex-wrap items-end justify-between gap-6">
          <div>
            <p className="font-display text-3xl italic text-esperanza md:text-5xl">
              Nuestros
            </p>
            <h2 className="font-display text-[clamp(3.4rem,9.5vw,9.5rem)] font-semibold uppercase leading-[0.88] tracking-[-0.03em] text-tinta">
              Productos
            </h2>
            <svg viewBox="0 0 260 14" className="mt-3 h-3 w-52 text-llano-claro" aria-hidden="true">
              <path
                d="M2 10C60 3 160 2 258 6"
                fill="none"
                stroke="currentColor"
                strokeWidth="3"
                strokeLinecap="round"
              />
            </svg>
          </div>
          <div className="hidden gap-3 md:flex">
            <button
              type="button"
              onClick={() => desplazar(-1)}
              aria-label="Ver productos anteriores"
              className="flex h-12 w-12 items-center justify-center rounded-md border border-tinta/25 text-tinta transition-colors hover:border-trigo hover:bg-trigo"
            >
              ←
            </button>
            <button
              type="button"
              onClick={() => desplazar(1)}
              aria-label="Ver productos siguientes"
              className="flex h-12 w-12 items-center justify-center rounded-md border border-tinta/25 text-tinta transition-colors hover:border-trigo hover:bg-trigo"
            >
              →
            </button>
          </div>
        </div>
      </div>
      <div
        ref={pista}
        className="mt-10 flex snap-x snap-mandatory gap-5 overflow-x-auto px-6 pb-6 pt-20 md:mt-14 md:gap-6 md:px-12 md:pt-24 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
      >
        {productosDisponibles.map((p, i) => {
          const act = activo === i;
          return (
            <article
              key={p.slug}
              onMouseEnter={() => setActivo(i)}
              onMouseLeave={() => setActivo((v) => (v === i ? null : v))}
              onClick={() => setActivo(i)}
              className={`group relative w-[85vw] shrink-0 snap-center overflow-visible rounded-lg border bg-white transition-[transform,border-color] duration-500 ease-asiento sm:w-[46vw] lg:w-[24rem] ${
                act ? "z-20 -translate-y-2 border-trigo" : "z-10 border-tinta/12"
              }`}
            >
              <div className="relative h-64 md:h-68">
                <div
                  className={`absolute inset-x-4 bottom-4 top-[-4.5rem] transition-transform duration-500 ease-asiento ${
                    act ? "scale-110" : "scale-92"
                  }`}
                >
                  <img
                    src={p.composicion}
                    alt={`${p.nombre} ${p.presentacion} junto a su materia prima`}
                    loading="lazy"
                    className="absolute inset-0 h-full w-full object-contain object-bottom"
                  />
                </div>
              </div>
              <div className="border-t border-tinta/10 p-6">
                <h3 className="font-display text-3xl leading-tight text-tinta md:text-2xl">
                  {p.nombre}
                </h3>
                <p className="dato mt-2 text-tinta-suave">{p.presentacion}</p>
                <div
                  className={`mt-4 grid grid-rows-[1fr] opacity-100 transition-all duration-500 ease-asiento ${
                    act
                      ? "md:mt-4 md:grid-rows-[1fr] md:opacity-100"
                      : "md:mt-0 md:grid-rows-[0fr] md:opacity-0"
                  }`}
                >
                  <div className="overflow-hidden">
                    <p className="text-base leading-relaxed text-tinta-suave md:text-sm">
                      {p.descripcion}
                    </p>
                  </div>
                </div>
                <Link
                  to="/productos/$slug"
                  params={{ slug: p.slug }}
                  className={`btn mt-6 w-full ${act ? "btn-llano" : "btn-linea text-tinta"}`}
                >
                  Ver más
                </Link>
              </div>
            </article>
          );
        })}
      </div>
    </section>
  );
}
