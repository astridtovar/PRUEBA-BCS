"use client";

import { useEffect, useRef } from "react";
import { ArrowLeft, ArrowRight, RefreshCw, CheckCircle2, XCircle, AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { LoadingSpinner } from "@/shared/components/feedback/LoadingSpinner";
import { useWizardStore } from "@/features/applications/store/wizardStore";
import { useSimulateOffer } from "@/features/applications/hooks/useApplicationMutations";

import { SIMULATION_STATUS } from "@/features/applications/types/application.types";
import { toast } from "sonner";
import { t } from "@/shared/i18n";

const d = t.wizard.simulation;
const f = t.common.fields;

function formatCurrency(value: number) {
  return new Intl.NumberFormat("es-CO", {
    style: "currency",
    currency: "COP",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value);
}

export function StepSimulation() {
  const { applicationId, simulationResult, setSimulationResult, nextStep, prevStep } =
    useWizardStore();
  const simulateMutation = useSimulateOffer(applicationId ?? "");
  const hasInitiated = useRef(false);

  useEffect(() => {
    if (!simulationResult && applicationId && !hasInitiated.current) {
      hasInitiated.current = true;
      runSimulation();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function runSimulation() {
    if (!applicationId) return;
    try {
      const result = await simulateMutation.mutateAsync();
      setSimulationResult(result.simulationResult);
    } catch (err) {
      const httpStatus = (err as Error & { status?: number }).status;
      if (httpStatus === 502) {
        setSimulationResult({
          status: "TECHNICAL_ERROR",
          errorMessage: d.technicalError.message,
        });
      } else {
        toast.error(d.errors.simulationFailed);
      }
    }
  }

  const result = simulationResult;

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold text-foreground">{d.title}</h2>
        <p className="mt-1 text-sm text-muted-foreground">{d.subtitle}</p>
      </div>

      {!result && simulateMutation.isPending && (
        <div className="flex min-h-[200px] flex-col items-center justify-center gap-4 rounded-xl border border-border bg-muted/30 p-8">
          <LoadingSpinner size="lg" label={d.loading.label} />
          <p className="text-sm text-muted-foreground">{d.loading.hint}</p>
        </div>
      )}

      {result?.status === SIMULATION_STATUS.VIABLE && (
        <div
          role="region"
          aria-label={d.viable.ariaLabel}
          className="rounded-xl border-2 border-green-200 bg-green-50 p-6 space-y-4"
        >
          <div className="flex items-center gap-3">
            <CheckCircle2
              className="h-6 w-6 shrink-0 text-green-600"
              aria-hidden="true"
            />
            <div>
              <p className="font-semibold text-green-800">{d.viable.title}</p>
              <p className="text-sm text-green-700">{d.viable.subtitle}</p>
            </div>
          </div>

          <dl className="grid gap-3 sm:grid-cols-2 border-t border-green-200 pt-4">
            <div className="rounded-lg bg-white/70 p-3">
              <dt className="text-xs font-medium uppercase tracking-wide text-green-700">
                {f.approvedAmount}
              </dt>
              <dd className="mt-1 text-xl font-bold text-green-800">
                {formatCurrency(result.approvedAmount ?? 0)}
              </dd>
            </div>
            <div className="rounded-lg bg-white/70 p-3">
              <dt className="text-xs font-medium uppercase tracking-wide text-green-700">
                {f.monthlyInstallment}
              </dt>
              <dd className="mt-1 text-xl font-bold text-green-800">
                {formatCurrency(result.monthlyInstallment ?? 0)}
              </dd>
            </div>
            <div className="rounded-lg bg-white/70 p-3">
              <dt className="text-xs font-medium uppercase tracking-wide text-green-700">
                {f.approvedTerm}
              </dt>
              <dd className="mt-1 text-xl font-bold text-green-800">
                {f.months(result.approvedTermMonths ?? 0)}
              </dd>
            </div>
            <div className="rounded-lg bg-white/70 p-3">
              <dt className="text-xs font-medium uppercase tracking-wide text-green-700">
                {f.monthlyRate}
              </dt>
              <dd className="mt-1 text-xl font-bold text-green-800">
                {result.interestRate}%
              </dd>
            </div>
          </dl>
        </div>
      )}

      {result?.status === SIMULATION_STATUS.NOT_VIABLE && (
        <div
          role="region"
          aria-label={d.notViable.ariaLabel}
          className="rounded-xl border-2 border-amber-200 bg-amber-50 p-6 space-y-3"
        >
          <div className="flex items-start gap-3">
            <XCircle
              className="mt-0.5 h-6 w-6 shrink-0 text-amber-600"
              aria-hidden="true"
            />
            <div>
              <p className="font-semibold text-amber-800">{d.notViable.title}</p>
              <p className="mt-1 text-sm text-amber-700">{result.rejectionReason}</p>
            </div>
          </div>
          <p className="text-xs text-amber-600 border-t border-amber-200 pt-3">
            {d.notViable.footnote}
          </p>
        </div>
      )}

      {result?.status === SIMULATION_STATUS.TECHNICAL_ERROR && (
        <div
          role="alert"
          aria-label={d.technicalError.ariaLabel}
          className="rounded-xl border-2 border-destructive/30 bg-destructive/5 p-6 space-y-3"
        >
          <div className="flex items-start gap-3">
            <AlertTriangle
              className="mt-0.5 h-6 w-6 shrink-0 text-destructive"
              aria-hidden="true"
            />
            <div>
              <p className="font-semibold text-destructive">{d.technicalError.title}</p>
              <p className="mt-1 text-sm text-destructive/80">{result.errorMessage}</p>
            </div>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={runSimulation}
            disabled={simulateMutation.isPending}
            className="gap-2 border-destructive/30 text-destructive hover:bg-destructive/10"
          >
            <RefreshCw className="h-3.5 w-3.5" aria-hidden="true" />
            {d.technicalError.tryAgain}
          </Button>
        </div>
      )}

      {!result && !simulateMutation.isPending && simulateMutation.isError && (
        <div className="rounded-xl border border-border bg-muted/30 p-6 text-center space-y-3">
          <p className="text-sm text-muted-foreground">{d.connectionError.message}</p>
          <Button variant="outline" size="sm" onClick={runSimulation} className="gap-2">
            <RefreshCw className="h-3.5 w-3.5" aria-hidden="true" />
            {d.connectionError.retry}
          </Button>
        </div>
      )}

      <div className="flex justify-between pt-2">
        <Button
          type="button"
          variant="outline"
          onClick={prevStep}
          disabled={!result && simulateMutation.isPending}
          className="gap-2"
        >
          <ArrowLeft className="h-4 w-4" aria-hidden="true" />
          {d.buttons.back}
        </Button>
        {result && result.status !== SIMULATION_STATUS.TECHNICAL_ERROR && (
          <Button
            onClick={nextStep}
            className="gap-2"
          >
            {d.buttons.viewSummary}
            <ArrowRight className="h-4 w-4" aria-hidden="true" />
          </Button>
        )}
      </div>
    </div>
  );
}
