import { SubscriptionPlanTypeIsAlreadyTakenException } from '@/billing-context/subscription-plan/application/exceptions/subscription-plan-type-is-not-unique copy/subscription-plan-type-is-not-unique.exception';
import { AssertSubscriptionPlanTypeIsUniqueService } from '@/billing-context/subscription-plan/application/services/assert-subscription-plan-type-is-unique/assert-subscription-plan-type-is-unique.service';
import { SubscriptionPlanAggregate } from '@/billing-context/subscription-plan/domain/aggregates/subscription-plan.aggregate';
import { SubscriptionPlanCurrencyEnum } from '@/billing-context/subscription-plan/domain/enum/subscription-plan-currency.enum';
import { SubscriptionPlanIntervalEnum } from '@/billing-context/subscription-plan/domain/enum/subscription-plan-interval.enum';
import { SubscriptionPlanTypeEnum } from '@/billing-context/subscription-plan/domain/enum/subscription-plan-type.enum';
import { SubscriptionPlanWriteRepository } from '@/billing-context/subscription-plan/domain/repositories/subscription-plan-write/subscription-plan-write.repository';
import { SubscriptionPlanCurrencyValueObject } from '@/billing-context/subscription-plan/domain/value-objects/subscription-plan-currency/subscription-plan-currency.vo';
import { SubscriptionPlanIntervalCountValueObject } from '@/billing-context/subscription-plan/domain/value-objects/subscription-plan-interval-count/subscription-plan-interval-count.vo';
import { SubscriptionPlanIntervalValueObject } from '@/billing-context/subscription-plan/domain/value-objects/subscription-plan-interval/subscription-plan-interval.vo';
import { SubscriptionPlanIsActiveValueObject } from '@/billing-context/subscription-plan/domain/value-objects/subscription-plan-is-active/subscription-plan-is-active.vo';
import { SubscriptionPlanNameValueObject } from '@/billing-context/subscription-plan/domain/value-objects/subscription-plan-name/subscription-plan-name.vo';
import { SubscriptionPlanPriceMonthlyValueObject } from '@/billing-context/subscription-plan/domain/value-objects/subscription-plan-price-monthly/subscription-plan-price-monthly.vo';
import { SubscriptionPlanPriceYearlyValueObject } from '@/billing-context/subscription-plan/domain/value-objects/subscription-plan-price-yearly/subscription-plan-price-yearly.vo';
import { SubscriptionPlanSlugValueObject } from '@/billing-context/subscription-plan/domain/value-objects/subscription-plan-slug/subscription-plan-slug.vo';
import { SubscriptionPlanTypeValueObject } from '@/billing-context/subscription-plan/domain/value-objects/subscription-plan-type/subscription-plan-type.vo';
import { DateValueObject } from '@/shared/domain/value-objects/date/date.vo';
import { SubscriptionPlanUuidValueObject } from '@/shared/domain/value-objects/identifiers/subscription-plan/subscription-plan-uuid.vo';

describe('AssertSubscriptionPlanTypeIsUniqueService', () => {
  let service: AssertSubscriptionPlanTypeIsUniqueService;
  let mockSubscriptionPlanWriteRepository: jest.Mocked<SubscriptionPlanWriteRepository>;

  beforeEach(() => {
    mockSubscriptionPlanWriteRepository = {
      findById: jest.fn(),
      findBySlug: jest.fn(),
      findByType: jest.fn(),
      save: jest.fn(),
      delete: jest.fn(),
    } as unknown as jest.Mocked<SubscriptionPlanWriteRepository>;

    service = new AssertSubscriptionPlanTypeIsUniqueService(
      mockSubscriptionPlanWriteRepository,
    );
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('execute', () => {
    it('should not throw when type is unique', async () => {
      const type = SubscriptionPlanTypeEnum.BASIC;

      mockSubscriptionPlanWriteRepository.findByType.mockResolvedValue(null);

      await expect(service.execute(type)).resolves.toBeUndefined();

      expect(
        mockSubscriptionPlanWriteRepository.findByType,
      ).toHaveBeenCalledWith(type);
      expect(
        mockSubscriptionPlanWriteRepository.findByType,
      ).toHaveBeenCalledTimes(1);
    });

    it('should throw SubscriptionPlanTypeIsAlreadyTakenException when type already exists', async () => {
      const type = SubscriptionPlanTypeEnum.BASIC;
      const existingSubscriptionPlan = new SubscriptionPlanAggregate(
        {
          id: new SubscriptionPlanUuidValueObject(
            '123e4567-e89b-12d3-a456-426614174000',
          ),
          name: new SubscriptionPlanNameValueObject('Basic Plan'),
          slug: new SubscriptionPlanSlugValueObject('basic-plan'),
          type: new SubscriptionPlanTypeValueObject(type),
          description: null,
          priceMonthly: new SubscriptionPlanPriceMonthlyValueObject(10.0),
          priceYearly: new SubscriptionPlanPriceYearlyValueObject(120.0),
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
          createdAt: new DateValueObject(new Date()),
          updatedAt: new DateValueObject(new Date()),
        },
        false,
      );

      mockSubscriptionPlanWriteRepository.findByType.mockResolvedValue(
        existingSubscriptionPlan,
      );

      await expect(service.execute(type)).rejects.toThrow(
        SubscriptionPlanTypeIsAlreadyTakenException,
      );
      await expect(service.execute(type)).rejects.toThrow(
        `Subscription plan type ${type} is already taken`,
      );

      expect(
        mockSubscriptionPlanWriteRepository.findByType,
      ).toHaveBeenCalledWith(type);
      expect(
        mockSubscriptionPlanWriteRepository.findByType,
      ).toHaveBeenCalledTimes(2);
    });

    it('should call repository with correct type', async () => {
      const type = SubscriptionPlanTypeEnum.BASIC;

      mockSubscriptionPlanWriteRepository.findByType.mockResolvedValue(null);

      await service.execute(type);

      expect(
        mockSubscriptionPlanWriteRepository.findByType,
      ).toHaveBeenCalledWith(type);
      expect(
        mockSubscriptionPlanWriteRepository.findByType,
      ).toHaveBeenCalledTimes(1);
    });

    it('should handle different types correctly', async () => {
      const type1 = SubscriptionPlanTypeEnum.BASIC;
      const type2 = SubscriptionPlanTypeEnum.PRO;

      mockSubscriptionPlanWriteRepository.findByType
        .mockResolvedValueOnce(null)
        .mockResolvedValueOnce(null);

      await expect(service.execute(type1)).resolves.toBeUndefined();
      await expect(service.execute(type2)).resolves.toBeUndefined();

      expect(
        mockSubscriptionPlanWriteRepository.findByType,
      ).toHaveBeenCalledWith(type1);
      expect(
        mockSubscriptionPlanWriteRepository.findByType,
      ).toHaveBeenCalledWith(type2);
      expect(
        mockSubscriptionPlanWriteRepository.findByType,
      ).toHaveBeenCalledTimes(2);
    });

    it('should handle repository errors correctly', async () => {
      const type = SubscriptionPlanTypeEnum.BASIC;
      const repositoryError = new Error('Database connection error');

      mockSubscriptionPlanWriteRepository.findByType.mockRejectedValue(
        repositoryError,
      );

      await expect(service.execute(type)).rejects.toThrow(repositoryError);

      expect(
        mockSubscriptionPlanWriteRepository.findByType,
      ).toHaveBeenCalledWith(type);
      expect(
        mockSubscriptionPlanWriteRepository.findByType,
      ).toHaveBeenCalledTimes(1);
    });
  });
});
