import { useCallback, useEffect, useRef, useState } from "react";
import {
  AnimatePresence,
  motion,
  useAnimationControls,
  useReducedMotion,
} from "framer-motion";

type AnimationControls = ReturnType<typeof useAnimationControls>;

type Phase = "appear" | "bursting" | "open" | "spin" | "settle";

// Small helper — safe vibration trigger. Browsers without the API silently no-op.
function haptic(pattern: number | number[]) {
  if (typeof window === "undefined") return;
  const nav = window.navigator as Navigator & { vibrate?: (p: number | number[]) => boolean };
  try {
    nav.vibrate?.(pattern);
  } catch {
    /* noop */
  }
}

const ease = [0.22, 1, 0.36, 1] as const;

/**
 * SPKRS intro sequence — premium hi-fi opening.
 *
 * Rhythm (speaker calibration / startup):
 *   appear → pulse · pulse  →  pulse · pulse  →  PULSE → open
 *
 * Sound energy (rings + halo + driver micro-excursion) stays alive the entire time.
 * The final pulse expands and *becomes* the welcome background so the handoff is seamless.
 */
export function IntroSequence({ onDone }: { onDone: () => void }) {
  const reduce = useReducedMotion();
  const [phase, setPhase] = useState<Phase>("appear");
  const [pulses, setPulses] = useState<{ id: number; intensity: number }[]>([]);
  const pulseIdRef = useRef(0);
  const topCtrl = useAnimationControls();
  const botCtrl = useAnimationControls();

  const firePulse = useCallback(
    (intensity = 1) => {
      pulseIdRef.current += 1;
      const id = pulseIdRef.current;
      setPulses((prev) => [...prev.slice(-6), { id, intensity }]);
      const amp = 1 + 0.1 * intensity;
      const dip = 1 - 0.03 * intensity;
      const dur = 0.55 + 0.25 * intensity;
      topCtrl.start({
        scale: [1, amp, dip, 1],
        transition: { duration: dur, ease },
      });
      botCtrl.start({
        scale: [1, amp, dip, 1],
        transition: { duration: dur, ease, delay: 0.04 },
      });
      // Haptic thump — small bump for soft pulses, longer "boom" pattern for the final hit.
      if (intensity >= 2) {
        haptic([24, 40, 60]);
      } else {
        haptic(Math.round(22 + intensity * 14));
      }
    },
    [topCtrl, botCtrl],
  );

  useEffect(() => {
    if (reduce) {
      const t = setTimeout(onDone, 600);
      return () => clearTimeout(t);
    }
    const timers: ReturnType<typeof setTimeout>[] = [];
    const at = (ms: number, fn: () => void) => timers.push(setTimeout(fn, ms));

    // Phase 1 — appear and emit 2 pulses
    at(900, () => setPhase("bursting"));
    at(1000, () => firePulse(1));
    at(1500, () => firePulse(1));

    // Phase 2 — another 2 pulses
    at(2250, () => firePulse(1));
    at(2750, () => firePulse(1));

    // Phase 3 — final pulse + transition open
    at(3500, () => {
      setPhase("open");
      firePulse(2.4);
    });
    // Phase 4 — cabinet rotates to its side
    at(4400, () => {
      setPhase("spin");
      haptic([10, 30, 10]);
    });
    // Phase 5 — settle (door-open feeling) then hand off to welcome
    at(5200, () => setPhase("settle"));
    at(5900, () => onDone());

    return () => timers.forEach(clearTimeout);
  }, [reduce, onDone, firePulse]);

  if (reduce) {
    return (
      <div className="relative mx-auto h-svh w-full max-w-[440px] overflow-hidden bg-[#06070A] text-white">
        <SpeakerBackdrop revealLevel={1} />
        <div className="absolute inset-0 grid place-items-center">
          <h1
            className="font-display tracking-tight"
            style={{ fontSize: "clamp(56px, 18vw, 110px)", lineHeight: 1 }}
          >
            SPKRS
          </h1>
        </div>
      </div>
    );
  }

  const wordOn = phase === "open";
  // During open the cabinet softens slightly; during spin/settle it tilts away.
  const revealLevel = phase === "settle" ? 0.45 : phase === "spin" ? 0.75 : phase === "open" ? 0.9 : 1;

  return (
    <div
      className="relative mx-auto h-svh w-full max-w-[440px] overflow-hidden bg-[#06070A] text-white"
      onClick={() => {
        if (phase !== "settle") onDone();
      }}
    >
      <Vignette />

      {/* Always-on ambient resonance — present from frame 1 to handoff */}
      <ResonanceField intensity={phase === "appear" ? "quiet" : "ambient"} withSpeakers={false} />

      {/* The dual-driver cabinet */}
      <DualSpeaker
        phase={phase}
        topCtrl={topCtrl}
        botCtrl={botCtrl}
        revealLevel={revealLevel}
      />

      {/* One ring-pair per pulse — emitted from each driver */}
      <svg
        className="pointer-events-none absolute inset-0 h-full w-full"
        viewBox="0 0 100 100"
        preserveAspectRatio="xMidYMid slice"
        aria-hidden
      >
        <AnimatePresence>
          {pulses.flatMap((p) =>
            [
              { cy: 36, key: `${p.id}-t` },
              { cy: 64, key: `${p.id}-b` },
            ].map((src) => (
              <motion.circle
                key={src.key}
                cx="50"
                cy={src.cy}
                r="3"
                fill="none"
                stroke="white"
                initial={{ scale: 0, opacity: 0.7, strokeWidth: 0.5 }}
                animate={{
                  scale: [0, 14 * p.intensity],
                  opacity: [0.7, 0],
                  strokeWidth: [0.5, 0.2],
                }}
                exit={{ opacity: 0 }}
                transition={{ duration: 1.4 + 0.4 * p.intensity, ease }}
                style={{ transformOrigin: `50% ${src.cy}%` }}
              />
            )),
          )}
        </AnimatePresence>

        {/* Final pulse — single massive ring that becomes the welcome background */}
        {phase === "open" && (
          <motion.circle
            cx="50"
            cy="50"
            r="4"
            fill="none"
            stroke="white"
            initial={{ scale: 0, opacity: 0.85, strokeWidth: 0.7 }}
            animate={{ scale: [0, 38], opacity: [0.85, 0], strokeWidth: [0.7, 0.15] }}
            transition={{ duration: 1.6, ease }}
            style={{ transformOrigin: "50% 50%" }}
          />
        )}
      </svg>

      {/* Wordmark emerges from the final pulse */}
      <AnimatePresence>
        {wordOn && (
          <motion.div
            key="word"
            initial={{ opacity: 0, scale: 1.1, filter: "blur(18px)", letterSpacing: "0.18em" }}
            animate={{
              opacity: 1,
              scale: 1,
              y: 0,
              filter: "blur(0px)",
              letterSpacing: "0.02em",
            }}
            exit={{ opacity: 0, scale: 0.9, filter: "blur(8px)", transition: { duration: 0.5, ease } }}
            transition={{ duration: 0.85, ease }}
            className="absolute inset-0 grid place-items-center"
          >
            <div className="flex flex-col items-center gap-3">
              <h1
                className="font-display tracking-tight"
                style={{ fontSize: "clamp(64px, 22vw, 132px)", lineHeight: 1 }}
              >
                SPKRS
              </h1>
              <motion.span
                initial={{ opacity: 0, scale: 0.6 }}
                animate={{ opacity: [0, 0.9, 0.6], scale: [0.6, 1.4, 1] }}
                transition={{ duration: 1.0, ease, delay: 0.2 }}
                className="h-1 w-1 rounded-full bg-teal"
                style={{ boxShadow: "0 0 16px 3px var(--teal)" }}
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <Grain />

      {phase !== "settle" && (
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.4 }}
          transition={{ duration: 1.2, delay: 0.8 }}
          className="absolute bottom-10 left-0 right-0 text-center text-[10.5px] uppercase tracking-[0.3em] text-white/40"
        >
          tap to continue
        </motion.p>
      )}
    </div>
  );
}

