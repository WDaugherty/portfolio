import type { ReactNode } from "react";
import { Circle } from "./Windows";

export interface RowItem {
  key: string;
  name: string;
  descriptor: string;
  art: ReactNode;
  tag?: string;
  chips?: { short: string; full: string }[];
  year: string;
  field: string;
  status: string;
  href: string;
  button: string;
  code?: string;
}

function CodeIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" aria-hidden="true" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round">
      <path d="M6 5L2 9l4 4M12 5l4 4-4 4" />
    </svg>
  );
}

/** A row of small item cards, modeled on the reference's product rows. */
export function ProductRow({ id, title, link, items }: { id: string; title: [string, string]; link: { href: string; label: string }; items: RowItem[] }) {
  return (
    <section className="sheet row-sheet" aria-labelledby={id}>
      <div className="sheet-head">
        <h2 id={id}><span>{title[0]}</span> <span>{title[1]}</span></h2>
        <a className="head-link" href={link.href}>{link.label}<Circle /></a>
      </div>
      <ul className="products">
        {items.map((it) => (
          <li key={it.key} className="product">
            <div className="product-top">
              {it.tag ? <span className="product-tag">{it.tag}</span> : <span />}
              {it.code && (
                <a className="product-icon" href={it.code} target="_blank" rel="noreferrer" aria-label={`Code for ${it.name} on GitHub`}><CodeIcon /></a>
              )}
            </div>
            <span className="product-art">{it.art}</span>
            {it.chips && (
              <span className="chips-row">
                {it.chips.slice(0, 3).map((c) => <span key={c.short} className="swatch" title={c.full} aria-hidden="true">{c.short}</span>)}
                {it.chips.length > 3 && <span className="swatch-more" aria-hidden="true">+{it.chips.length - 3}</span>}
                <span className="sr-only">Tools: {it.chips.map((c) => c.full).join(", ")}</span>
              </span>
            )}
            <h3 className="product-name">&ldquo;{it.name}&rdquo; - {it.descriptor}</h3>
            <p className="product-meta">
              <span className="product-year">{it.year}</span>
              <span className="product-field">{it.field}</span>
              <span className="product-status">{it.status}</span>
            </p>
            <a className="card-btn" href={it.href}>{it.button}<span className="sr-only"> for {it.name}</span></a>
          </li>
        ))}
      </ul>
    </section>
  );
}
