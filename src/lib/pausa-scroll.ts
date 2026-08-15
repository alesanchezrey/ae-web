// Mientras el usuario escribe en un campo, pausamos todo el trabajo de scroll
// (mediciones de layout, canvas, parallax) para evitar bucles de recálculo
// que bloquean el hilo principal en algunos navegadores.
export function escribiendo(): boolean {
  if (typeof document === "undefined") return false;
  const el = document.activeElement as HTMLElement | null;
  if (!el) return false;
  const tag = el.tagName;
  return tag === "INPUT" || tag === "TEXTAREA" || tag === "SELECT" || el.isContentEditable;
}
