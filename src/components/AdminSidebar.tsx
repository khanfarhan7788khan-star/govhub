"use client";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";

const NAV = [
  { href: "/admin/dashboard", label: "Overview" },
  { href: "/admin/dashboard/listings", label: "Listings" },
  { href: "/admin/dashboard/categories", label: "Categories" },
  { href: "/admin/dashboard/reports", label: "Broken link reports" },
  { href: "/admin/dashboard/approvals", label: "Approval queue" },
  { href: "/admin/dashboard/messages", label: "Messages" },
];

export default function AdminSidebar({ email }: { email: string }) {
  const pathname = usePathname();
  const router = useRouter();

  async function logout() {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/admin");
    router.refresh();
  }

  return (
    <aside className="admin-side">
      <div style={{ fontSize: 11.5, color: "var(--ink-soft)", padding: "0 12px 14px" }} className="mono">
        {email}
      </div>
      {NAV.map((n) => (
        <Link key={n.href} href={n.href} className={pathname === n.href ? "active" : ""}>
          {n.label}
        </Link>
      ))}
      <button
        onClick={logout}
        style={{ marginTop: 16, borderTop: "1px solid var(--border)", paddingTop: 16, color: "var(--saffron)", background: "none", border: "none", textAlign: "left", width: "100%", fontSize: 13.5, cursor: "pointer" }}
      >
        ← Sign out
      </button>
    </aside>
  );
}
