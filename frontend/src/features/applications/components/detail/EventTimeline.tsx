"use client";

import { useApplicationEvents } from "@/features/applications/hooks/useApplication";
import { LoadingSpinner } from "@/shared/components/feedback/LoadingSpinner";
import { ErrorMessage } from "@/shared/components/feedback/ErrorMessage";
import type { EventType } from "@/features/applications/types/application.types";
import {
  CheckCircle2,
  Circle,
  Edit3,
  AlertTriangle,
  XCircle,
  Play,
  Save,
  TrendingUp,
  TrendingDown,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { t } from "@/shared/i18n";

const d = t.applications.timeline;

const EVENT_CONFIG: Record<
  EventType,
  { label: string; icon: React.ElementType; color: string }
> = {
  CREATED: {
    label: d.events.CREATED,
    icon: Circle,
    color: "text-primary bg-primary/10",
  },
  UPDATED: {
    label: d.events.UPDATED,
    icon: Edit3,
    color: "text-blue-600 bg-blue-100",
  },
  DRAFT_SAVED: {
    label: d.events.DRAFT_SAVED,
    icon: Save,
    color: "text-slate-600 bg-slate-100",
  },
  SIMULATION_REQUESTED: {
    label: d.events.SIMULATION_REQUESTED,
    icon: Play,
    color: "text-purple-600 bg-purple-100",
  },
  SIMULATION_SUCCESS: {
    label: d.events.SIMULATION_SUCCESS,
    icon: TrendingUp,
    color: "text-green-600 bg-green-100",
  },
  SIMULATION_NOT_VIABLE: {
    label: d.events.SIMULATION_NOT_VIABLE,
    icon: TrendingDown,
    color: "text-amber-600 bg-amber-100",
  },
  SIMULATION_ERROR: {
    label: d.events.SIMULATION_ERROR,
    icon: AlertTriangle,
    color: "text-destructive bg-destructive/10",
  },
  FINALIZED: {
    label: d.events.FINALIZED,
    icon: CheckCircle2,
    color: "text-green-600 bg-green-100",
  },
  ABANDONED: {
    label: d.events.ABANDONED,
    icon: XCircle,
    color: "text-destructive bg-destructive/10",
  },
};

function formatDateTime(dateStr: string) {
  return new Intl.DateTimeFormat("es-CO", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  }).format(new Date(dateStr));
}

interface EventTimelineProps {
  applicationId: string;
}

export function EventTimeline({ applicationId }: EventTimelineProps) {
  const { data: events, isLoading, isError, refetch } = useApplicationEvents(applicationId);

  if (isLoading) {
    return <LoadingSpinner size="sm" label={d.loading} />;
  }

  if (isError) {
    return (
      <ErrorMessage
        title={d.error}
        onRetry={() => refetch()}
      />
    );
  }

  if (!events || events.length === 0) {
    return (
      <p className="text-sm text-muted-foreground">{d.empty}</p>
    );
  }

  return (
    <ol aria-label={d.ariaLabel} className="space-y-0">
      {events.map((event, index) => {
        const config = EVENT_CONFIG[event.type] ?? {
          label: event.type,
          icon: Circle,
          color: "text-muted-foreground bg-muted",
        };
        const Icon = config.icon;
        const isLast = index === events.length - 1;

        return (
          <li key={event.id} className="flex gap-4">
            <div className="flex flex-col items-center">
              <div
                className={cn(
                  "flex h-8 w-8 shrink-0 items-center justify-center rounded-full",
                  config.color
                )}
                aria-hidden="true"
              >
                <Icon className="h-4 w-4" />
              </div>
              {!isLast && (
                <div className="w-0.5 flex-1 bg-border my-1" aria-hidden="true" />
              )}
            </div>
            <div className={cn("pb-4 pt-0.5 flex-1", isLast && "pb-0")}>
              <p className="text-sm font-medium text-foreground">
                {config.label}
              </p>
              <p className="text-xs text-muted-foreground mt-0.5">
                {formatDateTime(event.timestamp)}
              </p>
              {event.description && (
                <p className="text-xs text-muted-foreground mt-1 italic">
                  {event.description}
                </p>
              )}
            </div>
          </li>
        );
      })}
    </ol>
  );
}
