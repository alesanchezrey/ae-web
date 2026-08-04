import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import {
  productoPorSlug,
  recetaPorSlug,
  recetas,
  type Receta,
} from "@/lib/esperanza";
import { urlAbsoluta } from "@/lib/site";
import { useRevelar } from "@/hooks/useProgresoScroll";

export const Route = createFileRoute("/recetario/$slug")({
  loader: ({ params }) => {
    const receta = recetaPorSlug(params.slug);
    if (!receta) throw notFound();
    return { receta };
  },
  head: ({ params, loaderData }) => {
    if (!loaderData) {
      return {
        meta: [{ title: "Receta no encontrada — Esperanza" }, { name: "robots", content: "noindex" }],
      };
    }
    const r = loaderData.receta;
    const titulo = `${r.nombre} — Recetario Esperanza`;
    const descripcion = `${r.nombre}: receta venezolana para ${r.porciones} en ${r.tiempo}, con productos Alimentos Esperanza.`;
    const url = urlAbsoluta(`/recetario/${params.slug}`);
    const imagen = urlAbsoluta(r.imagen);
    return {
      meta: [
        { title: titulo },
        { name: "description", content: descripcion },
        { property: "og:title", content: titulo },
        { property: "og:description", content: descripcion },
        { property: "og:type", content: "article" },
        { property: "og:url", content: url },
        { property: "og:image", content: imagen },
        { name: "twitter:card", content: "summary_large_image" },
        { name: "twitter:image", content: imagen },
      ],
      links: [{ rel: "canonical", href: url }],
      scripts: [
        {
          type: "application/ld+json",
          children: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Recipe",
            name: r.nombre,
            image: imagen,
            url,
            recipeCategory: r.categorias[0],
            recipeYield: r.porciones,
            totalTime: r.tiempo,
            recipeCuisine: "Venezolana",
            recipeIngredient: r.ingredientes,
            recipeInstructions: r.pasos.map((p) => ({
              "@type": "HowToStep",
              text: p,
            })),
            author: { "@type": "Organization", name: "Alimentos Esperanza" },
          }),
        },
      ],
    };
  },
  component: DetalleReceta,
});

