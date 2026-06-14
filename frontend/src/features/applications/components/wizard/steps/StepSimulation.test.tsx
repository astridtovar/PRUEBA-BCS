import { render, screen, act } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { StepSimulation } from "./StepSimulation";
import { useWizardStore } from "@/features/applications/store/wizardStore";
import { t } from "@/shared/i18n";

const d = t.wizard.simulation;
const f = t.common.fields;

const mockMutateAsync = jest.fn();
let mockIsPending = false;
let mockIsError = false;

jest.mock("@/features/applications/hooks/useApplicationMutations", () => ({
  useSimulateOffer: () => ({
    mutateAsync: mockMutateAsync,
    isPending: mockIsPending,
    isError: mockIsError,
  }),
}));

jest.mock("sonner", () => ({ toast: { error: jest.fn(), info: jest.fn() } }));

beforeEach(() => {
  mockIsPending = false;
  mockIsError = false;
  mockMutateAsync.mockReset();
  act(() => useWizardStore.getState().reset());
});

function makeClient() {
  return new QueryClient({
    defaultOptions: { queries: { retry: false }, mutations: { retry: false } },
  });
}

function renderStep() {
  return render(
    <QueryClientProvider client={makeClient()}>
      <StepSimulation />
    </QueryClientProvider>
  );
}

describe("StepSimulation — estados de visualización", () => {
  it("muestra oferta VIABLE cuando simulationResult está precargado", () => {
    act(() => {
      useWizardStore.getState().setApplicationId("test-id");
      useWizardStore.getState().setSimulationResult({
        status: "VIABLE",
        interestRate: 1.45,
        monthlyInstallment: 95000,
        approvedAmount: 2000000,
        approvedTermMonths: 24,
      });
    });

    renderStep();

    expect(screen.getByRole("region", { name: d.viable.ariaLabel })).toBeInTheDocument();
    expect(screen.getByText(d.viable.title)).toBeInTheDocument();
    expect(screen.getByText(f.months(24))).toBeInTheDocument();
    expect(screen.getByText("1.45%")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: d.buttons.viewSummary })).toBeInTheDocument();
  });

  it("muestra mensaje NOT_VIABLE cuando simulationResult tiene ese estado", () => {
    act(() => {
      useWizardStore.getState().setApplicationId("not-viable-id");
      useWizardStore.getState().setSimulationResult({
        status: "NOT_VIABLE",
        rejectionReason: "El monto excede tu capacidad financiera.",
      });
    });

    renderStep();

    expect(screen.getByRole("region", { name: d.notViable.ariaLabel })).toBeInTheDocument();
    expect(screen.getByText(d.notViable.title)).toBeInTheDocument();
    expect(screen.getByText(/el monto excede tu capacidad financiera/i)).toBeInTheDocument();
  });

  it("muestra UI de TECHNICAL_ERROR cuando simulationResult tiene ese estado", () => {
    act(() => {
      useWizardStore.getState().setApplicationId("some-id");
      useWizardStore.getState().setSimulationResult({
        status: "TECHNICAL_ERROR",
        errorMessage: "Servicio de evaluación temporalmente no disponible.",
      });
    });

    renderStep();

    expect(screen.getByRole("alert")).toBeInTheDocument();
    expect(screen.getByText(d.technicalError.title)).toBeInTheDocument();
    expect(screen.getByRole("button", { name: d.technicalError.tryAgain })).toBeInTheDocument();
  });

  it("muestra spinner mientras la mutación está pendiente", () => {
    mockIsPending = true;
    act(() => useWizardStore.getState().setApplicationId("test-id"));

    renderStep();

    expect(screen.getByRole("status")).toBeInTheDocument();
    expect(screen.queryByRole("region", { name: d.viable.ariaLabel })).not.toBeInTheDocument();
  });

  it("muestra UI de reintento cuando la mutación falla (isError=true, sin resultado)", () => {
    mockIsError = true;
    act(() => useWizardStore.getState().setApplicationId("error-id"));

    renderStep();

    expect(screen.getByText(d.connectionError.message)).toBeInTheDocument();
    expect(screen.getByRole("button", { name: d.connectionError.retry })).toBeInTheDocument();
  });

  it("activa la simulación automáticamente al montar si no hay resultado", () => {
    mockMutateAsync.mockResolvedValueOnce({
      simulationResult: {
        status: "VIABLE",
        interestRate: 1.45,
        monthlyInstallment: 95000,
        approvedAmount: 2000000,
        approvedTermMonths: 24,
      },
      application: {},
    });

    act(() => useWizardStore.getState().setApplicationId("test-id"));
    renderStep();

    expect(mockMutateAsync).toHaveBeenCalledTimes(1);
  });

  it("NO activa la simulación si ya hay un resultado guardado", () => {
    act(() => {
      useWizardStore.getState().setApplicationId("test-id");
      useWizardStore.getState().setSimulationResult({
        status: "VIABLE",
        interestRate: 1.45,
        monthlyInstallment: 95000,
        approvedAmount: 2000000,
        approvedTermMonths: 24,
      });
    });

    renderStep();

    expect(mockMutateAsync).not.toHaveBeenCalled();
  });
});
