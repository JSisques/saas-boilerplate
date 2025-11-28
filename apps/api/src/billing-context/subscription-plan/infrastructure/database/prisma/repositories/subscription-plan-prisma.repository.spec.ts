import { SubscriptionPlanAggregate } from '@/billing-context/subscription-plan/domain/aggregates/subscription-plan.aggregate';
import { SubscriptionPlanCurrencyEnum } from '@/billing-context/subscription-plan/domain/enum/subscription-plan-currency.enum';
import { SubscriptionPlanIntervalEnum } from '@/billing-context/subscription-plan/domain/enum/subscription-plan-interval.enum';
import { SubscriptionPlanTypeEnum } from '@/billing-context/subscription-plan/domain/enum/subscription-plan-type.enum';
import { SubscriptionPlanCurrencyValueObject } from '@/billing-context/subscription-plan/domain/value-objects/subscription-plan-currency/subscription-plan-currency.vo';
import { SubscriptionPlanDescriptionValueObject } from '@/billing-context/subscription-plan/domain/value-objects/subscription-plan-description/subscription-plan-description.vo';
import { SubscriptionPlanFeaturesValueObject } from '@/billing-context/subscription-plan/domain/value-objects/subscription-plan-features/subscription-plan-features.vo';
import { SubscriptionPlanIntervalCountValueObject } from '@/billing-context/subscription-plan/domain/value-objects/subscription-plan-interval-count/subscription-plan-interval-count.vo';
import { SubscriptionPlanIntervalValueObject } from '@/billing-context/subscription-plan/domain/value-objects/subscription-plan-interval/subscription-plan-interval.vo';
import { SubscriptionPlanIsActiveValueObject } from '@/billing-context/subscription-plan/domain/value-objects/subscription-plan-is-active/subscription-plan-is-active.vo';
import { SubscriptionPlanLimitsValueObject } from '@/billing-context/subscription-plan/domain/value-objects/subscription-plan-limits/subscription-plan-limits.vo';
import { SubscriptionPlanNameValueObject } from '@/billing-context/subscription-plan/domain/value-objects/subscription-plan-name/subscription-plan-name.vo';
import { SubscriptionPlanPriceMonthlyValueObject } from '@/billing-context/subscription-plan/domain/value-objects/subscription-plan-price-monthly/subscription-plan-price-monthly.vo';
import { SubscriptionPlanPriceYearlyValueObject } from '@/billing-context/subscription-plan/domain/value-objects/subscription-plan-price-yearly/subscription-plan-price-yearly.vo';
import { SubscriptionPlanSlugValueObject } from '@/billing-context/subscription-plan/domain/value-objects/subscription-plan-slug/subscription-plan-slug.vo';
import { SubscriptionPlanStripePriceIdValueObject } from '@/billing-context/subscription-plan/domain/value-objects/subscription-plan-stripe-price-id/subscription-plan-stripe-price-id.vo';
import { SubscriptionPlanTrialPeriodDaysValueObject } from '@/billing-context/subscription-plan/domain/value-objects/subscription-plan-trial-period-days/subscription-plan-trial-period-days.vo';
import { SubscriptionPlanTypeValueObject } from '@/billing-context/subscription-plan/domain/value-objects/subscription-plan-type/subscription-plan-type.vo';
import { SubscriptionPlanPrismaDto } from '@/billing-context/subscription-plan/infrastructure/database/prisma/dtos/subscription-plan-prisma.dto';
import { SubscriptionPlanPrismaMapper } from '@/billing-context/subscription-plan/infrastructure/database/prisma/mappers/subscription-plan-prisma.mapper';
import { SubscriptionPlanPrismaRepository } from '@/billing-context/subscription-plan/infrastructure/database/prisma/repositories/subscription-plan-prisma.repository';
import {
  CurrencyEnum as PrismaCurrencyEnum,
  SubscriptionPlanIntervalEnum as PrismaSubscriptionPlanIntervalEnum,
  SubscriptionPlanTypeEnum as PrismaSubscriptionPlanTypeEnum,
} from '@/prisma/master/client';
import { DateValueObject } from '@/shared/domain/value-objects/date/date.vo';
import { SubscriptionPlanUuidValueObject } from '@/shared/domain/value-objects/identifiers/subscription-plan/subscription-plan-uuid.vo';

