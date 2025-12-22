import { SubscriptionPlanAggregate } from '@/billing-context/subscription-plan/domain/aggregates/subscription-plan.aggregate';
import { ISubscriptionPlanCreateDto } from '@/billing-context/subscription-plan/domain/dtos/entities/subscription-plan-create/subscription-plan-create.dto';
import { SubscriptionPlanCurrencyEnum } from '@/billing-context/subscription-plan/domain/enum/subscription-plan-currency/subscription-plan-currency.enum';
import { SubscriptionPlanAggregateFactory } from '@/billing-context/subscription-plan/domain/factories/subscription-plan-aggregate/subscription-plan-aggregate.factory';
import { SubscriptionPlanPrimitives } from '@/billing-context/subscription-plan/domain/primitives/subscription-plan.primitives';
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
import { SubscriptionPlanIntervalEnum } from '@/shared/domain/enums/billing-context/subscription-plans/subscription-plan-interval/subscription-plan-interval.enum';
import { SubscriptionPlanTypeEnum } from '@/shared/domain/enums/billing-context/subscription-plans/subscription-plan-type/subscription-plan-type.enum';
import { SubscriptionPlanCreatedEvent } from '@/shared/domain/events/billing-context/subscription-plan/subscription-plan-created/subscription-plan-created.event';
import { DateValueObject } from '@/shared/domain/value-objects/date/date.vo';
import { SubscriptionPlanUuidValueObject } from '@/shared/domain/value-objects/identifiers/subscription-plan/subscription-plan-uuid.vo';
import { UserNameValueObject } from '@/user-context/users/domain/value-objects/user-name/user-name.vo';

