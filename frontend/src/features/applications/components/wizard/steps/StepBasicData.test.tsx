import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { act } from "react";

import { StepBasicData } from "./StepBasicData";
import { useWizardStore } from "@/features/applications/store/wizardStore";
import { t } from "@/shared/i18n";

const d = t.wizard.basicData;

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

function makeClient() {
  return new QueryClient({
    defaultOptions: { queries: { retry: false }, mutations: { retry: false } },
  });
}

function renderStep() {
  return render(
    <QueryClientProvider client={makeClient()}>
      <StepBasicData />
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
    useWizardStore.getState().setStep(1);
    // Pre-set documentType so no need to interactuar con el Select de shadcn en jsdom
    useWizardStore.getState().setStep2({ documentType: "CC" });
  });
});

async function fillAllFields(user: ReturnType<typeof userEvent.setup>) {
  await user.type(screen.getByLabelText(/número de documento/i), "12345678");
  await user.type(screen.getByLabelText(/primer nombre/i), "John");
  await user.type(screen.getByLabelText(/apellido/i), "Doe");
  await user.type(screen.getByLabelText(/teléfono/i), "3001234567");
  await user.type(screen.getByLabelText(/correo/i), "john@example.com");
  await user.type(screen.getByLabelText(/ciudad/i), "Bogotá");
}

describe("StepBasicData — comportamiento del formulario", () => {
  it("muestra el título del paso", () => {
    renderStep();
    expect(screen.getByText(d.title)).toBeInTheDocument();
  });

  it("pre-rellena los campos con datos guardados en el store", () => {
    act(() => {
      useWizardStore.getState().setStep2({
        firstName: "María",
        lastName: "García",
        email: "maria@example.com",
        phone: "3109876543",
        city: "Medellín",
      });
    });
    renderStep();

    expect(screen.getByLabelText(/primer nombre/i)).toHaveValue("María");
    expect(screen.getByLabelText(/apellido/i)).toHaveValue("García");
    expect(screen.getByLabelText(/correo/i)).toHaveValue("maria@example.com");
    expect(screen.getByLabelText(/teléfono/i)).toHaveValue("3109876543");
    expect(screen.getByLabelText(/ciudad/i)).toHaveValue("Medellín");
  });

  it("llama a la mutación con los datos correctos al enviar", async () => {
    const user = userEvent.setup();
    mockMutateAsync.mockResolvedValueOnce({});
    renderStep();

    await fillAllFields(user);
    await user.click(screen.getByRole("button", { name: d.buttons.continue }));

    await waitFor(() =>
      expect(mockMutateAsync).toHaveBeenCalledWith(
        expect.objectContaining({
          documentType: "CC",
          documentNumber: "12345678",
          firstName: "John",
          lastName: "Doe",
          phone: "3001234567",
          email: "john@example.com",
          city: "Bogotá",
        })
      )
    );
  });

  it("avanza al siguiente paso tras un submit exitoso", async () => {
    const user = userEvent.setup();
    mockMutateAsync.mockResolvedValueOnce({});
    renderStep();

    await fillAllFields(user);
    await user.click(screen.getByRole("button", { name: d.buttons.continue }));

    await waitFor(() =>
      expect(useWizardStore.getState().currentStep).toBe(2)
    );
  });

  it("muestra error inline cuando la mutación falla", () => {
    mockIsError = true;
    renderStep();
    expect(screen.getByRole("alert")).toHaveTextContent(d.errors.saveFailed);
  });

  it("no envía si el email es inválido", async () => {
    const user = userEvent.setup();
    renderStep();

    await user.type(screen.getByLabelText(/número de documento/i), "12345678");
    await user.type(screen.getByLabelText(/primer nombre/i), "John");
    await user.type(screen.getByLabelText(/apellido/i), "Doe");
    await user.type(screen.getByLabelText(/teléfono/i), "3001234567");
    await user.type(screen.getByLabelText(/correo/i), "no-es-un-email");
    await user.type(screen.getByLabelText(/ciudad/i), "Bogotá");
    await user.click(screen.getByRole("button", { name: d.buttons.continue }));

    await waitFor(() =>
      expect(screen.getAllByRole("alert").length).toBeGreaterThan(0)
    );
    expect(mockMutateAsync).not.toHaveBeenCalled();
  });

  it("retrocede al paso anterior al hacer clic en Atrás", async () => {
    const user = userEvent.setup();
    renderStep();

    await user.click(screen.getByRole("button", { name: d.buttons.back }));

    expect(useWizardStore.getState().currentStep).toBe(0);
  });
});
