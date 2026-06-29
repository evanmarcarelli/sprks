import { AnimatePresence, motion } from "framer-motion";
import { X, BadgeCheck, MapPin } from "lucide-react";
import type { Speaker } from "@/lib/data/speakers";
import { SPEAKERS } from "@/lib/data/speakers";
import {
  findMatchingListings,
  getMarketStats,
  confidenceScore,
} from "@/lib/marketplace/compare";

export function ComparePanel({
  speaker,
  onClose,
  onOpenListing,
}: {
  speaker: Speaker | null;
  onClose: () => void;
  onOpenListing?: (s: Speaker) => void;
}) {
  return (
    <AnimatePresence>
      {speaker && (
        <>
          <motion.div
            className="fixed inset-0 z-[60] bg-black/40 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />
          <motion.div
            className="fixed inset-x-0 bottom-0 z-[60] mx-auto max-h-[92vh] w-full max-w-2xl overflow-hidden rounded-t-3xl bg-surface"
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            transition={{ type: "spring", damping: 32, stiffness: 320 }}
          >
            <ComparePanelBody
              speaker={speaker}
              onClose={onClose}
              onOpenListing={onOpenListing}
            />
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

function ComparePanelBody({
  speaker,
  onClose,
  onOpenListing,
}: {
  speaker: Speaker;
  onClose: () => void;
  onOpenListing?: (s: Speaker) => void;
}) {
  const listings = findMatchingListings(speaker, SPEAKERS);
  const stats = getMarketStats(listings);

  return (
    <div className="flex max-h-[92vh] flex-col">
      <header className="flex items-start justify-between gap-3 border-b border-border px-5 py-4">
        <div className="min-w-0">
          <p className="text-[10.5px] uppercase tracking-[0.2em] text-muted-foreground">
            {speaker.brand}
          </p>
          <h2 className="font-display text-2xl leading-tight">{speaker.model}</h2>
          <p className="mt-1 text-[11px] text-muted-foreground">
            {stats.count} listings · transparent market view
          </p>
        </div>
        <button
          onClick={onClose}
          className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-muted"
          aria-label="Close"
        >
          <X className="h-4 w-4" />
        </button>
      </header>

      <div className="flex-1 overflow-y-auto pb-8">
        {/* Stats row */}
        <div className="grid grid-cols-3 divide-x divide-border border-b border-border bg-surface-elev">
          <Stat label="Low" value={`$${stats.minPrice.toLocaleString()}`} />
          <Stat label="Median" value={`$${stats.medianPrice.toLocaleString()}`} />
          <Stat label="High" value={`$${stats.maxPrice.toLocaleString()}`} />
        </div>

        <section className="px-5 py-5">
          <h3 className="mb-3 text-[11px] uppercase tracking-[0.18em] text-muted-foreground">
            All current listings
          </h3>
          <ul className="space-y-2.5">
            {listings.map((l) => {
              const delta = l.price - stats.medianPrice;
              const conf = confidenceScore(speaker, l);
              return (
                <li key={l.id}>
                  <button
                    onClick={() => onOpenListing?.(l)}
                    className="flex w-full gap-3 rounded-2xl border border-border bg-surface p-2.5 text-left"
                  >
                    <img
                      src={l.image}
                      alt=""
                      className="h-20 w-20 shrink-0 rounded-xl object-cover"
                    />
                    <div className="flex flex-1 flex-col justify-between">
                      <div>
                        <div className="flex items-center justify-between gap-2">
                          <p className="flex items-center gap-1 text-[13px] font-medium">
                            {l.seller.name}
                            {l.verified && (
                              <BadgeCheck className="h-3.5 w-3.5 text-teal" />
                            )}
                          </p>
                          <p className="tabular text-[14px] font-medium">
                            ${l.price.toLocaleString()}
                          </p>
                        </div>
                        <p className="mt-0.5 flex items-center gap-1 text-[11px] text-muted-foreground">
                          <MapPin className="h-3 w-3" />
                          {l.seller.location}
                        </p>
                      </div>
                      <div className="mt-1.5 flex items-center justify-between text-[10.5px]">
                        <div className="flex flex-wrap gap-1">
                          <Pill>{l.condition}</Pill>
                          <Pill>{l.finish}</Pill>
                          {l.localPickup && <Pill>Local pickup</Pill>}
                        </div>
                        <span
                          className={`tabular ${
                            delta > 0
                              ? "text-muted-foreground"
                              : delta < 0
                                ? "text-teal"
                                : "text-muted-foreground"
                          }`}
                        >
                          {delta === 0
                            ? "at median"
                            : delta > 0
                              ? `+$${delta.toLocaleString()} vs median`
                              : `−$${Math.abs(delta).toLocaleString()} vs median`}
                        </span>
                      </div>
                      <p className="mt-1 text-[10px] text-muted-foreground">
                        {conf >= 0.95 ? "Exact match" : "Likely match"}
                      </p>
                    </div>
                  </button>
                </li>
              );
            })}
          </ul>
        </section>

        <section className="px-5 pb-5">
          <h3 className="mb-2 text-[11px] uppercase tracking-[0.18em] text-muted-foreground">
            Why prices vary
          </h3>
          <ul className="space-y-1.5 rounded-2xl border border-border bg-surface-elev px-4 py-3 text-[12.5px] text-muted-foreground">
            <li>Condition differences across listings.</li>
            <li>Verified sellers may price slightly higher for buyer protection.</li>
            <li>Local pickup vs shipping changes total landed cost.</li>
            <li>Finish, accessories, and original packaging influence value.</li>
          </ul>
        </section>
      </div>
    </div>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="px-3 py-3 text-center">
      <p className="text-[10px] uppercase tracking-[0.18em] text-muted-foreground">
        {label}
      </p>
      <p className="tabular mt-0.5 text-base font-medium">{value}</p>
    </div>
  );
}

function Pill({ children }: { children: React.ReactNode }) {
  return (
    <span className="rounded-full border border-border bg-surface px-2 py-0.5 text-[10px]">
      {children}
    </span>
  );
}
