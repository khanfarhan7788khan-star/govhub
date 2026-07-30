import ContactForm from "@/components/ContactForm";

export const metadata = { title: "Contact — GovHub" };

export default function ContactPage() {
  return (
    <section className="wrap static-page" style={{ padding: "44px 24px 90px", maxWidth: 520 }}>
      <h1 className="disp">Contact us</h1>
      <p className="sub">Questions, corrections, or a broken link to report.</p>
      <ContactForm />
    </section>
  );
}
