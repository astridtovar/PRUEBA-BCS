import Link from "next/link";
import { LinkButton } from "@/shared/components/ui/LinkButton";
import { t } from "@/shared/i18n";

export function Header() {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/60 bg-primary shadow-sm">
      <div className="container mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6">
        <Link href="/" className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-md bg-white/20">
            <span className="text-sm font-bold text-white">
              {t.applications.header.logo}
            </span>
          </div>
          <span className="text-lg font-semibold text-white">
            {t.applications.header.brand}
          </span>
        </Link>

        <nav className="flex items-center gap-4">
          <Link
            href="/applications"
            className="text-sm font-medium text-white/80 transition-colors hover:text-white"
          >
            {t.applications.header.nav.applications}
          </Link>
          <LinkButton
            href="/applications/new"
            size="sm"
            className="bg-white text-primary hover:bg-white/90 font-semibold"
          >
            {t.applications.header.nav.apply}
          </LinkButton>
        </nav>
      </div>
    </header>
  );
}
