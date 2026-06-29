import { useState } from "react";
import { Plus, X } from "lucide-react";

export type Flaw = {
  id: string;
  x: number; // 0-100 %
  y: number; // 0-100 %
  severity: "cosmetic" | "light" | "noticeable" | "functional";
  note: string;
};

const SEVERITY = [
  { value: "cosmetic", label: "Cosmetic", tone: "bg-emerald-100 text-emerald-800 ring-emerald-200" },
  { value: "light", label: "Light wear", tone: "bg-amber-100 text-amber-800 ring-amber-200" },
  { value: "noticeable", label: "Noticeable", tone: "bg-orange-100 text-orange-800 ring-orange-200" },
  { value: "functional", label: "Functional", tone: "bg-rose-100 text-rose-800 ring-rose-200" },
] as const;

function Silhouette({ category }: { category: string }) {
  // Generic SVG silhouettes — bookshelf / floorstander / portable
  const isFloor = /floor/i.test(category);
  const isPortable = /portable|bluetooth/i.test(category);
  if (isPortable) {
    return (
      <rect x="34" y="20" width="32" height="60" rx="14" fill="currentColor" opacity="0.08" stroke="currentColor" strokeOpacity="0.25" />
    );
  }
  if (isFloor) {
    return (
      <>
        <rect x="30" y="6" width="40" height="88" rx="2" fill="currentColor" opacity="0.08" stroke="currentColor" strokeOpacity="0.25" />
        <circle cx="50" cy="22" r="6" fill="currentColor" opacity="0.15" />
        <circle cx="50" cy="44" r="9" fill="currentColor" opacity="0.15" />
        <circle cx="50" cy="68" r="11" fill="currentColor" opacity="0.15" />
      </>
    );
  }
  return (
    <>
      <rect x="22" y="18" width="56" height="64" rx="3" fill="currentColor" opacity="0.08" stroke="currentColor" strokeOpacity="0.25" />
      <circle cx="50" cy="38" r="6" fill="currentColor" opacity="0.15" />
      <circle cx="50" cy="60" r="12" fill="currentColor" opacity="0.15" />
    </>
  );
}

