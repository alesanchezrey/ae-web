import { useRevelar } from "@/hooks/useProgresoScroll";
import { useState } from "react";

const VIMEO_ID = "1214133477";

function PlayIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 84 84" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
      <circle cx="42" cy="42" r="42" fill="currentColor" className="text-white/90" />
      <path d="M34 28L58 42L34 56V28Z" fill="#1a1a1a" />
    </svg>
  );
}

export function Distribucion() {
  const video = useRevelar<HTMLDivElement>(0.2);
  const [reproduciendo, setReproduciendo] = useState(false);

  const srcInicial = `https://player.vimeo.com/video/${VIMEO_ID}?autoplay=0&loop=1&muted=0&background=0&controls=1&title=0&byline=0&portrait=0&badge=0&autopause=0&player_id=0&app_id=58479`;
  const srcActivo = `https://player.vimeo.com/video/${VIMEO_ID}?autoplay=1&loop=1&muted=0&background=0&controls=1&title=0&byline=0&portrait=0&badge=0&autopause=0&player_id=0&app_id=58479`;

  return (
    <section className="textura-papel bg-white pt-24 md:pt-32">
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
        <div className="relative aspect-video w-full overflow-hidden bg-neutral-900">
          <iframe
            src={reproduciendo ? srcActivo : srcInicial}
            title="Distribución Alimentos Esperanza"
            allow="autoplay; fullscreen; picture-in-picture"
            allowFullScreen
            loading="lazy"
            className="absolute inset-0 h-full w-full border-0"
          />
          {!reproduciendo && (
            <button
              type="button"
              onClick={() => setReproduciendo(true)}
              aria-label="Reproducir video"
              className="absolute inset-0 z-10 flex cursor-pointer items-center justify-center bg-black/20 transition-colors hover:bg-black/30"
            >
              <PlayIcon className="h-20 w-20 drop-shadow-lg md:h-28 md:w-28" />
            </button>
          )}
        </div>
      </div>
    </section>
  );
}
