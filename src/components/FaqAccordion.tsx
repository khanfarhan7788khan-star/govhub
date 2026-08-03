"use client";
import { useState } from "react";
import { ChevronRight } from "lucide-react";
import { Faq } from "@/lib/types";

export default function FaqAccordion({ faqs }: { faqs: Faq[] }) {
  const [open, setOpen] = useState<number | null>(null);
  return (
    <div>
      {faqs.map((f, i) => (
        <div className="faq-item" key={f.id}>
          <button className="faq-q" onClick={() => setOpen(open === i ? null : i)}>
            {f.question}
            <ChevronRight size={15} className={`faq-chevron${open === i ? " open" : ""}`} />
          </button>
          {open === i && <div className="faq-a">{f.answer}</div>}
        </div>
      ))}
    </div>
  );
}
