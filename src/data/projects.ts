export type Kind = "research" | "engineering" | "company";

export type MethodId =
  "timeseries" | "baselines" | "graphs" | "language" | "molecular" | "optimization" | "population" | "infrastructure";

export const METHODS: Record<MethodId, string> = {
  timeseries: "Physiologic time series",
  baselines: "Personal baselines and centiles",
  graphs: "Graph and network models",
  language: "Retrieval and language models",
  molecular: "Molecular modeling",
  optimization: "Optimization",
  population: "Population and payer data",
  infrastructure: "Secure data infrastructure",
};

export interface Project {
  slug: string;
  name: string;
  years: string;
  area: string;
  summary: string;
  body: string;
  stack: string[];
  status: string;
  note?: string;
  links: { label: string; href: string }[];
  methods: MethodId[];
  kinds: Kind[];
}

const GH = "https://github.com/WDaugherty";

export const PROJECTS: Project[] = [
  {
    slug: "advanced-care-at-home",
    name: "Advanced Care at Home",
    years: "Since 2025",
    area: "Neonatal and perinatal",
    summary: "ICU-grade monitoring for medically complex infants at home.",
    body: "Streams continuous vital signs from monitors in family homes to clinicians, with per-device certificates and end-to-end encryption through hospital firewalls. A daily check compares each child with clinical protocols and flags who is ready to wean and who is at risk. 500+ children and 100,000+ monitored hours so far.",
    stack: ["Streaming ingest", "mTLS", "Risk models", "Clinician dashboard"],
    status: "In production",
    note: "Closed source; walkthrough on request",
    links: [],
    methods: ["timeseries", "baselines", "infrastructure"],
    kinds: ["company", "engineering"],
  },
  {
    slug: "neonatal-research",
    name: "Neonatal home monitoring research",
    years: "Since 2024",
    area: "Neonatal and perinatal",
    summary: "Heart rate variability, home oxygen weaning and home tube feeding.",
    body: "Data lead on Dartmouth Health neonatal projects including Hope Grows at Home, home oxygen weaning and bronchiolitis. Current questions: how much autonomic signal survives in the averaged trends home monitors store, and what physiologic centile charts look like for infants at home.",
    stack: ["Mixed models", "Survival analysis", "HRV", "IRB design"],
    status: "Manuscripts in preparation",
    links: [{ label: "Research overview", href: "#/research" }],
    methods: ["timeseries", "baselines"],
    kinds: ["research"],
  },
  {
    slug: "perinatal-dashboards",
    name: "Perinatal community dashboards",
    years: "Since 2024",
    area: "Neonatal and perinatal",
    summary: "Statewide perinatal quality data for the people who act on it.",
    body: "Dashboards that track New Hampshire perinatal health-improvement projects for NH DHHS partners and quality-collaborative members.",
    stack: ["SQL", "Data visualization"],
    status: "Live",
    note: "Dartmouth Health",
    links: [],
    methods: ["population"],
    kinds: ["research", "engineering"],
  },
  {
    slug: "rheumatology-research",
    name: "Rheumatology precision medicine",
    years: "Since 2026",
    area: "Rheumatology and immunology",
    summary: "Biomarker replication, network medicine and practice-based studies.",
    body: "Study designs testing whether published rheumatoid arthritis and lupus gene signatures replicate on held-out cohorts, whether network proximity explains which IL-17 and IL-23 drugs work across skin, joint and gut, and practice questions such as triage of ANA-positive referrals.",
    stack: ["GEO", "ArrayExpress", "Network proximity"],
    status: "Study design",
    links: [{ label: "Research overview", href: "#/research" }],
    methods: ["graphs", "baselines"],
    kinds: ["research"],
  },
  {
    slug: "arlett-health",
    name: "Arlett Health",
    years: "Since 2026",
    area: "Health economics",
    summary: "Payer rate data for independent physician practices.",
    body: "Reads each payer's Transparency in Coverage files, often more than 100 GB per payer per month, against a practice's market and specialty codes, and reports rates payer by payer with every number traced to its source file. Processes no protected health information.",
    stack: ["Python", "React", "Docker"],
    status: "In development",
    links: [],
    methods: ["population", "infrastructure"],
    kinds: ["company", "engineering"],
  },
  {
    slug: "sepsis",
    name: "Sepsis and arrhythmia detection on ECG",
    years: "2023",
    area: "Machine learning",
    summary: "Real-time prediction with quantized deep networks.",
    body: "Arrhythmia detection on the MIT-BIH Arrhythmia Database and real-time prediction of septic shock from ECG in MIMIC-III, with models quantized to run on bedside-class hardware. Cornell Tech, Machine Learning Hardware and Systems.",
    stack: ["Python", "PyTorch", "Quantization"],
    status: "Complete",
    links: [
      { label: "Code", href: `${GH}/Sepsis-Classfication` },
      { label: "Course repository", href: `${GH}/ECE-5545-Machine-Learning-Hardware-and-Systems` },
    ],
    methods: ["timeseries"],
    kinds: ["research", "engineering"],
  },
  {
    slug: "network-opinion",
    name: "Opinion dynamics on a Twitter network",
    years: "2022",
    area: "Machine learning",
    summary: "Graph-based data science on an election-machine controversy.",
    body: "Collected users, tweets and interactions about Dominion voting machines through the Twitter API, then studied the network with centrality measures, community detection, Hegselmann-Krause opinion dynamics and BERT sentiment. Cornell Tech, Graph-Based Data Science.",
    stack: ["Python", "NetworkX", "BERT"],
    status: "Complete",
    links: [{ label: "Code", href: `${GH}/Dominion_Voting_Analysis` }],
    methods: ["graphs", "language"],
    kinds: ["research", "engineering"],
  },
  {
    slug: "caddi",
    name: "Caddi",
    years: "2022–2024",
    area: "Legal technology",
    summary: "Client onboarding for law firms, AI2 Incubator.",
    body: "Co-founded and built a legal-tech platform with a retrieval-based assistant across 200+ legal domains. Raised $270K from the AI2 Incubator; 10 firms and 30+ attorneys onboarded in the first year.",
    stack: ["Node.js", "Flask", "React", "Pinecone", "AWS"],
    status: "Archived",
    links: [{ label: "learn_n_link", href: `${GH}/learn_n_link` }],
    methods: ["language", "infrastructure"],
    kinds: ["company", "engineering"],
  },
  {
    slug: "addiction-bci",
    name: "addictionBCI",
    years: "2024",
    area: "Machine learning",
    summary: "EEG signals and nicotine relapse.",
    body: "A TypeScript prototype that reads EEG from a consumer headset to flag craving states.",
    stack: ["TypeScript", "EEG"],
    status: "Archived",
    links: [{ label: "Code", href: `${GH}/addictionBCI` }],
    methods: ["timeseries"],
    kinds: ["engineering"],
  },
  {
    slug: "tox21",
    name: "Tox21 toxicity classification",
    years: "2021",
    area: "Cheminformatics",
    summary: "Neural networks on SMILES strings, written in Julia.",
    body: "Classified compounds in the Tox21 toxicity benchmark from their SMILES representations with neural networks in Julia.",
    stack: ["Julia", "Flux", "SMILES"],
    status: "Complete",
    links: [{ label: "Code", href: `${GH}/SMILES` }],
    methods: ["molecular"],
    kinds: ["engineering"],
  },
  {
    slug: "molecular-dynamics",
    name: "Manganese catalase dynamics",
    years: "2018–2021",
    area: "Cheminformatics",
    summary: "Molecular modeling and phylogenetics, Juniata College.",
    body: "3,000+ GROMACS frames of the di-manganese catalase family, active-site overlays under 2 Å with CHARMM36 in NAMD, and a phylogeny built from 1,000+ BLAST hits.",
    stack: ["GROMACS", "NAMD", "CHARMM36", "BLAST"],
    status: "Complete",
    links: [],
    methods: ["molecular"],
    kinds: ["research"],
  },
  {
    slug: "borehole",
    name: "Borehole report automation",
    years: "2026",
    area: "Other",
    summary: "Geologic observation summaries from borehole tables.",
    body: "Turns borehole feature tables into report-ready observations such as “Fracture observed between 35.0′ and 54.2′”, with a configurable rule for merging nearby depth ranges. In use with hydrogeologists.",
    stack: ["Google Sheets"],
    status: "In use",
    links: [],
    methods: [],
    kinds: ["engineering"],
  },
  {
    slug: "ethics-practice",
    name: "Admissions ethics practice",
    years: "2026",
    area: "Other",
    summary: "Situational-judgment practice for PREview and Casper.",
    body: "A practice platform for pre-medical applicants working through ethical and situational-judgment scenarios, with automated scoring and feedback.",
    stack: ["Web app", "Automated scoring"],
    status: "In development",
    links: [],
    methods: ["language"],
    kinds: ["engineering"],
  },
];

export const projectBySlug = (slug: string) => PROJECTS.find((p) => p.slug === slug);
