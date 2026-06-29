// Canonical entity shapes. Field names match the future Supabase schema
// (snake_case). UI keeps its existing camelCase locally via adapters.

import type {
  BrandId,
  CategoryRowId,
  CompareItemId,
  CompareSetId,
  EntitlementId,
  ListingId,
  ListingMediaId,
  ModerationDecisionId,
  OrderId,
  ProfileId,
  ReferralId,
  SavedItemId,
  SellerVerificationId,
  SubcategoryId,
  SubscriptionId,
  UserId,
} from "./ids";
import type {
  ListingStatus,
  OnboardingStatus,
  OrderStatus,
  PayoutAccountState,
  ProofState,
  ReferralStatus,
  SellerVerificationStatus,
  SubscriptionStatus,
  UserRole,
} from "./enums";

export type Iso = string; // ISO-8601 datetime
export type Cents = number;
export type Currency = "USD" | "EUR" | "GBP" | "CAD" | "AUD";

// ---- profile / preferences -------------------------------------------------

export type Profile = {
  id: ProfileId;
  user_id: UserId;
  display_name: string | null;
  avatar_url: string | null;
  location: string | null;
  role: UserRole;
  onboarding_status: OnboardingStatus;
  onboarding_confidence: number; // 0..1
  created_at: Iso;
  updated_at: Iso;
};

export type UserPreferences = {
  user_id: UserId;
  primary_intent: string | null;
  setup_context: string | null;
  openness_level: "broad" | "balanced" | "specific";
  interested_categories: string[];
  interested_subcategories: Record<string, string[]>;
  favorite_brands: string[];
  excluded_brands: string[];
  excluded_categories: string[];
  excluded_listing_types: string[];
  budget_mode: "global" | "per_category" | "open";
  budget_range: [Cents, Cents] | null;
  budget_per_category: Record<string, [Cents, Cents]> | null;
  seller_interest: boolean;
  updated_at: Iso;
};

// ---- catalog ---------------------------------------------------------------

export type Brand = {
  id: BrandId;
  slug: string;
  name: string;
  group: string; // matches BrandGroupId in catalog/brands.ts
  is_featured: boolean;
};

export type Category = {
  id: CategoryRowId;
  slug: string;
  name: string;
  display_order: number;
};

export type Subcategory = {
  id: SubcategoryId;
  category_id: CategoryRowId;
  slug: string;
  name: string;
  display_order: number;
};

// ---- listings --------------------------------------------------------------

export type Listing = {
  id: ListingId;
  seller_id: UserId;
  status: ListingStatus;
  category: string;
  subcategory: string | null;
  brand: string;
  model: string;
  condition: string;
  finish: string | null;
  price_cents: Cents;
  currency: Currency;
  location: string | null;
  shipping_mode: "shipping" | "local_pickup" | "both";
  description: string;
  condition_notes: string | null;
  flaws_notes: string | null;
  reason_for_selling: string | null;
  specs: Record<string, unknown>;
  hero_media_id: ListingMediaId | null;
  ai_review_score: number | null;
  ai_review_notes: string | null;
  rejection_reason: string | null;
  created_at: Iso;
  updated_at: Iso;
  published_at: Iso | null;
};

export type ListingMedia = {
  id: ListingMediaId;
  listing_id: ListingId;
  storage_path: string; // path in Supabase Storage bucket
  kind: "image" | "video" | "document";
  width: number | null;
  height: number | null;
  display_order: number;
  is_hero: boolean;
  created_at: Iso;
};

// ---- saved & compare -------------------------------------------------------

export type SavedItem = {
  id: SavedItemId;
  user_id: UserId;
  listing_id: ListingId;
  created_at: Iso;
};

export type CompareSet = {
  id: CompareSetId;
  user_id: UserId;
  name: string | null;
  created_at: Iso;
  updated_at: Iso;
};

export type CompareItem = {
  id: CompareItemId;
  compare_set_id: CompareSetId;
  listing_id: ListingId;
  position: number;
};

// ---- orders ----------------------------------------------------------------

export type Order = {
  id: OrderId;
  listing_id: ListingId;
  buyer_id: UserId;
  seller_id: UserId;
  status: OrderStatus;
  amount_cents: Cents;
  currency: Currency;
  stripe_payment_intent_id: string | null;
  tracking_carrier: string | null;
  tracking_number: string | null;
  shipped_at: Iso | null;
  delivered_at: Iso | null;
  payout_eta: Iso | null;
  issue_reason: string | null;
  created_at: Iso;
  updated_at: Iso;
};

// ---- seller verification ---------------------------------------------------

export type SellerVerification = {
  id: SellerVerificationId;
  user_id: UserId;
  status: SellerVerificationStatus;
  proof_state: ProofState;
  identity_provider: "stripe_identity";
  identity_session_id: string | null;
  payout_provider: "stripe_connect";
  payout_account_id: string | null;
  payout_state: PayoutAccountState;
  agreement_accepted_at: Iso | null;
  ai_review_score: number | null;
  ai_review_notes: string | null;
  reviewer_id: UserId | null;
  reviewer_note: string | null;
  rejection_reason: string | null;
  created_at: Iso;
  updated_at: Iso;
};

// ---- referrals -------------------------------------------------------------

export type Referral = {
  id: ReferralId;
  referrer_id: UserId;
  referee_email: string | null;
  referee_user_id: UserId | null;
  code: string;
  status: ReferralStatus;
  reward_entitlement_id: EntitlementId | null;
  invited_at: Iso | null;
  qualified_at: Iso | null;
  reward_unlocked_at: Iso | null;
  expires_at: Iso | null;
  created_at: Iso;
};

// ---- entitlements / subscriptions ------------------------------------------

export type EntitlementKey =
  | "premium_membership"
  | "premium_swipes"
  | "seller_pro"
  | "early_access";

export type EntitlementSource = "stripe" | "revenuecat" | "grant" | "none";

export type Entitlement = {
  id: EntitlementId;
  user_id: UserId;
  key: EntitlementKey;
  source: EntitlementSource;
  status: SubscriptionStatus;
  granted_at: Iso;
  expires_at: Iso | null;
  metadata: Record<string, unknown>;
};

export type Subscription = {
  id: SubscriptionId;
  user_id: UserId;
  source: EntitlementSource; // stripe | revenuecat
  product_id: string;
  status: SubscriptionStatus;
  current_period_end: Iso | null;
  cancel_at_period_end: boolean;
  external_subscription_id: string;
  created_at: Iso;
  updated_at: Iso;
};

// ---- moderation ------------------------------------------------------------

export type ModerationTarget = "listing" | "seller_verification" | "user";
export type ModerationDecisionKind = "approve" | "reject" | "request_changes" | "flag";

export type ModerationDecision = {
  id: ModerationDecisionId;
  target_type: ModerationTarget;
  target_id: string;
  actor_id: UserId | null; // null = AI/system
  actor_kind: "user" | "ai" | "system";
  decision: ModerationDecisionKind;
  reason: string | null;
  created_at: Iso;
};
