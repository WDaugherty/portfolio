export const METHODS = [
  { id: "timeseries", label: "Physiologic time series" },
  { id: "baselines", label: "Personal baselines and centiles" },
  { id: "graphs", label: "Graph and network models" },
  { id: "language", label: "Retrieval and language models" },
  { id: "imaging", label: "Medical imaging" },
  { id: "molecular", label: "Molecular modeling" },
  { id: "optimization", label: "Optimization and scheduling" },
  { id: "population", label: "Population and payer data" },
  { id: "infrastructure", label: "Secure data infrastructure" },
] as const;

export type MethodId = (typeof METHODS)[number]["id"];
