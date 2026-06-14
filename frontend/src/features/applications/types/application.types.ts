export type ApplicationStatus =
  | "DRAFT"
  | "PENDING_VALIDATION"
  | "FINALIZED"
  | "ABANDONED";

export const APPLICATION_STATUS = {
  DRAFT: "DRAFT",
  PENDING_VALIDATION: "PENDING_VALIDATION",
  FINALIZED: "FINALIZED",
  ABANDONED: "ABANDONED",
} as const satisfies Record<string, ApplicationStatus>;

export type ApplicationChannel = "SELF_SERVICE" | "ASSISTED";

export const APPLICATION_CHANNEL = {
  SELF_SERVICE: "SELF_SERVICE",
  ASSISTED: "ASSISTED",
} as const satisfies Record<string, ApplicationChannel>;

export type DocumentType = "CC" | "CE" | "NIT" | "PP";

export type EventType =
  | "CREATED"
  | "UPDATED"
  | "DRAFT_SAVED"
  | "SIMULATION_REQUESTED"
  | "SIMULATION_SUCCESS"
  | "SIMULATION_NOT_VIABLE"
  | "SIMULATION_ERROR"
  | "FINALIZED"
  | "ABANDONED";

export interface ApplicationEvent {
  id: string;
  applicationId: string;
  type: EventType;
  description: string;
  timestamp: string;
  metadata?: Record<string, unknown>;
}

type SimulationStatus = "VIABLE" | "NOT_VIABLE" | "TECHNICAL_ERROR";

export const SIMULATION_STATUS = {
  VIABLE: "VIABLE",
  NOT_VIABLE: "NOT_VIABLE",
  TECHNICAL_ERROR: "TECHNICAL_ERROR",
} as const satisfies Record<string, SimulationStatus>;

export interface SimulationResult {
  status: SimulationStatus;
  interestRate?: number;
  monthlyInstallment?: number;
  approvedAmount?: number;
  approvedTermMonths?: number;
  rejectionReason?: string;
  errorMessage?: string;
}

export interface Application {
  id: string;
  channel: ApplicationChannel;
  advisorId?: string;
  documentType?: DocumentType;
  documentNumber?: string;
  firstName?: string;
  lastName?: string;
  phone?: string;
  email?: string;
  city?: string;
  monthlyIncome?: number;
  monthlyExpenses?: number;
  requestedAmount?: number;
  termMonths?: number;
  creditPurpose?: string;
  dataProcessingAccepted?: boolean;
  status: ApplicationStatus;
  simulationResult?: SimulationResult;
  abandonReason?: string;
  createdAt: string;
  updatedAt: string;
  events: ApplicationEvent[];
}

export interface CreateApplicationPayload {
  channel: ApplicationChannel;
  advisorId?: string;
}

export interface UpdateApplicationPayload {
  documentType?: DocumentType;
  documentNumber?: string;
  firstName?: string;
  lastName?: string;
  phone?: string;
  email?: string;
  city?: string;
  monthlyIncome?: number;
  monthlyExpenses?: number;
  requestedAmount?: number;
  termMonths?: number;
  creditPurpose?: string;
  dataProcessingAccepted?: boolean;
}

export interface AbandonApplicationPayload {
  reason: string;
}

export interface ApplicationsQuery {
  status?: ApplicationStatus;
  channel?: ApplicationChannel;
  search?: string;
}

export const STATUS_LABELS: Record<ApplicationStatus, string> = {
  DRAFT: "Borrador",
  PENDING_VALIDATION: "Pendiente de validación",
  FINALIZED: "Finalizado",
  ABANDONED: "Abandonado",
};


export const CHANNEL_LABELS: Record<ApplicationChannel, string> = {
  SELF_SERVICE: "Autogestión",
  ASSISTED: "Asistido",
};

export const DOCUMENT_TYPE_LABELS: Record<DocumentType, string> = {
  CC: "Cédula de ciudadanía",
  CE: "Cédula de extranjería",
  NIT: "NIT",
  PP: "Pasaporte",
};
