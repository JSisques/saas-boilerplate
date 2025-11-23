import { ISubscriptionPlanFindByIdQueryDto } from '@/billing-context/subscription-plan/application/dtos/queries/subscription-plan-find-by-id/subscription-plan-find-by-id-query.dto';
import { SubscriptionPlanNotFoundException } from '@/billing-context/subscription-plan/application/exceptions/subscription-plan-not-found/subscription-plan-not-found.exception';
import { FindSubscriptionPlanByIdQuery } from '@/billing-context/subscription-plan/application/queries/subscription-plan-find-by-id/subscription-plan-find-by-id.query';
import { FindSubscriptionPlanByIdQueryHandler } from '@/billing-context/subscription-plan/application/queries/subscription-plan-find-by-id/subscription-plan-find-by-id.query-handler';
import { AssertSubscriptionPlanExsistsService } from '@/billing-context/subscription-plan/application/services/assert-subscription-plan-exsits/assert-subscription-plan-exsits.service';
import { SubscriptionPlanAggregate } from '@/billing-context/subscription-plan/domain/aggregates/subscription-plan.aggregate';
import { SubscriptionPlanCurrencyEnum } from '@/billing-context/subscription-plan/domain/enum/subscription-plan-currency.enum';
import { SubscriptionPlanIntervalEnum } from '@/billing-context/subscription-plan/domain/enum/subscription-plan-interval.enum';
import { SubscriptionPlanTypeEnum } from '@/billing-context/subscription-plan/domain/enum/subscription-plan-type.enum';
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

