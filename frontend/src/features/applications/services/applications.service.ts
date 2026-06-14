import { apiClient } from "@/shared/lib/api-client";
import type {
  Application,
  ApplicationEvent,
  ApplicationsQuery,
  AbandonApplicationPayload,
  CreateApplicationPayload,
  SimulationResult,
  UpdateApplicationPayload,
} from "../types/application.types";

function buildQueryString(query: ApplicationsQuery): string {
  const params = new URLSearchParams();
  if (query.status) params.set("status", query.status);
  if (query.channel) params.set("channel", query.channel);
  if (query.search) params.set("search", query.search);
  const qs = params.toString();
  return qs ? `?${qs}` : "";
}

export const applicationsService = {
  create: (payload: CreateApplicationPayload) =>
    apiClient.post<Application>("/applications", payload),

  list: (query: ApplicationsQuery = {}) =>
    apiClient.get<Application[]>(`/applications${buildQueryString(query)}`),

  getById: (id: string) =>
    apiClient.get<Application>(`/applications/${id}`),

  update: (id: string, payload: UpdateApplicationPayload) =>
    apiClient.patch<Application>(`/applications/${id}`, payload),

  simulateOffer: (id: string) =>
    apiClient.post<{ application: Application; simulationResult: SimulationResult }>(
      `/applications/${id}/simulate-offer`
    ),

  finalize: (id: string) =>
    apiClient.post<Application>(`/applications/${id}/finalize`),

  abandon: (id: string, payload: AbandonApplicationPayload) =>
    apiClient.post<Application>(`/applications/${id}/abandon`, payload),

  getEvents: (id: string) =>
    apiClient.get<ApplicationEvent[]>(`/applications/${id}/events`),
};
