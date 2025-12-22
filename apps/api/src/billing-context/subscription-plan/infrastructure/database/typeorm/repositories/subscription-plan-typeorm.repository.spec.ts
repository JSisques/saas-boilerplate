import { SubscriptionPlanAggregate } from '@/billing-context/subscription-plan/domain/aggregates/subscription-plan.aggregate';
import { SubscriptionPlanCurrencyEnum } from '@/billing-context/subscription-plan/domain/enum/subscription-plan-currency/subscription-plan-currency.enum';
import { SubscriptionPlanCurrencyValueObject } from '@/billing-context/subscription-plan/domain/value-objects/subscription-plan-currency/subscription-plan-currency.vo';
import { SubscriptionPlanIntervalCountValueObject } from '@/billing-context/subscription-plan/domain/value-objects/subscription-plan-interval-count/subscription-plan-interval-count.vo';
import { SubscriptionPlanIntervalValueObject } from '@/billing-context/subscription-plan/domain/value-objects/subscription-plan-interval/subscription-plan-interval.vo';
import { SubscriptionPlanIsActiveValueObject } from '@/billing-context/subscription-plan/domain/value-objects/subscription-plan-is-active/subscription-plan-is-active.vo';
import { SubscriptionPlanNameValueObject } from '@/billing-context/subscription-plan/domain/value-objects/subscription-plan-name/subscription-plan-name.vo';
import { SubscriptionPlanPriceMonthlyValueObject } from '@/billing-context/subscription-plan/domain/value-objects/subscription-plan-price-monthly/subscription-plan-price-monthly.vo';
import { SubscriptionPlanPriceYearlyValueObject } from '@/billing-context/subscription-plan/domain/value-objects/subscription-plan-price-yearly/subscription-plan-price-yearly.vo';
import { SubscriptionPlanSlugValueObject } from '@/billing-context/subscription-plan/domain/value-objects/subscription-plan-slug/subscription-plan-slug.vo';
import { SubscriptionPlanTypeValueObject } from '@/billing-context/subscription-plan/domain/value-objects/subscription-plan-type/subscription-plan-type.vo';
import { SubscriptionPlanTypeormEntity } from '@/billing-context/subscription-plan/infrastructure/database/typeorm/entities/subscription-plan-typeorm.entity';
import { SubscriptionPlanTypeormMapper } from '@/billing-context/subscription-plan/infrastructure/database/typeorm/mappers/subscription-plan-typeorm.mapper';
import { SubscriptionPlanTypeormRepository } from '@/billing-context/subscription-plan/infrastructure/database/typeorm/repositories/subscription-plan-typeorm.repository';
import { SubscriptionPlanIntervalEnum } from '@/shared/domain/enums/billing-context/subscription-plans/subscription-plan-interval/subscription-plan-interval.enum';
import { SubscriptionPlanTypeEnum } from '@/shared/domain/enums/billing-context/subscription-plans/subscription-plan-type/subscription-plan-type.enum';
import { DateValueObject } from '@/shared/domain/value-objects/date/date.vo';
import { SubscriptionPlanUuidValueObject } from '@/shared/domain/value-objects/identifiers/subscription-plan/subscription-plan-uuid.vo';
import { TypeormMasterService } from '@/shared/infrastructure/database/typeorm/services/typeorm-master/typeorm-master.service';
import { Repository } from 'typeorm';

