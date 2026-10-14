import { useEffect, useState } from "react";
import { PROJECTS, type Kind } from "../data/projects";

const FILTERS: { kind: Kind | "all"; label: string }[] = [
  { kind: "all", label: "All" },
  { kind: "research", label: "Research" },
  { kind: "engineering", label: "Engineering" },
  { kind: "company", label: "Companies" },
];

export function Projects({ focus }: { focus?: string }) {
  const [filter, setFilter] = useState<Kind | "all">("all");
  const shown = filter === "all" ? PROJECTS : PROJECTS.filter((p) => p.kinds.includes(filter));

  // A link such as #/projects/arlett-health scrolls to that project and briefly highlights it.
  useEffect(() => {
    if (!focus) return;
    setFilter("all");
    const row = document.getElementById(`project-${focus}`);
    if (!row) return;
    row.scrollIntoView({ block: "start" });
    row.querySelector("h2")?.focus({ preventScroll: true });
    row.dataset.highlight = "";
    const timer = setTimeout(() => delete row.dataset.highlight, 2400);
    return () => clearTimeout(timer);
  }, [focus]);

  return (
    <section className="panel">
      <div className="section-head">
        <h1 tabIndex={-1}>Projects</h1>
        <p>Research, engineering and company work. Use the filters to narrow the list.</p>
      </div>
      <div className="filters" role="group" aria-label="Filter projects">
        {FILTERS.map((f) => (
          <button key={f.kind} type="button" aria-pressed={filter === f.kind} onClick={() => setFilter(f.kind)}>
            {f.label}
          </button>
        ))}
      </div>
      <p className="visually-hidden" aria-live="polite">{`${shown.length} projects shown`}</p>
      <ul className="projects">
        {shown.map((p) => (
          <li key={p.slug} id={`project-${p.slug}`} className="project">
            <p className="project-years">{p.years}</p>
            <div>
              <h2 tabIndex={-1}>{p.name}</h2>
              <p className="project-summary">{p.summary}</p>
              <p className="project-area">{p.area}</p>
            </div>
            <div>
              <p>{p.body}</p>
              <p className="project-stack">{p.stack.join(", ")}</p>
              {p.links.length > 0 && (
                <p className="project-links">
                  {p.links.map((l) => (
                    <a key={l.href} href={l.href}>
                      {l.label}
                    </a>
                  ))}
                </p>
              )}
            </div>
            <p className="project-status">
              {p.status}
              {p.note && <span>{p.note}</span>}
            </p>
          </li>
        ))}
      </ul>
    </section>
  );
}
