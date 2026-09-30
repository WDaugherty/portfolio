/**
 * Line illustrations for the project windows and area cards. Drawn in the palette,
 * synthetic, and purely illustrative: no axes, no values, nothing to mistake for data.
 */
import { useMemo } from "react";
import { makeTrace } from "../lib/trace";
import { mulberry32 } from "../lib/prng";

const VB = "0 0 320 200";
const common = { viewBox: VB, preserveAspectRatio: "xMidYMid slice", "aria-hidden": true } as const;

function Grid() {
  const lines = [];
  for (let x = 20; x < 320; x += 20) lines.push(<line key={`x${x}`} x1={x} x2={x} y1="0" y2="200" />);
  for (let y = 20; y < 200; y += 20) lines.push(<line key={`y${y}`} x1="0" x2="320" y1={y} y2={y} />);
  return <g stroke="var(--art-grid)" strokeWidth="1">{lines}</g>;
}

export function MonitorArt() {
  const d = useMemo(() => {
    const t = makeTrace();
    const pts = (arr: Float32Array, lo: number, hi: number, top: number, h: number) =>
      Array.from(arr).filter((_, i) => i % 2 === 0).map((v, i, a) => `${((i / (a.length - 1)) * 320).toFixed(1)} ${(top + h * (1 - (v - lo) / (hi - lo))).toFixed(1)}`);
    const hr = pts(t.hr, 85, 185, 30, 110);
    const up = pts(t.hrHi, 85, 185, 30, 110), dn = pts(t.hrLo, 85, 185, 30, 110).reverse();
    return { line: "M" + hr.join(" L"), band: "M" + up.join(" L") + " L" + dn.join(" L") + " Z" };
  }, []);
  return (
    <svg {...common}>
      <rect width="320" height="200" fill="var(--glass)" />
      <Grid />
      <path d={d.band} fill="var(--art-band)" />
      <path d={d.line} fill="none" stroke="var(--moss)" strokeWidth="1.6" strokeLinejoin="round" />
      <circle cx="214" cy="133" r="9" fill="none" stroke="var(--clay)" strokeWidth="1.8" />
      <path d="M0 170 H320" stroke="var(--line)" />
    </svg>
  );
}

export function RatesArt() {
  const sheets = [0, 1, 2, 3, 4];
  const bars = [0.82, 0.58, 0.71, 0.44];
  return (
    <svg {...common}>
      <rect width="320" height="200" fill="var(--glass)" />
      {sheets.map((i) => (
        <g key={i} transform={`translate(${26 + i * 7} ${36 + i * 9})`}>
          <rect width="76" height="96" rx="4" fill="var(--panel)" stroke="var(--line)" />
          {[18, 30, 42, 54].map((y) => <line key={y} x1="12" x2={y === 54 ? 44 : 62} y1={y} y2={y} stroke="var(--art-grid)" strokeWidth="3" strokeLinecap="round" />)}
        </g>
      ))}
      {[70, 88, 106, 124, 142].map((y, i) => (
        <path key={y} d={`M${116 + i * 4} ${y} C 160 ${y}, 170 100, 204 100`} fill="none" stroke="var(--moss)" strokeWidth="1.3" opacity={0.35 + i * 0.12} />
      ))}
      <rect x="206" y="50" width="92" height="100" rx="8" fill="var(--panel)" stroke="var(--moss)" strokeWidth="1.4" />
      {bars.map((b, i) => (
        <rect key={i} x="218" y={66 + i * 20} width={68 * b} height="8" rx="4" fill={i === 1 ? "var(--clay)" : "var(--moss)"} opacity={i === 1 ? 1 : 0.55} />
      ))}
    </svg>
  );
}

