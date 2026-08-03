export const metadata = { title: "Cookie Policy" };

export default function CookiePolicyPage() {
  return (
    <section className="wrap static-page" style={{ padding: "44px 24px 90px", maxWidth: 720 }}>
      <h1 className="disp">Cookie policy</h1>
      <p className="sub">Last updated July 2026</p>
      <p>
        This page explains what cookies GovHub uses and why. We keep this deliberately minimal — GovHub doesn&apos;t run
        advertising trackers or third-party analytics beyond what&apos;s described below.
      </p>
      <h2 className="disp">Essential cookies</h2>
      <p>
        A single anonymous session cookie (<code>govhub_sid</code>) is set when you first visit, used only to
        remember your saved favourites on this device. It contains no personal information and isn&apos;t used for
        tracking across other websites.
      </p>
      <h2 className="disp">Preference storage</h2>
      <p>
        Your dark/light mode preference is saved in your browser&apos;s local storage, not a cookie, and never leaves
        your device.
      </p>
      <h2 className="disp">Advertising cookies</h2>
      <p>
        If Google AdSense is active on this site, Google and its partners may use cookies to serve and measure ads,
        which can include personalised advertising based on your browsing activity. You can opt out of personalised
        advertising through{" "}
        <a href="https://adssettings.google.com" target="_blank" rel="noopener noreferrer" style={{ color: "var(--saffron)" }}>
          Google Ads Settings
        </a>{" "}
        or industry opt-out pages such as{" "}
        <a href="https://www.aboutads.info/choices/" target="_blank" rel="noopener noreferrer" style={{ color: "var(--saffron)" }}>
          aboutads.info
        </a>
        .
      </p>
      <h2 className="disp">Managing cookies</h2>
      <p>
        Most browsers let you block or delete cookies through their settings. Blocking the essential session cookie
        will simply mean your favourites won&apos;t be remembered between visits — the rest of the site will continue
        to work normally.
      </p>
    </section>
  );
}
