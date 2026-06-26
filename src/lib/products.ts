import tower from "@/assets/product-tower.jpg";
import headphones from "@/assets/product-headphones.jpg";
import amp from "@/assets/product-amp.jpg";
import turntable from "@/assets/product-turntable.jpg";

export type Product = {
  id: string;
  name: string;
  brand: string;
  category: "Speakers" | "Headphones" | "Amplifiers" | "Turntables";
  price: number;
  impedance: string;
  blurb: string;
  image: string;
};

export const products: Product[] = [
  { id: "1", name: "Monolith Reference Tower", brand: "Sönus Veritas", category: "Speakers", price: 18400, impedance: "8 Ω", blurb: "Three-way floor-standing reference monitor with beryllium tweeter.", image: tower },
  { id: "2", name: "Aether Studio Pro", brand: "Kestrel Audio", category: "Headphones", price: 2890, impedance: "32 Ω", blurb: "Planar magnetic, hand-assembled in Tokyo.", image: headphones },
  { id: "3", name: "Vacuum 300B Integrated", brand: "Lumen Labs", category: "Amplifiers", price: 9750, impedance: "—", blurb: "Single-ended triode tube amplifier, 8W per channel of pure warmth.", image: amp },
  { id: "4", name: "Orbit Mk. III", brand: "Northwind Acoustics", category: "Turntables", price: 6200, impedance: "—", blurb: "Belt-driven turntable with carbon-fiber tonearm.", image: turntable },
  { id: "5", name: "Nimbus Bookshelf", brand: "Sönus Veritas", category: "Speakers", price: 4200, impedance: "6 Ω", blurb: "Two-way bookshelf with silk dome tweeter.", image: tower },
  { id: "6", name: "Solace Open-Back", brand: "Kestrel Audio", category: "Headphones", price: 1450, impedance: "300 Ω", blurb: "Reference open-back for critical listening.", image: headphones },
  { id: "7", name: "Phase Preamp One", brand: "Lumen Labs", category: "Amplifiers", price: 5400, impedance: "—", blurb: "Class-A solid state preamplifier with discrete output.", image: amp },
  { id: "8", name: "Equinox Direct-Drive", brand: "Northwind Acoustics", category: "Turntables", price: 3850, impedance: "—", blurb: "Quartz-locked direct drive turntable.", image: turntable },
];

export const brands = Array.from(new Set(products.map((p) => p.brand)));
export const categories = Array.from(new Set(products.map((p) => p.category)));
