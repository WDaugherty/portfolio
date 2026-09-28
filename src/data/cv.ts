/**
 * CV content. Dates come from William's resume; anything marked VERIFY should be checked.
 * POSTERS and PUBLICATIONS render only when they have entries, so nothing appears empty.
 */
export const PROFILE = {
  name: "William Daugherty-Miller",
  position: "Data Specialist, Population Health", // VERIFY title
  affiliation: "Dartmouth Health",
  location: "Keene, New Hampshire",
  email: "wdaughertymiller@gmail.com",
  github: "https://github.com/WDaugherty",
  linkedin: "https://www.linkedin.com/in/williamdaugherty/",
  cvPdf: "./cv.pdf", // add public/cv.pdf before deploying; the link hides itself until CV_PDF_READY is true
  orcid: "", // e.g. https://orcid.org/0000-0000-0000-0000
  scholar: "", // Google Scholar profile URL
};

export const CV_PDF_READY = false;

export const EDUCATION = [
  { degree: "M.Eng., Operations Research and Information Engineering", school: "Cornell University, Cornell Tech", place: "New York, NY", year: "2023" },
  { degree: "B.S., Cheminformatics", school: "Juniata College", place: "Huntingdon, PA", year: "2021" },
];

export const EXPERIENCE = [
  {
    role: "Data Specialist, Population Health", org: "Dartmouth Health", place: "Lebanon, NH", years: "2026 to present", // VERIFY start
    points: [
      "Data infrastructure for statewide perinatal quality programs, including community-facing dashboards for NH DHHS partners.",
    ],
  },
  {
    role: "Program Assistant and Data Analyst", org: "Dartmouth Health", place: "Lebanon, NH", years: "2024 to 2026",
    points: [
      "Data management for perinatal and pediatric population health projects, including Hope Grows at Home and bronchiolitis studies; five manuscripts in preparation.",
      "Chart and SQL extraction, Python analysis pipelines, and co-authoring IRB submissions.",
    ],
  },
  {
    role: "Co-founder", org: "Advanced Care at Home", place: "New Hampshire", years: "2025 to present",
    points: ["Home ICU-grade monitoring for medically complex infants: 500+ children and 100K+ monitored hours."],
  },
  {
    role: "Clinical Care Coordinator", org: "New England Rheumatology and Osteoporosis", place: "Henniker, NH", years: "2025 to present",
    points: ["Clinical documentation and EHR support for patients with autoimmune disease and osteoporosis."],
  },
  {
    role: "Co-founder and CTO", org: "Caddi (AI2 Incubator)", place: "Seattle, WA and New York, NY", years: "2022 to 2024",
    points: ["Built a legal-tech platform with a retrieval-augmented assistant; raised $270K; 10 firms and 30+ attorneys onboarded in year one."],
  },
];

export const RESEARCH_EXPERIENCE = [
  { title: "Molecular dynamics of the di-manganese catalase family", where: "Juniata College", years: "2018 to 2021", detail: "GROMACS and NAMD simulations (CHARMM36), active-site structural comparison, and phylogenetic analysis of 1,000+ BLAST hits." },
  { title: "Neural-network classification of hospital surface samples", where: "Juniata College", years: "2020 to 2021", detail: "Applied machine learning for infection-control research." },
];

export const SKILLS = [
  { area: "Statistics and machine learning", items: "Mixed-effects and survival models, reference centiles, calibration, causal inference, PyTorch, scikit-learn" },
  { area: "Clinical data", items: "Continuous physiologic monitoring, Epic data extraction, SQL, IRB protocols, de-identification" },
  { area: "Optimization", items: "Mixed-integer and stochastic programming, Gurobi, OR-Tools" },
  { area: "Engineering", items: "Python, TypeScript, React, Docker, AWS, secure device telemetry" },
  { area: "Computational chemistry", items: "GROMACS, NAMD, CHARMM36, cheminformatics (SMILES, Tox21)" },
];

export const MANUSCRIPTS = [
  "Information loss when home monitors store averaged trends",
  "Physiologic centile charts for infants at home",
  "Home oxygen weaning from continuous SpO\u2082",
  "Bronchiolitis: saturation patterns before escalation of care",
  "Home nasogastric feeding and desaturation burden",
]; // VERIFY: replace with the real working titles

export const POSTERS: { citation: string }[] = [
  // { citation: "Authors. Title. Conference, City, Month Year." },
];
