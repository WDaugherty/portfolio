import { defineConfig, type Plugin } from "vite";
import react from "@vitejs/plugin-react";
import { viteSingleFile } from "vite-plugin-singlefile";
import { copyFileSync } from "node:fs";
import { resolve } from "node:path";

// Content-Security-Policy for the hosted build. The single-file preview inlines its
// scripts, so it skips this tag; GitHub Pages serves the multi-file build.
const csp: Plugin = {
  name: "csp",
  transformIndexHtml: (html) =>
    html.replace(
      "<head>",
      `<head>\n    <meta http-equiv="Content-Security-Policy" content="default-src 'self'; script-src 'self'; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; font-src https://fonts.gstatic.com; img-src 'self' data:; connect-src 'self'; base-uri 'self'; form-action 'none'" />`,
    ),
};

// GitHub Pages serves 404.html for unknown paths; reuse the app shell.
const notFound: Plugin = {
  name: "pages-404",
  closeBundle: () => copyFileSync(resolve("dist/index.html"), resolve("dist/404.html")),
};

export default defineConfig(({ mode }) => ({
  base: "./",
  plugins: mode === "single" ? [react(), viteSingleFile()] : [react(), csp, notFound],
  build: { outDir: mode === "single" ? "dist-single" : "dist", target: "es2020" },
}));
