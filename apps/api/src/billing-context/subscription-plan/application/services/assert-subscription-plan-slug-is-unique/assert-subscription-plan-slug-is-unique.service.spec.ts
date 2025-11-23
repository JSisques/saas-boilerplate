import { AssertSubscriptionPlanSlugIsUniqueService } from '@/billing-context/subscription-plan/application/services/assert-subscription-plan-slug-is-unique/assert-subscription-plan-slug-is-unique.service';
import { SubscriptionPlanSlugIsAlreadyTakenException } from '@/billing-context/subscription-plan/application/exceptions/subscription-plan-slug-is-not-unique/subscription-plan-slug-is-not-unique.exception';
import { SubscriptionPlanAggregate } from '@/billing-context/subscription-plan/domain/aggregates/subscription-plan.aggregate';
import {
  SUBSCRIPTION_PLAN_WRITE_REPOSITORY_TOKEN,
  SubscriptionPlanWriteRepository,
} from '@/billing-context/subscription-plan/domain/repositories/subscription-plan-write/subscription-plan-write.repository';
import { SubscriptionPlanCurrencyEnum } from '@/billing-context/subscription-plan/domain/enum/subscription-plan-currency.enum';
import { SubscriptionPlanIntervalEnum } from '@/billing-context/subscription-plan/domain/enum/subscription-plan-interval.enum';
import { SubscriptionPlanTypeEnum } from '@/billing-context/subscription-plan/domain/enum/subscription-plan-type.enum';
import { DateValueObject } from '@/shared/domain/value-objects/date/date.vo';
import { SubscriptionPlanUuidValueObject } from '@/shared/domain/value-objects/identifiers/subscription-plan/subscription-plan-uuid.vo';
import { SubscriptionPlanNameValueObject } from '@/billing-context/subscription-plan/domain/value-objects/subscription-plan-name/subscription-plan-name.vo';
import { SubscriptionPlanSlugValueObject } from '@/billing-context/subscription-plan/domain/value-objects/subscription-plan-slug/subscription-plan-slug.vo';
import { SubscriptionPlanTypeValueObject } from '@/billing-context/subscription-plan/domain/value-objects/subscription-plan-type/subscription-plan-type.vo';
import { SubscriptionPlanPriceMonthlyValueObject } from '@/billing-context/subscription-plan/domain/value-objects/subscription-plan-price-monthly/subscription-plan-price-monthly.vo';
import { SubscriptionPlanPriceYearlyValueObject } from '@/billing-context/subscription-plan/domain/value-objects/subscription-plan-price-yearly/subscription-plan-price-yearly.vo';
import { SubscriptionPlanCurrencyValueObject } from '@/billing-context/subscription-plan/domain/value-objects/subscription-plan-currency/subscription-plan-currency.vo';
import { SubscriptionPlanIntervalValueObject } from '@/billing-context/subscription-plan/domain/value-objects/subscription-plan-interval/subscription-plan-interval.vo';
import { SubscriptionPlanIntervalCountValueObject } from '@/billing-context/subscription-plan/domain/value-objects/subscription-plan-interval-count/subscription-plan-interval-count.vo';
import { SubscriptionPlanIsActiveValueObject } from '@/billing-context/subscription-plan/domain/value-objects/subscription-plan-is-active/subscription-plan-is-active.vo';

describe('AssertSubscriptionPlanSlugIsUniqueService', () => {
  let service: AssertSubscriptionPlanSlugIsUniqueService;
  let mockSubscriptionPlanWriteRepository: jest.Mocked<SubscriptionPlanWriteRepository>;

  beforeEach(() => {
    mockSubscriptionPlanWriteRepository = {
      findById: jest.fn(),
      findBySlug: jest.fn(),
      findByType: jest.fn(),
      save: jest.fn(),
      delete: jest.fn(),
    } as unknown as jest.Mocked<SubscriptionPlanWriteRepository>;

    service = new AssertSubscriptionPlanSlugIsUniqueService(
      mockSubscriptionPlanWriteRepository,
    );
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('execute', () => {
    it('should not throw when slug is unique', async () => {
      const slug = 'basic-plan';

      mockSubscriptionPlanWriteRepository.findBySlug.mockResolvedValue(null);

      await expect(service.execute(slug)).resolves.toBeUndefined();

      expect(mockSubscriptionPlanWriteRepository.findBySlug).toHaveBeenCalledWith(
        slug,
      );
      expect(mockSubscriptionPlanWriteRepository.findBySlug).toHaveBeenCalledTimes(1);
    });

    it('should throw SubscriptionPlanSlugIsAlreadyTakenException when slug already exists', async () => {
      const slug = 'basic-plan';
      const existingSubscriptionPlan = new SubscriptionPlanAggregate(
        {
          id: new SubscriptionPlanUuidValueObject(
            '123e4567-e89b-12d3-a456-426614174000',
          ),
          name: new SubscriptionPlanNameValueObject('Basic Plan'),
          slug: new SubscriptionPlanSlugValueObject(slug),
          type: new SubscriptionPlanTypeValueObject(SubscriptionPlanTypeEnum.BASIC),
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

      mockSubscriptionPlanWriteRepository.findBySlug.mockResolvedValue(
        existingSubscriptionPlan,
      );

      await expect(service.execute(slug)).rejects.toThrow(
        SubscriptionPlanSlugIsAlreadyTakenException,
      );
      await expect(service.execute(slug)).rejects.toThrow(
        `Subscription plan slug ${slug} is already taken`,
      );

      expect(mockSubscriptionPlanWriteRepository.findBySlug).toHaveBeenCalledWith(
        slug,
      );
      expect(mockSubscriptionPlanWriteRepository.findBySlug).toHaveBeenCalledTimes(2);
    });

    it('should call repository with correct slug', async () => {
      const slug = 'basic-plan';

      mockSubscriptionPlanWriteRepository.findBySlug.mockResolvedValue(null);

      await service.execute(slug);

      expect(mockSubscriptionPlanWriteRepository.findBySlug).toHaveBeenCalledWith(
        slug,
      );
      expect(mockSubscriptionPlanWriteRepository.findBySlug).toHaveBeenCalledTimes(1);
    });

    it('should handle different slugs correctly', async () => {
      const slug1 = 'basic-plan';
      const slug2 = 'pro-plan';

      mockSubscriptionPlanWriteRepository.findBySlug
        .mockResolvedValueOnce(null)
        .mockResolvedValueOnce(null);

      await expect(service.execute(slug1)).resolves.toBeUndefined();
      await expect(service.execute(slug2)).resolves.toBeUndefined();

      expect(mockSubscriptionPlanWriteRepository.findBySlug).toHaveBeenCalledWith(
        slug1,
      );
      expect(mockSubscriptionPlanWriteRepository.findBySlug).toHaveBeenCalledWith(
        slug2,
      );
      expect(mockSubscriptionPlanWriteRepository.findBySlug).toHaveBeenCalledTimes(2);
    });

    it('should handle repository errors correctly', async () => {
      const slug = 'basic-plan';
      const repositoryError = new Error('Database connection error');

      mockSubscriptionPlanWriteRepository.findBySlug.mockRejectedValue(
        repositoryError,
      );

      await expect(service.execute(slug)).rejects.toThrow(repositoryError);

      expect(mockSubscriptionPlanWriteRepository.findBySlug).toHaveBeenCalledWith(
        slug,
      );
      expect(mockSubscriptionPlanWriteRepository.findBySlug).toHaveBeenCalledTimes(1);
    });
  });
});

