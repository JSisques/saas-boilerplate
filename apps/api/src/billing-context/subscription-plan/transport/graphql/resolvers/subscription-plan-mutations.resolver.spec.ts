import { SubscriptionPlanCreateCommand } from '@/billing-context/subscription-plan/application/commands/subscription-plan-create/subscription-plan-create.command';
import { SubscriptionPlanDeleteCommand } from '@/billing-context/subscription-plan/application/commands/subscription-plan-delete/subscription-plan-delete.command';
import { SubscriptionPlanUpdateCommand } from '@/billing-context/subscription-plan/application/commands/subscription-plan-update/subscription-plan-update.command';
import { SubscriptionPlanCreateRequestDto } from '@/billing-context/subscription-plan/transport/graphql/dtos/requests/subscription-plan-create.request.dto';
import { SubscriptionPlanDeleteRequestDto } from '@/billing-context/subscription-plan/transport/graphql/dtos/requests/subscription-plan-delete.request.dto';
import { SubscriptionPlanUpdateRequestDto } from '@/billing-context/subscription-plan/transport/graphql/dtos/requests/subscription-plan-update.request.dto';
import { SubscriptionPlanMutationsResolver } from '@/billing-context/subscription-plan/transport/graphql/resolvers/subscription-plan-mutations.resolver';
import { MutationResponseDto } from '@/shared/transport/graphql/dtos/responses/success-response/success-response.dto';
import { MutationResponseGraphQLMapper } from '@/shared/transport/graphql/mappers/mutation-response/mutation-response.mapper';
import { CommandBus } from '@nestjs/cqrs';
import {
  CurrencyEnum,
  SubscriptionPlanIntervalEnum,
  SubscriptionPlanTypeEnum,
} from '@prisma/client';

