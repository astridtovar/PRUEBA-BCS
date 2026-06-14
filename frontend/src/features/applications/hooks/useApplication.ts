"use client";

import { useQuery } from "@tanstack/react-query";
import { applicationsService } from "../services/applications.service";

export function useApplication(id: string) {
  return useQuery({
    queryKey: ["application", id],
    queryFn: () => applicationsService.getById(id),
    enabled: Boolean(id),
  });
}

export function useApplicationEvents(id: string) {
  return useQuery({
    queryKey: ["application-events", id],
    queryFn: () => applicationsService.getEvents(id),
    enabled: Boolean(id),
  });
}
