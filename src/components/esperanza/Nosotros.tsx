import { useRevelar } from "@/hooks/useProgresoScroll";

export function Nosotros() {
  const { ref, visible } = useRevelar<HTMLDivElement>(0.2);
  const rev = (delay: number) => ({
    opacity: visible ? 1 : 0,
    transform: visible ? "translateY(0)" : "translateY(28px)",
    transition: `opacity .9s cubic-bezier(.16,1,.3,1) ${delay}ms, transform .9s cubic-bezier(.16,1,.3,1) ${delay}ms`,
  });

  return (
    <section id="nosotros" className="textura-papel bg-white pt-24 md:pt-32">
      <div
        ref={ref}
        className="mx-auto grid max-w-[1400px] grid-cols-1 gap-14 px-6 md:grid-cols-12 md:px-12"
      >
        <div className="md:col-span-6">
          <p className="antetitulo mb-6 text-esperanza">Nosotros</p>
          <h2 className="font-display text-[clamp(3rem,7.2vw,7rem)] leading-[0.92] tracking-[-0.02em] text-llano">
            <span className="block font-semibold" style={rev(0)}>
              Cocinamos
            </span>
            <span className="block font-light italic" style={rev(160)}>
              con esperanza.
            </span>
          </h2>
        </div>
        <div className="md:col-span-6 md:pt-6">
          <div style={rev(320)}>
            <div className="surco mb-8 w-32" />
            <p className="max-w-md text-lg leading-relaxed text-tinta-suave">
              Empresa agroindustrial venezolana con base de operación en Portuguesa,
              dedicada a llevar alimentos esenciales a cada mesa del país.
            </p>
            <dl className="mt-10 grid grid-cols-2 gap-x-6 gap-y-8 border-t border-tinta/10 pt-8">
              {[
                ["Sector", "Agroindustria"],
                ["Base", "Portuguesa"],
                ["Línea", "5 productos"],
                ["Promesa", "100% Natural"],
              ].map(([dt, dd]) => (
                <div key={dt}>
                  <dt className="dato text-tinta-suave">{dt}</dt>
                  <dd className="mt-2 font-display text-xl text-tinta">{dd}</dd>
                </div>
              ))}
            </dl>
          </div>
        </div>
      </div>
      <div className="mt-20 md:mt-28">
        <video
          className="h-[60vh] w-full object-cover md:h-[85vh]"
          src="/fotos/linea-esperanza.mp4"
          poster="/fotos/linea-esperanza-poster.jpg"
          autoPlay
          loop
          muted
          playsInline
          preload="metadata"
          aria-label="La línea completa de productos Alimentos Esperanza sobre una mesa de madera en el llano"
        />
      </div>
    </section>
  );
}
