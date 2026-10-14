import { EDUCATION, NEWS, PROFILE } from "../data/profile";

const LINKS = [
  { label: "Email", href: `mailto:${PROFILE.email}` },
  { label: "CV", href: "#/cv" },
  { label: "CV (PDF)", href: PROFILE.cvPdf },
  { label: "GitHub", href: PROFILE.github },
  { label: "LinkedIn", href: PROFILE.linkedin },
  { label: "ORCID", href: PROFILE.orcid },
  { label: "Google Scholar", href: PROFILE.scholar },
].filter((l) => l.href);

export function About() {
  return (
    <div className="split">
      <section className="panel about">
        <h1 tabIndex={-1}>About</h1>
        <p className="about-role">
          {PROFILE.position}, {PROFILE.affiliation}
        </p>
        <div className="prose">
          <p>
            I work with longitudinal clinical data: continuous monitoring of infants at home, statewide perinatal
            quality data, and biomarkers in rheumatology and immunology. The question that connects these is how to read
            a patient&apos;s measurements against their own history, not only against population reference ranges.
          </p>
          <p>
            I trained in cheminformatics at Juniata College and in operations research at Cornell Tech. Alongside
            research I co-founded Advanced Care at Home, which monitors medically complex infants in their homes, and I
            have built data systems in clinical, payer and legal settings.
          </p>
          <p>
            I am looking for research positions and collaborations in neonatal and perinatal monitoring, precision
            medicine and clinical machine learning.
          </p>
        </div>
        <ul className="link-list">
          {LINKS.map((l) => (
            <li key={l.label}>
              <a href={l.href}>{l.label}</a>
            </li>
          ))}
        </ul>
        <dl className="facts">
          <div>
            <dt>Based in</dt>
            <dd>{PROFILE.location}</dd>
          </div>
          <div>
            <dt>Education</dt>
            <dd>
              {EDUCATION.map((e) => (
                <span key={e.degree}>
                  {e.degree.split(",")[0]}, {e.school.split(",")[0]}, {e.year}
                </span>
              ))}
            </dd>
          </div>
          <div>
            <dt>Methods</dt>
            <dd>Longitudinal models, reference centiles, calibrated prediction, network models, optimization</dd>
          </div>
        </dl>
      </section>
      <section className="panel news" aria-labelledby="news-title">
        <h2 id="news-title">News</h2>
        <ul>
          {NEWS.map((n) => (
            <li key={n.what}>
              <span>{n.when}</span>
              {n.what}
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