describe('SubscriptionPlanTypeormRepository', () => {
  let repository: SubscriptionPlanTypeormRepository;
  let mockTypeormMasterService: jest.Mocked<TypeormMasterService>;
  let mockSubscriptionPlanTypeormMapper: jest.Mocked<SubscriptionPlanTypeormMapper>;
  let mockTypeormRepository: jest.Mocked<
    Repository<SubscriptionPlanTypeormEntity>
  >;
  let mockFindOne: jest.Mock;
  let mockSave: jest.Mock;
  let mockSoftDelete: jest.Mock;

  beforeEach(() => {
    mockFindOne = jest.fn();
    mockSave = jest.fn();
    mockSoftDelete = jest.fn();

    mockTypeormRepository = {
      findOne: mockFindOne,
      save: mockSave,
      softDelete: mockSoftDelete,
    } as unknown as jest.Mocked<Repository<SubscriptionPlanTypeormEntity>>;

    mockTypeormMasterService = {
      getRepository: jest.fn().mockReturnValue(mockTypeormRepository),
    } as unknown as jest.Mocked<TypeormMasterService>;

    mockSubscriptionPlanTypeormMapper = {
      toDomainEntity: jest.fn(),
      toTypeormEntity: jest.fn(),
    } as unknown as jest.Mocked<SubscriptionPlanTypeormMapper>;

    repository = new SubscriptionPlanTypeormRepository(
      mockTypeormMasterService,
      mockSubscriptionPlanTypeormMapper,
    );
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('findById', () => {
    it('should return subscription plan aggregate when subscription plan exists', async () => {
      const subscriptionPlanId = '123e4567-e89b-12d3-a456-426614174000';
      const now = new Date();

      const typeormEntity = new SubscriptionPlanTypeormEntity();
      typeormEntity.id = subscriptionPlanId;
      typeormEntity.name = 'Pro Plan';
      typeormEntity.slug = 'pro-plan';
      typeormEntity.type = SubscriptionPlanTypeEnum.PRO;
      typeormEntity.createdAt = now;
      typeormEntity.updatedAt = now;

      const subscriptionPlanAggregate = new SubscriptionPlanAggregate(
        {
          id: new SubscriptionPlanUuidValueObject(subscriptionPlanId),
          name: new SubscriptionPlanNameValueObject('Pro Plan'),
          slug: new SubscriptionPlanSlugValueObject('pro-plan'),
          type: new SubscriptionPlanTypeValueObject(
            SubscriptionPlanTypeEnum.PRO,
          ),
          description: null,
          priceMonthly: new SubscriptionPlanPriceMonthlyValueObject(29.99),
          priceYearly: new SubscriptionPlanPriceYearlyValueObject(299.99),
          currency: new SubscriptionPlanCurrencyValueObject(
            SubscriptionPlanCurrencyEnum.USD,
          ),
          interval: new SubscriptionPlanIntervalValueObject(
            SubscriptionPlanIntervalEnum.MONTHLY,
          ),
          intervalCount: new SubscriptionPlanIntervalCountValueObject(1),
          trialPeriodDays: null,
          isActive: new SubscriptionPlanIsActiveValueObject(true),
          features: null,
          limits: null,
          stripePriceId: null,
          createdAt: new DateValueObject(now),
          updatedAt: new DateValueObject(now),
        },
        false,
      );

      mockFindOne.mockResolvedValue(typeormEntity);
      mockSubscriptionPlanTypeormMapper.toDomainEntity.mockReturnValue(
        subscriptionPlanAggregate,
      );

      const result = await repository.findById(subscriptionPlanId);

      expect(result).toBe(subscriptionPlanAggregate);
      expect(mockFindOne).toHaveBeenCalledWith({
        where: { id: subscriptionPlanId },
      });
      expect(
        mockSubscriptionPlanTypeormMapper.toDomainEntity,
      ).toHaveBeenCalledWith(typeormEntity);
    });

    it('should return null when subscription plan does not exist', async () => {
      const subscriptionPlanId = '123e4567-e89b-12d3-a456-426614174000';

      mockFindOne.mockResolvedValue(null);

      const result = await repository.findById(subscriptionPlanId);

      expect(result).toBeNull();
      expect(
        mockSubscriptionPlanTypeormMapper.toDomainEntity,
      ).not.toHaveBeenCalled();
    });
  });

  describe('findBySlug', () => {
    it('should return subscription plan aggregate when subscription plan exists', async () => {
      const subscriptionPlanId = '123e4567-e89b-12d3-a456-426614174000';
      const now = new Date();

      const typeormEntity = new SubscriptionPlanTypeormEntity();
      typeormEntity.id = subscriptionPlanId;
      typeormEntity.name = 'Pro Plan';
      typeormEntity.slug = 'pro-plan';
      typeormEntity.type = SubscriptionPlanTypeEnum.PRO;
      typeormEntity.createdAt = now;
      typeormEntity.updatedAt = now;

      const subscriptionPlanAggregate = new SubscriptionPlanAggregate(
        {
          id: new SubscriptionPlanUuidValueObject(subscriptionPlanId),
          name: new SubscriptionPlanNameValueObject('Pro Plan'),
          slug: new SubscriptionPlanSlugValueObject('pro-plan'),
          type: new SubscriptionPlanTypeValueObject(
            SubscriptionPlanTypeEnum.PRO,
          ),
          description: null,
          priceMonthly: new SubscriptionPlanPriceMonthlyValueObject(29.99),
          priceYearly: new SubscriptionPlanPriceYearlyValueObject(299.99),
          currency: new SubscriptionPlanCurrencyValueObject(
            SubscriptionPlanCurrencyEnum.USD,
          ),
          interval: new SubscriptionPlanIntervalValueObject(
            SubscriptionPlanIntervalEnum.MONTHLY,
          ),
          intervalCount: new SubscriptionPlanIntervalCountValueObject(1),
          trialPeriodDays: null,
          isActive: new SubscriptionPlanIsActiveValueObject(true),
          features: null,
          limits: null,
          stripePriceId: null,
          createdAt: new DateValueObject(now),
          updatedAt: new DateValueObject(now),
        },
        false,
      );

      mockFindOne.mockResolvedValue(typeormEntity);
      mockSubscriptionPlanTypeormMapper.toDomainEntity.mockReturnValue(
        subscriptionPlanAggregate,
      );

      const result = await repository.findBySlug('pro-plan');

      expect(result).toBe(subscriptionPlanAggregate);
      expect(mockFindOne).toHaveBeenCalledWith({
        where: { slug: 'pro-plan' },
      });
    });
  });

  describe('findByType', () => {
    it('should return subscription plan aggregate when subscription plan exists', async () => {
      const subscriptionPlanId = '123e4567-e89b-12d3-a456-426614174000';
      const now = new Date();

      const typeormEntity = new SubscriptionPlanTypeormEntity();
      typeormEntity.id = subscriptionPlanId;
      typeormEntity.name = 'Pro Plan';
      typeormEntity.slug = 'pro-plan';
      typeormEntity.type = SubscriptionPlanTypeEnum.PRO;
      typeormEntity.createdAt = now;
      typeormEntity.updatedAt = now;

      const subscriptionPlanAggregate = new SubscriptionPlanAggregate(
        {
          id: new SubscriptionPlanUuidValueObject(subscriptionPlanId),
          name: new SubscriptionPlanNameValueObject('Pro Plan'),
          slug: new SubscriptionPlanSlugValueObject('pro-plan'),
          type: new SubscriptionPlanTypeValueObject(
            SubscriptionPlanTypeEnum.PRO,
          ),
          description: null,
          priceMonthly: new SubscriptionPlanPriceMonthlyValueObject(29.99),
          priceYearly: new SubscriptionPlanPriceYearlyValueObject(299.99),
          currency: new SubscriptionPlanCurrencyValueObject(
            SubscriptionPlanCurrencyEnum.USD,
          ),
          interval: new SubscriptionPlanIntervalValueObject(
            SubscriptionPlanIntervalEnum.MONTHLY,
          ),
          intervalCount: new SubscriptionPlanIntervalCountValueObject(1),
          trialPeriodDays: null,
          isActive: new SubscriptionPlanIsActiveValueObject(true),
          features: null,
          limits: null,
          stripePriceId: null,
          createdAt: new DateValueObject(now),
          updatedAt: new DateValueObject(now),
        },
        false,
      );

      mockFindOne.mockResolvedValue(typeormEntity);
      mockSubscriptionPlanTypeormMapper.toDomainEntity.mockReturnValue(
        subscriptionPlanAggregate,
      );

      const result = await repository.findByType(SubscriptionPlanTypeEnum.PRO);

      expect(result).toBe(subscriptionPlanAggregate);
      expect(mockFindOne).toHaveBeenCalledWith({
        where: { type: SubscriptionPlanTypeEnum.PRO },
      });
    });
  });

  describe('save', () => {
    it('should save subscription plan aggregate and return saved aggregate', async () => {
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
          description: null,
          priceMonthly: new SubscriptionPlanPriceMonthlyValueObject(29.99),
          priceYearly: new SubscriptionPlanPriceYearlyValueObject(299.99),
          currency: new SubscriptionPlanCurrencyValueObject(
            SubscriptionPlanCurrencyEnum.USD,
          ),
          interval: new SubscriptionPlanIntervalValueObject(
            SubscriptionPlanIntervalEnum.MONTHLY,
          ),
          intervalCount: new SubscriptionPlanIntervalCountValueObject(1),
          trialPeriodDays: null,
          isActive: new SubscriptionPlanIsActiveValueObject(true),
          features: null,
          limits: null,
          stripePriceId: null,
          createdAt: new DateValueObject(now),
          updatedAt: new DateValueObject(now),
        },
        false,
      );

      const typeormEntity = new SubscriptionPlanTypeormEntity();
      typeormEntity.id = subscriptionPlanId;
      typeormEntity.name = 'Pro Plan';
      typeormEntity.slug = 'pro-plan';
      typeormEntity.type = SubscriptionPlanTypeEnum.PRO;

      const savedTypeormEntity = new SubscriptionPlanTypeormEntity();
      savedTypeormEntity.id = subscriptionPlanId;
      savedTypeormEntity.name = 'Pro Plan';
      savedTypeormEntity.slug = 'pro-plan';
      savedTypeormEntity.type = SubscriptionPlanTypeEnum.PRO;

      const savedSubscriptionPlanAggregate = new SubscriptionPlanAggregate(
        {
          id: new SubscriptionPlanUuidValueObject(subscriptionPlanId),
          name: new SubscriptionPlanNameValueObject('Pro Plan'),
          slug: new SubscriptionPlanSlugValueObject('pro-plan'),
          type: new SubscriptionPlanTypeValueObject(
            SubscriptionPlanTypeEnum.PRO,
          ),
          description: null,
          priceMonthly: new SubscriptionPlanPriceMonthlyValueObject(29.99),
          priceYearly: new SubscriptionPlanPriceYearlyValueObject(299.99),
          currency: new SubscriptionPlanCurrencyValueObject(
            SubscriptionPlanCurrencyEnum.USD,
          ),
          interval: new SubscriptionPlanIntervalValueObject(
            SubscriptionPlanIntervalEnum.MONTHLY,
          ),
          intervalCount: new SubscriptionPlanIntervalCountValueObject(1),
          trialPeriodDays: null,
          isActive: new SubscriptionPlanIsActiveValueObject(true),
          features: null,
          limits: null,
          stripePriceId: null,
          createdAt: new DateValueObject(now),
          updatedAt: new DateValueObject(now),
        },
        false,
      );

      mockSubscriptionPlanTypeormMapper.toTypeormEntity.mockReturnValue(
        typeormEntity,
      );
      mockSave.mockResolvedValue(savedTypeormEntity);
      mockSubscriptionPlanTypeormMapper.toDomainEntity.mockReturnValue(
        savedSubscriptionPlanAggregate,
      );

      const result = await repository.save(subscriptionPlanAggregate);

      expect(result).toBe(savedSubscriptionPlanAggregate);
      expect(
        mockSubscriptionPlanTypeormMapper.toTypeormEntity,
      ).toHaveBeenCalledWith(subscriptionPlanAggregate);
      expect(mockSave).toHaveBeenCalledWith(typeormEntity);
      expect(
        mockSubscriptionPlanTypeormMapper.toDomainEntity,
      ).toHaveBeenCalledWith(savedTypeormEntity);
    });
  });

  describe('delete', () => {
    it('should soft delete subscription plan and return true', async () => {
      const subscriptionPlanId = '123e4567-e89b-12d3-a456-426614174000';

      mockSoftDelete.mockResolvedValue({
        affected: 1,
        raw: [],
        generatedMaps: [],
      });

      const result = await repository.delete(subscriptionPlanId);

      expect(result).toBe(true);
      expect(mockSoftDelete).toHaveBeenCalledWith(subscriptionPlanId);
    });

    it('should return false when subscription plan does not exist', async () => {
      const subscriptionPlanId = '123e4567-e89b-12d3-a456-426614174000';

      mockSoftDelete.mockResolvedValue({
        affected: 0,
        raw: [],
        generatedMaps: [],
      });

      const result = await repository.delete(subscriptionPlanId);

      expect(result).toBe(false);
    });
  });
});
