import { copyFileSync } from "node:fs";
import { resolve } from "node:path";
import { defineConfig, type Plugin } from "vite";
import react from "@vitejs/plugin-react";

const CSP = [
  "default-src 'self'",
  "script-src 'self'",
  "style-src 'self' 'unsafe-inline'",
  "img-src 'self' data:",
  "font-src 'self'",
  "object-src 'none'",
  "base-uri 'self'",
  "form-action 'none'",
].join("; ");

/** Build only: add a Content-Security-Policy and copy index.html to 404.html for GitHub Pages. */
function githubPages(): Plugin {
  let outDir = "dist";
  return {
    name: "github-pages",
    apply: "build",
    configResolved: (config) => void (outDir = resolve(config.root, config.build.outDir)),
    transformIndexHtml: (html) =>
      html.replace(
        '<meta charset="utf-8" />',
        `<meta charset="utf-8" />\n    <meta http-equiv="Content-Security-Policy" content="${CSP}" />`,
      ),
    closeBundle: () => copyFileSync(resolve(outDir, "index.html"), resolve(outDir, "404.html")),
  };
}

export default defineConfig({
  base: "./",
  plugins: [react(), githubPages()],
  define: {
    __UPDATED__: JSON.stringify(new Date().toLocaleDateString("en-US", { month: "long", year: "numeric" })),
  },
  build: { target: "es2020" },
});
