// Curated audiophile brand catalog used by onboarding + personalization.
// Featured = primary tiles. Library = expanded grouped list.

export type BrandGroupId =
  | "speakers"
  | "electronics"
  | "headphones"
  | "digital"
  | "analog"
  | "cables";

export const FEATURED_BRANDS: string[] = [
  "KEF",
  "Bowers & Wilkins",
  "Sonus faber",
  "Focal",
  "Klipsch",
  "McIntosh",
  "Luxman",
  "Accuphase",
  "Hegel",
  "Naim",
  "Sennheiser",
  "Audeze",
  "HiFiMAN",
  "Chord Electronics",
  "Rega",
  "AudioQuest",
];

export const BRAND_GROUPS: { id: BrandGroupId; label: string; brands: string[] }[] = [
  {
    id: "speakers",
    label: "Speakers",
    brands: [
      "KEF",
      "Bowers & Wilkins",
      "Sonus faber",
      "Focal",
      "Klipsch",
      "JBL",
      "Wharfedale",
      "Dynaudio",
      "Monitor Audio",
      "MartinLogan",
      "Magnepan",
      "Wilson Audio",
      "Harbeth",
      "Spendor",
      "Revel",
      "PMC",
      "ELAC",
      "Q Acoustics",
      "Paradigm",
      "Triangle",
    ],
  },
  {
    id: "electronics",
    label: "Amplifiers & electronics",
    brands: [
      "McIntosh",
      "Luxman",
      "Accuphase",
      "Hegel",
      "Naim",
      "Krell",
      "Mark Levinson",
      "Pass Labs",
      "Audio Research",
      "Cambridge Audio",
      "NAD",
      "Rotel",
      "Yamaha",
      "Marantz",
      "Denon",
      "PrimaLuna",
      "Parasound",
      "PS Audio",
      "Devialet",
      "Arcam",
    ],
  },
  {
    id: "headphones",
    label: "Headphones & personal audio",
    brands: [
      "Sennheiser",
      "Audeze",
      "Focal",
      "HiFiMAN",
      "Meze Audio",
      "ZMF",
      "Beyerdynamic",
      "Grado",
      "Dan Clark Audio",
      "Audio-Technica",
      "AKG",
      "Sony",
      "Bose",
    ],
  },
  {
    id: "digital",
    label: "DACs, streamers & digital",
    brands: [
      "Chord Electronics",
      "dCS",
      "RME",
      "Schiit",
      "Topping",
      "iFi Audio",
      "WiiM",
      "Eversolo",
      "Bluesound",
      "Aurender",
      "Auralic",
    ],
  },
  {
    id: "analog",
    label: "Analog & vinyl",
    brands: [
      "Rega",
      "Pro-Ject",
      "Technics",
      "Clearaudio",
      "VPI",
      "Linn",
      "Ortofon",
      "MoFi",
    ],
  },
  {
    id: "cables",
    label: "Cables & accessories",
    brands: [
      "AudioQuest",
      "Cardas",
      "Nordost",
      "Kimber Kable",
      "Transparent",
      "Shunyata Research",
      "Furutech",
    ],
  },
];

export const ALL_BRANDS: string[] = Array.from(
  new Set(BRAND_GROUPS.flatMap((g) => g.brands)),
).sort((a, b) => a.localeCompare(b));
