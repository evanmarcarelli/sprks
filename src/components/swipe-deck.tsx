import { AnimatePresence, animate, motion, useMotionValue, useTransform } from "framer-motion";
import { useMemo, useState } from "react";
import { Heart, X, ChevronUp, BadgeCheck } from "lucide-react";
import type { Speaker } from "@/lib/data/speakers";
import { ALL_LISTINGS, listingCategory } from "@/lib/data/listings";
import { getCategory, type CategoryId } from "@/lib/catalog/categories";
import { useStore, type Filters } from "@/lib/store";
import { rankListings } from "@/lib/personalization/selectors";

function applyFilters(list: Speaker[], f: Filters) {
  return list.filter((s) => {
    if (s.price > f.priceMax) return false;
    if (f.brands.length && !f.brands.includes(s.brand)) return false;
    if (f.conditions.length && !f.conditions.includes(s.condition)) return false;
    if (f.localPickup && !s.localPickup) return false;
    if (f.verifiedOnly && !s.verified) return false;
    return true;
  });
}

export function SwipeDeck({
  onOpenDetail,
  category,
}: {
  onOpenDetail: (s: Speaker) => void;
  category?: CategoryId | null;
}) {
  const { saved, passed, filters, profile, toggleSave, pass, resetDeck } = useStore();

  const deck = useMemo(() => {
    const source = category
      ? ALL_LISTINGS.filter((l) => listingCategory(l) === category)
      : ALL_LISTINGS;
    const filtered = applyFilters(source, filters);
    const personalized = rankListings(filtered, profile);
    return personalized.filter((s) => !passed.includes(s.id) && !saved.includes(s.id));
  }, [filters, passed, saved, category, profile]);

  if (deck.length === 0) {
    return <EmptyDeck onReset={resetDeck} />;
  }

  const visible = deck.slice(0, 3);

  return (
    <div className="relative mx-auto h-full w-full">
      <AnimatePresence initial={false}>
        {visible
          .map((speaker, idx) => (
            <SwipeCard
              key={speaker.id}
              speaker={speaker}
              index={idx}
              total={visible.length}
              onSave={() => toggleSave(speaker.id)}
              onPass={() => pass(speaker.id)}
              onOpen={() => onOpenDetail(speaker)}
            />
          ))
          .reverse()}
      </AnimatePresence>
    </div>
  );
}

