import { motion } from "framer-motion";

export function ProgressBar({ step, total }: { step: number; total: number }) {
  return (
    <div className="flex w-full gap-1">
      {Array.from({ length: total }).map((_, i) => (
        <div key={i} className="h-[2px] flex-1 overflow-hidden rounded-full bg-border">
          <motion.div
            initial={false}
            animate={{ width: i < step ? "100%" : i === step ? "40%" : "0%" }}
            transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
            className="h-full bg-foreground"
          />
        </div>
      ))}
    </div>
  );
}
