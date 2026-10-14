/**
 * Line illustrations drawn in the site palette. All are synthetic and decorative: no axes, no real values.
 */
import { useMemo, type ReactElement } from "react";
import { normal, seeded } from "../lib/random";

const scene = { viewBox: "0 0 320 200", preserveAspectRatio: "xMidYMid slice", "aria-hidden": true } as const;
const line = { fill: "none", stroke: "var(--sage)", strokeLinecap: "round", strokeLinejoin: "round" } as const;

const toPath = (points: [number, number][]) =>
  "M" + points.map(([x, y]) => `${x.toFixed(1)} ${y.toFixed(1)}`).join("L");

function Grid() {
  const xs = Array.from({ length: 15 }, (_, i) => 20 + i * 20);
  const ys = Array.from({ length: 9 }, (_, i) => 20 + i * 20);
  return (
    <g stroke="var(--grid)">
      {xs.map((x) => (
        <line key={`x${x}`} x1={x} x2={x} y1={0} y2={200} />
      ))}
      {ys.map((y) => (
        <line key={`y${y}`} x1={0} x2={320} y1={y} y2={y} />
      ))}
    </g>
  );
}

/** Heart-rate trend inside a personal band, with one excursion below it. */
export function MonitorArt() {
  const { trace, band, low } = useMemo(() => {
    const z = normal(seeded(0x5e1a));
    const dip = [0, -12, -28, -44, -52, -55, -54, -50, -44, -34, -24, -15, -8, -4, -2, -1];
    const y = (bpm: number) => 30 + 110 * (1 - (bpm - 85) / 100);
    const base = Array.from({ length: 120 }, (_, i) => 150 + 6 * Math.sin(i / 19) + 3 * Math.sin(i / 6.5));
    const hr = base.map((b, i) => b + 2 * z() + (dip[i - 80] ?? 0));
    const x = (i: number) => (i / 119) * 320;
    const upper = base.map((b, i): [number, number] => [x(i), y(b + 13)]);
    const lower = base.map((b, i): [number, number] => [x(i), y(b - 13)]).reverse();
    const low = hr.indexOf(Math.min(...hr));
    return {
      trace: toPath(hr.map((v, i) => [x(i), y(v)])),
      band: toPath([...upper, ...lower]) + "Z",
      low: [x(low), y(hr[low])],
    };
  }, []);
  return (
    <svg {...scene}>
      <rect width={320} height={200} fill="var(--mat)" />
      <Grid />
      <path d={band} fill="var(--band)" />
      <path d={trace} {...line} strokeWidth={1.6} />
      <circle cx={low[0]} cy={low[1]} r={9} fill="none" stroke="var(--clay)" strokeWidth={1.8} />
    </svg>
  );
}

/** Stacked payer files condensing into one summary. */
export function RatesArt() {
  return (
    <svg {...scene}>
      <rect width={320} height={200} fill="var(--mat)" />
      {[0, 1, 2, 3, 4].map((i) => (
        <g key={i} transform={`translate(${26 + i * 7} ${36 + i * 9})`}>
          <rect width={76} height={96} rx={4} fill="var(--white)" stroke="var(--line)" />
          {[18, 30, 42, 54].map((y) => (
            <line
              key={y}
              x1={12}
              x2={y === 54 ? 44 : 62}
              y1={y}
              y2={y}
              stroke="var(--grid)"
              strokeWidth={3}
              strokeLinecap="round"
            />
          ))}
        </g>
      ))}
      {[70, 88, 106, 124, 142].map((y, i) => (
        <path
          key={y}
          d={`M${116 + i * 4} ${y}C160 ${y} 170 100 204 100`}
          {...line}
          strokeWidth={1.3}
          opacity={0.35 + i * 0.12}
        />
      ))}
      <rect x={206} y={50} width={92} height={100} rx={8} fill="var(--white)" stroke="var(--sage)" strokeWidth={1.4} />
      {[0.82, 0.58, 0.71, 0.44].map((w, i) => (
        <rect
          key={i}
          x={218}
          y={66 + i * 20}
          width={68 * w}
          height={8}
          rx={4}
          fill={i === 1 ? "var(--clay)" : "var(--sage)"}
          opacity={i === 1 ? 1 : 0.55}
        />
      ))}
    </svg>
  );
}