export function CentileArt() {
  const curves = [-2, -1, 0, 1, 2].map((k) => {
    const pts: string[] = [];
    for (let i = 0; i <= 40; i++) {
      const x = 24 + (i / 40) * 276;
      const y = 172 - (Math.sqrt(i / 40) * 110 + k * (8 + i * 0.35));
      pts.push(`${x.toFixed(1)} ${y.toFixed(1)}`);
    }
    return { k, d: "M" + pts.join(" L") };
  });
  const infant = [0.05, 0.14, 0.24, 0.35, 0.47, 0.58, 0.7, 0.82].map((u, i) => {
    const x = 24 + u * 276;
    const k = 0.2 + i * 0.12;
    const y = 172 - (Math.sqrt(u) * 110 + k * (8 + u * 40 * 0.35));
    return [x, y];
  });
  return (
    <svg {...common}>
      <rect width="320" height="200" fill="var(--glass)" />
      <Grid />
      {curves.map((c) => <path key={c.k} d={c.d} fill="none" stroke="var(--moss)" strokeWidth={c.k === 0 ? 2 : 1.2} opacity={c.k === 0 ? 0.9 : 0.45} />)}
      {infant.map(([x, y], i) => <circle key={i} cx={x} cy={y} r="4.2" fill="var(--clay)" />)}
    </svg>
  );
}

export function NetworkArt() {
  const { nodes, edges } = useMemo(() => {
    const r = mulberry32(0x7e11);
    const nodes = Array.from({ length: 26 }, (_, i) => ({ i, x: 24 + r() * 272, y: 22 + r() * 156, hot: false }));
    const hub = nodes.reduce((best, n) => (Math.hypot(n.x - 200, n.y - 90) < Math.hypot(best.x - 200, best.y - 90) ? n : best));
    const edges: [number, number][] = [];
    nodes.forEach((a) => {
      const near = nodes.filter((b) => b.i !== a.i).sort((p, q) => Math.hypot(p.x - a.x, p.y - a.y) - Math.hypot(q.x - a.x, q.y - a.y)).slice(0, 3);
      near.forEach((b) => a.i < b.i && edges.push([a.i, b.i]));
    });
    nodes.filter((n) => Math.hypot(n.x - hub.x, n.y - hub.y) < 62).forEach((n) => (n.hot = true));
    return { nodes, edges };
  }, []);
  return (
    <svg {...common}>
      <rect width="320" height="200" fill="var(--glass)" />
      {edges.map(([a, b], k) => {
        const hot = nodes[a].hot && nodes[b].hot;
        return <line key={k} x1={nodes[a].x} y1={nodes[a].y} x2={nodes[b].x} y2={nodes[b].y} stroke={hot ? "var(--clay)" : "var(--moss)"} strokeWidth={hot ? 1.8 : 1} opacity={hot ? 1 : 0.4} />;
      })}
      {nodes.map((n) => <circle key={n.i} cx={n.x} cy={n.y} r={n.hot ? 5.5 : 4} fill={n.hot ? "var(--clay)" : "var(--panel)"} stroke={n.hot ? "var(--clay)" : "var(--moss)"} strokeWidth="1.4" />)}
    </svg>
  );
}

/* Small glyphs for the area cards (square, line style) */
const g = { viewBox: "0 0 120 150", "aria-hidden": true, fill: "none", stroke: "var(--moss)", strokeWidth: 1.5, strokeLinecap: "round", strokeLinejoin: "round" } as const;

