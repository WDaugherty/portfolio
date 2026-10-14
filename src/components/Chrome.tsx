import { useEffect, useId, useRef, useState } from "react";
import { PAGES, type Route } from "../lib/route";
import { PROFILE } from "../data/profile";
import { ArrowCircle, Mark } from "./Art";

const LINKS = PAGES.filter((p) => p.name !== "home");

export function Nav({ route }: { route: Route }) {
  const [open, setOpen] = useState(false);
  const menuId = useId();
  const container = useRef<HTMLDivElement>(null);

  useEffect(() => setOpen(false), [route.page]);
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    const onPointer = (e: PointerEvent) => !container.current?.contains(e.target as Node) && setOpen(false);
    addEventListener("keydown", onKey);
    addEventListener("pointerdown", onPointer);
    return () => {
      removeEventListener("keydown", onKey);
      removeEventListener("pointerdown", onPointer);
    };
  }, [open]);

  const current = (name: string) => (route.page === name ? "page" : undefined);
  return (
    <header className="nav">
      <a className="nav-name" href="#/" aria-current={current("home")}>
        <Mark />
        {PROFILE.name}
      </a>
      <nav aria-label="Main" ref={container}>
        <button
          type="button"
          className="nav-toggle"
          aria-expanded={open}
          aria-controls={menuId}
          onClick={() => setOpen(!open)}
        >
          Menu
        </button>
        <ul id={menuId} className="nav-links" data-open={open}>
          {LINKS.map((l) => (
            <li key={l.name}>
              <a href={l.path} aria-current={current(l.name)}>
                {l.label}
              </a>
            </li>
          ))}
        </ul>
      </nav>
    </header>
  );
}

export function Footer({ attached = false }: { attached?: boolean }) {
  return (
    <footer className={attached ? "footer footer-attached" : "footer"}>
      <svg
        className="footer-mark"
        width={132}
        height={70}
        viewBox="0 0 132 70"
        aria-hidden="true"
        fill="none"
        stroke="currentColor"
        strokeWidth={1.3}
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M16 58a50 50 0 0 1 100 0" opacity={0.45} />
        <path d="M6 58h36l7-20 9 30 8-24 5 10h55" />
      </svg>
      <p className="footer-name">{PROFILE.name}</p>
      <ul className="footer-links">
        {LINKS.map((l) => (
          <li key={l.name}>
            <a href={l.path}>{l.label}</a>
          </li>
        ))}
        <li>
          <a href={`mailto:${PROFILE.email}`}>Email</a>
        </li>
        <li>
          <a href={PROFILE.github}>GitHub</a>
        </li>
        <li>
          <a href={PROFILE.linkedin}>LinkedIn</a>
        </li>
      </ul>
      <p className="footer-note">Updated {__UPDATED__}. Figures use synthetic data.</p>
    </footer>
  );
}

/** Panel heading: two short lines on the left, a link with a circled arrow on the right. */
export function PanelHead({
  id,
  lines,
  link,
}: {
  id: string;
  lines: [string, string];
  link?: { href: string; label: string };
}) {
  return (
    <div className="panel-head">
      <h2 id={id}>
        <span>{lines[0]}</span> <span>{lines[1]}</span>
      </h2>
      {link && (
        <a className="panel-link" href={link.href}>
          {link.label}
          <ArrowCircle />
        </a>
      )}
    </div>
  );
}
