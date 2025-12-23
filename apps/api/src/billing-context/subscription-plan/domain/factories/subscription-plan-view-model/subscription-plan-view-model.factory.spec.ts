import { SubscriptionPlanAggregate } from '@/billing-context/subscription-plan/domain/aggregates/subscription-plan.aggregate';
import { ISubscriptionPlanCreateViewModelDto } from '@/billing-context/subscription-plan/domain/dtos/view-models/subscription-plan-create-view-model/subscription-plan-create-view-model.dto';
import { SubscriptionPlanCurrencyEnum } from '@/billing-context/subscription-plan/domain/enum/subscription-plan-currency/subscription-plan-currency.enum';
import { SubscriptionPlanViewModelFactory } from '@/billing-context/subscription-plan/domain/factories/subscription-plan-view-model/subscription-plan-view-model.factory';
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
import { SubscriptionPlanViewModel } from '@/billing-context/subscription-plan/domain/view-models/subscription-plan.view-model';
import { SubscriptionPlanIntervalEnum } from '@/billing-context/subscription-plan/domain/enum/subscription-plan-interval/subscription-plan-interval.enum';
import { SubscriptionPlanTypeEnum } from '@/billing-context/subscription-plan/domain/enum/subscription-plan-type/subscription-plan-type.enum';
import { DateValueObject } from '@/shared/domain/value-objects/date/date.vo';
import { SubscriptionPlanUuidValueObject } from '@/shared/domain/value-objects/identifiers/subscription-plan/subscription-plan-uuid.vo';

