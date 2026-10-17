import type { Viewport } from "next";
import { Inter } from "next/font/google";
import { siteMetadata } from "@/lib/siteMetadata";
import { themeInitScript } from "@/lib/themeInit";
import "./globals.css";

// The font stack puts the OS face first, so Inter is only the primary face off Apple platforms. Preloading it
// spent 48 KB on every Apple device for a file they never render; it still loads on demand where it is used.
const inter = Inter({ subsets: ["latin"], variable: "--font-inter", preload: false });

export const metadata = siteMetadata;

// ponytail: follows OS scheme only; the manual theme toggle won't recolor browser chrome.
export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#ffffff" },
    { media: "(prefers-color-scheme: dark)", color: "#121212" },
  ],
};

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
        <noscript>
          <style>{`[data-reveal]{opacity:1 !important;transform:none !important}`}</style>
        </noscript>
      </head>
      <body className="bg-page font-sans text-fg antialiased">{children}</body>
    </html>
  );
}
