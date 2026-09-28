import { useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";

const useIsoLayoutEffect = typeof window === "undefined" ? useEffect : useLayoutEffect;
import { METHODS, type MethodId } from "../data/methods";
import { PROJECTS } from "../data/projects";
import { SPECS } from "../data/specs";
import { FEATURES } from "../config";

type NodeKey = `p:${string}` | `m:${MethodId}`;
interface Edge { from: NodeKey; to: NodeKey }

/** Bipartite graph: work (projects and specs) on the left, the methods they share on the right. */
export function buildGraph() {
  const left = [
    ...PROJECTS.filter((p) => p.methods.length).map((p) => ({ key: `p:${p.slug}` as NodeKey, label: p.name, methods: p.methods })),
    ...(FEATURES.openSourceSpecs ? SPECS : []).filter((s) => s.methods.length).map((s) => ({ key: `p:spec-${s.slug}` as NodeKey, label: `${s.name} (spec)`, methods: s.methods })),
  ];
  const edges: Edge[] = left.flatMap((n) => n.methods.map((m) => ({ from: n.key, to: `m:${m}` as NodeKey })));
  const degree = new Map<MethodId, number>();
  edges.forEach((e) => degree.set(e.to.slice(2) as MethodId, (degree.get(e.to.slice(2) as MethodId) ?? 0) + 1));
  const right = METHODS.map((m) => ({ key: `m:${m.id}` as NodeKey, label: m.label, degree: degree.get(m.id) ?? 0 }))
    .filter((m) => m.degree > 0)
    .sort((a, b) => b.degree - a.degree);
  return { left, right, edges };
}

export function Connections({ headingLevel = 2 }: { headingLevel?: 1 | 2 }) {
  const H = headingLevel === 1 ? "h1" : "h2";
  const { left, right, edges } = useMemo(buildGraph, []);
  const [hover, setHover] = useState<NodeKey | null>(null);
  const [pinned, setPinned] = useState<NodeKey | null>(null);
  const focus = pinned ?? hover;
  const box = useRef<HTMLDivElement>(null);
  const refs = useRef(new Map<NodeKey, HTMLButtonElement>());
  const [paths, setPaths] = useState<{ d: string; e: Edge }[]>([]);

  const linked = useMemo(() => {
    if (!focus) return null;
    const s = new Set<NodeKey>([focus]);
    edges.forEach((e) => {
      if (e.from === focus) s.add(e.to);
      if (e.to === focus) s.add(e.from);
    });
    return s;
  }, [focus, edges]);

  const measure = useCallback(() => {
    const root = box.current?.getBoundingClientRect();
    if (!root) return;
    const next = edges.flatMap((e) => {
      const a = refs.current.get(e.from)?.getBoundingClientRect();
      const b = refs.current.get(e.to)?.getBoundingClientRect();
      if (!a || !b) return [];
      const x1 = a.right - root.left, y1 = a.top + a.height / 2 - root.top;
      const x2 = b.left - root.left, y2 = b.top + b.height / 2 - root.top;
      const mx = (x1 + x2) / 2;
      return [{ d: `M${x1} ${y1} C${mx} ${y1} ${mx} ${y2} ${x2} ${y2}`, e }];
    });
    setPaths(next);
  }, [edges]);

  useIsoLayoutEffect(() => {
    measure();
    const ro = new ResizeObserver(measure);
    if (box.current) ro.observe(box.current);
    document.fonts?.ready.then(measure);
    return () => ro.disconnect();
  }, [measure]);

  const nodeProps = (key: NodeKey) => ({
    ref: (el: HTMLButtonElement | null) => void (el ? refs.current.set(key, el) : refs.current.delete(key)),
    type: "button" as const,
    className: "node",
    "aria-pressed": pinned === key,
    "data-dim": linked ? !linked.has(key) : false,
    "data-linked": linked ? linked.has(key) && key !== focus : false,
    onMouseEnter: () => setHover(key),
    onMouseLeave: () => setHover(null),
    onFocus: () => setHover(key),
    onBlur: () => setHover(null),
    onClick: () => setPinned((p) => (p === key ? null : key)),
  });

  const describe = focus
    ? `${[...(linked ?? [])].filter((k) => k !== focus).length} connections for ${[...left, ...right].find((n) => n.key === focus)?.label}`
    : "Select a project or a method to trace its connections.";

  return (
    <section id="connections" className="sheet section" aria-labelledby="connections-title">
      <div className="section-head">
        <H id="connections-title" tabIndex={-1}>Methods across projects</H>
        <p>Projects on the left, the methods they use on the right. Select either side to see the links.</p>
      </div>
      <div className="graph" ref={box}>
        <svg className="edges" aria-hidden="true">
          {paths.map(({ d, e }, i) => {
            const on = linked ? linked.has(e.from) && linked.has(e.to) && (e.from === focus || e.to === focus) : false;
            return <path key={i} d={d} fill="none" stroke={on ? "var(--moss)" : "var(--hair-strong)"} strokeWidth={on ? 1.6 : 1} opacity={linked && !on ? 0.25 : 1} />;
          })}
        </svg>
        <ul className="left" aria-label="Projects">
          {left.map((n) => (
            <li key={n.key}><button {...nodeProps(n.key)}>{n.label}</button></li>
          ))}
        </ul>
        <ul className="right" aria-label="Methods">
          {right.map((n) => (
            <li key={n.key}><button {...nodeProps(n.key)}>{n.label}<span className="n">{n.degree}</span></button></li>
          ))}
        </ul>
      </div>
      <p className="graph-caption" aria-live="polite">{describe}</p>
    </section>
  );
}
