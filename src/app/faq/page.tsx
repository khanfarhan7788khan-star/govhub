import { getAllFaqs } from "@/lib/content-data";
import FaqAccordion from "@/components/FaqAccordion";
import { FaqJsonLd } from "@/components/JsonLd";

export const dynamic = "force-dynamic";
export const metadata = { title: "Frequently Asked Questions" };

export default async function FAQPage() {
  const faqs = await getAllFaqs();

  return (
    <>
      <FaqJsonLd faqs={faqs.map((f) => ({ q: f.question, a: f.answer }))} />
      <section className="wrap static-page" style={{ padding: "44px 24px 90px", maxWidth: 720 }}>
        <h1 className="disp">Frequently asked questions</h1>
        <p className="sub">Everything about how the directory works.</p>
        <FaqAccordion faqs={faqs} />
      </section>
    </>
  );
}
