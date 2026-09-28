import { CV_PDF_READY, EDUCATION, EXPERIENCE, MANUSCRIPTS, POSTERS, PROFILE, RESEARCH_EXPERIENCE, SKILLS } from "../data/cv";

function Block({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="cv-block" aria-label={title}>
      <h2>{title}</h2>
      <div>{children}</div>
    </section>
  );
}

export function CV() {
  return (
    <article className="sheet cv" aria-labelledby="cv-title">
      <div className="section-head">
        <h1 id="cv-title" tabIndex={-1}>Curriculum vitae</h1>
        <p>{CV_PDF_READY ? <a href={PROFILE.cvPdf}>Download as PDF</a> : `A PDF copy is available on request at ${PROFILE.email}.`}</p>
      </div>
      <Block title="Education">
        <ul className="cv-list">
          {EDUCATION.map((e) => (
            <li key={e.degree}><span className="cv-year">{e.year}</span><div><strong>{e.degree}</strong><p>{e.school}, {e.place}</p></div></li>
          ))}
        </ul>
      </Block>
      <Block title="Experience">
        <ul className="cv-list">
          {EXPERIENCE.map((x) => (
            <li key={x.role + x.org}>
              <span className="cv-year">{x.years}</span>
              <div><strong>{x.role}</strong><p>{x.org}, {x.place}</p><ul className="cv-points">{x.points.map((p) => <li key={p}>{p}</li>)}</ul></div>
            </li>
          ))}
        </ul>
      </Block>
      <Block title="Manuscripts in preparation">
        <ol className="cv-numbered">{MANUSCRIPTS.map((m) => <li key={m}>{m}</li>)}</ol>
      </Block>
      {POSTERS.length > 0 && (
        <Block title="Posters and presentations">
          <ol className="cv-numbered">{POSTERS.map((p) => <li key={p.citation}>{p.citation}</li>)}</ol>
        </Block>
      )}
      <Block title="Research experience">
        <ul className="cv-list">
          {RESEARCH_EXPERIENCE.map((r) => (
            <li key={r.title}><span className="cv-year">{r.years}</span><div><strong>{r.title}</strong><p>{r.where}</p><p className="cv-detail">{r.detail}</p></div></li>
          ))}
        </ul>
      </Block>
      <Block title="Skills">
        <dl className="cv-skills">{SKILLS.map((s) => <div key={s.area}><dt>{s.area}</dt><dd>{s.items}</dd></div>)}</dl>
      </Block>
    </article>
  );
}
