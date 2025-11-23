import { PaginatedResult } from '@/shared/domain/entities/paginated-result.entity';
import { SubscriptionPlanViewModel } from '@/billing-context/subscription-plan/domain/view-models/subscription-plan.view-model';
import { SubscriptionPlanGraphQLMapper } from '@/billing-context/subscription-plan/transport/graphql/mappers/subscription-plan.mapper';
import { SubscriptionPlanTypeEnum } from '@/billing-context/subscription-plan/domain/enum/subscription-plan-type.enum';
import { SubscriptionPlanCurrencyEnum } from '@/billing-context/subscription-plan/domain/enum/subscription-plan-currency.enum';
import { SubscriptionPlanIntervalEnum } from '@/billing-context/subscription-plan/domain/enum/subscription-plan-interval.enum';
import { ISubscriptionPlanCreateViewModelDto } from '@/billing-context/subscription-plan/domain/dtos/view-models/subscription-plan-create-view-model/subscription-plan-create-view-model.dto';

describe('SubscriptionPlanGraphQLMapper', () => {
  let mapper: SubscriptionPlanGraphQLMapper;

  beforeEach(() => {
    mapper = new SubscriptionPlanGraphQLMapper();
  });

  describe('toResponseDto', () => {
    it('should convert subscription plan view model to response DTO with all properties', () => {
      const subscriptionPlanId = '123e4567-e89b-12d3-a456-426614174000';
      const createdAt = new Date('2024-01-01');
      const updatedAt = new Date('2024-01-02');
      const viewModelDto: ISubscriptionPlanCreateViewModelDto = {
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
        createdAt,
        updatedAt,
      };
      const viewModel = new SubscriptionPlanViewModel(viewModelDto);

      const result = mapper.toResponseDto(viewModel);

      expect(result).toEqual({
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
        createdAt,
        updatedAt,
      });
    });

    it('should convert subscription plan view model to response DTO with null optional properties', () => {
      const subscriptionPlanId = '123e4567-e89b-12d3-a456-426614174000';
      const createdAt = new Date('2024-01-01');
      const updatedAt = new Date('2024-01-02');
      const viewModelDto: ISubscriptionPlanCreateViewModelDto = {
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
        createdAt,
        updatedAt,
      };
      const viewModel = new SubscriptionPlanViewModel(viewModelDto);

      const result = mapper.toResponseDto(viewModel);

      expect(result).toEqual({
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
        createdAt,
        updatedAt,
      });
    });

    it('should convert subscription plan view model with PRO type and YEARLY interval', () => {
      const subscriptionPlanId = '123e4567-e89b-12d3-a456-426614174000';
      const createdAt = new Date('2024-01-01');
      const updatedAt = new Date('2024-01-02');
      const viewModelDto: ISubscriptionPlanCreateViewModelDto = {
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
        createdAt,
        updatedAt,
      };
      const viewModel = new SubscriptionPlanViewModel(viewModelDto);

      const result = mapper.toResponseDto(viewModel);

      expect(result).toEqual({
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
        createdAt,
        updatedAt,
      });
    });
  });

  describe('toPaginatedResponseDto', () => {
    it('should convert paginated result to paginated response DTO', () => {
      const createdAt = new Date('2024-01-01');
      const updatedAt = new Date('2024-01-02');
      const viewModels: SubscriptionPlanViewModel[] = [
        new SubscriptionPlanViewModel({
          id: '123e4567-e89b-12d3-a456-426614174000',
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
          createdAt,
          updatedAt,
        }),
        new SubscriptionPlanViewModel({
          id: '223e4567-e89b-12d3-a456-426614174001',
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
          features: { apiAccess: true, prioritySupport: true },
          limits: { maxUsers: 100 },
          stripePriceId: 'price_pro123',
          createdAt,
          updatedAt,
        }),
      ];

      const paginatedResult = new PaginatedResult(viewModels, 2, 1, 10);

      const result = mapper.toPaginatedResponseDto(paginatedResult);

      expect(result.items).toHaveLength(2);
      expect(result.total).toBe(2);
      expect(result.page).toBe(1);
      expect(result.perPage).toBe(10);
      expect(result.totalPages).toBe(1);
      expect(result.items[0]).toEqual({
        id: '123e4567-e89b-12d3-a456-426614174000',
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
        createdAt,
        updatedAt,
      });
      expect(result.items[1]).toEqual({
        id: '223e4567-e89b-12d3-a456-426614174001',
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
        features: { apiAccess: true, prioritySupport: true },
        limits: { maxUsers: 100 },
        stripePriceId: 'price_pro123',
        createdAt,
        updatedAt,
      });
    });

    it('should convert empty paginated result to paginated response DTO', () => {
      const paginatedResult = new PaginatedResult<SubscriptionPlanViewModel>(
        [],
        0,
        1,
        10,
      );

      const result = mapper.toPaginatedResponseDto(paginatedResult);

      expect(result.items).toHaveLength(0);
      expect(result.total).toBe(0);
      expect(result.page).toBe(1);
      expect(result.perPage).toBe(10);
      expect(result.totalPages).toBe(0);
    });

    it('should convert paginated result with pagination metadata', () => {
      const createdAt = new Date('2024-01-01');
      const updatedAt = new Date('2024-01-02');
      const viewModels: SubscriptionPlanViewModel[] = Array.from(
        { length: 5 },
        (_, i) =>
          new SubscriptionPlanViewModel({
            id: `${i}e4567-e89b-12d3-a456-426614174000`,
            name: `Plan ${i}`,
            slug: `plan-${i}`,
            type: SubscriptionPlanTypeEnum.BASIC,
            description: `Plan ${i} description`,
            priceMonthly: 10.0 + i,
            priceYearly: 100.0 + i * 10,
            currency: SubscriptionPlanCurrencyEnum.USD,
            interval: SubscriptionPlanIntervalEnum.MONTHLY,
            intervalCount: 1,
            trialPeriodDays: 7,
            isActive: true,
            features: null,
            limits: null,
            stripePriceId: null,
            createdAt,
            updatedAt,
          }),
      );

      const paginatedResult = new PaginatedResult(viewModels, 25, 2, 5);

      const result = mapper.toPaginatedResponseDto(paginatedResult);

      expect(result.items).toHaveLength(5);
      expect(result.total).toBe(25);
      expect(result.page).toBe(2);
      expect(result.perPage).toBe(5);
      expect(result.totalPages).toBe(5);
    });
  });
});

