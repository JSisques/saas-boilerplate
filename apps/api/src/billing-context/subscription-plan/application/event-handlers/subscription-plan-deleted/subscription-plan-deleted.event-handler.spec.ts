import { SubscriptionPlanDeletedEventHandler } from '@/billing-context/subscription-plan/application/event-handlers/subscription-plan-deleted/subscription-plan-deleted.event-handler';
import { SubscriptionPlanNotFoundException } from '@/billing-context/subscription-plan/application/exceptions/subscription-plan-not-found/subscription-plan-not-found.exception';
import { AssertSubscriptionPlanViewModelExsistsService } from '@/billing-context/subscription-plan/application/services/assert-subscription-plan-view-model-exsits/assert-subscription-plan-view-model-exsits.service';
import { SubscriptionPlanCurrencyEnum } from '@/billing-context/subscription-plan/domain/enum/subscription-plan-currency/subscription-plan-currency.enum';
import { SubscriptionPlanPrimitives } from '@/billing-context/subscription-plan/domain/primitives/subscription-plan.primitives';
import { SubscriptionPlanReadRepository } from '@/billing-context/subscription-plan/domain/repositories/subscription-plan-read/subscription-plan-read.repository';
import { SubscriptionPlanViewModel } from '@/billing-context/subscription-plan/domain/view-models/subscription-plan.view-model';
import { SubscriptionPlanIntervalEnum } from '@/billing-context/subscription-plan/domain/enum/subscription-plan-interval/subscription-plan-interval.enum';
import { SubscriptionPlanTypeEnum } from '@/billing-context/subscription-plan/domain/enum/subscription-plan-type/subscription-plan-type.enum';
import { SubscriptionPlanDeletedEvent } from '@/shared/domain/events/billing-context/subscription-plan/subscription-plan-deleted/subscription-plan-deleted.event';

describe('SubscriptionPlanDeletedEventHandler', () => {
  let handler: SubscriptionPlanDeletedEventHandler;
  let mockSubscriptionPlanReadRepository: jest.Mocked<SubscriptionPlanReadRepository>;
  let mockAssertSubscriptionPlanViewModelExsistsService: jest.Mocked<AssertSubscriptionPlanViewModelExsistsService>;

  beforeEach(() => {
    mockSubscriptionPlanReadRepository = {
      findById: jest.fn(),
      findByCriteria: jest.fn(),
      save: jest.fn(),
      delete: jest.fn(),
    } as unknown as jest.Mocked<SubscriptionPlanReadRepository>;

    mockAssertSubscriptionPlanViewModelExsistsService = {
      execute: jest.fn(),
    } as unknown as jest.Mocked<AssertSubscriptionPlanViewModelExsistsService>;

    handler = new SubscriptionPlanDeletedEventHandler(
      mockSubscriptionPlanReadRepository,
      mockAssertSubscriptionPlanViewModelExsistsService,
    );
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('handle', () => {
    it('should delete subscription plan view model when event is handled', async () => {
      const subscriptionPlanId = '123e4567-e89b-12d3-a456-426614174000';
      const now = new Date();

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
        createdAt: now,
        updatedAt: now,
      };

      const event = new SubscriptionPlanDeletedEvent(
        {
          aggregateId: subscriptionPlanId,
          aggregateType: 'SubscriptionPlanAggregate',
          eventType: 'SubscriptionPlanDeletedEvent',
        },
        subscriptionPlanPrimitives,
      );

      const existingViewModel = new SubscriptionPlanViewModel({
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
        createdAt: now,
        updatedAt: now,
      });

      mockAssertSubscriptionPlanViewModelExsistsService.execute.mockResolvedValue(
        existingViewModel,
      );
      mockSubscriptionPlanReadRepository.delete.mockResolvedValue(undefined);

      await handler.handle(event);

      expect(
        mockAssertSubscriptionPlanViewModelExsistsService.execute,
      ).toHaveBeenCalledWith(subscriptionPlanId);
      expect(
        mockAssertSubscriptionPlanViewModelExsistsService.execute,
      ).toHaveBeenCalledTimes(1);
      expect(mockSubscriptionPlanReadRepository.delete).toHaveBeenCalledWith(
        existingViewModel.id,
      );
      expect(mockSubscriptionPlanReadRepository.delete).toHaveBeenCalledTimes(
        1,
      );
    });

    it('should throw exception when subscription plan view model does not exist', async () => {
      const subscriptionPlanId = '123e4567-e89b-12d3-a456-426614174000';
      const now = new Date();

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
        createdAt: now,
        updatedAt: now,
      };

      const event = new SubscriptionPlanDeletedEvent(
        {
          aggregateId: subscriptionPlanId,
          aggregateType: 'SubscriptionPlanAggregate',
          eventType: 'SubscriptionPlanDeletedEvent',
        },
        subscriptionPlanPrimitives,
      );

      const error = new SubscriptionPlanNotFoundException(subscriptionPlanId);
      mockAssertSubscriptionPlanViewModelExsistsService.execute.mockRejectedValue(
        error,
      );

      await expect(handler.handle(event)).rejects.toThrow(error);

      expect(
        mockAssertSubscriptionPlanViewModelExsistsService.execute,
      ).toHaveBeenCalledWith(subscriptionPlanId);
      expect(mockSubscriptionPlanReadRepository.delete).not.toHaveBeenCalled();
    });

    it('should handle repository errors correctly', async () => {
      const subscriptionPlanId = '123e4567-e89b-12d3-a456-426614174000';
      const now = new Date();

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
        createdAt: now,
        updatedAt: now,
      };

      const event = new SubscriptionPlanDeletedEvent(
        {
          aggregateId: subscriptionPlanId,
          aggregateType: 'SubscriptionPlanAggregate',
          eventType: 'SubscriptionPlanDeletedEvent',
        },
        subscriptionPlanPrimitives,
      );

      const existingViewModel = new SubscriptionPlanViewModel({
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
        createdAt: now,
        updatedAt: now,
      });

      const repositoryError = new Error('Database connection error');

      mockAssertSubscriptionPlanViewModelExsistsService.execute.mockResolvedValue(
        existingViewModel,
      );
      mockSubscriptionPlanReadRepository.delete.mockRejectedValue(
        repositoryError,
      );

      await expect(handler.handle(event)).rejects.toThrow(repositoryError);

      expect(
        mockAssertSubscriptionPlanViewModelExsistsService.execute,
      ).toHaveBeenCalledWith(subscriptionPlanId);
      expect(mockSubscriptionPlanReadRepository.delete).toHaveBeenCalledWith(
        existingViewModel.id,
      );
    });
  });
});
