import { redirect } from "next/navigation";
import { getCurrentAdmin } from "@/lib/auth";
import AdminLoginForm from "@/components/AdminLoginForm";

export const metadata = { title: "Admin sign in — GovHub" };
export const dynamic = "force-dynamic";

export default async function AdminEntryPage() {
  const admin = await getCurrentAdmin();
  if (admin) redirect("/admin/dashboard");

  return (
    <section className="wrap">
      <AdminLoginForm />
    </section>
  );
}
