import { useEffect, useMemo, useRef, useState } from "react";
import { makeTrace, type Trace } from "../lib/trace";
import { useReducedMotion } from "../lib/hooks";

const HR_RANGE: [number, number] = [80, 190];
const SP_RANGE: [number, number] = [80, 101];
const POINTS_PER_SECOND = 14;
const ERASE_GAP = 10;

type Palette = Record<"grid" | "bandHr" | "bandSp" | "hr" | "sp" | "ink" | "muted", string>;

function readPalette(el: Element): Palette {
  const s = getComputedStyle(el);
  const v = (name: string) => s.getPropertyValue(name).trim();
  return {
    grid: v("--grid"), bandHr: v("--band-hr"), bandSp: v("--band-sp"),
    hr: v("--trace-hr"), sp: v("--trace-sp"), ink: v("--sumi"), muted: v("--stone"),
  };
}

/**
 * Draws one frame of a bedside-style sweep: the current pass up to `cursor`,
 * an erase gap ahead of it, and the previous pass beyond the gap.
 */
function draw(ctx: CanvasRenderingContext2D, w: number, h: number, t: Trace, cursor: number, still: boolean, p: Palette) {
  ctx.clearRect(0, 0, w, h);
  const hrTop = 0, hrH = h * 0.5, spTop = h * 0.62, spH = h * 0.36;
  const x = (i: number) => (i / (t.n - 1)) * w;
  const y = (v: number, [lo, hi]: [number, number], top: number, ht: number) => top + ht * (1 - (v - lo) / (hi - lo));

  ctx.strokeStyle = p.grid;
  ctx.lineWidth = 1;
  for (const [top, ht] of [[hrTop, hrH], [spTop, spH]] as const) {
    for (let gx = 0; gx <= w; gx += 24) { ctx.beginPath(); ctx.moveTo(gx + 0.5, top); ctx.lineTo(gx + 0.5, top + ht); ctx.stroke(); }
    for (let gy = top; gy <= top + ht; gy += 24) { ctx.beginPath(); ctx.moveTo(0, gy + 0.5); ctx.lineTo(w, gy + 0.5); ctx.stroke(); }
  }

  const band = (lo: Float32Array, hi: Float32Array, r: [number, number], top: number, ht: number, fill: string) => {
    ctx.beginPath();
    for (let i = 0; i < t.n; i++) ctx.lineTo(x(i), y(hi[i], r, top, ht));
    for (let i = t.n - 1; i >= 0; i--) ctx.lineTo(x(i), y(lo[i], r, top, ht));
    ctx.closePath();
    ctx.fillStyle = fill;
    ctx.fill();
  };
  band(t.hrLo, t.hrHi, HR_RANGE, hrTop, hrH, p.bandHr);
  band(t.spLo, t.spHi, SP_RANGE, spTop, spH, p.bandSp);

  const line = (s: Float32Array, r: [number, number], top: number, ht: number, from: number, to: number, color: string) => {
    if (to <= from) return;
    ctx.beginPath();
    for (let i = from; i <= to; i++) {
      const px = x(i), py = y(s[i], r, top, ht);
      i === from ? ctx.moveTo(px, py) : ctx.lineTo(px, py);
    }
    ctx.strokeStyle = color;
    ctx.lineWidth = 1.8;
    ctx.lineJoin = "round";
    ctx.stroke();
  };
  const segments: [number, number][] = still ? [[0, t.n - 1]] : [[0, cursor], [Math.min(t.n - 1, cursor + ERASE_GAP), t.n - 1]];
  for (const [a, b] of segments) {
    line(t.hr, HR_RANGE, hrTop, hrH, a, b, p.hr);
    line(t.spo2, SP_RANGE, spTop, spH, a, b, p.sp);
  }

  const [e0, e1] = t.event;
  const shown = still || cursor >= e0 || cursor + ERASE_GAP < e0;
  if (e0 >= 0 && shown) {
    const mid = Math.round((e0 + e1) / 2);
    let minI = e0;
    for (let i = e0; i <= e1; i++) if (t.hr[i] < t.hr[minI]) minI = i;
    ctx.strokeStyle = p.ink;
    ctx.lineWidth = 1.2;
    ctx.beginPath();
    ctx.arc(x(minI), y(t.hr[minI], HR_RANGE, hrTop, hrH), 8, 0, Math.PI * 2);
    ctx.stroke();
    ctx.fillStyle = p.muted;
    ctx.font = '13px "Outfit", sans-serif';
    ctx.textAlign = x(mid) > w * 0.6 ? "right" : "left";
    ctx.fillText(`Outside own baseline for ${e1 - e0 + 1} s`, x(mid) > w * 0.6 ? x(e0) - 12 : x(e1) + 12, hrH + 26);
  }
}

