import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import {
  OnboardingShell,
  PrimaryAction,
} from "@/components/onboarding/onboarding-shell";
import { TOTAL_QUESTION_STEPS } from "@/lib/personalization/flow";
import { BUDGET_BANDS } from "@/lib/personalization/profile";
import { useStore } from "@/lib/store";

export const Route = createFileRoute("/onboarding/budget")({
  component: BudgetScreen,
});

function BudgetScreen() {
  const navigate = useNavigate();
  const { profile, updateProfile } = useStore();
  const initial = profile.budget_preference.range
    ? BUDGET_BANDS.find(
        (b) =>
          b.range[0] === profile.budget_preference.range![0] &&
          b.range[1] === profile.budget_preference.range![1],
      )?.id ?? null
    : profile.budget_preference.mode === "per_category"
      ? "per_cat"
      : null;
  const [pick, setPick] = useState<string | null>(initial);

  const next = () => {
    if (pick === "per_cat") {
      updateProfile({ budget_preference: { mode: "per_category" } });
    } else {
      const band = BUDGET_BANDS.find((b) => b.id === pick);
      updateProfile({
        budget_preference: band
          ? { mode: "global", range: band.range }
          : { mode: "open" },
      });
    }
    navigate({ to: "/onboarding/exclusions" });
  };

  const skip = () => {
    updateProfile({ budget_preference: { mode: "open" } });
    navigate({ to: "/onboarding/exclusions" });
  };

  return (
    <OnboardingShell
      step={4}
      total={TOTAL_QUESTION_STEPS}
      eyebrow="Five — Budget"
      title="What range feels right right now?"
      helper="Sets defaults — search overrides this anytime."
      onBack={() => navigate({ to: "/onboarding/brands" })}
      onSkip={skip}
      footer={<PrimaryAction onClick={next}>Continue</PrimaryAction>}
    >
      <div className="space-y-2.5">
        {BUDGET_BANDS.map((b) => (
          <BudgetRow
            key={b.id}
            label={b.label}
            selected={pick === b.id}
            onClick={() => setPick(b.id)}
          />
        ))}
        <BudgetRow
          label="Depends on the category"
          selected={pick === "per_cat"}
          onClick={() => setPick("per_cat")}
          subtle
        />
      </div>
    </OnboardingShell>
  );
}

function BudgetRow({
  label,
  selected,
  onClick,
  subtle,
}: {
  label: string;
  selected: boolean;
  onClick: () => void;
  subtle?: boolean;
}) {
  return (
    <button
      onClick={onClick}
      className={`flex w-full items-center justify-between rounded-2xl border px-5 py-4 text-left transition ${
        selected
          ? "border-foreground bg-foreground/[0.04]"
          : "border-border bg-surface hover:border-border-strong"
      }`}
    >
      <span className={subtle ? "text-sm text-muted-foreground" : "text-[15px] font-medium"}>
        {label}
      </span>
      <span
        className={`h-2 w-2 rounded-full ${selected ? "bg-foreground" : "bg-border"}`}
      />
    </button>
  );
}
