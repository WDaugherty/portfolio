import type { ReactNode } from "react";
import { CentileArt, MonitorArt, NetworkArt, RatesArt } from "./Art";

interface Win { slug: string; label: string; note: string; pos: "tl" | "tr" | "bl" | "br"; art: ReactNode }

const WINDOWS: Win[] = [
  { slug: "advanced-care-at-home", label: "Advanced Care at Home", note: "Home ICU-grade monitoring for infants", pos: "tl", art: <MonitorArt /> },
  { slug: "arlett-health", label: "Arlett Health", note: "Payer rate intelligence for practices", pos: "tr", art: <RatesArt /> },
  { slug: "neonatal-research", label: "Neonatal research", note: "Centile charts and monitoring studies", pos: "bl", art: <CentileArt /> },
  { slug: "rheumatology-research", label: "Rheumatology research", note: "Biomarkers and shared immune biology", pos: "br", art: <NetworkArt /> },
];

export function Windows() {
  return (
    <section className="sheet windows-sheet" aria-labelledby="windows-title">
      <div className="sheet-head">
        <h2 id="windows-title"><span>Four projects</span> <span>from recent years</span></h2>
        <a className="head-link" href="#/projects">All projects<Circle /></a>
      </div>
      <ul className="windows">
        {WINDOWS.map((w) => (
          <li key={w.slug} className={`win win-${w.pos}`}>
            <a href={`#/projects/${w.slug}`}>
              <span className="win-label">{w.label}</span>
              <span className="win-frame"><span className="win-glass">{w.art}</span></span>
              <span className="sr-only">{w.note}</span>
            </a>
          </li>
        ))}
      </ul>
    </section>
  );
}

export function Circle({ dir = "ne" }: { dir?: "ne" | "left" | "right" }) {
  const path = dir === "left" ? "M13 8.5H6.5M9 5.5l-3 3 3 3" : dir === "right" ? "M4 8.5h6.5M8 5.5l3 3-3 3" : "M6 11l5-5M7 6h4v4";
  return (
    <svg width="17" height="17" viewBox="0 0 17 17" aria-hidden="true" fill="none" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="8.5" cy="8.5" r="7.6" /><path d={path} />
    </svg>
  );
}
