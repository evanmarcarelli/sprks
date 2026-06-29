// Shared onboarding flow ordering. Steps are 1-indexed in the UI; the welcome
// screen is step 0 and the preview is the terminal step.
export const STEPS = [
  { id: "intent", path: "/onboarding/intent" },
  { id: "categories", path: "/onboarding/categories" },
  { id: "subcategories", path: "/onboarding/subcategories" },
  { id: "brands", path: "/onboarding/brands" },
  { id: "budget", path: "/onboarding/budget" },
  { id: "exclusions", path: "/onboarding/exclusions" },
  { id: "setup", path: "/onboarding/setup" },
  { id: "preview", path: "/onboarding/preview" },
] as const;

export const TOTAL_QUESTION_STEPS = 7; // intent..setup; preview is the summary
