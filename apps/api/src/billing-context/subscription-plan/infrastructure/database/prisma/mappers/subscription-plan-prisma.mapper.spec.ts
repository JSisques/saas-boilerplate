import { DateValueObject } from '@/shared/domain/value-objects/date/date.vo';
import { SubscriptionPlanUuidValueObject } from '@/shared/domain/value-objects/identifiers/subscription-plan/subscription-plan-uuid.vo';
import { SubscriptionPlanAggregate } from '@/billing-context/subscription-plan/domain/aggregates/subscription-plan.aggregate';
import { SubscriptionPlanTypeEnum } from '@/billing-context/subscription-plan/domain/enum/subscription-plan-type.enum';
import { SubscriptionPlanAggregateFactory } from '@/billing-context/subscription-plan/domain/factories/subscription-plan-aggregate/subscription-plan-aggregate.factory';
import { SubscriptionPlanPrismaDto } from '@/billing-context/subscription-plan/infrastructure/database/prisma/dtos/subscription-plan-prisma.dto';
import { SubscriptionPlanPrismaMapper } from '@/billing-context/subscription-plan/infrastructure/database/prisma/mappers/subscription-plan-prisma.mapper';
import {
  SubscriptionPlanTypeEnum as PrismaSubscriptionPlanTypeEnum,
  CurrencyEnum as PrismaCurrencyEnum,
  SubscriptionPlanIntervalEnum as PrismaSubscriptionPlanIntervalEnum,
} from '@prisma/client';
import { SubscriptionPlanCurrencyEnum } from '@/billing-context/subscription-plan/domain/enum/subscription-plan-currency.enum';
import { SubscriptionPlanIntervalEnum } from '@/billing-context/subscription-plan/domain/enum/subscription-plan-interval.enum';
import { SubscriptionPlanNameValueObject } from '@/billing-context/subscription-plan/domain/value-objects/subscription-plan-name/subscription-plan-name.vo';
import { SubscriptionPlanSlugValueObject } from '@/billing-context/subscription-plan/domain/value-objects/subscription-plan-slug/subscription-plan-slug.vo';
import { SubscriptionPlanTypeValueObject } from '@/billing-context/subscription-plan/domain/value-objects/subscription-plan-type/subscription-plan-type.vo';
import { SubscriptionPlanDescriptionValueObject } from '@/billing-context/subscription-plan/domain/value-objects/subscription-plan-description/subscription-plan-description.vo';
import { SubscriptionPlanPriceMonthlyValueObject } from '@/billing-context/subscription-plan/domain/value-objects/subscription-plan-price-monthly/subscription-plan-price-monthly.vo';
import { SubscriptionPlanPriceYearlyValueObject } from '@/billing-context/subscription-plan/domain/value-objects/subscription-plan-price-yearly/subscription-plan-price-yearly.vo';
import { SubscriptionPlanCurrencyValueObject } from '@/billing-context/subscription-plan/domain/value-objects/subscription-plan-currency/subscription-plan-currency.vo';
import { SubscriptionPlanIntervalValueObject } from '@/billing-context/subscription-plan/domain/value-objects/subscription-plan-interval/subscription-plan-interval.vo';
import { SubscriptionPlanIntervalCountValueObject } from '@/billing-context/subscription-plan/domain/value-objects/subscription-plan-interval-count/subscription-plan-interval-count.vo';
import { SubscriptionPlanTrialPeriodDaysValueObject } from '@/billing-context/subscription-plan/domain/value-objects/subscription-plan-trial-period-days/subscription-plan-trial-period-days.vo';
import { SubscriptionPlanIsActiveValueObject } from '@/billing-context/subscription-plan/domain/value-objects/subscription-plan-is-active/subscription-plan-is-active.vo';
import { SubscriptionPlanFeaturesValueObject } from '@/billing-context/subscription-plan/domain/value-objects/subscription-plan-features/subscription-plan-features.vo';
import { SubscriptionPlanLimitsValueObject } from '@/billing-context/subscription-plan/domain/value-objects/subscription-plan-limits/subscription-plan-limits.vo';
import { SubscriptionPlanStripePriceIdValueObject } from '@/billing-context/subscription-plan/domain/value-objects/subscription-plan-stripe-price-id/subscription-plan-stripe-price-id.vo';

