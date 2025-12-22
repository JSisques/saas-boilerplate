import { DateValueObject } from '@/shared/domain/value-objects/date/date.vo';
import { SubscriptionPlanUuidValueObject } from '@/shared/domain/value-objects/identifiers/subscription-plan/subscription-plan-uuid.vo';
import { SubscriptionUuidValueObject } from '@/shared/domain/value-objects/identifiers/subscription/subscription-uuid.vo';
import { TenantUuidValueObject } from '@/shared/domain/value-objects/identifiers/tenant-uuid/tenant-uuid.vo';
import { TypeormMasterService } from '@/shared/infrastructure/database/typeorm/services/typeorm-master/typeorm-master.service';
import { SubscriptionAggregate } from '@/billing-context/subscription/domain/aggregates/subscription.aggregate';
import { SubscriptionRenewalMethodEnum } from '@/billing-context/subscription/domain/enum/subscription-renewal-method.enum';
import { SubscriptionStatusEnum } from '@/billing-context/subscription/domain/enum/subscription-status.enum';
import { SubscriptionAggregateFactory } from '@/billing-context/subscription/domain/factories/subscription-aggregate/subscription-aggregate.factory';
import { SubscriptionEndDateValueObject } from '@/billing-context/subscription/domain/value-objects/subscription-end-date/subscription-end-date.vo';
import { SubscriptionRenewalMethodValueObject } from '@/billing-context/subscription/domain/value-objects/subscription-renewal-method copy/subscription-renewal-method.vo';
import { SubscriptionStartDateValueObject } from '@/billing-context/subscription/domain/value-objects/subscription-start-date/subscription-start-date.vo';
import { SubscriptionStatusValueObject } from '@/billing-context/subscription/domain/value-objects/subscription-status/subscription-status.vo';
import { SubscriptionStripeCustomerIdValueObject } from '@/billing-context/subscription/domain/value-objects/subscription-stripe-customer-id/subscription-stripe-customer-id.vo';
import { SubscriptionStripeSubscriptionIdValueObject } from '@/billing-context/subscription/domain/value-objects/subscription-stripe-id/subscription-stripe-id.vo';
import { SubscriptionTrialEndDateValueObject } from '@/billing-context/subscription/domain/value-objects/subscription-trial-end-date/subscription-trial-end-date.vo';
import { SubscriptionTypeormEntity } from '@/billing-context/subscription/infrastructure/database/typeorm/entities/subscription-typeorm.entity';
import { SubscriptionTypeormMapper } from '@/billing-context/subscription/infrastructure/database/typeorm/mappers/subscription-typeorm.mapper';

