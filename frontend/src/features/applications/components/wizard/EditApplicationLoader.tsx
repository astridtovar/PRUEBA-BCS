"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ChevronLeft } from "lucide-react";
import { WizardContainer } from "./WizardContainer";
import { LoadingPage } from "@/shared/components/feedback/LoadingSpinner";
import { ErrorMessage } from "@/shared/components/feedback/ErrorMessage";
import { useApplication } from "@/features/applications/hooks/useApplication";
import { useWizardStore } from "@/features/applications/store/wizardStore";

export function EditApplicationLoader({ id }: { id: string }) {
  const { data: app, isLoading, isError, refetch } = useApplication(id);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    if (!app) return;

    const store = useWizardStore.getState();
    store.reset();
    store.setApplicationId(app.id);
    store.setStep1({ channel: app.channel, advisorId: app.advisorId });

    if (app.firstName || app.documentNumber) {
      store.setStep2({
        documentType: app.documentType,
        documentNumber: app.documentNumber ?? "",
        firstName: app.firstName ?? "",
        lastName: app.lastName ?? "",
        phone: app.phone ?? "",
        email: app.email ?? "",
        city: app.city ?? "",
      });
    }

    if (app.monthlyIncome || app.requestedAmount) {
      store.setStep3({
        monthlyIncome: app.monthlyIncome,
        monthlyExpenses: app.monthlyExpenses,
        requestedAmount: app.requestedAmount,
        termMonths: app.termMonths,
        creditPurpose: app.creditPurpose ?? "",
        dataProcessingAccepted: app.dataProcessingAccepted ?? false,
      });
    }

    if (app.simulationResult) {
      store.setSimulationResult(app.simulationResult);
    }

    let step = 0;
    if (app.channel) step = 1;
    if (app.firstName) step = 2;
    if (app.requestedAmount) step = 3;

    store.setStep(step);
    setReady(true);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [app]);

  if (isLoading) return <LoadingPage label="Cargando solicitud..." />;
  if (isError || (!isLoading && !app))
    return (
      <ErrorMessage
        title="No se pudo cargar la solicitud"
        message="Verifica que la solicitud existe y vuelve a intentarlo."
        onRetry={() => refetch()}
      />
    );
  if (!ready) return <LoadingPage label="Preparando formulario..." />;

  return (
    <div className="min-h-screen bg-muted/30 py-8 px-4 sm:px-6">
      <div className="mx-auto max-w-3xl">
        <Link
          href={`/applications/${id}`}
          className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground mb-6 transition-colors"
        >
          <ChevronLeft className="h-4 w-4" aria-hidden="true" />
          Volver al detalle
        </Link>

        <div className="rounded-2xl border border-border bg-background shadow-sm p-6 sm:p-8">
          <div className="mb-8">
            <h1 className="text-2xl font-bold text-foreground">
              Editar solicitud
            </h1>
            <p className="mt-1 text-sm text-muted-foreground">
              Continúa donde lo dejaste. Tu progreso se guarda automáticamente.
            </p>
          </div>

          <WizardContainer resume={true} />
        </div>
      </div>
    </div>
  );
}
