import { ISubscriptionPlanFindByCriteriaQueryDto } from '@/billing-context/subscription-plan/application/dtos/queries/subscription-plan-find-by-criteria/subscription-plan-find-by-criteria-query.dto';
import { FindSubscriptionPlansByCriteriaQuery } from '@/billing-context/subscription-plan/application/queries/subscription-plan-find-by-criteria/subscription-plan-find-by-criteria.query';
import { FindSubscriptionPlansByCriteriaQueryHandler } from '@/billing-context/subscription-plan/application/queries/subscription-plan-find-by-criteria/subscription-plan-find-by-criteria.query-handler';
import { SubscriptionPlanCurrencyEnum } from '@/billing-context/subscription-plan/domain/enum/subscription-plan-currency.enum';
import { SubscriptionPlanIntervalEnum } from '@/billing-context/subscription-plan/domain/enum/subscription-plan-interval.enum';
import { SubscriptionPlanTypeEnum } from '@/billing-context/subscription-plan/domain/enum/subscription-plan-type.enum';
import { SubscriptionPlanReadRepository } from '@/billing-context/subscription-plan/domain/repositories/subscription-plan-read/subscription-plan-read.repository';
import { SubscriptionPlanViewModel } from '@/billing-context/subscription-plan/domain/view-models/subscription-plan.view-model';
import { Criteria } from '@/shared/domain/entities/criteria';
import { PaginatedResult } from '@/shared/domain/entities/paginated-result.entity';

describe('FindSubscriptionPlansByCriteriaQueryHandler', () => {
  let handler: FindSubscriptionPlansByCriteriaQueryHandler;
  let mockSubscriptionPlanReadRepository: jest.Mocked<SubscriptionPlanReadRepository>;

  beforeEach(() => {
    mockSubscriptionPlanReadRepository = {
      findById: jest.fn(),
      findByCriteria: jest.fn(),
      save: jest.fn(),
      delete: jest.fn(),
    } as unknown as jest.Mocked<SubscriptionPlanReadRepository>;

    handler = new FindSubscriptionPlansByCriteriaQueryHandler(
      mockSubscriptionPlanReadRepository,
    );
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('execute', () => {
    it('should return paginated result with subscription plans when criteria matches', async () => {
      const criteria = new Criteria();
      const queryDto: ISubscriptionPlanFindByCriteriaQueryDto = {
        criteria,
      };
      const query = new FindSubscriptionPlansByCriteriaQuery(queryDto);

      const mockSubscriptionPlans: SubscriptionPlanViewModel[] = [
        new SubscriptionPlanViewModel({
          id: '123e4567-e89b-12d3-a456-426614174000',
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
        }),
        new SubscriptionPlanViewModel({
          id: '223e4567-e89b-12d3-a456-426614174001',
          name: 'Pro Plan',
          slug: 'pro-plan',
          type: SubscriptionPlanTypeEnum.PRO,
          description: 'Pro subscription plan',
          priceMonthly: 29.0,
          priceYearly: 348.0,
          currency: SubscriptionPlanCurrencyEnum.USD,
          interval: SubscriptionPlanIntervalEnum.MONTHLY,
          intervalCount: 1,
          trialPeriodDays: 14,
          isActive: true,
          features: { feature1: 'value1', feature2: 'value2' },
          limits: { limit1: 500 },
          stripePriceId: 'price_456',
          createdAt: new Date(),
          updatedAt: new Date(),
        }),
      ];

      const mockPaginatedResult = new PaginatedResult(
        mockSubscriptionPlans,
        2,
        1,
        10,
      );

      mockSubscriptionPlanReadRepository.findByCriteria.mockResolvedValue(
        mockPaginatedResult,
      );

      const result = await handler.execute(query);

      expect(result).toBe(mockPaginatedResult);
      expect(result.items).toHaveLength(2);
      expect(result.total).toBe(2);
      expect(result.page).toBe(1);
      expect(result.perPage).toBe(10);
      expect(
        mockSubscriptionPlanReadRepository.findByCriteria,
      ).toHaveBeenCalledWith(criteria);
      expect(
        mockSubscriptionPlanReadRepository.findByCriteria,
      ).toHaveBeenCalledTimes(1);
    });

    it('should return empty paginated result when no subscription plans match criteria', async () => {
      const criteria = new Criteria();
      const queryDto: ISubscriptionPlanFindByCriteriaQueryDto = {
        criteria,
      };
      const query = new FindSubscriptionPlansByCriteriaQuery(queryDto);

      const mockPaginatedResult =
        new PaginatedResult<SubscriptionPlanViewModel>([], 0, 1, 10);

      mockSubscriptionPlanReadRepository.findByCriteria.mockResolvedValue(
        mockPaginatedResult,
      );

      const result = await handler.execute(query);

      expect(result).toBe(mockPaginatedResult);
      expect(result.items).toHaveLength(0);
      expect(result.total).toBe(0);
      expect(result.page).toBe(1);
      expect(result.perPage).toBe(10);
      expect(
        mockSubscriptionPlanReadRepository.findByCriteria,
      ).toHaveBeenCalledWith(criteria);
      expect(
        mockSubscriptionPlanReadRepository.findByCriteria,
      ).toHaveBeenCalledTimes(1);
    });

    it('should call repository with correct criteria from query', async () => {
      const criteria = new Criteria();
      criteria.pagination.page = 2;
      criteria.pagination.perPage = 20;
      const queryDto: ISubscriptionPlanFindByCriteriaQueryDto = {
        criteria,
      };
      const query = new FindSubscriptionPlansByCriteriaQuery(queryDto);

      const mockPaginatedResult =
        new PaginatedResult<SubscriptionPlanViewModel>([], 0, 2, 20);

      mockSubscriptionPlanReadRepository.findByCriteria.mockResolvedValue(
        mockPaginatedResult,
      );

      await handler.execute(query);

      expect(
        mockSubscriptionPlanReadRepository.findByCriteria,
      ).toHaveBeenCalledWith(query.criteria);
      expect(query.criteria).toBe(criteria);
    });

    it('should propagate repository errors correctly', async () => {
      const criteria = new Criteria();
      const queryDto: ISubscriptionPlanFindByCriteriaQueryDto = {
        criteria,
      };
      const query = new FindSubscriptionPlansByCriteriaQuery(queryDto);

      const repositoryError = new Error('Database connection error');
      mockSubscriptionPlanReadRepository.findByCriteria.mockRejectedValue(
        repositoryError,
      );

      await expect(handler.execute(query)).rejects.toThrow(repositoryError);

      expect(
        mockSubscriptionPlanReadRepository.findByCriteria,
      ).toHaveBeenCalledWith(criteria);
      expect(
        mockSubscriptionPlanReadRepository.findByCriteria,
      ).toHaveBeenCalledTimes(1);
    });
  });
});
