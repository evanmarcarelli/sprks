// Seed listings for non-speaker categories. Shares the Speaker shape
// so every existing component keeps rendering; category/subcategory
// fields drive the new category-aware surfaces.

import type { Speaker } from "@/lib/data/speakers";

const img = (id: string) =>
  `https://images.unsplash.com/${id}?auto=format&fit=crop&w=1200&q=80`;

// Re-used Unsplash IDs that read as "audio gear" / dark editorial.
const I = {
  amp: "photo-1545454675-3531b543be5d",
  rack: "photo-1593697821028-7cc59cfd7399",
  knobs: "photo-1558137623-ce933996c730",
  cans: "photo-1505740420928-5e560c06d30e",
  iem: "photo-1583394838336-acd977736f90",
  cable: "photo-1593697821028-7cc59cfd7399",
  rackBox: "photo-1545454675-3531b543be5d",
};

type L = Speaker;

const base = (id: string, brand: string, model: string, price: number, image: string, extras: Partial<L>): L => ({
  id,
  brand,
  model,
  price,
  condition: "New",
  type: "Bookshelf", // legacy field — not used when category set
  passive: true,
  tags: [],
  finish: "—",
  roomSize: "Medium",
  localPickup: false,
  verified: false,
  image: img(image),
  gallery: [img(image)],
  description: "",
  specs: { drivers: "—", sensitivity: "—", impedance: "—", frequency: "—", dimensions: "—", weight: "—" },
  seller: { name: "SPKRS Verified", location: "Ships nationwide", rating: 4.8 },
  ...extras,
});

