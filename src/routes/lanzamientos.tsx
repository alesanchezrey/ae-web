import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { productosLanzamiento } from "@/lib/esperanza";
import { urlAbsoluta } from "@/lib/site";

const titulo = "Lanzamientos — Alimentos Esperanza";
const descripcion =
  "Conoce los próximos productos Esperanza: harina de maíz precocida y aceite de soya refinado, muy pronto en tu mesa.";
const imagen = urlAbsoluta(
  productosLanzamiento[0]?.composicion ?? "/fotos/linea-esperanza-poster.jpg",
);

export const Route = createFileRoute("/lanzamientos")({
  head: () => ({
    meta: [
      { title: titulo },
      { name: "description", content: descripcion },
      { property: "og:title", content: titulo },
      { property: "og:description", content: descripcion },
      { property: "og:type", content: "website" },
      { property: "og:url", content: urlAbsoluta("/lanzamientos") },
      { property: "og:image", content: imagen },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:image", content: imagen },
    ],
    links: [{ rel: "canonical", href: urlAbsoluta("/lanzamientos") }],
  }),
  component: Lanzamientos,
});

function Lanzamientos() {
  const [activo, setActivo] = useState<number | null>(null);

  return (
    <main className="textura-papel bg-white pb-24 pt-36 md:pb-32 md:pt-44">
      <div className="mx-auto max-w-[1400px] px-6 md:px-12">
        <p className="font-display text-3xl italic text-esperanza md:text-5xl">
          Próximos
        </p>
        <h1 className="font-display text-[clamp(3.4rem,9.5vw,9.5rem)] font-semibold uppercase leading-[0.88] tracking-[-0.03em] text-tinta">
          Lanzamientos
        </h1>
        <svg
          viewBox="0 0 260 14"
          className="mt-3 h-3 w-52 text-llano-claro"
          aria-hidden="true"
        >
          <path
            d="M2 10C60 3 160 2 258 6"
            fill="none"
            stroke="currentColor"
            strokeWidth="3"
            strokeLinecap="round"
          />
        </svg>
        <p className="mt-6 max-w-2xl text-lg leading-relaxed text-tinta-suave">
          Estos productos están próximos a llegar a los anaqueles. Conócelos
          antes que nadie.
        </p>

        <div className="mt-16 flex flex-wrap gap-6 pt-20 md:mt-20 md:pt-24">
          {productosLanzamiento.map((p, i) => {
            const act = activo === i;
            return (
              <article
                key={p.slug}
                onMouseEnter={() => setActivo(i)}
                onMouseLeave={() => setActivo((v) => (v === i ? null : v))}
                onFocus={() => setActivo(i)}
                onClick={() => setActivo(i)}
                className={`group relative w-full shrink-0 overflow-visible rounded-lg border bg-white transition-[transform,border-color] duration-500 ease-asiento sm:w-[46vw] lg:w-[24rem] ${
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
                  <span className="absolute left-4 top-4 z-10 rounded-full bg-esperanza px-3 py-1 text-xs uppercase tracking-[0.14em] text-white">
                    Próximamente
                  </span>
                </div>
                <div className="border-t border-tinta/10 p-6">
                  <h2 className="font-display text-3xl leading-tight text-tinta md:text-2xl">
                    {p.nombre}
                  </h2>
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
      </div>
    </main>
  );
}
