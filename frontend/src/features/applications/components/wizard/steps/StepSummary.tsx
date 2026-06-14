"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { CheckCircle2, XCircle, AlertTriangle, ArrowLeft, ArrowRight, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { AbandonDialog } from "../AbandonDialog";
import { useWizardStore } from "@/features/applications/store/wizardStore";
import { useFinalizeApplication } from "@/features/applications/hooks/useApplicationMutations";
import { toast } from "sonner";

import {
  SIMULATION_STATUS,
  CHANNEL_LABELS,
  DOCUMENT_TYPE_LABELS,
} from "@/features/applications/types/application.types";
import { t } from "@/shared/i18n";

const d = t.wizard.summary;
const f = t.common.fields;

function formatCurrency(value: number | undefined) {
  if (!value) return "—";
  return new Intl.NumberFormat("es-CO", {
    style: "currency",
    currency: "COP",
    minimumFractionDigits: 0,
  }).format(value);
}

function SummaryItem({ label, value }: { label: string; value?: string | number | boolean | null }) {
  const display =
    value === undefined || value === null || value === ""
      ? "—"
      : typeof value === "boolean"
      ? value ? "Sí" : "No"
      : String(value);

  return (
    <div className="flex flex-col gap-0.5 sm:flex-row sm:items-baseline sm:justify-between">
      <dt className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
        {label}
      </dt>
      <dd className="text-sm font-medium text-foreground">{display}</dd>
    </div>
  );
}

