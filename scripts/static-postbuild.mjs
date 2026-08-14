// Post-processing for the static SPA build:
// 1. index.static.html -> dist/index.html
// 2. .htaccess with SPA fallback + basic caching/compression for Apache (cPanel)
// 3. static sitemap.xml (the SSR route is not available on a static host)
import { readFile, writeFile, rename, rm, access } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import path from "node:path";

const root = fileURLToPath(new URL("..", import.meta.url));
const dist = path.join(root, "dist");

const src = path.join(dist, "index.static.html");
try {
  await access(src);
  await rm(path.join(dist, "index.html"), { force: true });
  await rename(src, path.join(dist, "index.html"));
} catch {
  /* already named index.html */
}

const htaccess = `# Alimentos Esperanza — SPA estática (Apache / cPanel)
Options -MultiViews
RewriteEngine On
RewriteBase /

# No reescribir archivos ni directorios existentes
RewriteCond %{REQUEST_FILENAME} -f [OR]
RewriteCond %{REQUEST_FILENAME} -d
RewriteRule ^ - [L]

# Todo lo demás lo resuelve el router del cliente
RewriteRule ^ index.html [L]

<IfModule mod_deflate.c>
  AddOutputFilterByType DEFLATE text/html text/css text/javascript application/javascript application/json image/svg+xml
</IfModule>

<IfModule mod_expires.c>
  ExpiresActive On
  ExpiresByType text/css "access plus 1 year"
  ExpiresByType application/javascript "access plus 1 year"
  ExpiresByType image/webp "access plus 1 year"
  ExpiresByType image/jpeg "access plus 1 year"
  ExpiresByType image/png "access plus 1 year"
  ExpiresByType image/svg+xml "access plus 1 year"
  ExpiresByType video/mp4 "access plus 1 year"
  ExpiresDefault "access plus 1 hour"
</IfModule>

<FilesMatch "index\\.html$">
  <IfModule mod_headers.c>
    Header set Cache-Control "no-cache, must-revalidate"
  </IfModule>
</FilesMatch>
`;
await writeFile(path.join(dist, ".htaccess"), htaccess, "utf8");

// Sitemap estático
const data = JSON.parse(await readFile(path.join(root, "src/data/site-data.json"), "utf8"));
const BASE = "https://alimentosesperanza.com";
const hoy = new Date().toISOString().slice(0, 10);
const lanzamientos = new Set(["harina-de-maiz-precocida", "aceite-de-soya-refinado"]);

const paths = [
  { loc: "/", priority: "1.0", changefreq: "weekly" },
  { loc: "/recetario", priority: "0.8", changefreq: "weekly" },
  { loc: "/lanzamientos", priority: "0.7", changefreq: "monthly" },
  ...(data.productos ?? [])
    .filter((p) => !lanzamientos.has(p.slug))
    .map((p) => ({ loc: `/productos/${p.slug}`, priority: "0.7", changefreq: "monthly" })),
  ...(data.recetas ?? []).map((r) => ({
    loc: `/recetario/${r.slug}`,
    priority: "0.6",
    changefreq: "monthly",
  })),
];

const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${paths
  .map(
    (p) =>
      `  <url>\n    <loc>${BASE}${p.loc}</loc>\n    <lastmod>${hoy}</lastmod>\n    <changefreq>${p.changefreq}</changefreq>\n    <priority>${p.priority}</priority>\n  </url>`,
  )
  .join("\n")}
</urlset>
`;
await writeFile(path.join(dist, "sitemap.xml"), sitemap, "utf8");

console.log(`dist/ listo: index.html, .htaccess y sitemap.xml (${paths.length} URLs)`);
