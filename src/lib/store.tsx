import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import {
  DEMO_METRICS,
  INITIAL_SELLER,
  SELLER_LISTINGS,
  SELLER_ORDERS,
  SELLER_PAYOUTS,
} from "@/lib/data/seller-mock";
import type {
  Payout,
  Seller,
  SellerListing,
  SellerOrder,
  SellerProfile,
  VerificationState,
  PayoutAccountState,
} from "@/lib/seller/types";
import {
  EMPTY_PROFILE,
  computeConfidence,
  type BuyerProfile,
} from "@/lib/personalization/profile";
import {
  EMPTY_COUNTERS,
  applySignal,
  type SignalCounters,
  type SignalEvent,
} from "@/lib/personalization/signals";

type StoreState = {
  saved: string[];
  passed: string[];
  cart: string[];
  compare: string[];
  filters: Filters;
  seller: Seller;
  listings: SellerListing[];
  orders: SellerOrder[];
  payouts: Payout[];
  profile: BuyerProfile;
  signals: SignalCounters;
  dismissedPrompts: string[];
};

export type Filters = {
  priceMax: number;
  brands: string[];
  types: string[];
  conditions: string[];
  passiveOnly: boolean;
  localPickup: boolean;
  verifiedOnly: boolean;
  // Category-specific extras keyed by FilterFieldDef.key
  categoryExtras?: Record<string, string[]>;
};

export const DEFAULT_FILTERS: Filters = {
  priceMax: 20000,
  brands: [],
  types: [],
  conditions: [],
  passiveOnly: false,
  localPickup: false,
  verifiedOnly: false,
  categoryExtras: {},
};

type StoreCtx = StoreState & {
  toggleSave: (id: string) => void;
  pass: (id: string) => void;
  resetDeck: () => void;
  addToCart: (id: string) => void;
  removeFromCart: (id: string) => void;
  toggleCompare: (id: string) => void;
  setFilters: (f: Filters) => void;
  // seller actions
  beginSellerOnboarding: () => void;
  saveSellerProfile: (p: SellerProfile) => void;
  setVerificationState: (state: VerificationState, reason?: string) => void;
  setPayoutState: (state: PayoutAccountState, accountId?: string) => void;
  acceptSellerAgreement: () => void;
  upsertListing: (l: SellerListing) => void;
  removeListing: (id: string) => void;
  pauseSeller: () => void;
  resumeSeller: () => void;
  // personalization
  updateProfile: (patch: Partial<BuyerProfile>) => void;
  completeOnboarding: (patch?: Partial<BuyerProfile>) => void;
  resetOnboarding: () => void;
  trackSignal: (e: SignalEvent) => void;
  dismissPrompt: (id: string) => void;
};

const Ctx = createContext<StoreCtx | null>(null);

const KEY = "sonus-store-v1";

