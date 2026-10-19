import type { Viewport } from "next";
import { Inter } from "next/font/google";
import { siteMetadata } from "@/lib/siteMetadata";
import { THEME_COLOR, themeColorScript } from "@/lib/themeChrome";
import { themeInitScript } from "@/lib/themeInit";
import "./globals.css";

// The font stack puts the OS face first, so Inter is only the primary face off Apple platforms. Preloading it
// spent 48 KB on every Apple device for a file they never render; it still loads on demand where it is used.
const inter = Inter({ subsets: ["latin"], variable: "--font-inter", preload: false });

export const metadata = siteMetadata;

// viewport-fit=cover lets the page paint under a notch; the safe-area insets in globals.css keep the gutters clear.
// The chrome colour itself is a tag that the theme scripts own, because a media-query pair cannot follow the
// manual toggle (see lib/themeChrome.ts).
export const viewport: Viewport = { viewportFit: "cover" };

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={inter.variable} suppressHydrationWarning>
      <head>
        <script
          dangerouslySetInnerHTML={{ __html: themeInitScript }}
        />
        {/* After the class is on <html>, so the first paint already has the right bar colour. A static tag is the
            value for every client that never runs script (crawlers, no-JS), so the two always agree. */}
        <meta name="theme-color" content={THEME_COLOR.light} suppressHydrationWarning />
        <script dangerouslySetInnerHTML={{ __html: themeColorScript }} />
        <noscript>
          <style>{`[data-reveal]{opacity:1 !important;transform:none !important}`}</style>
        </noscript>
      </head>
      <body className="bg-page font-sans text-fg antialiased">{children}</body>
    </html>
  );
}
