import AdSlot from "./AdSlot";

/** Placed mid-content in long-form articles and service pages. */
export default function InArticleAd({ slot = "XXXXXXXX" }: { slot?: string }) {
  return (
    <div style={{ margin: "28px 0" }}>
      <AdSlot slot={slot} format="fluid" label="Advertisement" style={{ minHeight: 120, width: "100%" }} />
    </div>
  );
}
