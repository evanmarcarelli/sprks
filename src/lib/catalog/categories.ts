// Single source of truth for the SPKRS hi-fi category framework.
// Every category-aware surface (Marketplace chips, filters, cards,
// compare, listing wizard) reads from this file.

import {
  Speaker as SpeakerIcon,
  Zap,
  Sliders,
  Binary,
  Radio,
  Disc3,
  Plug,
  Cable,
  Headphones,
  Boxes,
  type LucideIcon,
} from "lucide-react";

export type CategoryId =
  | "speakers"
  | "amplifiers"
  | "preamps"
  | "dacs"
  | "streamers"
  | "transports"
  | "power"
  | "cables"
  | "headphones"
  | "accessories";

export type FilterFieldDef =
  | { kind: "chips"; key: string; label: string; options: string[] }
  | { kind: "toggle"; key: string; label: string }
  | { kind: "range"; key: string; label: string; min: number; max: number; step: number; unit?: string };

export type ListingFieldDef = {
  key: string;
  label: string;
  kind: "text" | "number" | "select" | "multi" | "toggle";
  options?: string[];
  hint?: string;
  placeholder?: string;
};

export type Category = {
  id: CategoryId;
  label: string;
  shortLabel: string;
  icon: LucideIcon;
  subcategories: string[];
  filterSchema: FilterFieldDef[];
  listingSchema: ListingFieldDef[];
  cardMeta: (item: { specs?: Record<string, any> } & Record<string, any>) => string[];
  compareKeys: { key: string; label: string }[];
  searchKeywords: string[];
};

const condition = (k = "condition"): FilterFieldDef => ({
  kind: "chips",
  key: k,
  label: "Condition",
  options: ["New", "Open Box", "Used — Mint", "Used — Good"],
});

