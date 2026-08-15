import { useEffect, useRef, useState, type RefObject } from "react";

export const tramo = (v: number, a: number, b: number) =>
  Math.min(1, Math.max(0, (v - a) / (b - a)));

export function useProgresoScroll(ref: RefObject<HTMLElement | null>) {
  const [progreso, setProgreso] = useState(0);
  const progresoRef = useRef(0);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const reducirMovimiento = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const actualizar = () => {
      const rect = el.getBoundingClientRect();
      const total = el.offsetHeight - window.innerHeight;
      const p = total > 0 ? Math.min(1, Math.max(0, -rect.top / total)) : 0;
      if (!reducirMovimiento && Math.abs(p - progresoRef.current) > 5e-4) {
        progresoRef.current = p;
        setProgreso(p);
      }
    };

    actualizar();
    if (!reducirMovimiento) {
      window.addEventListener("scroll", actualizar, { passive: true });
      window.addEventListener("resize", actualizar, { passive: true });
    }
    return () => {
      window.removeEventListener("scroll", actualizar);
      window.removeEventListener("resize", actualizar);
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
    return () => {
      obs.disconnect();
    };
  }, [threshold]);

  return { ref, visible };
}

export function useParallax(ref: RefObject<HTMLElement | null>, factor = 0.12) {
  const [offset, setOffset] = useState(0);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const actualizar = () => {
      const rect = el.getBoundingClientRect();
      if (rect.bottom < -window.innerHeight || rect.top > window.innerHeight * 2) return;
      const centro = rect.top + rect.height / 2 - window.innerHeight / 2;
      setOffset(-centro * factor);
    };

    actualizar();
    window.addEventListener("scroll", actualizar, { passive: true });
    window.addEventListener("resize", actualizar, { passive: true });
    return () => {
      window.removeEventListener("scroll", actualizar);
      window.removeEventListener("resize", actualizar);
    };
  }, [ref, factor]);
  return offset;
}
