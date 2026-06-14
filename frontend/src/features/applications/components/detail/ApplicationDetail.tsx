"use client";

import Link from "next/link";

import { ChevronLeft, Edit3 } from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

import { LinkButton } from "@/shared/components/ui/LinkButton";
import { LoadingPage } from "@/shared/components/feedback/LoadingSpinner";
import { ErrorMessage } from "@/shared/components/feedback/ErrorMessage";
import { ApplicationStatusBadge } from "../list/ApplicationStatusBadge";
import { EventTimeline } from "./EventTimeline";

import { useApplication } from "@/features/applications/hooks/useApplication";

import {
  APPLICATION_STATUS,
  SIMULATION_STATUS,
  CHANNEL_LABELS,
  DOCUMENT_TYPE_LABELS,
  type ApplicationStatus,
} from "@/features/applications/types/application.types";
import { t } from "@/shared/i18n";

const d = t.applications.detail;
const f = t.common.fields;

function InfoItem({ label, value }: { label: string; value?: string | number | null }) {
  return (
    <div className="flex flex-col gap-0.5">
      <dt className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
        {label}
      </dt>
      <dd className="text-sm text-foreground">{value ?? "—"}</dd>
    </div>
  );
}

function formatCurrency(v?: number) {
  if (!v) return "—";
  return new Intl.NumberFormat("es-CO", {
    style: "currency",
    currency: "COP",
    minimumFractionDigits: 0,
  }).format(v);
}

function formatDate(s?: string) {
  if (!s) return "—";
  return new Intl.DateTimeFormat("es-CO", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(s));
}

interface ApplicationDetailProps {
  id: string;
}

export function ApplicationDetail({ id }: ApplicationDetailProps) {
  const { data: app, isLoading, isError, refetch } = useApplication(id);

  if (isLoading) return <LoadingPage label={d.loading} />;
  if (isError || !app)
    return (
      <ErrorMessage
        title={d.error.title}
        message={d.error.description}
        onRetry={() => refetch()}
      />
    );

  const canEdit = app.status === APPLICATION_STATUS.DRAFT;

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <Link
            href="/applications"
            className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            <ChevronLeft className="h-4 w-4" aria-hidden="true" />
            {d.breadcrumb}
          </Link>
          <Separator orientation="vertical" className="h-4" />
          <ApplicationStatusBadge status={app.status as ApplicationStatus} />
        </div>

        {canEdit && (
          <LinkButton
            href={`/applications/${id}/edit`}
            variant="outline"
            size="sm"
            className="gap-2"
          >
            <Edit3 className="h-3.5 w-3.5" aria-hidden="true" />
            {t.common.buttons.edit}
          </LinkButton>
        )}
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-4">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base">{f.channel}</CardTitle>
            </CardHeader>
            <CardContent>
              <dl className="grid gap-3 sm:grid-cols-2">
                <InfoItem
                  label={f.channel}
                  value={CHANNEL_LABELS[app.channel]}
                />
                {app.advisorId && (
                  <InfoItem label={f.advisorId} value={app.advisorId} />
                )}
              </dl>
            </CardContent>
          </Card>

          {(app.firstName || app.documentNumber) && (
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-base">{d.sections.personalInfo}</CardTitle>
              </CardHeader>
              <CardContent>
                <dl className="grid gap-3 sm:grid-cols-2">
                  <InfoItem
                    label={f.fullName}
                    value={`${app.firstName ?? ""} ${app.lastName ?? ""}`.trim() || undefined}
                  />
                  <InfoItem
                    label={f.document}
                    value={
                      app.documentType
                        ? `${DOCUMENT_TYPE_LABELS[app.documentType]} ${app.documentNumber}`
                        : undefined
                    }
                  />
                  <InfoItem label={f.phone} value={app.phone} />
                  <InfoItem label={f.email} value={app.email} />
                  <InfoItem label={f.city} value={app.city} />
                </dl>
              </CardContent>
            </Card>
          )}

          {app.requestedAmount && (
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-base">{d.sections.financialInfo}</CardTitle>
              </CardHeader>
              <CardContent>
                <dl className="grid gap-3 sm:grid-cols-2">
                  <InfoItem label={f.monthlyIncome} value={formatCurrency(app.monthlyIncome)} />
                  <InfoItem label={f.monthlyExpenses} value={formatCurrency(app.monthlyExpenses)} />
                  <InfoItem label={f.requestedAmount} value={formatCurrency(app.requestedAmount)} />
                  <InfoItem label={f.desiredTerm} value={app.termMonths ? f.months(app.termMonths) : undefined} />
                  <InfoItem label={f.creditPurpose} value={app.creditPurpose} />
                  <InfoItem
                    label={f.dataProcessing}
                    value={app.dataProcessingAccepted ? f.accepted : f.notAccepted}
                  />
                </dl>
              </CardContent>
            </Card>
          )}

          {app.simulationResult && (
            <Card
              className={
                app.simulationResult.status === SIMULATION_STATUS.VIABLE
                  ? "border-green-200"
                  : "border-amber-200"
              }
            >
              <CardHeader className="pb-3">
                <CardTitle className="text-base">{d.sections.simulationResult}</CardTitle>
              </CardHeader>
              <CardContent>
                <dl className="grid gap-3 sm:grid-cols-2">
                  <InfoItem
                    label={t.wizard.summary.simulation.result}
                    value={
                      app.simulationResult.status === SIMULATION_STATUS.VIABLE
                        ? d.simulation.preApproved
                        : d.simulation.notViable
                    }
                  />
                  {app.simulationResult.status === SIMULATION_STATUS.VIABLE && (
                    <>
                      <InfoItem
                        label={f.approvedAmount}
                        value={formatCurrency(app.simulationResult.approvedAmount)}
                      />
                      <InfoItem
                        label={f.monthlyInstallment}
                        value={formatCurrency(app.simulationResult.monthlyInstallment)}
                      />
                      <InfoItem
                        label={f.approvedTerm}
                        value={app.simulationResult.approvedTermMonths ? f.months(app.simulationResult.approvedTermMonths) : undefined}
                      />
                      <InfoItem
                        label={f.monthlyRate}
                        value={`${app.simulationResult.interestRate}%`}
                      />
                    </>
                  )}
                  {app.simulationResult.status === SIMULATION_STATUS.NOT_VIABLE && (
                    <InfoItem
                      label={t.wizard.summary.simulation.reason}
                      value={app.simulationResult.rejectionReason}
                    />
                  )}
                </dl>
              </CardContent>
            </Card>
          )}

          {app.abandonReason && (
            <Card className="border-red-200 bg-red-50">
              <CardHeader className="pb-3">
                <CardTitle className="text-base text-destructive">
                  {d.sections.abandonReason}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-destructive/80">{app.abandonReason}</p>
              </CardContent>
            </Card>
          )}

          <div className="text-xs text-muted-foreground space-y-0.5">
            <p>{d.dates.created(formatDate(app.createdAt))}</p>
            <p>{d.dates.updated(formatDate(app.updatedAt))}</p>
          </div>
        </div>

        <div>
          <Card className="sticky top-24">
            <CardHeader className="pb-3">
              <CardTitle className="text-base">{d.sections.eventTimeline}</CardTitle>
            </CardHeader>
            <CardContent>
              <EventTimeline applicationId={id} />
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
