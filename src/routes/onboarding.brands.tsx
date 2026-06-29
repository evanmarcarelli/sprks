import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Search, Sparkles, X } from "lucide-react";
import {
  OnboardingShell,
  PrimaryAction,
} from "@/components/onboarding/onboarding-shell";
import { OptionChip } from "@/components/onboarding/option-card";
import { TOTAL_QUESTION_STEPS } from "@/lib/personalization/flow";
import { FEATURED_BRANDS, BRAND_GROUPS, ALL_BRANDS } from "@/lib/catalog/brands";
import { useStore } from "@/lib/store";

export const Route = createFileRoute("/onboarding/brands")({
  component: BrandsScreen,
});

const EASE = [0.22, 1, 0.36, 1] as const;

function BrandsScreen() {
  const navigate = useNavigate();
  const { profile, updateProfile } = useStore();
  const [picks, setPicks] = useState<string[]>(profile.favorite_brands);
  const [open, setOpen] = useState(
    profile.openness_level === "broad" && profile.favorite_brands.length === 0,
  );
  const [query, setQuery] = useState("");
  const [sheetOpen, setSheetOpen] = useState(false);

  const toggle = (b: string) => {
    setOpen(false);
    setPicks((p) => (p.includes(b) ? p.filter((x) => x !== b) : [...p, b]));
  };

  const clearAll = () => {
    setPicks([]);
    setOpen(false);
  };

  const next = () => {
    updateProfile({
      favorite_brands: open ? [] : picks,
      openness_level: open ? "broad" : profile.openness_level,
    });
    navigate({ to: "/onboarding/budget" });
  };

  const skip = () => {
    updateProfile({ favorite_brands: [], openness_level: "broad" });
    navigate({ to: "/onboarding/budget" });
  };

  const selectedCount = open ? 0 : picks.length;

  return (
    <OnboardingShell
      step={3}
      total={TOTAL_QUESTION_STEPS}
      eyebrow="Four — Brands"
      title="Which brands do you gravitate toward?"
      helper="Pick a few — SPKRS uses this to tune Home, Marketplace, and Discover. It's a signal, not a filter."
      onBack={() => navigate({ to: "/onboarding/subcategories" })}
      onSkip={skip}
      footer={
        <PrimaryAction onClick={next}>
          {selectedCount > 0
            ? `Continue · ${selectedCount} selected`
            : open
              ? "Continue — stay open"
              : "Continue"}
        </PrimaryAction>
      }
    >
      <div className="space-y-7">
        {/* Stay-open toggle */}
        <button
          onClick={() => {
            setOpen((o) => !o);
            if (!open) setPicks([]);
          }}
          className={`flex w-full items-start gap-3 rounded-2xl border px-4 py-3.5 text-left transition ${
            open
              ? "border-foreground bg-foreground/[0.04]"
              : "border-border bg-surface hover:border-border-strong"
          }`}
        >
          <span
            className={`mt-0.5 grid h-5 w-5 shrink-0 place-items-center rounded-full border ${
              open ? "border-foreground bg-foreground text-background" : "border-border"
            }`}
          >
            <Sparkles className="h-3 w-3" />
          </span>
          <span className="flex-1">
            <span className="block text-[14px] font-medium leading-tight">
              I'm open — surprise me
            </span>
            <span className="mt-0.5 block text-[12px] leading-snug text-muted-foreground">
              SPKRS will mix in brands across the audiophile landscape.
            </span>
          </span>
        </button>

        {/* Featured */}
        <section>
          <header className="mb-3 flex items-baseline justify-between">
            <h2 className="text-[10.5px] uppercase tracking-[0.22em] text-muted-foreground">
              Featured brands
            </h2>
            {selectedCount > 0 && (
              <button
                onClick={clearAll}
                className="inline-flex items-center gap-1 text-[11px] text-muted-foreground transition hover:text-foreground"
              >
                <X className="h-3 w-3" /> Clear
              </button>
            )}
          </header>
          <div className="flex flex-wrap gap-2">
            {FEATURED_BRANDS.map((b) => (
              <OptionChip
                key={b}
                label={b}
                selected={!open && picks.includes(b)}
                onClick={() => toggle(b)}
              />
            ))}
          </div>
        </section>

        {/* Browse all */}
        <section>
          <button
            onClick={() => setSheetOpen(true)}
            className="flex w-full items-center justify-between rounded-2xl border border-border bg-surface px-4 py-3.5 text-left transition hover:border-border-strong"
          >
            <span>
              <span className="block text-[14px] font-medium">Browse all brands</span>
              <span className="mt-0.5 block text-[12px] text-muted-foreground">
                {ALL_BRANDS.length} brands across speakers, electronics, headphones, digital, analog, cables
              </span>
            </span>
            <Search className="h-4 w-4 text-muted-foreground" />
          </button>

          {/* Selected outside featured */}
          {(() => {
            const extra = picks.filter((p) => !FEATURED_BRANDS.includes(p));
            if (open || extra.length === 0) return null;
            return (
              <div className="mt-4">
                <p className="mb-2 text-[10.5px] uppercase tracking-[0.22em] text-muted-foreground">
                  Also selected
                </p>
                <div className="flex flex-wrap gap-2">
                  {extra.map((b) => (
                    <OptionChip key={b} label={b} selected onClick={() => toggle(b)} />
                  ))}
                </div>
              </div>
            );
          })()}
        </section>
      </div>

      <AnimatePresence>
        {sheetOpen && (
          <BrandSheet
            query={query}
            setQuery={setQuery}
            picks={open ? [] : picks}
            toggle={toggle}
            onClose={() => setSheetOpen(false)}
          />
        )}
      </AnimatePresence>
    </OnboardingShell>
  );
}

