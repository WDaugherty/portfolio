import { useEffect } from "react";
import { useRoute, type Route } from "./lib/route";
import { Nav, Footer } from "./components/Chrome";
import { SpecPage } from "./components/SpecPage";
import { CVPage, MissingPage, ProjectsPage, ResearchPage, SpecsPage } from "./pages/Pages";
import { BoardPanels } from "./components/Board";

const NAME = "William Daugherty-Miller";
const TITLES: Record<string, string> = {
  home: `${NAME}: clinical data science and precision medicine`,
  research: `Research: ${NAME}`,
  projects: `Projects: ${NAME}`,
  cv: `CV: ${NAME}`,
  specs: `Specs: ${NAME}`,
  missing: `Page not found: ${NAME}`,
};

function Page({ route }: { route: Route }) {
  switch (route.name) {
    case "projects": return <ProjectsPage focus={route.focus} />;
    case "research": return <ResearchPage />;
    case "cv": return <CVPage />;
    case "specs": return <SpecsPage />;
    case "spec": return <SpecPage slug={route.slug} />;
    case "missing": return <MissingPage path={route.path} />;
    default: return null;
  }
}

export function App({ serverHash }: { serverHash?: string }) {
  const route = useRoute(serverHash);
  const key = route.name === "spec" ? `spec:${route.slug}` : route.name;
  const focusSlug = route.name === "projects" ? route.focus : undefined;

  useEffect(() => {
    if (focusSlug) return;
    window.scrollTo({ top: 0 });
    if (route.name !== "spec") document.title = TITLES[route.name];
    document.querySelector<HTMLElement>("main h1")?.focus({ preventScroll: true });
  }, [key, focusSlug]); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <div className="frame">
      <a className="skip" href="#main" onClick={(e) => { e.preventDefault(); document.querySelector<HTMLElement>("main h1")?.focus(); }}>Skip to content</a>
      <Nav route={route} />
      {route.name === "home" ? (
        <div className="board">
          <main id="main" className="board-main" key={key}>
            <BoardPanels />
          </main>
          <div className="area-f"><Footer attached /></div>
        </div>
      ) : (
        <>
          {route.name === "spec" ? (
            <SpecPage slug={route.slug} />
          ) : (
            <main id="main" key={key}>
              <Page route={route} />
            </main>
          )}
          <Footer />
        </>
      )}
    </div>
  );
}
