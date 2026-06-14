import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { act } from "react";

import { StepFinancialData } from "./StepFinancialData";
import { useWizardStore } from "@/features/applications/store/wizardStore";
import { t } from "@/shared/i18n";

const d = t.wizard.financialData;

const mockMutateAsync = jest.fn();
let mockIsPending = false;
let mockIsError = false;

jest.mock("@/features/applications/hooks/useApplicationMutations", () => ({
  useUpdateApplication: () => ({
    mutateAsync: mockMutateAsync,
    isPending: mockIsPending,
    isError: mockIsError,
  }),
}));

jest.mock("sonner", () => ({ toast: { error: jest.fn() } }));

const validStep3 = {
  monthlyIncome: 5_000_000,
  monthlyExpenses: 1_500_000,
  requestedAmount: 2_000_000,
  termMonths: 24,
  creditPurpose: "Remodelación del hogar y mejoras generales",
  dataProcessingAccepted: true,
};

function makeClient() {
  return new QueryClient({
    defaultOptions: { queries: { retry: false }, mutations: { retry: false } },
  });
}

function renderStep() {
  return render(
    <QueryClientProvider client={makeClient()}>
      <StepFinancialData />
    </QueryClientProvider>
  );
}

beforeEach(() => {
  mockIsPending = false;
  mockIsError = false;
  mockMutateAsync.mockReset();
  act(() => {
    useWizardStore.getState().reset();
    useWizardStore.getState().setApplicationId("test-id");
    useWizardStore.getState().setStep(2);
    useWizardStore.getState().setStep3(validStep3);
  });
});

describe("StepFinancialData — comportamiento del formulario", () => {
  it("muestra el título del paso", () => {
    renderStep();
    expect(screen.getByText(d.title)).toBeInTheDocument();
  });

  it("el botón de envío dice 'Simular oferta'", () => {
    renderStep();
    expect(screen.getByRole("button", { name: d.buttons.simulate })).toBeInTheDocument();
  });

  it("llama a la mutación con los datos correctos al enviar", async () => {
    const user = userEvent.setup();
    mockMutateAsync.mockResolvedValueOnce({});
    renderStep();

    await user.click(screen.getByRole("button", { name: d.buttons.simulate }));

    await waitFor(() =>
      expect(mockMutateAsync).toHaveBeenCalledWith(
        expect.objectContaining({
          monthlyIncome: validStep3.monthlyIncome,
          monthlyExpenses: validStep3.monthlyExpenses,
          requestedAmount: validStep3.requestedAmount,
          termMonths: validStep3.termMonths,
          creditPurpose: validStep3.creditPurpose,
          dataProcessingAccepted: true,
        })
      )
    );
  });

  it("avanza al siguiente paso tras un submit exitoso", async () => {
    const user = userEvent.setup();
    mockMutateAsync.mockResolvedValueOnce({});
    renderStep();

    await user.click(screen.getByRole("button", { name: d.buttons.simulate }));

    await waitFor(() =>
      expect(useWizardStore.getState().currentStep).toBe(3)
    );
  });

  it("muestra error inline cuando la mutación falla", () => {
    mockIsError = true;
    renderStep();
    expect(screen.getByRole("alert")).toHaveTextContent(d.errors.saveFailed);
  });

  it("no envía cuando los gastos superan los ingresos", async () => {
    const user = userEvent.setup();
    act(() => {
      useWizardStore.getState().setStep3({
        ...validStep3,
        monthlyExpenses: 6_000_000, // > monthlyIncome (5M)
      });
    });
    renderStep();

    await user.click(screen.getByRole("button", { name: d.buttons.simulate }));

    await waitFor(() =>
      expect(screen.getAllByRole("alert").length).toBeGreaterThan(0)
    );
    expect(mockMutateAsync).not.toHaveBeenCalled();
  });

  it("retrocede al paso anterior al hacer clic en Atrás", async () => {
    const user = userEvent.setup();
    renderStep();

    await user.click(screen.getByRole("button", { name: d.buttons.back }));

    expect(useWizardStore.getState().currentStep).toBe(1);
  });
});
