import { useId } from "react";

/**
 * Spkrs logomark — a minimal, geometric speaker driver (concentric rings +
 * dust cap) in the site's silver gradient. Clean and simple; reads as a
 * speaker face-on. Sized via className (default matches the header).
 */
export function Logo({ className = "h-7 w-7" }: { className?: string }) {
  const id = useId();
  return (
    <svg viewBox="0 0 32 32" fill="none" role="img" aria-label="Spkrs" className={className}>
      <defs>
        <linearGradient id={id} x1="5" y1="4" x2="27" y2="28" gradientUnits="userSpaceOnUse">
          <stop offset="0" style={{ stopColor: "var(--silver-bright)" }} />
          <stop offset="1" style={{ stopColor: "var(--silver)" }} />
        </linearGradient>
      </defs>
      <circle cx="16" cy="16" r="14.25" stroke={`url(#${id})`} strokeWidth="1.5" />
      <circle cx="16" cy="16" r="7.5" stroke={`url(#${id})`} strokeWidth="1.5" opacity="0.85" />
      <circle cx="16" cy="16" r="2.75" fill={`url(#${id})`} />
    </svg>
  );
}
