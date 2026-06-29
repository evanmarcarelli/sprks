// Canonical status unions. Mirror these as Postgres enums in Supabase.

export const ONBOARDING_STATUSES = [
  "not_started",
  "in_progress",
  "completed",
  "skipped",
] as const;
export type OnboardingStatus = (typeof ONBOARDING_STATUSES)[number];

export const SELLER_VERIFICATION_STATUSES = [
  "not_started",
  "pending_ai_review",
  "pending_manual_review",
  "approved",
  "rejected",
  "requires_resubmission",
] as const;
export type SellerVerificationStatus = (typeof SELLER_VERIFICATION_STATUSES)[number];

export const LISTING_STATUSES = [
  "draft",
  "pending_ai_review",
  "pending_manual_review",
  "requires_correction",
  "live",
  "sold",
  "archived",
  "rejected",
] as const;
export type ListingStatus = (typeof LISTING_STATUSES)[number];

export const SUBSCRIPTION_STATUSES = [
  "free",
  "trial",
  "active",
  "expired",
  "canceled",
  "grace_period",
] as const;
export type SubscriptionStatus = (typeof SUBSCRIPTION_STATUSES)[number];

export const REFERRAL_STATUSES = [
  "created",
  "invited",
  "qualified",
  "reward_unlocked",
  "expired",
] as const;
export type ReferralStatus = (typeof REFERRAL_STATUSES)[number];

export const ORDER_STATUSES = [
  "new",
  "awaiting_shipment",
  "shipped",
  "delivered",
  "inspection",
  "payout_pending",
  "paid_out",
  "issue",
] as const;
export type OrderStatus = (typeof ORDER_STATUSES)[number];

export const PAYOUT_STATES = [
  "not_connected",
  "pending",
  "active",
  "restricted",
] as const;
export type PayoutAccountState = (typeof PAYOUT_STATES)[number];

export const PROOF_STATES = [
  "awaiting_upload",
  "uploaded",
  "under_review",
  "rejected",
  "approved",
] as const;
export type ProofState = (typeof PROOF_STATES)[number];

export const USER_ROLES = ["user", "seller", "moderator", "admin"] as const;
export type UserRole = (typeof USER_ROLES)[number];

// Human-readable labels for status pills, dashboards, and admin views.
export const STATUS_LABELS: Record<string, string> = {
  // onboarding
  not_started: "Not started",
  in_progress: "In progress",
  completed: "Completed",
  skipped: "Skipped",
  // verification
  pending_ai_review: "Auto-review",
  pending_manual_review: "Manual review",
  approved: "Approved",
  rejected: "Rejected",
  requires_resubmission: "Needs resubmission",
  // listings
  draft: "Draft",
  requires_correction: "Needs correction",
  live: "Live",
  sold: "Sold",
  archived: "Archived",
  // subscription
  free: "Free",
  trial: "Trial",
  active: "Active",
  expired: "Expired",
  canceled: "Canceled",
  grace_period: "Grace period",
  // referral
  created: "Created",
  invited: "Invited",
  qualified: "Qualified",
  reward_unlocked: "Reward unlocked",
  // orders
  new: "New",
  awaiting_shipment: "Awaiting shipment",
  shipped: "Shipped",
  delivered: "Delivered",
  inspection: "Inspection",
  payout_pending: "Payout pending",
  paid_out: "Paid out",
  issue: "Issue",
  // proof
  awaiting_upload: "Awaiting upload",
  uploaded: "Uploaded",
  under_review: "Under review",
  // payout
  not_connected: "Not connected",
  pending: "Pending",
  restricted: "Restricted",
};

export function formatStatus(status: string): string {
  return STATUS_LABELS[status] ?? status;
}
