import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { AbandonDialog } from "./AbandonDialog";
import { t } from "@/shared/i18n";

const d = t.wizard.abandon;

const mockMutateAsync = jest.fn();
jest.mock("@/features/applications/hooks/useApplicationMutations", () => ({
  useAbandonApplication: () => ({
    mutateAsync: mockMutateAsync,
    isPending: false,
  }),
}));

jest.mock("sonner", () => ({ toast: { info: jest.fn(), error: jest.fn() } }));

function makeClient() {
  return new QueryClient({
    defaultOptions: { queries: { retry: false }, mutations: { retry: false } },
  });
}

const defaultProps = {
  applicationId: "test-id-1",
  open: true,
  onClose: jest.fn(),
  onAbandoned: jest.fn(),
};

function renderDialog(props = defaultProps) {
  return render(
    <QueryClientProvider client={makeClient()}>
      <AbandonDialog {...props} />
    </QueryClientProvider>
  );
}

describe("AbandonDialog — validación del motivo", () => {
  beforeEach(() => {
    defaultProps.onClose.mockReset();
    defaultProps.onAbandoned.mockReset();
    mockMutateAsync.mockReset();
  });

  it("muestra el diálogo cuando open=true", () => {
    renderDialog();
    expect(screen.getByRole("dialog")).toBeInTheDocument();
    expect(screen.getByText(d.title)).toBeInTheDocument();
  });

  it("muestra error de validación cuando el motivo es muy corto (< 5 chars)", async () => {
    const user = userEvent.setup();
    renderDialog();

    await user.type(screen.getByLabelText(new RegExp(d.reason.label.replace(" *", ""), "i")), "Hola");
    await user.click(screen.getByRole("button", { name: d.buttons.confirm }));

    expect(screen.getByRole("alert")).toHaveTextContent(d.reason.error);
    expect(mockMutateAsync).not.toHaveBeenCalled();
  });

  it("muestra error de validación cuando se confirma sin motivo", async () => {
    const user = userEvent.setup();
    renderDialog();

    await user.click(screen.getByRole("button", { name: d.buttons.confirm }));

    expect(screen.getByRole("alert")).toBeInTheDocument();
    expect(mockMutateAsync).not.toHaveBeenCalled();
  });

  it("limpia el error al escribir después de que apareció", async () => {
    const user = userEvent.setup();
    renderDialog();

    await user.click(screen.getByRole("button", { name: d.buttons.confirm }));
    expect(screen.getByRole("alert")).toBeInTheDocument();

    await user.type(screen.getByLabelText(new RegExp(d.reason.label.replace(" *", ""), "i")), "A");
    expect(screen.queryByRole("alert")).not.toBeInTheDocument();
  });

  it("llama onAbandoned tras envío exitoso con motivo válido", async () => {
    const user = userEvent.setup();
    const onAbandoned = jest.fn();
    mockMutateAsync.mockResolvedValueOnce({ status: "ABANDONED" });

    renderDialog({ ...defaultProps, onAbandoned });

    await user.type(
      screen.getByLabelText(new RegExp(d.reason.label.replace(" *", ""), "i")),
      "Ya no necesito el crédito en este momento."
    );
    await user.click(screen.getByRole("button", { name: d.buttons.confirm }));

    await waitFor(() => expect(onAbandoned).toHaveBeenCalledTimes(1));
    expect(mockMutateAsync).toHaveBeenCalledWith({
      reason: "Ya no necesito el crédito en este momento.",
    });
  });

  it("llama onClose al hacer clic en Volver", async () => {
    const user = userEvent.setup();
    const onClose = jest.fn();
    renderDialog({ ...defaultProps, onClose });

    await user.click(screen.getByRole("button", { name: d.buttons.goBack }));
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it("no renderiza cuando open=false", () => {
    renderDialog({ ...defaultProps, open: false });
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
  });
});
