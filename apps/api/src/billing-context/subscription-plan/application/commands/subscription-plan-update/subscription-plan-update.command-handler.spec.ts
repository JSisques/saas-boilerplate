import { SubscriptionPlanUpdateCommand } from '@/billing-context/subscription-plan/application/commands/subscription-plan-update/subscription-plan-update.command';
import { SubscriptionPlanUpdateCommandHandler } from '@/billing-context/subscription-plan/application/commands/subscription-plan-update/subscription-plan-update.command-handler';
import { ISubscriptionPlanUpdateCommandDto } from '@/billing-context/subscription-plan/application/dtos/commands/subscription-plan-update/subscription-plan-update-command.dto';
import { SubscriptionPlanNotFoundException } from '@/billing-context/subscription-plan/application/exceptions/subscription-plan-not-found/subscription-plan-not-found.exception';
import { SubscriptionPlanSlugIsAlreadyTakenException } from '@/billing-context/subscription-plan/application/exceptions/subscription-plan-slug-is-not-unique/subscription-plan-slug-is-not-unique.exception';
import { SubscriptionPlanTypeIsAlreadyTakenException } from '@/billing-context/subscription-plan/application/exceptions/subscription-plan-type-is-not-unique copy/subscription-plan-type-is-not-unique.exception';
import { AssertSubscriptionPlanExsistsService } from '@/billing-context/subscription-plan/application/services/assert-subscription-plan-exsits/assert-subscription-plan-exsits.service';
import { AssertSubscriptionPlanSlugIsUniqueService } from '@/billing-context/subscription-plan/application/services/assert-subscription-plan-slug-is-unique/assert-subscription-plan-slug-is-unique.service';
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
import { EventBus } from '@nestjs/cqrs';

