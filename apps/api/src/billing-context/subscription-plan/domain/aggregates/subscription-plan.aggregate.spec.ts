import { SubscriptionPlanAggregate } from '@/billing-context/subscription-plan/domain/aggregates/subscription-plan.aggregate';
import { ISubscriptionPlanCreateDto } from '@/billing-context/subscription-plan/domain/dtos/entities/subscription-plan-create/subscription-plan-create.dto';
import { ISubscriptionPlanUpdateDto } from '@/billing-context/subscription-plan/domain/dtos/entities/subscription-plan-update/subscription-plan-update.dto';
import { SubscriptionPlanCurrencyEnum } from '@/billing-context/subscription-plan/domain/enum/subscription-plan-currency.enum';
import { SubscriptionPlanIntervalEnum } from '@/billing-context/subscription-plan/domain/enum/subscription-plan-interval.enum';
import { SubscriptionPlanTypeEnum } from '@/billing-context/subscription-plan/domain/enum/subscription-plan-type.enum';
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
import { SubscriptionPlanDeletedEvent } from '@/shared/domain/events/billing-context/subscription-plan/subscription-plan-deleted/subscription-plan-deleted.event';
import { SubscriptionPlanUpdatedEvent } from '@/shared/domain/events/billing-context/subscription-plan/subscription-plan-updated/subscription-plan-updated.event';
import { DateValueObject } from '@/shared/domain/value-objects/date/date.vo';
import { SubscriptionPlanUuidValueObject } from '@/shared/domain/value-objects/identifiers/subscription-plan/subscription-plan-uuid.vo';