export function StoreProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<StoreState>({
    saved: [],
    passed: [],
    cart: [],
    compare: [],
    filters: DEFAULT_FILTERS,
    seller: INITIAL_SELLER,
    listings: SELLER_LISTINGS,
    orders: SELLER_ORDERS,
    payouts: SELLER_PAYOUTS,
    profile: EMPTY_PROFILE,
    signals: EMPTY_COUNTERS,
    dismissedPrompts: [],
  });

  useEffect(() => {
    if (typeof window === "undefined") return;
    try {
      const raw = window.localStorage.getItem(KEY);
      if (raw) setState((s) => ({ ...s, ...JSON.parse(raw) }));
    } catch {}
  }, []);

  useEffect(() => {
    if (typeof window === "undefined") return;
    try {
      window.localStorage.setItem(KEY, JSON.stringify(state));
    } catch {}
  }, [state]);

  const toggleSave = useCallback((id: string) => {
    setState((s) => ({
      ...s,
      saved: s.saved.includes(id) ? s.saved.filter((x) => x !== id) : [id, ...s.saved],
      passed: s.passed.filter((x) => x !== id),
    }));
  }, []);

  const pass = useCallback((id: string) => {
    setState((s) => ({ ...s, passed: s.passed.includes(id) ? s.passed : [id, ...s.passed] }));
  }, []);

  const resetDeck = useCallback(() => {
    setState((s) => ({ ...s, passed: [] }));
  }, []);

  const addToCart = useCallback((id: string) => {
    setState((s) => ({ ...s, cart: s.cart.includes(id) ? s.cart : [...s.cart, id] }));
  }, []);

  const removeFromCart = useCallback((id: string) => {
    setState((s) => ({ ...s, cart: s.cart.filter((x) => x !== id) }));
  }, []);

  const toggleCompare = useCallback((id: string) => {
    setState((s) => ({
      ...s,
      compare: s.compare.includes(id)
        ? s.compare.filter((x) => x !== id)
        : s.compare.length >= 4
          ? s.compare
          : [...s.compare, id],
    }));
  }, []);

  const setFilters = useCallback((filters: Filters) => {
    setState((s) => ({ ...s, filters, passed: [] }));
  }, []);

  const beginSellerOnboarding = useCallback(() => {
    setState((s) => ({ ...s, seller: { ...s.seller, status: "onboarding" } }));
  }, []);

  const saveSellerProfile = useCallback((profile: SellerProfile) => {
    setState((s) => ({
      ...s,
      seller: { ...s.seller, profile, status: "identity_submitted" },
    }));
  }, []);

  const setVerificationState = useCallback((vstate: VerificationState, reason?: string) => {
    setState((s) => {
      const verified = vstate === "verified";
      const failed = vstate === "failed";
      const nextStatus = verified
        ? "verified"
        : failed
          ? "rejected"
          : vstate === "pending_review" || vstate === "submitted"
            ? "verification_pending"
            : s.seller.status;
      return {
        ...s,
        seller: {
          ...s.seller,
          status: nextStatus,
          verification: { ...s.seller.verification, state: vstate, reason },
          metrics: verified ? { ...s.seller.metrics, ...DEMO_METRICS } : s.seller.metrics,
        },
      };
    });
  }, []);

  const setPayoutState = useCallback((pstate: PayoutAccountState, accountId?: string) => {
    setState((s) => ({
      ...s,
      seller: {
        ...s.seller,
        payout: {
          ...s.seller.payout,
          state: pstate,
          accountId: accountId ?? s.seller.payout.accountId,
        },
      },
    }));
  }, []);

  const acceptSellerAgreement = useCallback(() => {
    setState((s) => ({
      ...s,
      seller: { ...s.seller, agreementAcceptedAt: new Date().toISOString() },
    }));
  }, []);

  const upsertListing = useCallback((l: SellerListing) => {
    setState((s) => {
      const exists = s.listings.some((x) => x.id === l.id);
      return {
        ...s,
        listings: exists
          ? s.listings.map((x) => (x.id === l.id ? l : x))
          : [l, ...s.listings],
      };
    });
  }, []);

  const removeListing = useCallback((id: string) => {
    setState((s) => ({ ...s, listings: s.listings.filter((l) => l.id !== id) }));
  }, []);

  const pauseSeller = useCallback(() => {
    setState((s) => ({ ...s, seller: { ...s.seller, status: "paused" } }));
  }, []);

  const resumeSeller = useCallback(() => {
    setState((s) => ({ ...s, seller: { ...s.seller, status: "verified" } }));
  }, []);

  const updateProfile = useCallback((patch: Partial<BuyerProfile>) => {
    setState((s) => {
      const next: BuyerProfile = {
        ...s.profile,
        ...patch,
        updated_at: new Date().toISOString(),
      };
      next.onboarding_confidence = computeConfidence(next);
      return { ...s, profile: next };
    });
  }, []);

  const completeOnboarding = useCallback((patch?: Partial<BuyerProfile>) => {
    setState((s) => {
      const next: BuyerProfile = {
        ...s.profile,
        ...(patch ?? {}),
        onboarding_completed: true,
        updated_at: new Date().toISOString(),
      };
      next.onboarding_confidence = computeConfidence(next);
      return { ...s, profile: next };
    });
  }, []);

  const resetOnboarding = useCallback(() => {
    setState((s) => ({ ...s, profile: EMPTY_PROFILE, dismissedPrompts: [] }));
  }, []);

  const trackSignal = useCallback((e: SignalEvent) => {
    setState((s) => ({ ...s, signals: applySignal(s.signals, e) }));
  }, []);

  const dismissPrompt = useCallback((id: string) => {
    setState((s) =>
      s.dismissedPrompts.includes(id)
        ? s
        : { ...s, dismissedPrompts: [...s.dismissedPrompts, id] },
    );
  }, []);

  const value = useMemo<StoreCtx>(
    () => ({
      ...state,
      toggleSave,
      pass,
      resetDeck,
      addToCart,
      removeFromCart,
      toggleCompare,
      setFilters,
      beginSellerOnboarding,
      saveSellerProfile,
      setVerificationState,
      setPayoutState,
      acceptSellerAgreement,
      upsertListing,
      removeListing,
      pauseSeller,
      resumeSeller,
      updateProfile,
      completeOnboarding,
      resetOnboarding,
      trackSignal,
      dismissPrompt,
    }),
    [
      state,
      toggleSave,
      pass,
      resetDeck,
      addToCart,
      removeFromCart,
      toggleCompare,
      setFilters,
      beginSellerOnboarding,
      saveSellerProfile,
      setVerificationState,
      setPayoutState,
      acceptSellerAgreement,
      upsertListing,
      removeListing,
      pauseSeller,
      resumeSeller,
      updateProfile,
      completeOnboarding,
      resetOnboarding,
      trackSignal,
      dismissPrompt,
    ],
  );

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useStore() {
  const v = useContext(Ctx);
  if (!v) throw new Error("useStore must be used inside StoreProvider");
  return v;
}
