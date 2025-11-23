import { SubscriptionPlanCreatedEventHandler } from '@/billing-context/subscription-plan/application/event-handlers/subscription-plan-created/subscription-plan-created.event-handler';
import { SubscriptionPlanCurrencyEnum } from '@/billing-context/subscription-plan/domain/enum/subscription-plan-currency.enum';
import { SubscriptionPlanIntervalEnum } from '@/billing-context/subscription-plan/domain/enum/subscription-plan-interval.enum';
import { SubscriptionPlanTypeEnum } from '@/billing-context/subscription-plan/domain/enum/subscription-plan-type.enum';
import { SubscriptionPlanViewModelFactory } from '@/billing-context/subscription-plan/domain/factories/subscription-plan-view-model/subscription-plan-view-model.factory';
import { SubscriptionPlanPrimitives } from '@/billing-context/subscription-plan/domain/primitives/subscription-plan.primitives';
import { SubscriptionPlanReadRepository } from '@/billing-context/subscription-plan/domain/repositories/subscription-plan-read/subscription-plan-read.repository';
import { SubscriptionPlanViewModel } from '@/billing-context/subscription-plan/domain/view-models/subscription-plan.view-model';
import { SubscriptionPlanCreatedEvent } from '@/shared/domain/events/billing-context/subscription-plan/subscription-plan-created/subscription-plan-created.event';

