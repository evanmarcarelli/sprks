import type {
  Payout,
  Seller,
  SellerListing,
  SellerOrder,
} from "@/lib/seller/types";

const img = (id: string) =>
  `https://images.unsplash.com/${id}?auto=format&fit=crop&w=1200&q=80`;

export const INITIAL_SELLER: Seller = {
  status: "none",
  profile: {
    legalName: "",
    addressLine1: "",
    addressLine2: "",
    city: "",
    region: "",
    postal: "",
    country: "United States",
    phone: "",
    dob: "",
  },
  verification: { provider: "stripe_identity", state: "not_started" },
  payout: { provider: "stripe_connect", state: "not_connected" },
  metrics: {
    activeListings: 0,
    pendingReview: 0,
    sold: 0,
    payoutPendingCents: 0,
  },
};

// Demo metrics shown once the seller is verified, so the dashboard
// doesn't read as completely empty in the prototype.
export const DEMO_METRICS = {
  activeListings: 3,
  pendingReview: 1,
  sold: 7,
  payoutPendingCents: 248000,
};

export const SELLER_LISTINGS: SellerListing[] = [
  {
    id: "L-1042",
    status: "live",
    basics: {
      brand: "KEF",
      model: "LS50 Meta",
      type: "Bookshelf",
      condition: "Open Box",
      finish: "Carbon Black",
      priceCents: 159900,
      location: "Brooklyn, NY",
      shipping: "both",
    },
    media: {
      hero: img("photo-1545454675-3531b543be5d"),
      gallery: [img("photo-1558137623-ce933996c730")],
    },
    specs: {
      passive: true,
      dimensions: '11.9" × 7.9" × 11"',
      weight: "17.2 lb",
      accessories: "Foam port plugs, manual",
      year: "2024",
      pairingNotes: "Hegel H95 or Naim Atom",
    },
    description: {
      notes: "Demo pair from a closed listening room. Pristine.",
      conditionNotes: "No marks, original packaging.",
      flaws: "None observed.",
      reasonForSelling: "Upgrading to Reference 1.",
    },
    proof: {
      state: "approved",
      requiredAngle: "Rear panel with grilles removed",
      imageUrl: img("photo-1558137623-ce933996c730"),
    },
    updatedAt: "2026-06-22",
  },
  {
    id: "L-1041",
    status: "pending_review",
    basics: {
      brand: "Harbeth",
      model: "Monitor 30.3",
      type: "Bookshelf",
      condition: "Used — Good",
      finish: "Cherry",
      priceCents: 619500,
      location: "Brooklyn, NY",
      shipping: "shipping",
    },
    media: {
      hero: img("photo-1545454675-3531b543be5d"),
      gallery: [],
    },
    specs: {
      passive: true,
      dimensions: '18" × 10.6" × 11.2"',
      weight: "25.5 lb",
      accessories: "Original boxes",
      year: "2021",
      pairingNotes: "Sugden A21, Luxman L-505uXII",
    },
    description: {
      notes: "Original owner, smoke-free studio.",
      conditionNotes: "Light shelf wear on rear edges.",
      flaws: "Minor finish lift at one bottom corner.",
      reasonForSelling: "Moving to floorstanders.",
    },
    proof: {
      state: "under_review",
      requiredAngle: "Right speaker rear with serial visible",
    },
    updatedAt: "2026-06-25",
  },
  {
    id: "L-1038",
    status: "sold",
    basics: {
      brand: "Devialet",
      model: "Mania",
      type: "Active",
      condition: "New",
      finish: "Deep Black",
      priceCents: 99000,
      location: "Brooklyn, NY",
      shipping: "shipping",
    },
    media: {
      hero: img("photo-1558137623-ce933996c730"),
      gallery: [],
    },
    specs: {
      passive: false,
      dimensions: '7.6" × 6.7" × 5.4"',
      weight: "5 lb",
      accessories: "Charging dock, travel cover",
      year: "2025",
      pairingNotes: "—",
    },
    description: {
      notes: "Sealed unit, opened only for photos.",
      conditionNotes: "Mint.",
      flaws: "None.",
      reasonForSelling: "Gift duplicate.",
    },
    proof: {
      state: "approved",
      requiredAngle: "Underside with serial visible",
      imageUrl: img("photo-1558137623-ce933996c730"),
    },
    updatedAt: "2026-06-18",
  },
];

export const SELLER_ORDERS: SellerOrder[] = [
  {
    id: "O-2208",
    listingId: "L-1038",
    buyer: { initials: "J.M.", city: "Austin, TX", rating: 4.9 },
    priceCents: 99000,
    placedAt: "2026-06-23",
    shipBy: "2026-06-26",
    status: "awaiting_shipment",
  },
  {
    id: "O-2207",
    listingId: "L-1042",
    buyer: { initials: "S.K.", city: "Seattle, WA", rating: 5.0 },
    priceCents: 159900,
    placedAt: "2026-06-20",
    shipBy: "2026-06-23",
    status: "shipped",
    tracking: { carrier: "UPS", number: "1Z999AA10123456784", signature: true },
  },
  {
    id: "O-2199",
    listingId: "L-1042",
    buyer: { initials: "R.D.", city: "Chicago, IL", rating: 4.8 },
    priceCents: 159900,
    placedAt: "2026-06-12",
    shipBy: "2026-06-15",
    status: "inspection",
    tracking: { carrier: "UPS", number: "1Z999AA10123456701", signature: true },
    deliveredAt: "2026-06-19",
    payoutEta: "2026-06-26",
  },
  {
    id: "O-2188",
    listingId: "L-1038",
    buyer: { initials: "P.L.", city: "Portland, OR", rating: 4.95 },
    priceCents: 99000,
    placedAt: "2026-06-02",
    shipBy: "2026-06-05",
    status: "paid_out",
    tracking: { carrier: "FedEx", number: "1234 5678 9012", signature: true },
    deliveredAt: "2026-06-08",
    payoutEta: "2026-06-15",
  },
];

export const SELLER_PAYOUTS: Payout[] = [
  {
    id: "PO-554",
    orderId: "O-2199",
    amountCents: 148700,
    state: "scheduled",
    scheduledFor: "2026-06-26",
  },
  {
    id: "PO-553",
    orderId: "O-2188",
    amountCents: 92070,
    state: "paid",
    scheduledFor: "2026-06-15",
    paidAt: "2026-06-15",
  },
  {
    id: "PO-548",
    orderId: "O-2170",
    amountCents: 230400,
    state: "paid",
    scheduledFor: "2026-05-29",
    paidAt: "2026-05-29",
  },
];

export const REQUIRED_ANGLES = [
  "Right speaker rear panel with serial visible",
  "Both speakers shown side-by-side with grilles removed",
  "Underside with model badge clearly visible",
  "Driver close-up with grille off",
  "Rear binding posts with cabling disconnected",
];
