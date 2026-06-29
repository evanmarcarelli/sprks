import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { motion } from "framer-motion";
import { Apple, Mail } from "lucide-react";
import { IntroSequence, ResonanceField } from "@/components/onboarding/intro-sequence";
import { useStore } from "@/lib/store";

export const Route = createFileRoute("/welcome")({
  head: () => ({
    meta: [
      { title: "Welcome — SPKRS" },
      {
        name: "description",
        content: "Tuned to how you actually listen. Personalize SPKRS to your taste.",
      },
    ],
  }),
  component: WelcomeRoute,
});

const ease = [0.22, 1, 0.36, 1] as const;

function WelcomeRoute() {
  const [phase, setPhase] = useState<"intro" | "entry">("intro");
  const navigate = useNavigate();
  const { completeOnboarding, profile } = useStore();

  if (phase === "intro") {
    return <IntroSequence onDone={() => setPhase("entry")} />;
  }

  const skip = () => {
    completeOnboarding({ ...profile });
    navigate({ to: "/shop" });
  };

  return (
    <div
      className="relative mx-auto min-h-svh w-full max-w-[440px] overflow-hidden bg-[#06070A] text-white"
      style={{ perspective: 1400 }}
    >
      <motion.div
        className="relative flex min-h-svh w-full flex-col"
        // Page swings in "through the side" of the cabinet — mirror of the intro's spin.
        initial={{ rotateY: 92, x: "60%", opacity: 0, filter: "blur(14px)" }}
        animate={{ rotateY: 0, x: "0%", opacity: 1, filter: "blur(0px)" }}
        transition={{ duration: 0.95, ease }}
        style={{ transformOrigin: "left center", transformStyle: "preserve-3d" }}
      >
      {/* Speaker-aware backdrop covers the whole screen so the welcome lives
          inside the same sound world as the intro. */}
      <div className="pointer-events-none absolute inset-0">
        <ResonanceField intensity="ambient" withSpeakers />
        <div
          aria-hidden
          className="absolute inset-x-0 bottom-0 h-[50%]"
          style={{
            background:
              "linear-gradient(to bottom, transparent 0%, rgba(6,7,10,0.6) 45%, #06070A 100%)",
          }}
        />
      </div>

      {/* Hero — SPKRS wordmark sitting in front of the speaker backdrop */}
      <div className="relative h-[44svh] w-full">
        <motion.div
          initial={{ opacity: 0, y: 10, filter: "blur(10px)" }}
          animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
          transition={{ duration: 1.0, ease }}
          className="absolute inset-0 grid place-items-center"
        >
          <h1
            className="font-display tracking-tight"
            style={{ fontSize: "clamp(56px, 18vw, 96px)", lineHeight: 1 }}
          >
            SPKRS
          </h1>
        </motion.div>
      </div>

      {/* Copy + CTA */}
      <main className="relative z-10 flex flex-1 flex-col px-7 pb-[calc(env(safe-area-inset-bottom)+22px)]">
        <div className="mx-auto h-px w-10 bg-white/15" />

        <motion.p
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease, delay: 0.15 }}
          className="mt-6 text-[10.5px] uppercase tracking-[0.3em] text-white/45"
        >
          For people who care how it sounds
        </motion.p>
        <motion.h2
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease, delay: 0.22 }}
          className="mt-3 font-display text-[30px] leading-[1.1]"
        >
          Tuned to how you actually listen.
        </motion.h2>
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.7, delay: 0.32 }}
          className="mt-3 max-w-[320px] text-[13px] leading-relaxed text-white/65"
        >
          Two minutes of taste — SPKRS arranges itself around it.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.42, ease }}
          className="mt-auto pt-10"
        >
          <button
            onClick={() => navigate({ to: "/onboarding/intent" })}
            className="inline-flex w-full items-center justify-center rounded-full bg-white px-5 py-3.5 text-sm font-medium text-black transition active:scale-[0.99]"
          >
            Get started
          </button>

          <div className="mt-7">
            <p className="text-center text-[10.5px] uppercase tracking-[0.28em] text-white/40">
              Continue with
            </p>
            <div className="mt-3 flex items-center justify-center gap-3">
              <SocialDot label="Apple">
                <Apple className="h-4 w-4" />
              </SocialDot>
              <SocialDot label="Google">
                <span className="font-display text-[16px] leading-none">G</span>
              </SocialDot>
              <SocialDot label="Email">
                <Mail className="h-4 w-4" />
              </SocialDot>
            </div>
          </div>

          <button
            onClick={skip}
            className="mt-7 block w-full text-center text-[12px] text-white/50 transition hover:text-white/80"
          >
            Skip for now
          </button>
          <p className="mt-2 text-center text-[10px] tracking-wide text-white/30">
            By continuing, you agree to our Terms and Privacy Policy.
          </p>
        </motion.div>
      </main>
      </motion.div>
    </div>
  );
}

function SocialDot({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <button
      aria-label={label}
      className="grid h-11 w-11 place-items-center rounded-full border border-white/15 bg-white/[0.03] text-white/85 transition hover:border-white/35 hover:bg-white/[0.06] hover:text-white"
    >
      {children}
    </button>
  );
}