describe('SubscriptionPlanAggregateFactory', () => {
  let factory: SubscriptionPlanAggregateFactory;

  beforeEach(() => {
    factory = new SubscriptionPlanAggregateFactory();
  });

  describe('create', () => {
    it('should create a SubscriptionPlanAggregate from DTO with all fields and generate event by default', () => {
      const dto: ISubscriptionPlanCreateDto = {
        id: new SubscriptionPlanUuidValueObject(
          '123e4567-e89b-12d3-a456-426614174000',
        ),
        name: new SubscriptionPlanNameValueObject('Pro Plan'),
        slug: new SubscriptionPlanSlugValueObject('pro-plan'),
        type: new SubscriptionPlanTypeValueObject(SubscriptionPlanTypeEnum.PRO),
        description: new SubscriptionPlanDescriptionValueObject(
          'Professional plan with advanced features',
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
          support: 'priority',
        }),
        limits: new SubscriptionPlanLimitsValueObject({
          maxUsers: 100,
          storage: '500GB',
        }),
        stripePriceId: new SubscriptionPlanStripePriceIdValueObject(
          'price_1234567890',
        ),
        createdAt: new DateValueObject(new Date()),
        updatedAt: new DateValueObject(new Date()),
      };

      const aggregate = factory.create(dto);

      expect(aggregate).toBeInstanceOf(SubscriptionPlanAggregate);
      expect(aggregate.id.value).toBe(dto.id.value);
      expect(aggregate.name.value).toBe(dto.name.value);
      expect(aggregate.slug.value).toBe(dto.slug.value);
      expect(aggregate.type.value).toBe(dto.type.value);
      expect(aggregate.description?.value).toBe(dto.description?.value);
      expect(aggregate.priceMonthly.value).toBe(dto.priceMonthly.value);
      expect(aggregate.priceYearly.value).toBe(dto.priceYearly.value);
      expect(aggregate.currency.value).toBe(dto.currency.value);
      expect(aggregate.interval.value).toBe(dto.interval.value);
      expect(aggregate.intervalCount.value).toBe(dto.intervalCount.value);
      expect(aggregate.trialPeriodDays?.value).toBe(dto.trialPeriodDays?.value);
      expect(aggregate.isActive.value).toBe(dto.isActive.value);
      expect(aggregate.features?.value).toEqual(dto.features?.value);
      expect(aggregate.limits?.value).toEqual(dto.limits?.value);
      expect(aggregate.stripePriceId?.value).toBe(dto.stripePriceId?.value);

      // Check that event was generated
      const uncommittedEvents = aggregate.getUncommittedEvents();
      expect(uncommittedEvents).toHaveLength(1);
      expect(uncommittedEvents[0]).toBeInstanceOf(SubscriptionPlanCreatedEvent);
    });

    it('should create a SubscriptionPlanAggregate from DTO without generating event when generateEvent is false', () => {
      const dto: ISubscriptionPlanCreateDto = {
        id: new SubscriptionPlanUuidValueObject(
          '123e4567-e89b-12d3-a456-426614174000',
        ),
        name: new SubscriptionPlanNameValueObject('Basic Plan'),
        slug: new SubscriptionPlanSlugValueObject('basic-plan'),
        type: new SubscriptionPlanTypeValueObject(
          SubscriptionPlanTypeEnum.BASIC,
        ),
        description: null,
        priceMonthly: new SubscriptionPlanPriceMonthlyValueObject(9.99),
        priceYearly: new SubscriptionPlanPriceYearlyValueObject(99.99),
        currency: new SubscriptionPlanCurrencyValueObject(
          SubscriptionPlanCurrencyEnum.EUR,
        ),
        interval: new SubscriptionPlanIntervalValueObject(
          SubscriptionPlanIntervalEnum.YEARLY,
        ),
        intervalCount: new SubscriptionPlanIntervalCountValueObject(1),
        trialPeriodDays: null,
        isActive: new SubscriptionPlanIsActiveValueObject(true),
        features: null,
        limits: null,
        stripePriceId: null,
        createdAt: new DateValueObject(new Date()),
        updatedAt: new DateValueObject(new Date()),
      };

      const aggregate = factory.create(dto, false);

      expect(aggregate).toBeInstanceOf(SubscriptionPlanAggregate);
      expect(aggregate.id.value).toBe(dto.id.value);
      expect(aggregate.name.value).toBe(dto.name.value);
      expect(aggregate.slug.value).toBe(dto.slug.value);

      // Check that no event was generated
      const uncommittedEvents = aggregate.getUncommittedEvents();
      expect(uncommittedEvents).toHaveLength(0);
    });

    it('should create a SubscriptionPlanAggregate from DTO with null optional fields', () => {
      const dto: ISubscriptionPlanCreateDto = {
        id: new SubscriptionPlanUuidValueObject(
          '123e4567-e89b-12d3-a456-426614174000',
        ),
        name: new SubscriptionPlanNameValueObject('Free Plan'),
        slug: new SubscriptionPlanSlugValueObject('free-plan'),
        type: new SubscriptionPlanTypeValueObject(
          SubscriptionPlanTypeEnum.FREE,
        ),
        description: null,
        priceMonthly: new SubscriptionPlanPriceMonthlyValueObject(0),
        priceYearly: new SubscriptionPlanPriceYearlyValueObject(0),
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
        createdAt: new DateValueObject(new Date()),
        updatedAt: new DateValueObject(new Date()),
      };

      const aggregate = factory.create(dto, false);

      expect(aggregate).toBeInstanceOf(SubscriptionPlanAggregate);
      expect(aggregate.id.value).toBe(dto.id.value);
      expect(aggregate.name.value).toBe(dto.name.value);
      expect(aggregate.description).toBeNull();
      expect(aggregate.trialPeriodDays).toBeNull();
      expect(aggregate.features).toBeNull();
      expect(aggregate.limits).toBeNull();
      expect(aggregate.stripePriceId).toBeNull();
    });
  });

  describe('fromPrimitives', () => {
    it('should create a SubscriptionPlanAggregate from primitives with all fields', () => {
      const primitives: SubscriptionPlanPrimitives = {
        id: '123e4567-e89b-12d3-a456-426614174000',
        name: 'Pro Plan',
        slug: 'pro-plan',
        type: SubscriptionPlanTypeEnum.PRO,
        description: 'Professional plan with advanced features',
        priceMonthly: 29.99,
        priceYearly: 299.99,
        currency: SubscriptionPlanCurrencyEnum.USD,
        interval: SubscriptionPlanIntervalEnum.MONTHLY,
        intervalCount: 1,
        trialPeriodDays: 14,
        isActive: true,
        features: { apiAccess: true, support: 'priority' },
        limits: { maxUsers: 100, storage: '500GB' },
        stripePriceId: 'price_1234567890',
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      const aggregate = factory.fromPrimitives(primitives);

      expect(aggregate).toBeInstanceOf(SubscriptionPlanAggregate);
      expect(aggregate.id.value).toBe(primitives.id);
      expect(aggregate.name.value).toBe(primitives.name);
      expect(aggregate.slug.value).toBe(primitives.slug);
      expect(aggregate.type.value).toBe(primitives.type);
      expect(aggregate.description?.value).toBe(primitives.description);
      expect(aggregate.priceMonthly.value).toBe(primitives.priceMonthly);
      expect(aggregate.priceYearly.value).toBe(primitives.priceYearly);
      expect(aggregate.currency.value).toBe(primitives.currency);
      expect(aggregate.interval.value).toBe(primitives.interval);
      expect(aggregate.intervalCount.value).toBe(primitives.intervalCount);
      expect(aggregate.trialPeriodDays?.value).toBe(primitives.trialPeriodDays);
      expect(aggregate.isActive.value).toBe(primitives.isActive);
      expect(aggregate.features?.value).toEqual(primitives.features);
      expect(aggregate.limits?.value).toEqual(primitives.limits);
      expect(aggregate.stripePriceId?.value).toBe(primitives.stripePriceId);
    });

    it('should create a SubscriptionPlanAggregate from primitives with null optional fields', () => {
      const primitives: SubscriptionPlanPrimitives = {
        id: '123e4567-e89b-12d3-a456-426614174000',
        name: 'Basic Plan',
        slug: 'basic-plan',
        type: SubscriptionPlanTypeEnum.BASIC,
        description: null,
        priceMonthly: 9.99,
        priceYearly: 99.99,
        currency: SubscriptionPlanCurrencyEnum.EUR,
        interval: SubscriptionPlanIntervalEnum.YEARLY,
        intervalCount: 1,
        trialPeriodDays: null,
        isActive: false,
        features: null,
        limits: null,
        stripePriceId: null,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      const aggregate = factory.fromPrimitives(primitives);

      expect(aggregate).toBeInstanceOf(SubscriptionPlanAggregate);
      expect(aggregate.id.value).toBe(primitives.id);
      expect(aggregate.name.value).toBe(primitives.name);
      expect(aggregate.description).toBeNull();
      expect(aggregate.trialPeriodDays).toBeNull();
      expect(aggregate.features).toBeNull();
      expect(aggregate.limits).toBeNull();
      expect(aggregate.stripePriceId).toBeNull();
    });

    it('should create value objects correctly from primitives', () => {
      const primitives: SubscriptionPlanPrimitives = {
        id: '123e4567-e89b-12d3-a456-426614174000',
        name: 'Enterprise Plan',
        slug: 'enterprise-plan',
        type: SubscriptionPlanTypeEnum.ENTERPRISE,
        description: 'Enterprise plan with all features',
        priceMonthly: 99.99,
        priceYearly: 999.99,
        currency: SubscriptionPlanCurrencyEnum.GBP,
        interval: SubscriptionPlanIntervalEnum.MONTHLY,
        intervalCount: 1,
        trialPeriodDays: 30,
        isActive: true,
        features: { apiAccess: true, support: '24/7' },
        limits: { maxUsers: 1000, storage: 'unlimited' },
        stripePriceId: 'price_9876543210',
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      const aggregate = factory.fromPrimitives(primitives);

      expect(aggregate.id).toBeInstanceOf(SubscriptionPlanUuidValueObject);
      expect(aggregate.name).toBeInstanceOf(UserNameValueObject);
      expect(aggregate.slug).toBeInstanceOf(SubscriptionPlanSlugValueObject);
      expect(aggregate.type).toBeInstanceOf(SubscriptionPlanTypeValueObject);
      expect(aggregate.description).toBeInstanceOf(
        SubscriptionPlanDescriptionValueObject,
      );
      expect(aggregate.priceMonthly).toBeInstanceOf(
        SubscriptionPlanPriceMonthlyValueObject,
      );
      expect(aggregate.priceYearly).toBeInstanceOf(
        SubscriptionPlanPriceYearlyValueObject,
      );
      expect(aggregate.currency).toBeInstanceOf(
        SubscriptionPlanCurrencyValueObject,
      );
      expect(aggregate.interval).toBeInstanceOf(
        SubscriptionPlanIntervalValueObject,
      );
      expect(aggregate.intervalCount).toBeInstanceOf(
        SubscriptionPlanIntervalCountValueObject,
      );
      expect(aggregate.trialPeriodDays).toBeInstanceOf(
        SubscriptionPlanTrialPeriodDaysValueObject,
      );
      expect(aggregate.isActive).toBeInstanceOf(
        SubscriptionPlanIsActiveValueObject,
      );
      expect(aggregate.features).toBeInstanceOf(
        SubscriptionPlanFeaturesValueObject,
      );
      expect(aggregate.limits).toBeInstanceOf(
        SubscriptionPlanLimitsValueObject,
      );
      expect(aggregate.stripePriceId).toBeInstanceOf(
        SubscriptionPlanStripePriceIdValueObject,
      );
    });

    it('should generate events when creating from primitives (default behavior)', () => {
      const primitives: SubscriptionPlanPrimitives = {
        id: '123e4567-e89b-12d3-a456-426614174000',
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
        features: null,
        limits: null,
        stripePriceId: null,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      const aggregate = factory.fromPrimitives(primitives);

      // fromPrimitives calls new SubscriptionPlanAggregate without generateEvent parameter,
      // so it defaults to true and events will be generated
      const uncommittedEvents = aggregate.getUncommittedEvents();
      expect(uncommittedEvents).toHaveLength(1);
      expect(uncommittedEvents[0]).toBeInstanceOf(SubscriptionPlanCreatedEvent);
    });
  });
});
