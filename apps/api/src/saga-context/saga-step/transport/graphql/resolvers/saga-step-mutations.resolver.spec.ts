import { BadRequestException } from '@nestjs/common';
import { CommandBus } from '@nestjs/cqrs';
import { SagaStepChangeStatusCommand } from '@/saga-context/saga-step/application/commands/saga-step-change-status/saga-step-change-status.command';
import { SagaStepCreateCommand } from '@/saga-context/saga-step/application/commands/saga-step-create/saga-step-create.command';
import { SagaStepDeleteCommand } from '@/saga-context/saga-step/application/commands/saga-step-delete/saga-step-delete.command';
import { SagaStepUpdateCommand } from '@/saga-context/saga-step/application/commands/saga-step-update/saga-step-update.command';
import { SagaStepMutationsResolver } from '@/saga-context/saga-step/transport/graphql/resolvers/saga-step-mutations.resolver';
import { SagaStepChangeStatusRequestDto } from '@/saga-context/saga-step/transport/graphql/dtos/requests/saga-step-change-status.request.dto';
import { SagaStepCreateRequestDto } from '@/saga-context/saga-step/transport/graphql/dtos/requests/saga-step-create.request.dto';
import { SagaStepDeleteRequestDto } from '@/saga-context/saga-step/transport/graphql/dtos/requests/saga-step-delete.request.dto';
import { SagaStepUpdateRequestDto } from '@/saga-context/saga-step/transport/graphql/dtos/requests/saga-step-update.request.dto';
import { MutationResponseDto } from '@/shared/transport/graphql/dtos/responses/success-response/success-response.dto';
import { MutationResponseGraphQLMapper } from '@/shared/transport/graphql/mappers/mutation-response/mutation-response.mapper';
import { SagaStepStatusEnum } from '@/saga-context/saga-step/domain/enums/saga-step-status/saga-step-status.enum';

