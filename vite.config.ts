import { defineConfig, type Plugin } from "vite";
import react from "@vitejs/plugin-react";
import { viteSingleFile } from "vite-plugin-singlefile";
import { copyFileSync } from "node:fs";
import { resolve } from "node:path";

// Content-Security-Policy for the hosted build. The single-file preview inlines its
// scripts, so it skips this tag; GitHub Pages serves the multi-file build.
const csp: Plugin = {
  name: "csp",
  apply: "build", // never in dev: Vite and React inject inline scripts there, and a CSP would blank the page
  transformIndexHtml: (html) =>
    html.replace(
      "<head>",
      `<head>\n    <meta http-equiv="Content-Security-Policy" content="default-src 'self'; script-src 'self'; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; font-src https://fonts.gstatic.com; img-src 'self' data:; connect-src 'self'; base-uri 'self'; form-action 'none'" />`,
    ),
};

// GitHub Pages serves 404.html for unknown paths; reuse the app shell.
const notFound = (outDir: string): Plugin => ({
  name: "pages-404",
  apply: "build",
  closeBundle: () => copyFileSync(resolve(outDir, "index.html"), resolve(outDir, "404.html")),
});

// Modes: default build -> dist/ (GitHub Actions deploy), "docs" -> docs/ (deploy from a branch),
// "single" -> dist-single/index.html with everything inlined (opens straight from disk).
export default defineConfig(({ mode }) => {
  const outDir = mode === "single" ? "dist-single" : mode === "docs" ? "docs" : "dist";
  return {
    base: "./",
    plugins: mode === "single" ? [react(), viteSingleFile()] : [react(), csp, notFound(outDir)],
    build: { outDir, target: "es2020", emptyOutDir: true },
  };
});
