import { useRevelar } from "@/hooks/useProgresoScroll";
import { Check } from "lucide-react";
import { DistribuidorForm } from "./DistribuidorForm";

const beneficios = [
  "Atención comercial directa y cercana.",
  "Descuentos definidos según volumenes de compra.",
  "Material POP y exhibición atractiva.",
  "Estrategias de posicionamiento en el mercado.",
  "Crecer de la mano con la calidad que trasciende.",
];

export function ProgramaDistribuidores() {
  const { ref, visible } = useRevelar<HTMLElement>(0.2);
  const rev = (delay: number) => ({
    opacity: visible ? 1 : 0,
    transform: visible ? "translateY(0)" : "translateY(28px)",
    transition: `opacity .9s cubic-bezier(.16,1,.3,1) ${delay}ms, transform .9s cubic-bezier(.16,1,.3,1) ${delay}ms`,
  });

  return (
    <section ref={ref} className="textura-papel bg-white py-28 md:py-36">
      <div className="mx-auto grid max-w-[1400px] grid-cols-1 gap-12 px-6 md:grid-cols-12 md:gap-16 md:px-12">
        <div className="md:col-span-5">
          <div style={rev(0)}>
            <p className="antetitulo mb-6 text-esperanza">Programa de Distribuidores</p>
            <h2 className="font-display text-[clamp(2.8rem,5.5vw,4.8rem)] leading-[0.95] tracking-[-0.02em] text-tinta">
              Forma parte de la familia Alimentos Esperanza
            </h2>
            <div className="surco mt-8 w-32" />
            <ul className="mt-10 space-y-5">
              {beneficios.map((b, i) => (
                <li
                  key={i}
                  className="flex items-start gap-4 text-lg leading-relaxed text-tinta-suave"
                  style={rev(100 + i * 80)}
                >
                  <span className="mt-1.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-esperanza/10 text-esperanza">
                    <Check size={12} strokeWidth={3} />
                  </span>
                  <span>{b}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="md:col-span-7">
          <div
            className="textura-papel rounded-xl border border-tinta/10 bg-white p-6 shadow-xl md:p-10"
            style={rev(200)}
          >
            <p className="antetitulo mb-3 text-esperanza">Solicitud</p>
            <h3 className="font-display text-2xl leading-tight text-tinta md:text-3xl">
              Sé distribuidor oficial
            </h3>
            <p className="mt-3 max-w-lg text-base leading-relaxed text-tinta-suave">
              Establece contacto con nuestro equipo de expertos.
            </p>
            <DistribuidorForm className="mt-8" />
          </div>
        </div>
      </div>
    </section>
  );
}
