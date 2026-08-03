"use client";
import { useEffect, useRef } from "react";

const ADSENSE_CLIENT = process.env.NEXT_PUBLIC_ADSENSE_CLIENT || "";

type AdSlotProps = {
  slot: string;
  format?: string;
  style?: React.CSSProperties;
  label: string;
  className?: string;
};

/**
 * Renders a real Google AdSense unit once NEXT_PUBLIC_ADSENSE_CLIENT is set
 * to a real publisher ID (ca-pub-XXXXXXXXXXXXXXXX) and this component is
 * given a real ad slot ID. Until then it renders a plain labelled placeholder
 * box — never a fake ad — so the layout can be previewed without violating
 * AdSense policy (which prohibits placeholder/fake ad content in production).
 */
export default function AdSlot({ slot, format = "auto", style, label, className }: AdSlotProps) {
  const ref = useRef<HTMLModElement>(null);
  const isConfigured = !!ADSENSE_CLIENT && !ADSENSE_CLIENT.includes("XXXX");

  useEffect(() => {
    if (!isConfigured) return;
    try {
      // @ts-expect-error - adsbygoogle is injected by the AdSense script
      (window.adsbygoogle = window.adsbygoogle || []).push({});
    } catch {
      /* ad blocked or script not yet loaded — safe to ignore */
    }
  }, [isConfigured]);

  if (!isConfigured) {
    return (
      <div
        className={className}
        style={{
          border: "1px dashed var(--border)",
          borderRadius: 12,
          display: "grid",
          placeItems: "center",
          color: "var(--ink-soft)",
          fontSize: 11,
          letterSpacing: 1,
          textTransform: "uppercase",
          fontFamily: "var(--font-plex-mono), monospace",
          minHeight: 90,
          ...style,
        }}
      >
        {label}
      </div>
    );
  }

  return (
    <ins
      ref={ref}
      className={`adsbygoogle ${className || ""}`}
      style={{ display: "block", ...style }}
      data-ad-client={ADSENSE_CLIENT}
      data-ad-slot={slot}
      data-ad-format={format}
      data-full-width-responsive="true"
    />
  );
}
