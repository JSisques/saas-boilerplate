import { DateValueObject } from '@/shared/domain/value-objects/date/date.vo';
import { SubscriptionPlanUuidValueObject } from '@/shared/domain/value-objects/identifiers/subscription-plan/subscription-plan-uuid.vo';
import { SubscriptionPlanAggregate } from '@/billing-context/subscription-plan/domain/aggregates/subscription-plan.aggregate';
import { SubscriptionPlanCurrencyEnum } from '@/billing-context/subscription-plan/domain/enum/subscription-plan-currency.enum';
import { SubscriptionPlanIntervalEnum } from '@/billing-context/subscription-plan/domain/enum/subscription-plan-interval.enum';
import { SubscriptionPlanTypeEnum } from '@/billing-context/subscription-plan/domain/enum/subscription-plan-type.enum';
import { SubscriptionPlanAggregateFactory } from '@/billing-context/subscription-plan/domain/factories/subscription-plan-aggregate/subscription-plan-aggregate.factory';
import { SubscriptionPlanCurrencyValueObject } from '@/billing-context/subscription-plan/domain/value-objects/subscription-plan-currency/subscription-plan-currency.vo';
import { SubscriptionPlanDescriptionValueObject } from '@/billing-context/subscription-plan/domain/value-objects/subscription-plan-description/subscription-plan-description.vo';
import { SubscriptionPlanFeaturesValueObject } from '@/billing-context/subscription-plan/domain/value-objects/subscription-plan-features/subscription-plan-features.vo';
import { SubscriptionPlanIntervalCountValueObject } from '@/billing-context/subscription-plan/domain/value-objects/subscription-plan-interval-count/subscription-plan-interval-count.vo';
import { SubscriptionPlanIntervalValueObject } from '@/billing-context/subscription-plan/domain/value-objects/subscription-plan-interval/subscription-plan-interval.vo';
import { SubscriptionPlanIsActiveValueObject } from '@/billing-context/subscription-plan/domain/value-objects/subscription-plan-is-active/subscription-plan-is-active.vo';
import { SubscriptionPlanLimitsValueObject } from '@/billing-context/subscription-plan/domain/value-objects/subscription-plan-limits/subscription-plan-limits.vo';
import { SubscriptionPlanNameValueObject } from '@/billing-context/subscription-plan/domain/value-objects/subscription-plan-name/subscription-plan-name.vo';
import { SubscriptionPlanPriceMonthlyValueObject } from '@/billing-context/subscription-plan/domain/value-objects/subscription-plan-price-monthly/subscription-plan-price-monthly.vo';
import { SubscriptionPlanPriceYearlyValueObject } from '@/billing-context/subscription-plan/domain/value-objects/subscription-plan-price-yearly/subscription-plan-price-yearly.vo';
import { SubscriptionPlanSlugValueObject } from '@/billing-context/subscription-plan/domain/value-objects/subscription-plan-slug/subscription-plan-slug.vo';
import { SubscriptionPlanStripePriceIdValueObject } from '@/billing-context/subscription-plan/domain/value-objects/subscription-plan-stripe-price-id/subscription-plan-stripe-price-id.vo';
import { SubscriptionPlanTrialPeriodDaysValueObject } from '@/billing-context/subscription-plan/domain/value-objects/subscription-plan-trial-period-days/subscription-plan-trial-period-days.vo';
import { SubscriptionPlanTypeValueObject } from '@/billing-context/subscription-plan/domain/value-objects/subscription-plan-type/subscription-plan-type.vo';
import { SubscriptionPlanTypeormEntity } from '@/billing-context/subscription-plan/infrastructure/database/typeorm/entities/subscription-plan-typeorm.entity';
import { SubscriptionPlanTypeormMapper } from '@/billing-context/subscription-plan/infrastructure/database/typeorm/mappers/subscription-plan-typeorm.mapper';

