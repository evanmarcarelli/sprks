import { useEffect, useMemo, useReducer } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { useStore } from "@/lib/store";
import { CATEGORY_MAP } from "@/lib/catalog/categories";

type Phase = "lock" | "calibrate" | "tune" | "handoff";

const ease = [0.22, 1, 0.36, 1] as const;

const PHASE_MS: Record<Phase, number> = {
  lock: 750,
  calibrate: 1300,
  tune: 850,
  handoff: 700,
};

const NEXT: Record<Phase, Phase> = {
  lock: "calibrate",
  calibrate: "tune",
  tune: "handoff",
  handoff: "handoff",
};

const CAPTIONS: Record<Phase, string> = {
  lock: "Locking in your preferences",
  calibrate: "Calibrating signal",
  tune: "Tuning to your taste",
  handoff: "SPKRS, tuned",
};

export function CalibrationTransition({ onDone }: { onDone: () => void }) {
  const reduce = useReducedMotion();
  const { profile } = useStore();
  const [phase, advance] = useReducer((p: Phase): Phase => NEXT[p], "lock");

  // Compact list of preference markers — categories + brands + setup
  const chips = useMemo(() => {
    const out: string[] = [];
    profile.interested_categories.forEach((id) => {
      const c = CATEGORY_MAP[id];
      if (c) out.push(c.shortLabel);
    });
    profile.favorite_brands.slice(0, 4).forEach((b) => out.push(b));
    if (profile.setup_context) out.push(profile.setup_context.replace(/_/g, " "));
    return out.slice(0, 8);
  }, [profile]);

  useEffect(() => {
    if (reduce) {
      const t = setTimeout(onDone, 600);
      return () => clearTimeout(t);
    }
    if (phase === "handoff") {
      const t = setTimeout(onDone, PHASE_MS.handoff);
      return () => clearTimeout(t);
    }
    const t = setTimeout(advance, PHASE_MS[phase]);
    return () => clearTimeout(t);
  }, [phase, reduce, onDone]);

  if (reduce) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[100] grid place-items-center bg-[#06070A] text-white"
      >
        <p className="text-[11px] uppercase tracking-[0.3em] text-white/60">
          Tuning SPKRS
        </p>
      </motion.div>
    );
  }

  const reveal = phase === "handoff";

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.4, ease }}
      className="fixed inset-0 z-[100] overflow-hidden bg-[#06070A] text-white"
    >
      {/* Radial vignette */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(120% 80% at 50% 50%, transparent 0%, rgba(6,7,10,0.6) 70%, rgba(6,7,10,1) 100%)",
        }}
      />

      {/* Phase 1 — preference chips condensing inward */}
      <AnimatePresence>
        {phase === "lock" && (
          <motion.div
            key="chips"
            className="absolute inset-0 grid place-items-center"
            exit={{ opacity: 0, transition: { duration: 0.3 } }}
          >
            <div className="relative h-[260px] w-[260px]">
              {chips.map((label, i) => {
                const angle = (i / Math.max(chips.length, 1)) * Math.PI * 2;
                const radius = 120;
                const x = Math.cos(angle) * radius;
                const y = Math.sin(angle) * radius;
                return (
                  <motion.span
                    key={`${label}-${i}`}
                    initial={{ x, y, opacity: 0, scale: 0.9 }}
                    animate={{ x: 0, y: 0, opacity: [0, 1, 0.9, 0], scale: [0.9, 1, 0.6] }}
                    transition={{
                      duration: 0.7,
                      ease,
                      delay: i * 0.04,
                      times: [0, 0.25, 0.7, 1],
                    }}
                    className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 whitespace-nowrap rounded-full border border-white/15 bg-white/[0.04] px-2.5 py-1 text-[10.5px] capitalize text-white/80 backdrop-blur-sm"
                  >
                    {label}
                  </motion.span>
                );
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Phase 2-3 — calibration rings + waveform */}
      <svg
        className="pointer-events-none absolute inset-0 h-full w-full"
        viewBox="0 0 100 100"
        preserveAspectRatio="xMidYMid slice"
        aria-hidden
      >
        <defs>
          <radialGradient id="calHalo" cx="50%" cy="50%" r="55%">
            <stop offset="0%" stopColor="var(--teal)" stopOpacity="0.55" />
            <stop offset="55%" stopColor="var(--teal)" stopOpacity="0.08" />
            <stop offset="100%" stopColor="var(--teal)" stopOpacity="0" />
          </radialGradient>
        </defs>

        {/* Halo bloom */}
        <motion.circle
          cx="50"
          cy="50"
          r="42"
          fill="url(#calHalo)"
          initial={{ opacity: 0 }}
          animate={{
            opacity:
              phase === "lock"
                ? 0.15
                : phase === "calibrate"
                  ? [0.2, 0.9, 0.55]
                  : phase === "tune"
                    ? 0.5
                    : 0.0,
          }}
          transition={{ duration: 1.0, ease }}
        />

        {/* Expanding calibration rings */}
        {(phase === "calibrate" || phase === "tune" || phase === "handoff") &&
          [0, 0.18, 0.36, 0.54].map((d, i) => (
            <motion.circle
              key={i}
              cx="50"
              cy="50"
              r="2"
              fill="none"
              stroke="white"
              strokeOpacity={0.55}
              strokeWidth={0.28}
              initial={{ scale: 0, opacity: 0 }}
              animate={{
                scale: phase === "handoff" ? [12, 60] : [0, 18],
                opacity: phase === "handoff" ? [0.5, 0] : [0.6, 0],
              }}
              transition={{
                duration: phase === "handoff" ? 0.9 : 1.7,
                ease,
                delay: phase === "handoff" ? 0 : d,
                repeat: phase === "calibrate" || phase === "tune" ? Infinity : 0,
              }}
              style={{ transformOrigin: "50% 50%" }}
            />
          ))}

        {/* Stable inner ring — the lock target */}
        {(phase === "calibrate" || phase === "tune") && (
          <motion.circle
            cx="50"
            cy="50"
            r="14"
            fill="none"
            stroke="white"
            strokeWidth={0.3}
            strokeDasharray="0.6 0.9"
            initial={{ opacity: 0, scale: 0.7, rotate: 0 }}
            animate={{
              opacity: 0.4,
              scale: 1,
              rotate: phase === "tune" ? 0 : 360,
            }}
            transition={{
              opacity: { duration: 0.6, ease },
              scale: { duration: 0.6, ease },
              rotate: { duration: 6, ease: "linear", repeat: Infinity },
            }}
            style={{ transformOrigin: "50% 50%" }}
          />
        )}
      </svg>

      {/* Center waveform — settles from agitated to steady */}
      <div className="absolute inset-0 grid place-items-center">
        <CalibrationWave phase={phase} />
      </div>

      {/* Caption */}
      <div className="absolute inset-x-0 bottom-[calc(env(safe-area-inset-bottom)+72px)] flex flex-col items-center gap-3">
        <AnimatePresence mode="wait">
          <motion.p
            key={phase}
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: reveal ? 0.95 : 0.7, y: 0 }}
            exit={{ opacity: 0, y: -4 }}
            transition={{ duration: 0.4, ease }}
            className="text-[11px] uppercase tracking-[0.32em] text-white/70"
          >
            {CAPTIONS[phase]}
          </motion.p>
        </AnimatePresence>
        <motion.div
          initial={{ scaleX: 0 }}
          animate={{
            scaleX:
              phase === "lock"
                ? 0.2
                : phase === "calibrate"
                  ? 0.55
                  : phase === "tune"
                    ? 0.88
                    : 1,
          }}
          transition={{ duration: 0.6, ease }}
          className="h-px w-32 origin-left bg-white/40"
          style={{ boxShadow: "0 0 8px color-mix(in oklab, var(--teal) 80%, transparent)" }}
        />
      </div>

      {/* Subtle grain */}
      <svg
        className="pointer-events-none absolute inset-0 h-full w-full opacity-[0.06] mix-blend-overlay"
        aria-hidden
      >
        <filter id="cal-n">
          <feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="2" stitchTiles="stitch" />
        </filter>
        <rect width="100%" height="100%" filter="url(#cal-n)" />
      </svg>
    </motion.div>
  );
}