function SwipeCard({
  speaker,
  index,
  onSave,
  onPass,
  onOpen,
}: {
  speaker: Speaker;
  index: number;
  total: number;
  onSave: () => void;
  onPass: () => void;
  onOpen: () => void;
}) {
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const rotate = useTransform(x, [-220, 0, 220], [-14, 0, 14]);
  const saveOpacity = useTransform(x, [40, 140], [0, 1]);
  const passOpacity = useTransform(x, [-140, -40], [1, 0]);
  const [savedPulse, setSavedPulse] = useState(false);

  const isTop = index === 0;
  const scale = 1 - index * 0.04;
  const translateY = index * 10;

  const cat = getCategory(listingCategory(speaker));
  const meta = cat?.cardMeta(speaker as any).filter(Boolean) ?? [];

  return (
    <motion.div
      className="absolute inset-0 flex items-center justify-center"
      style={{ zIndex: 10 - index }}
      initial={{ scale: 0.92, opacity: 0, y: 20 }}
      animate={{ scale, opacity: 1, y: translateY }}
      exit={{
        x: x.get() > 0 ? 600 : x.get() < 0 ? -600 : 0,
        y: y.get() < -80 ? -600 : 0,
        opacity: 0,
        transition: { duration: 0.28 },
      }}
      transition={{ type: "spring", damping: 28, stiffness: 280 }}
    >
      <motion.article
        className="relative h-full w-full overflow-hidden rounded-3xl border border-border bg-surface shadow-[0_24px_60px_-20px_rgba(0,0,0,0.25)]"
        style={isTop ? { x, y, rotate } : undefined}
        drag={isTop ? true : false}
        dragConstraints={{ top: -200, bottom: 0, left: 0, right: 0 }}
        dragElastic={0.6}
        onDragEnd={(_, info) => {
          if (info.offset.x > 120 || info.velocity.x > 600) {
            setSavedPulse(true);
            setTimeout(onSave, 180);
          } else if (info.offset.x < -120 || info.velocity.x < -600) {
            onPass();
          } else if (info.offset.y < -120 || info.velocity.y < -500) {
            animate(y, 0, { type: "spring", stiffness: 300, damping: 30 });
            animate(x, 0, { type: "spring", stiffness: 300, damping: 30 });
            onOpen();
          } else {
            animate(y, 0, { type: "spring", stiffness: 300, damping: 30 });
            animate(x, 0, { type: "spring", stiffness: 300, damping: 30 });
          }
        }}
        whileTap={isTop ? { cursor: "grabbing" } : undefined}
      >
        <div className="absolute inset-0 overflow-hidden">
          <div
            aria-hidden
            className="absolute inset-0"
            style={{
              background:
                "linear-gradient(135deg, oklch(0.32 0.02 260) 0%, oklch(0.18 0.01 260) 55%, oklch(0.1 0.005 260) 100%)",
            }}
          />
          <img
            src={speaker.image}
            alt={`${speaker.brand} ${speaker.model}`}
            className="relative h-full w-full object-cover"
            draggable={false}
            onError={(e) => {
              (e.currentTarget as HTMLImageElement).style.display = "none";
            }}
          />
          <div className="pointer-events-none absolute inset-x-0 top-0 h-32 bg-gradient-to-b from-black/55 to-transparent" />
          <div className="pointer-events-none absolute inset-x-0 bottom-0 h-[58%] bg-gradient-to-t from-black/85 via-black/55 to-transparent" />
        </div>

        <div className="absolute left-4 top-4 flex gap-1.5">
          {cat && <Chip>{cat.shortLabel}</Chip>}
          <Chip>{speaker.condition}</Chip>
          {speaker.verified && (
            <Chip>
              <BadgeCheck className="h-3 w-3" /> Verified
            </Chip>
          )}
        </div>

        {isTop && (
          <>
            <motion.div
              style={{ opacity: saveOpacity }}
              className="absolute right-4 top-16 rounded-md border-2 border-teal px-2.5 py-1 text-xs font-bold uppercase tracking-widest text-teal"
            >
              Save
            </motion.div>
            <motion.div
              style={{ opacity: passOpacity }}
              className="absolute left-4 top-16 rounded-md border-2 border-white/80 px-2.5 py-1 text-xs font-bold uppercase tracking-widest text-white/80"
            >
              Pass
            </motion.div>
          </>
        )}

        {savedPulse && (
          <div className="pointer-events-none absolute inset-0 grid place-items-center">
            {[0, 1, 2].map((i) => (
              <motion.span
                key={i}
                className="absolute rounded-full border border-teal"
                initial={{ width: 40, height: 40, opacity: 0.8 }}
                animate={{ width: 260, height: 260, opacity: 0 }}
                transition={{ duration: 0.7, delay: i * 0.08, ease: "easeOut" }}
              />
            ))}
          </div>
        )}

        <div className="absolute inset-x-0 bottom-0 p-5 pb-7 text-white">
          <div className="flex items-baseline justify-between gap-3">
            <p className="text-[11px] uppercase tracking-[0.22em] text-white/70">
              {speaker.brand}
            </p>
            <p className="tabular text-base font-medium">
              ${speaker.price.toLocaleString()}
            </p>
          </div>
          <h3 className="font-display text-[28px] leading-tight">{speaker.model}</h3>
          <p className="mt-0.5 text-xs text-white/70">
            {meta.length ? meta.join(" · ") : `${speaker.type} · ${speaker.finish}`}
          </p>
          <div className="mt-3 flex flex-wrap gap-1.5">
            {speaker.tags.slice(0, 3).map((t) => (
              <span
                key={t}
                className="rounded-full border border-white/20 bg-white/10 px-2 py-1 text-[11px] text-white/85 backdrop-blur"
              >
                {t}
              </span>
            ))}
          </div>
          {isTop && (
            <button
              onClick={onOpen}
              className="mt-3 flex items-center gap-1 rounded-full bg-white/15 px-3 py-1.5 text-[11px] font-medium text-white backdrop-blur"
            >
              <ChevronUp className="h-3.5 w-3.5" />
              Swipe up for details
            </button>
          )}
        </div>

        {isTop && (
          <div className="absolute right-3 top-3 flex flex-col gap-2">
            <button
              onClick={onPass}
              className="grid h-10 w-10 place-items-center rounded-full border border-white/25 bg-black/35 text-white backdrop-blur transition active:scale-95"
              aria-label="Pass"
            >
              <X className="h-4 w-4" />
            </button>
            <button
              onClick={() => {
                setSavedPulse(true);
                setTimeout(onSave, 180);
              }}
              className="grid h-10 w-10 place-items-center rounded-full bg-white text-black shadow-lg transition active:scale-95"
              aria-label="Save"
            >
              <Heart className="h-4 w-4" />
            </button>
          </div>
        )}
      </motion.article>
    </motion.div>
  );
}

function Chip({ children }: { children: React.ReactNode }) {
  return (
    <span className="flex items-center gap-1 rounded-full bg-background/85 px-2.5 py-1 text-[10.5px] font-medium tracking-wide backdrop-blur">
      {children}
    </span>
  );
}

function EmptyDeck({ onReset }: { onReset: () => void }) {
  return (
    <div className="flex h-full flex-col items-center justify-center px-8 text-center">
      <div className="flex gap-1">
        {[0, 1, 2, 3, 4].map((i) => (
          <span
            key={i}
            className="eq-bar w-[3px] rounded-full bg-teal"
            style={{ height: 28, animationDelay: `${i * 0.12}s` }}
          />
        ))}
      </div>
      <h3 className="mt-6 font-display text-2xl">You've seen today's picks</h3>
      <p className="mt-2 max-w-xs text-sm text-muted-foreground">
        Switch category or reset the deck for another round.
      </p>
      <button
        onClick={onReset}
        className="mt-6 rounded-full bg-foreground px-5 py-2.5 text-sm font-medium text-background"
      >
        Reshuffle deck
      </button>
    </div>
  );
}
