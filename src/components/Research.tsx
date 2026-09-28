import { MANUSCRIPTS } from "../data/cv";

const NEONATAL = MANUSCRIPTS.map((m) => [m, "In preparation"]);

const RHEUM = [
  ["Do published RA gene signatures replicate?", "Design"],
  ["Network medicine and the IL-17/IL-23 paradox", "Design"],
  ["SLE: whose disease can a blood test track?", "Design"],
  ["Immune centiles and immune age", "Design"],
  ["Triage of ANA-positive referrals", "Awaiting IRB"],
];

export function Research({ headingLevel = 2 }: { headingLevel?: 1 | 2 }) {
  const H = headingLevel === 1 ? "h1" : "h2";
  return (
    <section id="research" className={headingLevel === 1 ? "research lead" : "research"} aria-labelledby="research-title">
      <div className="wrap">
        <div className="section-head">
          <H id="research-title" tabIndex={-1}>Research</H>
          <p>Two programs with a shared question: how should a measurement be read against the patient&apos;s own history as well as against population references?</p>
        </div>
        <div className="programs">
          <article className="program">
            <h3>Neonatal home monitoring</h3>
            <p className="facts-line">Dartmouth Health, 2024 to present, 5 manuscripts in preparation</p>
            <p className="desc">Data lead on Hope Grows at Home, home oxygen weaning and bronchiolitis projects, working from continuous pulse-oximetry data collected in family homes.</p>
            <ul>{NEONATAL.map(([t, s]) => <li key={t}>{t}<span>{s}</span></li>)}</ul>
          </article>
          <div>
            <article className="program">
              <h3>Rheumatology, dermatology and immunology</h3>
              <p className="facts-line">2026 to present, study design stage</p>
              <p className="desc">Biomarker studies using public data, network models of shared immune biology, and practice-based questions from a community rheumatology clinic.</p>
              <ul>{RHEUM.map(([t, s]) => <li key={t}>{t}<span>{s}</span></li>)}</ul>
            </article>
            <div className="aside">
              <p><strong>Data and ethics.</strong> Practice and hospital data are analyzed inside their own systems after IRB review. Figures on this site use synthetic data.</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
