import { useRef, useState } from "react";
import { ZoomIn } from "lucide-react";

type Props = {
  src: string;
  alt?: string;
  className?: string;
  hint?: string;
};

// Lightweight deep-zoom: click/tap toggles 2.2× zoom, drag pans.
// No external lib; CSS transforms only.
export function ZoomImage({ src, alt = "", className = "", hint = "Tap to inspect finish" }: Props) {
  const wrapRef = useRef<HTMLDivElement>(null);
  const [zoomed, setZoomed] = useState(false);
  const [pos, setPos] = useState({ x: 50, y: 50 });

  const onMove = (e: React.PointerEvent) => {
    if (!zoomed) return;
    const el = wrapRef.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    const x = ((e.clientX - r.left) / r.width) * 100;
    const y = ((e.clientY - r.top) / r.height) * 100;
    setPos({ x: Math.max(0, Math.min(100, x)), y: Math.max(0, Math.min(100, y)) });
  };

  return (
    <div
      ref={wrapRef}
      onClick={() => setZoomed((z) => !z)}
      onPointerMove={onMove}
      className={`relative overflow-hidden bg-muted ${zoomed ? "cursor-zoom-out" : "cursor-zoom-in"} ${className}`}
    >
      <img
        src={src}
        alt={alt}
        draggable={false}
        className="h-full w-full select-none object-cover transition-transform duration-300 ease-out"
        style={{
          transform: zoomed ? "scale(2.4)" : "scale(1)",
          transformOrigin: `${pos.x}% ${pos.y}%`,
        }}
      />
      {!zoomed && (
        <span className="pointer-events-none absolute bottom-3 left-3 inline-flex items-center gap-1 rounded-full bg-background/85 px-2.5 py-1 text-[10.5px] uppercase tracking-[0.16em] text-foreground/80 ring-1 ring-border backdrop-blur">
          <ZoomIn className="h-3 w-3" /> {hint}
        </span>
      )}
    </div>
  );
}
