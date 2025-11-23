import { Criteria } from '@/shared/domain/entities/criteria';
import { PaginatedResult } from '@/shared/domain/entities/paginated-result.entity';
import { FindSubscriptionPlansByCriteriaQuery } from '@/billing-context/subscription-plan/application/queries/subscription-plan-find-by-criteria/subscription-plan-find-by-criteria.query';
import { FindSubscriptionPlanViewModelByIdQuery } from '@/billing-context/subscription-plan/application/queries/subscription-plan-find-view-model-by-id/subscription-plan-find-view-model-by-id.query';
import { SubscriptionPlanViewModel } from '@/billing-context/subscription-plan/domain/view-models/subscription-plan.view-model';
import { SubscriptionPlanFindByCriteriaRequestDto } from '@/billing-context/subscription-plan/transport/graphql/dtos/requests/subscription-plan-find-by-criteria.request.dto';
import { SubscriptionPlanFindByIdRequestDto } from '@/billing-context/subscription-plan/transport/graphql/dtos/requests/subscription-plan-find-by-id.request.dto';
import {
  PaginatedSubscriptionPlanResultDto,
  SubscriptionPlanResponseDto,
} from '@/billing-context/subscription-plan/transport/graphql/dtos/responses/subscription-plan.response.dto';
import { SubscriptionPlanGraphQLMapper } from '@/billing-context/subscription-plan/transport/graphql/mappers/subscription-plan.mapper';
import { SubscriptionPlanQueryResolver } from '@/billing-context/subscription-plan/transport/graphql/resolvers/subscription-plan-queries.resolver';
import { SubscriptionPlanTypeEnum } from '@/billing-context/subscription-plan/domain/enum/subscription-plan-type.enum';
import { SubscriptionPlanCurrencyEnum } from '@/billing-context/subscription-plan/domain/enum/subscription-plan-currency.enum';
import { SubscriptionPlanIntervalEnum } from '@/billing-context/subscription-plan/domain/enum/subscription-plan-interval.enum';
import { ISubscriptionPlanCreateViewModelDto } from '@/billing-context/subscription-plan/domain/dtos/view-models/subscription-plan-create-view-model/subscription-plan-create-view-model.dto';
import { QueryBus } from '@nestjs/cqrs';

