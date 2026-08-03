"use client";
import { useRouter, useSearchParams } from "next/navigation";
import { Search, X } from "lucide-react";
import { useState } from "react";

export default function BlogSearchBox() {
  const router = useRouter();
  const params = useSearchParams();
  const [value, setValue] = useState(params.get("q") || "");

  function apply(term: string) {
    const next = new URLSearchParams(params.toString());
    if (term) next.set("q", term);
    else next.delete("q");
    router.push(`/blog?${next.toString()}`);
  }

  return (
    <div className="searchbox" style={{ marginBottom: 26 }}>
      <Search size={18} className="icon-search" />
      <input
        value={value}
        onChange={(e) => setValue(e.target.value)}
        onKeyDown={(e) => e.key === "Enter" && apply(value)}
        placeholder="Search guides and articles…"
      />
      {value && (
        <button
          className="clearbtn"
          aria-label="Clear"
          onClick={() => {
            setValue("");
            apply("");
          }}
        >
          <X size={16} />
        </button>
      )}
    </div>
  );
}
