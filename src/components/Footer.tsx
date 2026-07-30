import Link from "next/link";
import Emblem from "./Emblem";

export default function Footer() {
  return (
    <footer className="site">
      <div className="wrap">
        <p className="disclaimer">
          <strong>GovHub</strong> is an independent directory created to help users easily find official Government of India
          and State Government websites. We are not affiliated with, endorsed by, or operated by any government authority.
          Always verify information on the respective official government website before taking any action.
        </p>
        <div className="footer-cols">
          <div>
            <h5>Directory</h5>
            <Link href="/browse">Browse all</Link>
            <Link href="/favorites">Favourites</Link>
            <Link href="/guide">Application guide</Link>
            <Link href="/suggest">Suggest a website</Link>
          </div>
          <div>
            <h5>Company</h5>
            <Link href="/about">About</Link>
            <Link href="/faq">FAQ</Link>
            <Link href="/contact">Contact</Link>
          </div>
          <div>
            <h5>Legal</h5>
            <Link href="/privacy">Privacy policy</Link>
            <Link href="/terms">Terms of service</Link>
          </div>
          <div>
            <h5>Admin</h5>
            <Link href="/admin">Sign in</Link>
          </div>
        </div>
        <div className="footer-bottom">
          <Emblem size={16} />
          <span className="mono">© 2026 GovHub — a directory, not an authority</span>
        </div>
      </div>
    </footer>
  );
}