export const Glyphs = {
  pulse: () => (
    <svg {...g}><rect width="120" height="150" fill="var(--glass)" stroke="none" /><path d="M14 80h22l7-22 10 44 8-30 5 8h40" /><path d="M14 110h92" stroke="var(--line)" /></svg>
  ),
  population: () => (
    <svg {...g}><rect width="120" height="150" fill="var(--glass)" stroke="none" />
      {[0, 1, 2, 3, 4].map((r) => [0, 1, 2, 3, 4].map((c) => <circle key={`${r}${c}`} cx={24 + c * 18} cy={40 + r * 18} r="4" fill={(r * 5 + c) % 7 === 0 ? "var(--clay)" : "var(--panel)"} stroke={(r * 5 + c) % 7 === 0 ? "var(--clay)" : "var(--moss)"} />))}
    </svg>
  ),
  genes: () => (
    <svg {...g}><rect width="120" height="150" fill="var(--glass)" stroke="none" />
      {[0.7, 0.35, 0.9, 0.5, 0.25, 0.8, 0.6].map((h, i) => <line key={i} x1={24 + i * 12} x2={24 + i * 12} y1="118" y2={118 - h * 76} strokeWidth="6" stroke={i === 2 ? "var(--clay)" : "var(--moss)"} opacity={i === 2 ? 1 : 0.6} />)}
    </svg>
  ),
  centiles: () => (
    <svg {...g}><rect width="120" height="150" fill="var(--glass)" stroke="none" />
      {[-1, 0, 1].map((k) => <path key={k} d={`M16 ${118 + k * 10} C 50 ${96 + k * 12}, 70 ${62 + k * 14}, 104 ${44 + k * 16}`} opacity={k === 0 ? 1 : 0.45} />)}
      <circle cx="72" cy="64" r="4.5" fill="var(--clay)" stroke="var(--clay)" />
    </svg>
  ),
  skin: () => (
    <svg {...g}><rect width="120" height="150" fill="var(--glass)" stroke="none" />
      {["#f1d9c5", "#e0b999", "#c6946c", "#a06e4b", "#744b31", "#4a3122"].map((c, i) => <circle key={c} cx={30 + (i % 3) * 30} cy={58 + Math.floor(i / 3) * 34} r="11" fill={c} stroke="var(--line)" />)}
    </svg>
  ),
  sheets: () => (
    <svg {...g}><rect width="120" height="150" fill="var(--glass)" stroke="none" />
      {[0, 1, 2].map((i) => <rect key={i} x={26 + i * 8} y={36 + i * 10} width="52" height="66" rx="3" fill="var(--panel)" stroke={i === 2 ? "var(--moss)" : "var(--line)"} />)}
      {[58, 68, 78].map((y, i) => <line key={y} x1="52" x2={i === 1 ? 70 : 88} y1={y + 20} y2={y + 20} stroke={i === 1 ? "var(--clay)" : "var(--moss)"} strokeWidth="3" />)}
    </svg>
  ),
  network: () => (
    <svg {...g}><rect width="120" height="150" fill="var(--glass)" stroke="none" />
      <path d="M30 50L60 40L88 62L70 96L40 100Z M60 40L70 96 M30 50L70 96" strokeWidth="1.3" opacity="0.6" />
      {[[30, 50], [60, 40], [88, 62], [70, 96], [40, 100]].map(([x, y], i) => <circle key={i} cx={x} cy={y} r="6" fill={i === 3 ? "var(--clay)" : "var(--white)"} stroke={i === 3 ? "var(--clay)" : "var(--moss)"} />)}
    </svg>
  ),
  calendar: () => (
    <svg {...g}><rect width="120" height="150" fill="var(--glass)" stroke="none" />
      <rect x="20" y="40" width="80" height="70" rx="4" fill="var(--white)" />
      {[0, 1, 2, 3].map((r) => [0, 1, 2, 3].map((c) => <rect key={`${r}${c}`} x={28 + c * 17} y={52 + r * 13} width="13" height="8" rx="2" stroke="none" fill={(r + c) % 3 === 0 ? "var(--moss)" : (r * c) % 5 === 1 ? "var(--clay)" : "var(--glass)"} opacity={(r + c) % 3 === 0 ? 0.7 : 1} />))}
    </svg>
  ),
  calibration: () => (
    <svg {...g}><rect width="120" height="150" fill="var(--glass)" stroke="none" />
      <path d="M22 118L100 40" stroke="var(--line)" strokeDasharray="4 4" />
      <path d="M22 118L100 40" stroke="none" />
      {[[30, 112], [44, 96], [58, 84], [72, 68], [86, 58], [98, 44]].map(([x, y], i) => <circle key={i} cx={x} cy={y} r="4.5" fill={i === 3 ? "var(--clay)" : "var(--moss)"} stroke="none" />)}
    </svg>
  ),
};

/* Square line art for the earlier-work cards */
const c = { viewBox: "0 0 100 100", "aria-hidden": true, fill: "none", stroke: "var(--moss)", strokeWidth: 1.5, strokeLinecap: "round", strokeLinejoin: "round" } as const;

