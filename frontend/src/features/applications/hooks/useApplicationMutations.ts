"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { applicationsService } from "../services/applications.service";
import type {
  AbandonApplicationPayload,
  UpdateApplicationPayload,
} from "../types/application.types";

function useInvalidateApplication(id?: string) {
  const qc = useQueryClient();
  return () => {
    // Remove list cache completely so the next visit always fetches fresh data
    qc.removeQueries({ queryKey: ["applications"] });
    if (id) {
      qc.invalidateQueries({ queryKey: ["application", id] });
      qc.invalidateQueries({ queryKey: ["application-events", id] });
    }
  };
}

export function useCreateApplication() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: applicationsService.create,
    onSuccess: () => qc.invalidateQueries({ queryKey: ["applications"] }),
  });
}

export function useUpdateApplication(id: string) {
  const invalidate = useInvalidateApplication(id);
  return useMutation({
    mutationFn: (payload: UpdateApplicationPayload) =>
      applicationsService.update(id, payload),
    onSuccess: invalidate,
  });
}

export function useSimulateOffer(id: string) {
  const invalidate = useInvalidateApplication(id);
  return useMutation({
    mutationFn: () => applicationsService.simulateOffer(id),
    onSuccess: invalidate,
  });
}

export function useFinalizeApplication(id: string) {
  const invalidate = useInvalidateApplication(id);
  return useMutation({
    mutationFn: () => applicationsService.finalize(id),
    onSuccess: invalidate,
  });
}

export function useAbandonApplication(id: string) {
  const invalidate = useInvalidateApplication(id);
  return useMutation({
    mutationFn: (payload: AbandonApplicationPayload) =>
      applicationsService.abandon(id, payload),
    onSuccess: invalidate,
  });
}