describe('SubscriptionPlanPrismaMapper', () => {
  let mapper: SubscriptionPlanPrismaMapper;
  let mockSubscriptionPlanAggregateFactory: jest.Mocked<SubscriptionPlanAggregateFactory>;
  let spies: jest.SpyInstance[] = [];

  beforeEach(() => {
    mockSubscriptionPlanAggregateFactory = {
      create: jest.fn(),
      fromPrimitives: jest.fn(),
    } as unknown as jest.Mocked<SubscriptionPlanAggregateFactory>;

    mapper = new SubscriptionPlanPrismaMapper(
      mockSubscriptionPlanAggregateFactory,
    );
  });

  afterEach(() => {
    // Restore all spies
    spies.forEach((spy) => spy.mockRestore());
    spies = [];
    jest.clearAllMocks();
  });

  describe('toDomainEntity', () => {
    it('should convert Prisma data to domain entity with all properties', () => {
      const subscriptionPlanId = '123e4567-e89b-12d3-a456-426614174000';
      const now = new Date();

      const prismaData: SubscriptionPlanPrismaDto = {
        id: subscriptionPlanId,
        name: 'Basic Plan',
        slug: 'basic-plan',
        type: PrismaSubscriptionPlanTypeEnum.BASIC,
        description: 'Basic subscription plan',
        priceMonthly: 10.0,
        priceYearly: 100.0,
        currency: PrismaCurrencyEnum.USD,
        interval: PrismaSubscriptionPlanIntervalEnum.MONTHLY,
        intervalCount: 1,
        trialPeriodDays: 7,
        isActive: true,
        features: { apiAccess: true },
        limits: { maxUsers: 10 },
        stripePriceId: 'price_1234567890',
        createdAt: now,
        updatedAt: now,
      };

      const mockSubscriptionPlanAggregate = new SubscriptionPlanAggregate(
        {
          id: new SubscriptionPlanUuidValueObject(subscriptionPlanId),
          name: new SubscriptionPlanNameValueObject('Basic Plan'),
          slug: new SubscriptionPlanSlugValueObject('basic-plan'),
          type: new SubscriptionPlanTypeValueObject(
            SubscriptionPlanTypeEnum.BASIC,
          ),
          description: new SubscriptionPlanDescriptionValueObject(
            'Basic subscription plan',
          ),
          priceMonthly: new SubscriptionPlanPriceMonthlyValueObject(10.0),
          priceYearly: new SubscriptionPlanPriceYearlyValueObject(100.0),
          currency: new SubscriptionPlanCurrencyValueObject(
            SubscriptionPlanCurrencyEnum.USD,
          ),
          interval: new SubscriptionPlanIntervalValueObject(
            SubscriptionPlanIntervalEnum.MONTHLY,
          ),
          intervalCount: new SubscriptionPlanIntervalCountValueObject(1),
          trialPeriodDays: new SubscriptionPlanTrialPeriodDaysValueObject(7),
          isActive: new SubscriptionPlanIsActiveValueObject(true),
          features: new SubscriptionPlanFeaturesValueObject({
            apiAccess: true,
          }),
          limits: new SubscriptionPlanLimitsValueObject({ maxUsers: 10 }),
          stripePriceId: new SubscriptionPlanStripePriceIdValueObject(
            'price_1234567890',
          ),
          createdAt: new DateValueObject(now),
          updatedAt: new DateValueObject(now),
        },
        false,
      );

      mockSubscriptionPlanAggregateFactory.fromPrimitives.mockReturnValue(
        mockSubscriptionPlanAggregate,
      );

      const result = mapper.toDomainEntity(prismaData);

      expect(result).toBe(mockSubscriptionPlanAggregate);
      expect(
        mockSubscriptionPlanAggregateFactory.fromPrimitives,
      ).toHaveBeenCalledWith({
        id: subscriptionPlanId,
        name: 'Basic Plan',
        slug: 'basic-plan',
        type: SubscriptionPlanTypeEnum.BASIC,
        description: 'Basic subscription plan',
        priceMonthly: 10.0,
        priceYearly: 100.0,
        currency: SubscriptionPlanCurrencyEnum.USD,
        interval: SubscriptionPlanIntervalEnum.MONTHLY,
        intervalCount: 1,
        trialPeriodDays: 7,
        isActive: true,
        features: { apiAccess: true },
        limits: { maxUsers: 10 },
        stripePriceId: 'price_1234567890',
        createdAt: now,
        updatedAt: now,
      });
      expect(
        mockSubscriptionPlanAggregateFactory.fromPrimitives,
      ).toHaveBeenCalledTimes(1);
    });

    it('should convert Prisma data to domain entity with null optional properties', () => {
      const subscriptionPlanId = '123e4567-e89b-12d3-a456-426614174000';
      const now = new Date();

      const prismaData: SubscriptionPlanPrismaDto = {
        id: subscriptionPlanId,
        name: 'Basic Plan',
        slug: 'basic-plan',
        type: PrismaSubscriptionPlanTypeEnum.BASIC,
        description: null,
        priceMonthly: 10.0,
        priceYearly: 100.0,
        currency: PrismaCurrencyEnum.USD,
        interval: PrismaSubscriptionPlanIntervalEnum.MONTHLY,
        intervalCount: 1,
        trialPeriodDays: null,
        isActive: true,
        features: null,
        limits: null,
        stripePriceId: null,
        createdAt: now,
        updatedAt: now,
      };

      const mockSubscriptionPlanAggregate = new SubscriptionPlanAggregate(
        {
          id: new SubscriptionPlanUuidValueObject(subscriptionPlanId),
          name: new SubscriptionPlanNameValueObject('Basic Plan'),
          slug: new SubscriptionPlanSlugValueObject('basic-plan'),
          type: new SubscriptionPlanTypeValueObject(
            SubscriptionPlanTypeEnum.BASIC,
          ),
          description: null,
          priceMonthly: new SubscriptionPlanPriceMonthlyValueObject(10.0),
          priceYearly: new SubscriptionPlanPriceYearlyValueObject(100.0),
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

      const result = mapper.toDomainEntity(prismaData);

      expect(result).toBe(mockSubscriptionPlanAggregate);
      expect(
        mockSubscriptionPlanAggregateFactory.fromPrimitives,
      ).toHaveBeenCalledWith({
        id: subscriptionPlanId,
        name: 'Basic Plan',
        slug: 'basic-plan',
        type: SubscriptionPlanTypeEnum.BASIC,
        description: null,
        priceMonthly: 10.0,
        priceYearly: 100.0,
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

    it('should convert Prisma data with PRO type and YEARLY interval', () => {
      const subscriptionPlanId = '123e4567-e89b-12d3-a456-426614174000';
      const now = new Date();

      const prismaData: SubscriptionPlanPrismaDto = {
        id: subscriptionPlanId,
        name: 'Pro Plan',
        slug: 'pro-plan',
        type: PrismaSubscriptionPlanTypeEnum.PRO,
        description: 'Professional plan',
        priceMonthly: 29.99,
        priceYearly: 299.99,
        currency: PrismaCurrencyEnum.EUR,
        interval: PrismaSubscriptionPlanIntervalEnum.YEARLY,
        intervalCount: 1,
        trialPeriodDays: 14,
        isActive: true,
        features: { apiAccess: true, prioritySupport: true },
        limits: { maxUsers: 100 },
        stripePriceId: 'price_pro123',
        createdAt: now,
        updatedAt: now,
      };

      const mockSubscriptionPlanAggregate = new SubscriptionPlanAggregate(
        {
          id: new SubscriptionPlanUuidValueObject(subscriptionPlanId),
          name: new SubscriptionPlanNameValueObject('Pro Plan'),
          slug: new SubscriptionPlanSlugValueObject('pro-plan'),
          type: new SubscriptionPlanTypeValueObject(SubscriptionPlanTypeEnum.PRO),
          description: new SubscriptionPlanDescriptionValueObject(
            'Professional plan',
          ),
          priceMonthly: new SubscriptionPlanPriceMonthlyValueObject(29.99),
          priceYearly: new SubscriptionPlanPriceYearlyValueObject(299.99),
          currency: new SubscriptionPlanCurrencyValueObject(
            SubscriptionPlanCurrencyEnum.EUR,
          ),
          interval: new SubscriptionPlanIntervalValueObject(
            SubscriptionPlanIntervalEnum.YEARLY,
          ),
          intervalCount: new SubscriptionPlanIntervalCountValueObject(1),
          trialPeriodDays: new SubscriptionPlanTrialPeriodDaysValueObject(14),
          isActive: new SubscriptionPlanIsActiveValueObject(true),
          features: new SubscriptionPlanFeaturesValueObject({
            apiAccess: true,
            prioritySupport: true,
          }),
          limits: new SubscriptionPlanLimitsValueObject({ maxUsers: 100 }),
          stripePriceId: new SubscriptionPlanStripePriceIdValueObject(
            'price_pro123',
          ),
          createdAt: new DateValueObject(now),
          updatedAt: new DateValueObject(now),
        },
        false,
      );

      mockSubscriptionPlanAggregateFactory.fromPrimitives.mockReturnValue(
        mockSubscriptionPlanAggregate,
      );

      const result = mapper.toDomainEntity(prismaData);

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
        currency: SubscriptionPlanCurrencyEnum.EUR,
        interval: SubscriptionPlanIntervalEnum.YEARLY,
        intervalCount: 1,
        trialPeriodDays: 14,
        isActive: true,
        features: { apiAccess: true, prioritySupport: true },
        limits: { maxUsers: 100 },
        stripePriceId: 'price_pro123',
        createdAt: now,
        updatedAt: now,
      });
    });
  });

  describe('toPrismaData', () => {
    it('should convert domain entity to Prisma data with all properties', () => {
      const subscriptionPlanId = '123e4567-e89b-12d3-a456-426614174000';
      const now = new Date();

      const subscriptionPlanAggregate = new SubscriptionPlanAggregate(
        {
          id: new SubscriptionPlanUuidValueObject(subscriptionPlanId),
          name: new SubscriptionPlanNameValueObject('Basic Plan'),
          slug: new SubscriptionPlanSlugValueObject('basic-plan'),
          type: new SubscriptionPlanTypeValueObject(
            SubscriptionPlanTypeEnum.BASIC,
          ),
          description: new SubscriptionPlanDescriptionValueObject(
            'Basic subscription plan',
          ),
          priceMonthly: new SubscriptionPlanPriceMonthlyValueObject(10.0),
          priceYearly: new SubscriptionPlanPriceYearlyValueObject(100.0),
          currency: new SubscriptionPlanCurrencyValueObject(
            SubscriptionPlanCurrencyEnum.USD,
          ),
          interval: new SubscriptionPlanIntervalValueObject(
            SubscriptionPlanIntervalEnum.MONTHLY,
          ),
          intervalCount: new SubscriptionPlanIntervalCountValueObject(1),
          trialPeriodDays: new SubscriptionPlanTrialPeriodDaysValueObject(7),
          isActive: new SubscriptionPlanIsActiveValueObject(true),
          features: new SubscriptionPlanFeaturesValueObject({
            apiAccess: true,
          }),
          limits: new SubscriptionPlanLimitsValueObject({ maxUsers: 10 }),
          stripePriceId: new SubscriptionPlanStripePriceIdValueObject(
            'price_1234567890',
          ),
          createdAt: new DateValueObject(now),
          updatedAt: new DateValueObject(now),
        },
        false,
      );

      // Mock toPrimitives to return expected data
      const spy = jest.spyOn(subscriptionPlanAggregate, 'toPrimitives').mockReturnValue({
        id: subscriptionPlanId,
        name: 'Basic Plan',
        slug: 'basic-plan',
        type: SubscriptionPlanTypeEnum.BASIC,
        description: 'Basic subscription plan',
        priceMonthly: 10.0,
        priceYearly: 100.0,
        currency: SubscriptionPlanCurrencyEnum.USD,
        interval: SubscriptionPlanIntervalEnum.MONTHLY,
        intervalCount: 1,
        trialPeriodDays: 7,
        isActive: true,
        features: { apiAccess: true },
        limits: { maxUsers: 10 },
        stripePriceId: 'price_1234567890',
        createdAt: now,
        updatedAt: now,
      });
      spies.push(spy);

      const result = mapper.toPrismaData(subscriptionPlanAggregate);

      expect(result).toEqual({
        id: subscriptionPlanId,
        name: 'Basic Plan',
        slug: 'basic-plan',
        type: PrismaSubscriptionPlanTypeEnum.BASIC,
        description: 'Basic subscription plan',
        priceMonthly: 10.0,
        priceYearly: 100.0,
        currency: PrismaCurrencyEnum.USD,
        interval: PrismaSubscriptionPlanIntervalEnum.MONTHLY,
        intervalCount: 1,
        trialPeriodDays: 7,
        isActive: true,
        features: { apiAccess: true },
        limits: { maxUsers: 10 },
        stripePriceId: 'price_1234567890',
        createdAt: now,
        updatedAt: now,
      });
      expect(subscriptionPlanAggregate.toPrimitives).toHaveBeenCalledTimes(1);
    });

    it('should convert domain entity to Prisma data with null optional properties', () => {
      const subscriptionPlanId = '123e4567-e89b-12d3-a456-426614174000';
      const now = new Date();

      const subscriptionPlanAggregate = new SubscriptionPlanAggregate(
        {
          id: new SubscriptionPlanUuidValueObject(subscriptionPlanId),
          name: new SubscriptionPlanNameValueObject('Basic Plan'),
          slug: new SubscriptionPlanSlugValueObject('basic-plan'),
          type: new SubscriptionPlanTypeValueObject(
            SubscriptionPlanTypeEnum.BASIC,
          ),
          description: null,
          priceMonthly: new SubscriptionPlanPriceMonthlyValueObject(10.0),
          priceYearly: new SubscriptionPlanPriceYearlyValueObject(100.0),
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

      const spy = jest.spyOn(subscriptionPlanAggregate, 'toPrimitives').mockReturnValue({
        id: subscriptionPlanId,
        name: 'Basic Plan',
        slug: 'basic-plan',
        type: SubscriptionPlanTypeEnum.BASIC,
        description: null,
        priceMonthly: 10.0,
        priceYearly: 100.0,
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
      spies.push(spy);

      const result = mapper.toPrismaData(subscriptionPlanAggregate);

      expect(result).toEqual({
        id: subscriptionPlanId,
        name: 'Basic Plan',
        slug: 'basic-plan',
        type: PrismaSubscriptionPlanTypeEnum.BASIC,
        description: null,
        priceMonthly: 10.0,
        priceYearly: 100.0,
        currency: PrismaCurrencyEnum.USD,
        interval: PrismaSubscriptionPlanIntervalEnum.MONTHLY,
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

    it('should convert domain entity with PRO type and YEARLY interval', () => {
      const subscriptionPlanId = '123e4567-e89b-12d3-a456-426614174000';
      const now = new Date();

      const subscriptionPlanAggregate = new SubscriptionPlanAggregate(
        {
          id: new SubscriptionPlanUuidValueObject(subscriptionPlanId),
          name: new SubscriptionPlanNameValueObject('Pro Plan'),
          slug: new SubscriptionPlanSlugValueObject('pro-plan'),
          type: new SubscriptionPlanTypeValueObject(SubscriptionPlanTypeEnum.PRO),
          description: new SubscriptionPlanDescriptionValueObject(
            'Professional plan',
          ),
          priceMonthly: new SubscriptionPlanPriceMonthlyValueObject(29.99),
          priceYearly: new SubscriptionPlanPriceYearlyValueObject(299.99),
          currency: new SubscriptionPlanCurrencyValueObject(
            SubscriptionPlanCurrencyEnum.EUR,
          ),
          interval: new SubscriptionPlanIntervalValueObject(
            SubscriptionPlanIntervalEnum.YEARLY,
          ),
          intervalCount: new SubscriptionPlanIntervalCountValueObject(1),
          trialPeriodDays: new SubscriptionPlanTrialPeriodDaysValueObject(14),
          isActive: new SubscriptionPlanIsActiveValueObject(true),
          features: new SubscriptionPlanFeaturesValueObject({
            apiAccess: true,
            prioritySupport: true,
          }),
          limits: new SubscriptionPlanLimitsValueObject({ maxUsers: 100 }),
          stripePriceId: new SubscriptionPlanStripePriceIdValueObject(
            'price_pro123',
          ),
          createdAt: new DateValueObject(now),
          updatedAt: new DateValueObject(now),
        },
        false,
      );

      const spy = jest.spyOn(subscriptionPlanAggregate, 'toPrimitives').mockReturnValue({
        id: subscriptionPlanId,
        name: 'Pro Plan',
        slug: 'pro-plan',
        type: SubscriptionPlanTypeEnum.PRO,
        description: 'Professional plan',
        priceMonthly: 29.99,
        priceYearly: 299.99,
        currency: SubscriptionPlanCurrencyEnum.EUR,
        interval: SubscriptionPlanIntervalEnum.YEARLY,
        intervalCount: 1,
        trialPeriodDays: 14,
        isActive: true,
        features: { apiAccess: true, prioritySupport: true },
        limits: { maxUsers: 100 },
        stripePriceId: 'price_pro123',
        createdAt: now,
        updatedAt: now,
      });
      spies.push(spy);

      const result = mapper.toPrismaData(subscriptionPlanAggregate);

      expect(result).toEqual({
        id: subscriptionPlanId,
        name: 'Pro Plan',
        slug: 'pro-plan',
        type: PrismaSubscriptionPlanTypeEnum.PRO,
        description: 'Professional plan',
        priceMonthly: 29.99,
        priceYearly: 299.99,
        currency: PrismaCurrencyEnum.EUR,
        interval: PrismaSubscriptionPlanIntervalEnum.YEARLY,
        intervalCount: 1,
        trialPeriodDays: 14,
        isActive: true,
        features: { apiAccess: true, prioritySupport: true },
        limits: { maxUsers: 100 },
        stripePriceId: 'price_pro123',
        createdAt: now,
        updatedAt: now,
      });
    });
  });
});

