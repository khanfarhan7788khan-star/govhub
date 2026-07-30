"use client";
import { useId } from "react";

export default function Seal({ size = 54 }: { size?: number }) {
  const uid = useId();
  const arcId = `sealArc-${size}-${uid.replace(/[:]/g, "")}`;
  return (
    <svg width={size} height={size} viewBox="0 0 100 100" style={{ transform: "rotate(-7deg)", flexShrink: 0 }}>
      <circle cx="50" cy="50" r="46" fill="none" stroke="var(--saffron)" strokeWidth="2.5" strokeDasharray="3 4" opacity="0.9" />
      <circle cx="50" cy="50" r="37" fill="none" stroke="var(--saffron)" strokeWidth="1.4" opacity="0.7" />
      <path id={arcId} d="M 20 50 A 30 30 0 0 1 80 50" fill="none" />
      <text fontSize="9.5" fill="var(--saffron)" fontFamily="var(--font-plex-mono), monospace" letterSpacing="2.5" fontWeight={500}>
        <textPath href={`#${arcId}`} startOffset="50%" textAnchor="middle">VERIFIED · GOVT</textPath>
      </text>
      <g transform="translate(50,52)">
        <circle r="13" fill="none" stroke="var(--saffron)" strokeWidth="1.6" />
        <path d="M -6 0 L -1.5 5 L 7 -5.5" fill="none" stroke="var(--saffron)" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" />
      </g>
    </svg>
  );
}
