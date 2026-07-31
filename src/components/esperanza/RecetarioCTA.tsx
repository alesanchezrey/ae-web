import { Link } from "@tanstack/react-router";
import { useRevelar } from "@/hooks/useProgresoScroll";
import { recetas } from "@/lib/esperanza";

const palabras = ["Más\u00a0", "de\u00a0", "18", "recetas\u00a0", "de\u00a0", "la", "cocina\u00a0", "venezolana"];
const destacadas = ["arroz-con-pollo", "arepas-clasicas", "torta-de-auyama"];

export function RecetarioCTA() {
  const { ref, visible } = useRevelar<HTMLElement>(0.35);
  const lista = destacadas
    .map((s) => recetas.find((r) => r.slug === s))
    .filter((r): r is NonNullable<typeof r> => !!r);

  return (
    <>
      <section
        id="recetario"
        ref={ref}
        className="textura-papel textura-papel-oscuro relative overflow-hidden bg-llano py-20 text-white md:py-36"
      >
        <div className="mx-auto max-w-[1100px] px-6 text-center md:px-12">
          <p className="antetitulo mb-8 text-trigo">Recetario Esperanza</p>
          <h2 className="font-display text-[clamp(2.7rem,8vw,7.6rem)] font-semibold leading-[0.94] tracking-[-0.02em]">
            {palabras.map((p, i) => (
              <span
                key={i}
                className="inline-block overflow-hidden pb-[0.08em] align-bottom"
              >
                <span
                  className="inline-block"
                  style={{
                    transform: visible ? "translateY(0)" : "translateY(105%)",
                    opacity: visible ? 1 : 0,
                    transition: `transform .85s cubic-bezier(.16,1,.3,1) ${85 * i}ms, opacity .6s ease ${85 * i}ms`,
                  }}
                >
                  {p === "18" ? <span className="text-trigo">&nbsp;{recetas.length}&nbsp;</span> : p}
                </span>
                {i < palabras.length - 1 && <span> </span>}
              </span>
            ))}
          </h2>
          <div
            style={{
              opacity: visible ? 1 : 0,
              transform: visible ? "translateY(0)" : "translateY(20px)",
              transition: `all .8s cubic-bezier(.16,1,.3,1) ${85 * palabras.length + 200}ms`,
            }}
          >
            <Link to="/recetario" className="btn btn-esperanza mt-12">
              Ir al recetario
            </Link>
          </div>
        </div>
      </section>
      <section className="textura-papel bg-white py-20 md:py-28">
        <div className="mx-auto grid max-w-[1400px] grid-cols-1 gap-12 px-6 md:grid-cols-12 md:px-12">
          <div className="md:col-span-4 md:pt-6">
            <p className="antetitulo mb-5 text-esperanza">Recetas</p>
            <h3 className="font-display text-[clamp(2.4rem,4.4vw,4.4rem)] leading-[0.98] tracking-[-0.02em] text-llano">
              Inspírate y cocina momentos especiales
            </h3>
            <div className="surco mt-7 w-32" />
            <Link to="/recetario" className="btn btn-llano mt-9">
              Ver todas las recetas
            </Link>
          </div>
          <ul className="-mx-6 flex snap-x snap-mandatory gap-5 overflow-x-auto px-6 sm:mx-0 sm:grid sm:grid-cols-3 sm:gap-8 sm:overflow-visible sm:px-0 md:col-span-8 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
            {lista.map((r) => (
              <li key={r.slug} className="w-[72vw] shrink-0 snap-center sm:w-auto">
                <Link
                  to="/recetario/$slug"
                  params={{ slug: r.slug }}
                  className="group block"
                >
                  <div className="relative aspect-[4/5] overflow-hidden rounded-lg">
                    <img
                      src={r.imagen}
                      alt={r.nombre}
                      loading="lazy"
                      className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 ease-asiento group-hover:scale-105"
                    />
                  </div>
                  <h4 className="mt-4 font-display text-2xl leading-tight text-tinta sm:text-xl">
                    {r.nombre}
                  </h4>
                  <p className="dato mt-2 text-tinta-suave">{r.tiempo}</p>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </section>
    </>
  );
}
