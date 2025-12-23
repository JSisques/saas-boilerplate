import { SubscriptionPlanDeleteCommand } from '@/billing-context/subscription-plan/application/commands/subscription-plan-delete/subscription-plan-delete.command';
import { SubscriptionPlanDeleteCommandHandler } from '@/billing-context/subscription-plan/application/commands/subscription-plan-delete/subscription-plan-delete.command-handler';
import { ISubscriptionPlanDeleteCommandDto } from '@/billing-context/subscription-plan/application/dtos/commands/subscription-plan-delete/subscription-plan-delete-command.dto';
import { SubscriptionPlanNotFoundException } from '@/billing-context/subscription-plan/application/exceptions/subscription-plan-not-found/subscription-plan-not-found.exception';
import { AssertSubscriptionPlanExsistsService } from '@/billing-context/subscription-plan/application/services/assert-subscription-plan-exsits/assert-subscription-plan-exsits.service';
import { SubscriptionPlanAggregate } from '@/billing-context/subscription-plan/domain/aggregates/subscription-plan.aggregate';
import { SubscriptionPlanCurrencyEnum } from '@/billing-context/subscription-plan/domain/enum/subscription-plan-currency/subscription-plan-currency.enum';
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
import { SubscriptionPlanIntervalEnum } from '@/billing-context/subscription-plan/domain/enum/subscription-plan-interval/subscription-plan-interval.enum';
import { SubscriptionPlanTypeEnum } from '@/billing-context/subscription-plan/domain/enum/subscription-plan-type/subscription-plan-type.enum';
import { SubscriptionPlanDeletedEvent } from '@/shared/domain/events/billing-context/subscription-plan/subscription-plan-deleted/subscription-plan-deleted.event';
import { DateValueObject } from '@/shared/domain/value-objects/date/date.vo';
import { SubscriptionPlanUuidValueObject } from '@/shared/domain/value-objects/identifiers/subscription-plan/subscription-plan-uuid.vo';
import { EventBus } from '@nestjs/cqrs';

