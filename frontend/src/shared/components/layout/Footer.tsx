import { t } from "@/shared/i18n";

export function Footer() {
  return (
    <footer className="border-t border-border bg-muted/40 py-8 mt-auto">
      <div className="container mx-auto max-w-6xl px-4 sm:px-6">
        <div className="flex flex-col items-center gap-2 text-center sm:flex-row sm:justify-between sm:text-left">
          <p className="text-sm text-muted-foreground">
            {t.applications.footer.copyright(new Date().getFullYear())}
          </p>
          <p className="text-xs text-muted-foreground">
            {t.applications.footer.disclaimer}
          </p>
        </div>
      </div>
    </footer>
  );
}