describe('SubscriptionPlanViewModelFactory', () => {
  let factory: SubscriptionPlanViewModelFactory;

  beforeEach(() => {
    factory = new SubscriptionPlanViewModelFactory();
  });

  describe('create', () => {
    it('should create a SubscriptionPlanViewModel from a DTO with all fields', () => {
      const dto: ISubscriptionPlanCreateViewModelDto = {
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
        createdAt: new Date('2024-01-01'),
        updatedAt: new Date('2024-01-02'),
      };

      const viewModel = factory.create(dto);

      expect(viewModel).toBeInstanceOf(SubscriptionPlanViewModel);
      expect(viewModel.id).toBe(dto.id);
      expect(viewModel.name).toBe(dto.name);
      expect(viewModel.slug).toBe(dto.slug);
      expect(viewModel.type).toBe(dto.type);
      expect(viewModel.description).toBe(dto.description);
      expect(viewModel.priceMonthly).toBe(dto.priceMonthly);
      expect(viewModel.priceYearly).toBe(dto.priceYearly);
      expect(viewModel.currency).toBe(dto.currency);
      expect(viewModel.interval).toBe(dto.interval);
      expect(viewModel.intervalCount).toBe(dto.intervalCount);
      expect(viewModel.trialPeriodDays).toBe(dto.trialPeriodDays);
      expect(viewModel.isActive).toBe(dto.isActive);
      expect(viewModel.features).toEqual(dto.features);
      expect(viewModel.limits).toEqual(dto.limits);
      expect(viewModel.stripePriceId).toBe(dto.stripePriceId);
      expect(viewModel.createdAt).toEqual(dto.createdAt);
      expect(viewModel.updatedAt).toEqual(dto.updatedAt);
    });

    it('should create a SubscriptionPlanViewModel from a DTO with null fields', () => {
      const dto: ISubscriptionPlanCreateViewModelDto = {
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
        createdAt: new Date('2024-01-01'),
        updatedAt: new Date('2024-01-02'),
      };

      const viewModel = factory.create(dto);

      expect(viewModel).toBeInstanceOf(SubscriptionPlanViewModel);
      expect(viewModel.id).toBe(dto.id);
      expect(viewModel.name).toBe(dto.name);
      expect(viewModel.slug).toBe(dto.slug);
      expect(viewModel.type).toBe(dto.type);
      expect(viewModel.description).toBeNull();
      expect(viewModel.trialPeriodDays).toBeNull();
      expect(viewModel.features).toBeNull();
      expect(viewModel.limits).toBeNull();
      expect(viewModel.stripePriceId).toBeNull();
    });
  });

  describe('fromPrimitives', () => {
    it('should create a SubscriptionPlanViewModel from primitives with all fields', () => {
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
        createdAt: new Date('2024-01-01T00:00:00Z'),
        updatedAt: new Date('2024-01-02T00:00:00Z'),
      };

      const beforeDate = new Date();
      const viewModel = factory.fromPrimitives(primitives);
      const afterDate = new Date();

      expect(viewModel).toBeInstanceOf(SubscriptionPlanViewModel);
      expect(viewModel.id).toBe(primitives.id);
      expect(viewModel.name).toBe(primitives.name);
      expect(viewModel.slug).toBe(primitives.slug);
      expect(viewModel.type).toBe(primitives.type);
      expect(viewModel.description).toBe(primitives.description);
      expect(viewModel.priceMonthly).toBe(primitives.priceMonthly);
      expect(viewModel.priceYearly).toBe(primitives.priceYearly);
      expect(viewModel.currency).toBe(primitives.currency);
      expect(viewModel.interval).toBe(primitives.interval);
      expect(viewModel.intervalCount).toBe(primitives.intervalCount);
      expect(viewModel.trialPeriodDays).toBe(primitives.trialPeriodDays);
      expect(viewModel.isActive).toBe(primitives.isActive);
      expect(viewModel.features).toEqual(primitives.features);
      expect(viewModel.limits).toEqual(primitives.limits);
      expect(viewModel.stripePriceId).toBe(primitives.stripePriceId);
      expect(viewModel.createdAt.getTime()).toBeGreaterThanOrEqual(
        beforeDate.getTime(),
      );
      expect(viewModel.createdAt.getTime()).toBeLessThanOrEqual(
        afterDate.getTime(),
      );
      expect(viewModel.updatedAt.getTime()).toBeGreaterThanOrEqual(
        beforeDate.getTime(),
      );
      expect(viewModel.updatedAt.getTime()).toBeLessThanOrEqual(
        afterDate.getTime(),
      );
    });

    it('should create a SubscriptionPlanViewModel from primitives with null fields', () => {
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
        createdAt: new Date('2024-01-01T00:00:00Z'),
        updatedAt: new Date('2024-01-02T00:00:00Z'),
      };

      const viewModel = factory.fromPrimitives(primitives);

      expect(viewModel).toBeInstanceOf(SubscriptionPlanViewModel);
      expect(viewModel.id).toBe(primitives.id);
      expect(viewModel.name).toBe(primitives.name);
      expect(viewModel.slug).toBe(primitives.slug);
      expect(viewModel.type).toBe(primitives.type);
      expect(viewModel.description).toBeNull();
      expect(viewModel.trialPeriodDays).toBeNull();
      expect(viewModel.features).toBeNull();
      expect(viewModel.limits).toBeNull();
      expect(viewModel.stripePriceId).toBeNull();
    });

    it('should set createdAt and updatedAt to current date', () => {
      const primitives: SubscriptionPlanPrimitives = {
        id: '123e4567-e89b-12d3-a456-426614174000',
        name: 'Free Plan',
        slug: 'free-plan',
        type: SubscriptionPlanTypeEnum.FREE,
        description: null,
        priceMonthly: 0,
        priceYearly: 0,
        currency: SubscriptionPlanCurrencyEnum.USD,
        interval: SubscriptionPlanIntervalEnum.MONTHLY,
        intervalCount: 1,
        trialPeriodDays: null,
        isActive: true,
        features: null,
        limits: null,
        stripePriceId: null,
        createdAt: new Date('2024-01-01T00:00:00Z'),
        updatedAt: new Date('2024-01-02T00:00:00Z'),
      };

      const viewModel = factory.fromPrimitives(primitives);

      expect(viewModel.createdAt).toBeInstanceOf(Date);
      expect(viewModel.updatedAt).toBeInstanceOf(Date);
      expect(viewModel.createdAt.getTime()).toBe(viewModel.updatedAt.getTime());
    });
  });

  describe('fromAggregate', () => {
    it('should create a SubscriptionPlanViewModel from aggregate with all fields', () => {
      const aggregate = new SubscriptionPlanAggregate(
        {
          id: new SubscriptionPlanUuidValueObject(
            '123e4567-e89b-12d3-a456-426614174000',
          ),
          name: new SubscriptionPlanNameValueObject('Pro Plan'),
          slug: new SubscriptionPlanSlugValueObject('pro-plan'),
          type: new SubscriptionPlanTypeValueObject(
            SubscriptionPlanTypeEnum.PRO,
          ),
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
          createdAt: new DateValueObject(new Date('2024-01-01T00:00:00Z')),
          updatedAt: new DateValueObject(new Date('2024-01-02T00:00:00Z')),
        },
        false,
      );

      const beforeDate = new Date();
      const viewModel = factory.fromAggregate(aggregate);
      const afterDate = new Date();

      expect(viewModel).toBeInstanceOf(SubscriptionPlanViewModel);
      expect(viewModel.id).toBe(aggregate.id.value);
      expect(viewModel.name).toBe(aggregate.name.value);
      expect(viewModel.slug).toBe(aggregate.slug.value);
      expect(viewModel.type).toBe(aggregate.type.value);
      expect(viewModel.description).toBe(aggregate.description?.value);
      expect(viewModel.priceMonthly).toBe(aggregate.priceMonthly.value);
      expect(viewModel.priceYearly).toBe(aggregate.priceYearly.value);
      expect(viewModel.currency).toBe(aggregate.currency.value);
      expect(viewModel.interval).toBe(aggregate.interval.value);
      expect(viewModel.intervalCount).toBe(aggregate.intervalCount.value);
      expect(viewModel.trialPeriodDays).toBe(aggregate.trialPeriodDays?.value);
      expect(viewModel.isActive).toBe(aggregate.isActive.value);
      expect(viewModel.features).toEqual(aggregate.features?.value);
      expect(viewModel.limits).toEqual(aggregate.limits?.value);
      expect(viewModel.stripePriceId).toBe(aggregate.stripePriceId?.value);
      expect(viewModel.createdAt.getTime()).toBeGreaterThanOrEqual(
        beforeDate.getTime(),
      );
      expect(viewModel.createdAt.getTime()).toBeLessThanOrEqual(
        afterDate.getTime(),
      );
      expect(viewModel.updatedAt.getTime()).toBeGreaterThanOrEqual(
        beforeDate.getTime(),
      );
      expect(viewModel.updatedAt.getTime()).toBeLessThanOrEqual(
        afterDate.getTime(),
      );
    });

    it('should create a SubscriptionPlanViewModel from aggregate with null fields', () => {
      const aggregate = new SubscriptionPlanAggregate(
        {
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
          isActive: new SubscriptionPlanIsActiveValueObject(false),
          features: null,
          limits: null,
          stripePriceId: null,
          createdAt: new DateValueObject(new Date('2024-01-01T00:00:00Z')),
          updatedAt: new DateValueObject(new Date('2024-01-02T00:00:00Z')),
        },
        false,
      );

      const viewModel = factory.fromAggregate(aggregate);

      expect(viewModel).toBeInstanceOf(SubscriptionPlanViewModel);
      expect(viewModel.id).toBe(aggregate.id.value);
      expect(viewModel.name).toBe(aggregate.name.value);
      expect(viewModel.slug).toBe(aggregate.slug.value);
      expect(viewModel.type).toBe(aggregate.type.value);
      expect(viewModel.description).toBeNull();
      expect(viewModel.trialPeriodDays).toBeNull();
      expect(viewModel.features).toBeNull();
      expect(viewModel.limits).toBeNull();
      expect(viewModel.stripePriceId).toBeNull();
    });

    it('should set createdAt and updatedAt to current date', () => {
      const aggregate = new SubscriptionPlanAggregate(
        {
          id: new SubscriptionPlanUuidValueObject(
            '123e4567-e89b-12d3-a456-426614174000',
          ),
          name: new SubscriptionPlanNameValueObject('Enterprise Plan'),
          slug: new SubscriptionPlanSlugValueObject('enterprise-plan'),
          type: new SubscriptionPlanTypeValueObject(
            SubscriptionPlanTypeEnum.ENTERPRISE,
          ),
          description: null,
          priceMonthly: new SubscriptionPlanPriceMonthlyValueObject(99.99),
          priceYearly: new SubscriptionPlanPriceYearlyValueObject(999.99),
          currency: new SubscriptionPlanCurrencyValueObject(
            SubscriptionPlanCurrencyEnum.GBP,
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
          createdAt: new DateValueObject(new Date('2024-01-01T00:00:00Z')),
          updatedAt: new DateValueObject(new Date('2024-01-01T00:00:00Z')),
        },
        false,
      );

      const viewModel = factory.fromAggregate(aggregate);

      expect(viewModel.createdAt).toBeInstanceOf(Date);
      expect(viewModel.updatedAt).toBeInstanceOf(Date);
      expect(viewModel.createdAt.getTime()).toBe(viewModel.updatedAt.getTime());
    });

    it('should handle optional fields that are null correctly', () => {
      const aggregate = new SubscriptionPlanAggregate(
        {
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
          createdAt: new DateValueObject(new Date('2024-01-01T00:00:00Z')),
          updatedAt: new DateValueObject(new Date('2024-01-01T00:00:00Z')),
        },
        false,
      );

      const viewModel = factory.fromAggregate(aggregate);

      expect(viewModel.description).toBeNull();
      expect(viewModel.trialPeriodDays).toBeNull();
      expect(viewModel.features).toBeNull();
      expect(viewModel.limits).toBeNull();
      expect(viewModel.stripePriceId).toBeNull();
    });
  });
});
