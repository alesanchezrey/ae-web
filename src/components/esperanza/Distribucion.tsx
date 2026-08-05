import { useRevelar } from "@/hooks/useProgresoScroll";

export function Distribucion() {
  const titulo = useRevelar<HTMLDivElement>(0.3);
  const video = useRevelar<HTMLDivElement>(0.2);

  return (
    <section className="textura-papel bg-white pt-24 md:pt-32">
      <div className="mx-auto max-w-[1400px] px-6 md:px-12">
        <div
          ref={titulo.ref}
          className="max-w-2xl"
          style={{
            opacity: titulo.visible ? 1 : 0,
            transform: titulo.visible ? "translateY(0)" : "translateY(28px)",
            transition:
              "opacity .9s cubic-bezier(.16,1,.3,1), transform .9s cubic-bezier(.16,1,.3,1)",
          }}
        >
          <p className="antetitulo mb-5 text-esperanza">Distribución</p>
          <h2 className="font-display text-[clamp(2.6rem,6.4vw,6.2rem)] leading-[0.98] tracking-[-0.02em] text-tinta">
            En el anaquel de tu bodega, tu abasto y tu supermercado.
          </h2>
        </div>
      </div>
      <div
        ref={video.ref}
        className="mt-16"
        style={{
          clipPath: video.visible ? "inset(0 0 0 0)" : "inset(0 0 100% 0)",
          transform: video.visible ? "scale(1)" : "scale(1.04)",
          transition:
            "clip-path 1.05s cubic-bezier(.16,1,.3,1), transform 1.35s cubic-bezier(.16,1,.3,1)",
        }}
      >
        <div className="relative aspect-video w-full overflow-hidden">
          <iframe
            src="https://player.vimeo.com/video/1214133477?autoplay=1&loop=1&muted=1&background=1&badge=0&autopause=0&player_id=0&app_id=58479"
            title="Distribución Alimentos Esperanza"
            allow="autoplay; fullscreen; picture-in-picture"
            allowFullScreen
            loading="lazy"
            className="absolute inset-0 h-full w-full border-0"
          />
        </div>
      </div>
    </section>
  );
}
