import { useEffect, useState } from "react";
import { z } from "zod";

const EVENTO = "esperanza:abrir-distribuidor";

const WEB3FORMS_ACCESS_KEY = "7305d7ee-766e-46eb-be56-cd53f7062661";
const WEB3FORMS_ENDPOINT = "https://api.web3forms.com/submit";

export function abrirFormularioDistribuidor() {
  window.dispatchEvent(new CustomEvent(EVENTO));
}

const esquema = z.object({
  nombre: z.string().trim().min(2, "Ingresa tu nombre").max(100, "Máximo 100 caracteres"),
  empresa: z.string().trim().max(120, "Máximo 120 caracteres"),
  email: z.string().trim().email("Correo inválido").max(255, "Máximo 255 caracteres"),
  telefono: z.string().trim().min(7, "Ingresa un teléfono válido").max(30, "Máximo 30 caracteres"),
  ciudad: z.string().trim().min(2, "Ingresa tu ciudad o estado").max(120, "Máximo 120 caracteres"),
  mensaje: z.string().trim().max(1000, "Máximo 1000 caracteres"),
});

type Campos = z.infer<typeof esquema>;

const inicial: Campos = {
  nombre: "",
  empresa: "",
  email: "",
  telefono: "",
  ciudad: "",
  mensaje: "",
};

export function FormularioDistribuidor() {
  const [abierto, setAbierto] = useState(false);
  const [valores, setValores] = useState<Campos>(inicial);
  const [errores, setErrores] = useState<Record<string, string>>({});
  const [enviado, setEnviado] = useState(false);

  useEffect(() => {
    const abrir = () => {
      setEnviado(false);
      setErrores({});
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

  const set = (campo: keyof Campos) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setValores((v) => ({ ...v, [campo]: e.target.value }));
  };

  const enviar = (e: React.FormEvent) => {
    e.preventDefault();
    const r = esquema.safeParse(valores);
    if (!r.success) {
      const errs: Record<string, string> = {};
      for (const i of r.error.issues) errs[String(i.path[0])] = i.message;
      setErrores(errs);
      return;
    }
    setErrores({});
    setEnviado(true);
    setValores(inicial);
  };

  const campoClase =
    "mt-2 w-full rounded-md border border-tinta/20 bg-white px-4 py-3 text-base text-tinta outline-none transition-colors placeholder:text-tinta-suave/60 focus:border-llano";

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
        className="textura-papel relative w-full max-w-2xl rounded-xl bg-white p-7 shadow-2xl md:p-10"
      >
        <button
          type="button"
          onClick={() => setAbierto(false)}
          aria-label="Cerrar"
          className="dato absolute right-5 top-5 rounded-md border border-tinta/20 px-3 py-2 text-tinta-suave transition-colors hover:border-llano hover:text-llano"
        >
          Cerrar
        </button>

        {enviado ? (
          <div className="py-10 text-center">
            <p className="antetitulo mb-5 text-esperanza">Solicitud enviada</p>
            <h2 className="font-display text-4xl leading-tight text-tinta md:text-5xl">
              ¡Gracias por escribirnos!
            </h2>
            <p className="mx-auto mt-6 max-w-md text-lg leading-relaxed text-tinta-suave">
              Recibimos tus datos y nuestro equipo comercial se pondrá en contacto contigo muy
              pronto.
            </p>
            <button type="button" onClick={() => setAbierto(false)} className="btn btn-esperanza mt-8">
              Volver al sitio
            </button>
          </div>
        ) : (
          <>
            <p className="antetitulo mb-4 text-esperanza">Distribuidores</p>
            <h2 className="font-display text-[clamp(2.4rem,5vw,3.6rem)] leading-[0.95] tracking-[-0.02em] text-tinta">
              Ser Distribuidor
            </h2>
            <p className="mt-4 max-w-lg text-base leading-relaxed text-tinta-suave">
              Cuéntanos sobre tu negocio y nos pondremos en contacto contigo.
            </p>

            <form onSubmit={enviar} noValidate className="mt-8 grid grid-cols-1 gap-5 sm:grid-cols-2">
              <Campo label="Nombre y apellido" error={errores["nombre"]}>
                <input
                  className={campoClase}
                  value={valores.nombre}
                  onChange={set("nombre")}
                  maxLength={100}
                  autoComplete="name"
                />
              </Campo>
              <Campo label="Empresa (opcional)" error={errores["empresa"]}>
                <input
                  className={campoClase}
                  value={valores.empresa}
                  onChange={set("empresa")}
                  maxLength={120}
                  autoComplete="organization"
                />
              </Campo>
              <Campo label="Correo electrónico" error={errores["email"]}>
                <input
                  type="email"
                  className={campoClase}
                  value={valores.email}
                  onChange={set("email")}
                  maxLength={255}
                  autoComplete="email"
                />
              </Campo>
              <Campo label="Teléfono" error={errores["telefono"]}>
                <input
                  type="tel"
                  className={campoClase}
                  value={valores.telefono}
                  onChange={set("telefono")}
                  maxLength={30}
                  autoComplete="tel"
                />
              </Campo>
              <Campo label="Ciudad / estado" error={errores["ciudad"]} ancho>
                <input
                  className={campoClase}
                  value={valores.ciudad}
                  onChange={set("ciudad")}
                  maxLength={120}
                />
              </Campo>
              <Campo label="Mensaje (opcional)" error={errores["mensaje"]} ancho>
                <textarea
                  rows={4}
                  className={`${campoClase} resize-none`}
                  value={valores.mensaje}
                  onChange={set("mensaje")}
                  maxLength={1000}
                />
              </Campo>
              <div className="sm:col-span-2">
                <button type="submit" className="btn btn-esperanza w-full sm:w-auto">
                  ENVIAR SOLICITUD
                </button>
              </div>
            </form>
          </>
        )}
      </div>
    </div>
  );
}

function Campo({
  label,
  error,
  ancho,
  children,
}: {
  label: string;
  error?: string | undefined;
  ancho?: boolean | undefined;
  children: React.ReactNode;
}) {
  return (
    <label className={`block ${ancho ? "sm:col-span-2" : ""}`}>
      <span className="dato text-tinta-suave">{label}</span>
      {children}
      {error && <span className="mt-2 block text-sm text-esperanza">{error}</span>}
    </label>
  );
}
