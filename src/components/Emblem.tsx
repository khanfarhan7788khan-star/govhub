function round(n: number) {
  return Math.round(n * 1000) / 1000;
}

export default function Emblem({ size = 28 }: { size?: number }) {
  const spokes = Array.from({ length: 12 }).map((_, i) => {
    const a = (i * 30 * Math.PI) / 180;
    const x1 = round(20 + Math.cos(a) * 7),
      y1 = round(20 + Math.sin(a) * 7);
    const x2 = round(20 + Math.cos(a) * 14.5),
      y2 = round(20 + Math.sin(a) * 14.5);
    return <line key={i} x1={x1} y1={y1} x2={x2} y2={y2} stroke="var(--indigo)" strokeWidth="1.6" strokeLinecap="round" />;
  });
  return (
    <svg width={size} height={size} viewBox="0 0 40 40">
      <circle cx="20" cy="20" r="17" fill="none" stroke="var(--indigo)" strokeWidth="2.2" />
      {spokes}
      <circle cx="20" cy="20" r="4.5" fill="var(--saffron)" />
    </svg>
  );
}
