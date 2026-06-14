import { WizardContainer } from "@/features/applications/components/wizard/WizardContainer";
import Link from "next/link";
import { ChevronLeft } from "lucide-react";
import { t } from "@/shared/i18n";

const d = t.wizard.page;

export const metadata = {
  title: "Nueva solicitud | Crédito Digital",
};

export default function NewApplicationPage() {
  return (
    <div className="min-h-screen bg-muted/30 py-8 px-4 sm:px-6">
      <div className="mx-auto max-w-3xl">
        <Link
          href="/"
          className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground mb-6 transition-colors"
        >
          <ChevronLeft className="h-4 w-4" aria-hidden="true" />
          {d.backToHome}
        </Link>

        <div className="rounded-2xl border border-border bg-background shadow-sm p-6 sm:p-8">
          <div className="mb-8">
            <h1 className="text-2xl font-bold text-foreground">{d.title}</h1>
            <p className="mt-1 text-sm text-muted-foreground">{d.subtitle}</p>
          </div>

          <WizardContainer />
        </div>
      </div>
    </div>
  );
}
