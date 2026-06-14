import { Zap, HandCoins, CalendarDays, HeartHandshake } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { t } from "@/shared/i18n";

const icons = [Zap, HandCoins, CalendarDays, HeartHandshake];

export function BenefitsGrid() {
  return (
    <section className="py-16 sm:py-20 bg-background" aria-labelledby="benefits-heading">
      <div className="container mx-auto max-w-6xl px-4 sm:px-6">
        <div className="text-center mb-12">
          <h2
            id="benefits-heading"
            className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl"
          >
            {t.landing.benefits.title}
          </h2>
          <p className="mt-3 text-muted-foreground text-lg max-w-xl mx-auto">
            {t.landing.benefits.subtitle}
          </p>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {t.landing.benefits.items.map(({ title, description }, i) => {
            const Icon = icons[i];
            return (
              <Card
                key={title}
                className="border border-border/60 shadow-sm hover:shadow-md transition-shadow duration-200"
              >
                <CardContent className="pt-6 pb-6 px-6 flex flex-col gap-3">
                  <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary/10">
                    <Icon className="h-5 w-5 text-primary" aria-hidden="true" />
                  </div>
                  <h3 className="font-semibold text-foreground">{title}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {description}
                  </p>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </section>
  );
}
