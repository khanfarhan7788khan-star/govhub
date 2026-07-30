"use client";
import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import { Menu, Moon, Sun } from "lucide-react";
import Emblem from "./Emblem";

const NAV = [
  { href: "/browse", label: "Browse" },
  { href: "/favorites", label: "Favourites" },
  { href: "/guide", label: "Guide" },
  { href: "/about", label: "About" },
  { href: "/faq", label: "FAQ" },
  { href: "/contact", label: "Contact" },
  { href: "/admin", label: "Admin" },
];

export default function Header() {
  const router = useRouter();
  const pathname = usePathname();
  const [dark, setDark] = useState(false);
  const [navOpen, setNavOpen] = useState(false);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- must read document.documentElement after mount to avoid SSR/client hydration mismatch
    setDark(document.documentElement.classList.contains("dark"));
  }, []);

  function toggleTheme() {
    const next = !dark;
    setDark(next);
    document.documentElement.classList.toggle("dark", next);
    try {
      localStorage.setItem("govhub-theme", next ? "dark" : "light");
    } catch {}
  }

  function onSearchKey(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Enter") {
      const value = (e.target as HTMLInputElement).value;
      router.push(`/browse?q=${encodeURIComponent(value)}`);
    }
  }

  return (
    <header className="site">
      <div className="wrap header-inner">
        <Link href="/" className="logo">
          <Emblem size={28} />
          GovHub
        </Link>

        <nav className={`main${navOpen ? " open" : ""}`}>
          {NAV.map((n) => (
            <Link
              key={n.href}
              href={n.href}
              className={pathname.startsWith(n.href) ? "active" : ""}
              onClick={() => setNavOpen(false)}
            >
              {n.label}
            </Link>
          ))}
          <div className="searchbox" style={{ maxWidth: 220 }}>
            <input placeholder="Quick search…" onKeyDown={onSearchKey} style={{ padding: "9px 12px", boxShadow: "none", fontSize: 13 }} />
          </div>
        </nav>

        <div className="header-actions">
          <button className="iconbtn navtoggle" aria-label="Menu" onClick={() => setNavOpen((o) => !o)}>
            <Menu size={16} />
          </button>
          <button className="iconbtn" aria-label="Toggle dark mode" onClick={toggleTheme}>
            {dark ? <Sun size={16} /> : <Moon size={16} />}
          </button>
        </div>
      </div>
    </header>
  );
}
