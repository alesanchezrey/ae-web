import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import {
  productoPorSlug,
  productos,
  recetasDeProducto,
  type Producto,
} from "@/lib/esperanza";
import { useRevelar } from "@/hooks/useProgresoScroll";
import { abrirFormularioDistribuidor } from "@/components/esperanza/FormularioDistribuidor";

export const Route = createFileRoute("/productos/$slug")({
  loader: ({ params }) => {
    const producto = productoPorSlug(params.slug);
    if (!producto) throw notFound();
    return { producto };
  },
  head: ({ params, loaderData }) => {
    if (!loaderData) {
      return {
        meta: [
          { title: "Producto no encontrado — Esperanza" },
          { name: "robots", content: "noindex" },
        ],
      };
    }
    const p = loaderData.producto;
    const titulo = `${p.nombre} ${p.presentacion} — Alimentos Esperanza`;
    return {
      meta: [
        { title: titulo },
        { name: "description", content: p.descripcionLarga },
        { property: "og:title", content: titulo },
        { property: "og:description", content: p.descripcionLarga },
        { property: "og:type", content: "product" },
        { property: "og:url", content: `/productos/${params.slug}` },
        { name: "twitter:card", content: "summary_large_image" },
      ],
      links: [{ rel: "canonical", href: `/productos/${params.slug}` }],
      scripts: [
        {
          type: "application/ld+json",
          children: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Product",
            name: `${p.nombre} ${p.presentacion}`,
            description: p.descripcionLarga,
            image: p.imagen,
            brand: { "@type": "Brand", name: "Alimentos Esperanza" },
          }),
        },
      ],
    };
  },
  component: DetalleProducto,
});

