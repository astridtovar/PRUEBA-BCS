import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

import { STATUS_LABELS, type ApplicationStatus } from "@/features/applications/types/application.types";

const variants: Record<ApplicationStatus, string> = {
  DRAFT:
    "bg-yellow-100 text-yellow-800 border-yellow-200 hover:bg-yellow-100",
  PENDING_VALIDATION:
    "bg-blue-100 text-blue-800 border-blue-200 hover:bg-blue-100",
  FINALIZED:
    "bg-green-100 text-green-800 border-green-200 hover:bg-green-100",
  ABANDONED:
    "bg-red-100 text-red-800 border-red-200 hover:bg-red-100",
};

interface ApplicationStatusBadgeProps {
  status: ApplicationStatus;
  className?: string;
}

export function ApplicationStatusBadge({
  status,
  className,
}: ApplicationStatusBadgeProps) {
  return (
    <Badge
      variant="outline"
      className={cn("font-medium", variants[status], className)}
      aria-label={`Status: ${STATUS_LABELS[status]}`}
    >
      {STATUS_LABELS[status]}
    </Badge>
  );
}
