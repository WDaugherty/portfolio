import { useId, useMemo, useState } from "react";
import { AXIS, POPULATION, compare, makePatients, normalDensity, type Patient, type Side } from "../lib/baselines";
import { useWidth } from "../lib/hooks";

const fmt = (v: number) => v.toFixed(1);

function Chart({ patient, today, width }: { patient: Patient; today: number; width: number }) {
  const showSpread = width >= 600;
  const height = width < 480 ? 300 : 340;
  const m = { top: 28, right: showSpread ? 150 : 16, bottom: 40, left: 40 };
  const plotW = width - m.left - m.right;
  const plotH = height - m.top - m.bottom;
  const n = patient.visits.length;
  const x = (i: number) => m.left + (i / (n + 0.6)) * plotW;
  const y = (v: number) => m.top + plotH * (1 - (v - AXIS.min) / (AXIS.max - AXIS.min));
  const xToday = m.left + plotW - 10;
  const flagged = compare(today, patient).personal !== "within";
  const low = Math.max(AXIS.min, patient.mean - 2 * patient.sd);
  const high = patient.mean + 2 * patient.sd;
  const visits = patient.visits.map((v, i) => `${i ? "L" : "M"}${x(i).toFixed(1)} ${y(v).toFixed(1)}`).join("");

  const spreadX = m.left + plotW + 22;
  const spreadW = m.right - 34;
  const spread = (mean: number, sd: number, scale: number) => {
    const pts = Array.from({ length: 121 }, (_, k) => {
      const v = AXIS.min + (k / 120) * (AXIS.max - AXIS.min);
      return `${(spreadX + Math.min(spreadW, normalDensity(v, mean, sd) * scale)).toFixed(1)} ${y(v).toFixed(1)}`;
    });
    return `M${spreadX} ${y(AXIS.min)}L${pts.join("L")}L${spreadX} ${y(AXIS.max)}Z`;
  };
  const peak = (mean: number, sd: number) => spreadW / normalDensity(mean, mean, sd);

  return (
    <svg width={width} height={height} viewBox={`0 0 ${width} ${height}`} aria-hidden="true" className="chart">
      {[0, 2, 4, 6, 8, 10, 12, 14].map((t) => (
        <g key={t}>
          <line x1={m.left} x2={m.left + plotW} y1={y(t)} y2={y(t)} stroke="var(--grid)" />
          <text x={m.left - 10} y={y(t) + 4} textAnchor="end" className="chart-tick">
            {t}
          </text>
        </g>
      ))}
      <rect
        x={m.left}
        width={plotW}
        y={y(POPULATION.high)}
        height={y(POPULATION.low) - y(POPULATION.high)}
        fill="var(--line)"
        opacity={0.35}
      />
      <text x={m.left + 8} y={y(POPULATION.high) - 8} className="chart-label">
        Population reference range, 0 to 8
      </text>
      <rect x={m.left} width={plotW} y={y(high)} height={y(low) - y(high)} fill="var(--sage)" opacity={0.16} />
      {[high, low].map((v) => (
        <line key={v} x1={m.left} x2={m.left + plotW} y1={y(v)} y2={y(v)} stroke="var(--sage)" strokeDasharray="4 4" />
      ))}
      <text x={m.left + 8} y={y(high) - 7} className="chart-label chart-label-strong">
        Their own baseline, mean ± 2 SD
      </text>
      <path d={visits} fill="none" stroke="var(--ink)" strokeWidth={1.4} opacity={0.55} />
      {patient.visits.map((v, i) => (
        <circle key={i} cx={x(i)} cy={y(v)} r={3.6} fill="var(--ink)" />
      ))}
      <line
        x1={x(n - 1)}
        x2={xToday}
        y1={y(patient.visits[n - 1])}
        y2={y(today)}
        stroke="var(--ink)"
        strokeDasharray="3 4"
        opacity={0.5}
      />
      <circle
        cx={xToday}
        cy={y(today)}
        r={8}
        fill={flagged ? "var(--clay)" : "var(--sage)"}
        stroke="var(--white)"
        strokeWidth={2.5}
      />
      <text
        x={xToday - 14}
        y={y(today) + (today > 12 ? 22 : -14)}
        textAnchor="end"
        className="chart-label chart-label-strong"
      >
        Today, {fmt(today)}
      </text>
      <text x={m.left} y={height - 12} className="chart-label">
        Three years of quarterly visits
      </text>
      {showSpread && (
        <g>
          <path
            d={spread(POPULATION.mean, POPULATION.sd, peak(POPULATION.mean, POPULATION.sd) * 0.9)}
            fill="var(--line)"
            opacity={0.6}
          />
          <path
            d={spread(patient.mean, patient.sd, peak(patient.mean, patient.sd))}
            fill="var(--sage)"
            opacity={0.35}
          />
          <line
            x1={spreadX - 6}
            x2={spreadX + spreadW}
            y1={y(today)}
            y2={y(today)}
            stroke={flagged ? "var(--clay)" : "var(--sage)"}
            strokeWidth={2}
          />
          <text x={spreadX} y={height - 12} className="chart-label">
            How values spread
          </text>
        </g>
      )}
    </svg>
  );
}

