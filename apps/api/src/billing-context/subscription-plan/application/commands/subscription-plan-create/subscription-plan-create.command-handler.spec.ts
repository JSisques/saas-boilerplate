import { SubscriptionPlanCreateCommand } from '@/billing-context/subscription-plan/application/commands/subscription-plan-create/subscription-plan-create.command';
import { SubscriptionPlanCreateCommandHandler } from '@/billing-context/subscription-plan/application/commands/subscription-plan-create/subscription-plan-create.command-handler';
import { ISubscriptionPlanCreateCommandDto } from '@/billing-context/subscription-plan/application/dtos/commands/subscription-plan-create/subscription-plan-create-command.dto';
import { SubscriptionPlanSlugIsAlreadyTakenException } from '@/billing-context/subscription-plan/application/exceptions/subscription-plan-slug-is-not-unique/subscription-plan-slug-is-not-unique.exception';
import { SubscriptionPlanTypeIsAlreadyTakenException } from '@/billing-context/subscription-plan/application/exceptions/subscription-plan-type-is-not-unique copy/subscription-plan-type-is-not-unique.exception';
import { AssertSubscriptionPlanSlugIsUniqueService } from '@/billing-context/subscription-plan/application/services/assert-subscription-plan-slug-is-unique/assert-subscription-plan-slug-is-unique.service';
import { AssertSubscriptionPlanTypeIsUniqueService } from '@/billing-context/subscription-plan/application/services/assert-subscription-plan-type-is-unique/assert-subscription-plan-type-is-unique.service';
import { SubscriptionPlanAggregate } from '@/billing-context/subscription-plan/domain/aggregates/subscription-plan.aggregate';
import { SubscriptionPlanCurrencyEnum } from '@/billing-context/subscription-plan/domain/enum/subscription-plan-currency/subscription-plan-currency.enum';
import { SubscriptionPlanAggregateFactory } from '@/billing-context/subscription-plan/domain/factories/subscription-plan-aggregate/subscription-plan-aggregate.factory';
import { SubscriptionPlanWriteRepository } from '@/billing-context/subscription-plan/domain/repositories/subscription-plan-write/subscription-plan-write.repository';
import { SubscriptionPlanIntervalEnum } from '@/shared/domain/enums/billing-context/subscription-plans/subscription-plan-interval/subscription-plan-interval.enum';
import { SubscriptionPlanTypeEnum } from '@/shared/domain/enums/billing-context/subscription-plans/subscription-plan-type/subscription-plan-type.enum';
import { SubscriptionPlanCreatedEvent } from '@/shared/domain/events/billing-context/subscription-plan/subscription-plan-created/subscription-plan-created.event';
import { DateValueObject } from '@/shared/domain/value-objects/date/date.vo';
import { SubscriptionPlanUuidValueObject } from '@/shared/domain/value-objects/identifiers/subscription-plan/subscription-plan-uuid.vo';
import { EventBus } from '@nestjs/cqrs';

