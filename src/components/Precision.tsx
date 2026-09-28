import { useId, useMemo, useState } from "react";
import { AXIS, POPULATION, judge, makePeople, normalPdf, type Person } from "../lib/precision";
import { useWidth } from "../lib/useWidth";

const fmt = (v: number) => v.toFixed(1);

function Chart({ person, latest, width }: { person: Person; latest: number; width: number }) {
  const showDensity = width >= 600;
  const h = width < 480 ? 300 : 340;
  const m = { top: 28, right: showDensity ? 150 : 16, bottom: 40, left: 40 };
  const pw = width - m.left - m.right, ph = h - m.top - m.bottom;
  const n = person.visits.length;
  const x = (i: number) => m.left + (i / (n + 0.6)) * pw;
  const xLatest = m.left + pw - 10;
  const y = (v: number) => m.top + ph * (1 - (v - AXIS.min) / (AXIS.max - AXIS.min));
  const v = judge(latest, person);
  const flagged = v.personal !== "within";
  const lo = Math.max(AXIS.min, person.mean - 2 * person.sd), hi = person.mean + 2 * person.sd;
  const ticks = [0, 2, 4, 6, 8, 10, 12, 14];
  const path = person.visits.map((val, i) => `${i ? "L" : "M"}${x(i).toFixed(1)} ${y(val).toFixed(1)}`).join(" ");

  const dx0 = m.left + pw + 22, dw = m.right - 34;
  const densityPath = (mu: number, sd: number, scale: number) => {
    const pts: string[] = [];
    for (let k = 0; k <= 120; k++) {
      const val = AXIS.min + (k / 120) * (AXIS.max - AXIS.min);
      pts.push(`${(dx0 + Math.min(dw, normalPdf(val, mu, sd) * scale)).toFixed(1)} ${y(val).toFixed(1)}`);
    }
    return `M${dx0} ${y(AXIS.min)} L${pts.join(" L")} L${dx0} ${y(AXIS.max)} Z`;
  };
  const popScale = dw / normalPdf(POPULATION.mean, POPULATION.mean, POPULATION.sd);
  const perScale = dw / normalPdf(person.mean, person.mean, person.sd);

  return (
    <svg width={width} height={h} viewBox={`0 0 ${width} ${h}`} aria-hidden="true" style={{ display: "block" }}>
      {ticks.map((t) => (
        <g key={t}>
          <line x1={m.left} x2={m.left + pw} y1={y(t)} y2={y(t)} stroke="var(--grid)" />
          <text x={m.left - 10} y={y(t) + 4} textAnchor="end" fontSize="12" fill="var(--stone)" fontFamily="var(--mono)">{t}</text>
        </g>
      ))}
      <rect x={m.left} width={pw} y={y(POPULATION.high)} height={y(POPULATION.low) - y(POPULATION.high)} fill="var(--hinoki)" opacity="0.3" />
      <text x={m.left + 8} y={y(POPULATION.high) - 8} fontSize="12.5" fill="var(--stone)">Population reference range, 0 to 8</text>
      <rect x={m.left} width={pw} y={y(hi)} height={y(lo) - y(hi)} fill="var(--moss)" opacity="0.16" />
      <line x1={m.left} x2={m.left + pw} y1={y(hi)} y2={y(hi)} stroke="var(--moss)" strokeDasharray="4 4" />
      <line x1={m.left} x2={m.left + pw} y1={y(lo)} y2={y(lo)} stroke="var(--moss)" strokeDasharray="4 4" />
      <text x={m.left + 8} y={y(hi) - 7} fontSize="12.5" fontWeight="600" fill="var(--moss)">Their own baseline, mean ± 2 SD</text>
      <path d={path} fill="none" stroke="var(--sumi)" strokeWidth="1.4" opacity="0.55" />
      {person.visits.map((val, i) => <circle key={i} cx={x(i)} cy={y(val)} r="3.6" fill="var(--sumi)" />)}
      <line x1={x(n - 1)} x2={xLatest} y1={y(person.visits[n - 1])} y2={y(latest)} stroke="var(--sumi)" strokeDasharray="3 4" opacity="0.5" />
      <circle cx={xLatest} cy={y(latest)} r="8" fill={flagged ? "var(--clay)" : "var(--moss)"} stroke="var(--paper-solid)" strokeWidth="2.5" />
      <text x={xLatest - 14} y={y(latest) + (latest > 12 ? 22 : -14)} textAnchor="end" fontSize="13" fontWeight="600" fill="var(--sumi)">Today, {fmt(latest)}</text>
      <text x={m.left} y={h - 12} fontSize="12.5" fill="var(--stone)">Three years of quarterly visits</text>
      {showDensity && (
        <g>
          <path d={densityPath(POPULATION.mean, POPULATION.sd, popScale * 0.9)} fill="var(--hinoki)" opacity="0.45" />
          <path d={densityPath(person.mean, person.sd, perScale)} fill="var(--moss)" opacity="0.35" />
          <line x1={dx0 - 6} x2={dx0 + dw} y1={y(latest)} y2={y(latest)} stroke={flagged ? "var(--clay)" : "var(--moss)"} strokeWidth="2" />
          <text x={dx0} y={h - 12} fontSize="12.5" fill="var(--stone)">How values spread</text>
        </g>
      )}
    </svg>
  );
}

