import { SubscriptionPlanNotFoundException } from '@/billing-context/subscription-plan/application/exceptions/subscription-plan-not-found/subscription-plan-not-found.exception';
import { AssertSubscriptionPlanViewModelExsistsService } from '@/billing-context/subscription-plan/application/services/assert-subscription-plan-view-model-exsits/assert-subscription-plan-view-model-exsits.service';
import { SubscriptionPlanCurrencyEnum } from '@/billing-context/subscription-plan/domain/enum/subscription-plan-currency.enum';
import { SubscriptionPlanIntervalEnum } from '@/billing-context/subscription-plan/domain/enum/subscription-plan-interval.enum';
import { SubscriptionPlanTypeEnum } from '@/billing-context/subscription-plan/domain/enum/subscription-plan-type.enum';
import { SubscriptionPlanReadRepository } from '@/billing-context/subscription-plan/domain/repositories/subscription-plan-read/subscription-plan-read.repository';
import { SubscriptionPlanViewModel } from '@/billing-context/subscription-plan/domain/view-models/subscription-plan.view-model';

describe('AssertSubscriptionPlanViewModelExsistsService', () => {
  let service: AssertSubscriptionPlanViewModelExsistsService;
  let mockSubscriptionPlanReadRepository: jest.Mocked<SubscriptionPlanReadRepository>;

  beforeEach(() => {
    mockSubscriptionPlanReadRepository = {
      findById: jest.fn(),
      findByCriteria: jest.fn(),
      save: jest.fn(),
      delete: jest.fn(),
    } as unknown as jest.Mocked<SubscriptionPlanReadRepository>;

    service = new AssertSubscriptionPlanViewModelExsistsService(
      mockSubscriptionPlanReadRepository,
    );
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('execute', () => {
    it('should return subscription plan view model when subscription plan exists', async () => {
      const subscriptionPlanId = '123e4567-e89b-12d3-a456-426614174000';
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

      mockSubscriptionPlanReadRepository.findById.mockResolvedValue(
        mockViewModel,
      );

      const result = await service.execute(subscriptionPlanId);

      expect(result).toBe(mockViewModel);
      expect(mockSubscriptionPlanReadRepository.findById).toHaveBeenCalledWith(
        subscriptionPlanId,
      );
      expect(mockSubscriptionPlanReadRepository.findById).toHaveBeenCalledTimes(
        1,
      );
    });

    it('should throw SubscriptionPlanNotFoundException when subscription plan does not exist', async () => {
      const subscriptionPlanId = '123e4567-e89b-12d3-a456-426614174000';

      mockSubscriptionPlanReadRepository.findById.mockResolvedValue(null);

      await expect(service.execute(subscriptionPlanId)).rejects.toThrow(
        SubscriptionPlanNotFoundException,
      );
      await expect(service.execute(subscriptionPlanId)).rejects.toThrow(
        `Subscription plan with id ${subscriptionPlanId} not found`,
      );

      expect(mockSubscriptionPlanReadRepository.findById).toHaveBeenCalledWith(
        subscriptionPlanId,
      );
      expect(mockSubscriptionPlanReadRepository.findById).toHaveBeenCalledTimes(
        2,
      );
    });

    it('should call repository with correct id', async () => {
      const subscriptionPlanId = '123e4567-e89b-12d3-a456-426614174000';
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

      mockSubscriptionPlanReadRepository.findById.mockResolvedValue(
        mockViewModel,
      );

      await service.execute(subscriptionPlanId);

      expect(mockSubscriptionPlanReadRepository.findById).toHaveBeenCalledWith(
        subscriptionPlanId,
      );
      expect(mockSubscriptionPlanReadRepository.findById).toHaveBeenCalledTimes(
        1,
      );
    });

    it('should handle repository errors correctly', async () => {
      const subscriptionPlanId = '123e4567-e89b-12d3-a456-426614174000';
      const repositoryError = new Error('Database connection error');

      mockSubscriptionPlanReadRepository.findById.mockRejectedValue(
        repositoryError,
      );

      await expect(service.execute(subscriptionPlanId)).rejects.toThrow(
        repositoryError,
      );

      expect(mockSubscriptionPlanReadRepository.findById).toHaveBeenCalledWith(
        subscriptionPlanId,
      );
      expect(mockSubscriptionPlanReadRepository.findById).toHaveBeenCalledTimes(
        1,
      );
    });
  });
});
