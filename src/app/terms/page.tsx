export const metadata = { title: "Terms of service — GovHub" };

export default function TermsPage() {
  return (
    <section className="wrap static-page" style={{ padding: "44px 24px 90px", maxWidth: 720 }}>
      <h1 className="disp">Terms of service</h1>
      <p className="sub">Last updated July 2026</p>
      <p>
        By using GovHub you agree that it is an independent directory, not a government service, and that all
        applications, payments, and official transactions happen on the linked government website itself.
      </p>
      <h2 className="disp">No warranty</h2>
      <p>
        While every listing is checked before publishing, GovHub cannot guarantee that a linked site has not changed
        since the last verification date shown. Always confirm you&apos;re on the correct official domain before
        entering personal information.
      </p>
      <h2 className="disp">Fair use</h2>
      <p>Automated scraping of this directory beyond normal browsing, or submitting fraudulent listings, is not permitted.</p>
    </section>
  );
}
