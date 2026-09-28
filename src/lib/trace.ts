import { gaussian, mulberry32 } from "./prng";

export interface Trace {
  n: number;
  hr: Float32Array;
  hrLo: Float32Array;
  hrHi: Float32Array;
  spo2: Float32Array;
  spLo: Float32Array;
  spHi: Float32Array;
  /** First and last index where the infant is outside their own baseline band. */
  event: [number, number];
}

function smooth3(x: Float32Array) {
  const y = new Float32Array(x.length);
  for (let i = 0; i < x.length; i++) {
    y[i] = (x[Math.max(0, i - 1)] + x[i] + x[Math.min(x.length - 1, i + 1)]) / 3;
  }
  return y;
}

/**
 * A synthetic 4-minute home-monitor trend at 1 Hz: heart rate and SpO2 with a
 * personal 10th–90th centile band and one coupled bradycardia/desaturation.
 * No patient data: every value comes from the seed.
 */
export function makeTrace(seed = 0x5e1a, n = 240): Trace {
  const z = gaussian(mulberry32(seed));
  const hr = new Float32Array(n), sp = new Float32Array(n);
  const hrLo = new Float32Array(n), hrHi = new Float32Array(n), spLo = new Float32Array(n), spHi = new Float32Array(n);
  for (let t = 0; t < n; t++) {
    const base = 150 + 6 * Math.sin(t / 38) + 3 * Math.sin(t / 13);
    hr[t] = base + 2.2 * z();
    sp[t] = 96.3 + 0.6 * Math.sin(t / 21) + 0.35 * z();
    hrLo[t] = base - 13;
    hrHi[t] = base + 13;
    spLo[t] = 93.2 + 0.5 * Math.sin(t / 21);
    spHi[t] = 99;
  }
  const hrS = smooth3(hr), spS = smooth3(sp);
  const dip = [0, -12, -28, -44, -52, -55, -54, -50, -44, -34, -24, -15, -8, -4, -2, -1];
  const des = [0, -0.5, -1.5, -3, -5, -7.5, -9.5, -10.5, -10.5, -9.5, -7.5, -5.5, -3.5, -2, -1, -0.5, -0.2, 0];
  const at = Math.round((n * 2) / 3);
  dip.forEach((d, i) => (hrS[at + i] += d));
  des.forEach((d, i) => (spS[at + i] = Math.min(100, spS[at + i] + d)));

  let first = -1, last = -1;
  for (let t = 0; t < n; t++) {
    if (hrS[t] < hrLo[t] || spS[t] < spLo[t]) {
      if (first < 0) first = t;
      last = t;
    }
  }
  return { n, hr: hrS, hrLo, hrHi, spo2: spS, spLo, spHi, event: [first, last] };
}
