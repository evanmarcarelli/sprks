import { AnimatePresence, motion } from "framer-motion";
import { X } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { ALL_LISTINGS, byCategory } from "@/lib/data/listings";
import { DEFAULT_FILTERS, useStore, type Filters } from "@/lib/store";
import {
  getCategory,
  type CategoryId,
  type FilterFieldDef,
} from "@/lib/catalog/categories";

const CONDITIONS = ["New", "Open Box", "Used — Mint", "Used — Good"];

export function FilterSheet({
  open,
  onClose,
  category,
}: {
  open: boolean;
  onClose: () => void;
  category?: CategoryId | null;
}) {
  const { filters, setFilters } = useStore();
  const [draft, setDraft] = useState<Filters>(filters);
  const [otherBrand, setOtherBrand] = useState("");

  useEffect(() => {
    if (open) setDraft(filters);
  }, [open, filters]);

  const cat = getCategory(category);
  const pool = category ? byCategory(category) : ALL_LISTINGS;
  const brands = useMemo(() => {
    return Array.from(new Set(pool.map((s) => s.brand))).sort();
  }, [pool]);

  const extra: FilterFieldDef[] = (cat?.filterSchema ?? []).filter(
    (f) => f.key !== "condition", // condition is rendered once globally
  );

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />
          <motion.div
            className="fixed inset-x-0 bottom-0 z-50 mx-auto max-h-[88vh] w-full max-w-[440px] overflow-hidden rounded-t-3xl bg-surface"
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            transition={{ type: "spring", damping: 30, stiffness: 320 }}
          >
            <div className="flex items-center justify-between border-b border-border px-5 py-4">
              <div>
                <h3 className="font-display text-xl">Filters</h3>
                {cat && (
                  <p className="mt-0.5 text-[11px] text-muted-foreground">
                    Tuned for {cat.label.toLowerCase()}
                  </p>
                )}
              </div>
              <button onClick={onClose} className="grid h-9 w-9 place-items-center rounded-full hover:bg-muted">
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="max-h-[calc(88vh-9rem)] space-y-7 overflow-y-auto px-5 py-5">
              <Section title="Price">
                <div className="space-y-2">
                  <input
                    type="range"
                    min={50}
                    max={20000}
                    step={50}
                    value={draft.priceMax}
                    onChange={(e) => setDraft({ ...draft, priceMax: Number(e.target.value) })}
                    className="w-full accent-foreground"
                  />
                  <div className="flex justify-between text-xs tabular text-muted-foreground">
                    <span>$50</span>
                    <span className="text-foreground">Up to ${draft.priceMax.toLocaleString()}</span>
                    <span>$20,000+</span>
                  </div>
                </div>
              </Section>

              <Section title="Brand">
                <ChipGroup
                  options={brands}
                  selected={draft.brands}
                  onChange={(b) => setDraft({ ...draft, brands: b })}
                />
                <div className="mt-2 flex gap-2">
                  <input
                    value={otherBrand}
                    onChange={(e) => setOtherBrand(e.target.value)}
                    placeholder="Other brand…"
                    className="flex-1 rounded-full border border-border bg-background px-3 py-1.5 text-xs outline-none"
                  />
                  <button
                    type="button"
                    onClick={() => {
                      const v = otherBrand.trim();
                      if (!v || draft.brands.includes(v)) return;
                      setDraft({ ...draft, brands: [...draft.brands, v] });
                      setOtherBrand("");
                    }}
                    className="rounded-full bg-foreground px-3 py-1.5 text-xs text-background"
                  >
                    Add
                  </button>
                </div>
              </Section>

              <Section title="Condition">
                <ChipGroup
                  options={CONDITIONS}
                  selected={draft.conditions}
                  onChange={(conditions) => setDraft({ ...draft, conditions })}
                />
              </Section>

              {extra.map((f) => (
                <Section key={f.key} title={f.label}>
                  {f.kind === "chips" && (
                    <ChipGroup
                      options={f.options}
                      selected={draft.categoryExtras?.[f.key] ?? []}
                      onChange={(v) =>
                        setDraft({
                          ...draft,
                          categoryExtras: { ...draft.categoryExtras, [f.key]: v },
                        })
                      }
                    />
                  )}
                  {f.kind === "toggle" && (
                    <ToggleRow
                      label={f.label}
                      value={!!draft.categoryExtras?.[f.key]?.length}
                      onChange={(v) =>
                        setDraft({
                          ...draft,
                          categoryExtras: { ...draft.categoryExtras, [f.key]: v ? ["on"] : [] },
                        })
                      }
                    />
                  )}
                  {f.kind === "range" && (
                    <p className="text-[11px] text-muted-foreground">
                      {f.label} range coming soon.
                    </p>
                  )}
                </Section>
              ))}

              <Section title="Preferences">
                <ToggleRow
                  label="Local pickup available"
                  value={draft.localPickup}
                  onChange={(v) => setDraft({ ...draft, localPickup: v })}
                />
                <ToggleRow
                  label="Verified seller or brand"
                  value={draft.verifiedOnly}
                  onChange={(v) => setDraft({ ...draft, verifiedOnly: v })}
                />
              </Section>
            </div>

            <div
              className="border-t border-border bg-background px-5 pt-3"
              style={{ paddingBottom: "calc(env(safe-area-inset-bottom) + 12px)" }}
            >
              <div className="flex gap-2">
                <button
                  onClick={() => setDraft(DEFAULT_FILTERS)}
                  className="flex-1 rounded-xl border border-border py-3 text-sm font-medium"
                >
                  Reset
                </button>
                <button
                  onClick={() => {
                    setFilters(draft);
                    onClose();
                  }}
                  className="flex-[2] rounded-xl bg-foreground py-3 text-sm font-medium text-background"
                >
                  Apply filters
                </button>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section>
      <h4 className="mb-3 text-[11px] uppercase tracking-[0.18em] text-muted-foreground">{title}</h4>
      {children}
    </section>
  );
}

function ChipGroup({
  options,
  selected,
  onChange,
}: {
  options: string[];
  selected: string[];
  onChange: (next: string[]) => void;
}) {
  return (
    <div className="flex flex-wrap gap-2">
      {options.map((opt) => {
        const on = selected.includes(opt);
        return (
          <button
            key={opt}
            onClick={() =>
              onChange(on ? selected.filter((s) => s !== opt) : [...selected, opt])
            }
            className={`rounded-full px-3 py-1.5 text-xs transition ${
              on
                ? "bg-foreground text-background"
                : "border border-border bg-surface text-foreground hover:bg-muted"
            }`}
          >
            {opt}
          </button>
        );
      })}
    </div>
  );
}

function ToggleRow({
  label,
  value,
  onChange,
}: {
  label: string;
  value: boolean;
  onChange: (v: boolean) => void;
}) {
  return (
    <label className="flex cursor-pointer items-center justify-between py-2.5">
      <span className="text-sm">{label}</span>
      <button
        type="button"
        onClick={() => onChange(!value)}
        className={`relative h-[26px] w-[44px] rounded-full transition ${value ? "bg-foreground" : "bg-border-strong"}`}
        aria-pressed={value}
      >
        <span
          className={`absolute top-[3px] h-5 w-5 rounded-full bg-background transition-all ${value ? "left-[21px]" : "left-[3px]"}`}
        />
      </button>
    </label>
  );
}
