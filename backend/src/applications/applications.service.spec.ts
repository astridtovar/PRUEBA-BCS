import {
  BadGatewayException,
  BadRequestException,
  NotFoundException,
} from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { ApplicationsService } from './applications.service';

describe('ApplicationsService', () => {
  let service: ApplicationsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ApplicationsService],
    }).compile();

    service = module.get<ApplicationsService>(ApplicationsService);
  });

  // ─── create ──────────────────────────────────────────────────────────────────

  describe('create', () => {
    it('creates a DRAFT application with the given channel', () => {
      const app = service.create({ channel: 'SELF_SERVICE' });
      expect(app.status).toBe('DRAFT');
      expect(app.channel).toBe('SELF_SERVICE');
      expect(app.id).toBeDefined();
    });

    it('stores the optional advisorId for ASSISTED channel', () => {
      const app = service.create({ channel: 'ASSISTED', advisorId: 'ASE-001' });
      expect(app.channel).toBe('ASSISTED');
      expect(app.advisorId).toBe('ASE-001');
    });

    it('registers a single CREATED event', () => {
      const app = service.create({ channel: 'SELF_SERVICE' });
      expect(app.events).toHaveLength(1);
      expect(app.events[0].type).toBe('CREATED');
    });
  });

  // ─── findAll ─────────────────────────────────────────────────────────────────

  describe('findAll', () => {
    beforeEach(() => {
      const a = service.create({ channel: 'SELF_SERVICE' });
      service.update(a.id, { firstName: 'Carlos', email: 'carlos@test.com', documentNumber: 'CC-001' });
      service.create({ channel: 'ASSISTED' });
    });

    it('returns all applications when no filters are applied', () => {
      expect(service.findAll({})).toHaveLength(2);
    });

    it('filters by channel', () => {
      const results = service.findAll({ channel: 'ASSISTED' });
      expect(results).toHaveLength(1);
      expect(results[0].channel).toBe('ASSISTED');
    });

    it('filters by status', () => {
      expect(service.findAll({ status: 'DRAFT' })).toHaveLength(2);
      expect(service.findAll({ status: 'FINALIZED' })).toHaveLength(0);
    });

    it('filters by search term matching firstName (case-insensitive)', () => {
      const results = service.findAll({ search: 'carlos' });
      expect(results).toHaveLength(1);
      expect(results[0].firstName).toBe('Carlos');
    });

    it('filters by search term matching email', () => {
      const results = service.findAll({ search: 'carlos@test' });
      expect(results).toHaveLength(1);
    });

    it('filters by search term matching documentNumber', () => {
      const results = service.findAll({ search: 'CC-001' });
      expect(results).toHaveLength(1);
    });

    it('returns empty array when search matches nothing', () => {
      expect(service.findAll({ search: 'xyz-not-found' })).toHaveLength(0);
    });
  });

  // ─── findOne ─────────────────────────────────────────────────────────────────

  describe('findOne', () => {
    it('returns the application matching the given id', () => {
      const created = service.create({ channel: 'SELF_SERVICE' });
      const found = service.findOne(created.id);
      expect(found.id).toBe(created.id);
    });

    it('throws NotFoundException for an unknown id', () => {
      expect(() => service.findOne('non-existent-id')).toThrow(NotFoundException);
    });
  });

  // ─── update ──────────────────────────────────────────────────────────────────

  describe('update', () => {
    it('updates fields on a DRAFT application', () => {
      const app = service.create({ channel: 'SELF_SERVICE' });
      const updated = service.update(app.id, { firstName: 'Ana', lastName: 'Gómez' });
      expect(updated.firstName).toBe('Ana');
      expect(updated.lastName).toBe('Gómez');
    });

    it('registers UPDATED and DRAFT_SAVED events', () => {
      const app = service.create({ channel: 'SELF_SERVICE' });
      const updated = service.update(app.id, { firstName: 'Ana' });
      const types = updated.events.map((e) => e.type);
      expect(types).toContain('UPDATED');
      expect(types).toContain('DRAFT_SAVED');
    });

    it('throws BadRequestException when trying to update a non-DRAFT application', () => {
      const app = service.create({ channel: 'SELF_SERVICE' });
      service.update(app.id, { requestedAmount: 1_000_000, termMonths: 12 });
      service.simulateOffer(app.id);
      service.finalize(app.id);

      expect(() => service.update(app.id, { firstName: 'Test' })).toThrow(
        BadRequestException,
      );
    });
  });

  // ─── simulateOffer ───────────────────────────────────────────────────────────

  describe('simulateOffer', () => {
    it('returns VIABLE result for amounts below 5,000,000', () => {
      const app = service.create({ channel: 'SELF_SERVICE' });
      service.update(app.id, { requestedAmount: 2_000_000, termMonths: 24 });

      const { result } = service.simulateOffer(app.id);
      expect(result.status).toBe('VIABLE');
      expect(result.interestRate).toBe(1.45);
      expect(result.monthlyInstallment).toBeGreaterThan(0);
      expect(result.approvedAmount).toBe(2_000_000);
      expect(result.approvedTermMonths).toBe(24);
    });

    it('calculates the monthly installment using the standard annuity formula', () => {
      const app = service.create({ channel: 'SELF_SERVICE' });
      service.update(app.id, { requestedAmount: 1_000_000, termMonths: 12 });

      const { result } = service.simulateOffer(app.id);
      expect(result.status).toBe('VIABLE');
      // 1_000_000 * 0.0145 * (1.0145^12) / ((1.0145^12) - 1) ≈ 90_588
      expect(result.monthlyInstallment).toBeGreaterThan(88_000);
      expect(result.monthlyInstallment).toBeLessThan(93_000);
    });

    it('returns NOT_VIABLE for amounts between 5,000,000 and 20,000,000', () => {
      const app = service.create({ channel: 'SELF_SERVICE' });
      service.update(app.id, { requestedAmount: 10_000_000, termMonths: 36 });

      const { result } = service.simulateOffer(app.id);
      expect(result.status).toBe('NOT_VIABLE');
      expect(result.rejectionReason).toBeDefined();
    });

    it('throws BadGatewayException (HTTP 502) for amounts above 20,000,000', () => {
      const app = service.create({ channel: 'SELF_SERVICE' });
      service.update(app.id, { requestedAmount: 25_000_000, termMonths: 60 });

      expect(() => service.simulateOffer(app.id)).toThrow(BadGatewayException);
    });

    it('persists SIMULATION_ERROR event before throwing on high amounts', () => {
      const app = service.create({ channel: 'SELF_SERVICE' });
      service.update(app.id, { requestedAmount: 25_000_000 });

      expect(() => service.simulateOffer(app.id)).toThrow();

      const saved = service.findOne(app.id);
      expect(saved.events.map((e) => e.type)).toContain('SIMULATION_ERROR');
    });

    it('persists SIMULATION_REQUESTED event for every simulation attempt', () => {
      const app = service.create({ channel: 'SELF_SERVICE' });
      service.update(app.id, { requestedAmount: 1_000_000, termMonths: 12 });

      const { application } = service.simulateOffer(app.id);
      expect(application.events.map((e) => e.type)).toContain('SIMULATION_REQUESTED');
    });

    it('throws BadRequestException when the application is not in DRAFT status', () => {
      const app = service.create({ channel: 'SELF_SERVICE' });
      service.update(app.id, { requestedAmount: 1_000_000, termMonths: 12 });
      service.simulateOffer(app.id);
      service.finalize(app.id);

      expect(() => service.simulateOffer(app.id)).toThrow(BadRequestException);
    });
  });

  // ─── finalize ────────────────────────────────────────────────────────────────

  describe('finalize', () => {
    it('sets status to PENDING_VALIDATION when simulation result is VIABLE', () => {
      const app = service.create({ channel: 'SELF_SERVICE' });
      service.update(app.id, { requestedAmount: 1_000_000, termMonths: 12 });
      service.simulateOffer(app.id);

      const finalized = service.finalize(app.id);
      expect(finalized.status).toBe('PENDING_VALIDATION');
    });

    it('sets status to FINALIZED when simulation result is NOT_VIABLE', () => {
      const app = service.create({ channel: 'SELF_SERVICE' });
      service.update(app.id, { requestedAmount: 10_000_000, termMonths: 36 });
      service.simulateOffer(app.id);

      const finalized = service.finalize(app.id);
      expect(finalized.status).toBe('FINALIZED');
    });

    it('sets status to FINALIZED when no simulation has been run', () => {
      const app = service.create({ channel: 'SELF_SERVICE' });
      const finalized = service.finalize(app.id);
      expect(finalized.status).toBe('FINALIZED');
    });

    it('registers a FINALIZED event', () => {
      const app = service.create({ channel: 'SELF_SERVICE' });
      service.update(app.id, { requestedAmount: 1_000_000, termMonths: 12 });
      service.simulateOffer(app.id);

      const finalized = service.finalize(app.id);
      expect(finalized.events.map((e) => e.type)).toContain('FINALIZED');
    });

    it('throws BadRequestException for an already FINALIZED application', () => {
      const app = service.create({ channel: 'SELF_SERVICE' });
      service.update(app.id, { requestedAmount: 10_000_000, termMonths: 36 });
      service.simulateOffer(app.id);
      service.finalize(app.id);

      expect(() => service.finalize(app.id)).toThrow(BadRequestException);
    });

    it('throws BadRequestException for an already ABANDONED application', () => {
      const app = service.create({ channel: 'SELF_SERVICE' });
      service.abandon(app.id, { reason: 'Ya no lo necesito.' });

      expect(() => service.finalize(app.id)).toThrow(BadRequestException);
    });
  });

  // ─── abandon ─────────────────────────────────────────────────────────────────

  describe('abandon', () => {
    it('sets status to ABANDONED and stores the reason', () => {
      const app = service.create({ channel: 'SELF_SERVICE' });
      const abandoned = service.abandon(app.id, { reason: 'Ya no lo necesito en este momento.' });
      expect(abandoned.status).toBe('ABANDONED');
      expect(abandoned.abandonReason).toBe('Ya no lo necesito en este momento.');
    });

    it('registers an ABANDONED event', () => {
      const app = service.create({ channel: 'SELF_SERVICE' });
      const abandoned = service.abandon(app.id, { reason: 'Sin tiempo ahora.' });
      expect(abandoned.events.map((e) => e.type)).toContain('ABANDONED');
    });

    it('can abandon a PENDING_VALIDATION application', () => {
      const app = service.create({ channel: 'SELF_SERVICE' });
      service.update(app.id, { requestedAmount: 1_000_000, termMonths: 12 });
      service.simulateOffer(app.id);
      service.finalize(app.id);

      // PENDING_VALIDATION → allowed to abandon
      const abandoned = service.abandon(app.id, { reason: 'Cambié de opinión.' });
      expect(abandoned.status).toBe('ABANDONED');
    });

    it('throws BadRequestException for an already FINALIZED application', () => {
      const app = service.create({ channel: 'SELF_SERVICE' });
      service.update(app.id, { requestedAmount: 10_000_000, termMonths: 36 });
      service.simulateOffer(app.id);
      service.finalize(app.id);

      expect(() => service.abandon(app.id, { reason: 'Cambié de opinión.' })).toThrow(
        BadRequestException,
      );
    });

    it('throws BadRequestException for an already ABANDONED application', () => {
      const app = service.create({ channel: 'SELF_SERVICE' });
      service.abandon(app.id, { reason: 'Primera vez.' });

      expect(() => service.abandon(app.id, { reason: 'Segunda vez.' })).toThrow(
        BadRequestException,
      );
    });
  });

  // ─── getEvents ───────────────────────────────────────────────────────────────

  describe('getEvents', () => {
    it('returns events in strict chronological order', () => {
      const app = service.create({ channel: 'SELF_SERVICE' });
      service.update(app.id, { firstName: 'Test' });

      const events = service.getEvents(app.id);
      expect(events.length).toBeGreaterThanOrEqual(2);
      for (let i = 1; i < events.length; i++) {
        expect(new Date(events[i].timestamp).getTime()).toBeGreaterThanOrEqual(
          new Date(events[i - 1].timestamp).getTime(),
        );
      }
    });

    it('includes all event types generated during the full lifecycle', () => {
      const app = service.create({ channel: 'SELF_SERVICE' });
      service.update(app.id, { requestedAmount: 1_000_000, termMonths: 12 });
      service.simulateOffer(app.id);
      service.finalize(app.id);
      service.abandon(app.id, { reason: 'Motivo de prueba.' });

      const types = service.getEvents(app.id).map((e) => e.type);
      expect(types).toContain('CREATED');
      expect(types).toContain('UPDATED');
      expect(types).toContain('SIMULATION_REQUESTED');
      expect(types).toContain('SIMULATION_SUCCESS');
      expect(types).toContain('FINALIZED');
      expect(types).toContain('ABANDONED');
    });

    it('throws NotFoundException for an unknown application id', () => {
      expect(() => service.getEvents('non-existent')).toThrow(NotFoundException);
    });
  });
});
