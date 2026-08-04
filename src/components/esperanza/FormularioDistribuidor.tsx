import { useEffect, useRef, useState } from "react";
import { z } from "zod";

const EVENTO = "esperanza:abrir-distribuidor";

const WEB3FORMS_ACCESS_KEY = "7305d7ee-766e-46eb-be56-cd53f7062661";
const WEB3FORMS_ENDPOINT = "https://api.web3forms.com/submit";
// Clave de sitio hCaptcha provista por Web3Forms
const HCAPTCHA_SITE_KEY = "50b2fe65-b00b-4b9e-ad62-3ba471098be2";
const HCAPTCHA_SCRIPT = "https://js.hcaptcha.com/1/api.js?render=explicit";

declare global {
  interface Window {
    hcaptcha?: {
      render: (
        el: HTMLElement,
        opts: {
          sitekey: string;
          callback?: (token: string) => void;
          "expired-callback"?: () => void;
          "error-callback"?: () => void;
        },
      ) => string;
      reset: (id?: string) => void;
    };
  }
}

function cargarHcaptcha(): Promise<void> {
  if (typeof window === "undefined") return Promise.resolve();
  if (window.hcaptcha) return Promise.resolve();
  const existente = document.querySelector<HTMLScriptElement>(`script[src="${HCAPTCHA_SCRIPT}"]`);
  if (existente) {
    return new Promise((res) => existente.addEventListener("load", () => res(), { once: true }));
  }
  return new Promise((res, rej) => {
    const s = document.createElement("script");
    s.src = HCAPTCHA_SCRIPT;
    s.async = true;
    s.defer = true;
    s.onload = () => res();
    s.onerror = () => rej(new Error("No se pudo cargar hCaptcha"));
    document.head.appendChild(s);
  });
}

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
  const [enviando, setEnviando] = useState(false);
  const [errorEnvio, setErrorEnvio] = useState<string | null>(null);
  const [captcha, setCaptcha] = useState<string | null>(null);
  const captchaRef = useRef<HTMLDivElement | null>(null);
  const widgetRef = useRef<string | null>(null);

  useEffect(() => {
    const abrir = () => {
      setEnviado(false);
      setEnviando(false);
      setErrorEnvio(null);
      setErrores({});
      setCaptcha(null);
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

  useEffect(() => {
    if (!abierto || enviado) {
      widgetRef.current = null;
      return;
    }
    let cancelado = false;
    cargarHcaptcha()
      .then(() => {
        if (cancelado || !captchaRef.current || !window.hcaptcha) return;
        if (widgetRef.current !== null) return;
        captchaRef.current.innerHTML = "";
        widgetRef.current = window.hcaptcha.render(captchaRef.current, {
          sitekey: HCAPTCHA_SITE_KEY,
          callback: (token: string) => setCaptcha(token),
          "expired-callback": () => setCaptcha(null),
          "error-callback": () => setCaptcha(null),
        });
      })
      .catch(() => setErrorEnvio("No se pudo cargar la verificación de seguridad."));
    return () => {
      cancelado = true;
    };
  }, [abierto, enviado]);

  if (!abierto) return null;

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
    if (!captcha) {
      setErrorEnvio("Completa la verificación de seguridad.");
      return;
    }
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
          "h-captcha-response": captcha,
        }),
      });
      const datos = (await respuesta.json().catch(() => null)) as { success?: boolean; message?: string } | null;
      if (!respuesta.ok || !datos?.success) {
        throw new Error(datos?.message ?? "No pudimos enviar tu solicitud.");
      }
      setEnviado(true);
      setValores(inicial);
      setCaptcha(null);
    } catch (err) {
      setErrorEnvio(
        err instanceof Error
          ? err.message
          : "Ocurrió un error al enviar. Intenta nuevamente en unos minutos.",
      );
      setCaptcha(null);
      if (window.hcaptcha && widgetRef.current !== null) {
        window.hcaptcha.reset(widgetRef.current);
      }
    } finally {
      setEnviando(false);
    }
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
