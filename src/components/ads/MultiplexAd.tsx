import AdSlot from "./AdSlot";

/** Grid-style multiplex unit — placed at the end of listing/blog pages. */
export default function MultiplexAd({ slot = "XXXXXXXX" }: { slot?: string }) {
  return <AdSlot slot={slot} format="autorelaxed" label="Advertisement" style={{ minHeight: 200, width: "100%" }} />;
}
