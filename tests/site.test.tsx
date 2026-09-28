import { describe, expect, it } from "vitest";
import { renderToString } from "react-dom/server";
import { App } from "../src/App";
import { PROJECTS } from "../src/data/projects";
import { SPECS } from "../src/data/specs";
import { METHODS } from "../src/data/methods";
import { EDUCATION, EXPERIENCE, MANUSCRIPTS, POSTERS } from "../src/data/cv";
import { PAGES, parseHash } from "../src/lib/route";
import { makeTrace } from "../src/lib/trace";
import { judge, makePeople, POPULATION } from "../src/lib/precision";
import { countByLens } from "../src/components/Work";
import { buildGraph } from "../src/components/Connections";
import { FEATURES } from "../src/config";

const render = (hash: string) => renderToString(<App serverHash={hash} />);
const pages = Object.fromEntries(PAGES.map((p) => [p.name, render(p.path)]));
const all = Object.values(pages).join("\n");

describe("pages", () => {
  it("has home, research, projects and CV, each with one h1 in main", () => {
    expect(PAGES.map((p) => p.name)).toEqual(["home", "research", "projects", "cv"]);
    for (const [name, html] of Object.entries(pages)) {
      const main = html.slice(html.indexOf("<main"), html.indexOf("</main>"));
      expect((main.match(/<h1/g) ?? []).length, name).toBe(1);
    }
  });
  it("home is the reference board: banner, windows, carousel, two item rows, attached footer", () => {
    const h = pages.home;
    expect(h).toMatch(/<h1[^>]*>William Daugherty-Miller<\/h1>/);
    expect(h.indexOf("<h1")).toBeLessThan(h.indexOf('class="windows"'));
    expect(h).toContain('aria-roledescription="carousel"');
    expect(h).toContain("Showing interests 1 to 3 of 9");
    expect((h.match(/class="product"/g) ?? []).length).toBe(10);
    expect(h).toContain('class="footer attached"');
  });
  it("CV page carries the bio and news that left the home page", () => {
    expect(pages.cv).toContain('id="about-title"');
    expect(pages.cv).toContain('id="news-title"');
  });
  it("every internal link resolves", () => {
    const hrefs = [...all.matchAll(/href="(#\/[^"]*)"/g)].map((m) => m[1]);
    for (const h of hrefs) expect(parseHash(h).name, h).not.toBe("missing");
  });
  it("project windows link to real project rows", () => {
    const wins = [...pages.home.matchAll(/class="win win-(?:tl|tr|bl|br)"><a href="#\/projects\/([^"]+)"/g)].map((m) => m[1]);
    expect(wins).toHaveLength(4);
    for (const slug of wins) expect(pages.projects).toContain(`id="work-${slug}"`);
  });
  it("earlier-work cards link to real project rows", () => {
    const cards = [...pages.home.matchAll(/class="card-btn" href="#\/projects\/([^"]+)"/g)].map((m) => m[1]);
    expect(cards.length).toBe(5);
    for (const slug of cards) expect(pages.projects).toContain(`id="work-${slug}"`);
  });
  it("projects and research pages list their content", () => {
    for (const p of PROJECTS) expect(pages.projects).toContain(p.name.replace(/&/g, "&amp;"));
    for (const m of MANUSCRIPTS) expect(pages.research).toContain(m.replace(/&/g, "&amp;"));
    expect(pages.research).toContain('id="connections"');
    expect(pages.research).toContain('id="precision"');
  });
  it("CV lists education, experience and manuscripts, and hides empty sections", () => {
    for (const e of EDUCATION) expect(pages.cv).toContain(e.school);
    for (const x of EXPERIENCE) expect(pages.cv).toContain(x.org.replace(/&/g, "&amp;"));
    expect(pages.cv).toContain("Manuscripts in preparation");
    expect(pages.cv.includes("Posters and presentations")).toBe(POSTERS.length > 0);
  });
  it("keeps specs hidden and shows a clear not-found page", () => {
    expect(FEATURES.openSourceSpecs).toBe(false);
    expect(render("#/specs")).toContain("There is no page at");
    expect(render(`#/specs/${SPECS[0].slug}`)).toContain("There is no page at");
    expect(render("#/nope")).toContain("There is no page at");
  });
});

describe("chrome and accessibility", () => {
  it("keeps banner, main and contentinfo as siblings on every page", () => {
    for (const html of Object.values(pages)) {
      const main = html.slice(html.indexOf("<main"), html.lastIndexOf("</main>"));
      expect(main).not.toContain('<header class="nav');
      expect(main).not.toContain("<footer");
    }
  });
  it("labels the figure slider and renders cleanly", () => {
    expect(pages.research).toMatch(/<label for="[^"]+">Today&#x27;s value<\/label>/);
    expect(render("#/projects")).not.toContain("undefined");
  });
});

describe("routing", () => {
  it("parses pages, project focus and unknown paths", () => {
    expect(parseHash("#/")).toEqual({ name: "home" });
    expect(parseHash("#/cv")).toEqual({ name: "cv" });
    expect(parseHash("#/projects/arlett-health")).toEqual({ name: "projects", focus: "arlett-health" });
    expect(parseHash("#/work").name).toBe("missing");
  });
});

describe("figure data", () => {
  const people = makePeople();
  it("keeps the teaching case: normal for the population, unusual for patient A", () => {
    const a = people.find((p) => p.id === "a")!;
    expect(judge(a.defaultLatest, a)).toMatchObject({ population: "within", personal: "above" });
  });
  it("personal ranges are narrower than the population range", () => {
    for (const p of people) expect(4 * p.sd).toBeLessThan(POPULATION.high - POPULATION.low);
  });
  it("synthetic trace is deterministic", () => {
    expect(Array.from(makeTrace().hr)).toEqual(Array.from(makeTrace().hr));
  });
});

describe("data integrity", () => {
  it("slugs unique, methods exist, lens counts match, graph edges valid", () => {
    const methodIds = new Set(METHODS.map((m) => m.id));
    expect(new Set(PROJECTS.map((p) => p.slug)).size).toBe(PROJECTS.length);
    for (const p of PROJECTS) for (const m of p.methods) expect(methodIds.has(m)).toBe(true);
    const c = countByLens();
    for (const r of ["founder", "researcher", "developer"] as const) expect(c.get(r)).toBe(PROJECTS.filter((p) => p.roles.includes(r)).length);
    const g = buildGraph();
    const keys = new Set([...g.left, ...g.right].map((n) => n.key));
    for (const e of g.edges) expect(keys.has(e.from) && keys.has(e.to)).toBe(true);
  });
});

describe("tone", () => {
  it("has no sales language, open-source mentions or template tells", () => {
    const text = all.toLowerCase();
    for (const bad of ["discuss a project", "bring me", "open-source", "open source", "#/specs", "announcement", "handled like it matters",
      "lorem", "todo", "\u2014", "unlock", "elevate", "seamless", "learn more", "submit", "!</"]) {
      expect(text, bad).not.toContain(bad);
    }
  });
});