export const NON_SPEAKER_LISTINGS: L[] = [
  // -------- Amplifiers --------
  base("mcintosh-ma352", "McIntosh", "MA352", 7000, I.amp, {
    category: "amplifiers", subcategory: "Integrated",
    description: "Hybrid integrated amp pairing tube preamp section with 200W solid-state output.",
    specs: { ...{ drivers:"—",sensitivity:"—",impedance:"—",frequency:"—" }, topology: "Hybrid", wattage: 200, inputs: "RCA × 4, XLR × 1", dimensions: '17.5" × 9.5" × 22"', weight: "75 lb" } as any,
    seller: { name: "McIntosh Authorized", location: "Binghamton, NY", rating: 4.95 }, verified: true,
  }),
  base("mcintosh-ma352-2", "McIntosh", "MA352", 5800, I.amp, {
    category: "amplifiers", subcategory: "Integrated", condition: "Used — Mint",
    description: "Single owner, smoke-free room. Original box, all packaging, manual.",
    specs: { drivers:"—",sensitivity:"—",impedance:"—",frequency:"—", topology: "Hybrid", wattage: 200, inputs: "RCA × 4, XLR × 1", dimensions: '17.5" × 9.5" × 22"', weight: "75 lb" } as any,
    seller: { name: "Henry T.", location: "Boston, MA", rating: 4.7 }, localPickup: true,
  }),
  base("naim-supernait3", "Naim", "Supernait 3", 5499, I.knobs, {
    category: "amplifiers", subcategory: "Integrated",
    description: "Reference British integrated with discrete Class A preamp stage. 80W into 8Ω.",
    specs: { drivers:"—",sensitivity:"—",impedance:"—",frequency:"—", topology: "Solid State", wattage: 80, inputs: "DIN, RCA × 4" } as any,
    seller: { name: "Naim US", location: "Ships nationwide", rating: 4.9 }, verified: true,
  }),
  base("primaluna-evo400", "PrimaLuna", "EVO 400 Power", 4799, I.rackBox, {
    category: "amplifiers", subcategory: "Tube",
    description: "All-tube power amp. KT150 quad in ultralinear, 70W per channel.",
    specs: { drivers:"—",sensitivity:"—",impedance:"—",frequency:"—", topology: "Tube", wattage: 70, inputs: "RCA, XLR" } as any,
  }),
  base("schiit-aegir", "Schiit", "Aegir", 899, I.amp, {
    category: "amplifiers", subcategory: "Power",
    description: "Single-ended Class A-ish stereo amp, 20W into 8Ω, transparent and quiet.",
    specs: { drivers:"—",sensitivity:"—",impedance:"—",frequency:"—", topology: "Solid State", wattage: 20, inputs: "RCA, XLR" } as any,
  }),

  // -------- Preamps --------
  base("audio-research-ls28se", "Audio Research", "LS28 SE", 9000, I.knobs, {
    category: "preamps", subcategory: "Tube Preamp",
    description: "Reference tube line stage. 6H30 tubes, fully balanced topology.",
    specs: { drivers:"—",sensitivity:"—",impedance:"—",frequency:"—", phono: false, balanced: true } as any, verified: true,
  }),
  base("parasound-jc3jr", "Parasound", "JC 3 Jr", 1995, I.amp, {
    category: "preamps", subcategory: "Phono Preamp",
    description: "John Curl-designed dual mono phono preamp. MM/MC support, balanced output.",
    specs: { drivers:"—",sensitivity:"—",impedance:"—",frequency:"—", phono: true, balanced: true } as any,
  }),
  base("schiit-freya", "Schiit", "Freya+", 999, I.knobs, {
    category: "preamps", subcategory: "Tube Preamp",
    description: "Hybrid passive/JFET/tube preamp. Three sonic flavors in one chassis.",
    specs: { drivers:"—",sensitivity:"—",impedance:"—",frequency:"—", phono: false, balanced: true, remote: true } as any,
  }),

  // -------- DACs --------
  base("chord-qutest", "Chord", "Qutest", 1895, I.knobs, {
    category: "dacs", subcategory: "DAC",
    description: "Standalone DAC built on Rob Watts' WTA filter. USB, coax, dual optical.",
    specs: { drivers:"—",sensitivity:"—",impedance:"—",frequency:"—", chip: "Custom FPGA", inputs: ["USB","Coax","Optical"], outputs: ["RCA"], maxResolution: "32/768, DSD512" } as any,
    verified: true,
  }),
  base("chord-qutest-2", "Chord", "Qutest", 1499, I.knobs, {
    category: "dacs", subcategory: "DAC", condition: "Used — Mint",
    description: "12 months old, original box, USB and power cable included.",
    specs: { drivers:"—",sensitivity:"—",impedance:"—",frequency:"—", chip: "Custom FPGA", inputs: ["USB","Coax","Optical"], outputs: ["RCA"], maxResolution: "32/768, DSD512" } as any,
    seller: { name: "Caleb M.", location: "Seattle, WA", rating: 4.6 }, localPickup: true,
  }),
  base("rme-adi2", "RME", "ADI-2 DAC FS", 1299, I.rackBox, {
    category: "dacs", subcategory: "DAC/Amp Combo",
    description: "Reference DAC + headphone amp. EQ, crossfeed, true peak metering.",
    specs: { drivers:"—",sensitivity:"—",impedance:"—",frequency:"—", chip: "AKM AK4493", inputs: ["USB","Coax","Optical"], outputs: ["RCA","XLR","6.35mm"], maxResolution: "32/768, DSD256" } as any,
  }),
  base("ifi-go-bar", "iFi", "GO bar", 329, I.iem, {
    category: "dacs", subcategory: "Portable DAC",
    description: "Pocket DAC/amp with MQA, balanced 4.4mm out, XBass+ and XSpace.",
    specs: { drivers:"—",sensitivity:"—",impedance:"—",frequency:"—", chip: "Cirrus Logic", inputs: ["USB"], outputs: ["3.5mm","4.4mm"], maxResolution: "32/384, DSD256" } as any,
  }),

  // -------- Streamers --------
  base("bluesound-node-x", "Bluesound", "Node X", 799, I.rackBox, {
    category: "streamers", subcategory: "All-in-One",
    description: "Wired/wireless streamer with built-in DAC and headphone amp. BluOS native.",
    specs: { drivers:"—",sensitivity:"—",impedance:"—",frequency:"—", services: ["Tidal","Qobuz","Spotify","AirPlay 2"], dacIncluded: true, wired: true } as any,
    verified: true,
  }),
  base("aurender-n200", "Aurender", "N200", 6500, I.rackBox, {
    category: "streamers", subcategory: "Network Streamer",
    description: "Reference music server / streamer with linear power supply. Conductor app.",
    specs: { drivers:"—",sensitivity:"—",impedance:"—",frequency:"—", services: ["Tidal","Qobuz","Roon"], dacIncluded: false, wired: true } as any,
    verified: true,
  }),
  base("ifi-zen-stream", "iFi", "Zen Stream", 449, I.knobs, {
    category: "streamers", subcategory: "Network Streamer",
    description: "Audiophile network bridge for Roon, Tidal Connect, and DLNA.",
    specs: { drivers:"—",sensitivity:"—",impedance:"—",frequency:"—", services: ["Roon","Tidal","Qobuz","Spotify"], dacIncluded: false, wired: true } as any,
  }),

  // -------- Transports --------
  base("jays-cdt2-mk3", "Jay's Audio", "CDT2-MK3", 4500, I.rackBox, {
    category: "transports", subcategory: "CD Transport",
    description: "Reference CD transport with Philips CD-Pro2 mechanism and I2S output.",
    specs: { drivers:"—",sensitivity:"—",impedance:"—",frequency:"—", media: "CD", outputs: ["Coax","AES/EBU","I2S","Optical"] } as any,
  }),
  base("audiolab-6000cdt", "Audiolab", "6000CDT", 649, I.rackBox, {
    category: "transports", subcategory: "CD Transport",
    description: "Dedicated CD transport. Read-ahead memory buffer for jitter reduction.",
    specs: { drivers:"—",sensitivity:"—",impedance:"—",frequency:"—", media: "CD", outputs: ["Coax","Optical"] } as any,
  }),

  // -------- Power --------
  base("ps-audio-p15", "PS Audio", "PowerPlant P15", 7999, I.rackBox, {
    category: "power", subcategory: "Power Regenerator",
    description: "Full AC regenerator. 1500W continuous, eight zoned outlets.",
    specs: { drivers:"—",sensitivity:"—",impedance:"—",frequency:"—", outlets: 8, voltage: "120V" } as any,
    verified: true,
  }),
  base("furman-elite15", "Furman", "Elite-15 PFi", 999, I.rackBox, {
    category: "power", subcategory: "Power Conditioner",
    description: "Linear filtering, series protection. Stable +/-1.5V regulation.",
    specs: { drivers:"—",sensitivity:"—",impedance:"—",frequency:"—", outlets: 13, voltage: "120V" } as any,
  }),

  // -------- Cables --------
  base("audioquest-rocket44", "AudioQuest", "Rocket 44 — 8ft pair", 599, I.cable, {
    category: "cables", subcategory: "Speaker Cables",
    description: "Solid Long Grain Copper conductors, banana-terminated 8ft pair.",
    specs: { drivers:"—",sensitivity:"—",impedance:"—",frequency:"—", length: 8, termination: "Banana", pair: true, material: "LGC copper" } as any,
  }),
  base("kimber-pbj", "Kimber Kable", "PBJ Interconnect — 1m", 158, I.cable, {
    category: "cables", subcategory: "Interconnects",
    description: "Iconic three-conductor RCA interconnect. Single pair, 1m.",
    specs: { drivers:"—",sensitivity:"—",impedance:"—",frequency:"—", length: 3, termination: "RCA Ultraplate", pair: true, material: "VariStrand copper" } as any,
  }),
  base("audioquest-cinnamon-usb", "AudioQuest", "Cinnamon USB — 1.5m", 99, I.cable, {
    category: "cables", subcategory: "USB Audio",
    description: "Solid 1.25% silver USB cable. A to B termination, 1.5m.",
    specs: { drivers:"—",sensitivity:"—",impedance:"—",frequency:"—", length: 5, termination: "USB A → B", pair: false, material: "Silver-plated copper" } as any,
  }),
  base("shunyata-venom-nr-v10", "Shunyata Research", "Venom NR-V10", 425, I.cable, {
    category: "cables", subcategory: "Power Cables",
    description: "Noise-reducing power cable. 14 AWG VTX-Ag conductors.",
    specs: { drivers:"—",sensitivity:"—",impedance:"—",frequency:"—", length: 6, termination: "C15 IEC", pair: false, material: "OFE copper" } as any,
  }),

  // -------- Headphones --------
  base("focal-clear-mg", "Focal", "Clear MG", 1490, I.cans, {
    category: "headphones", subcategory: "Over-Ear",
    description: "Open-back dynamic over-ear with magnesium 'M'-shape dome drivers.",
    specs: { drivers:"—",sensitivity:"—",frequency:"—", back: "Open-Back", driver: "Dynamic", impedance: 55, wireless: false, cable: true } as any,
    verified: true,
  }),
  base("hifiman-arya", "HiFiMan", "Arya Organic", 1299, I.cans, {
    category: "headphones", subcategory: "Open-Back",
    description: "Open-back planar magnetic. Stealth Magnet design, wide soundstage.",
    specs: { drivers:"—",sensitivity:"—",frequency:"—", back: "Open-Back", driver: "Planar Magnetic", impedance: 16, wireless: false, cable: true } as any,
  }),
  base("hifiman-arya-2", "HiFiMan", "Arya Organic", 999, I.cans, {
    category: "headphones", subcategory: "Open-Back", condition: "Used — Mint",
    description: "Lightly used, original box. Includes 3.5mm and 6.35mm cables.",
    specs: { drivers:"—",sensitivity:"—",frequency:"—", back: "Open-Back", driver: "Planar Magnetic", impedance: 16, wireless: false, cable: true } as any,
    seller: { name: "Jordan P.", location: "Austin, TX", rating: 4.85 }, localPickup: true,
  }),
  base("dan-clark-stealth", "Dan Clark Audio", "Stealth", 4000, I.cans, {
    category: "headphones", subcategory: "Closed-Back",
    description: "Reference closed-back planar magnetic. Vented chamber, AMTS waveguide.",
    specs: { drivers:"—",sensitivity:"—",frequency:"—", back: "Closed-Back", driver: "Planar Magnetic", impedance: 23, wireless: false, cable: true } as any,
    verified: true,
  }),
  base("64audio-u12t", "64 Audio", "U12t", 1999, I.iem, {
    category: "headphones", subcategory: "IEM",
    description: "Twelve-driver universal IEM with apex modules. Reference reference IEM.",
    specs: { drivers:"—",sensitivity:"—",frequency:"—", back: "Closed-Back", driver: "Balanced Armature", impedance: 12, wireless: false, cable: true } as any,
  }),
  base("focal-bathys", "Focal", "Bathys MG", 999, I.cans, {
    category: "headphones", subcategory: "Wireless Audiophile",
    description: "Bluetooth audiophile headphones with USB-DAC mode and Focal drivers.",
    specs: { drivers:"—",sensitivity:"—",frequency:"—", back: "Closed-Back", driver: "Dynamic", impedance: 35, wireless: true, cable: true } as any,
  }),

  // -------- Accessories --------
  base("iso-acoustics-aperta300", "IsoAcoustics", "Aperta 300", 399, I.rack, {
    category: "accessories", subcategory: "Stands",
    description: "Aluminum isolation stands for studio monitors and bookshelf speakers.",
    specs: { drivers:"—",sensitivity:"—",impedance:"—",frequency:"—", compatibility: 'Up to 12" wide, 40 lb', dimensions: '11.5" × 12.4"' } as any,
  }),
  base("townshend-pods", "Townshend Audio", "Seismic Pods", 850, I.rack, {
    category: "accessories", subcategory: "Isolation Feet",
    description: "Constrained-layer isolation pods. Set of four, weight-matched.",
    specs: { drivers:"—",sensitivity:"—",impedance:"—",frequency:"—", compatibility: "Set of 4 — weight matched", dimensions: '2.5" diameter' } as any,
  }),
  base("gik-242", "GIK Acoustics", "242 Acoustic Panel", 165, I.rack, {
    category: "accessories", subcategory: "Acoustic Panels",
    description: "Broadband absorber, 2 ft × 4 ft. Wall- or stand-mountable.",
    specs: { drivers:"—",sensitivity:"—",impedance:"—",frequency:"—", compatibility: "Wall / stand", dimensions: '24" × 48" × 2"' } as any,
  }),
];