/**
 * Dual stacked drivers inside a faint cabinet — the visual centerpiece of the intro.
 * Always slightly breathing; sharp scale bumps on pulse via injected controls.
 */
function DualSpeaker({
  phase,
  topCtrl,
  botCtrl,
  revealLevel,
}: {
  phase: Phase;
  topCtrl: AnimationControls;
  botCtrl: AnimationControls;
  revealLevel: number;
}) {
  const visible = phase !== "settle";
  // Hand-off rotation: front-on while bursting/open, spun to ~80° on "spin" so the cabinet
  // shows its side edge — the welcome page then appears "through" that side.
  const rotateY =
    phase === "spin" ? -78 : phase === "settle" ? -88 : phase === "open" ? -8 : 0;
  const cabScale = phase === "spin" ? 0.92 : phase === "open" ? 1.06 : 1;
  const cabX = phase === "spin" ? "-18%" : "0%";
  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          key="cab"
          initial={{ opacity: 0, scale: 0.95, y: 6 }}
          animate={{ opacity: revealLevel, scale: cabScale, y: 0, x: cabX, rotateY }}
          exit={{ opacity: 0, rotateY: -92, x: "-40%", transition: { duration: 0.7, ease } }}
          transition={{ duration: 0.85, ease }}
          className="absolute inset-0 grid place-items-center"
          style={{ perspective: 1400, transformStyle: "preserve-3d" }}
        >
          <motion.div
            className="relative"
            style={{
              width: "min(72vw, 280px)",
              aspectRatio: "0.5 / 1",
              borderRadius: 30,
              background:
                "linear-gradient(180deg, #14171d 0%, #0c0e13 50%, #07080c 100%)",
              boxShadow:
                "inset 0 1px 0 rgba(255,255,255,0.08), inset 0 0 0 1px rgba(255,255,255,0.06), 0 40px 90px -20px rgba(0,0,0,0.85)",
              transformStyle: "preserve-3d",
            }}
            // Subtle constant micro-vibration so it feels alive
            animate={{ x: [0, -0.4, 0.4, -0.2, 0], y: [0, 0.2, -0.2, 0.15, 0] }}
            transition={{ duration: 0.32, ease: "easeInOut", repeat: Infinity }}
          >
            {/* Wood-grain / brushed front baffle texture */}
            <div
              className="pointer-events-none absolute inset-0 rounded-[30px]"
              aria-hidden
              style={{
                background:
                  "repeating-linear-gradient(180deg, rgba(255,255,255,0.018) 0 2px, rgba(0,0,0,0.04) 2px 4px)",
                mixBlendMode: "overlay",
              }}
            />
            {/* Driver mounting baffle inset — makes the front feel like a real plate */}
            <div
              className="pointer-events-none absolute inset-x-[6%] inset-y-[4%] rounded-[24px]"
              aria-hidden
              style={{
                boxShadow:
                  "inset 0 0 0 1px rgba(255,255,255,0.04), inset 0 2px 12px rgba(0,0,0,0.55)",
              }}
            />

            {/* Tweeter (top, smaller) + Woofer (bottom, larger) — proper two-way layout */}
            <Driver position="top" controls={topCtrl} kind="tweeter" />
            <Driver position="bottom" controls={botCtrl} kind="woofer" />

            {/* Bass-reflex port between the drivers */}
            <div
              className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full"
              aria-hidden
              style={{
                width: "10%",
                aspectRatio: "1 / 1",
                background:
                  "radial-gradient(circle at 50% 40%, #05060a 0%, #000 70%)",
                boxShadow:
                  "inset 0 2px 6px rgba(0,0,0,0.95), inset 0 0 0 1px rgba(255,255,255,0.06), 0 1px 0 rgba(255,255,255,0.04)",
              }}
            />

            {/* Brand plate */}
            <div
              className="absolute left-1/2 bottom-[3.5%] -translate-x-1/2 text-[7px] font-display uppercase tracking-[0.42em]"
              aria-hidden
              style={{ color: "rgba(255,255,255,0.32)" }}
            >
              SPKRS
            </div>

            {/* Side-panel that becomes visible during the spin — gives the cabinet real depth */}
            <div
              className="absolute inset-y-0 left-0 w-[14px] rounded-l-[30px]"
              aria-hidden
              style={{
                transform: "rotateY(90deg) translateZ(7px)",
                transformOrigin: "left center",
                background:
                  "linear-gradient(180deg, #0a0c11 0%, #05060a 100%)",
                boxShadow:
                  "inset 0 0 0 1px rgba(255,255,255,0.04), inset 8px 0 16px rgba(0,0,0,0.7)",
              }}
            />
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

function Driver({
  position,
  controls,
  kind = "woofer",
}: {
  position: "top" | "bottom";
  controls: AnimationControls;
  kind?: "tweeter" | "woofer";
}) {
  const top = position === "top" ? "8%" : "auto";
  const bottom = position === "bottom" ? "8%" : "auto";
  const sizePct = kind === "tweeter" ? "52%" : "82%";
  // Bolts arranged around the surround — adds the "mounted driver" feel
  const bolts = Array.from({ length: 8 }, (_, i) => (i / 8) * Math.PI * 2);
  return (
    <div
      className="absolute left-1/2 -translate-x-1/2"
      style={{ top, bottom, width: sizePct, aspectRatio: "1 / 1" }}
    >
      {/* surround (rubber edge) */}
      <div
        className="absolute inset-0 rounded-full"
        style={{
          background:
            "radial-gradient(circle at 50% 38%, #2a2f38 0%, #14181f 45%, #0a0c11 75%, #05060a 100%)",
          boxShadow:
            "inset 0 0 0 1px rgba(255,255,255,0.1), inset 0 12px 26px rgba(0,0,0,0.85), inset 0 -6px 14px rgba(255,255,255,0.03), 0 0 22px rgba(0,0,0,0.5)",
        }}
      />
      {/* mounting bolts */}
      {bolts.map((a, i) => {
        const r = 46; // % from center
        const x = 50 + Math.cos(a) * r;
        const y = 50 + Math.sin(a) * r;
        return (
          <span
            key={i}
            aria-hidden
            className="absolute h-[3px] w-[3px] rounded-full"
            style={{
              left: `${x}%`,
              top: `${y}%`,
              transform: "translate(-50%, -50%)",
              background:
                "radial-gradient(circle at 35% 35%, #6a7280 0%, #20242c 60%, #0a0c11 100%)",
              boxShadow:
                "inset 0 0 0 0.5px rgba(255,255,255,0.18), 0 1px 1px rgba(0,0,0,0.7)",
            }}
          />
        );
      })}
      {/* rubber surround ring */}
      <div
        className="pointer-events-none absolute inset-[6%] rounded-full"
        aria-hidden
        style={{
          background:
            "radial-gradient(circle at 50% 40%, transparent 58%, rgba(0,0,0,0.55) 64%, transparent 78%)",
        }}
      />
      {/* halo bloom — gently always-on */}
      <motion.div
        className="absolute inset-[-22%] rounded-full"
        animate={{ opacity: [0.18, 0.32, 0.18] }}
        transition={{ duration: 2.6, ease: "easeInOut", repeat: Infinity }}
        style={{
          background:
            "radial-gradient(circle, color-mix(in oklab, var(--teal) 45%, transparent) 0%, transparent 62%)",
          filter: "blur(8px)",
        }}
      />
      {/* cone — receives sharp scale bumps on pulse */}
      <motion.div
        className="absolute inset-[12%] rounded-full"
        animate={controls}
        initial={{ scale: 1 }}
        style={{
          background:
            kind === "tweeter"
              ? "radial-gradient(circle at 50% 38%, #c7ccd4 0%, #6f7682 35%, #1c2027 80%, #0a0c11 100%)"
              : "radial-gradient(circle at 50% 38%, #2f343d 0%, #181c24 55%, #0a0c11 100%)",
          boxShadow:
            "inset 0 1px 0 rgba(255,255,255,0.12), inset 0 -14px 28px rgba(0,0,0,0.85), inset 0 0 0 1px rgba(255,255,255,0.05)",
        }}
      >
        {/* concentric cone ridges (more for woofer) */}
        {kind === "woofer" && (
          <>
            <div
              className="absolute inset-[10%] rounded-full"
              style={{ boxShadow: "inset 0 0 0 1px rgba(255,255,255,0.06)" }}
            />
            <div
              className="absolute inset-[22%] rounded-full"
              style={{ boxShadow: "inset 0 0 0 1px rgba(255,255,255,0.045)" }}
            />
            <div
              className="absolute inset-[34%] rounded-full"
              style={{ boxShadow: "inset 0 0 0 1px rgba(255,255,255,0.035)" }}
            />
          </>
        )}
        {/* dust cap / phase plug */}
        <div
          className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full"
          style={{
            width: kind === "tweeter" ? "56%" : "30%",
            aspectRatio: "1 / 1",
            background:
              kind === "tweeter"
                ? "radial-gradient(circle at 42% 32%, #ffffff 0%, #b9bec7 25%, #4a505b 70%, #14171d 100%)"
                : "radial-gradient(circle at 50% 36%, #3a4049 0%, #1a1e25 55%, #0a0c11 100%)",
            boxShadow:
              "inset 0 1px 0 rgba(255,255,255,0.22), 0 2px 6px rgba(0,0,0,0.8)",
          }}
        />
        {/* highlight glint */}
        <div
          className="pointer-events-none absolute inset-0 rounded-full"
          aria-hidden
          style={{
            background:
              "radial-gradient(ellipse at 32% 22%, rgba(255,255,255,0.22) 0%, transparent 35%)",
          }}
        />
      </motion.div>
    </div>
  );
}

/**
 * Speaker-aware background — the welcome screen lives inside this same
 * environment so the handoff from intro → welcome feels continuous.
 * intensity controls overall presence; withSpeakers adds the faint dual-driver
 * silhouette behind the content.
 */
export function ResonanceField({
  intensity = "ambient",
  withSpeakers = false,
}: {
  intensity?: "ambient" | "quiet";
  withSpeakers?: boolean;
}) {
  const baseOpacity = intensity === "ambient" ? 0.22 : 0.12;
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden">
      {withSpeakers && <SpeakerBackdrop revealLevel={0.42} />}
      <svg
        className="absolute inset-0 h-full w-full"
        viewBox="0 0 100 100"
        preserveAspectRatio="xMidYMid slice"
        aria-hidden
      >
        <defs>
          <radialGradient id="ambientHalo" cx="50%" cy="50%" r="55%">
            <stop offset="0%" stopColor="var(--teal)" stopOpacity="0.28" />
            <stop offset="55%" stopColor="var(--teal)" stopOpacity="0.06" />
            <stop offset="100%" stopColor="var(--teal)" stopOpacity="0" />
          </radialGradient>
        </defs>
        <motion.circle
          cx="50"
          cy="50"
          r="42"
          fill="url(#ambientHalo)"
          animate={{ opacity: [baseOpacity, baseOpacity + 0.1, baseOpacity] }}
          transition={{ duration: 4.2, ease: "easeInOut", repeat: Infinity }}
        />
        {[14, 22, 30, 40, 52].map((r, i) => (
          <motion.circle
            key={r}
            cx="50"
            cy="50"
            r={r}
            fill="none"
            stroke="white"
            strokeWidth={0.18}
            animate={{
              opacity: [0.06, 0.16, 0.06],
              scale: [1, 1.035, 1],
            }}
            transition={{
              duration: 3.4 + i * 0.4,
              ease: "easeInOut",
              repeat: Infinity,
              delay: i * 0.4,
            }}
            style={{ transformOrigin: "50% 50%" }}
          />
        ))}
      </svg>
      <Grain />
    </div>
  );
}

