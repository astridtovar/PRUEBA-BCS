import { CheckCircle2 } from "lucide-react";
import { t } from "@/shared/i18n";

export function RequirementsSection() {
  return (
    <section
      className="py-16 sm:py-20 bg-muted/40"
      aria-labelledby="requirements-heading"
    >
      <div className="container mx-auto max-w-6xl px-4 sm:px-6">
        <div className="mx-auto max-w-3xl">
          <div className="rounded-2xl border border-border bg-background p-8 shadow-sm sm:p-12">
            <h2
              id="requirements-heading"
              className="text-2xl font-bold text-foreground sm:text-3xl"
            >
              {t.landing.requirements.title}
            </h2>
            <p className="mt-3 text-muted-foreground">
              {t.landing.requirements.subtitle}
            </p>

            <ul
              className="mt-8 space-y-4"
              aria-label={t.landing.requirements.title}
            >
              {t.landing.requirements.items.map((req) => (
                <li key={req} className="flex items-start gap-3">
                  <CheckCircle2
                    className="mt-0.5 h-5 w-5 shrink-0 text-accent"
                    aria-hidden="true"
                  />
                  <span className="text-sm text-foreground">{req}</span>
                </li>
              ))}
            </ul>

            <p className="mt-8 text-xs text-muted-foreground border-t border-border pt-4">
              {t.landing.requirements.disclaimer}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
