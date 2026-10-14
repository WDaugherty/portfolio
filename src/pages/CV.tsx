import type { ReactNode } from "react";
import { EDUCATION, EXPERIENCE, MANUSCRIPTS, POSTERS, PROFILE, RESEARCH_EXPERIENCE, SKILLS } from "../data/profile";

function Block({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section className="cv-block">
      <h2>{title}</h2>
      <div>{children}</div>
    </section>
  );
}

function Entry({ when, title, where, children }: { when: string; title: string; where: string; children?: ReactNode }) {
  return (
    <li className="cv-entry">
      <p className="cv-when">{when}</p>
      <div>
        <h3>{title}</h3>
        <p className="cv-where">{where}</p>
        {children}
      </div>
    </li>
  );
}

export function CV() {
  return (
    <article className="panel">
      <div className="section-head">
        <h1 tabIndex={-1}>Curriculum vitae</h1>
        <p>
          {PROFILE.cvPdf ? (
            <a href={PROFILE.cvPdf}>Download as PDF</a>
          ) : (
            <>
              A PDF copy is available on request at <a href={`mailto:${PROFILE.email}`}>{PROFILE.email}</a>.
            </>
          )}
        </p>
      </div>
      <Block title="Education">
        <ul className="cv-list">
          {EDUCATION.map((e) => (
            <Entry key={e.degree} when={e.year} title={e.degree} where={`${e.school}, ${e.place}`} />
          ))}
        </ul>
      </Block>
      <Block title="Experience">
        <ul className="cv-list">
          {EXPERIENCE.map((x) => (
            <Entry key={x.role + x.org} when={x.years} title={x.role} where={`${x.org}, ${x.place}`}>
              <ul className="cv-points">
                {x.points.map((p) => (
                  <li key={p}>{p}</li>
                ))}
              </ul>
            </Entry>
          ))}
        </ul>
      </Block>
      <Block title="Manuscripts in preparation">
        <ol className="cv-numbered">
          {MANUSCRIPTS.map((m) => (
            <li key={m.title}>{m.title}</li>
          ))}
        </ol>
      </Block>
      {POSTERS.length > 0 && (
        <Block title="Posters and presentations">
          <ol className="cv-numbered">
            {POSTERS.map((p) => (
              <li key={p}>{p}</li>
            ))}
          </ol>
        </Block>
      )}
      <Block title="Research experience">
        <ul className="cv-list">
          {RESEARCH_EXPERIENCE.map((r) => (
            <Entry key={r.title} when={r.years} title={r.title} where={r.where}>
              <p className="cv-detail">{r.detail}</p>
            </Entry>
          ))}
        </ul>
      </Block>
      <Block title="Skills">
        <dl className="cv-skills">
          {SKILLS.map((s) => (
            <div key={s.area}>
              <dt>{s.area}</dt>
              <dd>{s.items}</dd>
            </div>
          ))}
        </dl>
      </Block>
    </article>
  );
}
