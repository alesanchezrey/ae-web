import { useEffect, useState } from "react";
import { DistribuidorForm } from "./DistribuidorForm";

const EVENTO = "esperanza:abrir-distribuidor";

export function abrirFormularioDistribuidor() {
  window.dispatchEvent(new CustomEvent(EVENTO));
}

export function FormularioDistribuidor() {
  const [abierto, setAbierto] = useState(false);

  useEffect(() => {
    const abrir = () => {
      setAbierto(true);
    };
    window.addEventListener(EVENTO, abrir);
    return () => window.removeEventListener(EVENTO, abrir);
  }, []);

  useEffect(() => {
    if (!abierto) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setAbierto(false);
    };
    window.addEventListener("keydown", onKey);
    const previo = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = previo;
    };
  }, [abierto]);

  if (!abierto) return null;

  return (
    <div
      className="fixed inset-0 z-[100] flex items-start justify-center overflow-y-auto bg-tinta/70 px-4 py-10 backdrop-blur-sm"
      onClick={() => setAbierto(false)}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-label="Formulario para distribuidores"
        onClick={(e) => e.stopPropagation()}
        className="relative w-full max-w-2xl rounded-xl bg-white p-7 shadow-2xl md:p-10"
      >
        <button
          type="button"
          onClick={() => setAbierto(false)}
          aria-label="Cerrar"
          className="dato absolute right-5 top-5 rounded-md border border-tinta/20 px-3 py-2 text-tinta-suave transition-colors hover:border-llano hover:text-llano"
        >
          Cerrar
        </button>

        <DistribuidorForm
          successFooter={
            <button type="button" onClick={() => setAbierto(false)} className="btn btn-esperanza mt-8">
              Volver al sitio
            </button>
          }
        />
      </div>
    </div>
  );
}