describe('SubscriptionPlanUpdateCommandHandler', () => {
  let handler: SubscriptionPlanUpdateCommandHandler;
  let mockSubscriptionPlanWriteRepository: jest.Mocked<SubscriptionPlanWriteRepository>;
  let mockEventBus: jest.Mocked<EventBus>;
  let mockAssertSubscriptionPlanExsistsService: jest.Mocked<AssertSubscriptionPlanExsistsService>;
  let mockAssertSubscriptionPlanSlugIsUniqueService: jest.Mocked<AssertSubscriptionPlanSlugIsUniqueService>;
  let mockAssertSubscriptionPlanTypeIsUniqueService: jest.Mocked<AssertSubscriptionPlanTypeIsUniqueService>;

  beforeEach(() => {
    mockSubscriptionPlanWriteRepository = {
      findById: jest.fn(),
      findBySlug: jest.fn(),
      findByType: jest.fn(),
      save: jest.fn(),
      delete: jest.fn(),
    } as unknown as jest.Mocked<SubscriptionPlanWriteRepository>;

    mockEventBus = {
      publishAll: jest.fn(),
      publish: jest.fn(),
    } as unknown as jest.Mocked<EventBus>;

    mockAssertSubscriptionPlanExsistsService = {
      execute: jest.fn(),
    } as unknown as jest.Mocked<AssertSubscriptionPlanExsistsService>;

    mockAssertSubscriptionPlanSlugIsUniqueService = {
      execute: jest.fn(),
    } as unknown as jest.Mocked<AssertSubscriptionPlanSlugIsUniqueService>;

    mockAssertSubscriptionPlanTypeIsUniqueService = {
      execute: jest.fn(),
    } as unknown as jest.Mocked<AssertSubscriptionPlanTypeIsUniqueService>;

    handler = new SubscriptionPlanUpdateCommandHandler(
      mockAssertSubscriptionPlanExsistsService,
      mockAssertSubscriptionPlanSlugIsUniqueService,
      mockAssertSubscriptionPlanTypeIsUniqueService,
      mockEventBus,
      mockSubscriptionPlanWriteRepository,
    );
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('execute', () => {
    it('should update subscription plan successfully when subscription plan exists', async () => {
      const subscriptionPlanId = '123e4567-e89b-12d3-a456-426614174000';
      const now = new Date();

      const commandDto: ISubscriptionPlanUpdateCommandDto = {
        id: subscriptionPlanId,
        name: 'Updated Plan',
      };

      const command = new SubscriptionPlanUpdateCommand(commandDto);
      const existingSubscriptionPlan = new SubscriptionPlanAggregate(
        {
          id: new SubscriptionPlanUuidValueObject(subscriptionPlanId),
          name: new SubscriptionPlanNameValueObject('Original Plan'),
          slug: command.slug!,
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
          createdAt: new DateValueObject(now),
          updatedAt: new DateValueObject(now),
        },
        false,
      );

      const updateSpy = jest.spyOn(existingSubscriptionPlan, 'update');
      mockAssertSubscriptionPlanExsistsService.execute.mockResolvedValue(
        existingSubscriptionPlan,
      );
      mockAssertSubscriptionPlanSlugIsUniqueService.execute.mockResolvedValue(
        undefined,
      );
      mockAssertSubscriptionPlanTypeIsUniqueService.execute.mockResolvedValue(
        undefined,
      );
      mockSubscriptionPlanWriteRepository.save.mockResolvedValue(undefined);
      mockEventBus.publishAll.mockResolvedValue(undefined);

      await handler.execute(command);

      expect(
        mockAssertSubscriptionPlanExsistsService.execute,
      ).toHaveBeenCalledWith(subscriptionPlanId);
      expect(
        mockAssertSubscriptionPlanExsistsService.execute,
      ).toHaveBeenCalledTimes(1);
      expect(updateSpy).toHaveBeenCalled();
      expect(mockSubscriptionPlanWriteRepository.save).toHaveBeenCalledWith(
        existingSubscriptionPlan,
      );
      expect(mockSubscriptionPlanWriteRepository.save).toHaveBeenCalledTimes(1);
      expect(mockEventBus.publishAll).toHaveBeenCalled();
      expect(mockEventBus.publishAll).toHaveBeenCalledTimes(1);

      updateSpy.mockRestore();
    });

    it('should throw exception when subscription plan does not exist', async () => {
      const subscriptionPlanId = '123e4567-e89b-12d3-a456-426614174000';
      const commandDto: ISubscriptionPlanUpdateCommandDto = {
        id: subscriptionPlanId,
        name: 'Updated Plan',
      };

      const command = new SubscriptionPlanUpdateCommand(commandDto);
      const error = new SubscriptionPlanNotFoundException(subscriptionPlanId);

      mockAssertSubscriptionPlanExsistsService.execute.mockRejectedValue(error);

      await expect(handler.execute(command)).rejects.toThrow(error);
      expect(
        mockAssertSubscriptionPlanExsistsService.execute,
      ).toHaveBeenCalledWith(subscriptionPlanId);
      expect(mockSubscriptionPlanWriteRepository.save).not.toHaveBeenCalled();
      expect(mockEventBus.publishAll).not.toHaveBeenCalled();
    });

    it('should throw exception when slug is not unique', async () => {
      const subscriptionPlanId = '123e4567-e89b-12d3-a456-426614174000';
      const now = new Date();

      const commandDto: ISubscriptionPlanUpdateCommandDto = {
        id: subscriptionPlanId,
        name: 'Updated Plan',
      };

      const command = new SubscriptionPlanUpdateCommand(commandDto);
      const existingSubscriptionPlan = new SubscriptionPlanAggregate(
        {
          id: new SubscriptionPlanUuidValueObject(subscriptionPlanId),
          name: new SubscriptionPlanNameValueObject('Original Plan'),
          slug: command.slug!,
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
          createdAt: new DateValueObject(now),
          updatedAt: new DateValueObject(now),
        },
        false,
      );

      const error = new SubscriptionPlanSlugIsAlreadyTakenException(
        command.slug!.value,
      );

      mockAssertSubscriptionPlanExsistsService.execute.mockResolvedValue(
        existingSubscriptionPlan,
      );
      mockAssertSubscriptionPlanSlugIsUniqueService.execute.mockRejectedValue(
        error,
      );

      await expect(handler.execute(command)).rejects.toThrow(error);
      expect(
        mockAssertSubscriptionPlanExsistsService.execute,
      ).toHaveBeenCalledWith(subscriptionPlanId);
      expect(
        mockAssertSubscriptionPlanSlugIsUniqueService.execute,
      ).toHaveBeenCalledWith(command.slug?.value);
      expect(mockSubscriptionPlanWriteRepository.save).not.toHaveBeenCalled();
      expect(mockEventBus.publishAll).not.toHaveBeenCalled();
    });

    it('should throw exception when type is not unique', async () => {
      const subscriptionPlanId = '123e4567-e89b-12d3-a456-426614174000';
      const now = new Date();

      const commandDto: ISubscriptionPlanUpdateCommandDto = {
        id: subscriptionPlanId,
        type: SubscriptionPlanTypeEnum.PRO,
      };

      const command = new SubscriptionPlanUpdateCommand(commandDto);
      const existingSubscriptionPlan = new SubscriptionPlanAggregate(
        {
          id: new SubscriptionPlanUuidValueObject(subscriptionPlanId),
          name: new SubscriptionPlanNameValueObject('Original Plan'),
          slug: new SubscriptionPlanSlugValueObject('original-plan'),
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
          createdAt: new DateValueObject(now),
          updatedAt: new DateValueObject(now),
        },
        false,
      );

      const error = new SubscriptionPlanTypeIsAlreadyTakenException(
        command.type.value as SubscriptionPlanTypeEnum,
      );

      mockAssertSubscriptionPlanExsistsService.execute.mockResolvedValue(
        existingSubscriptionPlan,
      );
      mockAssertSubscriptionPlanSlugIsUniqueService.execute.mockResolvedValue(
        undefined,
      );
      mockAssertSubscriptionPlanTypeIsUniqueService.execute.mockRejectedValue(
        error,
      );

      await expect(handler.execute(command)).rejects.toThrow(error);
      expect(
        mockAssertSubscriptionPlanExsistsService.execute,
      ).toHaveBeenCalledWith(subscriptionPlanId);
      expect(
        mockAssertSubscriptionPlanTypeIsUniqueService.execute,
      ).toHaveBeenCalledWith(command.type?.value);
      expect(mockSubscriptionPlanWriteRepository.save).not.toHaveBeenCalled();
      expect(mockEventBus.publishAll).not.toHaveBeenCalled();
    });

    it('should update only provided fields', async () => {
      const subscriptionPlanId = '123e4567-e89b-12d3-a456-426614174000';
      const now = new Date();

      const commandDto: ISubscriptionPlanUpdateCommandDto = {
        id: subscriptionPlanId,
        name: 'Updated Plan',
        description: 'Updated description',
      };

      const command = new SubscriptionPlanUpdateCommand(commandDto);
      const existingSubscriptionPlan = new SubscriptionPlanAggregate(
        {
          id: new SubscriptionPlanUuidValueObject(subscriptionPlanId),
          name: new SubscriptionPlanNameValueObject('Original Plan'),
          slug: command.slug!,
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
          createdAt: new DateValueObject(now),
          updatedAt: new DateValueObject(now),
        },
        false,
      );

      const updateSpy = jest.spyOn(existingSubscriptionPlan, 'update');
      mockAssertSubscriptionPlanExsistsService.execute.mockResolvedValue(
        existingSubscriptionPlan,
      );
      mockAssertSubscriptionPlanSlugIsUniqueService.execute.mockResolvedValue(
        undefined,
      );
      mockAssertSubscriptionPlanTypeIsUniqueService.execute.mockResolvedValue(
        undefined,
      );
      mockSubscriptionPlanWriteRepository.save.mockResolvedValue(undefined);
      mockEventBus.publishAll.mockResolvedValue(undefined);

      await handler.execute(command);

      expect(updateSpy).toHaveBeenCalled();
      const updateCall = updateSpy.mock.calls[0][0];
      expect(updateCall).toHaveProperty('name');
      expect(updateCall).toHaveProperty('slug');
      expect(updateCall).toHaveProperty('description');
      expect(updateCall).not.toHaveProperty('id');

      updateSpy.mockRestore();
    });

    it('should exclude id from update data', async () => {
      const subscriptionPlanId = '123e4567-e89b-12d3-a456-426614174000';
      const now = new Date();

      const commandDto: ISubscriptionPlanUpdateCommandDto = {
        id: subscriptionPlanId,
        name: 'Updated Plan',
      };

      const command = new SubscriptionPlanUpdateCommand(commandDto);
      const existingSubscriptionPlan = new SubscriptionPlanAggregate(
        {
          id: new SubscriptionPlanUuidValueObject(subscriptionPlanId),
          name: new SubscriptionPlanNameValueObject('Original Plan'),
          slug: command.slug!,
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
          createdAt: new DateValueObject(now),
          updatedAt: new DateValueObject(now),
        },
        false,
      );

      const updateSpy = jest.spyOn(existingSubscriptionPlan, 'update');
      mockAssertSubscriptionPlanExsistsService.execute.mockResolvedValue(
        existingSubscriptionPlan,
      );
      mockAssertSubscriptionPlanSlugIsUniqueService.execute.mockResolvedValue(
        undefined,
      );
      mockAssertSubscriptionPlanTypeIsUniqueService.execute.mockResolvedValue(
        undefined,
      );
      mockSubscriptionPlanWriteRepository.save.mockResolvedValue(undefined);
      mockEventBus.publishAll.mockResolvedValue(undefined);

      await handler.execute(command);

      const updateCall = updateSpy.mock.calls[0][0];
      expect(updateCall).not.toHaveProperty('id');

      updateSpy.mockRestore();
    });

    it('should publish SubscriptionPlanUpdatedEvent when subscription plan is updated', async () => {
      const subscriptionPlanId = '123e4567-e89b-12d3-a456-426614174000';
      const now = new Date();

      const commandDto: ISubscriptionPlanUpdateCommandDto = {
        id: subscriptionPlanId,
        name: 'Updated Plan',
      };

      const command = new SubscriptionPlanUpdateCommand(commandDto);
      const existingSubscriptionPlan = new SubscriptionPlanAggregate(
        {
          id: new SubscriptionPlanUuidValueObject(subscriptionPlanId),
          name: new SubscriptionPlanNameValueObject('Original Plan'),
          slug: command.slug!,
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
          createdAt: new DateValueObject(now),
          updatedAt: new DateValueObject(now),
        },
        false,
      );

      mockAssertSubscriptionPlanExsistsService.execute.mockResolvedValue(
        existingSubscriptionPlan,
      );
      mockAssertSubscriptionPlanSlugIsUniqueService.execute.mockResolvedValue(
        undefined,
      );
      mockAssertSubscriptionPlanTypeIsUniqueService.execute.mockResolvedValue(
        undefined,
      );
      mockSubscriptionPlanWriteRepository.save.mockResolvedValue(undefined);
      mockEventBus.publishAll.mockResolvedValue(undefined);

      await handler.execute(command);

      expect(mockEventBus.publishAll).toHaveBeenCalled();
      expect(mockEventBus.publishAll).toHaveBeenCalledTimes(1);
    });

    it('should save subscription plan before publishing events', async () => {
      const subscriptionPlanId = '123e4567-e89b-12d3-a456-426614174000';
      const now = new Date();

      const commandDto: ISubscriptionPlanUpdateCommandDto = {
        id: subscriptionPlanId,
        name: 'Updated Plan',
      };

      const command = new SubscriptionPlanUpdateCommand(commandDto);
      const existingSubscriptionPlan = new SubscriptionPlanAggregate(
        {
          id: new SubscriptionPlanUuidValueObject(subscriptionPlanId),
          name: new SubscriptionPlanNameValueObject('Original Plan'),
          slug: command.slug!,
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
          createdAt: new DateValueObject(now),
          updatedAt: new DateValueObject(now),
        },
        false,
      );

      mockAssertSubscriptionPlanExsistsService.execute.mockResolvedValue(
        existingSubscriptionPlan,
      );
      mockAssertSubscriptionPlanSlugIsUniqueService.execute.mockResolvedValue(
        undefined,
      );
      mockAssertSubscriptionPlanTypeIsUniqueService.execute.mockResolvedValue(
        undefined,
      );
      mockSubscriptionPlanWriteRepository.save.mockResolvedValue(undefined);
      mockEventBus.publishAll.mockResolvedValue(undefined);

      await handler.execute(command);

      const saveOrder =
        mockSubscriptionPlanWriteRepository.save.mock.invocationCallOrder[0];
      const publishOrder = mockEventBus.publishAll.mock.invocationCallOrder[0];
      expect(saveOrder).toBeLessThan(publishOrder);
    });

    it('should commit events after publishing', async () => {
      const subscriptionPlanId = '123e4567-e89b-12d3-a456-426614174000';
      const now = new Date();

      const commandDto: ISubscriptionPlanUpdateCommandDto = {
        id: subscriptionPlanId,
        name: 'Updated Plan',
      };

      const command = new SubscriptionPlanUpdateCommand(commandDto);
      const existingSubscriptionPlan = new SubscriptionPlanAggregate(
        {
          id: new SubscriptionPlanUuidValueObject(subscriptionPlanId),
          name: new SubscriptionPlanNameValueObject('Original Plan'),
          slug: command.slug!,
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
          createdAt: new DateValueObject(now),
          updatedAt: new DateValueObject(now),
        },
        false,
      );

      const commitSpy = jest.spyOn(existingSubscriptionPlan, 'commit');

      mockAssertSubscriptionPlanExsistsService.execute.mockResolvedValue(
        existingSubscriptionPlan,
      );
      mockAssertSubscriptionPlanSlugIsUniqueService.execute.mockResolvedValue(
        undefined,
      );
      mockAssertSubscriptionPlanTypeIsUniqueService.execute.mockResolvedValue(
        undefined,
      );
      mockSubscriptionPlanWriteRepository.save.mockResolvedValue(undefined);
      mockEventBus.publishAll.mockResolvedValue(undefined);

      await handler.execute(command);

      expect(commitSpy).toHaveBeenCalled();
      const publishOrder = mockEventBus.publishAll.mock.invocationCallOrder[0];
      const commitOrder = commitSpy.mock.invocationCallOrder[0];
      expect(publishOrder).toBeLessThan(commitOrder);

      commitSpy.mockRestore();
    });
  });
});
