import type { ReactNode } from "react";
import { motion } from "framer-motion";
import { ChevronLeft } from "lucide-react";
import { useNavigate } from "@tanstack/react-router";
import { ProgressBar } from "./progress-bar";

export function OnboardingShell({
  step,
  total,
  eyebrow,
  title,
  helper,
  children,
  footer,
  onBack,
  onSkip,
}: {
  step: number;
  total: number;
  eyebrow?: string;
  title: string;
  helper?: string;
  children: ReactNode;
  footer: ReactNode;
  onBack?: () => void;
  onSkip?: () => void;
}) {
  const navigate = useNavigate();
  const back = () => (onBack ? onBack() : navigate({ to: ".." as any }));
  return (
    <div className="mx-auto flex min-h-svh w-full max-w-[440px] flex-col bg-background text-foreground">
      <header className="px-5 pt-[calc(env(safe-area-inset-top)+14px)]">
        <div className="flex items-center gap-3">
          <button
            onClick={back}
            className="grid h-9 w-9 place-items-center rounded-full hover:bg-muted/60"
            aria-label="Back"
          >
            <ChevronLeft className="h-5 w-5" />
          </button>
          <div className="flex-1">
            <ProgressBar step={step} total={total} />
          </div>
          {onSkip ? (
            <button
              onClick={onSkip}
              className="text-[12px] text-muted-foreground transition hover:text-foreground"
            >
              Skip
            </button>
          ) : (
            <div className="w-9" />
          )}
        </div>
      </header>

      <motion.section
        key={title}
        initial={{ opacity: 0, x: 12 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.32, ease: [0.22, 1, 0.36, 1] }}
        className="flex-1 px-6 pb-56 pt-10"
      >
        {eyebrow && (
          <p className="text-[10.5px] uppercase tracking-[0.22em] text-muted-foreground">
            {eyebrow}
          </p>
        )}
        <h1 className="mt-2 font-display text-[30px] leading-[1.1]">{title}</h1>
        {helper && <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{helper}</p>}
        <div className="mt-8">{children}</div>
      </motion.section>

      <div className="pointer-events-none fixed bottom-0 left-1/2 z-20 w-full max-w-[440px] -translate-x-1/2 px-5 pb-[calc(env(safe-area-inset-bottom)+24px)]">
        <div className="pointer-events-auto space-y-2">{footer}</div>
      </div>
    </div>
  );
}

export function PrimaryAction({
  children,
  onClick,
  disabled,
}: {
  children: ReactNode;
  onClick?: () => void;
  disabled?: boolean;
}) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className="inline-flex w-full items-center justify-center rounded-full bg-foreground px-5 py-3.5 text-sm font-medium text-background transition disabled:opacity-30"
    >
      {children}
    </button>
  );
}

export function GhostAction({
  children,
  onClick,
}: {
  children: ReactNode;
  onClick?: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className="inline-flex w-full items-center justify-center rounded-full border border-border bg-surface px-5 py-3 text-sm text-foreground"
    >
      {children}
    </button>
  );
}
