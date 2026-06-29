import type { ReactNode } from "react";
import { Check } from "lucide-react";

export function OptionCard({
  icon,
  label,
  sub,
  selected,
  onClick,
}: {
  icon?: ReactNode;
  label: string;
  sub?: string;
  selected: boolean;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className={`group flex w-full items-center gap-4 rounded-2xl border px-4 py-4 text-left transition ${
        selected
          ? "border-foreground bg-foreground/[0.04]"
          : "border-border bg-surface hover:border-border-strong"
      }`}
    >
      {icon && (
        <span
          className={`grid h-10 w-10 shrink-0 place-items-center rounded-full border ${
            selected ? "border-foreground bg-foreground text-background" : "border-border bg-muted/50"
          }`}
        >
          {icon}
        </span>
      )}
      <span className="flex-1">
        <span className="block text-[15px] font-medium leading-tight">{label}</span>
        {sub && (
          <span className="mt-0.5 block text-[12px] leading-snug text-muted-foreground">{sub}</span>
        )}
      </span>
      <span
        className={`grid h-5 w-5 place-items-center rounded-full border ${
          selected ? "border-foreground bg-foreground text-background" : "border-border"
        }`}
      >
        {selected && <Check className="h-3 w-3" />}
      </span>
    </button>
  );
}

export function OptionChip({
  label,
  selected,
  onClick,
  tone = "default",
}: {
  label: string;
  selected: boolean;
  onClick: () => void;
  tone?: "default" | "muted";
}) {
  const base =
    "inline-flex shrink-0 items-center gap-1.5 rounded-full border px-3.5 py-2 text-[13px] transition";
  const cls = selected
    ? "border-foreground bg-foreground text-background"
    : tone === "muted"
      ? "border-border bg-muted/40 text-muted-foreground hover:text-foreground"
      : "border-border bg-surface text-foreground hover:border-border-strong";
  return (
    <button onClick={onClick} className={`${base} ${cls}`}>
      {label}
    </button>
  );
}
