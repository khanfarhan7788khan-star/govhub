import AdSlot from "./AdSlot";

/** Tall sidebar unit — placed in filter panels or article sidebars. */
export default function SidebarAd({ slot = "XXXXXXXX" }: { slot?: string }) {
  return <AdSlot slot={slot} format="vertical" label="Advertisement" style={{ minHeight: 250, width: "100%" }} />;
}
