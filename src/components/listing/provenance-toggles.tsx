import {
  Package,
  Receipt,
  Cigarette,
  PawPrint,
  Headphones,
  User,
  ShieldCheck,
  Wrench,
  type LucideIcon,
} from "lucide-react";

export type ProvenanceTag =
  | "original_packaging"
  | "original_receipt"
  | "smoke_free"
  | "pet_free"
  | "dedicated_room"
  | "single_owner"
  | "under_warranty"
  | "recently_serviced";

export const PROVENANCE: { id: ProvenanceTag; label: string; icon: LucideIcon }[] = [
  { id: "original_packaging", label: "Original packaging", icon: Package },
  { id: "original_receipt", label: "Original receipt", icon: Receipt },
  { id: "smoke_free", label: "Smoke-free home", icon: Cigarette },
  { id: "pet_free", label: "Pet-free home", icon: PawPrint },
  { id: "dedicated_room", label: "Dedicated listening room", icon: Headphones },
  { id: "single_owner", label: "Single owner", icon: User },
  { id: "under_warranty", label: "Under warranty", icon: ShieldCheck },
  { id: "recently_serviced", label: "Recently serviced", icon: Wrench },
];

export function ProvenanceToggles({
  value,
  onChange,
}: {
  value: ProvenanceTag[];
  onChange: (next: ProvenanceTag[]) => void;
}) {
  const toggle = (id: ProvenanceTag) => {
    const set = new Set(value);
    if (set.has(id)) set.delete(id);
    else set.add(id);
    onChange(Array.from(set));
  };
  return (
    <div className="grid grid-cols-2 gap-2">
      {PROVENANCE.map((p) => {
        const on = value.includes(p.id);
        const Icon = p.icon;
        return (
          <button
            key={p.id}
            type="button"
            onClick={() => toggle(p.id)}
            className={`flex items-center gap-2.5 rounded-2xl border px-3 py-3 text-left text-xs transition ${
              on ? "border-foreground bg-foreground text-background" : "border-border bg-surface text-foreground"
            }`}
          >
            <Icon className="h-4 w-4 shrink-0" />
            <span className="leading-tight">{p.label}</span>
          </button>
        );
      })}
    </div>
  );
}

export function ProvenancePills({ value }: { value: ProvenanceTag[] }) {
  if (!value?.length) return null;
  return (
    <div className="flex flex-wrap gap-1.5">
      {PROVENANCE.filter((p) => value.includes(p.id)).map((p) => {
        const Icon = p.icon;
        return (
          <span
            key={p.id}
            className="inline-flex items-center gap-1 rounded-full border border-border bg-surface px-2.5 py-1 text-[11px] text-foreground"
          >
            <Icon className="h-3 w-3" />
            {p.label}
          </span>
        );
      })}
    </div>
  );
}
