/**
 * Everything about William that appears on the site. Lines marked VERIFY need confirming before launch.
 * Optional entries (ORCID, Scholar, CV PDF, posters) appear on the site only once they are filled in.
 */
export const PROFILE = {
  name: "William Daugherty-Miller",
  position: "Data Specialist, Population Health", // VERIFY title
  affiliation: "Dartmouth Health",
  location: "Keene, New Hampshire",
  email: "wdaughertymiller@gmail.com",
  github: "https://github.com/WDaugherty",
  linkedin: "https://www.linkedin.com/in/williamdaugherty/",
  orcid: "",
  scholar: "",
  cvPdf: "", // e.g. "./cv.pdf" after adding public/cv.pdf
};

export const EDUCATION = [
  {
    degree: "M.Eng., Operations Research and Information Engineering",
    school: "Cornell Tech, Cornell University",
    place: "New York, NY",
    year: "2023",
  },
  { degree: "B.S., Cheminformatics", school: "Juniata College", place: "Huntingdon, PA", year: "2021" },
];

export const EXPERIENCE = [
  {
    role: "Data Specialist, Population Health",
    org: "Dartmouth Health",
    place: "Lebanon, NH",
    years: "2026 to present", // VERIFY start date
    points: [
      "Data infrastructure for statewide perinatal quality programs, including dashboards for NH DHHS partners.",
    ],
  },
  {
    role: "Co-founder",
    org: "Advanced Care at Home",
    place: "New Hampshire",
    years: "2025 to present",
    points: ["Home monitoring for medically complex infants: 500+ children and 100,000+ monitored hours."],
  },
  {
    role: "Clinical Care Coordinator",
    org: "New England Rheumatology and Osteoporosis",
    place: "Henniker, NH",
    years: "2025 to present",
    points: ["Clinical documentation and EHR support for patients with autoimmune disease and osteoporosis."],
  },
  {
    role: "Program Assistant and Data Analyst",
    org: "Dartmouth Health",
    place: "Lebanon, NH",
    years: "2024 to 2026",
    points: [
      "Data management for perinatal and pediatric projects, including Hope Grows at Home and bronchiolitis studies.",
      "EHR and SQL extraction, Python analysis pipelines, and co-authoring IRB submissions.",
    ],
  },
  {
    role: "Co-founder and CTO",
    org: "Caddi, AI2 Incubator",
    place: "Seattle, WA and New York, NY",
    years: "2022 to 2024",
    points: [
      "Legal-tech platform with a retrieval-based assistant. Raised $270K; 10 firms onboarded in the first year.",
    ],
  },
];

export const RESEARCH_EXPERIENCE = [
  {
    title: "Molecular dynamics of the di-manganese catalase family",
    where: "Juniata College",
    years: "2018 to 2021",
    detail: "GROMACS and NAMD simulations (CHARMM36), active-site comparison, and a phylogeny of 1,000+ BLAST hits.",
  },
  {
    title: "Neural-network classification of hospital surface samples",
    where: "Juniata College",
    years: "2020 to 2021",
    detail: "Machine learning for infection-control research.",
  },
];

export const SKILLS = [
  { area: "Statistics", items: "Mixed-effects and survival models, reference centiles, calibration, causal inference" },
  { area: "Machine learning", items: "PyTorch, scikit-learn, conformal prediction, graph models" },
  { area: "Clinical data", items: "Continuous physiologic monitoring, Epic extraction, SQL, IRB protocols" },
  { area: "Optimization", items: "Mixed-integer and stochastic programming, Gurobi, OR-Tools" },
  { area: "Engineering", items: "Python, TypeScript, React, Docker, AWS, device telemetry" },
  { area: "Computational chemistry", items: "GROMACS, NAMD, CHARMM36, SMILES" },
];

/** VERIFY: replace with the real working titles. The first word of each is used as its short name on the home page. */
export const MANUSCRIPTS = [
  { short: "Trends", title: "Information loss when home monitors store averaged trends" },
  { short: "Centiles", title: "Physiologic centile charts for infants at home" },
  { short: "Oxygen", title: "Home oxygen weaning from continuous SpO₂" },
  { short: "Bronchiolitis", title: "Saturation patterns before escalation of care in bronchiolitis" },
  { short: "Feeding", title: "Home nasogastric feeding and desaturation burden" },
];

export const POSTERS: string[] = [
  // "Authors. Title. Conference, City, Month Year.",
];

export const NEWS = [
  { when: "Oct 2026", what: "Five neonatal manuscripts in preparation with Dartmouth Health colleagues." },
  { when: "Sep 2026", what: "Drafted study designs in rheumatology, dermatology and immunology." },
  { when: "2026", what: "Began as Data Specialist, Population Health, at Dartmouth Health." },
  { when: "Jun 2025", what: "Joined New England Rheumatology and Osteoporosis as clinical care coordinator." },
  { when: "2025", what: "Co-founded Advanced Care at Home." },
];
