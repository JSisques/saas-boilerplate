import { ISubscriptionPlanCreateViewModelDto } from '@/billing-context/subscription-plan/domain/dtos/view-models/subscription-plan-create-view-model/subscription-plan-create-view-model.dto';
import { SubscriptionPlanCurrencyEnum } from '@/billing-context/subscription-plan/domain/enum/subscription-plan-currency.enum';
import { SubscriptionPlanIntervalEnum } from '@/billing-context/subscription-plan/domain/enum/subscription-plan-interval.enum';
import { SubscriptionPlanTypeEnum } from '@/billing-context/subscription-plan/domain/enum/subscription-plan-type.enum';
import { SubscriptionPlanViewModel } from '@/billing-context/subscription-plan/domain/view-models/subscription-plan.view-model';
import { SubscriptionPlanMongoDbDto } from '@/billing-context/subscription-plan/infrastructure/database/mongodb/dtos/subscription-plan-mongodb.dto';
import { SubscriptionPlanMongoDBMapper } from '@/billing-context/subscription-plan/infrastructure/database/mongodb/mappers/subscription-plan-mongodb.mapper';
import { SubscriptionPlanMongoRepository } from '@/billing-context/subscription-plan/infrastructure/database/mongodb/repositories/subscription-plan-mongodb.repository';
import { Criteria } from '@/shared/domain/entities/criteria';
import { PaginatedResult } from '@/shared/domain/entities/paginated-result.entity';
import { FilterOperator } from '@/shared/domain/enums/filter-operator.enum';
import { SortDirection } from '@/shared/domain/enums/sort-direction.enum';
import { MongoMasterService } from '@/shared/infrastructure/database/mongodb/services/mongo-master/mongo-master.service';
import { Collection } from 'mongodb';

