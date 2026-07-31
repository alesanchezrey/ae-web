import { useRef } from "react";
import { tramo, useProgresoScroll } from "@/hooks/useProgresoScroll";

const lineas = ["Con esfuerzo", "y pasión", "reavivamos", "la esperanza", "venezolana"];

export function Frase() {
  const ref = useRef<HTMLElement | null>(null);
  const { progreso } = useProgresoScroll(ref);
  const n = tramo(progreso, 0.06, 0.78);
  const wght = Math.round(240 + 660 * n);
  const opsz = Math.round(9 + 135 * n);
  const soft = Math.round(100 * n);

  return (
    <section
      ref={ref}
      className="relative h-[240vh] bg-llano"
      aria-label="Con esfuerzo y pasión reavivamos la esperanza venezolana"
    >
      <div className="sticky top-0 flex h-screen items-center justify-center overflow-hidden px-6">
        <div
          className="absolute inset-0"
          style={{
            background: `radial-gradient(115% 85% at 50% 58%, rgba(232,177,77,${0.28 * n}) 0%, transparent 72%)`,
          }}
        />
        <h2
          className="relative text-center font-display uppercase"
          style={{
            fontSize: "clamp(1.9rem, 6.6vw, 6.2rem)",
            lineHeight: 0.98 - 0.12 * n,
            letterSpacing: `${-0.01 - 0.025 * n}em`,
            fontVariationSettings: `"wght" ${wght}, "opsz" ${opsz}, "SOFT" ${soft}`,
            color: `color-mix(in oklab, #E8B14D ${100 * n}%, #FFFFFF)`,
          }}
        >
          {lineas.map((linea, i) => {
            const t = tramo(progreso, 0.04 + 0.055 * i, 0.2 + 0.055 * i);
            return (
              <span key={linea} className="block overflow-hidden pb-[0.04em]">
                <span
                  className="block"
                  style={{ transform: `translateY(${(1 - t) * 108}%)`, opacity: t }}
                >
                  {linea}
                </span>
              </span>
            );
          })}
        </h2>
      </div>
    </section>
  );
}
