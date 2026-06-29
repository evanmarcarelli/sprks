import { AnimatePresence, motion } from "framer-motion";
import { Check } from "lucide-react";

export type SortKey =
  | "relevance"
  | "newest"
  | "price-asc"
  | "price-desc"
  | "nearby"
  | "verified";

export const SORT_LABELS: Record<SortKey, string> = {
  relevance: "Most relevant",
  newest: "Newly listed",
  "price-asc": "Price: low to high",
  "price-desc": "Price: high to low",
  nearby: "Nearby",
  verified: "Verified first",
};

export function SortSheet({
  open,
  value,
  onChange,
  onClose,
}: {
  open: boolean;
  value: SortKey;
  onChange: (v: SortKey) => void;
  onClose: () => void;
}) {
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
            className="fixed inset-x-0 bottom-0 z-50 mx-auto w-full max-w-lg overflow-hidden rounded-t-3xl bg-surface"
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            transition={{ type: "spring", damping: 30, stiffness: 320 }}
          >
            <div className="border-b border-border px-5 py-4">
              <h3 className="font-display text-xl">Sort</h3>
            </div>
            <ul
              className="py-2"
              style={{ paddingBottom: "calc(env(safe-area-inset-bottom) + 8px)" }}
            >
              {(Object.keys(SORT_LABELS) as SortKey[]).map((k) => (
                <li key={k}>
                  <button
                    onClick={() => {
                      onChange(k);
                      onClose();
                    }}
                    className="flex w-full items-center justify-between px-5 py-3.5 text-left text-sm"
                  >
                    <span>{SORT_LABELS[k]}</span>
                    {value === k && <Check className="h-4 w-4" />}
                  </button>
                </li>
              ))}
            </ul>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
