import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import {
  OnboardingShell,
  PrimaryAction,
} from "@/components/onboarding/onboarding-shell";
import { OptionChip } from "@/components/onboarding/option-card";
import { TOTAL_QUESTION_STEPS } from "@/lib/personalization/flow";
import { CATEGORIES, type CategoryId } from "@/lib/catalog/categories";
import { useStore } from "@/lib/store";

export const Route = createFileRoute("/onboarding/categories")({
  component: CategoriesScreen,
});

function CategoriesScreen() {
  const navigate = useNavigate();
  const { profile, updateProfile } = useStore();
  const [picks, setPicks] = useState<CategoryId[]>(profile.interested_categories);
  const [unsure, setUnsure] = useState(picks.length === 0 && profile.openness_level === "broad");

  const toggle = (id: CategoryId) => {
    setUnsure(false);
    setPicks((p) => (p.includes(id) ? p.filter((x) => x !== id) : [...p, id]));
  };

  const next = () => {
    updateProfile({
      interested_categories: unsure ? [] : picks,
      openness_level: unsure ? "broad" : picks.length >= 5 ? "broad" : picks.length >= 2 ? "balanced" : "specific",
    });
    if (unsure || picks.length === 0) {
      navigate({ to: "/onboarding/brands" });
    } else {
      navigate({ to: "/onboarding/subcategories" });
    }
  };

  const skip = () => {
    updateProfile({ interested_categories: [], openness_level: "broad" });
    navigate({ to: "/onboarding/brands" });
  };

  return (
    <OnboardingShell
      step={1}
      total={TOTAL_QUESTION_STEPS}
      eyebrow="Two — Categories"
      title="What are you most interested in right now?"
      helper="Shapes Home, Marketplace chips, and Discover. Pick any number."
      onBack={() => navigate({ to: "/onboarding/intent" })}
      onSkip={skip}
      footer={
        <PrimaryAction onClick={next} disabled={!unsure && picks.length === 0}>
          Continue
        </PrimaryAction>
      }
    >
      <div className="flex flex-wrap gap-2">
        {CATEGORIES.map((c) => (
          <OptionChip
            key={c.id}
            label={c.label}
            selected={picks.includes(c.id) && !unsure}
            onClick={() => toggle(c.id)}
          />
        ))}
        <OptionChip
          label="Not sure yet"
          selected={unsure}
          onClick={() => {
            setUnsure((u) => !u);
            if (!unsure) setPicks([]);
          }}
        />
      </div>
    </OnboardingShell>
  );
}
