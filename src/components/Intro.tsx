import { CV_PDF_READY, EDUCATION, PROFILE } from "../data/cv";

export function About() {
  return (
    <section className="sheet intro about" aria-labelledby="about-title">
      <div className="intro-main">
        <h2 id="about-title">About</h2>
        <p className="intro-role">{PROFILE.position}, {PROFILE.affiliation}</p>
        <div className="intro-bio">
          <p>
            I work with longitudinal clinical data: continuous monitoring of infants at home, statewide perinatal quality
            data, and biomarkers in rheumatology and immunology. The question running through all of it is how to read a
            patient's measurements against their own history, not only against population reference ranges.
          </p>
          <p>
            I trained in cheminformatics at Juniata College and in operations research at Cornell Tech. Alongside research,
            I co-founded Advanced Care at Home, which monitors medically complex infants in their homes, and I have built
            data systems in clinical, payer and legal settings.
          </p>
          <p>I am interested in research positions and collaborations in neonatal and perinatal monitoring, precision medicine and clinical machine learning.</p>
        </div>
        <ul className="intro-links">
          <li><a href={`mailto:${PROFILE.email}`}>Email</a></li>
          <li><a href="#/cv">CV</a></li>
          {CV_PDF_READY && <li><a href={PROFILE.cvPdf}>CV (PDF)</a></li>}
          <li><a href={PROFILE.github} target="_blank" rel="noreferrer">GitHub</a></li>
          <li><a href={PROFILE.linkedin} target="_blank" rel="noreferrer">LinkedIn</a></li>
          {PROFILE.orcid && <li><a href={PROFILE.orcid} target="_blank" rel="noreferrer">ORCID</a></li>}
          {PROFILE.scholar && <li><a href={PROFILE.scholar} target="_blank" rel="noreferrer">Google Scholar</a></li>}
        </ul>
      </div>
      <dl className="intro-facts">
        <div><dt>Affiliation</dt><dd>{PROFILE.affiliation}</dd></div>
        <div><dt>Based in</dt><dd>{PROFILE.location}</dd></div>
        <div><dt>Education</dt><dd>{EDUCATION.map((e) => <span key={e.degree}>{e.degree.split(",")[0]}, {e.school.split(",")[0]}, {e.year}</span>)}</dd></div>
        <div><dt>Methods</dt><dd>Longitudinal models, reference centiles, calibrated prediction, network models, optimization</dd></div>
      </dl>
    </section>
  );
}

const NEWS = [
  { when: "Sep 2026", what: "Five neonatal manuscripts in preparation with Dartmouth Health colleagues." },
  { when: "Sep 2026", what: "Drafted a set of study designs in rheumatology, dermatology and immunology." },
  { when: "2026", what: "Began as Data Specialist, Population Health, at Dartmouth Health." },
  { when: "Jun 2025", what: "Joined New England Rheumatology and Osteoporosis as clinical care coordinator." },
  { when: "2025", what: "Co-founded Advanced Care at Home." },
];

export function News() {
  return (
    <section className="sheet news" aria-labelledby="news-title">
      <div className="sheet-head"><h2 id="news-title">News</h2></div>
      <ul>{NEWS.map((n) => <li key={n.what}><span>{n.when}</span>{n.what}</li>)}</ul>
    </section>
  );
}