describe('SubscriptionPlanAggregate', () => {
  const createBaseAggregate = (
    generateEvent: boolean = false,
  ): SubscriptionPlanAggregate => {
    const dto: ISubscriptionPlanCreateDto = {
      id: new SubscriptionPlanUuidValueObject(
        '123e4567-e89b-12d3-a456-426614174000',
      ),
      name: new SubscriptionPlanNameValueObject('Original Name'),
      slug: new SubscriptionPlanSlugValueObject('original-slug'),
      type: new SubscriptionPlanTypeValueObject(SubscriptionPlanTypeEnum.BASIC),
      description: new SubscriptionPlanDescriptionValueObject(
        'Original description',
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
      features: new SubscriptionPlanFeaturesValueObject({ feature1: 'value1' }),
      limits: new SubscriptionPlanLimitsValueObject({ limit1: 100 }),
      stripePriceId: new SubscriptionPlanStripePriceIdValueObject(
        'price_original123',
      ),
      createdAt: new DateValueObject(new Date()),
      updatedAt: new DateValueObject(new Date()),
    };

    return new SubscriptionPlanAggregate(dto, generateEvent);
  };

  describe('update', () => {
    describe('name field', () => {
      it('should update name when new value is provided', () => {
        const aggregate = createBaseAggregate();
        const originalName = aggregate.name.value;
        const newName = new SubscriptionPlanNameValueObject('Updated Name');

        aggregate.update({ name: newName }, false);

        expect(aggregate.name.value).toBe('Updated Name');
        expect(aggregate.name.value).not.toBe(originalName);
      });

      it('should keep original name when undefined is provided', () => {
        const aggregate = createBaseAggregate();
        const originalName = aggregate.name.value;

        aggregate.update({ name: undefined }, false);

        expect(aggregate.name.value).toBe(originalName);
      });

      it('should generate SubscriptionPlanUpdatedEvent when updating name with generateEvent true', () => {
        const aggregate = createBaseAggregate();
        aggregate.commit(); // Clear creation event
        const newName = new SubscriptionPlanNameValueObject('Updated Name');

        aggregate.update({ name: newName }, true);

        const events = aggregate.getUncommittedEvents();
        expect(events).toHaveLength(1);
        expect(events[0]).toBeInstanceOf(SubscriptionPlanUpdatedEvent);

        const event = events[0] as SubscriptionPlanUpdatedEvent;
        expect(event.aggregateId).toBe(aggregate.id.value);
        expect(event.aggregateType).toBe(SubscriptionPlanAggregate.name);
        expect(event.eventType).toBe(SubscriptionPlanUpdatedEvent.name);
        expect(event.data.name).toBe('Updated Name');
      });
    });

    describe('slug field', () => {
      it('should update slug when new value is provided', () => {
        const aggregate = createBaseAggregate();
        const originalSlug = aggregate.slug.value;
        const newSlug = new SubscriptionPlanSlugValueObject('updated-slug');

        aggregate.update({ slug: newSlug }, false);

        expect(aggregate.slug.value).toBe('updated-slug');
        expect(aggregate.slug.value).not.toBe(originalSlug);
      });

      it('should keep original slug when undefined is provided', () => {
        const aggregate = createBaseAggregate();
        const originalSlug = aggregate.slug.value;

        aggregate.update({ slug: undefined }, false);

        expect(aggregate.slug.value).toBe(originalSlug);
      });

      it('should generate SubscriptionPlanUpdatedEvent when updating slug with generateEvent true', () => {
        const aggregate = createBaseAggregate();
        aggregate.commit();
        const newSlug = new SubscriptionPlanSlugValueObject('updated-slug');

        aggregate.update({ slug: newSlug }, true);

        const events = aggregate.getUncommittedEvents();
        expect(events).toHaveLength(1);
        expect(events[0]).toBeInstanceOf(SubscriptionPlanUpdatedEvent);
        const event = events[0] as SubscriptionPlanUpdatedEvent;
        expect(event.data.slug).toBe('updated-slug');
      });
    });

    describe('type field', () => {
      it('should update type when new value is provided', () => {
        const aggregate = createBaseAggregate();
        const originalType = aggregate.type.value;
        const newType = new SubscriptionPlanTypeValueObject(
          SubscriptionPlanTypeEnum.PRO,
        );

        aggregate.update({ type: newType }, false);

        expect(aggregate.type.value).toBe(SubscriptionPlanTypeEnum.PRO);
        expect(aggregate.type.value).not.toBe(originalType);
      });

      it('should keep original type when undefined is provided', () => {
        const aggregate = createBaseAggregate();
        const originalType = aggregate.type.value;

        aggregate.update({ type: undefined }, false);

        expect(aggregate.type.value).toBe(originalType);
      });

      it('should generate SubscriptionPlanUpdatedEvent when updating type with generateEvent true', () => {
        const aggregate = createBaseAggregate();
        aggregate.commit();
        const newType = new SubscriptionPlanTypeValueObject(
          SubscriptionPlanTypeEnum.PRO,
        );

        aggregate.update({ type: newType }, true);

        const events = aggregate.getUncommittedEvents();
        expect(events).toHaveLength(1);
        const event = events[0] as SubscriptionPlanUpdatedEvent;
        expect(event.data.type).toBe(SubscriptionPlanTypeEnum.PRO);
      });
    });

    describe('description field', () => {
      it('should update description when new value is provided', () => {
        const aggregate = createBaseAggregate();
        const originalDescription = aggregate.description?.value;
        const newDescription = new SubscriptionPlanDescriptionValueObject(
          'Updated description',
        );

        aggregate.update({ description: newDescription }, false);

        expect(aggregate.description?.value).toBe('Updated description');
        expect(aggregate.description?.value).not.toBe(originalDescription);
      });

      it('should update description to null when null is provided', () => {
        const aggregate = createBaseAggregate();

        aggregate.update({ description: null }, false);

        expect(aggregate.description).toBeNull();
      });

      it('should keep original description when undefined is provided', () => {
        const aggregate = createBaseAggregate();
        const originalDescription = aggregate.description?.value;

        aggregate.update({ description: undefined }, false);

        expect(aggregate.description?.value).toBe(originalDescription);
      });

      it('should generate SubscriptionPlanUpdatedEvent when updating description with generateEvent true', () => {
        const aggregate = createBaseAggregate();
        aggregate.commit();
        const newDescription = new SubscriptionPlanDescriptionValueObject(
          'Updated description',
        );

        aggregate.update({ description: newDescription }, true);

        const events = aggregate.getUncommittedEvents();
        expect(events).toHaveLength(1);
        const event = events[0] as SubscriptionPlanUpdatedEvent;
        expect(event.data.description).toBe('Updated description');
      });

      it('should include null description in event when set to null', () => {
        const aggregate = createBaseAggregate();
        aggregate.commit();

        aggregate.update({ description: null }, true);

        const events = aggregate.getUncommittedEvents();
        const event = events[0] as SubscriptionPlanUpdatedEvent;
        expect(event.data.description).toBeNull();
      });
    });

    describe('priceMonthly field', () => {
      it('should update priceMonthly when new value is provided', () => {
        const aggregate = createBaseAggregate();
        const originalPriceMonthly = aggregate.priceMonthly.value;
        const newPriceMonthly = new SubscriptionPlanPriceMonthlyValueObject(
          20.0,
        );

        aggregate.update({ priceMonthly: newPriceMonthly }, false);

        expect(aggregate.priceMonthly.value).toBe(20.0);
        expect(aggregate.priceMonthly.value).not.toBe(originalPriceMonthly);
      });

      it('should keep original priceMonthly when undefined is provided', () => {
        const aggregate = createBaseAggregate();
        const originalPriceMonthly = aggregate.priceMonthly.value;

        aggregate.update({ priceMonthly: undefined }, false);

        expect(aggregate.priceMonthly.value).toBe(originalPriceMonthly);
      });

      it('should generate SubscriptionPlanUpdatedEvent when updating priceMonthly with generateEvent true', () => {
        const aggregate = createBaseAggregate();
        aggregate.commit();
        const newPriceMonthly = new SubscriptionPlanPriceMonthlyValueObject(
          20.0,
        );

        aggregate.update({ priceMonthly: newPriceMonthly }, true);

        const events = aggregate.getUncommittedEvents();
        expect(events).toHaveLength(1);
        const event = events[0] as SubscriptionPlanUpdatedEvent;
        expect(event.data.priceMonthly).toBe(20.0);
      });
    });

    describe('priceYearly field', () => {
      it('should update priceYearly when new value is provided', () => {
        const aggregate = createBaseAggregate();
        const originalPriceYearly = aggregate.priceYearly.value;
        const newPriceYearly = new SubscriptionPlanPriceYearlyValueObject(
          200.0,
        );

        aggregate.update({ priceYearly: newPriceYearly }, false);

        expect(aggregate.priceYearly.value).toBe(200.0);
        expect(aggregate.priceYearly.value).not.toBe(originalPriceYearly);
      });

      it('should keep original priceYearly when undefined is provided', () => {
        const aggregate = createBaseAggregate();
        const originalPriceYearly = aggregate.priceYearly.value;

        aggregate.update({ priceYearly: undefined }, false);

        expect(aggregate.priceYearly.value).toBe(originalPriceYearly);
      });

      it('should generate SubscriptionPlanUpdatedEvent when updating priceYearly with generateEvent true', () => {
        const aggregate = createBaseAggregate();
        aggregate.commit();
        const newPriceYearly = new SubscriptionPlanPriceYearlyValueObject(
          200.0,
        );

        aggregate.update({ priceYearly: newPriceYearly }, true);

        const events = aggregate.getUncommittedEvents();
        expect(events).toHaveLength(1);
        const event = events[0] as SubscriptionPlanUpdatedEvent;
        expect(event.data.priceYearly).toBe(200.0);
      });
    });

    describe('currency field', () => {
      it('should update currency when new value is provided', () => {
        const aggregate = createBaseAggregate();
        const originalCurrency = aggregate.currency.value;
        const newCurrency = new SubscriptionPlanCurrencyValueObject(
          SubscriptionPlanCurrencyEnum.EUR,
        );

        aggregate.update({ currency: newCurrency }, false);

        expect(aggregate.currency.value).toBe(SubscriptionPlanCurrencyEnum.EUR);
        expect(aggregate.currency.value).not.toBe(originalCurrency);
      });

      it('should keep original currency when undefined is provided', () => {
        const aggregate = createBaseAggregate();
        const originalCurrency = aggregate.currency.value;

        aggregate.update({ currency: undefined }, false);

        expect(aggregate.currency.value).toBe(originalCurrency);
      });

      it('should generate SubscriptionPlanUpdatedEvent when updating currency with generateEvent true', () => {
        const aggregate = createBaseAggregate();
        aggregate.commit();
        const newCurrency = new SubscriptionPlanCurrencyValueObject(
          SubscriptionPlanCurrencyEnum.EUR,
        );

        aggregate.update({ currency: newCurrency }, true);

        const events = aggregate.getUncommittedEvents();
        expect(events).toHaveLength(1);
        const event = events[0] as SubscriptionPlanUpdatedEvent;
        expect(event.data.currency).toBe(SubscriptionPlanCurrencyEnum.EUR);
      });
    });

    describe('interval field', () => {
      it('should update interval when new value is provided', () => {
        const aggregate = createBaseAggregate();
        const originalInterval = aggregate.interval.value;
        const newInterval = new SubscriptionPlanIntervalValueObject(
          SubscriptionPlanIntervalEnum.YEARLY,
        );

        aggregate.update({ interval: newInterval }, false);

        expect(aggregate.interval.value).toBe(
          SubscriptionPlanIntervalEnum.YEARLY,
        );
        expect(aggregate.interval.value).not.toBe(originalInterval);
      });

      it('should keep original interval when undefined is provided', () => {
        const aggregate = createBaseAggregate();
        const originalInterval = aggregate.interval.value;

        aggregate.update({ interval: undefined }, false);

        expect(aggregate.interval.value).toBe(originalInterval);
      });

      it('should generate SubscriptionPlanUpdatedEvent when updating interval with generateEvent true', () => {
        const aggregate = createBaseAggregate();
        aggregate.commit();
        const newInterval = new SubscriptionPlanIntervalValueObject(
          SubscriptionPlanIntervalEnum.YEARLY,
        );

        aggregate.update({ interval: newInterval }, true);

        const events = aggregate.getUncommittedEvents();
        expect(events).toHaveLength(1);
        const event = events[0] as SubscriptionPlanUpdatedEvent;
        expect(event.data.interval).toBe(SubscriptionPlanIntervalEnum.YEARLY);
      });
    });

    describe('intervalCount field', () => {
      it('should update intervalCount when new value is provided', () => {
        const aggregate = createBaseAggregate();
        const originalIntervalCount = aggregate.intervalCount.value;
        const newIntervalCount = new SubscriptionPlanIntervalCountValueObject(
          2,
        );

        aggregate.update({ intervalCount: newIntervalCount }, false);

        expect(aggregate.intervalCount.value).toBe(2);
        expect(aggregate.intervalCount.value).not.toBe(originalIntervalCount);
      });

      it('should keep original intervalCount when undefined is provided', () => {
        const aggregate = createBaseAggregate();
        const originalIntervalCount = aggregate.intervalCount.value;

        aggregate.update({ intervalCount: undefined }, false);

        expect(aggregate.intervalCount.value).toBe(originalIntervalCount);
      });

      it('should generate SubscriptionPlanUpdatedEvent when updating intervalCount with generateEvent true', () => {
        const aggregate = createBaseAggregate();
        aggregate.commit();
        const newIntervalCount = new SubscriptionPlanIntervalCountValueObject(
          2,
        );

        aggregate.update({ intervalCount: newIntervalCount }, true);

        const events = aggregate.getUncommittedEvents();
        expect(events).toHaveLength(1);
        const event = events[0] as SubscriptionPlanUpdatedEvent;
        expect(event.data.intervalCount).toBe(2);
      });
    });

    describe('trialPeriodDays field', () => {
      it('should update trialPeriodDays when new value is provided', () => {
        const aggregate = createBaseAggregate();
        const originalTrialPeriodDays = aggregate.trialPeriodDays?.value;
        const newTrialPeriodDays =
          new SubscriptionPlanTrialPeriodDaysValueObject(14);

        aggregate.update({ trialPeriodDays: newTrialPeriodDays }, false);

        expect(aggregate.trialPeriodDays?.value).toBe(14);
        expect(aggregate.trialPeriodDays?.value).not.toBe(
          originalTrialPeriodDays,
        );
      });

      it('should update trialPeriodDays to null when null is provided', () => {
        const aggregate = createBaseAggregate();

        aggregate.update({ trialPeriodDays: null }, false);

        expect(aggregate.trialPeriodDays).toBeNull();
      });

      it('should keep original trialPeriodDays when undefined is provided', () => {
        const aggregate = createBaseAggregate();
        const originalTrialPeriodDays = aggregate.trialPeriodDays?.value;

        aggregate.update({ trialPeriodDays: undefined }, false);

        expect(aggregate.trialPeriodDays?.value).toBe(originalTrialPeriodDays);
      });

      it('should generate SubscriptionPlanUpdatedEvent when updating trialPeriodDays with generateEvent true', () => {
        const aggregate = createBaseAggregate();
        aggregate.commit();
        const newTrialPeriodDays =
          new SubscriptionPlanTrialPeriodDaysValueObject(14);

        aggregate.update({ trialPeriodDays: newTrialPeriodDays }, true);

        const events = aggregate.getUncommittedEvents();
        expect(events).toHaveLength(1);
        const event = events[0] as SubscriptionPlanUpdatedEvent;
        expect(event.data.trialPeriodDays).toBe(14);
      });

      it('should include null trialPeriodDays in event when set to null', () => {
        const aggregate = createBaseAggregate();
        aggregate.commit();

        aggregate.update({ trialPeriodDays: null }, true);

        const events = aggregate.getUncommittedEvents();
        const event = events[0] as SubscriptionPlanUpdatedEvent;
        expect(event.data.trialPeriodDays).toBeNull();
      });
    });

    describe('isActive field', () => {
      it('should update isActive when new value is provided', () => {
        const aggregate = createBaseAggregate();
        const originalIsActive = aggregate.isActive.value;
        const newIsActive = new SubscriptionPlanIsActiveValueObject(false);

        aggregate.update({ isActive: newIsActive }, false);

        expect(aggregate.isActive.value).toBe(false);
        expect(aggregate.isActive.value).not.toBe(originalIsActive);
      });

      it('should keep original isActive when undefined is provided', () => {
        const aggregate = createBaseAggregate();
        const originalIsActive = aggregate.isActive.value;

        aggregate.update({ isActive: undefined }, false);

        expect(aggregate.isActive.value).toBe(originalIsActive);
      });

      it('should generate SubscriptionPlanUpdatedEvent when updating isActive with generateEvent true', () => {
        const aggregate = createBaseAggregate();
        aggregate.commit();
        const newIsActive = new SubscriptionPlanIsActiveValueObject(false);

        aggregate.update({ isActive: newIsActive }, true);

        const events = aggregate.getUncommittedEvents();
        expect(events).toHaveLength(1);
        const event = events[0] as SubscriptionPlanUpdatedEvent;
        expect(event.data.isActive).toBe(false);
      });
    });

    describe('features field', () => {
      it('should update features when new value is provided', () => {
        const aggregate = createBaseAggregate();
        const originalFeatures = aggregate.features?.value;
        const newFeatures = new SubscriptionPlanFeaturesValueObject({
          feature2: 'value2',
          feature3: 'value3',
        });

        aggregate.update({ features: newFeatures }, false);

        expect(aggregate.features?.value).toEqual({
          feature2: 'value2',
          feature3: 'value3',
        });
        expect(aggregate.features?.value).not.toEqual(originalFeatures);
      });

      it('should update features to null when null is provided', () => {
        const aggregate = createBaseAggregate();

        aggregate.update({ features: null }, false);

        expect(aggregate.features).toBeNull();
      });

      it('should keep original features when undefined is provided', () => {
        const aggregate = createBaseAggregate();
        const originalFeatures = aggregate.features?.value;

        aggregate.update({ features: undefined }, false);

        expect(aggregate.features?.value).toEqual(originalFeatures);
      });

      it('should generate SubscriptionPlanUpdatedEvent when updating features with generateEvent true', () => {
        const aggregate = createBaseAggregate();
        aggregate.commit();
        const newFeatures = new SubscriptionPlanFeaturesValueObject({
          feature2: 'value2',
        });

        aggregate.update({ features: newFeatures }, true);

        const events = aggregate.getUncommittedEvents();
        expect(events).toHaveLength(1);
        const event = events[0] as SubscriptionPlanUpdatedEvent;
        expect(event.data.features).toEqual({ feature2: 'value2' });
      });

      it('should include null features in event when set to null', () => {
        const aggregate = createBaseAggregate();
        aggregate.commit();

        aggregate.update({ features: null }, true);

        const events = aggregate.getUncommittedEvents();
        const event = events[0] as SubscriptionPlanUpdatedEvent;
        expect(event.data.features).toBeNull();
      });
    });

    describe('limits field', () => {
      it('should update limits when new value is provided', () => {
        const aggregate = createBaseAggregate();
        const originalLimits = aggregate.limits?.value;
        const newLimits = new SubscriptionPlanLimitsValueObject({
          limit2: 200,
          limit3: 300,
        });

        aggregate.update({ limits: newLimits }, false);

        expect(aggregate.limits?.value).toEqual({ limit2: 200, limit3: 300 });
        expect(aggregate.limits?.value).not.toEqual(originalLimits);
      });

      it('should update limits to null when null is provided', () => {
        const aggregate = createBaseAggregate();

        aggregate.update({ limits: null }, false);

        expect(aggregate.limits).toBeNull();
      });

      it('should keep original limits when undefined is provided', () => {
        const aggregate = createBaseAggregate();
        const originalLimits = aggregate.limits?.value;

        aggregate.update({ limits: undefined }, false);

        expect(aggregate.limits?.value).toEqual(originalLimits);
      });

      it('should generate SubscriptionPlanUpdatedEvent when updating limits with generateEvent true', () => {
        const aggregate = createBaseAggregate();
        aggregate.commit();
        const newLimits = new SubscriptionPlanLimitsValueObject({
          limit2: 200,
        });

        aggregate.update({ limits: newLimits }, true);

        const events = aggregate.getUncommittedEvents();
        expect(events).toHaveLength(1);
        const event = events[0] as SubscriptionPlanUpdatedEvent;
        expect(event.data.limits).toEqual({ limit2: 200 });
      });

      it('should include null limits in event when set to null', () => {
        const aggregate = createBaseAggregate();
        aggregate.commit();

        aggregate.update({ limits: null }, true);

        const events = aggregate.getUncommittedEvents();
        const event = events[0] as SubscriptionPlanUpdatedEvent;
        expect(event.data.limits).toBeNull();
      });
    });

    describe('stripePriceId field', () => {
      it('should update stripePriceId when new value is provided', () => {
        const aggregate = createBaseAggregate();
        const originalStripePriceId = aggregate.stripePriceId?.value;
        const newStripePriceId = new SubscriptionPlanStripePriceIdValueObject(
          'price_updated456',
        );

        aggregate.update({ stripePriceId: newStripePriceId }, false);

        expect(aggregate.stripePriceId?.value).toBe('price_updated456');
        expect(aggregate.stripePriceId?.value).not.toBe(originalStripePriceId);
      });

      it('should update stripePriceId to null when null is provided', () => {
        const aggregate = createBaseAggregate();

        aggregate.update({ stripePriceId: null }, false);

        expect(aggregate.stripePriceId).toBeNull();
      });

      it('should keep original stripePriceId when undefined is provided', () => {
        const aggregate = createBaseAggregate();
        const originalStripePriceId = aggregate.stripePriceId?.value;

        aggregate.update({ stripePriceId: undefined }, false);

        expect(aggregate.stripePriceId?.value).toBe(originalStripePriceId);
      });

      it('should generate SubscriptionPlanUpdatedEvent when updating stripePriceId with generateEvent true', () => {
        const aggregate = createBaseAggregate();
        aggregate.commit();
        const newStripePriceId = new SubscriptionPlanStripePriceIdValueObject(
          'price_updated456',
        );

        aggregate.update({ stripePriceId: newStripePriceId }, true);

        const events = aggregate.getUncommittedEvents();
        expect(events).toHaveLength(1);
        const event = events[0] as SubscriptionPlanUpdatedEvent;
        expect(event.data.stripePriceId).toBe('price_updated456');
      });

      it('should include null stripePriceId in event when set to null', () => {
        const aggregate = createBaseAggregate();
        aggregate.commit();

        aggregate.update({ stripePriceId: null }, true);

        const events = aggregate.getUncommittedEvents();
        const event = events[0] as SubscriptionPlanUpdatedEvent;
        expect(event.data.stripePriceId).toBeNull();
      });
    });

    describe('event generation', () => {
      it('should generate SubscriptionPlanUpdatedEvent by default when generateEvent is not specified', () => {
        const aggregate = createBaseAggregate();
        aggregate.commit();
        const newName = new SubscriptionPlanNameValueObject('Updated Name');

        aggregate.update({ name: newName });

        const events = aggregate.getUncommittedEvents();
        expect(events).toHaveLength(1);
        expect(events[0]).toBeInstanceOf(SubscriptionPlanUpdatedEvent);
      });

      it('should not generate event when generateEvent is false', () => {
        const aggregate = createBaseAggregate();
        aggregate.commit();
        const newName = new SubscriptionPlanNameValueObject('Updated Name');

        aggregate.update({ name: newName }, false);

        const events = aggregate.getUncommittedEvents();
        expect(events).toHaveLength(0);
      });

      it('should include all updated fields in event data', () => {
        const aggregate = createBaseAggregate();
        aggregate.commit();
        const updateDto: ISubscriptionPlanUpdateDto = {
          name: new SubscriptionPlanNameValueObject('Multi Updated Name'),
          slug: new SubscriptionPlanSlugValueObject('multi-updated-slug'),
          priceMonthly: new SubscriptionPlanPriceMonthlyValueObject(30.0),
          isActive: new SubscriptionPlanIsActiveValueObject(false),
        };

        aggregate.update(updateDto, true);

        const events = aggregate.getUncommittedEvents();
        const event = events[0] as SubscriptionPlanUpdatedEvent;
        expect(event.data.name).toBe('Multi Updated Name');
        expect(event.data.slug).toBe('multi-updated-slug');
        expect(event.data.priceMonthly).toBe(30.0);
        expect(event.data.isActive).toBe(false);
        // Should include all fields from toPrimitives()
        expect(event.aggregateId).toBe(aggregate.id.value);
        expect(event.data.type).toBeDefined();
        expect(event.data.currency).toBeDefined();
      });

      it('should include correct event metadata', () => {
        const aggregate = createBaseAggregate();
        aggregate.commit();
        const newName = new SubscriptionPlanNameValueObject('Updated Name');

        aggregate.update({ name: newName }, true);

        const events = aggregate.getUncommittedEvents();
        const event = events[0] as SubscriptionPlanUpdatedEvent;
        expect(event.aggregateId).toBe(aggregate.id.value);
        expect(event.aggregateType).toBe(SubscriptionPlanAggregate.name);
        expect(event.eventType).toBe(SubscriptionPlanUpdatedEvent.name);
      });
    });

    describe('multiple fields update', () => {
      it('should update multiple fields at once', () => {
        const aggregate = createBaseAggregate();
        const updateDto: ISubscriptionPlanUpdateDto = {
          name: new SubscriptionPlanNameValueObject('Multi Updated Name'),
          slug: new SubscriptionPlanSlugValueObject('multi-updated-slug'),
          priceMonthly: new SubscriptionPlanPriceMonthlyValueObject(30.0),
          isActive: new SubscriptionPlanIsActiveValueObject(false),
        };

        aggregate.update(updateDto, false);

        expect(aggregate.name.value).toBe('Multi Updated Name');
        expect(aggregate.slug.value).toBe('multi-updated-slug');
        expect(aggregate.priceMonthly.value).toBe(30.0);
        expect(aggregate.isActive.value).toBe(false);
        // Other fields should remain unchanged
        expect(aggregate.type.value).toBe(SubscriptionPlanTypeEnum.BASIC);
        expect(aggregate.description?.value).toBe('Original description');
      });

      it('should update some fields and keep others unchanged', () => {
        const aggregate = createBaseAggregate();
        const originalType = aggregate.type.value;
        const originalCurrency = aggregate.currency.value;

        aggregate.update(
          {
            name: new SubscriptionPlanNameValueObject('Partial Update'),
            description: null,
          },
          false,
        );

        expect(aggregate.name.value).toBe('Partial Update');
        expect(aggregate.description).toBeNull();
        expect(aggregate.type.value).toBe(originalType);
        expect(aggregate.currency.value).toBe(originalCurrency);
      });

      it('should generate single event when updating multiple fields', () => {
        const aggregate = createBaseAggregate();
        aggregate.commit();

        aggregate.update(
          {
            name: new SubscriptionPlanNameValueObject('Multi Updated'),
            slug: new SubscriptionPlanSlugValueObject('multi-slug'),
            priceMonthly: new SubscriptionPlanPriceMonthlyValueObject(50.0),
          },
          true,
        );

        const events = aggregate.getUncommittedEvents();
        expect(events).toHaveLength(1);
        const event = events[0] as SubscriptionPlanUpdatedEvent;
        expect(event.data.name).toBe('Multi Updated');
        expect(event.data.slug).toBe('multi-slug');
        expect(event.data.priceMonthly).toBe(50.0);
      });
    });
  });

  describe('delete', () => {
    it('should set isActive to false when delete is called', () => {
      const aggregate = createBaseAggregate();
      const originalIsActive = aggregate.isActive.value;

      aggregate.delete(false);

      expect(aggregate.isActive.value).toBe(false);
      expect(aggregate.isActive.value).not.toBe(originalIsActive);
    });

    it('should generate SubscriptionPlanDeletedEvent by default when delete is called', () => {
      const aggregate = createBaseAggregate();
      aggregate.commit(); // Clear creation event

      aggregate.delete();

      const events = aggregate.getUncommittedEvents();
      expect(events).toHaveLength(1);
      expect(events[0]).toBeInstanceOf(SubscriptionPlanDeletedEvent);
    });

    it('should generate SubscriptionPlanDeletedEvent when generateEvent is true', () => {
      const aggregate = createBaseAggregate();
      aggregate.commit(); // Clear creation event

      aggregate.delete(true);

      const events = aggregate.getUncommittedEvents();
      expect(events).toHaveLength(1);
      expect(events[0]).toBeInstanceOf(SubscriptionPlanDeletedEvent);

      const event = events[0] as SubscriptionPlanDeletedEvent;
      expect(event.aggregateId).toBe(aggregate.id.value);
      expect(event.aggregateType).toBe(SubscriptionPlanAggregate.name);
      expect(event.eventType).toBe(SubscriptionPlanDeletedEvent.name);
    });

    it('should not generate event when generateEvent is false', () => {
      const aggregate = createBaseAggregate();
      aggregate.commit(); // Clear creation event

      aggregate.delete(false);

      const events = aggregate.getUncommittedEvents();
      expect(events).toHaveLength(0);
    });

    it('should include all aggregate primitives in event data', () => {
      const aggregate = createBaseAggregate();
      aggregate.commit(); // Clear creation event

      aggregate.delete(true);

      const events = aggregate.getUncommittedEvents();
      const event = events[0] as SubscriptionPlanDeletedEvent;
      const primitives = aggregate.toPrimitives();

      expect(event.data.id).toBe(primitives.id);
      expect(event.data.name).toBe(primitives.name);
      expect(event.data.slug).toBe(primitives.slug);
      expect(event.data.type).toBe(primitives.type);
      expect(event.data.description).toBe(primitives.description);
      expect(event.data.priceMonthly).toBe(primitives.priceMonthly);
      expect(event.data.priceYearly).toBe(primitives.priceYearly);
      expect(event.data.currency).toBe(primitives.currency);
      expect(event.data.interval).toBe(primitives.interval);
      expect(event.data.intervalCount).toBe(primitives.intervalCount);
      expect(event.data.trialPeriodDays).toBe(primitives.trialPeriodDays);
      expect(event.data.isActive).toBe(primitives.isActive);
      expect(event.data.features).toEqual(primitives.features);
      expect(event.data.limits).toEqual(primitives.limits);
      expect(event.data.stripePriceId).toBe(primitives.stripePriceId);
    });

    it('should include correct event metadata', () => {
      const aggregate = createBaseAggregate();
      aggregate.commit(); // Clear creation event

      aggregate.delete(true);

      const events = aggregate.getUncommittedEvents();
      const event = events[0] as SubscriptionPlanDeletedEvent;
      expect(event.aggregateId).toBe(aggregate.id.value);
      expect(event.aggregateType).toBe(SubscriptionPlanAggregate.name);
      expect(event.eventType).toBe(SubscriptionPlanDeletedEvent.name);
    });

    it('should set isActive to false even when no event is generated', () => {
      const aggregate = createBaseAggregate();
      aggregate.commit(); // Clear creation event

      aggregate.delete(false);

      expect(aggregate.isActive.value).toBe(false);
      expect(aggregate.getUncommittedEvents()).toHaveLength(0);
    });

    it('should include updated isActive value (false) in event data', () => {
      const aggregate = createBaseAggregate();
      expect(aggregate.isActive.value).toBe(true);
      aggregate.commit(); // Clear creation event

      aggregate.delete(true);

      const events = aggregate.getUncommittedEvents();
      const event = events[0] as SubscriptionPlanDeletedEvent;
      expect(event.data.isActive).toBe(false);
      expect(aggregate.isActive.value).toBe(false);
    });
  });
});
