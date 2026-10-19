import type { Metadata } from "next";
import Link from "next/link";

// The root layout's metadata is the home page's; without this the 404 inherited its title, its canonical and an
// `index, follow` that contradicted the noindex Next adds for the route.
export const metadata: Metadata = {
  title: "Page not found",
  robots: { index: false, follow: false },
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
