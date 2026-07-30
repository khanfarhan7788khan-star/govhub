"use client";
import { useState } from "react";
import { Bookmark, Share2, QrCode, Flag, X } from "lucide-react";
import { showToast } from "@/lib/toast";

export default function SiteActions({ siteId, siteUrl, initiallySaved }: { siteId: string; siteUrl: string; initiallySaved: boolean }) {
  const [saved, setSaved] = useState(initiallySaved);
  const [busy, setBusy] = useState(false);
  const [qrOpen, setQrOpen] = useState(false);
  const [reportOpen, setReportOpen] = useState(false);
  const [reportNote, setReportNote] = useState("");
  const [reportSent, setReportSent] = useState(false);

  async function toggleSave() {
    if (busy) return;
    setBusy(true);
    const next = !saved;
    setSaved(next);
    try {
      if (next) {
        await fetch("/api/favorites", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ siteId }),
        });
        showToast("Saved to favourites");
      } else {
        await fetch(`/api/favorites?siteId=${encodeURIComponent(siteId)}`, { method: "DELETE" });
        showToast("Removed from favourites");
      }
    } catch {
      setSaved(!next);
      showToast("Something went wrong — try again");
    } finally {
      setBusy(false);
    }
  }

  async function share() {
    const url = typeof window !== "undefined" ? window.location.href : siteUrl;
    try {
      if (navigator.share) {
        await navigator.share({ title: "GovHub", url });
        return;
      }
      await navigator.clipboard.writeText(url);
      showToast("Link copied");
    } catch {
      showToast("Couldn't share — copy the link from the address bar");
    }
  }

  async function submitReport() {
    try {
      const res = await fetch("/api/reports", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ siteId, note: reportNote }),
      });
      if (!res.ok) throw new Error();
      setReportSent(true);
      showToast("Report received — thank you");
    } catch {
      showToast("Couldn't send the report — try again");
    }
  }

  const qrSrc = `https://api.qrserver.com/v1/create-qr-code/?size=220x220&data=${encodeURIComponent(siteUrl)}`;

  return (
    <>
      <div className="action-row">
        <button className={`ghostbtn${saved ? " saved" : ""}`} onClick={toggleSave} disabled={busy}>
          <Bookmark size={14} fill={saved ? "var(--saffron)" : "none"} color={saved ? "var(--saffron)" : "var(--ink)"} />
          {saved ? "Saved" : "Save"}
        </button>
        <button className="ghostbtn" onClick={share}>
          <Share2 size={14} /> Share
        </button>
        <button className="ghostbtn" style={{ maxWidth: 56 }} onClick={() => setQrOpen(true)} aria-label="Show QR code">
          <QrCode size={16} />
        </button>
        <button className="ghostbtn" style={{ maxWidth: 130 }} onClick={() => setReportOpen(true)}>
          <Flag size={14} /> Report link
        </button>
      </div>

      {qrOpen && (
        <div className="modal-backdrop" onClick={() => setQrOpen(false)}>
          <div className="modal-card fade-in" onClick={(e) => e.stopPropagation()} style={{ maxWidth: 320, textAlign: "center" }}>
            <div style={{ display: "flex", justifyContent: "flex-end" }}>
              <button onClick={() => setQrOpen(false)} aria-label="Close" style={{ background: "none", border: "none", color: "var(--ink-soft)" }}>
                <X size={18} />
              </button>
            </div>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={qrSrc} alt="QR code linking to this website" width={220} height={220} style={{ borderRadius: 12 }} />
            <p style={{ fontSize: 12.5, color: "var(--ink-soft)", marginTop: 12 }}>Scan to open this listing on another device.</p>
          </div>
        </div>
      )}

      {reportOpen && (
        <div className="modal-backdrop" onClick={() => setReportOpen(false)}>
          <div className="modal-card fade-in" onClick={(e) => e.stopPropagation()} style={{ maxWidth: 420 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <h3 className="disp" style={{ fontSize: 18 }}>Report a broken link</h3>
              <button onClick={() => setReportOpen(false)} aria-label="Close" style={{ background: "none", border: "none", color: "var(--ink-soft)" }}>
                <X size={18} />
              </button>
            </div>
            {reportSent ? (
              <div className="form-success" style={{ marginTop: 16 }}>Thanks — our team will review this listing.</div>
            ) : (
              <>
                <p style={{ fontSize: 13, color: "var(--ink-soft)", margin: "12px 0" }}>
                  Let us know what&apos;s wrong — a dead link, wrong domain, or outdated information.
                </p>
                <textarea
                  value={reportNote}
                  onChange={(e) => setReportNote(e.target.value)}
                  placeholder="What did you notice?"
                  style={{ width: "100%", minHeight: 90, padding: 11, borderRadius: 10, border: "1px solid var(--border)", background: "var(--surface)", color: "var(--ink)", fontSize: 13.5 }}
                />
                <button className="primary-btn" style={{ marginTop: 12 }} onClick={submitReport}>
                  Submit report
                </button>
              </>
            )}
          </div>
        </div>
      )}
    </>
  );
}
