// Branded ID types so backend FKs are typed end-to-end.
// All IDs are strings (UUIDs) at the wire level.

declare const __brand: unique symbol;
type Brand<T, B> = T & { readonly [__brand]: B };

export type UserId = Brand<string, "UserId">;
export type ProfileId = Brand<string, "ProfileId">;
export type BrandId = Brand<string, "BrandId">;
export type CategoryRowId = Brand<string, "CategoryRowId">;
export type SubcategoryId = Brand<string, "SubcategoryId">;
export type ListingId = Brand<string, "ListingId">;
export type ListingMediaId = Brand<string, "ListingMediaId">;
export type SavedItemId = Brand<string, "SavedItemId">;
export type CompareSetId = Brand<string, "CompareSetId">;
export type CompareItemId = Brand<string, "CompareItemId">;
export type OrderId = Brand<string, "OrderId">;
export type SellerVerificationId = Brand<string, "SellerVerificationId">;
export type ReferralId = Brand<string, "ReferralId">;
export type EntitlementId = Brand<string, "EntitlementId">;
export type SubscriptionId = Brand<string, "SubscriptionId">;
export type ModerationDecisionId = Brand<string, "ModerationDecisionId">;

export const asId = <T extends string>(v: string) => v as T;
