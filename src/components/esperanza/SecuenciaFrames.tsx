import { useEffect, useRef, useState, type RefObject } from "react";

type Props = {
  base: string;
  totalEscritorio: number;
  totalMovil: number;
  progresoRef: RefObject<number>;
  className?: string;
};

export function SecuenciaFrames({
  base,
  totalEscritorio,
  totalMovil,
  progresoRef,
  className = "",
}: Props) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const imagenes = useRef<(HTMLImageElement | null)[]>([]);
  const ultimo = useRef(-1);
  const total = useRef(totalEscritorio);
  const [listo, setListo] = useState(false);

  useEffect(() => {
    const movil = window.matchMedia("(max-width: 767px)").matches;
    const n = movil ? totalMovil : totalEscritorio;
    total.current = n;
    imagenes.current = Array(n).fill(null);
    ultimo.current = -1;
    let cancelado = false;

    const cargar = (i: number) =>
      new Promise<void>((resolve) => {
        const img = new Image();
        img.decoding = "async";
        img.onload = img.onerror = () => {
          if (!cancelado) imagenes.current[i] = img;
          resolve();
        };
        img.src = `${base}/${movil ? "mobile" : "desktop"}/f${String(i + 1).padStart(3, "0")}.webp`;
      });

    const orden: number[] = [];
    const vistos = new Set<number>();
    for (const paso of [8, 4, 2, 1]) {
      for (let i = 0; i < n; i += paso) {
        if (!vistos.has(i)) {
          vistos.add(i);
          orden.push(i);
        }
      }
    }

    let temporizador: ReturnType<typeof setTimeout> | undefined;
    const cargarEnReposo = (i: number) => {
      temporizador = setTimeout(() => {
        if (cancelado || i >= orden.length) return;
        void cargar(orden[i] ?? 0).then(() => cargarEnReposo(i + 1));
      }, 16);
    };

    void (async () => {
      const primeros = orden.slice(0, Math.ceil(n / 8));
      await Promise.all(primeros.map(cargar));
      if (cancelado) return;
      setListo(true);
      cargarEnReposo(primeros.length);
    })();

    return () => {
      cancelado = true;
      if (temporizador) clearTimeout(temporizador);
    };
  }, [base, totalEscritorio, totalMovil]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d", { alpha: false });
    if (!ctx) return;

    const redimensionar = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const { width, height } = canvas.getBoundingClientRect();
      canvas.width = Math.round(width * dpr);
      canvas.height = Math.round(height * dpr);
      ultimo.current = -1;
    };

    const masCercano = (i: number) => {
      const arr = imagenes.current;
      if (arr[i]) return i;
      for (let d = 1; d < total.current; d++) {
        if (arr[i - d]) return i - d;
        if (arr[i + d]) return i + d;
      }
      return -1;
    };

    const dibujar = () => {
      const n = total.current;
      const idx = masCercano(
        Math.min(n - 1, Math.round((progresoRef.current ?? 0) * (n - 1))),
      );
      if (idx !== -1 && idx !== ultimo.current) {
        const img = imagenes.current[idx];
        if (img?.naturalWidth) {
          const escala = Math.max(
            canvas.width / img.naturalWidth,
            canvas.height / img.naturalHeight,
          );
          const w = img.naturalWidth * escala;
          const h = img.naturalHeight * escala;
          ctx.drawImage(img, (canvas.width - w) / 2, (canvas.height - h) / 2, w, h);
          ultimo.current = idx;
        }
      }
    };

    const redimensionarYDibujar = () => {
      redimensionar();
      dibujar();
    };

    redimensionar();
    dibujar();
    window.addEventListener("resize", redimensionarYDibujar, { passive: true });
    return () => {
      window.removeEventListener("resize", redimensionarYDibujar);
    };
  }, [progresoRef, listo]);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className={`absolute inset-0 h-full w-full ${className}`}
    />
  );
}