/** Growth-chart centiles with one infant's measurements. */
export function CentileArt() {
  const curve = (k: number) =>
    toPath(
      Array.from({ length: 41 }, (_, i) => [24 + (i / 40) * 276, 172 - (Math.sqrt(i / 40) * 110 + k * (8 + i * 0.35))]),
    );
  const infant = [0.05, 0.14, 0.24, 0.35, 0.47, 0.58, 0.7, 0.82].map((u, i) => [
    24 + u * 276,
    172 - (Math.sqrt(u) * 110 + (0.2 + i * 0.12) * (8 + u * 14)),
  ]);
  return (
    <svg {...scene}>
      <rect width={320} height={200} fill="var(--mat)" />
      <Grid />
      {[-2, -1, 0, 1, 2].map((k) => (
        <path key={k} d={curve(k)} {...line} strokeWidth={k === 0 ? 2 : 1.2} opacity={k === 0 ? 0.9 : 0.45} />
      ))}
      {infant.map(([x, y]) => (
        <circle key={x} cx={x} cy={y} r={4.2} fill="var(--clay)" />
      ))}
    </svg>
  );
}

/** A gene network with one highlighted module. */
export function NetworkArt() {
  const { nodes, edges } = useMemo(() => {
    const r = seeded(0x7e11);
    const nodes = Array.from({ length: 26 }, () => ({ x: 24 + r() * 272, y: 22 + r() * 156, hot: false }));
    const dist = (a: (typeof nodes)[number], b: (typeof nodes)[number]) => Math.hypot(a.x - b.x, a.y - b.y);
    const hub = nodes.reduce((best, n) =>
      dist(n, { x: 200, y: 90, hot: false }) < dist(best, { x: 200, y: 90, hot: false }) ? n : best,
    );
    nodes.forEach((n) => (n.hot = dist(n, hub) < 62));
    const edges = nodes.flatMap((a, i) =>
      nodes
        .map((b, j) => ({ j, d: dist(a, b) }))
        .filter(({ j }) => j !== i)
        .sort((p, q) => p.d - q.d)
        .slice(0, 3)
        .filter(({ j }) => i < j)
        .map(({ j }) => [i, j] as const),
    );
    return { nodes, edges };
  }, []);
  return (
    <svg {...scene}>
      <rect width={320} height={200} fill="var(--mat)" />
      {edges.map(([a, b]) => {
        const hot = nodes[a].hot && nodes[b].hot;
        return (
          <line
            key={`${a}-${b}`}
            x1={nodes[a].x}
            y1={nodes[a].y}
            x2={nodes[b].x}
            y2={nodes[b].y}
            stroke={hot ? "var(--clay)" : "var(--sage)"}
            strokeWidth={hot ? 1.8 : 1}
            opacity={hot ? 1 : 0.4}
          />
        );
      })}
      {nodes.map((n, i) => (
        <circle
          key={i}
          cx={n.x}
          cy={n.y}
          r={n.hot ? 5.5 : 4}
          fill={n.hot ? "var(--clay)" : "var(--white)"}
          stroke={n.hot ? "var(--clay)" : "var(--sage)"}
          strokeWidth={1.4}
        />
      ))}
    </svg>
  );
}

/* Portrait glyphs for the research-interest cards */
const portrait = { viewBox: "0 0 120 150", "aria-hidden": true, ...line, strokeWidth: 1.5 } as const;
const Mat = ({ w = 120, h = 150 }) => <rect width={w} height={h} fill="var(--mat)" stroke="none" />;
const Dot = ({ x, y, r = 4.5 }: { x: number; y: number; r?: number }) => (
  <circle cx={x} cy={y} r={r} fill="var(--clay)" stroke="none" />
);