/**
 * Faint dual-driver silhouette — used as the welcome backdrop and as the
 * intro's resting layout. Static (no scale animation here; motion lives in
 * the breathing halo so it feels alive without distracting from content).
 */
export function SpeakerBackdrop({ revealLevel = 0.45 }: { revealLevel?: number }) {
  return (
    <div className="pointer-events-none absolute inset-0 grid place-items-center">
      <div
        className="relative"
        style={{
          width: "min(82vw, 320px)",
          aspectRatio: "0.5 / 1",
          opacity: revealLevel,
          borderRadius: 36,
          background:
            "radial-gradient(120% 80% at 50% 50%, rgba(20,23,29,0.85) 0%, rgba(10,12,17,0.4) 70%, transparent 100%)",
          boxShadow:
            "inset 0 0 0 1px rgba(255,255,255,0.05), inset 0 1px 0 rgba(255,255,255,0.06)",
        }}
      >
        <BackdropDriver position="top" />
        <BackdropDriver position="bottom" />
      </div>
    </div>
  );
}

function BackdropDriver({ position }: { position: "top" | "bottom" }) {
  const top = position === "top" ? "10%" : "auto";
  const bottom = position === "bottom" ? "10%" : "auto";
  return (
    <div
      className="absolute left-1/2 -translate-x-1/2 rounded-full"
      style={{
        top,
        bottom,
        width: "78%",
        aspectRatio: "1 / 1",
        background:
          "radial-gradient(circle at 50% 42%, rgba(40,46,56,0.7) 0%, rgba(14,17,22,0.7) 55%, rgba(7,8,12,0) 100%)",
        boxShadow:
          "inset 0 0 0 1px rgba(255,255,255,0.07), inset 0 8px 22px rgba(0,0,0,0.6)",
      }}
    >
      {/* halo */}
      <motion.div
        className="absolute inset-[-14%] rounded-full"
        animate={{ opacity: [0.18, 0.3, 0.18] }}
        transition={{ duration: 3.2, ease: "easeInOut", repeat: Infinity }}
        style={{
          background:
            "radial-gradient(circle, color-mix(in oklab, var(--teal) 35%, transparent) 0%, transparent 65%)",
          filter: "blur(10px)",
        }}
      />
      {/* cone */}
      <div
        className="absolute inset-[14%] rounded-full"
        style={{
          background:
            "radial-gradient(circle at 50% 38%, rgba(40,46,55,0.7) 0%, rgba(20,23,29,0.7) 55%, rgba(8,10,14,0.6) 100%)",
          boxShadow:
            "inset 0 1px 0 rgba(255,255,255,0.06), inset 0 -10px 22px rgba(0,0,0,0.7)",
        }}
      >
        <div
          className="absolute inset-[18%] rounded-full"
          style={{ boxShadow: "inset 0 0 0 1px rgba(255,255,255,0.05)" }}
        />
        <div
          className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full"
          style={{
            width: "32%",
            aspectRatio: "1 / 1",
            background:
              "radial-gradient(circle at 50% 38%, rgba(48,54,64,0.85) 0%, rgba(18,21,26,0.6) 70%)",
            boxShadow: "inset 0 1px 0 rgba(255,255,255,0.1)",
          }}
        />
      </div>
    </div>
  );
}

function Vignette() {
  return (
    <div
      aria-hidden
      className="pointer-events-none absolute inset-0"
      style={{
        background:
          "radial-gradient(120% 80% at 50% 50%, transparent 0%, rgba(6,7,10,0.55) 70%, rgba(6,7,10,1) 100%)",
      }}
    />
  );
}

function Grain() {
  return (
    <svg
      className="pointer-events-none absolute inset-0 h-full w-full opacity-[0.07] mix-blend-overlay"
      aria-hidden
    >
      <filter id="intro-n">
        <feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="2" stitchTiles="stitch" />
      </filter>
      <rect width="100%" height="100%" filter="url(#intro-n)" />
    </svg>
  );
}