describe('SubscriptionPlanTypeormMapper', () => {
  let mapper: SubscriptionPlanTypeormMapper;
  let mockSubscriptionPlanAggregateFactory: jest.Mocked<SubscriptionPlanAggregateFactory>;

  beforeEach(() => {
    mockSubscriptionPlanAggregateFactory = {
      create: jest.fn(),
      fromPrimitives: jest.fn(),
    } as unknown as jest.Mocked<SubscriptionPlanAggregateFactory>;

    mapper = new SubscriptionPlanTypeormMapper(
      mockSubscriptionPlanAggregateFactory,
    );
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('toDomainEntity', () => {
    it('should convert TypeORM entity to domain entity with all properties', () => {
      const subscriptionPlanId = '123e4567-e89b-12d3-a456-426614174000';
      const now = new Date();

      const typeormEntity = new SubscriptionPlanTypeormEntity();
      typeormEntity.id = subscriptionPlanId;
      typeormEntity.name = 'Pro Plan';
      typeormEntity.slug = 'pro-plan';
      typeormEntity.type = SubscriptionPlanTypeEnum.PRO;
      typeormEntity.description = 'Professional plan';
      typeormEntity.priceMonthly = 29.99;
      typeormEntity.priceYearly = 299.99;
      typeormEntity.currency = SubscriptionPlanCurrencyEnum.USD;
      typeormEntity.interval = SubscriptionPlanIntervalEnum.MONTHLY;
      typeormEntity.intervalCount = 1;
      typeormEntity.trialPeriodDays = 14;
      typeormEntity.isActive = true;
      typeormEntity.features = { apiAccess: true };
      typeormEntity.limits = { maxUsers: 100 };
      typeormEntity.stripePriceId = 'price_123';
      typeormEntity.createdAt = now;
      typeormEntity.updatedAt = now;
      typeormEntity.deletedAt = null;

      const mockSubscriptionPlanAggregate = new SubscriptionPlanAggregate(
        {
          id: new SubscriptionPlanUuidValueObject(subscriptionPlanId),
          name: new SubscriptionPlanNameValueObject('Pro Plan'),
          slug: new SubscriptionPlanSlugValueObject('pro-plan'),
          type: new SubscriptionPlanTypeValueObject(
            SubscriptionPlanTypeEnum.PRO,
          ),
          description: new SubscriptionPlanDescriptionValueObject(
            'Professional plan',
          ),
          priceMonthly: new SubscriptionPlanPriceMonthlyValueObject(29.99),
          priceYearly: new SubscriptionPlanPriceYearlyValueObject(299.99),
          currency: new SubscriptionPlanCurrencyValueObject(
            SubscriptionPlanCurrencyEnum.USD,
          ),
          interval: new SubscriptionPlanIntervalValueObject(
            SubscriptionPlanIntervalEnum.MONTHLY,
          ),
          intervalCount: new SubscriptionPlanIntervalCountValueObject(1),
          trialPeriodDays: new SubscriptionPlanTrialPeriodDaysValueObject(14),
          isActive: new SubscriptionPlanIsActiveValueObject(true),
          features: new SubscriptionPlanFeaturesValueObject({
            apiAccess: true,
          }),
          limits: new SubscriptionPlanLimitsValueObject({ maxUsers: 100 }),
          stripePriceId: new SubscriptionPlanStripePriceIdValueObject(
            'price_123',
          ),
          createdAt: new DateValueObject(now),
          updatedAt: new DateValueObject(now),
        },
        false,
      );

      mockSubscriptionPlanAggregateFactory.fromPrimitives.mockReturnValue(
        mockSubscriptionPlanAggregate,
      );

      const result = mapper.toDomainEntity(typeormEntity);

      expect(result).toBe(mockSubscriptionPlanAggregate);
      expect(
        mockSubscriptionPlanAggregateFactory.fromPrimitives,
      ).toHaveBeenCalledWith({
        id: subscriptionPlanId,
        name: 'Pro Plan',
        slug: 'pro-plan',
        type: SubscriptionPlanTypeEnum.PRO,
        description: 'Professional plan',
        priceMonthly: 29.99,
        priceYearly: 299.99,
        currency: SubscriptionPlanCurrencyEnum.USD,
        interval: SubscriptionPlanIntervalEnum.MONTHLY,
        intervalCount: 1,
        trialPeriodDays: 14,
        isActive: true,
        features: { apiAccess: true },
        limits: { maxUsers: 100 },
        stripePriceId: 'price_123',
        createdAt: now,
        updatedAt: now,
      });
    });

    it('should convert TypeORM entity with null optional properties', () => {
      const subscriptionPlanId = '123e4567-e89b-12d3-a456-426614174000';
      const now = new Date();

      const typeormEntity = new SubscriptionPlanTypeormEntity();
      typeormEntity.id = subscriptionPlanId;
      typeormEntity.name = 'Basic Plan';
      typeormEntity.slug = 'basic-plan';
      typeormEntity.type = SubscriptionPlanTypeEnum.BASIC;
      typeormEntity.description = null;
      typeormEntity.priceMonthly = 9.99;
      typeormEntity.priceYearly = 99.99;
      typeormEntity.currency = SubscriptionPlanCurrencyEnum.USD;
      typeormEntity.interval = SubscriptionPlanIntervalEnum.MONTHLY;
      typeormEntity.intervalCount = 1;
      typeormEntity.trialPeriodDays = null;
      typeormEntity.isActive = true;
      typeormEntity.features = null;
      typeormEntity.limits = null;
      typeormEntity.stripePriceId = null;
      typeormEntity.createdAt = now;
      typeormEntity.updatedAt = now;
      typeormEntity.deletedAt = null;

      const mockSubscriptionPlanAggregate = new SubscriptionPlanAggregate(
        {
          id: new SubscriptionPlanUuidValueObject(subscriptionPlanId),
          name: new SubscriptionPlanNameValueObject('Basic Plan'),
          slug: new SubscriptionPlanSlugValueObject('basic-plan'),
          type: new SubscriptionPlanTypeValueObject(
            SubscriptionPlanTypeEnum.BASIC,
          ),
          description: null,
          priceMonthly: new SubscriptionPlanPriceMonthlyValueObject(9.99),
          priceYearly: new SubscriptionPlanPriceYearlyValueObject(99.99),
          currency: new SubscriptionPlanCurrencyValueObject(
            SubscriptionPlanCurrencyEnum.USD,
          ),
          interval: new SubscriptionPlanIntervalValueObject(
            SubscriptionPlanIntervalEnum.MONTHLY,
          ),
          intervalCount: new SubscriptionPlanIntervalCountValueObject(1),
          trialPeriodDays: null,
          isActive: new SubscriptionPlanIsActiveValueObject(true),
          features: null,
          limits: null,
          stripePriceId: null,
          createdAt: new DateValueObject(now),
          updatedAt: new DateValueObject(now),
        },
        false,
      );

      mockSubscriptionPlanAggregateFactory.fromPrimitives.mockReturnValue(
        mockSubscriptionPlanAggregate,
      );

      const result = mapper.toDomainEntity(typeormEntity);

      expect(result).toBe(mockSubscriptionPlanAggregate);
      expect(
        mockSubscriptionPlanAggregateFactory.fromPrimitives,
      ).toHaveBeenCalledWith({
        id: subscriptionPlanId,
        name: 'Basic Plan',
        slug: 'basic-plan',
        type: SubscriptionPlanTypeEnum.BASIC,
        description: null,
        priceMonthly: 9.99,
        priceYearly: 99.99,
        currency: SubscriptionPlanCurrencyEnum.USD,
        interval: SubscriptionPlanIntervalEnum.MONTHLY,
        intervalCount: 1,
        trialPeriodDays: null,
        isActive: true,
        features: null,
        limits: null,
        stripePriceId: null,
        createdAt: now,
        updatedAt: now,
      });
    });
  });

  describe('toTypeormEntity', () => {
    it('should convert domain entity to TypeORM entity with all properties', () => {
      const subscriptionPlanId = '123e4567-e89b-12d3-a456-426614174000';
      const now = new Date();

      const mockSubscriptionPlanAggregate = new SubscriptionPlanAggregate(
        {
          id: new SubscriptionPlanUuidValueObject(subscriptionPlanId),
          name: new SubscriptionPlanNameValueObject('Pro Plan'),
          slug: new SubscriptionPlanSlugValueObject('pro-plan'),
          type: new SubscriptionPlanTypeValueObject(
            SubscriptionPlanTypeEnum.PRO,
          ),
          description: new SubscriptionPlanDescriptionValueObject(
            'Professional plan',
          ),
          priceMonthly: new SubscriptionPlanPriceMonthlyValueObject(29.99),
          priceYearly: new SubscriptionPlanPriceYearlyValueObject(299.99),
          currency: new SubscriptionPlanCurrencyValueObject(
            SubscriptionPlanCurrencyEnum.USD,
          ),
          interval: new SubscriptionPlanIntervalValueObject(
            SubscriptionPlanIntervalEnum.MONTHLY,
          ),
          intervalCount: new SubscriptionPlanIntervalCountValueObject(1),
          trialPeriodDays: new SubscriptionPlanTrialPeriodDaysValueObject(14),
          isActive: new SubscriptionPlanIsActiveValueObject(true),
          features: new SubscriptionPlanFeaturesValueObject({
            apiAccess: true,
          }),
          limits: new SubscriptionPlanLimitsValueObject({ maxUsers: 100 }),
          stripePriceId: new SubscriptionPlanStripePriceIdValueObject(
            'price_123',
          ),
          createdAt: new DateValueObject(now),
          updatedAt: new DateValueObject(now),
        },
        false,
      );

      const toPrimitivesSpy = jest
        .spyOn(mockSubscriptionPlanAggregate, 'toPrimitives')
        .mockReturnValue({
          id: subscriptionPlanId,
          name: 'Pro Plan',
          slug: 'pro-plan',
          type: SubscriptionPlanTypeEnum.PRO,
          description: 'Professional plan',
          priceMonthly: 29.99,
          priceYearly: 299.99,
          currency: SubscriptionPlanCurrencyEnum.USD,
          interval: SubscriptionPlanIntervalEnum.MONTHLY,
          intervalCount: 1,
          trialPeriodDays: 14,
          isActive: true,
          features: { apiAccess: true },
          limits: { maxUsers: 100 },
          stripePriceId: 'price_123',
          createdAt: now,
          updatedAt: now,
        });

      const result = mapper.toTypeormEntity(mockSubscriptionPlanAggregate);

      expect(result).toBeInstanceOf(SubscriptionPlanTypeormEntity);
      expect(result.id).toBe(subscriptionPlanId);
      expect(result.name).toBe('Pro Plan');
      expect(result.slug).toBe('pro-plan');
      expect(result.type).toBe(SubscriptionPlanTypeEnum.PRO);
      expect(result.description).toBe('Professional plan');
      expect(result.priceMonthly).toBe(29.99);
      expect(result.priceYearly).toBe(299.99);
      expect(result.currency).toBe(SubscriptionPlanCurrencyEnum.USD);
      expect(result.interval).toBe(SubscriptionPlanIntervalEnum.MONTHLY);
      expect(result.intervalCount).toBe(1);
      expect(result.trialPeriodDays).toBe(14);
      expect(result.isActive).toBe(true);
      expect(result.features).toEqual({ apiAccess: true });
      expect(result.limits).toEqual({ maxUsers: 100 });
      expect(result.stripePriceId).toBe('price_123');
      expect(result.createdAt).toEqual(now);
      expect(result.updatedAt).toEqual(now);
      expect(result.deletedAt).toBeNull();

      toPrimitivesSpy.mockRestore();
    });
  });
});