describe('SagaStepMutationsResolver', () => {
  let resolver: SagaStepMutationsResolver;
  let mockCommandBus: jest.Mocked<CommandBus>;
  let mockMutationResponseGraphQLMapper: jest.Mocked<MutationResponseGraphQLMapper>;

  beforeEach(() => {
    mockCommandBus = {
      execute: jest.fn(),
    } as unknown as jest.Mocked<CommandBus>;

    mockMutationResponseGraphQLMapper = {
      toResponseDto: jest.fn(),
    } as unknown as jest.Mocked<MutationResponseGraphQLMapper>;

    resolver = new SagaStepMutationsResolver(
      mockCommandBus,
      mockMutationResponseGraphQLMapper,
    );
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('sagaStepCreate', () => {
    it('should create saga step successfully', async () => {
      const sagaStepId = '123e4567-e89b-12d3-a456-426614174000';
      const input: SagaStepCreateRequestDto = {
        sagaInstanceId: '223e4567-e89b-12d3-a456-426614174000',
        name: 'Process Payment',
        order: 1,
        payload: JSON.stringify({ orderId: '12345' }),
      };

      const mutationResponse: MutationResponseDto = {
        success: true,
        message: 'Saga step created successfully',
        id: sagaStepId,
      };

      mockCommandBus.execute.mockResolvedValue(sagaStepId);
      mockMutationResponseGraphQLMapper.toResponseDto.mockReturnValue(
        mutationResponse,
      );

      const result = await resolver.sagaStepCreate(input);

      expect(result).toBe(mutationResponse);
      expect(mockCommandBus.execute).toHaveBeenCalledWith(
        expect.any(SagaStepCreateCommand),
      );
      const command = (mockCommandBus.execute as jest.Mock).mock.calls[0][0];
      expect(command).toBeInstanceOf(SagaStepCreateCommand);
      expect(command.sagaInstanceId.value).toBe(input.sagaInstanceId);
      expect(command.name.value).toBe(input.name);
      expect(command.order.value).toBe(input.order);
      expect(command.payload.value).toEqual({ orderId: '12345' });
      expect(
        mockMutationResponseGraphQLMapper.toResponseDto,
      ).toHaveBeenCalledWith({
        success: true,
        message: 'Saga step created successfully',
        id: sagaStepId,
      });
    });

    it('should throw BadRequestException for invalid JSON payload', async () => {
      const input: SagaStepCreateRequestDto = {
        sagaInstanceId: '223e4567-e89b-12d3-a456-426614174000',
        name: 'Process Payment',
        order: 1,
        payload: 'invalid json',
      };

      await expect(resolver.sagaStepCreate(input)).rejects.toThrow(
        BadRequestException,
      );
      expect(mockCommandBus.execute).not.toHaveBeenCalled();
    });

    it('should handle empty JSON payload', async () => {
      const sagaStepId = '123e4567-e89b-12d3-a456-426614174000';
      const input: SagaStepCreateRequestDto = {
        sagaInstanceId: '223e4567-e89b-12d3-a456-426614174000',
        name: 'Process Payment',
        order: 1,
        payload: JSON.stringify({}),
      };

      mockCommandBus.execute.mockResolvedValue(sagaStepId);
      mockMutationResponseGraphQLMapper.toResponseDto.mockReturnValue({
        success: true,
        message: 'Saga step created successfully',
        id: sagaStepId,
      });

      await resolver.sagaStepCreate(input);

      const command = (mockCommandBus.execute as jest.Mock).mock.calls[0][0];
      expect(command.payload.value).toEqual({});
    });
  });

  describe('sagaStepUpdate', () => {
    it('should update saga step successfully', async () => {
      const sagaStepId = '123e4567-e89b-12d3-a456-426614174000';
      const input: SagaStepUpdateRequestDto = {
        id: sagaStepId,
        name: 'Process Payment Updated',
        order: 2,
        status: SagaStepStatusEnum.COMPLETED,
        payload: JSON.stringify({ orderId: '12345', updated: true }),
        result: JSON.stringify({ success: true }),
      };

      const mutationResponse: MutationResponseDto = {
        success: true,
        message: 'Saga step updated successfully',
        id: sagaStepId,
      };

      mockCommandBus.execute.mockResolvedValue(undefined);
      mockMutationResponseGraphQLMapper.toResponseDto.mockReturnValue(
        mutationResponse,
      );

      const result = await resolver.sagaStepUpdate(input);

      expect(result).toBe(mutationResponse);
      expect(mockCommandBus.execute).toHaveBeenCalledWith(
        expect.any(SagaStepUpdateCommand),
      );
      const command = (mockCommandBus.execute as jest.Mock).mock.calls[0][0];
      expect(command).toBeInstanceOf(SagaStepUpdateCommand);
      expect(command.id.value).toBe(sagaStepId);
      expect(command.name?.value).toBe(input.name);
      expect(command.order?.value).toBe(input.order);
      expect(command.status?.value).toBe(input.status);
      expect(command.payload?.value).toEqual({
        orderId: '12345',
        updated: true,
      });
      expect(command.result?.value).toEqual({ success: true });
      expect(
        mockMutationResponseGraphQLMapper.toResponseDto,
      ).toHaveBeenCalledWith({
        success: true,
        message: 'Saga step updated successfully',
        id: sagaStepId,
      });
    });

    it('should update saga step without payload and result', async () => {
      const sagaStepId = '123e4567-e89b-12d3-a456-426614174000';
      const input: SagaStepUpdateRequestDto = {
        id: sagaStepId,
        name: 'Process Payment Updated',
        order: 2,
      };

      mockCommandBus.execute.mockResolvedValue(undefined);
      mockMutationResponseGraphQLMapper.toResponseDto.mockReturnValue({
        success: true,
        message: 'Saga step updated successfully',
        id: sagaStepId,
      });

      await resolver.sagaStepUpdate(input);

      const command = (mockCommandBus.execute as jest.Mock).mock.calls[0][0];
      expect(command.payload).toBeUndefined();
      expect(command.result).toBeUndefined();
    });

    it('should throw BadRequestException for invalid JSON payload', async () => {
      const input: SagaStepUpdateRequestDto = {
        id: '123e4567-e89b-12d3-a456-426614174000',
        name: 'Process Payment',
        payload: 'invalid json',
      };

      await expect(resolver.sagaStepUpdate(input)).rejects.toThrow(
        BadRequestException,
      );
      expect(mockCommandBus.execute).not.toHaveBeenCalled();
    });

    it('should throw BadRequestException for invalid JSON result', async () => {
      const input: SagaStepUpdateRequestDto = {
        id: '123e4567-e89b-12d3-a456-426614174000',
        name: 'Process Payment',
        result: 'invalid json',
      };

      await expect(resolver.sagaStepUpdate(input)).rejects.toThrow(
        BadRequestException,
      );
      expect(mockCommandBus.execute).not.toHaveBeenCalled();
    });
  });

  describe('sagaStepChangeStatus', () => {
    it('should change saga step status successfully', async () => {
      const sagaStepId = '123e4567-e89b-12d3-a456-426614174000';
      const input: SagaStepChangeStatusRequestDto = {
        id: sagaStepId,
        status: SagaStepStatusEnum.COMPLETED,
      };

      const mutationResponse: MutationResponseDto = {
        success: true,
        message: 'Saga step status changed successfully',
        id: sagaStepId,
      };

      mockCommandBus.execute.mockResolvedValue(undefined);
      mockMutationResponseGraphQLMapper.toResponseDto.mockReturnValue(
        mutationResponse,
      );

      const result = await resolver.sagaStepChangeStatus(input);

      expect(result).toBe(mutationResponse);
      expect(mockCommandBus.execute).toHaveBeenCalledWith(
        expect.any(SagaStepChangeStatusCommand),
      );
      const command = (mockCommandBus.execute as jest.Mock).mock.calls[0][0];
      expect(command).toBeInstanceOf(SagaStepChangeStatusCommand);
      expect(command.id.value).toBe(sagaStepId);
      expect(command.status.value).toBe(input.status);
      expect(
        mockMutationResponseGraphQLMapper.toResponseDto,
      ).toHaveBeenCalledWith({
        success: true,
        message: 'Saga step status changed successfully',
        id: sagaStepId,
      });
    });

    it('should handle different status values', async () => {
      const sagaStepId = '123e4567-e89b-12d3-a456-426614174000';
      const statuses = [
        SagaStepStatusEnum.PENDING,
        SagaStepStatusEnum.STARTED,
        SagaStepStatusEnum.RUNNING,
        SagaStepStatusEnum.COMPLETED,
        SagaStepStatusEnum.FAILED,
      ];

      for (const status of statuses) {
        const input: SagaStepChangeStatusRequestDto = {
          id: sagaStepId,
          status: status,
        };

        mockCommandBus.execute.mockResolvedValue(undefined);
        mockMutationResponseGraphQLMapper.toResponseDto.mockReturnValue({
          success: true,
          message: 'Saga step status changed successfully',
          id: sagaStepId,
        });

        await resolver.sagaStepChangeStatus(input);

        const command = (mockCommandBus.execute as jest.Mock).mock.calls[
          mockCommandBus.execute.mock.calls.length - 1
        ][0];
        expect(command.status.value).toBe(status);
      }
    });
  });

  describe('sagaStepDelete', () => {
    it('should delete saga step successfully', async () => {
      const sagaStepId = '123e4567-e89b-12d3-a456-426614174000';
      const input: SagaStepDeleteRequestDto = {
        id: sagaStepId,
      };

      const mutationResponse: MutationResponseDto = {
        success: true,
        message: 'Saga step deleted successfully',
        id: sagaStepId,
      };

      mockCommandBus.execute.mockResolvedValue(undefined);
      mockMutationResponseGraphQLMapper.toResponseDto.mockReturnValue(
        mutationResponse,
      );

      const result = await resolver.sagaStepDelete(input);

      expect(result).toBe(mutationResponse);
      expect(mockCommandBus.execute).toHaveBeenCalledWith(
        expect.any(SagaStepDeleteCommand),
      );
      const command = (mockCommandBus.execute as jest.Mock).mock.calls[0][0];
      expect(command).toBeInstanceOf(SagaStepDeleteCommand);
      expect(command.id.value).toBe(sagaStepId);
      expect(
        mockMutationResponseGraphQLMapper.toResponseDto,
      ).toHaveBeenCalledWith({
        success: true,
        message: 'Saga step deleted successfully',
        id: sagaStepId,
      });
    });
  });
});