const sideText = (side: Side, against: string) =>
  side === "within" ? `Within ${against}` : `${side[0].toUpperCase()}${side.slice(1)} ${against}`;

/** Interactive figure: one value read against the population range and against the patient's own history. */
export function BaselineFigure() {
  const patients = useMemo(() => makePatients(), []);
  const [id, setId] = useState(patients[0].id);
  const patient = patients.find((p) => p.id === id)!;
  const [today, setToday] = useState(patient.today);
  const [chartBox, width] = useWidth<HTMLDivElement>(720);
  const sliderId = useId();
  const result = compare(today, patient);
  const sd = Math.abs(result.z).toFixed(1);

  const summary =
    result.population === "within" && result.personal !== "within"
      ? `A value of ${fmt(today)} looks ordinary for most people and unusual for ${patient.label}.`
      : result.population !== "within" && result.personal === "within"
        ? `A value of ${fmt(today)} is outside the population range but usual for ${patient.label}.`
        : result.population !== "within"
          ? `Both references flag ${fmt(today)} for ${patient.label}.`
          : `Neither reference flags ${fmt(today)} for ${patient.label}.`;

  return (
    <section className="panel" aria-labelledby="figure-title">
      <div className="section-head">
        <h2 id="figure-title">Population ranges and individual baselines</h2>
        <p>
          A value inside the population reference range can still be unusual for a particular patient. Choose a
          synthetic patient and move today&apos;s value.
        </p>
      </div>
      <figure className="figure">
        <div className="figure-controls">
          <div className="segmented" role="group" aria-label="Synthetic patient">
            {patients.map((p) => (
              <button
                key={p.id}
                type="button"
                aria-pressed={p.id === id}
                onClick={() => {
                  setId(p.id);
                  setToday(p.today);
                }}
              >
                {p.label}
                <span>{p.note}</span>
              </button>
            ))}
          </div>
          <div className="slider">
            <label htmlFor={sliderId}>Today&apos;s value</label>
            <input
              id={sliderId}
              type="range"
              min={AXIS.min}
              max={AXIS.max}
              step={0.1}
              value={today}
              onChange={(e) => setToday(Number(e.target.value))}
            />
            <output htmlFor={sliderId}>{fmt(today)}</output>
          </div>
        </div>
        <div ref={chartBox}>
          <Chart patient={patient} today={today} width={width} />
        </div>
        <dl className="verdicts" aria-live="polite">
          <div>
            <dt>Against the population</dt>
            <dd data-flag={result.population !== "within"}>{sideText(result.population, "the reference range")}</dd>
          </div>
          <div>
            <dt>Against their own history</dt>
            <dd data-flag={result.personal !== "within"}>
              {sideText(result.personal, "their usual range")}, {sd} SD from their mean
            </dd>
          </div>
        </dl>
        <p className="verdict-summary">{summary}</p>
        <figcaption>
          Synthetic marker and patients. The same comparison appears across my projects: infant heart rate against the
          infant&apos;s own centiles, lupus gene modules against a patient&apos;s history, bone density during a drug
          holiday, and immune cell counts against age-matched references.
        </figcaption>
      </figure>
    </section>
  );
}
