export function Waveform({ className = "", bars = 28 }: { className?: string; bars?: number }) {
  return (
    <svg
      viewBox={`0 0 ${bars * 4} 24`}
      className={className}
      aria-hidden
      preserveAspectRatio="none"
    >
      {Array.from({ length: bars }).map((_, i) => {
        const t = i / (bars - 1);
        const h = 4 + Math.abs(Math.sin(t * Math.PI * 2.4)) * 18 + Math.sin(i) * 2;
        return (
          <rect
            key={i}
            x={i * 4}
            y={12 - h / 2}
            width={2}
            height={Math.max(2, h)}
            rx={1}
            fill="currentColor"
          />
        );
      })}
    </svg>
  );
}

export function FrequencyCurve({ className = "" }: { className?: string }) {
  // editorial frequency response illustration
  const pts: string[] = [];
  const N = 60;
  for (let i = 0; i < N; i++) {
    const x = (i / (N - 1)) * 300;
    const t = i / (N - 1);
    const y =
      40 -
      Math.sin(t * Math.PI * 1.6) * 12 -
      Math.cos(t * Math.PI * 4) * 3 -
      (t > 0.85 ? (t - 0.85) * 40 : 0);
    pts.push(`${x},${y + 20}`);
  }
  return (
    <svg viewBox="0 0 300 70" className={className} aria-hidden>
      <polyline points={pts.join(" ")} fill="none" stroke="currentColor" strokeWidth={1.4} />
    </svg>
  );
}
