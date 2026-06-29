import { AnimatePresence, motion } from "framer-motion";
import { X, Heart, GitCompare, ShoppingBag, BadgeCheck, MapPin, Database } from "lucide-react";
import { useState } from "react";
import type { Speaker } from "@/lib/data/speakers";
import { useStore } from "@/lib/store";
import { FrequencyCurve } from "./audio-motifs";
import { ZoomImage } from "./listing/zoom-image";
import { findOfficialSpecs } from "@/lib/data/speaker-specs";
import { CompareSummary } from "./marketplace/compare-summary";
import { ComparePanel } from "./marketplace/compare-panel";

export function DetailDrawer({
  speaker,
  onClose,
}: {
  speaker: Speaker | null;
  onClose: () => void;
}) {
  const { saved, cart, compare, toggleSave, addToCart, toggleCompare } = useStore();
  const [compareOpen, setCompareOpen] = useState(false);

  return (
    <AnimatePresence>
      {speaker && (
        <>
          <motion.div
            className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />
          <motion.div
            className="fixed inset-x-0 bottom-0 z-50 mx-auto max-h-[92vh] w-full max-w-2xl overflow-hidden rounded-t-3xl bg-surface shadow-2xl"
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            transition={{ type: "spring", damping: 32, stiffness: 320 }}
            drag="y"
            dragConstraints={{ top: 0, bottom: 0 }}
            dragElastic={{ top: 0, bottom: 0.4 }}
            onDragEnd={(_, info) => {
              if (info.offset.y > 140 || info.velocity.y > 500) onClose();
            }}
          >
            <div className="flex items-center justify-between px-4 pb-1 pt-3">
              <div className="mx-auto h-1 w-10 rounded-full bg-border-strong" />
            </div>
            <button
              onClick={onClose}
              className="absolute right-3 top-3 z-10 grid h-9 w-9 place-items-center rounded-full bg-background/80 backdrop-blur"
              aria-label="Close"
            >
              <X className="h-4 w-4" />
            </button>

            <div className="max-h-[calc(92vh-3rem)] overflow-y-auto pb-32">
              <ZoomImage src={speaker.image} alt={speaker.model} className="aspect-[4/3] w-full" />


              <div className="px-5 pt-5">
                <div className="flex items-baseline justify-between gap-3">
                  <div>
                    <p className="text-[11px] uppercase tracking-[0.18em] text-muted-foreground">
                      {speaker.brand}
                    </p>
                    <h2 className="font-display text-3xl leading-tight">{speaker.model}</h2>
                  </div>
                  <p className="tabular text-xl font-medium">
                    ${speaker.price.toLocaleString()}
                  </p>
                </div>

                <div className="mt-3 flex flex-wrap gap-1.5">
                  <Badge>{speaker.condition}</Badge>
                  <Badge>{speaker.type}</Badge>
                  <Badge>{speaker.finish}</Badge>
                  {speaker.tags.map((t) => (
                    <Badge key={t} tone="muted">
                      {t}
                    </Badge>
                  ))}
                </div>

                <p className="mt-5 text-[15px] leading-relaxed text-muted-foreground">
                  {speaker.description}
                </p>

                <section className="mt-7">
                  <h3 className="mb-2 text-xs uppercase tracking-[0.18em] text-muted-foreground">
                    Frequency response
                  </h3>
                  <div className="rounded-2xl border border-border bg-surface-elev p-4">
                    <FrequencyCurve className="h-16 w-full text-teal" />
                    <div className="mt-1 flex justify-between text-[10px] tabular text-muted-foreground">
                      <span>20 Hz</span>
                      <span>1 kHz</span>
                      <span>20 kHz</span>
                    </div>
                  </div>
                </section>

                {(() => {
                  const official = findOfficialSpecs(speaker.brand, speaker.model);
                  return (
                    <section className="mt-7">
                      <div className="mb-2 flex items-center justify-between">
                        <h3 className="text-xs uppercase tracking-[0.18em] text-muted-foreground">
                          Specifications
                        </h3>
                        {official && (
                          <span className="inline-flex items-center gap-1 rounded-full bg-teal-soft px-2 py-0.5 text-[10px] uppercase tracking-wider">
                            <Database className="h-3 w-3" /> Sourced
                          </span>
                        )}
                      </div>
                      <dl className="divide-y divide-border rounded-2xl border border-border bg-surface-elev">
                        {Object.entries(speaker.specs).map(([k, v]) => (
                          <div key={k} className="flex items-center justify-between px-4 py-3">
                            <dt className="text-sm capitalize text-muted-foreground">{k}</dt>
                            <dd className="tabular text-sm">{String(v)}</dd>
                          </div>
                        ))}
                      </dl>
                      {official && (
                        <p className="mt-1.5 px-1 text-[10.5px] text-muted-foreground">
                          Verified against {official.source}.
                        </p>
                      )}
                    </section>
                  );
                })()}

                <div className="mt-7">
                  <CompareSummary speaker={speaker} onOpen={() => setCompareOpen(true)} />
                </div>

                <section className="mt-7">
                  <h3 className="mb-2 text-xs uppercase tracking-[0.18em] text-muted-foreground">
                    Seller
                  </h3>
                  <div className="flex items-center justify-between rounded-2xl border border-border bg-surface-elev px-4 py-3">
                    <div>
                      <p className="flex items-center gap-1.5 text-sm font-medium">
                        {speaker.seller.name}
                        {speaker.verified && <BadgeCheck className="h-4 w-4 text-teal" />}
                      </p>
                      <p className="mt-0.5 flex items-center gap-1 text-xs text-muted-foreground">
                        <MapPin className="h-3 w-3" />
                        {speaker.seller.location}
                      </p>
                    </div>
                    <p className="tabular text-sm">★ {speaker.seller.rating.toFixed(2)}</p>
                  </div>
                </section>
              </div>
            </div>

            <div
              className="absolute inset-x-0 bottom-0 border-t border-border bg-background/95 px-4 pt-3 backdrop-blur"
              style={{ paddingBottom: "calc(env(safe-area-inset-bottom) + 12px)" }}
            >
              <div className="grid grid-cols-3 gap-2">
                <ActionBtn
                  active={saved.includes(speaker.id)}
                  onClick={() => toggleSave(speaker.id)}
                  icon={<Heart className="h-4 w-4" />}
                  label="Save"
                />
                <ActionBtn
                  active={compare.includes(speaker.id)}
                  onClick={() => toggleCompare(speaker.id)}
                  icon={<GitCompare className="h-4 w-4" />}
                  label="Compare"
                />
                <ActionBtn
                  primary
                  active={cart.includes(speaker.id)}
                  onClick={() => addToCart(speaker.id)}
                  icon={<ShoppingBag className="h-4 w-4" />}
                  label={cart.includes(speaker.id) ? "In cart" : "Add to cart"}
                />
              </div>
            </div>
          </motion.div>
          <ComparePanel
            speaker={compareOpen ? speaker : null}
            onClose={() => setCompareOpen(false)}
          />
        </>
      )}
    </AnimatePresence>
  );
}

function ActionBtn({
  icon,
  label,
  onClick,
  active,
  primary,
}: {
  icon: React.ReactNode;
  label: string;
  onClick: () => void;
  active?: boolean;
  primary?: boolean;
}) {
  const base = "flex items-center justify-center gap-1.5 rounded-xl py-3 text-[13px] font-medium transition-all";
  const cls = primary
    ? "bg-foreground text-background hover:opacity-90"
    : active
      ? "bg-teal-soft text-foreground"
      : "border border-border bg-surface hover:bg-muted";
  return (
    <button onClick={onClick} className={`${base} ${cls}`}>
      {icon}
      {label}
    </button>
  );
}

function Badge({ children, tone = "default" }: { children: React.ReactNode; tone?: "default" | "muted" }) {
  return (
    <span
      className={`rounded-full px-2.5 py-1 text-[11px] tracking-wide ${
        tone === "muted"
          ? "bg-muted text-muted-foreground"
          : "border border-border text-foreground"
      }`}
    >
      {children}
    </span>
  );
}
