import { useState } from "react";
import { z } from "zod";

const WEB3FORMS_ACCESS_KEY = "7305d7ee-766e-46eb-be56-cd53f7062661";
const WEB3FORMS_ENDPOINT = "https://api.web3forms.com/submit";

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

interface DistribuidorFormProps {
  onSuccess?: () => void;
  successFooter?: React.ReactNode;
  className?: string;
  variant?: "light" | "red";
}

export function DistribuidorForm({ onSuccess, successFooter, className = "", variant = "light" }: DistribuidorFormProps) {
  const isRed = variant === "red";
  const [valores, setValores] = useState<Campos>(inicial);
  const [errores, setErrores] = useState<Record<string, string>>({});
  const [enviado, setEnviado] = useState(false);
  const [enviando, setEnviando] = useState(false);
  const [errorEnvio, setErrorEnvio] = useState<string | null>(null);

  const set = (campo: keyof Campos) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setValores((v) => ({ ...v, [campo]: e.target.value }));
  };

  const enviar = async (e: React.FormEvent) => {
    e.preventDefault();
    if (enviando) return;
    const r = esquema.safeParse(valores);
    if (!r.success) {
      const errs: Record<string, string> = {};
      for (const i of r.error.issues) errs[String(i.path[0])] = i.message;
      setErrores(errs);
      return;
    }
    setErrores({});
    setErrorEnvio(null);
    setEnviando(true);
    try {
      const respuesta = await fetch(WEB3FORMS_ENDPOINT, {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify({
          access_key: WEB3FORMS_ACCESS_KEY,
          subject: "Nueva solicitud de distribuidor — Alimentos Esperanza",
          from_name: "Alimentos Esperanza",
          nombre: r.data.nombre,
          empresa: r.data.empresa || "—",
          email: r.data.email,
          telefono: r.data.telefono,
          ciudad: r.data.ciudad,
          mensaje: r.data.mensaje || "—",
        }),
      });
      const datos = (await respuesta.json().catch(() => null)) as { success?: boolean; message?: string } | null;
      if (!respuesta.ok || !datos?.success) {
        throw new Error(datos?.message ?? "No pudimos enviar tu solicitud.");
      }
      setEnviado(true);
      setValores(inicial);
      onSuccess?.();
    } catch (err) {
      setErrorEnvio(
        err instanceof Error
          ? err.message
          : "Ocurrió un error al enviar. Intenta nuevamente en unos minutos.",
      );
    } finally {
      setEnviando(false);
    }
  };

  const campoClase =
    "mt-2 w-full rounded-md border border-tinta/20 bg-white px-4 py-3 text-base text-tinta outline-none transition-colors placeholder:text-tinta-suave/60 focus:border-llano";

  if (enviado) {
    return (
      <div className={`py-10 text-center ${className}`}>
        <p className="antetitulo mb-5 text-esperanza">Solicitud enviada</p>
        <h3 className="font-display text-3xl leading-tight text-tinta md:text-4xl">
          ¡Gracias por escribirnos!
        </h3>
        <p className="mx-auto mt-6 max-w-md text-lg leading-relaxed text-tinta-suave">
          Recibimos tus datos y nuestro equipo comercial se pondrá en contacto contigo muy pronto.
        </p>
        {successFooter}
      </div>
    );
  }

  return (
    <form onSubmit={enviar} noValidate className={`grid grid-cols-1 gap-5 sm:grid-cols-2 ${className}`}>
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
        {errorEnvio && (
          <p role="alert" className="mb-4 text-sm text-esperanza">
            {errorEnvio}
          </p>
        )}
        <button
          type="submit"
          disabled={enviando}
          aria-busy={enviando}
          className="btn btn-esperanza w-full disabled:cursor-not-allowed disabled:opacity-70 sm:w-auto"
        >
          {enviando ? (
            <span className="inline-flex items-center gap-2">
              <span
                aria-hidden="true"
                className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent"
              />
              ENVIANDO...
            </span>
          ) : (
            "ENVIAR SOLICITUD"
          )}
        </button>
      </div>
    </form>
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
