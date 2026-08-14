// Entry point for the static SPA build (npm run build:static).
// The Lovable/TanStack Start SSR entry is untouched; this file is only used by
// vite.static.config.ts to emit a classic client-rendered bundle into dist/.
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { RouterProvider } from "@tanstack/react-router";

import { getRouter } from "./router";
import "./styles.css";

const router = getRouter();

const container = document.getElementById("root");
if (!container) throw new Error('No se encontró el elemento #root');

createRoot(container).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>,
);
