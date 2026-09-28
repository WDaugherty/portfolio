import { useEffect, useState } from "react";
import { About, News } from "../components/Intro";
import { Precision } from "../components/Precision";
import { Work, type Lens } from "../components/Work";
import { Research } from "../components/Research";
import { Connections } from "../components/Connections";
import { Specs } from "../components/Specs";
import { CV } from "../components/CV";

export function ProjectsPage({ focus }: { focus?: string }) {
  const [lens, setLens] = useState<Lens>("all");
  useEffect(() => {
    if (!focus) return;
    setLens("all");
    const el = document.getElementById(`work-${focus}`);
    if (!el) return;
    requestAnimationFrame(() => {
      el.scrollIntoView({ block: "start" });
      el.setAttribute("data-focus", "true");
      el.querySelector<HTMLElement>("h3")?.focus({ preventScroll: true });
    });
    const t = window.setTimeout(() => el.removeAttribute("data-focus"), 2400);
    return () => window.clearTimeout(t);
  }, [focus]);
  return <Work lens={lens} setLens={setLens} headingLevel={1} />;
}

export function ResearchPage() {
  return (
    <>
      <Research headingLevel={1} />
      <Precision />
      <Connections />
    </>
  );
}

export const SpecsPage = () => <Specs headingLevel={1} />;
export const CVPage = () => (
  <>
    <CV />
    <div className="bento bento-side">
      <News />
      <About />
    </div>
  </>
);

export function MissingPage({ path }: { path: string }) {
  return (
    <section className="sheet section" aria-labelledby="missing-title">
      <h1 id="missing-title" tabIndex={-1} className="missing-title">There is no page at {path}.</h1>
      <p className="missing-body">Try <a href="#/research">Research</a>, <a href="#/projects">Projects</a> or <a href="#/">the home page</a>.</p>
    </section>
  );
}
