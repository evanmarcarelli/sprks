import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { AnimatePresence } from "framer-motion";
import { Sparkles } from "lucide-react";
import {
  OnboardingShell,
  PrimaryAction,
  GhostAction,
} from "@/components/onboarding/onboarding-shell";
import { CalibrationTransition } from "@/components/onboarding/calibration-transition";
import { TOTAL_QUESTION_STEPS } from "@/lib/personalization/flow";
import { previewStatements } from "@/lib/personalization/copy";
import { routeAfterOnboarding } from "@/lib/personalization/selectors";
import { CATEGORY_MAP } from "@/lib/catalog/categories";
import { useStore } from "@/lib/store";

export const Route = createFileRoute("/onboarding/preview")({
  component: PreviewScreen,
});

function PreviewScreen() {
  const navigate = useNavigate();
  const { profile, completeOnboarding } = useStore();
  const [calibrating, setCalibrating] = useState(false);

  const enter = () => {
    completeOnboarding();
    setCalibrating(true);
  };

  const finish = () => {
    const dest = routeAfterOnboarding(profile);
    navigate({ to: dest.to });
  };

  const statements = previewStatements(profile);
  const catLabels = profile.interested_categories
    .map((id) => CATEGORY_MAP[id]?.shortLabel)
    .filter(Boolean) as string[];

  return (
    <>
    <AnimatePresence>
      {calibrating && <CalibrationTransition key="cal" onDone={finish} />}
    </AnimatePresence>
    <OnboardingShell
      step={TOTAL_QUESTION_STEPS}
      total={TOTAL_QUESTION_STEPS}
      eyebrow="Personalized"
      title="Here's how SPKRS will feel for you."
      helper="You can adjust any of this later from your profile."
      onBack={() => navigate({ to: "/onboarding/setup" })}
      footer={
        <>
          <PrimaryAction onClick={enter}>Enter SPKRS</PrimaryAction>
          <GhostAction onClick={() => navigate({ to: "/onboarding/intent" })}>
            Adjust preferences
          </GhostAction>
        </>
      }
    >
      <div className="space-y-6">
        <section className="rounded-3xl border border-border bg-surface p-5">
          <div className="flex items-center gap-2 text-[10.5px] uppercase tracking-[0.22em] text-muted-foreground">
            <Sparkles className="h-3.5 w-3.5 text-teal" />
            Your tuning
          </div>
          <ul className="mt-3 space-y-2">
            {statements.map((s, i) => (
              <li key={i} className="flex gap-2 text-sm leading-relaxed">
                <span className="mt-2 inline-block h-1 w-1 shrink-0 rounded-full bg-teal" />
                <span>{s}</span>
              </li>
            ))}
          </ul>
        </section>

        <section className="space-y-3 rounded-3xl border border-border bg-paper p-5">
          <SummaryRow label="Intent" value={profile.primary_intent ?? "—"} />
          <SummaryRow label="Categories" value={catLabels.length ? catLabels.join(", ") : "Open"} />
          <SummaryRow
            label="Budget"
            value={
              profile.budget_preference.range
                ? `$${profile.budget_preference.range[0].toLocaleString()} – $${profile.budget_preference.range[1].toLocaleString()}`
                : profile.budget_preference.mode === "per_category"
                  ? "Per category"
                  : "Open"
            }
          />
          <SummaryRow
            label="Brands"
            value={
              profile.favorite_brands.length
                ? profile.favorite_brands.join(", ")
                : profile.openness_level === "broad"
                  ? "Open"
                  : "—"
            }
          />
          <SummaryRow
            label="Setup"
            value={profile.setup_context ? prettySetup(profile.setup_context) : "—"}
          />
          {profile.excluded_listing_types.length > 0 && (
            <SummaryRow label="Muted" value={profile.excluded_listing_types.join(", ")} />
          )}
        </section>

        <p className="text-center text-[11px] text-muted-foreground">
          Profile confidence · {Math.round(profile.onboarding_confidence * 100)}%
        </p>
      </div>
    </OnboardingShell>
    </>
  );
}

function SummaryRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-start justify-between gap-4 text-[13px]">
      <span className="shrink-0 text-muted-foreground capitalize">{label}</span>
      <span className="max-w-[65%] text-right font-medium capitalize">{value}</span>
    </div>
  );
}

function prettySetup(s: string): string {
  return s.replace(/_/g, " ");
}