export function Monitor() {
  const trace = useMemo(() => makeTrace(), []);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const cursorRef = useRef(0);
  const reduce = useReducedMotion();
  const [paused, setPaused] = useState(false);
  const [reading, setReading] = useState(() => ({ hr: Math.round(trace.hr[trace.n - 1]), sp: Math.round(trace.spo2[trace.n - 1]) }));

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    let palette = readPalette(canvas);
    let w = 0, h = 0, raf = 0, visible = true, cursor = cursorRef.current, last = performance.now(), lastReadout = 0;
    const still = reduce; // full trace, no sweep
    const animate = !reduce && !paused;

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const rect = canvas.getBoundingClientRect();
      w = rect.width; h = rect.height;
      canvas.width = Math.round(w * dpr); canvas.height = Math.round(h * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      draw(ctx, w, h, trace, Math.floor(cursor), still, palette);
    };
    const frame = (now: number) => {
      const dt = Math.min(0.1, (now - last) / 1000);
      last = now;
      cursor = (cursor + dt * POINTS_PER_SECOND) % trace.n;
      cursorRef.current = cursor;
      const i = Math.floor(cursor);
      draw(ctx, w, h, trace, i, false, palette);
      if (now - lastReadout > 400) {
        lastReadout = now;
        setReading({ hr: Math.round(trace.hr[i]), sp: Math.round(trace.spo2[i]) });
      }
      raf = visible && !document.hidden ? requestAnimationFrame(frame) : 0;
    };
    const start = () => { if (animate && !raf && visible && !document.hidden) { last = performance.now(); raf = requestAnimationFrame(frame); } };

    const ro = new ResizeObserver(resize);
    ro.observe(canvas);
    const io = new IntersectionObserver(([e]) => { visible = e.isIntersecting; start(); });
    io.observe(canvas);
    const onVis = () => start();
    document.addEventListener("visibilitychange", onVis);
    const scheme = window.matchMedia("(prefers-color-scheme: dark)");
    const onScheme = () => { palette = readPalette(canvas); resize(); };
    scheme.addEventListener("change", onScheme);
    document.fonts?.ready.then(() => resize());
    resize();
    start();
    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect(); io.disconnect();
      document.removeEventListener("visibilitychange", onVis);
      scheme.removeEventListener("change", onScheme);
    };
  }, [trace, reduce, paused]);

  const [e0, e1] = trace.event;
  return (
    <figure className="monitor panel">
      <div className="monitor-top">
        <span>Home monitor trend, 4 minutes</span>
        <span className="meta">
          <span className="mono">Synthetic, seed 0x5E1A</span>
          {!reduce && (
            <button type="button" className="pause" aria-pressed={paused} onClick={() => setPaused((p) => !p)}>
              {paused ? "Play trace" : "Pause trace"}
            </button>
          )}
        </span>
      </div>
      <div className="monitor-body">
        <canvas
          ref={canvasRef}
          role="img"
          aria-label={`Synthetic infant heart rate and oxygen saturation. Both leave the infant's own baseline band together for ${e1 - e0 + 1} seconds, then recover.`}
        />
        <div className="readouts" aria-hidden="true">
          <div className="readout"><div className="label">Heart rate</div><div className="value" style={{ color: "var(--trace-hr)" }}>{reading.hr}</div><div className="unit">beats per minute</div></div>
          <div className="readout"><div className="label">SpO₂</div><div className="value" style={{ color: "var(--trace-sp)" }}>{reading.sp}</div><div className="unit">percent</div></div>
        </div>
      </div>
      <figcaption>
        Shaded bands are this infant's own 10th to 90th centile, refit each day as they grow. A personal reference instead of a population threshold runs through most of the work below.
      </figcaption>
    </figure>
  );
}
