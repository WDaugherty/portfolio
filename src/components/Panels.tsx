import { useEffect, useRef, useState, type ReactNode } from "react";
import { ArrowCircle, CentileArt, CodeIcon, Glyph, Icon, MonitorArt, NetworkArt, RatesArt, type IconName } from "./Art";
import { PanelHead } from "./Chrome";
import { INTERESTS } from "../data/interests";
import { PROFILE } from "../data/profile";
import { useReducedMotion, useWidth } from "../lib/hooks";

const WINDOWS: { slug: string; label: string; note: string; art: ReactNode }[] = [
  {
    slug: "advanced-care-at-home",
    label: "Advanced Care at Home",
    note: "Home monitoring for infants",
    art: <MonitorArt />,
  },
  { slug: "arlett-health", label: "Arlett Health", note: "Payer rate data for practices", art: <RatesArt /> },
  {
    slug: "neonatal-research",
    label: "Neonatal research",
    note: "Centile charts and monitoring studies",
    art: <CentileArt />,
  },
  {
    slug: "rheumatology-research",
    label: "Rheumatology research",
    note: "Biomarkers and immune networks",
    art: <NetworkArt />,
  },
];

/** Four arched windows, each opening its project on the Projects page. */
export function Windows() {
  return (
    <section className="panel" aria-labelledby="windows-title">
      <PanelHead
        id="windows-title"
        lines={["Four projects", "from recent years"]}
        link={{ href: "#/projects", label: "All projects" }}
      />
      <ul className="windows">
        {WINDOWS.map((w) => (
          <li key={w.slug}>
            <a className="window" href={`#/projects/${w.slug}`}>
              <span className="window-label">{w.label}</span>
              <span className="window-frame">{w.art}</span>
              <span className="visually-hidden">: {w.note}</span>
            </a>
          </li>
        ))}
      </ul>
    </section>
  );
}

/** Research interests as a paged carousel with arrows, dots, swipe and arrow keys. */
export function Interests() {
  const [viewport, width] = useWidth<HTMLDivElement>(560);
  const perPage = width >= 400 ? 3 : 2;
  const pages = Math.ceil(INTERESTS.length / perPage);
  const [page, setPage] = useState(0);
  const reduce = useReducedMotion();
  const go = (p: number) => setPage(Math.max(0, Math.min(pages - 1, p)));
  useEffect(() => setPage((p) => Math.min(p, pages - 1)), [pages]);

  const swipeStart = useRef<number | null>(null);
  const first = page * perPage;
  const last = Math.min(INTERESTS.length, first + perPage);

  return (
    <section className="panel" aria-labelledby="interests-title" aria-roledescription="carousel">
      <PanelHead
        id="interests-title"
        lines={["Research interests", "across specialties"]}
        link={{ href: "#/research", label: "All research" }}
      />
      <div
        className="carousel"
        onKeyDown={(e) => (e.key === "ArrowRight" ? go(page + 1) : e.key === "ArrowLeft" ? go(page - 1) : undefined)}
      >
        <button
          type="button"
          className="carousel-arrow"
          onClick={() => go(page - 1)}
          disabled={page === 0}
          aria-label="Previous interests"
        >
          <ArrowCircle direction="left" />
        </button>
        <div
          className="carousel-viewport"
          ref={viewport}
          onPointerDown={(e) => (swipeStart.current = e.clientX)}
          onPointerUp={(e) => {
            const dx = swipeStart.current === null ? 0 : e.clientX - swipeStart.current;
            swipeStart.current = null;
            if (Math.abs(dx) > 40) go(page + (dx < 0 ? 1 : -1));
          }}
        >
          <ul
            className="carousel-track"
            style={
              { "--per-page": perPage, "--page": page, transition: reduce ? "none" : undefined } as React.CSSProperties
            }
          >
            {INTERESTS.map((item, i) => (
              <li
                key={item.title}
                className="interest"
                aria-hidden={i < first || i >= last}
                aria-roledescription="slide"
              >
                <span className="interest-frame" title={item.line}>
                  <Glyph name={item.glyph} />
                </span>
                <h3>{item.title}</h3>
                <p className="visually-hidden">{item.line}</p>
              </li>
            ))}
          </ul>
        </div>
        <button
          type="button"
          className="carousel-arrow"
          onClick={() => go(page + 1)}
          disabled={page === pages - 1}
          aria-label="Next interests"
        >
          <ArrowCircle direction="right" />
        </button>
      </div>
      <div className="carousel-dots">
        {Array.from({ length: pages }, (_, i) => (
          <button
            key={i}
            type="button"
            aria-label={`Page ${i + 1} of ${pages}`}
            aria-current={i === page || undefined}
            onClick={() => go(i)}
          />
        ))}
      </div>
      <p className="visually-hidden" aria-live="polite">{`Interests ${first + 1} to ${last} of ${INTERESTS.length}`}</p>
    </section>
  );
}

export interface Item {
  key: string;
  name: string;
  description: string;
  icon: IconName;
  tag?: string;
  tools?: string[];
  year: string;
  detail: string;
  status: string;
  href?: string;
  code?: string;
}

/** A row of five small items with an icon, a two-line name, metadata and an optional link. */
export function ItemRow({
  id,
  lines,
  link,
  items,
  attached,
}: {
  id: string;
  lines: [string, string];
  link: { href: string; label: string };
  items: Item[];
  attached?: boolean;
}) {
  const hasTop = items.some((it) => it.tag || it.code);
  return (
    <section className={attached ? "panel panel-attached" : "panel"} aria-labelledby={id}>
      <PanelHead id={id} lines={lines} link={link} />
      <ul className="items">
        {items.map((it) => (
          <li key={it.key} className="item">
            {hasTop && (
              <div className="item-top">
                {it.tag && <span className="item-tag">{it.tag}</span>}
                {it.code && (
                  <a className="item-code" href={it.code} aria-label={`Source code for ${it.name}`}>
                    <CodeIcon />
                  </a>
                )}
              </div>
            )}
            <span className="item-icon">
              <Icon name={it.icon} />
            </span>
            <h3 className="item-name">{it.name}</h3>
            <p className="item-description">{it.description}</p>
            {it.tools && <p className="item-tools">{it.tools.join(", ")}</p>}
            <p className="item-meta">
              <span className="item-year">{it.year}</span> {it.detail}
            </p>
            <p className="item-status">{it.status}</p>
            {it.href && (
              <a className="item-button" href={it.href}>
                Open project<span className="visually-hidden">: {it.name}</span>
              </a>
            )}
          </li>
        ))}
      </ul>
    </section>
  );
}

/** The dark band: who this is, and the way to the CV. */
export function Banner() {
  return (
    <section className="banner" aria-labelledby="home-title">
      <h1 id="home-title" tabIndex={-1}>
        {PROFILE.name}
      </h1>
      <p>
        {PROFILE.position} at {PROFILE.affiliation}, studying longitudinal monitoring and individual baselines in
        neonatal care and rheumatology.
      </p>
      <a className="button-light" href="#/cv">
        Read my CV
      </a>
    </section>
  );
}
