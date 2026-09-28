import { useEffect, useId, useRef, useState } from "react";
import { PAGES, type Route } from "../lib/route";
import { PROFILE } from "../data/cv";

const current = (route: Route) => (route.name === "spec" ? "specs" : route.name);
const LINKS = PAGES.filter((p) => p.name !== "home");

export function Nav({ route }: { route: Route }) {
  const [open, setOpen] = useState(false);
  const menuId = useId();
  const box = useRef<HTMLDivElement>(null);
  const here = current(route);

  useEffect(() => setOpen(false), [route]);
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    const onClick = (e: MouseEvent) => { if (box.current && !box.current.contains(e.target as Node)) setOpen(false); };
    window.addEventListener("keydown", onKey);
    window.addEventListener("pointerdown", onClick);
    return () => { window.removeEventListener("keydown", onKey); window.removeEventListener("pointerdown", onClick); };
  }, [open]);

  return (
    <header className="nav">
      <div className="nav-inner">
        <a className="mark" href="#/" aria-current={here === "home" ? "page" : undefined}>
          <svg width="30" height="18" viewBox="0 0 30 18" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <path d="M1 10h6l2.5-7 3.5 13 2.5-9 1.8 3H29" />
          </svg>
          <span>{PROFILE.name}</span>
        </a>
        <nav aria-label="Primary" className="nav-primary">
          {LINKS.map((l) => (
            <a key={l.path} href={l.path} aria-current={here === l.name ? "page" : undefined}>{l.label}</a>
          ))}
        </nav>
        <div className="nav-actions" ref={box}>
          <button type="button" className="menu-btn" aria-expanded={open} aria-controls={menuId} onClick={() => setOpen((o) => !o)}>
            Menu
            <svg width="12" height="12" viewBox="0 0 12 12" aria-hidden="true" style={{ transform: open ? "rotate(180deg)" : undefined }}>
              <path d="M2.5 4.5L6 8l3.5-3.5" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
          <ul id={menuId} className="menu" data-open={open}>
            {PAGES.map((l) => (
              <li key={l.path}><a href={l.path} aria-current={here === l.name ? "page" : undefined}>{l.label}</a></li>
            ))}
          </ul>
        </div>
      </div>
    </header>
  );
}

export function Footer({ attached = false }: { attached?: boolean }) {
  return (
    <footer className={attached ? "footer attached" : "footer"}>
      <svg className="footer-mark" width="132" height="70" viewBox="0 0 132 70" fill="none" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <path d="M16 58a50 50 0 0 1 100 0" opacity="0.45" />
        <path d="M6 58h36l7-20 9 30 8-24 5 10h55" />
      </svg>
      <p className="footer-name">{PROFILE.name}</p>
      <ul className="footer-links">
        <li><span>&copy; 2026 {PROFILE.name}</span></li>
        {PAGES.filter((p) => p.name !== "home").map((p) => <li key={p.path}><a href={p.path}>{p.label}</a></li>)}
        <li><a href={`mailto:${PROFILE.email}`}>Email</a></li>
        <li><a href={PROFILE.github} target="_blank" rel="noreferrer">GitHub</a></li>
        <li><a href={PROFILE.linkedin} target="_blank" rel="noreferrer">LinkedIn</a></li>
      </ul>
      <p className="legal">Last updated September 2026. Figures on this site use synthetic data.</p>
    </footer>
  );
}
