import { useEffect } from "react";
import { useRoute, PAGES, type Route } from "./lib/route";
import { Footer, Nav } from "./components/Chrome";
import { Home } from "./pages/Home";
import { Research } from "./pages/Research";
import { Projects } from "./pages/Projects";
import { About } from "./pages/About";
import { CV } from "./pages/CV";
import { NotFound } from "./pages/NotFound";
import { PROFILE } from "./data/profile";

function Page({ route }: { route: Route }) {
  switch (route.page) {
    case "research":
      return <Research />;
    case "projects":
      return <Projects focus={route.focus} />;
    case "about":
      return <About />;
    case "cv":
      return <CV />;
    case "missing":
      return <NotFound path={route.path} />;
    default:
      return null;
  }
}

function title(route: Route) {
  if (route.page === "home") return `${PROFILE.name}, ${PROFILE.affiliation}`;
  const label = route.page === "missing" ? "Page not found" : PAGES.find((p) => p.name === route.page)!.label;
  return `${label}: ${PROFILE.name}`;
}

export function App({ serverHash }: { serverHash?: string }) {
  const route = useRoute(serverHash);
  const key = route.page === "missing" ? route.path : route.page;
  const focus = route.page === "projects" ? route.focus : undefined;

  // On each page change: update the title, return to the top and move focus to the page heading.
  useEffect(() => {
    document.title = title(route);
    if (focus) return;
    window.scrollTo({ top: 0 });
    document.querySelector<HTMLElement>("main h1")?.focus({ preventScroll: true });
  }, [key, focus]); // eslint-disable-line react-hooks/exhaustive-deps

  const skip = (e: React.MouseEvent) => {
    e.preventDefault();
    document.querySelector<HTMLElement>("main h1")?.focus();
  };

  return (
    <div className="site">
      <a className="skip-link" href="#main" onClick={skip}>
        Skip to content
      </a>
      <Nav route={route} />
      {route.page === "home" ? (
        <Home />
      ) : (
        <>
          <main id="main" key={key}>
            <Page route={route} />
          </main>
          <Footer />
        </>
      )}
    </div>
  );
}
