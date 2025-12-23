import { ISubscriptionPlanFindByIdQueryDto } from '@/billing-context/subscription-plan/application/dtos/queries/subscription-plan-find-by-id/subscription-plan-find-by-id-query.dto';
import { SubscriptionPlanNotFoundException } from '@/billing-context/subscription-plan/application/exceptions/subscription-plan-not-found/subscription-plan-not-found.exception';
import { FindSubscriptionPlanViewModelByIdQuery } from '@/billing-context/subscription-plan/application/queries/subscription-plan-find-view-model-by-id/subscription-plan-find-view-model-by-id.query';
import { FindSubscriptionPlanViewModelByIdQueryHandler } from '@/billing-context/subscription-plan/application/queries/subscription-plan-find-view-model-by-id/subscription-plan-find-view-model-by-id.query-handler';
import { AssertSubscriptionPlanViewModelExsistsService } from '@/billing-context/subscription-plan/application/services/assert-subscription-plan-view-model-exsits/assert-subscription-plan-view-model-exsits.service';
import { SubscriptionPlanCurrencyEnum } from '@/billing-context/subscription-plan/domain/enum/subscription-plan-currency/subscription-plan-currency.enum';
import { SubscriptionPlanViewModel } from '@/billing-context/subscription-plan/domain/view-models/subscription-plan.view-model';
import { SubscriptionPlanIntervalEnum } from '@/billing-context/subscription-plan/domain/enum/subscription-plan-interval/subscription-plan-interval.enum';
import { SubscriptionPlanTypeEnum } from '@/billing-context/subscription-plan/domain/enum/subscription-plan-type/subscription-plan-type.enum';
import { SubscriptionPlanUuidValueObject } from '@/shared/domain/value-objects/identifiers/subscription-plan/subscription-plan-uuid.vo';

describe('FindSubscriptionPlanViewModelByIdQueryHandler', () => {
  let handler: FindSubscriptionPlanViewModelByIdQueryHandler;
  let mockAssertSubscriptionPlanViewModelExsistsService: Partial<
    jest.Mocked<AssertSubscriptionPlanViewModelExsistsService>
  >;

  beforeEach(() => {
    mockAssertSubscriptionPlanViewModelExsistsService = {
      execute: jest.fn(),
    } as Partial<jest.Mocked<AssertSubscriptionPlanViewModelExsistsService>>;

    handler = new FindSubscriptionPlanViewModelByIdQueryHandler(
      mockAssertSubscriptionPlanViewModelExsistsService as unknown as AssertSubscriptionPlanViewModelExsistsService,
    );
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('execute', () => {
    it('should return subscription plan view model when subscription plan exists', async () => {
      const subscriptionPlanId = '123e4567-e89b-12d3-a456-426614174000';
      const queryDto: ISubscriptionPlanFindByIdQueryDto = {
        id: subscriptionPlanId,
      };
      const query = new FindSubscriptionPlanViewModelByIdQuery(queryDto);

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

      mockAssertSubscriptionPlanViewModelExsistsService.execute.mockResolvedValue(
        mockViewModel,
      );

      const result = await handler.execute(query);

      expect(result).toBe(mockViewModel);
      expect(
        mockAssertSubscriptionPlanViewModelExsistsService.execute,
      ).toHaveBeenCalledWith(subscriptionPlanId);
      expect(
        mockAssertSubscriptionPlanViewModelExsistsService.execute,
      ).toHaveBeenCalledTimes(1);
    });

    it('should throw exception when subscription plan does not exist', async () => {
      const subscriptionPlanId = '123e4567-e89b-12d3-a456-426614174000';
      const queryDto: ISubscriptionPlanFindByIdQueryDto = {
        id: subscriptionPlanId,
      };
      const query = new FindSubscriptionPlanViewModelByIdQuery(queryDto);

      const error = new SubscriptionPlanNotFoundException(subscriptionPlanId);
      mockAssertSubscriptionPlanViewModelExsistsService.execute.mockRejectedValue(
        error,
      );

      await expect(handler.execute(query)).rejects.toThrow(error);
      await expect(handler.execute(query)).rejects.toThrow(
        `Subscription plan with id ${subscriptionPlanId} not found`,
      );

      expect(
        mockAssertSubscriptionPlanViewModelExsistsService.execute,
      ).toHaveBeenCalledWith(subscriptionPlanId);
      expect(
        mockAssertSubscriptionPlanViewModelExsistsService.execute,
      ).toHaveBeenCalledTimes(2);
    });

    it('should call service with correct id from query', async () => {
      const subscriptionPlanId = '123e4567-e89b-12d3-a456-426614174000';
      const queryDto: ISubscriptionPlanFindByIdQueryDto = {
        id: subscriptionPlanId,
      };
      const query = new FindSubscriptionPlanViewModelByIdQuery(queryDto);

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

      mockAssertSubscriptionPlanViewModelExsistsService.execute.mockResolvedValue(
        mockViewModel,
      );

      await handler.execute(query);

      expect(
        mockAssertSubscriptionPlanViewModelExsistsService.execute,
      ).toHaveBeenCalledWith(query.id.value);
      expect(query.id).toBeInstanceOf(SubscriptionPlanUuidValueObject);
      expect(query.id.value).toBe(subscriptionPlanId);
    });

    it('should return subscription plan view model with all properties when subscription plan exists', async () => {
      const subscriptionPlanId = '123e4567-e89b-12d3-a456-426614174000';
      const queryDto: ISubscriptionPlanFindByIdQueryDto = {
        id: subscriptionPlanId,
      };
      const query = new FindSubscriptionPlanViewModelByIdQuery(queryDto);

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

      mockAssertSubscriptionPlanViewModelExsistsService.execute.mockResolvedValue(
        mockViewModel,
      );

      const result = await handler.execute(query);

      expect(result).toBe(mockViewModel);
      expect(result.id).toBe(subscriptionPlanId);
      expect(result.name).toBe('Pro Plan');
      expect(result.slug).toBe('pro-plan');
      expect(result.type).toBe(SubscriptionPlanTypeEnum.PRO);
      expect(result.priceMonthly).toBe(29.0);
      expect(result.priceYearly).toBe(348.0);
      expect(result.currency).toBe(SubscriptionPlanCurrencyEnum.EUR);
      expect(result.interval).toBe(SubscriptionPlanIntervalEnum.YEARLY);
      expect(result.intervalCount).toBe(1);
      expect(result.isActive).toBe(true);
    });

    it('should propagate repository errors correctly', async () => {
      const subscriptionPlanId = '123e4567-e89b-12d3-a456-426614174000';
      const queryDto: ISubscriptionPlanFindByIdQueryDto = {
        id: subscriptionPlanId,
      };
      const query = new FindSubscriptionPlanViewModelByIdQuery(queryDto);

      const repositoryError = new Error('Database connection error');
      mockAssertSubscriptionPlanViewModelExsistsService.execute.mockRejectedValue(
        repositoryError,
      );

      await expect(handler.execute(query)).rejects.toThrow(repositoryError);

      expect(
        mockAssertSubscriptionPlanViewModelExsistsService.execute,
      ).toHaveBeenCalledWith(subscriptionPlanId);
      expect(
        mockAssertSubscriptionPlanViewModelExsistsService.execute,
      ).toHaveBeenCalledTimes(1);
    });
  });
});
