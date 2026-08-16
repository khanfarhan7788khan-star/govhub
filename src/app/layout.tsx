import type { Metadata } from "next";
import Script from "next/script";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ToastHost from "@/components/ToastHost";
import { OrganizationJsonLd, WebSiteJsonLd } from "@/components/JsonLd";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://govhub.example.com";
const ADSENSE_CLIENT = process.env.NEXT_PUBLIC_ADSENSE_CLIENT || "";
const adsenseConfigured = !!ADSENSE_CLIENT && !ADSENSE_CLIENT.includes("XXXX");

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: { default: "GovHub — Find Any Official Government Website", template: "%s — GovHub" },
  description: "An independent, verified directory of official Indian government websites.",
  alternates: { canonical: "/" },
  openGraph: {
    siteName: "GovHub",
    type: "website",
    title: "GovHub — Find Any Official Government Website",
    description: "An independent, verified directory of official Indian government websites.",
  },
  twitter: {
    card: "summary_large_image",
    title: "GovHub — Find Any Official Government Website",
    description: "An independent, verified directory of official Indian government websites.",
  },
  robots: { index: true, follow: true },
};

// Runs before hydration: restores the saved theme and guarantees an
// anonymous session cookie exists so the very first API call (e.g. a
// favourite toggle) already has somewhere to persist to.
const bootScript = `
(function(){
  try{
    var theme = localStorage.getItem('govhub-theme');
    if(theme === 'dark') document.documentElement.classList.add('dark');
  }catch(e){}
  try{
    if(!document.cookie.split('; ').some(function(c){return c.indexOf('govhub_sid=')===0;})){
      var id = (crypto && crypto.randomUUID) ? crypto.randomUUID() : (Date.now()+'-'+Math.random().toString(16).slice(2));
      var maxAge = 60*60*24*365;
      document.cookie = 'govhub_sid='+id+'; path=/; max-age='+maxAge+'; samesite=lax';
    }
  }catch(e){}
})();
`;

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
   <html lang="en">
  <head>
    <Script
      id="boot-script"
      strategy="beforeInteractive"
      dangerouslySetInnerHTML={{
        __html: bootScript,
      }}
    />

    <Script
      id="monetag-multitag"
      src="https://quge5.com/88/tag.min.js"
      data-zone="270455"
      async
      data-cfasync="false"
    />

    <OrganizationJsonLd />
    <WebSiteJsonLd />

  {adsenseConfigured && (
    <Script
      id="adsense"
      async
      strategy="afterInteractive"
      src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${ADSENSE_CLIENT}`}
      crossOrigin="anonymous"
    />
  )}
</head>
      <body>
        <a href="#main-content" className="skip-link">Skip to content</a>
        <Header />
        <main id="main-content">{children}</main>
        <Footer />
        <ToastHost />
      </body>
    </html>
  );
}
