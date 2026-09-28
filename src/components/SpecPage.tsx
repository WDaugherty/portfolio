import { useEffect, useRef } from "react";
import { SPECS, specBySlug } from "../data/specs";

export function SpecPage({ slug }: { slug: string }) {
  const spec = specBySlug(slug);
  const h1 = useRef<HTMLHeadingElement>(null);
  useEffect(() => {
    window.scrollTo({ top: 0 });
    h1.current?.focus({ preventScroll: true });
    document.title = spec ? `${spec.name} spec: William Daugherty-Miller` : "Spec not found";
    return () => {
      document.title = "William Daugherty-Miller: founder, researcher and developer in clinical data";
    };
  }, [spec]);

  if (!spec) {
    return (
      <main id="main" className="sheet spec" tabIndex={-1} style={{ outline: "none" }}>
        <h1 ref={h1} tabIndex={-1} style={{ fontSize: 40, fontWeight: 300 }}>That spec does not exist.</h1>
        <p style={{ marginTop: 16 }}><a href="#/specs">See all specs</a></p>
      </main>
    );
  }
  const i = SPECS.indexOf(spec);
  const prev = SPECS[(i - 1 + SPECS.length) % SPECS.length];
  const next = SPECS[(i + 1) % SPECS.length];
  const parts: [string, React.ReactNode][] = [
    ["Problem", <p>{spec.problem}</p>],
    ["What it does", <p>{spec.does}</p>],
    ["First release", <ul>{spec.firstRelease.map((f) => <li key={f}>{f}</li>)}</ul>],
    ["Data", <p>{spec.data}</p>],
    ["Stack", <p>{spec.stack}</p>],
    ["Validation", <p>{spec.validation}</p>],
  ];

  return (
    <main id="main" className="sheet spec" tabIndex={-1} style={{ outline: "none" }}>
      <nav className="crumbs" aria-label="Breadcrumb">
        <a href="#/">Home</a><span aria-hidden="true">/</span><a href="#/specs">Specs</a><span aria-hidden="true">/</span>
        <span aria-current="page">{spec.name}</span>
      </nav>
      <header className="spec-head">
        <div>
          <h1 ref={h1} tabIndex={-1}>{spec.name}</h1>
          <p className="line">{spec.line}</p>
        </div>
        <dl className="spec-meta">
          <div><dt>Status</dt><dd>Spec, not built yet</dd></div>
          <div><dt>Areas</dt><dd>{spec.areas.join(", ")}</dd></div>
          <div><dt>First release</dt><dd className="mono">about {spec.weeks} weeks</dd></div>
        </dl>
      </header>
      <div className="spec-body">
        {parts.map(([title, body]) => (
          <div key={title}>
            <h2>{title}</h2>
            <div className="content">{body}</div>
          </div>
        ))}
      </div>
      <nav className="spec-pager" aria-label="More specs">
        <a href={`#/specs/${prev.slug}`}>Previous: {prev.name}</a>
        <a href={`#/specs/${next.slug}`}>Next: {next.name}</a>
      </nav>
    </main>
  );
}
