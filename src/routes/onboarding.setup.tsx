import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { Sofa, Monitor, Headphones, Film, Disc3, Radio, Compass } from "lucide-react";
import {
  OnboardingShell,
  PrimaryAction,
} from "@/components/onboarding/onboarding-shell";
import { OptionCard } from "@/components/onboarding/option-card";
import { TOTAL_QUESTION_STEPS } from "@/lib/personalization/flow";
import { useStore } from "@/lib/store";
import type { SetupContext } from "@/lib/personalization/profile";

export const Route = createFileRoute("/onboarding/setup")({
  component: SetupScreen,
});

const OPTIONS: { id: SetupContext; label: string; sub: string; icon: any }[] = [
  { id: "two_channel", label: "Living room two-channel", sub: "Stereo, source-first listening", icon: Sofa },
  { id: "desktop", label: "Desktop / office", sub: "Near-field, compact, often powered", icon: Monitor },
  { id: "headphones", label: "Headphone rig", sub: "Headphones, DACs, amps", icon: Headphones },
  { id: "home_theater", label: "Home theater", sub: "Surround, AVR, subs", icon: Film },
  { id: "vinyl", label: "Vinyl system", sub: "Turntable, phono, cartridges", icon: Disc3 },
  { id: "studio", label: "Studio / critical listening", sub: "Monitors, treatment, accuracy", icon: Radio },
  { id: "exploring", label: "Just exploring", sub: "Keep recommendations wide", icon: Compass },
];

function SetupScreen() {
  const navigate = useNavigate();
  const { profile, updateProfile } = useStore();
  const [pick, setPick] = useState<SetupContext | null>(profile.setup_context);

  const next = () => {
    updateProfile({ setup_context: pick });
    navigate({ to: "/onboarding/preview" });
  };

  return (
    <OnboardingShell
      step={6}
      total={TOTAL_QUESTION_STEPS}
      eyebrow="Seven — Setup"
      title="What kind of setup are you building?"
      helper="Tunes Discover modules and pairing suggestions."
      onBack={() => navigate({ to: "/onboarding/exclusions" })}
      onSkip={() => navigate({ to: "/onboarding/preview" })}
      footer={<PrimaryAction onClick={next}>Continue</PrimaryAction>}
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