export function StepSummary() {
  const router = useRouter();
  const { applicationId, step1, step2, step3, simulationResult, prevStep, reset } =
    useWizardStore();
  const finalizeMutation = useFinalizeApplication(applicationId ?? "");
  const [showAbandon, setShowAbandon] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  async function handleFinalize() {
    if (!applicationId) return;
    try {
      await finalizeMutation.mutateAsync();
      setSubmitted(true);
    } catch {
      toast.error(d.toasts.error);
    }
  }

  function handleAbandoned() {
    reset();
    router.push("/applications");
  }

  if (submitted) {
    return (
      <div className="space-y-6 py-8 text-center">
        <div className="flex justify-center">
          <div className="rounded-full bg-green-100 p-5">
            <CheckCircle2 className="h-10 w-10 text-green-600" aria-hidden="true" />
          </div>
        </div>
        <div className="space-y-2">
          <h2 className="text-xl font-bold text-foreground">{d.toasts.success}</h2>
          <p className="mx-auto max-w-sm text-sm text-muted-foreground">
            Tu solicitud fue recibida y será revisada próximamente.
          </p>
        </div>
        <button
          onClick={() => { reset(); router.push("/applications"); }}
          className="inline-flex items-center gap-2 rounded-md bg-primary px-5 py-2.5 text-sm font-medium text-primary-foreground hover:bg-primary/90 transition-colors"
        >
          Ver mis solicitudes
          <ArrowRight className="h-4 w-4" aria-hidden="true" />
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold text-foreground">{d.title}</h2>
        <p className="mt-1 text-sm text-muted-foreground">{d.subtitle}</p>
      </div>

      <dl className="space-y-4">
        <section aria-labelledby="channel-section">
          <h3 id="channel-section" className="text-sm font-semibold text-foreground mb-2">
            {d.sections.channel}
          </h3>
          <div className="space-y-2 rounded-lg border border-border bg-muted/20 p-4">
            <SummaryItem
              label={f.channel}
              value={step1.channel ? CHANNEL_LABELS[step1.channel] : "—"}
            />
            {step1.advisorId && (
              <SummaryItem label={f.advisorId} value={step1.advisorId} />
            )}
          </div>
        </section>

        <Separator />

        <section aria-labelledby="personal-section">
          <h3 id="personal-section" className="text-sm font-semibold text-foreground mb-2">
            {d.sections.personalData}
          </h3>
          <div className="space-y-2 rounded-lg border border-border bg-muted/20 p-4">
            <SummaryItem
              label={f.document}
              value={
                step2.documentType
                  ? `${DOCUMENT_TYPE_LABELS[step2.documentType]} ${step2.documentNumber}`
                  : "—"
              }
            />
            <SummaryItem label={f.fullName} value={`${step2.firstName ?? ""} ${step2.lastName ?? ""}`.trim()} />
            <SummaryItem label={f.phone} value={step2.phone} />
            <SummaryItem label={f.email} value={step2.email} />
            <SummaryItem label={f.city} value={step2.city} />
          </div>
        </section>

        <Separator />

        <section aria-labelledby="financial-section">
          <h3 id="financial-section" className="text-sm font-semibold text-foreground mb-2">
            {d.sections.financialData}
          </h3>
          <div className="space-y-2 rounded-lg border border-border bg-muted/20 p-4">
            <SummaryItem label={f.monthlyIncome} value={formatCurrency(step3.monthlyIncome)} />
            <SummaryItem label={f.monthlyExpenses} value={formatCurrency(step3.monthlyExpenses)} />
            <SummaryItem label={f.requestedAmount} value={formatCurrency(step3.requestedAmount)} />
            <SummaryItem label={f.desiredTerm} value={step3.termMonths ? f.months(step3.termMonths) : "—"} />
            <SummaryItem label={f.creditPurpose} value={step3.creditPurpose} />
            <SummaryItem label={f.dataProcessing} value={step3.dataProcessingAccepted} />
          </div>
        </section>

        {simulationResult && (
          <>
            <Separator />
            <section aria-labelledby="offer-section">
              <h3 id="offer-section" className="text-sm font-semibold text-foreground mb-2">
                {d.sections.simulationResult}
              </h3>

              {simulationResult.status === SIMULATION_STATUS.VIABLE && (
                <div className="rounded-lg border-2 border-green-200 bg-green-50 p-4 space-y-3">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="h-5 w-5 shrink-0 text-green-600" aria-hidden="true" />
                    <span className="font-semibold text-green-800">{d.simulation.preApproved}</span>
                  </div>
                  <dl className="grid grid-cols-2 gap-3 border-t border-green-200 pt-3">
                    <div>
                      <dt className="text-xs font-medium text-green-700">{f.approvedAmount}</dt>
                      <dd className="text-sm font-semibold text-green-800">{formatCurrency(simulationResult.approvedAmount)}</dd>
                    </div>
                    <div>
                      <dt className="text-xs font-medium text-green-700">{f.monthlyInstallment}</dt>
                      <dd className="text-sm font-semibold text-green-800">{formatCurrency(simulationResult.monthlyInstallment)}</dd>
                    </div>
                    <div>
                      <dt className="text-xs font-medium text-green-700">{f.approvedTerm}</dt>
                      <dd className="text-sm font-semibold text-green-800">{simulationResult.approvedTermMonths ? f.months(simulationResult.approvedTermMonths) : "—"}</dd>
                    </div>
                    <div>
                      <dt className="text-xs font-medium text-green-700">{f.monthlyRate}</dt>
                      <dd className="text-sm font-semibold text-green-800">{simulationResult.interestRate}%</dd>
                    </div>
                  </dl>
                </div>
              )}

              {simulationResult.status === SIMULATION_STATUS.NOT_VIABLE && (
                <div className="rounded-lg border-2 border-amber-200 bg-amber-50 p-4 space-y-2">
                  <div className="flex items-center gap-2">
                    <XCircle className="h-5 w-5 shrink-0 text-amber-600" aria-hidden="true" />
                    <span className="font-semibold text-amber-800">{d.simulation.notViable}</span>
                  </div>
                  <p className="text-sm text-amber-700 pl-7">{simulationResult.rejectionReason}</p>
                </div>
              )}

              {simulationResult.status === SIMULATION_STATUS.TECHNICAL_ERROR && (
                <div className="rounded-lg border-2 border-destructive/30 bg-destructive/5 p-4 space-y-2">
                  <div className="flex items-center gap-2">
                    <AlertTriangle className="h-5 w-5 shrink-0 text-destructive" aria-hidden="true" />
                    <span className="font-semibold text-destructive">{d.simulation.error}</span>
                  </div>
                </div>
              )}
            </section>
          </>
        )}
      </dl>

      <div className="rounded-lg border border-primary/20 bg-primary/5 p-4">
        <div className="flex items-start gap-3">
          <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-primary" aria-hidden="true" />
          <p className="text-sm text-foreground">{d.consent}</p>
        </div>
      </div>

      {finalizeMutation.isError && (
        <p role="alert" className="rounded-md bg-destructive/10 px-3 py-2 text-sm text-destructive">
          {d.toasts.error}
        </p>
      )}

      <div className="flex flex-col gap-3 sm:flex-row sm:justify-between pt-2">
        <div className="flex gap-2">
          <Button type="button" variant="outline" onClick={prevStep} className="gap-2">
            <ArrowLeft className="h-4 w-4" aria-hidden="true" />
            {d.buttons.back}
          </Button>
          <Button
            type="button"
            variant="outline"
            onClick={() => setShowAbandon(true)}
            className="text-destructive border-destructive/30 hover:bg-destructive/10"
          >
            {d.buttons.abandon}
          </Button>
        </div>
        <Button
          onClick={handleFinalize}
          disabled={finalizeMutation.isPending}
          className="gap-2"
        >
          {finalizeMutation.isPending ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
              {d.buttons.submitting}
            </>
          ) : (
            <>
              {d.buttons.submit}
              <CheckCircle2 className="h-4 w-4" aria-hidden="true" />
            </>
          )}
        </Button>
      </div>

      {applicationId && (
        <AbandonDialog
          applicationId={applicationId}
          open={showAbandon}
          onClose={() => setShowAbandon(false)}
          onAbandoned={handleAbandoned}
        />
      )}
    </div>
  );
}
