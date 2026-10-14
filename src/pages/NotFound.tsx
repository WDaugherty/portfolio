export function NotFound({ path }: { path: string }) {
  return (
    <section className="panel">
      <h1 tabIndex={-1}>There is no page at {path}</h1>
      <p className="not-found">
        Try <a href="#/research">Research</a>, <a href="#/projects">Projects</a> or the <a href="#/">home page</a>.
      </p>
    </section>
  );
}
