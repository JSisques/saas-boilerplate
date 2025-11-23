import { SubscriptionPlanUpdatedEventHandler } from '@/billing-context/subscription-plan/application/event-handlers/subscription-plan-updated/subscription-plan-updated.event-handler';
import { AssertSubscriptionPlanViewModelExsistsService } from '@/billing-context/subscription-plan/application/services/assert-subscription-plan-view-model-exsits/assert-subscription-plan-view-model-exsits.service';
import {
  SUBSCRIPTION_PLAN_READ_REPOSITORY_TOKEN,
  SubscriptionPlanReadRepository,
} from '@/billing-context/subscription-plan/domain/repositories/subscription-plan-read/subscription-plan-read.repository';
import { SubscriptionPlanViewModel } from '@/billing-context/subscription-plan/domain/view-models/subscription-plan.view-model';
import { SubscriptionPlanUpdatedEvent } from '@/shared/domain/events/billing-context/subscription-plan/subscription-plan-updated/subscription-plan-updated.event';
import { SubscriptionPlanNotFoundException } from '@/billing-context/subscription-plan/application/exceptions/subscription-plan-not-found/subscription-plan-not-found.exception';
import { SubscriptionPlanTypeEnum } from '@/billing-context/subscription-plan/domain/enum/subscription-plan-type.enum';
import { SubscriptionPlanCurrencyEnum } from '@/billing-context/subscription-plan/domain/enum/subscription-plan-currency.enum';
import { SubscriptionPlanIntervalEnum } from '@/billing-context/subscription-plan/domain/enum/subscription-plan-interval.enum';

describe('SubscriptionPlanUpdatedEventHandler', () => {
  let handler: SubscriptionPlanUpdatedEventHandler;
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

    handler = new SubscriptionPlanUpdatedEventHandler(
      mockSubscriptionPlanReadRepository,
      mockAssertSubscriptionPlanViewModelExsistsService,
    );
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('handle', () => {
    it('should update and save subscription plan view model when event is handled', async () => {
      const subscriptionPlanId = '123e4567-e89b-12d3-a456-426614174000';
      const updateData = {
        name: 'Updated Plan',
        priceMonthly: 20.0,
      };

      const event = new SubscriptionPlanUpdatedEvent(
        {
          aggregateId: subscriptionPlanId,
          aggregateType: 'SubscriptionPlanAggregate',
          eventType: 'SubscriptionPlanUpdatedEvent',
        },
        updateData,
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
        createdAt: new Date(),
        updatedAt: new Date(),
      });

      const updateSpy = jest.spyOn(existingViewModel, 'update');
      mockAssertSubscriptionPlanViewModelExsistsService.execute.mockResolvedValue(
        existingViewModel,
      );
      mockSubscriptionPlanReadRepository.save.mockResolvedValue(undefined);

      await handler.handle(event);

      expect(
        mockAssertSubscriptionPlanViewModelExsistsService.execute,
      ).toHaveBeenCalledWith(subscriptionPlanId);
      expect(
        mockAssertSubscriptionPlanViewModelExsistsService.execute,
      ).toHaveBeenCalledTimes(1);
      expect(updateSpy).toHaveBeenCalledWith(updateData);
      expect(mockSubscriptionPlanReadRepository.save).toHaveBeenCalledWith(
        existingViewModel,
      );
      expect(mockSubscriptionPlanReadRepository.save).toHaveBeenCalledTimes(1);

      updateSpy.mockRestore();
    });

    it('should throw exception when subscription plan view model does not exist', async () => {
      const subscriptionPlanId = '123e4567-e89b-12d3-a456-426614174000';
      const updateData = {
        name: 'Updated Plan',
      };

      const event = new SubscriptionPlanUpdatedEvent(
        {
          aggregateId: subscriptionPlanId,
          aggregateType: 'SubscriptionPlanAggregate',
          eventType: 'SubscriptionPlanUpdatedEvent',
        },
        updateData,
      );

      const error = new SubscriptionPlanNotFoundException(subscriptionPlanId);
      mockAssertSubscriptionPlanViewModelExsistsService.execute.mockRejectedValue(
        error,
      );

      await expect(handler.handle(event)).rejects.toThrow(error);

      expect(
        mockAssertSubscriptionPlanViewModelExsistsService.execute,
      ).toHaveBeenCalledWith(subscriptionPlanId);
      expect(mockSubscriptionPlanReadRepository.save).not.toHaveBeenCalled();
    });

    it('should handle repository errors correctly', async () => {
      const subscriptionPlanId = '123e4567-e89b-12d3-a456-426614174000';
      const updateData = {
        name: 'Updated Plan',
      };

      const event = new SubscriptionPlanUpdatedEvent(
        {
          aggregateId: subscriptionPlanId,
          aggregateType: 'SubscriptionPlanAggregate',
          eventType: 'SubscriptionPlanUpdatedEvent',
        },
        updateData,
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
        createdAt: new Date(),
        updatedAt: new Date(),
      });

      const repositoryError = new Error('Database connection error');

      mockAssertSubscriptionPlanViewModelExsistsService.execute.mockResolvedValue(
        existingViewModel,
      );
      mockSubscriptionPlanReadRepository.save.mockRejectedValue(repositoryError);

      await expect(handler.handle(event)).rejects.toThrow(repositoryError);

      expect(
        mockAssertSubscriptionPlanViewModelExsistsService.execute,
      ).toHaveBeenCalledWith(subscriptionPlanId);
      expect(mockSubscriptionPlanReadRepository.save).toHaveBeenCalledWith(
        existingViewModel,
      );
    });
  });
});