function DetalleReceta() {
  const { slug } = Route.useParams();
  const receta = recetaPorSlug(slug) as Receta;
  const usados = receta.productos
    .map((s) => productoPorSlug(s))
    .filter((p): p is NonNullable<typeof p> => !!p);
  const relacionadas = recetas
    .filter(
      (r) =>
        r.slug !== receta.slug &&
        r.productos.some((p) => receta.productos.includes(p)),
    )
    .slice(0, 3);

  return (
    <>
      <section className="bg-llano pb-16 pt-32 text-white md:pb-20 md:pt-44">
        <div className="mx-auto max-w-[1400px] px-6 md:px-12">
          <Link
            to="/recetario"
            className="antetitulo text-white/60 transition-colors hover:text-trigo"
          >
            ← Recetario
          </Link>
          <p className="antetitulo mt-8 text-trigo">{receta.categorias.join(" · ")}</p>
          <h1 className="mt-4 max-w-[14ch] font-display text-[clamp(2.9rem,7.4vw,7.2rem)] leading-[0.92] tracking-[-0.025em]">
            {receta.nombre}
          </h1>
          <dl className="mt-10 flex flex-wrap gap-x-12 gap-y-5 border-t border-white/15 pt-8">
            <div>
              <dt className="dato text-white/50">Porciones</dt>
              <dd className="mt-2 font-display text-xl">{receta.porciones}</dd>
            </div>
            <div>
              <dt className="dato text-white/50">Tiempo</dt>
              <dd className="mt-2 font-display text-xl">{receta.tiempo}</dd>
            </div>
            <div>
              <dt className="dato text-white/50">Productos Esperanza</dt>
              <dd className="mt-2 font-display text-xl">{receta.productos.length}</dd>
            </div>
          </dl>
        </div>
      </section>

      <div className="relative mx-auto -mt-8 aspect-[3/2] w-full max-w-[1400px] px-6 md:px-12">
        <div className="relative h-full w-full overflow-hidden rounded-lg bg-crudo-hondo">
          <img
            src={receta.imagen}
            alt={receta.nombre}
            className="absolute inset-0 h-full w-full object-cover"
          />
        </div>
      </div>

      <Preparacion receta={receta} />

      {usados.length > 0 && (
        <section className="textura-papel bg-white py-20 md:py-24">
          <div className="mx-auto max-w-[1400px] px-6 md:px-12">
            <p className="antetitulo mb-10 text-esperanza">Hecha con</p>
            <ul className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {usados.map((p) => (
                <li key={p.slug}>
                  <Link
                    to="/productos/$slug"
                    params={{ slug: p.slug }}
                    className="group flex items-center gap-5 rounded-lg border border-tinta/12 p-5 transition-colors hover:border-trigo"
                  >
                    <div className="relative h-28 w-20 shrink-0">
                      <img
                        src={p.imagen}
                        alt={`Empaque de ${p.nombre} ${p.presentacion}`}
                        loading="lazy"
                        className="absolute inset-0 h-full w-full object-contain transition-transform duration-500 ease-asiento group-hover:scale-105"
                      />
                    </div>
                    <div>
                      <h3 className="font-display text-xl leading-tight text-tinta md:text-lg">
                        {p.nombre}
                      </h3>
                      <p className="dato mt-2 text-tinta-suave">{p.presentacion}</p>
                    </div>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </section>
      )}

      {relacionadas.length > 0 && (
        <section className="textura-papel bg-white py-20 md:py-24">
          <div className="mx-auto max-w-[1400px] px-6 md:px-12">
            <div className="flex flex-wrap items-end justify-between gap-6">
              <h2 className="font-display text-4xl text-tinta md:text-4xl">
                Seguir cocinando
              </h2>
              <Link to="/recetario" className="btn btn-linea text-tinta">
                Ver todas
              </Link>
            </div>
            <ul className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-3">
              {relacionadas.map((r) => (
                <li key={r.slug}>
                  <Link
                    to="/recetario/$slug"
                    params={{ slug: r.slug }}
                    className="group block"
                  >
                    <div className="relative aspect-[3/2] overflow-hidden rounded-lg bg-crudo-hondo">
                      <img
                        src={r.imagen}
                        alt={r.nombre}
                        loading="lazy"
                        className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 ease-asiento group-hover:scale-105"
                      />
                    </div>
                    <h3 className="mt-4 font-display text-2xl leading-tight text-tinta md:text-xl">
                      {r.nombre}
                    </h3>
                    <p className="dato mt-2 text-tinta-suave">{r.tiempo}</p>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </section>
      )}
    </>
  );
}

function Preparacion({ receta }: { receta: Receta }) {
  const izq = useRevelar<HTMLDivElement>(0.15);
  const der = useRevelar<HTMLDivElement>(0.15);
  const anim = (visible: boolean, delay: number) => ({
    opacity: visible ? 1 : 0,
    transform: visible ? "translateY(0)" : "translateY(28px)",
    transition: `opacity .9s cubic-bezier(.16,1,.3,1) ${delay}ms, transform .9s cubic-bezier(.16,1,.3,1) ${delay}ms`,
  });

  return (
    <section className="textura-papel bg-white py-20 md:py-28">
      <div className="mx-auto grid max-w-[1400px] grid-cols-1 gap-14 px-6 md:grid-cols-12 md:px-12">
        <div className="md:col-span-5">
          <div ref={izq.ref} style={anim(izq.visible, 0)}>
            <h2 className="font-display text-4xl text-tinta md:text-4xl">Ingredientes</h2>
            <div className="surco mt-5 w-24" />
            <ul className="mt-8 space-y-4">
              {receta.ingredientes.map((ing) => (
                <li
                  key={ing}
                  className="flex gap-4 border-b border-tinta/10 pb-4 text-tinta-suave"
                >
                  <span className="mt-2 block h-1.5 w-1.5 shrink-0 bg-trigo" />
                  {ing}
                </li>
              ))}
            </ul>
          </div>
        </div>
        <div className="md:col-span-7">
          <div ref={der.ref} style={anim(der.visible, 120)}>
            <h2 className="font-display text-4xl text-tinta md:text-4xl">Preparación</h2>
            <div className="surco mt-5 w-24" />
            <ol className="mt-8 space-y-8">
              {receta.pasos.map((paso, i) => (
                <li key={paso} className="flex gap-6">
                  <span className="dato shrink-0 pt-1 text-esperanza">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <p className="text-lg leading-relaxed text-tinta">{paso}</p>
                </li>
              ))}
            </ol>
            {receta.tip && (
              <p className="mt-12 border-l-2 border-trigo bg-white p-6 font-display text-xl italic leading-relaxed text-tinta">
                {receta.tip}
              </p>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