function BrandSheet({
  query,
  setQuery,
  picks,
  toggle,
  onClose,
}: {
  query: string;
  setQuery: (s: string) => void;
  picks: string[];
  toggle: (b: string) => void;
  onClose: () => void;
}) {
  const q = query.trim().toLowerCase();

  const filteredGroups = useMemo(() => {
    if (!q) return BRAND_GROUPS;
    return BRAND_GROUPS.map((g) => ({
      ...g,
      brands: g.brands.filter((b) => b.toLowerCase().includes(q)),
    })).filter((g) => g.brands.length > 0);
  }, [q]);

  return (
    <motion.div
      className="fixed inset-0 z-50 flex items-end justify-center"
      initial={{ backgroundColor: "rgba(0,0,0,0)" }}
      animate={{ backgroundColor: "rgba(0,0,0,0.5)" }}
      exit={{ backgroundColor: "rgba(0,0,0,0)" }}
      transition={{ duration: 0.25, ease: EASE }}
    >
      <button
        aria-label="Close"
        onClick={onClose}
        className="absolute inset-0 cursor-default"
      />
      <motion.div
        initial={{ y: "100%" }}
        animate={{ y: 0 }}
        exit={{ y: "100%" }}
        transition={{ duration: 0.36, ease: EASE }}
        className="relative z-10 flex h-[88svh] w-full max-w-[440px] flex-col rounded-t-3xl border border-border bg-background"
      >
        {/* Handle */}
        <div className="flex justify-center pt-2.5">
          <span className="h-1 w-10 rounded-full bg-border" />
        </div>

        <div className="flex items-center justify-between px-5 pb-3 pt-3">
          <div>
            <p className="text-[10.5px] uppercase tracking-[0.22em] text-muted-foreground">
              Browse brands
            </p>
            <h3 className="mt-0.5 font-display text-[20px] leading-tight">All brands</h3>
          </div>
          <button
            onClick={onClose}
            className="grid h-9 w-9 place-items-center rounded-full hover:bg-muted/60"
            aria-label="Close"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <div className="px-5 pb-3">
          <div className="flex items-center gap-2 rounded-full border border-border bg-surface px-4 py-2.5">
            <Search className="h-4 w-4 text-muted-foreground" />
            <input
              autoFocus
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search brands"
              className="flex-1 bg-transparent text-sm outline-none placeholder:text-muted-foreground"
            />
            {query && (
              <button
                onClick={() => setQuery("")}
                className="grid h-5 w-5 place-items-center rounded-full text-muted-foreground hover:text-foreground"
                aria-label="Clear search"
              >
                <X className="h-3 w-3" />
              </button>
            )}
          </div>
        </div>

        <div className="flex-1 overflow-y-auto px-5 pb-[calc(env(safe-area-inset-bottom)+96px)] pt-2">
          {filteredGroups.length === 0 ? (
            <p className="py-10 text-center text-sm text-muted-foreground">
              No brands match "{query}".
            </p>
          ) : (
            <div className="space-y-7">
              {filteredGroups.map((g) => (
                <section key={g.id}>
                  <h4 className="mb-2.5 text-[10.5px] uppercase tracking-[0.22em] text-muted-foreground">
                    {g.label}
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {g.brands.map((b) => (
                      <OptionChip
                        key={b}
                        label={b}
                        selected={picks.includes(b)}
                        onClick={() => toggle(b)}
                      />
                    ))}
                  </div>
                </section>
              ))}
            </div>
          )}
        </div>

        <div className="pointer-events-none absolute bottom-0 left-0 right-0 bg-gradient-to-t from-background via-background/95 to-transparent px-5 pb-[calc(env(safe-area-inset-bottom)+16px)] pt-4">
          <button
            onClick={onClose}
            className="pointer-events-auto inline-flex w-full items-center justify-center rounded-full bg-foreground px-5 py-3.5 text-sm font-medium text-background"
          >
            Done · {picks.length} selected
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
}
