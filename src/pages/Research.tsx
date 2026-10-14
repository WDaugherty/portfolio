import { BaselineFigure } from "../components/BaselineFigure";
import { MethodsGraph } from "../components/MethodsGraph";
import { MANUSCRIPTS } from "../data/profile";

const PROGRAMS = [
  {
    title: "Neonatal home monitoring",
    meta: "Dartmouth Health, 2024 to present",
    body: "Data lead on Hope Grows at Home, home oxygen weaning and bronchiolitis projects, working from continuous pulse-oximetry data collected in family homes.",
    studies: MANUSCRIPTS.map((m) => ({ title: m.title, stage: "In preparation" })),
  },
  {
    title: "Rheumatology, dermatology and immunology",
    meta: "2026 to present",
    body: "Biomarker studies on public data, network models of shared immune biology, and questions from a community rheumatology practice.",
    studies: [
      { title: "Do published RA gene signatures replicate?", stage: "Design" },
      { title: "Network medicine and the IL-17/IL-23 paradox", stage: "Design" },
      { title: "SLE: whose disease can a blood test track?", stage: "Design" },
      { title: "Immune centiles and immune age", stage: "Design" },
      { title: "Triage of ANA-positive referrals", stage: "Awaiting IRB review" },
    ],
  },
];

export function Research() {
  return (
    <>
      <section className="panel panel-dark">
        <div className="section-head">
          <h1 tabIndex={-1}>Research</h1>
          <p>
            Two programs with one question: how should a measurement be read against the patient&apos;s own history as
            well as against population references?
          </p>
        </div>
        <div className="programs">
          {PROGRAMS.map((p) => (
            <article key={p.title} className="program">
              <h2>{p.title}</h2>
              <p className="program-meta">{p.meta}</p>
              <p>{p.body}</p>
              <ul>
                {p.studies.map((s) => (
                  <li key={s.title}>
                    {s.title}
                    <span>{s.stage}</span>
                  </li>
                ))}
              </ul>
            </article>
          ))}
        </div>
        <p className="programs-note">
          Practice and hospital data are analyzed inside their own systems after IRB review. Figures on this site use
          synthetic data.
        </p>
      </section>
      <BaselineFigure />
      <MethodsGraph />
    </>
  );
}
