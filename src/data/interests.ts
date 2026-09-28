export type GlyphName = "pulse" | "centiles" | "genes" | "network" | "population" | "calibration" | "skin" | "sheets" | "calendar";

export const INTERESTS: { title: string; line: string; glyph: GlyphName }[] = [
  { title: "Physiologic monitoring at home", line: "Heart rate, SpO\u2082 and heart rate variability from home monitors, and what survives when data are stored as trends.", glyph: "pulse" },
  { title: "Individual reference ranges", line: "Centile charts and personal baselines that update as a patient grows or changes treatment.", glyph: "centiles" },
  { title: "Longitudinal biomarkers", line: "Whether a marker tracks autoimmune disease activity within a patient, not only across a population.", glyph: "genes" },
  { title: "Network models of immune disease", line: "Shared biology across skin, joint and gut, and why some drugs work in one and not another.", glyph: "network" },
  { title: "Perinatal population health", line: "Statewide screening, referral and treatment data for quality improvement.", glyph: "population" },
  { title: "Calibrated prediction", line: "Models that report how sure they are and defer to clinicians when they are not.", glyph: "calibration" },
  { title: "Skin signs across skin tones", line: "How image models perform on the rashes that prompt a rheumatology referral.", glyph: "skin" },
  { title: "Clinic operations research", line: "Scheduling and capacity problems in community practices, such as infusion suites.", glyph: "calendar" },
  { title: "Payer data in health economics", line: "What published payer rates reveal about access and prescribing.", glyph: "sheets" },
];
