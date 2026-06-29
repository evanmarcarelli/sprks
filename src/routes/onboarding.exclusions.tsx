import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import {
  OnboardingShell,
  PrimaryAction,
} from "@/components/onboarding/onboarding-shell";
import { OptionChip } from "@/components/onboarding/option-card";
import { TOTAL_QUESTION_STEPS } from "@/lib/personalization/flow";
import { useStore } from "@/lib/store";
import type { ExcludedListingType } from "@/lib/personalization/profile";

export const Route = createFileRoute("/onboarding/exclusions")({
  component: ExclusionsScreen,
});

const TYPES: { id: ExcludedListingType; label: string }[] = [
  { id: "entry", label: "Entry-level gear" },
  { id: "ultra_high_end", label: "Ultra high-end only" },
  { id: "used", label: "Used gear" },
  { id: "repair_needed", label: "Repair-needed" },
  { id: "diy", label: "DIY / custom builds" },
  { id: "local_only", label: "Local pickup only" },
  { id: "sold", label: "Sold listings" },
];

function ExclusionsScreen() {
  const navigate = useNavigate();
  const { profile, updateProfile } = useStore();
  const [picks, setPicks] = useState<ExcludedListingType[]>(profile.excluded_listing_types);
  const [brandText, setBrandText] = useState(profile.excluded_brands.join(", "));

  const toggle = (id: ExcludedListingType) => {
    setPicks((p) => (p.includes(id) ? p.filter((x) => x !== id) : [...p, id]));
  };

  const next = () => {
    updateProfile({
      excluded_listing_types: picks,
      excluded_brands: brandText
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean),
    });
    navigate({ to: "/onboarding/setup" });
  };

  const skip = () => navigate({ to: "/onboarding/setup" });

  return (
    <OnboardingShell
      step={5}
      total={TOTAL_QUESTION_STEPS}
      eyebrow="Six — Hide"
      title="Anything you don't want to see?"
      helper="Soft suppression — search still works if you ask for it directly."
      onBack={() => navigate({ to: "/onboarding/budget" })}
      onSkip={skip}
      footer={<PrimaryAction onClick={next}>Continue</PrimaryAction>}
    >
      <div className="space-y-5">
        <div className="flex flex-wrap gap-2">
          {TYPES.map((t) => (
            <OptionChip
              key={t.id}
              label={t.label}
              selected={picks.includes(t.id)}
              onClick={() => toggle(t.id)}
              tone="muted"
            />
          ))}
        </div>
        <div>
          <p className="text-[11px] uppercase tracking-[0.22em] text-muted-foreground">
            Brand exclusions
          </p>
          <input
            value={brandText}
            onChange={(e) => setBrandText(e.target.value)}
            placeholder="Comma-separated, e.g. Brand A, Brand B"
            className="mt-3 w-full rounded-2xl border border-border bg-surface px-4 py-3 text-sm outline-none placeholder:text-muted-foreground focus:border-foreground"
          />
        </div>
      </div>
    </OnboardingShell>
  );
}
