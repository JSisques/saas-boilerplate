import { SubscriptionAggregate } from '@/billing-context/subscription/domain/aggregates/subscription.aggregate';
import { ISubscriptionCreateDto } from '@/billing-context/subscription/domain/dtos/entities/subscription-create/subscription-create.dto';
import { SubscriptionStatusEnum } from '@/billing-context/subscription/domain/enum/subscription-status.enum';
import { SubscriptionAggregateFactory } from '@/billing-context/subscription/domain/factories/subscription-aggregate/subscription-aggregate.factory';
import { SubscriptionPrimitives } from '@/billing-context/subscription/domain/primitives/subscription.primitives';
import { SubscriptionEndDateValueObject } from '@/billing-context/subscription/domain/value-objects/subscription-end-date/subscription-end-date.vo';
import { SubscriptionRenewalMethodValueObject } from '@/billing-context/subscription/domain/value-objects/subscription-renewal-method copy/subscription-renewal-method.vo';
import { SubscriptionStartDateValueObject } from '@/billing-context/subscription/domain/value-objects/subscription-start-date/subscription-start-date.vo';
import { SubscriptionStatusValueObject } from '@/billing-context/subscription/domain/value-objects/subscription-status/subscription-status.vo';
import { SubscriptionStripeCustomerIdValueObject } from '@/billing-context/subscription/domain/value-objects/subscription-stripe-customer-id/subscription-stripe-customer-id.vo';
import { SubscriptionStripeSubscriptionIdValueObject } from '@/billing-context/subscription/domain/value-objects/subscription-stripe-id/subscription-stripe-id.vo';
import { SubscriptionTrialEndDateValueObject } from '@/billing-context/subscription/domain/value-objects/subscription-trial-end-date/subscription-trial-end-date.vo';
import { SubscriptionCreatedEvent } from '@/shared/domain/events/billing-context/subscription/subscription-created/subscription-created.event';
import { DateValueObject } from '@/shared/domain/value-objects/date/date.vo';
import { SubscriptionPlanUuidValueObject } from '@/shared/domain/value-objects/identifiers/subscription-plan/subscription-plan-uuid.vo';
import { SubscriptionUuidValueObject } from '@/shared/domain/value-objects/identifiers/subscription/subscription-uuid.vo';
import { TenantUuidValueObject } from '@/shared/domain/value-objects/identifiers/tenant-uuid/tenant-uuid.vo';
import { RenewalMethodEnum } from '@prisma/client';

