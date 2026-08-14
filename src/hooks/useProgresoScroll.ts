import { useEffect, useRef, useState, type RefObject } from "react";

export const tramo = (v: number, a: number, b: number) =>
  Math.min(1, Math.max(0, (v - a) / (b - a)));

export function useProgresoScroll(ref: RefObject<HTMLElement | null>) {
  const [progreso, setProgreso] = useState(0);
  const progresoRef = useRef(0);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    let raf = 0;
    let pendiente = false;

    const actualizar = () => {
      pendiente = false;
      const rect = el.getBoundingClientRect();
      const total = el.offsetHeight - window.innerHeight;
      const p = total > 0 ? Math.min(1, Math.max(0, -rect.top / total)) : 0;
      if (Math.abs(p - progresoRef.current) > 5e-4) {
        progresoRef.current = p;
        setProgreso(p);
      }
    };

    const programar = () => {
      if (pendiente) return;
      pendiente = true;
      raf = requestAnimationFrame(actualizar);
    };

    actualizar();
    window.addEventListener("scroll", programar, { passive: true });
    window.addEventListener("resize", programar, { passive: true });
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("scroll", programar);
      window.removeEventListener("resize", programar);
    };
  }, [ref]);

  return { progreso, progresoRef };
}

export function useRevelar<T extends HTMLElement>(threshold = 0.2) {
  const ref = useRef<T | null>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setVisible(true);
      return;
    }
    const enPantalla = () => {
      const r = el.getBoundingClientRect();
      return r.top < window.innerHeight * (1 - threshold * 0.5) && r.bottom > 0;
    };
    if (enPantalla()) {
      setVisible(true);
      return;
    }
    const obs = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting) {
          setVisible(true);
          obs.disconnect();
        }
      },
      { threshold, rootMargin: "0px 0px -8% 0px" },
    );
    obs.observe(el);
    const alScroll = () => {
      if (enPantalla()) {
        setVisible(true);
        obs.disconnect();
        window.removeEventListener("scroll", alScroll);
      }
    };
    window.addEventListener("scroll", alScroll, { passive: true });
    return () => {
      obs.disconnect();
      window.removeEventListener("scroll", alScroll);
    };
  }, [threshold]);

  return { ref, visible };
}

export function useParallax(ref: RefObject<HTMLElement | null>, factor = 0.12) {
  const [offset, setOffset] = useState(0);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    let raf = 0;
    let pendiente = false;

    const actualizar = () => {
      pendiente = false;
      const rect = el.getBoundingClientRect();
      if (rect.bottom < -window.innerHeight || rect.top > window.innerHeight * 2) return;
      const centro = rect.top + rect.height / 2 - window.innerHeight / 2;
      setOffset(-centro * factor);
    };

    const programar = () => {
      if (pendiente) return;
      pendiente = true;
      raf = requestAnimationFrame(actualizar);
    };

    actualizar();
    window.addEventListener("scroll", programar, { passive: true });
    window.addEventListener("resize", programar, { passive: true });
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("scroll", programar);
      window.removeEventListener("resize", programar);
    };
  }, [ref, factor]);
  return offset;
}