describe('FindSubscriptionPlanByIdQueryHandler', () => {
  let handler: FindSubscriptionPlanByIdQueryHandler;
  let mockAssertSubscriptionPlanExsistsService: Partial<
    jest.Mocked<AssertSubscriptionPlanExsistsService>
  >;

  beforeEach(() => {
    mockAssertSubscriptionPlanExsistsService = {
      execute: jest.fn(),
    } as Partial<jest.Mocked<AssertSubscriptionPlanExsistsService>>;

    handler = new FindSubscriptionPlanByIdQueryHandler(
      mockAssertSubscriptionPlanExsistsService as unknown as AssertSubscriptionPlanExsistsService,
    );
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('execute', () => {
    it('should return subscription plan aggregate when subscription plan exists', async () => {
      const subscriptionPlanId = '123e4567-e89b-12d3-a456-426614174000';
      const queryDto: ISubscriptionPlanFindByIdQueryDto = {
        id: subscriptionPlanId,
      };
      const query = new FindSubscriptionPlanByIdQuery(queryDto);

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

      mockAssertSubscriptionPlanExsistsService.execute.mockResolvedValue(
        mockSubscriptionPlan,
      );

      const result = await handler.execute(query);

      expect(result).toBe(mockSubscriptionPlan);
      expect(
        mockAssertSubscriptionPlanExsistsService.execute,
      ).toHaveBeenCalledWith(subscriptionPlanId);
      expect(
        mockAssertSubscriptionPlanExsistsService.execute,
      ).toHaveBeenCalledTimes(1);
    });

    it('should throw exception when subscription plan does not exist', async () => {
      const subscriptionPlanId = '123e4567-e89b-12d3-a456-426614174000';
      const queryDto: ISubscriptionPlanFindByIdQueryDto = {
        id: subscriptionPlanId,
      };
      const query = new FindSubscriptionPlanByIdQuery(queryDto);

      const error = new SubscriptionPlanNotFoundException(subscriptionPlanId);
      mockAssertSubscriptionPlanExsistsService.execute.mockRejectedValue(error);

      await expect(handler.execute(query)).rejects.toThrow(error);
      await expect(handler.execute(query)).rejects.toThrow(
        `Subscription plan with id ${subscriptionPlanId} not found`,
      );

      expect(
        mockAssertSubscriptionPlanExsistsService.execute,
      ).toHaveBeenCalledWith(subscriptionPlanId);
      expect(
        mockAssertSubscriptionPlanExsistsService.execute,
      ).toHaveBeenCalledTimes(2);
    });

    it('should call service with correct id from query', async () => {
      const subscriptionPlanId = '123e4567-e89b-12d3-a456-426614174000';
      const queryDto: ISubscriptionPlanFindByIdQueryDto = {
        id: subscriptionPlanId,
      };
      const query = new FindSubscriptionPlanByIdQuery(queryDto);

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

      mockAssertSubscriptionPlanExsistsService.execute.mockResolvedValue(
        mockSubscriptionPlan,
      );

      await handler.execute(query);

      expect(
        mockAssertSubscriptionPlanExsistsService.execute,
      ).toHaveBeenCalledWith(query.id.value);
      expect(query.id).toBeInstanceOf(SubscriptionPlanUuidValueObject);
      expect(query.id.value).toBe(subscriptionPlanId);
    });

    it('should return subscription plan aggregate with all properties when subscription plan exists', async () => {
      const subscriptionPlanId = '123e4567-e89b-12d3-a456-426614174000';
      const queryDto: ISubscriptionPlanFindByIdQueryDto = {
        id: subscriptionPlanId,
      };
      const query = new FindSubscriptionPlanByIdQuery(queryDto);

      const mockSubscriptionPlan = new SubscriptionPlanAggregate(
        {
          id: new SubscriptionPlanUuidValueObject(subscriptionPlanId),
          name: new SubscriptionPlanNameValueObject('Pro Plan'),
          slug: new SubscriptionPlanSlugValueObject('pro-plan'),
          type: new SubscriptionPlanTypeValueObject(
            SubscriptionPlanTypeEnum.PRO,
          ),
          description: null,
          priceMonthly: new SubscriptionPlanPriceMonthlyValueObject(29.0),
          priceYearly: new SubscriptionPlanPriceYearlyValueObject(348.0),
          currency: new SubscriptionPlanCurrencyValueObject(
            SubscriptionPlanCurrencyEnum.EUR,
          ),
          interval: new SubscriptionPlanIntervalValueObject(
            SubscriptionPlanIntervalEnum.YEARLY,
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

      mockAssertSubscriptionPlanExsistsService.execute.mockResolvedValue(
        mockSubscriptionPlan,
      );

      const result = await handler.execute(query);

      expect(result).toBe(mockSubscriptionPlan);
      expect(result.id.value).toBe(subscriptionPlanId);
      expect(result.name.value).toBe('Pro Plan');
      expect(result.slug.value).toBe('pro-plan');
      expect(result.type.value).toBe(SubscriptionPlanTypeEnum.PRO);
      expect(result.priceMonthly.value).toBe(29.0);
      expect(result.priceYearly.value).toBe(348.0);
      expect(result.currency.value).toBe(SubscriptionPlanCurrencyEnum.EUR);
      expect(result.interval.value).toBe(SubscriptionPlanIntervalEnum.YEARLY);
      expect(result.intervalCount.value).toBe(1);
      expect(result.isActive.value).toBe(true);
    });

    it('should propagate repository errors correctly', async () => {
      const subscriptionPlanId = '123e4567-e89b-12d3-a456-426614174000';
      const queryDto: ISubscriptionPlanFindByIdQueryDto = {
        id: subscriptionPlanId,
      };
      const query = new FindSubscriptionPlanByIdQuery(queryDto);

      const repositoryError = new Error('Database connection error');
      mockAssertSubscriptionPlanExsistsService.execute.mockRejectedValue(
        repositoryError,
      );

      await expect(handler.execute(query)).rejects.toThrow(repositoryError);

      expect(
        mockAssertSubscriptionPlanExsistsService.execute,
      ).toHaveBeenCalledWith(subscriptionPlanId);
      expect(
        mockAssertSubscriptionPlanExsistsService.execute,
      ).toHaveBeenCalledTimes(1);
    });
  });
});