export const CardArt = {
  ecg: () => (
    <svg {...c}><path d="M8 56h16l5-10 5 10h6l4-30 6 52 5-22h8l4-6 5 6h20" /><path d="M8 80h84" stroke="var(--line)" /></svg>
  ),
  graph: () => (
    <svg {...c}>
      <path d="M24 30L50 22L74 36L66 66L36 72Z M50 22L66 66 M24 30L66 66 M36 72L74 36" strokeWidth="1.2" opacity="0.55" />
      {[[24, 30], [50, 22], [74, 36], [66, 66], [36, 72], [50, 48]].map(([x, y], i) => <circle key={i} cx={x} cy={y} r={i === 5 ? 6 : 4.5} fill={i === 5 ? "var(--clay)" : "var(--white)"} stroke={i === 5 ? "var(--clay)" : "var(--moss)"} />)}
    </svg>
  ),
  molecule: () => (
    <svg {...c}>
      <path d="M50 26L70 38V62L50 74L30 62V38Z" />
      <path d="M50 34L63 42V58L50 66" opacity="0.5" />
      <path d="M70 38L84 30M30 62L16 70M50 74V88" />
      <circle cx="84" cy="30" r="4" fill="var(--clay)" stroke="var(--clay)" />
    </svg>
  ),
  helix: () => (
    <svg {...c}>
      <path d="M20 30C35 10 45 50 60 30S85 50 88 30" />
      <path d="M12 60C27 40 37 80 52 60S77 80 84 60" opacity="0.6" />
      <path d="M30 22V68M46 40V66M62 26V72" stroke="var(--line)" />
    </svg>
  ),
  eeg: () => (
    <svg {...c}>
      <path d="M8 30c6-6 10 6 16 0s10 6 16 0 10 6 16 0 10 6 16 0 10 6 20 0" />
      <path d="M8 52c4-10 8 10 12 0s8 10 12 0 8 10 12 0 8 14 14-4 8 10 14 0 8 6 16 0" opacity="0.7" />
      <path d="M8 74c6-4 10 4 16 0s10 4 16 0 10 10 16-6 10 10 16 0 10 4 20 0" stroke="var(--clay)" />
    </svg>
  ),
  trend: () => (
    <svg {...c}><path d="M8 40c10-4 14 4 22 0s12 4 18 2 6 30 10 30 4-28 10-30 12 2 24-2" /><path d="M8 58h84" stroke="var(--line)" strokeDasharray="3 4" /><circle cx="58" cy="72" r="4" fill="var(--clay)" stroke="var(--clay)" /></svg>
  ),
  centile: () => (
    <svg {...c}>{[-1, 0, 1].map((k) => <path key={k} d={`M12 ${80 + k * 8} C 40 ${64 + k * 9}, 58 ${40 + k * 10}, 88 ${26 + k * 12}`} opacity={k === 0 ? 1 : 0.45} />)}<circle cx="56" cy="46" r="4" fill="var(--clay)" stroke="var(--clay)" /></svg>
  ),
  oxygen: () => (
    <svg {...c}><path d="M10 30h20v14h20v14h20v14h20" /><path d="M10 84h80" stroke="var(--line)" /><text x="64" y="30" fontSize="14" fill="var(--clay)" stroke="none" fontFamily="var(--sans)">O₂</text></svg>
  ),
  airway: () => (
    <svg {...c}><path d="M50 12v30M50 42L32 58M50 42l18 16M32 58l-10 16M32 58l6 18M68 58l10 16M68 58l-6 18" /><circle cx="22" cy="76" r="3.5" fill="var(--clay)" stroke="var(--clay)" /></svg>
  ),
  feeding: () => (
    <svg {...c}><path d="M50 14c10 14 18 24 18 34a18 18 0 0 1-36 0c0-10 8-20 18-34z" /><path d="M14 80c8-6 14 6 22 0s14 6 22 0 14 6 28 0" stroke="var(--clay)" /></svg>
  ),
};