describe('SubscriptionAggregateFactory', () => {
  let factory: SubscriptionAggregateFactory;

  beforeEach(() => {
    factory = new SubscriptionAggregateFactory();
  });

  describe('create', () => {
    it('should create a SubscriptionAggregate from DTO with all fields and generate event by default', () => {
      const dto: ISubscriptionCreateDto = {
        id: new SubscriptionUuidValueObject(
          '123e4567-e89b-12d3-a456-426614174000',
        ),
        tenantId: new TenantUuidValueObject(
          '123e4567-e89b-12d3-a456-426614174001',
        ),
        planId: new SubscriptionPlanUuidValueObject(
          '123e4567-e89b-12d3-a456-426614174002',
        ),
        startDate: new SubscriptionStartDateValueObject(new Date()),
        endDate: new SubscriptionEndDateValueObject(new Date()),
        trialEndDate: new SubscriptionTrialEndDateValueObject(new Date()),
        status: new SubscriptionStatusValueObject(
          SubscriptionStatusEnum.ACTIVE,
        ),
        stripeSubscriptionId: new SubscriptionStripeSubscriptionIdValueObject(
          'sub_1234567890',
        ),
        stripeCustomerId: new SubscriptionStripeCustomerIdValueObject(
          'cus_1234567890',
        ),
        renewalMethod: new SubscriptionRenewalMethodValueObject(
          RenewalMethodEnum.AUTOMATIC,
        ),
        createdAt: new DateValueObject(new Date()),
        updatedAt: new DateValueObject(new Date()),
      };

      const aggregate = factory.create(dto);

      expect(aggregate).toBeInstanceOf(SubscriptionAggregate);
      expect(aggregate.id.value).toBe(dto.id.value);
      expect(aggregate.tenantId.value).toBe(dto.tenantId.value);
      expect(aggregate.planId.value).toBe(dto.planId.value);
      expect(aggregate.startDate.value).toBe(dto.startDate.value);
      expect(aggregate.endDate.value).toBe(dto.endDate.value);
      expect(aggregate.trialEndDate?.value).toBe(dto.trialEndDate?.value);
      expect(aggregate.status.value).toBe(dto.status.value);
      expect(aggregate.stripeSubscriptionId?.value).toBe(
        dto.stripeSubscriptionId?.value,
      );
      expect(aggregate.stripeCustomerId?.value).toBe(
        dto.stripeCustomerId?.value,
      );
      expect(aggregate.renewalMethod.value).toBe(dto.renewalMethod.value);

      // Check that event was generated
      const uncommittedEvents = aggregate.getUncommittedEvents();
      expect(uncommittedEvents).toHaveLength(1);
      expect(uncommittedEvents[0]).toBeInstanceOf(SubscriptionCreatedEvent);
    });

    it('should create a SubscriptionAggregate from DTO without generating event when generateEvent is false', () => {
      const dto: ISubscriptionCreateDto = {
        id: new SubscriptionUuidValueObject(
          '123e4567-e89b-12d3-a456-426614174000',
        ),
        tenantId: new TenantUuidValueObject(
          '123e4567-e89b-12d3-a456-426614174001',
        ),
        planId: new SubscriptionPlanUuidValueObject(
          '123e4567-e89b-12d3-a456-426614174002',
        ),
        startDate: new SubscriptionStartDateValueObject(new Date()),
        endDate: new SubscriptionEndDateValueObject(new Date()),
        trialEndDate: null,
        status: new SubscriptionStatusValueObject(
          SubscriptionStatusEnum.ACTIVE,
        ),
        stripeSubscriptionId: new SubscriptionStripeSubscriptionIdValueObject(
          'sub_1234567890',
        ),
        stripeCustomerId: new SubscriptionStripeCustomerIdValueObject(
          'cus_1234567890',
        ),
        renewalMethod: new SubscriptionRenewalMethodValueObject(
          RenewalMethodEnum.AUTOMATIC,
        ),
        createdAt: new DateValueObject(new Date()),
        updatedAt: new DateValueObject(new Date()),
      };

      const aggregate = factory.create(dto, false);

      expect(aggregate).toBeInstanceOf(SubscriptionAggregate);
      expect(aggregate.id.value).toBe(dto.id.value);
      expect(aggregate.tenantId.value).toBe(dto.tenantId.value);
      expect(aggregate.planId.value).toBe(dto.planId.value);

      // Check that no event was generated
      const uncommittedEvents = aggregate.getUncommittedEvents();
      expect(uncommittedEvents).toHaveLength(0);
    });

    it('should create a SubscriptionAggregate from DTO with null optional fields', () => {
      const dto: ISubscriptionCreateDto = {
        id: new SubscriptionUuidValueObject(
          '123e4567-e89b-12d3-a456-426614174000',
        ),
        tenantId: new TenantUuidValueObject(
          '123e4567-e89b-12d3-a456-426614174001',
        ),
        planId: new SubscriptionPlanUuidValueObject(
          '123e4567-e89b-12d3-a456-426614174002',
        ),
        startDate: new SubscriptionStartDateValueObject(new Date()),
        endDate: new SubscriptionEndDateValueObject(new Date()),
        trialEndDate: null,
        status: new SubscriptionStatusValueObject(
          SubscriptionStatusEnum.INACTIVE,
        ),
        stripeSubscriptionId: null,
        stripeCustomerId: null,
        renewalMethod: new SubscriptionRenewalMethodValueObject(
          RenewalMethodEnum.MANUAL,
        ),
        createdAt: new DateValueObject(new Date()),
        updatedAt: new DateValueObject(new Date()),
      };

      const aggregate = factory.create(dto, false);

      expect(aggregate).toBeInstanceOf(SubscriptionAggregate);
      expect(aggregate.id.value).toBe(dto.id.value);
      expect(aggregate.tenantId.value).toBe(dto.tenantId.value);
      expect(aggregate.trialEndDate).toBeNull();
      expect(aggregate.stripeSubscriptionId).toBeNull();
      expect(aggregate.stripeCustomerId).toBeNull();
    });
  });

  describe('fromPrimitives', () => {
    it('should create a SubscriptionAggregate from primitives with all fields', () => {
      const startDate = new Date();
      const endDate = new Date();
      const trialEndDate = new Date();
      const primitives: SubscriptionPrimitives = {
        id: '123e4567-e89b-12d3-a456-426614174000',
        tenantId: '123e4567-e89b-12d3-a456-426614174001',
        planId: '123e4567-e89b-12d3-a456-426614174002',
        startDate: startDate,
        endDate: endDate,
        trialEndDate: trialEndDate,
        status: SubscriptionStatusEnum.ACTIVE,
        stripeSubscriptionId: 'sub_1234567890',
        stripeCustomerId: 'cus_1234567890',
        renewalMethod: RenewalMethodEnum.AUTOMATIC,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      const aggregate = factory.fromPrimitives(primitives);

      expect(aggregate).toBeInstanceOf(SubscriptionAggregate);
      expect(aggregate.id.value).toBe(primitives.id);
      expect(aggregate.tenantId.value).toBe(primitives.tenantId);
      expect(aggregate.planId.value).toBe(primitives.planId);
      expect(aggregate.startDate.value).toBe(primitives.startDate);
      expect(aggregate.endDate.value).toBe(primitives.endDate);
      expect(aggregate.trialEndDate?.value).toBe(primitives.trialEndDate);
      expect(aggregate.status.value).toBe(primitives.status);
      expect(aggregate.stripeSubscriptionId?.value).toBe(
        primitives.stripeSubscriptionId,
      );
      expect(aggregate.stripeCustomerId?.value).toBe(
        primitives.stripeCustomerId,
      );
      expect(aggregate.renewalMethod.value).toBe(primitives.renewalMethod);
    });

    it('should create a SubscriptionAggregate from primitives with null optional fields', () => {
      const startDate = new Date();
      const endDate = new Date();
      const primitives: SubscriptionPrimitives = {
        id: '123e4567-e89b-12d3-a456-426614174000',
        tenantId: '123e4567-e89b-12d3-a456-426614174001',
        planId: '123e4567-e89b-12d3-a456-426614174002',
        startDate: startDate,
        endDate: endDate,
        trialEndDate: null,
        status: SubscriptionStatusEnum.INACTIVE,
        stripeSubscriptionId: null,
        stripeCustomerId: null,
        renewalMethod: RenewalMethodEnum.MANUAL,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      const aggregate = factory.fromPrimitives(primitives);

      expect(aggregate).toBeInstanceOf(SubscriptionAggregate);
      expect(aggregate.id.value).toBe(primitives.id);
      expect(aggregate.tenantId.value).toBe(primitives.tenantId);
      expect(aggregate.trialEndDate).toBeNull();
      expect(aggregate.stripeSubscriptionId).toBeNull();
      expect(aggregate.stripeCustomerId).toBeNull();
    });

    it('should create value objects correctly from primitives', () => {
      const startDate = new Date();
      const endDate = new Date();
      const trialEndDate = new Date();
      const primitives: SubscriptionPrimitives = {
        id: '123e4567-e89b-12d3-a456-426614174000',
        tenantId: '123e4567-e89b-12d3-a456-426614174001',
        planId: '123e4567-e89b-12d3-a456-426614174002',
        startDate: startDate,
        endDate: endDate,
        trialEndDate: trialEndDate,
        status: SubscriptionStatusEnum.ACTIVE,
        stripeSubscriptionId: 'sub_1234567890',
        stripeCustomerId: 'cus_1234567890',
        renewalMethod: RenewalMethodEnum.AUTOMATIC,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      const aggregate = factory.fromPrimitives(primitives);

      expect(aggregate.id).toBeInstanceOf(SubscriptionUuidValueObject);
      expect(aggregate.tenantId).toBeInstanceOf(TenantUuidValueObject);
      expect(aggregate.planId).toBeInstanceOf(SubscriptionPlanUuidValueObject);
      expect(aggregate.startDate).toBeInstanceOf(
        SubscriptionStartDateValueObject,
      );
      expect(aggregate.endDate).toBeInstanceOf(SubscriptionEndDateValueObject);
      expect(aggregate.trialEndDate).toBeInstanceOf(
        SubscriptionTrialEndDateValueObject,
      );
      expect(aggregate.status).toBeInstanceOf(SubscriptionStatusValueObject);
      expect(aggregate.stripeSubscriptionId).toBeInstanceOf(
        SubscriptionStripeSubscriptionIdValueObject,
      );
      expect(aggregate.stripeCustomerId).toBeInstanceOf(
        SubscriptionStripeCustomerIdValueObject,
      );
      expect(aggregate.renewalMethod).toBeInstanceOf(
        SubscriptionRenewalMethodValueObject,
      );
    });

    it('should generate events when creating from primitives (default behavior)', () => {
      const startDate = new Date();
      const endDate = new Date();
      const primitives: SubscriptionPrimitives = {
        id: '123e4567-e89b-12d3-a456-426614174000',
        tenantId: '123e4567-e89b-12d3-a456-426614174001',
        planId: '123e4567-e89b-12d3-a456-426614174002',
        startDate: startDate,
        endDate: endDate,
        trialEndDate: null,
        status: SubscriptionStatusEnum.ACTIVE,
        stripeSubscriptionId: 'sub_1234567890',
        stripeCustomerId: 'cus_1234567890',
        renewalMethod: RenewalMethodEnum.AUTOMATIC,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      const aggregate = factory.fromPrimitives(primitives);

      // fromPrimitives calls new SubscriptionAggregate without generateEvent parameter,
      // so it defaults to true and events will be generated
      const uncommittedEvents = aggregate.getUncommittedEvents();
      expect(uncommittedEvents).toHaveLength(1);
      expect(uncommittedEvents[0]).toBeInstanceOf(SubscriptionCreatedEvent);
    });
  });
});
