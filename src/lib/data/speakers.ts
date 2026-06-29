import type { CategoryId } from "@/lib/catalog/categories";

export type Speaker = {
  id: string;
  brand: string;
  model: string;
  price: number;
  condition: string;
  type: string;
  passive: boolean;
  tags: string[];
  finish: string;
  roomSize: "Small" | "Medium" | "Large";
  localPickup: boolean;
  verified: boolean;
  image: string;
  gallery: string[];
  description: string;
  // Optional multi-category fields. Legacy speaker entries inherit
  // category="speakers" via the listings index.
  category?: CategoryId;
  subcategory?: string;
  specs: {
    drivers?: string;
    sensitivity?: string;
    impedance?: string | number;
    frequency?: string;
    dimensions?: string;
    weight?: string;
    [key: string]: unknown;
  };
  seller: { name: string; location: string; rating: number };
};

const img = (id: string) =>
  `https://images.unsplash.com/${id}?auto=format&fit=crop&w=1200&q=80`;

export const SPEAKERS: Speaker[] = [
  {
    id: "klh-model-five",
    brand: "KLH",
    model: "Model Five",
    price: 2499,
    condition: "New",
    type: "Floorstanding",
    passive: true,
    tags: ["Warm", "Vintage", "Walnut"],
    finish: "American Walnut",
    roomSize: "Large",
    localPickup: false,
    verified: true,
    image: img("photo-1545454675-3531b543be5d"),
    gallery: [img("photo-1545454675-3531b543be5d"), img("photo-1558137623-ce933996c730")],
    description:
      "A faithful reissue of the legendary three-way acoustic suspension floorstander. Effortless, room-filling sound with a vintage soul.",
    specs: {
      drivers: '10" woofer, 4" mid, 1" tweeter',
      sensitivity: "90.5 dB",
      impedance: "6 Ω",
      frequency: "42 Hz – 20 kHz",
      dimensions: '26.5" × 14" × 11.5"',
      weight: "52 lb",
    },
    seller: { name: "SPKRS Verified", location: "New York, NY", rating: 4.9 },
  },
  {
    id: "kef-ls50-meta",
    brand: "KEF",
    model: "LS50 Meta",
    price: 1599,
    condition: "Open Box",
    type: "Bookshelf",
    passive: true,
    tags: ["Detailed", "Near-field", "Studio"],
    finish: "Carbon Black",
    roomSize: "Small",
    localPickup: true,
    verified: true,
    image: img("photo-1545454675-3531b543be5d"),
    gallery: [img("photo-1558137623-ce933996c730"), img("photo-1545454675-3531b543be5d")],
    description:
      "Uni-Q driver with Metamaterial Absorption Technology. Pinpoint imaging in a compact, room-friendly cabinet.",
    specs: {
      drivers: '5.25" Uni-Q coaxial',
      sensitivity: "85 dB",
      impedance: "8 Ω",
      frequency: "47 Hz – 45 kHz",
      dimensions: '11.9" × 7.9" × 11"',
      weight: "17.2 lb",
    },
    seller: { name: "Audio Atelier", location: "Brooklyn, NY", rating: 4.8 },
  },
  {
    id: "devialet-mania",
    brand: "Devialet",
    model: "Mania",
    price: 990,
    condition: "New",
    type: "Active",
    passive: false,
    tags: ["Wireless", "360°", "Travel"],
    finish: "Deep Black",
    roomSize: "Small",
    localPickup: false,
    verified: true,
    image: img("photo-1558137623-ce933996c730"),
    gallery: [img("photo-1545454675-3531b543be5d")],
    description:
      "Portable hi-fi with stereo 360° sound. Engineered with active acoustic alignment for any room.",
    specs: {
      drivers: "Four full-range, two subwoofers",
      sensitivity: "—",
      impedance: "—",
      frequency: "30 Hz – 20 kHz",
      dimensions: '7.6" × 6.7" × 5.4"',
      weight: "5 lb",
    },
    seller: { name: "Devialet Official", location: "Ships nationwide", rating: 5.0 },
  },
  {
    id: "magico-a1",
    brand: "Magico",
    model: "A1",
    price: 9800,
    condition: "Used — Mint",
    type: "Bookshelf",
    passive: true,
    tags: ["Reference", "Aluminum", "Holographic"],
    finish: "Brushed Aluminum",
    roomSize: "Medium",
    localPickup: true,
    verified: true,
    image: img("photo-1593697821028-7cc59cfd7399"),
    gallery: [img("photo-1545454675-3531b543be5d")],
    description:
      "A sealed two-way reference monitor with an all-aluminum enclosure. State-of-the-art transparency.",
    specs: {
      drivers: '6" graphene mid-bass, 1.1" beryllium dome',
      sensitivity: "85 dB",
      impedance: "4 Ω",
      frequency: "40 Hz – 50 kHz",
      dimensions: '15" × 8" × 11"',
      weight: "35 lb",
    },
    seller: { name: "The Listening Room", location: "Los Angeles, CA", rating: 4.95 },
  },
  {
    id: "buchardt-a500",
    brand: "Buchardt",
    model: "A500",
    price: 4500,
    condition: "New",
    type: "Active",
    passive: false,
    tags: ["DSP", "Wireless", "Room correction"],
    finish: "Smoked Oak",
    roomSize: "Medium",
    localPickup: false,
    verified: true,
    image: img("photo-1545454675-3531b543be5d"),
    gallery: [img("photo-1545454675-3531b543be5d")],
    description:
      "Fully active wireless monitors with onboard DSP and room correction. Plug, calibrate, listen.",
    specs: {
      drivers: '6.5" paper woofer, 0.75" textile dome',
      sensitivity: "—",
      impedance: "—",
      frequency: "27 Hz – 40 kHz",
      dimensions: '14.4" × 7.9" × 10.6"',
      weight: "20.9 lb",
    },
    seller: { name: "Buchardt Audio", location: "Ships from Denmark", rating: 4.9 },
  },
  {
    id: "harbeth-30-3",
    brand: "Harbeth",
    model: "Monitor 30.3",
    price: 6195,
    condition: "Used — Good",
    type: "Bookshelf",
    passive: true,
    tags: ["BBC heritage", "Natural", "Vocal"],
    finish: "Cherry",
    roomSize: "Medium",
    localPickup: true,
    verified: false,
    image: img("photo-1545454675-3531b543be5d"),
    gallery: [img("photo-1558137623-ce933996c730")],
    description:
      "BBC-derived studio monitor. Famously natural midrange, unforced detail, and convincing tonal density.",
    specs: {
      drivers: '8" RADIAL2 mid/bass, 1" tweeter',
      sensitivity: "85 dB",
      impedance: "6 Ω",
      frequency: "50 Hz – 20 kHz",
      dimensions: '18" × 10.6" × 11.2"',
      weight: "25.5 lb",
    },
    seller: { name: "Quentin H.", location: "Austin, TX", rating: 4.7 },
  },
  {
    id: "focal-utopia-iii",
    brand: "Focal",
    model: "Sopra N°2",
    price: 14999,
    condition: "New",
    type: "Floorstanding",
    passive: true,
    tags: ["Dynamic", "Beryllium", "Reference"],
    finish: "Imperial Red",
    roomSize: "Large",
    localPickup: false,
    verified: true,
    image: img("photo-1558137623-ce933996c730"),
    gallery: [img("photo-1545454675-3531b543be5d")],
    description:
      "Three-way floorstander with beryllium inverted dome tweeter. Effortless dynamics and razor-sharp imaging.",
    specs: {
      drivers: 'Dual 7" W woofers, 6.5" W mid, 1.1" Be tweeter',
      sensitivity: "91 dB",
      impedance: "8 Ω",
      frequency: "34 Hz – 40 kHz",
      dimensions: '49.5" × 14" × 22"',
      weight: "121 lb",
    },
    seller: { name: "Focal North America", location: "Ships nationwide", rating: 4.95 },
  },
  {
    id: "genelec-8341a",
    brand: "Genelec",
    model: "8341A SAM",
    price: 4750,
    condition: "Open Box",
    type: "Studio Monitor",
    passive: false,
    tags: ["Coaxial", "DSP", "Studio"],
    finish: "Producer Black",
    roomSize: "Small",
    localPickup: true,
    verified: true,
    image: img("photo-1593697821028-7cc59cfd7399"),
    gallery: [img("photo-1545454675-3531b543be5d")],
    description:
      "Three-way coaxial active monitor with GLM room calibration. The mastering-grade nearfield reference.",
    specs: {
      drivers: '6.5" woofer, coaxial mid + tweeter',
      sensitivity: "—",
      impedance: "—",
      frequency: "38 Hz – 37 kHz",
      dimensions: '11.3" × 7.5" × 8.5"',
      weight: "15.2 lb",
    },
    seller: { name: "SPKRS Verified", location: "Nashville, TN", rating: 4.9 },
  },
  // Additional listings for the same models — power the Compare/market view.
  {
    id: "kef-ls50-meta-2",
    brand: "KEF",
    model: "LS50 Meta",
    price: 1399,
    condition: "Used — Mint",
    type: "Bookshelf",
    passive: true,
    tags: ["Detailed", "Studio", "Pair"],
    finish: "Mineral White",
    roomSize: "Small",
    localPickup: true,
    verified: false,
    image: img("photo-1545454675-3531b543be5d"),
    gallery: [img("photo-1558137623-ce933996c730")],
    description:
      "Lightly used pair from a smoke-free listening room. Original boxes, all accessories included.",
    specs: {
      drivers: '5.25" Uni-Q coaxial',
      sensitivity: "85 dB",
      impedance: "8 Ω",
      frequency: "47 Hz – 45 kHz",
      dimensions: '11.9" × 7.9" × 11"',
      weight: "17.2 lb",
    },
    seller: { name: "Marcus L.", location: "Chicago, IL", rating: 4.6 },
  },
  {
    id: "kef-ls50-meta-3",
    brand: "KEF",
    model: "LS50 Meta",
    price: 1699,
    condition: "New",
    type: "Bookshelf",
    passive: true,
    tags: ["Detailed", "Studio"],
    finish: "Royal Blue",
    roomSize: "Small",
    localPickup: false,
    verified: true,
    image: img("photo-1558137623-ce933996c730"),
    gallery: [img("photo-1545454675-3531b543be5d")],
    description:
      "Sealed factory unit, authorized KEF dealer. Full warranty and free shipping.",
    specs: {
      drivers: '5.25" Uni-Q coaxial',
      sensitivity: "85 dB",
      impedance: "8 Ω",
      frequency: "47 Hz – 45 kHz",
      dimensions: '11.9" × 7.9" × 11"',
      weight: "17.2 lb",
    },
    seller: { name: "HiFi House", location: "Ships nationwide", rating: 4.9 },
  },
  {
    id: "klh-model-five-2",
    brand: "KLH",
    model: "Model Five",
    price: 2199,
    condition: "Used — Good",
    type: "Floorstanding",
    passive: true,
    tags: ["Warm", "Vintage"],
    finish: "West African Mahogany",
    roomSize: "Large",
    localPickup: true,
    verified: false,
    image: img("photo-1545454675-3531b543be5d"),
    gallery: [img("photo-1545454675-3531b543be5d")],
    description:
      "Two years old, well-cared-for pair. Minor scuff on one cabinet edge.",
    specs: {
      drivers: '10" woofer, 4" mid, 1" tweeter',
      sensitivity: "90.5 dB",
      impedance: "6 Ω",
      frequency: "42 Hz – 20 kHz",
      dimensions: '26.5" × 14" × 11.5"',
      weight: "52 lb",
    },
    seller: { name: "Dana R.", location: "Portland, OR", rating: 4.5 },
  },
  {
    id: "genelec-8341a-2",
    brand: "Genelec",
    model: "8341A SAM",
    price: 4499,
    condition: "Used — Mint",
    type: "Studio Monitor",
    passive: false,
    tags: ["Coaxial", "DSP"],
    finish: "Producer Black",
    roomSize: "Small",
    localPickup: true,
    verified: true,
    image: img("photo-1593697821028-7cc59cfd7399"),
    gallery: [img("photo-1545454675-3531b543be5d")],
    description:
      "Studio-used pair, recently calibrated with GLM. Original boxes, pristine drivers.",
    specs: {
      drivers: '6.5" woofer, coaxial mid + tweeter',
      sensitivity: "—",
      impedance: "—",
      frequency: "38 Hz – 37 kHz",
      dimensions: '11.3" × 7.5" × 8.5"',
      weight: "15.2 lb",
    },
    seller: { name: "Eastside Studios", location: "Brooklyn, NY", rating: 4.85 },
  },
];

export const BRANDS = Array.from(new Set(SPEAKERS.map((s) => s.brand))).sort();
export const TYPES: Speaker["type"][] = [
  "Bookshelf",
  "Floorstanding",
  "Active",
  "Studio Monitor",
  "Subwoofer",
];
