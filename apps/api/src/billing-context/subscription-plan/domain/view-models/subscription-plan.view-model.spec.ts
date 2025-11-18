import { SubscriptionPlanViewModel } from '@/billing-context/subscription-plan/domain/view-models/subscription-plan.view-model';

describe('SubscriptionPlanViewModel', () => {
  const createBaseViewModel = (): SubscriptionPlanViewModel => {
    return new SubscriptionPlanViewModel({
      id: '123e4567-e89b-12d3-a456-426614174000',
      name: 'Original Name',
      slug: 'original-slug',
      type: 'original-type',
      description: 'Original description',
      priceMonthly: 10.0,
      priceYearly: 100.0,
      currency: 'USD',
      interval: 'month',
      intervalCount: 1,
      trialPeriodDays: 7,
      isActive: true,
      features: { feature1: 'value1' },
      limits: { limit1: 100 },
      stripePriceId: 'price_original123',
      createdAt: new Date('2024-01-01T00:00:00Z'),
      updatedAt: new Date('2024-01-01T00:00:00Z'),
    });
  };

  describe('update', () => {
    describe('name field', () => {
      it('should update name when new value is provided', () => {
        const viewModel = createBaseViewModel();
        const originalName = viewModel.name;

        viewModel.update({ name: 'Updated Name' });

        expect(viewModel.name).toBe('Updated Name');
        expect(viewModel.name).not.toBe(originalName);
      });

      it('should keep original name when undefined is provided', () => {
        const viewModel = createBaseViewModel();
        const originalName = viewModel.name;

        viewModel.update({ name: undefined });

        expect(viewModel.name).toBe(originalName);
      });
    });

    describe('slug field', () => {
      it('should update slug when new value is provided', () => {
        const viewModel = createBaseViewModel();
        const originalSlug = viewModel.slug;

        viewModel.update({ slug: 'updated-slug' });

        expect(viewModel.slug).toBe('updated-slug');
        expect(viewModel.slug).not.toBe(originalSlug);
      });

      it('should keep original slug when undefined is provided', () => {
        const viewModel = createBaseViewModel();
        const originalSlug = viewModel.slug;

        viewModel.update({ slug: undefined });

        expect(viewModel.slug).toBe(originalSlug);
      });
    });

    describe('type field', () => {
      it('should update type when new value is provided', () => {
        const viewModel = createBaseViewModel();
        const originalType = viewModel.type;

        viewModel.update({ type: 'updated-type' });

        expect(viewModel.type).toBe('updated-type');
        expect(viewModel.type).not.toBe(originalType);
      });

      it('should keep original type when undefined is provided', () => {
        const viewModel = createBaseViewModel();
        const originalType = viewModel.type;

        viewModel.update({ type: undefined });

        expect(viewModel.type).toBe(originalType);
      });
    });

    describe('description field', () => {
      it('should update description when new value is provided', () => {
        const viewModel = createBaseViewModel();
        const originalDescription = viewModel.description;

        viewModel.update({ description: 'Updated description' });

        expect(viewModel.description).toBe('Updated description');
        expect(viewModel.description).not.toBe(originalDescription);
      });

      it('should update description to null when null is provided', () => {
        const viewModel = createBaseViewModel();

        viewModel.update({ description: null });

        expect(viewModel.description).toBeNull();
      });

      it('should keep original description when undefined is provided', () => {
        const viewModel = createBaseViewModel();
        const originalDescription = viewModel.description;

        viewModel.update({ description: undefined });

        expect(viewModel.description).toBe(originalDescription);
      });
    });

    describe('priceMonthly field', () => {
      it('should update priceMonthly when new value is provided', () => {
        const viewModel = createBaseViewModel();
        const originalPriceMonthly = viewModel.priceMonthly;

        viewModel.update({ priceMonthly: 20.0 });

        expect(viewModel.priceMonthly).toBe(20.0);
        expect(viewModel.priceMonthly).not.toBe(originalPriceMonthly);
      });

      it('should keep original priceMonthly when undefined is provided', () => {
        const viewModel = createBaseViewModel();
        const originalPriceMonthly = viewModel.priceMonthly;

        viewModel.update({ priceMonthly: undefined });

        expect(viewModel.priceMonthly).toBe(originalPriceMonthly);
      });
    });

    describe('priceYearly field', () => {
      it('should update priceYearly when new value is provided', () => {
        const viewModel = createBaseViewModel();
        const originalPriceYearly = viewModel.priceYearly;

        viewModel.update({ priceYearly: 200.0 });

        expect(viewModel.priceYearly).toBe(200.0);
        expect(viewModel.priceYearly).not.toBe(originalPriceYearly);
      });

      it('should keep original priceYearly when undefined is provided', () => {
        const viewModel = createBaseViewModel();
        const originalPriceYearly = viewModel.priceYearly;

        viewModel.update({ priceYearly: undefined });

        expect(viewModel.priceYearly).toBe(originalPriceYearly);
      });
    });

    describe('currency field', () => {
      it('should update currency when new value is provided', () => {
        const viewModel = createBaseViewModel();
        const originalCurrency = viewModel.currency;

        viewModel.update({ currency: 'EUR' });

        expect(viewModel.currency).toBe('EUR');
        expect(viewModel.currency).not.toBe(originalCurrency);
      });

      it('should keep original currency when undefined is provided', () => {
        const viewModel = createBaseViewModel();
        const originalCurrency = viewModel.currency;

        viewModel.update({ currency: undefined });

        expect(viewModel.currency).toBe(originalCurrency);
      });
    });

    describe('interval field', () => {
      it('should update interval when new value is provided', () => {
        const viewModel = createBaseViewModel();
        const originalInterval = viewModel.interval;

        viewModel.update({ interval: 'year' });

        expect(viewModel.interval).toBe('year');
        expect(viewModel.interval).not.toBe(originalInterval);
      });

      it('should keep original interval when undefined is provided', () => {
        const viewModel = createBaseViewModel();
        const originalInterval = viewModel.interval;

        viewModel.update({ interval: undefined });

        expect(viewModel.interval).toBe(originalInterval);
      });
    });

    describe('intervalCount field', () => {
      it('should update intervalCount when new value is provided', () => {
        const viewModel = createBaseViewModel();
        const originalIntervalCount = viewModel.intervalCount;

        viewModel.update({ intervalCount: 2 });

        expect(viewModel.intervalCount).toBe(2);
        expect(viewModel.intervalCount).not.toBe(originalIntervalCount);
      });

      it('should keep original intervalCount when undefined is provided', () => {
        const viewModel = createBaseViewModel();
        const originalIntervalCount = viewModel.intervalCount;

        viewModel.update({ intervalCount: undefined });

        expect(viewModel.intervalCount).toBe(originalIntervalCount);
      });
    });

    describe('trialPeriodDays field', () => {
      it('should update trialPeriodDays when new value is provided', () => {
        const viewModel = createBaseViewModel();
        const originalTrialPeriodDays = viewModel.trialPeriodDays;

        viewModel.update({ trialPeriodDays: 14 });

        expect(viewModel.trialPeriodDays).toBe(14);
        expect(viewModel.trialPeriodDays).not.toBe(originalTrialPeriodDays);
      });

      it('should update trialPeriodDays to null when null is provided', () => {
        const viewModel = createBaseViewModel();

        viewModel.update({ trialPeriodDays: null });

        expect(viewModel.trialPeriodDays).toBeNull();
      });

      it('should keep original trialPeriodDays when undefined is provided', () => {
        const viewModel = createBaseViewModel();
        const originalTrialPeriodDays = viewModel.trialPeriodDays;

        viewModel.update({ trialPeriodDays: undefined });

        expect(viewModel.trialPeriodDays).toBe(originalTrialPeriodDays);
      });
    });

    describe('isActive field', () => {
      it('should update isActive when new value is provided', () => {
        const viewModel = createBaseViewModel();
        const originalIsActive = viewModel.isActive;

        viewModel.update({ isActive: false });

        expect(viewModel.isActive).toBe(false);
        expect(viewModel.isActive).not.toBe(originalIsActive);
      });

      it('should keep original isActive when undefined is provided', () => {
        const viewModel = createBaseViewModel();
        const originalIsActive = viewModel.isActive;

        viewModel.update({ isActive: undefined });

        expect(viewModel.isActive).toBe(originalIsActive);
      });
    });

    describe('features field', () => {
      it('should update features when new value is provided', () => {
        const viewModel = createBaseViewModel();
        const originalFeatures = viewModel.features;
        const newFeatures = { feature2: 'value2', feature3: 'value3' };

        viewModel.update({ features: newFeatures });

        expect(viewModel.features).toEqual(newFeatures);
        expect(viewModel.features).not.toEqual(originalFeatures);
      });

      it('should update features to null when null is provided', () => {
        const viewModel = createBaseViewModel();

        viewModel.update({ features: null });

        expect(viewModel.features).toBeNull();
      });

      it('should keep original features when undefined is provided', () => {
        const viewModel = createBaseViewModel();
        const originalFeatures = viewModel.features;

        viewModel.update({ features: undefined });

        expect(viewModel.features).toEqual(originalFeatures);
      });
    });

    describe('limits field', () => {
      it('should update limits when new value is provided', () => {
        const viewModel = createBaseViewModel();
        const originalLimits = viewModel.limits;
        const newLimits = { limit2: 200, limit3: 300 };

        viewModel.update({ limits: newLimits });

        expect(viewModel.limits).toEqual(newLimits);
        expect(viewModel.limits).not.toEqual(originalLimits);
      });

      it('should update limits to null when null is provided', () => {
        const viewModel = createBaseViewModel();

        viewModel.update({ limits: null });

        expect(viewModel.limits).toBeNull();
      });

      it('should keep original limits when undefined is provided', () => {
        const viewModel = createBaseViewModel();
        const originalLimits = viewModel.limits;

        viewModel.update({ limits: undefined });

        expect(viewModel.limits).toEqual(originalLimits);
      });
    });

    describe('stripePriceId field', () => {
      it('should update stripePriceId when new value is provided', () => {
        const viewModel = createBaseViewModel();
        const originalStripePriceId = viewModel.stripePriceId;

        viewModel.update({ stripePriceId: 'price_updated456' });

        expect(viewModel.stripePriceId).toBe('price_updated456');
        expect(viewModel.stripePriceId).not.toBe(originalStripePriceId);
      });

      it('should update stripePriceId to null when null is provided', () => {
        const viewModel = createBaseViewModel();

        viewModel.update({ stripePriceId: null });

        expect(viewModel.stripePriceId).toBeNull();
      });

      it('should keep original stripePriceId when undefined is provided', () => {
        const viewModel = createBaseViewModel();
        const originalStripePriceId = viewModel.stripePriceId;

        viewModel.update({ stripePriceId: undefined });

        expect(viewModel.stripePriceId).toBe(originalStripePriceId);
      });
    });

    describe('updatedAt field', () => {
      it('should always update updatedAt when update is called', async () => {
        const viewModel = createBaseViewModel();
        const originalUpdatedAt = viewModel.updatedAt;

        // Wait a bit to ensure date difference
        const beforeUpdate = new Date();
        await new Promise((resolve) => {
          const timeout = setTimeout(resolve, 10);
          timeout.unref();
        });

        viewModel.update({});
        const afterUpdate = viewModel.updatedAt;

        expect(afterUpdate.getTime()).toBeGreaterThanOrEqual(
          beforeUpdate.getTime(),
        );
        expect(afterUpdate.getTime()).toBeGreaterThan(
          originalUpdatedAt.getTime(),
        );
      });

      it('should update updatedAt even when updating other fields', async () => {
        const viewModel = createBaseViewModel();
        const originalUpdatedAt = viewModel.updatedAt.getTime();

        // Wait a bit to ensure date difference
        await new Promise((resolve) => {
          const timeout = setTimeout(resolve, 10);
          timeout.unref();
        });

        viewModel.update({ name: 'New Name' });

        expect(viewModel.updatedAt.getTime()).toBeGreaterThan(
          originalUpdatedAt,
        );
      });
    });

    describe('multiple fields update', () => {
      it('should update multiple fields at once', () => {
        const viewModel = createBaseViewModel();

        viewModel.update({
          name: 'Multi Updated Name',
          slug: 'multi-updated-slug',
          priceMonthly: 30.0,
          isActive: false,
        });

        expect(viewModel.name).toBe('Multi Updated Name');
        expect(viewModel.slug).toBe('multi-updated-slug');
        expect(viewModel.priceMonthly).toBe(30.0);
        expect(viewModel.isActive).toBe(false);
        // Other fields should remain unchanged
        expect(viewModel.type).toBe('original-type');
        expect(viewModel.description).toBe('Original description');
      });

      it('should update some fields and keep others unchanged', () => {
        const viewModel = createBaseViewModel();
        const originalType = viewModel.type;
        const originalCurrency = viewModel.currency;

        viewModel.update({
          name: 'Partial Update',
          description: null,
        });

        expect(viewModel.name).toBe('Partial Update');
        expect(viewModel.description).toBeNull();
        expect(viewModel.type).toBe(originalType);
        expect(viewModel.currency).toBe(originalCurrency);
      });
    });
  });
});