describe('SubscriptionPlanQueryResolver', () => {
  let resolver: SubscriptionPlanQueryResolver;
  let mockQueryBus: jest.Mocked<QueryBus>;
  let mockSubscriptionPlanGraphQLMapper: jest.Mocked<SubscriptionPlanGraphQLMapper>;

  beforeEach(() => {
    mockQueryBus = {
      execute: jest.fn(),
    } as unknown as jest.Mocked<QueryBus>;

    mockSubscriptionPlanGraphQLMapper = {
      toResponseDto: jest.fn(),
      toPaginatedResponseDto: jest.fn(),
    } as unknown as jest.Mocked<SubscriptionPlanGraphQLMapper>;

    resolver = new SubscriptionPlanQueryResolver(
      mockQueryBus,
      mockSubscriptionPlanGraphQLMapper,
    );
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('subscriptionPlanFindByCriteria', () => {
    it('should return paginated subscription plans when criteria matches', async () => {
      const input: SubscriptionPlanFindByCriteriaRequestDto = {
        filters: [],
        sorts: [],
        pagination: { page: 1, perPage: 10 },
      };

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
      ];

      const paginatedResult = new PaginatedResult(viewModels, 1, 1, 10);
      const paginatedResponseDto: PaginatedSubscriptionPlanResultDto = {
        items: [
          {
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
          },
        ],
        total: 1,
        page: 1,
        perPage: 10,
        totalPages: 1,
      };

      mockQueryBus.execute.mockResolvedValue(paginatedResult);
      mockSubscriptionPlanGraphQLMapper.toPaginatedResponseDto.mockReturnValue(
        paginatedResponseDto,
      );

      const result = await resolver.subscriptionPlanFindByCriteria(input);

      expect(result).toBe(paginatedResponseDto);
      expect(mockQueryBus.execute).toHaveBeenCalledWith(
        expect.any(FindSubscriptionPlansByCriteriaQuery),
      );
      const query = (mockQueryBus.execute as jest.Mock).mock.calls[0][0];
      expect(query).toBeInstanceOf(FindSubscriptionPlansByCriteriaQuery);
      expect(query.criteria).toBeInstanceOf(Criteria);
      expect(
        mockSubscriptionPlanGraphQLMapper.toPaginatedResponseDto,
      ).toHaveBeenCalledWith(paginatedResult);
    });

    it('should return paginated subscription plans with null input', async () => {
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
      ];

      const paginatedResult = new PaginatedResult(viewModels, 1, 1, 10);
      const paginatedResponseDto: PaginatedSubscriptionPlanResultDto = {
        items: [
          {
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
          },
        ],
        total: 1,
        page: 1,
        perPage: 10,
        totalPages: 1,
      };

      mockQueryBus.execute.mockResolvedValue(paginatedResult);
      mockSubscriptionPlanGraphQLMapper.toPaginatedResponseDto.mockReturnValue(
        paginatedResponseDto,
      );

      const result = await resolver.subscriptionPlanFindByCriteria(undefined);

      expect(result).toBe(paginatedResponseDto);
      expect(mockQueryBus.execute).toHaveBeenCalledWith(
        expect.any(FindSubscriptionPlansByCriteriaQuery),
      );
      const query = (mockQueryBus.execute as jest.Mock).mock.calls[0][0];
      expect(query).toBeInstanceOf(FindSubscriptionPlansByCriteriaQuery);
      expect(query.criteria).toBeInstanceOf(Criteria);
      expect(
        mockSubscriptionPlanGraphQLMapper.toPaginatedResponseDto,
      ).toHaveBeenCalledWith(paginatedResult);
    });

    it('should handle errors from query bus', async () => {
      const input: SubscriptionPlanFindByCriteriaRequestDto = {
        filters: [],
        sorts: [],
        pagination: { page: 1, perPage: 10 },
      };

      const error = new Error('Database error');
      mockQueryBus.execute.mockRejectedValue(error);

      await expect(
        resolver.subscriptionPlanFindByCriteria(input),
      ).rejects.toThrow(error);
      expect(mockQueryBus.execute).toHaveBeenCalledWith(
        expect.any(FindSubscriptionPlansByCriteriaQuery),
      );
      expect(
        mockSubscriptionPlanGraphQLMapper.toPaginatedResponseDto,
      ).not.toHaveBeenCalled();
    });
  });

  describe('subscriptionPlanFindById', () => {
    it('should return subscription plan when found', async () => {
      const subscriptionPlanId = '123e4567-e89b-12d3-a456-426614174000';
      const input: SubscriptionPlanFindByIdRequestDto = {
        id: subscriptionPlanId,
      };

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

      const responseDto: SubscriptionPlanResponseDto = {
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

      mockQueryBus.execute.mockResolvedValue(viewModel);
      mockSubscriptionPlanGraphQLMapper.toResponseDto.mockReturnValue(
        responseDto,
      );

      const result = await resolver.subscriptionPlanFindById(input);

      expect(result).toBe(responseDto);
      expect(mockQueryBus.execute).toHaveBeenCalledWith(
        expect.any(FindSubscriptionPlanViewModelByIdQuery),
      );
      const query = (mockQueryBus.execute as jest.Mock).mock.calls[0][0];
      expect(query).toBeInstanceOf(FindSubscriptionPlanViewModelByIdQuery);
      expect(query.id.value).toBe(subscriptionPlanId);
      expect(
        mockSubscriptionPlanGraphQLMapper.toResponseDto,
      ).toHaveBeenCalledWith(viewModel);
    });

    it('should handle errors from query bus', async () => {
      const subscriptionPlanId = '123e4567-e89b-12d3-a456-426614174000';
      const input: SubscriptionPlanFindByIdRequestDto = {
        id: subscriptionPlanId,
      };

      const error = new Error('Subscription plan not found');
      mockQueryBus.execute.mockRejectedValue(error);

      await expect(resolver.subscriptionPlanFindById(input)).rejects.toThrow(
        error,
      );
      expect(mockQueryBus.execute).toHaveBeenCalledWith(
        expect.any(FindSubscriptionPlanViewModelByIdQuery),
      );
      expect(
        mockSubscriptionPlanGraphQLMapper.toResponseDto,
      ).not.toHaveBeenCalled();
    });
  });
});