describe('SubscriptionPlanMongoRepository', () => {
  let repository: SubscriptionPlanMongoRepository;
  let mockMongoMasterService: jest.Mocked<MongoMasterService>;
  let mockSubscriptionPlanMongoDBMapper: jest.Mocked<SubscriptionPlanMongoDBMapper>;
  let mockCollection: jest.Mocked<Collection>;

  beforeEach(() => {
    mockCollection = {
      findOne: jest.fn(),
      find: jest.fn(),
      replaceOne: jest.fn(),
      deleteOne: jest.fn(),
      countDocuments: jest.fn(),
      toArray: jest.fn(),
    } as unknown as jest.Mocked<Collection>;

    mockMongoMasterService = {
      getCollection: jest.fn().mockReturnValue(mockCollection),
    } as unknown as jest.Mocked<MongoMasterService>;

    mockSubscriptionPlanMongoDBMapper = {
      toViewModel: jest.fn(),
      toMongoData: jest.fn(),
    } as unknown as jest.Mocked<SubscriptionPlanMongoDBMapper>;

    repository = new SubscriptionPlanMongoRepository(
      mockMongoMasterService,
      mockSubscriptionPlanMongoDBMapper,
    );
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('findById', () => {
    it('should return subscription plan view model when plan exists', async () => {
      const subscriptionPlanId = '123e4567-e89b-12d3-a456-426614174000';
      const createdAt = new Date('2024-01-01');
      const updatedAt = new Date('2024-01-02');
      const mongoDoc: SubscriptionPlanMongoDbDto = {
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

      mockCollection.findOne.mockResolvedValue(mongoDoc);
      mockSubscriptionPlanMongoDBMapper.toViewModel.mockReturnValue(viewModel);

      const result = await repository.findById(subscriptionPlanId);

      expect(result).toBe(viewModel);
      expect(mockMongoMasterService.getCollection).toHaveBeenCalledWith(
        'subscription-plans',
      );
      expect(mockCollection.findOne).toHaveBeenCalledWith({
        id: subscriptionPlanId,
      });
      expect(
        mockSubscriptionPlanMongoDBMapper.toViewModel,
      ).toHaveBeenCalledWith({
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

    it('should return null when subscription plan does not exist', async () => {
      const subscriptionPlanId = '123e4567-e89b-12d3-a456-426614174000';

      mockCollection.findOne.mockResolvedValue(null);

      const result = await repository.findById(subscriptionPlanId);

      expect(result).toBeNull();
      expect(mockCollection.findOne).toHaveBeenCalledWith({
        id: subscriptionPlanId,
      });
      expect(
        mockSubscriptionPlanMongoDBMapper.toViewModel,
      ).not.toHaveBeenCalled();
    });
  });

  describe('findByTenantId', () => {
    it('should return subscription plans when plans exist for tenant', async () => {
      const tenantId = 'tenant-123';
      const createdAt = new Date('2024-01-01');
      const updatedAt = new Date('2024-01-02');
      const mongoDocs: SubscriptionPlanMongoDbDto[] = [
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
        {
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
        },
      ];

      const viewModels = mongoDocs.map(
        (doc) =>
          new SubscriptionPlanViewModel({
            id: doc.id,
            name: doc.name,
            slug: doc.slug,
            type: doc.type,
            description: doc.description,
            priceMonthly: doc.priceMonthly,
            priceYearly: doc.priceYearly,
            currency: doc.currency,
            interval: doc.interval,
            intervalCount: doc.intervalCount,
            trialPeriodDays: doc.trialPeriodDays,
            isActive: doc.isActive,
            features: doc.features,
            limits: doc.limits,
            stripePriceId: doc.stripePriceId,
            createdAt: doc.createdAt,
            updatedAt: doc.updatedAt,
          }),
      );

      const mockCursor = {
        toArray: jest.fn().mockResolvedValue(mongoDocs),
      };

      mockCollection.find.mockReturnValue(mockCursor as any);

      mongoDocs.forEach((doc, index) => {
        mockSubscriptionPlanMongoDBMapper.toViewModel.mockReturnValueOnce(
          viewModels[index],
        );
      });

      const result = await repository.findByTenantId(tenantId);

      expect(result).toHaveLength(2);
      expect(mockCollection.find).toHaveBeenCalledWith({ tenantId });
      expect(mockCursor.toArray).toHaveBeenCalled();
      expect(
        mockSubscriptionPlanMongoDBMapper.toViewModel,
      ).toHaveBeenCalledTimes(2);
    });

    it('should return empty array when no plans exist for tenant', async () => {
      const tenantId = 'tenant-123';

      const mockCursor = {
        toArray: jest.fn().mockResolvedValue([]),
      };

      mockCollection.find.mockReturnValue(mockCursor as any);

      const result = await repository.findByTenantId(tenantId);

      expect(result).toEqual([]);
      expect(mockCollection.find).toHaveBeenCalledWith({ tenantId });
      expect(
        mockSubscriptionPlanMongoDBMapper.toViewModel,
      ).not.toHaveBeenCalled();
    });
  });

  describe('findByUserId', () => {
    it('should return subscription plans when plans exist for user', async () => {
      const userId = 'user-123';
      const createdAt = new Date('2024-01-01');
      const updatedAt = new Date('2024-01-02');
      const mongoDocs: SubscriptionPlanMongoDbDto[] = [
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
      ];

      const viewModel = new SubscriptionPlanViewModel({
        id: mongoDocs[0].id,
        name: mongoDocs[0].name,
        slug: mongoDocs[0].slug,
        type: mongoDocs[0].type,
        description: mongoDocs[0].description,
        priceMonthly: mongoDocs[0].priceMonthly,
        priceYearly: mongoDocs[0].priceYearly,
        currency: mongoDocs[0].currency,
        interval: mongoDocs[0].interval,
        intervalCount: mongoDocs[0].intervalCount,
        trialPeriodDays: mongoDocs[0].trialPeriodDays,
        isActive: mongoDocs[0].isActive,
        features: mongoDocs[0].features,
        limits: mongoDocs[0].limits,
        stripePriceId: mongoDocs[0].stripePriceId,
        createdAt: mongoDocs[0].createdAt,
        updatedAt: mongoDocs[0].updatedAt,
      });

      const mockCursor = {
        toArray: jest.fn().mockResolvedValue(mongoDocs),
      };

      mockCollection.find.mockReturnValue(mockCursor as any);
      mockSubscriptionPlanMongoDBMapper.toViewModel.mockReturnValue(viewModel);

      const result = await repository.findByUserId(userId);

      expect(result).toHaveLength(1);
      expect(mockCollection.find).toHaveBeenCalledWith({ userId });
      expect(mockCursor.toArray).toHaveBeenCalled();
      expect(
        mockSubscriptionPlanMongoDBMapper.toViewModel,
      ).toHaveBeenCalledTimes(1);
    });

    it('should return empty array when no plans exist for user', async () => {
      const userId = 'user-123';

      const mockCursor = {
        toArray: jest.fn().mockResolvedValue([]),
      };

      mockCollection.find.mockReturnValue(mockCursor as any);

      const result = await repository.findByUserId(userId);

      expect(result).toEqual([]);
      expect(mockCollection.find).toHaveBeenCalledWith({ userId });
      expect(
        mockSubscriptionPlanMongoDBMapper.toViewModel,
      ).not.toHaveBeenCalled();
    });
  });

  describe('findByCriteria', () => {
    it('should return paginated result with subscription plans when criteria matches', async () => {
      const createdAt = new Date('2024-01-01');
      const updatedAt = new Date('2024-01-02');
      const criteria = new Criteria([], [], { page: 1, perPage: 10 });

      const mongoDocs: SubscriptionPlanMongoDbDto[] = [
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
        {
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
        },
      ];

      const viewModels = mongoDocs.map(
        (doc) =>
          new SubscriptionPlanViewModel({
            id: doc.id,
            name: doc.name,
            slug: doc.slug,
            type: doc.type,
            description: doc.description,
            priceMonthly: doc.priceMonthly,
            priceYearly: doc.priceYearly,
            currency: doc.currency,
            interval: doc.interval,
            intervalCount: doc.intervalCount,
            trialPeriodDays: doc.trialPeriodDays,
            isActive: doc.isActive,
            features: doc.features,
            limits: doc.limits,
            stripePriceId: doc.stripePriceId,
            createdAt: doc.createdAt,
            updatedAt: doc.updatedAt,
          }),
      );

      const mockCursor = {
        sort: jest.fn().mockReturnThis(),
        skip: jest.fn().mockReturnThis(),
        limit: jest.fn().mockReturnThis(),
        toArray: jest.fn().mockResolvedValue(mongoDocs),
      };

      mockCollection.find.mockReturnValue(mockCursor as any);
      mockCollection.countDocuments.mockResolvedValue(2);

      mongoDocs.forEach((doc, index) => {
        mockSubscriptionPlanMongoDBMapper.toViewModel.mockReturnValueOnce(
          viewModels[index],
        );
      });

      const result = await repository.findByCriteria(criteria);

      expect(result).toBeInstanceOf(PaginatedResult);
      expect(result.items).toHaveLength(2);
      expect(result.total).toBe(2);
      expect(result.page).toBe(1);
      expect(result.perPage).toBe(10);
      expect(mockCollection.find).toHaveBeenCalled();
      expect(mockCursor.sort).toHaveBeenCalled();
      expect(mockCursor.skip).toHaveBeenCalledWith(0);
      expect(mockCursor.limit).toHaveBeenCalledWith(10);
      expect(mockCollection.countDocuments).toHaveBeenCalled();
    });

    it('should return empty paginated result when no subscription plans match criteria', async () => {
      const criteria = new Criteria([], [], { page: 1, perPage: 10 });

      const mockCursor = {
        sort: jest.fn().mockReturnThis(),
        skip: jest.fn().mockReturnThis(),
        limit: jest.fn().mockReturnThis(),
        toArray: jest.fn().mockResolvedValue([]),
      };

      mockCollection.find.mockReturnValue(mockCursor as any);
      mockCollection.countDocuments.mockResolvedValue(0);

      const result = await repository.findByCriteria(criteria);

      expect(result).toBeInstanceOf(PaginatedResult);
      expect(result.items).toHaveLength(0);
      expect(result.total).toBe(0);
      expect(result.page).toBe(1);
      expect(result.perPage).toBe(10);
    });

    it('should handle criteria with filters', async () => {
      const createdAt = new Date('2024-01-01');
      const updatedAt = new Date('2024-01-02');
      const criteria = new Criteria(
        [
          {
            field: 'type',
            operator: FilterOperator.EQUALS,
            value: SubscriptionPlanTypeEnum.BASIC,
          },
        ],
        [],
        { page: 1, perPage: 10 },
      );

      const mongoDocs: SubscriptionPlanMongoDbDto[] = [
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
      ];

      const viewModel = new SubscriptionPlanViewModel({
        id: mongoDocs[0].id,
        name: mongoDocs[0].name,
        slug: mongoDocs[0].slug,
        type: mongoDocs[0].type,
        description: mongoDocs[0].description,
        priceMonthly: mongoDocs[0].priceMonthly,
        priceYearly: mongoDocs[0].priceYearly,
        currency: mongoDocs[0].currency,
        interval: mongoDocs[0].interval,
        intervalCount: mongoDocs[0].intervalCount,
        trialPeriodDays: mongoDocs[0].trialPeriodDays,
        isActive: mongoDocs[0].isActive,
        features: mongoDocs[0].features,
        limits: mongoDocs[0].limits,
        stripePriceId: mongoDocs[0].stripePriceId,
        createdAt: mongoDocs[0].createdAt,
        updatedAt: mongoDocs[0].updatedAt,
      });

      const mockCursor = {
        sort: jest.fn().mockReturnThis(),
        skip: jest.fn().mockReturnThis(),
        limit: jest.fn().mockReturnThis(),
        toArray: jest.fn().mockResolvedValue(mongoDocs),
      };

      mockCollection.find.mockReturnValue(mockCursor as any);
      mockCollection.countDocuments.mockResolvedValue(1);
      mockSubscriptionPlanMongoDBMapper.toViewModel.mockReturnValue(viewModel);

      const result = await repository.findByCriteria(criteria);

      expect(result.items).toHaveLength(1);
      expect(result.total).toBe(1);
      expect(mockCollection.find).toHaveBeenCalled();
    });

    it('should handle criteria with sorts', async () => {
      const criteria = new Criteria(
        [],
        [{ field: 'name', direction: SortDirection.ASC }],
        { page: 1, perPage: 10 },
      );

      const mockCursor = {
        sort: jest.fn().mockReturnThis(),
        skip: jest.fn().mockReturnThis(),
        limit: jest.fn().mockReturnThis(),
        toArray: jest.fn().mockResolvedValue([]),
      };

      mockCollection.find.mockReturnValue(mockCursor as any);
      mockCollection.countDocuments.mockResolvedValue(0);

      await repository.findByCriteria(criteria);

      expect(mockCursor.sort).toHaveBeenCalled();
    });

    it('should handle pagination correctly', async () => {
      const criteria = new Criteria([], [], { page: 2, perPage: 5 });

      const mockCursor = {
        sort: jest.fn().mockReturnThis(),
        skip: jest.fn().mockReturnThis(),
        limit: jest.fn().mockReturnThis(),
        toArray: jest.fn().mockResolvedValue([]),
      };

      mockCollection.find.mockReturnValue(mockCursor as any);
      mockCollection.countDocuments.mockResolvedValue(0);

      const result = await repository.findByCriteria(criteria);

      expect(result.page).toBe(2);
      expect(result.perPage).toBe(5);
      expect(mockCursor.skip).toHaveBeenCalledWith(5);
      expect(mockCursor.limit).toHaveBeenCalledWith(5);
    });
  });

  describe('save', () => {
    it('should save subscription plan view model using upsert', async () => {
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

      const mongoData: SubscriptionPlanMongoDbDto = {
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

      mockSubscriptionPlanMongoDBMapper.toMongoData.mockReturnValue(mongoData);
      mockCollection.replaceOne.mockResolvedValue({
        acknowledged: true,
        matchedCount: 1,
        modifiedCount: 1,
        upsertedCount: 0,
        upsertedId: null,
      } as any);

      await repository.save(viewModel);

      expect(
        mockSubscriptionPlanMongoDBMapper.toMongoData,
      ).toHaveBeenCalledWith(viewModel);
      expect(mockCollection.replaceOne).toHaveBeenCalledWith(
        { id: subscriptionPlanId },
        mongoData,
        { upsert: true },
      );
    });
  });

  describe('delete', () => {
    it('should delete subscription plan view model and return true', async () => {
      const subscriptionPlanId = '123e4567-e89b-12d3-a456-426614174000';

      mockCollection.deleteOne.mockResolvedValue({
        acknowledged: true,
        deletedCount: 1,
      } as any);

      const result = await repository.delete(subscriptionPlanId);

      expect(result).toBe(true);
      expect(mockCollection.deleteOne).toHaveBeenCalledWith({
        id: subscriptionPlanId,
      });
      expect(mockCollection.deleteOne).toHaveBeenCalledTimes(1);
    });

    it('should return true even when subscription plan does not exist', async () => {
      const subscriptionPlanId = '123e4567-e89b-12d3-a456-426614174000';

      mockCollection.deleteOne.mockResolvedValue({
        acknowledged: true,
        deletedCount: 0,
      } as any);

      const result = await repository.delete(subscriptionPlanId);

      expect(result).toBe(true);
      expect(mockCollection.deleteOne).toHaveBeenCalledWith({
        id: subscriptionPlanId,
      });
    });
  });
});