export const CATEGORIES: Category[] = [
  {
    id: "speakers",
    label: "Speakers",
    shortLabel: "Speakers",
    icon: SpeakerIcon,
    subcategories: [
      "Bookshelf", "Floorstanding", "Standmount", "Active", "Passive",
      "Subwoofer", "Center Channel", "Surround", "Studio Monitor", "Outdoor",
    ],
    filterSchema: [
      condition(),
      { kind: "chips", key: "subcategory", label: "Speaker type", options: ["Bookshelf","Floorstanding","Active","Passive","Subwoofer","Studio Monitor"] },
      { kind: "chips", key: "roomSize", label: "Room fit", options: ["Small","Medium","Large"] },
      { kind: "toggle", key: "passiveOnly", label: "Passive only" },
    ],
    listingSchema: [
      { key: "format", label: "Format", kind: "select", options: ["Passive","Active / Powered"] },
      { key: "subcategory", label: "Speaker type", kind: "select", options: ["Bookshelf","Floorstanding","Standmount","Subwoofer","Center Channel","Surround","Studio Monitor","Outdoor"] },
      { key: "finish", label: "Finish / colour", kind: "text", placeholder: "American Walnut" },
      { key: "sensitivity", label: "Sensitivity", kind: "text", placeholder: "88 dB" },
      { key: "impedance", label: "Impedance", kind: "text", placeholder: "6 Ω" },
      { key: "dimensions", label: "Dimensions", kind: "text" },
      { key: "weight", label: "Weight", kind: "text" },
      { key: "pairingNotes", label: "Amp pairing notes", kind: "text", hint: "Optional, loved by buyers." },
    ],
    cardMeta: (s) => [s.subcategory ?? s.type, s.finish].filter(Boolean),
    compareKeys: [
      { key: "type", label: "Type" }, { key: "finish", label: "Finish" },
      { key: "specs.sensitivity", label: "Sensitivity" }, { key: "specs.impedance", label: "Impedance" },
      { key: "specs.frequency", label: "Frequency" }, { key: "specs.dimensions", label: "Dimensions" },
    ],
    searchKeywords: ["speaker","bookshelf","floorstanding","monitor","subwoofer","passive","active"],
  },
  {
    id: "amplifiers",
    label: "Amplifiers",
    shortLabel: "Amps",
    icon: Zap,
    subcategories: ["Integrated","Power","Stereo","Mono Block","Tube","Solid State","Hybrid","Headphone Amp"],
    filterSchema: [
      condition(),
      { kind: "chips", key: "subcategory", label: "Amp type", options: ["Integrated","Power","Mono Block","Tube","Solid State","Hybrid","Headphone Amp"] },
      { kind: "range", key: "wattage", label: "Wattage (W/ch)", min: 5, max: 600, step: 5, unit: "W" },
    ],
    listingSchema: [
      { key: "subcategory", label: "Amp type", kind: "select", options: ["Integrated","Power","Mono Block","Tube","Solid State","Hybrid","Headphone Amp"] },
      { key: "topology", label: "Topology", kind: "select", options: ["Tube","Solid State","Hybrid","Class D"] },
      { key: "wattage", label: "Power (W/ch)", kind: "number" },
      { key: "inputs", label: "Inputs", kind: "text", placeholder: "RCA × 3, XLR × 1" },
      { key: "balanced", label: "Balanced inputs", kind: "toggle" },
    ],
    cardMeta: (s) => [s.subcategory, s.specs?.topology, s.specs?.wattage ? `${s.specs.wattage}W` : null].filter(Boolean),
    compareKeys: [
      { key: "subcategory", label: "Type" }, { key: "specs.topology", label: "Topology" },
      { key: "specs.wattage", label: "Power" }, { key: "specs.inputs", label: "Inputs" },
    ],
    searchKeywords: ["amp","amplifier","integrated","tube","mcintosh","mono","class d","watts"],
  },
  {
    id: "preamps",
    label: "Pre-Amplifiers",
    shortLabel: "Preamps",
    icon: Sliders,
    subcategories: ["Tube Preamp","Solid State Preamp","Phono Preamp","Line Stage"],
    filterSchema: [
      condition(),
      { kind: "chips", key: "subcategory", label: "Preamp type", options: ["Tube Preamp","Solid State Preamp","Phono Preamp","Line Stage"] },
      { kind: "toggle", key: "phono", label: "Phono stage" },
      { kind: "toggle", key: "balanced", label: "Balanced support" },
    ],
    listingSchema: [
      { key: "subcategory", label: "Preamp type", kind: "select", options: ["Tube Preamp","Solid State Preamp","Phono Preamp","Line Stage"] },
      { key: "phono", label: "Phono stage included", kind: "toggle" },
      { key: "balanced", label: "Balanced (XLR)", kind: "toggle" },
      { key: "remote", label: "Includes remote", kind: "toggle" },
    ],
    cardMeta: (s) => [s.subcategory, s.specs?.phono ? "Phono" : null].filter(Boolean),
    compareKeys: [
      { key: "subcategory", label: "Type" }, { key: "specs.phono", label: "Phono" }, { key: "specs.balanced", label: "Balanced" },
    ],
    searchKeywords: ["preamp","pre-amp","phono","line stage","tube preamp"],
  },
  {
    id: "dacs",
    label: "DA Converters",
    shortLabel: "DACs",
    icon: Binary,
    subcategories: ["DAC","DAC/Amp Combo","Portable DAC","Desktop DAC"],
    filterSchema: [
      condition(),
      { kind: "chips", key: "subcategory", label: "DAC type", options: ["DAC","DAC/Amp Combo","Portable DAC","Desktop DAC"] },
      { kind: "chips", key: "inputs", label: "Inputs", options: ["USB","Coax","Optical","I2S","AES/EBU"] },
    ],
    listingSchema: [
      { key: "subcategory", label: "DAC type", kind: "select", options: ["DAC","DAC/Amp Combo","Portable DAC","Desktop DAC"] },
      { key: "chip", label: "DAC chip", kind: "text", placeholder: "ESS ES9038PRO" },
      { key: "inputs", label: "Inputs", kind: "multi", options: ["USB","Coax","Optical","I2S","AES/EBU"] },
      { key: "outputs", label: "Outputs", kind: "multi", options: ["RCA","XLR","6.35mm","4.4mm"] },
      { key: "maxResolution", label: "Max resolution", kind: "text", placeholder: "32/768, DSD512" },
    ],
    cardMeta: (s) => [s.subcategory, s.specs?.chip].filter(Boolean),
    compareKeys: [
      { key: "subcategory", label: "Type" }, { key: "specs.chip", label: "Chip" },
      { key: "specs.maxResolution", label: "Max res" },
    ],
    searchKeywords: ["dac","converter","ess","sabre","akm","r2r","chord"],
  },
  {
    id: "streamers",
    label: "Streamers",
    shortLabel: "Streamers",
    icon: Radio,
    subcategories: ["Network Streamer","Streaming DAC","All-in-One","Wireless Streamer"],
    filterSchema: [
      condition(),
      { kind: "chips", key: "subcategory", label: "Streamer type", options: ["Network Streamer","Streaming DAC","All-in-One","Wireless Streamer"] },
      { kind: "chips", key: "services", label: "Services", options: ["Roon","Tidal","Qobuz","Spotify","AirPlay 2","Chromecast"] },
    ],
    listingSchema: [
      { key: "subcategory", label: "Streamer type", kind: "select", options: ["Network Streamer","Streaming DAC","All-in-One","Wireless Streamer"] },
      { key: "services", label: "Supported services", kind: "multi", options: ["Roon","Tidal","Qobuz","Spotify","AirPlay 2","Chromecast"] },
      { key: "dacIncluded", label: "DAC included", kind: "toggle" },
      { key: "wired", label: "Wired (Ethernet)", kind: "toggle" },
    ],
    cardMeta: (s) => [s.subcategory, s.specs?.dacIncluded ? "DAC built-in" : null].filter(Boolean),
    compareKeys: [
      { key: "subcategory", label: "Type" }, { key: "specs.services", label: "Services" },
      { key: "specs.dacIncluded", label: "DAC" },
    ],
    searchKeywords: ["streamer","roon","tidal","qobuz","node","aurender","airplay"],
  },
  {
    id: "transports",
    label: "Transports",
    shortLabel: "Transports",
    icon: Disc3,
    subcategories: ["CD Transport","Digital Transport","Network Transport"],
    filterSchema: [
      condition(),
      { kind: "chips", key: "subcategory", label: "Transport type", options: ["CD Transport","Digital Transport","Network Transport"] },
    ],
    listingSchema: [
      { key: "subcategory", label: "Transport type", kind: "select", options: ["CD Transport","Digital Transport","Network Transport"] },
      { key: "media", label: "Media", kind: "select", options: ["CD","SACD","CD/SACD","File-based"] },
      { key: "outputs", label: "Digital outputs", kind: "multi", options: ["Coax","Optical","AES/EBU","I2S","USB"] },
    ],
    cardMeta: (s) => [s.subcategory, s.specs?.media].filter(Boolean),
    compareKeys: [
      { key: "subcategory", label: "Type" }, { key: "specs.media", label: "Media" },
      { key: "specs.outputs", label: "Outputs" },
    ],
    searchKeywords: ["transport","cd","sacd","spinner"],
  },
  {
    id: "power",
    label: "Power Conditioning",
    shortLabel: "Power",
    icon: Plug,
    subcategories: ["Power Conditioner","Power Regenerator","Isolation Unit","Surge / Protection"],
    filterSchema: [
      condition(),
      { kind: "chips", key: "subcategory", label: "Type", options: ["Power Conditioner","Power Regenerator","Isolation Unit","Surge / Protection"] },
      { kind: "range", key: "outlets", label: "Outlets", min: 2, max: 20, step: 1 },
    ],
    listingSchema: [
      { key: "subcategory", label: "Type", kind: "select", options: ["Power Conditioner","Power Regenerator","Isolation Unit","Surge / Protection"] },
      { key: "outlets", label: "Outlet count", kind: "number" },
      { key: "voltage", label: "Voltage", kind: "select", options: ["120V","230V","Universal"] },
    ],
    cardMeta: (s) => [s.subcategory, s.specs?.outlets ? `${s.specs.outlets} outlets` : null].filter(Boolean),
    compareKeys: [
      { key: "subcategory", label: "Type" }, { key: "specs.outlets", label: "Outlets" }, { key: "specs.voltage", label: "Voltage" },
    ],
    searchKeywords: ["power","conditioner","regenerator","isolation","surge","ps audio","torus"],
  },
  {
    id: "cables",
    label: "Cables",
    shortLabel: "Cables",
    icon: Cable,
    subcategories: ["Speaker Cables","Interconnects","XLR","RCA","USB Audio","Ethernet Audio","Power Cables","Headphone Cables"],
    filterSchema: [
      condition(),
      { kind: "chips", key: "subcategory", label: "Cable type", options: ["Speaker Cables","Interconnects","XLR","RCA","USB Audio","Ethernet Audio","Power Cables","Headphone Cables"] },
      { kind: "range", key: "length", label: "Length (ft)", min: 1, max: 25, step: 1, unit: "ft" },
      { kind: "toggle", key: "pair", label: "Pair / matched set" },
    ],
    listingSchema: [
      { key: "subcategory", label: "Cable type", kind: "select", options: ["Speaker Cables","Interconnects","XLR","RCA","USB Audio","Ethernet Audio","Power Cables","Headphone Cables"] },
      { key: "length", label: "Length (ft)", kind: "number" },
      { key: "termination", label: "Termination", kind: "text", placeholder: "Spade / Banana, WBT" },
      { key: "pair", label: "Sold as a pair", kind: "toggle" },
      { key: "material", label: "Conductor / material", kind: "text", placeholder: "OCC copper, silver-plated" },
    ],
    cardMeta: (s) => [s.subcategory, s.specs?.length ? `${s.specs.length} ft` : null, s.specs?.pair ? "Pair" : null].filter(Boolean),
    compareKeys: [
      { key: "subcategory", label: "Type" }, { key: "specs.length", label: "Length" },
      { key: "specs.termination", label: "Termination" }, { key: "specs.material", label: "Material" },
    ],
    searchKeywords: ["cable","xlr","rca","interconnect","speaker cable","usb","ethernet","power cable","audioquest","kimber","nordost"],
  },
  {
    id: "headphones",
    label: "Headphones",
    shortLabel: "Headphones",
    icon: Headphones,
    subcategories: ["Over-Ear","On-Ear","Open-Back","Closed-Back","IEM","Planar Magnetic","Dynamic","Wireless Audiophile"],
    filterSchema: [
      condition(),
      { kind: "chips", key: "subcategory", label: "Type", options: ["Over-Ear","On-Ear","IEM"] },
      { kind: "chips", key: "back", label: "Back", options: ["Open-Back","Closed-Back"] },
      { kind: "chips", key: "driver", label: "Driver", options: ["Planar Magnetic","Dynamic","Electrostatic","Balanced Armature"] },
      { kind: "toggle", key: "wireless", label: "Wireless" },
    ],
    listingSchema: [
      { key: "subcategory", label: "Form factor", kind: "select", options: ["Over-Ear","On-Ear","IEM"] },
      { key: "back", label: "Back", kind: "select", options: ["Open-Back","Closed-Back"] },
      { key: "driver", label: "Driver", kind: "select", options: ["Planar Magnetic","Dynamic","Electrostatic","Balanced Armature"] },
      { key: "impedance", label: "Impedance (Ω)", kind: "number" },
      { key: "wireless", label: "Wireless", kind: "toggle" },
      { key: "cable", label: "Stock cable included", kind: "toggle" },
    ],
    cardMeta: (s) => [s.specs?.back, s.specs?.driver].filter(Boolean),
    compareKeys: [
      { key: "specs.back", label: "Back" }, { key: "specs.driver", label: "Driver" },
      { key: "specs.impedance", label: "Impedance" }, { key: "specs.wireless", label: "Wireless" },
    ],
    searchKeywords: ["headphone","open back","closed back","iem","planar","focal","sennheiser","hifiman","audeze"],
  },
  {
    id: "accessories",
    label: "Accessories",
    shortLabel: "Accessories",
    icon: Boxes,
    subcategories: ["Stands","Isolation Feet","Racks","Acoustic Panels","Remote Controls","Replacement Parts","Carry Cases","Cleaning / Care","Turntable Accessories"],
    filterSchema: [
      condition(),
      { kind: "chips", key: "subcategory", label: "Accessory", options: ["Stands","Isolation Feet","Racks","Acoustic Panels","Remote Controls","Replacement Parts","Carry Cases","Cleaning / Care","Turntable Accessories"] },
    ],
    listingSchema: [
      { key: "subcategory", label: "Accessory type", kind: "select", options: ["Stands","Isolation Feet","Racks","Acoustic Panels","Remote Controls","Replacement Parts","Carry Cases","Cleaning / Care","Turntable Accessories"] },
      { key: "compatibility", label: "Compatibility", kind: "text", placeholder: "Fits 6\"–8\" bookshelves" },
      { key: "dimensions", label: "Dimensions", kind: "text" },
    ],
    cardMeta: (s) => [s.subcategory].filter(Boolean),
    compareKeys: [
      { key: "subcategory", label: "Type" }, { key: "specs.compatibility", label: "Compatibility" },
    ],
    searchKeywords: ["stand","isolation","rack","panel","remote","case"],
  },
];

export const CATEGORY_MAP: Record<CategoryId, Category> = Object.fromEntries(
  CATEGORIES.map((c) => [c.id, c]),
) as Record<CategoryId, Category>;

export function getCategory(id?: string | null): Category | null {
  if (!id) return null;
  return CATEGORY_MAP[id as CategoryId] ?? null;
}
