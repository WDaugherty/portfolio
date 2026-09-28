import type { MethodId } from "./methods";

export type SpecArea = "Rheumatology" | "Dermatology" | "Immunology" | "Practice operations";

export interface Spec {
  slug: string;
  name: string;
  areas: SpecArea[];
  line: string;
  problem: string;
  does: string;
  firstRelease: string[];
  data: string;
  stack: string;
  validation: string;
  weeks: number;
  methods: MethodId[];
}

export const SPECS: Spec[] = [
  {
    slug: "cadence",
    name: "Cadence",
    areas: ["Rheumatology"],
    line: "Disease-activity scores as a tested library in Python and TypeScript.",
    problem: "CDAI, DAS28 and SLEDAI live in spreadsheets, EHR templates and one-off calculators. Formula variants are easy to get wrong and nothing is versioned.",
    does: "One definition per score, compiled to both languages, with category cut-offs, input validation and FHIR Observation output.",
    firstRelease: [
      "CDAI, SDAI, DAS28-ESR, DAS28-CRP and RAPID3",
      "SLEDAI-2K, BASDAI and ASDAS-CRP",
      "20+ worked examples per score from the defining papers, run as tests",
      "Property tests: bounded, monotonic, rejects impossible inputs",
      "A one-page calculator built on the TypeScript package",
    ],
    data: "None; reference cases come from the publications that define each score.",
    stack: "YAML score schema, generated Python and TypeScript, Hypothesis and fast-check.",
    validation: "A practice checks 50 historical scores against its EHR values, without data leaving the practice.",
    weeks: 2,
    methods: [],
  },
  {
    slug: "erosio",
    name: "Erosio",
    areas: ["Rheumatology"],
    line: "RA radiograph scoring that hands its uncertain joints to a human.",
    problem: "Sharp–van der Heijde scoring is slow and needs trained readers. The RA2-DREAM Challenge ranked models on error alone, with no way to tell which predictions to trust.",
    does: "Localizes scored joints on hand and foot films, predicts erosion and narrowing per joint, and attaches a conformal interval to each; wide intervals go to a reader.",
    firstRelease: [
      "Web viewer with pan, zoom, window and level, and joint overlays",
      "Per-joint model trained on RA2-DREAM",
      "Split-conformal intervals from a held-out fold",
      "Selective-prediction curve: error against joints deferred",
      "CSV export of scores and reader overrides",
    ],
    data: "RA2-DREAM radiographs on Synapse (674 sets, 562 patients); access to be confirmed first.",
    stack: "PyTorch and timm, FastAPI, a React canvas viewer.",
    validation: "Weighted RMSE against published challenge results; interval coverage at 80% and 90%.",
    weeks: 6,
    methods: ["imaging", "baselines"],
  },
  {
    slug: "holdout",
    name: "Holdout",
    areas: ["Rheumatology", "Immunology"],
    line: "Re-tests published RA and lupus gene signatures on cohorts they never saw.",
    problem: "GEO papers report near-perfect accuracy for small gene panels, usually RA against healthy tissue, often validated on data from the same lab.",
    does: "Scores each signature on held-out cohorts for clinically real contrasts, against 1,000 random gene sets of the same size, and flags training–test leakage.",
    firstRelease: [
      "Harmonized store of 8–12 GEO and ArrayExpress cohorts",
      "Signature intake from YAML with the source DOI",
      "Random-signature null distribution per signature",
      "Leakage detector for shared samples or submitters",
      "Static leaderboard rebuilt in CI",
    ],
    data: "GEO and ArrayExpress, for example GSE89408, GSE55457 and E-MTAB-6141.",
    stack: "Python, Polars, scikit-learn, GEOparse, a static site.",
    validation: "Reproduce each paper's own AUC on its own data before testing elsewhere.",
    weeks: 4,
    methods: ["baselines"],
  },
  {
    slug: "centile",
    name: "Centile",
    areas: ["Immunology", "Rheumatology"],
    line: "One reference-centile engine for infant physiology, immune cells and bone.",
    problem: "Every specialty rebuilds growth-chart-style references by hand. Nothing fits, versions and serves centiles with uncertainty.",
    does: "Fits centile curves against age, scores new values to a centile and z-score, and estimates an \u201cage gap\u201d with the standard bias correction.",
    firstRelease: [
      "GAMLSS-style fitting with cross-validated knots",
      "Versioned reference tables with data cards",
      "Scoring API and a TypeScript centile-chart client",
      "Immune cell and cytokine centiles from the 10,000 Immunomes Project",
    ],
    data: "10,000 Immunomes Project (10,000+ healthy subjects from ImmPort); a public neonatal dataset once its license is confirmed.",
    stack: "Python (or pinned R gamlss), FastAPI, TypeScript.",
    validation: "Reproduce published age and sex trends; share of held-out values under each centile.",
    weeks: 4,
    methods: ["baselines", "timeseries"],
  },
  {
    slug: "proxima",
    name: "Proxima",
    areas: ["Rheumatology", "Dermatology", "Immunology"],
    line: "Network distance between drug targets and disease modules in skin, joint and gut.",
    problem: "IL-17 blockade works in psoriasis and spondyloarthritis but worsened Crohn's disease; IL-23 blockade works in skin, joint and gut but failed in axial spondyloarthritis. No simple rule explains the pattern.",
    does: "Builds disease modules on a tissue-weighted interactome, computes target-to-module proximity against degree-matched random targets, and tests it on known trial outcomes.",
    firstRelease: [
      "Modules for psoriasis, PsA, axial SpA, Crohn's, ulcerative colitis and RA",
      "STRING interactome weighted by GTEx tissue expression",
      "Ground-truth table of 20+ drug–disease trial outcomes",
      "Leave-one-drug-out evaluation",
      "Explorer: one target against every disease and tissue",
    ],
    data: "GWAS Catalog, STRING, GTEx and ClinicalTrials.gov.",
    stack: "Python with NetworkX or graph-tool, static JSON, a React and D3 explorer.",
    validation: "Does proximity rank the held-out trial correctly? A negative result gets reported too.",
    weeks: 4,
    methods: ["graphs"],
  },
  {
    slug: "b27scan",
    name: "B27scan",
    areas: ["Immunology", "Rheumatology"],
    line: "Finds the spondyloarthritis TRBV9 T-cell receptor motif in any repertoire.",
    problem: "A CD8+ TRBV9 motif is tied to ankylosing spondylitis, PsA and uveitis, and depleting TRBV9+ cells gave one patient a lasting remission. No open tool measures how much of it a person carries.",
    does: "Reads AIRR repertoires, builds a TCRdist-style neighbor graph around the motif, and reports motif burden per sample.",
    firstRelease: [
      "AIRR and immuneACCESS readers",
      "Versioned motif definition with a distance radius",
      "Neighbor graph and per-sample burden report",
      "Reproduction on the case report's published repertoires",
    ],
    data: "The case report's repertoires on figshare; HLA-typed public cohorts on immuneACCESS, to be confirmed.",
    stack: "Rust core for the distance search, Python wrapper, Polars reports.",
    validation: "Burden in HLA-B27-positive against negative healthy donors, reported either way.",
    weeks: 3,
    methods: ["graphs", "molecular"],
  },
  {
    slug: "malar",
    name: "Malar",
    areas: ["Dermatology", "Rheumatology"],
    line: "How dermatology image models do on rheumatology skin signs, by skin tone.",
    problem: "Dermatology AI benchmarks center on melanoma, and models trained on Fitzpatrick17k lost 30–40% accuracy on darker skin in DDI. Lupus rashes, dermatomyositis, psoriatic nails and vasculitis go unreported.",
    does: "Maps public datasets to 8 rheumatology-relevant condition groups and reports accuracy, calibration and referral sensitivity by skin-tone group for any model.",
    firstRelease: [
      "Clinician-reviewed condition map",
      "Harness that accepts any model with a predict function",
      "Two foundation-model baselines and a fine-tuned ResNet",
      "Results by skin-tone group with confidence intervals",
      "Label-noise audit on 200 images",
    ],
    data: "Fitzpatrick17k, SCIN and DDI, downloaded by the harness rather than rehosted.",
    stack: "PyTorch, open_clip, a static results page.",
    validation: "Reproduce the published DDI skin-tone gap before adding conditions.",
    weeks: 3,
    methods: ["imaging"],
  },
  {
    slug: "crossover",
    name: "Crossover",
    areas: ["Dermatology", "Rheumatology"],
    line: "Which people with psoriasis will develop psoriatic arthritis.",
    problem: "Many people with psoriasis develop PsA years later, and joint damage can start before referral. Dermatologists have no validated tool for whom to refer.",
    does: "Combines a PsA-specific genetic score with nail, scalp and inverse psoriasis, body surface area and family history into a calibrated 5-year risk.",
    firstRelease: [
      "Genetic score from PsA summary statistics (LDpred2 or PRS-CS)",
      "Clinical model from published risk factors",
      "Time-to-event validation plan in All of Us",
      "Calibration plot and decision curve at a referral threshold",
    ],
    data: "Public GWAS summary statistics; All of Us for validation under an institutional agreement.",
    stack: "Python and R inside the All of Us workbench; TypeScript calculator.",
    validation: "C-statistic and calibration slope, genetic against clinical-only.",
    weeks: 6,
    methods: ["baselines", "population"],
  },
  {
    slug: "titer",
    name: "Titer",
    areas: ["Rheumatology", "Practice operations"],
    line: "Triage for ANA-positive referrals.",
    problem: "Positive-ANA referrals fill community rheumatology schedules, and most do not have a connective tissue disease. Triage depends on whoever reads the referral.",
    does: "Takes titer, pattern, ENA, dsDNA, complement, symptoms and referral source, and returns a risk estimate, its drivers and a scheduling tier.",
    firstRelease: [
      "Open pipeline on a synthetic referral generator",
      "IRB determination before any chart is touched",
      "Model trained inside the practice on de-identified referrals",
      "Decision curve: visits that could safely wait at a fixed miss rate",
    ],
    data: "Synthetic in public; practice EHR under IRB, never leaving the practice.",
    stack: "Python, LightGBM, a local-only interface.",
    validation: "Temporal split; calibration by referral source.",
    weeks: 4,
    methods: ["graphs"],
  },
  {
    slug: "chairside",
    name: "Chairside",
    areas: ["Practice operations", "Rheumatology"],
    line: "An infusion suite scheduler that plans around authorization delays.",
    problem: "Office infusion suites are scheduled by hand. Visits run 30 minutes to several hours, nurses cap simultaneous starts, and a late authorization leaves a chair empty.",
    does: "Builds a weekly schedule maximizing chair use and minimizing waits under nurse and pharmacy limits, and re-plans when a request changes.",
    firstRelease: [
      "CP-SAT model with chair and nurse-start constraints",
      "Scenario sampling for uncertain infusion durations",
      "Synthetic week generator from label infusion times",
      "Calendar view with drag-to-adjust",
    ],
    data: "Synthetic in public; historical schedules replayed only inside the practice.",
    stack: "Python with OR-Tools (Gurobi optional), FastAPI, React.",
    validation: "Utilization, wait and overtime against historical weeks.",
    weeks: 4,
    methods: ["optimization"],
  },
];

export const specBySlug = (slug: string) => SPECS.find((s) => s.slug === slug);
