import { Banner, Interests, ItemRow, Windows, type Item } from "../components/Panels";
import { Footer } from "../components/Chrome";
import { MANUSCRIPTS } from "../data/profile";
import { projectBySlug } from "../data/projects";

const EARLIER: Omit<Item, "year" | "status" | "code" | "href">[] = [
  {
    key: "sepsis",
    name: "Sepsis",
    description: "ECG deep learning for septic shock",
    icon: "ecg",
    tag: "Cornell",
    tools: ["Python", "PyTorch"],
    detail: "MIMIC-III",
  },
  {
    key: "network-opinion",
    name: "Dominion",
    description: "Opinion dynamics on Twitter",
    icon: "graph",
    tag: "Cornell",
    tools: ["Python", "NetworkX"],
    detail: "Graphs",
  },
  {
    key: "addiction-bci",
    name: "addictionBCI",
    description: "EEG and nicotine relapse",
    icon: "eeg",
    tools: ["TypeScript"],
    detail: "EEG",
  },
  {
    key: "tox21",
    name: "SMILES",
    description: "Tox21 toxicity in Julia",
    icon: "molecule",
    tools: ["Julia", "Flux"],
    detail: "Chemistry",
  },
  {
    key: "molecular-dynamics",
    name: "Catalase",
    description: "Manganese catalase dynamics",
    icon: "helix",
    tools: ["GROMACS", "NAMD"],
    detail: "Juniata",
  },
];

const earlier: Item[] = EARLIER.map((item) => {
  const project = projectBySlug(item.key)!;
  return {
    ...item,
    year: project.years.slice(0, 4),
    status: project.status,
    code: project.links.find((l) => l.label === "Code")?.href,
    href: `#/projects/${item.key}`,
  };
});

const ICONS = ["trend", "centile", "oxygen", "airway", "feeding"] as const;
const manuscripts: Item[] = MANUSCRIPTS.map((m, i) => ({
  key: m.short,
  name: m.short,
  description: m.title,
  icon: ICONS[i % ICONS.length],
  year: "2026",
  detail: "Neonatal",
  status: "In preparation",
}));

/** The home page follows the reference board: two columns of panels, the footer attached under the left one. */
export function Home() {
  return (
    <div className="board">
      <main id="main" className="board-main">
        <div className="area-banner">
          <Banner />
        </div>
        <div className="area-windows">
          <Windows />
        </div>
        <div className="area-interests">
          <Interests />
        </div>
        <div className="area-manuscripts">
          <ItemRow
            id="manuscripts-title"
            lines={["Manuscripts in preparation", "at Dartmouth Health"]}
            link={{ href: "#/research", label: "All research" }}
            items={manuscripts}
          />
        </div>
        <div className="area-earlier">
          <ItemRow
            id="earlier-title"
            lines={["Earlier research", "and engineering"]}
            link={{ href: "#/projects", label: "All projects" }}
            items={earlier}
            attached
          />
        </div>
      </main>
      <div className="area-footer">
        <Footer attached />
      </div>
    </div>
  );
}
