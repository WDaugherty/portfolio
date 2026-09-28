import { SPECS } from "../data/specs";

export function Specs({ headingLevel = 2 }: { headingLevel?: 1 | 2 }) {
  const H = headingLevel === 1 ? "h1" : "h2";
  return (
    <section id="specs" className="sheet section" aria-labelledby="specs-title">
      <div className="section-head">
        <H id="specs-title" tabIndex={-1}>Open-source specs</H>
        <p>Ten tools for rheumatology, dermatology and immunology, built in public on public or synthetic data. Each is a written spec today; none has shipped.</p>
      </div>
      <ul className="topics">
        {SPECS.map((s) => (
          <li key={s.slug} className="topic">
            <a href={`#/specs/${s.slug}`}>
              <h3>{s.name}</h3>
              <span className="line">{s.line}</span>
              <span className="areas">{s.areas.join(", ")}</span>
              <span className="weeks">{s.weeks} wk</span>
            </a>
          </li>
        ))}
      </ul>
    </section>
  );
}
