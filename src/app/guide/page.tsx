import Link from "next/link";
import { ShieldCheck, Search, FileCheck, UserPlus, Send, Bell } from "lucide-react";

export const metadata = { title: "Guide — How to apply & register — GovHub" };

const APPLY_STEPS = [
  {
    icon: Search,
    title: "Find the right portal",
    body: "Search GovHub by service name (\"passport renewal\"), category, or ministry. Every result is checked against the department's published domain — look for the verification seal and the \"Last verified\" date on the listing.",
  },
  {
    icon: ShieldCheck,
    title: "Confirm you're on the official site",
    body: "Before entering any personal details, check the address bar for the correct domain (most central government sites end in .gov.in or .nic.in). GovHub's listing page shows you the exact URL — tap \"Visit official website\" rather than searching separately, to avoid look-alike ads or phishing pages.",
  },
  {
    icon: UserPlus,
    title: "Register or sign in on that portal",
    body: "Most portals need a one-time registration: usually your mobile number or email, verified with an OTP, plus an identity number relevant to that service (Aadhaar, PAN, ration card, etc. depending on the portal). Create this account directly on the official site — GovHub never asks for these details itself.",
  },
  {
    icon: FileCheck,
    title: "Gather your documents",
    body: "Keep scanned copies or clear photos ready before you start: proof of identity, proof of address, passport-size photograph, and any service-specific documents (e.g. income certificate for a scholarship, vehicle RC for a driving licence renewal). Most portals list exact requirements before you begin the form.",
  },
  {
    icon: Send,
    title: "Fill and submit the application",
    body: "Complete the form on the official portal, upload documents in the specified format and size, and pay any applicable fee through the portal's own payment gateway. Save or screenshot your application/reference number.",
  },
  {
    icon: Bell,
    title: "Track your application",
    body: "Almost every portal has a \"Track status\" or \"Check application status\" option using your reference number. Keep an eye on your registered mobile/email for OTPs or requests for additional documents.",
  },
];

export default function GuidePage() {
  return (
    <section className="wrap static-page" style={{ padding: "44px 24px 90px", maxWidth: 760 }}>
      <h1 className="disp">How to apply & register</h1>
      <p className="sub">A general walkthrough for using any official government portal you find on GovHub.</p>

      <p>
        Every government service works a little differently, but almost all of them follow the same shape. Here&apos;s
        the general process — the specific steps and documents required will be listed on the official portal itself
        once you get there.
      </p>

      <div className="guide-callout">
        <strong>GovHub itself never collects Aadhaar numbers, PAN numbers, OTPs, or payment details.</strong> All
        registration and applications happen on the official government website you&apos;re directed to — never on
        this directory.
      </div>

      <div className="guide-steps">
        {APPLY_STEPS.map((s, i) => {
          const Icon = s.icon;
          return (
            <div className="guide-step" key={s.title}>
              <div className="num">{i + 1}</div>
              <div>
                <h3 className="disp" style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <Icon size={15} color="var(--saffron)" /> {s.title}
                </h3>
                <p>{s.body}</p>
              </div>
            </div>
          );
        })}
      </div>

      <h2 className="disp">Registering as a government portal (for departments)</h2>
      <p>
        If you represent a government department or ministry and want your official portal listed or corrected on
        GovHub, use the <Link href="/suggest" style={{ color: "var(--saffron)" }}>Suggest a website</Link> form with
        your official domain and a contact note — our team verifies the domain against public records before
        publishing it.
      </p>

      <h2 className="disp">Still stuck?</h2>
      <p>
        Check the <Link href="/faq" style={{ color: "var(--saffron)" }}>FAQ</Link> for common questions, or use{" "}
        <Link href="/contact" style={{ color: "var(--saffron)" }}>Contact us</Link> if you found a broken link or
        something looks wrong with a listing.
      </p>
    </section>
  );
}
