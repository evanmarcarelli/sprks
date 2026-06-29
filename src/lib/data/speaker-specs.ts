// Manufacturer-sourced reference specs. Hand-seeded today; a future
// createServerFn will fetch from a real database keyed on brand+model.

export type OfficialSpecs = {
  id: string;
  brand: string;
  model: string;
  type: string;
  impedance: string;
  sensitivity: string;
  frequencyResponse: string;
  powerHandling: string;
  crossover: string;
  dimensions: string;
  weight: string;
  source: string;
};

const k = (brand: string, model: string) =>
  `${brand}__${model}`.toLowerCase().replace(/\s+/g, "-");

export const OFFICIAL_SPECS: OfficialSpecs[] = [
  {
    id: k("KEF", "LS50 Meta"),
    brand: "KEF",
    model: "LS50 Meta",
    type: "Bookshelf, passive",
    impedance: "8 Ω (3.5 Ω min)",
    sensitivity: "85 dB",
    frequencyResponse: "47 Hz – 45 kHz (±3 dB)",
    powerHandling: "40 – 100 W",
    crossover: "2.1 kHz",
    dimensions: "302 × 200 × 281 mm",
    weight: "7.8 kg",
    source: "KEF (manufacturer)",
  },
  {
    id: k("KLH", "Model Five"),
    brand: "KLH",
    model: "Model Five",
    type: "Floorstanding, passive",
    impedance: "6 Ω",
    sensitivity: "90.5 dB",
    frequencyResponse: "42 Hz – 20 kHz",
    powerHandling: "15 – 200 W",
    crossover: "400 Hz / 6 kHz",
    dimensions: "673 × 356 × 292 mm",
    weight: "23.6 kg",
    source: "KLH (manufacturer)",
  },
  {
    id: k("Magico", "A1"),
    brand: "Magico",
    model: "A1",
    type: "Bookshelf, sealed",
    impedance: "4 Ω",
    sensitivity: "85 dB",
    frequencyResponse: "40 Hz – 50 kHz",
    powerHandling: "50 – 200 W",
    crossover: "2.6 kHz",
    dimensions: "381 × 203 × 279 mm",
    weight: "15.9 kg",
    source: "Magico (manufacturer)",
  },
  {
    id: k("Harbeth", "Monitor 30.3"),
    brand: "Harbeth",
    model: "Monitor 30.3",
    type: "Bookshelf, passive",
    impedance: "6 Ω",
    sensitivity: "85 dB",
    frequencyResponse: "50 Hz – 20 kHz",
    powerHandling: "25 – 150 W",
    crossover: "3.1 kHz",
    dimensions: "460 × 277 × 285 mm",
    weight: "11.6 kg",
    source: "Harbeth (manufacturer)",
  },
  {
    id: k("Focal", "Sopra N°2"),
    brand: "Focal",
    model: "Sopra N°2",
    type: "Floorstanding, 3-way",
    impedance: "8 Ω (3.1 Ω min)",
    sensitivity: "91 dB",
    frequencyResponse: "34 Hz – 40 kHz (±3 dB)",
    powerHandling: "40 – 400 W",
    crossover: "250 Hz / 2.2 kHz",
    dimensions: "1256 × 364 × 552 mm",
    weight: "55 kg",
    source: "Focal (manufacturer)",
  },
  {
    id: k("Genelec", "8341A SAM"),
    brand: "Genelec",
    model: "8341A SAM",
    type: "Studio monitor, active 3-way",
    impedance: "—",
    sensitivity: "—",
    frequencyResponse: "38 Hz – 37 kHz (±1.5 dB)",
    powerHandling: "250 W + 150 W + 150 W (built-in)",
    crossover: "500 Hz / 3 kHz",
    dimensions: "287 × 189 × 212 mm",
    weight: "6.9 kg",
    source: "Genelec (manufacturer)",
  },
  {
    id: k("Devialet", "Mania"),
    brand: "Devialet",
    model: "Mania",
    type: "Portable, active 360°",
    impedance: "—",
    sensitivity: "—",
    frequencyResponse: "30 Hz – 20 kHz",
    powerHandling: "Built-in amplification",
    crossover: "DSP-managed",
    dimensions: "193 × 170 × 139 mm",
    weight: "2.3 kg",
    source: "Devialet (manufacturer)",
  },
  {
    id: k("Buchardt", "A500"),
    brand: "Buchardt",
    model: "A500",
    type: "Active wireless, DSP",
    impedance: "—",
    sensitivity: "—",
    frequencyResponse: "27 Hz – 40 kHz",
    powerHandling: "150 W + 150 W (built-in)",
    crossover: "DSP-managed",
    dimensions: "365 × 200 × 270 mm",
    weight: "9.5 kg",
    source: "Buchardt Audio (manufacturer)",
  },
];

export function findOfficialSpecs(brand?: string, model?: string): OfficialSpecs | null {
  if (!brand || !model) return null;
  const key = k(brand, model);
  return OFFICIAL_SPECS.find((s) => s.id === key) ?? null;
}
