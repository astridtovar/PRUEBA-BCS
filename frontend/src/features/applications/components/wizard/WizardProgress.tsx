import { cn } from "@/lib/utils";
import { Check } from "lucide-react";
import { t } from "@/shared/i18n";

const STEPS = t.wizard.progress.steps.map((label) => ({ label }));

interface WizardProgressProps {
  currentStep: number;
}

export function WizardProgress({ currentStep }: WizardProgressProps) {
  return (
    <nav aria-label="Progreso de la solicitud" className="w-full">
      <ol className="flex items-center justify-between gap-0">
        {STEPS.map((step, index) => {
          const isCompleted = index < currentStep;
          const isCurrent = index === currentStep;

          return (
            <li key={step.label} className="flex flex-1 items-center">
              <div className="flex flex-col items-center gap-1.5">
                <div
                  aria-current={isCurrent ? "step" : undefined}
                  className={cn(
                    "flex h-8 w-8 shrink-0 items-center justify-center rounded-full border-2 text-xs font-bold transition-all duration-200",
                    isCompleted &&
                      "border-primary bg-primary text-white",
                    isCurrent &&
                      "border-primary bg-white text-primary shadow-md ring-2 ring-primary/20",
                    !isCompleted &&
                      !isCurrent &&
                      "border-border bg-background text-muted-foreground"
                  )}
                >
                  {isCompleted ? (
                    <Check className="h-4 w-4" aria-hidden="true" />
                  ) : (
                    <span aria-hidden="true">{index + 1}</span>
                  )}
                  <span className="sr-only">
                    {isCompleted
                      ? t.wizard.progress.completed(step.label)
                      : isCurrent
                      ? t.wizard.progress.current(step.label)
                      : step.label}
                  </span>
                </div>
                <span
                  className={cn(
                    "hidden text-xs font-medium sm:block",
                    isCurrent ? "text-primary" : "text-muted-foreground"
                  )}
                >
                  {step.label}
                </span>
              </div>

              {index < STEPS.length - 1 && (
                <div
                  aria-hidden="true"
                  className={cn(
                    "flex-1 h-0.5 mx-2 mt-[-18px] sm:mt-[-28px] transition-colors duration-200",
                    index < currentStep ? "bg-primary" : "bg-border"
                  )}
                />
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
