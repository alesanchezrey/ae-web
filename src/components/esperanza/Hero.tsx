import { useRef } from "react";
import { tramo, useProgresoScroll } from "@/hooks/useProgresoScroll";
import { SecuenciaFrames } from "./SecuenciaFrames";

export function Hero() {
  const ref = useRef<HTMLElement | null>(null);
  const { progreso, progresoRef } = useProgresoScroll(ref);

  const opacidadTitulo = 1 - tramo(progreso, 0.05, 0.28);
  const blur = 26 * tramo(progreso, 0.05, 0.28);
  const escala = 1 + 0.14 * tramo(progreso, 0, 0.28);
  const opacidadFrase = tramo(progreso, 0.34, 0.5) * (1 - tramo(progreso, 0.9, 1));
  const yFrase = (1 - tramo(progreso, 0.34, 0.5)) * 34;
  const blanco = tramo(progreso, 0.93, 1);

  return (
    <section
      ref={ref}
      id="inicio"
      className="relative h-[280vh] bg-white"
      aria-label="El sabor de la familia"
    >
      <div className="sticky top-0 h-screen w-full overflow-hidden">
        <SecuenciaFrames
          base="/frames"
          totalEscritorio={96}
          totalMovil={64}
          progresoRef={progresoRef}
        />
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-black/35 via-black/10 to-black/35" />
        <div className="pointer-events-none absolute inset-0 flex items-center justify-center px-6">
          <h1
            className="text-center font-display leading-[0.82] text-white"
            style={{
              opacity: opacidadTitulo,
              filter: `blur(${blur}px)`,
              transform: `scale(${escala})`,
              textShadow: "0 4px 40px rgba(0,0,0,0.35)",
              visibility: opacidadTitulo < 0.01 ? "hidden" : "visible",
            }}
          >
            <span
              className="block font-black uppercase tracking-[-0.025em]"
              style={{ fontSize: "clamp(3.1rem, 10.5vw, 11rem)" }}
            >
              El sabor
            </span>
            <span
              className="-mt-[0.07em] block font-light italic tracking-[-0.015em]"
              style={{ fontSize: "clamp(3.3rem, 11.4vw, 12rem)" }}
            >
              de la familia
            </span>
          </h1>
        </div>
        <div className="pointer-events-none absolute inset-0 flex items-center justify-center px-6">
          <p
            className="text-center font-display font-light italic text-white"
            style={{
              opacity: opacidadFrase,
              transform: `translateY(${yFrase}px)`,
              textShadow: "0 4px 40px rgba(0,0,0,0.4)",
              fontSize: "clamp(2.2rem, 6.9vw, 6.1rem)",
              visibility: opacidadFrase < 0.01 ? "hidden" : "visible",
            }}
          >
            De los campos a tu mesa…
          </p>
        </div>
        <div
          className="pointer-events-none absolute inset-x-0 bottom-10 flex flex-col items-center gap-3"
          style={{ opacity: 1 - tramo(progreso, 0, 0.12) }}
        >
          <span className="antetitulo text-white/70">Desliza para descubrir</span>
          <span className="block h-10 w-px bg-white/50" />
        </div>
        <div
          className="pointer-events-none absolute inset-0 bg-white"
          style={{ opacity: blanco }}
        />
        <div
          className="pointer-events-none absolute inset-x-0 bottom-0 h-[38vh] bg-gradient-to-b from-transparent to-white"
          style={{ opacity: tramo(progreso, 0.68, 0.95) }}
        />
      </div>
    </section>
  );
}