describe('SubscriptionPlanPrismaRepository', () => {
  let repository: SubscriptionPlanPrismaRepository;
  let mockPrismaService: any;
  let mockSubscriptionPlanPrismaMapper: jest.Mocked<SubscriptionPlanPrismaMapper>;
  let mockFindUnique: jest.Mock;
  let mockFindFirst: jest.Mock;
  let mockUpsert: jest.Mock;
  let mockDelete: jest.Mock;

  beforeEach(() => {
    mockFindUnique = jest.fn();
    mockFindFirst = jest.fn();
    mockUpsert = jest.fn();
    mockDelete = jest.fn();

    mockPrismaService = {
      client: {
        subscriptionPlan: {
          findUnique: mockFindUnique,
          findFirst: mockFindFirst,
          upsert: mockUpsert,
          delete: mockDelete,
        },
      },
    };

    mockSubscriptionPlanPrismaMapper = {
      toDomainEntity: jest.fn(),
      toPrismaData: jest.fn(),
    } as unknown as jest.Mocked<SubscriptionPlanPrismaMapper>;

    repository = new SubscriptionPlanPrismaRepository(
      mockPrismaService,
      mockSubscriptionPlanPrismaMapper,
    );
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('findById', () => {
    it('should return subscription plan aggregate when plan exists', async () => {
      const subscriptionPlanId = '123e4567-e89b-12d3-a456-426614174000';
      const now = new Date();

      const subscriptionPlanAggregate = new SubscriptionPlanAggregate(
        {
          id: new SubscriptionPlanUuidValueObject(subscriptionPlanId),
          name: new SubscriptionPlanNameValueObject('Basic Plan'),
          slug: new SubscriptionPlanSlugValueObject('basic-plan'),
          type: new SubscriptionPlanTypeValueObject(
            SubscriptionPlanTypeEnum.BASIC,
          ),
          description: new SubscriptionPlanDescriptionValueObject(
            'Basic subscription plan',
          ),
          priceMonthly: new SubscriptionPlanPriceMonthlyValueObject(10.0),
          priceYearly: new SubscriptionPlanPriceYearlyValueObject(100.0),
          currency: new SubscriptionPlanCurrencyValueObject(
            SubscriptionPlanCurrencyEnum.USD,
          ),
          interval: new SubscriptionPlanIntervalValueObject(
            SubscriptionPlanIntervalEnum.MONTHLY,
          ),
          intervalCount: new SubscriptionPlanIntervalCountValueObject(1),
          trialPeriodDays: new SubscriptionPlanTrialPeriodDaysValueObject(7),
          isActive: new SubscriptionPlanIsActiveValueObject(true),
          features: new SubscriptionPlanFeaturesValueObject({
            apiAccess: true,
          }),
          limits: new SubscriptionPlanLimitsValueObject({ maxUsers: 10 }),
          stripePriceId: new SubscriptionPlanStripePriceIdValueObject(
            'price_1234567890',
          ),
          createdAt: new DateValueObject(now),
          updatedAt: new DateValueObject(now),
        },
        false,
      );

      mockFindUnique.mockResolvedValue({
        id: subscriptionPlanId,
        name: 'Basic Plan',
        slug: 'basic-plan',
        type: PrismaSubscriptionPlanTypeEnum.BASIC,
        description: 'Basic subscription plan',
        priceMonthly: { toNumber: () => 10.0 },
        priceYearly: { toNumber: () => 100.0 },
        currency: PrismaCurrencyEnum.USD,
        interval: PrismaSubscriptionPlanIntervalEnum.MONTHLY,
        intervalCount: 1,
        trialPeriodDays: 7,
        isActive: true,
        features: { apiAccess: true },
        limits: { maxUsers: 10 },
        stripePriceId: 'price_1234567890',
        createdAt: now,
        updatedAt: now,
      });
      mockSubscriptionPlanPrismaMapper.toDomainEntity.mockReturnValue(
        subscriptionPlanAggregate,
      );

      const result = await repository.findById(subscriptionPlanId);

      expect(result).toBe(subscriptionPlanAggregate);
      expect(mockFindUnique).toHaveBeenCalledWith({
        where: { id: subscriptionPlanId },
      });
      expect(
        mockSubscriptionPlanPrismaMapper.toDomainEntity,
      ).toHaveBeenCalledWith({
        id: subscriptionPlanId,
        name: 'Basic Plan',
        slug: 'basic-plan',
        type: PrismaSubscriptionPlanTypeEnum.BASIC,
        description: 'Basic subscription plan',
        priceMonthly: 10.0,
        priceYearly: 100.0,
        currency: PrismaCurrencyEnum.USD,
        interval: PrismaSubscriptionPlanIntervalEnum.MONTHLY,
        intervalCount: 1,
        trialPeriodDays: 7,
        isActive: true,
        features: { apiAccess: true },
        limits: { maxUsers: 10 },
        stripePriceId: 'price_1234567890',
        createdAt: now,
        updatedAt: now,
      });
      expect(
        mockSubscriptionPlanPrismaMapper.toDomainEntity,
      ).toHaveBeenCalledTimes(1);
    });

    it('should return null when subscription plan does not exist', async () => {
      const subscriptionPlanId = '123e4567-e89b-12d3-a456-426614174000';

      mockFindUnique.mockResolvedValue(null);

      const result = await repository.findById(subscriptionPlanId);

      expect(result).toBeNull();
      expect(mockFindUnique).toHaveBeenCalledWith({
        where: { id: subscriptionPlanId },
      });
      expect(
        mockSubscriptionPlanPrismaMapper.toDomainEntity,
      ).not.toHaveBeenCalled();
    });
  });

  describe('findBySlug', () => {
    it('should return subscription plan aggregate when plan exists', async () => {
      const subscriptionPlanId = '123e4567-e89b-12d3-a456-426614174000';
      const slug = 'basic-plan';
      const now = new Date();

      const subscriptionPlanAggregate = new SubscriptionPlanAggregate(
        {
          id: new SubscriptionPlanUuidValueObject(subscriptionPlanId),
          name: new SubscriptionPlanNameValueObject('Basic Plan'),
          slug: new SubscriptionPlanSlugValueObject(slug),
          type: new SubscriptionPlanTypeValueObject(
            SubscriptionPlanTypeEnum.BASIC,
          ),
          description: new SubscriptionPlanDescriptionValueObject(
            'Basic subscription plan',
          ),
          priceMonthly: new SubscriptionPlanPriceMonthlyValueObject(10.0),
          priceYearly: new SubscriptionPlanPriceYearlyValueObject(100.0),
          currency: new SubscriptionPlanCurrencyValueObject(
            SubscriptionPlanCurrencyEnum.USD,
          ),
          interval: new SubscriptionPlanIntervalValueObject(
            SubscriptionPlanIntervalEnum.MONTHLY,
          ),
          intervalCount: new SubscriptionPlanIntervalCountValueObject(1),
          trialPeriodDays: new SubscriptionPlanTrialPeriodDaysValueObject(7),
          isActive: new SubscriptionPlanIsActiveValueObject(true),
          features: new SubscriptionPlanFeaturesValueObject({
            apiAccess: true,
          }),
          limits: new SubscriptionPlanLimitsValueObject({ maxUsers: 10 }),
          stripePriceId: new SubscriptionPlanStripePriceIdValueObject(
            'price_1234567890',
          ),
          createdAt: new DateValueObject(now),
          updatedAt: new DateValueObject(now),
        },
        false,
      );

      mockFindFirst.mockResolvedValue({
        id: subscriptionPlanId,
        name: 'Basic Plan',
        slug,
        type: PrismaSubscriptionPlanTypeEnum.BASIC,
        description: 'Basic subscription plan',
        priceMonthly: { toNumber: () => 10.0 },
        priceYearly: { toNumber: () => 100.0 },
        currency: PrismaCurrencyEnum.USD,
        interval: PrismaSubscriptionPlanIntervalEnum.MONTHLY,
        intervalCount: 1,
        trialPeriodDays: 7,
        isActive: true,
        features: { apiAccess: true },
        limits: { maxUsers: 10 },
        stripePriceId: 'price_1234567890',
        createdAt: now,
        updatedAt: now,
      });
      mockSubscriptionPlanPrismaMapper.toDomainEntity.mockReturnValue(
        subscriptionPlanAggregate,
      );

      const result = await repository.findBySlug(slug);

      expect(result).toBe(subscriptionPlanAggregate);
      expect(mockFindFirst).toHaveBeenCalledWith({
        where: { slug },
      });
      expect(
        mockSubscriptionPlanPrismaMapper.toDomainEntity,
      ).toHaveBeenCalledWith({
        id: subscriptionPlanId,
        name: 'Basic Plan',
        slug,
        type: PrismaSubscriptionPlanTypeEnum.BASIC,
        description: 'Basic subscription plan',
        priceMonthly: 10.0,
        priceYearly: 100.0,
        currency: PrismaCurrencyEnum.USD,
        interval: PrismaSubscriptionPlanIntervalEnum.MONTHLY,
        intervalCount: 1,
        trialPeriodDays: 7,
        isActive: true,
        features: { apiAccess: true },
        limits: { maxUsers: 10 },
        stripePriceId: 'price_1234567890',
        createdAt: now,
        updatedAt: now,
      });
    });

    it('should return null when subscription plan does not exist', async () => {
      const slug = 'basic-plan';

      mockFindFirst.mockResolvedValue(null);

      const result = await repository.findBySlug(slug);

      expect(result).toBeNull();
      expect(mockFindFirst).toHaveBeenCalledWith({
        where: { slug },
      });
      expect(
        mockSubscriptionPlanPrismaMapper.toDomainEntity,
      ).not.toHaveBeenCalled();
    });
  });

  describe('findByType', () => {
    it('should return subscription plan aggregate when plan exists', async () => {
      const subscriptionPlanId = '123e4567-e89b-12d3-a456-426614174000';
      const type = PrismaSubscriptionPlanTypeEnum.BASIC;
      const now = new Date();

      const subscriptionPlanAggregate = new SubscriptionPlanAggregate(
        {
          id: new SubscriptionPlanUuidValueObject(subscriptionPlanId),
          name: new SubscriptionPlanNameValueObject('Basic Plan'),
          slug: new SubscriptionPlanSlugValueObject('basic-plan'),
          type: new SubscriptionPlanTypeValueObject(
            SubscriptionPlanTypeEnum.BASIC,
          ),
          description: new SubscriptionPlanDescriptionValueObject(
            'Basic subscription plan',
          ),
          priceMonthly: new SubscriptionPlanPriceMonthlyValueObject(10.0),
          priceYearly: new SubscriptionPlanPriceYearlyValueObject(100.0),
          currency: new SubscriptionPlanCurrencyValueObject(
            SubscriptionPlanCurrencyEnum.USD,
          ),
          interval: new SubscriptionPlanIntervalValueObject(
            SubscriptionPlanIntervalEnum.MONTHLY,
          ),
          intervalCount: new SubscriptionPlanIntervalCountValueObject(1),
          trialPeriodDays: new SubscriptionPlanTrialPeriodDaysValueObject(7),
          isActive: new SubscriptionPlanIsActiveValueObject(true),
          features: new SubscriptionPlanFeaturesValueObject({
            apiAccess: true,
          }),
          limits: new SubscriptionPlanLimitsValueObject({ maxUsers: 10 }),
          stripePriceId: new SubscriptionPlanStripePriceIdValueObject(
            'price_1234567890',
          ),
          createdAt: new DateValueObject(now),
          updatedAt: new DateValueObject(now),
        },
        false,
      );

      mockFindFirst.mockResolvedValue({
        id: subscriptionPlanId,
        name: 'Basic Plan',
        slug: 'basic-plan',
        type,
        description: 'Basic subscription plan',
        priceMonthly: { toNumber: () => 10.0 },
        priceYearly: { toNumber: () => 100.0 },
        currency: PrismaCurrencyEnum.USD,
        interval: PrismaSubscriptionPlanIntervalEnum.MONTHLY,
        intervalCount: 1,
        trialPeriodDays: 7,
        isActive: true,
        features: { apiAccess: true },
        limits: { maxUsers: 10 },
        stripePriceId: 'price_1234567890',
        createdAt: now,
        updatedAt: now,
      });
      mockSubscriptionPlanPrismaMapper.toDomainEntity.mockReturnValue(
        subscriptionPlanAggregate,
      );

      const result = await repository.findByType(type);

      expect(result).toBe(subscriptionPlanAggregate);
      expect(mockFindFirst).toHaveBeenCalledWith({
        where: { type },
      });
      expect(
        mockSubscriptionPlanPrismaMapper.toDomainEntity,
      ).toHaveBeenCalledWith({
        id: subscriptionPlanId,
        name: 'Basic Plan',
        slug: 'basic-plan',
        type,
        description: 'Basic subscription plan',
        priceMonthly: 10.0,
        priceYearly: 100.0,
        currency: PrismaCurrencyEnum.USD,
        interval: PrismaSubscriptionPlanIntervalEnum.MONTHLY,
        intervalCount: 1,
        trialPeriodDays: 7,
        isActive: true,
        features: { apiAccess: true },
        limits: { maxUsers: 10 },
        stripePriceId: 'price_1234567890',
        createdAt: now,
        updatedAt: now,
      });
    });

    it('should return null when subscription plan does not exist', async () => {
      const type = PrismaSubscriptionPlanTypeEnum.BASIC;

      mockFindFirst.mockResolvedValue(null);

      const result = await repository.findByType(type);

      expect(result).toBeNull();
      expect(mockFindFirst).toHaveBeenCalledWith({
        where: { type },
      });
      expect(
        mockSubscriptionPlanPrismaMapper.toDomainEntity,
      ).not.toHaveBeenCalled();
    });
  });

  describe('save', () => {
    it('should save subscription plan aggregate and return saved aggregate', async () => {
      const subscriptionPlanId = '123e4567-e89b-12d3-a456-426614174000';
      const now = new Date();

      const subscriptionPlanAggregate = new SubscriptionPlanAggregate(
        {
          id: new SubscriptionPlanUuidValueObject(subscriptionPlanId),
          name: new SubscriptionPlanNameValueObject('Basic Plan'),
          slug: new SubscriptionPlanSlugValueObject('basic-plan'),
          type: new SubscriptionPlanTypeValueObject(
            SubscriptionPlanTypeEnum.BASIC,
          ),
          description: new SubscriptionPlanDescriptionValueObject(
            'Basic subscription plan',
          ),
          priceMonthly: new SubscriptionPlanPriceMonthlyValueObject(10.0),
          priceYearly: new SubscriptionPlanPriceYearlyValueObject(100.0),
          currency: new SubscriptionPlanCurrencyValueObject(
            SubscriptionPlanCurrencyEnum.USD,
          ),
          interval: new SubscriptionPlanIntervalValueObject(
            SubscriptionPlanIntervalEnum.MONTHLY,
          ),
          intervalCount: new SubscriptionPlanIntervalCountValueObject(1),
          trialPeriodDays: new SubscriptionPlanTrialPeriodDaysValueObject(7),
          isActive: new SubscriptionPlanIsActiveValueObject(true),
          features: new SubscriptionPlanFeaturesValueObject({
            apiAccess: true,
          }),
          limits: new SubscriptionPlanLimitsValueObject({ maxUsers: 10 }),
          stripePriceId: new SubscriptionPlanStripePriceIdValueObject(
            'price_1234567890',
          ),
          createdAt: new DateValueObject(now),
          updatedAt: new DateValueObject(now),
        },
        false,
      );

      const prismaData: SubscriptionPlanPrismaDto = {
        id: subscriptionPlanId,
        name: 'Basic Plan',
        slug: 'basic-plan',
        type: PrismaSubscriptionPlanTypeEnum.BASIC,
        description: 'Basic subscription plan',
        priceMonthly: 10.0,
        priceYearly: 100.0,
        currency: PrismaCurrencyEnum.USD,
        interval: PrismaSubscriptionPlanIntervalEnum.MONTHLY,
        intervalCount: 1,
        trialPeriodDays: 7,
        isActive: true,
        features: { apiAccess: true },
        limits: { maxUsers: 10 },
        stripePriceId: 'price_1234567890',
        createdAt: now,
        updatedAt: now,
      };

      const savedPrismaData = {
        id: subscriptionPlanId,
        name: 'Basic Plan',
        slug: 'basic-plan',
        type: PrismaSubscriptionPlanTypeEnum.BASIC,
        description: 'Basic subscription plan',
        priceMonthly: { toNumber: () => 10.0 },
        priceYearly: { toNumber: () => 100.0 },
        currency: PrismaCurrencyEnum.USD,
        interval: PrismaSubscriptionPlanIntervalEnum.MONTHLY,
        intervalCount: 1,
        trialPeriodDays: 7,
        isActive: true,
        features: { apiAccess: true },
        limits: { maxUsers: 10 },
        stripePriceId: 'price_1234567890',
        createdAt: now,
        updatedAt: now,
      };

      const savedSubscriptionPlanAggregate = new SubscriptionPlanAggregate(
        {
          id: new SubscriptionPlanUuidValueObject(subscriptionPlanId),
          name: new SubscriptionPlanNameValueObject('Basic Plan'),
          slug: new SubscriptionPlanSlugValueObject('basic-plan'),
          type: new SubscriptionPlanTypeValueObject(
            SubscriptionPlanTypeEnum.BASIC,
          ),
          description: new SubscriptionPlanDescriptionValueObject(
            'Basic subscription plan',
          ),
          priceMonthly: new SubscriptionPlanPriceMonthlyValueObject(10.0),
          priceYearly: new SubscriptionPlanPriceYearlyValueObject(100.0),
          currency: new SubscriptionPlanCurrencyValueObject(
            SubscriptionPlanCurrencyEnum.USD,
          ),
          interval: new SubscriptionPlanIntervalValueObject(
            SubscriptionPlanIntervalEnum.MONTHLY,
          ),
          intervalCount: new SubscriptionPlanIntervalCountValueObject(1),
          trialPeriodDays: new SubscriptionPlanTrialPeriodDaysValueObject(7),
          isActive: new SubscriptionPlanIsActiveValueObject(true),
          features: new SubscriptionPlanFeaturesValueObject({
            apiAccess: true,
          }),
          limits: new SubscriptionPlanLimitsValueObject({ maxUsers: 10 }),
          stripePriceId: new SubscriptionPlanStripePriceIdValueObject(
            'price_1234567890',
          ),
          createdAt: new DateValueObject(now),
          updatedAt: new DateValueObject(now),
        },
        false,
      );

      mockSubscriptionPlanPrismaMapper.toPrismaData.mockReturnValue(prismaData);
      mockUpsert.mockResolvedValue(savedPrismaData);
      mockSubscriptionPlanPrismaMapper.toDomainEntity.mockReturnValue(
        savedSubscriptionPlanAggregate,
      );

      const result = await repository.save(subscriptionPlanAggregate);

      expect(result).toBe(savedSubscriptionPlanAggregate);
      expect(
        mockSubscriptionPlanPrismaMapper.toPrismaData,
      ).toHaveBeenCalledWith(subscriptionPlanAggregate);
      expect(mockUpsert).toHaveBeenCalledWith({
        where: { id: subscriptionPlanId },
        update: prismaData,
        create: prismaData,
      });
      expect(
        mockSubscriptionPlanPrismaMapper.toDomainEntity,
      ).toHaveBeenCalledWith({
        id: subscriptionPlanId,
        name: 'Basic Plan',
        slug: 'basic-plan',
        type: PrismaSubscriptionPlanTypeEnum.BASIC,
        description: 'Basic subscription plan',
        priceMonthly: 10.0,
        priceYearly: 100.0,
        currency: PrismaCurrencyEnum.USD,
        interval: PrismaSubscriptionPlanIntervalEnum.MONTHLY,
        intervalCount: 1,
        trialPeriodDays: 7,
        isActive: true,
        features: { apiAccess: true },
        limits: { maxUsers: 10 },
        stripePriceId: 'price_1234567890',
        createdAt: now,
        updatedAt: now,
      });
    });

    it('should handle upsert operation for existing subscription plan', async () => {
      const subscriptionPlanId = '123e4567-e89b-12d3-a456-426614174000';
      const now = new Date();

      const subscriptionPlanAggregate = new SubscriptionPlanAggregate(
        {
          id: new SubscriptionPlanUuidValueObject(subscriptionPlanId),
          name: new SubscriptionPlanNameValueObject('Pro Plan'),
          slug: new SubscriptionPlanSlugValueObject('pro-plan'),
          type: new SubscriptionPlanTypeValueObject(
            SubscriptionPlanTypeEnum.PRO,
          ),
          description: new SubscriptionPlanDescriptionValueObject(
            'Professional plan',
          ),
          priceMonthly: new SubscriptionPlanPriceMonthlyValueObject(29.99),
          priceYearly: new SubscriptionPlanPriceYearlyValueObject(299.99),
          currency: new SubscriptionPlanCurrencyValueObject(
            SubscriptionPlanCurrencyEnum.EUR,
          ),
          interval: new SubscriptionPlanIntervalValueObject(
            SubscriptionPlanIntervalEnum.YEARLY,
          ),
          intervalCount: new SubscriptionPlanIntervalCountValueObject(1),
          trialPeriodDays: new SubscriptionPlanTrialPeriodDaysValueObject(14),
          isActive: new SubscriptionPlanIsActiveValueObject(true),
          features: new SubscriptionPlanFeaturesValueObject({
            apiAccess: true,
            prioritySupport: true,
          }),
          limits: new SubscriptionPlanLimitsValueObject({ maxUsers: 100 }),
          stripePriceId: new SubscriptionPlanStripePriceIdValueObject(
            'price_pro123',
          ),
          createdAt: new DateValueObject(now),
          updatedAt: new DateValueObject(now),
        },
        false,
      );

      const prismaData: SubscriptionPlanPrismaDto = {
        id: subscriptionPlanId,
        name: 'Pro Plan',
        slug: 'pro-plan',
        type: PrismaSubscriptionPlanTypeEnum.PRO,
        description: 'Professional plan',
        priceMonthly: 29.99,
        priceYearly: 299.99,
        currency: PrismaCurrencyEnum.EUR,
        interval: PrismaSubscriptionPlanIntervalEnum.YEARLY,
        intervalCount: 1,
        trialPeriodDays: 14,
        isActive: true,
        features: { apiAccess: true, prioritySupport: true },
        limits: { maxUsers: 100 },
        stripePriceId: 'price_pro123',
        createdAt: now,
        updatedAt: now,
      };

      const savedPrismaData = {
        id: subscriptionPlanId,
        name: 'Pro Plan',
        slug: 'pro-plan',
        type: PrismaSubscriptionPlanTypeEnum.PRO,
        description: 'Professional plan',
        priceMonthly: { toNumber: () => 29.99 },
        priceYearly: { toNumber: () => 299.99 },
        currency: PrismaCurrencyEnum.EUR,
        interval: PrismaSubscriptionPlanIntervalEnum.YEARLY,
        intervalCount: 1,
        trialPeriodDays: 14,
        isActive: true,
        features: { apiAccess: true, prioritySupport: true },
        limits: { maxUsers: 100 },
        stripePriceId: 'price_pro123',
        createdAt: now,
        updatedAt: now,
      };

      mockSubscriptionPlanPrismaMapper.toPrismaData.mockReturnValue(prismaData);
      mockUpsert.mockResolvedValue(savedPrismaData);
      mockSubscriptionPlanPrismaMapper.toDomainEntity.mockReturnValue(
        subscriptionPlanAggregate,
      );

      const result = await repository.save(subscriptionPlanAggregate);

      expect(result).toBe(subscriptionPlanAggregate);
      expect(mockUpsert).toHaveBeenCalledWith({
        where: { id: subscriptionPlanId },
        update: prismaData,
        create: prismaData,
      });
    });
  });

  describe('delete', () => {
    it('should delete subscription plan and return true', async () => {
      const subscriptionPlanId = '123e4567-e89b-12d3-a456-426614174000';

      mockDelete.mockResolvedValue({
        id: subscriptionPlanId,
        name: 'Basic Plan',
        slug: 'basic-plan',
        type: PrismaSubscriptionPlanTypeEnum.BASIC,
      });

      const result = await repository.delete(subscriptionPlanId);

      expect(result).toBe(true);
      expect(mockDelete).toHaveBeenCalledWith({
        where: { id: subscriptionPlanId },
      });
      expect(mockDelete).toHaveBeenCalledTimes(1);
    });
  });
});
