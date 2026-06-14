export type ApplicationStatus =
  | 'DRAFT'
  | 'PENDING_VALIDATION'
  | 'FINALIZED'
  | 'ABANDONED';

export type ApplicationChannel = 'SELF_SERVICE' | 'ASSISTED';

export type DocumentType = 'CC' | 'CE' | 'NIT' | 'PP';

export type EventType =
  | 'CREATED'
  | 'UPDATED'
  | 'DRAFT_SAVED'
  | 'SIMULATION_REQUESTED'
  | 'SIMULATION_SUCCESS'
  | 'SIMULATION_NOT_VIABLE'
  | 'SIMULATION_ERROR'
  | 'FINALIZED'
  | 'ABANDONED';

export interface ApplicationEvent {
  id: string;
  applicationId: string;
  type: EventType;
  description: string;
  timestamp: Date;
  metadata?: Record<string, unknown>;
}

export type SimulationStatus = 'VIABLE' | 'NOT_VIABLE' | 'TECHNICAL_ERROR';

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
  createdAt: Date;
  updatedAt: Date;
  events: ApplicationEvent[];
}