export const GLYPHS = {
  pulse: (
    <>
      <path d="M14 80h22l7-22 10 44 8-30 5 8h40" />
      <path d="M14 110h92" stroke="var(--line)" />
    </>
  ),
  centiles: (
    <>
      {[-1, 0, 1].map((k) => (
        <path
          key={k}
          d={`M16 ${118 + k * 10}C50 ${96 + k * 12} 70 ${62 + k * 14} 104 ${44 + k * 16}`}
          opacity={k ? 0.45 : 1}
        />
      ))}
      <Dot x={72} y={64} />
    </>
  ),
  bars: (
    <>
      {[0.7, 0.35, 0.9, 0.5, 0.25, 0.8, 0.6].map((h, i) => (
        <line
          key={i}
          x1={24 + i * 12}
          x2={24 + i * 12}
          y1={118}
          y2={118 - h * 76}
          strokeWidth={6}
          stroke={i === 2 ? "var(--clay)" : "var(--sage)"}
          opacity={i === 2 ? 1 : 0.6}
        />
      ))}
    </>
  ),
  network: (
    <>
      <path d="M30 50L60 40L88 62L70 96L40 100ZM60 40L70 96M30 50L70 96" strokeWidth={1.3} opacity={0.6} />
      {[
        [30, 50],
        [60, 40],
        [88, 62],
        [40, 100],
      ].map(([x, y]) => (
        <circle key={x} cx={x} cy={y} r={6} fill="var(--white)" />
      ))}
      <Dot x={70} y={96} r={6} />
    </>
  ),
  population: (
    <>
      {Array.from({ length: 25 }, (_, i) => {
        const hot = i % 7 === 0;
        return (
          <circle
            key={i}
            cx={24 + (i % 5) * 18}
            cy={40 + Math.floor(i / 5) * 18}
            r={4}
            fill={hot ? "var(--clay)" : "var(--white)"}
            stroke={hot ? "var(--clay)" : "var(--sage)"}
          />
        );
      })}
    </>
  ),
  calibration: (
    <>
      <path d="M22 118L100 40" stroke="var(--line)" strokeDasharray="4 4" />
      {[
        [30, 112],
        [44, 96],
        [58, 84],
        [86, 58],
        [98, 44],
      ].map(([x, y]) => (
        <circle key={x} cx={x} cy={y} r={4.5} fill="var(--sage)" stroke="none" />
      ))}
      <Dot x={72} y={68} />
    </>
  ),
  skin: (
    <>
      {["#f1d9c5", "#e0b999", "#c6946c", "#a06e4b", "#744b31", "#4a3122"].map((c, i) => (
        <circle key={c} cx={30 + (i % 3) * 30} cy={58 + Math.floor(i / 3) * 34} r={11} fill={c} stroke="var(--line)" />
      ))}
    </>
  ),
  schedule: (
    <>
      <rect x={20} y={40} width={80} height={70} rx={4} fill="var(--white)" />
      {Array.from({ length: 16 }, (_, i) => {
        const [r, c] = [Math.floor(i / 4), i % 4];
        const fill = (r + c) % 3 === 0 ? "var(--sage)" : (r * c) % 5 === 1 ? "var(--clay)" : "var(--mat)";
        return (
          <rect
            key={i}
            x={28 + c * 17}
            y={52 + r * 13}
            width={13}
            height={8}
            rx={2}
            stroke="none"
            fill={fill}
            opacity={fill === "var(--sage)" ? 0.7 : 1}
          />
        );
      })}
    </>
  ),
} satisfies Record<string, ReactElement>;

export type GlyphName = keyof typeof GLYPHS;

export const Glyph = ({ name }: { name: GlyphName }) => (
  <svg {...portrait}>
    <Mat />
    {GLYPHS[name]}
  </svg>
);

/* Square icons for the item rows */
const square = { viewBox: "0 0 100 100", "aria-hidden": true, ...line, strokeWidth: 1.5 } as const;

