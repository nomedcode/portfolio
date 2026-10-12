import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import { profile } from "@/lib/content";
import { themeInitScript } from "@/lib/themeInit";
import "./globals.css";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });

export const metadata: Metadata = {
  title: `${profile.fullName} — Portfolio`,
  description: `Projects, skills, awards, certificates, and education of ${profile.fullName}.`,
};

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
