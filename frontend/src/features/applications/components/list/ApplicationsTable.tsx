"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

import { ExternalLink, ChevronRight } from "lucide-react";

import { LinkButton } from "@/shared/components/ui/LinkButton";
import { EmptyState } from "@/shared/components/feedback/EmptyState";
import { ErrorMessage } from "@/shared/components/feedback/ErrorMessage";
import { LoadingSpinner } from "@/shared/components/feedback/LoadingSpinner";
import { ApplicationFilters } from "./ApplicationFilters";
import { ApplicationStatusBadge } from "./ApplicationStatusBadge";

import { useApplications } from "@/features/applications/hooks/useApplications";
import { useDebounce } from "@/shared/hooks/useDebounce";

import { CHANNEL_LABELS, type Application, type ApplicationsQuery, type ApplicationStatus } from "@/features/applications/types/application.types";
import { t } from "@/shared/i18n";

const d = t.applications.list;

function formatDate(dateStr: string) {
  return new Intl.DateTimeFormat("es-CO", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(dateStr));
}

function getApplicantName(app: Application): { name: string; hasData: boolean } {
  if (app.firstName || app.lastName) {
    return {
      name: `${app.firstName ?? ""} ${app.lastName ?? ""}`.trim(),
      hasData: true,
    };
  }
  if (app.email) {
    return { name: app.email, hasData: true };
  }
  return { name: "-", hasData: false };
}

export function ApplicationsTable() {
  const router = useRouter();
  const [rawQuery, setRawQuery] = useState<ApplicationsQuery>({});
  const debouncedSearch = useDebounce(rawQuery.search, 400);
  const query: ApplicationsQuery = { ...rawQuery, search: debouncedSearch };

  const { data: applications, isLoading, isError, refetch } = useApplications(query);

  return (
    <div className="space-y-4">
      <ApplicationFilters query={rawQuery} onChange={setRawQuery} />

      {isLoading && (
        <div className="flex min-h-[300px] items-center justify-center">
          <LoadingSpinner size="lg" label={d.loading} />
        </div>
      )}

      {isError && (
        <ErrorMessage
          title={d.error.title}
          message={d.error.description}
          onRetry={() => refetch()}
        />
      )}

      {!isLoading && !isError && applications?.length === 0 && (
        <EmptyState
          title={d.empty.filtered.title}
          description={
            query.status || query.channel || query.search
              ? d.empty.filtered.description
              : d.empty.initial.description
          }
          action={
            <LinkButton href="/applications/new" size="sm">
              {d.empty.initial.action}
            </LinkButton>
          }
        />
      )}

      {!isLoading && !isError && applications && applications.length > 0 && (
        <div className="rounded-xl border border-border overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-sm" aria-label="Lista de solicitudes">
              <thead>
                <tr className="border-b border-border bg-muted/50">
                  <th scope="col" className="px-4 py-3 text-left font-semibold text-foreground">
                    {d.table.columns.applicant}
                  </th>
                  <th scope="col" className="px-4 py-3 text-left font-semibold text-foreground hidden sm:table-cell">
                    {d.table.columns.channel}
                  </th>
                  <th scope="col" className="px-4 py-3 text-left font-semibold text-foreground">
                    {d.table.columns.status}
                  </th>
                  <th scope="col" className="px-4 py-3 text-left font-semibold text-foreground hidden md:table-cell">
                    {d.table.columns.created}
                  </th>
                  <th scope="col" className="px-4 py-3 text-right font-semibold text-foreground">
                    <span className="sr-only">{d.table.columns.actions}</span>
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {applications.map((app) => {
                  const applicant = getApplicantName(app);
                  return (
                  <tr
                    key={app.id}
                    className="hover:bg-muted/30 transition-colors cursor-pointer"
                    onClick={() => router.push(`/applications/${app.id}`)}
                  >
                    <td className="px-4 py-3">
                      <div className={applicant.hasData ? "font-medium text-foreground" : "text-sm italic text-muted-foreground"}>
                        {applicant.name}
                      </div>
                      {app.documentNumber && (
                        <div className="text-xs text-muted-foreground">
                          {app.documentType} {app.documentNumber}
                        </div>
                      )}
                    </td>
                    <td className="px-4 py-3 hidden sm:table-cell text-muted-foreground">
                      {CHANNEL_LABELS[app.channel]}
                    </td>
                    <td className="px-4 py-3">
                      <ApplicationStatusBadge status={app.status as ApplicationStatus} />
                    </td>
                    <td className="px-4 py-3 hidden md:table-cell text-muted-foreground text-xs">
                      {formatDate(app.createdAt)}
                    </td>
                    <td className="px-4 py-3 text-right">
                      <LinkButton
                        href={`/applications/${app.id}`}
                        variant="ghost"
                        size="sm"
                        className="gap-1 text-primary hover:text-primary"
                        aria-label={d.table.viewApplication(applicant.name)}
                        onClick={(e) => e.stopPropagation()}
                      >
                        <ExternalLink className="h-3.5 w-3.5" aria-hidden="true" />
                        <ChevronRight className="h-3.5 w-3.5 ml-0.5" aria-hidden="true" />
                      </LinkButton>
                    </td>
                  </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
          <div className="border-t border-border bg-muted/20 px-4 py-2 text-xs text-muted-foreground">
            {d.table.resultsCount(applications.length)}
          </div>
        </div>
      )}
    </div>
  );
}
