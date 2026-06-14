"use client";

import { useQuery } from "@tanstack/react-query";
import { applicationsService } from "../services/applications.service";
import type { ApplicationsQuery } from "../types/application.types";

export function useApplications(query: ApplicationsQuery = {}) {
  return useQuery({
    queryKey: ["applications", query],
    queryFn: () => applicationsService.list(query),
  });
}
