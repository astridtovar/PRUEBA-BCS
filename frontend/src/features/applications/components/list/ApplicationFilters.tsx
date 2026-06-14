"use client";

import { Search, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import type {
  ApplicationsQuery,
  ApplicationStatus,
  ApplicationChannel,
} from "@/features/applications/types/application.types";
import { STATUS_LABELS, CHANNEL_LABELS } from "@/features/applications/types/application.types";
import { t } from "@/shared/i18n";

const d = t.applications.filters;

interface ApplicationFiltersProps {
  query: ApplicationsQuery;
  onChange: (query: ApplicationsQuery) => void;
}

const STATUS_OPTIONS: { value: ApplicationStatus | "ALL"; label: string }[] = [
  { value: "ALL", label: d.allStatuses },
  { value: "DRAFT", label: STATUS_LABELS.DRAFT },
  { value: "PENDING_VALIDATION", label: STATUS_LABELS.PENDING_VALIDATION },
  { value: "FINALIZED", label: STATUS_LABELS.FINALIZED },
  { value: "ABANDONED", label: STATUS_LABELS.ABANDONED },
];

const CHANNEL_OPTIONS: { value: ApplicationChannel | "ALL"; label: string }[] = [
  { value: "ALL", label: d.allChannels },
  { value: "SELF_SERVICE", label: CHANNEL_LABELS.SELF_SERVICE },
  { value: "ASSISTED", label: CHANNEL_LABELS.ASSISTED },
];

export function ApplicationFilters({ query, onChange }: ApplicationFiltersProps) {
  const hasFilters = query.status || query.channel || query.search;

  function clearFilters() {
    onChange({ status: undefined, channel: undefined, search: undefined });
  }

  return (
    <div
      role="search"
      aria-label={d.srLabel}
      className="flex flex-wrap gap-3 items-center"
    >
      <div className="relative flex-1 min-w-[200px]">
        <Search
          className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground"
          aria-hidden="true"
        />
        <Input
          type="search"
          placeholder={d.searchPlaceholder}
          className="pl-9"
          value={query.search ?? ""}
          onChange={(e) => onChange({ ...query, search: e.target.value || undefined })}
          aria-label={d.aria.search}
        />
      </div>

      <Select
        value={query.status ?? "ALL"}
        onValueChange={(v) =>
          onChange({
            ...query,
            status: v === "ALL" ? undefined : (v as ApplicationStatus),
          })
        }
      >
        <SelectTrigger className="w-[190px]" aria-label={d.aria.status}>
          <span className="flex-1 text-left text-sm truncate">
            {STATUS_OPTIONS.find((o) => o.value === (query.status ?? "ALL"))?.label}
          </span>
        </SelectTrigger>
        <SelectContent>
          {STATUS_OPTIONS.map((opt) => (
            <SelectItem key={opt.value} value={opt.value}>
              {opt.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Select
        value={query.channel ?? "ALL"}
        onValueChange={(v) =>
          onChange({
            ...query,
            channel: v === "ALL" ? undefined : (v as ApplicationChannel),
          })
        }
      >
        <SelectTrigger className="w-[160px]" aria-label={d.aria.channel}>
          <span className="flex-1 text-left text-sm truncate">
            {CHANNEL_OPTIONS.find((o) => o.value === (query.channel ?? "ALL"))?.label}
          </span>
        </SelectTrigger>
        <SelectContent>
          {CHANNEL_OPTIONS.map((opt) => (
            <SelectItem key={opt.value} value={opt.value}>
              {opt.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      {hasFilters && (
        <Button
          variant="ghost"
          size="sm"
          onClick={clearFilters}
          className="gap-1.5 text-muted-foreground hover:text-foreground"
          aria-label={d.aria.clear}
        >
          <X className="h-3.5 w-3.5" aria-hidden="true" />
          {d.clear}
        </Button>
      )}
    </div>
  );
}
