import { Link } from "@tanstack/react-router";
import { INSTAGRAM, productos } from "@/lib/esperanza";

export function Footer() {
  return (
    <footer className="bg-llano text-white">
      <div className="surco surco-claro"></div>
      <div className="mx-auto grid max-w-[1400px] grid-cols-1 gap-12 px-6 py-16 md:grid-cols-12 md:px-12">
        <div className="md:col-span-4">
          <img
            src="/brand/logo-esperanza-productos.svg"
            alt="Alimentos Esperanza"
            loading="lazy"
            width={2804}
            height={1079}
            className="h-16 w-auto"
          />
          <p className="mt-6 max-w-xs leading-relaxed text-white/65 md:text-sm">
            ¡El sabor de la familia! Alimentos esenciales para cada mesa de Venezuela.
          </p>
        </div>
        <nav className="md:col-span-3" aria-label="Productos">
          <p className="antetitulo mb-5 text-trigo">Productos</p>
          <ul className="space-y-3">
            {productos.map((p) => (
              <li key={p.slug}>
                <Link
                  to="/productos/$slug"
                  params={{ slug: p.slug }}
                  className="block py-1 text-base text-white/75 transition-colors hover:text-trigo md:py-0 md:text-sm"
                >
                  {p.nombre} · {p.presentacion}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
        <nav className="md:col-span-2" aria-label="Secciones">
          <p className="antetitulo mb-5 text-trigo">Sitio</p>
          <ul className="space-y-3">
            <li>
              <Link
                to="/"
                className="block py-1 text-base text-white/75 transition-colors hover:text-trigo md:py-0 md:text-sm"
              >
                Inicio
              </Link>
            </li>
            <li>
              <Link
                to="/recetario"
                className="block py-1 text-base text-white/75 transition-colors hover:text-trigo md:py-0 md:text-sm"
              >
                Recetario
              </Link>
            </li>
            <li>
              <a
                href="/#origen"
                className="block py-1 text-base text-white/75 transition-colors hover:text-trigo md:py-0 md:text-sm"
              >
                Origen
              </a>
            </li>
            <li>
              <a
                href="/#contacto"
                className="block py-1 text-base text-white/75 transition-colors hover:text-trigo md:py-0 md:text-sm"
              >
                Contacto
              </a>
            </li>
          </ul>
        </nav>
        <div className="md:col-span-3">
          <p className="antetitulo mb-5 text-trigo">Contacto</p>
          <a
            href={INSTAGRAM}
            target="_blank"
            rel="noopener noreferrer"
            className="block py-1 text-base text-white/75 transition-colors hover:text-trigo md:py-0 md:text-sm"
          >
            @alimentosesperanza
          </a>
          <address className="mt-4 not-italic leading-relaxed text-white/65 md:text-sm">
            Ctra. vía San Carlos, prolongación Avenida Páez
            <br />
            Local-oficina N.º S/N, sector Miraflores
            <br />
            Araure, estado Portuguesa — Venezuela
          </address>
        </div>
      </div>
      <div className="border-t border-white/12">
        <div className="mx-auto flex max-w-[1400px] flex-wrap items-center justify-between gap-4 px-6 py-6 md:px-12">
          <p className="text-sm text-white/45">© 2026 Alimentos Esperanza</p>
          <img
            src="/brand/agricola-vr.svg"
            alt="Agrícola VR"
            loading="lazy"
            width={85}
            height={37}
            className="h-12 w-auto opacity-95"
          />
        </div>
      </div>
    </footer>
  );
}
