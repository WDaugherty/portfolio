import type { MethodId } from "./methods";

export type Domain = "neonatal" | "rheum" | "economics" | "ml" | "other";
export type Role = "founder" | "researcher" | "developer";
export type Status = "production" | "live" | "building" | "research" | "complete" | "archived";

export interface Project {
  slug: string;
  name: string;
  years: string;
  domain: Domain;
  summary: string;
  body: string;
  stack: string[];
  status: Status;
  note?: string;
  links: { label: string; href: string }[];
  methods: MethodId[];
  roles: Role[];
}

export const DOMAIN_LABEL: Record<Domain, string> = {
  neonatal: "Neonatal and perinatal",
  rheum: "Rheumatology and immunology",
  economics: "Health economics",
  ml: "Machine learning and systems",
  other: "Other",
};

export const LENSES: { id: Role | "all"; label: string }[] = [
  { id: "all", label: "All" },
  { id: "researcher", label: "Research" },
  { id: "developer", label: "Engineering" },
  { id: "founder", label: "Companies" },
];

export const STATUS_LABEL: Record<Status, string> = {
  production: "In production",
  live: "Live",
  building: "Building",
  research: "Research",
  complete: "Complete",
  archived: "Archived",
};

const GH = "https://github.com/WDaugherty";

export const PROJECTS: Project[] = [
  {
    slug: "advanced-care-at-home",
    name: "Advanced Care at Home",
    years: "2025–",
    domain: "neonatal",
    summary: "ICU-grade monitoring for medically complex infants at home.",
    body: "Streams continuous vital signs from bedside monitors in family homes to clinicians, with per-device certificates and end-to-end encryption through hospital firewalls. A daily engine checks each child against clinical protocols and flags who is ready to wean and who is at risk. 500+ children and 100K+ monitored hours so far.",
    stack: ["Streaming ingest", "mTLS", "Risk models", "Clinician dashboard"],
    status: "production",
    note: "Closed source; demo on request",
    links: [],
    methods: ["timeseries", "baselines", "infrastructure"],
    roles: ["founder", "developer"],
  },
  {
    slug: "neonatal-research",
    name: "Neonatal home monitoring research",
    years: "2024–",
    domain: "neonatal",
    summary: "Heart rate variability, home oxygen weaning and home tube feeding.",
    body: "Data lead on Dartmouth neonatal projects including Hope Grows at Home, home oxygen weaning and bronchiolitis, with five manuscripts in progress. Current questions: how much autonomic signal survives in the averaged trends home monitors store, and what physiologic centile charts look like for infants at home.",
    stack: ["Mixed models", "Survival analysis", "HRV", "IRB design"],
    status: "research",
    note: "Manuscripts in progress",
    links: [],
    methods: ["timeseries", "baselines"],
    roles: ["researcher"],
  },
  {
    slug: "perinatal-dashboards",
    name: "Perinatal community dashboards",
    years: "2024–",
    domain: "neonatal",
    summary: "Statewide perinatal quality data for the people who act on it.",
    body: "Community-facing dashboards monitoring New Hampshire perinatal health-improvement projects for NH DHHS partners and quality-collaborative members, built to become the one place people go for current data.",
    stack: ["SQL", "Data visualization"],
    status: "live",
    note: "Dartmouth Health",
    links: [],
    methods: ["population"],
    roles: ["researcher", "developer"],
  },
  {
    slug: "rheumatology-research",
    name: "Rheumatology precision medicine",
    years: "2026–",
    domain: "rheum",
    summary: "Biomarker replication, network medicine and practice-based studies.",
    body: "Testing whether published rheumatoid arthritis and lupus gene signatures replicate on held-out cohorts, whether network proximity explains which IL-17 and IL-23 drugs work across skin, joint and gut, and practice questions such as triage of ANA-positive referrals.",
    stack: ["GEO", "ArrayExpress", "Network proximity"],
    status: "research",
    note: "Study design",
    links: [{ label: "See the research", href: "#/research" }],
    methods: ["graphs", "baselines", "imaging"],
    roles: ["researcher"],
  },
  {
    slug: "arlett-health",
    name: "Arlett Health",
    years: "2026–",
    domain: "economics",
    summary: "Payer rate intelligence for independent physician practices.",
    body: "Reads each payer's Transparency-in-Coverage files, often past 100 GB per payer per month, against a practice's market and specialty codes. One NPI in; a payer-by-payer negotiation case out, every number traced to the file it came from. Processes no protected health information.",
    stack: ["Python", "React", "Docker", "MCP server"],
    status: "building",
    links: [],
    methods: ["population", "infrastructure", "language"],
    roles: ["founder", "developer"],
  },
  {
    slug: "sepsis",
    name: "Sepsis and arrhythmia detection on ECG",
    years: "2023",
    domain: "ml",
    summary: "Real-time prediction with quantized deep networks.",
    body: "Deep learning for arrhythmia detection on the MIT-BIH Arrhythmia Database and real-time prediction of septic shock from ECG in MIMIC-III, with models quantized to run on bedside-class hardware. Built alongside Cornell Tech's Machine Learning Hardware and Systems course.",
    stack: ["Python", "PyTorch", "Quantization", "pytest"],
    status: "complete",
    links: [
      { label: "Code", href: `${GH}/Sepsis-Classfication` },
      { label: "ML hardware coursework", href: `${GH}/ECE-5545-Machine-Learning-Hardware-and-Systems` },
    ],
    methods: ["timeseries"],
    roles: ["researcher", "developer"],
  },
  {
    slug: "network-opinion",
    name: "Opinion dynamics on a Twitter network",
    years: "2022",
    domain: "ml",
    summary: "Graph-based data science on an election-machine controversy.",
    body: "Collected users, tweets and interactions about Dominion voting machines through the Twitter API, then studied the network with centrality measures, community detection, Hegselmann–Krause opinion dynamics and BERT sentiment. Cornell Tech, Graph-Based Data Science.",
    stack: ["Python", "NetworkX", "BERT", "Jupyter"],
    status: "complete",
    links: [{ label: "Code", href: `${GH}/Dominion_Voting_Analysis` }],
    methods: ["graphs", "language"],
    roles: ["researcher", "developer"],
  },
  {
    slug: "caddi",
    name: "Caddi",
    years: "2022–2024",
    domain: "other",
    summary: "Client onboarding for law firms, AI2 Incubator.",
    body: "Co-founded and built a legal-tech platform with a retrieval-augmented assistant across 200+ legal domains. Raised $270K from AI2 Incubator; 10 firms and 30+ attorneys onboarded in year one. The same period produced learn_n_link at HackGPT 2023, a Next.js and Flask app on Claude and Cohere.",
    stack: ["Node.js", "Flask", "React", "Pinecone", "AWS", "Pulumi"],
    status: "archived",
    links: [
      { label: "trycaddi.com", href: "https://www.trycaddi.com/" },
      { label: "learn_n_link", href: `${GH}/learn_n_link` },
    ],
    methods: ["language", "infrastructure"],
    roles: ["founder", "developer"],
  },
  {
    slug: "tox21",
    name: "Tox21 toxicity classification",
    years: "2021",
    domain: "ml",
    summary: "Neural networks on SMILES strings, written in Julia.",
    body: "Classified compounds in the Tox21 toxicity benchmark from their SMILES representations with neural networks in Julia, a cheminformatics exercise that sits beside the molecular dynamics work below.",
    stack: ["Julia", "Flux", "SMILES"],
    status: "complete",
    links: [{ label: "Code", href: `${GH}/SMILES` }],
    methods: ["molecular"],
    roles: ["developer"],
  },
  {
    slug: "addiction-bci",
    name: "addictionBCI",
    years: "2024",
    domain: "ml",
    summary: "EEG signals toward preventing nicotine relapse.",
    body: "A TypeScript prototype that uses EEG data from a consumer headset to flag craving states, aimed at helping people avoid nicotine relapse.",
    stack: ["TypeScript", "EEG"],
    status: "archived",
    links: [{ label: "Code", href: `${GH}/addictionBCI` }],
    methods: ["timeseries"],
    roles: ["developer"],
  },
  {
    slug: "molecular-dynamics",
    name: "Manganese catalase dynamics",
    years: "2018–2021",
    domain: "ml",
    summary: "Molecular modeling and phylogenetics, Juniata College.",
    body: "3,000+ GROMACS frames of the di-manganese catalase family, sub-2 Å active-site overlays with CHARMM36 in NAMD, and a phylogeny built from 1,000+ BLAST hits; later, neural-network classification of hospital surface samples for infection-control research.",
    stack: ["GROMACS", "NAMD", "CHARMM36", "TensorFlow"],
    status: "complete",
    links: [],
    methods: ["molecular"],
    roles: ["researcher"],
  },
  {
    slug: "borehole",
    name: "Borehole report automation",
    years: "2026",
    domain: "other",
    summary: "Geologic observation summaries from borehole tables.",
    body: "Turns raw borehole feature tables into ready-to-paste observations such as \u201cFracture observed between 35.0\u2032 and 54.2\u2032\u201d, with a configurable gap rule separating continuous from discontinuous depth ranges. In use with hydrogeologists.",
    stack: ["Google Sheets"],
    status: "live",
    links: [],
    methods: [],
    roles: ["developer"],
  },
  {
    slug: "ethics-practice",
    name: "Admissions ethics practice",
    years: "2026–",
    domain: "other",
    summary: "Situational-judgment practice for PREview and Casper.",
    body: "A practice platform for pre-medical applicants working through ethical and situational-judgment scenarios, with automated scoring and feedback.",
    stack: ["Web app", "Automated scoring"],
    status: "building",
    links: [],
    methods: ["language"],
    roles: ["founder", "developer"],
  },
];