export const ICONS = {
  ecg: <path d="M8 56h16l5-10 5 10h6l4-30 6 52 5-22h8l4-6 5 6h20M8 80h84" />,
  graph: (
    <>
      <path d="M24 30L50 22L74 36L66 66L36 72ZM50 22L66 66M24 30L66 66M36 72L74 36" strokeWidth={1.2} opacity={0.55} />
      {[
        [24, 30],
        [50, 22],
        [74, 36],
        [66, 66],
        [36, 72],
      ].map(([x, y]) => (
        <circle key={x} cx={x} cy={y} r={4.5} fill="var(--white)" />
      ))}
      <Dot x={50} y={48} r={6} />
    </>
  ),
  eeg: (
    <>
      <path d="M8 30c6-6 10 6 16 0s10 6 16 0 10 6 16 0 10 6 16 0 10 6 20 0" />
      <path d="M8 52c4-10 8 10 12 0s8 10 12 0 8 10 12 0 8 14 14-4 8 10 14 0 8 6 16 0" opacity={0.7} />
      <path d="M8 74c6-4 10 4 16 0s10 4 16 0 10 10 16-6 10 10 16 0 10 4 20 0" stroke="var(--clay)" />
    </>
  ),
  molecule: (
    <>
      <path d="M50 26L70 38V62L50 74L30 62V38ZM70 38L84 30M30 62L16 70M50 74V88" />
      <path d="M50 34L63 42V58L50 66" opacity={0.5} />
      <Dot x={84} y={30} r={4} />
    </>
  ),
  helix: (
    <>
      <path d="M20 30C35 10 45 50 60 30S85 50 88 30" />
      <path d="M12 60C27 40 37 80 52 60S77 80 84 60" opacity={0.6} />
      <path d="M30 22V68M46 40V66M62 26V72" stroke="var(--line)" />
    </>
  ),
  trend: (
    <>
      <path d="M8 40c10-4 14 4 22 0s12 4 18 2 6 30 10 30 4-28 10-30 12 2 24-2" />
      <path d="M8 58h84" stroke="var(--line)" strokeDasharray="3 4" />
      <Dot x={58} y={72} r={4} />
    </>
  ),
  centile: (
    <>
      {[-1, 0, 1].map((k) => (
        <path
          key={k}
          d={`M12 ${80 + k * 8}C40 ${64 + k * 9} 58 ${40 + k * 10} 88 ${26 + k * 12}`}
          opacity={k ? 0.45 : 1}
        />
      ))}
      <Dot x={56} y={46} r={4} />
    </>
  ),
  oxygen: (
    <>
      <path d="M10 30h20v14h20v14h20v14h20M10 84h80" />
      <Dot x={30} y={44} r={4} />
    </>
  ),
  airway: (
    <>
      <path d="M50 12v30M50 42L32 58M50 42l18 16M32 58l-10 16M32 58l6 18M68 58l10 16M68 58l-6 18" />
      <Dot x={22} y={76} r={3.5} />
    </>
  ),
  feeding: (
    <>
      <path d="M50 14c10 14 18 24 18 34a18 18 0 0 1-36 0c0-10 8-20 18-34z" />
      <path d="M14 80c8-6 14 6 22 0s14 6 22 0 14 6 28 0" stroke="var(--clay)" />
    </>
  ),
} satisfies Record<string, ReactElement>;

export type IconName = keyof typeof ICONS;

export const Icon = ({ name }: { name: IconName }) => <svg {...square}>{ICONS[name]}</svg>;

/* Interface icons */
export function ArrowCircle({ direction = "out" }: { direction?: "out" | "left" | "right" }) {
  const d = { out: "M6 11l5-5M7 6h4v4", left: "M12.5 8.5H5M8 5.5l-3 3 3 3", right: "M4.5 8.5H12M9 5.5l3 3-3 3" }[
    direction
  ];
  return (
    <svg
      width={17}
      height={17}
      viewBox="0 0 17 17"
      aria-hidden="true"
      {...line}
      stroke="currentColor"
      strokeWidth={1.3}
    >
      <circle cx={8.5} cy={8.5} r={7.6} />
      <path d={d} />
    </svg>
  );
}

export const CodeIcon = () => (
  <svg width={18} height={18} viewBox="0 0 18 18" aria-hidden="true" {...line} stroke="currentColor" strokeWidth={1.4}>
    <path d="M6 5L2 9l4 4M12 5l4 4-4 4" />
  </svg>
);

export const Mark = ({ width = 30 }: { width?: number }) => (
  <svg
    width={width}
    height={(width * 18) / 30}
    viewBox="0 0 30 18"
    aria-hidden="true"
    {...line}
    stroke="currentColor"
    strokeWidth={1.8}
  >
    <path d="M1 10h6l2.5-7 3.5 13 2.5-9 1.8 3H29" />
  </svg>
);
