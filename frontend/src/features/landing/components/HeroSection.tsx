import Link from "next/link";
import { LinkButton } from "@/shared/components/ui/LinkButton";
import { ArrowRight, Shield, Clock, CheckCircle2 } from "lucide-react";
import { t } from "@/shared/i18n";

const highlights = [
  { icon: Clock, text: t.landing.hero.features.responseTime },
  { icon: Shield, text: t.landing.hero.features.secure },
  { icon: CheckCircle2, text: t.landing.hero.features.digital },
];

export function HeroSection() {
  return (
    <section className="relative overflow-hidden bg-primary py-20 sm:py-28">
      <div
        aria-hidden="true"
        className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_rgba(8,145,178,0.15)_0%,_transparent_60%)]"
      />
      <div
        aria-hidden="true"
        className="absolute bottom-0 left-0 h-64 w-64 rounded-full bg-white/5 -translate-x-1/2 translate-y-1/2"
      />

      <div className="container relative mx-auto max-w-6xl px-4 sm:px-6">
        <div className="mx-auto max-w-3xl text-center">
          <span className="inline-block rounded-full bg-white/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-widest text-white/80 mb-6">
            {t.landing.hero.badge}
          </span>

          <h1 className="text-4xl font-extrabold tracking-tight text-white sm:text-5xl md:text-6xl whitespace-pre-line">
            {t.landing.hero.title.split("\n")[0]}{" "}
            <span className="text-accent">{t.landing.hero.title.split("\n")[1]}</span>
          </h1>

          <p className="mt-6 text-lg leading-relaxed text-white/75 sm:text-xl max-w-2xl mx-auto">
            {t.landing.hero.description}
          </p>

          <div className="mt-10 flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
            <LinkButton
              href="/applications/new"
              size="lg"
              className="bg-white text-primary hover:bg-white/90 font-bold text-base px-8 shadow-lg gap-2"
            >
              {t.landing.hero.ctaPrimary}
              <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </LinkButton>
            <Link
              href="/applications"
              className="inline-flex h-9 items-center justify-center rounded-lg border border-white/30 px-4 text-sm font-medium text-white hover:bg-white/10 transition-colors"
            >
              {t.landing.hero.ctaSecondary}
            </Link>
          </div>

          <div className="mt-12 flex flex-wrap justify-center gap-6">
            {highlights.map(({ icon: Icon, text }) => (
              <div
                key={text}
                className="flex items-center gap-2 text-sm text-white/70"
              >
                <Icon className="h-4 w-4 text-accent" aria-hidden="true" />
                <span>{text}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
