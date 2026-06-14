import { act } from "react";
import { useWizardStore, WIZARD_STEPS } from "./wizardStore";

// Zustand stores persist between tests — reset before each
beforeEach(() => {
  act(() => {
    useWizardStore.getState().reset();
  });
});

describe("wizardStore — navigation", () => {
  it("starts at step 0", () => {
    expect(useWizardStore.getState().currentStep).toBe(0);
  });

  it("nextStep advances the current step", () => {
    act(() => useWizardStore.getState().nextStep());
    expect(useWizardStore.getState().currentStep).toBe(1);
  });

  it("prevStep goes back", () => {
    act(() => {
      useWizardStore.getState().nextStep();
      useWizardStore.getState().nextStep();
    });
    act(() => useWizardStore.getState().prevStep());
    expect(useWizardStore.getState().currentStep).toBe(1);
  });

  it("nextStep does not exceed last step", () => {
    act(() => {
      for (let i = 0; i < WIZARD_STEPS.length + 5; i++) {
        useWizardStore.getState().nextStep();
      }
    });
    expect(useWizardStore.getState().currentStep).toBe(WIZARD_STEPS.length - 1);
  });

  it("prevStep does not go below 0", () => {
    act(() => {
      useWizardStore.getState().prevStep();
      useWizardStore.getState().prevStep();
    });
    expect(useWizardStore.getState().currentStep).toBe(0);
  });

  it("setStep navigates directly", () => {
    act(() => useWizardStore.getState().setStep(3));
    expect(useWizardStore.getState().currentStep).toBe(3);
  });
});

describe("wizardStore — data slices", () => {
  it("stores application id", () => {
    act(() => useWizardStore.getState().setApplicationId("abc-123"));
    expect(useWizardStore.getState().applicationId).toBe("abc-123");
  });

  it("merges step1 data", () => {
    act(() => useWizardStore.getState().setStep1({ channel: "SELF_SERVICE" }));
    expect(useWizardStore.getState().step1.channel).toBe("SELF_SERVICE");
  });

  it("merges step2 data without overwriting unrelated fields", () => {
    act(() => {
      useWizardStore.getState().setStep2({ firstName: "John", lastName: "Doe" });
      useWizardStore.getState().setStep2({ email: "john@example.com" });
    });
    const { step2 } = useWizardStore.getState();
    expect(step2.firstName).toBe("John");
    expect(step2.lastName).toBe("Doe");
    expect(step2.email).toBe("john@example.com");
  });

  it("stores simulation result", () => {
    const result = {
      status: "VIABLE" as const,
      interestRate: 1.45,
      monthlyInstallment: 95000,
      approvedAmount: 2000000,
      approvedTermMonths: 24,
    };
    act(() => useWizardStore.getState().setSimulationResult(result));
    expect(useWizardStore.getState().simulationResult).toEqual(result);
  });

  it("reset returns to initial state", () => {
    act(() => {
      useWizardStore.getState().setApplicationId("xyz");
      useWizardStore.getState().nextStep();
      useWizardStore.getState().setStep1({ channel: "ASSISTED" });
    });
    act(() => useWizardStore.getState().reset());
    const state = useWizardStore.getState();
    expect(state.currentStep).toBe(0);
    expect(state.applicationId).toBeNull();
    expect(state.step1).toEqual({});
    expect(state.simulationResult).toBeNull();
  });
});
