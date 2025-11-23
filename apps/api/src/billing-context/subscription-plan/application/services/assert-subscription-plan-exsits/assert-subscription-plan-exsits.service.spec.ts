import { SubscriptionPlanNotFoundException } from '@/billing-context/subscription-plan/application/exceptions/subscription-plan-not-found/subscription-plan-not-found.exception';
import { AssertSubscriptionPlanExsistsService } from '@/billing-context/subscription-plan/application/services/assert-subscription-plan-exsits/assert-subscription-plan-exsits.service';
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

describe('AssertSubscriptionPlanExsistsService', () => {
  let service: AssertSubscriptionPlanExsistsService;
  let mockSubscriptionPlanWriteRepository: jest.Mocked<SubscriptionPlanWriteRepository>;

  beforeEach(() => {
    mockSubscriptionPlanWriteRepository = {
      findById: jest.fn(),
      findBySlug: jest.fn(),
      findByType: jest.fn(),
      save: jest.fn(),
      delete: jest.fn(),
    } as unknown as jest.Mocked<SubscriptionPlanWriteRepository>;

    service = new AssertSubscriptionPlanExsistsService(
      mockSubscriptionPlanWriteRepository,
    );
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('execute', () => {
    it('should return subscription plan aggregate when subscription plan exists', async () => {
      const subscriptionPlanId = '123e4567-e89b-12d3-a456-426614174000';
      const mockSubscriptionPlan = new SubscriptionPlanAggregate(
        {
          id: new SubscriptionPlanUuidValueObject(subscriptionPlanId),
          name: new SubscriptionPlanNameValueObject('Basic Plan'),
          slug: new SubscriptionPlanSlugValueObject('basic-plan'),
          type: new SubscriptionPlanTypeValueObject(
            SubscriptionPlanTypeEnum.BASIC,
          ),
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

      mockSubscriptionPlanWriteRepository.findById.mockResolvedValue(
        mockSubscriptionPlan,
      );

      const result = await service.execute(subscriptionPlanId);

      expect(result).toBe(mockSubscriptionPlan);
      expect(mockSubscriptionPlanWriteRepository.findById).toHaveBeenCalledWith(
        subscriptionPlanId,
      );
      expect(
        mockSubscriptionPlanWriteRepository.findById,
      ).toHaveBeenCalledTimes(1);
    });

    it('should throw SubscriptionPlanNotFoundException when subscription plan does not exist', async () => {
      const subscriptionPlanId = '123e4567-e89b-12d3-a456-426614174000';

      mockSubscriptionPlanWriteRepository.findById.mockResolvedValue(null);

      await expect(service.execute(subscriptionPlanId)).rejects.toThrow(
        SubscriptionPlanNotFoundException,
      );
      await expect(service.execute(subscriptionPlanId)).rejects.toThrow(
        `Subscription plan with id ${subscriptionPlanId} not found`,
      );

      expect(mockSubscriptionPlanWriteRepository.findById).toHaveBeenCalledWith(
        subscriptionPlanId,
      );
      expect(
        mockSubscriptionPlanWriteRepository.findById,
      ).toHaveBeenCalledTimes(2);
    });

    it('should call repository with correct id', async () => {
      const subscriptionPlanId = '123e4567-e89b-12d3-a456-426614174000';
      const mockSubscriptionPlan = new SubscriptionPlanAggregate(
        {
          id: new SubscriptionPlanUuidValueObject(subscriptionPlanId),
          name: new SubscriptionPlanNameValueObject('Basic Plan'),
          slug: new SubscriptionPlanSlugValueObject('basic-plan'),
          type: new SubscriptionPlanTypeValueObject(
            SubscriptionPlanTypeEnum.BASIC,
          ),
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

      mockSubscriptionPlanWriteRepository.findById.mockResolvedValue(
        mockSubscriptionPlan,
      );

      await service.execute(subscriptionPlanId);

      expect(mockSubscriptionPlanWriteRepository.findById).toHaveBeenCalledWith(
        subscriptionPlanId,
      );
      expect(
        mockSubscriptionPlanWriteRepository.findById,
      ).toHaveBeenCalledTimes(1);
    });

    it('should handle repository errors correctly', async () => {
      const subscriptionPlanId = '123e4567-e89b-12d3-a456-426614174000';
      const repositoryError = new Error('Database connection error');

      mockSubscriptionPlanWriteRepository.findById.mockRejectedValue(
        repositoryError,
      );

      await expect(service.execute(subscriptionPlanId)).rejects.toThrow(
        repositoryError,
      );

      expect(mockSubscriptionPlanWriteRepository.findById).toHaveBeenCalledWith(
        subscriptionPlanId,
      );
      expect(
        mockSubscriptionPlanWriteRepository.findById,
      ).toHaveBeenCalledTimes(1);
    });
  });
});