function CalibrationWave({ phase }: { phase: Phase }) {
  // 32 vertical bars; amplitude is high during calibrate, settles in tune,
  // collapses to flat line on handoff.
  const bars = 32;
  const active = phase === "calibrate";
  const settling = phase === "tune";
  const flat = phase === "handoff";
  return (
    <div className="flex h-16 w-[min(72vw,300px)] items-center justify-between gap-[3px]">
      {Array.from({ length: bars }).map((_, i) => {
        const center = Math.abs(i - bars / 2) / (bars / 2); // 0 center, 1 edge
        const envelope = 1 - center * 0.65;
        const base = 6 + envelope * 26;
        const settled = 4 + envelope * 10;
        return (
          <motion.span
            key={i}
            className="block w-[2px] rounded-full bg-white/80"
            style={{
              boxShadow:
                "0 0 6px color-mix(in oklab, var(--teal) 70%, transparent)",
            }}
            initial={{ height: 2, opacity: 0.6 }}
            animate={{
              height: flat
                ? 1.5
                : settling
                  ? settled
                  : active
                    ? [4, base, 6, base * 0.7, base, 4]
                    : 6,
              opacity: flat ? 0.3 : settling ? 0.85 : active ? [0.5, 1, 0.7, 1, 0.5] : 0.6,
            }}
            transition={{
              duration: active ? 0.9 : flat ? 0.5 : 0.6,
              ease: active ? "easeInOut" : ease,
              repeat: active ? Infinity : 0,
              delay: active ? (i % 6) * 0.05 : 0,
            }}
          />
        );
      })}
    </div>
  );
}
