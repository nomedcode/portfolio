import type { Metadata } from "next";
import Link from "next/link";
import { profile } from "@/lib/content";

// Next merges segment metadata shallowly, so any key this file omits is inherited from the home page wholesale.
// The 404 therefore has to restate openGraph and twitter in full, and clear the canonical it used to inherit.
const description =
  "That address does not exist here. The page may have moved, or the link may be mistyped.";

export const metadata: Metadata = {
  title: "Page not found",
  robots: { index: false, follow: false },
  alternates: { canonical: null },
  openGraph: {
    type: "website",
    siteName: profile.fullName,
    title: "Page not found",
    description,
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "Page not found",
    description,
  },
};

// The static export's own 404 page: a missing URL lands inside the design instead of on a bare server default.
export default function NotFound() {
  return (
    <main className="flex min-h-svh flex-col items-center justify-center gap-6 bg-page px-6 text-center">
      <p className="text-sm font-medium text-muted">404</p>
      <h1 className="text-display font-semibold leading-[1.05] tracking-display text-fg">
        Page not found
      </h1>
      <p className="max-w-[34rem] text-pretty text-base text-subtle md:text-lg">
        That address does not exist here. The page may have moved, or the link may
        be mistyped.
      </p>
      <Link
        href="/"
        className="press inline-flex items-center rounded-full border border-subtle px-6 py-3 font-medium text-fg hover:bg-line/60"
      >
        Back home
      </Link>
    </main>
  );
}
