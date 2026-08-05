import { useRef } from "react";
import { useParallax, useRevelar } from "@/hooks/useProgresoScroll";

export function Origen() {
  const seccion = useRef<HTMLElement | null>(null);
  const y = useParallax(seccion, 0.12);
  const { ref, visible } = useRevelar<HTMLDivElement>(0.25);

  return (
    <section
      id="origen"
      ref={seccion}
      className="relative flex min-h-[85vh] items-center overflow-hidden"
    >
      <div className="absolute inset-0 -top-[12%] h-[124%]">
        <img
          src="/fotos/origen-portuguesa.jpg"
          alt="Siembra de arroz en el llano de Portuguesa"
          loading="lazy"
          className="absolute inset-0 h-full w-full object-cover"
          style={{ transform: `translate3d(0, ${y}px, 0)` }}
        />
      </div>
      <div className="absolute inset-0 bg-gradient-to-r from-llano/70 via-llano/35 to-transparent" />
      <div className="relative mx-auto w-full max-w-[1400px] px-6 py-24 md:px-12">
        <div
          ref={ref}
          className="vidrio-oscuro max-w-xl rounded-xl p-9 text-white md:p-12"
          style={{
            opacity: visible ? 1 : 0,
            transform: visible ? "translateY(0)" : "translateY(28px)",
            transition:
              "opacity .9s cubic-bezier(.16,1,.3,1), transform .9s cubic-bezier(.16,1,.3,1)",
          }}
        >
          <p className="antetitulo mb-6 text-trigo">Origen</p>
          <h2 className="font-display text-[clamp(2.8rem,6.8vw,6.8rem)] leading-[0.94] tracking-[-0.02em]">
            Portuguesa, Venezuela
          </h2>
          <p className="mt-6 text-lg leading-relaxed text-white/80">
            Desde los fértiles campos de Portuguesa hasta tu familia, con
            productores locales que siembran con manos venezolanas, impulsando el
            desarrollo económico y alimentando el futuro del país.
          </p>
          <div className="surco surco-claro mt-10 w-48" />
        </div>
      </div>
    </section>
  );
}
