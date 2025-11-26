import { SubscriptionPlanViewModelFactory } from '@/billing-context/subscription-plan/domain/factories/subscription-plan-view-model/subscription-plan-view-model.factory';
import { SubscriptionPlanViewModel } from '@/billing-context/subscription-plan/domain/view-models/subscription-plan.view-model';
import { SubscriptionPlanMongoDBMapper } from '@/billing-context/subscription-plan/infrastructure/database/mongodb/mappers/subscription-plan-mongodb.mapper';
import { SubscriptionPlanMongoDbDto } from '@/billing-context/subscription-plan/infrastructure/database/mongodb/dtos/subscription-plan-mongodb.dto';
import { SubscriptionPlanTypeEnum } from '@/billing-context/subscription-plan/domain/enum/subscription-plan-type.enum';
import { SubscriptionPlanCurrencyEnum } from '@/billing-context/subscription-plan/domain/enum/subscription-plan-currency.enum';
import { SubscriptionPlanIntervalEnum } from '@/billing-context/subscription-plan/domain/enum/subscription-plan-interval.enum';
import { ISubscriptionPlanCreateViewModelDto } from '@/billing-context/subscription-plan/domain/dtos/view-models/subscription-plan-create-view-model/subscription-plan-create-view-model.dto';

describe('SubscriptionPlanMongoDBMapper', () => {
  let mapper: SubscriptionPlanMongoDBMapper;
  let mockSubscriptionPlanViewModelFactory: jest.Mocked<SubscriptionPlanViewModelFactory>;

  beforeEach(() => {
    mockSubscriptionPlanViewModelFactory = {
      create: jest.fn(),
      fromPrimitives: jest.fn(),
      fromAggregate: jest.fn(),
    } as unknown as jest.Mocked<SubscriptionPlanViewModelFactory>;

    mapper = new SubscriptionPlanMongoDBMapper(
      mockSubscriptionPlanViewModelFactory,
    );
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('toViewModel', () => {
    it('should convert MongoDB document to view model with all properties', () => {
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

      const mockViewModelDto: ISubscriptionPlanCreateViewModelDto = {
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
      const mockViewModel = new SubscriptionPlanViewModel(mockViewModelDto);

      mockSubscriptionPlanViewModelFactory.create.mockReturnValue(
        mockViewModel,
      );

      const result = mapper.toViewModel(mongoDoc);

      expect(result).toBe(mockViewModel);
      expect(mockSubscriptionPlanViewModelFactory.create).toHaveBeenCalledWith({
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
      expect(mockSubscriptionPlanViewModelFactory.create).toHaveBeenCalledTimes(
        1,
      );
    });

    it('should convert MongoDB document to view model with null optional properties', () => {
      const subscriptionPlanId = '123e4567-e89b-12d3-a456-426614174000';
      const createdAt = new Date('2024-01-01');
      const updatedAt = new Date('2024-01-02');
      const mongoDoc: SubscriptionPlanMongoDbDto = {
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

      const mockViewModelDto: ISubscriptionPlanCreateViewModelDto = {
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
      const mockViewModel = new SubscriptionPlanViewModel(mockViewModelDto);

      mockSubscriptionPlanViewModelFactory.create.mockReturnValue(
        mockViewModel,
      );

      const result = mapper.toViewModel(mongoDoc);

      expect(result).toBe(mockViewModel);
      expect(mockSubscriptionPlanViewModelFactory.create).toHaveBeenCalledWith({
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

    it('should convert MongoDB document with PRO type and YEARLY interval', () => {
      const subscriptionPlanId = '123e4567-e89b-12d3-a456-426614174000';
      const createdAt = new Date('2024-01-01');
      const updatedAt = new Date('2024-01-02');
      const mongoDoc: SubscriptionPlanMongoDbDto = {
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

      const mockViewModelDto: ISubscriptionPlanCreateViewModelDto = {
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
      const mockViewModel = new SubscriptionPlanViewModel(mockViewModelDto);

      mockSubscriptionPlanViewModelFactory.create.mockReturnValue(
        mockViewModel,
      );

      const result = mapper.toViewModel(mongoDoc);

      expect(result).toBe(mockViewModel);
      expect(mockSubscriptionPlanViewModelFactory.create).toHaveBeenCalledWith({
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

  describe('toMongoData', () => {
    it('should convert view model to MongoDB data with all properties', () => {
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

      const result = mapper.toMongoData(viewModel);

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

    it('should convert view model to MongoDB data with null optional properties', () => {
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

      const result = mapper.toMongoData(viewModel);

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

    it('should convert view model with PRO type and YEARLY interval', () => {
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

      const result = mapper.toMongoData(viewModel);

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
});