describe('SubscriptionPlanCreateCommandHandler', () => {
  let handler: SubscriptionPlanCreateCommandHandler;
  let mockSubscriptionPlanWriteRepository: jest.Mocked<SubscriptionPlanWriteRepository>;
  let mockEventBus: jest.Mocked<EventBus>;
  let mockSubscriptionPlanAggregateFactory: jest.Mocked<SubscriptionPlanAggregateFactory>;
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

    mockSubscriptionPlanAggregateFactory = {
      create: jest.fn(),
      fromPrimitives: jest.fn(),
    } as unknown as jest.Mocked<SubscriptionPlanAggregateFactory>;

    mockAssertSubscriptionPlanSlugIsUniqueService = {
      execute: jest.fn(),
    } as unknown as jest.Mocked<AssertSubscriptionPlanSlugIsUniqueService>;

    mockAssertSubscriptionPlanTypeIsUniqueService = {
      execute: jest.fn(),
    } as unknown as jest.Mocked<AssertSubscriptionPlanTypeIsUniqueService>;

    handler = new SubscriptionPlanCreateCommandHandler(
      mockSubscriptionPlanWriteRepository,
      mockEventBus,
      mockSubscriptionPlanAggregateFactory,
      mockAssertSubscriptionPlanSlugIsUniqueService,
      mockAssertSubscriptionPlanTypeIsUniqueService,
    );
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('execute', () => {
    it('should create subscription plan successfully when slug and type are unique', async () => {
      const commandDto: ISubscriptionPlanCreateCommandDto = {
        name: 'Basic Plan',
        type: SubscriptionPlanTypeEnum.BASIC,
        description: 'Basic subscription plan',
        priceMonthly: 10.0,
        currency: SubscriptionPlanCurrencyEnum.USD,
        interval: SubscriptionPlanIntervalEnum.MONTHLY,
        intervalCount: 1,
        trialPeriodDays: 7,
        features: { feature1: 'value1' },
        limits: { limit1: 100 },
        stripePriceId: 'price_123',
      };

      const command = new SubscriptionPlanCreateCommand(commandDto);
      const mockSubscriptionPlan = new SubscriptionPlanAggregate(
        {
          id: new SubscriptionPlanUuidValueObject(),
          name: command.name,
          slug: command.slug,
          type: command.type,
          description: command.description,
          priceMonthly: command.priceMonthly,
          priceYearly: command.priceYearly,
          currency: command.currency,
          interval: command.interval,
          intervalCount: command.intervalCount,
          trialPeriodDays: command.trialPeriodDays,
          isActive: command.isActive,
          features: command.features,
          limits: command.limits,
          stripePriceId: command.stripePriceId,
          createdAt: new DateValueObject(new Date()),
          updatedAt: new DateValueObject(new Date()),
        },
        true,
      );

      mockAssertSubscriptionPlanSlugIsUniqueService.execute.mockResolvedValue(
        undefined,
      );
      mockAssertSubscriptionPlanTypeIsUniqueService.execute.mockResolvedValue(
        undefined,
      );
      mockSubscriptionPlanAggregateFactory.create.mockReturnValue(
        mockSubscriptionPlan,
      );
      mockSubscriptionPlanWriteRepository.save.mockResolvedValue(undefined);
      mockEventBus.publishAll.mockResolvedValue(undefined);

      const result = await handler.execute(command);

      expect(result).toBe(mockSubscriptionPlan.id.value);
      expect(
        mockAssertSubscriptionPlanSlugIsUniqueService.execute,
      ).toHaveBeenCalledWith(command.slug.value);
      expect(
        mockAssertSubscriptionPlanSlugIsUniqueService.execute,
      ).toHaveBeenCalledTimes(1);
      expect(
        mockAssertSubscriptionPlanTypeIsUniqueService.execute,
      ).toHaveBeenCalledWith(command.type.value);
      expect(
        mockAssertSubscriptionPlanTypeIsUniqueService.execute,
      ).toHaveBeenCalledTimes(1);
      expect(mockSubscriptionPlanAggregateFactory.create).toHaveBeenCalledWith(
        expect.objectContaining({
          id: command.id,
          name: command.name,
          slug: command.slug,
          type: command.type,
          description: command.description,
          priceMonthly: command.priceMonthly,
          priceYearly: command.priceYearly,
          currency: command.currency,
          interval: command.interval,
          intervalCount: command.intervalCount,
          trialPeriodDays: command.trialPeriodDays,
          isActive: command.isActive,
          features: command.features,
          limits: command.limits,
          stripePriceId: command.stripePriceId,
        }),
      );
      const createCall =
        mockSubscriptionPlanAggregateFactory.create.mock.calls[0][0];
      expect(createCall.createdAt).toBeInstanceOf(DateValueObject);
      expect(createCall.updatedAt).toBeInstanceOf(DateValueObject);
      expect(mockSubscriptionPlanWriteRepository.save).toHaveBeenCalledWith(
        mockSubscriptionPlan,
      );
      expect(mockSubscriptionPlanWriteRepository.save).toHaveBeenCalledTimes(1);
      expect(mockEventBus.publishAll).toHaveBeenCalledWith(
        mockSubscriptionPlan.getUncommittedEvents(),
      );
      expect(mockEventBus.publishAll).toHaveBeenCalledTimes(1);
    });

    it('should throw exception when slug is not unique', async () => {
      const commandDto: ISubscriptionPlanCreateCommandDto = {
        name: 'Basic Plan',
        type: SubscriptionPlanTypeEnum.BASIC,
        description: 'Basic subscription plan',
        priceMonthly: 10.0,
        currency: SubscriptionPlanCurrencyEnum.USD,
        interval: SubscriptionPlanIntervalEnum.MONTHLY,
        intervalCount: 1,
        trialPeriodDays: 7,
        features: null,
        limits: null,
        stripePriceId: null,
      };

      const command = new SubscriptionPlanCreateCommand(commandDto);
      const error = new SubscriptionPlanSlugIsAlreadyTakenException(
        command.slug.value,
      );

      mockAssertSubscriptionPlanSlugIsUniqueService.execute.mockRejectedValue(
        error,
      );
      // Note: Promise.all executes both promises in parallel, so both will be called
      // even though the slug check fails first
      mockAssertSubscriptionPlanTypeIsUniqueService.execute.mockResolvedValue(
        undefined,
      );

      await expect(handler.execute(command)).rejects.toThrow(error);
      expect(
        mockAssertSubscriptionPlanSlugIsUniqueService.execute,
      ).toHaveBeenCalledWith(command.slug.value);
      // Both asserts are executed in parallel via Promise.all
      expect(
        mockAssertSubscriptionPlanTypeIsUniqueService.execute,
      ).toHaveBeenCalledWith(command.type.value);
      expect(
        mockSubscriptionPlanAggregateFactory.create,
      ).not.toHaveBeenCalled();
      expect(mockSubscriptionPlanWriteRepository.save).not.toHaveBeenCalled();
      expect(mockEventBus.publishAll).not.toHaveBeenCalled();
    });

    it('should throw exception when type is not unique', async () => {
      const commandDto: ISubscriptionPlanCreateCommandDto = {
        name: 'Basic Plan',
        type: SubscriptionPlanTypeEnum.BASIC,
        description: 'Basic subscription plan',
        priceMonthly: 10.0,
        currency: SubscriptionPlanCurrencyEnum.USD,
        interval: SubscriptionPlanIntervalEnum.MONTHLY,
        intervalCount: 1,
        trialPeriodDays: 7,
        features: null,
        limits: null,
        stripePriceId: null,
      };

      const command = new SubscriptionPlanCreateCommand(commandDto);
      const error = new SubscriptionPlanTypeIsAlreadyTakenException(
        command.type.value as SubscriptionPlanTypeEnum,
      );

      mockAssertSubscriptionPlanSlugIsUniqueService.execute.mockResolvedValue(
        undefined,
      );
      mockAssertSubscriptionPlanTypeIsUniqueService.execute.mockRejectedValue(
        error,
      );

      await expect(handler.execute(command)).rejects.toThrow(error);
      expect(
        mockAssertSubscriptionPlanSlugIsUniqueService.execute,
      ).toHaveBeenCalledWith(command.slug.value);
      expect(
        mockAssertSubscriptionPlanTypeIsUniqueService.execute,
      ).toHaveBeenCalledWith(command.type.value);
      expect(
        mockSubscriptionPlanAggregateFactory.create,
      ).not.toHaveBeenCalled();
      expect(mockSubscriptionPlanWriteRepository.save).not.toHaveBeenCalled();
      expect(mockEventBus.publishAll).not.toHaveBeenCalled();
    });

    it('should publish SubscriptionPlanCreatedEvent when subscription plan is created', async () => {
      const commandDto: ISubscriptionPlanCreateCommandDto = {
        name: 'Basic Plan',
        type: SubscriptionPlanTypeEnum.BASIC,
        description: 'Basic subscription plan',
        priceMonthly: 10.0,
        currency: SubscriptionPlanCurrencyEnum.USD,
        interval: SubscriptionPlanIntervalEnum.MONTHLY,
        intervalCount: 1,
        trialPeriodDays: 7,
        features: null,
        limits: null,
        stripePriceId: null,
      };

      const command = new SubscriptionPlanCreateCommand(commandDto);
      const mockSubscriptionPlan = new SubscriptionPlanAggregate(
        {
          id: new SubscriptionPlanUuidValueObject(),
          name: command.name,
          slug: command.slug,
          type: command.type,
          description: command.description,
          priceMonthly: command.priceMonthly,
          priceYearly: command.priceYearly,
          currency: command.currency,
          interval: command.interval,
          intervalCount: command.intervalCount,
          trialPeriodDays: command.trialPeriodDays,
          isActive: command.isActive,
          features: command.features,
          limits: command.limits,
          stripePriceId: command.stripePriceId,
          createdAt: new DateValueObject(new Date()),
          updatedAt: new DateValueObject(new Date()),
        },
        true,
      );

      mockAssertSubscriptionPlanSlugIsUniqueService.execute.mockResolvedValue(
        undefined,
      );
      mockAssertSubscriptionPlanTypeIsUniqueService.execute.mockResolvedValue(
        undefined,
      );
      mockSubscriptionPlanAggregateFactory.create.mockReturnValue(
        mockSubscriptionPlan,
      );
      mockSubscriptionPlanWriteRepository.save.mockResolvedValue(undefined);

      // Verify that the aggregate has events before execution
      expect(mockSubscriptionPlan.getUncommittedEvents()).toHaveLength(1);

      // Capture the events that will be passed to publishAll
      let capturedEvents: any[] = [];
      mockEventBus.publishAll.mockImplementation((events) => {
        capturedEvents = Array.isArray(events) ? [...events] : [];
        return Promise.resolve(undefined);
      });

      await handler.execute(command);

      // Verify that publishAll was called with the events
      expect(mockEventBus.publishAll).toHaveBeenCalled();
      expect(mockEventBus.publishAll).toHaveBeenCalledTimes(1);
      expect(capturedEvents).toHaveLength(1);
      expect(capturedEvents[0]).toBeInstanceOf(SubscriptionPlanCreatedEvent);
      // Verify events were commited (array should be empty after commit)
      expect(mockSubscriptionPlan.getUncommittedEvents()).toHaveLength(0);
    });

    it('should save subscription plan before publishing events', async () => {
      const commandDto: ISubscriptionPlanCreateCommandDto = {
        name: 'Basic Plan',
        type: SubscriptionPlanTypeEnum.BASIC,
        description: 'Basic subscription plan',
        priceMonthly: 10.0,
        currency: SubscriptionPlanCurrencyEnum.USD,
        interval: SubscriptionPlanIntervalEnum.MONTHLY,
        intervalCount: 1,
        trialPeriodDays: 7,
        features: null,
        limits: null,
        stripePriceId: null,
      };

      const command = new SubscriptionPlanCreateCommand(commandDto);
      const mockSubscriptionPlan = new SubscriptionPlanAggregate(
        {
          id: new SubscriptionPlanUuidValueObject(),
          name: command.name,
          slug: command.slug,
          type: command.type,
          description: command.description,
          priceMonthly: command.priceMonthly,
          priceYearly: command.priceYearly,
          currency: command.currency,
          interval: command.interval,
          intervalCount: command.intervalCount,
          trialPeriodDays: command.trialPeriodDays,
          isActive: command.isActive,
          features: command.features,
          limits: command.limits,
          stripePriceId: command.stripePriceId,
          createdAt: new DateValueObject(new Date()),
          updatedAt: new DateValueObject(new Date()),
        },
        true,
      );

      mockAssertSubscriptionPlanSlugIsUniqueService.execute.mockResolvedValue(
        undefined,
      );
      mockAssertSubscriptionPlanTypeIsUniqueService.execute.mockResolvedValue(
        undefined,
      );
      mockSubscriptionPlanAggregateFactory.create.mockReturnValue(
        mockSubscriptionPlan,
      );
      mockSubscriptionPlanWriteRepository.save.mockResolvedValue(undefined);
      mockEventBus.publishAll.mockResolvedValue(undefined);

      await handler.execute(command);

      const saveOrder =
        mockSubscriptionPlanWriteRepository.save.mock.invocationCallOrder[0];
      const publishOrder = mockEventBus.publishAll.mock.invocationCallOrder[0];
      expect(saveOrder).toBeLessThan(publishOrder);
    });

    it('should return the created subscription plan id', async () => {
      const commandDto: ISubscriptionPlanCreateCommandDto = {
        name: 'Basic Plan',
        type: SubscriptionPlanTypeEnum.BASIC,
        description: 'Basic subscription plan',
        priceMonthly: 10.0,
        currency: SubscriptionPlanCurrencyEnum.USD,
        interval: SubscriptionPlanIntervalEnum.MONTHLY,
        intervalCount: 1,
        trialPeriodDays: 7,
        features: null,
        limits: null,
        stripePriceId: null,
      };

      const command = new SubscriptionPlanCreateCommand(commandDto);
      const subscriptionPlanId = '123e4567-e89b-12d3-a456-426614174000';
      const mockSubscriptionPlan = new SubscriptionPlanAggregate(
        {
          id: new SubscriptionPlanUuidValueObject(subscriptionPlanId),
          name: command.name,
          slug: command.slug,
          type: command.type,
          description: command.description,
          priceMonthly: command.priceMonthly,
          priceYearly: command.priceYearly,
          currency: command.currency,
          interval: command.interval,
          intervalCount: command.intervalCount,
          trialPeriodDays: command.trialPeriodDays,
          isActive: command.isActive,
          features: command.features,
          limits: command.limits,
          stripePriceId: command.stripePriceId,
          createdAt: new DateValueObject(new Date()),
          updatedAt: new DateValueObject(new Date()),
        },
        true,
      );

      mockAssertSubscriptionPlanSlugIsUniqueService.execute.mockResolvedValue(
        undefined,
      );
      mockAssertSubscriptionPlanTypeIsUniqueService.execute.mockResolvedValue(
        undefined,
      );
      mockSubscriptionPlanAggregateFactory.create.mockReturnValue(
        mockSubscriptionPlan,
      );
      mockSubscriptionPlanWriteRepository.save.mockResolvedValue(undefined);
      mockEventBus.publishAll.mockResolvedValue(undefined);

      const result = await handler.execute(command);

      expect(result).toBe(subscriptionPlanId);
    });

    it('should commit events after publishing', async () => {
      const commandDto: ISubscriptionPlanCreateCommandDto = {
        name: 'Basic Plan',
        type: SubscriptionPlanTypeEnum.BASIC,
        description: 'Basic subscription plan',
        priceMonthly: 10.0,
        currency: SubscriptionPlanCurrencyEnum.USD,
        interval: SubscriptionPlanIntervalEnum.MONTHLY,
        intervalCount: 1,
        trialPeriodDays: 7,
        features: null,
        limits: null,
        stripePriceId: null,
      };

      const command = new SubscriptionPlanCreateCommand(commandDto);
      const mockSubscriptionPlan = new SubscriptionPlanAggregate(
        {
          id: new SubscriptionPlanUuidValueObject(),
          name: command.name,
          slug: command.slug,
          type: command.type,
          description: command.description,
          priceMonthly: command.priceMonthly,
          priceYearly: command.priceYearly,
          currency: command.currency,
          interval: command.interval,
          intervalCount: command.intervalCount,
          trialPeriodDays: command.trialPeriodDays,
          isActive: command.isActive,
          features: command.features,
          limits: command.limits,
          stripePriceId: command.stripePriceId,
          createdAt: new DateValueObject(new Date()),
          updatedAt: new DateValueObject(new Date()),
        },
        true,
      );

      mockAssertSubscriptionPlanSlugIsUniqueService.execute.mockResolvedValue(
        undefined,
      );
      mockAssertSubscriptionPlanTypeIsUniqueService.execute.mockResolvedValue(
        undefined,
      );
      mockSubscriptionPlanAggregateFactory.create.mockReturnValue(
        mockSubscriptionPlan,
      );
      mockSubscriptionPlanWriteRepository.save.mockResolvedValue(undefined);
      mockEventBus.publishAll.mockResolvedValue(undefined);

      await handler.execute(command);

      expect(mockSubscriptionPlan.getUncommittedEvents()).toHaveLength(0);
    });
  });
});
