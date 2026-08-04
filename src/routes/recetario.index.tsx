import { createFileRoute, Link } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { categorias, recetas } from "@/lib/esperanza";
import { urlAbsoluta } from "@/lib/site";
import { useRevelar } from "@/hooks/useProgresoScroll";

const titulo = "Recetario Esperanza — La cocina venezolana, receta por receta";
const descripcion =
  "18 recetas venezolanas hechas con los productos Esperanza: arepas, cachapas, tequeños, quesillo y más.";
const imagen = urlAbsoluta(recetas[0]?.imagen ?? "/fotos/linea-esperanza-poster.jpg");

export const Route = createFileRoute("/recetario/")({
  head: () => ({
    meta: [
      { title: titulo },
      { name: "description", content: descripcion },
      { property: "og:title", content: titulo },
      { property: "og:description", content: descripcion },
      { property: "og:type", content: "website" },
      { property: "og:url", content: urlAbsoluta("/recetario") },
      { property: "og:image", content: imagen },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:image", content: imagen },
    ],
    links: [{ rel: "canonical", href: urlAbsoluta("/recetario") }],
  }),
  component: Recetario,
});

function Recetario() {
  const [filtro, setFiltro] = useState<string | null>(null);
  const lista = useMemo(
    () => (filtro ? recetas.filter((r) => r.categorias.includes(filtro)) : recetas),
    [filtro],
  );

  const conteo = (cat: string) =>
    recetas.filter((r) => r.categorias.includes(cat)).length;

  return (
    <>
      <section className="bg-llano pb-20 pt-36 text-white md:pb-28 md:pt-48">
        <div className="mx-auto max-w-[1400px] px-6 md:px-12">
          <p className="antetitulo mb-6 text-trigo">Recetario Esperanza</p>
          <h1 className="max-w-[16ch] font-display text-[clamp(3rem,8.4vw,8rem)] leading-[0.92] tracking-[-0.025em]">
            La cocina venezolana, receta por receta
          </h1>
          <p className="mt-8 max-w-xl text-lg leading-relaxed text-white/70">
            Recetas de siempre, hechas con los productos de siempre. Hoy son{" "}
            {recetas.length}; el banco sigue creciendo.
          </p>
        </div>
      </section>
      <section className="textura-papel bg-white py-16 md:py-24">
        <div className="mx-auto max-w-[1400px] px-6 md:px-12">
          <div
            role="group"
            aria-label="Filtrar recetas por categoría"
            className="-mx-6 flex gap-3 overflow-x-auto px-6 pb-1 md:mx-0 md:flex-wrap md:overflow-visible md:px-0 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
          >
            <button
              type="button"
              aria-pressed={filtro === null}
              onClick={() => setFiltro(null)}
              className={`dato shrink-0 whitespace-nowrap rounded-md border px-5 py-3.5 transition-colors ${
                filtro === null
                  ? "border-llano bg-llano text-white"
                  : "border-tinta/20 text-tinta hover:border-trigo hover:bg-trigo"
              }`}
            >
              Todas
              <span className={filtro === null ? "text-trigo" : "text-tinta-suave"}>
                {" "}
                {recetas.length}
              </span>
            </button>
            {categorias.map((cat) => {
              const activo = filtro === cat;
              return (
                <button
                  key={cat}
                  type="button"
                  aria-pressed={activo}
                  onClick={() => setFiltro(cat)}
                  className={`dato shrink-0 whitespace-nowrap rounded-md border px-5 py-3.5 transition-colors ${
                    activo
                      ? "border-llano bg-llano text-white"
                      : "border-tinta/20 text-tinta hover:border-trigo hover:bg-trigo"
                  }`}
                >
                  {cat}
                  <span className={activo ? "text-trigo" : "text-tinta-suave"}>
                    {" "}
                    {conteo(cat)}
                  </span>
                </button>
              );
            })}
          </div>
          <p aria-live="polite" className="dato mt-8 text-tinta-suave">
            {lista.length} {lista.length === 1 ? "receta" : "recetas"}
          </p>
          <ul className="mt-8 grid grid-cols-1 gap-x-6 gap-y-14 sm:grid-cols-2 lg:grid-cols-3">
            {lista.map((r, i) => (
              <TarjetaReceta key={r.slug} receta={r} indice={i} />
            ))}
          </ul>
        </div>
      </section>
    </>
  );
}

function TarjetaReceta({
  receta,
  indice,
}: {
  receta: (typeof recetas)[number];
  indice: number;
}) {
  const { ref, visible } = useRevelar<HTMLLIElement>(0.15);
  const delay = Math.min(indice, 8) * 90;

  return (
    <li
      ref={ref}
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? "translateY(0)" : "translateY(28px)",
        transition: `opacity .9s cubic-bezier(.16,1,.3,1) ${delay}ms, transform .9s cubic-bezier(.16,1,.3,1) ${delay}ms`,
      }}
    >
      <Link to="/recetario/$slug" params={{ slug: receta.slug }} className="group block">
        <div className="relative aspect-[3/2] overflow-hidden rounded-lg bg-crudo-hondo">
          <img
            src={receta.imagen}
            alt={receta.nombre}
            loading="lazy"
            className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 ease-asiento group-hover:scale-105"
          />
        </div>
        <div className="mt-5">
          <p className="antetitulo text-esperanza">{receta.categorias.join(" · ")}</p>
          <h2 className="mt-3 font-display text-3xl leading-tight text-tinta md:text-2xl">
            {receta.nombre}
          </h2>
          <p className="dato mt-3 text-tinta-suave">
            {receta.tiempo} ·{" "}
            {/^\d+$/.test(receta.porciones)
              ? `${receta.porciones} porciones`
              : receta.porciones}
          </p>
        </div>
      </Link>
    </li>
  );
}
