"use client";
import { useEffect, useState, useCallback } from "react";
import { Trash2 } from "lucide-react";
import { showToast } from "@/lib/toast";

type Message = { id: string; name: string; email: string; message: string; created_at: string };

export default function MessagesManager() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    setLoading(true);
    const res = await fetch("/api/messages");
    if (res.ok) {
      const data = await res.json();
      setMessages(data.messages || []);
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- intentional fetch-on-mount to load admin data from the API
    load();
  }, [load]);

  async function remove(m: Message) {
    if (!confirm(`Delete the message from "${m.name}"?`)) return;
    const res = await fetch(`/api/messages?id=${encodeURIComponent(m.id)}`, { method: "DELETE" });
    if (res.ok) {
      showToast("Message deleted");
      setMessages((rows) => rows.filter((r) => r.id !== m.id));
    } else {
      showToast("Couldn't delete this message");
    }
  }

  return (
    <>
      <div className="section-head">
        <h2 className="disp">Messages</h2>
      </div>
      {loading ? (
        <p style={{ color: "var(--ink-soft)", fontSize: 13.5 }}>Loading messages…</p>
      ) : messages.length === 0 ? (
        <div className="empty">
          <p>No messages yet.</p>
        </div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          {messages.map((m) => (
            <div key={m.id} style={{ background: "var(--surface)", border: "1px solid var(--border)", borderRadius: 12, padding: 16 }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 12 }}>
                <div>
                  <div style={{ fontSize: 14, fontWeight: 600 }}>{m.name}</div>
                  <div className="mono" style={{ fontSize: 12, color: "var(--ink-soft)" }}>{m.email}</div>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                  <span className="mono" style={{ fontSize: 11, color: "var(--ink-soft)" }}>{m.created_at.slice(0, 16)}</span>
                  <button className="iconbtn-sm danger" onClick={() => remove(m)} aria-label="Delete message">
                    <Trash2 size={13} />
                  </button>
                </div>
              </div>
              <p style={{ fontSize: 13.5, color: "var(--ink)", marginTop: 10, lineHeight: 1.6 }}>{m.message}</p>
            </div>
          ))}
        </div>
      )}
    </>
  );
}
