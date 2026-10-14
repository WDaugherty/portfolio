import { normal, seeded } from "./random";

/** Synthetic marker: a population reference range, and three patients with their own set points. */
export const POPULATION = { low: 0, high: 8, mean: 3.4, sd: 2.1 };
export const AXIS = { min: 0, max: 14 };

export interface Patient {
  id: string;
  label: string;
  note: string;
  visits: number[];
  mean: number;
  sd: number;
  today: number;
}

const PATIENTS = [
  { id: "a", label: "Patient A", note: "Low, steady set point", mu: 1.4, sigma: 0.35, today: 3.6 },
  { id: "b", label: "Patient B", note: "Runs above the range", mu: 8.6, sigma: 0.45, today: 9.2 },
  { id: "c", label: "Patient C", note: "Naturally variable", mu: 3.8, sigma: 1.5, today: 5.2 },
];

/** Twelve quarterly visits per patient. */
export function makePatients(visitCount = 12): Patient[] {
  const z = normal(seeded(0x9e11));
  return PATIENTS.map(({ mu, sigma, ...p }) => {
    const visits = Array.from({ length: visitCount }, () => Math.max(0.1, mu + sigma * z()));
    const mean = visits.reduce((a, b) => a + b, 0) / visitCount;
    const sd = Math.sqrt(visits.reduce((a, b) => a + (b - mean) ** 2, 0) / (visitCount - 1));
    return { ...p, visits, mean, sd };
  });
}

export type Side = "below" | "within" | "above";

export function compare(value: number, patient: Patient) {
  const population: Side = value < POPULATION.low ? "below" : value > POPULATION.high ? "above" : "within";
  const z = (value - patient.mean) / patient.sd;
  const personal: Side = z > 2 ? "above" : z < -2 ? "below" : "within";
  return { population, personal, z };
}

export const normalDensity = (x: number, mean: number, sd: number) =>
  Math.exp(-0.5 * ((x - mean) / sd) ** 2) / (sd * Math.sqrt(2 * Math.PI));
