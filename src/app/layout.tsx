import type { Metadata } from "next";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ToastHost from "@/components/ToastHost";
import Script from "next/script";


export const metadata: Metadata = {
  title: "GovHub — Find Any Official Government Website",
  description: "An independent, verified directory of official Indian government websites.",
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
  <script
    dangerouslySetInnerHTML={{
      __html: bootScript,
    }}
  />
</head>
      <body>
        <Header />
        <main>{children}</main>
        <Footer />
        <ToastHost />
      </body>
    </html>
  );
}
