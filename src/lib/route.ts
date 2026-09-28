/**
 * Hash routing for a static site on GitHub Pages.
 * Pages: #/ (home), #/research, #/projects, #/projects/<slug>, #/cv, and #/specs when enabled.
 * Page changes run inside a View Transition when supported and motion is allowed.
 */
import { useSyncExternalStore } from "react";
import { flushSync } from "react-dom";
import { FEATURES } from "../config";

export type PageName = "home" | "research" | "projects" | "cv" | "specs";
export type Route =
  | { name: Exclude<PageName, "projects"> }
  | { name: "projects"; focus?: string }
  | { name: "spec"; slug: string }
  | { name: "missing"; path: string };

const ALL_PAGES: { name: PageName; path: string; label: string }[] = [
  { name: "home", path: "#/", label: "Home" },
  { name: "research", path: "#/research", label: "Research" },
  { name: "projects", path: "#/projects", label: "Projects" },
  { name: "cv", path: "#/cv", label: "CV" },
  { name: "specs", path: "#/specs", label: "Specs" },
];

export const PAGES = ALL_PAGES.filter((p) => p.name !== "specs" || FEATURES.openSourceSpecs);

export function parseHash(hash: string): Route {
  const h = hash.replace(/^#/, "").replace(/\/+$/, "");
  if (h === "" || h === "/" || !h.startsWith("/")) return { name: "home" };
  const [, first, second] = h.split("/");
  if (first === "specs" && !FEATURES.openSourceSpecs) return { name: "missing", path: h };
  if (first === "specs" && second) return { name: "spec", slug: second };
  if (first === "projects" && second) return { name: "projects", focus: second };
  const page = PAGES.find((p) => p.name === first);
  return page ? { name: page.name } as Route : { name: "missing", path: h };
}

const listeners = new Set<() => void>();
const notify = () => listeners.forEach((l) => l());
let wired = false;

function wire() {
  if (wired || typeof window === "undefined") return;
  wired = true;
  window.addEventListener("hashchange", (e) => {
    const next = window.location.hash;
    if (next && !next.startsWith("#/")) {
      history.replaceState(null, "", new URL(e.oldURL).hash || "#/");
      return;
    }
    const doc = document as Document & { startViewTransition?: (cb: () => void) => unknown };
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (doc.startViewTransition && !reduce) doc.startViewTransition(() => flushSync(notify));
    else notify();
  });
}

function subscribe(cb: () => void) {
  wire();
  listeners.add(cb);
  return () => void listeners.delete(cb);
}

export function useRoute(serverHash = "#/"): Route {
  const hash = useSyncExternalStore(subscribe, () => window.location.hash, () => serverHash);
  return parseHash(hash);
}
