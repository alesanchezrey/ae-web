export const SITE_URL = "https://alimentosesperanza.com";

/** Convierte una ruta relativa del sitio en una URL absoluta. */
export function urlAbsoluta(path: string): string {
  if (/^https?:\/\//.test(path)) return path;
  return `${SITE_URL}${path.startsWith("/") ? path : `/${path}`}`;
}
