"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Search, X } from "lucide-react";

const CHIPS = ["Aadhaar update", "Income tax refund", "Driving licence", "PM-KISAN status", "Voter ID"];

export default function HomeSearch() {
  const router = useRouter();
  const [value, setValue] = useState("");

  function go(term: string) {
    router.push(`/browse?q=${encodeURIComponent(term)}`);
  }

  return (
    <div>
      <div className="searchbox" style={{ maxWidth: 640, marginTop: 32 }}>
        <Search size={18} className="icon-search" />
        <input
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && go(value)}
          placeholder='Search "passport renewal", "PAN card", "GST"…'
        />
        {value && (
          <button className="clearbtn" aria-label="Clear" onClick={() => setValue("")}>
            <X size={16} />
          </button>
        )}
      </div>
      <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginTop: 14 }}>
        {CHIPS.map((c) => (
          <button key={c} className="chip mono" onClick={() => go(c.split(" ")[0])}>
            {c}
          </button>
        ))}
      </div>
    </div>
  );
}
