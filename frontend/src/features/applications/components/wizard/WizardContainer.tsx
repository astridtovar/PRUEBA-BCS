"use client";

import { useEffect } from "react";
import { WizardProgress } from "./WizardProgress";
import { StepChannelSelect } from "./steps/StepChannelSelect";
import { StepBasicData } from "./steps/StepBasicData";
import { StepFinancialData } from "./steps/StepFinancialData";
import { StepSimulation } from "./steps/StepSimulation";
import { StepSummary } from "./steps/StepSummary";
import { useWizardStore } from "@/features/applications/store/wizardStore";

const STEP_COMPONENTS = [
  StepChannelSelect,
  StepBasicData,
  StepFinancialData,
  StepSimulation,
  StepSummary,
];

export function WizardContainer({ resume = false }: { resume?: boolean }) {
  const currentStep = useWizardStore((s) => s.currentStep);
  const reset = useWizardStore((s) => s.reset);
  const StepComponent = STEP_COMPONENTS[currentStep];

  useEffect(() => {
    if (!resume) {
      reset();
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="mx-auto w-full max-w-2xl">
      <div className="mb-8">
        <WizardProgress currentStep={currentStep} />
      </div>

      <div
        key={currentStep}
        className="animate-in fade-in slide-in-from-right-4 duration-200"
      >
        {StepComponent && <StepComponent />}
      </div>
    </div>
  );
}
