import { Link, useRouterState } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { abrirFormularioDistribuidor } from "./FormularioDistribuidor";

const enlaces = [
  { label: "Productos", href: "/#productos" },
  { label: "Recetario", href: "/recetario" },
  { label: "Origen", href: "/#origen" },
  { label: "Contacto", href: "/#contacto" },
];

export function Header() {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const esInicio = pathname === "/";
  const [bajado, setBajado] = useState(false);
  const [abierto, setAbierto] = useState(false);
  const solido = !esInicio || bajado;

  useEffect(() => {
    if (!esInicio) return;
    const onScroll = () => setBajado(window.scrollY > 0.85 * window.innerHeight);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [esInicio]);

  useEffect(() => {
    setAbierto(false);
  }, [pathname]);

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-all duration-500 ${
        solido
          ? "border-b border-white/10 bg-llano/92 backdrop-blur-xl backdrop-saturate-150"
          : "border-b border-white/15 bg-white/8 backdrop-blur-xl backdrop-saturate-150"
      }`}
    >
      <div className="mx-auto flex max-w-[1400px] items-center justify-between gap-6 px-5 py-4 md:px-10">
        <Link to="/" aria-label="Alimentos Esperanza — inicio" className="shrink-0">
          <img
            src="/brand/logo-esperanza-productos.svg"
            alt="Alimentos Esperanza"
            width={2804}
            height={1079}
            className="h-12 w-auto md:h-16"
          />
        </Link>
        <nav className="hidden items-center gap-8 lg:flex" aria-label="Principal">
          {enlaces.map((e) => (
            <a
              key={e.href}
              href={e.href}
              className="nav-enlace text-white/85 transition-colors hover:text-trigo"
            >
              {e.label}
            </a>
          ))}
        </nav>
        <div className="hidden items-center gap-3 lg:flex">
          <Link to="/recetario" className="btn btn-esperanza">
            Recetario
          </Link>
          <button
            type="button"
            onClick={abrirFormularioDistribuidor}
            className="btn btn-linea text-white"
          >
            Contactar
          </button>
        </div>
        <button
          type="button"
          onClick={() => setAbierto((v) => !v)}
          aria-expanded={abierto}
          aria-controls="menu-movil"
          className="nav-enlace flex items-center gap-2 rounded-md border border-white/50 px-4 py-3 uppercase tracking-[0.12em] text-white lg:hidden"
        >
          {abierto ? "Cerrar" : "Menú"}
        </button>
      </div>
      {abierto && (
        <div id="menu-movil" className="border-t border-white/15 bg-llano lg:hidden">
          <nav className="flex flex-col px-5 py-2" aria-label="Principal móvil">
            {enlaces.map((e) => (
              <a
                key={e.href}
                href={e.href}
                className="border-b border-white/10 py-5 font-display text-3xl text-white"
              >
                {e.label}
              </a>
            ))}
          </nav>
          <div className="flex flex-col gap-3 px-5 pb-6 pt-4">
            <Link to="/recetario" className="btn btn-esperanza">
              Recetario
            </Link>
            <button
              type="button"
              onClick={() => {
                setAbierto(false);
                abrirFormularioDistribuidor();
              }}
              className="btn btn-linea text-white"
            >
              Contactar
            </button>
          </div>
        </div>
      )}
    </header>
  );
}
