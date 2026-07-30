export const metadata = { title: "About — GovHub" };

export default function AboutPage() {
  return (
    <section className="wrap static-page" style={{ padding: "44px 24px 90px", maxWidth: 720 }}>
      <h1 className="disp">About GovHub</h1>
      <p className="sub">Why we built a directory, and how listings get verified.</p>
      <p>
        Government services in India are spread across hundreds of domains — central ministries, state departments, and
        district offices — and it&apos;s easy to land on an outdated or fraudulent look-alike page while searching. GovHub
        exists to close that gap: a single, searchable directory that points to the real thing.
      </p>
      <h2 className="disp">How verification works</h2>
      <p>
        Every listing is checked against the issuing department&apos;s published domain before it&apos;s added, and is
        periodically re-checked. The date on each listing&apos;s &quot;Last verified&quot; field reflects when that check
        last happened.
      </p>
      <h2 className="disp">What GovHub is not</h2>
      <p>
        GovHub is an independent, unofficial directory. We don&apos;t process applications, collect documents, or act on
        behalf of any government body — we simply point you to the correct official website, where you complete the
        process directly.
      </p>
    </section>
  );
}
