import { gaussian, mulberry32 } from "./prng";

/** Population reference interval for the synthetic marker (units are synthetic). */
export const POPULATION = { low: 0, high: 8, mean: 3.4, sd: 2.1 };
export const AXIS = { min: 0, max: 14 };

export interface Person {
  id: "a" | "b" | "c";
  label: string;
  note: string;
  visits: number[];
  mean: number;
  sd: number;
  defaultLatest: number;
}

const DEFS = [
  { id: "a" as const, label: "Patient A", note: "Low, steady set point", mu: 1.4, sigma: 0.35, latest: 3.6 },
  { id: "b" as const, label: "Patient B", note: "Higher set point", mu: 5.2, sigma: 0.6, latest: 6.1 },
  { id: "c" as const, label: "Patient C", note: "Naturally variable", mu: 3.8, sigma: 1.5, latest: 7.2 },
];

/** Twelve quarterly visits per synthetic patient, deterministic from the seed. */
export function makePeople(seed = 0x9e11, n = 12): Person[] {
  const z = gaussian(mulberry32(seed));
  return DEFS.map((d) => {
    const visits = Array.from({ length: n }, () => Math.max(0.1, d.mu + d.sigma * z()));
    const mean = visits.reduce((a, b) => a + b, 0) / n;
    const sd = Math.sqrt(visits.reduce((a, b) => a + (b - mean) ** 2, 0) / (n - 1));
    return { id: d.id, label: d.label, note: d.note, visits, mean, sd, defaultLatest: d.latest };
  });
}

export interface Verdict {
  population: "below" | "within" | "above";
  z: number;
  personal: "within" | "above" | "below";
}

export function judge(value: number, p: Person): Verdict {
  const population = value < POPULATION.low ? "below" : value > POPULATION.high ? "above" : "within";
  const z = (value - p.mean) / p.sd;
  const personal = z > 2 ? "above" : z < -2 ? "below" : "within";
  return { population, z, personal };
}

export const normalPdf = (x: number, mu: number, sd: number) =>
  Math.exp(-0.5 * ((x - mu) / sd) ** 2) / (sd * Math.sqrt(2 * Math.PI));
