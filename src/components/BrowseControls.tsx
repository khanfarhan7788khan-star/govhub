"use client";
import { useRouter, useSearchParams } from "next/navigation";
import { Search, X } from "lucide-react";
import { useState } from "react";

const LEVELS = ["Central", "State", "District"];

export function BrowseSearchBox() {
  const router = useRouter();
  const params = useSearchParams();
  const [value, setValue] = useState(params.get("q") || "");

  function apply(term: string) {
    const next = new URLSearchParams(params.toString());
    if (term) next.set("q", term);
    else next.delete("q");
    router.push(`/browse?${next.toString()}`);
  }

  return (
    <div className="searchbox" style={{ marginBottom: 26 }}>
      <Search size={18} className="icon-search" />
      <input
        value={value}
        onChange={(e) => setValue(e.target.value)}
        onKeyDown={(e) => e.key === "Enter" && apply(value)}
        placeholder="Search government websites…"
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

export function LevelFilter() {
  const router = useRouter();
  const params = useSearchParams();
  const active = new Set(params.getAll("level"));

  function toggle(level: string) {
    const next = new URLSearchParams(params.toString());
    const current = new Set(next.getAll("level"));
    if (current.has(level)) current.delete(level);
    else current.add(level);
    next.delete("level");
    current.forEach((l) => next.append("level", l));
    router.push(`/browse?${next.toString()}`);
  }

  return (
    <div className="filter-group">
      <h4>Level</h4>
      {LEVELS.map((l) => (
        <label className="filter-opt" key={l}>
          <input type="checkbox" checked={active.has(l)} onChange={() => toggle(l)} />
          {l} Government
        </label>
      ))}
    </div>
  );
}

export function SortSelect() {
  const router = useRouter();
  const params = useSearchParams();
  const value = params.get("sort") || "popular";

  function onChange(v: string) {
    const next = new URLSearchParams(params.toString());
    next.set("sort", v);
    router.push(`/browse?${next.toString()}`);
  }

  return (
    <div className="filter-group">
      <h4>Sort by</h4>
      <select className="select-sort" value={value} onChange={(e) => onChange(e.target.value)}>
        <option value="popular">Popular</option>
        <option value="recent">Recently verified</option>
        <option value="az">Alphabetical</option>
      </select>
    </div>
  );
}
