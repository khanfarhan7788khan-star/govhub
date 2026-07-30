import SuggestForm from "@/components/SuggestForm";

export const metadata = { title: "Suggest a website — GovHub" };

export default function SuggestPage() {
  return (
    <section className="wrap static-page" style={{ padding: "44px 24px 90px", maxWidth: 520 }}>
      <h1 className="disp">Suggest a website</h1>
      <p className="sub">Know an official portal we&apos;re missing? Let us know and we&apos;ll verify it.</p>
      <SuggestForm />
    </section>
  );
}
