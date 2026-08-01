import { useRevelar } from "@/hooks/useProgresoScroll";
import { INSTAGRAM } from "@/lib/esperanza";

export function Contacto() {
  const { ref, visible } = useRevelar<HTMLDivElement>(0.2);
  const rev = (delay: number) => ({
    opacity: visible ? 1 : 0,
    transform: visible ? "translateY(0)" : "translateY(28px)",
    transition: `opacity .9s cubic-bezier(.16,1,.3,1) ${delay}ms, transform .9s cubic-bezier(.16,1,.3,1) ${delay}ms`,
  });

  return (
    <section id="contacto" className="textura-papel bg-white py-28 md:py-36">
      <div
        ref={ref}
        className="mx-auto grid max-w-[1400px] grid-cols-1 gap-16 px-6 md:grid-cols-12 md:px-12"
      >
        <div className="md:col-span-6">
          <div style={rev(0)}>
            <p className="antetitulo mb-6 text-esperanza">Contacto</p>
            <h2 className="font-display text-[clamp(3.6rem,10vw,10rem)] leading-[0.86] tracking-[-0.03em] text-tinta">
              Hablemos
            </h2>
            <p className="mt-8 max-w-md text-lg leading-relaxed text-tinta-suave">
              Pedidos, distribución y alianzas — llena el formulario y nos pondremos en contacto.
            </p>
            <a
              href={INSTAGRAM}
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-esperanza mt-10"
            >
              SER DISTRIBUIDOR
            </a>
          </div>
        </div>
        <div className="md:col-span-6 md:pt-4">
          <div style={rev(150)}>
            <div className="surco mb-10 w-32" />
            <dl className="space-y-8">
              <div>
                <dt className="dato text-tinta-suave">Instagram</dt>
                <dd className="mt-2">
                  <a
                    href={INSTAGRAM}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-display text-2xl text-llano underline-offset-4 hover:underline"
                  >
                    @alimentosesperanza
                  </a>
                </dd>
              </div>
              <div>
                <dt className="dato text-tinta-suave">Base de operación</dt>
                <dd className="mt-2 font-display text-2xl leading-snug text-tinta">
                  Ctra. vía San Carlos, prolongación Avenida Páez
                  <br />
                  Local-oficina N.º S/N, sector Miraflores
                  <br />
                  Araure, estado Portuguesa — Venezuela
                </dd>
              </div>
            </dl>
          </div>
        </div>
      </div>
    </section>
  );
}
