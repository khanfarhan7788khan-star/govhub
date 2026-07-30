"use client";
import { useState } from "react";
import Link from "next/link";
import { Bookmark } from "lucide-react";
import Seal from "./Seal";
import { Site } from "@/lib/types";
import { showToast } from "@/lib/toast";

export default function SiteCard({ site, initiallySaved = false }: { site: Site; initiallySaved?: boolean }) {
  const [saved, setSaved] = useState(initiallySaved);
  const [busy, setBusy] = useState(false);

  async function toggleSave(e: React.MouseEvent) {
    e.preventDefault();
    e.stopPropagation();
    if (busy) return;
    setBusy(true);
    const next = !saved;
    setSaved(next);
    try {
      if (next) {
        await fetch("/api/favorites", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ siteId: site.id }),
        });
        showToast("Saved to favourites");
      } else {
        await fetch(`/api/favorites?siteId=${encodeURIComponent(site.id)}`, { method: "DELETE" });
        showToast("Removed from favourites");
      }
    } catch {
      setSaved(!next);
      showToast("Something went wrong — try again");
    } finally {
      setBusy(false);
    }
  }

  return (
    <Link href={`/site/${site.id}`} className="card">
      <div className="card-top">
        <div style={{ minWidth: 0 }}>
          <div className="card-cat">{site.category}</div>
          <h3 className="disp">{site.name}</h3>
        </div>
        <Seal size={40} />
      </div>
      <p className="desc">{site.description}</p>
      <div className="card-bottom">
        <span className="mono url">{site.url.replace("https://", "")}</span>
        <button className="savebtn" onClick={toggleSave} aria-label={saved ? "Remove from favourites" : "Save to favourites"} disabled={busy}>
          <Bookmark size={15} fill={saved ? "var(--saffron)" : "none"} color={saved ? "var(--saffron)" : "var(--ink-soft)"} />
        </button>
      </div>
    </Link>
  );
}