describe('SubscriptionPlanCreatedEventHandler', () => {
  let handler: SubscriptionPlanCreatedEventHandler;
  let mockSubscriptionPlanReadRepository: jest.Mocked<SubscriptionPlanReadRepository>;
  let mockSubscriptionPlanViewModelFactory: jest.Mocked<SubscriptionPlanViewModelFactory>;

  beforeEach(() => {
    mockSubscriptionPlanReadRepository = {
      findById: jest.fn(),
      findByCriteria: jest.fn(),
      save: jest.fn(),
      delete: jest.fn(),
    } as unknown as jest.Mocked<SubscriptionPlanReadRepository>;

    mockSubscriptionPlanViewModelFactory = {
      create: jest.fn(),
      fromPrimitives: jest.fn(),
      fromAggregate: jest.fn(),
    } as unknown as jest.Mocked<SubscriptionPlanViewModelFactory>;

    handler = new SubscriptionPlanCreatedEventHandler(
      mockSubscriptionPlanReadRepository,
      mockSubscriptionPlanViewModelFactory,
    );
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('handle', () => {
    it('should create and save subscription plan view model when event is handled', async () => {
      const subscriptionPlanId = '123e4567-e89b-12d3-a456-426614174000';
      const subscriptionPlanPrimitives: SubscriptionPlanPrimitives = {
        id: subscriptionPlanId,
        name: 'Basic Plan',
        slug: 'basic-plan',
        type: SubscriptionPlanTypeEnum.BASIC,
        description: 'Basic subscription plan',
        priceMonthly: 10.0,
        priceYearly: 120.0,
        currency: SubscriptionPlanCurrencyEnum.USD,
        interval: SubscriptionPlanIntervalEnum.MONTHLY,
        intervalCount: 1,
        trialPeriodDays: 7,
        isActive: true,
        features: { feature1: 'value1' },
        limits: { limit1: 100 },
        stripePriceId: 'price_123',
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      const event = new SubscriptionPlanCreatedEvent(
        {
          aggregateId: subscriptionPlanId,
          aggregateType: 'SubscriptionPlanAggregate',
          eventType: 'SubscriptionPlanCreatedEvent',
        },
        subscriptionPlanPrimitives,
      );

      const mockViewModel = new SubscriptionPlanViewModel({
        id: subscriptionPlanId,
        name: 'Basic Plan',
        slug: 'basic-plan',
        type: SubscriptionPlanTypeEnum.BASIC,
        description: 'Basic subscription plan',
        priceMonthly: 10.0,
        priceYearly: 120.0,
        currency: SubscriptionPlanCurrencyEnum.USD,
        interval: SubscriptionPlanIntervalEnum.MONTHLY,
        intervalCount: 1,
        trialPeriodDays: 7,
        isActive: true,
        features: { feature1: 'value1' },
        limits: { limit1: 100 },
        stripePriceId: 'price_123',
        createdAt: new Date(),
        updatedAt: new Date(),
      });

      mockSubscriptionPlanViewModelFactory.fromPrimitives.mockReturnValue(
        mockViewModel,
      );
      mockSubscriptionPlanReadRepository.save.mockResolvedValue(undefined);

      await handler.handle(event);

      expect(
        mockSubscriptionPlanViewModelFactory.fromPrimitives,
      ).toHaveBeenCalledWith(subscriptionPlanPrimitives);
      expect(
        mockSubscriptionPlanViewModelFactory.fromPrimitives,
      ).toHaveBeenCalledTimes(1);
      expect(mockSubscriptionPlanReadRepository.save).toHaveBeenCalledWith(
        mockViewModel,
      );
      expect(mockSubscriptionPlanReadRepository.save).toHaveBeenCalledTimes(1);
    });

    it('should handle event with all subscription plan properties', async () => {
      const subscriptionPlanId = '123e4567-e89b-12d3-a456-426614174000';
      const subscriptionPlanPrimitives: SubscriptionPlanPrimitives = {
        id: subscriptionPlanId,
        name: 'Pro Plan',
        slug: 'pro-plan',
        type: SubscriptionPlanTypeEnum.PRO,
        description: 'Pro subscription plan',
        priceMonthly: 29.0,
        priceYearly: 348.0,
        currency: SubscriptionPlanCurrencyEnum.EUR,
        interval: SubscriptionPlanIntervalEnum.YEARLY,
        intervalCount: 1,
        trialPeriodDays: 14,
        isActive: true,
        features: { feature1: 'value1', feature2: 'value2' },
        limits: { limit1: 500 },
        stripePriceId: 'price_456',
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      const event = new SubscriptionPlanCreatedEvent(
        {
          aggregateId: subscriptionPlanId,
          aggregateType: 'SubscriptionPlanAggregate',
          eventType: 'SubscriptionPlanCreatedEvent',
        },
        subscriptionPlanPrimitives,
      );

      const mockViewModel = new SubscriptionPlanViewModel({
        id: subscriptionPlanId,
        name: 'Pro Plan',
        slug: 'pro-plan',
        type: SubscriptionPlanTypeEnum.PRO,
        description: 'Pro subscription plan',
        priceMonthly: 29.0,
        priceYearly: 348.0,
        currency: SubscriptionPlanCurrencyEnum.EUR,
        interval: SubscriptionPlanIntervalEnum.YEARLY,
        intervalCount: 1,
        trialPeriodDays: 14,
        isActive: true,
        features: { feature1: 'value1', feature2: 'value2' },
        limits: { limit1: 500 },
        stripePriceId: 'price_456',
        createdAt: new Date(),
        updatedAt: new Date(),
      });

      mockSubscriptionPlanViewModelFactory.fromPrimitives.mockReturnValue(
        mockViewModel,
      );
      mockSubscriptionPlanReadRepository.save.mockResolvedValue(undefined);

      await handler.handle(event);

      expect(
        mockSubscriptionPlanViewModelFactory.fromPrimitives,
      ).toHaveBeenCalledWith(subscriptionPlanPrimitives);
      expect(mockSubscriptionPlanReadRepository.save).toHaveBeenCalledWith(
        mockViewModel,
      );
    });

    it('should handle event with minimal subscription plan data', async () => {
      const subscriptionPlanId = '123e4567-e89b-12d3-a456-426614174000';
      const subscriptionPlanPrimitives: SubscriptionPlanPrimitives = {
        id: subscriptionPlanId,
        name: 'Basic Plan',
        slug: 'basic-plan',
        type: SubscriptionPlanTypeEnum.BASIC,
        description: null,
        priceMonthly: 10.0,
        priceYearly: 120.0,
        currency: SubscriptionPlanCurrencyEnum.USD,
        interval: SubscriptionPlanIntervalEnum.MONTHLY,
        intervalCount: 1,
        trialPeriodDays: null,
        isActive: true,
        features: null,
        limits: null,
        stripePriceId: null,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      const event = new SubscriptionPlanCreatedEvent(
        {
          aggregateId: subscriptionPlanId,
          aggregateType: 'SubscriptionPlanAggregate',
          eventType: 'SubscriptionPlanCreatedEvent',
        },
        subscriptionPlanPrimitives,
      );

      const mockViewModel = new SubscriptionPlanViewModel({
        id: subscriptionPlanId,
        name: 'Basic Plan',
        slug: 'basic-plan',
        type: SubscriptionPlanTypeEnum.BASIC,
        description: null,
        priceMonthly: 10.0,
        priceYearly: 120.0,
        currency: SubscriptionPlanCurrencyEnum.USD,
        interval: SubscriptionPlanIntervalEnum.MONTHLY,
        intervalCount: 1,
        trialPeriodDays: null,
        isActive: true,
        features: null,
        limits: null,
        stripePriceId: null,
        createdAt: new Date(),
        updatedAt: new Date(),
      });

      mockSubscriptionPlanViewModelFactory.fromPrimitives.mockReturnValue(
        mockViewModel,
      );
      mockSubscriptionPlanReadRepository.save.mockResolvedValue(undefined);

      await handler.handle(event);

      expect(
        mockSubscriptionPlanViewModelFactory.fromPrimitives,
      ).toHaveBeenCalledWith(subscriptionPlanPrimitives);
      expect(mockSubscriptionPlanReadRepository.save).toHaveBeenCalledWith(
        mockViewModel,
      );
    });

    it('should handle repository errors correctly', async () => {
      const subscriptionPlanId = '123e4567-e89b-12d3-a456-426614174000';
      const subscriptionPlanPrimitives: SubscriptionPlanPrimitives = {
        id: subscriptionPlanId,
        name: 'Basic Plan',
        slug: 'basic-plan',
        type: SubscriptionPlanTypeEnum.BASIC,
        description: null,
        priceMonthly: 10.0,
        priceYearly: 120.0,
        currency: SubscriptionPlanCurrencyEnum.USD,
        interval: SubscriptionPlanIntervalEnum.MONTHLY,
        intervalCount: 1,
        trialPeriodDays: null,
        isActive: true,
        features: null,
        limits: null,
        stripePriceId: null,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      const event = new SubscriptionPlanCreatedEvent(
        {
          aggregateId: subscriptionPlanId,
          aggregateType: 'SubscriptionPlanAggregate',
          eventType: 'SubscriptionPlanCreatedEvent',
        },
        subscriptionPlanPrimitives,
      );

      const mockViewModel = new SubscriptionPlanViewModel({
        id: subscriptionPlanId,
        name: 'Basic Plan',
        slug: 'basic-plan',
        type: SubscriptionPlanTypeEnum.BASIC,
        description: null,
        priceMonthly: 10.0,
        priceYearly: 120.0,
        currency: SubscriptionPlanCurrencyEnum.USD,
        interval: SubscriptionPlanIntervalEnum.MONTHLY,
        intervalCount: 1,
        trialPeriodDays: null,
        isActive: true,
        features: null,
        limits: null,
        stripePriceId: null,
        createdAt: new Date(),
        updatedAt: new Date(),
      });

      const repositoryError = new Error('Database connection error');

      mockSubscriptionPlanViewModelFactory.fromPrimitives.mockReturnValue(
        mockViewModel,
      );
      mockSubscriptionPlanReadRepository.save.mockRejectedValue(
        repositoryError,
      );

      await expect(handler.handle(event)).rejects.toThrow(repositoryError);

      expect(
        mockSubscriptionPlanViewModelFactory.fromPrimitives,
      ).toHaveBeenCalledWith(subscriptionPlanPrimitives);
      expect(mockSubscriptionPlanReadRepository.save).toHaveBeenCalledWith(
        mockViewModel,
      );
    });
  });
});
