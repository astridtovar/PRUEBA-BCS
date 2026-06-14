import { LinkButton } from "@/shared/components/ui/LinkButton";
import { ArrowRight } from "lucide-react";
import { t } from "@/shared/i18n";

export function CtaBanner() {
  return (
    <section className="py-16 sm:py-20 bg-primary" aria-labelledby="cta-heading">
      <div className="container mx-auto max-w-6xl px-4 sm:px-6 text-center">
        <h2
          id="cta-heading"
          className="text-3xl font-bold text-white sm:text-4xl"
        >
          {t.landing.cta.title}
        </h2>
        <p className="mt-4 text-lg text-white/75 max-w-xl mx-auto">
          {t.landing.cta.description}
        </p>
        <LinkButton
          href="/applications/new"
          size="lg"
          className="mt-10 bg-white text-primary hover:bg-white/90 font-bold text-base px-10 shadow-lg gap-2"
        >
          {t.landing.cta.button}
          <ArrowRight className="h-4 w-4" aria-hidden="true" />
        </LinkButton>
      </div>
    </section>
  );
}
