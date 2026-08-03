import AdSlot from "./AdSlot";

/** Horizontal banner — typically placed below a page header or between sections. */
export default function AdBanner({ slot = "XXXXXXXX" }: { slot?: string }) {
  return <AdSlot slot={slot} label="Advertisement" style={{ minHeight: 90, width: "100%" }} />;
}
