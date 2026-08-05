import { useRevelar } from "@/hooks/useProgresoScroll";
import esperanzaLogo from "@/assets/alimentos-esperanza.png.asset.json";
import vrTradeLogo from "@/assets/vr-trade.png.asset.json";
import agricolaLogo from "@/assets/agricola-vr.png.asset.json";

const empresas = [
  { nombre: "Alimentos Esperanza", src: esperanzaLogo.url },
  { nombre: "VR Trade LLC — Global Food Solutions", src: vrTradeLogo.url },
  { nombre: "Agrícola VR, C.A.", src: agricolaLogo.url },
];

export function GrupoEmpresarial() {
  const { ref, visible } = useRevelar<HTMLElement>(0.2);

  return (
    <section
      id="grupo-empresarial"
      ref={ref}
      className="textura-papel bg-white py-20 md:py-28"
    >
      <div className="mx-auto max-w-[1400px] px-6 md:px-12">
        <div
          style={{
            opacity: visible ? 1 : 0,
            transform: visible ? "translateY(0)" : "translateY(20px)",
            transition: "all .8s cubic-bezier(.16,1,.3,1)",
          }}
        >
          <p className="antetitulo mb-5 text-esperanza">Grupo empresarial</p>
          <h2 className="max-w-3xl font-display text-[clamp(2.4rem,4.4vw,4.4rem)] leading-[0.98] tracking-[-0.02em] text-llano">
            Nuestro grupo empresarial
          </h2>
          <div className="surco mt-7 w-32" />
        </div>
        <ul className="mt-14 grid grid-cols-1 items-center gap-12 sm:grid-cols-3 md:gap-16">
          {empresas.map((e, i) => (
            <li
              key={e.nombre}
              className="flex items-center justify-center"
              style={{
                opacity: visible ? 1 : 0,
                transform: visible ? "translateY(0)" : "translateY(24px)",
                transition: `all .8s cubic-bezier(.16,1,.3,1) ${150 + i * 120}ms`,
              }}
            >
              <img
                src={e.src}
                alt={e.nombre}
                loading="lazy"
                className="h-32 w-auto max-w-full object-contain md:h-40"
              />
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