export function ConditionMap({
  category,
  flaws,
  onChange,
  noFlaws,
  onNoFlawsChange,
}: {
  category: string;
  flaws: Flaw[];
  onChange: (next: Flaw[]) => void;
  noFlaws: boolean;
  onNoFlawsChange: (v: boolean) => void;
}) {
  const [editing, setEditing] = useState<Flaw | null>(null);

  const addPin = (e: React.MouseEvent<SVGSVGElement>) => {
    if (noFlaws) return;
    const svg = e.currentTarget;
    const pt = svg.createSVGPoint();
    pt.x = e.clientX;
    pt.y = e.clientY;
    const ctm = svg.getScreenCTM();
    if (!ctm) return;
    const loc = pt.matrixTransform(ctm.inverse());
    const f: Flaw = {
      id: `flaw-${Date.now()}`,
      x: Math.round(loc.x),
      y: Math.round(loc.y),
      severity: "cosmetic",
      note: "",
    };
    onChange([...flaws, f]);
    setEditing(f);
  };

  const removePin = (id: string) => {
    onChange(flaws.filter((f) => f.id !== id));
    if (editing?.id === id) setEditing(null);
  };

  const updatePin = (next: Flaw) => {
    onChange(flaws.map((f) => (f.id === next.id ? next : f)));
    setEditing(next);
  };

  return (
    <div className="space-y-3">
      <label className="flex items-start gap-3 rounded-2xl border border-border bg-surface p-3">
        <input
          type="checkbox"
          checked={noFlaws}
          onChange={(e) => {
            onNoFlawsChange(e.target.checked);
            if (e.target.checked) onChange([]);
          }}
          className="mt-0.5 h-4 w-4 rounded border-border accent-foreground"
        />
        <span className="text-sm">No visible flaws — this unit presents as new.</span>
      </label>

      {!noFlaws && (
        <>
          <div className="rounded-2xl border border-border bg-surface p-4">
            <p className="mb-2 text-[11px] uppercase tracking-[0.16em] text-muted-foreground">
              Tap silhouette to drop a pin
            </p>
            <svg
              viewBox="0 0 100 100"
              onClick={addPin}
              className="mx-auto block aspect-square w-56 cursor-crosshair text-foreground"
            >
              <Silhouette category={category} />
              {flaws.map((f) => (
                <g key={f.id} onClick={(e) => { e.stopPropagation(); setEditing(f); }}>
                  <circle cx={f.x} cy={f.y} r="3.5" fill="hsl(var(--foreground))" />
                  <circle cx={f.x} cy={f.y} r="6" fill="none" stroke="hsl(var(--foreground))" strokeOpacity="0.3" />
                </g>
              ))}
            </svg>
            <p className="mt-2 text-center text-[11px] text-muted-foreground">
              {flaws.length} {flaws.length === 1 ? "blemish" : "blemishes"} mapped
            </p>
          </div>

          {flaws.length > 0 && (
            <ul className="space-y-2">
              {flaws.map((f, i) => {
                const sev = SEVERITY.find((s) => s.value === f.severity)!;
                return (
                  <li
                    key={f.id}
                    className="flex items-start justify-between gap-3 rounded-2xl border border-border bg-surface p-3"
                  >
                    <button onClick={() => setEditing(f)} className="flex-1 text-left">
                      <div className="flex items-center gap-2">
                        <span className="grid h-5 w-5 place-items-center rounded-full bg-foreground text-[10px] text-background">
                          {i + 1}
                        </span>
                        <span className={`rounded-full px-2 py-0.5 text-[10px] font-medium uppercase tracking-wider ring-1 ${sev.tone}`}>
                          {sev.label}
                        </span>
                      </div>
                      <p className="mt-1 text-xs text-muted-foreground">
                        {f.note || "Tap to add a note"}
                      </p>
                    </button>
                    <button onClick={() => removePin(f.id)} aria-label="Remove" className="text-muted-foreground">
                      <X className="h-4 w-4" />
                    </button>
                  </li>
                );
              })}
            </ul>
          )}

          <p className="flex items-center gap-1.5 text-[11px] text-muted-foreground">
            <Plus className="h-3 w-3" /> Tap the silhouette to add more pins.
          </p>
        </>
      )}

      {editing && (
        <div
          className="fixed inset-0 z-50 grid place-items-end bg-black/40 backdrop-blur-sm"
          onClick={() => setEditing(null)}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-[440px] rounded-t-3xl bg-background p-5 pb-[calc(env(safe-area-inset-bottom)+20px)]"
          >
            <div className="mx-auto mb-3 h-1 w-10 rounded-full bg-border-strong" />
            <p className="text-[11px] uppercase tracking-[0.18em] text-muted-foreground">Blemish detail</p>
            <h3 className="font-display text-xl">Describe what you see</h3>
            <div className="mt-4 space-y-3">
              <div className="flex flex-wrap gap-1.5">
                {SEVERITY.map((s) => (
                  <button
                    key={s.value}
                    onClick={() => updatePin({ ...editing, severity: s.value })}
                    className={`rounded-full border px-3 py-1.5 text-xs ${
                      editing.severity === s.value
                        ? "border-foreground bg-foreground text-background"
                        : "border-border bg-surface"
                    }`}
                  >
                    {s.label}
                  </button>
                ))}
              </div>
              <textarea
                rows={3}
                value={editing.note}
                onChange={(e) => updatePin({ ...editing, note: e.target.value })}
                placeholder="e.g. 4mm chip on top-left corner, finish only."
                className="block w-full rounded-xl border border-border bg-surface px-3.5 py-3 text-sm outline-none focus:border-foreground/40"
              />
              <button
                onClick={() => setEditing(null)}
                className="inline-flex w-full items-center justify-center rounded-full bg-foreground px-5 py-3 text-sm font-medium text-background"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export function ConditionMapView({ category, flaws }: { category: string; flaws: Flaw[] }) {
  if (!flaws?.length) return null;
  return (
    <div className="rounded-2xl border border-border bg-surface p-4">
      <svg viewBox="0 0 100 100" className="mx-auto block aspect-square w-44 text-foreground">
        <Silhouette category={category} />
        {flaws.map((f, i) => (
          <g key={f.id}>
            <circle cx={f.x} cy={f.y} r="3.5" fill="hsl(var(--foreground))" />
            <text x={f.x} y={f.y + 1.3} textAnchor="middle" fontSize="3.2" fill="white">{i + 1}</text>
          </g>
        ))}
      </svg>
      <ol className="mt-3 space-y-1.5 text-xs">
        {flaws.map((f, i) => (
          <li key={f.id} className="flex gap-2">
            <span className="grid h-4 w-4 shrink-0 place-items-center rounded-full bg-foreground text-[9px] text-background">
              {i + 1}
            </span>
            <span className="text-muted-foreground">
              <span className="capitalize text-foreground">{f.severity}</span> — {f.note || "no note"}
            </span>
          </li>
        ))}
      </ol>
    </div>
  );
}
