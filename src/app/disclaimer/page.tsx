export const metadata = { title: "Disclaimer" };

export default function DisclaimerPage() {
  return (
    <section className="wrap static-page" style={{ padding: "44px 24px 90px", maxWidth: 720 }}>
      <h1 className="disp">Disclaimer</h1>
      <p className="sub">Last updated July 2026</p>
      <p>
        GovHub is an independent directory created to help users find official Government of India and State
        Government websites more easily. GovHub is not affiliated with, endorsed by, sponsored by, or officially
        connected with any government ministry, department, or agency in any way.
      </p>
      <h2 className="disp">No official capacity</h2>
      <p>
        Nothing on this website constitutes an official government communication, notification, or service. All
        applications, registrations, payments, and transactions referenced in our guides and listings take place
        entirely on the official government websites we link to — never on GovHub itself.
      </p>
      <h2 className="disp">Accuracy of information</h2>
      <p>
        We make a genuine effort to keep listings, fees, timelines, and eligibility information accurate and
        up to date, and each listing shows the date it was last verified. However, government processes, fees, and
        requirements can change without notice. Always cross-check details on the official portal before relying on
        them for an application or decision.
      </p>
      <h2 className="disp">No liability</h2>
      <p>
        GovHub and its editorial team are not liable for any loss, damage, or inconvenience arising from the use of
        information on this site, or from any action taken based on it. Use of this website and reliance on any
        information here is entirely at your own discretion and risk.
      </p>
      <h2 className="disp">External links</h2>
      <p>
        This site links to official government websites and, in some cases, other third-party resources. We are not
        responsible for the content, accuracy, or privacy practices of external websites once you leave GovHub.
      </p>
    </section>
  );
}