describe('SubscriptionPlanMutationsResolver', () => {
  let resolver: SubscriptionPlanMutationsResolver;
  let mockCommandBus: jest.Mocked<CommandBus>;
  let mockMutationResponseGraphQLMapper: jest.Mocked<MutationResponseGraphQLMapper>;

  beforeEach(() => {
    mockCommandBus = {
      execute: jest.fn(),
    } as unknown as jest.Mocked<CommandBus>;

    mockMutationResponseGraphQLMapper = {
      toResponseDto: jest.fn(),
    } as unknown as jest.Mocked<MutationResponseGraphQLMapper>;

    resolver = new SubscriptionPlanMutationsResolver(
      mockCommandBus,
      mockMutationResponseGraphQLMapper,
    );
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('subscriptionPlanCreate', () => {
    it('should create subscription plan successfully', async () => {
      const subscriptionPlanId = '123e4567-e89b-12d3-a456-426614174000';
      const input: SubscriptionPlanCreateRequestDto = {
        name: 'Basic Plan',
        type: SubscriptionPlanTypeEnum.BASIC,
        description: 'Basic subscription plan',
        priceMonthly: 10.0,
        currency: CurrencyEnum.USD,
        interval: SubscriptionPlanIntervalEnum.MONTHLY,
        intervalCount: 1,
        trialPeriodDays: 7,
        features: { apiAccess: true },
        limits: { maxUsers: 10 },
        stripePriceId: 'price_1234567890',
      };

      const mutationResponse: MutationResponseDto = {
        success: true,
        message: 'Subscription plan created successfully',
        id: subscriptionPlanId,
      };

      mockCommandBus.execute.mockResolvedValue(subscriptionPlanId);
      mockMutationResponseGraphQLMapper.toResponseDto.mockReturnValue(
        mutationResponse,
      );

      const result = await resolver.subscriptionPlanCreate(input);

      expect(result).toBe(mutationResponse);
      expect(mockCommandBus.execute).toHaveBeenCalledWith(
        expect.any(SubscriptionPlanCreateCommand),
      );
      const command = (mockCommandBus.execute as jest.Mock).mock.calls[0][0];
      expect(command).toBeInstanceOf(SubscriptionPlanCreateCommand);
      expect(
        mockMutationResponseGraphQLMapper.toResponseDto,
      ).toHaveBeenCalledWith({
        success: true,
        message: 'Subscription plan created successfully',
        id: subscriptionPlanId,
      });
    });

    it('should create subscription plan with minimal properties', async () => {
      const subscriptionPlanId = '123e4567-e89b-12d3-a456-426614174000';
      const input: SubscriptionPlanCreateRequestDto = {
        name: 'Basic Plan',
        type: SubscriptionPlanTypeEnum.BASIC,
        description: null,
        priceMonthly: 10.0,
        currency: CurrencyEnum.USD,
        interval: SubscriptionPlanIntervalEnum.MONTHLY,
        intervalCount: 1,
        trialPeriodDays: null,
        features: null,
        limits: null,
        stripePriceId: null,
      };

      const mutationResponse: MutationResponseDto = {
        success: true,
        message: 'Subscription plan created successfully',
        id: subscriptionPlanId,
      };

      mockCommandBus.execute.mockResolvedValue(subscriptionPlanId);
      mockMutationResponseGraphQLMapper.toResponseDto.mockReturnValue(
        mutationResponse,
      );

      const result = await resolver.subscriptionPlanCreate(input);

      expect(result).toBe(mutationResponse);
      expect(mockCommandBus.execute).toHaveBeenCalledWith(
        expect.any(SubscriptionPlanCreateCommand),
      );
    });

    it('should handle errors from command bus', async () => {
      const input: SubscriptionPlanCreateRequestDto = {
        name: 'Basic Plan',
        type: SubscriptionPlanTypeEnum.BASIC,
        description: null,
        priceMonthly: 10.0,
        currency: CurrencyEnum.USD,
        interval: SubscriptionPlanIntervalEnum.MONTHLY,
        intervalCount: 1,
        trialPeriodDays: null,
        features: null,
        limits: null,
        stripePriceId: null,
      };

      const error = new Error('Subscription plan slug already exists');
      mockCommandBus.execute.mockRejectedValue(error);

      await expect(resolver.subscriptionPlanCreate(input)).rejects.toThrow(
        error,
      );
      expect(mockCommandBus.execute).toHaveBeenCalledWith(
        expect.any(SubscriptionPlanCreateCommand),
      );
      expect(
        mockMutationResponseGraphQLMapper.toResponseDto,
      ).not.toHaveBeenCalled();
    });
  });

  describe('subscriptionPlanUpdate', () => {
    it('should update subscription plan successfully', async () => {
      const subscriptionPlanId = '123e4567-e89b-12d3-a456-426614174000';
      const input: SubscriptionPlanUpdateRequestDto = {
        id: subscriptionPlanId,
        name: 'Pro Plan',
        type: SubscriptionPlanTypeEnum.PRO,
        description: 'Professional plan',
        priceMonthly: 29.99,
        currency: CurrencyEnum.EUR,
        interval: SubscriptionPlanIntervalEnum.YEARLY,
        intervalCount: 1,
        trialPeriodDays: 14,
        features: { apiAccess: true, prioritySupport: true },
        limits: { maxUsers: 100 },
        stripePriceId: 'price_pro123',
      };

      const mutationResponse: MutationResponseDto = {
        success: true,
        message: 'Subscription plan updated successfully',
        id: subscriptionPlanId,
      };

      mockCommandBus.execute.mockResolvedValue(undefined);
      mockMutationResponseGraphQLMapper.toResponseDto.mockReturnValue(
        mutationResponse,
      );

      const result = await resolver.subscriptionPlanUpdate(input);

      expect(result).toBe(mutationResponse);
      expect(mockCommandBus.execute).toHaveBeenCalledWith(
        expect.any(SubscriptionPlanUpdateCommand),
      );
      const command = (mockCommandBus.execute as jest.Mock).mock.calls[0][0];
      expect(command).toBeInstanceOf(SubscriptionPlanUpdateCommand);
      expect(command.id.value).toBe(subscriptionPlanId);
      expect(command.name?.value).toBe('Pro Plan');
      expect(command.type?.value).toBe(SubscriptionPlanTypeEnum.PRO);
      expect(command.description?.value).toBe('Professional plan');
      expect(command.priceMonthly?.value).toBe(29.99);
      expect(command.currency?.value).toBe(CurrencyEnum.EUR);
      expect(command.interval?.value).toBe(SubscriptionPlanIntervalEnum.YEARLY);
      expect(command.intervalCount?.value).toBe(1);
      expect(command.trialPeriodDays?.value).toBe(14);
      expect(command.features?.value).toEqual({
        apiAccess: true,
        prioritySupport: true,
      });
      expect(command.limits?.value).toEqual({ maxUsers: 100 });
      expect(command.stripePriceId?.value).toBe('price_pro123');
      expect(
        mockMutationResponseGraphQLMapper.toResponseDto,
      ).toHaveBeenCalledWith({
        success: true,
        message: 'Subscription plan updated successfully',
        id: subscriptionPlanId,
      });
    });

    it('should update subscription plan with partial data', async () => {
      const subscriptionPlanId = '123e4567-e89b-12d3-a456-426614174000';
      const input: SubscriptionPlanUpdateRequestDto = {
        id: subscriptionPlanId,
        name: 'Updated Plan',
        type: null,
        description: null,
        priceMonthly: null,
        currency: null,
        interval: null,
        intervalCount: null,
        trialPeriodDays: null,
        features: null,
        limits: null,
        stripePriceId: null,
      };

      const mutationResponse: MutationResponseDto = {
        success: true,
        message: 'Subscription plan updated successfully',
        id: subscriptionPlanId,
      };

      mockCommandBus.execute.mockResolvedValue(undefined);
      mockMutationResponseGraphQLMapper.toResponseDto.mockReturnValue(
        mutationResponse,
      );

      const result = await resolver.subscriptionPlanUpdate(input);

      expect(result).toBe(mutationResponse);
      expect(mockCommandBus.execute).toHaveBeenCalledWith(
        expect.any(SubscriptionPlanUpdateCommand),
      );
      const command = (mockCommandBus.execute as jest.Mock).mock.calls[0][0];
      expect(command.id.value).toBe(subscriptionPlanId);
      expect(command.name?.value).toBe('Updated Plan');
      expect(
        mockMutationResponseGraphQLMapper.toResponseDto,
      ).toHaveBeenCalledWith({
        success: true,
        message: 'Subscription plan updated successfully',
        id: subscriptionPlanId,
      });
    });

    it('should handle errors from command bus', async () => {
      const subscriptionPlanId = '123e4567-e89b-12d3-a456-426614174000';
      const input: SubscriptionPlanUpdateRequestDto = {
        id: subscriptionPlanId,
        name: 'Test Plan',
        type: SubscriptionPlanTypeEnum.BASIC,
        description: null,
        priceMonthly: 10.0,
        currency: CurrencyEnum.USD,
        interval: SubscriptionPlanIntervalEnum.MONTHLY,
        intervalCount: 1,
        trialPeriodDays: null,
        features: null,
        limits: null,
        stripePriceId: null,
      };

      const error = new Error('Subscription plan not found');
      mockCommandBus.execute.mockRejectedValue(error);

      await expect(resolver.subscriptionPlanUpdate(input)).rejects.toThrow(
        error,
      );
      expect(mockCommandBus.execute).toHaveBeenCalledWith(
        expect.any(SubscriptionPlanUpdateCommand),
      );
      expect(
        mockMutationResponseGraphQLMapper.toResponseDto,
      ).not.toHaveBeenCalled();
    });
  });

  describe('subscriptionPlanDelete', () => {
    it('should delete subscription plan successfully', async () => {
      const subscriptionPlanId = '123e4567-e89b-12d3-a456-426614174000';
      const input: SubscriptionPlanDeleteRequestDto = {
        id: subscriptionPlanId,
      };

      const mutationResponse: MutationResponseDto = {
        success: true,
        message: 'Subscription plan deleted successfully',
        id: subscriptionPlanId,
      };

      mockCommandBus.execute.mockResolvedValue(undefined);
      mockMutationResponseGraphQLMapper.toResponseDto.mockReturnValue(
        mutationResponse,
      );

      const result = await resolver.subscriptionPlanDelete(input);

      expect(result).toBe(mutationResponse);
      expect(mockCommandBus.execute).toHaveBeenCalledWith(
        expect.any(SubscriptionPlanDeleteCommand),
      );
      const command = (mockCommandBus.execute as jest.Mock).mock.calls[0][0];
      expect(command).toBeInstanceOf(SubscriptionPlanDeleteCommand);
      expect(command.id.value).toBe(subscriptionPlanId);
      expect(
        mockMutationResponseGraphQLMapper.toResponseDto,
      ).toHaveBeenCalledWith({
        success: true,
        message: 'Subscription plan deleted successfully',
        id: subscriptionPlanId,
      });
    });

    it('should handle errors from command bus', async () => {
      const subscriptionPlanId = '123e4567-e89b-12d3-a456-426614174000';
      const input: SubscriptionPlanDeleteRequestDto = {
        id: subscriptionPlanId,
      };

      const error = new Error('Subscription plan not found');
      mockCommandBus.execute.mockRejectedValue(error);

      await expect(resolver.subscriptionPlanDelete(input)).rejects.toThrow(
        error,
      );
      expect(mockCommandBus.execute).toHaveBeenCalledWith(
        expect.any(SubscriptionPlanDeleteCommand),
      );
      expect(
        mockMutationResponseGraphQLMapper.toResponseDto,
      ).not.toHaveBeenCalled();
    });
  });
});
