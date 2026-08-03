"use client";
import { useState } from "react";
import { X } from "lucide-react";
import AdSlot from "./AdSlot";

/** Dismissible sticky unit anchored to the bottom of the viewport (mobile-friendly). */
export default function StickyBottomAd({ slot = "XXXXXXXX" }: { slot?: string }) {
  const [dismissed, setDismissed] = useState(false);
  if (dismissed) return null;
  return (
    <div
      style={{
        position: "fixed", bottom: 0, left: 0, right: 0, zIndex: 45,
        background: "var(--surface)", borderTop: "1px solid var(--border)",
        padding: "8px 40px 8px 12px", boxShadow: "var(--shadow)",
      }}
    >
      <AdSlot slot={slot} label="Advertisement" style={{ minHeight: 60, width: "100%" }} />
      <button
        onClick={() => setDismissed(true)}
        aria-label="Dismiss ad"
        style={{ position: "absolute", top: 6, right: 6, background: "none", border: "none", color: "var(--ink-soft)" }}
      >
        <X size={16} />
      </button>
    </div>
  );
}