describe('SubscriptionTypeormMapper', () => {
  let mapper: SubscriptionTypeormMapper;
  let mockSubscriptionAggregateFactory: jest.Mocked<SubscriptionAggregateFactory>;

  beforeEach(() => {
    mockSubscriptionAggregateFactory = {
      create: jest.fn(),
      fromPrimitives: jest.fn(),
    } as unknown as jest.Mocked<SubscriptionAggregateFactory>;

    mapper = new SubscriptionTypeormMapper(mockSubscriptionAggregateFactory);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('toDomainEntity', () => {
    it('should convert TypeORM entity to domain entity with all properties', () => {
      const subscriptionId = '123e4567-e89b-12d3-a456-426614174000';
      const tenantId = '223e4567-e89b-12d3-a456-426614174000';
      const planId = '323e4567-e89b-12d3-a456-426614174000';
      const now = new Date();
      const startDate = new Date();
      const endDate = new Date();
      const trialEndDate = new Date();

      const typeormEntity = new SubscriptionTypeormEntity();
      typeormEntity.id = subscriptionId;
      typeormEntity.tenantId = tenantId;
      typeormEntity.planId = planId;
      typeormEntity.startDate = startDate;
      typeormEntity.endDate = endDate;
      typeormEntity.trialEndDate = trialEndDate;
      typeormEntity.status = SubscriptionStatusEnum.ACTIVE;
      typeormEntity.stripeSubscriptionId = 'sub_123';
      typeormEntity.stripeCustomerId = 'cus_123';
      typeormEntity.renewalMethod = SubscriptionRenewalMethodEnum.AUTOMATIC;
      typeormEntity.createdAt = now;
      typeormEntity.updatedAt = now;
      typeormEntity.deletedAt = null;

      const mockSubscriptionAggregate = new SubscriptionAggregate(
        {
          id: new SubscriptionUuidValueObject(subscriptionId),
          tenantId: new TenantUuidValueObject(tenantId),
          planId: new SubscriptionPlanUuidValueObject(planId),
          startDate: new SubscriptionStartDateValueObject(startDate),
          endDate: new SubscriptionEndDateValueObject(endDate),
          trialEndDate: new SubscriptionTrialEndDateValueObject(trialEndDate),
          status: new SubscriptionStatusValueObject(
            SubscriptionStatusEnum.ACTIVE,
          ),
          stripeSubscriptionId: new SubscriptionStripeSubscriptionIdValueObject(
            'sub_123',
          ),
          stripeCustomerId: new SubscriptionStripeCustomerIdValueObject(
            'cus_123',
          ),
          renewalMethod: new SubscriptionRenewalMethodValueObject(
            SubscriptionRenewalMethodEnum.AUTOMATIC,
          ),
          createdAt: new DateValueObject(now),
          updatedAt: new DateValueObject(now),
        },
        false,
      );

      mockSubscriptionAggregateFactory.fromPrimitives.mockReturnValue(
        mockSubscriptionAggregate,
      );

      const result = mapper.toDomainEntity(typeormEntity);

      expect(result).toBe(mockSubscriptionAggregate);
      expect(
        mockSubscriptionAggregateFactory.fromPrimitives,
      ).toHaveBeenCalledWith({
        id: subscriptionId,
        tenantId: tenantId,
        planId: planId,
        startDate: startDate,
        endDate: endDate,
        trialEndDate: trialEndDate,
        status: SubscriptionStatusEnum.ACTIVE,
        stripeSubscriptionId: 'sub_123',
        stripeCustomerId: 'cus_123',
        renewalMethod: SubscriptionRenewalMethodEnum.AUTOMATIC,
        createdAt: now,
        updatedAt: now,
      });
    });

    it('should convert TypeORM entity with null optional properties', () => {
      const subscriptionId = '123e4567-e89b-12d3-a456-426614174000';
      const tenantId = '223e4567-e89b-12d3-a456-426614174000';
      const planId = '323e4567-e89b-12d3-a456-426614174000';
      const now = new Date();
      const startDate = new Date();
      const endDate = new Date();

      const typeormEntity = new SubscriptionTypeormEntity();
      typeormEntity.id = subscriptionId;
      typeormEntity.tenantId = tenantId;
      typeormEntity.planId = planId;
      typeormEntity.startDate = startDate;
      typeormEntity.endDate = endDate;
      typeormEntity.trialEndDate = null;
      typeormEntity.status = SubscriptionStatusEnum.INACTIVE;
      typeormEntity.stripeSubscriptionId = null;
      typeormEntity.stripeCustomerId = null;
      typeormEntity.renewalMethod = SubscriptionRenewalMethodEnum.MANUAL;
      typeormEntity.createdAt = now;
      typeormEntity.updatedAt = now;
      typeormEntity.deletedAt = null;

      const mockSubscriptionAggregate = new SubscriptionAggregate(
        {
          id: new SubscriptionUuidValueObject(subscriptionId),
          tenantId: new TenantUuidValueObject(tenantId),
          planId: new SubscriptionPlanUuidValueObject(planId),
          startDate: new SubscriptionStartDateValueObject(startDate),
          endDate: new SubscriptionEndDateValueObject(endDate),
          trialEndDate: null,
          status: new SubscriptionStatusValueObject(
            SubscriptionStatusEnum.INACTIVE,
          ),
          stripeSubscriptionId: null,
          stripeCustomerId: null,
          renewalMethod: new SubscriptionRenewalMethodValueObject(
            SubscriptionRenewalMethodEnum.MANUAL,
          ),
          createdAt: new DateValueObject(now),
          updatedAt: new DateValueObject(now),
        },
        false,
      );

      mockSubscriptionAggregateFactory.fromPrimitives.mockReturnValue(
        mockSubscriptionAggregate,
      );

      const result = mapper.toDomainEntity(typeormEntity);

      expect(result).toBe(mockSubscriptionAggregate);
      expect(
        mockSubscriptionAggregateFactory.fromPrimitives,
      ).toHaveBeenCalledWith({
        id: subscriptionId,
        tenantId: tenantId,
        planId: planId,
        startDate: startDate,
        endDate: endDate,
        trialEndDate: null,
        status: SubscriptionStatusEnum.INACTIVE,
        stripeSubscriptionId: null,
        stripeCustomerId: null,
        renewalMethod: SubscriptionRenewalMethodEnum.MANUAL,
        createdAt: now,
        updatedAt: now,
      });
    });
  });

  describe('toTypeormEntity', () => {
    it('should convert domain entity to TypeORM entity with all properties', () => {
      const subscriptionId = '123e4567-e89b-12d3-a456-426614174000';
      const tenantId = '223e4567-e89b-12d3-a456-426614174000';
      const planId = '323e4567-e89b-12d3-a456-426614174000';
      const now = new Date();
      const startDate = new Date();
      const endDate = new Date();
      const trialEndDate = new Date();

      const mockSubscriptionAggregate = new SubscriptionAggregate(
        {
          id: new SubscriptionUuidValueObject(subscriptionId),
          tenantId: new TenantUuidValueObject(tenantId),
          planId: new SubscriptionPlanUuidValueObject(planId),
          startDate: new SubscriptionStartDateValueObject(startDate),
          endDate: new SubscriptionEndDateValueObject(endDate),
          trialEndDate: new SubscriptionTrialEndDateValueObject(trialEndDate),
          status: new SubscriptionStatusValueObject(
            SubscriptionStatusEnum.ACTIVE,
          ),
          stripeSubscriptionId: new SubscriptionStripeSubscriptionIdValueObject(
            'sub_123',
          ),
          stripeCustomerId: new SubscriptionStripeCustomerIdValueObject(
            'cus_123',
          ),
          renewalMethod: new SubscriptionRenewalMethodValueObject(
            SubscriptionRenewalMethodEnum.AUTOMATIC,
          ),
          createdAt: new DateValueObject(now),
          updatedAt: new DateValueObject(now),
        },
        false,
      );

      const toPrimitivesSpy = jest
        .spyOn(mockSubscriptionAggregate, 'toPrimitives')
        .mockReturnValue({
          id: subscriptionId,
          tenantId: tenantId,
          planId: planId,
          startDate: startDate,
          endDate: endDate,
          trialEndDate: trialEndDate,
          status: SubscriptionStatusEnum.ACTIVE,
          stripeSubscriptionId: 'sub_123',
          stripeCustomerId: 'cus_123',
          renewalMethod: SubscriptionRenewalMethodEnum.AUTOMATIC,
          createdAt: now,
          updatedAt: now,
        });

      const result = mapper.toTypeormEntity(mockSubscriptionAggregate);

      expect(result).toBeInstanceOf(SubscriptionTypeormEntity);
      expect(result.id).toBe(subscriptionId);
      expect(result.tenantId).toBe(tenantId);
      expect(result.planId).toBe(planId);
      expect(result.startDate).toEqual(startDate);
      expect(result.endDate).toEqual(endDate);
      expect(result.trialEndDate).toEqual(trialEndDate);
      expect(result.status).toBe(SubscriptionStatusEnum.ACTIVE);
      expect(result.stripeSubscriptionId).toBe('sub_123');
      expect(result.stripeCustomerId).toBe('cus_123');
      expect(result.renewalMethod).toBe(
        SubscriptionRenewalMethodEnum.AUTOMATIC,
      );
      expect(result.createdAt).toEqual(now);
      expect(result.updatedAt).toEqual(now);
      expect(result.deletedAt).toBeNull();

      toPrimitivesSpy.mockRestore();
    });
  });
});
