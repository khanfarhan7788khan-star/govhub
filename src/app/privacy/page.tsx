export const metadata = { title: "Privacy policy — GovHub" };

export default function PrivacyPage() {
  return (
    <section className="wrap static-page" style={{ padding: "44px 24px 90px", maxWidth: 720 }}>
      <h1 className="disp">Privacy policy</h1>
      <p className="sub">Last updated July 2026</p>
      <p>
        GovHub only indexes publicly available information about official government websites. We do not require an
        account to search or browse the directory.
      </p>
      <h2 className="disp">What we collect</h2>
      <p>
        Contact and website-suggestion forms collect the name, email, and message you choose to submit, used only to
        respond to you or review a suggested listing. A random, non-identifying session cookie is used to remember your
        favourites on this device.
      </p>
      <h2 className="disp">What we don&apos;t do</h2>
      <p>
        GovHub never asks for Aadhaar numbers, PAN numbers, passwords, OTPs, or payment details. Any page asking for
        these is not part of GovHub — all such actions happen on the official government website you&apos;re directed to.
      </p>
    </section>
  );
}
