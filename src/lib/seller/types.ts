// Seller-side type definitions. Field names mirror the future
// Supabase schema and Stripe Connect / Stripe Identity payloads so
// backend wiring later is mechanical.

export type SellerStatus =
  | "none"
  | "onboarding"
  | "identity_submitted"
  | "verification_pending"
  | "verified"
  | "rejected"
  | "paused";

export type VerificationState =
  | "not_started"
  | "in_progress"
  | "submitted"
  | "pending_review"
  | "verified"
  | "failed";

export type PayoutAccountState =
  | "not_connected"
  | "pending"
  | "active"
  | "restricted";

export type SellerProfile = {
  legalName: string;
  addressLine1: string;
  addressLine2: string;
  city: string;
  region: string;
  postal: string;
  country: string;
  phone: string;
  dob: string; // YYYY-MM-DD
};

export type Seller = {
  status: SellerStatus;
  profile: SellerProfile;
  verification: {
    provider: "stripe_identity";
    sessionId?: string;
    state: VerificationState;
    reason?: string;
  };
  payout: {
    provider: "stripe_connect";
    accountId?: string;
    state: PayoutAccountState;
  };
  agreementAcceptedAt?: string;
  metrics: {
    activeListings: number;
    pendingReview: number;
    sold: number;
    payoutPendingCents: number;
  };
};

export type ListingStatus =
  | "draft"
  | "pending_review"
  | "live"
  | "reserved"
  | "sold"
  | "rejected"
  | "archived";

export type ProofState =
  | "awaiting_upload"
  | "uploaded"
  | "under_review"
  | "rejected"
  | "approved";

export type ConditionFlaw = {
  id: string;
  x: number;
  y: number;
  severity: "cosmetic" | "light" | "noticeable" | "functional";
  note: string;
  photoUrl?: string;
};

export type ProvenanceTag =
  | "original_packaging"
  | "original_receipt"
  | "smoke_free"
  | "pet_free"
  | "dedicated_room"
  | "single_owner"
  | "under_warranty"
  | "recently_serviced";

export type SellerListing = {
  id: string;
  status: ListingStatus;
  basics: {
    category?: string;
    subcategory?: string;
    brand: string;
    model: string;
    type: string;
    condition: string;
    finish: string;
    priceCents: number;
    location: string;
    shipping: "shipping" | "local_pickup" | "both";
  };
  media: {
    hero?: string;
    gallery: string[];
  };
  specs: {
    passive: boolean;
    dimensions: string;
    weight: string;
    accessories: string;
    year: string;
    pairingNotes: string;
    officialSpecsRef?: string;
  };
  description: {
    notes: string;
    conditionNotes: string;
    flaws: string;
    reasonForSelling: string;
  };
  condition?: {
    noFlaws: boolean;
    flaws: ConditionFlaw[];
  };
  provenance?: ProvenanceTag[];
  proof: {
    state: ProofState;
    requiredAngle: string;
    imageUrl?: string;
    videoUrl?: string;
    reviewerNote?: string;
  };
  rejectionReason?: string;
  updatedAt: string;
};

export type OrderStatus =
  | "new"
  | "awaiting_shipment"
  | "shipped"
  | "delivered"
  | "inspection"
  | "payout_pending"
  | "paid_out"
  | "issue";

export type SellerOrder = {
  id: string;
  listingId: string;
  buyer: { initials: string; city: string; rating: number };
  priceCents: number;
  placedAt: string;
  shipBy: string;
  status: OrderStatus;
  tracking?: { carrier: string; number: string; signature: boolean };
  deliveredAt?: string;
  payoutEta?: string;
  issueReason?: string;
};

export type Payout = {
  id: string;
  orderId: string;
  amountCents: number;
  state: "scheduled" | "in_transit" | "paid" | "failed";
  scheduledFor: string;
  paidAt?: string;
  failureReason?: string;
};
