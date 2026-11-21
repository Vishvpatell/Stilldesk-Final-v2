import type { Metadata, Viewport } from "next";
import { DM_Sans } from "next/font/google";
import "./globals.css";
import "./sections.css";
import { site } from "@/config/site.config";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { MotionRoot } from "@/components/layout/MotionRoot";

// One typeface (docs/06): DM Sans, self-hosted by Next at build time, swap + fallback stack = no layout shift.
const dmSans = DM_Sans({ subsets: ["latin"], display: "swap", variable: "--font-dm-sans" });

const title = `${site.name}: ${site.tagline}`;
const description =
  "A calm study app for college students. Capture plans in class, get them back at your desk, and block distractions only while you study. Launching soon on Android.";

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: { default: title, template: `%s | ${site.name}` }, // docs/07: "Help and FAQ | Stilldesk" etc.
  description,
  openGraph: { type: "website", siteName: site.name, title, description, url: "/" },
  twitter: { card: "summary_large_image", title, description },
  // Share images come from app/opengraph-image.png and app/twitter-image.png (Next adds the tags). Each page sets its own canonical.
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
  themeColor: "#0A0A0B",
  colorScheme: "dark",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${dmSans.variable} no-js`} suppressHydrationWarning>
      <head>
        {/* marks the page as JS-enabled before first paint, so animated states never flash */}
        <script dangerouslySetInnerHTML={{ __html: "document.documentElement.classList.replace('no-js','js')" }} />
      </head>
      <body>
        <a className="skip" href="#main">Skip to main content</a>
        <MotionRoot />
        <Header />
        <main id="main">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
