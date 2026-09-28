import { Windows } from "./Windows";
import { InterestsCarousel } from "./InterestsCarousel";
import { ProductRow, type RowItem } from "./ProductRow";
import { CardArt } from "./Art";
import { MANUSCRIPTS, PROFILE } from "../data/cv";

const GH = "https://github.com/WDaugherty";

const EARLIER: RowItem[] = [
  { key: "sepsis", name: "Sepsis", descriptor: "ECG deep learning for septic shock", art: <CardArt.ecg />, tag: "Cornell Tech",
    chips: [{ short: "Py", full: "Python" }, { short: "PT", full: "PyTorch" }, { short: "Qz", full: "Quantization" }],
    year: "2023", field: "MIMIC-III", status: "Complete", href: "#/projects/sepsis", button: "View", code: `${GH}/Sepsis-Classfication` },
  { key: "network", name: "Dominion", descriptor: "opinion dynamics on Twitter", art: <CardArt.graph />, tag: "Cornell Tech",
    chips: [{ short: "Py", full: "Python" }, { short: "Nx", full: "NetworkX" }, { short: "Bt", full: "BERT" }],
    year: "2022", field: "Graphs", status: "Complete", href: "#/projects/network-opinion", button: "View", code: `${GH}/Dominion_Voting_Analysis` },
  { key: "bci", name: "addictionBCI", descriptor: "EEG and nicotine relapse", art: <CardArt.eeg />,
    chips: [{ short: "TS", full: "TypeScript" }],
    year: "2024", field: "EEG", status: "Archived", href: "#/projects/addiction-bci", button: "View", code: `${GH}/addictionBCI` },
  { key: "tox21", name: "SMILES", descriptor: "Tox21 toxicity in Julia", art: <CardArt.molecule />,
    chips: [{ short: "Jl", full: "Julia" }, { short: "Fx", full: "Flux" }],
    year: "2021", field: "Chemistry", status: "Complete", href: "#/projects/tox21", button: "View", code: `${GH}/SMILES` },
  { key: "md", name: "Catalase", descriptor: "manganese catalase dynamics", art: <CardArt.helix />,
    chips: [{ short: "Gr", full: "GROMACS" }, { short: "Nd", full: "NAMD" }, { short: "Ch", full: "CHARMM36" }, { short: "Bl", full: "BLAST" }],
    year: "2018", field: "Juniata", status: "Complete", href: "#/projects/molecular-dynamics", button: "View" },
];

const SHORT = ["Trends", "Centiles", "Oxygen", "Bronchiolitis", "Feeding"];
const ARTS = [<CardArt.trend />, <CardArt.centile />, <CardArt.oxygen />, <CardArt.airway />, <CardArt.feeding />];
/** Lower-case the working title and drop a leading "Name:" so the short name is not repeated. */
function describe(title: string, short: string) {
  const t = short && title.toLowerCase().startsWith(short.toLowerCase() + ":") ? title.slice(short.length + 1).trim() : title;
  return t.charAt(0).toLowerCase() + t.slice(1);
}

const MANUS: RowItem[] = MANUSCRIPTS.map((m, i) => ({
  key: m, name: SHORT[i] ?? `Study ${i + 1}`, descriptor: describe(m, SHORT[i] ?? ""), art: ARTS[i % ARTS.length],
  year: "2026", field: "Neonatal", status: "In prep", href: "#/research", button: "Details",
}));

export function IntroBanner() {
  return (
    <section className="sheet banner-intro" aria-labelledby="home-title">
      <h1 id="home-title" tabIndex={-1}>{PROFILE.name}</h1>
      <p>{PROFILE.position} at {PROFILE.affiliation}, working on longitudinal monitoring and precision medicine.</p>
      <a className="btn btn-outline-light" href="#/cv">Read my CV</a>
    </section>
  );
}

/** Home: the reference board, panel for panel. DOM order puts the introduction first. */
export function BoardPanels() {
  return (
    <>
      <div className="area-d"><IntroBanner /></div>
      <div className="area-a"><Windows /></div>
      <div className="area-b"><InterestsCarousel /></div>
      <div className="area-e">
        <ProductRow id="manus-title" title={["Manuscripts in preparation", "at Dartmouth Health"]} link={{ href: "#/research", label: "All research" }} items={MANUS} />
      </div>
      <div className="area-c">
        <ProductRow id="earlier-title" title={["Earlier research", "and engineering"]} link={{ href: "#/projects", label: "All projects" }} items={EARLIER} />
      </div>
    </>
  );
}
