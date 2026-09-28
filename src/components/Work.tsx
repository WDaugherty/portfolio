import { useMemo } from "react";
import { DOMAIN_LABEL, LENSES, PROJECTS, STATUS_LABEL, type Role, type Status } from "../data/projects";

export type Lens = Role | "all";

export function countByLens() {
  const counts = new Map<Lens, number>([["all", PROJECTS.length]]);
  for (const p of PROJECTS) for (const r of p.roles) counts.set(r, (counts.get(r) ?? 0) + 1);
  return counts;
}

function StatusMark({ status }: { status: Status }) {
  const c = { width: 12, height: 12, viewBox: "0 0 12 12", "aria-hidden": true } as const;
  switch (status) {
    case "production":
    case "live":
      return <svg {...c}><circle cx="6" cy="6" r="5" fill="var(--moss)" /></svg>;
    case "building":
      return <svg {...c}><circle cx="6" cy="6" r="4.5" fill="none" stroke="var(--moss)" strokeWidth="1.4" /><path d="M6 1.5a4.5 4.5 0 0 0 0 9z" fill="var(--moss)" /></svg>;
    case "research":
      return <svg {...c}><rect x="2" y="2" width="8" height="8" transform="rotate(45 6 6)" fill="var(--clay)" /></svg>;
    default:
      return <svg {...c}><circle cx="6" cy="6" r="4.5" fill="none" stroke="var(--stone)" strokeWidth="1.4" /></svg>;
  }
}

export function Work({ lens, setLens, headingLevel = 2 }: { lens: Lens; setLens: (l: Lens) => void; headingLevel?: 1 | 2 }) {
  const H = headingLevel === 1 ? "h1" : "h2";
  const counts = useMemo(countByLens, []);
  const shown = lens === "all" ? PROJECTS : PROJECTS.filter((p) => p.roles.includes(lens));
  return (
    <section id="work" className="sheet section" aria-labelledby="work-title">
      <div className="section-head">
        <H id="work-title" tabIndex={-1}>Projects</H>
        <p>Research, engineering and company work, most recent first within each area. Filter by type.</p>
      </div>
      <div className="chips filters" role="group" aria-label="Filter projects by type">
        {LENSES.map((l) => (
          <button key={l.id} type="button" className="chip" aria-pressed={lens === l.id} onClick={() => setLens(l.id)}>
            {l.label}
            <span className="count">{counts.get(l.id) ?? 0}</span>
          </button>
        ))}
      </div>
      <p className="sr-only" aria-live="polite">{`${shown.length} projects shown`}</p>
      {shown.length === 0 ? (
        <p className="empty">
          No projects of this type yet.
          <button type="button" onClick={() => setLens("all")}>Show all projects</button>
        </p>
      ) : (
        <ul className="rows">
          {shown.map((p) => (
            <li key={p.slug} className="row" id={`work-${p.slug}`}>
              <span className="years">{p.years}</span>
              <div>
                <h3 tabIndex={-1}>{p.name}</h3>
                <p className="summary">{p.summary}</p>
                <p className="domain">{DOMAIN_LABEL[p.domain]}</p>
              </div>
              <div className="body-col">
                <p className="body">{p.body}</p>
                <div className="stack">{p.stack.map((s) => <span key={s}>{s}</span>)}</div>
                {p.links.length > 0 && (
                  <div className="links">
                    {p.links.map((l) => (
                      <a key={l.href} href={l.href} {...(l.href.startsWith("http") ? { target: "_blank", rel: "noreferrer" } : {})}>
                        {l.label}
                      </a>
                    ))}
                  </div>
                )}
              </div>
              <div className="status">
                <span className="state"><StatusMark status={p.status} />{STATUS_LABEL[p.status]}</span>
                {p.note && <span className="note">{p.note}</span>}
              </div>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
