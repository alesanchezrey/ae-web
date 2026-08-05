import datos from "@/data/site-data.json";

export type Foto = { src: string; alt: string };
export type Atributo = { etiqueta: string; valor: string };

export type Producto = {
  slug: string;
  nombre: string;
  presentacion: string;
  claim: string;
  descripcion: string;
  descripcionLarga: string;
  imagen: string;
  composicion: string;
  fotos: Foto[];
  acento: string;
  atributos: Atributo[];
};

export type Receta = {
  slug: string;
  nombre: string;
  categorias: string[];
  productos: string[];
  porciones: string;
  tiempo: string;
  imagen: string;
  ingredientes: string[];
  pasos: string[];
  tip?: string;
};

export const productos = datos.productos as Producto[];
export const recetas = datos.recetas as Receta[];

/** Productos próximos a lanzarse: no se muestran en "Nuestros Productos". */
export const slugsLanzamiento = [
  "harina-de-maiz-precocida",
  "aceite-de-soya-refinado",
];

export const productosDisponibles = productos.filter(
  (p) => !slugsLanzamiento.includes(p.slug),
);

export const productosLanzamiento = productos.filter((p) =>
  slugsLanzamiento.includes(p.slug),
);

export const INSTAGRAM = "https://instagram.com/alimentosesperanza";

export const categorias = [
  "Desayuno",
  "Almuerzo",
  "Merienda",
  "Acompañante",
  "Postre",
];

export function productoPorSlug(slug: string) {
  return productos.find((p) => p.slug === slug);
}

export function recetaPorSlug(slug: string) {
  return recetas.find((r) => r.slug === slug);
}

export function recetasDeProducto(slug: string) {
  return recetas.filter((r) => r.productos.includes(slug));
}
