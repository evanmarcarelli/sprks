import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { ShoppingBag, Tag, GitCompare, Layers, Compass } from "lucide-react";
import {
  OnboardingShell,
  PrimaryAction,
} from "@/components/onboarding/onboarding-shell";
import { OptionCard } from "@/components/onboarding/option-card";
import { TOTAL_QUESTION_STEPS } from "@/lib/personalization/flow";
import { useStore } from "@/lib/store";
import type { PrimaryIntent } from "@/lib/personalization/profile";

export const Route = createFileRoute("/onboarding/intent")({
  component: IntentScreen,
});

const OPTIONS: { id: PrimaryIntent; label: string; sub: string; icon: any }[] = [
  { id: "buy", label: "Buy gear", sub: "Find a specific piece to add to your setup", icon: ShoppingBag },
  { id: "sell", label: "Sell gear", sub: "List something to verified SPKRS buyers", icon: Tag },
  { id: "compare", label: "Compare options", sub: "Weigh listings of the same model", icon: GitCompare },
  { id: "build", label: "Build a system", sub: "Pair components into a coherent rig", icon: Layers },
  { id: "browse", label: "Browse & discover", sub: "Stay open — show me what's good", icon: Compass },
];

function IntentScreen() {
  const navigate = useNavigate();
  const { profile, updateProfile } = useStore();
  const [pick, setPick] = useState<PrimaryIntent | null>(profile.primary_intent);

  const next = () => {
    if (!pick) return;
    updateProfile({ primary_intent: pick, seller_interest: pick === "sell" });
    navigate({ to: "/onboarding/categories" });
  };

  return (
    <OnboardingShell
      step={0}
      total={TOTAL_QUESTION_STEPS}
      eyebrow="One — Intent"
      title="What brings you to SPKRS right now?"
      helper="Sets the tone of your home feed and where you'll land first."
      onBack={() => navigate({ to: "/welcome" })}
      footer={
        <PrimaryAction onClick={next} disabled={!pick}>
          Continue
        </PrimaryAction>
      }
    >
      <div className="space-y-2.5">
        {OPTIONS.map((o) => {
          const Icon = o.icon;
          return (
            <OptionCard
              key={o.id}
              icon={<Icon className="h-4 w-4" />}
              label={o.label}
              sub={o.sub}
              selected={pick === o.id}
              onClick={() => setPick(o.id)}
            />
          );
        })}
      </div>
    </OnboardingShell>
  );
}