function DetalleProducto() {
  const { slug } = Route.useParams();
  const producto = productoPorSlug(slug) as Producto;
  const recetas = recetasDeProducto(producto.slug).slice(0, 4);
  const otros = productos.filter((p) => p.slug !== producto.slug);

  return (
    <>
      <section className="textura-papel bg-white pt-32 md:pt-40">
        <div className="mx-auto grid max-w-[1400px] grid-cols-1 items-start gap-12 px-6 pb-20 md:grid-cols-2 md:gap-16 md:px-12 md:pb-28">
          <div
            className="relative flex h-[46vh] items-center justify-center md:sticky md:top-28 md:h-[72vh] md:self-start"
            style={{
              background: `radial-gradient(60% 55% at 50% 55%, ${producto.acento}1f 0%, transparent 72%)`,
            }}
          >
            <div className="relative h-full w-full">
              <img
                src={producto.composicion}
                alt={`${producto.nombre} ${producto.presentacion} junto a su materia prima`}
                className="absolute inset-0 h-full w-full object-contain"
              />
            </div>
          </div>
          <div>
            <a
              href="/#productos"
              className="antetitulo text-tinta-suave transition-colors hover:text-llano"
            >
              ← Nuestros productos
            </a>
            <h1 className="mt-8 font-display text-[clamp(2.9rem,6.4vw,6.4rem)] leading-[0.94] tracking-[-0.025em] text-tinta">
              {producto.nombre}
            </h1>
            <p className="dato mt-5 text-tinta-suave">
              {producto.presentacion} · {producto.claim}
            </p>
            <div className="mt-8 h-px w-24" style={{ backgroundColor: producto.acento }} />
            <p className="mt-8 max-w-lg text-lg leading-relaxed text-tinta-suave md:text-lg">
              {producto.descripcionLarga}
            </p>
            <dl className="mt-12 grid grid-cols-2 gap-x-6 gap-y-7 border-t border-tinta/10 pt-8">
              {producto.atributos.map((a) => (
                <div key={a.etiqueta}>
                  <dt className="dato text-tinta-suave">{a.etiqueta}</dt>
                  <dd className="mt-2 font-display text-xl text-tinta">{a.valor}</dd>
                </div>
              ))}
            </dl>
            <button
              type="button"
              onClick={abrirFormularioDistribuidor}
              className="btn btn-esperanza mt-12"
            >
              SER DISTRIBUIDOR
            </button>
          </div>
        </div>
      </section>

      {producto.fotos.length > 0 && (
        <section className="textura-papel bg-white pt-20 md:pt-28">
          <div className="mx-auto max-w-[1400px] px-6 md:px-12">
            <p className="antetitulo mb-10 text-esperanza">En la cocina</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2">
            {producto.fotos.map((f, i) => (
              <FotoCocina key={f.src} src={f.src} alt={f.alt} indice={i} />
            ))}
          </div>
        </section>
      )}

      {recetas.length > 0 && (
        <section className="textura-papel bg-white py-20 md:py-28">
          <div className="mx-auto max-w-[1400px] px-6 md:px-12">
            <div className="flex flex-wrap items-end justify-between gap-6">
              <h2 className="font-display text-4xl leading-tight text-tinta md:text-5xl">
                Recetas con {producto.nombre}
              </h2>
              <Link to="/recetario" className="btn btn-linea text-tinta">
                Ver el recetario
              </Link>
            </div>
            <ul className="mt-12 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {recetas.map((r, i) => (
                <TarjetaReceta
                  key={r.slug}
                  slug={r.slug}
                  nombre={r.nombre}
                  imagen={r.imagen}
                  tiempo={r.tiempo}
                  indice={i}
                />
              ))}
            </ul>
          </div>
        </section>
      )}

      <section className="textura-papel bg-white py-20 md:py-24">
        <div className="mx-auto max-w-[1400px] px-6 md:px-12">
          <p className="antetitulo mb-10 text-esperanza">Toda la línea</p>
          <ul className="grid grid-cols-2 gap-4 sm:gap-6 lg:grid-cols-4">
            {otros.map((p) => (
              <li key={p.slug}>
                <Link
                  to="/productos/$slug"
                  params={{ slug: p.slug }}
                  className="group block rounded-lg border border-tinta/12 bg-white transition-colors hover:border-trigo"
                >
                  <div className="relative h-44">
                    <img
                      src={p.imagen}
                      alt={`Empaque de ${p.nombre} ${p.presentacion}`}
                      loading="lazy"
                      className="absolute inset-0 h-full w-full object-contain p-5 transition-transform duration-500 ease-asiento group-hover:scale-105"
                    />
                  </div>
                  <div className="border-t border-tinta/10 p-5">
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
    </>
  );
}

function FotoCocina({
  src,
  alt,
  indice,
}: {
  src: string;
  alt: string;
  indice: number;
}) {
  const { ref, visible } = useRevelar<HTMLDivElement>(0.15);
  return (
    <div
      ref={ref}
      style={{
        clipPath: visible ? "inset(0 0 0 0)" : "inset(0 0 100% 0)",
        transform: visible ? "scale(1)" : "scale(1.06)",
        transition: `clip-path 1.05s cubic-bezier(.16,1,.3,1) ${indice * 120}ms, transform 1.35s cubic-bezier(.16,1,.3,1) ${indice * 120}ms`,
      }}
    >
      <div className="relative aspect-[4/5] overflow-hidden sm:aspect-[4/3]">
        <img
          src={src}
          alt={alt}
          loading="lazy"
          className="absolute inset-0 h-full w-full object-cover"
        />
      </div>
    </div>
  );
}

function TarjetaReceta({
  slug,
  nombre,
  imagen,
  tiempo,
  indice,
}: {
  slug: string;
  nombre: string;
  imagen: string;
  tiempo: string;
  indice: number;
}) {
  const { ref, visible } = useRevelar<HTMLLIElement>(0.15);
  return (
    <li
      ref={ref}
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? "translateY(0)" : "translateY(28px)",
        transition: `opacity .9s cubic-bezier(.16,1,.3,1) ${indice * 90}ms, transform .9s cubic-bezier(.16,1,.3,1) ${indice * 90}ms`,
      }}
    >
      <Link to="/recetario/$slug" params={{ slug }} className="group block">
        <div className="relative aspect-[3/2] overflow-hidden rounded-lg bg-crudo-hondo">
          <img
            src={imagen}
            alt={nombre}
            loading="lazy"
            className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 ease-asiento group-hover:scale-105"
          />
        </div>
        <h3 className="mt-4 font-display text-2xl leading-tight text-tinta md:text-xl">
          {nombre}
        </h3>
        <p className="dato mt-2 text-tinta-suave">{tiempo}</p>
      </Link>
    </li>
  );
}
