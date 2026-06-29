import type { CategoryId } from "@/lib/catalog/categories";

export type FeedItem =
  | {
      kind: "reel";
      id: string;
      title: string;
      creator: string;
      cover: string;
      relatedSpeakerId?: string;
      duration: string;
      category?: CategoryId;
    }
  | {
      kind: "collection";
      id: string;
      title: string;
      subtitle: string;
      count: number;
      covers: string[];
      category?: CategoryId;
    }
  | {
      kind: "review";
      id: string;
      title: string;
      source: string;
      rating: number;
      cover: string;
      excerpt: string;
      category?: CategoryId;
    }
  | {
      kind: "brand";
      id: string;
      brand: string;
      tagline: string;
      cover: string;
      category?: CategoryId;
    };

const img = (id: string) =>
  `https://images.unsplash.com/${id}?auto=format&fit=crop&w=1200&q=80`;

export const FEED: FeedItem[] = [
  {
    kind: "reel",
    id: "r1",
    title: "A 12 m² listening room, done right",
    creator: "@roomtone",
    cover: img("photo-1545454675-3531b543be5d"),
    relatedSpeakerId: "kef-ls50-meta",
    duration: "1:24",
    category: "speakers",
  },
  {
    kind: "collection",
    id: "c1",
    title: "Best Bookshelf Under $2,000",
    subtitle: "Editor's picks · 8 speakers",
    count: 8,
    covers: [
      img("photo-1545454675-3531b543be5d"),
      img("photo-1593697821028-7cc59cfd7399"),
      img("photo-1558137623-ce933996c730"),
    ],
    category: "speakers",
  },
  {
    kind: "review",
    id: "rv-amp",
    title: "McIntosh MA352: tube meets transistor, done right",
    source: "Stereophile",
    rating: 4.7,
    cover: img("photo-1545454675-3531b543be5d"),
    excerpt:
      "Hybrid topology, blue meters, and 200W of headroom that flatters everything from BBC monitors to planar headphones.",
    category: "amplifiers",
  },
  {
    kind: "collection",
    id: "c-pairings",
    title: "Amp + speaker pairings worth chasing",
    subtitle: "Six combinations, picked apart",
    count: 6,
    covers: [
      img("photo-1545454675-3531b543be5d"),
      img("photo-1610904853820-3a8e1a3a8e8a"),
      img("photo-1593697821028-7cc59cfd7399"),
    ],
    category: "amplifiers",
  },
  {
    kind: "reel",
    id: "r-cans",
    title: "Building a desktop headphone rig",
    creator: "@cans.daily",
    cover: img("photo-1505740420928-5e560c06d30e"),
    duration: "2:48",
    category: "headphones",
  },
  {
    kind: "review",
    id: "rv-dac",
    title: "Chord Qutest, three years in",
    source: "Darko.Audio",
    rating: 4.8,
    cover: img("photo-1610904853820-3a8e1a3a8e8a"),
    excerpt:
      "Still the easiest standalone DAC recommendation under two grand. Filter choice matters more than people admit.",
    category: "dacs",
  },
  {
    kind: "collection",
    id: "c-streamer",
    title: "Streamer & DAC primer",
    subtitle: "All-in-one, separates, and Roon ready",
    count: 9,
    covers: [
      img("photo-1610904853820-3a8e1a3a8e8a"),
      img("photo-1545454675-3531b543be5d"),
      img("photo-1593697821028-7cc59cfd7399"),
    ],
    category: "streamers",
  },
  {
    kind: "reel",
    id: "r-cable",
    title: "Cable myths vs measured truths",
    creator: "@measure.first",
    cover: img("photo-1606213813604-9b6db347c1a2"),
    duration: "3:12",
    category: "cables",
  },
  {
    kind: "brand",
    id: "b1",
    brand: "Devialet",
    tagline: "Acoustic engineering, French restraint.",
    cover: img("photo-1558137623-ce933996c730"),
    category: "speakers",
  },
  {
    kind: "collection",
    id: "c-room",
    title: "Room treatment that doesn't kill the vibe",
    subtitle: "Panels, traps, and where to place them",
    count: 5,
    covers: [
      img("photo-1593697821028-7cc59cfd7399"),
      img("photo-1545454675-3531b543be5d"),
      img("photo-1610904853820-3a8e1a3a8e8a"),
    ],
    category: "accessories",
  },
  {
    kind: "review",
    id: "rv2",
    title: "Buchardt A500 long-term review",
    source: "Darko.Audio",
    rating: 4.6,
    cover: img("photo-1610904853820-3a8e1a3a8e8a"),
    excerpt:
      "Twelve months in: still the easiest recommendation for one-box wireless hi-fi under five grand.",
    category: "speakers",
  },
];
