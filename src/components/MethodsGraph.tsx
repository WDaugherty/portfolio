import { useMemo, useRef, useState } from "react";
import { METHODS, PROJECTS, type MethodId } from "../data/projects";
import { useIsoLayoutEffect, useWidth } from "../lib/hooks";

type Key = string;

/** Projects on the left, the methods they use on the right, joined by an edge per use. */
export function buildGraph() {
  const left = PROJECTS.filter((p) => p.methods.length).map((p) => ({ key: `p:${p.slug}`, label: p.name }));
  const edges = PROJECTS.flatMap((p) => p.methods.map((m) => ({ from: `p:${p.slug}`, to: `m:${m}` })));
  const right = (Object.keys(METHODS) as MethodId[])
    .map((m) => ({ key: `m:${m}`, label: METHODS[m], uses: edges.filter((e) => e.to === `m:${m}`).length }))
    .filter((m) => m.uses > 0)
    .sort((a, b) => b.uses - a.uses);
  return { left, right, edges };
}

export function MethodsGraph() {
  const { left, right, edges } = useMemo(buildGraph, []);
  const [hovered, setHovered] = useState<Key | null>(null);
  const [pinned, setPinned] = useState<Key | null>(null);
  const active = pinned ?? hovered;
  const nodes = useRef(new Map<Key, HTMLButtonElement>());
  const [box, width] = useWidth<HTMLDivElement>(0);

  const linked = useMemo(() => {
    if (!active) return null;
    return new Set([active, ...edges.flatMap((e) => (e.from === active ? [e.to] : e.to === active ? [e.from] : []))]);
  }, [active, edges]);

  // Edges are measured from the rendered buttons, so they are redrawn when the width or the font changes.
  const [curves, setCurves] = useState<{ from: Key; to: Key; d: string }[]>([]);
  useIsoLayoutEffect(() => {
    const measure = () => {
      const root = box.current?.getBoundingClientRect();
      if (!root) return;
      setCurves(
        edges.flatMap((e) => {
          const a = nodes.current.get(e.from)?.getBoundingClientRect();
          const b = nodes.current.get(e.to)?.getBoundingClientRect();
          if (!a || !b) return [];
          const [x1, y1] = [a.right - root.left, a.top + a.height / 2 - root.top];
          const [x2, y2] = [b.left - root.left, b.top + b.height / 2 - root.top];
          const mid = (x1 + x2) / 2;
          return [{ ...e, d: `M${x1} ${y1}C${mid} ${y1} ${mid} ${y2} ${x2} ${y2}` }];
        }),
      );
    };
    measure();
    document.fonts?.ready.then(measure);
  }, [box, edges, width]);

  const node = (key: Key) => ({
    ref: (el: HTMLButtonElement | null) => void (el ? nodes.current.set(key, el) : nodes.current.delete(key)),
    type: "button" as const,
    className: "node",
    "aria-pressed": pinned === key,
    "data-state": !linked ? undefined : key === active ? "active" : linked.has(key) ? "linked" : "dim",
    onPointerEnter: () => setHovered(key),
    onPointerLeave: () => setHovered(null),
    onFocus: () => setHovered(key),
    onBlur: () => setHovered(null),
    onClick: () => setPinned(pinned === key ? null : key),
  });

  const activeLabel = [...left, ...right].find((n) => n.key === active)?.label;
  return (
    <section className="panel" aria-labelledby="methods-title">
      <div className="section-head">
        <h2 id="methods-title">Methods across projects</h2>
        <p>Select a project or a method to see what connects them.</p>
      </div>
      <div className="graph" ref={box}>
        <svg className="graph-edges" aria-hidden="true">
          {curves.map((c) => {
            const on = active !== null && (c.from === active || c.to === active);
            return <path key={c.from + c.to} d={c.d} data-on={on} data-dim={active !== null && !on} />;
          })}
        </svg>
        <ul aria-label="Projects">
          {left.map((n) => (
            <li key={n.key}>
              <button {...node(n.key)}>{n.label}</button>
            </li>
          ))}
        </ul>
        <ul aria-label="Methods">
          {right.map((n) => (
            <li key={n.key}>
              <button {...node(n.key)}>
                {n.label} <span className="node-count">{n.uses}</span>
              </button>
            </li>
          ))}
        </ul>
      </div>
      <p className="graph-caption" aria-live="polite">
        {activeLabel ? `${linked!.size - 1} connected to ${activeLabel}` : "Nothing selected."}
      </p>
    </section>
  );
}
