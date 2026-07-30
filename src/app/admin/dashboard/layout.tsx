import { redirect } from "next/navigation";
import { getCurrentAdmin } from "@/lib/auth";
import AdminSidebar from "@/components/AdminSidebar";

export const dynamic = "force-dynamic";

export default async function AdminDashboardLayout({ children }: { children: React.ReactNode }) {
  const admin = await getCurrentAdmin();
  if (!admin) redirect("/admin");

  return (
    <div className="admin-shell wrap" style={{ paddingTop: 20 }}>
      <AdminSidebar email={admin.email} />
      <div className="admin-main">{children}</div>
    </div>
  );
}
