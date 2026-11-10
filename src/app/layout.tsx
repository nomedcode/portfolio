import type { Viewport } from "next";
import { Inter } from "next/font/google";
import { siteMetadata } from "@/lib/siteMetadata";
import { THEME_COLOR, themeColorScript } from "@/lib/themeChrome";
import { themeInitScript } from "@/lib/themeInit";
import "./globals.css";

// Preloaded so the first paint does not render the Arial fallback and then morph: source order is not fetch
// order, so without preload the 48 KB arrives after layout and `font-display: swap` shows the swap.
const inter = Inter({ subsets: ["latin"], variable: "--font-inter", preload: true });

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
