import { useSyncExternalStore } from "react";
import { flushSync } from "react-dom";

/** Hash routes, so the site works on GitHub Pages at any path without server rewrites. */
export const PAGES = [
  { name: "home", path: "#/", label: "Home" },
  { name: "research", path: "#/research", label: "Research" },
  { name: "projects", path: "#/projects", label: "Projects" },
  { name: "about", path: "#/about", label: "About" },
  { name: "cv", path: "#/cv", label: "CV" },
] as const;

export type PageName = (typeof PAGES)[number]["name"];
export type Route = { page: PageName; focus?: string } | { page: "missing"; path: string };

export function parseHash(hash: string): Route {
  const path = hash.replace(/^#/, "").replace(/\/+$/, "");
  if (!path.startsWith("/")) return { page: "home" };
  const [name, focus, ...rest] = path.slice(1).split("/");
  const page = PAGES.find((p) => p.name === name && p.name !== "home");
  if (!page || rest.length || (focus && page.name !== "projects")) return { page: "missing", path };
  return { page: page.name, focus };
}

function subscribe(onChange: () => void) {
  const handle = () => {
    const animate = "startViewTransition" in document && !matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (animate) document.startViewTransition(() => flushSync(onChange));
    else onChange();
  };
  window.addEventListener("hashchange", handle);
  return () => window.removeEventListener("hashchange", handle);
}

export const useRoute = (serverHash = "#/") =>
  parseHash(
    useSyncExternalStore(
      subscribe,
      () => location.hash,
      () => serverHash,
    ),
  );