export function Precision({ headingLevel = 2, compact = false }: { headingLevel?: 1 | 2; compact?: boolean }) {
  const people = useMemo(() => makePeople(), []);
  const [pid, setPid] = useState<Person["id"]>("a");
  const person = people.find((p) => p.id === pid)!;
  const [latest, setLatest] = useState(person.defaultLatest);
  const [boxRef, width] = useWidth<HTMLDivElement>(720);
  const sliderId = useId();
  const v = judge(latest, person);
  const H = headingLevel === 1 ? "h1" : "h2";

  const popText = v.population === "within" ? "Within the reference range" : v.population === "above" ? "Above the reference range" : "Below the reference range";
  const zAbs = Math.abs(v.z).toFixed(1);
  const perText = v.personal === "within" ? `Within their usual range (${zAbs} SD from their mean)` : `${zAbs} SD ${v.personal} their own baseline`;
  const summary =
    v.population === "within" && v.personal !== "within"
      ? `A value of ${fmt(latest)} looks ordinary for most people and unusual for ${person.label}.`
      : v.population !== "within" && v.personal === "within"
        ? `A value of ${fmt(latest)} is flagged by the population range but is usual for ${person.label}.`
        : v.population !== "within"
          ? `Both references flag ${fmt(latest)} for ${person.label}.`
          : `Neither reference flags ${fmt(latest)} for ${person.label}.`;

  return (
    <section id="precision" className={compact ? "sheet precision-sheet compact" : "sheet section"} aria-labelledby="precision-title">
      <div className={compact ? "sheet-head stacked" : "section-head"}>
        <H id="precision-title">{compact ? "Figure: individual baselines" : "Population ranges and individual baselines"}</H>
        <p>An interactive illustration of the idea behind most of my work: a value inside the population reference range can still be unusual for a particular patient. Choose a synthetic patient and move today&apos;s value.</p>
      </div>
      <figure className="precision panel">
        <div className="precision-controls">
          <div className="chips" role="group" aria-label="Choose a synthetic patient">
            {people.map((p) => (
              <button key={p.id} type="button" className="chip" aria-pressed={pid === p.id}
                onClick={() => { setPid(p.id); setLatest(p.defaultLatest); }}>
                {p.label}<span className="chip-note">{p.note}</span>
              </button>
            ))}
          </div>
          <div className="slider">
            <label htmlFor={sliderId}>Today's value</label>
            <input id={sliderId} type="range" min={AXIS.min} max={AXIS.max} step={0.1} value={latest}
              onChange={(e) => setLatest(Number(e.target.value))} aria-valuetext={`${fmt(latest)} units`} />
            <output htmlFor={sliderId} className="mono">{fmt(latest)}</output>
          </div>
        </div>
        <div ref={boxRef} className="precision-chart">
          <Chart person={person} latest={latest} width={width} />
        </div>
        <dl className="verdicts" aria-live="polite">
          <div><dt>Against the population</dt><dd data-flag={v.population !== "within"}>{popText}</dd></div>
          <div><dt>Against their own history</dt><dd data-flag={v.personal !== "within"}>{perText}</dd></div>
          <p className="summary">{summary}</p>
        </dl>
        <figcaption>
          Synthetic marker and patients; no real data. The same comparison appears across my projects: infant heart rate against
          the infant's own centiles, lupus gene modules against a patient's own history, bone density during a drug holiday,
          and immune cell counts against age-matched references.
        </figcaption>
      </figure>
    </section>
  );
}
