import {
  BadGatewayException,
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { randomUUID } from 'crypto';
import {
  Application,
  ApplicationEvent,
  ApplicationStatus,
  EventType,
  SimulationResult,
} from './entities/application.entity';
import { CreateApplicationDto } from './dto/create-application.dto';
import { UpdateApplicationDto } from './dto/update-application.dto';
import { AbandonApplicationDto } from './dto/abandon-application.dto';
import { QueryApplicationsDto } from './dto/query-applications.dto';

const STATUS_LABELS: Record<ApplicationStatus, string> = {
  DRAFT: 'Borrador',
  PENDING_VALIDATION: 'Pendiente de validación',
  FINALIZED: 'Finalizado',
  ABANDONED: 'Abandonado',
};

@Injectable()
export class ApplicationsService {
  private readonly store = new Map<string, Application>();

  create(dto: CreateApplicationDto): Application {
    const id = randomUUID();
    const now = new Date();
    const application: Application = {
      id,
      channel: dto.channel,
      advisorId: dto.advisorId,
      status: 'DRAFT',
      createdAt: now,
      updatedAt: now,
      events: [],
    };
    this.addEvent(application, 'CREATED', 'Solicitud creada', {
      channel: dto.channel,
    });
    this.store.set(id, application);
    return application;
  }

  findAll(query: QueryApplicationsDto): Application[] {
    let results = Array.from(this.store.values());

    if (query.status) {
      results = results.filter((a) => a.status === query.status);
    }
    if (query.channel) {
      results = results.filter((a) => a.channel === query.channel);
    }
    if (query.search) {
      const term = query.search.toLowerCase();
      results = results.filter(
        (a) =>
          a.firstName?.toLowerCase().includes(term) ||
          a.lastName?.toLowerCase().includes(term) ||
          a.documentNumber?.toLowerCase().includes(term) ||
          a.email?.toLowerCase().includes(term),
      );
    }

    return results.sort(
      (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
    );
  }

  findOne(id: string): Application {
    const application = this.store.get(id);
    if (!application)
      throw new NotFoundException(`Solicitud ${id} no encontrada`);
    return application;
  }

  update(id: string, dto: UpdateApplicationDto): Application {
    const application = this.findOne(id);
    if (application.status !== 'DRAFT') {
      throw new BadRequestException(
        'Solo las solicitudes en estado Borrador pueden ser modificadas',
      );
    }
    const patch = Object.fromEntries(
      Object.entries(dto).filter(([, v]) => v !== undefined),
    );
    Object.assign(application, patch, { updatedAt: new Date() });
    this.addEvent(application, 'UPDATED', 'Información de la solicitud actualizada');
    this.addEvent(application, 'DRAFT_SAVED', 'Borrador guardado');
    this.store.set(id, application);
    return application;
  }

  simulateOffer(id: string): { application: Application; result: SimulationResult } {
    const application = this.findOne(id);
    if (application.status !== 'DRAFT') {
      throw new BadRequestException(
        'La simulación solo está disponible para solicitudes en estado Borrador',
      );
    }

    this.addEvent(application, 'SIMULATION_REQUESTED', 'Simulación de oferta solicitada');

    const amount = application.requestedAmount ?? 0;
    let result: SimulationResult;

    if (amount > 20_000_000) {
      this.addEvent(application, 'SIMULATION_ERROR', 'Error técnico en la simulación', {
        amount,
      });
      this.store.set(id, application);
      throw new BadGatewayException(
        'Ha ocurrido un error técnico temporal. Por favor intenta de nuevo en unos minutos.',
      );
    } else if (amount >= 5_000_000) {
      result = {
        status: 'NOT_VIABLE',
        rejectionReason:
          'El monto solicitado supera tu capacidad financiera actual según la información proporcionada.',
      };
      this.addEvent(
        application,
        'SIMULATION_NOT_VIABLE',
        'Simulación: solicitud no viable',
        { amount },
      );
    } else {
      const interestRate = 1.45;
      const monthlyRate = interestRate / 100;
      const term = application.termMonths ?? 24;
      const monthlyInstallment =
        (amount * monthlyRate * Math.pow(1 + monthlyRate, term)) /
        (Math.pow(1 + monthlyRate, term) - 1);

      result = {
        status: 'VIABLE',
        interestRate,
        monthlyInstallment: Math.round(monthlyInstallment),
        approvedAmount: amount,
        approvedTermMonths: term,
      };
      this.addEvent(application, 'SIMULATION_SUCCESS', 'Simulación de oferta exitosa', {
        amount,
        rate: interestRate,
        installment: Math.round(monthlyInstallment),
      });
    }

    application.simulationResult = result;
    application.updatedAt = new Date();
    this.store.set(id, application);

    return { application, result };
  }

  finalize(id: string): Application {
    const application = this.findOne(id);
    if (application.status !== 'DRAFT' && application.status !== 'PENDING_VALIDATION') {
      throw new BadRequestException(
        'La solicitud no puede ser finalizada en su estado actual',
      );
    }
    const newStatus =
      application.simulationResult?.status === 'VIABLE'
        ? 'PENDING_VALIDATION'
        : 'FINALIZED';
    application.status = newStatus;
    application.updatedAt = new Date();
    this.addEvent(
      application,
      'FINALIZED',
      `Solicitud finalizada con estado: ${STATUS_LABELS[newStatus]}`,
    );
    this.store.set(id, application);
    return application;
  }

  abandon(id: string, dto: AbandonApplicationDto): Application {
    const application = this.findOne(id);
    if (
      application.status === 'FINALIZED' ||
      application.status === 'ABANDONED'
    ) {
      throw new BadRequestException(
        'La solicitud ya está completada y no puede ser abandonada',
      );
    }
    application.status = 'ABANDONED';
    application.abandonReason = dto.reason;
    application.updatedAt = new Date();
    this.addEvent(application, 'ABANDONED', 'Solicitud abandonada', {
      reason: dto.reason,
    });
    this.store.set(id, application);
    return application;
  }

  getEvents(id: string): ApplicationEvent[] {
    const application = this.findOne(id);
    return [...application.events].sort(
      (a, b) =>
        new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime(),
    );
  }

  private addEvent(
    application: Application,
    type: EventType,
    description: string,
    metadata?: Record<string, unknown>,
  ): void {
    const event: ApplicationEvent = {
      id: randomUUID(),
      applicationId: application.id,
      type,
      description,
      timestamp: new Date(),
      metadata,
    };
    application.events.push(event);
  }
}
