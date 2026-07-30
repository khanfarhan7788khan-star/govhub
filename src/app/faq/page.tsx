"use client";
import { useState } from "react";
import { ChevronRight } from "lucide-react";

const FAQS = [
  {
    q: "Is GovHub an official government website?",
    a: "No. GovHub is an independent directory built to help people find the correct official website faster. It is not affiliated with, endorsed by, or operated by any government authority.",
  },
  {
    q: "How do you verify a listing?",
    a: "Each listing's URL is checked against the domain published by the relevant ministry or department before it is added, and rechecked periodically. You can see the last verification date on every listing.",
  },
  {
    q: "I found a broken or suspicious link. What do I do?",
    a: "Open the listing and use the \"Report link\" option, or reach us through the Contact page with the listing name and what you noticed.",
  },
  {
    q: "Can I suggest a website that's missing?",
    a: "Yes — use the Suggest a Website form. Every suggestion is checked before it's published.",
  },
  {
    q: "Do I need an account to use GovHub?",
    a: "No account is required to search or browse. Favourites are kept for your current browser session using a private cookie, not an account.",
  },
];

export default function FAQPage() {
  const [open, setOpen] = useState<number | null>(null);

  return (
    <section className="wrap static-page" style={{ padding: "44px 24px 90px", maxWidth: 720 }}>
      <h1 className="disp">Frequently asked questions</h1>
      <p className="sub">Everything about how the directory works.</p>
      <div>
        {FAQS.map((f, i) => (
          <div className="faq-item" key={f.q}>
            <button className="faq-q" onClick={() => setOpen(open === i ? null : i)}>
              {f.q}
              <ChevronRight size={15} className={`faq-chevron${open === i ? " open" : ""}`} />
            </button>
            {open === i && <div className="faq-a">{f.a}</div>}
          </div>
        ))}
      </div>
    </section>
  );
}
