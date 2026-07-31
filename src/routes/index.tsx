import { createFileRoute } from "@tanstack/react-router";
import { Hero } from "@/components/esperanza/Hero";
import { Calidad } from "@/components/esperanza/Calidad";
import { Productos } from "@/components/esperanza/Productos";
import { Ventajas } from "@/components/esperanza/Ventajas";
import { RecetarioCTA } from "@/components/esperanza/RecetarioCTA";
import { Nosotros } from "@/components/esperanza/Nosotros";
import { Frase } from "@/components/esperanza/Frase";
import { Origen } from "@/components/esperanza/Origen";
import { Distribucion } from "@/components/esperanza/Distribucion";
import { Contacto } from "@/components/esperanza/Contacto";

const titulo = "Alimentos Esperanza — El sabor de la familia";
const descripcion =
  "Empresa agroindustrial venezolana de Portuguesa: harina de maíz, arroz, aceite de soya y azúcar refinada para cada mesa del país.";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: titulo },
      { name: "description", content: descripcion },
      { property: "og:title", content: titulo },
      { property: "og:description", content: descripcion },
      { property: "og:type", content: "website" },
      { property: "og:url", content: "/" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [{ rel: "canonical", href: "/" }],
  }),
  component: Inicio,
});

function Inicio() {
  return (
    <>
      <Hero />
      <Calidad />
      <Productos />
      <Ventajas />
      <RecetarioCTA />
      <Nosotros />
      <Frase />
      <Origen />
      <Distribucion />
      <Contacto />
    </>
  );
}
