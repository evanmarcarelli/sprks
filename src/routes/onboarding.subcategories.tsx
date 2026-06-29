import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import {
  OnboardingShell,
  PrimaryAction,
} from "@/components/onboarding/onboarding-shell";
import { OptionChip } from "@/components/onboarding/option-card";
import { TOTAL_QUESTION_STEPS } from "@/lib/personalization/flow";
import { CATEGORY_MAP, type CategoryId } from "@/lib/catalog/categories";
import { useStore } from "@/lib/store";

export const Route = createFileRoute("/onboarding/subcategories")({
  component: SubcategoriesScreen,
});

function SubcategoriesScreen() {
  const navigate = useNavigate();
  const { profile, updateProfile } = useStore();
  const [picks, setPicks] = useState<Partial<Record<CategoryId, string[]>>>(
    profile.interested_subcategories,
  );

  // If no categories chosen, skip forward.
  useEffect(() => {
    if (profile.interested_categories.length === 0) {
      navigate({ to: "/onboarding/brands" });
    }
  }, [profile.interested_categories.length, navigate]);

  const toggle = (cat: CategoryId, sub: string) => {
    setPicks((p) => {
      const existing = p[cat] ?? [];
      const next = existing.includes(sub)
        ? existing.filter((s) => s !== sub)
        : [...existing, sub];
      return { ...p, [cat]: next };
    });
  };

  const next = () => {
    updateProfile({ interested_subcategories: picks });
    navigate({ to: "/onboarding/brands" });
  };

  const skip = () => {
    updateProfile({ interested_subcategories: {} });
    navigate({ to: "/onboarding/brands" });
  };

  return (
    <OnboardingShell
      step={2}
      total={TOTAL_QUESTION_STEPS}
      eyebrow="Three — Refine"
      title="What are you browsing within those?"
      helper="Stronger signal than categories alone — pre-populates filters."
      onBack={() => navigate({ to: "/onboarding/categories" })}
      onSkip={skip}
      footer={<PrimaryAction onClick={next}>Continue</PrimaryAction>}
    >
      <div className="space-y-7">
        {profile.interested_categories.map((id) => {
          const cat = CATEGORY_MAP[id];
          if (!cat) return null;
          return (
            <section key={id}>
              <h3 className="text-[11px] uppercase tracking-[0.22em] text-muted-foreground">
                {cat.label}
              </h3>
              <div className="mt-3 flex flex-wrap gap-2">
                {cat.subcategories.map((s) => (
                  <OptionChip
                    key={s}
                    label={s}
                    selected={(picks[id] ?? []).includes(s)}
                    onClick={() => toggle(id, s)}
                  />
                ))}
              </div>
            </section>
          );
        })}
      </div>
    </OnboardingShell>
  );
}