describe('SubscriptionPlanDeleteCommandHandler', () => {
  let handler: SubscriptionPlanDeleteCommandHandler;
  let mockSubscriptionPlanWriteRepository: jest.Mocked<SubscriptionPlanWriteRepository>;
  let mockEventBus: jest.Mocked<EventBus>;
  let mockAssertSubscriptionPlanExsistsService: jest.Mocked<AssertSubscriptionPlanExsistsService>;

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

    handler = new SubscriptionPlanDeleteCommandHandler(
      mockSubscriptionPlanWriteRepository,
      mockEventBus,
      mockAssertSubscriptionPlanExsistsService,
    );
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('execute', () => {
    it('should delete subscription plan successfully when subscription plan exists', async () => {
      const subscriptionPlanId = '123e4567-e89b-12d3-a456-426614174000';
      const commandDto: ISubscriptionPlanDeleteCommandDto = {
        id: subscriptionPlanId,
      };

      const command = new SubscriptionPlanDeleteCommand(commandDto);
      const existingSubscriptionPlan = new SubscriptionPlanAggregate(
        {
          id: new SubscriptionPlanUuidValueObject(subscriptionPlanId),
          name: new SubscriptionPlanNameValueObject('Test Plan'),
          slug: new SubscriptionPlanSlugValueObject('test-plan'),
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

      const deleteSpy = jest.spyOn(existingSubscriptionPlan, 'delete');
      mockAssertSubscriptionPlanExsistsService.execute.mockResolvedValue(
        existingSubscriptionPlan,
      );
      mockSubscriptionPlanWriteRepository.delete.mockResolvedValue(undefined);
      mockEventBus.publishAll.mockResolvedValue(undefined);

      await handler.execute(command);

      expect(
        mockAssertSubscriptionPlanExsistsService.execute,
      ).toHaveBeenCalledWith(subscriptionPlanId);
      expect(
        mockAssertSubscriptionPlanExsistsService.execute,
      ).toHaveBeenCalledTimes(1);
      expect(deleteSpy).toHaveBeenCalled();
      expect(mockSubscriptionPlanWriteRepository.delete).toHaveBeenCalledWith(
        subscriptionPlanId,
      );
      expect(mockSubscriptionPlanWriteRepository.delete).toHaveBeenCalledTimes(
        1,
      );
      expect(mockEventBus.publishAll).toHaveBeenCalledWith(
        existingSubscriptionPlan.getUncommittedEvents(),
      );
      expect(mockEventBus.publishAll).toHaveBeenCalledTimes(1);

      deleteSpy.mockRestore();
    });

    it('should throw exception when subscription plan does not exist', async () => {
      const subscriptionPlanId = '123e4567-e89b-12d3-a456-426614174000';
      const commandDto: ISubscriptionPlanDeleteCommandDto = {
        id: subscriptionPlanId,
      };

      const command = new SubscriptionPlanDeleteCommand(commandDto);
      const error = new SubscriptionPlanNotFoundException(subscriptionPlanId);

      mockAssertSubscriptionPlanExsistsService.execute.mockRejectedValue(error);

      await expect(handler.execute(command)).rejects.toThrow(error);
      expect(
        mockAssertSubscriptionPlanExsistsService.execute,
      ).toHaveBeenCalledWith(subscriptionPlanId);
      expect(mockSubscriptionPlanWriteRepository.delete).not.toHaveBeenCalled();
      expect(mockEventBus.publishAll).not.toHaveBeenCalled();
    });

    it('should publish SubscriptionPlanDeletedEvent when subscription plan is deleted', async () => {
      const subscriptionPlanId = '123e4567-e89b-12d3-a456-426614174000';
      const commandDto: ISubscriptionPlanDeleteCommandDto = {
        id: subscriptionPlanId,
      };

      const command = new SubscriptionPlanDeleteCommand(commandDto);
      const existingSubscriptionPlan = new SubscriptionPlanAggregate(
        {
          id: new SubscriptionPlanUuidValueObject(subscriptionPlanId),
          name: new SubscriptionPlanNameValueObject('Test Plan'),
          slug: new SubscriptionPlanSlugValueObject('test-plan'),
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

      // Verify that delete() generates an event when called directly
      existingSubscriptionPlan.delete();
      const eventsAfterDelete = existingSubscriptionPlan.getUncommittedEvents();
      expect(eventsAfterDelete).toHaveLength(1);
      expect(eventsAfterDelete[0]).toBeInstanceOf(SubscriptionPlanDeletedEvent);

      // Now test the handler
      const existingSubscriptionPlanForHandler = new SubscriptionPlanAggregate(
        {
          id: new SubscriptionPlanUuidValueObject(subscriptionPlanId),
          name: new SubscriptionPlanNameValueObject('Test Plan'),
          slug: new SubscriptionPlanSlugValueObject('test-plan'),
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
        existingSubscriptionPlanForHandler,
      );
      mockSubscriptionPlanWriteRepository.delete.mockResolvedValue(undefined);
      mockEventBus.publishAll.mockResolvedValue(undefined);

      await handler.execute(command);

      // Verify that publishAll was called (the handler should call it with events)
      expect(mockEventBus.publishAll).toHaveBeenCalled();
      expect(mockEventBus.publishAll).toHaveBeenCalledTimes(1);
    });

    it('should delete from repository after calling delete on aggregate', async () => {
      const subscriptionPlanId = '123e4567-e89b-12d3-a456-426614174000';
      const commandDto: ISubscriptionPlanDeleteCommandDto = {
        id: subscriptionPlanId,
      };

      const command = new SubscriptionPlanDeleteCommand(commandDto);
      const existingSubscriptionPlan = new SubscriptionPlanAggregate(
        {
          id: new SubscriptionPlanUuidValueObject(subscriptionPlanId),
          name: new SubscriptionPlanNameValueObject('Test Plan'),
          slug: new SubscriptionPlanSlugValueObject('test-plan'),
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
        existingSubscriptionPlan,
      );
      mockSubscriptionPlanWriteRepository.delete.mockResolvedValue(undefined);
      mockEventBus.publishAll.mockResolvedValue(undefined);

      const deleteSpy = jest.spyOn(existingSubscriptionPlan, 'delete');
      await handler.execute(command);

      expect(deleteSpy).toHaveBeenCalled();
      expect(mockSubscriptionPlanWriteRepository.delete).toHaveBeenCalledWith(
        subscriptionPlanId,
      );

      deleteSpy.mockRestore();
    });

    it('should publish events before committing', async () => {
      const subscriptionPlanId = '123e4567-e89b-12d3-a456-426614174000';
      const commandDto: ISubscriptionPlanDeleteCommandDto = {
        id: subscriptionPlanId,
      };

      const command = new SubscriptionPlanDeleteCommand(commandDto);
      const existingSubscriptionPlan = new SubscriptionPlanAggregate(
        {
          id: new SubscriptionPlanUuidValueObject(subscriptionPlanId),
          name: new SubscriptionPlanNameValueObject('Test Plan'),
          slug: new SubscriptionPlanSlugValueObject('test-plan'),
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

      const commitSpy = jest.spyOn(existingSubscriptionPlan, 'commit');

      mockAssertSubscriptionPlanExsistsService.execute.mockResolvedValue(
        existingSubscriptionPlan,
      );
      mockSubscriptionPlanWriteRepository.delete.mockResolvedValue(undefined);
      mockEventBus.publishAll.mockResolvedValue(undefined);

      await handler.execute(command);

      const publishOrder = mockEventBus.publishAll.mock.invocationCallOrder[0];
      const commitOrder = commitSpy.mock.invocationCallOrder[0];
      expect(publishOrder).toBeLessThan(commitOrder);
    });

    it('should delete from repository before publishing events', async () => {
      const subscriptionPlanId = '123e4567-e89b-12d3-a456-426614174000';
      const commandDto: ISubscriptionPlanDeleteCommandDto = {
        id: subscriptionPlanId,
      };

      const command = new SubscriptionPlanDeleteCommand(commandDto);
      const existingSubscriptionPlan = new SubscriptionPlanAggregate(
        {
          id: new SubscriptionPlanUuidValueObject(subscriptionPlanId),
          name: new SubscriptionPlanNameValueObject('Test Plan'),
          slug: new SubscriptionPlanSlugValueObject('test-plan'),
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
        existingSubscriptionPlan,
      );
      mockSubscriptionPlanWriteRepository.delete.mockResolvedValue(undefined);
      mockEventBus.publishAll.mockResolvedValue(undefined);

      await handler.execute(command);

      const deleteOrder =
        mockSubscriptionPlanWriteRepository.delete.mock.invocationCallOrder[0];
      const publishOrder = mockEventBus.publishAll.mock.invocationCallOrder[0];
      expect(deleteOrder).toBeLessThan(publishOrder);
    });

    it('should use correct subscription plan id from command', async () => {
      const subscriptionPlanId = '123e4567-e89b-12d3-a456-426614174000';
      const commandDto: ISubscriptionPlanDeleteCommandDto = {
        id: subscriptionPlanId,
      };

      const command = new SubscriptionPlanDeleteCommand(commandDto);
      const existingSubscriptionPlan = new SubscriptionPlanAggregate(
        {
          id: new SubscriptionPlanUuidValueObject(subscriptionPlanId),
          name: new SubscriptionPlanNameValueObject('Test Plan'),
          slug: new SubscriptionPlanSlugValueObject('test-plan'),
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
        existingSubscriptionPlan,
      );
      mockSubscriptionPlanWriteRepository.delete.mockResolvedValue(undefined);
      mockEventBus.publishAll.mockResolvedValue(undefined);

      await handler.execute(command);

      expect(
        mockAssertSubscriptionPlanExsistsService.execute,
      ).toHaveBeenCalledWith(command.id.value);
      expect(mockSubscriptionPlanWriteRepository.delete).toHaveBeenCalledWith(
        existingSubscriptionPlan.id.value,
      );
    });
  });
});
