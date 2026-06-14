import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import type {
  ApplicationChannel,
  DocumentType,
  SimulationResult,
} from "../types/application.types";

interface WizardStep1 {
  channel: ApplicationChannel;
  advisorId?: string;
}

interface WizardStep2 {
  documentType: DocumentType;
  documentNumber: string;
  firstName: string;
  lastName: string;
  phone: string;
  email: string;
  city: string;
}

interface WizardStep3 {
  monthlyIncome: number;
  monthlyExpenses: number;
  requestedAmount: number;
  termMonths: number;
  creditPurpose: string;
  dataProcessingAccepted: boolean;
}

export const WIZARD_STEPS = [
  "channel",
  "basic-data",
  "financial-data",
  "simulation",
  "summary",
] as const;

interface WizardState {
  applicationId: string | null;
  currentStep: number;
  step1: Partial<WizardStep1>;
  step2: Partial<WizardStep2>;
  step3: Partial<WizardStep3>;
  simulationResult: SimulationResult | null;

  setApplicationId: (id: string) => void;
  setStep: (step: number) => void;
  nextStep: () => void;
  prevStep: () => void;
  setStep1: (data: Partial<WizardStep1>) => void;
  setStep2: (data: Partial<WizardStep2>) => void;
  setStep3: (data: Partial<WizardStep3>) => void;
  setSimulationResult: (result: SimulationResult) => void;
  clearSimulationResult: () => void;
  reset: () => void;
}

const initialState = {
  applicationId: null,
  currentStep: 0,
  step1: {},
  step2: {},
  step3: {},
  simulationResult: null,
};

export const useWizardStore = create<WizardState>()(
  persist(
    (set) => ({
      ...initialState,

      setApplicationId: (id) => set({ applicationId: id }),
      setStep: (step) => set({ currentStep: step }),
      nextStep: () =>
        set((s) => ({
          currentStep: Math.min(s.currentStep + 1, WIZARD_STEPS.length - 1),
        })),
      prevStep: () =>
        set((s) => ({ currentStep: Math.max(s.currentStep - 1, 0) })),
      setStep1: (data) =>
        set((s) => ({ step1: { ...s.step1, ...data } })),
      setStep2: (data) =>
        set((s) => ({ step2: { ...s.step2, ...data } })),
      setStep3: (data) =>
        set((s) => ({ step3: { ...s.step3, ...data } })),
      setSimulationResult: (result) => set({ simulationResult: result }),
      clearSimulationResult: () => set({ simulationResult: null }),
      reset: () => set(initialState),
    }),
    {
      name: "bcs-wizard",
      storage: createJSONStorage(() => sessionStorage),
    }
  )
);
