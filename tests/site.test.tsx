import { describe, expect, it } from "vitest";
import { renderToString } from "react-dom/server";
import { App } from "../src/App";
import { PAGES, parseHash } from "../src/lib/route";
import { compare, makePatients, POPULATION } from "../src/lib/baselines";
import { buildGraph } from "../src/components/MethodsGraph";
import { PROJECTS } from "../src/data/projects";
import { MANUSCRIPTS } from "../src/data/profile";

const render = (hash: string) => renderToString(<App serverHash={hash} />);
const pages = Object.fromEntries(PAGES.map((p) => [p.name, render(p.path)]));
const everything = Object.values(pages).join("\n");
const mainOf = (html: string) => html.slice(html.indexOf("<main"), html.indexOf("</main>"));

describe("routing", () => {
  it("parses pages, project links and unknown paths", () => {
    expect(parseHash("")).toEqual({ page: "home" });
    expect(parseHash("#/")).toEqual({ page: "home" });
    expect(parseHash("#/cv")).toEqual({ page: "cv", focus: undefined });
    expect(parseHash("#/projects/arlett-health")).toEqual({ page: "projects", focus: "arlett-health" });
    expect(parseHash("#/cv/extra").page).toBe("missing");
    expect(parseHash("#/nowhere").page).toBe("missing");
  });

  it("resolves every internal link on every page", () => {
    for (const [, href] of everything.matchAll(/href="(#\/[^"]*)"/g)) {
      expect(parseHash(href).page, href).not.toBe("missing");
    }
  });

  it("links each project window and item to a project that exists", () => {
    for (const [, slug] of everything.matchAll(/href="#\/projects\/([^"]+)"/g)) {
      expect(pages.projects, slug).toContain(`id="project-${slug}"`);
    }
  });
});

describe("pages", () => {
  it("gives every page exactly one h1, inside main", () => {
    for (const [name, html] of Object.entries(pages)) {
      expect((html.match(/<h1/g) ?? []).length, name).toBe(1);
      expect(mainOf(html), name).toContain("<h1");
    }
  });

  it("keeps the header and footer outside main", () => {
    for (const html of Object.values(pages)) {
      expect(mainOf(html)).not.toContain("<header");
      expect(mainOf(html)).not.toContain("<footer");
    }
  });

  it("lays out the home board panel for panel", () => {
    for (const area of ["banner", "windows", "interests", "manuscripts", "earlier", "footer"]) {
      expect(pages.home).toContain(`class="area-${area}"`);
    }
    expect((pages.home.match(/class="window"/g) ?? []).length).toBe(4);
    expect((pages.home.match(/class="item"/g) ?? []).length).toBe(10);
    expect(pages.home).toContain("footer footer-attached");
  });

  it("lists every project and manuscript", () => {
    for (const p of PROJECTS) expect(pages.projects).toContain(`id="project-${p.slug}"`);
    for (const m of MANUSCRIPTS) expect(pages.cv).toContain(m.title);
  });

  it("shows a not-found page for unknown paths", () => {
    expect(render("#/nowhere")).toContain("There is no page at");
  });
});

describe("baseline figure", () => {
  const patients = makePatients();

  it("is deterministic", () => {
    expect(makePatients()[0].visits).toEqual(patients[0].visits);
  });

  it("opens on a value that is normal for the population and unusual for patient A", () => {
    const a = patients[0];
    expect(compare(a.today, a)).toMatchObject({ population: "within", personal: "above" });
  });

  it("opens patient B outside the population range but usual for them, and patient C inside both", () => {
    const [, b, c] = patients;
    expect(compare(b.today, b)).toMatchObject({ population: "above", personal: "within" });
    expect(compare(c.today, c)).toMatchObject({ population: "within", personal: "within" });
  });

  it("gives every patient a narrower range than the population", () => {
    for (const p of patients) expect(4 * p.sd).toBeLessThan(POPULATION.high - POPULATION.low);
  });
});

describe("data", () => {
  it("uses unique project slugs", () => {
    expect(new Set(PROJECTS.map((p) => p.slug)).size).toBe(PROJECTS.length);
  });

  it("builds a methods graph whose edges join existing nodes", () => {
    const { left, right, edges } = buildGraph();
    const keys = new Set([...left, ...right].map((n) => n.key));
    for (const e of edges) expect(keys.has(e.from) && keys.has(e.to)).toBe(true);
  });
});

describe("copy", () => {
  it("avoids placeholder, sales and template language", () => {
    const text = everything.toLowerCase();
    const banned = [
      "lorem",
      "todo",
      "—",
      "learn more",
      "submit",
      "discuss a project",
      "unlock",
      "elevate",
      "seamless",
      "!</",
      "open source",
    ];
    for (const phrase of banned) expect(text, phrase).not.toContain(phrase);
  });
});
