import { CATEGORIES, type CategoryId } from "@/lib/catalog/categories";

export function CategoryRail({
  active,
  onChange,
  className = "",
}: {
  active: CategoryId | null;
  onChange: (id: CategoryId | null) => void;
  className?: string;
}) {
  return (
    <div className={`no-scrollbar flex gap-1.5 overflow-x-auto ${className}`}>
      <Chip on={active === null} onClick={() => onChange(null)}>
        All
      </Chip>
      {CATEGORIES.map((c) => {
        const Icon = c.icon;
        const on = active === c.id;
        return (
          <Chip key={c.id} on={on} onClick={() => onChange(on ? null : c.id)}>
            <Icon className="h-3.5 w-3.5" />
            {c.shortLabel}
          </Chip>
        );
      })}
    </div>
  );
}

function Chip({
  on,
  onClick,
  children,
}: {
  on: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      onClick={onClick}
      className={`inline-flex shrink-0 items-center gap-1.5 rounded-full border px-3.5 py-1.5 text-[12px] transition ${
        on
          ? "border-foreground bg-foreground text-background"
          : "border-border bg-surface text-foreground"
      }`}
    >
      {children}
    </button>
  );
}
