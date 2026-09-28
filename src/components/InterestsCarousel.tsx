import { useCallback, useEffect, useRef, useState } from "react";
import { Glyphs } from "./Art";
import { Circle } from "./Windows";
import { INTERESTS } from "../data/interests";
import { useWidth } from "../lib/useWidth";
import { useReducedMotion } from "../lib/hooks";

/** Research interests as a paged carousel: arrow buttons, page dots, swipe, and a live status line. */
export function InterestsCarousel() {
  const [boxRef, width] = useWidth<HTMLDivElement>(560);
  const perView = width >= 420 ? 3 : width >= 260 ? 2 : 1;
  const pages = Math.ceil(INTERESTS.length / perView);
  const [page, setPage] = useState(0);
  const reduce = useReducedMotion();
  const clamp = useCallback((p: number) => Math.max(0, Math.min(pages - 1, p)), [pages]);
  useEffect(() => setPage((p) => clamp(p)), [clamp]);

  const start = useRef<number | null>(null);
  const onDown = (e: React.PointerEvent) => { start.current = e.clientX; };
  const onUp = (e: React.PointerEvent) => {
    if (start.current === null) return;
    const dx = e.clientX - start.current;
    start.current = null;
    if (Math.abs(dx) > 40) setPage((p) => clamp(p + (dx < 0 ? 1 : -1)));
  };
  const onKey = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowRight") setPage((p) => clamp(p + 1));
    if (e.key === "ArrowLeft") setPage((p) => clamp(p - 1));
  };

  const first = page * perView + 1, last = Math.min(INTERESTS.length, (page + 1) * perView);
  return (
    <section className="sheet interests-sheet" aria-labelledby="interests-title" aria-roledescription="carousel">
      <div className="sheet-head">
        <h2 id="interests-title"><span>Research interests</span> <span>across specialties</span></h2>
        <a className="head-link" href="#/research">All research<Circle /></a>
      </div>
      <div className="carousel" onKeyDown={onKey}>
        <button type="button" className="arrow" onClick={() => setPage((p) => clamp(p - 1))} disabled={page === 0} aria-label="Previous interests"><Circle dir="left" /></button>
        <div className="viewport" ref={boxRef} onPointerDown={onDown} onPointerUp={onUp} onPointerCancel={() => (start.current = null)}>
          <ul className="track" style={{ transform: `translateX(-${page * 100}%)`, transition: reduce ? "none" : undefined, ["--per" as string]: perView }}>
            {INTERESTS.map((it, i) => {
              const Glyph = Glyphs[it.glyph];
              const hidden = i < page * perView || i >= (page + 1) * perView;
              return (
                <li key={it.title} className="area" aria-hidden={hidden} role="group" aria-roledescription="slide" aria-label={`${i + 1} of ${INTERESTS.length}`}>
                  <span className="area-frame" title={it.line}><span className="area-glass"><Glyph /></span></span>
                  <h3 className="area-title">{it.title}</h3>
                  <span className="sr-only">{it.line}</span>
                </li>
              );
            })}
          </ul>
        </div>
        <button type="button" className="arrow" onClick={() => setPage((p) => clamp(p + 1))} disabled={page >= pages - 1} aria-label="Next interests"><Circle dir="right" /></button>
      </div>
      <div className="dots">
        {Array.from({ length: pages }, (_, i) => (
          <button key={i} type="button" aria-label={`Show page ${i + 1} of ${pages}`} aria-current={i === page ? "true" : undefined} onClick={() => setPage(i)}><span /></button>
        ))}
      </div>
      <p className="sr-only" aria-live="polite">{`Showing interests ${first} to ${last} of ${INTERESTS.length}`}</p>
    </section>
  );
}
